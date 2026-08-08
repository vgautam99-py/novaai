import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Menu, Zap, LogOut, Award } from 'lucide-react';
import logo from '../assets/logo.jpg';

const Header = ({ onMenuToggle }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const getCreditsLimit = () => {
    const limits = { free: 10, pro: 100, vip: 300 };
    return limits[user?.plan] || 10;
  };

  const creditsUsed = user?.aiCreditsUsed || 0;
  const creditsLimit = getCreditsLimit();
  const percentage = Math.min(100, (creditsUsed / creditsLimit) * 100);

  return (
    <header className="sticky top-0 z-40 px-4 py-3 flex items-center justify-between border-b border-[#27272A] bg-[#111111]/90 backdrop-blur-md text-white">
      {/* Left: Mobile Toggle & Brand */}
      <div className="flex items-center gap-3">
        <button 
          onClick={onMenuToggle}
          className="p-1.5 hover:bg-[#18181B] rounded-lg text-[#A1A1AA] hover:text-white transition-colors md:hidden cursor-pointer"
        >
          <Menu className="h-5 w-5" />
        </button>
        
        <div className="hidden md:flex items-center gap-2">
          <Zap className="h-4.5 w-4.5 text-primary fill-primary" />
          <span className="font-['Outfit'] font-bold text-sm text-white uppercase tracking-wide">
            Workspace Panel
          </span>
        </div>
      </div>

      {/* Center Logo & Name (visible ONLY on mobile screens) */}
      <div className="flex md:hidden items-center gap-2 absolute left-1/2 transform -translate-x-1/2">
        <img src={logo} alt="Logo" className="h-6 w-6 rounded-md border border-[#27272A]" />
        <span className="font-outfit font-bold text-sm text-white tracking-tight">
          Nova<span className="text-[#6366F1]">AI</span>
        </span>
      </div>

      {/* Right: Credits Capsule & Avatar */}
      <div className="flex items-center gap-4">
        {/* Credits progress bar */}
        {user && (
          <div className="hidden sm:flex items-center gap-3 px-3 py-1.5 bg-[#18181B] border border-[#27272A] rounded-full shadow-inner">
            <Zap className="h-3.5 w-3.5 text-amber-500 fill-amber-555 animate-pulse" />
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-[#A1A1AA] font-['Outfit'] leading-none">
                AI Credits: {creditsUsed} / {creditsLimit}
              </span>
              <div className="w-24 h-1 bg-[#27272A] rounded-full mt-1 overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] rounded-full transition-all duration-300"
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          </div>
        )}

        {/* User circular avatar with hover details */}
        <div className="relative group">
          <div 
            onClick={() => navigate('/profile')}
            className="w-9 h-9 rounded-full overflow-hidden cursor-pointer border border-[#27272A] hover:scale-105 transition-all flex items-center justify-center bg-primary/10 shadow-sm"
          >
            {user?.avatar ? (
              <img
                src={user.avatar}
                className="w-full h-full object-cover"
                alt="Avatar"
              />
            ) : (
              <span className="text-sm font-bold text-primary uppercase">
                {user?.name ? user.name.charAt(0) : 'U'}
              </span>
            )}
          </div>

          {/* Hover Tooltip Box */}
          <div className="absolute right-0 mt-2.5 w-48 bg-[#111111] border border-[#27272A] rounded-xl shadow-xl p-3.5 text-left opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
            <h4 className="text-xs font-bold text-white leading-tight truncate">{user?.name || 'User'}</h4>
            <p className="text-[9px] text-[#A1A1AA] mt-0.5 truncate">{user?.email}</p>
            <div className="mt-2.5 pt-2 border-t border-[#27272A] flex items-center justify-between">
              <span className="text-[9px] text-[#A1A1AA] font-bold uppercase tracking-wider">Plan</span>
              <span className="text-[9px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full uppercase flex items-center gap-1">
                <Award className="h-3 w-3" /> {user?.plan || 'Free'}
              </span>
            </div>
            <div className="mt-1.5 sm:hidden flex items-center justify-between">
              <span className="text-[9px] text-[#A1A1AA] font-bold uppercase tracking-wider">Credits</span>
              <span className="text-[9px] font-bold text-[#A1A1AA]">
                {creditsUsed} / {creditsLimit}
              </span>
            </div>
          </div>
        </div>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="w-9 h-9 rounded-full border border-rose-950 bg-rose-950/20 text-rose-400 hover:bg-rose-950/40 hover:text-rose-300 hover:border-rose-900 transition-all flex items-center justify-center shadow-sm cursor-pointer"
          title="Sign Out"
        >
          <LogOut className="h-4.5 w-4.5" />
        </button>
      </div>
    </header>
  );
};

export default Header;
