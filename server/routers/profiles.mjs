import express from "express";
import supabase from "../utils/db.mjs";
import multer from "multer";
import path from "path";
import { createClient } from "@supabase/supabase-js";

// Supabase client for storage - use SERVICE ROLE key to bypass RLS on server
const supabaseStorage = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const router = express.Router();

// Setup Multer for file uploads
const multerUpload = multer({ storage: multer.memoryStorage() });
const profilePictureUpload = multerUpload.single("profilePicture");

// GET profile by ID
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  
  try {
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !user) {
      return res.status(404).json({
        success: false,
        error: "User not found"
      });
    }

    return res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: "Failed to fetch profile",
      message: error.message
    });
  }
});

// PUT update profile (with optional profile picture upload)
router.put("/:id", profilePictureUpload, async (req, res) => {
  const { id } = req.params;
  const { name, username, email, bio } = req.body;
  const file = req.file;

  try {
    // Check if user exists
    const { data: existingUser, error: findErr } = await supabase
      .from('users')
      .select('id, profile_pic')
      .eq('id', id)
      .single();

    if (findErr || !existingUser) {
      return res.status(404).json({
        success: false,
        error: "User not found"
      });
    }

    let profilePicUrl = existingUser.profile_pic;

    // If new profile picture is uploaded
    if (file) {
      const bucketName = process.env.SUPABASE_STORAGE_BUCKET || "my-personal-blog";
      const filePath = `profile-pictures/${id}/${Date.now()}_${file.originalname}`;

      // Upload to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabaseStorage.storage
        .from(bucketName)
        .upload(filePath, file.buffer, {
          contentType: file.mimetype,
          upsert: false
        });

      if (uploadError) {
        console.error("Upload error:", uploadError);
        return res.status(500).json({
          success: false,
          error: "Failed to upload profile picture",
          message: uploadError.message
        });
      }

      // Get public URL
      const { data: urlData } = supabaseStorage.storage
        .from(bucketName)
        .getPublicUrl(uploadData.path);

      profilePicUrl = urlData.publicUrl;

      // Optional: Delete old profile picture if exists
      if (existingUser.profile_pic) {
        const oldPath = existingUser.profile_pic.split('/').slice(-2).join('/');
        await supabaseStorage.storage.from(bucketName).remove([oldPath]);
      }
    }

    // Update user profile
    const updateData = {};
    if (name) updateData.name = name;
    if (username) updateData.username = username;
    if (email) updateData.email = email;
    if (profilePicUrl) updateData.profile_pic = profilePicUrl;
    if (typeof bio === "string") updateData.bio = bio.slice(0, 500);

    const { data: updatedUser, error: updateErr } = await supabase
      .from('users')
      .update(updateData)
      .eq('id', id)
      .select('*')
      .single();

    if (updateErr) throw updateErr;

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: updatedUser
    });
  } catch (error) {
    console.error("Profile update error:", error);
    return res.status(500).json({
      success: false,
      error: "Failed to update profile",
      message: error.message
    });
  }
});

// POST upload image only
router.post("/upload-image", profilePictureUpload, async (req, res) => {
  const file = req.file;
  
  if (!file) {
    return res.status(400).json({
      success: false,
      error: "No image file provided"
    });
  }

  try {
    const bucketName = process.env.SUPABASE_STORAGE_BUCKET || "my-personal-blog";
    
    // Generate unique filename
    const fileExt = path.extname(file.originalname);
    const fileName = `${Date.now()}-${Math.round(Math.random() * 1E9)}${fileExt}`;
    const filePath = `articles/${fileName}`;

    // Upload to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabaseStorage.storage
      .from(bucketName)
      .upload(filePath, file.buffer, {
        contentType: file.mimetype,
        upsert: false
      });

    if (uploadError) {
      console.error("Supabase upload error:", uploadError);
      return res.status(500).json({
        success: false,
        error: "Failed to upload image to storage"
      });
    }

    // Get public URL
    const { data: urlData } = supabaseStorage.storage
      .from(bucketName)
      .getPublicUrl(filePath);

    return res.status(200).json({
      success: true,
      imageUrl: urlData.publicUrl,
      message: "Image uploaded successfully"
    });

  } catch (error) {
    console.error("Upload error:", error);
    return res.status(500).json({
      success: false,
      error: "Internal server error during upload"
    });
  }
});

export default router;
