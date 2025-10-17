import React, { useState, useRef, useEffect } from 'react';
import { Bell, X, User } from 'lucide-react';
import { useNotifications } from '../hooks/useNotifications';
import { useAuth } from '../context/authentication.jsx';

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

  const handleDelete = (e, notificationId) => {
    e.stopPropagation();
    deleteNotification(notificationId);
  };

  const getNotificationMessage = (notification) => {
    const actorName = <strong>{notification.actor_name}</strong>;
    
    switch (notification.type) {
      case 'new_blog':
        return <>{actorName} published new article.</>;
      case 'comment':
        return <>{actorName} commented on the article you have commented on.</>;
      case 'comment_reply':
        return <>{actorName} commented on the article you have commented on.</>;
      case 'like':
        return <>{actorName} liked your article.</>;
      case 'rate':
        return <>{actorName} rated your article.</>;
      default:
        return notification.message || 'You have a new notification';
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
                <div
                  key={notification.id}
                  onClick={() => handleNotificationClick(notification)}
                  className={`px-2 py-1.5 hover:bg-stone-200 cursor-pointer transition-colors ${
                    !notification.read ? 'bg-stone-50' : ''
                  }`}
                >
                  <div className="flex items-start gap-2">
                    {/* Profile Picture */}
                    <div className="w-10 h-10 rounded-full bg-stone-200 flex items-center justify-center flex-shrink-0 overflow-hidden">
                      {notification.actor_profile_pic ? (
                        <img 
                          src={notification.actor_profile_pic} 
                          alt={notification.actor_name || 'User'}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <User className="w-5 h-5 text-stone-400" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-stone-800">
                        {getNotificationMessage(notification)}
                      </p>
                      <p className="text-xs text-orange-300 mt-1">
                        {new Date(notification.created_at).toLocaleString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                    <button
                      onClick={(e) => handleDelete(e, notification.id)}
                      className="text-stone-400 hover:text-red-500 flex-shrink-0"
                      aria-label="Delete notification"
                    >
                      <X className="w-4 h-4" />
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

