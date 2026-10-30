import React from 'react';
import { useAppState } from '../context/AppStateContext';
import { VoiceAssistantCard } from '../components/voice/VoiceAssistantCard';
import { 
  Users, 
  HeartHandshake, 
  Radio, 
  ArrowRight, 
  Sparkles, 
  CheckCircle2, 
  Clock,
  MapPin,
  Monitor
} from 'lucide-react';

export const HomePage: React.FC = () => {
  const { setCurrentPage, currentDayState, setSelectedVillage } = useAppState();

  return (
    <div className="space-y-10 sm:space-y-14 animate-in fade-in duration-200 font-body">
      
      {/* 0. NEW: Multilingual Rural Health Voice Assistant Hero Card */}
      <section aria-label="AI Health Voice Assistant">
        <VoiceAssistantCard />
      </section>

      {/* 1. Hero Section (Strictly adhering to North Star & Tagline + Rural Map Illustration) */}
      <section className="bg-gradient-to-b from-teal-50/70 via-slate-50 to-white rounded-3xl p-6 sm:p-10 lg:p-12 border border-teal-100 shadow-sm relative overflow-hidden">

        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Hero Pitch & CTAs */}
          <div className="lg:col-span-7 space-y-6 text-left">
            
            {/* Eyebrow badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-100/80 border border-teal-200 text-teal-900 text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-[#0F9D8B] animate-live-pulse" />
              <span>Rural Early-Warning Network · <span className="font-mono font-bold">PSE13</span></span>
            </div>

            {/* Core Tagline Headline */}
            <div className="space-y-3">
              <h1 className="font-heading text-3xl sm:text-5xl lg:text-5xl font-black text-slate-900 tracking-tight leading-[1.15]">
                From screening individuals to <span className="text-[#0F9D8B]">protecting communities.</span>
              </h1>
              
              <p className="text-base sm:text-lg text-slate-700 font-normal leading-relaxed max-w-2xl font-body">
                SwasthyaNet is an early-warning network for rural healthcare — not just a symptom checker. Check your own symptoms, or get help from an ASHA worker or your local PHC.
              </p>
            </div>

            {/* Channel 3 Note: PHC / Kiosk Access */}
            <div className="inline-flex items-center gap-3 p-3 rounded-2xl bg-white/90 border border-slate-200 text-xs sm:text-sm text-slate-700 shadow-2xs">
              <img 
                src="/images/kiosk.jpeg" 
                alt="Community service kiosk and PHC walk-in tablet" 
                className="w-10 h-10 rounded-xl object-cover border border-slate-200 shrink-0"
                loading="lazy"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
              <div className="leading-snug">
                <span className="font-semibold text-slate-900">Channel 3 · PHC & Village Kiosk Access:</span>
                <span className="text-slate-600 block text-xs">Community tablets enable walk-in triage at primary health centres.</span>
              </div>
            </div>

          </div>

          {/* Right Hero Illustration */}
          <div className="lg:col-span-5">
            <div className="rounded-3xl overflow-hidden border border-teal-200/80 shadow-md bg-gradient-to-br from-slate-900 to-teal-950 aspect-video relative group">
              <img 
                src="/images/hero-map.jpeg" 
                alt="Rural healthcare early-warning coverage map connecting villages to clinics" 
                className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
                loading="eager"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex items-end p-4">
                <p className="text-xs font-medium text-white/90 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse" />
                  <span>Real-time village-level epidemiological surveillance catchment</span>
                </p>
              </div>
            </div>
          </div>

        </div>

        {/* TWO EQUALLY WEIGHTED CTAs */}
        <div className="mt-8 pt-8 border-t border-teal-100/80 grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* CTA 1: Citizen Self-Screen */}
          <button
            type="button"
            onClick={() => {
              setCurrentPage('screening_citizen');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="flex items-center justify-between p-5 sm:p-6 rounded-2xl bg-[#0F9D8B] hover:bg-teal-700 active:scale-98 text-white shadow-lg shadow-teal-700/20 border border-teal-500 transition-all cursor-pointer group text-left gap-4"
          >
            <div className="space-y-1.5 flex-1 min-w-0">
              <span className="text-xs font-semibold uppercase tracking-wider text-teal-100">
                Channel 1 · Citizen Direct
              </span>
              <h3 className="font-heading text-lg sm:text-xl font-extrabold text-white flex items-center gap-2">
                <span>Check My Symptoms</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform shrink-0" />
              </h3>
              <p className="text-xs text-teal-50 leading-relaxed line-clamp-2">
                Simple mobile self-check. 100% anonymous, no account or login needed.
              </p>
            </div>

            <div className="w-20 sm:w-24 h-16 sm:h-20 rounded-xl overflow-hidden border border-white/20 shrink-0 bg-teal-800">
              <img 
                src="/images/villager-smartphone.jpeg" 
                alt="Villager self-screening on smartphone" 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                loading="lazy"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
            </div>
          </button>

          {/* CTA 2: ASHA / Health Worker Mode */}
          <button
            type="button"
            onClick={() => {
              setCurrentPage('screening_worker');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="flex items-center justify-between p-5 sm:p-6 rounded-2xl bg-[#0B1220] hover:bg-slate-800 active:scale-98 text-white shadow-lg shadow-slate-950/20 border border-slate-700 transition-all cursor-pointer group text-left gap-4"
          >
            <div className="space-y-1.5 flex-1 min-w-0">
              <span className="text-xs font-semibold uppercase tracking-wider text-amber-300">
                Channel 2 · Assisted Triage
              </span>
              <h3 className="font-heading text-lg sm:text-xl font-extrabold text-white flex items-center gap-2">
                <span>I'm a Health Worker, Helping a Patient</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform shrink-0" />
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed line-clamp-2">
                For ASHA & ANM staff entering on behalf of citizens without smartphones.
              </p>
            </div>

            <div className="w-20 sm:w-24 h-16 sm:h-20 rounded-xl overflow-hidden border border-white/20 shrink-0 bg-slate-800">
              <img 
                src="/images/community-health-worker.jpeg" 
                alt="ASHA worker conducting assisted community screening" 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                loading="lazy"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
            </div>
          </button>

        </div>

      </section>

      {/* 2. Live Surveillance Alert Ticker */}
      <section className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <Radio className="w-5 h-5 text-[#0F9D8B] animate-pulse" />
            <h2 className="font-heading text-base font-extrabold text-slate-900">
              Live District Surveillance Signal Feed
            </h2>
          </div>
          <button
            onClick={() => {
              setCurrentPage('dashboard');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="text-xs font-bold text-teal-700 hover:text-teal-900 flex items-center gap-1 cursor-pointer self-start sm:self-auto font-body"
          >
            <span>Open Facility Dashboard</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {currentDayState.signals.slice(0, 3).map((sig) => (
            <div 
              key={sig.village}
              onClick={() => {
                setSelectedVillage(sig.village);
                setCurrentPage('dashboard');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="p-4 rounded-2xl bg-slate-50 hover:bg-slate-100/90 border border-slate-200 transition-all cursor-pointer group"
            >
              <div className="flex items-center justify-between">
                <span className="font-heading font-extrabold text-sm text-slate-900">{sig.village}</span>
                <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded-full ${
                  sig.activeAlert ? 'bg-red-600 text-white animate-pulse' : 'bg-slate-200 text-slate-800'
                }`}>
                  {sig.pressureScore}/100
                </span>
              </div>

              <p className="text-xs text-slate-600 mt-2 line-clamp-1 font-body">
                Dominant: {sig.dominantCategory}
              </p>

              <div className="mt-2 pt-2 border-t border-slate-200/80 flex items-center justify-between text-[11px] text-slate-500 font-mono">
                <span>{sig.caseCount} cases today</span>
                <span className="text-teal-700 font-bold group-hover:underline font-body">Inspect &rarr;</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. The Three Pillars Architecture */}
      <section className="space-y-6">
        <div className="text-center sm:text-left space-y-1">
          <span className="text-xs font-semibold uppercase tracking-wider text-teal-700">
            SYSTEM ARCHITECTURE
          </span>
          <h2 className="font-heading text-2xl sm:text-3xl font-black text-slate-900">
            The Three Pillars of SwasthyaNet
          </h2>
          <p className="text-sm text-slate-600 max-w-2xl font-body">
            Every component in SwasthyaNet maps directly to one of these three essential public healthcare pillars.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Pillar 1 Card */}
          <div className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200 shadow-xs space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-700 font-heading font-bold text-base">
                  1
                </div>
                <img 
                  src="/images/connected-access.jpeg" 
                  alt="Multi-channel rural healthcare access points" 
                  className="w-12 h-12 rounded-xl object-cover border border-slate-200 shadow-2xs"
                  loading="lazy"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
              </div>

              <h3 className="font-heading text-lg font-extrabold text-slate-900">
                Multi-Channel Rural Access
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-body">
                Ensures no one is left behind. Citizens screen directly on basic phones; non-literate community members are screened by ASHA workers; village kiosks serve public walk-ins.
              </p>
            </div>
            <div className="pt-3 border-t border-slate-100 text-xs text-teal-700 font-semibold font-body">
              Inclusive · Zero Barrier Access
            </div>
          </div>

          {/* Pillar 2 Card */}
          <div className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200 shadow-xs space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700 font-heading font-bold text-base">
                  2
                </div>
                <img 
                  src="/images/magnifying-glass-checklist.jpeg" 
                  alt="Clinical symptom screening and facility suitability checklist" 
                  className="w-12 h-12 rounded-xl object-cover border border-slate-200 shadow-2xs"
                  loading="lazy"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
              </div>

              <h3 className="font-heading text-lg font-extrabold text-slate-900">
                Screening & Facility Guidance
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-body">
                Rules-based 4-tier risk classification + differential disease categories + instant emergency red-flag override routing to 108. Matches patients with suitably equipped clinics.
              </p>
            </div>
            <div className="pt-3 border-t border-slate-100 text-xs text-amber-700 font-semibold font-body">
              4 Tiers · Red-Flag Override
            </div>
          </div>

          {/* Pillar 3 Card */}
          <div className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200 shadow-xs space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-red-50 border border-red-200 flex items-center justify-center text-red-700 font-heading font-bold text-base">
                3
              </div>
              <h3 className="font-heading text-lg font-extrabold text-slate-900">
                Health Pressure Early-Warning
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-body">
                Aggregates individual screenings into anonymous community signals. When high-risk cases rise in a village, alerts PHCs to prepare capacity before demand overwhelms them.
              </p>
            </div>
            <div className="pt-3 border-t border-slate-100 text-xs text-red-700 font-semibold font-body">
              The Core Product · Early Alert
            </div>
          </div>

        </div>
      </section>

      {/* 4. Judge Quick Demo Callout */}
      <section className="bg-[#0B1220] text-white p-7 sm:p-10 rounded-3xl border border-slate-800 shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-teal-400">
              Interactive Hackathon Demo Loop
            </span>
            <h2 className="font-heading text-2xl sm:text-3xl font-black text-white">
              Experience the Full End-to-End Early Warning Loop
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 max-w-2xl leading-relaxed font-body">
              Screen an individual &rarr; Get risk & facility match &rarr; Confirm anonymous community signal &rarr; Watch early-warning alert emerge on the Facility Health Pressure dashboard.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 shrink-0">
            <button
              onClick={() => {
                setCurrentPage('screening_citizen');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="bg-[#0F9D8B] hover:bg-teal-600 text-white font-bold px-6 py-3 rounded-xl text-sm transition-all cursor-pointer font-body"
            >
              Start Demo Screening
            </button>

            <button
              onClick={() => {
                setCurrentPage('dashboard');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="border border-slate-700 hover:bg-slate-800 text-slate-300 font-semibold px-6 py-3 rounded-xl text-sm transition-all cursor-pointer font-body"
            >
              View Early-Warning Dashboard
            </button>
          </div>
        </div>
      </section>

    </div>
  );
};
