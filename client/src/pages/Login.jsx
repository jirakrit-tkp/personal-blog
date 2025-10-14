import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { NavBar, Footer } from '../components/websection';
import { useAuth } from '../context/authentication.jsx';

function Login() {
  const { login, state } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
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

    // Validate email
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Email must be a valid email';
    }

    // Validate password
    if (!formData.password.trim()) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      const result = await login(formData, navigate);
      if (result?.error) {
        setErrors({ general: result.error });
      }
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col">
      <NavBar />

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          {/* Login Form */}
          <div className="bg-stone-200 rounded-lg p-8">
            <h1 className="text-3xl font-bold text-stone-900 mb-8">Log in</h1>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* General Error */}
              {errors.general && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                  {errors.general}
                </div>
              )}

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

              {/* Log In Button */}
              <button
                type="submit"
                disabled={state.loading}
                className="w-full bg-stone-900 text-white py-3 px-6 rounded-lg font-medium hover:bg-stone-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {state.loading ? 'Logging in...' : 'Log in'}
              </button>
            </form>

            {/* Sign Up Link */}
            <p className="text-center mt-6 text-stone-600">
              {"Don't have any account?"}{' '}
              <Link to="/signup" className="text-stone-900 hover:underline font-medium">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default Login;
