import React, { useState } from 'react';
import { HelpCircle, Mail, MessageSquare, BookOpen, Search, ChevronDown, ChevronUp, ShieldCheck } from 'lucide-react';
import toast from 'react-hot-toast';

const HelpSupport = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFaq, setActiveFaq] = useState(0);

  const [ticketSubject, setTicketSubject] = useState('');
  const [ticketMsg, setTicketMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const faqs = [
    {
      q: 'How do I upgrade to the Professional Pro plan?',
      a: 'Navigate to the Plans page, choose the Pro tier billing period, and click Subscribe. Razorpay payment verify modals will confirm the credit balance reload instantly.'
    },
    {
      q: 'What formats can I download resumes in?',
      a: 'The Builder compiles high-resolution vectors directly from client DOM wrappers, supporting files exported in PDF, PNG, and JPG formats.'
    },
    {
      q: 'Can I remove backgrounds from custom snapshots?',
      a: 'Yes. The Background Remover uploads images to Cloudinary, applying transparency transformations and outputting isolated subjects.'
    },
    {
      q: 'What is the refund policy?',
      a: 'We offer a 14-day refund window on all plans if you have not exhausted more than 20% of your current billing cycle AI credits.'
    }
  ];

  const handleTicketSubmit = (e) => {
    e.preventDefault();
    if (!ticketSubject.trim() || !ticketMsg.trim()) {
      toast.error('Please enter all fields to submit a ticket.');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast.success('Support ticket created! We will follow up via email.');
      setTicketSubject('');
      setTicketMsg('');
    }, 1200);
  };

  return (
    <div className="space-y-8 pb-12 text-white text-left max-w-4xl mx-auto">
      
      {/* Cover Header */}
      <div className="text-center space-y-4 pt-6">
        <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest bg-indigo-500/10 border border-indigo-500/20 px-3 py-1 rounded-full">Help Center</span>
        <h2 className="text-2xl sm:text-4xl font-extrabold font-['Outfit']">How can we help?</h2>
        <p className="text-xs sm:text-sm text-[#A1A1AA] max-w-md mx-auto">
          Search tutorials, read through FAQs, or submit tickets to our support engineering queue.
        </p>

        {/* Search Bar */}
        <div className="max-w-md mx-auto relative pt-2">
          <Search className="absolute left-3.5 top-6.5 h-4.5 w-4.5 text-[#A1A1AA]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#111111] border border-[#27272A] rounded-xl pl-11 pr-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#6366F1]"
            placeholder="Search FAQs and documentation..."
          />
        </div>
      </div>

      {/* Grid boxes */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[#111111] border border-[#27272A] p-5 rounded-2xl flex flex-col justify-between hover:border-slate-700 transition-colors">
          <div className="p-2.5 bg-[#18181B] border border-[#27272A] rounded-xl w-fit mb-3">
            <BookOpen className="h-4.5 w-4.5 text-indigo-400" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-white font-['Outfit']">Read Docs</h4>
            <p className="text-[10px] text-[#A1A1AA] mt-1 font-light leading-normal">
              Review markdown developer integrations and prompt guides.
            </p>
          </div>
        </div>

        <div className="bg-[#111111] border border-[#27272A] p-5 rounded-2xl flex flex-col justify-between hover:border-slate-700 transition-colors">
          <div className="p-2.5 bg-[#18181B] border border-[#27272A] rounded-xl w-fit mb-3">
            <MessageSquare className="h-4.5 w-4.5 text-purple-400" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-white font-['Outfit']">Community Feed</h4>
            <p className="text-[10px] text-[#A1A1AA] mt-1 font-light leading-normal">
              Discuss prompt structures and layout styles with others.
            </p>
          </div>
        </div>

        <div className="bg-[#111111] border border-[#27272A] p-5 rounded-2xl flex flex-col justify-between hover:border-slate-700 transition-colors">
          <div className="p-2.5 bg-[#18181B] border border-[#27272A] rounded-xl w-fit mb-3">
            <ShieldCheck className="h-4.5 w-4.5 text-emerald-450" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-white font-['Outfit']">System Status</h4>
            <p className="text-[10px] text-emerald-450 mt-1 font-semibold flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping" /> All Engines Online
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* FAQs (7/12) */}
        <div className="lg:col-span-7 space-y-4">
          <h3 className="text-sm font-bold font-['Outfit'] text-[#A1A1AA] uppercase tracking-wider pb-2 border-b border-[#27272A]">Frequently Asked Questions</h3>
          
          <div className="space-y-3">
            {faqs.map((faq, idx) => (
              <div 
                key={idx}
                className="bg-[#111111] border border-[#27272A] rounded-xl overflow-hidden"
              >
                <button 
                  onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                  className="w-full p-4 flex justify-between items-center text-xs font-bold text-white outline-none cursor-pointer"
                >
                  <span>{faq.q}</span>
                  {activeFaq === idx ? <ChevronUp className="h-4 w-4 text-[#A1A1AA]" /> : <ChevronDown className="h-4 w-4 text-[#A1A1AA]" />}
                </button>
                {activeFaq === idx && (
                  <div className="p-4 pt-0 text-[10px] text-[#A1A1AA] leading-relaxed border-t border-[#27272A]/50">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Raise Ticket Form (5/12) */}
        <div className="lg:col-span-5 bg-[#111111] border border-[#27272A] p-5 rounded-2xl">
          <h3 className="text-xs font-bold font-['Outfit'] text-white border-b border-[#27272A] pb-3 mb-4 flex items-center gap-2">
            <Mail className="h-4 w-4 text-indigo-400" /> Raise Support Ticket
          </h3>

          <form onSubmit={handleTicketSubmit} className="space-y-4">
            <div>
              <label className="block text-[10px] font-bold text-[#A1A1AA] uppercase tracking-wider mb-2">Subject</label>
              <input 
                type="text"
                required
                value={ticketSubject}
                onChange={(e) => setTicketSubject(e.target.value)}
                className="w-full bg-[#09090B] border border-[#27272A] rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#6366F1]"
                placeholder="E.g., Subscription reload delay"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-[#A1A1AA] uppercase tracking-wider mb-2">Detailed Message</label>
              <textarea 
                required
                rows="4"
                value={ticketMsg}
                onChange={(e) => setTicketMsg(e.target.value)}
                className="w-full bg-[#09090B] border border-[#27272A] rounded-xl p-3 text-xs focus:outline-none focus:border-[#6366F1] resize-none"
                placeholder="Describe your issue with transaction IDs or details..."
              />
            </div>

            <button 
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] text-white rounded-xl text-xs font-bold shadow-md cursor-pointer transition-all disabled:opacity-50"
            >
              {loading ? 'Submitting...' : 'Submit Support Ticket'}
            </button>
          </form>
        </div>
      </div>

    </div>
  );
};

export default HelpSupport;
