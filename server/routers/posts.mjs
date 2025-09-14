import express from "express";
import connectionPool from "../utils/db.mjs";

const router = express.Router();

// GET all posts
router.get("/", async (req, res, next) => {
  try {  
    const posts = await connectionPool.query("SELECT * FROM posts ORDER BY date DESC");
    return res.status(200).json({
      success: true,
      data: posts.rows || posts,
      count: posts.rows?.length || posts.length
    });
  } catch (error) {
    console.error("Database error:", error);
    
    return res.status(500).json({
      success: false,
      error: "Server could not fetch posts because database connection failed",
      message: error.message
    });
  }
});

// GET single post by ID
router.get("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    
    // Validate ID
    if (!id || isNaN(id)) {
      return res.status(400).json({
        success: false,
        error: "Invalid post ID"
      });
    }
    
    const post = await connectionPool.query("SELECT * FROM posts WHERE id = $1", [id]);
    
    if (!post.rows || post.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: "Post not found"
      });
    }
    
    return res.status(200).json({
      success: true,
      data: post.rows[0]
    });
  } catch (error) {
    next(error);
  }
});

// POST create new post
router.post("/", async (req, res, next) => {
  const { title, image, category_id, description, content, status_id } = req.body;
  
  // Validate required fields
  const missingFields = [];
  
  if (!title || title.trim() === '') missingFields.push('title');
  if (!image || image.trim() === '') missingFields.push('image');
  if (!category_id) missingFields.push('category_id');
  if (!description || description.trim() === '') missingFields.push('description');
  if (!content || content.trim() === '') missingFields.push('content');
  if (!status_id) missingFields.push('status_id');
  
  // Return 400 error if any required fields are missing
  if (missingFields.length > 0) {
    return res.status(400).json({
      success: false,
      error: "Server could not create post because there are missing data from client",
      missingFields: missingFields,
      message: `Missing required fields: ${missingFields.join(', ')}`
    });
  }
  
  const newPost = {
    title: title.trim(),
    image: image.trim(), 
    category_id: parseInt(category_id),
    description: description.trim(), 
    content: content.trim(), 
    status_id: parseInt(status_id), 
    date: new Date(), 
    likes: 0
  };
  
  try {
    await connectionPool.query(`INSERT INTO posts (title, image, category_id, description, content, status_id, date, likes_count)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
      [
        newPost.title,
        newPost.image, 
        newPost.category_id, 
        newPost.description, 
        newPost.content, 
        newPost.status_id, 
        newPost.date, 
        newPost.likes
      ]);
    
    return res.status(201).json({
      success: true,
      message: "Created post successfully",
      data: newPost
    });
    
  } catch (error) {
    console.error("Database error:", error);
    return res.status(500).json({
      success: false,
      error: "Server could not create post because database connection failed",
      message: error.message
    });
  }
});

// PUT update post
router.put("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, content, author } = req.body;
    
    if (!id || isNaN(id)) {
      return res.status(400).json({
        success: false,
        error: "Invalid post ID"
      });
    }
    
    const updatedPost = await connectionPool.query(
      "UPDATE posts SET title = $1, content = $2, author = $3, updated_at = NOW() WHERE id = $4 RETURNING *",
      [title, content, author, id]
    );
    
    if (!updatedPost.rows || updatedPost.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: "Post not found"
      });
    }
    
    return res.status(200).json({
      success: true,
      data: updatedPost.rows[0],
      message: "Post updated successfully"
    });
  } catch (error) {
    next(error);
  }
});

// DELETE post
router.delete("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    
    if (!id || isNaN(id)) {
      return res.status(400).json({
        success: false,
        error: "Invalid post ID"
      });
    }
    
    const deletedPost = await connectionPool.query(
      "DELETE FROM posts WHERE id = $1 RETURNING *",
      [id]
    );
    
    if (!deletedPost.rows || deletedPost.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: "Post not found"
      });
    }
    
    return res.status(200).json({
      success: true,
      data: deletedPost.rows[0],
      message: "Post deleted successfully"
    });
  } catch (error) {
    next(error);
  }
});

export default router;
