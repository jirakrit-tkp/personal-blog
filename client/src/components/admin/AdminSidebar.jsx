import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const AdminSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path;
  };

  const menuItems = [
    {
      id: 'articles',
      label: 'Article management',
      path: '/admin/articles',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14,2 14,8 20,8" />
          <line x1="16" y1="13" x2="8" y2="13" />
          <line x1="16" y1="17" x2="8" y2="17" />
          <polyline points="10,9 9,9 8,9" />
        </svg>
      )
    },
    {
      id: 'categories',
      label: 'Category management',
      path: '/admin/categories',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
        </svg>
      )
    },
    {
      id: 'profile',
      label: 'Profile',
      path: '/admin/profile',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </svg>
      )
    },
    {
      id: 'notifications',
      label: 'Notification',
      path: '/admin/notifications',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
          <path d="M13.73 21a2 2 0 0 1-3.46 0" />
        </svg>
      )
    },
    {
      id: 'reset-password',
      label: 'Reset password',
      path: '/admin/reset-password',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
          <circle cx="12" cy="16" r="1" />
          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
        </svg>
      )
    }
  ];

  const utilityItems = [
    {
      id: 'website',
      label: 'plotlines.website',
      path: '/',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
          <polyline points="15,3 21,3 21,9" />
          <line x1="10" y1="14" x2="21" y2="3" />
        </svg>
      ),
      external: true
    },
    {
      id: 'logout',
      label: 'Log out',
      path: '/logout',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
          <polyline points="16,17 21,12 16,7" />
          <line x1="21" y1="12" x2="9" y2="12" />
        </svg>
      )
    }
  ];

  const handleNavigation = (item) => {
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
          <img src="/Plotline_text.svg" alt="Plotline logo" className="w-40 h-40 -mb-15"/>
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
