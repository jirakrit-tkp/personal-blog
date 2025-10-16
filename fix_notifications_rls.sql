-- ============================================
-- FIX NOTIFICATIONS RLS POLICY
-- ============================================

-- ลบ policy เดิม (User policies)
DROP POLICY IF EXISTS "Users can view their own notifications" ON notifications;
DROP POLICY IF EXISTS "Users can update their own notifications" ON notifications;
DROP POLICY IF EXISTS "Users can delete their own notifications" ON notifications;

-- ลบ policy เดิม (Service role policies)
DROP POLICY IF EXISTS "Service role can insert notifications" ON notifications;
DROP POLICY IF EXISTS "Service role can update notifications" ON notifications;
DROP POLICY IF EXISTS "Service role can delete notifications" ON notifications;
DROP POLICY IF EXISTS "Service role can select notifications" ON notifications;

-- สร้าง policy ใหม่ที่อนุญาตให้ Backend สร้าง notification ได้

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

-- Policy: อนุญาตให้ service role (Backend) สร้าง notification ได้
-- ใช้ auth.role() = 'service_role' เพื่อตรวจสอบว่าเป็น Backend
CREATE POLICY "Service role can insert notifications"
ON notifications FOR INSERT
WITH CHECK (auth.role() = 'service_role');

-- Policy: อนุญาตให้ service role (Backend) อัพเดท notification ได้
CREATE POLICY "Service role can update notifications"
ON notifications FOR UPDATE
USING (auth.role() = 'service_role');

-- Policy: อนุญาตให้ service role (Backend) ลบ notification ได้
CREATE POLICY "Service role can delete notifications"
ON notifications FOR DELETE
USING (auth.role() = 'service_role');

-- Policy: อนุญาตให้ service role (Backend) อ่าน notification ได้
CREATE POLICY "Service role can select notifications"
ON notifications FOR SELECT
USING (auth.role() = 'service_role');

