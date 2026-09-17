import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Sparkles, 
  ArrowRight, 
  Play, 
  Image as ImageIcon, 
  FileText, 
  FileCheck, 
  Scissors, 
  Trash2, 
  PenTool, 
  Zap, 
  ChevronDown, 
  ChevronUp, 
  Star, 
  Check, 
  Users, 
  Cpu, 
  Layers, 
  Shield, 
  Clock, 
  Download,
  Menu,
  X
} from 'lucide-react';
import logo from '../assets/logo.jpg';

const Landing = () => {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Spotlight effect tracking
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const containerRef = useRef(null);

  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  // Tagline typewriter/rotator
  const rotatingWords = ['Images', 'Articles', 'Resumes', 'ATS Reports', 'Background Removal'];
  const [currentWordIdx, setCurrentWordIdx] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentWordIdx((prev) => (prev + 1) % rotatingWords.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  // Stats counting (simple mount increment simulation)
  const [stats, setStats] = useState({ images: 450000, articles: 90000, resumes: 45000, satisfaction: 96 });
  useEffect(() => {
    const timer = setInterval(() => {
      setStats(prev => ({
        images: prev.images < 500000 ? prev.images + 2500 : 500000,
        articles: prev.articles < 100000 ? prev.articles + 500 : 100000,
        resumes: prev.resumes < 50000 ? prev.resumes + 250 : 50000,
        satisfaction: 98
      }));
    }, 50);
    return () => clearInterval(timer);
  }, []);

  // Interactive UI simulator state
  const [simActiveTab, setSimActiveTab] = useState('image'); // 'image' | 'resume' | 'ats' | 'remover'
  const [simPrompt, setSimPrompt] = useState('A futuristic city on Mars under neon skies');
  const [simLoading, setSimLoading] = useState(false);
  const [simOutputImage, setSimOutputImage] = useState('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&h=600&q=80');

  const triggerSimulation = () => {
    setSimLoading(true);
    setTimeout(() => {
      setSimLoading(false);
      if (simActiveTab === 'image') {
        // Change image preset
        setSimOutputImage(
          simPrompt.toLowerCase().includes('mars')
            ? 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&h=600&q=80'
            : 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=600&h=600&q=80'
        );
      }
    }, 1500);
  };

  // FAQ Expand state
  const [faqOpenIdx, setFaqOpenIdx] = useState(0);

  const faqs = [
    {
      q: 'What is NovaAI?',
      a: 'NovaAI is a unified MERN stack workstation that consolidates advanced generative AI and career suites into one dashboard. It provides custom engines for generating art, text documents, compiling professional resumes, scoring ATS keyword match compliance, and styling uploads.'
    },
    {
      q: 'How does the ATS compliance score checker work?',
      a: 'Our checker extracts text details from your PDF and uses Gemini LLM algorithms to evaluate layout parsing, keyword density, and phrase alignment against target job descriptions to score overall suitability.'
    },
    {
      q: 'Can I download resumes in multiple formats?',
      a: 'Yes. The editor renders high-resolution pages locally, allowing exports in high-density Vector PDF, or screens directly formatted to PNG and JPG images.'
    },
    {
      q: 'Are payment checkouts secure?',
      a: 'All transactions are encrypted and processed through Razorpay API connections. Your premium credentials and subscription details sync instantly on the workstation.'
    }
  ];

  return (
    <div 
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="min-h-screen bg-[#09090B] text-white overflow-hidden relative font-sans selection:bg-indigo-500/30"
      style={{
        '--mouse-x': `${mousePos.x}px`,
        '--mouse-y': `${mousePos.y}px`
      }}
    >
      {/* Spotlight highlight background */}
      <div 
        className="pointer-events-none absolute -inset-px opacity-40 transition-opacity duration-300 z-10 hidden md:block"
        style={{
          background: `radial-gradient(600px circle at var(--mouse-x) var(--mouse-y), rgba(99, 102, 241, 0.15), transparent 40%)`
        }}
      />

      {/* Grid Pattern and Glowing Orbs */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f1f23_1px,transparent_1px),linear-gradient(to_bottom,#1f1f23_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-35" />
      <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-[radial-gradient(circle,rgba(99,102,241,0.08)_0%,transparent_70%)] blur-3xl pointer-events-none" />
      <div className="absolute top-[30%] right-[-10%] w-[45vw] h-[45vw] rounded-full bg-[radial-gradient(circle,rgba(6,182,212,0.05)_0%,transparent_70%)] blur-3xl pointer-events-none" />

      {/* Sticky Navbar */}
      <header className="sticky top-0 z-50 px-6 py-4 flex items-center justify-between border-b border-[#27272A] bg-[#09090B]/80 backdrop-blur-md">
        {/* Left Side Brand: Logo and brand text shown on all screens */}
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
          <img src={logo} alt="Logo" className="h-8 w-8 rounded-lg border border-[#27272A]" />
          <span className="inline font-['Outfit'] font-bold text-lg tracking-tight">
            Nova<span className="bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] bg-clip-text text-transparent">AI</span>
          </span>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 text-xs font-semibold text-[#A1A1AA]">
          <a href="#features" className="hover:text-white transition-colors">Features</a>
          <a href="#tools" className="hover:text-white transition-colors">Tools</a>
          <a href="#demo" className="hover:text-white transition-colors">Workflow</a>
          <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
          <a href="#faq" className="hover:text-white transition-colors">FAQ</a>
        </nav>

        {/* Desktop Action Buttons */}
        <div className="hidden md:flex items-center gap-4">
          <button 
            onClick={() => navigate('/login')}
            className="text-xs font-semibold text-[#A1A1AA] hover:text-white transition-colors cursor-pointer"
          >
            Sign in
          </button>
          <button 
            onClick={() => navigate('/login?tab=register')}
            className="px-4 py-2 bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] hover:opacity-95 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-600/10 cursor-pointer transition-all"
          >
            Sign up
          </button>
        </div>

        {/* Mobile Hamburger Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 rounded-xl border border-[#27272A] bg-[#111111] text-[#A1A1AA] hover:text-white focus:outline-none transition-colors cursor-pointer"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </header>

      {/* Mobile Navigation Slider Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          {/* Backdrop Overlay */}
          <div 
            className="fixed inset-0 bg-black/75 backdrop-blur-sm transition-opacity duration-300"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Slider Drawer Content */}
          <div className="fixed top-0 right-0 h-full w-[280px] sm:w-[320px] bg-[#0E0E11] border-l border-[#27272A] p-6 shadow-2xl flex flex-col justify-start z-50 transform transition-transform duration-300 ease-in-out overflow-y-auto">
            {/* Drawer Top Branding & Close Button */}
            <div className="flex items-center justify-between pb-4 border-b border-[#27272A]">
              <div 
                className="flex items-center gap-2 cursor-pointer" 
                onClick={() => { 
                  setMobileMenuOpen(false); 
                  navigate('/'); 
                }}
              >
                <img src={logo} alt="Logo" className="h-7 w-7 rounded-lg border border-[#27272A]" />
                <span className="font-['Outfit'] font-bold text-base tracking-tight text-white">
                  Nova<span className="bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] bg-clip-text text-transparent">AI</span>
                </span>
              </div>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-1.5 rounded-lg border border-[#27272A] bg-[#18181B] text-[#A1A1AA] hover:text-white transition-colors cursor-pointer"
                aria-label="Close menu"
              >
                <X className="h-4.5 w-4.5" />
              </button>
            </div>

            {/* Mobile Navigation Menu Links */}
            <nav className="flex flex-col gap-2 pt-4 text-sm font-semibold text-[#A1A1AA]">
              <a 
                href="#features" 
                onClick={() => setMobileMenuOpen(false)}
                className="hover:text-white hover:translate-x-1 transition-all py-2 border-b border-[#1F1F23]/40"
              >
                Features
              </a>
              <a 
                href="#tools" 
                onClick={() => setMobileMenuOpen(false)}
                className="hover:text-white hover:translate-x-1 transition-all py-2 border-b border-[#1F1F23]/40"
              >
                Tools
              </a>
              <a 
                href="#demo" 
                onClick={() => setMobileMenuOpen(false)}
                className="hover:text-white hover:translate-x-1 transition-all py-2 border-b border-[#1F1F23]/40"
              >
                Workflow
              </a>
              <a 
                href="#pricing" 
                onClick={() => setMobileMenuOpen(false)}
                className="hover:text-white hover:translate-x-1 transition-all py-2 border-b border-[#1F1F23]/40"
              >
                Pricing
              </a>
              <a 
                href="#faq" 
                onClick={() => setMobileMenuOpen(false)}
                className="hover:text-white hover:translate-x-1 transition-all py-2"
              >
                FAQ
              </a>
            </nav>

            {/* Mobile Slider Drawer Action Buttons - Immediately following items */}
            <div className="pt-4 mt-2 border-t border-[#27272A] space-y-3">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  navigate('/login');
                }}
                className="w-full py-3 px-4 rounded-xl border border-[#27272A] bg-[#18181B] hover:bg-[#27272A] text-white text-xs font-bold transition-all text-center cursor-pointer shadow-sm"
              >
                Sign in
              </button>

              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  navigate('/login?tab=register');
                }}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] hover:opacity-95 text-white text-xs font-bold transition-all text-center cursor-pointer shadow-lg shadow-indigo-600/20"
              >
                Sign up
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex flex-col items-center justify-center px-6 pt-12 pb-24 max-w-7xl mx-auto z-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center w-full">
          
          {/* Left Text details */}
          <div className="lg:col-span-6 space-y-8 text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 rounded-full text-indigo-400 text-xs font-semibold">
              <Sparkles className="h-3 w-3" /> Unified Creative Workstation
            </div>

            <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight leading-[1.1] font-['Outfit']">
              Build, Create & <br />
              Automate with <br />
              <span className="bg-gradient-to-r from-[#6366F1] via-[#8B5CF6] to-[#06B6D4] bg-clip-text text-transparent">
                {rotatingWords[currentWordIdx]}
              </span>
            </h1>

            <p className="text-sm sm:text-base text-[#A1A1AA] max-w-lg leading-relaxed font-light">
              Consolidate your stack. Render illustration vectors, write technical articles, analyze resumes, compile cover letters, and edit imagery with advanced generative models in one dashboard.
            </p>

            <div className="flex flex-wrap gap-4 pt-2">
              <button 
                onClick={() => navigate('/login?tab=register')}
                className="px-6 py-3.5 bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] hover:opacity-95 text-white font-bold rounded-xl text-xs flex items-center gap-2 shadow-lg shadow-indigo-600/20 transition-all cursor-pointer"
              >
                Start Free <ArrowRight className="h-4 w-4" />
              </button>
              <a 
                href="#demo"
                className="px-6 py-3.5 bg-[#111111] hover:bg-[#161618] text-white font-bold rounded-xl text-xs border border-[#27272A] flex items-center gap-2 transition-all"
              >
                <Play className="h-3.5 w-3.5 text-indigo-400 fill-indigo-400" /> Watch Demo
              </a>
            </div>
          </div>

          {/* Right Floating Glass Mockup */}
          <div className="lg:col-span-6 flex justify-center relative">
            
            {/* Dashboard Mockup Panel */}
            <div className="w-full max-w-[500px] aspect-[4/3] bg-[#111111]/85 border border-[#27272A] rounded-2xl p-4 shadow-2xl relative overflow-hidden backdrop-blur-md animate-float">
              {/* Header Bar */}
              <div className="flex items-center justify-between pb-3 border-b border-[#27272A]/80 mb-4">
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                </div>
                <div className="px-3 py-1 bg-[#09090B] border border-[#27272A] rounded-lg text-[9px] text-[#A1A1AA] font-mono">
                  https://studio.novaai.com/dashboard
                </div>
              </div>

              {/* simulated items grid */}
              <div className="grid grid-cols-2 gap-3 h-[calc(100%-48px)]">
                
                <div className="bg-[#18181B]/80 border border-[#27272A] p-3 rounded-xl flex flex-col justify-between hover:border-indigo-500/40 transition-colors">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-[#A1A1AA] font-bold">Image AI</span>
                    <ImageIcon className="h-3.5 w-3.5 text-[#06B6D4]" />
                  </div>
                  <div className="h-16 rounded-lg bg-[url('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=150&h=100&q=80')] bg-cover border border-[#27272A] mt-2" />
                  <span className="text-[9px] text-[#A1A1AA] mt-1.5 truncate">Generated Successfully</span>
                </div>

                <div className="bg-[#18181B]/80 border border-[#27272A] p-3 rounded-xl flex flex-col justify-between hover:border-indigo-500/40 transition-colors">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-[#A1A1AA] font-bold">ATS Radar</span>
                    <FileCheck className="h-3.5 w-3.5 text-emerald-400" />
                  </div>
                  <div className="space-y-1.5 my-2">
                    <div className="flex justify-between items-center">
                      <span className="text-[11px] font-bold">Score: 94%</span>
                      <span className="text-[8px] bg-emerald-500/10 text-emerald-400 px-1 rounded">Excellent</span>
                    </div>
                    <div className="w-full bg-[#27272A] h-1.5 rounded-full overflow-hidden">
                      <div className="bg-emerald-500 h-full w-[94%]" />
                    </div>
                  </div>
                  <span className="text-[9px] text-[#A1A1AA] truncate">Keyword match checked</span>
                </div>

                <div className="bg-[#18181B]/80 border border-[#27272A] p-3 rounded-xl flex flex-col justify-between hover:border-indigo-500/40 transition-colors">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-[#A1A1AA] font-bold">Resume Builder</span>
                    <FileText className="h-3.5 w-3.5 text-indigo-400" />
                  </div>
                  <div className="space-y-1 mt-2">
                    <div className="h-2 bg-[#27272A] rounded w-3/4" />
                    <div className="h-2 bg-[#27272A] rounded w-5/6" />
                    <div className="h-2 bg-[#27272A] rounded w-2/3" />
                  </div>
                  <span className="text-[9px] text-[#A1A1AA] truncate">Analysis Complete</span>
                </div>

                <div className="bg-[#18181B]/80 border border-[#27272A] p-3 rounded-xl flex flex-col justify-between hover:border-indigo-500/40 transition-colors">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-[#A1A1AA] font-bold">BG Eraser</span>
                    <Scissors className="h-3.5 w-3.5 text-rose-400" />
                  </div>
                  <div className="flex items-center justify-center h-12 border border-[#27272A] border-dashed rounded-lg mt-2">
                    <span className="text-[8px] text-[#A1A1AA] uppercase tracking-wide">BG Removed</span>
                  </div>
                  <span className="text-[9px] text-[#A1A1AA] truncate">Cloudinary transform active</span>
                </div>

              </div>
            </div>

            {/* floating absolute capsules */}
            <div className="absolute -top-6 -right-6 px-3 py-1.5 bg-[#111111] border border-[#27272A] rounded-xl flex items-center gap-2 shadow-lg animate-float-delayed z-35">
              <div className="w-2 h-2 rounded-full bg-emerald-500" />
              <span className="text-[9px] font-bold">Gemini 2.5 Active</span>
            </div>
            
            <div className="absolute -bottom-6 -left-6 px-3 py-2 bg-[#111111]/90 border border-[#27272A] rounded-xl flex items-center gap-2 shadow-lg animate-float z-35 backdrop-blur-md">
              <Zap className="h-3.5 w-3.5 text-amber-500 fill-amber-500/20" />
              <span className="text-[9px] font-bold">100% Secure MERN Stack</span>
            </div>

          </div>

        </div>
      </section>

      {/* Social Proof Marquee Section */}
      <section className="py-12 border-y border-[#27272A] bg-[#09090B]">
        <p className="text-[10px] font-bold text-center tracking-widest text-[#A1A1AA] uppercase mb-6 font-['Outfit']">TRUSTED BY DEVELOPERS AT LEADING TEAMS</p>
        <div className="relative w-full overflow-hidden">
          <div className="flex w-[200%] gap-12 animate-marquee">
            <span className="text-xs font-bold text-[#A1A1AA] tracking-widest uppercase opacity-40">Google Cloud</span>
            <span className="text-xs font-bold text-[#A1A1AA] tracking-widest uppercase opacity-40">Vercel Labs</span>
            <span className="text-xs font-bold text-[#A1A1AA] tracking-widest uppercase opacity-40">Linear Corp</span>
            <span className="text-xs font-bold text-[#A1A1AA] tracking-widest uppercase opacity-40">Framer Studio</span>
            <span className="text-xs font-bold text-[#A1A1AA] tracking-widest uppercase opacity-40">Runway ML</span>
            <span className="text-xs font-bold text-[#A1A1AA] tracking-widest uppercase opacity-40">Microsoft</span>
            <span className="text-xs font-bold text-[#A1A1AA] tracking-widest uppercase opacity-40">MongoDB Inc</span>
            
            {/* Duplicate for infinite loop */}
            <span className="text-xs font-bold text-[#A1A1AA] tracking-widest uppercase opacity-40">Google Cloud</span>
            <span className="text-xs font-bold text-[#A1A1AA] tracking-widest uppercase opacity-40">Vercel Labs</span>
            <span className="text-xs font-bold text-[#A1A1AA] tracking-widest uppercase opacity-40">Linear Corp</span>
            <span className="text-xs font-bold text-[#A1A1AA] tracking-widest uppercase opacity-40">Framer Studio</span>
            <span className="text-xs font-bold text-[#A1A1AA] tracking-widest uppercase opacity-40">Runway ML</span>
            <span className="text-xs font-bold text-[#A1A1AA] tracking-widest uppercase opacity-40">Microsoft</span>
            <span className="text-xs font-bold text-[#A1A1AA] tracking-widest uppercase opacity-40">MongoDB Inc</span>
          </div>
        </div>
      </section>

      {/* AI Tools Showcase Section */}
      <section id="tools" className="py-24 px-6 max-w-7xl mx-auto text-center space-y-12">
        <div className="space-y-4">
          <h2 className="text-2xl sm:text-4xl font-bold font-['Outfit'] text-white">Full-Featured AI Suite</h2>
          <p className="text-xs sm:text-sm text-[#A1A1AA] max-w-md mx-auto leading-relaxed">
            Equipped with cutting-edge tools to generate assets and optimize your career vectors.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {/* Tool Card: Image */}
          <div className="p-6 bg-[#111111] border border-[#27272A] rounded-2xl text-left hover:border-indigo-500/50 hover:-translate-y-1 transition-all group relative overflow-hidden">
            <div className="p-3 bg-indigo-500/5 border border-indigo-500/10 text-indigo-400 rounded-xl w-fit mb-4">
              <ImageIcon className="h-5 w-5" />
            </div>
            <h3 className="text-sm font-bold font-['Outfit'] text-white mb-2">Image Generator</h3>
            <p className="text-xs text-[#A1A1AA] leading-relaxed">
              Describe landscapes or objects and render high-resolution designs using AI prompts.
            </p>
            <div className="absolute bottom-0 right-0 w-24 h-24 bg-gradient-to-br from-indigo-500/10 to-transparent blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>

          {/* Tool Card: Article */}
          <div className="p-6 bg-[#111111] border border-[#27272A] rounded-2xl text-left hover:border-indigo-500/50 hover:-translate-y-1 transition-all group relative overflow-hidden">
            <div className="p-3 bg-purple-500/5 border border-purple-500/10 text-purple-450 rounded-xl w-fit mb-4">
              <PenTool className="h-5 w-5" />
            </div>
            <h3 className="text-sm font-bold font-['Outfit'] text-white mb-2">Article Generator</h3>
            <p className="text-xs text-[#A1A1AA] leading-relaxed">
              Write blog posts or outlines instantly by configuring target lengths and keywords.
            </p>
            <div className="absolute bottom-0 right-0 w-24 h-24 bg-gradient-to-br from-purple-500/10 to-transparent blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>

          {/* Tool Card: Resume */}
          <div className="p-6 bg-[#111111] border border-[#27272A] rounded-2xl text-left hover:border-indigo-500/50 hover:-translate-y-1 transition-all group relative overflow-hidden">
            <div className="p-3 bg-cyan-500/5 border border-cyan-500/10 text-cyan-400 rounded-xl w-fit mb-4">
              <FileText className="h-5 w-5" />
            </div>
            <h3 className="text-sm font-bold font-['Outfit'] text-white mb-2">Resume Builder</h3>
            <p className="text-xs text-[#A1A1AA] leading-relaxed">
              Create vector resumes with real-time templating and interactive credit-checked helpers.
            </p>
            <div className="absolute bottom-0 right-0 w-24 h-24 bg-gradient-to-br from-cyan-500/10 to-transparent blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>

          {/* Tool Card: ATS */}
          <div className="p-6 bg-[#111111] border border-[#27272A] rounded-2xl text-left hover:border-indigo-500/50 hover:-translate-y-1 transition-all group relative overflow-hidden">
            <div className="p-3 bg-emerald-500/5 border border-emerald-500/10 text-emerald-400 rounded-xl w-fit mb-4">
              <FileCheck className="h-5 w-5" />
            </div>
            <h3 className="text-sm font-bold font-['Outfit'] text-white mb-2">ATS Checker</h3>
            <p className="text-xs text-[#A1A1AA] leading-relaxed">
              Compare resumes against job requirements and identify missing keywords to clear blockers.
            </p>
            <div className="absolute bottom-0 right-0 w-24 h-24 bg-gradient-to-br from-emerald-500/10 to-transparent blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>

          {/* Tool Card: BG Remover */}
          <div className="p-6 bg-[#111111] border border-[#27272A] rounded-2xl text-left hover:border-indigo-500/50 hover:-translate-y-1 transition-all group relative overflow-hidden">
            <div className="p-3 bg-rose-500/5 border border-rose-500/10 text-rose-450 rounded-xl w-fit mb-4">
              <Scissors className="h-5 w-5" />
            </div>
            <h3 className="text-sm font-bold font-['Outfit'] text-white mb-2">Background Remover</h3>
            <p className="text-xs text-[#A1A1AA] leading-relaxed">
              Upload images and isolate objects cleanly via Cloudinary transformations.
            </p>
            <div className="absolute bottom-0 right-0 w-24 h-24 bg-gradient-to-br from-rose-500/10 to-transparent blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>

          {/* Tool Card: Object Remover */}
          <div className="p-6 bg-[#111111] border border-[#27272A] rounded-2xl text-left hover:border-indigo-500/50 hover:-translate-y-1 transition-all group relative overflow-hidden">
            <div className="p-3 bg-amber-500/5 border border-amber-500/10 text-amber-400 rounded-xl w-fit mb-4">
              <Trash2 className="h-5 w-5" />
            </div>
            <h3 className="text-sm font-bold font-['Outfit'] text-white mb-2">Object Remover</h3>
            <p className="text-xs text-[#A1A1AA] leading-relaxed">
              Remove unwanted elements from snapshots with AI fill techniques.
            </p>
            <div className="absolute bottom-0 right-0 w-24 h-24 bg-gradient-to-br from-amber-500/10 to-transparent blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>

        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-24 border-t border-[#27272A] bg-[#09090B]">
        <div className="max-w-7xl mx-auto px-6 text-center space-y-16">
          <div className="space-y-4">
            <h2 className="text-2xl sm:text-4xl font-bold font-['Outfit'] text-white">Three Simple Steps</h2>
            <p className="text-xs sm:text-sm text-[#A1A1AA] max-w-md mx-auto">
              How AI Studio handles your tasks from input prompt to ready-to-use vector downloads.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
            
            {/* Step 1 */}
            <div className="space-y-4 flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#6366F1] to-[#8B5CF6] flex items-center justify-center font-bold text-sm">
                1
              </div>
              <h3 className="text-sm font-bold text-white font-['Outfit']">Enter Prompt</h3>
              <p className="text-xs text-[#A1A1AA] max-w-xs leading-relaxed">
                Describe the image or paste your target job requirements and base resume.
              </p>
            </div>

            {/* Step 2 */}
            <div className="space-y-4 flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#6366F1] to-[#8B5CF6] flex items-center justify-center font-bold text-sm">
                2
              </div>
              <h3 className="text-sm font-bold text-white font-['Outfit']">AI Processing</h3>
              <p className="text-xs text-[#A1A1AA] max-w-xs leading-relaxed">
                Our Cloudinary transforms or Gemini intelligence engines analyze your data.
              </p>
            </div>

            {/* Step 3 */}
            <div className="space-y-4 flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#6366F1] to-[#8B5CF6] flex items-center justify-center font-bold text-sm">
                3
              </div>
              <h3 className="text-sm font-bold text-white font-['Outfit']">Download Results</h3>
              <p className="text-xs text-[#A1A1AA] max-w-xs leading-relaxed">
                Receive high-definition vectors (PDF, PNG, JPG) or formatted text documents.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* Interactive Product Showcase & Live AI Dashboard Preview */}
      <section id="demo" className="py-24 px-6 border-t border-[#27272A] bg-[#09090B]">
        <div className="max-w-7xl mx-auto space-y-16">
          <div className="text-center space-y-4">
            <h2 className="text-2xl sm:text-4xl font-bold font-['Outfit'] text-white">Live Workspace Simulator</h2>
            <p className="text-xs sm:text-sm text-[#A1A1AA] max-w-md mx-auto">
              Test out our modular workspace tools. Choose a tab on the left to simulate AI workflows.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            
            {/* Left selector panel (5/12) */}
            <div className="lg:col-span-5 bg-[#111111] border border-[#27272A] rounded-2xl p-6 flex flex-col justify-between space-y-6">
              
              <div className="space-y-4">
                <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">Simulator Console</span>
                <h3 className="text-lg font-bold font-['Outfit'] text-white">Choose Your Workspace Tool</h3>
                
                {/* Tab selections */}
                <div className="flex flex-col gap-2">
                  {[
                    { id: 'image', label: 'AI Image Canvas', desc: 'Text prompts to illustration vectors' },
                    { id: 'resume', label: 'Resume Analyzer', desc: 'Verify sections structure and summaries' },
                    { id: 'ats', label: 'ATS Score Checker', desc: 'Scan matching density on requirements' },
                    { id: 'remover', label: 'Background Removal', desc: 'Isolate key objects from uploads' }
                  ].map((tab) => (
                    <div 
                      key={tab.id}
                      onClick={() => {
                        setSimActiveTab(tab.id);
                        if (tab.id === 'image') setSimPrompt('A futuristic city on Mars under neon skies');
                        if (tab.id === 'resume') setSimPrompt('Software engineer profile with 5 years experience');
                        if (tab.id === 'ats') setSimPrompt('Compare Software Engineer resume against Node.js developer JD');
                        if (tab.id === 'remover') setSimPrompt('Upload a profile snapshot to strip details');
                      }}
                      className={`p-3 border rounded-xl cursor-pointer transition-all flex justify-between items-center ${
                        simActiveTab === tab.id 
                          ? 'border-indigo-500 bg-indigo-500/5' 
                          : 'border-slate-800 hover:border-[#27272A]'
                      }`}
                    >
                      <div className="text-left">
                        <h4 className="text-xs font-bold text-white">{tab.label}</h4>
                        <p className="text-[10px] text-[#A1A1AA] mt-0.5">{tab.desc}</p>
                      </div>
                      <div className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${simActiveTab === tab.id ? 'border-indigo-500' : 'border-slate-800'}`}>
                        {simActiveTab === tab.id && <div className="w-2 h-2 bg-indigo-500 rounded-full" />}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Text input prompt */}
              <div className="space-y-3">
                <div>
                  <label className="block text-[9px] font-bold text-[#A1A1AA] uppercase mb-1">Input configuration</label>
                  <input 
                    type="text"
                    value={simPrompt}
                    onChange={(e) => setSimPrompt(e.target.value)}
                    className="w-full bg-[#09090B] border border-[#27272A] rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-indigo-500 text-white"
                  />
                </div>
                <button 
                  onClick={triggerSimulation}
                  disabled={simLoading}
                  className="w-full py-2.5 bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] hover:opacity-95 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
                >
                  {simLoading ? (
                    <span className="w-3.5 h-3.5 rounded-full border-2 border-white border-t-transparent animate-spin"></span>
                  ) : (
                    <>
                      <Cpu className="h-3.5 w-3.5" /> Execute Simulation
                    </>
                  )}
                </button>
              </div>

            </div>

            {/* Right render board (7/12) */}
            <div className="lg:col-span-7 bg-[#111111] border border-[#27272A] rounded-2xl p-6 flex flex-col justify-between min-h-[400px]">
              <div className="flex justify-between items-center pb-3 border-b border-[#27272A]/80">
                <span className="text-[10px] font-bold text-[#A1A1AA] uppercase tracking-wider">Output Render Canvas</span>
                <span className="text-[9px] text-[#A1A1AA] font-mono">Status: {simLoading ? 'Processing...' : 'Ready'}</span>
              </div>

              <div className="flex-grow flex items-center justify-center py-6">
                {simLoading ? (
                  <div className="flex flex-col items-center space-y-3 text-[#A1A1AA]">
                    <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                    <span className="text-xs">Connecting to AI Studio sandbox...</span>
                  </div>
                ) : (
                  <div className="w-full max-w-[320px] aspect-square rounded-xl overflow-hidden border border-[#27272A] bg-[#09090B] p-4 flex flex-col justify-between shadow-lg">
                    {simActiveTab === 'image' && (
                      <img src={simOutputImage} className="w-full h-full object-cover rounded-lg" alt="Simulated Artwork" />
                    )}

                    {simActiveTab === 'resume' && (
                      <div className="space-y-3 h-full flex flex-col justify-between text-left">
                        <div className="flex items-center gap-2 pb-2 border-b border-[#27272A]">
                          <div className="w-6 h-6 rounded-full bg-indigo-500/10 text-indigo-400 flex items-center justify-center font-bold text-[10px]">S</div>
                          <div>
                            <h4 className="text-[10px] font-bold text-white">Software Engineer Profile</h4>
                            <p className="text-[8px] text-[#A1A1AA]">Modern Template</p>
                          </div>
                        </div>
                        <div className="space-y-1.5 flex-grow py-2">
                          <div className="h-2.5 bg-[#27272A] rounded w-full" />
                          <div className="h-2.5 bg-[#27272A] rounded w-5/6" />
                          <div className="h-2.5 bg-[#27272A] rounded w-2/3" />
                        </div>
                        <span className="text-[9px] text-emerald-400 font-bold flex items-center gap-1">
                          <Check className="h-3 w-3" /> Structurally Complete (100%)
                        </span>
                      </div>
                    )}

                    {simActiveTab === 'ats' && (
                      <div className="space-y-3 h-full flex flex-col justify-between text-left">
                        <div className="flex justify-between items-center pb-2 border-b border-[#27272A]">
                          <span className="text-[10px] font-bold text-white">ATS Compliance Match</span>
                          <span className="text-[9px] bg-indigo-500/10 text-indigo-400 px-1.5 py-0.5 rounded font-mono">Beta</span>
                        </div>
                        <div className="text-center py-4 space-y-2">
                          <span className="text-3xl font-extrabold font-['Outfit'] text-emerald-400">92%</span>
                          <p className="text-[9px] text-[#A1A1AA]">High compatibility matching score</p>
                        </div>
                        <div className="space-y-1 text-[8px] text-[#A1A1AA] bg-[#18181B] p-2 rounded-lg border border-[#27272A]">
                          <p>✓ Missing terms: none</p>
                          <p>✓ Formatting style: valid</p>
                        </div>
                      </div>
                    )}

                    {simActiveTab === 'remover' && (
                      <div className="relative h-full w-full flex items-center justify-center bg-[#18181B] border border-[#27272A] rounded-lg overflow-hidden">
                        <div className="text-center space-y-1 z-20">
                          <Scissors className="h-5 w-5 text-rose-500 mx-auto" />
                          <p className="text-[9px] font-bold">Cloudinary Transforms</p>
                          <p className="text-[8px] text-[#A1A1AA]">Background removed successfully</p>
                        </div>
                        <div className="absolute inset-0 bg-[radial-gradient(#27272a_1px,transparent_1px)] [background-size:12px_12px] opacity-40" />
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="flex justify-between items-center pt-3 border-t border-[#27272A]/80">
                <span className="text-[10px] text-[#A1A1AA]">Mock integrations sandbox</span>
                <button 
                  onClick={() => navigate('/login')}
                  className="px-3 py-1.5 bg-[#18181B] hover:bg-[#27272A] border border-[#27272A] text-white rounded-lg text-[10px] font-semibold flex items-center gap-1 transition-all cursor-pointer"
                >
                  <Download className="h-3 w-3" /> Save Artifact
                </button>
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* Statistics Counters Section */}
      <section className="py-24 border-t border-[#27272A] bg-[#0d0d11]/80">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          
          <div className="space-y-1">
            <h3 className="text-3xl sm:text-5xl font-extrabold font-['Outfit'] text-white">
              {stats.images.toLocaleString()}+
            </h3>
            <p className="text-[10px] sm:text-xs text-[#A1A1AA] uppercase tracking-wider font-semibold">Images Generated</p>
          </div>

          <div className="space-y-1">
            <h3 className="text-3xl sm:text-5xl font-extrabold font-['Outfit'] text-white">
              {stats.articles.toLocaleString()}+
            </h3>
            <p className="text-[10px] sm:text-xs text-[#A1A1AA] uppercase tracking-wider font-semibold">Articles Created</p>
          </div>

          <div className="space-y-1">
            <h3 className="text-3xl sm:text-5xl font-extrabold font-['Outfit'] text-white">
              {stats.resumes.toLocaleString()}+
            </h3>
            <p className="text-[10px] sm:text-xs text-[#A1A1AA] uppercase tracking-wider font-semibold">Resumes Reviewed</p>
          </div>

          <div className="space-y-1">
            <h3 className="text-3xl sm:text-5xl font-extrabold font-['Outfit'] text-white">
              {stats.satisfaction}%
            </h3>
            <p className="text-[10px] sm:text-xs text-[#A1A1AA] uppercase tracking-wider font-semibold">Satisfaction Rate</p>
          </div>

        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 px-6 border-t border-[#27272A] bg-[#09090B]">
        <div className="max-w-6xl mx-auto text-center space-y-16">
          <div className="space-y-4">
            <h2 className="text-2xl sm:text-4xl font-bold font-['Outfit'] text-white">Subscription Packages</h2>
            <p className="text-xs sm:text-sm text-[#A1A1AA] max-w-md mx-auto">
              Unlock priority Gemini generation queues and all resume layout options.
            </p>
          </div>

          {/* Pricing Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch max-w-5xl mx-auto">
            
            {/* Starter Plan */}
            <div className="bg-[#111111] border border-[#27272A] p-8 rounded-3xl text-left flex flex-col justify-between hover:border-slate-700 transition-colors">
              <div>
                <h3 className="text-base font-bold text-white">Free Starter</h3>
                <p className="text-[10px] text-[#A1A1AA] mt-1">Perfect for drafting your first resume.</p>
                <div className="my-6">
                  <span className="text-3xl font-extrabold text-white font-['Outfit']">$0</span>
                  <span className="text-[#A1A1AA] text-xs">/month</span>
                </div>
                <ul className="space-y-3 mb-8 text-xs text-[#A1A1AA]">
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-emerald-500 shrink-0" />
                    <span>10 free monthly AI credits</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-emerald-500 shrink-0" />
                    <span>Standard PDF/PNG downloads</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-emerald-500 shrink-0" />
                    <span>Basic template options</span>
                  </li>
                </ul>
              </div>
              <button 
                onClick={() => navigate('/login?tab=register')}
                className="w-full py-2.5 bg-[#18181B] hover:bg-[#27272A] text-white rounded-xl text-xs font-bold border border-[#27272A] transition-all cursor-pointer"
              >
                Get Started
              </button>
            </div>

            {/* Pro Plan */}
            <div className="bg-[#111111] border-2 border-indigo-500 p-8 rounded-3xl text-left flex flex-col justify-between relative shadow-lg shadow-indigo-650/10 scale-102">
              <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-indigo-600 text-white text-[9px] uppercase font-bold tracking-widest px-3 py-1 rounded-full flex items-center gap-1 shadow-sm">
                <Sparkles className="h-3 w-3" /> Most Popular
              </span>

              <div>
                <h3 className="text-base font-bold text-white">Professional Pro</h3>
                <p className="text-[10px] text-[#A1A1AA] mt-1">For creators looking to optimize content.</p>
                <div className="my-6">
                  <span className="text-3xl font-extrabold text-white font-['Outfit']">$12</span>
                  <span className="text-[#A1A1AA] text-xs">/month</span>
                </div>
                <ul className="space-y-3 mb-8 text-xs text-[#A1A1AA]">
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-indigo-400 shrink-0" />
                    <span>100 monthly AI credits</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-indigo-400 shrink-0" />
                    <span>All layout templates</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-indigo-400 shrink-0" />
                    <span>Unlimited PDF, PNG & JPG downloads</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-indigo-400 shrink-0" />
                    <span>ATS Matching checks</span>
                  </li>
                </ul>
              </div>
              <button 
                onClick={() => navigate('/login?tab=register')}
                className="w-full py-2.5 bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] hover:opacity-95 text-white rounded-xl text-xs font-bold shadow-md transition-all cursor-pointer"
              >
                Upgrade to Pro
              </button>
            </div>

            {/* Enterprise Plan */}
            <div className="bg-[#111111] border border-[#27272A] p-8 rounded-3xl text-left flex flex-col justify-between hover:border-slate-700 transition-colors">
              <div>
                <h3 className="text-base font-bold text-white">Enterprise VIP</h3>
                <p className="text-[10px] text-[#A1A1AA] mt-1">Multi-user workspace configurations.</p>
                <div className="my-6">
                  <span className="text-3xl font-extrabold text-white font-['Outfit']">$29</span>
                  <span className="text-[#A1A1AA] text-xs">/month</span>
                </div>
                <ul className="space-y-3 mb-8 text-xs text-[#A1A1AA]">
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-emerald-500 shrink-0" />
                    <span>300 monthly AI credits</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-emerald-500 shrink-0" />
                    <span>Everything in Professional Pro</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-emerald-500 shrink-0" />
                    <span>Dedicated priority support</span>
                  </li>
                </ul>
              </div>
              <button 
                onClick={() => navigate('/login')}
                className="w-full py-2.5 bg-[#18181B] hover:bg-[#27272A] text-white rounded-xl text-xs font-bold border border-[#27272A] transition-all cursor-pointer"
              >
                Contact Sales
              </button>
            </div>

          </div>
        </div>
      </section>

      {/* Testimonials Masonry Section */}
      <section className="py-24 px-6 border-t border-[#27272A] bg-[#09090B]">
        <div className="max-w-6xl mx-auto space-y-16">
          <div className="text-center space-y-4">
            <h2 className="text-2xl sm:text-4xl font-bold font-['Outfit'] text-white">Creator Feedback</h2>
            <p className="text-xs sm:text-sm text-[#A1A1AA] max-w-md mx-auto">
              Read reviews from recruiters, artists, and writers using AI Studio workflows.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                name: 'Sarah Jenkins',
                role: 'Recruiting Consultant',
                avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
                text: 'The ATS compliance scanning is spot on. It correctly identified missing keywords in my candidates\' resumes, helping them land interviews.'
              },
              {
                name: 'David Chen',
                role: 'Digital Illustrator',
                avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=David',
                text: 'I use the Image Generator daily to mock layouts. The prompt renderer is fast and lets me publish directly to the community feed.'
              },
              {
                name: 'Elena Rostova',
                role: 'Technical Writer',
                avatar: 'https://api.dicebear.com/7.x/lorelei/svg?seed=Elena',
                text: 'Generating structured articles has saved me hours of research time. The configuration options are extremely flexible.'
              }
            ].map((test, idx) => (
              <div 
                key={idx}
                className="bg-[#111111] border border-[#27272A] p-6 rounded-2xl hover:border-slate-700 transition-colors flex flex-col justify-between"
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4.5 w-4.5 text-amber-500 fill-amber-500" />
                  ))}
                </div>
                <p className="text-xs text-[#A1A1AA] leading-relaxed mb-6 font-light">"{test.text}"</p>
                <div className="flex items-center gap-3">
                  <img src={test.avatar} className="w-9 h-9 rounded-full bg-[#18181B]" alt="user" />
                  <div>
                    <h4 className="text-xs font-bold text-white font-['Outfit']">{test.name}</h4>
                    <p className="text-[9px] text-[#A1A1AA]">{test.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-24 px-6 border-t border-[#27272A] bg-[#09090B]">
        <div className="max-w-4xl mx-auto space-y-12">
          <div className="text-center space-y-4">
            <h2 className="text-2xl sm:text-4xl font-bold font-['Outfit'] text-white">Questions & Answers</h2>
            <p className="text-xs sm:text-sm text-[#A1A1AA]">
              Have questions about our engines? Look through our answers below.
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <div 
                key={idx}
                className="bg-[#111111] border border-[#27272A] rounded-2xl overflow-hidden"
              >
                <button 
                  onClick={() => setFaqOpenIdx(faqOpenIdx === idx ? null : idx)}
                  className="w-full p-5 flex justify-between items-center text-left text-xs font-bold text-white select-none cursor-pointer"
                >
                  <span>{faq.q}</span>
                  {faqOpenIdx === idx ? <ChevronUp className="h-4 w-4 text-[#A1A1AA]" /> : <ChevronDown className="h-4 w-4 text-[#A1A1AA]" />}
                </button>
                {faqOpenIdx === idx && (
                  <div className="p-5 pt-0 text-[11px] text-[#A1A1AA] leading-relaxed font-light border-t border-[#27272A]/50">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-24 px-6 border-t border-[#27272A] bg-[radial-gradient(ellipse_60%_50%_at_50%_50%,rgba(99,102,241,0.08),rgba(255,255,255,0))] text-center">
        <div className="max-w-3xl mx-auto space-y-8">
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight font-['Outfit'] text-white">
            Supercharge Your Workflow Today
          </h2>
          <p className="text-xs sm:text-sm text-[#A1A1AA] max-w-md mx-auto leading-relaxed">
            Join thousands of professionals compiling resumes and generating artwork with AI Studio workstation.
          </p>
          <div className="flex justify-center gap-4">
            <button 
              onClick={() => navigate('/login?tab=register')}
              className="px-8 py-3.5 bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] hover:opacity-95 text-white font-bold rounded-xl text-xs shadow-md cursor-pointer transition-all"
            >
              Get Started Free
            </button>
            <button 
              onClick={() => navigate('/about')}
              className="px-8 py-3.5 bg-[#111111] hover:bg-[#161618] text-white font-bold rounded-xl text-xs border border-[#27272A] transition-all cursor-pointer"
            >
              Learn More
            </button>
          </div>
        </div>
      </section>

      {/* Premium Footer */}
      <footer className="py-12 px-6 border-t border-[#27272A] bg-[#09090B]">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-5 gap-8">
          
          {/* Logo column */}
          <div className="col-span-2 space-y-4 text-left">
            <div className="flex items-center gap-2">
              <img src={logo} alt="Logo" className="h-6 w-6 rounded-lg" />
              <span className="font-['Outfit'] font-bold text-base text-white">
                Nova<span className="bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] bg-clip-text text-transparent">AI</span>
              </span>
            </div>
            <p className="text-[10px] text-[#A1A1AA] max-w-xs leading-relaxed font-light">
              MERN stack generative AI workspace and ATS-compliant career suites, built for high performance.
            </p>
            <p className="text-[9px] text-[#A1A1AA]">&copy; 2026 NovaAI. All rights reserved.</p>
          </div>

          {/* Links columns */}
          <div className="space-y-3 text-left">
            <h4 className="text-[10px] font-bold text-white uppercase tracking-wider">Product</h4>
            <ul className="space-y-1.5 text-[10px] text-[#A1A1AA]">
              <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
              <li><a href="#tools" className="hover:text-white transition-colors">AI Tools</a></li>
              <li><a href="#pricing" className="hover:text-white transition-colors">Pricing</a></li>
            </ul>
          </div>

          <div className="space-y-3 text-left">
            <h4 className="text-[10px] font-bold text-white uppercase tracking-wider">Company</h4>
            <ul className="space-y-1.5 text-[10px] text-[#A1A1AA]">
              <li><a href="/about" className="hover:text-white transition-colors">About Us</a></li>
              <li><a href="/help" className="hover:text-white transition-colors">Support</a></li>
              <li><a href="/plans" className="hover:text-white transition-colors">Plans</a></li>
            </ul>
          </div>

          <div className="space-y-3 text-left">
            <h4 className="text-[10px] font-bold text-white uppercase tracking-wider">Resources</h4>
            <ul className="space-y-1.5 text-[10px] text-[#A1A1AA]">
              <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
              <li><a href="#" className="hover:text-white transition-colors">API Keys</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
            </ul>
          </div>

        </div>
      </footer>

    </div>
  );
};

export default Landing;
