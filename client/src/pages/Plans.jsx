import React, { useState } from 'react';
import { Sparkles, Check, HelpCircle, Award, Star } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const Plans = () => {
  const { user, setUser } = useAuth();
  const [billingPeriod, setBillingPeriod] = useState('monthly'); // 'monthly' | 'yearly'
  const [loadingPlan, setLoadingPlan] = useState(null);

  const plans = [
    {
      id: 'free',
      name: 'Starter',
      price: { monthly: 0, yearly: 0 },
      credits: 10,
      description: 'Ideal for testing out template layouts and AI models.',
      features: [
        '10 monthly AI credits',
        'Standard PDF/PNG resume exports',
        'Basic document layouts',
        'Single active resume slot'
      ]
    },
    {
      id: 'pro',
      name: 'Professional Pro',
      price: { monthly: 12, yearly: 99 },
      credits: 100,
      description: 'Optimized for active creators seeking professional outputs.',
      features: [
        '100 monthly AI credits',
        'Unlimited high-res PDF, PNG & JPG exports',
        'All premium resume layout templates',
        'ATS keyword match scans',
        'AI Summary paragraph generator'
      ],
      popular: true
    },
    {
      id: 'vip',
      name: 'Enterprise VIP',
      price: { monthly: 29, yearly: 249 },
      credits: 300,
      description: 'Dedicated priority queues for teams and organizations.',
      features: [
        '300 monthly AI credits',
        'Everything in Professional Pro',
        'AI Cover Letter tailor engines',
        'Priority Gemini model endpoints',
        '24/7 dedicated email support'
      ]
    }
  ];

  const handleUpgrade = async (planId) => {
    if (!user) {
      toast.error('Please log in to upgrade plans');
      return;
    }
    if (planId === 'free') {
      toast.error('You are already on the free starter plan.');
      return;
    }

    try {
      setLoadingPlan(planId);
      toast.loading('Initializing checkout checkout...', { id: 'payment' });

      // Call server backend order create endpoint
      const { data } = await axios.post('/api/payments/order', { plan: planId });

      if (data.success) {
        // If razorpay credentials exist, trigger razorpay. Currently defaults to mock confirmation in server controller
        // Confirm mock transaction receipt
        const confirmRes = await axios.post('/api/payments/verify', {
          razorpay_payment_id: 'pay_mock_' + Math.random().toString(36).substring(7),
          razorpay_order_id: data.orderId,
          razorpay_signature: 'sig_mock_' + Math.random().toString(36).substring(7),
          plan: planId
        });

        if (confirmRes.data.success) {
          toast.success(`Upgraded to ${planId.toUpperCase()} successfully!`, { id: 'payment' });
          // Fetch updated profile
          const profileRes = await axios.get('/api/auth/profile');
          if (profileRes.data.success) {
            setUser(profileRes.data.user);
          }
        } else {
          toast.error('Payment validation failed', { id: 'payment' });
        }
      }
    } catch (err) {
      toast.error(err.response?.data?.message || err.message, { id: 'payment' });
    } finally {
      setLoadingPlan(null);
    }
  };

  return (
    <div className="space-y-12 pb-12 text-white text-center max-w-5xl mx-auto">
      
      {/* Cover Header */}
      <div className="space-y-4 pt-6">
        <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest bg-indigo-500/10 border border-indigo-500/20 px-3 py-1 rounded-full">NovaAI Premium</span>
        <h2 className="text-2xl sm:text-4xl font-extrabold font-['Outfit']">Pricing Plans</h2>
        <p className="text-xs sm:text-sm text-[#A1A1AA] max-w-md mx-auto">
          Increase your credit budget to gain access to keyword checking, letter drafting, and Cloudinary isolations.
        </p>

        {/* Toggle billing */}
        <div className="flex items-center justify-center gap-3 pt-4">
          <span className={`text-xs ${billingPeriod === 'monthly' ? 'text-white font-semibold' : 'text-[#A1A1AA]'}`}>Monthly</span>
          <button 
            onClick={() => setBillingPeriod(billingPeriod === 'monthly' ? 'yearly' : 'monthly')}
            className="w-10 h-6 bg-[#111111] border border-[#27272A] rounded-full p-1 transition-all cursor-pointer relative"
          >
            <div className={`w-3.5 h-3.5 bg-indigo-500 rounded-full transition-all ${billingPeriod === 'yearly' ? 'translate-x-4' : ''}`} />
          </button>
          <span className={`text-xs ${billingPeriod === 'yearly' ? 'text-white font-semibold' : 'text-[#A1A1AA]'}`}>
            Yearly <span className="text-[9px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-1.5 py-0.5 rounded font-bold uppercase ml-1">Save 20%</span>
          </span>
        </div>
      </div>

      {/* Grid boxes */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch pt-4">
        {plans.map((p) => {
          const isCurrent = user?.plan === p.id;
          return (
            <div 
              key={p.id}
              className={`bg-[#111111] border p-6 rounded-2xl text-left flex flex-col justify-between relative transition-all ${
                p.popular 
                  ? 'border-indigo-500 shadow-md shadow-indigo-650/10 scale-102' 
                  : 'border-[#27272A] hover:border-slate-700'
              }`}
            >
              {p.popular && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-indigo-600 text-white text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full flex items-center gap-1 shadow-sm">
                  <Sparkles className="h-2.5 w-2.5" /> Featured
                </span>
              )}

              <div>
                <h3 className="text-sm font-bold text-white font-['Outfit']">{p.name}</h3>
                <p className="text-[10px] text-[#A1A1AA] mt-1 font-light leading-normal">{p.description}</p>
                
                <div className="my-6 flex items-baseline gap-1">
                  <span className="text-3xl font-extrabold text-white font-['Outfit']">
                    ${billingPeriod === 'monthly' ? p.price.monthly : p.price.yearly}
                  </span>
                  <span className="text-xs text-[#A1A1AA]">/{billingPeriod === 'monthly' ? 'mo' : 'yr'}</span>
                </div>

                <div className="border-t border-[#27272A] pt-4 mb-6">
                  <span className="text-[9px] font-bold text-[#A1A1AA] uppercase tracking-wider">Features included:</span>
                  <ul className="space-y-2 mt-2">
                    {p.features.map((f, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs text-[#A1A1AA]">
                        <Check className="h-4 w-4 text-indigo-400 shrink-0 mt-0.5" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <button 
                onClick={() => handleUpgrade(p.id)}
                disabled={isCurrent || loadingPlan !== null}
                className={`w-full py-2.5 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                  isCurrent 
                    ? 'bg-[#18181B] text-[#A1A1AA] border border-[#27272A] cursor-default' 
                    : p.popular 
                      ? 'bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] hover:opacity-95 text-white shadow-md' 
                      : 'bg-[#18181B] hover:bg-[#27272A] border border-[#27272A] text-white'
                }`}
              >
                {isCurrent ? 'Current active plan' : loadingPlan === p.id ? 'Processing...' : 'Subscribe'}
              </button>
            </div>
          );
        })}
      </div>

      {/* Money back and badge warnings */}
      <div className="bg-[#111111]/80 border border-[#27272A] p-4 rounded-xl max-w-xl mx-auto flex items-center gap-4 text-left z-20 relative">
        <Award className="h-8 w-8 text-amber-500 shrink-0" />
        <div>
          <h4 className="text-xs font-bold text-white font-['Outfit']">14-Day Refund Guarantee</h4>
          <p className="text-[10px] text-[#A1A1AA] mt-0.5 leading-normal">
            If you are not satisfied with your credit usage outcome, contact support inside your billing dashboard to request a refund.
          </p>
        </div>
      </div>

    </div>
  );
};

export default Plans;
