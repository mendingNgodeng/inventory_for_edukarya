import React, { useState } from 'react';
import { Search, User, Menu, ChevronDown } from 'lucide-react';
import Button from './ui/button'
import { useNavigate } from "react-router-dom";
import { useAuth } from "../api/auth/hooks";
interface NavbarProps {
  onToggleSidebar: () => void;
  isSidebarOpen: boolean;
}

const Navbar: React.FC<NavbarProps> = ({ onToggleSidebar, isSidebarOpen }) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
const navigate = useNavigate();
const { logout, getAdmin, isAuthenticated } = useAuth();
const admin = getAdmin();
const isAuthed = isAuthenticated();
  // const [isSearchFocused, setIsSearchFocused] = useState(false);

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-10">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left section - Toggle button and logo */}
          <div className="flex items-center space-x-3">
            <button
              onClick={onToggleSidebar}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors md:hidden"
              aria-label={isSidebarOpen ? 'Tutup sidebar' : 'Buka sidebar'}
            >
              <Menu className="w-5 h-5 text-gray-600" />
            </button>
            
            {/* Mobile logo */}
            <span className="md:hidden font-bold text-lg text-blue-600">InvEnt</span>
          </div>

          {/* Search bar - Desktop */}
          <div className="hidden md:flex flex-1 max-w-lg mx-4">
            <div className="relative w-full">
         
            </div>
          </div>

          {/* Right section - Notifications and Profile */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            {/* Search button - Mobile */}
            <button className="md:hidden p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
              <Search className="w-5 h-5" />
            </button>

            {/* Notifications */}
            <button className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
            {!isAuthed && (
  <Button
    type="button"
    variant="outline_blue"
    onClick={() => navigate("/login")}
  >
    Login Admin
  </Button>
)}
            </button>

            {/* Profile dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center space-x-2 sm:space-x-3 p-1.5 sm:p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                </div>
                <div className="hidden lg:block text-left">
                  {/*aku mau ganti, jika ida admin maka tampilakn username dan role admin , jika tidak maka hanya tampilkan user*/}
               <p className="text-sm font-medium text-gray-700">
  {isAuthed && admin ? admin.username : "User"}
</p>

<p className="text-xs text-gray-500">
  {isAuthed && admin ? admin.role : "Guest"}
</p>
                </div>
                <ChevronDown className="hidden sm:block w-4 h-4 text-gray-500" />
              </button>

              {/* Dropdown menu */}
              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                  {/* if i have time to polish */}
                  {/* <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Profil</a>
                  <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Pengaturan</a>
                  <hr className="my-1 border-gray-200" /> */}

                  {/* fungsi logout disini please */}
               
             {isAuthed && (
            <button
                onClick={logout}
                className="w-full text-left block px-4 py-2 text-sm text-red-600 hover:bg-red-50"
              >
                Keluar
            </button>
)}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Search bar - Mobile (collapsible) */}
        <div className="md:hidden py-2 border-t border-gray-100">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Cari..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg 
                       focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                       text-sm"
            />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;