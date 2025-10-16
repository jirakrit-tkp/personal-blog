import React from 'react';
import { User, RotateCcw } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/authentication.jsx';
import NavBar from '../../components/websection/NavBar';

const MemberLayout = ({ children }) => {
  const { state, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = state;

  MemberLayout.displayName = "MemberLayout";

  // Debug logging
  console.log('MemberLayout - isAuthenticated:', isAuthenticated);
  console.log('MemberLayout - user:', user);
  console.log('MemberLayout - location:', location);

  const isActive = (path) => {
    return location.pathname === path;
  };

  if (!isAuthenticated) {
    console.log('MemberLayout - Not authenticated, redirecting to login');
    navigate('/login');
    return null;
  }

  return (
    <div className="min-h-screen bg-white">
      {/* NAVBAR */}
      <NavBar />
      
      {/* Desktop Layout */}
      <div className="hidden lg:flex min-h-screen">
         {/* SIDEBAR - 30% width */}
         <div className="w-[30%] bg-stone-50">
           <div className="p-10 pl-50">
             {/* User Info */}
             <div className="relative flex items-center gap-3 mb-6">
               {user?.profilePic ? (
                 <img
                   src={user.profilePic}
                   alt="Profile"
                   className="w-12 h-12 rounded-full object-cover"
                 />
               ) : (
                 <div className="w-12 h-12 rounded-full bg-stone-200 flex items-center justify-center">
                   <User className="w-6 h-6 text-stone-400" />
                 </div>
               )}
               <div className="flex-1">
                 <h3 className="font-semibold text-2xl text-stone-800">{user?.name || 'User'}</h3>
                 <p className="text-sm text-stone-400">@{user?.username || 'username'}</p>
               </div>
               {/* Right-edge divider aligned to sidebar edge, limited to this row's height */}
               <div className="absolute top-0 right-[-40px] h-full w-[2px] bg-stone-300"></div>
             </div>
             
             {/* Navigation */}
             <nav className="space-y-4">
               <button 
                 onClick={() => navigate('/profile')}
                 className={`w-full flex items-center gap-3 px-3 py-2 text-left transition-colors ${
                   isActive('/profile') 
                     ? 'text-stone-800 font-bold'  
                     : 'text-stone-400'
                 }`}
               >
                 <User className="w-4 h-4" />
                 <span className="text-sm">Profile</span>
               </button>
               <button 
                 onClick={() => navigate('/reset-password')}
                 className={`w-full flex items-center gap-3 px-3 py-2 text-left transition-colors ${
                   isActive('/reset-password') 
                     ? 'text-stone-800 font-bold' 
                     : 'text-stone-400'
                 }`}
               >
                 <RotateCcw className="w-4 h-4" />
                 <span className="text-sm">Reset password</span>
               </button>
             </nav>
           </div>
         </div>

        {/* RIGHT SIDE - 70% width */}
        <div className="w-[70%] bg-stone-50">
          {/* Page Title - ตรงกับ user */}
          <div className="pt-11 pb-9">
            <div className="flex items-center gap-3">
              <div className="w-[2px] h-6"></div>
              <h1 className="text-3xl font-semibold text-stone-800 capitalize">
                {location.pathname.split('/').pop() || 'Profile'}
              </h1>
            </div>
          </div>
          
          {/* Page Content */}
          <div>
            <div className="max-w-2xl">
              {children}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="lg:hidden bg-stone-50 min-h-screen">
        {/* Mobile Navigation */}
        <div className="bg-white border-b border-stone-200 px-4 py-3">
          <div className="flex items-center gap-3">
            {user?.profilePic ? (
              <img
                src={user.profilePic}
                alt="Profile"
                className="w-8 h-8 rounded-full object-cover"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-stone-200 flex items-center justify-center">
                <User className="w-4 h-4 text-stone-400" />
              </div>
            )}
            <div>
              <h3 className="font-semibold text-lg text-stone-800">{user?.name || 'User'}</h3>
              <p className="text-xs text-stone-400">@{user?.username || 'username'}</p>
            </div>
            <div className="w-[2px] h-8 bg-stone-300 mx-3"></div>
            <h1 className="text-lg font-semibold text-stone-800 capitalize">
              {location.pathname.split('/').pop() || 'Profile'}
            </h1>
          </div>
          
          {/* Mobile Navigation Tabs */}
          <nav className="flex gap-6 mt-4">
            <button 
              onClick={() => navigate('/profile')}
              className={`flex items-center gap-2 px-3 py-2 text-sm transition-colors ${
                isActive('/profile') 
                  ? 'text-stone-800 font-bold border-b-2 border-stone-800'  
                  : 'text-stone-400'
              }`}
            >
              <User className="w-4 h-4" />
              <span>Profile</span>
            </button>
            <button 
              onClick={() => navigate('/reset-password')}
              className={`flex items-center gap-2 px-3 py-2 text-sm transition-colors ${
                isActive('/reset-password') 
                  ? 'text-stone-800 font-bold border-b-2 border-stone-800' 
                  : 'text-stone-400'
              }`}
            >
              <RotateCcw className="w-4 h-4" />
              <span>Reset password</span>
            </button>
          </nav>
        </div>

        {/* Mobile Page Content */}
        <div className="p-4">
          {children}
        </div>
      </div>
    </div>
  );
};

export default MemberLayout;
