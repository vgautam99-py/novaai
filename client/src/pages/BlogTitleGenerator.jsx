import React, { useState } from 'react';
import axios from 'axios';
import { Sparkles, Type, Clipboard, RotateCcw, Heart, Star } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

const BlogTitleGenerator = () => {
  const { setUser } = useAuth();
  
  const toneOptions = ['Professional', 'Creative', 'Bold', 'Informative', 'Funny'];

  const [topic, setTopic] = useState('');
  const [audience, setAudience] = useState('');
  const [seoKeyword, setSeoKeyword] = useState('');
  const [selectedTone, setSelectedTone] = useState(toneOptions[0]);

  const [loading, setLoading] = useState(false);
  const [titles, setTitles] = useState([]);
  const [favorites, setFavorites] = useState(new Set());

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    if (!topic.trim()) {
      toast.error('Please enter a topic');
      return;
    }

    try {
      setLoading(true);
      const combinedPrompt = `Suggest 5 blog titles about "${topic}". Target Audience: ${audience || 'General'}. SEO Keyword: ${seoKeyword || 'None'}. Writing Tone: ${selectedTone}. Return titles split by line breaks.`;

      const { data } = await axios.post('/api/ai/generate-blog-title', { prompt: combinedPrompt });

      if (data.success) {
        // Split generated text by lines and clean lists numbers
        const list = data.content
          .split('\n')
          .map(line => line.replace(/^[\d.*-\s]+/, '').trim())
          .filter(line => line.length > 0);
        setTitles(list);
        toast.success('Titles generated successfully!');
        
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

  const handleCopyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success('Title copied to clipboard!');
  };

  const toggleFavorite = (text) => {
    setFavorites(prev => {
      const nextFavs = new Set(prev);
      if (nextFavs.has(text)) {
        nextFavs.delete(text);
        toast.success('Removed from favorites');
      } else {
        nextFavs.add(text);
        toast.success('Saved to favorites!');
      }
      return nextFavs;
    });
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 pb-12 text-white">
      {/* Workspace */}
      <div className="w-full lg:max-w-md shrink-0">
        <form onSubmit={onSubmitHandler} className="bg-[#111111] p-6 rounded-2xl border border-[#27272A] shadow-sm space-y-6">
          <div className="flex items-center gap-3">
            <Sparkles className="w-5 h-5 text-indigo-400" />
            <h2 className="text-sm font-bold font-['Outfit']">Headline Creator</h2>
          </div>
          
          <div>
            <label className="block text-[10px] font-bold text-[#A1A1AA] uppercase tracking-wider mb-2">Blog Topic / Description</label>
            <input 
              type="text"
              required
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="w-full bg-[#09090B] border border-[#27272A] rounded-xl px-3 py-2.5 text-xs focus:outline-none focus:border-[#6366F1] text-white"
              placeholder="E.g., CSS grid tips and layout tricks"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-bold text-[#A1A1AA] uppercase tracking-wider mb-2">Target Audience</label>
              <input 
                type="text"
                value={audience}
                onChange={(e) => setAudience(e.target.value)}
                className="w-full bg-[#09090B] border border-[#27272A] rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#6366F1] text-white"
                placeholder="E.g., junior developers"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-[#A1A1AA] uppercase tracking-wider mb-2">Tone Style</label>
              <select
                value={selectedTone}
                onChange={(e) => setSelectedTone(e.target.value)}
                className="w-full p-2 bg-[#09090B] border border-[#27272A] rounded-xl text-xs focus:outline-none focus:border-[#6366F1] text-white"
              >
                {toneOptions.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-[#A1A1AA] uppercase tracking-wider mb-2">SEO Target Keyword</label>
            <input 
              type="text"
              value={seoKeyword}
              onChange={(e) => setSeoKeyword(e.target.value)}
              className="w-full bg-[#09090B] border border-[#27272A] rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#6366F1] text-white"
              placeholder="E.g., CSS layout tips"
            />
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
                <Type className="w-4 h-4" /> Suggest Blog Titles
              </>
            )}
          </button>
        </form>
      </div>

      {/* Suggestion Board */}
      <div className="flex-grow bg-[#111111] rounded-2xl border border-[#27272A] shadow-sm p-6 flex flex-col min-h-[400px]">
        <div className="flex justify-between items-center pb-4 border-b border-[#27272A]">
          <div className="flex items-center gap-2">
            <Type className="w-5 h-5 text-indigo-400" />
            <h2 className="text-sm font-bold font-['Outfit'] text-white">Title Suggestions</h2>
          </div>
        </div>

        {titles.length === 0 ? (
          <div className="flex-1 flex flex-col justify-center items-center text-[#A1A1AA] space-y-4 py-20">
            <div className="w-16 h-16 rounded-full bg-[#18181B] border border-[#27272A] flex items-center justify-center">
              <Type className="w-8 h-8 text-indigo-400/60" />
            </div>
            <p className="text-xs">Provide blog details on the left panel to output suggestion cards.</p>
          </div>
        ) : (
          <div className="mt-6 flex-1 overflow-y-auto max-h-[350px] pr-2">
            <div className="space-y-3">
              {titles.map((title, idx) => {
                const isFav = favorites.has(title);
                return (
                  <div 
                    key={idx}
                    className="p-4 bg-[#18181B] border border-[#27272A] rounded-xl hover:border-slate-700 transition-all flex items-center justify-between group"
                  >
                    <p className="text-xs font-bold text-white text-left max-w-xl leading-relaxed">"{title}"</p>
                    
                    <div className="flex gap-2 shrink-0">
                      <button 
                        onClick={() => toggleFavorite(title)}
                        className={`p-2 rounded-lg border transition-all cursor-pointer ${
                          isFav 
                            ? 'bg-rose-500/10 text-rose-500 border-rose-500/30' 
                            : 'bg-[#111111] text-[#A1A1AA] border-[#27272A] hover:bg-[#18181B] hover:text-white'
                        }`}
                        title="Favorite"
                      >
                        <Heart className={`h-3.5 w-3.5 ${isFav ? 'fill-rose-500' : ''}`} />
                      </button>
                      <button 
                        onClick={() => handleCopyToClipboard(title)}
                        className="p-2 bg-[#111111] hover:bg-[#18181B] border border-[#27272A] text-[#A1A1AA] hover:text-white rounded-lg transition-all cursor-pointer"
                        title="Copy to Clipboard"
                      >
                        <Clipboard className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogTitleGenerator;
