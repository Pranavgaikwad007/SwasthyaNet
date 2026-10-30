import React, { useState } from 'react';
import { useAppState } from '../../context/AppStateContext';
import { Facility } from '../../types';
import { 
  Building2, 
  MapPin, 
  Clock, 
  PhoneCall, 
  Navigation, 
  ShieldCheck, 
  CheckCircle2, 
  AlertCircle,
  ExternalLink,
  Filter,
  ShieldAlert
} from 'lucide-react';

// Real Haversine distance calculation in km
function calculateHaversineDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}

// Real estimated rural transit time (assumes ~30 km/h average rural road / village road speed)
function calculateTravelTimeMin(distanceKm: number): number {
  if (distanceKm === 0) return 2; // Coincident local village walking distance
  return Math.max(3, Math.round(distanceKm * 2.0));
}

export const FacilityList: React.FC = () => {
  const { facilities, selectedVillage, setSelectedVillage, villages } = useAppState();
  const [filterType, setFilterType] = useState<string>('ALL');

  const activeVillageProfile = villages.find(v => v.name === selectedVillage) || villages[0];

  const filteredFacilities = facilities.filter(f => {
    if (filterType === 'ALL') return true;
    return f.type === filterType;
  });

  const getCareBadgeColor = (type: string) => {
    switch (type) {
      case 'HWC': return 'bg-teal-50 text-teal-800 border-teal-200';
      case 'PHC': return 'bg-cyan-50 text-cyan-800 border-cyan-200';
      case 'CHC': return 'bg-indigo-50 text-indigo-800 border-indigo-200';
      case 'DISTRICT_HOSPITAL': return 'bg-red-50 text-red-800 border-red-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const getFacilityImage = (type: string) => {
    switch (type) {
      case 'HWC':
        return {
          src: '/images/hwc-building.jpeg',
          alt: 'Ayushman Arogya Mandir Health & Wellness Centre building thumbnail'
        };
      case 'PHC':
        return {
          src: '/images/ambulance-phc.jpeg',
          alt: 'Primary Health Centre 24x7 clinic with stationed ambulance'
        };
      case 'CHC':
        return {
          src: '/images/chc-centre.jpeg',
          alt: 'Community Health Centre first referral hospital'
        };
      default:
        return null;
    }
  };

  const openDirections = (lat: number, lng: number) => {
    window.open(`https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="space-y-6 font-body">
      
      {/* Filter and Village Header Controls */}
      <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          
          {/* Active Village Context */}
          <div className="space-y-1">
            <label htmlFor="facility-village-select" className="text-xs font-bold text-slate-500 uppercase tracking-wider block font-body">
              Calculating Real Transit & Load for Village:
            </label>
            <div className="flex items-center gap-2">
              <select
                id="facility-village-select"
                value={selectedVillage}
                onChange={(e) => setSelectedVillage(e.target.value)}
                className="bg-slate-50 hover:bg-slate-100 border border-slate-300 font-heading font-extrabold text-base text-slate-900 rounded-xl px-3 py-2 focus:ring-2 focus:ring-teal-500 focus:outline-none cursor-pointer"
              >
                {villages.map(v => (
                  <option key={v.name} value={v.name}>{v.name} ({v.district})</option>
                ))}
              </select>
            </div>
          </div>

          {/* Care-Level Tier Filters */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            <span className="text-xs text-slate-400 font-bold mr-1 shrink-0 flex items-center gap-1 font-body">
              <Filter className="w-3.5 h-3.5" /> Tier:
            </span>
            {[
              { id: 'ALL', label: 'All Tiers' },
              { id: 'HWC', label: 'HWC Sub-Centre' },
              { id: 'PHC', label: '24x7 PHC' },
              { id: 'CHC', label: 'CHC Referral' },
              { id: 'DISTRICT_HOSPITAL', label: 'District Hospital' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setFilterType(tab.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer font-body ${
                  filterType === tab.id
                    ? 'bg-[#0B1220] text-white shadow-xs'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

        </div>
      </div>

      {/* Facilities Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredFacilities.map((fac) => {
          // REAL Calculated Distance and Travel Time
          const distanceKm = calculateHaversineDistanceKm(
            activeVillageProfile.lat,
            activeVillageProfile.lng,
            fac.lat,
            fac.lng
          );
          const travelTimeMin = calculateTravelTimeMin(distanceKm);
          const thumb = getFacilityImage(fac.type);

          return (
            <div 
              key={fac.id}
              className="bg-white rounded-3xl border border-slate-200 shadow-xs hover:shadow-md transition-all p-6 space-y-5 flex flex-col justify-between"
            >
              <div className="space-y-4">
                
                {/* Header Badge & Distance */}
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1.5">
                    <span className={`text-[11px] font-mono font-bold px-2.5 py-0.5 rounded-md border uppercase tracking-wider ${getCareBadgeColor(fac.type)}`}>
                      {fac.careLevelName}
                    </span>
                    <h3 className="font-heading text-lg sm:text-xl font-extrabold text-slate-900 leading-snug">
                      {fac.name}
                    </h3>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="font-heading font-extrabold text-base text-slate-900 font-mono block">
                      {distanceKm === 0 ? '~2 min (walk)' : `~${travelTimeMin} min`}
                    </span>
                    <span className="text-[11px] text-slate-500 font-mono">
                      {distanceKm === 0 ? `0 km (In ${selectedVillage})` : `${distanceKm} km from ${selectedVillage}`}
                    </span>
                  </div>
                </div>

                {/* Facility Thumbnail */}
                {thumb && (
                  <div className="aspect-[4/3] max-h-48 w-full rounded-2xl overflow-hidden bg-slate-100 border border-slate-200">
                    <img 
                      src={thumb.src} 
                      alt={thumb.alt} 
                      className="w-full h-full object-cover hover:scale-103 transition-transform duration-300"
                      loading="lazy"
                      onError={(e) => {
                        (e.target as HTMLElement).parentElement!.style.display = 'none';
                      }}
                    />
                  </div>
                )}

                {/* Address & Timings (From real DB data) */}
                <div className="space-y-1.5 text-xs text-slate-600 font-body">
                  <p className="flex items-start gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                    <span>{fac.address}</span>
                  </p>
                  <p className="flex items-center gap-1.5 text-slate-500">
                    <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>{fac.operationalHours}</span>
                  </p>
                </div>

                {/* Metrics Bar (Real Current Ward Load & Capacity) */}
                <div className="grid grid-cols-2 gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-body">
                  <div>
                    <span className="text-[11px] text-slate-500 block">Current Ward Load:</span>
                    <div className="flex items-center gap-2 mt-0.5">
                      <div className="flex-1 bg-slate-200 h-2 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full ${
                            fac.currentLoad > 80 ? 'bg-red-500' : fac.currentLoad > 60 ? 'bg-amber-500' : 'bg-[#0F9D8B]'
                          }`}
                          style={{ width: `${fac.currentLoad}%` }}
                        />
                      </div>
                      <span className="font-mono font-bold text-slate-800">{fac.currentLoad}%</span>
                    </div>
                  </div>

                  <div>
                    <span className="text-[11px] text-slate-500 block">Daily Capacity:</span>
                    <span className="font-semibold text-slate-900 mt-0.5 block font-mono">
                      {fac.capacityPerDay} patients/day
                    </span>
                  </div>
                </div>

                {/* Services List */}
                <div className="space-y-2 font-body">
                  <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                    Available Clinical Services:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {fac.servicesOffered.map((srv, sIdx) => (
                      <span key={sIdx} className="text-xs bg-slate-100 text-slate-700 px-2.5 py-1 rounded-lg font-medium">
                        ✓ {srv}
                      </span>
                    ))}
                  </div>
                </div>

              </div>

              {/* UNIFORM ACTIONS (Google Directions + Call Direct + Call 108 Emergency on ALL Cards) */}
              <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 font-body">
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => openDirections(fac.lat, fac.lng)}
                    className="inline-flex items-center gap-1.5 bg-[#0F9D8B] hover:bg-teal-600 active:scale-95 text-white text-xs font-bold px-3.5 py-2.5 rounded-xl shadow-xs transition-all cursor-pointer"
                  >
                    <Navigation className="w-3.5 h-3.5" />
                    <span>Google Directions</span>
                    <ExternalLink className="w-3 h-3" />
                  </button>

                  <a
                    href={`tel:${fac.phone}`}
                    className="inline-flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 active:scale-95 text-white text-xs font-bold px-3.5 py-2.5 rounded-xl shadow-xs transition-all"
                  >
                    <PhoneCall className="w-3.5 h-3.5" />
                    <span>Call ({fac.phone.split('/')[0].trim()})</span>
                  </a>
                </div>

                {/* UNIFORM 108 EMERGENCY BUTTON ON EVERY CARD */}
                <a
                  href="tel:108"
                  className="inline-flex items-center gap-1.5 bg-red-600 hover:bg-red-700 active:scale-95 text-white text-xs font-bold px-3 py-2.5 rounded-xl shadow-xs transition-all"
                  title="Direct 108 Emergency Ambulance Helpline"
                >
                  <ShieldAlert className="w-3.5 h-3.5" />
                  <span>Call 108</span>
                </a>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
};
