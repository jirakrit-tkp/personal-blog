import React from 'react';
import { RotateCcw } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/authentication.jsx';
import { User } from 'lucide-react';
import NavBar from '../../components/websection/NavBar';
import Avatar from '../ui/Avatar';

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
         {/* SIDEBAR - flexible width with max constraint */}
         <aside className="w-full lg:w-[30%] xl:w-[28%] bg-stone-50 flex-shrink-0">
           <div className="p-6 lg:p-8 xl:p-10 lg:pl-12 xl:pl-16">
             {/* User Info */}
             <div className="relative flex items-center gap-3 mb-6">
               <Avatar src={user?.profilePic} alt="Profile" size="xl" />
               <div className="flex-1 min-w-0">
                 <h3 className="font-semibold text-xl lg:text-2xl text-stone-800 truncate">{user?.name || 'User'}</h3>
                 <p className="text-sm text-stone-400 truncate">@{user?.username || 'username'}</p>
               </div>
               {/* Right-edge divider aligned to sidebar edge, limited to this row's height */}
               <div className="absolute top-0 -right-6 lg:-right-8 xl:-right-10 h-full w-[2px] bg-stone-300"></div>
             </div>
             
             {/* Navigation */}
             <nav className="space-y-4">
               <button 
                 onClick={() => navigate('/profile')}
                 className={`w-full flex items-center gap-3 px-3 py-2 text-left transition-colors cursor-pointer ${
                   isActive('/profile') 
                     ? 'text-stone-800 font-bold'  
                     : 'text-stone-400'
                 }`}
               >
                 <User className="w-4 h-4 flex-shrink-0" />
                 <span className="text-sm">Profile</span>
               </button>
               <button 
                 onClick={() => navigate('/reset-password')}
                 className={`w-full flex items-center gap-3 px-3 py-2 text-left transition-colors cursor-pointer ${
                   isActive('/reset-password') 
                     ? 'text-stone-800 font-bold' 
                     : 'text-stone-400'
                 }`}
               >
                 <RotateCcw className="w-4 h-4 flex-shrink-0" />
                 <span className="text-sm">Reset password</span>
               </button>
             </nav>
           </div>
         </aside>

        {/* RIGHT SIDE - flexible width */}
        <main className="flex-1 bg-stone-50 min-w-0">
          {/* Page Title - ตรงกับ user */}
          <div className="pt-6 lg:pt-8 xl:pt-10 pb-9">
            <div className="flex items-center gap-3">
              <div className="w-[2px] h-6 flex-shrink-0"></div>
              <h1 className="text-2xl lg:text-3xl font-semibold text-stone-800 capitalize truncate">
                {location.pathname.split('/').pop() || 'Profile'}
              </h1>
            </div>
          </div>
          
          {/* Page Content */}
          <div className="pb-8">
            <div className="max-w-2xl w-full">
              {children}
            </div>
          </div>
        </main>
      </div>

      {/* Mobile Layout */}
      <div className="lg:hidden bg-stone-50 min-h-screen">
        {/* Mobile Navigation */}
        <div className="bg-stone-50 px-4 py-3">
           <div className="flex items-center gap-3">
             <Avatar src={user?.profilePic} alt="Profile" size="md" />
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
              className={`flex items-center gap-2 px-3 py-2 text-sm transition-colors cursor-pointer ${
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
              className={`flex items-center gap-2 px-3 py-2 text-sm transition-colors cursor-pointer ${
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
        <div>
          {children}
        </div>
      </div>
    </div>
  );
};

export default MemberLayout;
