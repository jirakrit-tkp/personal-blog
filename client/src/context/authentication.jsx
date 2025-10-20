import React, { useState, useEffect, useCallback } from "react";
import { flushSync } from "react-dom";
import axios from "axios";
import { supabase, setSupabaseSession } from '../lib/supabase';

const AuthContext = React.createContext();

function AuthProvider(props) {
  const [state, setState] = useState({
    loading: null,
    getUserLoading: null,
    error: null,
    user: null,
  });

  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [notificationsLoading, setNotificationsLoading] = useState(false);

  const apiBase = import.meta.env.VITE_API_BASE_URL || "http://localhost:4001/api";

  // Fetch notifications with caching
  const fetchNotifications = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    // Check cache first
    const cacheKey = `notifications-${state.user?.id}`;
    const cached = sessionStorage.getItem(cacheKey);
    if (cached) {
      const { data, timestamp } = JSON.parse(cached);
      if (Date.now() - timestamp < 30000) { // 30s cache
        setNotifications(data);
        return;
      }
    }

    try {
      const response = await axios.get(`${apiBase}/notifications`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const notifications = response.data.notifications || [];
      setNotifications(notifications);
      
      // Cache the result
      sessionStorage.setItem(cacheKey, JSON.stringify({
        data: notifications,
        timestamp: Date.now()
      }));
    } catch (error) {
      console.error('Error fetching notifications:', error);
      setNotifications([]);
    }
  }, [apiBase, state.user?.id]);

  // Fetch unread count with caching
  const fetchUnreadCount = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    // Check cache first
    const cacheKey = `unread-count-${state.user?.id}`;
    const cached = sessionStorage.getItem(cacheKey);
    if (cached) {
      const { count, timestamp } = JSON.parse(cached);
      if (Date.now() - timestamp < 30000) { // 30s cache
        setUnreadCount(count);
        return;
      }
    }

    try {
      const response = await axios.get(`${apiBase}/notifications/unread-count`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const count = response.data.count || 0;
      setUnreadCount(count);
      
      // Cache the result
      sessionStorage.setItem(cacheKey, JSON.stringify({
        count,
        timestamp: Date.now()
      }));
    } catch (error) {
      console.error('Error fetching unread count:', error);
      setUnreadCount(0);
    }
  }, [apiBase, state.user?.id]);

  // Load notifications data
  const loadNotifications = useCallback(async () => {
    if (!state.user) return;
    
    setNotificationsLoading(true);
    try {
      await Promise.all([fetchNotifications(), fetchUnreadCount()]);
    } finally {
      setNotificationsLoading(false);
    }
  }, [state.user, fetchNotifications, fetchUnreadCount]);

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

  // Delete notification
  const deleteNotification = async (notificationId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${apiBase}/notifications/${notificationId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setNotifications(prev => prev.filter(n => n.id !== notificationId));
      const notification = notifications.find(n => n.id === notificationId);
      if (notification && !notification.read) {
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };

  const fetchUser = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setState((prevState) => ({ ...prevState, user: null, getUserLoading: false }));
      return;
    }

    try {
      setState((prevState) => ({ ...prevState, getUserLoading: true }));
      const response = await axios.get(`${apiBase}/auth/get-user`);
      setState((prevState) => ({ ...prevState, user: response.data, getUserLoading: false }));
    } catch (error) {
      setState((prevState) => ({
        ...prevState,
        error: error.message,
        user: null,
        getUserLoading: false,
      }));
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  // Load notifications when user is available
  useEffect(() => {
    if (state.user) {
      loadNotifications();
    } else {
      setNotifications([]);
      setUnreadCount(0);
    }
  }, [state.user?.id, loadNotifications]);

  // Setup Supabase realtime for notifications
  useEffect(() => {
    if (!state.user?.id) return;

    let channel;
    const setupRealtime = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        await setSupabaseSession(token);
      }

      channel = supabase
        .channel(`notifications-${state.user.id}`)
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'notifications',
            filter: `user_id=eq.${state.user.id}`
          },
          (payload) => {
            setNotifications(prev => [payload.new, ...prev]);
            setUnreadCount(prev => prev + 1);
          }
        )
        .on(
          'postgres_changes',
          {
            event: 'UPDATE',
            schema: 'public',
            table: 'notifications',
            filter: `user_id=eq.${state.user.id}`
          },
          (payload) => {
            setNotifications(prev =>
              prev.map(n => n.id === payload.new.id ? payload.new : n)
            );
          }
        )
        .subscribe();
    };

    setupRealtime();

    return () => {
      if (channel) {
        supabase.removeChannel(channel);
      }
    };
  }, [state.user?.id]);


  const login = async (data, navigate) => {
    try {
      setState((prevState) => ({ ...prevState, loading: true, error: null }));
      const response = await axios.post(`${apiBase}/auth/login`, data);
      const token = response.data.access_token;
      localStorage.setItem("token", token);
      setState((prevState) => ({ ...prevState, loading: false, error: null }));
      
      // Fetch user data to get role
      const userResponse = await axios.get(`${apiBase}/auth/get-user`);
      const userData = userResponse.data;
      
      // Force state update synchronously
      flushSync(() => {
        setState((prevState) => ({ ...prevState, user: userData }));
      });
      
      // Redirect based on role
      if (userData.role === 'admin') {
        navigate("/admin/articles");
      } else {
        navigate("/");
      }
    } catch (error) {
      const msg = error.response?.data?.error || "Login failed";
      setState((prevState) => ({ ...prevState, loading: false, error: msg }));
      return { error: msg };
    }
  };

  const register = async (data) => {
    try {
      setState((prevState) => ({ ...prevState, loading: true, error: null }));
      await axios.post(`${apiBase}/auth/register`, data);
      setState((prevState) => ({ ...prevState, loading: false, error: null }));
      return { success: true };
    } catch (error) {
      const msg = error.response?.data?.error || "Registration failed";
      setState((prevState) => ({ ...prevState, loading: false, error: msg }));
      return { error: msg };
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setState({ user: null, error: null, loading: null });
    setNotifications([]);
    setUnreadCount(0);
    // Redirect will be handled by component that calls logout
  };

  const isAuthenticated = Boolean(state.user);

  return (
    <AuthContext.Provider value={{ 
      state, 
      login, 
      logout, 
      register, 
      isAuthenticated, 
      fetchUser,
      notifications,
      unreadCount,
      notificationsLoading,
      markAsRead,
      deleteNotification,
      fetchNotifications,
      fetchUnreadCount
    }}>
      {props.children}
    </AuthContext.Provider>
  );
}

const useAuth = () => React.useContext(AuthContext);

export { AuthProvider, useAuth };


