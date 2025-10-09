import React, { useState } from 'react';

const ArticleManagement = () => {
  const [articles] = useState([
    {
      id: 1,
      title: "The Art of Mindfulness: Finding Peace in a Busy World",
      description: "Discover the transformative power of mindfulness...",
      date: "2024-09-11",
      status: "Published",
      author: "Thompson P.",
      genres: ["Action"]
    },
    {
      id: 2,
      title: "The Secret Language of Cats: Decoding Feline Communication",
      description: "Unravel the mysteries of cat communication...",
      date: "2024-08-21",
      status: "Published",
      author: "Thompson P.",
      genres: ["Adventure"]
    },
    {
      id: 3,
      title: "Embracing Change: How to Thrive in Times of Transition",
      description: "Learn powerful strategies to navigate life's changes...",
      date: "2024-03-23",
      status: "Draft",
      author: "Thompson P.",
      genres: ["Animation"]
    }
  ]);

  const [selectedArticles, setSelectedArticles] = useState([]);

  const handleSelectArticle = (articleId) => {
    setSelectedArticles(prev => 
      prev.includes(articleId) 
        ? prev.filter(id => id !== articleId)
        : [...prev, articleId]
    );
  };

  const handleSelectAll = () => {
    if (selectedArticles.length === articles.length) {
      setSelectedArticles([]);
    } else {
      setSelectedArticles(articles.map(article => article.id));
    }
  };

  ArticleManagement.displayName = "ArticleManagement";

  return (
    <div className="article-management">
      <div className="page-header">
        <h1 className="page-title">Article Management</h1>
        <div className="header-actions">
          <button className="btn-secondary">Import</button>
          <button className="btn-primary">Create Article</button>
        </div>
      </div>

      <div className="management-toolbar">
        <div className="toolbar-left">
          <label className="checkbox-container">
            <input 
              type="checkbox" 
              checked={selectedArticles.length === articles.length && articles.length > 0}
              onChange={handleSelectAll}
            />
            <span className="checkmark"></span>
            Select All
          </label>
          
          {selectedArticles.length > 0 && (
            <div className="bulk-actions">
              <span className="selected-count">{selectedArticles.length} selected</span>
              <button className="btn-bulk">Delete</button>
              <button className="btn-bulk">Publish</button>
              <button className="btn-bulk">Move to Draft</button>
            </div>
          )}
        </div>

        <div className="toolbar-right">
          <div className="search-box">
            <input type="text" placeholder="Search articles..." />
            <button className="search-btn">🔍</button>
          </div>
          <select className="filter-select">
            <option value="">All Status</option>
            <option value="Published">Published</option>
            <option value="Draft">Draft</option>
          </select>
        </div>
      </div>

      <div className="articles-table">
        <div className="table-header">
          <div className="col-checkbox"></div>
          <div className="col-title">Title</div>
          <div className="col-author">Author</div>
          <div className="col-genres">Genres</div>
          <div className="col-status">Status</div>
          <div className="col-date">Date</div>
          <div className="col-actions">Actions</div>
        </div>

        <div className="table-body">
          {articles.map(article => (
            <div key={article.id} className="table-row">
              <div className="col-checkbox">
                <label className="checkbox-container">
                  <input 
                    type="checkbox" 
                    checked={selectedArticles.includes(article.id)}
                    onChange={() => handleSelectArticle(article.id)}
                  />
                  <span className="checkmark"></span>
                </label>
              </div>
              
              <div className="col-title">
                <div className="article-title">{article.title}</div>
                <div className="article-description">{article.description}</div>
              </div>
              
              <div className="col-author">{article.author}</div>
              
              <div className="col-genres">
                <div className="genres-list">
                  {article.genres.map((genre, index) => (
                    <span key={index} className="genre-tag">{genre}</span>
                  ))}
                </div>
              </div>
              
              <div className="col-status">
                <span className={`status-badge ${article.status.toLowerCase()}`}>
                  {article.status}
                </span>
              </div>
              
              <div className="col-date">{article.date}</div>
              
              <div className="col-actions">
                <button className="action-btn edit">Edit</button>
                <button className="action-btn delete">Delete</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        .article-management {
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
          margin-bottom: 20px;
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

        .filter-select {
          padding: 8px 12px;
          border: 1px solid #d1d5db;
          border-radius: 6px;
          font-size: 14px;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }

        .articles-table {
          background: white;
          border-radius: 8px;
          border: 1px solid #e5e7eb;
          overflow: hidden;
        }

        .table-header {
          display: grid;
          grid-template-columns: 50px 2fr 120px 150px 100px 120px 120px;
          background: #f9fafb;
          padding: 16px;
          border-bottom: 1px solid #e5e7eb;
          font-weight: 600;
          font-size: 14px;
          color: #374151;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }

        .table-row {
          display: grid;
          grid-template-columns: 50px 2fr 120px 150px 100px 120px 120px;
          padding: 16px;
          border-bottom: 1px solid #e5e7eb;
          align-items: center;
        }

        .table-row:hover {
          background: #f9fafb;
        }

        .article-title {
          font-weight: 500;
          color: #1a1a1a;
          margin-bottom: 4px;
          font-size: 14px;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }

        .article-description {
          color: #6b7280;
          font-size: 12px;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }

        .genres-list {
          display: flex;
          gap: 4px;
          flex-wrap: wrap;
        }

        .genre-tag {
          background: #e0e7ff;
          color: #3730a3;
          padding: 2px 6px;
          border-radius: 4px;
          font-size: 11px;
          font-weight: 500;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }

        .status-badge {
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 12px;
          font-weight: 500;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }

        .status-badge.published {
          background: #dcfce7;
          color: #166534;
        }

        .status-badge.draft {
          background: #fef3c7;
          color: #92400e;
        }

        .action-btn {
          padding: 4px 8px;
          border: none;
          border-radius: 4px;
          font-size: 12px;
          cursor: pointer;
          margin-right: 4px;
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

        @media (max-width: 768px) {
          .table-header,
          .table-row {
            grid-template-columns: 1fr;
            gap: 8px;
          }

          .col-checkbox,
          .col-title,
          .col-author,
          .col-genres,
          .col-status,
          .col-date,
          .col-actions {
            display: block;
          }

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
        }
      `}</style>
    </div>
  );
};

export default ArticleManagement;
