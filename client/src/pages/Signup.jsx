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
        // Redirect to login with success message
        navigate('/login', { 
          state: { 
            message: 'Registration successful! Please log in to continue.',
            type: 'success'
          } 
        });
      }
    }
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
                className="w-full bg-stone-900 text-white py-3 px-6 rounded-lg font-medium hover:bg-stone-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
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
    </div>
  );
}

Signup.displayName = 'Signup';

export default Signup;
