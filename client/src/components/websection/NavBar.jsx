import { AlignJustify, ChevronDown, User, RotateCcw, LogOut, PanelsTopLeft } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/authentication.jsx';
import NotificationBell from '../NotificationBell';
import AdminNotificationBell from '../AdminNotificationBell';

const NavBar = () => {
  const { isAuthenticated, state, logout } = useAuth();
  const { user } = state;
  const navigate = useNavigate();

  NavBar.displayName = "NavBar";

  return (
    <nav className="sticky top-0 z-50 flex flex-row justify-between items-center px-4 py-3 bg-stone-50/95 backdrop-blur border-b border-stone-200">
      {/* Logo */}
      <Link to="/">
        <img src="/Plotline_text.svg" alt="Plotline logo" className="w-25 h-auto mx-5 md:mx-10 my-3"/>
      </Link>

      {/* Desktop Buttons */}
      <div className="flex items-center space-x-[8px] max-sm:hidden">
        {isAuthenticated ? (
          // Authenticated state
          <div className="flex items-center space-x-6">
            {/* Notifications */}
            {user?.role === 'admin' ? <AdminNotificationBell /> : <NotificationBell />}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2 px-2 py-1.5 rounded-full hover:bg-stone-100">
                  {user?.profilePic ? (
                    <img
                      src={user.profilePic}
                      alt="User avatar"
                      className="w-9 h-9 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-9 h-9 rounded-full bg-stone-200 flex items-center justify-center">
                      <User className="w-5 h-5 text-stone-400" />
                    </div>
                  )}
                  <span className="text-stone-800 font-medium">
                    {user?.username || user?.name || 'User'}
                  </span>
                  <ChevronDown className="w-4 h-4 text-stone-500" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-48 bg-stone-50 border-stone-200 mt-4">
                <DropdownMenuItem 
                  className="hover:bg-stone-100 cursor-pointer"
                  onClick={() => navigate(user?.role === 'admin' ? "/admin/profile" : "/profile")}
                >
                  <User className="w-4 h-4 mr-2" />
                  <span className="text-stone-800">Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem 
                  className="hover:bg-stone-100 cursor-pointer"
                  onClick={() => navigate(user?.role === 'admin' ? "/admin/reset-password" : "/reset-password")}
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  <span className="text-stone-800">Reset password</span>
                </DropdownMenuItem>
                {user?.role === 'admin' && (
                  <DropdownMenuItem 
                    className="hover:bg-stone-100 cursor-pointer"
                    onClick={() => navigate("/admin")}
                  >
                    <PanelsTopLeft className="w-4 h-4 mr-2" />
                    <span className="text-stone-800">Admin Panel</span>
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator className="bg-stone-300" />
                <DropdownMenuItem onClick={logout} className="text-red-600 hover:bg-red-50">
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        ) : (
          // Anonymous state
          <>
            <Link 
              to="/login"
              className="px-4 py-1.5 border border-stone-800 text-stone-800 rounded-full text-sm hover:bg-stone-100 transition-colors"
            >
              Log in
            </Link>
            <Link 
              to="/signup"
              className="px-4 py-1.5 bg-stone-900 text-white rounded-full text-sm hover:bg-stone-800 transition-colors"
            >
              Sign up
            </Link>
          </>
        )}
      </div>
      
      {/* Mobile Menu */}
      <div className="sm:hidden">
        <DropdownMenu>
          <DropdownMenuTrigger asChild><AlignJustify /></DropdownMenuTrigger>
          <DropdownMenuContent className="w-[100vw] border-0 rounded-none bg-stone-50">
            <div className="space-y-3 p-4">
              {isAuthenticated ? (
                // Authenticated mobile menu - show user info and menu items
                <>
                  <div className="flex items-center gap-3 mb-4">
                    {user?.profilePic ? (
                      <img
                        src={user.profilePic}
                        alt="User avatar"
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-stone-200 flex items-center justify-center">
                        <User className="w-6 h-6 text-stone-400" />
                      </div>
                    )}
                    <span className="text-stone-800 font-medium">
                      {user?.username || user?.name || 'User'}
                    </span>
                    <div className="ml-auto">
                      {user?.role === 'admin' ? <AdminNotificationBell /> : <NotificationBell />}
                    </div>
                  </div>
                  <DropdownMenuSeparator className="bg-stone-300" />
                  <DropdownMenuItem 
                    className="hover:bg-stone-100 cursor-pointer"
                    onClick={() => navigate(user?.role === 'admin' ? "/admin/profile" : "/profile")}
                  >
                    <User className="w-4 h-4 mr-2" />
                    <span className="text-stone-800">Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    className="hover:bg-stone-100 cursor-pointer"
                    onClick={() => navigate(user?.role === 'admin' ? "/admin/reset-password" : "/reset-password")}
                  >
                    <RotateCcw className="w-4 h-4 mr-2" />
                    <span className="text-stone-800">Reset password</span>
                  </DropdownMenuItem>
                  {user?.role === 'admin' && (
                    <DropdownMenuItem 
                      className="hover:bg-stone-100 cursor-pointer"
                      onClick={() => navigate("/admin")}
                    >
                      <PanelsTopLeft className="w-4 h-4 mr-2" />
                      <span className="text-stone-800">Admin Panel</span>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator className="bg-stone-300" />
                  <DropdownMenuItem onClick={logout} className="text-red-600 hover:bg-red-50">
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </DropdownMenuItem>
                </>
              ) : (
                // Anonymous mobile menu
                <>
                  <DropdownMenuItem className="hover:bg-transparent p-0">
                    <Link 
                      to="/login"
                      className="w-full px-4 py-3 border border-stone-800 text-stone-800 rounded-full text-sm hover:bg-stone-100 transition-colors block text-center"
                    >
                      Log in
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="hover:bg-transparent p-0">
                    <Link 
                      to="/signup"
                      className="w-full px-4 py-3 bg-stone-900 text-white rounded-full text-sm hover:bg-stone-800 transition-colors block text-center"
                    >
                      Sign up
                    </Link>
                  </DropdownMenuItem>
                </>
              )}
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </nav>
  );
};

export default NavBar;
