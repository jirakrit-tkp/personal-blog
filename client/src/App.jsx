import { Routes, Route } from 'react-router-dom'
import './App.css'
import { LandingPage, ViewPost, NotFound, Login, Signup, SupabaseTest } from './pages'
import { 
  AdminLayout, 
  AdminDashboard, 
  ArticleManagement, 
  CreateArticle,
  EditArticle,
  CategoryManagement, 
  AdminProfile, 
  AdminNotifications, 
  AdminResetPassword 
} from './pages/admin'
import AuthenticationRoute from './components/AuthenticationRoute'
import ProtectedRoute from './components/ProtectedRoute'
import { useAuth } from './context/authentication.jsx'

function App() {
  const { state, isAuthenticated } = useAuth();
  const { getUserLoading, user } = state;

  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/post/:id" element={<ViewPost />} />
      <Route path="/login" element={
        <AuthenticationRoute 
          isLoading={getUserLoading} 
          isAuthenticated={isAuthenticated}
        >
          <Login />
        </AuthenticationRoute>
      } />
      <Route path="/signup" element={
        <AuthenticationRoute 
          isLoading={getUserLoading} 
          isAuthenticated={isAuthenticated}
        >
          <Signup />
        </AuthenticationRoute>
      } />
      <Route path="/supabase-test" element={<SupabaseTest />} />
      
      {/* Example protected routes */}
      <Route path="/profile" element={
        <ProtectedRoute 
          isLoading={getUserLoading}
          isAuthenticated={isAuthenticated}
          userRole={user?.role}
          requiredRole={null}
        >
          <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
            <div className="bg-white p-8 rounded-lg shadow-md">
              <h1 className="text-2xl font-bold mb-4">User Profile</h1>
              <p className="text-gray-600">This is a protected page for authenticated users.</p>
            </div>
          </div>
        </ProtectedRoute>
      } />
      
      {/* Admin Routes */}
      <Route path="/admin" element={
        <ProtectedRoute 
          isLoading={getUserLoading}
          isAuthenticated={isAuthenticated}
          userRole={user?.role}
          requiredRole="admin"
        >
          <AdminLayout />
        </ProtectedRoute>
      }>
        <Route index element={<AdminDashboard />} />
        <Route path="articles" element={<ArticleManagement />} />
        <Route path="articles/create" element={<CreateArticle />} />
        <Route path="articles/edit/:id" element={<EditArticle />} />
        <Route path="categories" element={<CategoryManagement />} />
        <Route path="profile" element={<AdminProfile />} />
        <Route path="notifications" element={<AdminNotifications />} />
        <Route path="reset-password" element={<AdminResetPassword />} />
      </Route>
      
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

export default App
