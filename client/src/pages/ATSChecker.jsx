import React, { useState } from 'react';
import axios from 'axios';
import { Sparkles, FileText, Upload, Brain, Check, X, Award, Percent, Download } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

const ATSChecker = () => {
  const { setUser } = useAuth();
  
  const [resumeFile, setResumeFile] = useState(null);
  const [jobDescription, setJobDescription] = useState('');
  const [loading, setLoading] = useState(false);
  
  // Scored state
  const [analysis, setAnalysis] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type !== 'application/pdf') {
        toast.error('Please upload a PDF file only.');
        return;
      }
      setResumeFile(file);
      toast.success('Resume loaded successfully!');
    }
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    if (!resumeFile) {
      toast.error('Please upload your resume PDF');
      return;
    }
    if (!jobDescription.trim()) {
      toast.error('Please paste your target job description');
      return;
    }

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append('resume', resumeFile);
      formData.append('jobDescription', jobDescription);

      const { data } = await axios.post('/api/ai/ats-check', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (data.success) {
        setAnalysis(data.analysis);
        toast.success('ATS analysis complete!');
        
        // Refresh credit limit
        const profileRes = await axios.get('/api/auth/profile');
        if (profileRes.data.success) {
          setUser(profileRes.data.user);
        }
      } else {
        toast.error(data.message || 'Analysis failed.');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadReport = async () => {
    if (!analysis) return;
    try {
      toast.loading('Compiling report...', { id: 'pdf-toast' });
      const { jsPDF } = await import('jspdf');
      const doc = new jsPDF();
      
      doc.setFont("Helvetica", "bold");
      doc.setFontSize(16);
      doc.text("NovaAI - ATS Compatibility Score Report", 15, 20);
      
      doc.setFont("Helvetica", "normal");
      doc.setFontSize(10);
      doc.text(`Target Job Description Overview: Match Score: ${analysis.score}%`, 15, 30);
      
      doc.setFont("Helvetica", "bold");
      doc.text("Suggestions & Analysis Details:", 15, 45);
      
      doc.setFont("Helvetica", "normal");
      const suggestionsText = analysis.suggestions || 'Optimize formatting parameters';
      const lines = doc.splitTextToSize(suggestionsText, 180);
      
      let y = 55;
      lines.forEach(line => {
        doc.text(line, 15, y);
        y += 6;
      });

      doc.save(`ats_report_${analysis.score}.pdf`);
      toast.success('Report PDF saved!', { id: 'pdf-toast' });
    } catch (error) {
      toast.error('Failed to save PDF.', { id: 'pdf-toast' });
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 pb-12 text-white">
      {/* Configuration */}
      <div className="w-full lg:max-w-md shrink-0">
        <form onSubmit={onSubmitHandler} className="bg-[#111111] p-6 rounded-2xl border border-[#27272A] shadow-sm space-y-6">
          <div className="flex items-center gap-3">
            <Sparkles className="w-5 h-5 text-indigo-400" />
            <h2 className="text-sm font-bold font-['Outfit']">ATS Analysis Workspace</h2>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-[#A1A1AA] uppercase tracking-wider mb-2">Resume Upload (PDF)</label>
            <div className="relative border-2 border-dashed border-[#27272A] rounded-2xl p-6 text-center hover:border-indigo-500/50 transition-colors bg-[#09090B]/50">
              <input 
                type="file" 
                accept=".pdf"
                onChange={handleFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <div className="flex flex-col items-center space-y-2">
                <Upload className="h-6 w-6 text-[#A1A1AA]" />
                <span className="text-xs font-semibold text-white">
                  {resumeFile ? resumeFile.name : 'Upload PDF resume'}
                </span>
                <span className="text-[9px] text-[#A1A1AA]">PDF format up to 5MB</span>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-[#A1A1AA] uppercase tracking-wider mb-2">Target Job Description</label>
            <textarea 
              onChange={(e) => setJobDescription(e.target.value)} 
              value={jobDescription} 
              rows="5"
              className="w-full p-3 text-xs rounded-xl border border-[#27272A] outline-none focus:border-indigo-500 bg-[#09090B] resize-none text-white leading-relaxed" 
              placeholder="Paste the target job description requirements here..." 
              required 
            />
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
                <Brain className="w-4 h-4" /> Scan Resume Match
              </>
            )}
          </button>
        </form>
      </div>

      {/* Analytics Dashboard */}
      <div className="flex-grow bg-[#111111] rounded-2xl border border-[#27272A] shadow-sm p-6 flex flex-col min-h-[450px]">
        <div className="flex justify-between items-center pb-4 border-b border-[#27272A]">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-indigo-400" />
            <h2 className="text-sm font-bold font-['Outfit'] text-white">Scan Analytics</h2>
          </div>
          {analysis && (
            <button 
              onClick={handleDownloadReport}
              className="px-3 py-1.5 hover:bg-[#18181B] border border-[#27272A] rounded-xl text-[#A1A1AA] hover:text-white transition-colors flex items-center gap-1.5 text-xs font-semibold cursor-pointer"
            >
              <Download className="h-3.5 w-3.5" /> PDF Report
            </button>
          )}
        </div>

        {!analysis ? (
          <div className="flex-1 flex flex-col justify-center items-center text-[#A1A1AA] space-y-4 py-20">
            {loading ? (
              <div className="flex flex-col items-center space-y-3">
                <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                <span className="text-xs">Parsing text structure and counting keyword match density...</span>
              </div>
            ) : (
              <>
                <div className="w-16 h-16 rounded-full bg-[#18181B] border border-[#27272A] flex items-center justify-center">
                  <FileText className="w-8 h-8 text-indigo-400/60" />
                </div>
                <p className="text-xs">Upload your resume and the target JD to view circular score ratings.</p>
              </>
            )}
          </div>
        ) : (
          <div className="mt-6 flex-1 space-y-6 text-left">
            
            {/* Score circle layout */}
            <div className="flex items-center gap-6 bg-[#18181B] border border-[#27272A] p-4 rounded-xl">
              <div className="w-24 h-24 rounded-full border-4 border-indigo-500 flex items-center justify-center shrink-0">
                <span className="text-2xl font-extrabold text-white font-['Outfit']">{analysis.score}%</span>
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-white font-['Outfit']">Overall Match Score</h4>
                <p className="text-xs text-[#A1A1AA] leading-relaxed">
                  Your resume has a high compliance density matching terms required by this description outline.
                </p>
              </div>
            </div>

            {/* suggestions */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-[#A1A1AA] uppercase tracking-wider">AI Suggestions</h4>
              <div className="bg-[#09090B] border border-[#27272A] p-4 rounded-xl text-xs text-[#A1A1AA] leading-relaxed whitespace-pre-line font-light">
                {analysis.suggestions}
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
};

export default ATSChecker;
