import React from 'react';
import { Sparkles, Heart, Rocket, Users, Shield, Cpu } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AboutUs = () => {
  const navigate = useNavigate();

  const values = [
    {
      title: 'Precision Models',
      desc: 'Integrating advanced Gemini and Cloudinary engines for targeted extraction and isolation details.',
      icon: <Cpu className="h-5 w-5 text-indigo-400" />
    },
    {
      title: 'Developer Focused',
      desc: 'Building clean code sandboxes that compile and run fast on the client and servers.',
      icon: <Rocket className="h-5 w-5 text-emerald-400" />
    },
    {
      title: 'User Privacy First',
      desc: 'Leveraging secure JWT access-refresh tokens and cookie setups to keep credentials safe.',
      icon: <Shield className="h-5 w-5 text-purple-400" />
    }
  ];

  return (
    <div className="space-y-12 pb-12 text-white max-w-4xl mx-auto text-left">
      
      {/* Cover Header */}
      <div className="text-center space-y-4 pt-6">
        <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest bg-indigo-500/10 border border-indigo-500/20 px-3 py-1 rounded-full">About Us</span>
        <h2 className="text-2xl sm:text-4xl font-extrabold font-['Outfit']">Our Mission & Values</h2>
        <p className="text-xs sm:text-sm text-[#A1A1AA] max-w-md mx-auto">
          Learn about our commitment to building professional creative generators and ATS check filters.
        </p>
      </div>

      {/* Timeline Section */}
      <div className="bg-[#111111] border border-[#27272A] p-6 sm:p-8 rounded-2xl space-y-6">
        <h3 className="text-sm font-bold font-['Outfit'] border-b border-[#27272A] pb-3 text-white flex items-center gap-2">
          <Heart className="h-4.5 w-4.5 text-rose-500" /> Project Milestones
        </h3>
        
        <div className="space-y-6 relative pl-6 border-l border-[#27272A]">
          <div className="relative">
            <div className="absolute -left-[30px] top-1.5 w-4 h-4 rounded-full bg-indigo-500 border-4 border-[#111111]" />
            <h4 className="text-xs font-bold text-white font-['Outfit']">August 2026: Workstation Unification</h4>
            <p className="text-[10px] text-[#A1A1AA] mt-1 font-light leading-normal">
              Consolidated Career Hub templates and AI playground tools into a single MERN directory. Deleted legacy codebases and verified compilation.
            </p>
          </div>

          <div className="relative">
            <div className="absolute -left-[30px] top-1.5 w-4 h-4 rounded-full bg-purple-500 border-4 border-[#111111]" />
            <h4 className="text-xs font-bold text-white font-['Outfit']">June 2026: Cloudinary & Gemini Integrations</h4>
            <p className="text-[10px] text-[#A1A1AA] mt-1 font-light leading-normal">
              Connected Cloudinary multipart file uplodes and background removal algorithms. Implemented Gemini resume polishing models.
            </p>
          </div>

          <div className="relative">
            <div className="absolute -left-[30px] top-1.5 w-4 h-4 rounded-full bg-emerald-500 border-4 border-[#111111]" />
            <h4 className="text-xs font-bold text-white font-['Outfit']">January 2026: Core Architecture Draft</h4>
            <p className="text-[10px] text-[#A1A1AA] mt-1 font-light leading-normal">
              Configured Express backend endpoints, MongoDB schemas, and credentials authentication triggers using JWT cookies.
            </p>
          </div>
        </div>
      </div>

      {/* Grid Values */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
        {values.map((v, i) => (
          <div 
            key={i}
            className="bg-[#111111] border border-[#27272A] p-5 rounded-2xl hover:border-slate-700 transition-colors flex flex-col justify-between space-y-4"
          >
            <div className="p-2.5 bg-[#18181B] border border-[#27272A] rounded-xl w-fit">
              {v.icon}
            </div>
            <div>
              <h4 className="text-xs font-bold text-white font-['Outfit']">{v.title}</h4>
              <p className="text-[10px] text-[#A1A1AA] mt-1 font-light leading-normal">{v.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Tech Stack */}
      <div className="bg-[#111111] border border-[#27272A] p-6 rounded-2xl text-center space-y-4 relative overflow-hidden">
        <h4 className="text-xs font-bold text-white uppercase tracking-wider">Technology Stack</h4>
        <div className="flex flex-wrap justify-center gap-2">
          {['React 19', 'Vite', 'Node.js', 'Express', 'MongoDB Mongoose', 'Tailwind CSS v4', 'Gemini LLM', 'Cloudinary CDN'].map((tech) => (
            <span 
              key={tech}
              className="text-[10px] font-bold text-[#A1A1AA] bg-[#18181B] border border-[#27272A] px-3 py-1 rounded-full"
            >
              {tech}
            </span>
          ))}
        </div>
        <div className="absolute left-0 bottom-0 w-32 h-32 bg-indigo-500/5 blur-2xl pointer-events-none" />
      </div>

    </div>
  );
};

export default AboutUs;
