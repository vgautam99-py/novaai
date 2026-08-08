import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast, { Toaster } from 'react-hot-toast';
import { Sparkles, Mail, Lock, User as UserIcon, Key, ArrowLeft, Shield, Cpu, Zap, Star } from 'lucide-react';
import logo from '../assets/logo.jpg';

const Login = () => {
  const [searchParams] = useSearchParams();
  const initialTab = searchParams.get('tab') === 'register' ? 'register' : 'login';
  
  const [tab, setTab] = useState(initialTab); // 'login' | 'register' | 'otp' | 'forgot'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  
  // OTP states
  const [otp, setOtp] = useState('');
  const [otpStep, setOtpStep] = useState(1); // 1: send, 2: verify
  const [resendCooldown, setResendCooldown] = useState(0);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login, register, loginWithGoogle, sendOTP, verifyOTP, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  useEffect(() => {
    let timer;
    if (resendCooldown > 0) {
      timer = setInterval(() => {
        setResendCooldown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [resendCooldown]);

  // Standard Login Submit
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please enter all fields');
      return;
    }

    // Email regex validation
    const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(email)) {
      toast.error('Please enter a valid email address');
      return;
    }

    if (password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    setIsSubmitting(true);
    const result = await login(email, password);
    setIsSubmitting(false);
    if (result.success) {
      toast.success('Successfully logged in!');
      navigate('/dashboard');
    } else {
      toast.error(result.message);
    }
  };

  // Standard Register Submit
  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !password) {
      toast.error('Please enter all fields');
      return;
    }

    if (name.trim().length < 2) {
      toast.error('Name must be at least 2 characters long');
      return;
    }

    // Email regex validation
    const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(email)) {
      toast.error('Please enter a valid email address');
      return;
    }

    if (password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    setIsSubmitting(true);
    const result = await register(name, email, password);
    setIsSubmitting(false);
    if (result.success) {
      toast.success('Successfully registered!');
      navigate('/dashboard');
    } else {
      toast.error(result.message);
    }
  };

  // Google Login Submit
  const handleGoogleSubmit = async () => {
    setIsSubmitting(true);
    const result = await loginWithGoogle();
    setIsSubmitting(false);
    if (result.success) {
      toast.success('Signed in with Google!');
      navigate('/dashboard');
    } else {
      toast.error(result.message);
    }
  };

  // Send Login OTP
  const handleSendOTP = async (e) => {
    e.preventDefault();
    if (!email) {
      toast.error('Please provide your email address.');
      return;
    }
    setIsSubmitting(true);
    const result = await sendOTP(email, 'login');
    setIsSubmitting(false);

    if (result.success) {
      setOtpStep(2);
      toast.success(result.message || 'OTP verification code sent.');
      setResendCooldown(60);
    } else {
      toast.error(result.message);
    }
  };

  // Verify Login OTP
  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    if (!otp) {
      toast.error('Please enter the code.');
      return;
    }
    setIsSubmitting(true);
    const result = await verifyOTP(email, otp);
    setIsSubmitting(false);

    if (result.success) {
      toast.success('OTP verified successfully!');
      navigate('/dashboard');
    } else {
      toast.error(result.message);
    }
  };

  const handleForgotPassword = (e) => {
    e.preventDefault();
    if (!email) {
      toast.error('Please enter your email first.');
      return;
    }
    toast.success(`Password reset instructions sent to ${email}`);
    setTab('login');
  };

  return (
    <div className="min-h-screen bg-[#09090B] flex text-white relative overflow-hidden font-sans">
      <Toaster />
      
      {/* Background Orbs & Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f1f23_1px,transparent_1px),linear-gradient(to_bottom,#1f1f23_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-25" />
      <div className="absolute top-[20%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-[radial-gradient(circle,rgba(99,102,241,0.05)_0%,transparent_70%)] blur-3xl pointer-events-none" />

      {/* Split Screen Layout */}
      <div className="w-full flex">
        
        {/* Left Side: Illustration Panel (hidden on mobile) */}
        <div className="hidden lg:flex lg:w-1/2 bg-[#09090B] border-r border-[#27272A] flex-col justify-between p-12 relative overflow-hidden select-none">
          <div className="flex items-center gap-2 cursor-pointer z-20" onClick={() => navigate('/')}>
            <img src={logo} alt="Logo" className="h-8 w-8 rounded-lg border border-[#27272A]" />
            <span className="font-['Outfit'] font-bold text-lg text-white">
              Nova<span className="bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] bg-clip-text text-transparent">AI</span>
            </span>
          </div>

          {/* Glowing orbital illustration */}
          <div className="flex-grow flex flex-col justify-center items-center relative z-20">
            <div className="w-80 h-80 rounded-full border border-dashed border-[#27272A] flex items-center justify-center relative animate-spin" style={{ animationDuration: '40s' }}>
              <div className="absolute top-0 left-1/2 w-4 h-4 bg-[#6366F1] rounded-full shadow-lg shadow-indigo-550/50" />
              <div className="absolute bottom-4 right-1/4 w-3.5 h-3.5 bg-[#06B6D4] rounded-full shadow-lg shadow-cyan-455/50" />
            </div>

            {/* Floating glass widget card */}
            <div className="absolute p-4 bg-[#111111]/85 border border-[#27272A] rounded-2xl shadow-2xl animate-float max-w-xs space-y-3 backdrop-blur-sm">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-[#6366F1]/10 rounded-lg text-[#6366F1]">
                  <Sparkles className="h-4 w-4" />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#A1A1AA]">ATS Analyzer Scan</span>
              </div>
              <p className="text-xs font-semibold text-white">"Resume analysis complete. ATS match score optimized to 94%."</p>
              <div className="w-full bg-[#27272A] h-1.5 rounded-full overflow-hidden">
                <div className="bg-emerald-500 h-full w-[94%]" />
              </div>
            </div>
          </div>

          <div className="z-20">
            <p className="text-xs text-[#A1A1AA] font-light">Powered by Gemini 2.5 and Cloudinary Transformations.</p>
          </div>
        </div>

        {/* Right Side: Authentication Panel */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 relative z-20">
          <div className="w-full max-w-md space-y-8 animate-fade-in">
            
            {/* Header logo for mobile */}
            <div className="lg:hidden flex justify-center mb-6">
              <div className="flex items-center gap-2">
                <img src={logo} alt="Logo" className="h-8 w-8 rounded-lg border border-[#27272A]" />
                <span className="font-['Outfit'] font-bold text-lg text-white">NovaAI</span>
              </div>
            </div>

            <div className="text-center lg:text-left space-y-2">
              <h2 className="text-2xl sm:text-3xl font-extrabold font-['Outfit'] text-white">Welcome Back</h2>
              <p className="text-xs text-[#A1A1AA]">Sign in to access your custom creative workstation.</p>
            </div>

            {/* Glassmorphism Auth Card */}
            <div className="bg-[#111111]/90 border border-[#27272A] p-6 sm:p-8 rounded-2xl shadow-xl space-y-6 backdrop-blur-md">
              
              {/* Tab Selector */}
              <div className="flex border-b border-[#27272A] text-xs font-semibold">
                <button 
                  onClick={() => setTab('login')}
                  className={`flex-1 pb-3 text-center cursor-pointer ${tab === 'login' ? 'text-white border-b-2 border-[#6366F1]' : 'text-[#A1A1AA]'}`}
                >
                  Password Login
                </button>
                <button 
                  onClick={() => setTab('register')}
                  className={`flex-1 pb-3 text-center cursor-pointer ${tab === 'register' ? 'text-white border-b-2 border-[#6366F1]' : 'text-[#A1A1AA]'}`}
                >
                  Create Account
                </button>
                <button 
                  onClick={() => { setTab('otp'); setOtpStep(1); }}
                  className={`flex-1 pb-3 text-center cursor-pointer ${tab === 'otp' ? 'text-white border-b-2 border-[#6366F1]' : 'text-[#A1A1AA]'}`}
                >
                  OTP Verification
                </button>
              </div>

              {/* Login Form */}
              {tab === 'login' && (
                <form className="space-y-4" onSubmit={handleLoginSubmit}>
                  <div>
                    <label className="block text-[10px] font-bold text-[#A1A1AA] uppercase tracking-wider mb-2">Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-3 h-4.5 w-4.5 text-slate-500" />
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="block w-full pl-11 pr-4 py-2.5 bg-[#09090B] border border-[#27272A] rounded-xl text-white text-xs focus:outline-none focus:border-[#6366F1] transition-all"
                        placeholder="name@example.com"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="block text-[10px] font-bold text-[#A1A1AA] uppercase tracking-wider">Password</label>
                      <button type="button" onClick={() => setTab('forgot')} className="text-[10px] text-[#6366F1] font-bold hover:underline">Forgot?</button>
                    </div>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-3 h-4.5 w-4.5 text-slate-500" />
                      <input
                        type="password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="block w-full pl-11 pr-4 py-2.5 bg-[#09090B] border border-[#27272A] rounded-xl text-white text-xs focus:outline-none focus:border-[#6366F1] transition-all"
                        placeholder="••••••••"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between py-1">
                    <label className="flex items-center text-[10px] font-bold text-[#A1A1AA] cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={rememberMe} 
                        onChange={(e) => setRememberMe(e.target.checked)} 
                        className="mr-2 accent-[#6366F1]" 
                      />
                      Remember Me
                    </label>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3 bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] hover:opacity-95 text-white font-bold rounded-xl text-xs shadow-md cursor-pointer transition-all disabled:opacity-50"
                  >
                    Sign In
                  </button>
                </form>
              )}

              {/* Register Form */}
              {tab === 'register' && (
                <form className="space-y-4" onSubmit={handleRegisterSubmit}>
                  <div>
                    <label className="block text-[10px] font-bold text-[#A1A1AA] uppercase tracking-wider mb-2">Full Name</label>
                    <div className="relative">
                      <UserIcon className="absolute left-3.5 top-3 h-4.5 w-4.5 text-slate-500" />
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="block w-full pl-11 pr-4 py-2.5 bg-[#09090B] border border-[#27272A] rounded-xl text-white text-xs focus:outline-none focus:border-[#6366F1] transition-all"
                        placeholder="John Doe"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-[#A1A1AA] uppercase tracking-wider mb-2">Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-3 h-4.5 w-4.5 text-slate-500" />
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="block w-full pl-11 pr-4 py-2.5 bg-[#09090B] border border-[#27272A] rounded-xl text-white text-xs focus:outline-none focus:border-[#6366F1] transition-all"
                        placeholder="name@example.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-[#A1A1AA] uppercase tracking-wider mb-2">Password</label>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-3 h-4.5 w-4.5 text-slate-500" />
                      <input
                        type="password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="block w-full pl-11 pr-4 py-2.5 bg-[#09090B] border border-[#27272A] rounded-xl text-white text-xs focus:outline-none focus:border-[#6366F1] transition-all"
                        placeholder="••••••••"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3 bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] hover:opacity-95 text-white font-bold rounded-xl text-xs shadow-md cursor-pointer transition-all disabled:opacity-50"
                  >
                    Sign Up
                  </button>
                </form>
              )}

              {/* OTP Form */}
              {tab === 'otp' && (
                otpStep === 1 ? (
                  <form className="space-y-4" onSubmit={handleSendOTP}>
                    <div>
                      <label className="block text-[10px] font-bold text-[#A1A1AA] uppercase tracking-wider mb-2">Email Address</label>
                      <div className="relative">
                        <Mail className="absolute left-3.5 top-3 h-4.5 w-4.5 text-slate-500" />
                        <input
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="block w-full pl-11 pr-4 py-2.5 bg-[#09090B] border border-[#27272A] rounded-xl text-white text-xs focus:outline-none focus:border-[#6366F1] transition-all"
                          placeholder="name@example.com"
                        />
                      </div>
                    </div>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-3 bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] hover:opacity-95 text-white font-bold rounded-xl text-xs shadow-md cursor-pointer transition-all disabled:opacity-50"
                    >
                      Send Verification Code
                    </button>
                  </form>
                ) : (
                  <form className="space-y-4" onSubmit={handleVerifyOTP}>
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <label className="block text-[10px] font-bold text-[#A1A1AA] uppercase tracking-wider">Verification Code</label>
                        <button type="button" onClick={() => setOtpStep(1)} className="text-[10px] text-[#6366F1] font-bold flex items-center gap-1">
                          <ArrowLeft className="h-3 w-3" /> Change
                        </button>
                      </div>
                      <div className="relative">
                        <Key className="absolute left-3.5 top-3 h-4.5 w-4.5 text-slate-500" />
                        <input
                          type="text"
                          required
                          maxLength="6"
                          value={otp}
                          onChange={(e) => setOtp(e.target.value)}
                          className="block w-full pl-11 pr-4 py-2.5 bg-[#09090B] border border-[#27272A] rounded-xl text-white text-center font-mono font-bold tracking-[4px] text-xs focus:outline-none focus:border-[#6366F1]"
                          placeholder="000000"
                        />
                      </div>
                    </div>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-3 bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] hover:opacity-95 text-white font-bold rounded-xl text-xs shadow-md cursor-pointer transition-all disabled:opacity-50"
                    >
                      Verify & Sign In
                    </button>
                  </form>
                )
              )}

              {/* Forgot Password */}
              {tab === 'forgot' && (
                <form className="space-y-4" onSubmit={handleForgotPassword}>
                  <div>
                    <label className="block text-[10px] font-bold text-[#A1A1AA] uppercase tracking-wider mb-2">Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-3 h-4.5 w-4.5 text-slate-500" />
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="block w-full pl-11 pr-4 py-2.5 bg-[#09090B] border border-[#27272A] rounded-xl text-white text-xs focus:outline-none focus:border-[#6366F1] transition-all"
                        placeholder="name@example.com"
                      />
                    </div>
                  </div>
                  
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3 bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] hover:opacity-95 text-white font-bold rounded-xl text-xs shadow-md cursor-pointer transition-all disabled:opacity-50"
                  >
                    Send Recovery Link
                  </button>

                  <button 
                    type="button" 
                    onClick={() => setTab('login')} 
                    className="w-full text-xs text-center text-[#A1A1AA] hover:text-white mt-2 block"
                  >
                    Back to Sign In
                  </button>
                </form>
              )}

              {/* Google Sign In Divider */}
              {(tab === 'login' || tab === 'register' || tab === 'otp') && (
                <>
                  <div className="relative flex py-1 items-center">
                    <div className="flex-grow border-t border-[#27272A]"></div>
                    <span className="flex-shrink mx-4 text-[#A1A1AA] text-[10px] uppercase tracking-wider">or</span>
                    <div className="flex-grow border-t border-[#27272A]"></div>
                  </div>

                  <button
                    onClick={handleGoogleSubmit}
                    type="button"
                    disabled={isSubmitting}
                    className="w-full py-2.5 bg-white hover:bg-slate-100 text-slate-900 font-bold rounded-xl text-xs flex items-center justify-center gap-2 border border-slate-200 transition-all cursor-pointer"
                  >
                    <svg className="h-4 w-4" viewBox="0 0 24 24">
                      <path d="M21.35,11.1H12v2.7h5.38c-0.24,1.28 -0.96,2.37 -2.04,3.1l3.12,2.42c1.83,-1.69 2.89,-4.17 2.89,-7.02C21.35,11.83 21.28,11.43 21.35,11.1z" fill="#4285F4" />
                      <path d="M12,20.6c2.43,0 4.47,-0.81 5.96,-2.18l-3.12,-2.42c-0.87,0.58 -1.97,0.93 -3.12,0.93 -2.4,0 -4.43,-1.62 -5.16,-3.8H3.29v2.5C4.78,18.59 8.16,20.6 12,20.6z" fill="#34A853" />
                      <path d="M6.84,13.13C6.65,12.57 6.65,11.97 6.84,11.41V8.91H3.29C2.65,10.18 2.65,11.82 3.29,13.09v2.5L6.84,13.13z" fill="#FBBC05" />
                      <path d="M12,6.12c1.32,-0.02 2.58,0.48 3.51,1.38l2.62,-2.62C16.48,3.31 14.3,2.4 12,2.4 8.16,2.4 4.41,4.41 3.29,7.41l3.55,2.5C7.57,7.74 9.6,6.12 12,6.12z" fill="#EA4335" />
                    </svg>
                    Continue with Google
                  </button>
                </>
              )}

            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Login;
