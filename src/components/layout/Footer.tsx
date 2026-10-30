import React from 'react';
import { useAppState, PageView } from '../../context/AppStateContext';
import { 
  ShieldCheck, 
  PhoneCall, 
  Users, 
  Building2, 
  Radio, 
  HeartHandshake
} from 'lucide-react';

export const Footer: React.FC = () => {
  const { setCurrentPage } = useAppState();

  const handleNav = (p: PageView) => {
    setCurrentPage(p);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#0B1220] text-slate-300 border-t border-slate-800 mt-16 sm:mt-24 font-body">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        
        {/* Top Pitch Row */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-12 border-b border-slate-800">
          
          {/* Brand & North Star */}
          <div className="md:col-span-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center p-1.5 overflow-hidden">
                <img 
                  src="/logos/logo-navy-bg.png" 
                  alt="SwasthyaNet logo mark" 
                  className="w-full h-full object-contain"
                  loading="lazy"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
              </div>
              <span className="font-heading font-extrabold text-xl tracking-tight text-white">
                Swasthya<span className="text-[#0F9D8B]">Net</span>
              </span>
            </div>
            
            <p className="text-sm text-teal-300 font-semibold tracking-normal">
              "From screening individuals to protecting communities."
            </p>
            
            <p className="text-sm text-slate-400 leading-relaxed max-w-xl font-body">
              SwasthyaNet is an early-warning network for rural healthcare. Individual symptom screenings are converted into anonymous community-level signals. When similar high-risk cases rise in an area, SwasthyaNet identifies rising health pressure and alerts healthcare facilities in advance.
            </p>

            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800/80 border border-slate-700 text-xs text-slate-300">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Privacy by Design: No names, phone numbers, or identity collected.</span>
            </div>
          </div>

          {/* Quick Access Pillars */}
          <div className="md:col-span-3 space-y-3">
            <h3 className="text-xs font-heading font-bold text-slate-400 uppercase tracking-widest">
              Core Pillars
            </h3>
            <ul className="space-y-2 text-sm font-body">
              <li>
                <button 
                  onClick={() => handleNav('screening_citizen')}
                  className="hover:text-teal-400 transition-colors flex items-center gap-2 cursor-pointer"
                >
                  <Users className="w-3.5 h-3.5 text-teal-400" />
                  <span>Citizen Self-Screening</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleNav('screening_worker')}
                  className="hover:text-teal-400 transition-colors flex items-center gap-2 cursor-pointer"
                >
                  <HeartHandshake className="w-3.5 h-3.5 text-teal-400" />
                  <span>ASHA / Worker Assisted</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleNav('facilities')}
                  className="hover:text-teal-400 transition-colors flex items-center gap-2 cursor-pointer"
                >
                  <Building2 className="w-3.5 h-3.5 text-teal-400" />
                  <span>Facility Directory</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleNav('dashboard')}
                  className="hover:text-teal-400 transition-colors flex items-center gap-2 cursor-pointer"
                >
                  <Radio className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Facility Health Pressure Radar</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleNav('about')}
                  className="hover:text-teal-400 transition-colors cursor-pointer"
                >
                  About the Solution & Vision
                </button>
              </li>
            </ul>
          </div>

          {/* Emergency Lifelines */}
          <div className="md:col-span-3 space-y-3">
            <h3 className="text-xs font-heading font-bold text-slate-400 uppercase tracking-widest">
              National Health Helplines
            </h3>
            <div className="space-y-2 font-body">
              <a 
                href="tel:108" 
                className="flex items-center justify-between p-2.5 rounded-lg bg-red-950/50 border border-red-800/60 text-red-200 hover:bg-red-900/60 transition-colors"
              >
                <div className="flex items-center gap-2 text-xs">
                  <PhoneCall className="w-4 h-4 text-red-400 shrink-0" />
                  <span className="font-bold">108 Emergency</span>
                </div>
                <span className="text-[11px] font-mono bg-red-800 px-2 py-0.5 rounded text-white font-bold">24x7</span>
              </a>

              <a 
                href="tel:104" 
                className="flex items-center justify-between p-2.5 rounded-lg bg-slate-800/80 border border-slate-700 text-slate-300 hover:bg-slate-800 transition-colors"
              >
                <div className="flex items-center gap-2 text-xs">
                  <PhoneCall className="w-4 h-4 text-teal-400 shrink-0" />
                  <span>104 Health Helpline</span>
                </div>
                <span className="text-[11px] font-mono text-slate-400">Advice</span>
              </a>

              <div className="p-2.5 rounded-lg bg-slate-800/40 border border-slate-800 text-[11px] text-slate-400">
                <span className="font-semibold text-slate-300">Safety Notice:</span> AI suggestions do not replace clinical doctor examination.
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Attribution */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 font-body">
          <p>
            SwasthyaNet · PSE13: Health Screening Assistant · Rural Early-Warning Prototype
          </p>
          <div className="flex items-center gap-4 text-[11px]">
            <span>WCAG 2.1 AA Compliant</span>
            <span>•</span>
            <span>Low-Bandwidth Optimized</span>
            <span>•</span>
            <span>No Auth Required</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
