import React, { useState } from 'react';
import { useAuth } from '../../context/authentication.jsx';
import axios from 'axios';
import { AdminNavbar } from '../../components/admin';
import FormInput from '../../components/ui/FormInput';
import FormTextarea from '../../components/ui/FormTextarea';

const AdminProfile = () => {
  const { state, fetchUser } = useAuth();
  const { user } = state;

  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    username: user?.username || '',
    bio: user?.bio || ''
  });

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

  const handleSave = async () => {
    setIsSaving(true);
    const apiBase = import.meta.env.VITE_API_BASE_URL || "http://localhost:4001/api";

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('username', formData.username);
      formDataToSend.append('email', formData.email);
      formDataToSend.append('bio', formData.bio || '');
      
      if (selectedFile) {
        formDataToSend.append('profilePicture', selectedFile);
      }

      const response = await axios.put(`${apiBase}/profiles/${user.id}`, formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response.data.success) {
        alert('Profile updated successfully!');
        await fetchUser(); // Refresh user data
        setSelectedFile(null);
        setPreviewUrl(null);
        setIsEditing(false);
      }
    } catch (error) {
      console.error('Save error:', error);
      alert('Failed to update profile: ' + (error.response?.data?.error || error.message));
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      name: user?.name || '',
      email: user?.email || '',
      username: user?.username || '',
      bio: 'I am a pet enthusiast and freelance writer who specializes in animal behavior and care. With a deep love for cats, I enjoy sharing insights on feline companionship and wellness. When I\'m not writing, I spend time volunteering at my local animal shelter, helping cats find loving homes.'
    });
    setSelectedFile(null);
    setPreviewUrl(null);
    setIsEditing(false);
  };

  AdminProfile.displayName = "AdminProfile";

  return (
    <div className="bg-stone-100 min-h-screen">
      <AdminNavbar 
        title="Profile"
        actions={
          !isEditing ? (
            <button 
              className="px-6 py-2 bg-stone-800 text-white rounded-full hover:bg-stone-900 transition-colors"
              onClick={() => setIsEditing(true)}
            >
              Edit Profile
            </button>
          ) : (
            <>
              <button 
                className="px-6 py-2 bg-stone-100 text-stone-700 rounded-full hover:bg-stone-200 transition-colors"
                onClick={handleCancel}
              >
                Cancel
              </button>
              <button 
                className="px-6 py-2 bg-stone-800 text-white rounded-full hover:bg-stone-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={handleSave}
                disabled={isSaving}
              >
                {isSaving ? 'Saving...' : 'Save'}
              </button>
            </>
          )
        }
      />

      <div className="mx-8 p-8 min-h-[calc(100vh-120px)]">
        {/* Profile Picture Section */}
        <div className="flex items-center gap-6 mb-8">
          <div className="w-22 h-22 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
            <img 
              src={previewUrl || user?.profilePic || "https://res.cloudinary.com/dcbpjtd1r/image/upload/v1728449784/my-blog-post/xgfy0xnvyemkklcqodkg.jpg"} 
              alt="Profile"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-1">
            {isEditing ? (
              <>
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
                  <span className="ml-3 text-sm text-gray-600">{selectedFile.name}</span>
                )}
              </>
            ) : (
              <button className="px-6 py-2 bg-white/50 border border-stone-300 text-stone-400 rounded-full font-medium" disabled>
                Upload profile picture
              </button>
            )}
          </div>
        </div>
        
        {/* Divider */}
        <div className="border-b border-stone-300 my-6 w-1/2"></div>
            
        {/* Form Fields */}
        <div className="space-y-6">
          {/* Name Field */}
          <FormInput
            label="Name"
            type="text"
            name="name"
            value={isEditing ? formData.name : (user?.name || 'Not set')}
            onChange={handleInputChange}
            placeholder="Enter your name"
            readOnly={!isEditing}
            className="w-1/2"
          />

          {/* Username Field */}
          <FormInput
            label="Username"
            type="text"
            name="username"
            value={isEditing ? formData.username : (user?.username || 'Not set')}
            onChange={handleInputChange}
            placeholder="Enter your username"
            readOnly={!isEditing}
            className="w-1/2"
          />

          {/* Email Field */}
          <FormInput
            label="Email"
            type="email"
            name="email"
            value={isEditing ? formData.email : (user?.email || 'Not set')}
            onChange={handleInputChange}
            placeholder="Enter your email"
            readOnly={!isEditing}
            className="w-1/2"
          />

          {/* Bio Field */}
          <FormTextarea
            label="Bio (max 500 letters)"
            name="bio"
            value={isEditing ? formData.bio : (user?.bio || '')}
            onChange={handleInputChange}
            placeholder="Enter your bio"
            readOnly={!isEditing}
            rows={4}
            maxLength={500}
            showCharCount={true}
            className="w-full"
          />
        </div>
      </div>
    </div>
  );
};

export default AdminProfile;