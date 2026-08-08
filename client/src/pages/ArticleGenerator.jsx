import React, { useState } from 'react';
import axios from 'axios';
import { Sparkles, Edit, Clipboard, Download, RotateCcw, FileText, Globe, Eye, Settings2 } from 'lucide-react';
import toast from 'react-hot-toast';
import Markdown from 'react-markdown';
import { useAuth } from '../context/AuthContext';

const ArticleGenerator = () => {
  const { setUser } = useAuth();
  
  const articleLength = [
    { length: 800, text: "Short (500-800 words)" },
    { length: 1200, text: "Medium (800-1200 words)" },
    { length: 1600, text: "Long (1200-1600 words)" }
  ];

  const toneOptions = ['Professional', 'Creative', 'Academic', 'Bold', 'Casual'];
  const langOptions = ['English', 'Spanish', 'French', 'German', 'Japanese'];

  const [selectedLength, setSelectedLength] = useState(articleLength[0]);
  const [selectedTone, setSelectedTone] = useState(toneOptions[0]);
  const [selectedLang, setSelectedLang] = useState(langOptions[0]);
  const [seoOptimize, setSeoOptimize] = useState(true);

  const [topic, setTopic] = useState('');
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState('');

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    if (!topic.trim()) {
      toast.error('Please enter a topic');
      return;
    }

    try {
      setLoading(true);
      const prompt = `Write an article about "${topic}" in ${selectedLength.text}. Tone: ${selectedTone}. Language: ${selectedLang}. ${seoOptimize ? 'Optimize keywords for SEO density.' : ''} Use markdown heading styles.`;

      const { data } = await axios.post('/api/ai/generate-article', { prompt });

      if (data.success) {
        setContent(data.content);
        toast.success('Article generated successfully!');
        
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
    navigator.clipboard.writeText(content);
    toast.success('Article copied to clipboard!');
  };

  const handleDownloadTxt = () => {
    const element = document.createElement("a");
    const file = new Blob([content], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `${topic.substring(0, 15).replace(/\s+/g, "_")}_article.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleExportPDF = async () => {
    try {
      toast.loading('Compiling PDF...', { id: 'pdf-toast' });
      const { jsPDF } = await import('jspdf');
      const doc = new jsPDF();
      
      // Clean markdown tags for pdf layout formatting
      const textLines = doc.splitTextToSize(content.replace(/[*#]/g, ''), 180);
      
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

      doc.save(`${topic.substring(0, 15).replace(/\s+/g, "_")}_article.pdf`);
      toast.success('PDF exported successfully!', { id: 'pdf-toast' });
    } catch (error) {
      console.error(error);
      toast.error('Failed to export PDF.', { id: 'pdf-toast' });
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 pb-12 text-white">
      {/* Configuration Side */}
      <div className="w-full lg:max-w-md shrink-0 space-y-6">
        <form onSubmit={onSubmitHandler} className="bg-[#111111] p-6 rounded-2xl border border-[#27272A] shadow-sm space-y-6">
          <div className="flex items-center gap-3">
            <Sparkles className="w-5 h-5 text-indigo-400" />
            <h2 className="text-sm font-bold font-['Outfit']">Article Workspace</h2>
          </div>
          
          <div>
            <label className="block text-[10px] font-bold text-[#A1A1AA] uppercase tracking-wider mb-2">Topic or Prompt Outline</label>
            <textarea 
              onChange={(e) => setTopic(e.target.value)} 
              value={topic} 
              rows="4"
              className="w-full p-3 text-xs rounded-xl border border-[#27272A] outline-none focus:border-indigo-500 bg-[#09090B] resize-none text-white" 
              placeholder="E.g., Key milestones in quantum computing architecture..." 
              required 
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
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

            <div>
              <label className="block text-[10px] font-bold text-[#A1A1AA] uppercase tracking-wider mb-2">Language</label>
              <select
                value={selectedLang}
                onChange={(e) => setSelectedLang(e.target.value)}
                className="w-full p-2 bg-[#09090B] border border-[#27272A] rounded-xl text-xs focus:outline-none focus:border-[#6366F1] text-white"
              >
                {langOptions.map(l => <option key={l} value={l}>{l}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-[#A1A1AA] uppercase tracking-wider mb-2">Target Article Length</label>
            <div className="flex flex-col gap-2">
              {articleLength.map((item) => (
                <div 
                  key={item.text}
                  onClick={() => setSelectedLength(item)}
                  className={`text-xs px-4 py-2.5 border rounded-xl cursor-pointer flex justify-between items-center transition-all ${
                    selectedLength.text === item.text 
                      ? 'bg-indigo-500/5 text-white border-[#6366F1] font-semibold' 
                      : 'text-[#A1A1AA] border-[#27272A] hover:bg-[#18181B]'
                  }`}
                >
                  <span>{item.text}</span>
                  <div className={`w-3 h-3 rounded-full border flex items-center justify-center ${selectedLength.text === item.text ? 'border-[#6366F1]' : 'border-slate-800'}`}>
                    {selectedLength.text === item.text && <div className="w-1.5 h-1.5 bg-[#6366F1] rounded-full" />}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between p-3 bg-[#18181B] border border-[#27272A] rounded-xl">
            <div className="flex flex-col">
              <span className="text-xs font-bold text-white">Optimize SEO</span>
              <span className="text-[9px] text-[#A1A1AA]">Include semantic keyword density filters</span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                onChange={(e) => setSeoOptimize(e.target.checked)}
                checked={seoOptimize}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-slate-800 rounded-full peer peer-focus:ring-0 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#6366F1]"></div>
            </label>
          </div>

          <button 
            type="submit"
            disabled={loading} 
            className="w-full flex justify-center items-center gap-2 bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] hover:opacity-95 text-white py-3 text-xs font-bold rounded-xl cursor-pointer transition-all disabled:opacity-50"
          >
            {loading ? (
              <span className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin"></span>
            ) : (
              <>
                <Edit className="w-4 h-4" /> Generate Article
              </>
            )}
          </button>
        </form>
      </div>

      {/* Editor Side */}
      <div className="flex-grow bg-[#111111] rounded-2xl border border-[#27272A] shadow-sm p-6 flex flex-col min-h-[500px]">
        <div className="flex justify-between items-center pb-4 border-b border-[#27272A]">
          <div className="flex items-center gap-2">
            <Edit className="w-5 h-5 text-indigo-400" />
            <h2 className="text-sm font-bold font-['Outfit'] text-white">Generated Document</h2>
          </div>
          {content && (
            <div className="flex gap-2">
              <button 
                onClick={handleCopyToClipboard}
                className="px-3 py-1.5 hover:bg-[#18181B] border border-[#27272A] rounded-xl text-[#A1A1AA] hover:text-white transition-colors flex items-center gap-1.5 text-xs font-semibold cursor-pointer"
                title="Copy to Clipboard"
              >
                <Clipboard className="h-3.5 w-3.5" /> Copy
              </button>
              <button 
                onClick={handleDownloadTxt}
                className="px-3 py-1.5 hover:bg-[#18181B] border border-[#27272A] rounded-xl text-[#A1A1AA] hover:text-white transition-colors flex items-center gap-1.5 text-xs font-semibold cursor-pointer"
                title="Download txt file"
              >
                TXT
              </button>
              <button 
                onClick={handleExportPDF}
                className="px-3 py-1.5 bg-[#6366F1]/10 text-[#6366F1] border border-[#6366F1]/20 rounded-xl hover:bg-[#6366F1]/20 transition-all flex items-center gap-1.5 text-xs font-semibold cursor-pointer"
                title="Download PDF document"
              >
                <FileText className="h-3.5 w-3.5" /> Export PDF
              </button>
            </div>
          )}
        </div>

        {!content ? (
          <div className="flex-1 flex flex-col justify-center items-center text-[#A1A1AA] space-y-4 py-20">
            <div className="w-16 h-16 rounded-full bg-[#18181B] border border-[#27272A] flex items-center justify-center">
              <Edit className="w-8 h-8 text-indigo-400/60" />
            </div>
            <p className="text-xs">Provide a topic and hit Generate to view article details.</p>
          </div>
        ) : (
          <div className="mt-4 flex-1 overflow-y-auto max-h-[500px] text-xs text-[#A1A1AA] leading-relaxed pr-2 prose prose-invert max-w-none text-left">
            <Markdown>{content}</Markdown>
          </div>
        )}
      </div>
    </div>
  );
};

export default ArticleGenerator;
