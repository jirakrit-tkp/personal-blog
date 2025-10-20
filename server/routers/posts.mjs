import express from "express";
import supabase from "../utils/db.mjs";
import { validateCreatePostData, validateUpdatePostData, validatePostId } from "../middlewares/post.validation.mjs";

const router = express.Router();

// POST create new post
router.post("/", [validateCreatePostData], async (req, res) => {
  const { title, image, genre_ids, description, content, status_id, author_id } = req.body;
  
  try {
    // Build post object with only provided fields
    const postData = {
      title: title.trim(),
      status_id: parseInt(status_id),
      author_id: author_id,
      created_at: new Date(),
      updated_at: new Date(),
      likes_count: 0
    };
    
    // Add optional fields only if provided (for draft support)
    if (image) postData.image = image.trim();
    if (description) postData.description = description.trim();
    if (content) postData.content = content.trim();
    
    // Insert post first
    const { data: newPost, error: postError } = await supabase
      .from('posts')
      .insert(postData)
      .select('id')
      .single();

    if (postError) throw postError;

    // Insert post_genres relationships (only if genres provided)
    if (genre_ids && genre_ids.length > 0) {
      const postGenres = genre_ids.map(genre_id => ({
        post_id: newPost.id,
        genre_id: parseInt(genre_id),
        created_at: new Date()
      }));

      const { error: genreError } = await supabase
        .from('post_genres')
        .insert(postGenres);

      if (genreError) throw genreError;
    }

    // Notifications จะถูกสร้างอัตโนมัติผ่าน Database Trigger (notify_on_new_blog)
    // ไม่ต้องสร้างใน Backend code อีกต่อไป

    return res.status(201).json({
      success: true,
      message: "Created post successfully",
      data: { id: newPost.id, title: title.trim() }
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

// GET single post by ID
router.get("/:id", [validatePostId], async (req, res) => {
  const { id } = req.params;
  
  try {
    // Get post with genres and author (LEFT JOIN for genres to support drafts without genres)
    const { data: post, error } = await supabase
      .from('posts')
      .select(`
        *,
        statuses(
          id,
          status
        ),
        users:author_id(
          id,
          name,
          profile_pic
        ),
        post_genres(
          genres(
            id,
            name,
            color
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
    
    // Transform genres data (handle empty genres for drafts)
    const transformedPost = {
      ...post,
      status: post.statuses?.status || 'Draft',
      genres: post.post_genres?.map(pg => pg.genres).filter(Boolean) || [],
      author: post.users ? { id: post.users.id, name: post.users.name, profile_pic: post.users.profile_pic } : null
    };
    delete transformedPost.post_genres;
    delete transformedPost.statuses;
    delete transformedPost.users;
    
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
  const { title, image, genre_ids, description, content, status_id } = req.body;
  
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
    
    // Build update object with only provided fields
    const updateData = { updated_at: new Date() };
    if (title !== undefined) updateData.title = title;
    if (image !== undefined) updateData.image = image;
    if (description !== undefined) updateData.description = description;
    if (content !== undefined) updateData.content = content;
    if (status_id !== undefined) updateData.status_id = status_id;
    
    // Update post
    const { data: updatedRows, error } = await supabase
      .from('posts')
      .update(updateData)
      .eq('id', id)
      .select('*');
    if (error) throw error;
    
    // Update genres if provided
    if (genre_ids !== undefined) {
      // Delete existing genres
      await supabase.from('post_genres').delete().eq('post_id', id);
      
      // Insert new genres
      if (genre_ids.length > 0) {
        const postGenres = genre_ids.map(genre_id => ({
          post_id: id,
          genre_id: parseInt(genre_id),
          created_at: new Date()
        }));
        
        const { error: genreError } = await supabase
          .from('post_genres')
          .insert(postGenres);
        
        if (genreError) throw genreError;
      }
    }
    
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

// GET all posts for admin (includes drafts)
router.get("/admin/all", async (req, res) => {
  const { page = 1, limit = 50 } = req.query;
  
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
    // Build supabase query with genres - NO status filter for admin
    const from = (pageNum - 1) * limitNum;
    const to = from + limitNum - 1;
    let query = supabase
      .from('posts')
      .select(`
        *,
        statuses(
          id,
          status
        ),
        users:author_id(
          id,
          name,
          profile_pic
        ),
        post_genres(
          genres(
            id,
            name,
            color
          )
        )
      `, { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(from, to);

    const { data, count, error } = await query;
    if (error) throw error;

    // Transform posts data to include genres
    const transformedPosts = (data || []).map(post => ({
      ...post,
      status: post.statuses?.status || 'Draft',
      genres: post.post_genres?.map(pg => pg.genres) || [],
      author: post.users ? { id: post.users.id, name: post.users.name, profile_pic: post.users.profile_pic } : null
    })).map(({ post_genres, statuses, users, ...post }) => post);

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

// GET all posts with query parameters (only published posts)
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
        statuses(
          id,
          status
        ),
        users:author_id(
          id,
          name,
          profile_pic
        ),
        post_genres(
          genres(
            id,
            name,
            color
          )
        )
      `, { count: 'exact' })
      .eq('status_id', 2) // Only published posts
      .order('created_at', { ascending: false })
      .range(from, to);

    if (keyword) query = query.or(`title.ilike.%${keyword}%,description.ilike.%${keyword}%,content.ilike.%${keyword}%`);

    const { data, count, error } = await query;
    if (error) throw error;

    // Transform posts data to include genres
    let transformedPosts = (data || []).map(post => ({
      ...post,
      status: post.statuses?.status || 'Draft',
      genres: post.post_genres?.map(pg => pg.genres) || [],
      author: post.users ? { id: post.users.id, name: post.users.name, profile_pic: post.users.profile_pic } : null
    })).map(({ post_genres, statuses, users, ...post }) => post);

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

// POST create rating for a post
router.post("/:postId/ratings", async (req, res) => {
  const { postId } = req.params;
  const { rating, user_id } = req.body;
  
  // DEBUG: Log postId type
  console.log('🔍 Rating submit - postId:', postId, 'type:', typeof postId);
  
  try {
    // Validate input
    if (!rating || !user_id) {
      return res.status(400).json({
        success: false,
        error: "Missing required fields: rating and user_id"
      });
    }
    
    if (rating < 0 || rating > 10) {
      return res.status(400).json({
        success: false,
        error: "Rating must be between 0 and 10"
      });
    }
    
    // Check if post exists
    const { data: post, error: postError } = await supabase
      .from('posts')
      .select('id')
      .eq('id', postId)
      .single();
    
    if (postError || !post) {
      return res.status(404).json({
        success: false,
        error: "Post not found"
      });
    }
    
    // Check if user exists
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('id')
      .eq('id', user_id)
      .single();
    
    if (userError || !user) {
      return res.status(404).json({
        success: false,
        error: "User not found"
      });
    }
    
    // UPSERT rating (trigger fixed, can use .upsert() now)
    const { data: ratingData, error: ratingError } = await supabase
      .from('post_ratings')
      .upsert({
        post_id: postId,
        user_id: user_id,
        rating: parseFloat(rating)
      }, {
        onConflict: 'post_id,user_id'
      })
      .select('*');
    
    if (ratingError) {
      console.error("❌ Rating upsert error:", ratingError);
      return res.status(500).json({
        success: false,
        error: "Failed to save rating",
        message: ratingError.message
      });
    }
    
    console.log('✅ Rating saved successfully:', ratingData);
    
    return res.status(201).json({
      success: true,
      message: "Rating saved successfully",
      data: ratingData[0]
    });
    
  } catch (error) {
    console.error("Rating error:", error);
    return res.status(500).json({
      success: false,
      error: "Server could not save rating",
      message: error.message
    });
  }
});

// POST like a post (record per-user like)
router.post("/:postId/likes", async (req, res) => {
  const { postId } = req.params;
  const { user_id } = req.body;

  try {
    if (!user_id) {
      return res.status(400).json({ success: false, error: "Missing required field: user_id" });
    }

    const { data: post, error: postError } = await supabase
      .from('posts')
      .select('id, likes_count')
      .eq('id', postId)
      .single();

    if (postError || !post) {
      return res.status(404).json({ success: false, error: "Post not found" });
    }

    // prevent duplicate
    const { data: existing, error: checkErr } = await supabase
      .from('post_likes')
      .select('id')
      .eq('post_id', postId)
      .eq('user_id', user_id)
      .maybeSingle();

    if (checkErr) {
      return res.status(500).json({ success: false, error: "Failed to check like" });
    }
    if (existing) {
      return res.status(400).json({ success: false, error: "Already liked" });
    }

    const { error: likeErr } = await supabase
      .from('post_likes')
      .insert({ post_id: postId, user_id, created_at: new Date() }); // UUID - no parseInt needed
    if (likeErr) throw likeErr;

    const nextCount = (post.likes_count || 0) + 1;
    const { error: updateError } = await supabase
      .from('posts')
      .update({ likes_count: nextCount, updated_at: new Date() })
      .eq('id', postId);
    if (updateError) throw updateError;

    return res.status(201).json({ success: true, likes_count: nextCount });
  } catch (error) {
    console.error("Like error:", error);
    return res.status(500).json({ success: false, error: "Server could not like post", message: error.message });
  }
});

// DELETE unlike a post (remove per-user like)
router.delete("/:postId/likes", async (req, res) => {
  const { postId } = req.params;
  const { user_id } = req.body;

  try {
    if (!user_id) {
      return res.status(400).json({ success: false, error: "Missing required field: user_id" });
    }

    const { data: post, error: postError } = await supabase
      .from('posts')
      .select('id, likes_count')
      .eq('id', postId)
      .single();

    if (postError || !post) {
      return res.status(404).json({ success: false, error: "Post not found" });
    }

    const { data: deleted, error: delErr } = await supabase
      .from('post_likes')
      .delete()
      .eq('post_id', postId)
      .eq('user_id', user_id)
      .select('id');
    if (delErr) throw delErr;
    if (!deleted || deleted.length === 0) {
      return res.status(404).json({ success: false, error: "Like not found" });
    }

    const nextCount = Math.max((post.likes_count || 0) - 1, 0);
    const { error: updateError } = await supabase
      .from('posts')
      .update({ likes_count: nextCount, updated_at: new Date() })
      .eq('id', postId);
    if (updateError) throw updateError;

    return res.status(200).json({ success: true, likes_count: nextCount });
  } catch (error) {
    console.error("Unlike error:", error);
    return res.status(500).json({ success: false, error: "Server could not unlike post", message: error.message });
  }
});

// GET check if user liked a post
router.get("/:postId/likes/check", async (req, res) => {
  const { postId } = req.params;
  const { user_id } = req.query;

  try {
    if (!user_id) {
      return res.status(400).json({ success: false, error: "Missing required field: user_id" });
    }

    const { data: like, error } = await supabase
      .from('post_likes')
      .select('id')
      .eq('post_id', postId)
      .eq('user_id', user_id)
      .maybeSingle();
    if (error) throw error;

    return res.status(200).json({ success: true, isLiked: !!like });
  } catch (error) {
    console.error("Check like error:", error);
    return res.status(500).json({ success: false, error: "Failed to check like status", message: error.message });
  }
});

export default router;
