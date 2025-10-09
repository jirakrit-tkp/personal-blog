import React, { useState } from 'react';

const CategoryManagement = () => {
  const [categories] = useState([
    { id: 1, name: "Action", description: "High-energy content with dynamic themes", postsCount: 12, color: "#ef4444" },
    { id: 2, name: "Adventure", description: "Exciting journeys and exploration stories", postsCount: 8, color: "#f97316" },
    { id: 3, name: "Animation", description: "Creative and imaginative content", postsCount: 15, color: "#eab308" },
    { id: 4, name: "Comedy", description: "Light-hearted and humorous content", postsCount: 6, color: "#22c55e" },
    { id: 5, name: "Drama", description: "Serious and emotional storytelling", postsCount: 9, color: "#3b82f6" },
    { id: 6, name: "Horror", description: "Thrilling and suspenseful content", postsCount: 4, color: "#8b5cf6" }
  ]);

  const [selectedCategories, setSelectedCategories] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const handleSelectCategory = (categoryId) => {
    setSelectedCategories(prev => 
      prev.includes(categoryId) 
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const handleSelectAll = () => {
    if (selectedCategories.length === categories.length) {
      setSelectedCategories([]);
    } else {
      setSelectedCategories(categories.map(category => category.id));
    }
  };

  CategoryManagement.displayName = "CategoryManagement";

  return (
    <div className="category-management">
      <div className="page-header">
        <h1 className="page-title">Category Management</h1>
        <div className="header-actions">
          <button className="btn-secondary">Import</button>
          <button className="btn-primary" onClick={() => setShowCreateModal(true)}>
            Create Category
          </button>
        </div>
      </div>

      <div className="management-toolbar">
        <div className="toolbar-left">
          <label className="checkbox-container">
            <input 
              type="checkbox" 
              checked={selectedCategories.length === categories.length && categories.length > 0}
              onChange={handleSelectAll}
            />
            <span className="checkmark"></span>
            Select All
          </label>
          
          {selectedCategories.length > 0 && (
            <div className="bulk-actions">
              <span className="selected-count">{selectedCategories.length} selected</span>
              <button className="btn-bulk">Delete</button>
              <button className="btn-bulk">Merge</button>
            </div>
          )}
        </div>

        <div className="toolbar-right">
          <div className="search-box">
            <input type="text" placeholder="Search categories..." />
            <button className="search-btn">🔍</button>
          </div>
        </div>
      </div>

      <div className="categories-grid">
        {categories.map(category => (
          <div key={category.id} className="category-card">
            <div className="card-header">
              <label className="checkbox-container">
                <input 
                  type="checkbox" 
                  checked={selectedCategories.includes(category.id)}
                  onChange={() => handleSelectCategory(category.id)}
                />
                <span className="checkmark"></span>
              </label>
              
              <div className="category-color" style={{ backgroundColor: category.color }}></div>
              
              <div className="category-actions">
                <button className="action-btn edit">Edit</button>
                <button className="action-btn delete">Delete</button>
              </div>
            </div>

            <div className="card-content">
              <h3 className="category-name">{category.name}</h3>
              <p className="category-description">{category.description}</p>
              
              <div className="category-stats">
                <div className="stat-item">
                  <span className="stat-number">{category.postsCount}</span>
                  <span className="stat-label">Posts</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Create Category Modal */}
      {showCreateModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2 className="modal-title">Create New Category</h2>
              <button 
                className="modal-close"
                onClick={() => setShowCreateModal(false)}
              >
                ×
              </button>
            </div>

            <div className="modal-body">
              <div className="form-group">
                <label className="form-label">Category Name</label>
                <input 
                  type="text" 
                  className="form-input"
                  placeholder="Enter category name"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea 
                  className="form-textarea"
                  placeholder="Enter category description"
                  rows="3"
                ></textarea>
              </div>

              <div className="form-group">
                <label className="form-label">Color</label>
                <div className="color-picker">
                  {['#ef4444', '#f97316', '#eab308', '#22c55e', '#3b82f6', '#8b5cf6', '#ec4899', '#06b6d4'].map(color => (
                    <div 
                      key={color}
                      className="color-option"
                      style={{ backgroundColor: color }}
                    ></div>
                  ))}
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button 
                className="btn-secondary"
                onClick={() => setShowCreateModal(false)}
              >
                Cancel
              </button>
              <button className="btn-primary">Create Category</button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .category-management {
          max-width: 1200px;
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

        .management-toolbar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
          padding: 16px;
          background: white;
          border-radius: 8px;
          border: 1px solid #e5e7eb;
        }

        .toolbar-left {
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

        .toolbar-right {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .search-box {
          display: flex;
          align-items: center;
          border: 1px solid #d1d5db;
          border-radius: 6px;
          overflow: hidden;
        }

        .search-box input {
          padding: 8px 12px;
          border: none;
          outline: none;
          font-size: 14px;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }

        .search-btn {
          padding: 8px 12px;
          border: none;
          background: #f3f4f6;
          cursor: pointer;
        }

        .categories-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 20px;
        }

        .category-card {
          background: white;
          border-radius: 12px;
          border: 1px solid #e5e7eb;
          overflow: hidden;
          transition: box-shadow 0.2s;
        }

        .category-card:hover {
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }

        .card-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 16px;
          border-bottom: 1px solid #e5e7eb;
          background: #f9fafb;
        }

        .category-color {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          margin-left: 8px;
        }

        .category-actions {
          display: flex;
          gap: 8px;
        }

        .action-btn {
          padding: 4px 8px;
          border: none;
          border-radius: 4px;
          font-size: 12px;
          cursor: pointer;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }

        .action-btn.edit {
          background: #3b82f6;
          color: white;
        }

        .action-btn.edit:hover {
          background: #2563eb;
        }

        .action-btn.delete {
          background: #ef4444;
          color: white;
        }

        .action-btn.delete:hover {
          background: #dc2626;
        }

        .card-content {
          padding: 20px;
        }

        .category-name {
          font-size: 18px;
          font-weight: 600;
          color: #1a1a1a;
          margin: 0 0 8px 0;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }

        .category-description {
          font-size: 14px;
          color: #6b7280;
          margin: 0 0 16px 0;
          line-height: 1.5;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }

        .category-stats {
          display: flex;
          gap: 16px;
        }

        .stat-item {
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .stat-number {
          font-size: 20px;
          font-weight: 700;
          color: #1a1a1a;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }

        .stat-label {
          font-size: 12px;
          color: #6b7280;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }

        /* Modal Styles */
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
        }

        .modal-content {
          background: white;
          border-radius: 12px;
          width: 90%;
          max-width: 500px;
          max-height: 90vh;
          overflow-y: auto;
        }

        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px;
          border-bottom: 1px solid #e5e7eb;
        }

        .modal-title {
          font-size: 20px;
          font-weight: 600;
          color: #1a1a1a;
          margin: 0;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }

        .modal-close {
          background: none;
          border: none;
          font-size: 24px;
          cursor: pointer;
          color: #6b7280;
        }

        .modal-body {
          padding: 20px;
        }

        .form-group {
          margin-bottom: 20px;
        }

        .form-label {
          display: block;
          font-size: 14px;
          font-weight: 500;
          color: #374151;
          margin-bottom: 6px;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }

        .form-input, .form-textarea {
          width: 100%;
          padding: 10px 12px;
          border: 1px solid #d1d5db;
          border-radius: 6px;
          font-size: 14px;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }

        .form-input:focus, .form-textarea:focus {
          outline: none;
          border-color: #3b82f6;
        }

        .color-picker {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }

        .color-option {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          cursor: pointer;
          border: 2px solid transparent;
          transition: border-color 0.2s;
        }

        .color-option:hover {
          border-color: #1a1a1a;
        }

        .modal-footer {
          display: flex;
          justify-content: flex-end;
          gap: 12px;
          padding: 20px;
          border-top: 1px solid #e5e7eb;
        }

        @media (max-width: 768px) {
          .page-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 16px;
          }

          .management-toolbar {
            flex-direction: column;
            gap: 16px;
            align-items: flex-start;
          }

          .categories-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default CategoryManagement;
