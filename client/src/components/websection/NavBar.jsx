import { AlignJustify } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/authentication.jsx';

const NavBar = () => {
  const { isAuthenticated, state, logout } = useAuth();
  const { user } = state;

  NavBar.displayName = "NavBar";

  return (
    <nav className="flex flex-row justify-between items-center px-6 py-4 bg-neutral-50 border-b border-neutral-200">
      {/* Logo */}
      <img src="Plotline_text.svg" alt="Plotline logo" className="w-25 h-25 mx-10 -my-25"/>

      {/* Desktop Buttons */}
      <div className="flex items-center space-x-[8px] max-sm:hidden">
        {isAuthenticated ? (
          // Authenticated state
          <div className="flex items-center space-x-4">
            <span className="text-neutral-800 font-medium">
              {user?.username || user?.name || 'User'}
            </span>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="px-4 py-1.5 bg-neutral-900 text-white rounded-full text-sm hover:bg-neutral-800 transition-colors">
                  Menu
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-48">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Link to="/profile" className="w-full">Profile</Link>
                </DropdownMenuItem>
                {user?.role === 'admin' && (
                  <DropdownMenuItem>
                    <Link to="/admin" className="w-full">Admin Panel</Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout} className="text-red-600">
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
              className="px-4 py-1.5 border border-neutral-800 text-neutral-800 rounded-full text-sm hover:bg-neutral-100 transition-colors"
            >
              Log in
            </Link>
            <Link 
              to="/signup"
              className="px-4 py-1.5 bg-neutral-900 text-white rounded-full text-sm hover:bg-neutral-800 transition-colors"
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
          <DropdownMenuContent className="w-[100vw] border-0 rounded-none">
            <div className="space-y-4 p-2">
              {isAuthenticated ? (
                // Authenticated mobile menu
                <>
                  <DropdownMenuLabel>{user?.username || user?.name || 'User'}</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="hover:bg-transparent p-0">
                    <Link 
                      to="/profile"
                      className="w-full px-4 py-3 border border-neutral-800 text-neutral-800 rounded-full text-sm hover:bg-neutral-100 transition-colors block text-center"
                    >
                      Profile
                    </Link>
                  </DropdownMenuItem>
                  {user?.role === 'admin' && (
                    <DropdownMenuItem className="hover:bg-transparent p-0">
                      <Link 
                        to="/admin"
                        className="w-full px-4 py-3 border border-neutral-800 text-neutral-800 rounded-full text-sm hover:bg-neutral-100 transition-colors block text-center"
                      >
                        Admin Panel
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem className="hover:bg-transparent p-0">
                    <button
                      onClick={logout}
                      className="w-full px-4 py-3 bg-red-600 text-white rounded-full text-sm hover:bg-red-700 transition-colors block text-center"
                    >
                      Logout
                    </button>
                  </DropdownMenuItem>
                </>
              ) : (
                // Anonymous mobile menu
                <>
                  <DropdownMenuItem className="hover:bg-transparent p-0">
                    <Link 
                      to="/login"
                      className="w-full px-4 py-3 border border-neutral-800 text-neutral-800 rounded-full text-sm hover:bg-neutral-100 transition-colors block text-center"
                    >
                      Log in
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="hover:bg-transparent p-0">
                    <Link 
                      to="/signup"
                      className="w-full px-4 py-3 bg-neutral-900 text-white rounded-full text-sm hover:bg-neutral-800 transition-colors block text-center"
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
