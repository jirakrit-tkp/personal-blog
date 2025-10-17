import React from 'react';
import { Bell } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useNotifications } from '../hooks/useNotifications';
import { useAuth } from '../context/authentication.jsx';

const AdminNotificationBell = () => {
  const { state } = useAuth();
  const { unreadCount } = useNotifications(state?.user?.id);
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/admin/notifications');
  };

  AdminNotificationBell.displayName = "AdminNotificationBell";

  return (
    <button
      onClick={handleClick}
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
  );
};

export default AdminNotificationBell;

