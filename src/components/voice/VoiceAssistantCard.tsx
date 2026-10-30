import React, { useState } from 'react';
import { useAppState } from '../../context/AppStateContext';
import { SupportedLanguageCode } from '../../types';
import { SUPPORTED_LANGUAGES, QUICK_ACTIONS_BY_LANG } from '../../services/voiceAssistantEngine';
import { 
  Mic, 
  Sparkles, 
  Globe, 
  ArrowRight, 
  Stethoscope, 
  ShieldCheck, 
  Keyboard,
  Volume2
} from 'lucide-react';

export const VoiceAssistantCard: React.FC = () => {
  const { setCurrentPage } = useAppState();
  const [selectedLang, setSelectedLang] = useState<SupportedLanguageCode>('mr');
  const [quickInput, setQuickInput] = useState('');

  const quickActions = QUICK_ACTIONS_BY_LANG[selectedLang] || QUICK_ACTIONS_BY_LANG['mr'];

  const handleLaunchVoice = () => {
    setCurrentPage('voice_assistant');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="bg-gradient-to-br from-teal-950 via-slate-900 to-[#0B1220] text-white rounded-3xl p-6 sm:p-8 border border-teal-500/30 shadow-2xl relative overflow-hidden font-body">
      
      {/* Decorative subtle background accents */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-teal-600/10 rounded-full blur-2xl pointer-events-none" />

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        
        {/* Left Column: Voice Assistant Pitch & Language Dropdown */}
        <div className="lg:col-span-7 space-y-5 text-left">
          
          {/* Eyebrow badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/20 border border-teal-400/40 text-teal-300 text-xs font-bold font-mono uppercase tracking-wider">
            <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse" />
            <span>AI Health Voice Assistant · 13 Indian Languages</span>
          </div>

          <div className="space-y-2">
            <h2 className="font-heading text-2xl sm:text-4xl font-black text-white tracking-tight flex items-center gap-3">
              <Stethoscope className="w-8 h-8 text-[#0F9D8B] shrink-0" />
              <span>Talk to Health Assistant</span>
            </h2>
            <p className="text-sm sm:text-base text-slate-300 font-normal leading-relaxed max-w-xl">
              Don't want to type? Speak naturally in <strong>Marathi, Hindi, English</strong>, or your regional language. Our voice AI listens, asks smart follow-ups, and guides you to the right care.
            </p>
          </div>

          {/* Language Selector Selector Row */}
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <span className="text-xs text-teal-300 font-semibold flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5" />
              <span>Language:</span>
            </span>

            <div className="flex flex-wrap gap-1.5">
              {['mr', 'hi', 'en', 'auto'].map((code) => {
                const lang = SUPPORTED_LANGUAGES.find(l => l.code === code);
                if (!lang) return null;
                const isSelected = selectedLang === code;
                return (
                  <button
                    key={code}
                    type="button"
                    onClick={() => setSelectedLang(code as SupportedLanguageCode)}
                    className={`px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#0F9D8B] text-white border border-teal-300 shadow-sm scale-105'
                        : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700 border border-slate-700'
                    }`}
                  >
                    {lang.nativeName}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quick Symptoms Grid */}
          <div className="pt-2">
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
              Common rural symptoms (Tap to speak):
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {quickActions.slice(0, 4).map((qa) => (
                <button
                  key={qa.id}
                  type="button"
                  onClick={handleLaunchVoice}
                  className="p-2.5 rounded-xl bg-slate-800/60 hover:bg-teal-950/80 border border-slate-700/80 hover:border-teal-500/50 text-left transition-all cursor-pointer group"
                >
                  <span className="text-base">{qa.icon}</span>
                  <p className="text-xs font-bold text-slate-200 group-hover:text-teal-300 truncate mt-1">
                    {qa.label}
                  </p>
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* Right Column: Hero "TAP & SPEAK" Centerpiece */}
        <div className="lg:col-span-5 flex flex-col items-center justify-center p-6 sm:p-8 rounded-3xl bg-slate-950/70 border border-teal-500/30 text-center space-y-4 shadow-xl">
          
          <div className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-teal-400 font-mono">
              Voice-First Rural Triage
            </span>
            <h3 className="font-heading text-lg sm:text-xl font-black text-white">
              "Tell me what you are feeling."
            </h3>
          </div>

          {/* Large Tap & Speak Button */}
          <div className="relative group my-2">
            <div className="absolute -inset-3 rounded-full bg-teal-500/20 group-hover:bg-teal-500/30 animate-pulse transition-all" />
            
            <button
              type="button"
              onClick={handleLaunchVoice}
              className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-gradient-to-tr from-[#0F9D8B] via-teal-500 to-emerald-400 text-white flex flex-col items-center justify-center shadow-xl shadow-teal-500/30 group-hover:scale-105 active:scale-95 border-4 border-white/20 transition-all cursor-pointer"
              aria-label="Tap and Speak to Health Assistant"
            >
              <Mic className="w-10 h-10 sm:w-11 sm:h-11 animate-pulse" />
              <span className="text-[11px] font-extrabold uppercase tracking-wider mt-1 font-heading">
                TAP & SPEAK
              </span>
            </button>
          </div>

          {/* Controls hint */}
          <div className="space-y-2 w-full max-w-xs">
            <button
              type="button"
              onClick={handleLaunchVoice}
              className="w-full py-2.5 px-4 rounded-xl bg-teal-500/20 hover:bg-teal-500/30 text-teal-200 border border-teal-500/40 text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <Volume2 className="w-4 h-4 text-teal-400" />
              <span>Open Full Voice Assistant &rarr;</span>
            </button>

            <p className="text-[11px] text-slate-400">
              Zero login required · 100% Private & Anonymous
            </p>
          </div>

        </div>

      </div>

    </div>
  );
};
