import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { 
  Save, 
  ArrowLeft, 
  Sparkles, 
  Plus, 
  Trash2, 
  User as UserIcon, 
  Briefcase, 
  GraduationCap, 
  Code, 
  FileText, 
  Globe, 
  Award,
  Loader2,
  Upload,
  X,
  Download,
  Check,
  Layers
} from 'lucide-react';

import TimelineSidebarTemplate from '../components/templates/TimelineSidebarTemplate';
import SplitHeaderTemplate from '../components/templates/SplitHeaderTemplate';
import BorderBoxTemplate from '../components/templates/BorderBoxTemplate';
import TimelineBannerTemplate from '../components/templates/TimelineBannerTemplate';
import HeaderOverlayTemplate from '../components/templates/HeaderOverlayTemplate';
import DoubleBoxTemplate from '../components/templates/DoubleBoxTemplate';

const TABS = [
  { id: 'personal', label: 'Contact', icon: <UserIcon className="w-4 h-4" /> },
  { id: 'summary', label: 'Summary', icon: <FileText className="w-4 h-4" /> },
  { id: 'experience', label: 'Experience', icon: <Briefcase className="w-4 h-4" /> },
  { id: 'education', label: 'Education', icon: <GraduationCap className="w-4 h-4" /> },
  { id: 'projects', label: 'Projects', icon: <Code className="w-4 h-4" /> },
  { id: 'skills', label: 'Skills', icon: <Sparkles className="w-4 h-4" /> },
  { id: 'extras', label: 'Extras', icon: <Award className="w-4 h-4" /> },
  { id: 'layout', label: 'Layout & Theme', icon: <Layers className="w-4 h-4" /> }
];

const themeColors = [
  { id: 'down-earth', name: 'Down to Earth' },
  { id: 'soph-pink', name: 'Sophisticated Pinks' },
  { id: 'forest-hues', name: 'Forest Hues' },
  { id: 'blue-orange', name: 'Blue & Orange' },
  { id: 'navy-gold', name: 'Navy & Gold' },
  { id: 'red-gray', name: 'Red & Gray' },
  { id: 'bold-bright', name: 'Bold & Bright' },
  { id: 'minimalist', name: 'Minimalist' },
  { id: 'orange-blue', name: 'Orange & Blue' },
  { id: 'warm-neutral', name: 'Warm & Neutral' },
  { id: 'royal-purple-blue', name: 'Royal Purple & Blue' },
  { id: 'rosy-charm', name: 'Rosy Charm' }
];

const VALID_LAYOUTS = [
  { id: 'timeline-sidebar', name: 'Timeline Sidebar' },
  { id: 'split-header', name: 'Split Header' },
  { id: 'border-box', name: 'Border Box' },
  { id: 'timeline-banner', name: 'Timeline Banner' },
  { id: 'header-overlay', name: 'Header Overlay' },
  { id: 'double-box', name: 'Double Box' }
];

const getTemplateParts = (templateString) => {
  if (!templateString) return { layout: 'timeline-sidebar', color: 'blue' };
  const layout = VALID_LAYOUTS.map(l => l.id).find(l => templateString.startsWith(l + '-')) || 
                 VALID_LAYOUTS.map(l => l.id).find(l => templateString === l) || 
                 'timeline-sidebar';
  const prefixLength = layout.length + 1;
  const color = templateString.length > prefixLength ? templateString.slice(prefixLength) : 'blue';
  return { layout, color };
};

const ensureResumeDefaults = (data) => {
  if (!data) return {};
  const personalInfo = {
    fullName: '',
    email: '',
    phone: '',
    photo: '',
    website: '',
    github: '',
    linkedin: '',
    location: '',
    jobTitle: '',
    dateOfBirth: '',
    maritalStatus: '',
    industry: '',
    gender: '',
    country: '',
    zipCode: '',
    ...(data.personalInfo || {})
  };
  return {
    ...data,
    personalInfo,
    summary: data.summary || '',
    experience: data.experience || [],
    education: data.education || [],
    projects: data.projects || [],
    skills: data.skills || [],
    certifications: data.certifications || [],
    languages: data.languages || [],
    socials: data.socials || [],
    template: data.template || 'timeline-sidebar-down-earth'
  };
};

const ResumeEditor = () => {
  const { id: routeId } = useParams();
  const [searchParams] = useSearchParams();
  const searchId = searchParams.get('id');
  const id = routeId || searchId;
  const navigate = useNavigate();
  const { user } = useAuth();

  const [loading, setLoading] = useState(true);
  const [saveStatus, setSaveStatus] = useState('');
  const [activeTab, setActiveTab] = useState('personal');
  const [resumeData, setResumeData] = useState(() => ensureResumeDefaults({ title: 'My Resume' }));

  const [generatingSummary, setGeneratingSummary] = useState(false);
  const [polishingExpIndex, setPolishingExpIndex] = useState(null);
  const [suggestingSkills, setSuggestingSkills] = useState(false);
  const [aiSkills, setAiSkills] = useState([]);

  useEffect(() => {
    const fetchOrCreateResume = async () => {
      if (!id || id === 'new') {
        setResumeData(ensureResumeDefaults({ title: 'Untitled Resume' }));
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        const { data } = await axios.get(`/api/resumes/${id}`);
        setResumeData(ensureResumeDefaults(data));
      } catch (err) {
        console.warn('Selected resume could not be loaded:', err.message);
        toast.error('Selected resume could not be loaded. Starting a new draft...');
        setResumeData(ensureResumeDefaults({ title: 'Untitled Resume' }));
        navigate('/resume-builder', { replace: true });
      } finally {
        setLoading(false);
      }
    };
    fetchOrCreateResume();
  }, [id]);

  const handleSave = async () => {
    setSaveStatus('saving');
    try {
      if (!id || id === 'new') {
        const { data } = await axios.post('/api/resumes', resumeData);
        setSaveStatus('saved');
        setTimeout(() => setSaveStatus(''), 2000);
        toast.success('Resume created and saved successfully.');
        navigate(`/resume-builder?id=${data._id}`, { replace: true });
      } else {
        await axios.put(`/api/resumes/${id}`, resumeData);
        setSaveStatus('saved');
        setTimeout(() => setSaveStatus(''), 2000);
        toast.success('Resume saved successfully.');
      }
    } catch (err) {
      setSaveStatus('error');
      toast.error('Failed to save resume.');
    }
  };

  const handleExportPDF = async () => {
    const element = document.getElementById('resume-print-node');
    if (!element) {
      toast.error('Resume preview canvas not ready.');
      return;
    }
    try {
      toast.loading('Compiling PDF...', { id: 'pdf-toast' });
      const html2canvas = (await import('html2canvas')).default;
      const { jsPDF } = await import('jspdf');

      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff'
      });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgWidth = 210;
      const pageHeight = 297;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }
      pdf.save(`${resumeData.title || 'Resume'}.pdf`);
      toast.success('PDF downloaded successfully!', { id: 'pdf-toast' });
    } catch (error) {
      console.error(error);
      toast.error('Failed to export PDF.', { id: 'pdf-toast' });
    }
  };

  const handleExportImage = async (format) => {
    const element = document.getElementById('resume-print-node');
    if (!element) {
      toast.error('Resume preview canvas not ready.');
      return;
    }
    try {
      toast.loading(`Compiling ${format.toUpperCase()}...`, { id: 'img-toast' });
      const html2canvas = (await import('html2canvas')).default;

      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff'
      });
      const mimeType = format === 'jpg' ? 'image/jpeg' : 'image/png';
      const imgData = canvas.toDataURL(mimeType);

      const link = document.createElement('a');
      link.download = `${resumeData.title || 'Resume'}.${format}`;
      link.href = imgData;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success(`${format.toUpperCase()} downloaded successfully!`, { id: 'img-toast' });
    } catch (error) {
      console.error(error);
      toast.error('Failed to export image.', { id: 'img-toast' });
    }
  };

  const handleGenerateSummary = async () => {
    if (!resumeData.personalInfo.jobTitle) {
      toast.error('Please enter a Job Title under Contact first.');
      return;
    }
    setGeneratingSummary(true);
    try {
      const skillsList = resumeData.skills.map((s) => s.name).join(', ');
      const experienceList = resumeData.experience
        .map((e) => `${e.position} at ${e.company}: ${e.description}`)
        .join('; ');

      const { data } = await axios.post('/api/ai/summary', {
        jobTitle: resumeData.personalInfo.jobTitle,
        experienceText: experienceList,
        skillsText: skillsList,
      });

      handleTopLevelChange('summary', data.summary);
      toast.success('AI summary generated successfully!');
    } catch (err) {
      toast.error('Error generating summary. Make sure GEMINI_API_KEY is configured.');
    } finally {
      setGeneratingSummary(false);
    }
  };

  const handlePolishExperience = async (idx) => {
    const exp = resumeData.experience[idx];
    if (!exp.description) {
      toast.error('Please write a brief description to polish first.');
      return;
    }
    setPolishingExpIndex(idx);
    try {
      const { data } = await axios.post('/api/ai/polish-experience', {
        position: exp.position,
        company: exp.company,
        description: exp.description,
      });
      handleArrayItemChange('experience', idx, 'description', data.polishedDescription);
      toast.success('Experience polished by AI.');
    } catch (err) {
      toast.error('Error polishing description. Check GEMINI_API_KEY.');
    } finally {
      setPolishingExpIndex(null);
    }
  };

  const handleSuggestSkills = async () => {
    if (!resumeData.personalInfo.jobTitle) {
      toast.error('Please enter a target Job Title under Contact first.');
      return;
    }
    setSuggestingSkills(true);
    try {
      const { data } = await axios.post('/api/ai/skills', {
        jobTitle: resumeData.personalInfo.jobTitle,
      });
      const existing = resumeData.skills.map(s => s.name.toLowerCase());
      const filtered = data.skills.filter(s => !existing.includes(s.toLowerCase()));
      setAiSkills(filtered);
      toast.success('Suggested matching skills.');
    } catch (err) {
      toast.error('Error recommending skills.');
    } finally {
      setSuggestingSkills(false);
    }
  };

  const addSuggestedSkill = (skillName) => {
    addArrayItem('skills', { name: skillName, level: 'Intermediate' });
    setAiSkills(prev => prev.filter(s => s !== skillName));
  };

  const handleTopLevelChange = (field, value) => {
    setResumeData(prev => ({ ...prev, [field]: value }));
  };

  const handlePersonalInfoChange = (field, value) => {
    setResumeData(prev => ({
      ...prev,
      personalInfo: { ...prev.personalInfo, [field]: value }
    }));
  };

  const handleArrayItemChange = (arrayName, index, field, value) => {
    setResumeData(prev => {
      const arr = [...prev[arrayName]];
      arr[index] = { ...arr[index], [field]: value };
      return { ...prev, [arrayName]: arr };
    });
  };

  const addArrayItem = (arrayName, defaultObj) => {
    setResumeData(prev => ({
      ...prev,
      [arrayName]: [...prev[arrayName], defaultObj]
    }));
  };

  const removeArrayItem = (arrayName, index) => {
    setResumeData(prev => ({
      ...prev,
      [arrayName]: prev[arrayName].filter((_, i) => i !== index)
    }));
  };

  const renderTemplate = () => {
    const { layout, color } = getTemplateParts(resumeData.template);
    const dataWithColor = { ...resumeData, themeColor: color };
    switch (layout) {
      case 'split-header':
        return <SplitHeaderTemplate data={dataWithColor} />;
      case 'border-box':
        return <BorderBoxTemplate data={dataWithColor} />;
      case 'timeline-banner':
        return <TimelineBannerTemplate data={dataWithColor} />;
      case 'header-overlay':
        return <HeaderOverlayTemplate data={dataWithColor} />;
      case 'double-box':
        return <DoubleBoxTemplate data={dataWithColor} />;
      case 'timeline-sidebar':
      default:
        return <TimelineSidebarTemplate data={dataWithColor} />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px] text-white">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-400" />
      </div>
    );
  }

  const { layout: activeLayout, color: activeColor } = getTemplateParts(resumeData.template);

  return (
    <div className="flex flex-col gap-6 pb-12 text-white w-full">
      {/* Configuration Side */}
      <div className="w-full space-y-6">
        <div className="bg-[#111111] p-6 rounded-2xl border border-[#27272A] shadow-sm space-y-6">
          
          {/* Custom Header Bar */}
          <div className="flex items-center justify-between border-b border-[#27272A] pb-4">
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate('/dashboard')}
                className="p-2 bg-[#09090B] border border-[#27272A] hover:bg-[#1f1f23]/40 text-[#A1A1AA] hover:text-white rounded-xl transition-all cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
              <input
                type="text"
                value={resumeData.title}
                onChange={(e) => handleTopLevelChange('title', e.target.value)}
                className="bg-transparent border-b border-transparent hover:border-[#27272A] focus:border-[#6366F1] px-1 text-sm font-bold font-outfit text-white focus:outline-none transition-all"
                placeholder="Resume Title"
              />
            </div>
            
            <button
              onClick={handleSave}
              className="flex items-center gap-2 bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] hover:opacity-95 text-white px-4 py-2 text-xs font-bold rounded-xl cursor-pointer transition-all"
            >
              <Save className="w-4 h-4" /> Save Details
            </button>
          </div>

          {/* Tab Selector */}
          <div className="flex flex-wrap gap-2 border-b border-[#27272A] pb-4 overflow-x-auto">
            {TABS.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 px-3 py-2 text-xs rounded-xl cursor-pointer transition-all border ${
                  activeTab === tab.id
                    ? 'bg-indigo-500/10 text-white border-[#6366F1] font-semibold'
                    : 'text-[#A1A1AA] border-[#27272A] hover:bg-[#18181B]'
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Tab Views */}
          <div className="space-y-6">
            
            {/* Contact Tab */}
            {activeTab === 'personal' && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-[#A1A1AA] uppercase tracking-wider mb-2">Full Name</label>
                    <input
                      type="text"
                      value={resumeData.personalInfo.fullName}
                      onChange={(e) => handlePersonalInfoChange('fullName', e.target.value)}
                      className="w-full p-2.5 bg-[#09090B] border border-[#27272A] rounded-xl text-xs text-white outline-none focus:border-indigo-500"
                      placeholder="Jane Doe"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-[#A1A1AA] uppercase tracking-wider mb-2">Email Address</label>
                    <input
                      type="email"
                      value={resumeData.personalInfo.email}
                      onChange={(e) => handlePersonalInfoChange('email', e.target.value)}
                      className="w-full p-2.5 bg-[#09090B] border border-[#27272A] rounded-xl text-xs text-white outline-none focus:border-indigo-500"
                      placeholder="jane@example.com"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-[#A1A1AA] uppercase tracking-wider mb-2">Phone</label>
                    <input
                      type="text"
                      value={resumeData.personalInfo.phone}
                      onChange={(e) => handlePersonalInfoChange('phone', e.target.value)}
                      className="w-full p-2.5 bg-[#09090B] border border-[#27272A] rounded-xl text-xs text-white outline-none focus:border-indigo-500"
                      placeholder="+91 9876543210"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-[#A1A1AA] uppercase tracking-wider mb-2">Location</label>
                    <input
                      type="text"
                      value={resumeData.personalInfo.location}
                      onChange={(e) => handlePersonalInfoChange('location', e.target.value)}
                      className="w-full p-2.5 bg-[#09090B] border border-[#27272A] rounded-xl text-xs text-white outline-none focus:border-indigo-500"
                      placeholder="Mumbai, IN"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-[#A1A1AA] uppercase tracking-wider mb-2">Country</label>
                    <input
                      type="text"
                      value={resumeData.personalInfo.country}
                      onChange={(e) => handlePersonalInfoChange('country', e.target.value)}
                      className="w-full p-2.5 bg-[#09090B] border border-[#27272A] rounded-xl text-xs text-white outline-none focus:border-indigo-500"
                      placeholder="India"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-[#A1A1AA] uppercase tracking-wider mb-2">Postal Code</label>
                    <input
                      type="text"
                      value={resumeData.personalInfo.zipCode}
                      onChange={(e) => handlePersonalInfoChange('zipCode', e.target.value)}
                      className="w-full p-2.5 bg-[#09090B] border border-[#27272A] rounded-xl text-xs text-white outline-none focus:border-indigo-500"
                      placeholder="400001"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-[#A1A1AA] uppercase tracking-wider mb-2">Date of Birth</label>
                    <input
                      type="text"
                      value={resumeData.personalInfo.dateOfBirth}
                      onChange={(e) => handlePersonalInfoChange('dateOfBirth', e.target.value)}
                      className="w-full p-2.5 bg-[#09090B] border border-[#27272A] rounded-xl text-xs text-white outline-none focus:border-indigo-500"
                      placeholder="e.g., 12 Jan 1995"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-[#A1A1AA] uppercase tracking-wider mb-2">Gender</label>
                    <input
                      type="text"
                      value={resumeData.personalInfo.gender}
                      onChange={(e) => handlePersonalInfoChange('gender', e.target.value)}
                      className="w-full p-2.5 bg-[#09090B] border border-[#27272A] rounded-xl text-xs text-white outline-none focus:border-indigo-500"
                      placeholder="Male / Female"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-[#A1A1AA] uppercase tracking-wider mb-2">Industry</label>
                    <input
                      type="text"
                      value={resumeData.personalInfo.industry}
                      onChange={(e) => handlePersonalInfoChange('industry', e.target.value)}
                      className="w-full p-2.5 bg-[#09090B] border border-[#27272A] rounded-xl text-xs text-white outline-none focus:border-indigo-500"
                      placeholder="IT & Software"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-[#A1A1AA] uppercase tracking-wider mb-2">Target Job Title</label>
                    <input
                      type="text"
                      value={resumeData.personalInfo.jobTitle}
                      onChange={(e) => handlePersonalInfoChange('jobTitle', e.target.value)}
                      className="w-full p-2.5 bg-[#09090B] border border-[#27272A] rounded-xl text-xs text-white outline-none focus:border-indigo-500"
                      placeholder="Full Stack Developer"
                    />
                  </div>
                </div>

                <div className="border-t border-[#27272A] pt-4 space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-bold text-[#A1A1AA] uppercase tracking-wider">Social Handles & Links</span>
                    <button
                      type="button"
                      onClick={() => addArrayItem('socials', { platform: 'LinkedIn', url: '' })}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-bold text-white bg-indigo-650 hover:bg-indigo-600 rounded-xl cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" /> Add Handle
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {resumeData.socials.map((social, idx) => (
                      <div key={idx} className="flex gap-2 items-center bg-[#09090B] border border-[#27272A] p-2 rounded-xl">
                        <select
                          value={social.platform}
                          onChange={(e) => handleArrayItemChange('socials', idx, 'platform', e.target.value)}
                          className="bg-[#111111] border border-[#27272A] text-xs text-white rounded-lg p-1.5 outline-none focus:border-[#6366F1]"
                        >
                          <option value="LinkedIn">LinkedIn</option>
                          <option value="GitHub">GitHub</option>
                          <option value="Website">Website</option>
                          <option value="X">X / Twitter</option>
                          <option value="Instagram">Instagram</option>
                        </select>
                        <input
                          type="text"
                          value={social.url}
                          onChange={(e) => handleArrayItemChange('socials', idx, 'url', e.target.value)}
                          className="flex-grow bg-transparent text-xs text-white outline-none"
                          placeholder="Link or username"
                        />
                        <button
                          type="button"
                          onClick={() => removeArrayItem('socials', idx)}
                          className="text-[#A1A1AA] hover:text-red-500 p-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="border-t border-[#27272A] pt-4">
                  <label className="block text-[10px] font-bold text-[#A1A1AA] uppercase tracking-wider mb-2">Avatar Image</label>
                  <div className="flex items-center gap-4">
                    {resumeData.personalInfo.photo ? (
                      <div className="flex items-center gap-3 bg-[#09090B] p-2 rounded-xl border border-[#27272A]">
                        <img src={resumeData.personalInfo.photo} alt="Avatar" className="w-10 h-10 rounded-full object-cover border border-[#27272A]" />
                        <button
                          onClick={() => handlePersonalInfoChange('photo', '')}
                          className="p-1 bg-[#18181B] text-[#A1A1AA] hover:text-red-500 rounded-lg"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <label className="flex items-center gap-2 px-4 py-2 border border-[#27272A] hover:bg-[#18181B] bg-[#09090B] rounded-xl text-xs cursor-pointer text-slate-300">
                        <Upload className="w-4 h-4 text-indigo-400" />
                        <span>Upload photo</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onload = (ev) => handlePersonalInfoChange('photo', ev.target.result);
                              reader.readAsDataURL(file);
                            }
                          }}
                        />
                      </label>
                    )}
                  </div>
                </div>

              </div>
            )}

            {/* Summary Tab */}
            {activeTab === 'summary' && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <label className="block text-[10px] font-bold text-[#A1A1AA] uppercase tracking-wider">Professional Bio Summary</label>
                  <button
                    onClick={handleGenerateSummary}
                    disabled={generatingSummary}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20 rounded-xl text-xs font-bold border border-indigo-500/20 cursor-pointer disabled:opacity-50"
                  >
                    {generatingSummary ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <>
                        <Sparkles className="w-3.5 h-3.5" /> Auto-Write Summary
                      </>
                    )}
                  </button>
                </div>
                <textarea
                  value={resumeData.summary}
                  onChange={(e) => handleTopLevelChange('summary', e.target.value)}
                  rows="6"
                  className="w-full p-3 bg-[#09090B] border border-[#27272A] rounded-xl text-xs text-white outline-none focus:border-indigo-500 resize-none leading-relaxed"
                  placeholder="Detail your professional highlights, skill summary, or career goals..."
                />
              </div>
            )}

            {/* Experience Tab */}
            {activeTab === 'experience' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-bold text-[#A1A1AA] uppercase tracking-wider">Work Records</span>
                  <button
                    onClick={() => addArrayItem('experience', { position: '', company: '', location: '', startDate: '', endDate: '', isCurrent: false, description: '' })}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-indigo-650 hover:bg-indigo-600 rounded-xl cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add Job
                  </button>
                </div>

                {resumeData.experience.map((exp, idx) => (
                  <div key={idx} className="bg-[#09090B] p-4 rounded-xl border border-[#27272A] relative space-y-4">
                    <button
                      onClick={() => removeArrayItem('experience', idx)}
                      className="absolute top-4 right-4 text-[#A1A1AA] hover:text-red-500"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[9px] font-bold text-[#A1A1AA] uppercase mb-1">Job Position</label>
                        <input
                          type="text"
                          value={exp.position}
                          onChange={(e) => handleArrayItemChange('experience', idx, 'position', e.target.value)}
                          className="w-full p-2 bg-[#111111] border border-[#27272A] rounded-xl text-xs text-white outline-none"
                          placeholder="Frontend Engineer"
                        />
                      </div>
                      <div>
                        <label className="block text-[9px] font-bold text-[#A1A1AA] uppercase mb-1">Company / Organization</label>
                        <input
                          type="text"
                          value={exp.company}
                          onChange={(e) => handleArrayItemChange('experience', idx, 'company', e.target.value)}
                          className="w-full p-2 bg-[#111111] border border-[#27272A] rounded-xl text-xs text-white outline-none"
                          placeholder="Acme Corp"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <label className="block text-[9px] font-bold text-[#A1A1AA] uppercase mb-1">Location</label>
                        <input
                          type="text"
                          value={exp.location}
                          onChange={(e) => handleArrayItemChange('experience', idx, 'location', e.target.value)}
                          className="w-full p-2 bg-[#111111] border border-[#27272A] rounded-xl text-xs text-white outline-none"
                          placeholder="New York, NY"
                        />
                      </div>
                      <div>
                        <label className="block text-[9px] font-bold text-[#A1A1AA] uppercase mb-1">Start Date</label>
                        <input
                          type="text"
                          value={exp.startDate}
                          onChange={(e) => handleArrayItemChange('experience', idx, 'startDate', e.target.value)}
                          className="w-full p-2 bg-[#111111] border border-[#27272A] rounded-xl text-xs text-white outline-none"
                          placeholder="Jan 2022"
                        />
                      </div>
                      <div>
                        <label className="block text-[9px] font-bold text-[#A1A1AA] uppercase mb-1">End Date</label>
                        <input
                          type="text"
                          value={exp.isCurrent ? 'Present' : exp.endDate}
                          disabled={exp.isCurrent}
                          onChange={(e) => handleArrayItemChange('experience', idx, 'endDate', e.target.value)}
                          className="w-full p-2 bg-[#111111] border border-[#27272A] rounded-xl text-xs text-white outline-none disabled:opacity-50"
                          placeholder="Dec 2023"
                        />
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id={`curr-${idx}`}
                        checked={exp.isCurrent}
                        onChange={(e) => handleArrayItemChange('experience', idx, 'isCurrent', e.target.checked)}
                        className="rounded border-[#27272A] bg-[#111111] text-[#6366F1]"
                      />
                      <label htmlFor={`curr-${idx}`} className="text-xs text-[#A1A1AA] cursor-pointer">I currently work here</label>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <label className="block text-[9px] font-bold text-[#A1A1AA] uppercase">Responsibilities & Highlights</label>
                        <button
                          onClick={() => handlePolishExperience(idx)}
                          disabled={polishingExpIndex === idx}
                          className="flex items-center gap-1 px-2.5 py-1 bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20 rounded-lg text-[9px] font-bold border border-indigo-500/20 cursor-pointer disabled:opacity-50"
                        >
                          {polishingExpIndex === idx ? (
                            <Loader2 className="w-3 h-3 animate-spin" />
                          ) : (
                            <>
                              <Sparkles className="w-2.5 h-2.5" /> Polish Bullets
                            </>
                          )}
                        </button>
                      </div>
                      <textarea
                        value={exp.description}
                        onChange={(e) => handleArrayItemChange('experience', idx, 'description', e.target.value)}
                        rows="3"
                        className="w-full p-2 bg-[#111111] border border-[#27272A] rounded-xl text-xs text-white outline-none font-mono resize-none leading-relaxed"
                        placeholder="- Developed user-facing panels using React and Tailwindcss..."
                      />
                    </div>

                  </div>
                ))}
              </div>
            )}

            {/* Education Tab */}
            {activeTab === 'education' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-bold text-[#A1A1AA] uppercase tracking-wider">Studies & Training</span>
                  <button
                    onClick={() => addArrayItem('education', { school: '', degree: '', fieldOfStudy: '', location: '', startDate: '', endDate: '' })}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-indigo-650 hover:bg-indigo-600 rounded-xl cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add Study
                  </button>
                </div>

                {resumeData.education.map((edu, idx) => (
                  <div key={idx} className="bg-[#09090B] p-4 rounded-xl border border-[#27272A] relative space-y-4">
                    <button
                      onClick={() => removeArrayItem('education', idx)}
                      className="absolute top-4 right-4 text-[#A1A1AA] hover:text-red-500"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[9px] font-bold text-[#A1A1AA] uppercase mb-1">Degree / Diploma</label>
                        <input
                          type="text"
                          value={edu.degree}
                          onChange={(e) => handleArrayItemChange('education', idx, 'degree', e.target.value)}
                          className="w-full p-2 bg-[#111111] border border-[#27272A] rounded-xl text-xs text-white outline-none"
                          placeholder="Bachelor of Science"
                        />
                      </div>
                      <div>
                        <label className="block text-[9px] font-bold text-[#A1A1AA] uppercase mb-1">Field of Study</label>
                        <input
                          type="text"
                          value={edu.fieldOfStudy}
                          onChange={(e) => handleArrayItemChange('education', idx, 'fieldOfStudy', e.target.value)}
                          className="w-full p-2 bg-[#111111] border border-[#27272A] rounded-xl text-xs text-white outline-none"
                          placeholder="Computer Science"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <label className="block text-[9px] font-bold text-[#A1A1AA] uppercase mb-1">School / University</label>
                        <input
                          type="text"
                          value={edu.school}
                          onChange={(e) => handleArrayItemChange('education', idx, 'school', e.target.value)}
                          className="w-full p-2 bg-[#111111] border border-[#27272A] rounded-xl text-xs text-white outline-none"
                          placeholder="University of Mumbai"
                        />
                      </div>
                      <div>
                        <label className="block text-[9px] font-bold text-[#A1A1AA] uppercase mb-1">Start Date</label>
                        <input
                          type="text"
                          value={edu.startDate}
                          onChange={(e) => handleArrayItemChange('education', idx, 'startDate', e.target.value)}
                          className="w-full p-2 bg-[#111111] border border-[#27272A] rounded-xl text-xs text-white outline-none"
                          placeholder="2018"
                        />
                      </div>
                      <div>
                        <label className="block text-[9px] font-bold text-[#A1A1AA] uppercase mb-1">End Date / Graduation</label>
                        <input
                          type="text"
                          value={edu.endDate}
                          onChange={(e) => handleArrayItemChange('education', idx, 'endDate', e.target.value)}
                          className="w-full p-2 bg-[#111111] border border-[#27272A] rounded-xl text-xs text-white outline-none"
                          placeholder="2022"
                        />
                      </div>
                    </div>

                  </div>
                ))}
              </div>
            )}

            {/* Projects Tab */}
            {activeTab === 'projects' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-bold text-[#A1A1AA] uppercase tracking-wider">Independent Projects</span>
                  <button
                    onClick={() => addArrayItem('projects', { title: '', role: '', startDate: '', endDate: '', description: '', link: '', technologies: '' })}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-indigo-650 hover:bg-indigo-600 rounded-xl cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add Project
                  </button>
                </div>

                {resumeData.projects.map((proj, idx) => (
                  <div key={idx} className="bg-[#09090B] p-4 rounded-xl border border-[#27272A] relative space-y-4">
                    <button
                      onClick={() => removeArrayItem('projects', idx)}
                      className="absolute top-4 right-4 text-[#A1A1AA] hover:text-red-500"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[9px] font-bold text-[#A1A1AA] uppercase mb-1">Project Title</label>
                        <input
                          type="text"
                          value={proj.title}
                          onChange={(e) => handleArrayItemChange('projects', idx, 'title', e.target.value)}
                          className="w-full p-2 bg-[#111111] border border-[#27272A] rounded-xl text-xs text-white outline-none"
                          placeholder="Portfolio Website"
                        />
                      </div>
                      <div>
                        <label className="block text-[9px] font-bold text-[#A1A1AA] uppercase mb-1">Role / Tech Used</label>
                        <input
                          type="text"
                          value={proj.technologies}
                          onChange={(e) => handleArrayItemChange('projects', idx, 'technologies', e.target.value)}
                          className="w-full p-2 bg-[#111111] border border-[#27272A] rounded-xl text-xs text-white outline-none"
                          placeholder="React, Vite, Tailwind"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[9px] font-bold text-[#A1A1AA] uppercase mb-1">Link</label>
                        <input
                          type="text"
                          value={proj.link}
                          onChange={(e) => handleArrayItemChange('projects', idx, 'link', e.target.value)}
                          className="w-full p-2 bg-[#111111] border border-[#27272A] rounded-xl text-xs text-white outline-none"
                          placeholder="https://github.com/my-project"
                        />
                      </div>
                      <div>
                        <label className="block text-[9px] font-bold text-[#A1A1AA] uppercase mb-1">Date</label>
                        <input
                          type="text"
                          value={proj.startDate}
                          onChange={(e) => handleArrayItemChange('projects', idx, 'startDate', e.target.value)}
                          className="w-full p-2 bg-[#111111] border border-[#27272A] rounded-xl text-xs text-white outline-none"
                          placeholder="2024"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[9px] font-bold text-[#A1A1AA] uppercase mb-1">Description</label>
                      <textarea
                        value={proj.description}
                        onChange={(e) => handleArrayItemChange('projects', idx, 'description', e.target.value)}
                        rows="2"
                        className="w-full p-2 bg-[#111111] border border-[#27272A] rounded-xl text-xs text-white outline-none resize-none leading-relaxed"
                        placeholder="Detail the metrics achieved or core backend APIs implemented..."
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Skills Tab */}
            {activeTab === 'skills' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-bold text-[#A1A1AA] uppercase tracking-wider">Expertise & Skills</span>
                  <div className="flex gap-2">
                    <button
                      onClick={handleSuggestSkills}
                      disabled={suggestingSkills}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20 rounded-xl text-xs font-bold border border-indigo-500/20 cursor-pointer disabled:opacity-50"
                    >
                      {suggestingSkills ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <>
                          <Sparkles className="w-3.5 h-3.5" /> Suggest Skills
                        </>
                      )}
                    </button>
                    <button
                      onClick={() => addArrayItem('skills', { name: '', level: 'Expert' })}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-indigo-650 hover:bg-indigo-600 rounded-xl cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" /> Add Skill
                    </button>
                  </div>
                </div>

                {aiSkills.length > 0 && (
                  <div className="bg-[#09090B] p-4 rounded-xl border border-indigo-500/20 space-y-2">
                    <p className="text-[9px] font-bold text-[#6366F1] uppercase tracking-wider flex items-center gap-1">
                      <Sparkles className="w-3 h-3" /> Recommended Skills (Click to Add)
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {aiSkills.map(sk => (
                        <button
                          key={sk}
                          onClick={() => addSuggestedSkill(sk)}
                          className="px-2.5 py-1 bg-[#111111] hover:bg-[#18181B] text-indigo-400 hover:text-white rounded-lg text-xs font-bold border border-[#27272A] transition-all cursor-pointer"
                        >
                          + {sk}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {resumeData.skills.map((skill, idx) => (
                    <div key={idx} className="flex gap-2 items-center bg-[#09090B] border border-[#27272A] p-2.5 rounded-xl">
                      <input
                        type="text"
                        value={skill.name}
                        onChange={(e) => handleArrayItemChange('skills', idx, 'name', e.target.value)}
                        className="flex-grow bg-transparent text-xs text-white outline-none"
                        placeholder="e.g., ReactJS, Agile Management"
                      />
                      <select
                        value={skill.level}
                        onChange={(e) => handleArrayItemChange('skills', idx, 'level', e.target.value)}
                        className="bg-[#111111] border border-[#27272A] text-xs text-white rounded-lg p-1 outline-none"
                      >
                        <option value="Expert">Expert</option>
                        <option value="Intermediate">Intermediate</option>
                        <option value="Beginner">Beginner</option>
                      </select>
                      <button
                        type="button"
                        onClick={() => removeArrayItem('skills', idx)}
                        className="text-[#A1A1AA] hover:text-red-500 p-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Extras Tab */}
            {activeTab === 'extras' && (
              <div className="space-y-6">
                
                {/* Languages Section */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-bold text-[#A1A1AA] uppercase tracking-wider">Languages</span>
                    <button
                      onClick={() => addArrayItem('languages', { name: '', proficiency: 'Native' })}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-indigo-650 hover:bg-indigo-600 rounded-xl cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" /> Add Language
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {resumeData.languages.map((lang, idx) => (
                      <div key={idx} className="flex gap-2 items-center bg-[#09090B] border border-[#27272A] p-2.5 rounded-xl">
                        <input
                          type="text"
                          value={lang.name}
                          onChange={(e) => handleArrayItemChange('languages', idx, 'name', e.target.value)}
                          className="flex-grow bg-transparent text-xs text-white outline-none"
                          placeholder="e.g., English, French"
                        />
                        <select
                          value={lang.proficiency}
                          onChange={(e) => handleArrayItemChange('languages', idx, 'proficiency', e.target.value)}
                          className="bg-[#111111] border border-[#27272A] text-xs text-white rounded-lg p-1 outline-none"
                        >
                          <option value="Native">Native</option>
                          <option value="Fluent">Fluent</option>
                          <option value="Professional">Professional</option>
                          <option value="Conversational">Conversational</option>
                        </select>
                        <button
                          type="button"
                          onClick={() => removeArrayItem('languages', idx)}
                          className="text-[#A1A1AA] hover:text-red-500 p-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Certifications Section */}
                <div className="space-y-4 border-t border-[#27272A] pt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-bold text-[#A1A1AA] uppercase tracking-wider">Certifications</span>
                    <button
                      onClick={() => addArrayItem('certifications', { name: '', issuer: '', date: '' })}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-indigo-650 hover:bg-indigo-600 rounded-xl cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" /> Add Certificate
                    </button>
                  </div>
                  {resumeData.certifications.map((cert, idx) => (
                    <div key={idx} className="bg-[#09090B] p-4 rounded-xl border border-[#27272A] relative grid grid-cols-3 gap-4">
                      <button
                        onClick={() => removeArrayItem('certifications', idx)}
                        className="absolute top-4 right-4 text-[#A1A1AA] hover:text-red-500"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <div className="col-span-2">
                        <label className="block text-[9px] font-bold text-[#A1A1AA] uppercase mb-1">Certificate Title</label>
                        <input
                          type="text"
                          value={cert.name}
                          onChange={(e) => handleArrayItemChange('certifications', idx, 'name', e.target.value)}
                          className="w-full p-2 bg-[#111111] border border-[#27272A] rounded-xl text-xs text-white outline-none"
                          placeholder="AWS Solutions Architect"
                        />
                      </div>
                      <div>
                        <label className="block text-[9px] font-bold text-[#A1A1AA] uppercase mb-1">Issuer</label>
                        <input
                          type="text"
                          value={cert.issuer}
                          onChange={(e) => handleArrayItemChange('certifications', idx, 'issuer', e.target.value)}
                          className="w-full p-2 bg-[#111111] border border-[#27272A] rounded-xl text-xs text-white outline-none"
                          placeholder="Amazon"
                        />
                      </div>
                    </div>
                  ))}
                </div>

              </div>
            )}

            {/* Layout & Theme Tab */}
            {activeTab === 'layout' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-[#A1A1AA] uppercase tracking-wider mb-2">Style Template</label>
                    <select
                      value={activeLayout}
                      onChange={(e) => handleTopLevelChange('template', `${e.target.value}-${activeColor}`)}
                      className="w-full p-2.5 bg-[#09090B] border border-[#27272A] rounded-xl text-xs focus:outline-none focus:border-[#6366F1] text-white"
                    >
                      {VALID_LAYOUTS.map(l => (
                        <option key={l.id} value={l.id}>{l.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-[#A1A1AA] uppercase tracking-wider mb-2">Color Scheme</label>
                    <select
                      value={activeColor}
                      onChange={(e) => handleTopLevelChange('template', `${activeLayout}-${e.target.value}`)}
                      className="w-full p-2.5 bg-[#09090B] border border-[#27272A] rounded-xl text-xs focus:outline-none focus:border-[#6366F1] text-white"
                    >
                      {themeColors.map(c => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Export Buttons */}
                <div className="flex flex-wrap gap-2 pt-4 border-t border-[#27272A]">
                  <button
                    onClick={handleExportPDF}
                    className="flex items-center gap-1.5 px-4 py-2.5 text-xs font-bold text-white bg-indigo-650 hover:bg-indigo-600 rounded-xl cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" /> PDF
                  </button>
                  <button
                    onClick={() => handleExportImage('png')}
                    className="px-4 py-2.5 text-xs font-bold text-indigo-400 bg-indigo-500/10 hover:bg-indigo-500/20 rounded-xl border border-indigo-500/20 cursor-pointer"
                  >
                    PNG
                  </button>
                  <button
                    onClick={() => handleExportImage('jpg')}
                    className="px-4 py-2.5 text-xs font-bold text-indigo-400 bg-indigo-500/10 hover:bg-indigo-500/20 rounded-xl border border-indigo-500/20 cursor-pointer"
                  >
                    JPG
                  </button>
                  <button
                    onClick={() => window.print()}
                    className="px-4 py-2.5 text-xs font-bold text-[#A1A1AA] border border-[#27272A] hover:bg-[#18181B] rounded-xl cursor-pointer"
                  >
                    Print
                  </button>
                </div>

                {/* A4 Scroll Preview Container */}
                <div className="bg-[#09090B] border border-[#27272A] rounded-2xl p-4 overflow-hidden relative min-h-[450px]">
                  <div className="absolute top-2 left-2 z-10 bg-[#111111]/80 px-2 py-1 rounded-md border border-[#27272A] text-[9px] font-bold text-[#A1A1AA] backdrop-blur-md">
                    A4 Preview
                  </div>
                  
                  <div className="w-full flex justify-center overflow-x-auto overflow-y-auto max-h-[700px] p-2 bg-slate-900/30 rounded-xl border border-slate-800/40">
                    <div 
                      id="resume-print-node" 
                      className="w-[800px] h-fit bg-white shadow-2xl scale-[0.75] origin-top md:scale-[0.8] lg:scale-[0.85] shrink-0"
                    >
                      {renderTemplate()}
                    </div>
                  </div>
                </div>
              </div>
            )}

          </div>

        </div>
      </div>
    </div>
  );
};

export default ResumeEditor;
