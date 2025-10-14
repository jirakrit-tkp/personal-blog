import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApi } from '../../hooks/useApi';
import { AdminNavbar } from '../../components/admin';
import { Pencil, Trash2 } from 'lucide-react';
import CustomDropdown from '../../components/ui/CustomDropdown';
import ConfirmModal from '../../components/ui/ConfirmModal';
import Snackbar from '../../components/ui/Snackbar';

const ArticleManagement = () => {
  const navigate = useNavigate();
  const { fetchPosts, loading } = useApi();
  const [articles, setArticles] = useState([]);
  const [selectedArticles, setSelectedArticles] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [genreFilter, setGenreFilter] = useState('');
  const [genres, setGenres] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [articleToDelete, setArticleToDelete] = useState(null);
  const [snackbar, setSnackbar] = useState({ isOpen: false, message: '', type: 'success' });

  // Fetch genres from database
  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const apiBase = import.meta.env.VITE_API_BASE_URL || "http://localhost:4001/api";
        const response = await fetch(`${apiBase}/genres`);
        const data = await response.json();
        if (data.success) {
          setGenres(data.data.map(genre => genre.name));
        }
      } catch (error) {
        console.error('Failed to load genres:', error);
      }
    };
    
    fetchGenres();
  }, []);

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

  const handleDeleteClick = (articleId) => {
    setArticleToDelete(articleId);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!articleToDelete) return;

    try {
      const apiBase = import.meta.env.VITE_API_BASE_URL || "http://localhost:4001/api";
      const response = await fetch(`${apiBase}/posts/${articleToDelete}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        throw new Error('Failed to delete article');
      }

      // Remove article from state
      setArticles(prev => prev.filter(article => article.id !== articleToDelete));
      
      // Remove from selected if it was selected
      setSelectedArticles(prev => prev.filter(id => id !== articleToDelete));
      
      setSnackbar({
        isOpen: true,
        message: 'Article deleted successfully',
        type: 'success'
      });
    } catch (error) {
      console.error('Error deleting article:', error);
      setSnackbar({
        isOpen: true,
        message: 'Failed to delete article',
        type: 'error'
      });
    } finally {
      setShowDeleteModal(false);
      setArticleToDelete(null);
    }
  };

  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
    setArticleToDelete(null);
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, isOpen: false }));
  };

  // Filter articles based on search and filters
  const filteredArticles = articles.filter(article => {
    const matchesSearch = article.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         article.description?.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Fix status mapping - use transformed status field
    const articleStatus = article.status || 'Draft';
    const matchesStatus = !statusFilter || statusFilter === 'All Status' || articleStatus === statusFilter;
    
    const matchesGenre = !genreFilter || genreFilter === 'All Genres' ||
                        article.genres?.some(genre => genre.name === genreFilter);
    
    return matchesSearch && matchesStatus && matchesGenre;
  });

  // Get unique statuses from articles
  const statuses = [...new Set(
    articles.map(article => article.status).filter(Boolean)
  )];

  // Get unique genres from articles (only those actually used)
  const articleGenres = [...new Set(
    articles.flatMap(article => 
      article.genres?.map(genre => genre.name) || []
    )
  )];

  ArticleManagement.displayName = "ArticleManagement";

  return (
    <div className="bg-stone-100 min-h-screen">
      <AdminNavbar 
        title="Article Management"
        actions={
          <Link
            to="/admin/articles/create"
            className="px-6 py-2 bg-stone-800 text-white rounded-full hover:bg-stone-900 transition-colors inline-block"
          >
            + Create Article
          </Link>
        }
      />

      <div className="mx-8 p-8 min-h-[calc(100vh-120px)]">
         {/* Search and Filters */}
         <div className="mb-6 [&>*]:mb-0">
           <div className="flex gap-4 items-center">
             <div className="flex-1">
               <input
                 type="text"
                 placeholder="Search..."
                 value={searchTerm}
                 onChange={(e) => setSearchTerm(e.target.value)}
                 className="w-1/2 h-10 px-4 py-2 bg-white border border-stone-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
               />
             </div>
             <div className="flex gap-3">
                <div className="h-10 flex items-center">
                  <CustomDropdown
                    label=""
                    options={['All Status', ...statuses]}
                    value={statusFilter || 'All Status'}
                    onChange={setStatusFilter}
                    placeholder="Status"
                    className="w-32 [&>label]:mb-0"
                  />
                </div>
                <div className="h-10 flex items-center">
                  <CustomDropdown
                    label=""
                    options={['All Genres', ...articleGenres]}
                    value={genreFilter || 'All Genres'}
                    onChange={setGenreFilter}
                    placeholder="Genre"
                    className="w-32 [&>label]:mb-0"
                  />
                </div>
             </div>
           </div>
         </div>

        {/* Articles Table */}
        <div className="bg-white rounded-lg border border-stone-200 overflow-hidden">
          {loading ? (
            <div className="p-8 text-center">
              <div className="text-stone-500">Loading articles...</div>
            </div>
          ) : (
            <>
              {/* Table Header */}
              <div className="bg-stone-50 border-b border-stone-200">
                <div className="grid grid-cols-12 gap-4 px-6 py-4 text-sm font-medium text-stone-700">
                  <div className="col-span-6">Article title</div>
                  <div className="col-span-3">Genre</div>
                  <div className="col-span-2">Status</div>
                  <div className="col-span-1"></div>
                </div>
              </div>

              {/* Table Body */}
              <div className="divide-y divide-stone-200">
                {filteredArticles.length === 0 ? (
                  <div className="p-8 text-center text-stone-500">
                    No articles found
                  </div>
                ) : (
                  filteredArticles.map(article => (
                    <div key={article.id} className="grid grid-cols-12 gap-4 px-6 py-4 hover:bg-stone-50">
                      <div className="col-span-6">
                        <div className="font-medium text-stone-900 truncate">
                          {article.title || 'Untitled'}
                        </div>
                        <div className="text-sm text-stone-500 truncate">
                          {article.description || 'No description'}
                        </div>
                      </div>
                      
                      <div className="col-span-3">
                        <div className="flex flex-wrap gap-1">
                          {article.genres?.map((genre, index) => (
                            <span
                              key={index}
                              className="px-2 py-1 bg-stone-100 text-stone-700 text-xs rounded-full"
                            >
                              {genre.name}
                            </span>
                          ))}
                        </div>
                      </div>
                      
                      <div className="col-span-2">
                        <div className="flex items-center gap-1">
                          <div className={`w-2 h-2 rounded-full ${
                            article.status === 'published' 
                              ? 'bg-green-500' 
                              : 'bg-stone-400'
                          }`}></div>
                          <span className={`text-sm ${
                            article.status === 'published' 
                              ? 'text-green-600' 
                              : 'text-stone-600'
                          }`}>
                            {article.status || 'Draft'}
                          </span>
                        </div>
                      </div>
                      
                      <div className="col-span-1 flex gap-6">
                        <button 
                          className="text-stone-400 hover:text-stone-600 cursor-pointer"
                          onClick={() => navigate(`/admin/articles/edit/${article.id}`)}
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button 
                          className="text-stone-400 hover:text-red-600 cursor-pointer"
                          onClick={() => handleDeleteClick(article.id)}
                        >
                          <Trash2 className="w-4 h-4" />
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
              <span className="text-sm text-stone-600">
                {selectedArticles.length} article(s) selected
              </span>
              <div className="flex gap-2">
                <button className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full hover:bg-green-200">
                  Publish
                </button>
                <button className="px-3 py-1 bg-yellow-100 text-yellow-800 text-sm rounded-full hover:bg-yellow-200">
                  Move to Draft
                </button>
                <button className="px-3 py-1 bg-red-100 text-red-800 text-sm rounded-full hover:bg-red-200">
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Confirm Modal */}
        <ConfirmModal
          isOpen={showDeleteModal}
          onClose={handleCloseDeleteModal}
          onConfirm={handleDeleteConfirm}
          title="Delete article"
          message="Do you want to delete this article?"
          confirmText="Delete"
          cancelText="Cancel"
        />

        {/* Snackbar */}
        <Snackbar
          isOpen={snackbar.isOpen}
          onClose={handleCloseSnackbar}
          message={snackbar.message}
          type={snackbar.type}
        />
      </div>
    </div>
  );
};

export default ArticleManagement;