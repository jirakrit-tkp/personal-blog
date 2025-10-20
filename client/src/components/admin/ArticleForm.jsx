import React, { useState, useEffect } from 'react';
import { Star } from 'lucide-react';
import Rating from 'react-rating';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/authentication.jsx';
import axios from 'axios';
import CustomDropdown from '../ui/CustomDropdown';
import FormInput from '../ui/FormInput';
import FormTextarea from '../ui/FormTextarea';
import { AdminNavbar } from './index.js';
import ConfirmModal from '../ui/ConfirmModal';
import Snackbar from '../ui/Snackbar';

const ArticleForm = ({ mode = 'create', postId = null }) => {
  const navigate = useNavigate();
  const { state } = useAuth();
  const { user } = state;
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(mode === 'edit');
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [snackbar, setSnackbar] = useState({ isOpen: false, message: '', type: 'success' });
  const [genres, setGenres] = useState([]);
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [validationErrors, setValidationErrors] = useState({});
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    content: '',
    genre_ids: [],
    author_name: user?.name || '',
    image: '',
    imhb_score: 0 // 0-10 (from 5 stars)
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

  // Fetch post data for edit mode
  useEffect(() => {
    if (mode === 'edit' && postId) {
      const fetchPost = async () => {
        try {
          const apiBase = import.meta.env.VITE_API_BASE_URL || "http://localhost:4001/api";
          const response = await axios.get(`${apiBase}/posts/${postId}`);
          
          if (response.data.success) {
            const post = response.data.data;
            setFormData({
              title: post.title || '',
              description: post.description || '',
              content: post.content || '',
              genre_ids: post.genres?.map(g => g.id) || [],
              author_name: post.author_name || user?.name || '',
              image: post.image || '',
              imhb_score: post.imhb_score || 0
            });
            
            // Set selected genres
            setSelectedGenres(post.genres?.map(g => g.name) || []);
            
            // Set preview image if exists
            if (post.image) {
              setPreviewUrl(post.image);
            }
          }
        } catch (error) {
          console.error('Failed to fetch post:', error);
          setSnackbar({
            isOpen: true,
            message: 'Failed to load post data',
            type: 'error'
          });
          navigate('/admin/articles');
        } finally {
          setIsLoading(false);
        }
      };
      
      fetchPost();
    }
  }, [mode, postId, user?.name, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear validation error when user starts typing
    if (validationErrors[name]) {
      setValidationErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
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

      // Clear validation error when user uploads image
      if (validationErrors.image) {
        setValidationErrors(prev => ({
          ...prev,
          image: ''
        }));
      }
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

    // Clear validation error when user selects genres
    if (validationErrors.genres) {
      setValidationErrors(prev => ({
        ...prev,
        genres: ''
      }));
    }
  };

  const handleSubmit = async (publish = false) => {
    const errors = {};
    
    // Only validate required fields when publishing
    if (publish) {
      if (!formData.title.trim()) {
        errors.title = 'Title is required';
      }
      
      if (!formData.description.trim()) {
        errors.description = 'Introduction is required';
      }
      
      if (!formData.content.trim()) {
        errors.content = 'Content is required';
      }

      if (formData.genre_ids.length === 0) {
        errors.genres = 'At least one genre is required';
      }

      if (mode === 'create' && !selectedFile && !formData.image) {
        errors.image = 'Thumbnail image is required';
      }

      if (!formData.imhb_score || formData.imhb_score === 0) {
        errors.rating = 'IMHb rating is required';
      }
    } else {
      // For draft, only require title
      if (!formData.title.trim()) {
        errors.title = 'Title is required (even for draft)';
      }
    }

    setValidationErrors(errors);

    if (Object.keys(errors).length > 0) {
      setSnackbar({
        isOpen: true,
        message: publish ? 'Please fill in all required fields' : 'Title is required',
        type: 'error'
      });
      return;
    }

    setIsSubmitting(true);
    const apiBase = import.meta.env.VITE_API_BASE_URL || "http://localhost:4001/api";

    try {
      let imageUrl = formData.image; // Use existing image for edit mode

      // Upload new image if file is selected
      if (selectedFile) {
        const imageFormData = new FormData();
        imageFormData.append('profilePicture', selectedFile);

        try {
          const imageResponse = await axios.post(`${apiBase}/profiles/upload-image`, imageFormData, {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          });
          imageUrl = imageResponse.data.imageUrl;
        } catch (imageError) {
          console.error('Image upload failed:', imageError);
          setSnackbar({
            isOpen: true,
            message: 'Failed to upload image. Please try again.',
            type: 'error'
          });
          setIsSubmitting(false);
          return;
        }
      }

      if (mode === 'create') {
        // Create new post
        const submitData = {
          title: formData.title.trim(),
          description: formData.description.trim(),
          content: formData.content.trim(),
          genre_ids: formData.genre_ids,
          author_id: user?.id,
          status_id: publish ? 2 : 1, // 1 = Draft, 2 = Published
          image: imageUrl
        };

        const response = await axios.post(`${apiBase}/posts`, submitData);

        if (response.data.success) {
          const newPostId = response.data.data.id;
          
          // สร้าง rating record สำหรับ admin (ถ้ามี)
          if (formData.imhb_score && formData.imhb_score > 0) {
            await axios.post(`${apiBase}/posts/${newPostId}/ratings`, {
              rating: formData.imhb_score,
              user_id: user?.id
            });
          }

          setSnackbar({
            isOpen: true,
            message: publish ? 'Article published successfully!' : 'Article saved as draft!',
            type: 'success'
          });
          setTimeout(() => navigate('/admin/articles'), 2000);
        }
      } else {
        // Update existing post
        const submitData = {
          title: formData.title.trim(),
          description: formData.description.trim(),
          content: formData.content.trim(),
          genre_ids: formData.genre_ids,
          status_id: publish ? 2 : 1, // 1 = Draft, 2 = Published
          image: imageUrl
        };

        const response = await axios.put(`${apiBase}/posts/${postId}`, submitData);

        if (response.data.success) {
          // อัปเดต rating ของ admin (ถ้ามี)
          if (formData.imhb_score && formData.imhb_score > 0) {
            await axios.post(`${apiBase}/posts/${postId}/ratings`, {
              rating: formData.imhb_score,
              user_id: user?.id
            });
          }

          setSnackbar({
            isOpen: true,
            message: publish ? 'Article published successfully!' : 'Article updated successfully!',
            type: 'success'
          });
          setTimeout(() => navigate('/admin/articles'), 2000);
        }
      }
    } catch (error) {
      console.error('Submit error:', error);
      setSnackbar({
        isOpen: true,
        message: 'Failed to save article: ' + (error.response?.data?.error || error.message),
        type: 'error'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate('/admin/articles');
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, isOpen: false }));
  };

  // IMHb Star Rating Handler
  const handleStarClick = (rating) => {
    // If clicking the same rating, cancel it (set to 0)
    const currentRating = formData.imhb_score / 2;
    const newScore = rating === currentRating ? 0 : rating * 2;
    
    setFormData(prev => ({
      ...prev,
      imhb_score: newScore // Convert 5 stars to 10-point scale
    }));

    // Clear validation error when user selects rating
    if (validationErrors.rating && newScore > 0) {
      setValidationErrors(prev => ({
        ...prev,
        rating: ''
      }));
    }
  };

  const handleStarChange = (rating) => {
    // This is called when hovering/selecting different rating
    setFormData(prev => ({
      ...prev,
      imhb_score: rating * 2 // Convert 5 stars to 10-point scale
    }));

    // Clear validation error when user selects rating
    if (validationErrors.rating) {
      setValidationErrors(prev => ({
        ...prev,
        rating: ''
      }));
    }
  };

  if (isLoading) {
    return (
      <div className="bg-stone-100 min-h-screen flex items-center justify-center">
        <div className="text-lg text-stone-600">Loading...</div>
      </div>
    );
  }

  const pageTitle = mode === 'create' ? 'Create article' : 'Edit article';
  const submitButtonText = mode === 'create' 
    ? (publish => publish ? 'Save and publish' : 'Save as draft')
    : (publish => publish ? 'Update and publish' : 'Update draft');

  return (
    <div className="bg-stone-100 min-h-screen">
      <AdminNavbar 
        title={pageTitle}
        actions={
          <>
            <button 
              className="px-6 py-2 bg-stone-100 text-stone-700 rounded-full hover:bg-stone-200 transition-colors"
              onClick={handleCancel}
            >
              Cancel
            </button>
            <button 
              className="px-6 py-2 bg-stone-100 text-stone-700 rounded-full hover:bg-stone-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={() => handleSubmit(false)}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Saving...' : submitButtonText(false)}
            </button>
            <button 
              className="px-6 py-2 bg-stone-800 text-white rounded-full hover:bg-stone-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={() => handleSubmit(true)}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Publishing...' : submitButtonText(true)}
            </button>
          </>
        }
      />

      <div className="mx-8 p-8 min-h-[calc(100vh-120px)]">
        <div className="space-y-6">
          {/* Thumbnail Image Section */}
          <div>
            <label className="block text-base font-medium text-stone-700 mb-4">
              Thumbnail Image
              {validationErrors.image && <span className="text-red-500 ml-1">*</span>}
            </label>
            <div className="flex items-end gap-6">
              <div className={`w-1/2 h-[260px] bg-stone-200 rounded-lg border-2 border-dashed ${validationErrors.image ? 'border-red-500' : 'border-stone-400'} flex items-center justify-center overflow-hidden`}>
                {previewUrl ? (
                  <img 
                    src={previewUrl} 
                    alt="Preview" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <svg className="w-12 h-12 text-stone-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                  className="inline-block text-base px-6 py-2 bg-white border border-stone-800 text-stone-800 rounded-full hover:bg-stone-50 transition-colors cursor-pointer font-medium"
                >
                  {mode === 'create' ? 'Upload thumbnail image' : 'Change thumbnail image'}
                </label>
                {selectedFile && (
                  <p className="mt-2 text-sm text-stone-600">{selectedFile.name}</p>
                )}
              </div>
            </div>
          </div>

          {/* Genre Selection */}
          <div>
            <CustomDropdown
              label={`Genre ${validationErrors.genres ? '*' : ''}`}
              options={genres.map(genre => genre.name)}
              value={selectedGenres}
              onChange={handleGenreChange}
              placeholder="Select genres..."
              multiple={true}
              searchable={true}
              showAllOption={true}
              className="w-1/2"
              hasError={!!validationErrors.genres}
            />
          </div>

          {/* Author Name */}
          <FormInput
            label="Author name"
            type="text"
            name="author_name"
            value={formData.author_name}
            readOnly
            placeholder="Author name"
            className="w-1/2"
          />

          {/* Title */}
          <FormInput
            label="Title"
            type="text"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            placeholder="Article title"
            className="w-full"
            hasError={!!validationErrors.title}
          />

          {/* Introduction */}
          <FormTextarea
            label="Introduction (max 120 letters)"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Introduction"
            rows={4}
            maxLength={120}
            showCharCount={true}
            className="w-full"
            hasError={!!validationErrors.description}
          />

          {/* Content */}
          <FormTextarea
            label="Content"
            name="content"
            value={formData.content}
            onChange={handleInputChange}
            placeholder="Content"
            rows={12}
            showMarkdownToolbar={true}
            className="w-full"
            hasError={!!validationErrors.content}
          />

          {/* Scores Section */}
          <div>
            {/* IMHb Score Rating */}
            <div className="mb-2">
              <div className="flex items-center gap-3">
                <span className="text-base font-medium text-stone-500">IMHb</span>
                <Rating
                  fractions={2}
                  emptySymbol={<Star className={`w-6 h-6 ${validationErrors.rating ? 'stroke-red-500' : 'stroke-stone-300'}`} />}
                  fullSymbol={<Star className="w-6 h-6 fill-yellow-400 stroke-yellow-400" />}
                  initialRating={formData.imhb_score / 2}
                  onChange={handleStarChange}
                  onClick={handleStarClick}
                />
              </div>
            </div>
          </div>
        </div>
      </div>


      {/* Snackbar */}
      <Snackbar
        isOpen={snackbar.isOpen}
        onClose={handleCloseSnackbar}
        message={snackbar.message}
        type={snackbar.type}
      />
    </div>
  );
};

ArticleForm.displayName = "ArticleForm";

export default ArticleForm;
