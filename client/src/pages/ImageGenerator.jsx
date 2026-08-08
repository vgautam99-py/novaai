import React, { useState } from 'react';
import axios from 'axios';
import { Sparkles, Image as ImageIcon, Download, Heart, Eye, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

const ImageGenerator = () => {
  const { setUser } = useAuth();
  
  const imageStyle = [
    "Realistic",
    "Ghibli",
    "Anime",
    "Cartoon",
    "Fantasy",
    "3D Render",
    "Oil Painting",
    "Cyberpunk"
  ];

  const aspectRatios = ["1:1 (Square)", "16:9 (Landscape)", "9:16 (Portrait)"];
  const resolutions = ["High Definition (1024x1024)", "Ultra HD 4K (2048x2048)"];

  const [selectedStyle, setSelectedStyle] = useState("Realistic");
  const [selectedRatio, setSelectedRatio] = useState(aspectRatios[0]);
  const [selectedRes, setSelectedRes] = useState(resolutions[0]);

  const [prompt, setPrompt] = useState("");
  const [publish, setPublish] = useState(false);
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [isFav, setIsFav] = useState(false);

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    if (!prompt.trim()) {
      toast.error('Please enter a description');
      return;
    }

    try {
      setLoading(true);
      const combinedPrompt = `${prompt}, in ${selectedStyle} style, aspect ratio ${selectedRatio}, resolution ${selectedRes}, highly detailed 4k`;

      const { data } = await axios.post('/api/ai/generate-image', { 
        prompt: combinedPrompt, 
        publish 
      });

      if (data.success) {
        setImageUrl(data.content);
        setIsFav(false);
        toast.success('Image generated successfully!');
        
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

  const handleDownloadImage = async () => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const element = document.createElement("a");
      element.href = URL.createObjectURL(blob);
      element.download = `${prompt.substring(0, 15).replace(/\s+/g, "_")}.png`;
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
      toast.success('Image download started!');
    } catch (err) {
      window.open(imageUrl, '_blank');
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 pb-12 text-white">
      {/* Workspace */}
      <div className="w-full lg:max-w-md shrink-0">
        <form onSubmit={onSubmitHandler} className="bg-[#111111] p-6 rounded-2xl border border-[#27272A] shadow-sm space-y-6">
          <div className="flex items-center gap-3">
            <Sparkles className="w-5 h-5 text-emerald-450" />
            <h2 className="text-sm font-bold font-['Outfit']">AI Image Generator</h2>
          </div>
          
          <div>
            <label className="block text-[10px] font-bold text-[#A1A1AA] uppercase tracking-wider mb-2">Image Prompt</label>
            <textarea 
              onChange={(e) => setPrompt(e.target.value)} 
              value={prompt} 
              rows="4"
              className="w-full p-3 text-xs rounded-xl border border-[#27272A] outline-none focus:border-emerald-500 bg-[#09090B] resize-none text-white" 
              placeholder="Describe what you want to see. E.g., A futuristic space station orbiting a blue neon planet..." 
              required 
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-bold text-[#A1A1AA] uppercase tracking-wider mb-2">Aspect Ratio</label>
              <select
                value={selectedRatio}
                onChange={(e) => setSelectedRatio(e.target.value)}
                className="w-full p-2 bg-[#09090B] border border-[#27272A] rounded-xl text-xs focus:outline-none focus:border-[#06B6D4] text-white"
              >
                {aspectRatios.map(r => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-[#A1A1AA] uppercase tracking-wider mb-2">Target Quality</label>
              <select
                value={selectedRes}
                onChange={(e) => setSelectedRes(e.target.value)}
                className="w-full p-2 bg-[#09090B] border border-[#27272A] rounded-xl text-xs focus:outline-none focus:border-[#06B6D4] text-white"
              >
                {resolutions.map(res => <option key={res} value={res}>{res.split(' (')[0]}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-[#A1A1AA] uppercase tracking-wider mb-2">Artistic Style</label>
            <div className="grid grid-cols-4 gap-2">
              {imageStyle.map((item) => (
                <span
                  key={item}
                  onClick={() => setSelectedStyle(item)}
                  className={`text-[9px] text-center px-1 py-1.5 border rounded-lg cursor-pointer select-none transition-all truncate ${
                    selectedStyle === item 
                      ? "bg-emerald-500/10 text-emerald-400 border-emerald-500 font-semibold" 
                      : "text-[#A1A1AA] border-[#27272A] hover:bg-[#18181B]"
                  }`}
                >
                  {item}
                </span>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between p-3 bg-[#18181B] border border-[#27272A] rounded-xl">
            <div className="flex flex-col">
              <span className="text-xs font-bold text-white">Publish Creation</span>
              <span className="text-[9px] text-[#A1A1AA]">Share this image on community feed</span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                onChange={(e) => setPublish(e.target.checked)}
                checked={publish}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-slate-800 rounded-full peer peer-focus:ring-0 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-500"></div>
            </label>
          </div>

          <button 
            type="submit"
            disabled={loading} 
            className="w-full flex justify-center items-center gap-2 bg-gradient-to-r from-emerald-500 to-cyan-500 hover:opacity-95 text-white py-3 text-xs font-bold rounded-xl cursor-pointer transition-all disabled:opacity-50"
          >
            {loading ? (
              <span className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin"></span>
            ) : (
              <>
                <ImageIcon className="w-4 h-4" /> Generate Image
              </>
            )}
          </button>
        </form>
      </div>

      {/* Rendering Board */}
      <div className="flex-grow bg-[#111111] rounded-2xl border border-[#27272A] shadow-sm p-6 flex flex-col min-h-[450px]">
        <div className="flex justify-between items-center pb-4 border-b border-[#27272A]">
          <div className="flex items-center gap-2">
            <ImageIcon className="w-5 h-5 text-emerald-500" />
            <h2 className="text-sm font-bold font-['Outfit'] text-white">Image Canvas</h2>
          </div>
          {imageUrl && (
            <div className="flex gap-2">
              <button 
                onClick={() => {
                  setIsFav(!isFav);
                  toast.success(isFav ? 'Removed from favorites' : 'Saved to favorites!');
                }}
                className={`p-2 rounded-lg border transition-all cursor-pointer ${
                  isFav 
                    ? 'bg-rose-500/10 text-rose-500 border-rose-500/30' 
                    : 'bg-[#18181B] text-[#A1A1AA] border-[#27272A] hover:bg-[#111111] hover:text-white'
                }`}
              >
                <Heart className={`h-3.5 w-3.5 ${isFav ? 'fill-rose-500' : ''}`} />
              </button>
              <button 
                onClick={handleDownloadImage}
                className="px-3 py-1.5 hover:bg-[#18181B] border border-[#27272A] rounded-xl text-[#A1A1AA] hover:text-white transition-colors flex items-center gap-1.5 text-xs font-semibold cursor-pointer"
                title="Download generated image"
              >
                <Download className="h-3.5 w-3.5" /> Download
              </button>
            </div>
          )}
        </div>

        {!imageUrl ? (
          <div className="flex-1 flex flex-col justify-center items-center text-[#A1A1AA] space-y-4 py-20">
            {loading ? (
              <div className="flex flex-col items-center space-y-3">
                <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
                <span className="text-xs">Generating creative image elements...</span>
              </div>
            ) : (
              <>
                <div className="w-16 h-16 rounded-full bg-[#18181B] border border-[#27272A] flex items-center justify-center">
                  <ImageIcon className="w-8 h-8 text-emerald-450/60" />
                </div>
                <p className="text-xs">Your generated canvas layout will be displayed here.</p>
              </>
            )}
          </div>
        ) : (
          <div className="mt-4 flex-1 flex items-center justify-center p-2 bg-[#09090B] rounded-2xl border border-[#27272A] relative overflow-hidden">
            <div className="relative rounded-2xl overflow-hidden shadow-lg border border-[#27272A] max-w-[380px] w-full aspect-square">
              <img src={imageUrl} alt="Generated Artwork" className="w-full h-full object-cover" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageGenerator;
