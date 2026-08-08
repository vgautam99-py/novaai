import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const isResumeBuilder = location.pathname === '/resume-builder';

  const isDashboard = location.pathname === '/dashboard';

  return (
    <div className="h-screen max-h-screen flex bg-[#09090B] text-white font-sans relative overflow-hidden">
      {/* Background Grid Pattern and Glowing Orbs (Same as Landing) */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f1f23_1px,transparent_1px),linear-gradient(to_bottom,#1f1f23_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-25 pointer-events-none" />
      <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-[radial-gradient(circle,rgba(99,102,241,0.05)_0%,transparent_70%)] blur-3xl pointer-events-none" />
      <div className="absolute top-[30%] right-[-10%] w-[45vw] h-[45vw] rounded-full bg-[radial-gradient(circle,rgba(6,182,212,0.03)_0%,transparent_70%)] blur-3xl pointer-events-none" />

      {/* Sidebar Navigation Drawer */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main workspace container */}
      <div className="flex-grow flex flex-col h-screen max-h-screen overflow-hidden relative z-10">
        <div className={isDashboard ? 'block md:hidden' : 'block'}>
          <Header onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />
        </div>
        
        {/* Nested page view */}
        <main className="flex-grow overflow-y-auto p-4 md:p-6 bg-transparent">
          <div className={`${isResumeBuilder ? 'max-w-full px-2' : 'max-w-6xl'} mx-auto`}>
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
