# 🔔 Notification System Setup Guide

## 📋 สารบัญ
1. [สร้างตารางใน Supabase](#1-สร้างตารางใน-supabase)
2. [เปิด Supabase Realtime](#2-เปิด-supabase-realtime)
3. [Backend API Endpoints](#3-backend-api-endpoints)
4. [Frontend Components](#4-frontend-components)
5. [ตัวอย่างการใช้งาน](#5-ตัวอย่างการใช้งาน)

---

## 1. สร้างตารางใน Supabase

### วิธีที่ 1: ใช้ SQL Editor (แนะนำ)
1. เข้า Supabase Dashboard → **SQL Editor**
2. คัดลอกโค้ดจากไฟล์ `notifications_with_triggers.sql`
3. กด **Run** หรือ **Ctrl + Enter**

### วิธีที่ 2: ใช้ Table Editor
1. เข้า Supabase Dashboard → **Table Editor**
2. กด **New Table**
3. ตั้งชื่อ: `notifications`
4. เพิ่ม columns ตาม schema

### ⚡ **Trigger จะทำงานอัตโนมัติ!**
- เมื่อมีคน comment → สร้าง notification อัตโนมัติ
- เมื่อมีคน like → สร้าง notification อัตโนมัติ
- เมื่อมีคน rate → สร้าง notification อัตโนมัติ
- ไม่ต้องเขียนโค้ดเพิ่มใน Backend!

---

## 2. เปิด Supabase Realtime

### ⚠️ **สำคัญมาก!** ต้องเปิด Realtime สำหรับตาราง `notifications`

### วิธีเปิด:

#### วิธีที่ 1: ใช้ SQL Editor (แนะนำ)
```sql
-- เปิด Realtime สำหรับตาราง notifications
ALTER PUBLICATION supabase_realtime ADD TABLE notifications;
```

#### วิธีที่ 2: ใช้ Dashboard
1. เข้า Supabase Dashboard → **Database** → **Replication**
2. หา `notifications` table
3. กด **Enable Replication** หรือ toggle switch
4. บันทึก

### ✅ ตรวจสอบว่าเปิดแล้ว:
- ไปที่ **Database** → **Replication**
- ดูว่า `notifications` มี checkmark ✅ หรือ toggle เปิด

---

## 3. Backend API Endpoints

สร้างไฟล์ `server/routers/notifications.mjs`:

```javascript
import express from "express";
import supabase from "../utils/db.mjs";

const router = express.Router();

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

// POST /notifications/create - สร้าง notification (สำหรับ admin/system)
router.post("/create", async (req, res) => {
  try {
    const { user_id, type, blog_id, blog_title, actor_id, actor_name, comment_content, rating } = req.body;
    
    const { data, error } = await supabase
      .from('notifications')
      .insert({
        user_id,
        type,
        blog_id,
        blog_title,
        actor_id,
        actor_name,
        comment_content,
        rating,
        read: false
      })
      .select()
      .single();
    
    if (error) throw error;
    
    res.json({ success: true, notification: data });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
```

### เพิ่ม route ใน `server/routers/index.mjs`:
```javascript
import notificationsRouter from './notifications.mjs';

// ... existing code ...

app.use('/notifications', protectUser, notificationsRouter);
```

---

## 4. Frontend Components

### 4.1 สร้าง `client/src/hooks/useNotifications.js`:

```javascript
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import axios from 'axios';

const apiBase = import.meta.env.VITE_API_BASE_URL || "http://localhost:4001/api";

export const useNotifications = (userId) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);

  // ดึง notifications
  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${apiBase}/notifications`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setNotifications(response.data.notifications);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  // ดึง unread count
  const fetchUnreadCount = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${apiBase}/notifications/unread-count`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUnreadCount(response.data.count);
    } catch (error) {
      console.error('Error fetching unread count:', error);
    }
  };

  // Mark as read
  const markAsRead = async (notificationId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`${apiBase}/notifications/${notificationId}/read`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUnreadCount(prev => Math.max(0, prev - 1));
      setNotifications(prev => 
        prev.map(n => n.id === notificationId ? { ...n, read: true } : n)
      );
    } catch (error) {
      console.error('Error marking as read:', error);
    }
  };

  // Mark all as read
  const markAllAsRead = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`${apiBase}/notifications/mark-all-read`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUnreadCount(0);
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    } catch (error) {
      console.error('Error marking all as read:', error);
    }
  };

  // ลบ notification
  const deleteNotification = async (notificationId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${apiBase}/notifications/${notificationId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setNotifications(prev => prev.filter(n => n.id !== notificationId));
      // ถ้ายังไม่อ่าน ลด count
      const notification = notifications.find(n => n.id === notificationId);
      if (notification && !notification.read) {
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };

  // Setup Realtime listener
  useEffect(() => {
    if (!userId) return;

    // ดึงข้อมูลครั้งแรก
    fetchNotifications();
    fetchUnreadCount();

    // ฟังการเปลี่ยนแปลงแบบ real-time
    const channel = supabase
      .channel('notifications')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${userId}`
        },
        (payload) => {
          console.log('New notification:', payload.new);
          // เพิ่ม notification ใหม่
          setNotifications(prev => [payload.new, ...prev]);
          // เพิ่ม unread count
          setUnreadCount(prev => prev + 1);
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${userId}`
        },
        (payload) => {
          console.log('Updated notification:', payload.new);
          // อัพเดท notification
          setNotifications(prev => 
            prev.map(n => n.id === payload.new.id ? payload.new : n)
          );
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId]);

  return {
    notifications,
    unreadCount,
    loading,
    fetchNotifications,
    fetchUnreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification
  };
};
```

### 4.2 สร้าง `client/src/components/NotificationBell.jsx`:

```javascript
import React, { useState, useRef, useEffect } from 'react';
import { Bell } from 'lucide-react';
import { useNotifications } from '../hooks/useNotifications';
import { useAuth } from '../context/authentication.jsx';

const NotificationBell = () => {
  const { state } = useAuth();
  const { notifications, unreadCount, markAsRead, deleteNotification } = useNotifications(state?.user?.id);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // ปิด dropdown เมื่อคลิกข้างนอก
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleNotificationClick = (notification) => {
    markAsRead(notification.id);
    setIsOpen(false);
    // Navigate to blog or do something
  };

  const handleDelete = (e, notificationId) => {
    e.stopPropagation();
    deleteNotification(notificationId);
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'new_blog': return '📝';
      case 'comment': return '💬';
      case 'comment_reply': return '💬';
      case 'like': return '❤️';
      case 'rate': return '⭐';
      default: return '🔔';
    }
  };

  const getNotificationMessage = (notification) => {
    switch (notification.type) {
      case 'new_blog':
        return `${notification.actor_name} สร้าง blog ใหม่: "${notification.blog_title}"`;
      case 'comment':
        return `${notification.actor_name} comment ใน "${notification.blog_title}"`;
      case 'comment_reply':
        return `${notification.actor_name} comment ใน "${notification.blog_title}"`;
      case 'like':
        return `${notification.actor_name} like "${notification.blog_title}"`;
      case 'rate':
        return `${notification.actor_name} rate "${notification.blog_title}" ${notification.rating} ดาว`;
      default:
        return notification.message || 'มีแจ้งเตือนใหม่';
    }
  };

  NotificationBell.displayName = "NotificationBell";

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Icon */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-stone-600 hover:text-stone-800 transition-colors"
      >
        <Bell className="w-6 h-6" />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-stone-200 z-50 max-h-96 overflow-y-auto">
          <div className="p-4 border-b border-stone-200">
            <h3 className="font-semibold text-stone-800">แจ้งเตือน</h3>
          </div>

          {notifications.length === 0 ? (
            <div className="p-8 text-center text-stone-500">
              <p>ไม่มีแจ้งเตือน</p>
            </div>
          ) : (
            <div className="divide-y divide-stone-200">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  onClick={() => handleNotificationClick(notification)}
                  className={`p-4 hover:bg-stone-50 cursor-pointer transition-colors ${
                    !notification.read ? 'bg-blue-50' : ''
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">{getNotificationIcon(notification.type)}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-stone-700 line-clamp-2">
                        {getNotificationMessage(notification)}
                      </p>
                      <p className="text-xs text-stone-500 mt-1">
                        {new Date(notification.created_at).toLocaleString('th-TH')}
                      </p>
                    </div>
                    <button
                      onClick={(e) => handleDelete(e, notification.id)}
                      className="text-stone-400 hover:text-red-500 p-1"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
```

---

## 5. ตัวอย่างการใช้งาน

### 5.1 เมื่อมีคน comment blog:

```javascript
// ใน server/routers/posts.mjs หรือ comments.mjs
import supabase from "../utils/db.mjs";

// หลังจากสร้าง comment สำเร็จ
const { data: comment, error } = await supabase
  .from('comments')
  .insert({ post_id, user_id, content })
  .select()
  .single();

// ✅ Trigger สร้าง notification อัตโนมัติ! ไม่ต้องเขียนโค้ดเพิ่ม
// - แจ้งเตือน author ของ blog
// - แจ้งเตือนคนที่เคย comment ใน blog เดียวกัน
```

### 5.2 เมื่อมีคน like blog:

```javascript
// หลังจาก like สำเร็จ
await supabase
  .from('likes')
  .insert({ post_id, user_id });

// ✅ Trigger สร้าง notification อัตโนมัติ! ไม่ต้องเขียนโค้ดเพิ่ม
// - แจ้งเตือน author ของ blog
```

### 5.3 เมื่อมีคน rate blog:

```javascript
// หลังจาก rate สำเร็จ
await supabase
  .from('post_ratings')
  .insert({ post_id, user_id, rating: ratingValue }); // rating: 0-10

// ✅ Trigger สร้าง notification อัตโนมัติ! ไม่ต้องเขียนโค้ดเพิ่ม
// - แจ้งเตือน author ของ blog พร้อม rating
```

### 5.4 เมื่อ Admin สร้าง blog ใหม่:

```javascript
// แจ้งเตือน member ทั้งหมด
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
```

---

## 🎯 สรุป

✅ **สิ่งที่ต้องทำ:**
1. รัน SQL code จาก `notifications_with_triggers.sql` (รวม Trigger + Realtime แล้ว)
2. สร้าง Backend API endpoints
3. สร้าง Frontend components (NotificationBell)
4. Trigger จะทำงานอัตโนมัติ! (ไม่ต้องเขียนโค้ดเพิ่ม)

✅ **ผลลัพธ์:**
- 🔴 Badge สีแดงปรากฏทันทีเมื่อมี notification ใหม่
- 📱 Dropdown แสดงรายการ notifications
- ⚡ อัพเดทแบบ real-time ไม่ต้อง refresh
- 🎨 UI สวยงาม responsive

---

## 📚 เอกสารเพิ่มเติม

- [Supabase Realtime Docs](https://supabase.com/docs/guides/realtime)
- [Supabase RLS Docs](https://supabase.com/docs/guides/auth/row-level-security)
- [Supabase Functions Docs](https://supabase.com/docs/guides/database/functions)

