import React, { useState } from 'react';
import { FacilityList } from '../components/facility/FacilityList';
import { FacilityMap } from '../components/facility/FacilityMap';
import { Building2, Map, List, Compass, PhoneCall } from 'lucide-react';

export const FacilityDirectoryPage: React.FC = () => {
  const [viewMode, setViewMode] = useState<'list' | 'map' | 'split'>('split');

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-150 py-2 sm:py-4">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-teal-700 bg-teal-50 border border-teal-200 px-2.5 py-0.5 rounded-full">
              Pillar 2 · Facility Guidance
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-1">
            Rural Healthcare Facility Directory
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl">
            Ranked deterministically by: (1) Care-Level Match, (2) Travel Time / Distance, (3) Diagnostic Services, and (4) Current Load.
          </p>
        </div>

        {/* View Switcher on Desktop / Mobile */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200 self-start sm:self-auto text-xs font-bold">
          <button
            type="button"
            onClick={() => setViewMode('split')}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              viewMode === 'split' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Combined View
          </button>
          <button
            type="button"
            onClick={() => setViewMode('list')}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              viewMode === 'list' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Ranked List
          </button>
          <button
            type="button"
            onClick={() => setViewMode('map')}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              viewMode === 'map' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Catchment Map
          </button>
        </div>
      </div>

      {/* Main Content Areas */}
      {viewMode === 'split' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-7">
            <FacilityList />
          </div>
          <div className="lg:col-span-5 space-y-6">
            <FacilityMap />
          </div>
        </div>
      )}

      {viewMode === 'list' && (
        <div className="max-w-4xl mx-auto">
          <FacilityList />
        </div>
      )}

      {viewMode === 'map' && (
        <div className="max-w-5xl mx-auto">
          <FacilityMap />
        </div>
      )}

    </div>
  );
};
