import React, { useState } from 'react';
import { useAuth } from '../../context/authentication.jsx';

const AdminProfile = () => {
  const { state } = useAuth();
  const { user } = state;

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    username: user?.username || '',
    bio: 'I am a pet enthusiast and freelance writer who specializes in animal behavior and care. With a deep love for cats, I enjoy sharing insights on feline companionship and wellness. When I\'m not writing, I spend time volunteering at my local animal shelter, helping cats find loving homes.'
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = () => {
    // TODO: Save to backend API
    console.log('Saving profile:', formData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData({
      name: user?.name || '',
      email: user?.email || '',
      username: user?.username || '',
      bio: 'I am a pet enthusiast and freelance writer who specializes in animal behavior and care. With a deep love for cats, I enjoy sharing insights on feline companionship and wellness. When I\'m not writing, I spend time volunteering at my local animal shelter, helping cats find loving homes.'
    });
    setIsEditing(false);
  };

  AdminProfile.displayName = "AdminProfile";

  return (
    <div className="bg-stone-100 min-h-screen">
      {/* Page Header */}
      <div className="bg-stone-100 px-8 py-6 border-b-2 border-stone-300">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Profile</h1>
          <div className="flex gap-3">
            {!isEditing ? (
              <button 
                className="px-6 py-2 bg-stone-800 text-white rounded-full hover:bg-stone-900 transition-colors"
                onClick={() => setIsEditing(true)}
              >
                Edit Profile
              </button>
            ) : (
              <>
                <button 
                  className="px-6 py-2 bg-stone-100 text-stone-700 rounded-lg hover:bg-stone-200 transition-colors"
                  onClick={handleCancel}
                >
                  Cancel
                </button>
                <button 
                  className="px-6 py-2 bg-stone-800 text-white rounded-lg hover:bg-stone-900 transition-colors"
                  onClick={handleSave}
                >
                  Save
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="mx-8 p-8 min-h-[calc(100vh-120px)]">
        {/* Profile Picture Section */}
        <div className="flex items-center gap-6 mb-8">
          <div className="w-22 h-22 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
            <img 
              src="https://res.cloudinary.com/dcbpjtd1r/image/upload/v1728449784/my-blog-post/xgfy0xnvyemkklcqodkg.jpg" 
              alt="Profile"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-1">
            {isEditing ? (
              <button className="px-6 py-2 bg-white border border-stone-800 text-stone-800 rounded-full hover:bg-stone-50 transition-colors cursor-pointer font-medium">
                Upload profile picture
              </button>
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
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Name
            </label>
            {isEditing ? (
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-1/2 px-3 py-2 border border-gray-300 rounded-md bg-white focus:ring-2 focus:ring-gray-500 focus:border-gray-500 transition-colors"
                placeholder="Enter your name"
              />
            ) : (
              <input
                type="text"
                value={user?.name || 'Not set'}
                readOnly
                className="w-1/2 px-3 py-2 border border-gray-300 rounded-md bg-white/50 text-stone-400"
              />
            )}
          </div>

          {/* Username Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Username
            </label>
            {isEditing ? (
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                className="w-1/2 px-3 py-2 border border-gray-300 rounded-md bg-white focus:ring-2 focus:ring-gray-500 focus:border-gray-500 transition-colors"
                placeholder="Enter your username"
              />
            ) : (
              <input
                type="text"
                value={user?.username || 'Not set'}
                readOnly
                className="w-1/2 px-3 py-2 border border-gray-300 rounded-md bg-white/50 text-stone-400"
              />
            )}
          </div>

          {/* Email Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            {isEditing ? (
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-1/2 px-3 py-2 border border-gray-300 rounded-md bg-white focus:ring-2 focus:ring-gray-500 focus:border-gray-500 transition-colors"
                placeholder="Enter your email"
              />
            ) : (
              <input
                type="email"
                value={user?.email || 'Not set'}
                readOnly
                className="w-1/2 px-3 py-2 border border-gray-300 rounded-md bg-white/50 text-stone-400"
              />
            )}
          </div>

          {/* Bio Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Bio (max 120 letters)
            </label>
            {isEditing ? (
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleInputChange}
                rows={4}
                maxLength={120}
                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white focus:ring-2 focus:ring-gray-500 focus:border-gray-500 transition-colors resize-none"
                placeholder="Enter your bio"
              />
            ) : (
              <textarea
                value={formData.bio}
                readOnly
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white/50 text-stone-400 resize-none"
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminProfile;