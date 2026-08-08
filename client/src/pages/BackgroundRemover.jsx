import React, { useState } from 'react';
import axios from 'axios';
import { Sparkles, Scissors, Download, Upload, Image as ImageIcon, Sliders } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

const BackgroundRemover = () => {
  const { setUser } = useAuth();
  
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [resultUrl, setResultUrl] = useState('');

  // Background replacements presets
  const bgColors = [
    { name: 'Transparent', value: 'transparent', class: 'bg-[radial-gradient(#27272a_1px,transparent_1px)] [background-size:8px_8px]' },
    { name: 'Solid Black', value: 'black', class: 'bg-black' },
    { name: 'Solid White', value: 'white', class: 'bg-white' },
    { name: 'SaaS Purple', value: '#6366F1', class: 'bg-[#6366F1]' },
    { name: 'SaaS Blue', value: '#3B82F6', class: 'bg-[#3B82F6]' }
  ];

  const [activeBg, setActiveBg] = useState(bgColors[0]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setResultUrl('');
    }
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    if (!selectedFile) {
      toast.error('Please select an image file to upload.');
      return;
    }

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append('image', selectedFile);

      const { data } = await axios.post('/api/ai/remove-image-background', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (data.success) {
        setResultUrl(data.content);
        toast.success('Background removed successfully!');
        
        // Refresh credit limit
        const profileRes = await axios.get('/api/auth/profile');
        if (profileRes.data.success) {
          setUser(profileRes.data.user);
        }
      } else {
        toast.error(data.message || 'Processing failed.');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadImage = async () => {
    try {
      const response = await fetch(resultUrl);
      const blob = await response.blob();
      const element = document.createElement("a");
      element.href = URL.createObjectURL(blob);
      element.download = `no_bg_${selectedFile ? selectedFile.name : 'image.png'}`;
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
      toast.success('Image download started!');
    } catch (err) {
      window.open(resultUrl, '_blank');
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 pb-12 text-white">
      {/* Configuration Workspace */}
      <div className="w-full lg:max-w-md shrink-0">
        <form onSubmit={onSubmitHandler} className="bg-[#111111] p-6 rounded-2xl border border-[#27272A] shadow-sm space-y-6">
          <div className="flex items-center gap-3">
            <Sparkles className="w-5 h-5 text-rose-500" />
            <h2 className="text-sm font-bold font-['Outfit']">Background Remover</h2>
          </div>

          {/* Upload card */}
          <div className="space-y-2">
            <label className="block text-[10px] font-bold text-[#A1A1AA] uppercase tracking-wider">Source Upload</label>
            <div className="relative border-2 border-dashed border-[#27272A] rounded-2xl p-6 text-center hover:border-indigo-500/50 transition-colors bg-[#09090B]/50">
              <input 
                type="file" 
                accept="image/*"
                onChange={handleFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <div className="flex flex-col items-center space-y-2">
                <Upload className="h-6 w-6 text-[#A1A1AA]" />
                <span className="text-xs font-semibold text-white">Choose file or drag here</span>
                <span className="text-[9px] text-[#A1A1AA]">PNG, JPG, JPEG up to 10MB</span>
              </div>
            </div>
          </div>

          {previewUrl && (
            <div className="space-y-2">
              <label className="block text-[10px] font-bold text-[#A1A1AA] uppercase tracking-wider">Source Preview</label>
              <div className="relative rounded-xl overflow-hidden border border-[#27272A] aspect-video bg-[#09090B] flex items-center justify-center">
                <img src={previewUrl} className="max-h-full max-w-full object-contain" alt="Original Preview" />
              </div>
            </div>
          )}

          {resultUrl && (
            <div className="space-y-3">
              <label className="block text-[10px] font-bold text-[#A1A1AA] uppercase tracking-wider">Replace Background Canvas</label>
              <div className="flex gap-2">
                {bgColors.map((color) => (
                  <button
                    key={color.name}
                    type="button"
                    onClick={() => setActiveBg(color)}
                    className={`w-8 h-8 rounded-full border-2 transition-all cursor-pointer ${color.class} ${
                      activeBg.value === color.value ? 'border-indigo-500 scale-105' : 'border-slate-800 hover:border-[#27272A]'
                    }`}
                    title={color.name}
                  />
                ))}
              </div>
            </div>
          )}

          <button 
            type="submit"
            disabled={loading || !selectedFile} 
            className="w-full flex justify-center items-center gap-2 bg-gradient-to-r from-rose-500 to-indigo-500 hover:opacity-95 text-white py-3 text-xs font-bold rounded-xl cursor-pointer transition-all disabled:opacity-50"
          >
            {loading ? (
              <span className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin"></span>
            ) : (
              <>
                <Scissors className="w-4 h-4" /> Isolate Subject
              </>
            )}
          </button>
        </form>
      </div>

      {/* Render Canvas */}
      <div className="flex-grow bg-[#111111] rounded-2xl border border-[#27272A] shadow-sm p-6 flex flex-col min-h-[450px]">
        <div className="flex justify-between items-center pb-4 border-b border-[#27272A]">
          <div className="flex items-center gap-2">
            <ImageIcon className="w-5 h-5 text-rose-500" />
            <h2 className="text-sm font-bold font-['Outfit'] text-white">Result Canvas</h2>
          </div>
          {resultUrl && (
            <button 
              onClick={handleDownloadImage}
              className="px-3 py-1.5 hover:bg-[#18181B] border border-[#27272A] rounded-xl text-[#A1A1AA] hover:text-white transition-colors flex items-center gap-1.5 text-xs font-semibold cursor-pointer"
              title="Download image without background"
            >
              <Download className="h-3.5 w-3.5" /> Download PNG
            </button>
          )}
        </div>

        {!resultUrl ? (
          <div className="flex-1 flex flex-col justify-center items-center text-[#A1A1AA] space-y-4 py-20">
            {loading ? (
              <div className="flex flex-col items-center space-y-3">
                <div className="w-10 h-10 border-4 border-rose-500 border-t-transparent rounded-full animate-spin"></div>
                <span className="text-xs">Removing background elements...</span>
              </div>
            ) : (
              <>
                <div className="w-16 h-16 rounded-full bg-[#18181B] border border-[#27272A] flex items-center justify-center">
                  <Scissors className="w-8 h-8 text-rose-455/60" />
                </div>
                <p className="text-xs">Select a source image file and press Isolate.</p>
              </>
            )}
          </div>
        ) : (
          <div className={`mt-4 flex-1 flex items-center justify-center p-4 rounded-xl border border-[#27272A] ${
            activeBg.value === 'transparent' ? 'bg-[#09090B] bg-[radial-gradient(#27272a_1px,transparent_1px)] [background-size:16px_16px]' : ''
          }`} style={{ backgroundColor: activeBg.value !== 'transparent' ? activeBg.value : undefined }}>
            <div className="max-w-[380px] w-full aspect-square flex items-center justify-center">
              <img src={resultUrl} alt="Background Removed Result" className="max-h-full max-w-full object-contain filter drop-shadow-md" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BackgroundRemover;
