import { useState, useEffect, useCallback } from 'react';
import { supabase, setSupabaseSession } from '../lib/supabase';
import axios from 'axios';

const apiBase = import.meta.env.VITE_API_BASE_URL || "http://localhost:4001/api";

export const useNotifications = (userId) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);

  // ดึง notifications (for manual refresh)
  const fetchNotifications = useCallback(async () => {
    if (!userId) return;
    
    try {
      const token = localStorage.getItem('token');
      console.log('📡 Fetching notifications from API...');
      const response = await axios.get(`${apiBase}/notifications`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('📥 API Response:', response.data);
      console.log('📊 Notifications count:', response.data.notifications?.length || 0);
      setNotifications(response.data.notifications || []);
    } catch (error) {
      console.error('❌ Error fetching notifications:', error);
      setNotifications([]);
    }
  }, [userId]);

  // ดึง unread count (for manual refresh)
  const fetchUnreadCount = useCallback(async () => {
    if (!userId) return;
    
    try {
      const token = localStorage.getItem('token');
      console.log('🔢 Fetching unread count from API...');
      const response = await axios.get(`${apiBase}/notifications/unread-count`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('🔢 Unread count:', response.data.count || 0);
      setUnreadCount(response.data.count || 0);
    } catch (error) {
      console.error('❌ Error fetching unread count:', error);
      setUnreadCount(0);
    }
  }, [userId]);

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
    console.log('🔔 useNotifications - userId:', userId);
    
    if (!userId) {
      console.log('⚠️ No userId, setting loading to false');
      setLoading(false);
      return;
    }

    let isMounted = true;

    // Fetch data แบบ sequential
    const loadData = async () => {
      try {
        console.log('📡 Starting to load notifications for userId:', userId);
        setLoading(true);
        await fetchNotifications();
        await fetchUnreadCount();
        console.log('✅ Finished loading notifications');
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };
    
    loadData();

    // Setup Supabase session จาก JWT token และ subscribe Realtime
    let channel = null;
    
    const setupRealtime = async () => {
      if (!isMounted) return;
      const token = localStorage.getItem('token');
      if (token) {
        await setSupabaseSession(token);
      }

      // ฟังการเปลี่ยนแปลงแบบ real-time
      channel = supabase
        .channel(`notifications-${userId}`)
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'notifications',
            filter: `user_id=eq.${userId}`
          },
          (payload) => {
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
            // อัพเดท notification
            setNotifications(prev => 
              prev.map(n => n.id === payload.new.id ? payload.new : n)
            );
          }
        )
        .subscribe();
    };

    setupRealtime();

    return () => {
      isMounted = false;
      if (channel) {
        supabase.removeChannel(channel);
      }
    };
  }, [userId, fetchNotifications, fetchUnreadCount]);

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

