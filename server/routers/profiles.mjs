import express from "express";

const router = express.Router();

// GET all profiles
router.get("/", (req, res) => {
  return res.status(200).json({
    success: true,
    data: {
      name: "john",
      age: 20,
      email: "john@example.com",
      bio: "Software Developer"
    }
  });
});

// GET profile by ID
router.get("/:id", (req, res) => {
  const { id } = req.params;
  
  if (!id || isNaN(id)) {
    return res.status(400).json({
      success: false,
      error: "Invalid profile ID"
    });
  }
  
  return res.status(200).json({
    success: true,
    data: {
      id: parseInt(id),
      name: "john",
      age: 20,
      email: "john@example.com",
      bio: "Software Developer"
    }
  });
});

export default router;
