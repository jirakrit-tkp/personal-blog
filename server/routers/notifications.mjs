import express from "express";
import supabase from "../utils/db.mjs";
import protectUser from "../middlewares/protectUser.mjs";

const router = express.Router();

// ทุก route ต้อง authenticate ก่อน
router.use(protectUser);

// GET /notifications - ดึง notifications ของ user
router.get("/", async (req, res) => {
  try {
    const userId = req.user.id; // จาก middleware protectUser
    
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(50);
    
    if (error) throw error;
    
    res.json({ notifications: data });
  } catch (error) {
    console.error('❌ Backend: Notification fetch failed:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// GET /notifications/unread-count - นับจำนวนที่ยังไม่อ่าน
router.get("/unread-count", async (req, res) => {
  try {
    const userId = req.user.id;
    
    const { count, error } = await supabase
      .from('notifications')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .eq('read', false);
    
    if (error) throw error;
    
    res.json({ count });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT /notifications/:id/read - mark as read
router.put("/:id/read", async (req, res) => {
  try {
    const userId = req.user.id;
    const notificationId = req.params.id;
    
    const { error } = await supabase
      .from('notifications')
      .update({ read: true })
      .eq('id', notificationId)
      .eq('user_id', userId);
    
    if (error) throw error;
    
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT /notifications/mark-all-read - mark all as read
router.put("/mark-all-read", async (req, res) => {
  try {
    const userId = req.user.id;
    
    const { error } = await supabase
      .from('notifications')
      .update({ read: true })
      .eq('user_id', userId)
      .eq('read', false);
    
    if (error) throw error;
    
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE /notifications/:id - ลบ notification
router.delete("/:id", async (req, res) => {
  try {
    const userId = req.user.id;
    const notificationId = req.params.id;
    
    const { error } = await supabase
      .from('notifications')
      .delete()
      .eq('id', notificationId)
      .eq('user_id', userId);
    
    if (error) throw error;
    
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;

