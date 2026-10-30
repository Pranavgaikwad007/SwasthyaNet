import React from 'react';
import { useAppState } from '../../context/AppStateContext';
import { Facility, RiskTier } from '../../types';
import { RedFlagEmergency } from './RedFlagEmergency';
import { CommunitySignalConfirmed } from './CommunitySignalConfirmed';
import { 
  Building2, 
  Clock, 
  MapPin, 
  PhoneCall, 
  HelpCircle, 
  ArrowRight, 
  CheckCircle2, 
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  Activity,
  ArrowLeft,
  Navigation
} from 'lucide-react';

export const ResultCard: React.FC = () => {
  const { 
    latestSubmission, 
    setCurrentPage, 
    navigateBackToScreening,
    facilities, 
    selectedVillage,
    villages,
    screeningDraft
  } = useAppState();

  if (!latestSubmission) {
    return (
      <div className="text-center py-16 space-y-4 bg-white rounded-3xl border border-slate-200 p-8 font-body">
        <Activity className="w-12 h-12 text-slate-400 mx-auto animate-pulse" />
        <h2 className="text-xl font-heading font-bold text-slate-800">No Active Screening Found</h2>
        <p className="text-sm text-slate-500 max-w-md mx-auto">
          Please complete a citizen or health worker screening first to generate clinical guidance and facility recommendations.
        </p>
        <button
          onClick={() => setCurrentPage('screening_citizen')}
          className="bg-[#0F9D8B] text-white px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-teal-700 transition-colors cursor-pointer"
        >
          Start New Screening
        </button>
      </div>
    );
  }

  const {
    riskTier,
    diseaseCategories,
    isAbstention,
    abstentionReason,
    redFlagTriggered,
    redFlagReason,
    submittedBy,
    patientAgeGroup,
    durationDays,
    symptoms,
    anonymizedHash,
    timestamp
  } = latestSubmission;

  // 1. Emergency Red Flag Override View
  if (redFlagTriggered) {
    return (
      <RedFlagEmergency
        reason={redFlagReason}
        villageName={selectedVillage}
        anonHash={anonymizedHash}
        onBackToScreening={navigateBackToScreening}
      />
    );
  }

  // 2. Map Risk Tier Visuals
  const tierConfig: Record<RiskTier, {
    title: string;
    description: string;
    badgeClass: string;
    headerBg: string;
    borderClass: string;
    iconColor: string;
    timeframe: string;
    recommendedCareLevel: string;
  }> = {
    GREEN: {
      title: 'Green: Mild / Self-Care at Home',
      description: 'Your reported symptoms indicate a mild, self-limiting condition suitable for home self-care, oral hydration, rest, and monitoring. If symptoms persist or worsen, visit your local Health & Wellness Centre (HWC).',
      badgeClass: 'badge-tier-green',
      headerBg: 'bg-emerald-50/80',
      borderClass: 'border-emerald-200',
      iconColor: 'text-emerald-700',
      timeframe: 'Monitor over the next 48–72 hours',
      recommendedCareLevel: 'Health & Wellness Centre (HWC) / Sub-Centre'
    },
    YELLOW: {
      title: 'Yellow: Routine Primary Care Needed',
      description: 'Symptoms warrant formal assessment by a clinician or Community Health Officer (CHO) at your nearest Primary Health Centre (PHC) or HWC for diagnostic testing and standard management.',
      badgeClass: 'badge-tier-yellow',
      headerBg: 'bg-amber-50/80',
      borderClass: 'border-amber-200',
      iconColor: 'text-amber-700',
      timeframe: 'Visit within 24 to 48 hours',
      recommendedCareLevel: 'Primary Health Centre (PHC) / 24x7 Clinic'
    },
    ORANGE: {
      title: 'Orange: Priority Clinical Assessment Required',
      description: 'Significant clinical signs detected. Requires priority in-person examination by a Medical Officer today at your nearest 24x7 PHC or Community Health Centre (CHC). Do not delay.',
      badgeClass: 'badge-tier-orange',
      headerBg: 'bg-orange-50/80',
      borderClass: 'border-orange-200',
      iconColor: 'text-orange-700',
      timeframe: 'Visit Same Day / Within 4–8 hours',
      recommendedCareLevel: '24x7 PHC or Community Health Centre (CHC)'
    },
    RED: {
      title: 'Red: Immediate Emergency / Hospital Transfer',
      description: 'Urgent medical condition detected requiring immediate clinical intervention and stabilization at a First Referral Unit (CHC) or District Hospital.',
      badgeClass: 'badge-tier-red',
      headerBg: 'bg-red-50/80',
      borderClass: 'border-red-200',
      iconColor: 'text-red-700',
      timeframe: 'Immediate Transfer · Call 108',
      recommendedCareLevel: 'District Hospital / Trauma Centre'
    }
  };

  const activeTier = tierConfig[riskTier] || tierConfig.GREEN;

  // Filter recommended facilities based on suitability & calculate real transit
  const activeVillageProfile = villages.find(v => v.name === selectedVillage) || villages[0];

  const calculateHaversine = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return Math.round(R * c * 10) / 10;
  };

  const calculateTime = (dist: number) => dist === 0 ? 2 : Math.max(3, Math.round(dist * 2.0));

  const primaryFacility = facilities[0];
  const secondaryFacilities = facilities.slice(1, 3);

  const primDist = primaryFacility ? calculateHaversine(activeVillageProfile.lat, activeVillageProfile.lng, primaryFacility.lat, primaryFacility.lng) : 0;
  const primTime = calculateTime(primDist);

  return (
    <div className="max-w-4xl mx-auto space-y-6 sm:space-y-8 animate-in fade-in duration-200 font-body">
      
      {/* Top Back Navigation Bar (Form State Preserved) */}
      <div className="flex items-center justify-between gap-4">
        <button
          type="button"
          onClick={navigateBackToScreening}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs sm:text-sm font-bold shadow-2xs transition-all active:scale-95 cursor-pointer font-body group"
        >
          <ArrowLeft className="w-4 h-4 text-slate-500 group-hover:-translate-x-1 transition-transform" />
          <span>Edit Symptoms / Back to Screening</span>
        </button>

        <div className="text-right">
          <span className="text-[11px] text-slate-400 font-mono">
            {submittedBy === 'worker' ? 'Channel 2: Assisted Mode' : 'Channel 1: Citizen Direct'}
          </span>
        </div>
      </div>

      {/* 1. Main Risk Tier Announcement Card */}
      <section className={`bg-white rounded-3xl border ${activeTier.borderClass} shadow-sm overflow-hidden`}>
        
        {/* Card Header */}
        <div className={`p-6 sm:p-8 ${activeTier.headerBg} border-b ${activeTier.borderClass} space-y-4`}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className={`text-xs font-mono font-bold px-3 py-1 rounded-full uppercase tracking-wider ${activeTier.badgeClass}`}>
                {riskTier} Tier Triage
              </span>
              <span className="text-xs text-slate-500 font-medium">
                Evaluated for <strong className="text-slate-800">{selectedVillage}</strong>
              </span>
            </div>

            <span className="text-xs font-mono text-slate-500">
              Signal: {anonymizedHash}
            </span>
          </div>

          <div>
            <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {activeTier.title}
            </h1>
            <p className="text-sm sm:text-base text-slate-700 mt-2 leading-relaxed">
              {activeTier.description}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-slate-800 pt-2">
            <div className="flex items-center gap-1.5 bg-white/80 px-3 py-1.5 rounded-lg border border-slate-200/80">
              <Clock className="w-3.5 h-3.5 text-slate-500" />
              <span>Recommended Timeframe: <strong className="text-slate-900">{activeTier.timeframe}</strong></span>
            </div>
            <div className="flex items-center gap-1.5 bg-white/80 px-3 py-1.5 rounded-lg border border-slate-200/80">
              <Building2 className="w-3.5 h-3.5 text-slate-500" />
              <span>Appropriate Facility: <strong className="text-slate-900">{activeTier.recommendedCareLevel}</strong></span>
            </div>
          </div>
        </div>

        {/* 2. Top-3 Differential Disease Categories (Explainability) */}
        <div className="p-6 sm:p-8 space-y-4 bg-white border-b border-slate-100">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-heading text-base font-extrabold text-slate-900">
                Top Differential Disease Categories
              </h2>
              <p className="text-xs text-slate-500">
                Rule-based algorithmic pattern matches for clinical triage review.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {diseaseCategories && diseaseCategories.length > 0 ? (
              diseaseCategories.map((cat, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-slate-900 text-white text-[11px] font-heading font-bold flex items-center justify-center">
                        {idx + 1}
                      </span>
                      <h3 className="font-heading font-bold text-sm text-slate-900">{cat.category}</h3>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-slate-700 bg-white px-2 py-0.5 rounded border border-slate-200">
                        {cat.confidence}% match
                      </span>
                      <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-teal-50 text-teal-800 border border-teal-200">
                        {cat.typicalCareLevel}
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed font-body">
                    {cat.description}
                  </p>
                </div>
              ))
            ) : (
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-600">
                General wellness assessment. No acute syndromic cluster identified.
              </div>
            )}
          </div>

          {/* Explicit Abstention Banner if triggered */}
          {isAbstention && (
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl flex items-start gap-3 text-amber-900">
              <HelpCircle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <h4 className="font-heading font-bold text-xs">Clinical Abstention Notice</h4>
                <p className="text-xs text-amber-800 leading-relaxed">
                  {abstentionReason || "We can't tell from this description. Please see a community health worker or clinician at your nearest Health & Wellness Centre."}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* 3. Safe Self-Care & Supportive Measures */}
        <div className="p-6 sm:p-8 bg-slate-50 space-y-3">
          <h2 className="font-heading text-sm font-extrabold text-slate-900 uppercase tracking-wider">
            Safe Supportive Home Guidelines (Non-Pharmacological)
          </h2>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs text-slate-700">
            <li className="flex items-start gap-2 bg-white p-3 rounded-xl border border-slate-200">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>Ensure continuous hydration with clean boiled water, lemon water, or ORS (Oral Rehydration Salts).</span>
            </li>
            <li className="flex items-start gap-2 bg-white p-3 rounded-xl border border-slate-200">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>Get adequate physical rest in a cool, well-ventilated room.</span>
            </li>
            <li className="flex items-start gap-2 bg-white p-3 rounded-xl border border-slate-200">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>Consume light, easily digestible meals (khichdi, dalia, warm soup).</span>
            </li>
            <li className="flex items-start gap-2 bg-white p-3 rounded-xl border border-slate-200">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>Safety Rule: Do NOT self-medicate with unprescribed antibiotics or heavy analgesics without doctor examination.</span>
            </li>
          </ul>
        </div>

      </section>

      {/* 4. Ranked Facility Recommendations (Pillar 2 Outcome) */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="font-heading text-xl font-extrabold text-slate-900">
              Recommended Healthcare Facilities for {selectedVillage}
            </h2>
            <p className="text-xs text-slate-500 font-body">
              Ranked by clinical care-level match, real travel distance, active ward load, and service availability.
            </p>
          </div>

          <button
            onClick={() => {
              setCurrentPage('facilities');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="text-xs font-bold text-teal-700 hover:text-teal-900 flex items-center gap-1 cursor-pointer self-start sm:self-auto font-body"
          >
            <span>View All Facilities & Google Map</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Primary Recommended Facility (Top Rank) */}
        {primaryFacility && (
          <div className="bg-white p-6 sm:p-7 rounded-3xl border-2 border-[#0F9D8B] shadow-md space-y-4 relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-[#0F9D8B] text-white text-[10px] font-bold font-mono px-3 py-1 rounded-bl-xl uppercase tracking-wider">
              Best Match ({primaryFacility.suitabilityScore || 94}% Suitability)
            </div>

            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pt-2 sm:pt-0">
              <div className="space-y-1">
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-teal-50 text-teal-800">
                  {primaryFacility.careLevelName}
                </span>
                <h3 className="font-heading text-lg sm:text-xl font-black text-slate-900">
                  {primaryFacility.name}
                </h3>
                <p className="text-xs text-slate-500 flex items-center gap-1.5 font-body">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>{primaryFacility.address}</span>
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <a
                  href={`https://www.google.com/maps/dir/?api=1&destination=${primaryFacility.lat},${primaryFacility.lng}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 bg-[#0F9D8B] hover:bg-teal-600 text-white text-xs font-bold px-3.5 py-2 rounded-xl transition-all shadow-xs cursor-pointer"
                >
                  <Navigation className="w-3.5 h-3.5" />
                  <span>Google Directions</span>
                  <ExternalLink className="w-3 h-3" />
                </a>

                <a
                  href={`tel:${primaryFacility.phone}`}
                  className="inline-flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-3.5 py-2 rounded-xl transition-all shadow-xs"
                >
                  <PhoneCall className="w-3.5 h-3.5" />
                  <span>Call ({primaryFacility.phone.split('/')[0].trim()})</span>
                </a>
              </div>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-body">
              <div>
                <span className="text-slate-500 block text-[11px]">Real Travel Time:</span>
                <span className="font-bold text-slate-900 font-mono">
                  {primDist === 0 ? '~2 min (walk)' : `~${primTime} mins`}
                </span>
              </div>
              <div>
                <span className="text-slate-500 block text-[11px]">Distance from {selectedVillage}:</span>
                <span className="font-bold text-slate-900 font-mono">
                  {primDist === 0 ? `0 km (In ${selectedVillage})` : `${primDist} km`}
                </span>
              </div>
              <div>
                <span className="text-slate-500 block text-[11px]">Ward Capacity:</span>
                <span className="font-bold text-slate-900 font-mono">{primaryFacility.currentLoad}% Load</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[11px]">Hours:</span>
                <span className="font-bold text-slate-900 truncate">{primaryFacility.operationalHours}</span>
              </div>
            </div>

            {/* Key Services */}
            <div>
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1.5 font-body">
                Available Clinical Services:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {primaryFacility.servicesOffered.slice(0, 4).map((srv, i) => (
                  <span key={i} className="text-xs bg-slate-100 text-slate-700 px-2.5 py-1 rounded-lg font-medium font-body">
                    ✓ {srv}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Secondary Facilities */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {secondaryFacilities.map(fac => {
            const secDist = calculateHaversine(activeVillageProfile.lat, activeVillageProfile.lng, fac.lat, fac.lng);
            const secTime = calculateTime(secDist);

            return (
              <div key={fac.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-3 flex flex-col justify-between">
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                      {fac.type}
                    </span>
                    <span className="text-xs font-mono font-bold text-teal-700">
                      {secDist === 0 ? '~2 min (In Village)' : `~${secTime} min (${secDist} km)`}
                    </span>
                  </div>
                  <h4 className="font-heading font-bold text-base text-slate-900">{fac.name}</h4>
                  <p className="text-xs text-slate-500 line-clamp-1 font-body">{fac.address}</p>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                  <a
                    href={`https://www.google.com/maps/dir/?api=1&destination=${fac.lat},${fac.lng}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-bold text-[#0F9D8B] hover:text-teal-700 flex items-center gap-1 font-body"
                  >
                    <span>Google Directions</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>

                  <a
                    href={`tel:${fac.phone}`}
                    className="text-xs font-semibold text-slate-700 hover:text-slate-900 font-body"
                  >
                    Call {fac.phone.split('/')[0].trim()}
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 5. Community Signal Confirmation Card (The Bridge to Pillar 3) */}
      <CommunitySignalConfirmed
        village={selectedVillage}
        category={diseaseCategories[0]?.category || 'General Assessment'}
        riskTier={riskTier}
        anonymizedHash={anonymizedHash}
      />

    </div>
  );
};
