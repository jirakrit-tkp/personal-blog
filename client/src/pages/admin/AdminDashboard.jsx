import React from 'react';

const AdminDashboard = () => {
  AdminDashboard.displayName = "AdminDashboard";

  return (
    <div className="admin-dashboard">
      <div className="dashboard-header">
        <h1 className="dashboard-title">Admin Dashboard</h1>
        <p className="dashboard-subtitle">Welcome to the admin panel</p>
      </div>

      <div className="dashboard-stats">
        <div className="stat-card">
          <div className="stat-icon">📝</div>
          <div className="stat-content">
            <h3 className="stat-number">24</h3>
            <p className="stat-label">Total Articles</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">📂</div>
          <div className="stat-content">
            <h3 className="stat-number">8</h3>
            <p className="stat-label">Categories</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">👥</div>
          <div className="stat-content">
            <h3 className="stat-number">156</h3>
            <p className="stat-label">Users</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">🔔</div>
          <div className="stat-content">
            <h3 className="stat-number">3</h3>
            <p className="stat-label">Notifications</p>
          </div>
        </div>
      </div>

      <div className="dashboard-content">
        <div className="content-section">
          <h2 className="section-title">Recent Articles</h2>
          <div className="article-list">
            <div className="article-item">
              <div className="article-info">
                <h4 className="article-title">The Art of Mindfulness: Finding Peace in a Busy World</h4>
                <p className="article-date">September 11, 2024</p>
              </div>
              <div className="article-actions">
                <button className="btn-edit">Edit</button>
                <button className="btn-delete">Delete</button>
              </div>
            </div>

            <div className="article-item">
              <div className="article-info">
                <h4 className="article-title">The Secret Language of Cats: Decoding Feline Communication</h4>
                <p className="article-date">August 21, 2024</p>
              </div>
              <div className="article-actions">
                <button className="btn-edit">Edit</button>
                <button className="btn-delete">Delete</button>
              </div>
            </div>
          </div>
        </div>

        <div className="content-section">
          <h2 className="section-title">Quick Actions</h2>
          <div className="quick-actions">
            <button className="action-btn">Create New Article</button>
            <button className="action-btn">Manage Categories</button>
            <button className="action-btn">View Analytics</button>
            <button className="action-btn">Export Data</button>
          </div>
        </div>
      </div>

      <style jsx>{`
        .admin-dashboard {
          max-width: 1200px;
          margin: 0 auto;
        }

        .dashboard-header {
          margin-bottom: 32px;
        }

        .dashboard-title {
          font-size: 32px;
          font-weight: 700;
          color: #1a1a1a;
          margin: 0 0 8px 0;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }

        .dashboard-subtitle {
          font-size: 16px;
          color: #6b7280;
          margin: 0;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }

        .dashboard-stats {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 20px;
          margin-bottom: 32px;
        }

        .stat-card {
          background: white;
          border-radius: 12px;
          padding: 24px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          border: 1px solid #e5e7eb;
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .stat-icon {
          font-size: 32px;
          width: 48px;
          height: 48px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #f3f4f6;
          border-radius: 8px;
        }

        .stat-content {
          flex: 1;
        }

        .stat-number {
          font-size: 28px;
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

        .dashboard-content {
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: 32px;
        }

        .content-section {
          background: white;
          border-radius: 12px;
          padding: 24px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          border: 1px solid #e5e7eb;
        }

        .section-title {
          font-size: 20px;
          font-weight: 600;
          color: #1a1a1a;
          margin: 0 0 20px 0;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }

        .article-list {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .article-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 16px;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          background: #f9fafb;
        }

        .article-title {
          font-size: 16px;
          font-weight: 500;
          color: #1a1a1a;
          margin: 0 0 4px 0;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }

        .article-date {
          font-size: 14px;
          color: #6b7280;
          margin: 0;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }

        .article-actions {
          display: flex;
          gap: 8px;
        }

        .btn-edit, .btn-delete {
          padding: 6px 12px;
          border-radius: 6px;
          border: none;
          font-size: 12px;
          font-weight: 500;
          cursor: pointer;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }

        .btn-edit {
          background: #3b82f6;
          color: white;
        }

        .btn-edit:hover {
          background: #2563eb;
        }

        .btn-delete {
          background: #ef4444;
          color: white;
        }

        .btn-delete:hover {
          background: #dc2626;
        }

        .quick-actions {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .action-btn {
          padding: 12px 16px;
          border: 1px solid #d1d5db;
          border-radius: 8px;
          background: white;
          color: #374151;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }

        .action-btn:hover {
          background: #f3f4f6;
          border-color: #9ca3af;
        }

        @media (max-width: 768px) {
          .dashboard-stats {
            grid-template-columns: 1fr;
          }

          .dashboard-content {
            grid-template-columns: 1fr;
          }

          .article-item {
            flex-direction: column;
            align-items: flex-start;
            gap: 12px;
          }

          .article-actions {
            align-self: flex-end;
          }
        }
      `}</style>
    </div>
  );
};

export default AdminDashboard;
