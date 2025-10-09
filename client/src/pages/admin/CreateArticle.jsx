import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/authentication.jsx';
import axios from 'axios';
import CustomDropdown from '../../components/ui/CustomDropdown';

const CreateArticle = () => {
  const navigate = useNavigate();
  const { state } = useAuth();
  const { user } = state;
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [genres, setGenres] = useState([]);
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    content: '',
    genre_ids: [],
    author_name: user?.name || '',
    image: ''
  });

  // Fetch available genres
  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const apiBase = import.meta.env.VITE_API_BASE_URL || "http://localhost:4001/api";
        const response = await axios.get(`${apiBase}/genres`);
        setGenres(response.data.data || []);
      } catch (error) {
        console.error('Failed to fetch genres:', error);
      }
    };
    
    fetchGenres();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenreChange = (selectedGenreNames) => {
    setSelectedGenres(selectedGenreNames);
    // Convert genre names to IDs
    const selectedIds = selectedGenreNames.map(name => {
      const genre = genres.find(g => g.name === name);
      return genre ? genre.id : null;
    }).filter(id => id !== null);
    
    setFormData(prev => ({
      ...prev,
      genre_ids: selectedIds
    }));
  };

  const handleSubmit = async (publish = false) => {
    if (!formData.title.trim()) {
      alert('Please enter a title');
      return;
    }
    
    if (!formData.description.trim()) {
      alert('Please enter an introduction');
      return;
    }
    
    if (!formData.content.trim()) {
      alert('Please enter content');
      return;
    }

    if (formData.genre_ids.length === 0) {
      alert('Please select at least one genre');
      return;
    }

    if (!selectedFile) {
      alert('Please upload a thumbnail image');
      return;
    }

    setIsSubmitting(true);
    const apiBase = import.meta.env.VITE_API_BASE_URL || "http://localhost:4001/api";

    try {
      // Upload image first
      const imageFormData = new FormData();
      imageFormData.append('profilePicture', selectedFile);

      let imageUrl = '';
      try {
        const imageResponse = await axios.post(`${apiBase}/profiles/upload-image`, imageFormData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        imageUrl = imageResponse.data.imageUrl;
      } catch (imageError) {
        console.error('Image upload failed:', imageError);
        alert('Failed to upload image. Please try again.');
        setIsSubmitting(false);
        return;
      }

      // Send genre_ids and author_id according to ERD
      const submitData = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        content: formData.content.trim(),
        genre_ids: formData.genre_ids, // Send all selected genres
        author_id: user?.id, // Use user ID from auth
        status_id: publish ? 1 : 2, // 1 = Published, 2 = Draft
        image: imageUrl
      };

      const response = await axios.post(`${apiBase}/posts`, submitData);

      if (response.data.success) {
        alert(publish ? 'Article published successfully!' : 'Article saved as draft!');
        navigate('/admin/articles');
      }
    } catch (error) {
      console.error('Submit error:', error);
      alert('Failed to save article: ' + (error.response?.data?.error || error.message));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate('/admin/articles');
  };

  CreateArticle.displayName = "CreateArticle";

  return (
    <div className="bg-stone-100 min-h-screen">
      {/* Page Header */}
      <div className="bg-stone-100 px-8 py-6 border-b-2 border-stone-300">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Create article</h1>
          <div className="flex gap-3">
            <button 
              className="px-6 py-2 bg-stone-100 text-stone-700 rounded-lg hover:bg-stone-200 transition-colors"
              onClick={handleCancel}
            >
              Cancel
            </button>
            <button 
              className="px-6 py-2 bg-stone-100 text-stone-700 rounded-lg hover:bg-stone-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={() => handleSubmit(false)}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Saving...' : 'Save as draft'}
            </button>
            <button 
              className="px-6 py-2 bg-stone-800 text-white rounded-lg hover:bg-stone-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={() => handleSubmit(true)}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Publishing...' : 'Save and publish'}
            </button>
          </div>
        </div>
      </div>

      <div className="p-8 min-h-[calc(100vh-120px)]">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Thumbnail Image Section */}
          <div>
            <label className="block text-lg font-medium text-gray-700 mb-4">
              Thumbnail Image
            </label>
            <div className="flex items-center gap-6">
              <div className="w-48 h-32 bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden">
                {previewUrl ? (
                  <img 
                    src={previewUrl} 
                    alt="Preview" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                )}
              </div>
              <div>
                <input 
                  type="file" 
                  id="thumbnail-input"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <label 
                  htmlFor="thumbnail-input"
                  className="inline-block px-6 py-2 bg-white border border-stone-800 text-stone-800 rounded-lg hover:bg-stone-50 transition-colors cursor-pointer font-medium"
                >
                  Upload thumbnail image
                </label>
                {selectedFile && (
                  <p className="mt-2 text-sm text-gray-600">{selectedFile.name}</p>
                )}
              </div>
            </div>
          </div>

          {/* Genre Selection */}
          <div>
            <CustomDropdown
              label="Genre"
              options={genres.map(genre => genre.name)}
              value={selectedGenres}
              onChange={handleGenreChange}
              placeholder="Select genres..."
              multiple={true}
              searchable={true}
              showAllOption={true}
              className="w-full"
            />
          </div>

          {/* Author Name */}
          <div>
            <label className="block text-lg font-medium text-gray-700 mb-4">
              Author name
            </label>
            <input
              type="text"
              name="author_name"
              value={formData.author_name}
              readOnly
              className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white/50 text-stone-400"
              placeholder="Author name"
            />
          </div>

          {/* Title */}
          <div>
            <label className="block text-lg font-medium text-gray-700 mb-4">
              Title
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white focus:ring-2 focus:ring-gray-500 focus:border-gray-500 transition-colors"
              placeholder="Article title"
            />
          </div>

          {/* Introduction */}
          <div>
            <label className="block text-lg font-medium text-gray-700 mb-4">
              Introduction (max 120 letters)
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              maxLength={120}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white focus:ring-2 focus:ring-gray-500 focus:border-gray-500 transition-colors resize-none"
              placeholder="Introduction"
            />
            <div className="mt-2 text-sm text-gray-500 text-right">
              {formData.description.length}/120 characters
            </div>
          </div>

          {/* Content */}
          <div>
            <label className="block text-lg font-medium text-gray-700 mb-4">
              Content
            </label>
            <textarea
              name="content"
              value={formData.content}
              onChange={handleInputChange}
              rows={12}
              className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white focus:ring-2 focus:ring-gray-500 focus:border-gray-500 transition-colors resize-none"
              placeholder="Content"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateArticle;
