import React from 'react';
import { useAppState } from '../../context/AppStateContext';
import { 
  Radio, 
  TrendingUp, 
  TrendingDown, 
  Minus, 
  AlertTriangle, 
  Users, 
  ShieldAlert, 
  Activity, 
  MapPin,
  Calendar,
  CheckCircle2
} from 'lucide-react';

export const HealthPressureEpicenter: React.FC = () => {
  const { 
    currentDayState, 
    selectedVillage, 
    setSelectedVillage, 
    villages 
  } = useAppState();

  // Find signal for selected village
  const activeSignal = currentDayState.signals.find(s => s.village === selectedVillage) || currentDayState.signals[0];

  // Helper for trend badge
  const renderTrend = (trend: 'up' | 'down' | 'flat') => {
    switch (trend) {
      case 'up':
        return (
          <span className="inline-flex items-center gap-1 text-xs font-mono font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded border border-red-200">
            <TrendingUp className="w-3.5 h-3.5" /> +Surge
          </span>
        );
      case 'down':
        return (
          <span className="inline-flex items-center gap-1 text-xs font-mono font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
            <TrendingDown className="w-3.5 h-3.5" /> -Resolving
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 text-xs font-mono font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
            <Minus className="w-3.5 h-3.5" /> Stable Baseline
          </span>
        );
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 sm:p-8 space-y-6 font-body">
      
      {/* 1. Epicenter Header & Village Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#0F9D8B] animate-live-pulse" />
            <span className="text-xs font-mono font-bold text-teal-700 uppercase tracking-widest">
              TELEMETRY EPISODE FOCUS
            </span>
          </div>
          <h2 className="font-heading text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Village Health Pressure Telemetry
          </h2>
        </div>

        {/* Village Dropdown */}
        <div className="flex items-center gap-2">
          <label htmlFor="epicenter-village-select" className="text-xs font-bold text-slate-500 font-body">
            Focus:
          </label>
          <select
            id="epicenter-village-select"
            value={selectedVillage}
            onChange={(e) => setSelectedVillage(e.target.value)}
            className="bg-slate-50 border border-slate-300 font-heading font-extrabold text-sm text-slate-900 rounded-xl px-3 py-2 focus:ring-2 focus:ring-teal-500 focus:outline-none cursor-pointer"
          >
            {villages.map(v => (
              <option key={v.name} value={v.name}>{v.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* 2. AUTOMATED EARLY WARNING ALERT BANNER (With Contextual Warning Icon) */}
      {activeSignal.activeAlert ? (
        <div className="p-5 sm:p-6 rounded-2xl bg-red-50 border-2 border-red-500 shadow-sm space-y-3 animate-in fade-in duration-200">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div className="flex items-start gap-3.5">
              
              {/* Contextual High-Res Warning Illustration */}
              <div className="w-12 h-12 rounded-xl overflow-hidden border border-red-300 shrink-0 bg-white shadow-2xs">
                <img 
                  src="/images/warning-triangle.jpeg" 
                  alt="Automated early warning health pressure alert icon" 
                  className="w-full h-full object-cover"
                  loading="eager"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
              </div>

              <div className="space-y-1">
                <span className="text-[11px] font-mono font-extrabold px-2 py-0.5 rounded bg-red-600 text-white uppercase tracking-wider">
                  AUTOMATED EARLY WARNING SIGNAL
                </span>
                <h3 className="font-heading text-lg font-black text-red-950 mt-1">
                  Surge in {activeSignal.dominantCategory} Detected in {activeSignal.village}
                </h3>
                <p className="text-xs sm:text-sm text-red-900 leading-relaxed font-body">
                  {activeSignal.alertMessage}
                </p>
              </div>
            </div>

            <div className="shrink-0 text-left sm:text-right bg-white p-3 rounded-xl border border-red-200">
              <span className="text-[10px] font-mono uppercase text-slate-500 block">Surge Ratio</span>
              <span className="font-heading text-lg font-black text-red-600 font-mono">
                {activeSignal.baselineCases > 0 ? (activeSignal.caseCount / activeSignal.baselineCases).toFixed(1) : 1}x Baseline
              </span>
            </div>
          </div>

          <div className="pt-2 border-t border-red-200/80 flex flex-wrap items-center gap-3 text-xs text-red-900 font-semibold font-body">
            <span>• Action for PHC Medical Officer: Prepare rapid testing kits & fever triage ward.</span>
            <span>• ASHA Outreach: Active door-to-door temperature surveillance initiated.</span>
          </div>
        </div>
      ) : (
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-3 text-xs text-slate-600 font-body">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Health pressure in <strong>{activeSignal.village}</strong> is currently within expected baseline limits.</span>
          </div>
          <span className="font-mono text-slate-500">{activeSignal.caseCount} cases / day baseline</span>
        </div>
      )}

      {/* 3. Three Live KPI Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        
        {/* KPI 1: Health Pressure Score */}
        <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500 font-body">
            <span>Health Pressure Score</span>
            {renderTrend(activeSignal.trend)}
          </div>
          
          <div className="flex items-baseline gap-2">
            <span className="font-heading text-3xl sm:text-4xl font-black text-slate-900 font-mono">
              {activeSignal.pressureScore}
            </span>
            <span className="text-xs font-mono text-slate-500">/ 100</span>
          </div>

          <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
            <div 
              className={`h-full rounded-full transition-all duration-500 ${
                activeSignal.pressureScore >= 70 ? 'bg-red-600' : activeSignal.pressureScore >= 40 ? 'bg-amber-500' : 'bg-[#0F9D8B]'
              }`}
              style={{ width: `${activeSignal.pressureScore}%` }}
            />
          </div>
        </div>

        {/* KPI 2: Cases Reported Today vs Baseline */}
        <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 font-body">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Reported Today</span>
            <span className="font-mono text-[11px] text-slate-400">Baseline: {activeSignal.baselineCases}/d</span>
          </div>
          
          <div className="flex items-baseline gap-2">
            <span className="font-heading text-3xl sm:text-4xl font-black text-slate-900 font-mono">
              {activeSignal.caseCount}
            </span>
            <span className="text-xs text-slate-500">cases</span>
          </div>

          <p className="text-xs text-slate-600">
            {activeSignal.caseCount > activeSignal.baselineCases 
              ? `${activeSignal.caseCount - activeSignal.baselineCases} cases above seasonal average`
              : 'Within expected seasonal threshold'}
          </p>
        </div>

        {/* KPI 3: Dominant Clinical Syndrome Cluster */}
        <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 font-body">
          <span className="text-xs text-slate-500 block">Dominant Clinical Cluster</span>
          
          <h4 className="font-heading text-lg font-extrabold text-slate-900 leading-snug">
            {activeSignal.dominantCategory}
          </h4>

          <div className="flex items-center gap-2 pt-1">
            <span className="text-xs font-mono font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
              {activeSignal.highRiskPercentage}% High Risk (Orange/Red)
            </span>
          </div>
        </div>

      </div>

      {/* 4. Syndrome Breakdown Progress Distribution */}
      {activeSignal.categoryBreakdown && (
        <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 font-body">
          <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
            Syndromic Cluster Distribution for {activeSignal.village} ({activeSignal.date}):
          </span>

          <div className="space-y-2">
            {Object.entries(activeSignal.categoryBreakdown).map(([catName, count]) => {
              const pct = activeSignal.caseCount > 0 ? Math.round(((count as number) / activeSignal.caseCount) * 100) : 0;
              return (
                <div key={catName} className="space-y-1">
                  <div className="flex justify-between text-xs font-medium text-slate-700">
                    <span>{catName}</span>
                    <span className="font-mono text-slate-500">{count as number} cases ({pct}%)</span>
                  </div>
                  <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                    <div 
                      className="bg-[#0F9D8B] h-full rounded-full" 
                      style={{ width: `${pct}%` }} 
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

    </div>
  );
};
