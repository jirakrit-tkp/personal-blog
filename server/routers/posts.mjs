import express from "express";
import connectionPool from "../utils/db.mjs";
import { validateCreatePostData, validateUpdatePostData, validatePostId } from "../middlewares/post.validation.mjs";

const router = express.Router();

// POST create new post
router.post("/", [validateCreatePostData], async (req, res) => {
  const { title, image, category_id, description, content, status_id } = req.body;
  
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
  } catch (error) {
    console.error("Database error:", error);
    return res.status(500).json({
      success: false,
      error: "Server could not create post because database connection failed",
      message: error.message
    });
  }
  return res.status(201).json({
    success: true,
    message: "Created post successfully",
    data: newPost
  });
});

// GET single post by ID
router.get("/:id", [validatePostId], async (req, res) => {
  const { id } = req.params;
  
  try {
    const post = await connectionPool.query("SELECT * FROM posts WHERE id = $1", [id]);
    
    if (!post.rows || post.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: "Server could not find a requested post"
      });
    }
    
    return res.status(200).json({
      success: true,
      data: post.rows[0]
    });
  } catch (error) {
    console.error("Database error:", error);
    
    return res.status(500).json({
      success: false,
      error: "Server could not read post because database connection",
      message: error.message
    });
  }
});

// PUT update post
router.put("/:id", [validatePostId, validateUpdatePostData], async (req, res) => {
  const { id } = req.params;
  const { title, image, category_id, description, content, status_id } = req.body;
  
  try {
    // ตรวจสอบว่า post มีอยู่จริงหรือไม่ก่อนทำ UPDATE
    const existingPost = await connectionPool.query(
      "SELECT id FROM posts WHERE id = $1",
      [id]
    );
    
    if (!existingPost.rows || existingPost.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: "Server could not find a requested post to update"
      });
    }
    
    const updatedPost = await connectionPool.query(
      "UPDATE posts SET title = $1, image = $2, category_id = $3, description = $4, content = $5, status_id = $6, updated_at = NOW() WHERE id = $7 RETURNING *",
      [title, image, category_id, description, content, status_id, id]
    );
    
    return res.status(200).json({
      success: true,
      data: updatedPost.rows[0],
      message: "Updated post successfully"
    });
  } catch (error) {
    console.error("Database error:", error);
    
    return res.status(500).json({
      success: false,
      error: "Server could not update post because database connection",
      message: error.message
    });
  }
});

// DELETE post
router.delete("/:id", [validatePostId], async (req, res) => {
  const { id } = req.params;
  
  try {
    const deletedPost = await connectionPool.query(
      "DELETE FROM posts WHERE id = $1 RETURNING *",
      [id]
    );
    
    if (!deletedPost.rows || deletedPost.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: "Server could not find a requested post to delete"
      });
    }
    
    return res.status(200).json({
      success: true,
      data: deletedPost.rows[0],
      message: "Deleted post successfully"
    });
  } catch (error) {
    console.error("Database error:", error);
    
    return res.status(500).json({
      success: false,
      error: "Server could not delete post because database connection",
      message: error.message
    });
  }
});

// GET all posts with query parameters
router.get("/", async (req, res) => {
  const { page = 1, limit = 6, category, keyword } = req.query;
  
  // Validate parameters
  const pageNum = parseInt(page);
  const limitNum = parseInt(limit);
  
  if (pageNum < 1 || limitNum < 1) {
    return res.status(400).json({
      success: false,
      error: "Invalid page or limit parameter"
    });
  }
  
  // Build WHERE clause
  let whereConditions = [];
  let queryParams = [];
  let paramIndex = 1;
  
  // Category filter
  if (category) {
    whereConditions.push(`category_id = $${paramIndex}`);
    queryParams.push(category);
    paramIndex++;
  }
  
  // Keyword search
  if (keyword) {
    whereConditions.push(`(title ILIKE $${paramIndex} OR description ILIKE $${paramIndex} OR content ILIKE $${paramIndex})`);
    queryParams.push(`%${keyword}%`);
    paramIndex++;
  }
  
  const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : '';
  
  try {
    // Count total posts
    const countQuery = `SELECT COUNT(*) FROM posts ${whereClause}`;
    const countResult = await connectionPool.query(countQuery, queryParams);
    const totalPosts = parseInt(countResult.rows[0].count);
    
    // Calculate pagination
    const offset = (pageNum - 1) * limitNum;
    const totalPages = Math.ceil(totalPosts / limitNum);
    
    // Get posts with pagination
    const postsQuery = `
      SELECT * FROM posts 
      ${whereClause} 
      ORDER BY date DESC 
      LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
    `;
    queryParams.push(limitNum, offset);
    
    const posts = await connectionPool.query(postsQuery, queryParams);
    
    return res.status(200).json({
      totalPosts: totalPosts,
      totalPages: totalPages,
      currentPage: pageNum,
      limit: limitNum,
      posts: posts.rows,
      nextPage: pageNum < totalPages ? pageNum + 1 : null
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

export default router;
