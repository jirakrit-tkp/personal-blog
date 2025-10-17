import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FileText, Folder, User, Bell, Lock, ExternalLink, LogOut } from 'lucide-react';
import { useAuth } from '../../context/authentication.jsx';
import { useNotifications } from '../../hooks/useNotifications';

const AdminSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout, state } = useAuth();
  const userId = state?.user?.id;
  const { unreadCount } = useNotifications(userId);

  const isActive = (path) => {
    return location.pathname === path;
  };

  const menuItems = [
    {
      id: 'articles',
      label: 'Article management',
      path: '/admin/articles',
      icon: <FileText className="w-5 h-5" />
    },
    {
      id: 'categories',
      label: 'Category management',
      path: '/admin/categories',
      icon: <Folder className="w-5 h-5" />
    },
    {
      id: 'profile',
      label: 'Profile',
      path: '/admin/profile',
      icon: <User className="w-5 h-5" />
    },
    {
      id: 'notifications',
      label: 'Notification',
      path: '/admin/notifications',
      icon: (
        <div className="relative inline-flex">
          <Bell className="w-5 h-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-2.5 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-semibold">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </div>
      )
    },
    {
      id: 'reset-password',
      label: 'Reset password',
      path: '/admin/reset-password',
      icon: <Lock className="w-5 h-5" />
    }
  ];

  const utilityItems = [
    {
      id: 'website',
      label: 'plotlines.website',
      path: '/',
      icon: <ExternalLink className="w-5 h-5" />,
      external: true
    },
    {
      id: 'logout',
      label: 'Log out',
      path: '/',
      icon: <LogOut className="w-5 h-5" />
    }
  ];

  const handleNavigation = (item) => {
    if (item.id === 'logout') {
      // Clear auth and go to homepage
      window.localStorage.removeItem('token');
      if (typeof logout === 'function') logout();
      navigate('/');
      return;
    }

    if (item.external) {
      window.open(item.path, '_blank');
    } else {
      navigate(item.path);
    }
  };

  AdminSidebar.displayName = "AdminSidebar";

  return (
    <aside className="w-70 h-screen bg-stone-200 py-6 flex flex-col fixed left-0 top-0 z-10">
      {/* Brand Header */}
      <div className="px-6 pb-8 border-b border-stone-200 mb-6">
        <div className="flex items-center mb-2">
          <img src="/Plotline_text.svg" alt="Plotline logo" className="w-40 h-auto mt-8 mb-3"/>
        </div>
        <div className="text-orange-300 text-xl font-semibold">Admin panel</div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1">
        <ul className="space-y-1">
          {menuItems.map((item) => (
            <li key={item.id}>
              <button
                className={`w-full flex items-center px-4 py-3 border-none cursor-pointer transition-colors duration-200 ${
                  isActive(item.path) 
                    ? 'bg-stone-300 text-stone-800 font-medium' 
                    : 'text-stone-600 hover:bg-stone-200 hover:text-stone-700'
                }`}
                onClick={() => handleNavigation(item)}
                type="button"
              >
                <span className={`mr-3 flex items-center ${
                  isActive(item.path) ? 'text-stone-700' : 'text-stone-500'
                }`}>{item.icon}</span>
                <span className="text-sm font-medium">{item.label}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {/* Utility Links */}
      <div className="px-4 border-t border-stone-200 pt-4">
        <ul className="space-y-1">
          {utilityItems.map((item) => (
            <li key={item.id}>
              <button
                className="w-full flex items-center px-4 py-3 rounded-lg border-none cursor-pointer transition-colors duration-200 text-stone-600 hover:bg-stone-200 hover:text-stone-700"
                onClick={() => handleNavigation(item)}
                type="button"
              >
                <span className="mr-3 text-stone-500 flex items-center">{item.icon}</span>
                <span className="text-sm font-medium">{item.label}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
};

export default AdminSidebar;
