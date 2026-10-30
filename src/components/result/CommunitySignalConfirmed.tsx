import React from 'react';
import { useAppState } from '../../context/AppStateContext';
import { 
  Radio, 
  ShieldCheck, 
  ArrowUpRight, 
  TrendingUp, 
  Building2, 
  CheckCircle2,
  Lock
} from 'lucide-react';

interface CommunitySignalConfirmedProps {
  village: string;
  category: string;
  riskTier: string;
  anonymizedHash: string;
}

export const CommunitySignalConfirmed: React.FC<CommunitySignalConfirmedProps> = ({
  village,
  category,
  riskTier,
  anonymizedHash
}) => {
  const { setCurrentPage, setSelectedVillage } = useAppState();

  const handleGoToDashboard = () => {
    setSelectedVillage(village);
    setCurrentPage('dashboard');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <aside 
      aria-label="Community Health Signal Contribution Confirmation"
      className="bg-gradient-to-r from-teal-900 via-slate-900 to-cyan-950 text-white p-5 sm:p-7 rounded-3xl shadow-lg border border-teal-500/30 relative overflow-hidden"
    >
      {/* Decorative Radar Pulse Ring */}
      <div className="absolute -right-12 -bottom-12 w-48 h-48 rounded-full bg-teal-500/10 pointer-events-none blur-xl animate-pulse" />

      <div className="relative z-10 space-y-4">
        
        {/* Badge & Title */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/20 border border-teal-400/40 text-teal-300 text-xs font-mono font-bold">
            <span className="w-2 h-2 rounded-full bg-teal-400 animate-live-pulse" />
            <span>Pillar 3: Community Early-Warning Active</span>
          </div>

          <span className="text-[11px] font-mono text-slate-400">
            Hash: <span className="text-teal-300">{anonymizedHash}</span>
          </span>
        </div>

        {/* Verbatim Core Requirement Copy */}
        <div>
          <h3 className="text-lg sm:text-xl font-black text-white leading-snug">
            Added to your community's health signal — anonymously.
          </h3>
          <p className="text-sm text-slate-300 mt-1 leading-relaxed">
            Thank you. Your result has been added anonymously to your community's health signal — this helps your local facility prepare in advance.
          </p>
        </div>

        {/* Signal Conversion Snapshot */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
          
          <div className="bg-white/10 backdrop-blur-xs p-3 rounded-xl border border-white/10">
            <span className="block text-[10px] font-mono font-semibold uppercase text-slate-400">
              Village Aggregation
            </span>
            <span className="font-bold text-sm text-white flex items-center gap-1.5 mt-0.5">
              <span>{village} Cluster</span>
            </span>
          </div>

          <div className="bg-white/10 backdrop-blur-xs p-3 rounded-xl border border-white/10">
            <span className="block text-[10px] font-mono font-semibold uppercase text-slate-400">
              Aggregated Category
            </span>
            <span className="font-bold text-sm text-teal-200 truncate block mt-0.5">
              {category}
            </span>
          </div>

          <div className="bg-white/10 backdrop-blur-xs p-3 rounded-xl border border-white/10">
            <span className="block text-[10px] font-mono font-semibold uppercase text-slate-400">
              Signal Triage Tier
            </span>
            <span className="font-bold text-sm text-white flex items-center gap-1.5 mt-0.5">
              <span className={`w-2.5 h-2.5 rounded-full ${
                riskTier === 'GREEN' ? 'bg-emerald-400' :
                riskTier === 'YELLOW' ? 'bg-amber-400' :
                riskTier === 'ORANGE' ? 'bg-orange-400' : 'bg-red-500'
              }`} />
              <span>{riskTier} Tier</span>
            </span>
          </div>

        </div>

        {/* Call to Action: Bridge to Facility Dashboard */}
        <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-white/10">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <Lock className="w-3.5 h-3.5 text-teal-400 shrink-0" />
            <span>Zero personal identity data retained. Pure statistical telemetry.</span>
          </div>

          <button
            onClick={handleGoToDashboard}
            className="inline-flex items-center justify-center gap-2 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold px-4 py-2.5 rounded-xl text-xs sm:text-sm transition-all active:scale-95 cursor-pointer shrink-0"
          >
            <span>View {village}'s Health Pressure Radar</span>
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </aside>
  );
};
