import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useApi } from '../../hooks/useApi';

const ArticleManagement = () => {
  const { fetchPosts, loading } = useApi();
  const [articles, setArticles] = useState([]);
  const [selectedArticles, setSelectedArticles] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [genreFilter, setGenreFilter] = useState('');

  // Fetch articles from database
  useEffect(() => {
    const loadArticles = async () => {
      try {
        const result = await fetchPosts({
          page: 1,
          limit: 50
        });
        setArticles(result.data || []);
      } catch (error) {
        console.error('Failed to load articles:', error);
      }
    };
    
    loadArticles();
  }, []);

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

  // Filter articles based on search and filters
  const filteredArticles = articles.filter(article => {
    const matchesSearch = article.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         article.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !statusFilter || article.status === statusFilter;
    const matchesGenre = !genreFilter || 
                        article.genres?.some(genre => genre.name === genreFilter);
    
    return matchesSearch && matchesStatus && matchesGenre;
  });

  // Get unique genres from articles
  const genres = [...new Set(
    articles.flatMap(article => 
      article.genres?.map(genre => genre.name) || []
    )
  )];

  ArticleManagement.displayName = "ArticleManagement";

  return (
    <div className="bg-stone-100 min-h-screen">
      {/* Page Header */}
      <div className="bg-stone-100 px-8 py-6 border-b-2 border-stone-300">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Article Management</h1>
          <Link 
            to="/admin/articles/create"
            className="px-6 py-2 bg-stone-800 text-white rounded-full hover:bg-stone-900 transition-colors inline-block"
          >
            + Create Article
          </Link>
        </div>
      </div>

      <div className="mx-8 p-8 min-h-[calc(100vh-120px)]">
        {/* Search and Filters */}
        <div className="mb-6">
          <div className="flex gap-4 items-center">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search articles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-stone-500 focus:border-stone-500"
              />
            </div>
            <div className="flex gap-3">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-stone-500 focus:border-stone-500"
              >
                <option value="">All Status</option>
                <option value="Published">Published</option>
                <option value="Draft">Draft</option>
                <option value="Archived">Archived</option>
              </select>
              <select
                value={genreFilter}
                onChange={(e) => setGenreFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-stone-500 focus:border-stone-500"
              >
                <option value="">All Genres</option>
                {genres.map(genre => (
                  <option key={genre} value={genre}>{genre}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Articles Table */}
        <div className="bg-white rounded-lg border border-stone-200 overflow-hidden">
          {loading ? (
            <div className="p-8 text-center">
              <div className="text-gray-500">Loading articles...</div>
            </div>
          ) : (
            <>
              {/* Table Header */}
              <div className="bg-stone-50 border-b border-stone-200">
                <div className="grid grid-cols-12 gap-4 px-6 py-4 text-sm font-medium text-gray-700">
                  <div className="col-span-1">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={selectedArticles.length === filteredArticles.length && filteredArticles.length > 0}
                        onChange={handleSelectAll}
                        className="mr-2"
                      />
                      Select All
                    </label>
                  </div>
                  <div className="col-span-4">Article Title</div>
                  <div className="col-span-2">Genre</div>
                  <div className="col-span-2">Status</div>
                  <div className="col-span-2">Date</div>
                  <div className="col-span-1">Actions</div>
                </div>
              </div>

              {/* Table Body */}
              <div className="divide-y divide-stone-200">
                {filteredArticles.length === 0 ? (
                  <div className="p-8 text-center text-gray-500">
                    No articles found
                  </div>
                ) : (
                  filteredArticles.map(article => (
                    <div key={article.id} className="grid grid-cols-12 gap-4 px-6 py-4 hover:bg-stone-50">
                      <div className="col-span-1 flex items-center">
                        <input
                          type="checkbox"
                          checked={selectedArticles.includes(article.id)}
                          onChange={() => handleSelectArticle(article.id)}
                          className="mr-2"
                        />
                      </div>
                      
                      <div className="col-span-4">
                        <div className="font-medium text-gray-900 truncate">
                          {article.title || 'Untitled'}
                        </div>
                        <div className="text-sm text-gray-500 truncate">
                          {article.description || 'No description'}
                        </div>
                      </div>
                      
                      <div className="col-span-2">
                        <div className="flex flex-wrap gap-1">
                          {article.genres?.slice(0, 2).map((genre, index) => (
                            <span
                              key={index}
                              className="px-2 py-1 bg-stone-100 text-stone-700 text-xs rounded-full"
                            >
                              {genre.name}
                            </span>
                          ))}
                          {article.genres?.length > 2 && (
                            <span className="text-xs text-gray-500">
                              +{article.genres.length - 2} more
                            </span>
                          )}
                        </div>
                      </div>
                      
                      <div className="col-span-2">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          article.status === 'Published' 
                            ? 'bg-green-100 text-green-800'
                            : article.status === 'Draft'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {article.status || 'Draft'}
                        </span>
                      </div>
                      
                      <div className="col-span-2 text-sm text-gray-500">
                        {article.date ? new Date(article.date).toLocaleDateString() : 'No date'}
                      </div>
                      
                      <div className="col-span-1 flex gap-2">
                        <button className="text-gray-400 hover:text-stone-600">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button className="text-gray-400 hover:text-red-600">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </>
          )}
        </div>

        {/* Bulk Actions */}
        {selectedArticles.length > 0 && (
          <div className="mt-4 p-4 bg-stone-50 rounded-lg border border-stone-200">
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">
                {selectedArticles.length} article(s) selected
              </span>
              <div className="flex gap-2">
                <button className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded hover:bg-green-200">
                  Publish
                </button>
                <button className="px-3 py-1 bg-yellow-100 text-yellow-800 text-sm rounded hover:bg-yellow-200">
                  Move to Draft
                </button>
                <button className="px-3 py-1 bg-red-100 text-red-800 text-sm rounded hover:bg-red-200">
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ArticleManagement;