import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useNotifications } from '../../hooks/useNotifications';
import { useAuth } from '../../context/authentication.jsx';
import { AdminNavbar } from '../../components/admin';
import NotificationItem from '../../components/NotificationItem';
import CustomDropdown from '../../components/ui/CustomDropdown';

const AdminNotifications = () => {
  const { state } = useAuth();
  const userId = state?.user?.id;
  
  const { notifications, markAsRead, deleteNotification, loading } = useNotifications(userId);
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

  AdminNotifications.displayName = "AdminNotifications";

  return (
    <div className="bg-stone-100 min-h-screen">
      <AdminNavbar title="Notification" />

      <div className="mx-8 p-8 min-h-[calc(100vh-120px)]">
        {/* Filter Section */}
        <div className="flex justify-end items-center mb-6">
          <div className="w-64">
            <CustomDropdown
              label=""
              options={['All Notifications', 'Unread', 'New Articles', 'Comments', 'Likes', 'Ratings']}
              value={
                filter === 'all' ? 'All Notifications' :
                filter === 'unread' ? 'Unread' :
                filter === 'new_blog' ? 'New Articles' :
                filter === 'comment' ? 'Comments' :
                filter === 'like' ? 'Likes' :
                filter === 'rate' ? 'Ratings' : 'All Notifications'
              }
              onChange={(value) => {
                const filterMap = {
                  'All Notifications': 'all',
                  'Unread': 'unread',
                  'New Articles': 'new_blog',
                  'Comments': 'comment',
                  'Likes': 'like',
                  'Ratings': 'rate'
                };
                setFilter(filterMap[value]);
              }}
              placeholder="Select filter..."
            />
          </div>
        </div>

        {/* Notifications List */}
        <div className="bg-stone-200 rounded-lg border border-stone-200 overflow-hidden">
          {filteredNotifications.length === 0 ? (
            <div className="p-8 text-center text-stone-500">
              No notifications found
            </div>
          ) : (
            <div className="divide-y divide-stone-200">
              {filteredNotifications.map(notification => (
                <NotificationItem
                  key={notification.id}
                  notification={notification}
                  onClick={handleNotificationClick}
                  onDelete={deleteNotification}
                  compact={false}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminNotifications;
