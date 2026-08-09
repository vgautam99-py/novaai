import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  X, 
  LayoutDashboard, 
  FileText, 
  FileCheck, 
  PenTool, 
  Newspaper, 
  Type, 
  Image, 
  Scissors, 
  Users, 
  User as UserIcon, 
  CreditCard, 
  HelpCircle, 
  Info,
  LogOut
} from 'lucide-react';
import logo from '../assets/logo.jpg';

const Sidebar = ({ isOpen, onClose }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleNav = (path) => {
    navigate(path);
    onClose();
  };

  const handleLogout = async () => {
    await logout();
    onClose();
    navigate('/');
  };

  const careerTools = [
    { name: 'Resume Builder', icon: <FileText className="h-4 w-4" />, path: '/resume-builder' },
    { name: 'ATS Score Checker', icon: <FileCheck className="h-4 w-4" />, path: '/ats' },
    { name: 'Cover Letter Generator', icon: <PenTool className="h-4 w-4" />, path: '/cover-letter' },
  ];

  const aiSaaSPlayground = [
    { name: 'Article Generator', icon: <Newspaper className="h-4 w-4" />, path: '/article-generator' },
    { name: 'Blog Title Generator', icon: <Type className="h-4 w-4" />, path: '/blog-title-generator' },
    { name: 'Image Generator', icon: <Image className="h-4 w-4" />, path: '/image-generator' },
    { name: 'Background Remover', icon: <Scissors className="h-4 w-4" />, path: '/background-remover' },
    { name: 'Community Creations', icon: <Users className="h-4 w-4" />, path: '/community' },
  ];

  const generalMenu = [
    { name: 'Profile Settings', icon: <UserIcon className="h-4 w-4" />, path: '/profile' },
    { name: 'Plans & Pricing', icon: <CreditCard className="h-4 w-4" />, path: '/plans' },
    { name: 'Help & Support', icon: <HelpCircle className="h-4 w-4" />, path: '/help' },
    { name: 'About Us', icon: <Info className="h-4 w-4" />, path: '/about' },
  ];

  const activeClass = "bg-[#6366F1]/10 text-white border-l-4 border-[#6366F1] font-semibold";
  const inactiveClass = "text-[#A1A1AA] hover:bg-[#1f1f23]/40 hover:text-white transition-all duration-200";

  return (
    <>
      {/* Dark backdrop overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-xs transition-opacity duration-300 md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar Drawer Box */}
      <div 
        className={`fixed inset-y-0 left-0 z-50 w-[260px] bg-[#111111] border-r border-[#27272A] shadow-2xl flex flex-col transform transition-transform duration-300 ease-out md:translate-x-0 md:static md:h-screen ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="overflow-y-auto flex-grow no-scrollbar">
          {/* Logo & Close Btn */}
          <div className="p-5 flex items-center justify-between border-b border-[#27272A]">
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => handleNav('/dashboard')}>
              <img src={logo} alt="NovaAI Logo" className="h-8 w-8 rounded-lg border border-[#27272A]" />
              <span className="font-outfit font-bold text-lg text-white tracking-tight">
                Nova<span className="text-[#6366F1]">AI</span>
              </span>
            </div>
            <button 
              onClick={onClose}
              className="p-1.5 hover:bg-[#1f1f23]/40 rounded-lg text-[#A1A1AA] hover:text-white transition-colors md:hidden"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Menu Items */}
          <div className="px-3 pt-6 pb-6 space-y-5">
            <div>
              <button
                onClick={() => handleNav('/dashboard')}
                className={`w-full flex items-center gap-3 px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  location.pathname === '/dashboard' ? activeClass : inactiveClass
                }`}
              >
                <LayoutDashboard className="h-4 w-4" />
                <span>Dashboard</span>
              </button>
            </div>

            {/* Career Hub */}
            <div>
              <p className="px-4 text-[10px] font-bold text-[#A1A1AA] uppercase tracking-wider mb-2 font-['Outfit']">Career Hub</p>
              <div className="space-y-0.5">
                {careerTools.map((item) => {
                  const active = location.pathname === item.path;
                  return (
                    <button
                      key={item.name}
                      onClick={() => handleNav(item.path)}
                      className={`w-full flex items-center gap-3 px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                        active ? activeClass : inactiveClass
                      }`}
                    >
                      <span className={active ? 'text-white' : 'text-[#A1A1AA]'}>{item.icon}</span>
                      <span>{item.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* AI Studio */}
            <div>
              <p className="px-4 text-[10px] font-bold text-[#A1A1AA] uppercase tracking-wider mb-2 font-['Outfit']">AI SaaS Studio</p>
              <div className="space-y-0.5">
                {aiSaaSPlayground.map((item) => {
                  const active = location.pathname === item.path;
                  return (
                    <button
                      key={item.name}
                      onClick={() => handleNav(item.path)}
                      className={`w-full flex items-center gap-3 px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                        active ? activeClass : inactiveClass
                      }`}
                    >
                      <span className={active ? 'text-white' : 'text-[#A1A1AA]'}>{item.icon}</span>
                      <span>{item.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* General */}
            <div>
              <p className="px-4 text-[10px] font-bold text-[#A1A1AA] uppercase tracking-wider mb-2 font-['Outfit']">General</p>
              <div className="space-y-0.5">
                {generalMenu.map((item) => {
                  const active = location.pathname === item.path;
                  return (
                    <button
                      key={item.name}
                      onClick={() => handleNav(item.path)}
                      className={`w-full flex items-center gap-3 px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                        active ? activeClass : inactiveClass
                      }`}
                    >
                      <span className={active ? 'text-white' : 'text-[#A1A1AA]'}>{item.icon}</span>
                      <span>{item.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

      </div>
    </>
  );
};

export default Sidebar;
