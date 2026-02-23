import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  MapPin,
  Package,
  Tag,
  LogOut,
  UserCheck,
  NotebookTabs,
  NotebookPen,
  X,
} from 'lucide-react';

interface SidebarProps {
  onClose?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onClose }) => {
  const menuItems = [
    { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/asset-types', icon: Package, label: 'List Tipe Aset' },
    { path: '/locations', icon: MapPin, label: 'List Lokasi' },
    { path: '/asset-categories', icon: Tag, label: 'List Kategori Aset' },
    { path: '/user-karyawan', icon: UserCheck, label: 'List Karyawan' },
    { path: '/asset', icon: NotebookTabs, label: 'List Aset' },
    { path: '/asset-stock', icon: NotebookPen, label: 'List Stock aset' },
    { path: '/BorrowUseAssets', icon: NotebookPen, label: 'Pakai/Pinjam' },


  ];

  return (
    <aside className="h-full flex flex-col bg-white">
      {/* Header Sidebar dengan tombol close di mobile */}
      <div className="p-4 sm:p-6 flex items-center justify-between border-b border-gray-200">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-blue-600">InvEnt</h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">Inventory Management</p>
        </div>
        
        {/* Tombol close untuk mobile */}
        <button
          onClick={onClose}
          className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
          aria-label="Tutup sidebar"
        >
          <X className="w-5 h-5 text-gray-500" />
        </button>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 overflow-y-auto py-4 px-3 sm:px-4">
        <div className="space-y-1">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center px-3 sm:px-4 py-2.5 sm:py-3 text-sm font-medium rounded-lg transition-all
                ${
                  isActive
                    ? 'bg-blue-50 text-blue-600 shadow-sm border-l-4 border-blue-600'
                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900 border-l-4 border-transparent'
                }`
              }
            >
              <item.icon className="w-5 h-5 mr-3 flex-shrink-0" />
              <span className="truncate">{item.label}</span>
            </NavLink>
          ))}
        </div>
      </nav>

      {/* Footer Menu */}
      <div className="p-3 sm:p-4 border-t border-gray-200">
        
        <button className="flex items-center w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm font-medium text-red-600 rounded-lg hover:bg-red-50 transition-colors mt-1">
          <LogOut className="w-5 h-5 mr-3 flex-shrink-0" />
          <span className="truncate">Keluar</span>
        </button>
      </div>

      {/* User Info - Mobile Only */}
      <div className="md:hidden p-4 border-t border-gray-200 bg-gray-50">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
            <span className="text-blue-600 font-semibold">A</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">Admin User</p>
            <p className="text-xs text-gray-500 truncate">admin@invent.com</p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;