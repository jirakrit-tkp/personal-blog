import React, { useState } from 'react';

const AdminResetPassword = () => {
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false
  });

  const validateForm = () => {
    const newErrors = {};

    if (!formData.currentPassword) {
      newErrors.currentPassword = 'Current password is required';
    }

    if (!formData.newPassword) {
      newErrors.newPassword = 'New password is required';
    } else if (formData.newPassword.length < 8) {
      newErrors.newPassword = 'Password must be at least 8 characters long';
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
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const togglePasswordVisibility = (field) => {
    setShowPassword(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Success - show success message
      alert('Password updated successfully!');
      setFormData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (error) {
      alert('Failed to update password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const getPasswordStrength = (password) => {
    if (!password) return { strength: 0, label: '', color: '' };
    
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;

    const labels = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong'];
    const colors = ['#ef4444', '#f59e0b', '#eab308', '#22c55e', '#10b981'];
    
    return {
      strength,
      label: labels[strength - 1] || '',
      color: colors[strength - 1] || '#ef4444'
    };
  };

  const passwordStrength = getPasswordStrength(formData.newPassword);

  AdminResetPassword.displayName = "AdminResetPassword";

  return (
    <div className="admin-reset-password">
      <div className="page-header">
        <h1 className="page-title">Reset Password</h1>
        <p className="page-subtitle">Change your account password</p>
      </div>

      <div className="password-form-container">
        <div className="form-card">
          <div className="form-header">
            <h2 className="form-title">Change Password</h2>
            <p className="form-description">
              For security reasons, please enter your current password before setting a new one.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="password-form">
            <div className="form-group">
              <label className="form-label">Current Password</label>
              <div className="password-input-container">
                <input
                  type={showPassword.current ? 'text' : 'password'}
                  name="currentPassword"
                  value={formData.currentPassword}
                  onChange={handleInputChange}
                  className={`form-input ${errors.currentPassword ? 'error' : ''}`}
                  placeholder="Enter your current password"
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => togglePasswordVisibility('current')}
                >
                  {showPassword.current ? '🙈' : '👁️'}
                </button>
              </div>
              {errors.currentPassword && (
                <p className="error-message">{errors.currentPassword}</p>
              )}
            </div>

            <div className="form-group">
              <label className="form-label">New Password</label>
              <div className="password-input-container">
                <input
                  type={showPassword.new ? 'text' : 'password'}
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleInputChange}
                  className={`form-input ${errors.newPassword ? 'error' : ''}`}
                  placeholder="Enter your new password"
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => togglePasswordVisibility('new')}
                >
                  {showPassword.new ? '🙈' : '👁️'}
                </button>
              </div>
              {errors.newPassword && (
                <p className="error-message">{errors.newPassword}</p>
              )}
              
              {formData.newPassword && (
                <div className="password-strength">
                  <div className="strength-bar">
                    <div 
                      className="strength-fill"
                      style={{ 
                        width: `${(passwordStrength.strength / 5) * 100}%`,
                        backgroundColor: passwordStrength.color
                      }}
                    ></div>
                  </div>
                  <span 
                    className="strength-label"
                    style={{ color: passwordStrength.color }}
                  >
                    {passwordStrength.label}
                  </span>
                </div>
              )}
            </div>

            <div className="form-group">
              <label className="form-label">Confirm New Password</label>
              <div className="password-input-container">
                <input
                  type={showPassword.confirm ? 'text' : 'password'}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className={`form-input ${errors.confirmPassword ? 'error' : ''}`}
                  placeholder="Confirm your new password"
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => togglePasswordVisibility('confirm')}
                >
                  {showPassword.confirm ? '🙈' : '👁️'}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="error-message">{errors.confirmPassword}</p>
              )}
            </div>

            <div className="password-requirements">
              <h4 className="requirements-title">Password Requirements:</h4>
              <ul className="requirements-list">
                <li className={formData.newPassword.length >= 8 ? 'valid' : ''}>
                  At least 8 characters long
                </li>
                <li className={/[a-z]/.test(formData.newPassword) ? 'valid' : ''}>
                  Contains lowercase letter
                </li>
                <li className={/[A-Z]/.test(formData.newPassword) ? 'valid' : ''}>
                  Contains uppercase letter
                </li>
                <li className={/[0-9]/.test(formData.newPassword) ? 'valid' : ''}>
                  Contains number
                </li>
                <li className={/[^A-Za-z0-9]/.test(formData.newPassword) ? 'valid' : ''}>
                  Contains special character
                </li>
              </ul>
            </div>

            <div className="form-actions">
              <button
                type="button"
                className="btn-secondary"
                onClick={() => {
                  setFormData({
                    currentPassword: '',
                    newPassword: '',
                    confirmPassword: ''
                  });
                  setErrors({});
                }}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn-primary"
                disabled={isLoading}
              >
                {isLoading ? 'Updating...' : 'Update Password'}
              </button>
            </div>
          </form>
        </div>

        <div className="security-tips">
          <h3 className="tips-title">Security Tips</h3>
          <div className="tips-list">
            <div className="tip-item">
              <div className="tip-icon">🔒</div>
              <div className="tip-content">
                <h4 className="tip-title">Use a Strong Password</h4>
                <p className="tip-description">
                  Combine uppercase and lowercase letters, numbers, and special characters.
                </p>
              </div>
            </div>

            <div className="tip-item">
              <div className="tip-icon">🔄</div>
              <div className="tip-content">
                <h4 className="tip-title">Change Regularly</h4>
                <p className="tip-description">
                  Update your password every 90 days for better security.
                </p>
              </div>
            </div>

            <div className="tip-item">
              <div className="tip-icon">🚫</div>
              <div className="tip-content">
                <h4 className="tip-title">Don't Reuse Passwords</h4>
                <p className="tip-description">
                  Use unique passwords for different accounts and services.
                </p>
              </div>
            </div>

            <div className="tip-item">
              <div className="tip-icon">📱</div>
              <div className="tip-content">
                <h4 className="tip-title">Enable 2FA</h4>
                <p className="tip-description">
                  Consider enabling two-factor authentication for extra security.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .admin-reset-password {
          max-width: 800px;
          margin: 0 auto;
        }

        .page-header {
          margin-bottom: 32px;
        }

        .page-title {
          font-size: 28px;
          font-weight: 700;
          color: #1a1a1a;
          margin: 0 0 8px 0;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }

        .page-subtitle {
          font-size: 16px;
          color: #6b7280;
          margin: 0;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }

        .password-form-container {
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: 32px;
        }

        .form-card {
          background: white;
          border-radius: 12px;
          border: 1px solid #e5e7eb;
          padding: 32px;
        }

        .form-header {
          margin-bottom: 32px;
        }

        .form-title {
          font-size: 20px;
          font-weight: 600;
          color: #1a1a1a;
          margin: 0 0 8px 0;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }

        .form-description {
          font-size: 14px;
          color: #6b7280;
          margin: 0;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }

        .password-form {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .form-label {
          font-size: 14px;
          font-weight: 500;
          color: #374151;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }

        .password-input-container {
          position: relative;
        }

        .form-input {
          width: 100%;
          padding: 12px 16px;
          border: 1px solid #d1d5db;
          border-radius: 8px;
          font-size: 14px;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }

        .form-input:focus {
          outline: none;
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }

        .form-input.error {
          border-color: #ef4444;
        }

        .password-toggle {
          position: absolute;
          right: 12px;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          cursor: pointer;
          font-size: 16px;
          padding: 4px;
        }

        .error-message {
          font-size: 12px;
          color: #ef4444;
          margin: 0;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }

        .password-strength {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .strength-bar {
          flex: 1;
          height: 4px;
          background: #e5e7eb;
          border-radius: 2px;
          overflow: hidden;
        }

        .strength-fill {
          height: 100%;
          transition: all 0.3s ease;
        }

        .strength-label {
          font-size: 12px;
          font-weight: 500;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }

        .password-requirements {
          background: #f9fafb;
          border-radius: 8px;
          padding: 16px;
        }

        .requirements-title {
          font-size: 14px;
          font-weight: 500;
          color: #374151;
          margin: 0 0 12px 0;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }

        .requirements-list {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .requirements-list li {
          font-size: 12px;
          color: #6b7280;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          position: relative;
          padding-left: 16px;
        }

        .requirements-list li::before {
          content: '❌';
          position: absolute;
          left: 0;
        }

        .requirements-list li.valid {
          color: #059669;
        }

        .requirements-list li.valid::before {
          content: '✅';
        }

        .form-actions {
          display: flex;
          justify-content: flex-end;
          gap: 12px;
          margin-top: 8px;
        }

        .btn-primary, .btn-secondary {
          padding: 12px 24px;
          border-radius: 8px;
          border: none;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }

        .btn-primary {
          background: #3b82f6;
          color: white;
        }

        .btn-primary:hover:not(:disabled) {
          background: #2563eb;
        }

        .btn-primary:disabled {
          background: #9ca3af;
          cursor: not-allowed;
        }

        .btn-secondary {
          background: white;
          color: #374151;
          border: 1px solid #d1d5db;
        }

        .btn-secondary:hover {
          background: #f3f4f6;
        }

        .security-tips {
          background: white;
          border-radius: 12px;
          border: 1px solid #e5e7eb;
          padding: 24px;
        }

        .tips-title {
          font-size: 18px;
          font-weight: 600;
          color: #1a1a1a;
          margin: 0 0 20px 0;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }

        .tips-list {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .tip-item {
          display: flex;
          gap: 12px;
          align-items: flex-start;
        }

        .tip-icon {
          font-size: 20px;
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #f3f4f6;
          border-radius: 6px;
          flex-shrink: 0;
        }

        .tip-title {
          font-size: 14px;
          font-weight: 500;
          color: #1a1a1a;
          margin: 0 0 4px 0;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }

        .tip-description {
          font-size: 12px;
          color: #6b7280;
          margin: 0;
          line-height: 1.4;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }

        @media (max-width: 768px) {
          .password-form-container {
            grid-template-columns: 1fr;
            gap: 24px;
          }

          .form-actions {
            flex-direction: column;
          }

          .btn-primary, .btn-secondary {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
};

export default AdminResetPassword;
