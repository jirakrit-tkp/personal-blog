import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useNotifications } from '../../hooks/useNotifications';
import { useAuth } from '../../context/authentication.jsx';
import AdminLayout from './AdminLayout';
import { AdminNavbar } from '../../components/admin';

const AdminNotifications = () => {
  const { state } = useAuth();
  const userId = state?.user?.id;
  
  const { notifications, markAsRead, deleteNotification } = useNotifications(userId);
  const navigate = useNavigate();
  const [filter, setFilter] = useState('all');

  const filteredNotifications = notifications.filter(notification => {
    if (filter === 'all') return true;
    if (filter === 'unread') return !notification.read;
    return notification.type === filter;
  });

  const handleNotificationClick = (notification) => {
    if (!notification.read) {
      markAsRead(notification.id);
    }
    if (notification.blog_id) {
      navigate(`/post/${notification.blog_id}`);
    }
  };

  const handleDelete = (notificationId) => {
    deleteNotification(notificationId);
  };

  AdminNotifications.displayName = "AdminNotifications";

  return (
    <div className="bg-stone-100 min-h-screen">
      <AdminNavbar title="Notification" />

      <div className="mx-8 p-8 min-h-[calc(100vh-120px)]">
        {/* Filter Section */}
        <div className="flex justify-end items-center mb-6">
          <select 
            className="px-3 py-2 border border-stone-300 rounded-md text-sm bg-white cursor-pointer focus:outline-none focus:ring-2 focus:ring-stone-400"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="all">All Notifications</option>
            <option value="unread">Unread</option>
            <option value="comment">Comments</option>
            <option value="like">Likes</option>
            <option value="rate">Ratings</option>
          </select>
        </div>

        {/* Notifications List */}
        <div className="bg-white rounded-lg border border-stone-200 overflow-hidden">
          {filteredNotifications.length === 0 ? (
            <div className="p-8 text-center text-stone-500">
              No notifications found
            </div>
          ) : (
            <div className="divide-y divide-stone-200">
              {filteredNotifications.map(notification => (
                <div 
                  key={notification.id} 
                  className={`flex items-start gap-4 px-6 py-4 hover:bg-stone-50 ${
                    !notification.read && 'bg-blue-50'
                  }`}
                >
                  <div className="text-2xl w-10 h-10 flex items-center justify-center bg-stone-100 rounded-full flex-shrink-0">
                    {notification.type === 'comment' && '💬'}
                    {notification.type === 'like' && '❤️'}
                    {notification.type === 'rate' && '⭐'}
                    {!['comment', 'like', 'rate'].includes(notification.type) && '🔔'}
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-stone-900 mb-1">
                      <span className="font-semibold">{notification.actor_name}</span>
                      {' '}
                      {notification.type === 'comment' && 'Commented on your article:'}
                      {notification.type === 'like' && 'liked your article:'}
                      {notification.type === 'rate' && 'rated your article:'}
                      {' '}
                      <span className="font-medium">{notification.blog_title}</span>
                    </p>
                    
                    {notification.comment_content && (
                      <p className="text-sm text-stone-600 mb-1 italic">
                        "{notification.comment_content}"
                      </p>
                    )}
                    
                    <p className="text-xs text-stone-500">
                      {new Date(notification.created_at).toLocaleString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>

                  <div className="flex gap-2 flex-shrink-0">
                    <button 
                      className="text-sm text-stone-700 hover:text-stone-900 font-medium"
                      onClick={() => handleNotificationClick(notification)}
                    >
                      View
                    </button>
                    <button 
                      className="text-sm text-stone-400 hover:text-red-600"
                      onClick={() => handleDelete(notification.id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminNotifications;
