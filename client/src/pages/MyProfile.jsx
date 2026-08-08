import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Sparkles, User as UserIcon, Mail, Shield, Key, Eye, HelpCircle, Activity, Award, Trash2, Globe } from 'lucide-react';
import toast from 'react-hot-toast';

const MyProfile = () => {
  const { user, setUser } = useAuth();
  
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [loading, setLoading] = useState(false);

  const getCreditsLimit = () => {
    const limits = { free: 10, pro: 100, vip: 300 };
    return limits[user?.plan] || 10;
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const { data } = await axios.put('/api/auth/profile', { name, email });
      if (data.success) {
        setUser(data.user);
        toast.success('Profile details updated!');
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }

    try {
      setLoading(true);
      const { data } = await axios.put('/api/auth/password', { currentPassword, newPassword });
      if (data.success) {
        toast.success('Password updated successfully!');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 pb-12 text-white text-left">
      
      {/* Cover Header */}
      <div className="relative bg-[#111111] border border-[#27272A] p-6 rounded-2xl flex flex-col md:flex-row items-center gap-6 overflow-hidden">
        <div className="w-20 h-20 rounded-full bg-[#18181B] border-2 border-indigo-500 flex items-center justify-center font-bold text-2xl text-white shrink-0 shadow-lg shadow-indigo-650/10">
          {user?.avatar ? (
            <img src={user.avatar} className="w-full h-full object-cover rounded-full" alt="Avatar" />
          ) : (
            user?.name ? user.name[0].toUpperCase() : 'U'
          )}
        </div>

        <div className="space-y-1 text-center md:text-left flex-grow">
          <span className="text-[9px] bg-indigo-500/10 text-indigo-400 border border-indigo-550/20 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
            {user?.plan || 'Free'} Member
          </span>
          <h2 className="text-xl font-bold font-['Outfit'] mt-1">{user?.name || 'User Profile'}</h2>
          <p className="text-xs text-[#A1A1AA]">{user?.email}</p>
        </div>

        <div className="flex gap-4 shrink-0 bg-[#09090B] border border-[#27272A] p-4 rounded-xl text-center">
          <div>
            <span className="block text-xl font-extrabold text-indigo-400 font-['Outfit']">
              {getCreditsLimit() - (user?.aiCreditsUsed || 0)}
            </span>
            <span className="text-[9px] uppercase font-bold text-[#A1A1AA]">Credits Left</span>
          </div>
          <div className="border-l border-[#27272A]" />
          <div>
            <span className="block text-xl font-extrabold text-emerald-450 font-['Outfit']">
              {user?.aiCreditsUsed || 0}
            </span>
            <span className="text-[9px] uppercase font-bold text-[#A1A1AA]">Used</span>
          </div>
        </div>

        {/* Backdrop glow */}
        <div className="absolute right-0 top-0 w-32 h-32 bg-indigo-500/5 blur-2xl pointer-events-none" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Left Column forms (8/12) */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Profile details form */}
          <div className="bg-[#111111] border border-[#27272A] p-6 rounded-2xl space-y-6">
            <h3 className="text-sm font-bold font-['Outfit'] border-b border-[#27272A] pb-3 flex items-center gap-2">
              <UserIcon className="h-4.5 w-4.5 text-indigo-455" /> Edit Account Info
            </h3>
            
            <form onSubmit={handleUpdateProfile} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold text-[#A1A1AA] uppercase tracking-wider mb-2">Display Name</label>
                <input 
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-[#09090B] border border-[#27272A] rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#6366F1]"
                  placeholder="Full Name"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-[#A1A1AA] uppercase tracking-wider mb-2">Email Address</label>
                <input 
                  type="email" 
                  value={email}
                  disabled
                  className="w-full bg-[#09090B] border border-[#27272A] rounded-xl px-3 py-2 text-xs opacity-50 cursor-not-allowed"
                />
              </div>

              <div className="md:col-span-2 pt-2">
                <button 
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 bg-white hover:bg-slate-100 text-slate-900 rounded-xl text-xs font-bold shadow-md cursor-pointer transition-all disabled:opacity-50"
                >
                  {loading ? 'Saving...' : 'Save Profile Details'}
                </button>
              </div>
            </form>
          </div>

          {/* Password update form */}
          <div className="bg-[#111111] border border-[#27272A] p-6 rounded-2xl space-y-6">
            <h3 className="text-sm font-bold font-['Outfit'] border-b border-[#27272A] pb-3 flex items-center gap-2">
              <Key className="h-4.5 w-4.5 text-purple-450" /> Update Password
            </h3>
            
            <form onSubmit={handleUpdatePassword} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-[#A1A1AA] uppercase tracking-wider mb-2">Current Password</label>
                  <input 
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="w-full bg-[#09090B] border border-[#27272A] rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#6366F1]"
                    placeholder="••••••••"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-[#A1A1AA] uppercase tracking-wider mb-2">New Password</label>
                  <input 
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full bg-[#09090B] border border-[#27272A] rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#6366F1]"
                    placeholder="••••••••"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-[#A1A1AA] uppercase tracking-wider mb-2">Confirm Password</label>
                  <input 
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full bg-[#09090B] border border-[#27272A] rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#6366F1]"
                    placeholder="••••••••"
                  />
                </div>
              </div>
              <div className="pt-2">
                <button 
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] text-white rounded-xl text-xs font-bold shadow-md cursor-pointer transition-all disabled:opacity-50"
                >
                  {loading ? 'Updating...' : 'Update Password'}
                </button>
              </div>
            </form>
          </div>

        </div>

        {/* Right Column details (4/12) */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Linked profiles */}
          <div className="bg-[#111111] border border-[#27272A] p-5 rounded-2xl space-y-4">
            <h4 className="text-xs font-bold font-['Outfit'] border-b border-[#27272A] pb-2 text-white">Connected Accounts</h4>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between items-center p-3 bg-[#18181B] border border-[#27272A] rounded-xl">
                <span className="font-semibold">Google Account</span>
                <span className="text-[10px] text-emerald-450 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-full">Connected</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-[#18181B] border border-[#27272A] rounded-xl opacity-60">
                <span className="font-semibold">Microsoft Outlook</span>
                <span className="text-[10px] text-[#A1A1AA] hover:underline cursor-pointer">Link Account</span>
              </div>
            </div>
          </div>

          {/* Danger zone */}
          <div className="bg-[#111111] border border-[#27272A] p-5 rounded-2xl space-y-4">
            <h4 className="text-xs font-bold font-['Outfit'] text-rose-500 border-b border-[#27272A] pb-2">Danger Zone</h4>
            <p className="text-[10px] text-[#A1A1AA] leading-normal font-light">
              Permanently delete all workspace resume files, illustrations, articles, and payment configurations. This cannot be undone.
            </p>
            <button 
              onClick={() => toast.error('This sandbox account deletion is restricted.')}
              className="w-full py-2.5 bg-rose-950/20 hover:bg-rose-950/40 text-rose-400 border border-rose-900/40 hover:border-rose-900 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
            >
              <Trash2 className="h-4 w-4" /> Delete Account
            </button>
          </div>

        </div>

      </div>

    </div>
  );
};

export default MyProfile;
