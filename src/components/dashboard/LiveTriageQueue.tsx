import React from 'react';
import { useAppState } from '../../context/AppStateContext';
import { 
  Users, 
  Activity, 
  Clock, 
  User, 
  HeartHandshake, 
  ShieldCheck, 
  AlertCircle,
  CheckCircle2,
  AlertTriangle,
  AlertOctagon
} from 'lucide-react';

export const LiveTriageQueue: React.FC = () => {
  const { allScreenings } = useAppState();

  // Calculate severity mix percentages
  const total = allScreenings.length || 1;
  const greenCount = allScreenings.filter(s => s.riskTier === 'GREEN').length;
  const yellowCount = allScreenings.filter(s => s.riskTier === 'YELLOW').length;
  const orangeCount = allScreenings.filter(s => s.riskTier === 'ORANGE').length;
  const redCount = allScreenings.filter(s => s.riskTier === 'RED').length;

  const greenPct = Math.round((greenCount / total) * 100);
  const yellowPct = Math.round((yellowCount / total) * 100);
  const orangePct = Math.round((orangeCount / total) * 100);
  const redPct = Math.round((redCount / total) * 100);

  const tierBadgeConfig = {
    GREEN: { bg: 'bg-emerald-50 text-emerald-700 border-emerald-200', icon: <CheckCircle2 className="w-3.5 h-3.5" /> },
    YELLOW: { bg: 'bg-amber-50 text-amber-700 border-amber-200', icon: <AlertTriangle className="w-3.5 h-3.5" /> },
    ORANGE: { bg: 'bg-orange-50 text-orange-700 border-orange-200', icon: <AlertCircle className="w-3.5 h-3.5" /> },
    RED: { bg: 'bg-red-50 text-red-700 border-red-200', icon: <AlertOctagon className="w-3.5 h-3.5" /> }
  };

  return (
    <div className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200 shadow-xs space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
        <div>
          <h3 className="text-base font-extrabold text-slate-900">
            Incoming Triage Stream & Severity Mix
          </h3>
          <p className="text-xs text-slate-500">
            Live chronological queue of anonymized screenings feeding the community health signal.
          </p>
        </div>
        <span className="text-xs font-mono font-bold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-full self-start sm:self-auto">
          {allScreenings.length} Screenings Logged
        </span>
      </div>

      {/* 1. Severity Mix Distribution Bar */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs font-mono">
          <span className="font-bold text-slate-700">Triage Severity Mix</span>
          <span className="text-slate-500">{total} Total Cases</span>
        </div>

        {/* Multi-segment Progress Bar */}
        <div className="h-3 w-full bg-slate-100 rounded-full flex overflow-hidden">
          <div style={{ width: `${greenPct}%` }} className="bg-emerald-500 h-full" title={`Green: ${greenPct}%`} />
          <div style={{ width: `${yellowPct}%` }} className="bg-amber-500 h-full" title={`Yellow: ${yellowPct}%`} />
          <div style={{ width: `${orangePct}%` }} className="bg-orange-500 h-full" title={`Orange: ${orangePct}%`} />
          <div style={{ width: `${redPct}%` }} className="bg-red-500 h-full" title={`Red: ${redPct}%`} />
        </div>

        {/* Severity Legend */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-[11px] font-mono font-semibold">
          <div className="flex items-center gap-1.5 text-emerald-800">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <span>Green (Self-care): {greenPct}%</span>
          </div>
          <div className="flex items-center gap-1.5 text-amber-800">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
            <span>Yellow (PHC): {yellowPct}%</span>
          </div>
          <div className="flex items-center gap-1.5 text-orange-800">
            <span className="w-2.5 h-2.5 rounded-full bg-orange-500" />
            <span>Orange (CHC): {orangePct}%</span>
          </div>
          <div className="flex items-center gap-1.5 text-red-800">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
            <span>Red (Emergency): {redPct}%</span>
          </div>
        </div>
      </div>

      {/* 2. Chronological Recent Queue */}
      <div className="space-y-2.5 max-h-80 overflow-y-auto pr-1">
        {allScreenings.map((sub) => {
          const cfg = tierBadgeConfig[sub.riskTier] || tierBadgeConfig.GREEN;
          const domCat = sub.diseaseCategories[0]?.category || 'General Symptom Assessment';
          const timeFormatted = new Date(sub.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

          return (
            <div 
              key={sub.id}
              className="p-3.5 bg-slate-50 hover:bg-slate-100/80 rounded-xl border border-slate-200 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full font-mono font-bold border text-[10px] ${cfg.bg}`}>
                    {cfg.icon}
                    <span>{sub.riskTier}</span>
                  </span>

                  <span className="font-bold text-slate-900">{sub.village}</span>

                  <span className="text-[10px] font-mono text-slate-600 bg-white border border-slate-200 px-1.5 py-0.2 rounded">
                    {sub.submittedBy === 'worker' ? 'ASHA Assisted' : 'Citizen Self'}
                  </span>
                </div>

                <p className="text-slate-700 font-medium truncate max-w-md">
                  {domCat} ({sub.durationDays}d duration)
                </p>
              </div>

              <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center text-[11px] text-slate-600 shrink-0 font-mono">
                <span>{timeFormatted}</span>
                <span className="text-[10px] text-teal-800">{sub.anonymizedHash}</span>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};
