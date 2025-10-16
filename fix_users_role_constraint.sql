-- ============================================
-- FIX USERS ROLE CONSTRAINT
-- ============================================

-- ลบ check constraint เดิม
ALTER TABLE users 
DROP CONSTRAINT IF EXISTS users_role_check;

-- สร้าง check constraint ใหม่ที่รองรับ 'member'
ALTER TABLE users 
ADD CONSTRAINT users_role_check 
CHECK (role IN ('user', 'admin', 'member'));

-- หรือถ้าต้องการแค่ 'admin' และ 'member' (ไม่ต้องมี 'user')
-- ALTER TABLE users 
-- ADD CONSTRAINT users_role_check 
-- CHECK (role IN ('admin', 'member'));

-- เปลี่ยน role จาก 'user' เป็น 'member'
UPDATE users 
SET role = 'member' 
WHERE role = 'user';

-- ตรวจสอบผลลัพธ์
SELECT id, username, name, role FROM users;

