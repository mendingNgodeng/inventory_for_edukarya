import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  MapPin,
  Package,
  Tag,
  // LogOut,
  UserCheck,
  NotebookTabs,
  NotebookPen,
  X,
  WrenchIcon
} from 'lucide-react';
import { useAuth } from "../api/auth/hooks";
import type { LucideIcon } from "lucide-react";

interface MenuItem {
  path: string;
  icon: LucideIcon;
  label: string;
  adminOnly: boolean;
}
interface SidebarProps {
  onClose?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onClose }) => {
const {getAdmin, isAuthenticated } = useAuth();
const admin = getAdmin();
const isAuthed = isAuthenticated();
const allMenus: MenuItem[] = [
  { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard', adminOnly: true },
  { path: '/asset-types', icon: Package, label: 'List Tipe Aset', adminOnly: true },
  { path: '/locations', icon: MapPin, label: 'List Lokasi', adminOnly: true },
  { path: '/asset-categories', icon: Tag, label: 'List Kategori Aset', adminOnly: true },
  { path: '/user-karyawan', icon: UserCheck, label: 'List Karyawan', adminOnly: true },
  { path: '/asset', icon: NotebookTabs, label: 'List Aset', adminOnly: true },
  { path: '/asset-stock', icon: NotebookPen, label: 'List Stock aset', adminOnly: true },
  { path: '/borrow-assets', icon: NotebookPen, label: 'Pinjam Barang', adminOnly: false },
  { path: '/rental', icon: NotebookPen, label: 'Rental', adminOnly: true },

  { path: '/use-assets', icon: NotebookPen, label: 'Pakai Barang', adminOnly: true },
  { path: '/maintenance-assets', icon: WrenchIcon, label: 'Barang Rusak', adminOnly: true },
];
 const menuItems = allMenus.filter((item) => {
    if (!item.adminOnly) return true;
    if (!isAuthed) return false;
    if (admin?.role !== "ADMIN") return false;
    return true;
  });
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
          {/* <LogOut className="w-5 h-5 mr-3 flex-shrink-0" />
          <span className="truncate">Keluar</span> */}
        </button>
      </div>

      {/* User Info - Mobile Only */}
      <div className="md:hidden p-4 border-t border-gray-200 bg-gray-50">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
            <span className="text-blue-600 font-semibold">A</span>
          </div>
          <div className="flex-1 min-w-0">
            {/*aku mau ganti, jika ida admin maka tampilakn username dan role admin , jika tidak maka hanya tampilkan user*/}
            <p className="text-sm font-medium text-gray-700">
  {isAuthed && admin ? admin.username : "User"}
</p>

<p className="text-xs text-gray-500">
  {isAuthed && admin ? admin.role : "Guest"}
</p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;