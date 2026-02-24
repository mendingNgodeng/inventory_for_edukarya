import React, { type ReactNode, useState, useEffect } from 'react';
// import { Menu } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import { Outlet } from "react-router-dom";
interface DashboardLayoutProps {
  children: ReactNode;
}


const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setSidebarOpen(true);
      } else {
        setSidebarOpen(false);
      }
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = () => {
    if (isMobile) {
      setSidebarOpen(false);
    }
  };

  return (
  // <div className="flex min-h-screen bg-gray-50">
   <div className="flex min-h-screen w-screen bg-gray-50 overflow-hidden">   
    {/* Overlay Mobile */}
    {isMobile && sidebarOpen && (
      <div
        className="fixed inset-0 bg-opacity-50 z-20"
        onClick={closeSidebar}
      />
    )}

    {/* Sidebar */}
    <div
      className={`
        fixed md:static inset-y-0 left-0 z-30
        transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        md:translate-x-0 md:w-64
        w-64 bg-white shadow-lg md:shadow-none
      `}
    >
      <Sidebar onClose={closeSidebar} />
    </div>

    {/* Main Content */}
    {/* <div className="flex-1 flex flex-col"> */}
      <div className="flex-1 flex flex-col min-w-0">

      <Navbar onToggleSidebar={toggleSidebar} isSidebarOpen={sidebarOpen} />

      <main className="flex-1 bg-gray-50 p-4 sm:p-6 lg:p-8 overflow-y-auto">
        <Outlet />
      </main>

    </div>
  </div>
);}
export default DashboardLayout;