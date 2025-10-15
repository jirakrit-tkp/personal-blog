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
      
      <div className="flex min-h-screen">
         {/* SIDEBAR - 30% width */}
         <div className="w-[30%] bg-stone-50">
           <div className="p-10 pl-50">
             {/* User Info */}
             <div className="flex items-center gap-3 mb-6">
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
               <div>
                 <h3 className="font-semibold text-2xl text-stone-500">{user?.name || 'User'}</h3>
               </div>
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
          <div className="pt-12 pb-6">
            <div className="flex items-center gap-3">
              <div className="w-[2px] h-6 bg-stone-300"></div>
              <h1 className="text-2xl font-semibold text-black capitalize">
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
    </div>
  );
};

export default MemberLayout;
