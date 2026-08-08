import React from 'react';
import logo from '../assets/logo.jpg';

const Footer = () => {
  return (
    <footer className="no-print bg-slate-900 text-slate-400 py-12 px-6 border-t border-slate-800">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="space-y-4 col-span-1 md:col-span-2">
          <div className="flex items-center gap-2">
            <img src={logo} alt="NovaAI Logo" className="h-7 w-7 rounded-lg" />
            <span className="font-['Outfit'] font-bold text-lg text-white">
              Nova<span className="text-primary">AI</span>
            </span>
          </div>
          <p className="text-xs max-w-sm leading-relaxed text-slate-400">
            NovaAI is a comprehensive generative AI workstation and resume career optimization suite. Create stunning designs, write articles, check ATS optimization scores, and download resumes instantly.
          </p>
        </div>
        
        <div>
          <h4 className="font-['Outfit'] font-semibold text-white text-sm mb-4">Features</h4>
          <ul className="space-y-2 text-xs">
            <li><a href="/resume-builder" className="hover:text-white transition-colors">Resume Builder</a></li>
            <li><a href="/ats" className="hover:text-white transition-colors">ATS Checker</a></li>
            <li><a href="/cover-letter" className="hover:text-white transition-colors">Cover Letter Generator</a></li>
            <li><a href="/image-generator" className="hover:text-white transition-colors">AI Image Studio</a></li>
          </ul>
        </div>

        <div>
          <h4 className="font-['Outfit'] font-semibold text-white text-sm mb-4">Legal</h4>
          <ul className="space-y-2 text-xs">
            <li><a href="/about" className="hover:text-white transition-colors">About Us</a></li>
            <li><a href="/help" className="hover:text-white transition-colors">Support & Help</a></li>
            <li><a href="/plans" className="hover:text-white transition-colors">Pricing & Plans</a></li>
          </ul>
        </div>
      </div>

      <div className="max-w-6xl mx-auto mt-12 pt-6 border-t border-slate-800 text-center text-xs">
        <p>© {new Date().getFullYear()} NovaAI. All rights reserved. Created with Antigravity.</p>
      </div>
    </footer>
  );
};

export default Footer;
