import express from "express";
import supabase from "../utils/db.mjs";

const router = express.Router();

// Step 5: Register
router.post("/register", async (req, res) => {
  const { email, password, username, name } = req.body || {};

  if (!email || !password || !username || !name) {
    return res.status(400).json({ error: "email, password, username, name are required" });
  }

  try {
    // Check username is unique in users table
    const { data: existing, error: checkErr } = await supabase
      .from("users")
      .select("id")
      .eq("username", username)
      .limit(1);
    if (checkErr) throw checkErr;
    if (existing && existing.length > 0) {
      return res.status(400).json({ error: "This username is already taken" });
    }

    // Create auth user in Supabase
    const { data, error: supabaseError } = await supabase.auth.signUp({ email, password });
    if (supabaseError) {
      if (supabaseError.code === "user_already_exists") {
        return res.status(400).json({ error: "User with this email already exists" });
      }
      return res.status(400).json({ error: "Failed to create user. Please try again." });
    }

    const supabaseUserId = data && data.user && data.user.id;

    // Insert profile row
    const { data: inserted, error: insertErr } = await supabase
      .from("users")
      .insert({ id: supabaseUserId, username, name, role: "user" })
      .select("*")
      .limit(1);
    if (insertErr) throw insertErr;

    return res.status(201).json({ message: "User created successfully", user: inserted && inserted[0] });
  } catch (error) {
    return res.status(500).json({ error: "An error occurred during registration" });
  }
});

// Step 6: Login
router.post("/login", async (req, res) => {
  const { email, password } = req.body || {};

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  try {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      if (error.code === "invalid_credentials" || (error.message || "").includes("Invalid login credentials")) {
        return res.status(400).json({ error: "Your password is incorrect or this email doesn't exist" });
      }
      return res.status(400).json({ error: error.message });
    }

    return res.status(200).json({ message: "Signed in successfully", access_token: data.session && data.session.access_token });
  } catch (error) {
    return res.status(500).json({ error: "An error occurred during login" });
  }
});

// Step 7: Get current user with profile
router.get("/get-user", async (req, res) => {
  const tokenHeader = req.headers && (req.headers.authorization || req.headers.Authorization);
  const token = tokenHeader && tokenHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Unauthorized: Token missing" });
  }

  try {
    const { data, error } = await supabase.auth.getUser(token);
    if (error) return res.status(401).json({ error: "Unauthorized or token expired" });

    const supabaseUserId = data.user.id;
    const { data: rows, error: dbErr } = await supabase
      .from("users")
      .select("username,name,role,profile_pic,bio")
      .eq("id", supabaseUserId)
      .limit(1);
    if (dbErr) throw dbErr;

    const profile = rows && rows[0];
    return res.status(200).json({
      id: data.user.id,
      email: data.user.email,
      username: profile && profile.username,
      name: profile && profile.name,
      role: profile && profile.role,
      profilePic: profile && profile.profile_pic,
      bio: profile && profile.bio
    });
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
});

// Step 10: Reset password
router.put("/reset-password", async (req, res) => {
  const tokenHeader = req.headers && (req.headers.authorization || req.headers.Authorization);
  const token = tokenHeader && tokenHeader.split(" ")[1];
  const { oldPassword, newPassword } = req.body || {};

  if (!token) {
    return res.status(401).json({ error: "Unauthorized: Token missing" });
  }
  if (!newPassword) {
    return res.status(400).json({ error: "New password is required" });
  }

  try {
    const { data: userData, error: userError } = await supabase.auth.getUser(token);
    if (userError) return res.status(401).json({ error: "Unauthorized: Invalid token" });

    const { error: loginError } = await supabase.auth.signInWithPassword({
      email: userData.user.email,
      password: oldPassword
    });
    if (loginError) return res.status(400).json({ error: "Invalid old password" });

    const { data, error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) return res.status(400).json({ error: error.message });

    return res.status(200).json({ message: "Password updated successfully", user: data.user });
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
});

// Existing simple helpers (kept for compatibility)
router.post("/signup", async (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) return res.status(400).json({ success: false, error: "Email and password are required" });
  try {
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) throw error;
    return res.status(201).json({ success: true, data });
  } catch (error) {
    return res.status(400).json({ success: false, error: error.message });
  }
});

router.post("/signin", async (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) return res.status(400).json({ success: false, error: "Email and password are required" });
  try {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    return res.status(200).json({ success: true, data });
  } catch (error) {
    return res.status(401).json({ success: false, error: error.message });
  }
});

router.get("/me", async (req, res) => {
  const authHeader = req.headers["authorization"] || "";
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : undefined;
  if (!token) return res.status(401).json({ success: false, error: "Missing Bearer token" });
  try {
    const { data, error } = await supabase.auth.getUser(token);
    if (error) throw error;
    return res.status(200).json({ success: true, data });
  } catch (error) {
    return res.status(401).json({ success: false, error: error.message });
  }
});

export default router;


