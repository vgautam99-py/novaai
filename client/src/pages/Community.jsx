import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Heart, Sparkles, Image as ImageIcon, Download, Share2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

const Community = () => {
  const { user } = useAuth();
  const [creations, setCreations] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCreations = async () => {
    try {
      const { data } = await axios.get('/api/ai/published-creations');
      if (data.success) {
        setCreations(data.creations);
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to load community feed.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCreations();
  }, []);

  const handleLikeToggle = async (creationId) => {
    if (!user) {
      toast.error('Please sign in to like creations.');
      return;
    }

    try {
      const { data } = await axios.post('/api/ai/toggle-like', { id: creationId });
      if (data.success) {
        toast.success(data.message);
        
        // Update local state for reactive UI feedback
        setCreations((prev) =>
          prev.map((c) => {
            if (c._id === creationId) {
              const hasLiked = c.likes.includes(user._id);
              const updatedLikes = hasLiked
                ? c.likes.filter((uid) => uid !== user._id)
                : [...c.likes, user._id];
              return { ...c, likes: updatedLikes };
            }
            return c;
          })
        );
      }
    } catch (err) {
      toast.error('Failed to toggle like.');
    }
  };

  const handleDownload = async (url, prompt) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const element = document.createElement("a");
      element.href = URL.createObjectURL(blob);
      element.download = `${prompt.substring(0, 15).replace(/\s+/g, "_")}.png`;
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    } catch (err) {
      window.open(url, '_blank');
    }
  };

  return (
    <div className="space-y-6 pb-12">
      <div className="bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold font-['Outfit'] text-slate-900 flex items-center gap-2">
            Community Page <Sparkles className="h-5 w-5 text-indigo-500" />
          </h2>
          <p className="text-xs text-slate-400 mt-1">Browse, download, and like generated images created by other users on NovaAI.</p>
        </div>
      </div>

      {loading ? (
        <div className="py-20 text-center text-sm text-slate-400">Loading feed...</div>
      ) : creations.length === 0 ? (
        <div className="bg-white border p-12 rounded-2xl text-center text-slate-400 space-y-3">
          <ImageIcon className="h-10 w-10 mx-auto text-slate-300" />
          <p className="text-xs font-semibold">No images have been published yet.</p>
          <p className="text-[10px] text-slate-400">Create an image in the generator workspace and enable 'Publish' to list it here.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {creations.map((c) => {
            const hasLiked = user && c.likes && c.likes.includes(user._id);
            return (
              <div 
                key={c._id} 
                className="bg-white border border-slate-200/60 rounded-2xl overflow-hidden shadow-xs hover:shadow-md hover:border-slate-300 transition-all flex flex-col justify-between"
              >
                {/* Image frame */}
                <div className="relative aspect-square bg-slate-50 overflow-hidden border-b border-slate-100 group">
                  <img src={c.content} className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300" alt={c.prompt} />
                  
                  {/* Hover action bar overlay */}
                  <div className="absolute inset-0 bg-slate-950/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                    <button 
                      onClick={() => handleDownload(c.content, c.prompt)}
                      className="p-1.5 bg-white/90 hover:bg-white text-slate-800 rounded-lg shadow-sm transition-all cursor-pointer mr-2"
                      title="Download image"
                    >
                      <Download className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* Meta details */}
                <div className="p-4 space-y-3">
                  <p className="text-xs text-slate-650 leading-relaxed font-medium line-clamp-2" title={c.prompt}>
                    "{c.prompt.split(', in ')[0]}"
                  </p>
                  
                  <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                    {/* Author info */}
                    <div className="flex items-center gap-2 overflow-hidden">
                      {c.user?.avatar ? (
                        <img src={c.user.avatar} className="w-6 h-6 rounded-full object-cover shrink-0" alt="avatar" />
                      ) : (
                        <div className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-[10px] uppercase shrink-0">
                          {c.user?.name ? c.user.name[0] : 'N'}
                        </div>
                      )}
                      <span className="text-[10px] font-bold text-slate-800 truncate">{c.user?.name || 'Creator'}</span>
                    </div>

                    {/* Like counter */}
                    <button 
                      onClick={() => handleLikeToggle(c._id)}
                      className={`flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full cursor-pointer transition-all ${
                        hasLiked 
                          ? 'bg-rose-50 text-rose-600 border border-rose-100' 
                          : 'bg-slate-50 text-slate-500 border border-slate-150 hover:bg-slate-100'
                      }`}
                    >
                      <Heart className={`h-3.5 w-3.5 ${hasLiked ? 'fill-rose-600 text-rose-600' : ''}`} />
                      <span>{c.likes?.length || 0}</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Community;
