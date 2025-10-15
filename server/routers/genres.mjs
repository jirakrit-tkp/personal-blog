import express from "express";
import supabase from "../utils/db.mjs";

const router = express.Router();

// GET all genres
router.get("/", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('genres')
      .select('*')
      .order('name', { ascending: true });

    if (error) throw error;

    return res.status(200).json({
      success: true,
      data: data || []
    });
  } catch (error) {
    console.error("Database error:", error);
    return res.status(500).json({
      success: false,
      error: "Failed to fetch genres",
      message: error.message
    });
  }
});

// POST create new genre
router.post("/", async (req, res) => {
  try {
    const { name, description, color } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        error: "Genre name is required"
      });
    }

    const { data, error } = await supabase
      .from('genres')
      .insert([{
        name: name.trim(),
        description: description?.trim() || null,
        color: color || 'green'
      }])
      .select()
      .single();

    if (error) throw error;

    return res.status(201).json({
      success: true,
      data: data
    });
  } catch (error) {
    console.error("Database error:", error);
    return res.status(500).json({
      success: false,
      error: "Failed to create genre",
      message: error.message
    });
  }
});

// PUT update genre
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, color } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        error: "Genre name is required"
      });
    }

    const { data, error } = await supabase
      .from('genres')
      .update({
        name: name.trim(),
        description: description?.trim() || null,
        color: color || 'green'
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    if (!data) {
      return res.status(404).json({
        success: false,
        error: "Genre not found"
      });
    }

    return res.status(200).json({
      success: true,
      data: data
    });
  } catch (error) {
    console.error("Database error:", error);
    return res.status(500).json({
      success: false,
      error: "Failed to update genre",
      message: error.message
    });
  }
});

// DELETE genre
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const { error } = await supabase
      .from('genres')
      .delete()
      .eq('id', id);

    if (error) throw error;

    return res.status(200).json({
      success: true,
      message: "Genre deleted successfully"
    });
  } catch (error) {
    console.error("Database error:", error);
    return res.status(500).json({
      success: false,
      error: "Failed to delete genre",
      message: error.message
    });
  }
});

export default router;
