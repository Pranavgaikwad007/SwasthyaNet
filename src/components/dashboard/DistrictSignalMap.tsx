import React from 'react';
import { useAppState } from '../../context/AppStateContext';
import { 
  Building, 
  TrendingUp, 
  TrendingDown, 
  Minus, 
  AlertTriangle, 
  CheckCircle2, 
  Users, 
  MapPin, 
  ArrowRight,
  ShieldAlert
} from 'lucide-react';

export const DistrictSignalMap: React.FC = () => {
  const { currentDayState, selectedVillage, setSelectedVillage, villages } = useAppState();

  return (
    <div className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200 shadow-xs space-y-5">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
        <div>
          <h3 className="text-base font-extrabold text-slate-900">
            Sitapur District Village Surveillance Matrix
          </h3>
          <p className="text-xs text-slate-500">
            Real-time Health Pressure scores across all monitored sub-centres and village catchments.
          </p>
        </div>
        
        <span className="text-xs font-mono font-bold px-2.5 py-1 rounded bg-teal-50 text-teal-800 border border-teal-200 self-start sm:self-auto">
          {currentDayState.signals.filter(s => s.activeAlert).length} Active Village Alert(s)
        </span>
      </div>

      {/* Village Surveillance Cards / Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-slate-200 text-slate-500 font-mono uppercase text-[10px]">
              <th className="pb-3 font-bold">Village / Area</th>
              <th className="pb-3 font-bold">Health Pressure</th>
              <th className="pb-3 font-bold">Today vs Baseline</th>
              <th className="pb-3 font-bold">Dominant Symptom Cluster</th>
              <th className="pb-3 font-bold">Early Warning Status</th>
              <th className="pb-3 font-bold text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {currentDayState.signals.map((sig) => {
              const vProfile = villages.find(v => v.name === sig.village);
              const isSelected = selectedVillage === sig.village;
              
              const badgeClass = sig.pressureScore >= 75
                ? 'bg-red-50 text-red-700 border-red-200'
                : sig.pressureScore >= 50
                ? 'bg-orange-50 text-orange-700 border-orange-200'
                : sig.pressureScore >= 30
                ? 'bg-amber-50 text-amber-700 border-amber-200'
                : 'bg-emerald-50 text-emerald-700 border-emerald-200';

              return (
                <tr 
                  key={sig.village}
                  className={`hover:bg-slate-50 transition-colors ${
                    isSelected ? 'bg-teal-50/60 font-semibold' : ''
                  }`}
                >
                  {/* Village Name & Pop */}
                  <td className="py-3.5 pr-3">
                    <div className="font-bold text-slate-900 text-sm">{sig.village}</div>
                    <div className="text-[11px] text-slate-500">Pop: ~{vProfile?.population.toLocaleString()}</div>
                  </td>

                  {/* Pressure Score */}
                  <td className="py-3.5 px-3">
                    <div className="flex items-center gap-2">
                      <span className={`font-mono font-black text-sm px-2 py-0.5 rounded border ${badgeClass}`}>
                        {sig.pressureScore}/100
                      </span>
                      <span className="text-[11px] font-mono text-slate-500">
                        {sig.trend === 'up' && <span className="text-red-600 font-bold">▲ Up</span>}
                        {sig.trend === 'down' && <span className="text-emerald-600 font-bold">▼ Down</span>}
                        {sig.trend === 'flat' && <span className="text-slate-400">— Flat</span>}
                      </span>
                    </div>
                  </td>

                  {/* Cases */}
                  <td className="py-3.5 px-3 font-mono">
                    <span className="font-bold text-slate-900">{sig.caseCount} cases</span>
                    <span className="text-slate-400 block text-[10px]">Base: ~{sig.baselineCases}/day</span>
                  </td>

                  {/* Dominant Category */}
                  <td className="py-3.5 px-3">
                    <span className="font-medium text-slate-800">{sig.dominantCategory}</span>
                    <span className="block text-[10px] text-slate-500">
                      {sig.highRiskPercentage}% high risk
                    </span>
                  </td>

                  {/* Status Badge */}
                  <td className="py-3.5 px-3">
                    {sig.activeAlert ? (
                      <span className="inline-flex items-center gap-1 bg-red-600 text-white text-[10px] font-bold font-mono px-2 py-0.5 rounded-full animate-pulse">
                        <AlertTriangle className="w-3 h-3" />
                        Surge Warning
                      </span>
                    ) : sig.pressureScore >= 40 ? (
                      <span className="inline-flex items-center gap-1 bg-amber-100 text-amber-800 text-[10px] font-bold font-mono px-2 py-0.5 rounded-full">
                        Elevated
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-800 text-[10px] font-bold font-mono px-2 py-0.5 rounded-full">
                        Normal
                      </span>
                    )}
                  </td>

                  {/* Inspect Button */}
                  <td className="py-3.5 pl-3 text-right">
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedVillage(sig.village);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="inline-flex items-center gap-1 text-teal-700 hover:text-teal-900 font-bold text-xs cursor-pointer"
                    >
                      <span>Focus</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

    </div>
  );
};
