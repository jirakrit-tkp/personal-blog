import React, { useState, useEffect, useRef } from 'react';
import { User, Upload } from 'lucide-react';
import { useAuth } from '../../context/authentication.jsx';
import { useNavigate } from 'react-router-dom';
import MemberLayout from '../../components/member/MemberLayout';
import FormInput from '../../components/ui/FormInput';
import axios from 'axios';
import Snackbar from '../../components/ui/Snackbar';

const Profile = () => {
  const { state, isAuthenticated, fetchUser } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    email: '',
    profilePic: null
  });
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});
  const [snackbar, setSnackbar] = useState({ isOpen: false, message: '', type: 'success' });
  const originalFormDataRef = useRef(null);
  const fileInputRef = useRef(null);

  Profile.displayName = "Profile";

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    // Load user data
    if (state?.user) {
      setFormData({
        name: state.user.name || '',
        username: state.user.username || '',
        email: state.user.email || '',
        profilePic: state.user.profilePic || null
      });
      originalFormDataRef.current = {
        name: state.user.name || '',
        username: state.user.username || '',
        email: state.user.email || '',
        profilePic: state.user.profilePic || null
      };
    }
  }, [isAuthenticated, state?.user, navigate]);

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
      // Validate image size (<= 2MB)
      const maxSizeBytes = 2 * 1024 * 1024;
      if (file.size > maxSizeBytes) {
        setValidationErrors(prev => ({ ...prev, image: 'Image size must be 2MB or less' }));
        setSnackbar({ isOpen: true, message: 'Image size must be 2MB or less', type: 'error' });
        // Reset input selection
        e.target.value = '';
        setSelectedFile(null);
        setPreviewUrl(null);
        return;
      }

      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);

      // Clear image validation error on successful selection
      if (validationErrors.image) {
        setValidationErrors(prev => ({
          ...prev,
          image: ''
        }));
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = {};

    if (!formData.name.trim()) {
      errors.name = 'Name is required';
    }
    if (!formData.username.trim()) {
      errors.username = 'Username is required';
    }

    setValidationErrors(errors);

    if (Object.keys(errors).length > 0) {
      setSnackbar({ isOpen: true, message: 'Please fill in all required fields', type: 'error' });
      return;
    }

    setLoading(true);
    
    const apiBase = import.meta.env.VITE_API_BASE_URL || "http://localhost:4001/api";

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('username', formData.username);
      formDataToSend.append('email', formData.email);
      
      if (selectedFile) {
        formDataToSend.append('profilePicture', selectedFile);
      }

      const response = await axios.put(`${apiBase}/profiles/${state.user.id}`, formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response.data.success) {
        await fetchUser(); // Refresh user data
        setSelectedFile(null);
        setPreviewUrl(null);
        setSnackbar({ isOpen: true, message: 'Profile updated successfully!', type: 'success' });
      }
    } catch (error) {
      console.error('Save error:', error);
      setSnackbar({ isOpen: true, message: 'Failed to update profile', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, isOpen: false }));
  };

  const handleCancel = () => {
    if (originalFormDataRef.current) {
      setFormData(originalFormDataRef.current);
    }
    setSelectedFile(null);
    setPreviewUrl(null);
    setValidationErrors({});
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    setSnackbar({ isOpen: true, message: 'Changes have been reset', type: 'info' });
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <MemberLayout>
      <div className="bg-stone-200 rounded-lg shadow-sm p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
        {/* Profile Picture */}
        <div className="flex flex-col lg:flex-row lg:items-center gap-6">
          <div className="flex justify-center lg:justify-start">
            <div className={`w-40 h-40 bg-stone-200 rounded-full flex items-center justify-center overflow-hidden border-2 ${validationErrors.image ? 'border-red-500' : 'border-transparent'}`}>
              {previewUrl || formData.profilePic ? (
                <img 
                  src={previewUrl || formData.profilePic} 
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <User className="w-12 h-12 text-stone-400" />
              )}
            </div>
          </div>
          <div className="flex flex-col items-center lg:items-start lg:flex-1">
            <input 
              type="file" 
              id="profile-picture-input"
              accept="image/*"
              onChange={handleFileChange}
              ref={fileInputRef}
              className="hidden"
            />
            <label 
              htmlFor="profile-picture-input"
              className="inline-block px-6 py-2 bg-white border border-stone-800 text-stone-800 rounded-full hover:bg-stone-50 transition-colors cursor-pointer font-medium"
            >
              {selectedFile ? 'Change Picture' : 'Upload profile picture'}
            </label>
            {selectedFile && (
              <span className="mt-2 text-sm text-stone-600">{selectedFile.name}</span>
            )}
            {validationErrors.image && (
              <div className="mt-2 text-sm text-red-600">{validationErrors.image}</div>
            )}
          </div>
        </div>

        {/* Divider */}
        <div className="border-b border-stone-300 my-6"></div>

          {/* Form Fields */}
          <div className="space-y-6">
            <FormInput
              type="text"
              name="name"
              label="Name"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full"
              hasError={!!validationErrors.name}
            />

            <FormInput
              type="text"
              name="username"
              label="Username"
              value={formData.username}
              onChange={handleInputChange}
              className="w-full"
              hasError={!!validationErrors.username}
            />

            <FormInput
              type="email"
              name="email"
              label="Email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full"
              disabled
            />
          </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center gap-3 justify-start">
          <button
            type="submit"
            disabled={loading}
            className="w-full sm:w-auto px-6 py-2 bg-stone-800 text-white rounded-full hover:bg-stone-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Saving...' : 'Save'}
          </button>
          <button
            type="button"
            onClick={handleCancel}
            className="w-full sm:w-auto px-6 py-2 bg-transparent text-stone-800 rounded-full hover:bg-stone-50 transition-colors"
            disabled={loading}
          >
            Cancel
          </button>
        </div>
        </form>
        {/* Snackbar */}
        <Snackbar
          isOpen={snackbar.isOpen}
          onClose={handleCloseSnackbar}
          message={snackbar.message}
          type={snackbar.type}
        />
      </div>
    </MemberLayout>
  );
};

export default Profile;
