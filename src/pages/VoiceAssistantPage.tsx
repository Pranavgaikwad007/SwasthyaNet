import React from 'react';
import { useAppState } from '../context/AppStateContext';
import { HealthVoiceAssistant } from '../components/voice/HealthVoiceAssistant';
import { 
  ArrowLeft, 
  Stethoscope, 
  ShieldAlert, 
  Radio, 
  Building2, 
  HelpCircle,
  PhoneCall,
  User,
  UserCheck
} from 'lucide-react';

export const VoiceAssistantPage: React.FC = () => {
  const { setCurrentPage, selectedVillage } = useAppState();

  return (
    <div className="space-y-8 animate-in fade-in duration-200 font-body">
      
      {/* Top Breadcrumbs & Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div className="space-y-1">
          <button
            type="button"
            onClick={() => {
              setCurrentPage('home');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="text-xs font-bold text-teal-700 hover:text-teal-900 flex items-center gap-1.5 cursor-pointer mb-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Home</span>
          </button>

          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-700">
              <Stethoscope className="w-5 h-5" />
            </div>
            <div>
              <h1 className="font-heading text-2xl sm:text-3xl font-black text-slate-900">
                Rural Health Voice Assistant
              </h1>
              <p className="text-xs sm:text-sm text-slate-600">
                Conversational symptom intake, rural language support, and clinical safety guidance for {selectedVillage}.
              </p>
            </div>
          </div>
        </div>

        {/* Emergency Shortcut Badge */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <a
            href="tel:108"
            className="flex items-center gap-1.5 bg-red-600 hover:bg-red-700 text-white font-bold text-xs px-3.5 py-2 rounded-xl shadow-xs transition-colors"
          >
            <PhoneCall className="w-3.5 h-3.5 fill-current animate-bounce" />
            <span>Emergency Ambulance (108)</span>
          </a>
        </div>
      </div>

      {/* Main Health Voice Assistant Component */}
      <HealthVoiceAssistant />

      {/* Auxiliary Help & Alternative Channels Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
        
        {/* Channel 1 Card */}
        <div 
          onClick={() => {
            setCurrentPage('screening_citizen');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-teal-400 shadow-xs hover:shadow-md transition-all cursor-pointer group text-left"
        >
          <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center mb-3">
            <User className="w-4 h-4" />
          </div>
          <h3 className="font-heading font-extrabold text-sm text-slate-900 group-hover:text-teal-700">
            Form-Based Self Check &rarr;
          </h3>
          <p className="text-xs text-slate-600 mt-1">
            Prefer a structured step-by-step checklist? Try our guided screening wizard.
          </p>
        </div>

        {/* Channel 2 Card */}
        <div 
          onClick={() => {
            setCurrentPage('screening_worker');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-amber-400 shadow-xs hover:shadow-md transition-all cursor-pointer group text-left"
        >
          <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center mb-3">
            <UserCheck className="w-4 h-4" />
          </div>
          <h3 className="font-heading font-extrabold text-sm text-slate-900 group-hover:text-amber-700">
            ASHA Worker Assisted Mode &rarr;
          </h3>
          <p className="text-xs text-slate-600 mt-1">
            Screening on behalf of an elderly citizen or non-smartphone user.
          </p>
        </div>

        {/* Channel 3 Card */}
        <div 
          onClick={() => {
            setCurrentPage('facilities');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-blue-400 shadow-xs hover:shadow-md transition-all cursor-pointer group text-left"
        >
          <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center mb-3">
            <Building2 className="w-4 h-4" />
          </div>
          <h3 className="font-heading font-extrabold text-sm text-slate-900 group-hover:text-blue-700">
            Facility & Clinic Directory &rarr;
          </h3>
          <p className="text-xs text-slate-600 mt-1">
            Find nearby Health & Wellness Centres, PHCs, CHCs, and ambulances.
          </p>
        </div>

      </div>

    </div>
  );
};
