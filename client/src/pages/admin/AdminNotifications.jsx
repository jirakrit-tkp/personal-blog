import React, { useState } from 'react';

const AdminNotifications = () => {
  const [notifications] = useState([
    {
      id: 1,
      type: 'warning',
      title: 'Low Disk Space',
      message: 'Server disk space is running low (15% remaining)',
      timestamp: '2 hours ago',
      read: false,
      priority: 'high'
    },
    {
      id: 2,
      type: 'info',
      title: 'New User Registration',
      message: '5 new users have registered in the last 24 hours',
      timestamp: '4 hours ago',
      read: false,
      priority: 'medium'
    },
    {
      id: 3,
      type: 'success',
      title: 'Backup Completed',
      message: 'Daily backup completed successfully',
      timestamp: '6 hours ago',
      read: true,
      priority: 'low'
    },
    {
      id: 4,
      type: 'error',
      title: 'Failed Login Attempts',
      message: 'Multiple failed login attempts detected from IP: 192.168.1.100',
      timestamp: '8 hours ago',
      read: false,
      priority: 'high'
    },
    {
      id: 5,
      type: 'info',
      title: 'System Update Available',
      message: 'A new system update is available for installation',
      timestamp: '1 day ago',
      read: true,
      priority: 'medium'
    }
  ]);

  const [filter, setFilter] = useState('all');
  const [selectedNotifications, setSelectedNotifications] = useState([]);

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'warning': return '⚠️';
      case 'error': return '❌';
      case 'success': return '✅';
      case 'info': return 'ℹ️';
      default: return '📢';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return '#ef4444';
      case 'medium': return '#f59e0b';
      case 'low': return '#10b981';
      default: return '#6b7280';
    }
  };

  const filteredNotifications = notifications.filter(notification => {
    if (filter === 'all') return true;
    if (filter === 'unread') return !notification.read;
    if (filter === 'high') return notification.priority === 'high';
    return notification.type === filter;
  });

  const handleSelectNotification = (notificationId) => {
    setSelectedNotifications(prev => 
      prev.includes(notificationId) 
        ? prev.filter(id => id !== notificationId)
        : [...prev, notificationId]
    );
  };

  const handleSelectAll = () => {
    if (selectedNotifications.length === filteredNotifications.length) {
      setSelectedNotifications([]);
    } else {
      setSelectedNotifications(filteredNotifications.map(n => n.id));
    }
  };

  const markAsRead = () => {
    // Implementation for marking notifications as read
    console.log('Mark as read:', selectedNotifications);
  };

  const deleteNotifications = () => {
    // Implementation for deleting notifications
    console.log('Delete:', selectedNotifications);
  };

  AdminNotifications.displayName = "AdminNotifications";

  return (
    <div className="admin-notifications">
      <div className="page-header">
        <h1 className="page-title">Notifications</h1>
        <div className="header-actions">
          <button className="btn-secondary">Settings</button>
          <button className="btn-primary">Clear All</button>
        </div>
      </div>

      <div className="notifications-stats">
        <div className="stat-card">
          <div className="stat-icon">📢</div>
          <div className="stat-content">
            <h3 className="stat-number">{notifications.length}</h3>
            <p className="stat-label">Total Notifications</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">🔴</div>
          <div className="stat-content">
            <h3 className="stat-number">{notifications.filter(n => !n.read).length}</h3>
            <p className="stat-label">Unread</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">⚠️</div>
          <div className="stat-content">
            <h3 className="stat-number">{notifications.filter(n => n.priority === 'high').length}</h3>
            <p className="stat-label">High Priority</p>
          </div>
        </div>
      </div>

      <div className="notifications-controls">
        <div className="controls-left">
          <label className="checkbox-container">
            <input 
              type="checkbox" 
              checked={selectedNotifications.length === filteredNotifications.length && filteredNotifications.length > 0}
              onChange={handleSelectAll}
            />
            <span className="checkmark"></span>
            Select All
          </label>
          
          {selectedNotifications.length > 0 && (
            <div className="bulk-actions">
              <span className="selected-count">{selectedNotifications.length} selected</span>
              <button className="btn-bulk" onClick={markAsRead}>Mark as Read</button>
              <button className="btn-bulk delete" onClick={deleteNotifications}>Delete</button>
            </div>
          )}
        </div>

        <div className="controls-right">
          <select 
            className="filter-select"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="all">All Notifications</option>
            <option value="unread">Unread</option>
            <option value="high">High Priority</option>
            <option value="warning">Warnings</option>
            <option value="error">Errors</option>
            <option value="success">Success</option>
            <option value="info">Info</option>
          </select>
        </div>
      </div>

      <div className="notifications-list">
        {filteredNotifications.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📭</div>
            <h3 className="empty-title">No notifications found</h3>
            <p className="empty-description">
              {filter === 'all' 
                ? 'You\'re all caught up! No notifications at the moment.'
                : `No ${filter} notifications found.`
              }
            </p>
          </div>
        ) : (
          filteredNotifications.map(notification => (
            <div 
              key={notification.id} 
              className={`notification-item ${notification.read ? 'read' : 'unread'} ${notification.priority}`}
            >
              <div className="notification-checkbox">
                <label className="checkbox-container">
                  <input 
                    type="checkbox" 
                    checked={selectedNotifications.includes(notification.id)}
                    onChange={() => handleSelectNotification(notification.id)}
                  />
                  <span className="checkmark"></span>
                </label>
              </div>

              <div className="notification-icon">
                {getNotificationIcon(notification.type)}
              </div>

              <div className="notification-content">
                <div className="notification-header">
                  <h4 className="notification-title">{notification.title}</h4>
                  <div className="notification-meta">
                    <span 
                      className="priority-badge"
                      style={{ backgroundColor: getPriorityColor(notification.priority) }}
                    >
                      {notification.priority}
                    </span>
                    <span className="notification-time">{notification.timestamp}</span>
                  </div>
                </div>
                
                <p className="notification-message">{notification.message}</p>
              </div>

              <div className="notification-actions">
                {!notification.read && (
                  <button className="action-btn mark-read">Mark Read</button>
                )}
                <button className="action-btn delete">Delete</button>
              </div>
            </div>
          ))
        )}
      </div>

      <style jsx>{`
        .admin-notifications {
          max-width: 1000px;
          margin: 0 auto;
        }

        .page-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
        }

        .page-title {
          font-size: 28px;
          font-weight: 700;
          color: #1a1a1a;
          margin: 0;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }

        .header-actions {
          display: flex;
          gap: 12px;
        }

        .btn-primary, .btn-secondary {
          padding: 10px 16px;
          border-radius: 8px;
          border: none;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }

        .btn-primary {
          background: #3b82f6;
          color: white;
        }

        .btn-primary:hover {
          background: #2563eb;
        }

        .btn-secondary {
          background: white;
          color: #374151;
          border: 1px solid #d1d5db;
        }

        .btn-secondary:hover {
          background: #f3f4f6;
        }

        .notifications-stats {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 20px;
          margin-bottom: 24px;
        }

        .stat-card {
          background: white;
          border-radius: 12px;
          padding: 20px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          border: 1px solid #e5e7eb;
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .stat-icon {
          font-size: 24px;
          width: 48px;
          height: 48px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #f3f4f6;
          border-radius: 8px;
        }

        .stat-number {
          font-size: 24px;
          font-weight: 700;
          color: #1a1a1a;
          margin: 0 0 4px 0;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }

        .stat-label {
          font-size: 14px;
          color: #6b7280;
          margin: 0;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }

        .notifications-controls {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
          padding: 16px;
          background: white;
          border-radius: 8px;
          border: 1px solid #e5e7eb;
        }

        .controls-left {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .checkbox-container {
          display: flex;
          align-items: center;
          gap: 8px;
          cursor: pointer;
          font-size: 14px;
          color: #374151;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }

        .bulk-actions {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .selected-count {
          font-size: 14px;
          color: #6b7280;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }

        .btn-bulk {
          padding: 6px 12px;
          border: 1px solid #d1d5db;
          border-radius: 6px;
          background: white;
          color: #374151;
          font-size: 12px;
          cursor: pointer;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }

        .btn-bulk:hover {
          background: #f3f4f6;
        }

        .btn-bulk.delete {
          color: #ef4444;
          border-color: #ef4444;
        }

        .btn-bulk.delete:hover {
          background: #fef2f2;
        }

        .filter-select {
          padding: 8px 12px;
          border: 1px solid #d1d5db;
          border-radius: 6px;
          font-size: 14px;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }

        .notifications-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .notification-item {
          display: flex;
          align-items: flex-start;
          gap: 16px;
          padding: 20px;
          background: white;
          border-radius: 8px;
          border: 1px solid #e5e7eb;
          transition: all 0.2s;
        }

        .notification-item:hover {
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        .notification-item.unread {
          border-left: 4px solid #3b82f6;
          background: #f8fafc;
        }

        .notification-item.high {
          border-left-color: #ef4444;
        }

        .notification-icon {
          font-size: 20px;
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #f3f4f6;
          border-radius: 8px;
          flex-shrink: 0;
        }

        .notification-content {
          flex: 1;
        }

        .notification-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 8px;
        }

        .notification-title {
          font-size: 16px;
          font-weight: 600;
          color: #1a1a1a;
          margin: 0;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }

        .notification-meta {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .priority-badge {
          padding: 2px 6px;
          border-radius: 4px;
          color: white;
          font-size: 10px;
          font-weight: 500;
          text-transform: uppercase;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }

        .notification-time {
          font-size: 12px;
          color: #6b7280;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }

        .notification-message {
          font-size: 14px;
          color: #4b5563;
          line-height: 1.5;
          margin: 0;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }

        .notification-actions {
          display: flex;
          gap: 8px;
          flex-shrink: 0;
        }

        .action-btn {
          padding: 6px 12px;
          border: none;
          border-radius: 4px;
          font-size: 12px;
          cursor: pointer;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }

        .action-btn.mark-read {
          background: #3b82f6;
          color: white;
        }

        .action-btn.mark-read:hover {
          background: #2563eb;
        }

        .action-btn.delete {
          background: #ef4444;
          color: white;
        }

        .action-btn.delete:hover {
          background: #dc2626;
        }

        .empty-state {
          text-align: center;
          padding: 60px 20px;
          background: white;
          border-radius: 8px;
          border: 1px solid #e5e7eb;
        }

        .empty-icon {
          font-size: 48px;
          margin-bottom: 16px;
        }

        .empty-title {
          font-size: 20px;
          font-weight: 600;
          color: #1a1a1a;
          margin: 0 0 8px 0;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }

        .empty-description {
          font-size: 14px;
          color: #6b7280;
          margin: 0;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }

        @media (max-width: 768px) {
          .page-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 16px;
          }

          .notifications-controls {
            flex-direction: column;
            gap: 16px;
            align-items: flex-start;
          }

          .notification-item {
            flex-direction: column;
            gap: 12px;
          }

          .notification-header {
            flex-direction: column;
            gap: 8px;
          }

          .notification-meta {
            align-self: flex-start;
          }
        }
      `}</style>
    </div>
  );
};

export default AdminNotifications;
