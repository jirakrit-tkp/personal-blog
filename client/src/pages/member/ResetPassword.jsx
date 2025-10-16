import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/authentication.jsx';
import { useNavigate } from 'react-router-dom';
import MemberLayout from '../../components/member/MemberLayout';
import axios from 'axios';
import Snackbar from '../../components/ui/Snackbar';
import ConfirmModal from '../../components/ui/ConfirmModal';

const ResetPassword = () => {
  const { state, isAuthenticated, fetchUser } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [snackbar, setSnackbar] = useState({ isOpen: false, message: '', type: 'success' });
  const [isConfirmResetOpen, setIsConfirmResetOpen] = useState(false);
  const [isConfirmCancelOpen, setIsConfirmCancelOpen] = useState(false);

  const apiBase = import.meta.env.VITE_API_BASE_URL || "http://localhost:4001/api";

  ResetPassword.displayName = "ResetPassword";

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
  }, [isAuthenticated, navigate]);

  // Show snackbar after refresh if a message flag exists
  useEffect(() => {
    if (isAuthenticated) {
      const raw = sessionStorage.getItem('snackbar_post_refresh');
      if (raw) {
        try {
          const payload = JSON.parse(raw);
          setSnackbar({ isOpen: true, message: payload.message || 'Done', type: payload.type || 'success' });
        } catch (_) {}
        sessionStorage.removeItem('snackbar_post_refresh');
      }
    }
  }, [isAuthenticated]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
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

  const doResetPassword = async () => {
    setLoading(true);
    try {
      await axios.put(`${apiBase}/auth/reset-password`, {
        oldPassword: formData.currentPassword,
        newPassword: formData.newPassword
      });

      // Persist snackbar to show after refresh
      sessionStorage.setItem('snackbar_post_refresh', JSON.stringify({ message: 'Password updated successfully!', type: 'success' }));

      // Re-login with new password to refresh token and avoid logout
      if (state?.user?.email) {
        const loginRes = await axios.post(`${apiBase}/auth/login`, {
          email: state.user.email,
          password: formData.newPassword
        });
        const newToken = loginRes.data?.access_token;
        if (newToken) {
          localStorage.setItem('token', newToken);
          await fetchUser();
        }
      }

      setFormData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      const msg = error.response?.data?.error || 'Failed to reset password. Please try again.';
      setSnackbar({ isOpen: true, message: msg, type: 'error' });
    } finally {
      setLoading(false);
      setIsConfirmResetOpen(false);
    }
  };

  const handleClickReset = () => {
    if (!validateForm()) return;
    setIsConfirmResetOpen(true);
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
      <form className="space-y-6">
        {/* Current Password */}
        <div>
          <label htmlFor="currentPassword" className="block text-sm font-normal text-black mb-1">
            Current password
          </label>
          <input
            type="password"
            id="currentPassword"
            name="currentPassword"
            value={formData.currentPassword}
            onChange={handleInputChange}
            placeholder="Current password"
            className={`w-full px-4 py-3 border bg-white rounded-lg focus:outline-none focus:ring-2 focus:border-transparent ${
              errors.currentPassword ? 'border-red-500 text-red-600 focus:ring-red-500' : 'border-stone-300 focus:ring-blue-500'
            }`}
            required={false}
          />
          {errors.currentPassword && (
            <p className="text-red-500 text-sm mt-1">{errors.currentPassword}</p>
          )}
        </div>

        {/* New Password */}
        <div>
          <label htmlFor="newPassword" className="block text-sm font-normal text-black mb-1">
            New password
          </label>
          <input
            type="password"
            id="newPassword"
            name="newPassword"
            value={formData.newPassword}
            onChange={handleInputChange}
            placeholder="New password"
            className={`w-full px-4 py-3 border bg-white rounded-lg focus:outline-none focus:ring-2 focus:border-transparent ${
              errors.newPassword ? 'border-red-500 text-red-600 focus:ring-red-500' : 'border-stone-300 focus:ring-blue-500'
            }`}
            required={false}
          />
          {errors.newPassword && (
            <p className="text-red-500 text-sm mt-1">{errors.newPassword}</p>
          )}
        </div>

        {/* Confirm New Password */}
        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-normal text-black mb-1">
            Confirm new password
          </label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleInputChange}
            placeholder="Confirm new password"
            className={`w-full px-4 py-3 border bg-white rounded-lg focus:outline-none focus:ring-2 focus:border-transparent ${
              errors.confirmPassword ? 'border-red-500 text-red-600 focus:ring-red-500' : 'border-stone-300 focus:ring-blue-500'
            }`}
            required={false}
          />
          {errors.confirmPassword && (
            <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>
          )}
        </div>

        {/* Reset Button */}
        <div className="flex flex-col sm:flex-row items-center gap-3 justify-start">
          <button
            type="button"
            onClick={handleClickReset}
            disabled={loading}
            className="w-full sm:w-auto px-6 py-2 bg-stone-800 text-white rounded-full hover:bg-stone-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Resetting...' : 'Reset password'}
          </button>
          <button
            type="button"
            onClick={() => setIsConfirmCancelOpen(true)}
            className="w-full sm:w-auto px-6 py-2 bg-transparent text-stone-800 rounded-full hover:bg-stone-50 transition-colors"
            disabled={loading}
          >
            Cancel
          </button>
        </div>
      </form>
      <ConfirmModal
        isOpen={isConfirmResetOpen}
        onClose={() => setIsConfirmResetOpen(false)}
        onConfirm={doResetPassword}
        title="Confirm reset password"
        message="Are you sure you want to reset your password?"
        confirmText="Reset"
        cancelText="Back"
      />
      <ConfirmModal
        isOpen={isConfirmCancelOpen}
        onClose={() => setIsConfirmCancelOpen(false)}
        onConfirm={() => { setIsConfirmCancelOpen(false); handleCancel(); }}
        title="Discard changes?"
        message="Your changes will be lost."
        confirmText="Discard"
        cancelText="Back"
      />
      {/* Snackbar */}
      <Snackbar
        isOpen={snackbar.isOpen}
        onClose={handleCloseSnackbar}
        message={snackbar.message}
        type={snackbar.type}
        duration={5000}
      />
      </div>
    </MemberLayout>
  );
};

export default ResetPassword;
