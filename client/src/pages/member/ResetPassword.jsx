import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/authentication.jsx';
import { useNavigate } from 'react-router-dom';
import MemberLayout from '../../components/member/MemberLayout';
import FormInput from '../../components/ui/FormInput';
import axios from 'axios';
import Snackbar from '../../components/ui/Snackbar';

const ResetPassword = () => {
  const { state, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [snackbar, setSnackbar] = useState({ isOpen: false, message: '', type: 'success' });

  const apiBase = import.meta.env.VITE_API_BASE_URL || "http://localhost:4001/api";

  ResetPassword.displayName = "ResetPassword";

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
  }, [isAuthenticated, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleCancel = () => {
    setFormData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    setErrors({});
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.currentPassword) {
      newErrors.currentPassword = 'Current password is required';
    }

    if (!formData.newPassword) {
      newErrors.newPassword = 'New password is required';
    } else if (formData.newPassword.length < 6) {
      newErrors.newPassword = 'Password must be at least 6 characters';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your new password';
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (formData.currentPassword === formData.newPassword) {
      newErrors.newPassword = 'New password must be different from current password';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    
    try {
      await axios.put(`${apiBase}/auth/reset-password`, {
        oldPassword: formData.currentPassword,
        newPassword: formData.newPassword
      });

      setSnackbar({ isOpen: true, message: 'Password updated successfully!', type: 'success' });
      setFormData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (error) {
      const msg = error.response?.data?.error || 'Failed to reset password. Please try again.';
      setSnackbar({ isOpen: true, message: msg, type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, isOpen: false }));
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <MemberLayout>
      <div className="bg-stone-200 rounded-lg shadow-sm p-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Current Password */}
        <div>
          <FormInput
            type="password"
            name="currentPassword"
            label="Current password"
            value={formData.currentPassword}
            onChange={handleInputChange}
            placeholder="Current password"
            className="w-full"
            hasError={!!errors.currentPassword}
          />
          {errors.currentPassword && (
            <p className="text-red-500 text-sm mt-1">{errors.currentPassword}</p>
          )}
        </div>

        {/* New Password */}
        <div>
          <FormInput
            type="password"
            name="newPassword"
            label="New password"
            value={formData.newPassword}
            onChange={handleInputChange}
            placeholder="New password"
            className="w-full"
            hasError={!!errors.newPassword}
          />
          {errors.newPassword && (
            <p className="text-red-500 text-sm mt-1">{errors.newPassword}</p>
          )}
        </div>

        {/* Confirm New Password */}
        <div>
          <FormInput
            type="password"
            name="confirmPassword"
            label="Confirm new password"
            value={formData.confirmPassword}
            onChange={handleInputChange}
            placeholder="Confirm new password"
            className="w-full"
            hasError={!!errors.confirmPassword}
          />
          {errors.confirmPassword && (
            <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>
          )}
        </div>

        {/* Reset Button */}
        <div className="flex flex-col sm:flex-row items-center gap-3 justify-start">
          <button
            type="submit"
            disabled={loading}
            className="w-full sm:w-auto px-6 py-2 bg-stone-800 text-white rounded-full hover:bg-stone-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Resetting...' : 'Reset password'}
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

export default ResetPassword;
