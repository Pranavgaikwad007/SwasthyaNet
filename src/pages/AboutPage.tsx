import React from 'react';
import { 
  ShieldCheck, 
  Sparkles, 
  Radio, 
  Cpu, 
  Phone, 
  Mic, 
  WifiOff, 
  Activity, 
  Lock, 
  CheckCircle2,
  Users,
  Building2,
  HeartHandshake
} from 'lucide-react';

export const AboutPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-12 sm:space-y-16 animate-in fade-in duration-200 font-body">
      
      {/* 1. Header Banner */}
      <section className="bg-gradient-to-b from-teal-50 via-slate-50 to-white p-8 sm:p-12 rounded-3xl border border-teal-100 shadow-xs space-y-4 text-center sm:text-left">
        <span className="text-xs font-semibold uppercase tracking-wider text-teal-700">
          PROBLEM STATEMENT 13 · HEALTHCARE SOLUTION ARCHITECTURE
        </span>
        <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-tight">
          How SwasthyaNet Works
        </h1>
        <p className="text-base sm:text-lg text-slate-700 leading-relaxed max-w-3xl font-body">
          Traditional health checkers are isolated dead ends. SwasthyaNet transforms individual screenings into anonymous community intelligence, alerting public clinics to surges before outbreaks overwhelm rural infrastructure.
        </p>
      </section>

      {/* 2. End-to-End Pipeline (4 Steps with Designated Images) */}
      <section className="space-y-6">
        <div className="space-y-1">
          <span className="text-xs font-semibold uppercase tracking-wider text-teal-700">
            THE 4-STAGE PIPELINE
          </span>
          <h2 className="font-heading text-2xl sm:text-3xl font-black text-slate-900">
            From Individual Intake to District Early-Warning
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Step 1 */}
          <div className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200 shadow-xs space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="w-8 h-8 rounded-full bg-[#0F9D8B] text-white font-heading font-bold text-sm flex items-center justify-center">
                  1
                </span>
                <img 
                  src="/images/clipboard-pulse.jpeg" 
                  alt="Symptom collection intake illustration" 
                  className="w-12 h-12 rounded-xl object-cover border border-slate-200 shadow-2xs"
                  loading="lazy"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
              </div>
              <h3 className="font-heading text-lg font-extrabold text-slate-900">
                1. Multi-Channel Symptom Collection
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-body">
                Signs and complaints are gathered via citizen smartphones, ASHA worker tablets, or village kiosks in simple everyday language. No identity or phone numbers are requested.
              </p>
            </div>
            <div className="text-[11px] font-semibold text-teal-700 pt-2 border-t border-slate-100 font-body">
              Zero-Barrier Intake · Anonymous
            </div>
          </div>

          {/* Step 2 */}
          <div className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200 shadow-xs space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="w-8 h-8 rounded-full bg-[#0F9D8B] text-white font-heading font-bold text-sm flex items-center justify-center">
                  2
                </span>
                <img 
                  src="/images/speedometer-dial.jpeg" 
                  alt="Explainable risk tiering and confidence meter" 
                  className="w-12 h-12 rounded-xl object-cover border border-slate-200 shadow-2xs"
                  loading="lazy"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
              </div>
              <h3 className="font-heading text-lg font-extrabold text-slate-900">
                2. Explainable Clinical Risk Tiering
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-body">
                Deterministic rules check for red-flag emergencies (chest pain, severe breathlessness) first. Remaining inputs are tiered (Green, Yellow, Orange, Red) with top-3 differential categories.
              </p>
            </div>
            <div className="text-[11px] font-semibold text-teal-700 pt-2 border-t border-slate-100 font-body">
              Deterministic Overrides · Zero Black-Box
            </div>
          </div>

          {/* Step 3 */}
          <div className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200 shadow-xs space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="w-8 h-8 rounded-full bg-[#0F9D8B] text-white font-heading font-bold text-sm flex items-center justify-center">
                  3
                </span>
                <img 
                  src="/images/location-hospital.jpeg" 
                  alt="Facility location pin and suitability matching" 
                  className="w-12 h-12 rounded-xl object-cover border border-slate-200 shadow-2xs"
                  loading="lazy"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
              </div>
              <h3 className="font-heading text-lg font-extrabold text-slate-900">
                3. Suitability Facility Recommendation
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-body">
                Instead of simply routing every patient to the nearest building, the engine matches clinical need to facility capability (HWC for vitals, PHC for labs/delivery, CHC for specialists, District Hospital for trauma).
              </p>
            </div>
            <div className="text-[11px] font-semibold text-teal-700 pt-2 border-t border-slate-100 font-body">
              Right Patient to Right Level of Care
            </div>
          </div>

          {/* Step 4 */}
          <div className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200 shadow-xs space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="w-8 h-8 rounded-full bg-[#0F9D8B] text-white font-heading font-bold text-sm flex items-center justify-center">
                  4
                </span>
                <img 
                  src="/images/signal-waves.jpeg" 
                  alt="Signal waves aggregating into community health pressure" 
                  className="w-12 h-12 rounded-xl object-cover border border-slate-200 shadow-2xs"
                  loading="lazy"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
              </div>
              <h3 className="font-heading text-lg font-extrabold text-slate-900">
                4. Anonymous Community Health Pressure
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-body">
                The core innovation. Individual symptoms are stripped of all metadata and rolled up into spatial Health Pressure signals. When similar high-risk clusters rise, health centers receive advance early warning.
              </p>
            </div>
            <div className="text-[11px] font-semibold text-teal-700 pt-2 border-t border-slate-100 font-body">
              Proactive Health Intelligence
            </div>
          </div>

        </div>
      </section>

      {/* 3. Privacy-by-Design Architecture */}
      <section className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-6">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-teal-700" />
          <h2 className="font-heading text-xl sm:text-2xl font-black text-slate-900">
            Privacy-by-Design Architecture
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-center">
          
          <div className="sm:col-span-8 space-y-3 text-xs sm:text-sm text-slate-700 font-body">
            <p className="leading-relaxed">
              SwasthyaNet is engineered with strict cryptographic isolation between user input and epidemiological telemetry:
            </p>
            <ul className="space-y-2">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span><strong>Zero Personal Identifiers:</strong> No names, phone numbers, Aadhaar, or emails are ever collected.</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span><strong>No Cookies or User Tracking:</strong> Each submission generates an ephemeral one-way hash token.</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span><strong>Coarse Habitation Level Only:</strong> Signals are aggregated only at the village level, preventing individual re-identification.</span>
              </li>
            </ul>
          </div>

          <div className="sm:col-span-4 flex justify-center">
            <div className="w-32 h-32 rounded-3xl bg-slate-900 border border-slate-700 p-2 shadow-lg overflow-hidden flex items-center justify-center">
              <img 
                src="/images/shield-padlock.jpeg" 
                alt="Zero personal data privacy shield and padlock" 
                className="w-full h-full object-cover rounded-2xl"
                loading="lazy"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
            </div>
          </div>

        </div>
      </section>

      {/* 4. Hackathon Roadmap: Phase 2 Voice & Offline */}
      <section className="bg-gradient-to-br from-slate-900 to-[#0B1220] text-white p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-xl space-y-6">
        <div className="space-y-1">
          <span className="text-xs font-semibold uppercase tracking-wider text-teal-400">
            FUTURE ROADMAP & FEASIBILITY
          </span>
          <h2 className="font-heading text-2xl sm:text-3xl font-black text-white">
            Phase 2: Voice-Based Screening for Feature Phones (IVR)
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-center">
          
          <div className="sm:col-span-7 space-y-3 text-xs sm:text-sm text-slate-300 leading-relaxed font-body">
            <p>
              In rural regions where smartphones are not available, Phase 2 connects toll-free Interactive Voice Response (IVR) in local dialects (Bhojpuri, Hindi, Awadhi).
            </p>
            <p>
              Citizens call a toll-free number, speak their symptoms naturally, and receive spoken audio advice while their anonymous signal is automatically added to their village's telemetry.
            </p>
            <div className="flex flex-wrap gap-2 pt-2 text-xs">
              <span className="bg-slate-800 border border-slate-700 px-3 py-1 rounded-lg text-teal-300 font-semibold">
                ✓ Local Dialect ASR
              </span>
              <span className="bg-slate-800 border border-slate-700 px-3 py-1 rounded-lg text-teal-300 font-semibold">
                ✓ 2G GSM Voice Compatibility
              </span>
              <span className="bg-slate-800 border border-slate-700 px-3 py-1 rounded-lg text-teal-300 font-semibold">
                ✓ Zero Data Connection Needed
              </span>
            </div>
          </div>

          <div className="sm:col-span-5">
            <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-slate-800 border border-slate-700 shadow-lg">
              <img 
                src="/images/voice-feature-phone.jpeg" 
                alt="Voice-based interactive screening for basic feature phones in rural areas" 
                className="w-full h-full object-cover"
                loading="lazy"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
            </div>
          </div>

        </div>
      </section>

    </div>
  );
};
