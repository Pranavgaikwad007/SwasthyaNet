import React from 'react';
import { useAppState } from '../../context/AppStateContext';
import { Mic, Sparkles } from 'lucide-react';

export const FloatingVoiceButton: React.FC = () => {
  const { currentPage, setCurrentPage } = useAppState();

  // Hide on voice assistant page itself
  if (currentPage === 'voice_assistant') {
    return null;
  }

  return (
    <div className="fixed bottom-6 left-6 z-40 font-body animate-in slide-in-from-bottom duration-300">
      <button
        type="button"
        onClick={() => {
          setCurrentPage('voice_assistant');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        className="group flex items-center gap-2.5 bg-gradient-to-r from-slate-900 via-teal-950 to-slate-900 hover:from-teal-900 hover:to-slate-900 text-white pl-3.5 pr-4 py-2.5 rounded-full shadow-2xl border border-teal-500/40 hover:border-teal-400 active:scale-95 transition-all cursor-pointer"
        aria-label="Talk to Health Voice Assistant"
      >
        <div className="w-8 h-8 rounded-full bg-[#0F9D8B] text-white flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
          <Mic className="w-4 h-4 animate-pulse" />
        </div>
        
        <div className="text-left">
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-heading font-black text-white">Voice Assistant</span>
            <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse" />
          </div>
          <span className="text-[10px] text-teal-300 font-medium block -mt-0.5">
            Tap & Speak (13 Languages)
          </span>
        </div>
      </button>
    </div>
  );
};
