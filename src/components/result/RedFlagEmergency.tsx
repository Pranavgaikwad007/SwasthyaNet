import React from 'react';
import { 
  PhoneCall, 
  ShieldAlert, 
  MapPin, 
  Building2, 
  Radio, 
  AlertTriangle,
  ArrowRight,
  ExternalLink,
  ArrowLeft
} from 'lucide-react';
import { useAppState } from '../../context/AppStateContext';

interface RedFlagEmergencyProps {
  reason?: string;
  villageName: string;
  anonHash: string;
  onBackToScreening?: () => void;
}

export const RedFlagEmergency: React.FC<RedFlagEmergencyProps> = ({
  reason,
  villageName,
  anonHash,
  onBackToScreening
}) => {
  const { setCurrentPage, facilities } = useAppState();

  // Pick nearest emergency capable hospital (CHC or District Hospital)
  const emergencyFacility = facilities.find(f => f.isEmergencyCenter) || facilities[facilities.length - 1];

  return (
    <div className="max-w-4xl mx-auto space-y-6 sm:space-y-8 animate-in zoom-in-95 duration-200 font-body">
      
      {/* Back Button */}
      {onBackToScreening && (
        <div>
          <button
            type="button"
            onClick={onBackToScreening}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs sm:text-sm font-bold shadow-2xs transition-all active:scale-95 cursor-pointer font-body group"
          >
            <ArrowLeft className="w-4 h-4 text-slate-500 group-hover:-translate-x-1 transition-transform" />
            <span>Edit Symptoms / Back to Screening</span>
          </button>
        </div>
      )}

      {/* Main Red-Flag Emergency Hero Card */}
      <section className="bg-red-600 text-white rounded-3xl p-6 sm:p-10 shadow-2xl border-4 border-red-700 space-y-6 relative overflow-hidden">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-red-500/80">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white text-red-600 flex items-center justify-center font-black shadow-lg shrink-0">
              <ShieldAlert className="w-7 h-7 animate-bounce" />
            </div>
            <div>
              <span className="text-xs font-mono font-bold uppercase tracking-widest text-red-200">
                CRITICAL SAFETY OVERRIDE · RED TIER
              </span>
              <h1 className="font-heading text-2xl sm:text-3xl font-black text-white tracking-tight">
                Immediate Emergency Care Required
              </h1>
            </div>
          </div>

          <div className="text-left sm:text-right">
            <span className="text-xs font-mono text-red-200 block">Signal: {anonHash}</span>
            <span className="text-xs text-red-100 font-medium">Logged for {villageName}</span>
          </div>
        </div>

        {/* Reason */}
        <div className="p-4 rounded-2xl bg-red-700/60 border border-red-500 space-y-1">
          <span className="text-xs font-bold uppercase tracking-wider text-red-200">Clinical Reason:</span>
          <p className="text-sm font-semibold text-white leading-relaxed">
            {reason || 'Severe red-flag clinical symptoms detected requiring immediate hospital stabilization.'}
          </p>
        </div>

        {/* PRIMARY ACTION: CALL 108 EMERGENCY IMMEDIATELY */}
        <div className="p-6 rounded-2xl bg-white text-slate-900 shadow-xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-xs font-mono font-extrabold uppercase px-2.5 py-0.5 rounded bg-red-100 text-red-800">
                Step 1: Emergency Dispatch
              </span>
              <h2 className="font-heading text-xl sm:text-2xl font-black text-slate-900">
                Call 108 Free Ambulance Service
              </h2>
              <p className="text-xs sm:text-sm text-slate-600">
                Toll-free 24x7 Government emergency medical helpline with GPS ambulance dispatch.
              </p>
            </div>

            <a
              href="tel:108"
              className="inline-flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 active:scale-95 text-white font-black text-lg px-8 py-4 rounded-2xl shadow-lg shadow-red-600/30 transition-all cursor-pointer whitespace-nowrap"
            >
              <PhoneCall className="w-6 h-6 animate-bounce" />
              <span>Call 108 Now</span>
            </a>
          </div>

          <div className="pt-3 border-t border-slate-200 text-xs text-slate-600 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
            <span>Alternative National Health Helpline for immediate doctor guidance: <strong>104</strong></span>
          </div>
        </div>

        {/* Nearest Referral Hospital Routing */}
        {emergencyFacility && (
          <div className="p-5 rounded-2xl bg-red-950/60 border border-red-400/40 text-white space-y-3">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-red-300">
              Step 2: Designated First Referral Trauma Hospital
            </span>
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="font-heading text-lg font-bold text-white">{emergencyFacility.name}</h3>
                <p className="text-xs text-red-200">{emergencyFacility.address}</p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <a
                  href={`https://www.google.com/maps/dir/?api=1&destination=${emergencyFacility.lat},${emergencyFacility.lng}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white hover:bg-slate-100 text-red-900 font-bold text-xs px-4 py-2.5 rounded-xl transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
                >
                  <span>Google Directions (~{emergencyFacility.travelTimeMin}m)</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>

                <a
                  href={`tel:${emergencyFacility.phone}`}
                  className="bg-red-800 hover:bg-red-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition-all shadow-md flex items-center gap-1.5"
                >
                  <PhoneCall className="w-3.5 h-3.5" />
                  <span>Call Hospital</span>
                </a>
              </div>
            </div>
          </div>
        )}

      </section>

      {/* Immediate Community Signal Recorded Card */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-3">
        <div className="flex items-center gap-2 text-[#0F9D8B] font-bold text-xs sm:text-sm">
          <Radio className="w-4 h-4 animate-pulse" />
          <span>Epidemiological Signal Dispatched</span>
        </div>
        <p className="text-xs text-slate-600 leading-relaxed font-body">
          This emergency screening has been anonymously aggregated into the Health Pressure telemetry for <strong>{villageName}</strong>. If multiple emergency or high-risk cases converge in this catchment, local PHCs and CHCs receive automated capacity alerts.
        </p>
      </div>

    </div>
  );
};
