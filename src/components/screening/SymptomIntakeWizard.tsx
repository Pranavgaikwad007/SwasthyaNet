import React, { useState, useEffect } from 'react';
import { useAppState } from '../../context/AppStateContext';
import { SYMPTOM_OPTIONS } from '../../data/mockData';
import { computeTriageResult, RED_FLAG_SYMPTOMS } from '../../data/clinicalRules';
import { UserChannel } from '../../types';
import { ConsentModal } from './ConsentModal';
import { 
  Search, 
  Check, 
  AlertCircle, 
  Sparkles, 
  Clock, 
  MapPin, 
  User, 
  HeartHandshake, 
  ShieldAlert, 
  ChevronRight,
  Filter
} from 'lucide-react';

interface SymptomIntakeWizardProps {
  channel: UserChannel;
}

export const SymptomIntakeWizard: React.FC<SymptomIntakeWizardProps> = ({ channel }) => {
  const { 
    addScreeningSubmission, 
    setCurrentPage, 
    villages, 
    selectedVillage, 
    setSelectedVillage,
    userLocationConsent,
    setUserLocationConsent,
    screeningDraft,
    updateDraftField
  } = useAppState();

  // Initialize state from preserved draft in context
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>(screeningDraft.selectedSymptoms || []);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [freeText, setFreeText] = useState(screeningDraft.freeText || '');
  const [durationDays, setDurationDays] = useState<number>(screeningDraft.durationDays || 2);
  const [ageGroup, setAgeGroup] = useState<string>(screeningDraft.ageGroup || 'adult_15_59');
  const [gender, setGender] = useState<string>(screeningDraft.gender || 'male');
  const [workerNotes, setWorkerNotes] = useState(screeningDraft.workerNotes || '');
  const [showConsentModal, setShowConsentModal] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Sync draft to context on changes
  useEffect(() => {
    updateDraftField('channel', channel);
    updateDraftField('selectedSymptoms', selectedSymptoms);
    updateDraftField('freeText', freeText);
    updateDraftField('durationDays', durationDays);
    updateDraftField('ageGroup', ageGroup);
    updateDraftField('gender', gender);
    updateDraftField('workerNotes', workerNotes);
    updateDraftField('village', selectedVillage);
  }, [channel, selectedSymptoms, freeText, durationDays, ageGroup, gender, workerNotes, selectedVillage]);

  // Categories list
  const categories = [
    'ALL',
    'Fever & Infection',
    'Respiratory',
    'Gastrointestinal',
    'Neurological & Pain',
    'Maternal & Child',
    'General & Chronic'
  ];

  // Quick preset helper
  const applyPreset = (symptomIds: string[], days: number, age: string, text: string = '') => {
    setSelectedSymptoms(symptomIds);
    setDurationDays(days);
    setAgeGroup(age);
    setFreeText(text);
    setFormError(null);
  };

  const toggleSymptom = (id: string) => {
    setFormError(null);
    setSelectedSymptoms(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  // Filtered symptoms
  const filteredSymptoms = SYMPTOM_OPTIONS.filter(sym => {
    const matchesSearch = sym.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          sym.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'ALL' || sym.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleSubmitAttempt = (e: React.FormEvent) => {
    e.preventDefault();

    if (selectedSymptoms.length === 0 && (!freeText || freeText.trim().length < 3)) {
      setFormError('Please select at least one symptom or describe what you are experiencing.');
      return;
    }

    if (!userLocationConsent) {
      setShowConsentModal(true);
      return;
    }

    executeSubmission();
  };

  const executeSubmission = async () => {
    const localResult = computeTriageResult(
      selectedSymptoms,
      durationDays,
      ageGroup,
      freeText
    );

    await addScreeningSubmission({
      submittedBy: channel,
      patientAgeGroup: ageGroup as any,
      patientGender: gender as any,
      village: selectedVillage,
      symptoms: selectedSymptoms,
      freeTextSymptoms: freeText.trim() || undefined,
      durationDays,
      riskTier: localResult.riskTier,
      diseaseCategories: localResult.diseaseCategories,
      isAbstention: localResult.isAbstention,
      abstentionReason: localResult.abstentionReason,
      redFlagTriggered: localResult.redFlagResult.isTriggered,
      redFlagReason: localResult.redFlagResult.reason,
      notes: channel === 'worker' ? workerNotes : undefined
    });

    setCurrentPage('result');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 sm:space-y-8 font-body">
      
      {/* Channel Header Banner with Contextual Photography */}
      <div className={`rounded-3xl border shadow-xs overflow-hidden ${
        channel === 'worker'
          ? 'bg-amber-50/70 border-amber-200 text-amber-950'
          : 'bg-teal-50/70 border-teal-200 text-teal-950'
      }`}>
        
        {/* Top Hero Image Banner */}
        <div className="w-full aspect-[21/9] sm:aspect-[24/8] max-h-56 bg-gradient-to-r from-slate-900 to-teal-950 relative overflow-hidden">
          <img 
            src={
              channel === 'worker'
                ? '/images/asha-consulting.jpeg'
                : '/images/villager-self-screen.jpeg'
            }
            alt={
              channel === 'worker'
                ? 'ASHA health worker consulting with community patient in rural health centre'
                : 'Rural citizen checking health symptoms on mobile device'
            }
            className="w-full h-full object-cover object-center"
            loading="eager"
            onError={(e) => {
              (e.target as HTMLElement).style.display = 'none';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/30 to-transparent" />
          
          <div className="absolute bottom-4 left-4 sm:left-6 text-white space-y-1">
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-white/20 backdrop-blur-md text-white border border-white/30">
              {channel === 'worker' ? 'Frontline Assisted Triage Mode' : 'Citizen Self-Screening Mode'}
            </span>
          </div>
        </div>

        <div className="p-5 sm:p-6 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-white shadow-xs shrink-0 ${
                channel === 'worker' ? 'bg-amber-700' : 'bg-[#0F9D8B]'
              }`}>
                {channel === 'worker' ? <HeartHandshake className="w-5 h-5" /> : <User className="w-5 h-5" />}
              </div>
              <div>
                <span className="text-xs font-medium uppercase tracking-wider text-slate-500">
                  {channel === 'worker' ? 'Channel 2: Health Worker Mode' : 'Channel 1: Citizen Direct'}
                </span>
                <h1 className="font-heading text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900">
                  {channel === 'worker' 
                    ? 'ASHA / Health Worker Assisted Triage' 
                    : 'Check Your Symptoms'}
                </h1>
              </div>
            </div>

            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-white border border-slate-300 self-start sm:self-auto text-slate-700 shadow-2xs">
              {channel === 'worker' ? 'Assisted Entry on Patient’s Behalf' : 'No Account Required · 100% Anonymous'}
            </span>
          </div>

          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
            {channel === 'worker'
              ? 'Use this interface when entering clinical symptoms for a community member who has no smartphone or low digital literacy. Results directly link to facility recommendations and update your village early-warning radar.'
              : 'Select the signs or symptoms being experienced. We will estimate a risk level, suggest appropriate nearby facilities, and anonymously add this signal to your community.'}
          </p>
        </div>

      </div>

      {/* Demo Presets Bar for Judges / Fast Walkthrough */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-2">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          <span>Quick Demo Scenarios (One-Tap Test)</span>
        </div>
        
        <div className="flex flex-wrap gap-2 pt-1">
          <button
            type="button"
            onClick={() => applyPreset(['sym_high_fever', 'sym_chills', 'sym_body_ache', 'sym_eye_pain'], 3, 'adult_15_59')}
            className="text-xs bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 px-3 py-1.5 rounded-lg font-semibold transition-colors cursor-pointer"
          >
            🔥 Febrile Syndrome (High Fever + Chills)
          </button>

          <button
            type="button"
            onClick={() => applyPreset(['sym_watery_diarrhea', 'sym_vomiting', 'sym_stomach_cramps'], 2, 'child_5_14')}
            className="text-xs bg-blue-50 hover:bg-blue-100 text-blue-900 border border-blue-200 px-3 py-1.5 rounded-lg font-semibold transition-colors cursor-pointer"
          >
            💧 Diarrheal / GI Illness
          </button>

          <button
            type="button"
            onClick={() => applyPreset(['rf_chest_pain'], 1, 'adult_15_59', 'Chest heaviness with left arm pain and cold sweat')}
            className="text-xs bg-red-50 hover:bg-red-100 text-red-900 border border-red-200 px-3 py-1.5 rounded-lg font-bold transition-colors cursor-pointer"
          >
            🚨 Emergency Red-Flag Override (Cardiac)
          </button>

          <button
            type="button"
            onClick={() => applyPreset(['sym_rapid_breathing', 'sym_unable_to_feed'], 1, 'child_under_5')}
            className="text-xs bg-purple-50 hover:bg-purple-100 text-purple-900 border border-purple-200 px-3 py-1.5 rounded-lg font-semibold transition-colors cursor-pointer"
          >
            👶 Pediatric Distress (Under 5)
          </button>

          <button
            type="button"
            onClick={() => applyPreset(['sym_back_pain'], 1, 'adult_15_59')}
            className="text-xs bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-200 px-3 py-1.5 rounded-lg font-semibold transition-colors cursor-pointer"
          >
            🟢 Mild Self-Care (Green Tier)
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmitAttempt} className="space-y-6">
        
        {/* Step 1: Patient Context & Village Location */}
        <section className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <span className="w-6 h-6 rounded-full bg-slate-900 text-white font-heading text-xs flex items-center justify-center font-bold">1</span>
            <h2 className="font-heading text-base font-bold text-slate-900">Demographics & Village Location</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            
            {/* Village Selector */}
            <div>
              <label htmlFor="village-select" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Village / Habitation
              </label>
              <div className="relative">
                <select
                  id="village-select"
                  value={selectedVillage}
                  onChange={(e) => setSelectedVillage(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm font-medium text-slate-900 focus:ring-2 focus:ring-teal-500 focus:bg-white focus:outline-none"
                >
                  {villages.map(v => (
                    <option key={v.name} value={v.name}>{v.name} ({v.district})</option>
                  ))}
                </select>
                <MapPin className="w-4 h-4 text-slate-400 absolute right-3 top-3 pointer-events-none" />
              </div>
              <p className="text-[11px] text-slate-500 mt-1">Feeds anonymous signal into this village.</p>
            </div>

            {/* Age Group */}
            <div>
              <label htmlFor="age-select" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Age Group
              </label>
              <select
                id="age-select"
                value={ageGroup}
                onChange={(e) => setAgeGroup(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm font-medium text-slate-900 focus:ring-2 focus:ring-teal-500 focus:bg-white focus:outline-none"
              >
                <option value="child_under_5">Child under 5 years</option>
                <option value="child_5_14">Child (5–14 years)</option>
                <option value="adult_15_59">Adult (15–59 years)</option>
                <option value="senior_60_plus">Senior (60+ years)</option>
                <option value="pregnant">Pregnant Mother</option>
              </select>
            </div>

            {/* Duration of Symptoms */}
            <div>
              <label htmlFor="duration-select" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Symptom Duration
              </label>
              <div className="relative">
                <select
                  id="duration-select"
                  value={durationDays}
                  onChange={(e) => setDurationDays(Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm font-medium text-slate-900 focus:ring-2 focus:ring-teal-500 focus:bg-white focus:outline-none"
                >
                  <option value={1}>Started today / &lt; 24 hours</option>
                  <option value={2}>2 days</option>
                  <option value={3}>3 days</option>
                  <option value={5}>4–6 days</option>
                  <option value={7}>1 week or more</option>
                </select>
                <Clock className="w-4 h-4 text-slate-400 absolute right-3 top-3 pointer-events-none" />
              </div>
            </div>

          </div>
        </section>

        {/* Step 2: Deterministic Red Flag Checklist */}
        <section className="bg-red-50/50 p-5 sm:p-6 rounded-2xl border border-red-200 shadow-xs space-y-3">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-red-600 shrink-0" />
            <h2 className="font-heading text-sm font-extrabold text-red-950 uppercase tracking-wide">
              Emergency Warning Signs (Red-Flag Check)
            </h2>
          </div>
          <p className="text-xs text-red-800">
            If any of these critical signs are present, the system will immediately provide 108 Emergency routing.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
            {RED_FLAG_SYMPTOMS.map((rf: any) => {
              const isSelected = selectedSymptoms.includes(rf.id);
              return (
                <button
                  type="button"
                  key={rf.id}
                  onClick={() => toggleSymptom(rf.id)}
                  className={`flex items-start gap-2.5 p-3 rounded-xl border text-left text-xs font-semibold transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-red-600 text-white border-red-700 shadow-sm'
                      : 'bg-white text-red-950 border-red-200 hover:border-red-400 hover:bg-red-50/60'
                  }`}
                >
                  <div className={`w-4 h-4 rounded mt-0.5 shrink-0 flex items-center justify-center border ${
                    isSelected ? 'bg-white text-red-600 border-white' : 'border-red-300 bg-red-50'
                  }`}>
                    {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                  </div>
                  <span>{rf.label}</span>
                </button>
              );
            })}
          </div>
        </section>

        {/* Step 3: Standard Symptom Selection */}
        <section className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between gap-4 pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-slate-900 text-white font-heading text-xs flex items-center justify-center font-bold">2</span>
              <h2 className="font-heading text-base font-bold text-slate-900">Select Symptoms Experienced</h2>
            </div>
            <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-full bg-teal-50 text-teal-800 border border-teal-200">
              {selectedSymptoms.length} selected
            </span>
          </div>

          {/* Search & Category Filter */}
          <div className="space-y-3">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="text"
                placeholder="Search symptoms (e.g., fever, diarrhea, cough, headache)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-teal-500 focus:bg-white focus:outline-none"
              />
            </div>

            {/* Category Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
              <span className="text-slate-400 shrink-0 mr-1 flex items-center gap-1">
                <Filter className="w-3 h-3" /> Category:
              </span>
              {categories.map(cat => (
                <button
                  type="button"
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-lg whitespace-nowrap font-semibold transition-all cursor-pointer ${
                    selectedCategory === cat
                      ? 'bg-slate-900 text-white'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Symptoms Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 max-h-96 overflow-y-auto pr-1">
            {filteredSymptoms.map((sym) => {
              const isSelected = selectedSymptoms.includes(sym.id);
              return (
                <button
                  type="button"
                  key={sym.id}
                  onClick={() => toggleSymptom(sym.id)}
                  className={`flex items-start gap-2.5 p-3 rounded-xl border text-left text-xs font-medium transition-all cursor-pointer min-h-[52px] ${
                    isSelected
                      ? 'bg-teal-50 border-teal-500 text-teal-950 font-semibold ring-1 ring-teal-500'
                      : 'bg-slate-50/70 border-slate-200 text-slate-800 hover:border-slate-300 hover:bg-white'
                  }`}
                >
                  <div className={`w-4 h-4 rounded mt-0.5 shrink-0 flex items-center justify-center border ${
                    isSelected ? 'bg-[#0F9D8B] text-white border-[#0F9D8B]' : 'border-slate-300 bg-white'
                  }`}>
                    {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                  </div>
                  <div className="leading-snug">
                    <span>{sym.label}</span>
                    <span className="block text-[10px] text-slate-500 mt-0.5 font-normal">
                      {sym.category}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Free-Text Symptom Description Field */}
          <div className="pt-2">
            <label htmlFor="freetext-input" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Additional Details or Unlisted Symptoms (Optional)
            </label>
            <textarea
              id="freetext-input"
              rows={2}
              placeholder="Type any other signs in everyday language (e.g. feeling dizzy when standing in the sun, vomiting twice since morning)..."
              value={freeText}
              onChange={(e) => setFreeText(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-sm text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-teal-500 focus:bg-white focus:outline-none"
            />
          </div>

          {/* Worker Notes (Only in Worker Mode) */}
          {channel === 'worker' && (
            <div className="pt-2 bg-amber-50/60 p-3.5 rounded-xl border border-amber-200">
              <label htmlFor="worker-notes" className="block text-xs font-bold text-amber-950 uppercase tracking-wider mb-1">
                ASHA / Health Worker Field Notes (Optional)
              </label>
              <input
                id="worker-notes"
                type="text"
                placeholder="e.g. Patient visited HWC; oral temperature 101.4 F; ORS packet handed over."
                value={workerNotes}
                onChange={(e) => setWorkerNotes(e.target.value)}
                className="w-full bg-white border border-amber-300 rounded-lg p-2.5 text-xs text-slate-900 focus:ring-2 focus:ring-amber-500 focus:outline-none"
              />
            </div>
          )}

        </section>

        {/* Inline Error Message */}
        {formError && (
          <div className="p-3.5 bg-red-50 border border-red-200 rounded-xl text-xs sm:text-sm text-red-700 font-medium flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
            <span>{formError}</span>
          </div>
        )}

        {/* Submit Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
          <div className="text-xs text-slate-500 flex items-center gap-2 font-body">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Your submission feeds anonymous health pressure for <strong>{selectedVillage}</strong>.</span>
          </div>

          <button
            type="submit"
            className="w-full sm:w-auto min-w-[240px] bg-[#0F9D8B] hover:bg-teal-700 active:scale-98 text-white font-bold px-7 py-3.5 rounded-xl shadow-md shadow-teal-700/20 transition-all flex items-center justify-center gap-2 text-base cursor-pointer focus:ring-2 focus:ring-teal-500 focus:outline-none font-body"
          >
            <span>Analyze & Get Recommendations</span>
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

      </form>

      {/* Location / Privacy Consent Modal */}
      <ConsentModal
        isOpen={showConsentModal}
        villageName={selectedVillage}
        onAccept={() => {
          setUserLocationConsent(true);
          setShowConsentModal(false);
          executeSubmission();
        }}
        onDecline={() => setShowConsentModal(false)}
      />

    </div>
  );
};
