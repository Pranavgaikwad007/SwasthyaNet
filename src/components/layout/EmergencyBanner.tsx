import React from 'react';
import { PhoneCall, AlertTriangle, ShieldAlert } from 'lucide-react';

export const EmergencyBanner: React.FC = () => {
  return (
    <aside aria-label="Emergency and medical safety disclaimer" className="bg-red-700 text-white px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm font-medium border-b border-red-800 shadow-inner">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2 sm:gap-4">
        <div className="flex items-center gap-2 min-w-0">
          <div className="p-1 bg-red-800/80 rounded shrink-0" aria-hidden="true">
            <AlertTriangle className="w-4 h-4 text-amber-300 animate-pulse" />
          </div>
          <p className="leading-tight text-red-50 text-[12px] sm:text-sm font-normal">
            <strong className="font-semibold text-white">Medical Disclaimer:</strong> SwasthyaNet does not replace a doctor. In an emergency, call 108 now.
          </p>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 shrink-0 ml-auto">
          <a
            href="tel:108"
            className="inline-flex items-center gap-1.5 bg-white text-red-700 hover:bg-red-50 active:scale-95 px-3 py-1 sm:py-1.5 rounded-full font-bold text-xs sm:text-sm shadow-sm transition-all cursor-pointer focus:ring-2 focus:ring-white focus:outline-none"
            aria-label="Call 108 Emergency Medical Helpline"
          >
            <PhoneCall className="w-3.5 h-3.5 fill-red-700 text-red-700 animate-bounce" />
            <span>Call 108 (Toll-Free)</span>
          </a>
          <span className="hidden md:inline text-red-200 text-xs border-l border-red-500/50 pl-2">
            24x7 Ambulance & Emergency
          </span>
        </div>
      </div>
    </aside>
  );
};
