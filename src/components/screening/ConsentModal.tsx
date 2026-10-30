import React from 'react';
import { ShieldCheck, MapPin, CheckCircle2, Lock } from 'lucide-react';

interface ConsentModalProps {
  isOpen: boolean;
  onAccept: () => void;
  onDecline: () => void;
  villageName?: string;
}

export const ConsentModal: React.FC<ConsentModalProps> = ({
  isOpen,
  onAccept,
  onDecline,
  villageName = 'Rampur'
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs animate-in fade-in duration-150">
      <div 
        role="dialog" 
        aria-modal="true" 
        aria-labelledby="consent-title"
        className="bg-white rounded-2xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-slate-200 space-y-5"
      >
        {/* Header Icon */}
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-700 shrink-0">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-teal-700">
              Privacy by Default
            </span>
            <h2 id="consent-title" className="text-lg sm:text-xl font-extrabold text-slate-900 leading-tight">
              Community Health Signal Consent
            </h2>
          </div>
        </div>

        {/* Body Text */}
        <div className="space-y-3 text-sm text-slate-600 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-200">
          <div className="flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
            <p>
              <strong className="text-slate-900 font-semibold">Zero Identity Data:</strong> We will never ask for your name, mobile number, or Aadhaar.
            </p>
          </div>
          
          <div className="flex items-start gap-2.5">
            <MapPin className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
            <p>
              <strong className="text-slate-900 font-semibold">Village-Level Signal Only:</strong> Your general area (<span className="font-semibold text-slate-900">{villageName}</span>) is used only to alert local clinics if similar symptoms are rising.
            </p>
          </div>

          <div className="flex items-start gap-2.5">
            <Lock className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
            <p>
              <strong className="text-slate-900 font-semibold">Immediate Anonymization:</strong> Once submitted, your screening converts into a non-traceable statistical count.
            </p>
          </div>
        </div>

        <p className="text-xs text-slate-500">
          By proceeding, you agree to submit anonymized symptom metrics to help protect your village community.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <button
            type="button"
            onClick={onAccept}
            className="flex-1 bg-teal-600 hover:bg-teal-700 text-white font-bold py-3 px-4 rounded-xl transition-all shadow-sm active:scale-98 cursor-pointer focus:ring-2 focus:ring-teal-500 focus:outline-none"
          >
            I Agree — Continue Privately
          </button>
          
          <button
            type="button"
            onClick={onDecline}
            className="sm:w-auto px-4 py-3 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100 font-semibold transition-all cursor-pointer"
          >
            Cancel
          </button>
        </div>

      </div>
    </div>
  );
};
