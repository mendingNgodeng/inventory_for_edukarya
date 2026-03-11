import React, { useMemo, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  MapPin,
  Package,
  Tag,
  UserCheck,
  NotebookTabs,
  NotebookPen,
  X,
  WrenchIcon,
  Logs,
  ChevronDown,
  FolderTree,
} from "lucide-react";
import { useAuth } from "../api/auth/hooks";
import type { LucideIcon } from "lucide-react";

interface BaseMenuItem {
  icon: LucideIcon;
  label: string;
  roles: ("ADMIN" | "KARYAWAN")[];
}

interface SingleMenuItem extends BaseMenuItem {
  path: string;
  children?: never;
}

interface GroupMenuItem extends BaseMenuItem {
  path?: never;
  children: SingleMenuItem[];
}

type MenuItem = SingleMenuItem | GroupMenuItem;

interface SidebarProps {
  onClose?: () => void;
}
const isGroupMenuItem = (item: MenuItem): item is GroupMenuItem => {
  return Array.isArray((item as GroupMenuItem).children);
};

const isSingleMenuItem = (item: MenuItem): item is SingleMenuItem => {
  return typeof (item as SingleMenuItem).path === "string";
};
const Sidebar: React.FC<SidebarProps> = ({ onClose }) => {
  const { getUSER, isAuthenticated } = useAuth();
  const user = getUSER();
  const isAuthed = isAuthenticated();
  const location = useLocation();

  // CHANGED: menu sekarang bisa punya children
  const allMenus: MenuItem[] = [
    {
      path: "/dashboard",
      icon: LayoutDashboard,
      label: "Dashboard",
      roles: ["ADMIN", "KARYAWAN"],
    },
    {
      path: "/borrow-assets",
      icon: NotebookPen,
      label: "Pinjam Barang",
      roles: ["ADMIN", "KARYAWAN"],
    },

    // ADDED: group menu untuk data master
    {
      icon: FolderTree,
      label: "Data Master",
      roles: ["ADMIN"],
      children: [
        {
          path: "/asset-types",
          icon: Package,
          label: "List Tipe Aset",
          roles: ["ADMIN"],
        },
        {
          path: "/asset-categories",
          icon: Tag,
          label: "List Kategori Aset",
          roles: ["ADMIN"],
        },
        {
          path: "/locations",
          icon: MapPin,
          label: "List Lokasi",
          roles: ["ADMIN"],
        },
      ],
    },

    {
      path: "/user-karyawan",
      icon: UserCheck,
      label: "List Karyawan",
      roles: ["ADMIN"],
    },
    {
      path: "/asset",
      icon: NotebookTabs,
      label: "List Aset",
      roles: ["ADMIN"],
    },
    {
      path: "/asset-stock",
      icon: NotebookPen,
      label: "List Stock aset",
      roles: ["ADMIN"],
    },
    {
      path: "/rental",
      icon: NotebookPen,
      label: "Rental",
      roles: ["ADMIN"],
    },
    {
      path: "/use-assets",
      icon: NotebookPen,
      label: "Pakai Barang",
      roles: ["ADMIN"],
    },
    {
      path: "/maintenance-assets",
      icon: WrenchIcon,
      label: "Barang Rusak",
      roles: ["ADMIN"],
    },
    {
      path: "/assetLogs",
      icon: Logs,
      label: "Logs Data Aset",
      roles: ["ADMIN"],
    },
  ];

  // CHANGED: filter roles untuk menu utama + children
 const menuItems = useMemo(() => {
  if (!isAuthed || !user?.role) return [];

  return allMenus
    .map((item) => {
      if (isGroupMenuItem(item)) {
        const filteredChildren = item.children.filter((child) =>
          child.roles.includes(user.role)
        );

        if (!item.roles.includes(user.role) || filteredChildren.length === 0) {
          return null;
        }

        return {
          ...item,
          children: filteredChildren,
        } as GroupMenuItem;
      }

      if (!item.roles.includes(user.role)) return null;
      return item;
    })
    .filter((item): item is MenuItem => item !== null);
}, [isAuthed, user?.role]);

  // ADDED: cek apakah group sedang aktif berdasarkan path child
  const isGroupActive = (item: GroupMenuItem) => {
    return item.children.some((child) => location.pathname === child.path);
  };

  // ADDED: default buka group kalau salah satu child sedang aktif
const [openGroups, setOpenGroups] = useState<Record<string, boolean>>(() => {
  const initial: Record<string, boolean> = {};
  for (const item of menuItems) {
    if (isGroupMenuItem(item)) {
      initial[item.label] = isGroupActive(item);
    }
  }
  return initial;
});

  const toggleGroup = (label: string) => {
    setOpenGroups((prev) => ({
      ...prev,
      [label]: !prev[label],
    }));
  };

  return (
    <aside className="h-full flex flex-col bg-white">
      <div className="p-4 sm:p-6 flex items-center justify-between border-b border-gray-200">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-blue-600">InvEnt</h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Inventory Management
          </p>
        </div>

        <button
          onClick={onClose}
          className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
          aria-label="Tutup sidebar"
        >
          <X className="w-5 h-5 text-gray-500" />
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto py-4 px-3 sm:px-4">
        <div className="space-y-1">
          {menuItems.map((item) => {
  if (isSingleMenuItem(item)) {
    return (
      <NavLink
        key={item.path}
        to={item.path}
        onClick={onClose}
        className={({ isActive }) =>
          `flex items-center px-3 sm:px-4 py-2.5 sm:py-3 text-sm font-medium rounded-lg transition-all
          ${
            isActive
              ? "bg-blue-50 text-blue-600 shadow-sm border-l-4 border-blue-600"
              : "text-gray-700 hover:bg-gray-50 hover:text-gray-900 border-l-4 border-transparent"
          }`
        }
      >
        <item.icon className="text-black w-5 h-5 mr-3 flex-shrink-0" />
        <span className="truncate text-black">{item.label}</span>
      </NavLink>
    );
  }

  if (isGroupMenuItem(item)) {
    const opened = openGroups[item.label] ?? false;
    const active = isGroupActive(item);

    return (
      <div key={item.label} className="rounded-lg overflow-hidden">
        <button
          type="button"
          onClick={() => toggleGroup(item.label)}
          className={`w-full flex items-center justify-between px-3 sm:px-4 py-2.5 sm:py-3 text-sm font-medium rounded-lg transition-all border-l-4 ${
            active
              ? "bg-blue-50 text-blue-600 shadow-sm border-blue-600"
              : "text-gray-700 hover:bg-gray-50 hover:text-gray-900 border-transparent"
          }`}
        >
          <div className="flex items-center">
            <item.icon className="text-black w-5 h-5 mr-3 flex-shrink-0" />
            <span className="truncate text-black">{item.label}</span>
          </div>

          <ChevronDown
            className={`w-4 h-4 text-gray-500 transition-transform ${
              opened ? "rotate-180" : ""
            }`}
          />
        </button>

        {opened && (
          <div className="mt-1 ml-4 space-y-1 border-l border-gray-200 pl-3">
            {item.children.map((child) => (
              <NavLink
                key={child.path}
                to={child.path}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center px-3 py-2 text-sm rounded-lg transition-all ${
                    isActive
                      ? "bg-blue-50 text-blue-600 font-semibold"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  }`
                }
              >
                <child.icon className="w-4 h-4 mr-2 flex-shrink-0" />
                <span>{child.label}</span>
              </NavLink>
            ))}
          </div>
        )}
      </div>
    );
  }

  return null;
})}
        </div>
      </nav>

      <div className="p-3 sm:p-4 border-t border-gray-200">
        <button className="flex items-center w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm font-medium text-red-600 rounded-lg hover:bg-red-50 transition-colors mt-1">
        </button>
      </div>

      <div className="md:hidden p-4 border-t border-gray-200 bg-gray-50">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
            <span className="text-blue-600 font-semibold">
              {user?.username?.[0]?.toUpperCase() ?? "U"}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-700">
              {isAuthed && user ? user.username : "User"}
            </p>

            <p className="text-xs text-gray-500">
              {isAuthed && user ? user.role : "Guest"}
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;