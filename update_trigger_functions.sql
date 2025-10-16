-- ============================================
-- UPDATE TRIGGER FUNCTIONS WITH SECURITY DEFINER
-- ============================================
-- รัน SQL นี้เพื่ออัพเดท trigger functions ที่มีอยู่แล้ว

-- Function: สร้าง notification เมื่อมี comment ใหม่
CREATE OR REPLACE FUNCTION notify_on_comment()
RETURNS TRIGGER 
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_blog_title VARCHAR(255);
  v_actor_name VARCHAR(255);
  v_author_id UUID;
BEGIN
  -- ดึงข้อมูล blog title
  SELECT title INTO v_blog_title FROM posts WHERE id = NEW.post_id;
  
  -- ดึงข้อมูล actor name
  SELECT name INTO v_actor_name FROM users WHERE id = NEW.user_id;
  
  -- ดึงข้อมูล author ของ blog
  SELECT author_id INTO v_author_id FROM posts WHERE id = NEW.post_id;
  
  -- สร้าง notification สำหรับ author ของ blog (ถ้าไม่ใช่ตัวเอง)
  IF v_author_id IS NOT NULL AND v_author_id != NEW.user_id THEN
    INSERT INTO notifications (
      user_id, type, blog_id, blog_title, 
      actor_id, actor_name, comment_content
    ) VALUES (
      v_author_id,
      'comment',
      NEW.post_id,
      v_blog_title,
      NEW.user_id,
      v_actor_name,
      NEW.comment_text
    );
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function: สร้าง notification เมื่อมี like ใหม่
CREATE OR REPLACE FUNCTION notify_on_like()
RETURNS TRIGGER 
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_blog_title VARCHAR(255);
  v_actor_name VARCHAR(255);
  v_author_id UUID;
BEGIN
  -- ดึงข้อมูล blog title
  SELECT title INTO v_blog_title FROM posts WHERE id = NEW.post_id;
  
  -- ดึงข้อมูล actor name
  SELECT name INTO v_actor_name FROM users WHERE id = NEW.user_id;
  
  -- ดึงข้อมูล author ของ blog
  SELECT author_id INTO v_author_id FROM posts WHERE id = NEW.post_id;
  
  -- สร้าง notification สำหรับ author ของ blog (ถ้าไม่ใช่ตัวเอง)
  IF v_author_id IS NOT NULL AND v_author_id != NEW.user_id THEN
    INSERT INTO notifications (
      user_id, type, blog_id, blog_title, 
      actor_id, actor_name
    ) VALUES (
      v_author_id,
      'like',
      NEW.post_id,
      v_blog_title,
      NEW.user_id,
      v_actor_name
    );
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function: สร้าง notification เมื่อมี rate ใหม่
CREATE OR REPLACE FUNCTION notify_on_rate()
RETURNS TRIGGER 
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_blog_title VARCHAR(255);
  v_actor_name VARCHAR(255);
  v_author_id UUID;
BEGIN
  -- ดึงข้อมูล blog title
  SELECT title INTO v_blog_title FROM posts WHERE id = NEW.post_id;
  
  -- ดึงข้อมูล actor name
  SELECT name INTO v_actor_name FROM users WHERE id = NEW.user_id;
  
  -- ดึงข้อมูล author ของ blog
  SELECT author_id INTO v_author_id FROM posts WHERE id = NEW.post_id;
  
  -- สร้าง notification สำหรับ author ของ blog (ถ้าไม่ใช่ตัวเอง)
  IF v_author_id IS NOT NULL AND v_author_id != NEW.user_id THEN
    INSERT INTO notifications (
      user_id, type, blog_id, blog_title, 
      actor_id, actor_name, rating
    ) VALUES (
      v_author_id,
      'rate',
      NEW.post_id,
      v_blog_title,
      NEW.user_id,
      v_actor_name,
      NEW.rating::integer
    );
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function: สร้าง notification สำหรับคนที่เคย comment ใน blog เดียวกัน
CREATE OR REPLACE FUNCTION notify_comment_reply()
RETURNS TRIGGER 
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_blog_title VARCHAR(255);
  v_actor_name VARCHAR(255);
  v_previous_commenter RECORD;
BEGIN
  -- ดึงข้อมูล blog title
  SELECT title INTO v_blog_title FROM posts WHERE id = NEW.post_id;
  
  -- ดึงข้อมูล actor name
  SELECT name INTO v_actor_name FROM users WHERE id = NEW.user_id;
  
  -- หาคนที่เคย comment ใน blog นี้ (แต่ไม่ใช่คนที่ comment ตอนนี้)
  FOR v_previous_commenter IN 
    SELECT DISTINCT user_id 
    FROM comments 
    WHERE post_id = NEW.post_id 
    AND user_id != NEW.user_id
  LOOP
    -- สร้าง notification สำหรับคนที่เคย comment
    INSERT INTO notifications (
      user_id, type, blog_id, blog_title, 
      actor_id, actor_name, comment_content
    ) VALUES (
      v_previous_commenter.user_id,
      'comment_reply',
      NEW.post_id,
      v_blog_title,
      NEW.user_id,
      v_actor_name,
      NEW.comment_text
    );
  END LOOP;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

