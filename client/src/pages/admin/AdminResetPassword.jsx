import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ConfirmModal from '../../components/ui/ConfirmModal';
import Snackbar from '../../components/ui/Snackbar';
import { AdminNavbar } from '../../components/admin';
import FormInput from '../../components/ui/FormInput';
import { useAuth } from '../../context/authentication.jsx';

const AdminResetPassword = () => {
  const { state, fetchUser } = useAuth();
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ isOpen: false, message: '', type: 'success' });
  const [isConfirmResetOpen, setIsConfirmResetOpen] = useState(false);
  const apiBase = import.meta.env.VITE_API_BASE_URL || "http://localhost:4001/api";

  useEffect(() => {
    const raw = sessionStorage.getItem('snackbar_post_refresh');
    if (raw) {
      try {
        const payload = JSON.parse(raw);
        setSnackbar({ isOpen: true, message: payload.message || 'Done', type: payload.type || 'success' });
      } catch (_) {}
      sessionStorage.removeItem('snackbar_post_refresh');
    }
  }, []);

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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleCancel = () => {
    setFormData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    setErrors({});
  };

  const doResetPassword = async () => {
    setIsLoading(true);
    try {
      await axios.put(`${apiBase}/auth/reset-password`, {
        oldPassword: formData.currentPassword,
        newPassword: formData.newPassword
      });

      sessionStorage.setItem('snackbar_post_refresh', JSON.stringify({ message: 'Password updated successfully!', type: 'success' }));

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
      const msg = error.response?.data?.error || 'Failed to update password. Please try again.';
      setSnackbar({ isOpen: true, message: msg, type: 'error' });
    } finally {
      setIsLoading(false);
      setIsConfirmResetOpen(false);
    }
  };

  const handleClickReset = () => {
    if (!validateForm()) return;
    setIsConfirmResetOpen(true);
  };

  AdminResetPassword.displayName = "AdminResetPassword";

  return (
    <div className="bg-stone-100 min-h-screen">
      <AdminNavbar 
        title="Reset password"
        actions={
          <>
            <button 
              className="px-6 py-2 bg-stone-100 text-stone-700 rounded-full hover:bg-stone-200 transition-colors mr-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              onClick={handleCancel}
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleClickReset}
              className="px-6 py-2 bg-stone-800 text-white rounded-full hover:bg-stone-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              disabled={isLoading}
            >
              {isLoading ? 'Updating...' : 'Reset password'}
            </button>
          </>
        }
      />

      <div className="mx-8 p-8 min-h-[calc(100vh-120px)]">
        <div>
          <form className="space-y-6">
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
          </form>
        </div>
      </div>

      <ConfirmModal
        isOpen={isConfirmResetOpen}
        onClose={() => setIsConfirmResetOpen(false)}
        onConfirm={doResetPassword}
        title="Confirm reset password"
        message="Are you sure you want to reset this account's password?"
        confirmText="Reset"
        cancelText="Back"
      />
      <Snackbar
        isOpen={snackbar.isOpen}
        onClose={() => setSnackbar(prev => ({ ...prev, isOpen: false }))}
        message={snackbar.message}
        type={snackbar.type}
        duration={5000}
      />
    </div>
  );
};

export default AdminResetPassword;
