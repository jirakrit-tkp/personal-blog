import React, { useState } from 'react';
import { AdminNavbar } from '../../components/admin';
import { Pencil, Trash2 } from 'lucide-react';
import GenreModal from '../../components/ui/GenreModal';
import ConfirmModal from '../../components/ui/ConfirmModal';
import { colorKeyToClasses, getGenreChipClasses } from '../../lib/genreUtils';

const CategoryManagement = () => {
  const [genres, setGenres] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingGenre, setEditingGenre] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [genreToDelete, setGenreToDelete] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    color: 'green'
  });

  // Load genres from API
  React.useEffect(() => {
    const loadGenres = async () => {
      try {
        const apiBase = import.meta.env.VITE_API_BASE_URL || "http://localhost:4001/api";
        const res = await fetch(`${apiBase}/genres`);
        const json = await res.json();
        if (json?.success) {
          setGenres(json.data || []);
        }
      } catch (e) {
        console.error('Failed to fetch genres', e);
      }
    };
    loadGenres();
  }, []);

  // Handle form input changes
  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Handle edit button click
  const handleEditClick = (genre) => {
    setEditingGenre(genre);
    setFormData({
      name: genre.name,
      description: genre.description || '',
      color: genre.color || 'green'
    });
    setShowEditModal(true);
  };

  // Handle create button click
  const handleCreateClick = () => {
    setFormData({ name: '', description: '', color: 'green' });
    setShowCreateModal(true);
  };

  // Handle color selection
  const handleColorSelect = (colorKey) => {
    setFormData(prev => ({ ...prev, color: colorKey }));
  };

  // Handle form submission
  const handleSubmit = async (isEdit = false) => {
    try {
      const apiBase = import.meta.env.VITE_API_BASE_URL || "http://localhost:4001/api";
      const url = isEdit ? `${apiBase}/genres/${editingGenre.id}` : `${apiBase}/genres`;
      const method = isEdit ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        // Reload genres
        const res = await fetch(`${apiBase}/genres`);
        const json = await res.json();
        if (json?.success) {
          setGenres(json.data || []);
        }
        
        // Close modals
        setShowCreateModal(false);
        setShowEditModal(false);
        setEditingGenre(null);
        setFormData({ name: '', description: '', color: 'green' });
      }
    } catch (error) {
      console.error('Failed to save genre:', error);
    }
  };

  // Handle delete button click
  const handleDeleteClick = (genre) => {
    setGenreToDelete(genre);
    setShowDeleteModal(true);
  };

  // Handle delete confirmation
  const handleDeleteConfirm = async () => {
    if (!genreToDelete) return;

    try {
      const apiBase = import.meta.env.VITE_API_BASE_URL || "http://localhost:4001/api";
      const response = await fetch(`${apiBase}/genres/${genreToDelete.id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        // Reload genres
        const res = await fetch(`${apiBase}/genres`);
        const json = await res.json();
        if (json?.success) {
          setGenres(json.data || []);
        }
      }
    } catch (error) {
      console.error('Failed to delete genre:', error);
    } finally {
      setShowDeleteModal(false);
      setGenreToDelete(null);
    }
  };

  // Handle close delete modal
  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
    setGenreToDelete(null);
  };

  CategoryManagement.displayName = "CategoryManagement";

  return (
    <div className="bg-stone-100 min-h-screen">
      <AdminNavbar 
        title="Category Management"
        actions={
          <button
            onClick={handleCreateClick}
            className="px-6 py-2 bg-stone-800 text-white rounded-full hover:bg-stone-900 transition-colors"
          >
            + Create Genre
          </button>
        }
      />

      <div className="mx-8 p-8 min-h-[calc(100vh-120px)]">
        {/* Search */}
        <div className="mb-6">
          <div className="flex gap-4 items-center">
            <div className="flex-1">
            <input 
                type="text"
                placeholder="Search categories..."
                className="w-1/2 h-10 px-4 py-2 bg-white border border-stone-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              />
          </div>
        </div>
      </div>

        {/* Genres Table */}
        <div className="bg-white rounded-lg border border-stone-200 overflow-hidden">
          {/* Table Header */}
          <div className="bg-stone-50 border-b border-stone-200">
            <div className="grid grid-cols-12 gap-4 px-6 py-4 text-sm font-medium text-stone-700">
              <div className="col-span-5">Genre</div>
              <div className="col-span-6">Description</div>
              <div className="col-span-1"></div>
              </div>
            </div>

          {/* Table Body */}
          <div className="divide-y divide-stone-200">
            {genres.length === 0 ? (
              <div className="p-8 text-center text-stone-500">
                No categories found
                </div>
            ) : (
              genres.map(genre => (
                <div key={genre.id} className="grid grid-cols-12 gap-4 px-6 py-4 hover:bg-stone-50">
                  <div className="col-span-5 flex items-center">
                    <span className={`inline-block px-3 py-1 text-sm rounded-full ${getGenreChipClasses(genre)}`}>
                      {genre.name}
                    </span>
              </div>
                  <div className="col-span-6 text-sm text-stone-600">
                    {genre.description || '-'}
      </div>

                  <div className="col-span-1 flex gap-6 justify-end">
                    <button 
                      onClick={() => handleEditClick(genre)}
                      className="text-stone-400 hover:text-stone-600 cursor-pointer" 
                      aria-label="Edit genre"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
              <button 
                      onClick={() => handleDeleteClick(genre)}
                      className="text-stone-400 hover:text-red-600 cursor-pointer" 
                      aria-label="Delete genre"
              >
                      <Trash2 className="w-4 h-4" />
              </button>
            </div>
              </div>
              ))
            )}
              </div>
            </div>


        {/* Create Genre Modal */}
        <GenreModal
          isOpen={showCreateModal}
          onClose={() => {
            setShowCreateModal(false);
            setFormData({ name: '', description: '', color: 'green' });
          }}
          onSubmit={() => handleSubmit(false)}
          title="Create new genre"
          formData={formData}
          onInputChange={handleInputChange}
          onColorSelect={handleColorSelect}
          colorKeyToClasses={colorKeyToClasses}
          submitText="Create Genre"
          cancelText="Cancel"
        />

        {/* Edit Genre Modal */}
        <GenreModal
          isOpen={showEditModal}
          onClose={() => {
            setShowEditModal(false);
            setEditingGenre(null);
            setFormData({ name: '', description: '', color: 'green' });
          }}
          onSubmit={() => handleSubmit(true)}
          title="Edit genre"
          formData={formData}
          onInputChange={handleInputChange}
          onColorSelect={handleColorSelect}
          colorKeyToClasses={colorKeyToClasses}
          submitText="Update Genre"
          cancelText="Cancel"
        />

        {/* Delete Confirmation Modal */}
        <ConfirmModal
          isOpen={showDeleteModal}
          onClose={handleCloseDeleteModal}
          onConfirm={handleDeleteConfirm}
          title="Delete genre"
          message={`Do you want to delete "${genreToDelete?.name}"?`}
          confirmText="Delete"
          cancelText="Cancel"
        />
      </div>
    </div>
  );
};

export default CategoryManagement;
