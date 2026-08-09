import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { 
  FileText, 
  FileCheck, 
  PenTool, 
  Newspaper, 
  Type, 
  Image as ImageIcon, 
  Scissors, 
  Sparkles, 
  ChevronRight, 
  Plus, 
  ArrowRight,
  Clock,
  Zap,
  TrendingUp,
  Award,
  LogOut
} from 'lucide-react';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const { user, setUser, logout } = useAuth();
  const navigate = useNavigate();
  
  console.log('[Dashboard] Current User:', user);

  const [resumes, setResumes] = useState([]);
  const [creations, setCreations] = useState([]);
  const [loadingResumes, setLoadingResumes] = useState(true);
  const [loadingCreations, setLoadingCreations] = useState(true);

  // Simple Greeting assistant
  const getGreeting = () => {
    const hrs = new Date().getHours();
    if (hrs < 12) return 'Good Morning';
    if (hrs < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  useEffect(() => {
    const fetchResumes = async () => {
      try {
        const { data } = await axios.get('/api/resumes');
        setResumes(data.slice(0, 3));
      } catch (error) {
        console.error('Error fetching resumes:', error.message);
      } finally {
        setLoadingResumes(false);
      }
    };

    const fetchCreations = async () => {
      try {
        const { data } = await axios.get('/api/ai/user-creations');
        if (data.success) {
          setCreations(data.creations.slice(0, 3));
        }
      } catch (error) {
        console.error('Error fetching creations:', error.message);
      } finally {
        setLoadingCreations(false);
      }
    };

    fetchResumes();
    fetchCreations();
  }, []);

  const handleCreateResume = async () => {
    try {
      const { data } = await axios.post('/api/resumes', { title: 'My New Resume' });
      if (data && data._id) {
        toast.success('Resume created successfully!');
        navigate(`/resume-builder?id=${data._id}`);
      }
    } catch (error) {
      toast.error('Failed to create new resume.');
    }
  };

  const getCreditsLimit = () => {
    const limits = { free: 10, pro: 100, vip: 300 };
    return limits[user?.plan] || 10;
  };

  const percentage = Math.min(100, ((user?.aiCreditsUsed || 0) / getCreditsLimit()) * 100);

  const careerCards = [
    {
      title: 'Resume Builder',
      desc: 'Interactive live editor with A4 templates & AI suggestion assistants.',
      icon: <FileText className="h-4.5 w-4.5 text-indigo-400" />,
      path: '/resume-builder',
      color: 'hover:border-indigo-500/50 hover:bg-indigo-550/5'
    },
    {
      title: 'ATS Score Checker',
      desc: 'Verify match density on requirements and resolve missing keywords.',
      icon: <FileCheck className="h-4.5 w-4.5 text-emerald-450" />,
      path: '/ats',
      color: 'hover:border-emerald-500/50 hover:bg-emerald-555/5'
    },
    {
      title: 'Cover Letter Generator',
      desc: 'Bespoke letter generators matching selected qualifications to JDs.',
      icon: <PenTool className="h-4.5 w-4.5 text-amber-400" />,
      path: '/cover-letter',
      color: 'hover:border-amber-500/50 hover:bg-amber-550/5'
    }
  ];

  const aiCards = [
    {
      title: 'Article Generator',
      desc: 'Notion-like document writing workspace powered by Gemini API.',
      icon: <Newspaper className="h-4.5 w-4.5 text-purple-400" />,
      path: '/article-generator'
    },
    {
      title: 'Blog Title Creator',
      desc: 'Catchy headline suggestion engine with tone filters.',
      icon: <Type className="h-4.5 w-4.5 text-sky-400" />,
      path: '/blog-title-generator'
    },
    {
      title: 'Image Generator',
      desc: 'Prompts to futuristic high-res illustrations with community options.',
      icon: <ImageIcon className="h-4.5 w-4.5 text-fuchsia-400" />,
      path: '/image-generator'
    },
    {
      title: 'Background Remover',
      desc: 'Clean transparency cuts on uploaded images via Cloudinary.',
      icon: <Scissors className="h-4.5 w-4.5 text-rose-450" />,
      path: '/background-remover'
    }
  ];

  return (
    <div className="space-y-8 pb-12 text-white">
      
      {/* Top Banner Widget */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 bg-[#111111] p-6 rounded-2xl border border-[#27272A] shadow-sm relative overflow-visible">
        <div className="space-y-1 z-20">
          <h2 className="text-xl sm:text-2xl font-bold font-outfit text-white flex items-center gap-2">
            {getGreeting()}, {user?.name || 'Creator'} <Sparkles className="h-5 w-5 text-amber-500 fill-amber-500 animate-pulse" />
          </h2>
          <p className="text-xs text-[#A1A1AA]">Manage templates, generate artwork, and test compliance models.</p>
        </div>

        <div className="hidden md:flex items-center gap-4 z-20">
          <div 
            onClick={() => navigate('/profile')} 
            className="relative group cursor-pointer"
          >
            {user?.avatar ? (
              <img 
                src={user.avatar} 
                alt="Avatar" 
                className="w-10 h-10 rounded-full object-cover border border-[#27272A] shadow-sm hover:border-[#6366F1]/50 hover:scale-105 duration-200 transition-all" 
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-[#6366F1]/10 border border-[#27272A] text-[#6366F1] flex items-center justify-center font-bold text-sm hover:border-[#6366F1]/50 hover:scale-105 duration-200 transition-all">
                {user?.name ? user.name[0].toUpperCase() : 'U'}
              </div>
            )}

            {/* Hover Tooltip Box (Same style as other pages, positioned downside) */}
            <div className="absolute right-0 mt-2.5 w-48 bg-[#111111] border border-[#27272A] rounded-xl shadow-xl p-3.5 text-left opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
              <h4 className="text-xs font-bold text-white leading-tight truncate">{user?.name || 'Creator'}</h4>
              <p className="text-[9px] text-[#A1A1AA] mt-0.5 truncate">{user?.email}</p>
              
              <div className="mt-2.5 pt-2 border-t border-[#27272A] flex items-center justify-between">
                <span className="text-[9px] text-[#A1A1AA] font-bold uppercase tracking-wider">Plan</span>
                <span className="text-[9px] font-bold text-[#6366F1] bg-[#6366F1]/10 px-2 py-0.5 rounded-full uppercase flex items-center gap-1">
                  <Award className="h-3 w-3" /> {user?.plan || 'Free'}
                </span>
              </div>
            </div>
          </div>

          <button 
            onClick={async () => {
              await logout();
              navigate('/');
            }}
            className="flex items-center gap-1.5 px-4 py-2.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-450 rounded-xl text-xs font-bold border border-rose-500/20 shadow-md cursor-pointer transition-all shrink-0"
          >
            <LogOut className="h-3.5 w-3.5" /> Sign Out
          </button>
        </div>
        
        {/* Subtle background glow */}
        <div className="absolute right-0 top-0 w-48 h-48 bg-gradient-to-br from-indigo-500/10 to-transparent blur-2xl pointer-events-none" />
      </div>

      {/* Main Contents Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column (8/12) */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Stats Analytics Widgets */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <div className="bg-[#111111] border border-[#27272A] p-4 rounded-2xl flex flex-col justify-between">
              <span className="text-[9px] font-bold text-[#A1A1AA] uppercase">Token usage</span>
              <span className="text-xl font-bold mt-2 text-white">Active</span>
              <span className="text-[8px] text-[#A1A1AA] mt-1">Gemini 2.5 API Connection</span>
            </div>
            
            <div className="bg-[#111111] border border-[#27272A] p-4 rounded-2xl flex flex-col justify-between">
              <span className="text-[9px] font-bold text-[#A1A1AA] uppercase">Creations</span>
              <span className="text-xl font-bold mt-2 text-white">Cloudinary</span>
              <span className="text-[8px] text-[#A1A1AA] mt-1">Transformed CDN assets</span>
            </div>

            <div className="bg-[#111111] border border-[#27272A] p-4 rounded-2xl col-span-2 sm:col-span-1 flex flex-col justify-between relative overflow-hidden">
              <div className="flex justify-between items-center text-[9px] font-bold text-[#A1A1AA] uppercase">
                <span>Credits Used</span>
                <span className="text-white">{user?.aiCreditsUsed || 0} / {getCreditsLimit()}</span>
              </div>
              <div className="w-full bg-[#27272A] h-1.5 rounded-full overflow-hidden mt-3">
                <div 
                  className="h-full bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] rounded-full transition-all"
                  style={{ width: `${percentage}%` }}
                />
              </div>
              <span className="text-[8px] text-[#A1A1AA] mt-2">Resets monthly</span>
            </div>
          </div>

          {/* Career Suite */}
          <div>
            <div className="flex items-center gap-1.5 mb-3">
              <TrendingUp className="h-4 w-4 text-indigo-400" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#A1A1AA] font-['Outfit']">Career Hub Tools</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {careerCards.map((card) => (
                <div 
                  key={card.title}
                  onClick={() => navigate(card.path)}
                  className={`p-4 bg-[#111111] border border-[#27272A] rounded-2xl shadow-sm cursor-pointer transition-all flex flex-col justify-between h-40 group ${card.color}`}
                >
                  <div className="p-2.5 bg-[#18181B] border border-[#27272A] rounded-xl w-fit">
                    {card.icon}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white font-['Outfit'] mt-3 flex items-center gap-1 group-hover:text-indigo-400 transition-colors">
                      {card.title} <ChevronRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </h4>
                    <p className="text-[9px] text-[#A1A1AA] mt-1 leading-normal font-light">{card.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* AI SaaS playground */}
          <div>
            <div className="flex items-center gap-1.5 mb-3">
              <Sparkles className="h-4 w-4 text-emerald-400" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#A1A1AA] font-['Outfit']">AI SaaS Playground</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {aiCards.map((card) => (
                <div 
                  key={card.title}
                  onClick={() => navigate(card.path)}
                  className="p-4 bg-[#111111] border border-[#27272A] rounded-2xl hover:border-slate-700 cursor-pointer transition-all flex items-start gap-4 group"
                >
                  <div className="p-2.5 bg-[#18181B] border border-[#27272A] rounded-xl shrink-0">
                    {card.icon}
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-xs font-bold text-white font-['Outfit'] flex items-center gap-1 group-hover:text-indigo-400 transition-colors">
                      {card.title} <ArrowRight className="h-3.5 w-3.5 text-[#A1A1AA] group-hover:translate-x-1 transition-transform" />
                    </h4>
                    <p className="text-[9px] text-[#A1A1AA] leading-normal font-light">{card.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right Column (4/12) */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Recent Resumes */}
          <div className="bg-[#111111] border border-[#27272A] p-5 rounded-2xl shadow-sm space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-[#27272A]">
              <h4 className="text-xs font-bold font-['Outfit'] text-white flex items-center gap-2">
                <FileText className="h-4 w-4 text-indigo-400" /> Recent Resumes
              </h4>
              <button onClick={() => navigate('/resume-builder')} className="text-[9px] font-bold text-indigo-400 hover:underline cursor-pointer">View All</button>
            </div>

            {loadingResumes ? (
              <div className="py-8 text-center text-[10px] text-[#A1A1AA]">Loading resumes...</div>
            ) : resumes.length === 0 ? (
              <div className="py-8 text-center text-[9px] text-[#A1A1AA]">No resumes built yet.</div>
            ) : (
              <div className="space-y-2">
                {resumes.map((res) => (
                  <div 
                    key={res._id}
                    onClick={() => navigate(`/resume-builder?id=${res._id}`)}
                    className="p-3 bg-[#18181B] border border-[#27272A] rounded-xl hover:border-slate-700 transition-colors cursor-pointer flex justify-between items-center"
                  >
                    <div>
                      <h5 className="text-xs font-bold text-white font-['Outfit']">{res.title}</h5>
                      <p className="text-[8px] text-[#A1A1AA] mt-0.5">Layout: {res.template || 'modern'}</p>
                    </div>
                    <ChevronRight className="h-4 w-4 text-[#A1A1AA]" />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recent Creations */}
          <div className="bg-[#111111] border border-[#27272A] p-5 rounded-2xl shadow-sm space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-[#27272A]">
              <h4 className="text-xs font-bold font-['Outfit'] text-white flex items-center gap-2">
                <Clock className="h-4 w-4 text-purple-400" /> Latest Activities
              </h4>
              <button onClick={() => navigate('/community')} className="text-[9px] font-bold text-indigo-400 hover:underline cursor-pointer">Community</button>
            </div>

            {loadingCreations ? (
              <div className="py-8 text-center text-[10px] text-[#A1A1AA]">Loading creations...</div>
            ) : creations.length === 0 ? (
              <div className="py-8 text-center text-[9px] text-[#A1A1AA]">No generations created.</div>
            ) : (
              <div className="space-y-2">
                {creations.map((c) => (
                  <div 
                    key={c._id}
                    className="p-3 bg-[#18181B] border border-[#27272A] rounded-xl flex items-center gap-3"
                  >
                    {c.type === 'image' ? (
                      <img src={c.content} className="w-9 h-9 rounded-lg object-cover bg-black border border-[#27272A]" alt="creation" />
                    ) : (
                      <div className="w-9 h-9 rounded-lg bg-indigo-500/10 border border-[#27272A] text-indigo-400 flex items-center justify-center font-bold text-[10px] capitalize shrink-0">
                        {c.type[0]}
                      </div>
                    )}
                    <div className="overflow-hidden flex-grow">
                      <h5 className="text-[10px] font-bold text-white truncate font-['Outfit']">{c.prompt || 'Generated content'}</h5>
                      <p className="text-[8px] text-[#A1A1AA] capitalize">{c.type.replace('-', ' ')}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};

export default Dashboard;
