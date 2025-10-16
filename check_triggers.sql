-- ============================================
-- CHECK TRIGGERS AND FUNCTIONS
-- ============================================

-- ตรวจสอบว่า trigger functions มีอยู่หรือไม่
SELECT 
  proname as function_name,
  prosecdef as security_definer
FROM pg_proc
WHERE proname IN ('notify_on_comment', 'notify_on_like', 'notify_on_rate', 'notify_comment_reply');

-- ตรวจสอบว่า triggers มีอยู่หรือไม่
SELECT 
  tgname as trigger_name,
  tgrelid::regclass as table_name,
  proname as function_name
FROM pg_trigger t
JOIN pg_proc p ON t.tgfoid = p.oid
WHERE tgname IN ('trigger_notify_on_comment', 'trigger_notify_on_like', 'trigger_notify_on_rate', 'trigger_notify_comment_reply');

-- ตรวจสอบว่า Realtime เปิดแล้วหรือไม่
SELECT tablename, schemaname
FROM pg_publication_tables
WHERE pubname = 'supabase_realtime'
AND tablename = 'notifications';

