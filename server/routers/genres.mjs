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

export default router;
