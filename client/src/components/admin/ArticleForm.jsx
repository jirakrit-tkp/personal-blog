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

const ArticleForm = ({ mode = 'create', postId = null }) => {
  const navigate = useNavigate();
  const { state } = useAuth();
  const { user } = state;
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(mode === 'edit');
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
          alert('Failed to load post data');
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

    if (mode === 'create' && !selectedFile) {
      alert('Please upload a thumbnail image');
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
          alert('Failed to upload image. Please try again.');
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
          
          // สร้าง rating record สำหรับ admin
          await axios.post(`${apiBase}/posts/${newPostId}/ratings`, {
            rating: formData.imhb_score,
            user_id: user?.id
          });

          alert(publish ? 'Article published successfully!' : 'Article saved as draft!');
          navigate('/admin/articles');
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
          // อัปเดต rating ของ admin
          await axios.post(`${apiBase}/posts/${postId}/ratings`, {
            rating: formData.imhb_score,
            user_id: user?.id
          });

          alert(publish ? 'Article published successfully!' : 'Article updated successfully!');
          navigate('/admin/articles');
        }
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

  // IMHb Star Rating Handler
  const handleStarChange = (rating) => {
    setFormData(prev => ({
      ...prev,
      imhb_score: rating * 2 // Convert 5 stars to 10-point scale
    }));
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
            </label>
            <div className="flex items-end gap-6">
              <div className="w-1/2 h-[260px] bg-stone-200 rounded-lg border-2 border-dashed border-stone-400 flex items-center justify-center overflow-hidden">
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
              label="Genre"
              options={genres.map(genre => genre.name)}
              value={selectedGenres}
              onChange={handleGenreChange}
              placeholder="Select genres..."
              multiple={true}
              searchable={true}
              showAllOption={true}
              className="w-1/2"
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
          />

          {/* Scores Section */}
          <div>
            {/* IMHb Score Rating */}
            <div className="mb-2">
              <div className="flex items-center gap-3">
                <span className="text-base font-medium text-stone-500">IMHb</span>
                <Rating
                  fractions={2}
                  emptySymbol={<Star className="w-6 h-6 stroke-stone-200" />}
                  fullSymbol={<Star className="w-6 h-6 fill-yellow-400 stroke-yellow-400" />}
                  initialRating={formData.imhb_score / 2}
                  onChange={handleStarChange}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

ArticleForm.displayName = "ArticleForm";

export default ArticleForm;
