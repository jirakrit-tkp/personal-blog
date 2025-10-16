-- ============================================
-- NOTIFICATIONS TABLE + TRIGGERS
-- ============================================

-- 1. สร้างตาราง notifications
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- ประเภทการแจ้งเตือน
  type VARCHAR(50) NOT NULL, -- 'new_blog', 'comment_reply', 'like', 'rate', 'comment'
  
  -- ข้อมูลที่เกี่ยวข้อง
  blog_id INTEGER REFERENCES posts(id) ON DELETE CASCADE,
  blog_title VARCHAR(255),
  
  -- ข้อมูลผู้กระทำ
  actor_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  actor_name VARCHAR(255),
  
  -- ข้อมูลเพิ่มเติม
  comment_content TEXT, -- สำหรับ comment
  rating INTEGER, -- สำหรับ rate (0-10)
  
  -- สถานะ
  read BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW()
);

-- สร้าง Index เพื่อให้ query เร็วขึ้น
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_read ON notifications(read);
CREATE INDEX idx_notifications_created_at ON notifications(created_at DESC);

-- เปิด Row Level Security (RLS)
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Policy: User เห็นแค่ notifications ของตัวเอง
CREATE POLICY "Users can view their own notifications"
ON notifications FOR SELECT
USING (auth.uid() = user_id);

-- Policy: User แก้ไขแค่ notifications ของตัวเอง
CREATE POLICY "Users can update their own notifications"
ON notifications FOR UPDATE
USING (auth.uid() = user_id);

-- Policy: User ลบแค่ notifications ของตัวเอง
CREATE POLICY "Users can delete their own notifications"
ON notifications FOR DELETE
USING (auth.uid() = user_id);

-- ============================================
-- เปิด Realtime (สำคัญมาก!)
-- ============================================
ALTER PUBLICATION supabase_realtime ADD TABLE notifications;

-- ============================================
-- TRIGGER FUNCTIONS
-- ============================================

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

-- ============================================
-- CREATE TRIGGERS
-- ============================================

-- Trigger: เมื่อมี comment ใหม่ → แจ้งเตือน author
CREATE TRIGGER trigger_notify_on_comment
AFTER INSERT ON comments
FOR EACH ROW
EXECUTE FUNCTION notify_on_comment();

-- Trigger: เมื่อมี like ใหม่ → แจ้งเตือน author
CREATE TRIGGER trigger_notify_on_like
AFTER INSERT ON likes
FOR EACH ROW
EXECUTE FUNCTION notify_on_like();

-- Trigger: เมื่อมี rate ใหม่ → แจ้งเตือน author
CREATE TRIGGER trigger_notify_on_rate
AFTER INSERT ON post_ratings
FOR EACH ROW
EXECUTE FUNCTION notify_on_rate();

-- Trigger: เมื่อมี comment ใหม่ → แจ้งเตือนคนที่เคย comment
CREATE TRIGGER trigger_notify_comment_reply
AFTER INSERT ON comments
FOR EACH ROW
EXECUTE FUNCTION notify_comment_reply();

-- ============================================
-- วิธีแจ้งเตือน Admin สร้าง Blog ใหม่
-- ============================================
-- สำหรับกรณีนี้ ยังต้องเขียนโค้ดใน Backend เพราะต้องแจ้ง member ทั้งหมด
-- (ไม่สามารถทำด้วย Trigger ได้ง่าย)

-- ตัวอย่างการใช้ใน Backend:
/*
// เมื่อ Admin สร้าง blog สำเร็จ
const { data: members } = await supabase
  .from('users')
  .select('id, name')
  .eq('role', 'member');

for (const member of members) {
  await supabase
    .from('notifications')
    .insert({
      user_id: member.id,
      type: 'new_blog',
      blog_id: newBlogId,
      blog_title: newBlogTitle,
      actor_id: adminId,
      actor_name: adminName
    });
}
*/

-- ============================================
-- ตัวอย่างการใช้งาน
-- ============================================

-- 1. มีคน comment blog → Trigger สร้าง notification อัตโนมัติ!
INSERT INTO comments (post_id, user_id, comment_text) 
VALUES (1, 'user-uuid', 'Great article!');

-- 2. มีคน like blog → Trigger สร้าง notification อัตโนมัติ!
INSERT INTO likes (post_id, user_id) 
VALUES (1, 'user-uuid');

-- 3. มีคน rate blog → Trigger สร้าง notification อัตโนมัติ!
INSERT INTO post_ratings (post_id, user_id, rating) 
VALUES (1, 'user-uuid', 8.5);

-- ============================================
-- Query ตัวอย่าง
-- ============================================

-- ดึง notifications ของ user
SELECT * FROM notifications 
WHERE user_id = 'user-id' 
ORDER BY created_at DESC 
LIMIT 20;

-- นับจำนวนที่ยังไม่อ่าน
SELECT COUNT(*) FROM notifications 
WHERE user_id = 'user-id' AND read = false;

-- Mark as read
UPDATE notifications 
SET read = true 
WHERE id = 'notification-id' AND user_id = 'user-id';

-- Mark all as read
UPDATE notifications 
SET read = true 
WHERE user_id = 'user-id' AND read = false;

-- ลบ notification
DELETE FROM notifications 
WHERE id = 'notification-id' AND user_id = 'user-id';

-- ลบ notifications เก่าที่อ่านแล้ว (มากกว่า 30 วัน)
DELETE FROM notifications 
WHERE user_id = 'user-id' 
AND read = true 
AND created_at < NOW() - INTERVAL '30 days';

