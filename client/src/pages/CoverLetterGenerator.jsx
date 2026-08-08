import React, { useState } from 'react';
import axios from 'axios';
import { Sparkles, FileText, Upload, Download, Clipboard, Edit } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

const CoverLetterGenerator = () => {
  const { setUser } = useAuth();
  
  const [resumeFile, setResumeFile] = useState(null);
  const [jobRole, setJobRole] = useState('');
  const [company, setCompany] = useState('');
  const [experienceLevel, setExperienceLevel] = useState('Mid-Level');
  const [selectedTone, setSelectedTone] = useState('Professional');

  const [loading, setLoading] = useState(false);
  const [letterContent, setLetterContent] = useState('');

  const expLevels = ['Entry-Level', 'Mid-Level', 'Senior', 'Lead/Manager'];
  const toneOptions = ['Professional', 'Creative', 'Bold', 'Casual'];

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type !== 'application/pdf') {
        toast.error('Please upload a PDF file only.');
        return;
      }
      setResumeFile(file);
      toast.success('Resume PDF uploaded!');
    }
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    if (!resumeFile) {
      toast.error('Please upload your resume first.');
      return;
    }
    if (!jobRole.trim() || !company.trim()) {
      toast.error('Please fill out job role and company name');
      return;
    }

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append('resume', resumeFile);
      formData.append('jobRole', jobRole);
      formData.append('company', company);
      formData.append('experienceLevel', experienceLevel);
      formData.append('tone', selectedTone);

      const { data } = await axios.post('/api/ai/cover-letter', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (data.success) {
        setLetterContent(data.content);
        toast.success('Cover letter generated successfully!');
        
        // Refresh credit limit
        const profileRes = await axios.get('/api/auth/profile');
        if (profileRes.data.success) {
          setUser(profileRes.data.user);
        }
      } else {
        toast.error(data.message || 'Generation failed.');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(letterContent);
    toast.success('Letter copied to clipboard!');
  };

  const handleDownloadTxt = () => {
    const element = document.createElement("a");
    const file = new Blob([letterContent], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `cover_letter_${company.replace(/\s+/g, "_")}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleExportPDF = async () => {
    try {
      toast.loading('Compiling PDF...', { id: 'pdf-toast' });
      const { jsPDF } = await import('jspdf');
      const doc = new jsPDF();
      
      const textLines = doc.splitTextToSize(letterContent, 180);
      let pageHeight = doc.internal.pageSize.height;
      let y = 20;
      doc.setFont("Helvetica");
      doc.setFontSize(10);
      
      textLines.forEach(line => {
        if (y > pageHeight - 20) {
          doc.addPage();
          y = 20;
        }
        doc.text(line, 15, y);
        y += 6;
      });

      doc.save(`cover_letter_${company.replace(/\s+/g, "_")}.pdf`);
      toast.success('PDF saved!', { id: 'pdf-toast' });
    } catch (error) {
      toast.error('Failed to export PDF.', { id: 'pdf-toast' });
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 pb-12 text-white">
      {/* Workspace */}
      <div className="w-full lg:max-w-md shrink-0">
        <form onSubmit={onSubmitHandler} className="bg-[#111111] p-6 rounded-2xl border border-[#27272A] shadow-sm space-y-6">
          <div className="flex items-center gap-3">
            <Sparkles className="w-5 h-5 text-indigo-400" />
            <h2 className="text-sm font-bold font-['Outfit']">Cover Letter Workspace</h2>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-[#A1A1AA] uppercase tracking-wider mb-2">Resume Upload (PDF)</label>
            <div className="relative border-2 border-dashed border-[#27272A] rounded-2xl p-5 text-center hover:border-indigo-500/50 transition-colors bg-[#09090B]/50">
              <input 
                type="file" 
                accept=".pdf"
                onChange={handleFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <div className="flex flex-col items-center space-y-2">
                <Upload className="h-5 w-5 text-[#A1A1AA]" />
                <span className="text-[11px] font-semibold text-white">
                  {resumeFile ? resumeFile.name : 'Upload PDF resume'}
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-bold text-[#A1A1AA] uppercase tracking-wider mb-2">Target Job Role</label>
              <input 
                type="text"
                required
                value={jobRole}
                onChange={(e) => setJobRole(e.target.value)}
                className="w-full bg-[#09090B] border border-[#27272A] rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#6366F1] text-white"
                placeholder="E.g. Node Dev"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-[#A1A1AA] uppercase tracking-wider mb-2">Company Name</label>
              <input 
                type="text"
                required
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                className="w-full bg-[#09090B] border border-[#27272A] rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#6366F1] text-white"
                placeholder="E.g. Stripe"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-bold text-[#A1A1AA] uppercase tracking-wider mb-2">Experience Level</label>
              <select
                value={experienceLevel}
                onChange={(e) => setExperienceLevel(e.target.value)}
                className="w-full p-2 bg-[#09090B] border border-[#27272A] rounded-xl text-xs focus:outline-none focus:border-[#6366F1] text-white"
              >
                {expLevels.map(exp => <option key={exp} value={exp}>{exp}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-[#A1A1AA] uppercase tracking-wider mb-2">Writing Tone</label>
              <select
                value={selectedTone}
                onChange={(e) => setSelectedTone(e.target.value)}
                className="w-full p-2 bg-[#09090B] border border-[#27272A] rounded-xl text-xs focus:outline-none focus:border-[#6366F1] text-white"
              >
                {toneOptions.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
          </div>

          <button 
            type="submit"
            disabled={loading || !resumeFile} 
            className="w-full flex justify-center items-center gap-2 bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] hover:opacity-95 text-white py-3 text-xs font-bold rounded-xl cursor-pointer transition-all disabled:opacity-50"
          >
            {loading ? (
              <span className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin"></span>
            ) : (
              <>
                <Sparkles className="w-4 h-4" /> Tailor Cover Letter
              </>
            )}
          </button>
        </form>
      </div>

      {/* Editor Result */}
      <div className="flex-grow bg-[#111111] rounded-2xl border border-[#27272A] shadow-sm p-6 flex flex-col min-h-[500px]">
        <div className="flex justify-between items-center pb-4 border-b border-[#27272A]">
          <div className="flex items-center gap-2">
            <Edit className="w-5 h-5 text-indigo-400" />
            <h2 className="text-sm font-bold font-['Outfit'] text-white">Generated Letter</h2>
          </div>
          {letterContent && (
            <div className="flex gap-2">
              <button 
                onClick={handleCopyToClipboard}
                className="px-3 py-1.5 hover:bg-[#18181B] border border-[#27272A] rounded-xl text-[#A1A1AA] hover:text-white transition-colors flex items-center gap-1.5 text-xs font-semibold cursor-pointer"
              >
                Copy
              </button>
              <button 
                onClick={handleDownloadTxt}
                className="px-3 py-1.5 hover:bg-[#18181B] border border-[#27272A] rounded-xl text-[#A1A1AA] hover:text-white transition-colors flex items-center gap-1.5 text-xs font-semibold cursor-pointer"
              >
                TXT
              </button>
              <button 
                onClick={handleExportPDF}
                className="px-3 py-1.5 bg-[#6366F1]/10 text-[#6366F1] border border-[#6366F1]/20 rounded-xl hover:bg-[#6366F1]/20 transition-all flex items-center gap-1.5 text-xs font-semibold cursor-pointer"
              >
                <FileText className="h-3.5 w-3.5" /> Export PDF
              </button>
            </div>
          )}
        </div>

        {!letterContent ? (
          <div className="flex-1 flex flex-col justify-center items-center text-[#A1A1AA] space-y-4 py-20">
            {loading ? (
              <div className="flex flex-col items-center space-y-3">
                <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                <span className="text-xs">Formulating custom sentences using resume bullet outlines...</span>
              </div>
            ) : (
              <>
                <div className="w-16 h-16 rounded-full bg-[#18181B] border border-[#27272A] flex items-center justify-center">
                  <FileText className="w-8 h-8 text-indigo-400/60" />
                </div>
                <p className="text-xs">Configure role credentials to generate custom printable letter sheets.</p>
              </>
            )}
          </div>
        ) : (
          <div className="mt-4 flex-1 overflow-y-auto max-h-[500px] text-xs text-[#A1A1AA] leading-relaxed pr-2 text-left whitespace-pre-line bg-[#09090B] border border-[#27272A] p-6 rounded-2xl font-light font-mono">
            {letterContent}
          </div>
        )}
      </div>
    </div>
  );
};

export default CoverLetterGenerator;
