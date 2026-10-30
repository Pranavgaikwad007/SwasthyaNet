import React from 'react';
import { HealthPressureEpicenter } from '../components/dashboard/HealthPressureEpicenter';
import { TimeLapseControl } from '../components/dashboard/TimeLapseControl';
import { DistrictSignalMap } from '../components/dashboard/DistrictSignalMap';
import { LiveTriageQueue } from '../components/dashboard/LiveTriageQueue';
import { Radio, ShieldCheck, Activity, Users, Building2, BellRing } from 'lucide-react';

export const FacilityDashboardPage: React.FC = () => {
  return (
    <div className="space-y-8 animate-in fade-in duration-150 py-2 sm:py-4">
      
      {/* Dashboard Top Header */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-red-700 bg-red-50 border border-red-200 px-2.5 py-0.5 rounded-full flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-red-600 animate-live-pulse" />
              Pillar 3 · Early-Warning Radar
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-1">
            Facility Health Pressure & Early-Warning Console
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl">
            Surfaces emerging community symptom pressure before patients arrive at hospital gates.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-slate-700 bg-slate-50 p-2.5 rounded-xl border border-slate-200 self-start sm:self-auto">
          <ShieldCheck className="w-4 h-4 text-teal-600 shrink-0" />
          <span>Role: PHC Medical Officer / Health Supervisor</span>
        </div>
      </div>

      {/* 1. Time-Lapse Demo Replay Engine (Essential Demo Polish for Judges) */}
      <TimeLapseControl />

      {/* 2. Visual Centerpiece: Health Pressure Epicenter */}
      <HealthPressureEpicenter />

      {/* 3. District Matrix & Real-time Triage Queue */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-7">
          <DistrictSignalMap />
        </div>
        <div className="lg:col-span-5">
          <LiveTriageQueue />
        </div>
      </div>

    </div>
  );
};
