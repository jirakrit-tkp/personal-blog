import React, { useState, useRef, useEffect } from 'react';
import { Bell } from 'lucide-react';
import { useNotifications } from '../hooks/useNotifications';
import { useAuth } from '../context/authentication.jsx';
import NotificationItem from './NotificationItem';

const NotificationBell = () => {
  const { state } = useAuth();
  const userId = state?.user?.id;
  
  const { notifications, unreadCount, markAsRead, deleteNotification } = useNotifications(userId);
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
    if (!notification.read) {
      markAsRead(notification.id);
    }
    setIsOpen(false);
    // Navigate to blog or do something
    if (notification.blog_id) {
      window.location.href = `/post/${notification.blog_id}`;
    }
  };

  NotificationBell.displayName = "NotificationBell";

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Icon */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-stone-600 hover:text-stone-800 transition-colors"
        aria-label="Notifications"
      >
        <Bell className="w-6 h-6" />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-semibold">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-6 w-80 bg-stone-200 rounded-md shadow-md border border-stone-200 z-50 max-h-96 overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="p-8 text-center text-stone-500">
              <Bell className="w-12 h-12 mx-auto mb-2 text-stone-300" />
              <p>No notifications</p>
            </div>
          ) : (
            <div className="divide-y divide-stone-200">
              {notifications.map((notification) => (
                <NotificationItem
                  key={notification.id}
                  notification={notification}
                  onClick={handleNotificationClick}
                  onDelete={deleteNotification}
                  compact={true}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationBell;

