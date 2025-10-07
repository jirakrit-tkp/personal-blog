import express from "express";
import supabase from "../utils/db.mjs";
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
    const { error } = await supabase.from('posts').insert({
      title: newPost.title,
      image: newPost.image,
      category_id: newPost.category_id,
      description: newPost.description,
      content: newPost.content,
      status_id: newPost.status_id,
      date: newPost.date,
      likes_count: newPost.likes
    });
    if (error) throw error;
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
    // Get post with genres
    const { data: post, error } = await supabase
      .from('posts')
      .select(`
        *,
        post_genres!inner(
          genres(
            id,
            name
          )
        )
      `)
      .eq('id', id)
      .single();
    
    if (error && error.code !== 'PGRST116') throw error;
    if (!post) {
      return res.status(404).json({
        success: false,
        error: "Server could not find a requested post"
      });
    }
    
    // Transform genres data
    const transformedPost = {
      ...post,
      genres: post.post_genres?.map(pg => pg.genres) || []
    };
    delete transformedPost.post_genres;
    
    return res.status(200).json({
      success: true,
      data: transformedPost
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
    // ตรวจสอบว่ามี post
    const { data: exists, error: findErr } = await supabase.from('posts').select('id').eq('id', id).single();
    if (findErr && findErr.code !== 'PGRST116') throw findErr;
    if (!exists) {
      return res.status(404).json({
        success: false,
        error: "Server could not find a requested post to update"
      });
    }
    
    const { data: updatedRows, error } = await supabase
      .from('posts')
      .update({ title, image, category_id, description, content, status_id, updated_at: new Date() })
      .eq('id', id)
      .select('*');
    if (error) throw error;
    
    return res.status(200).json({
      success: true,
      data: updatedRows && updatedRows[0],
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
    const { data: deletedRows, error } = await supabase
      .from('posts')
      .delete()
      .eq('id', id)
      .select('*');
    if (error) throw error;
    if (!deletedRows || deletedRows.length === 0) {
      return res.status(404).json({
        success: false,
        error: "Server could not find a requested post to delete"
      });
    }
    
    return res.status(200).json({
      success: true,
      data: deletedRows[0],
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
  
  try {
    // Build supabase query with genres
    const from = (pageNum - 1) * limitNum;
    const to = from + limitNum - 1;
    let query = supabase
      .from('posts')
      .select(`
        *,
        post_genres(
          genres(
            id,
            name
          )
        )
      `, { count: 'exact' })
      .order('date', { ascending: false })
      .range(from, to);

    if (keyword) query = query.or(`title.ilike.%${keyword}%,description.ilike.%${keyword}%,content.ilike.%${keyword}%`);

    const { data, count, error } = await query;
    if (error) throw error;

    // Transform posts data to include genres
    let transformedPosts = (data || []).map(post => ({
      ...post,
      genres: post.post_genres?.map(pg => pg.genres) || []
    })).map(({ post_genres, ...post }) => post);

    // Handle category filtering by genre name after transformation
    if (category && category !== 'Highlight') {
      transformedPosts = transformedPosts.filter(post => 
        post.genres.some(genre => genre && genre.name === category)
      );
    }

    const totalPosts = count || 0;
    const totalPages = Math.ceil(totalPosts / limitNum) || 1;

    return res.status(200).json({
      totalPosts,
      totalPages,
      currentPage: pageNum,
      limit: limitNum,
      posts: transformedPosts,
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
