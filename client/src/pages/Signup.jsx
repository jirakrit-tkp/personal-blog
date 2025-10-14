import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { NavBar, Footer } from '../components/websection';
import { useAuth } from '../context/authentication.jsx';

function Signup() {
  const navigate = useNavigate();
  const { register, state } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};

    // Validate name
    if (!formData.name.trim()) {
      newErrors.name = 'Full name is required';
    }

    // Validate username
    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    }

    // Validate email
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Email must be a valid email';
    }

    // Validate password
    if (!formData.password.trim()) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length <= 8) {
      newErrors.password = 'Password must be more than 8 characters';
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      const result = await register(formData);
      if (result?.error) {
        setErrors({ general: result.error });
      } else {
        setShowSuccessModal(true);
      }
    }
  };

  const handleContinue = () => {
    setShowSuccessModal(false);
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col">
      <NavBar />

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          {/* Signup Form */}
          <div className="bg-stone-200 rounded-lg p-8">
            <h1 className="text-3xl font-bold text-stone-900 mb-8">Sign up</h1>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* General Error */}
              {errors.general && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                  {errors.general}
                </div>
              )}

              {/* Name Field */}
              <div>
                <label htmlFor="name" className={`block text-sm font-medium mb-2 ${errors.name ? 'text-red-600' : 'text-stone-700'}`}>
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Full name"
                  className={`w-full px-4 py-3 border bg-white rounded-lg focus:outline-none focus:ring-2 focus:border-transparent ${
                    errors.name 
                      ? 'border-red-500 text-red-600 focus:ring-red-500' 
                      : 'border-stone-300 focus:ring-blue-500'
                  }`}
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                )}
              </div>

              {/* Username Field */}
              <div>
                <label htmlFor="username" className={`block text-sm font-medium mb-2 ${errors.username ? 'text-red-600' : 'text-stone-700'}`}>
                  Username
                </label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  placeholder="Username"
                  className={`w-full px-4 py-3 border bg-white rounded-lg focus:outline-none focus:ring-2 focus:border-transparent ${
                    errors.username 
                      ? 'border-red-500 text-red-600 focus:ring-red-500' 
                      : 'border-stone-300 focus:ring-blue-500'
                  }`}
                />
                {errors.username && (
                  <p className="mt-1 text-sm text-red-600">{errors.username}</p>
                )}
              </div>

              {/* Email Field */}
              <div>
                <label htmlFor="email" className={`block text-sm font-medium mb-2 ${errors.email ? 'text-red-600' : 'text-stone-700'}`}>
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Email"
                  className={`w-full px-4 py-3 border bg-white rounded-lg focus:outline-none focus:ring-2 focus:border-transparent ${
                    errors.email 
                      ? 'border-red-500 text-red-600 focus:ring-red-500' 
                      : 'border-stone-300 focus:ring-blue-500'
                  }`}
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                )}
              </div>

              {/* Password Field */}
              <div>
                <label htmlFor="password" className={`block text-sm font-medium mb-2 ${errors.password ? 'text-red-600' : 'text-stone-700'}`}>
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Password"
                  className={`w-full px-4 py-3 border bg-white rounded-lg focus:outline-none focus:ring-2 focus:border-transparent ${
                    errors.password 
                      ? 'border-red-500 text-red-600 focus:ring-red-500' 
                      : 'border-stone-300 focus:ring-blue-500'
                  }`}
                />
                {errors.password && (
                  <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                )}
              </div>

              {/* Sign Up Button */}
              <button
                type="submit"
                disabled={state.loading}
                className="w-full bg-stone-900 text-white py-3 px-6 rounded-lg font-medium hover:bg-stone-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {state.loading ? 'Creating account...' : 'Sign up'}
              </button>
            </form>

            {/* Login Link */}
            <p className="text-center mt-6 text-stone-600">
              Already have an account?{' '}
              <Link to="/login" className="text-stone-900 hover:underline font-medium">
                Log in
              </Link>
            </p>
          </div>
        </div>
      </div>
      <Footer />
      
      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-stone-200 rounded-lg p-8 max-w-md w-full mx-4 text-center">
            {/* Success Icon */}
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            
            {/* Success Message */}
            <h2 className="text-2xl font-bold text-stone-900 mb-6">Registration success</h2>
            
            {/* Continue Button */}
            <button
              onClick={handleContinue}
              className="w-full bg-stone-900 text-white py-3 px-6 rounded-lg font-medium hover:bg-stone-800 transition-colors"
            >
              Continue
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Signup;
