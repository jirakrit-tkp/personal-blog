import React, { useState, useEffect } from 'react';
import { User, Upload } from 'lucide-react';
import { useAuth } from '../../context/authentication.jsx';
import { useNavigate } from 'react-router-dom';
import MemberLayout from '../../components/member/MemberLayout';
import FormInput from '../../components/ui/FormInput';
import axios from 'axios';

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
    }
  }, [isAuthenticated, state?.user, navigate]);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
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
        console.log('Profile updated successfully!');
      }
    } catch (error) {
      console.error('Save error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <MemberLayout>
      <div className="bg-stone-200 rounded-lg shadow-sm p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
        {/* Profile Picture */}
        <div className="flex items-center gap-6">
          <div className="w-40 h-40 bg-stone-200 rounded-full flex items-center justify-center overflow-hidden">
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
          <div className="flex-1">
            <input 
              type="file" 
              id="profile-picture-input"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
            <label 
              htmlFor="profile-picture-input"
              className="inline-block px-6 py-2 bg-white border border-stone-800 text-stone-800 rounded-full hover:bg-stone-50 transition-colors cursor-pointer font-medium"
            >
              {selectedFile ? 'Change Picture' : 'Upload profile picture'}
            </label>
            {selectedFile && (
              <span className="ml-3 text-sm text-stone-600">{selectedFile.name}</span>
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
              required
            />

            <FormInput
              type="text"
              name="username"
              label="Username"
              value={formData.username}
              onChange={handleInputChange}
              className="w-full"
              required
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

        {/* Save Button */}
        <div className="flex justify-start">
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-stone-800 text-white rounded-full hover:bg-stone-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Saving...' : 'Save'}
            </button>
        </div>
        </form>
      </div>
    </MemberLayout>
  );
};

export default Profile;
