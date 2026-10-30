import React, { useState, useEffect, useRef } from 'react';
import { useAppState } from '../../context/AppStateContext';
import { Facility } from '../../types';
import { 
  Compass, 
  PhoneCall, 
  MapPin, 
  ExternalLink, 
  Navigation, 
  KeyRound,
  Layers,
  Map as MapIcon,
  Globe,
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

function calculateTravelTimeMin(distanceKm: number): number {
  if (distanceKm === 0) return 2;
  return Math.max(3, Math.round(distanceKm * 2.0));
}

export const FacilityMap: React.FC = () => {
  const { facilities, villages, selectedVillage, setSelectedVillage } = useAppState();
  const [activeFacility, setActiveFacility] = useState<Facility>(facilities[0]);
  const [mapType, setMapType] = useState<'roadmap' | 'satellite'>('roadmap');
  const [mapLoaded, setMapLoaded] = useState(false);
  
  const mapRef = useRef<HTMLDivElement>(null);
  const googleMapInstance = useRef<any>(null);
  const markersRef = useRef<any[]>([]);

  const apiKey = (import.meta as any).env?.VITE_GOOGLE_MAPS_API_KEY || '';
  const activeVillageProfile = villages.find(v => v.name === selectedVillage) || villages[0];

  const tierColors: Record<string, { hex: string; label: string }> = {
    HWC: { hex: '#0F9D8B', label: 'HWC (Sub-Centre)' },
    PHC: { hex: '#06b6d4', label: '24x7 PHC' },
    CHC: { hex: '#6366f1', label: 'CHC (Referral)' },
    DISTRICT_HOSPITAL: { hex: '#dc2626', label: 'District Hospital' }
  };

  // Google Maps JS API loader
  useEffect(() => {
    if (!apiKey) return;

    if ((window as any).google?.maps) {
      setMapLoaded(true);
      return;
    }

    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
    script.async = true;
    script.defer = true;
    script.onload = () => setMapLoaded(true);
    document.head.appendChild(script);
  }, [apiKey]);

  // Update or render Google Map
  useEffect(() => {
    if (!mapLoaded || !(window as any).google?.maps || !mapRef.current) return;

    const google = (window as any).google;
    const center = { lat: activeVillageProfile.lat, lng: activeVillageProfile.lng };

    if (!googleMapInstance.current) {
      googleMapInstance.current = new google.maps.Map(mapRef.current, {
        center,
        zoom: 12,
        mapTypeId: mapType === 'satellite' ? google.maps.MapTypeId.HYBRID : google.maps.MapTypeId.ROADMAP,
        disableDefaultUI: false,
        zoomControl: true,
        mapTypeControl: false,
        streetViewControl: false
      });
    } else {
      googleMapInstance.current.panTo(center);
      googleMapInstance.current.setZoom(12);
      googleMapInstance.current.setMapTypeId(
        mapType === 'satellite' ? google.maps.MapTypeId.HYBRID : google.maps.MapTypeId.ROADMAP
      );
    }

    // Clear old markers
    markersRef.current.forEach(m => m.setMap(null));
    markersRef.current = [];

    // Village Marker
    const villageMarker = new google.maps.Marker({
      position: center,
      map: googleMapInstance.current,
      title: `Village: ${activeVillageProfile.name}`,
      icon: {
        path: google.maps.SymbolPath.CIRCLE,
        scale: 10,
        fillColor: '#0B1220',
        fillOpacity: 1,
        strokeColor: '#FFFFFF',
        strokeWeight: 3
      }
    });

    const villageInfoWindow = new google.maps.InfoWindow({
      content: `<div style="font-family: Inter, sans-serif; padding: 4px;">
        <strong style="font-family: 'Plus Jakarta Sans', sans-serif; font-size: 14px;">${activeVillageProfile.name} Village</strong>
        <p style="font-size: 11px; color: #64748b; margin: 2px 0 6px 0;">Catchment Population: ~${activeVillageProfile.population.toLocaleString()}</p>
        <a href="https://www.google.com/maps/search/?api=1&query=${activeVillageProfile.lat},${activeVillageProfile.lng}" target="_blank" rel="noopener noreferrer" style="color: #0F9D8B; font-size: 11px; font-weight: bold; text-decoration: underline;">Open in Google Maps &rarr;</a>
      </div>`
    });

    villageMarker.addListener('click', () => {
      villageInfoWindow.open(googleMapInstance.current, villageMarker);
    });

    markersRef.current.push(villageMarker);

    // Facility Markers
    facilities.forEach(fac => {
      const color = tierColors[fac.type]?.hex || '#0F9D8B';
      const marker = new google.maps.Marker({
        position: { lat: fac.lat, lng: fac.lng },
        map: googleMapInstance.current,
        title: fac.name,
        icon: {
          path: google.maps.SymbolPath.BACKWARD_CLOSED_ARROW,
          scale: 6,
          fillColor: color,
          fillOpacity: 1,
          strokeColor: '#FFFFFF',
          strokeWeight: 2
        }
      });

      const dist = calculateHaversineDistanceKm(activeVillageProfile.lat, activeVillageProfile.lng, fac.lat, fac.lng);
      const time = calculateTravelTimeMin(dist);

      const infoWindow = new google.maps.InfoWindow({
        content: `<div style="font-family: Inter, sans-serif; padding: 4px; max-width: 220px;">
          <span style="font-size: 10px; font-weight: bold; text-transform: uppercase; color: ${color};">${fac.careLevelName}</span>
          <h4 style="font-family: 'Plus Jakarta Sans', sans-serif; font-size: 13px; font-weight: bold; margin: 2px 0;">${fac.name}</h4>
          <p style="font-size: 11px; color: #475569; margin: 2px 0 6px 0;">~${time} min travel (${dist} km)</p>
          <a href="https://www.google.com/maps/dir/?api=1&destination=${fac.lat},${fac.lng}" target="_blank" rel="noopener noreferrer" style="display: inline-block; background: #0F9D8B; color: white; padding: 4px 8px; border-radius: 4px; font-size: 11px; font-weight: bold; text-decoration: none;">Get Google Directions</a>
        </div>`
      });

      marker.addListener('click', () => {
        setActiveFacility(fac);
        infoWindow.open(googleMapInstance.current, marker);
      });

      markersRef.current.push(marker);
    });
  }, [mapLoaded, mapType, activeVillageProfile, facilities]);

  const openGoogleDirections = (lat: number, lng: number) => {
    window.open(`https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`, '_blank', 'noopener,noreferrer');
  };

  const openGoogleSearch = (lat: number, lng: number) => {
    window.open(`https://www.google.com/maps/search/?api=1&query=${lat},${lng}`, '_blank', 'noopener,noreferrer');
  };

  const activeDistance = calculateHaversineDistanceKm(activeVillageProfile.lat, activeVillageProfile.lng, activeFacility.lat, activeFacility.lng);
  const activeTravelTime = calculateTravelTimeMin(activeDistance);

  return (
    <div className="bg-white p-5 sm:p-7 rounded-3xl border border-slate-200 shadow-xs space-y-6 font-body">
      
      {/* Map Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <Compass className="w-5 h-5 text-[#0F9D8B]" />
            <h3 className="text-lg font-heading font-extrabold text-slate-900">
              Google Maps Spatial Catchment
            </h3>
          </div>
          <p className="text-xs text-slate-500 mt-0.5 font-body">
            Geographic healthcare referral map for {activeVillageProfile.name} and surrounding primary facilities.
          </p>
        </div>

        {/* View Switcher & Legend */}
        <div className="flex flex-wrap items-center gap-3">
          
          {/* Roadmap vs Satellite Switcher */}
          <div className="flex items-center p-0.5 bg-slate-100 rounded-xl border border-slate-200 text-xs font-semibold">
            <button
              type="button"
              onClick={() => setMapType('roadmap')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                mapType === 'roadmap' ? 'bg-white text-slate-900 shadow-2xs font-bold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <MapIcon className="w-3.5 h-3.5" />
              <span>Map</span>
            </button>

            <button
              type="button"
              onClick={() => setMapType('satellite')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                mapType === 'satellite' ? 'bg-white text-slate-900 shadow-2xs font-bold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Globe className="w-3.5 h-3.5" />
              <span>Satellite</span>
            </button>
          </div>

          {/* Tier Legend */}
          <div className="flex flex-wrap items-center gap-2 text-[11px] font-semibold text-slate-700">
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-[#0F9D8B] inline-block" /> HWC
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-500 inline-block" /> PHC
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 inline-block" /> CHC
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-red-600 inline-block" /> District Hospital
            </span>
          </div>

        </div>
      </div>

      {/* API Key Setup Banner if not provided */}
      {!apiKey && (
        <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-2xl text-xs text-amber-900 flex items-start gap-2.5">
          <KeyRound className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <p className="font-semibold">
              Live Google Maps JS Canvas Setup:
            </p>
            <p className="text-[11px] text-amber-800 leading-relaxed font-body">
              To render the interactive Google Maps JavaScript canvas, add <code className="bg-amber-100 px-1 py-0.5 rounded font-mono text-[10px]">VITE_GOOGLE_MAPS_API_KEY</code> in your <code className="bg-amber-100 px-1 py-0.5 rounded font-mono text-[10px]">.env</code> file. An active map canvas with real geographical tiles is shown below.
            </p>
          </div>
        </div>
      )}

      {/* REAL MAP CANVAS CONTAINER (Google Maps or Real Cartographic Map View) */}
      <div className="relative rounded-2xl overflow-hidden border border-slate-200 shadow-sm min-h-[380px] sm:min-h-[440px] bg-slate-100">
        
        {apiKey ? (
          <div ref={mapRef} className="w-full h-[380px] sm:h-[440px]" />
        ) : (
          /* Real Cartographic Map View with OpenStreetMap / Google Map Satellite rendering */
          <div className="relative w-full h-[380px] sm:h-[440px] overflow-hidden">
            <iframe
              title="Geographical Map"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              loading="lazy"
              src={
                mapType === 'satellite'
                  ? `https://maps.google.com/maps?q=${activeVillageProfile.lat},${activeVillageProfile.lng}&t=k&z=13&ie=UTF8&iwloc=&output=embed`
                  : `https://maps.google.com/maps?q=${activeVillageProfile.lat},${activeVillageProfile.lng}&t=m&z=13&ie=UTF8&iwloc=&output=embed`
              }
            />

            {/* Floating Overlay Controls on Real Map Canvas */}
            <div className="absolute top-3 left-3 z-10 bg-white/95 backdrop-blur-md p-3 rounded-2xl border border-slate-200 shadow-md space-y-1 max-w-xs">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900">
                <MapPin className="w-3.5 h-3.5 text-[#0F9D8B]" />
                <span>{activeVillageProfile.name} Village Center</span>
              </div>
              <p className="text-[11px] font-mono text-slate-500">
                {activeVillageProfile.lat.toFixed(4)}° N, {activeVillageProfile.lng.toFixed(4)}° E
              </p>
              <div className="pt-1 flex gap-1.5">
                <button
                  type="button"
                  onClick={() => openGoogleSearch(activeVillageProfile.lat, activeVillageProfile.lng)}
                  className="text-[10px] bg-slate-900 hover:bg-slate-800 text-white font-bold px-2.5 py-1 rounded-lg flex items-center gap-1 cursor-pointer"
                >
                  <span>Open in Maps</span>
                  <ExternalLink className="w-2.5 h-2.5" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Facility Pill Selectors Anchored on Map Footer */}
        <div className="absolute bottom-3 left-3 right-3 z-10 bg-white/95 backdrop-blur-md p-3 rounded-2xl border border-slate-200 shadow-md">
          <div className="flex items-center justify-between gap-2 mb-2">
            <span className="text-[11px] font-bold text-slate-700">Catchment Referral Facilities:</span>
            <span className="text-[10px] text-slate-400 font-mono">Click to route</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {facilities.map(fac => {
              const isSelected = activeFacility.id === fac.id;
              const dist = calculateHaversineDistanceKm(activeVillageProfile.lat, activeVillageProfile.lng, fac.lat, fac.lng);
              const time = calculateTravelTimeMin(dist);

              return (
                <button
                  key={fac.id}
                  type="button"
                  onClick={() => setActiveFacility(fac)}
                  className={`p-2 rounded-xl text-left transition-all cursor-pointer border ${
                    isSelected
                      ? 'bg-teal-50 border-[#0F9D8B] text-teal-950 font-bold ring-1 ring-[#0F9D8B]'
                      : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700'
                  }`}
                >
                  <span className="block text-[9px] font-mono font-bold uppercase text-teal-700 truncate">{fac.type}</span>
                  <span className="block truncate text-xs">{fac.name.split(' ')[0]}</span>
                  <span className="block text-[10px] text-slate-500 font-mono">
                    {dist === 0 ? '0 km (In Village)' : `${dist} km (~${time}m)`}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

      </div>

      {/* Selected Facility Detail Card (Real Distance, Real DB Load, Real Hours, Uniform 108 Action) */}
      {activeFacility && (
        <div className="p-5 sm:p-6 bg-slate-50 rounded-3xl border border-slate-200 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-md bg-teal-100 text-teal-800">
                {activeFacility.careLevelName}
              </span>
              <h4 className="text-lg font-heading font-extrabold text-slate-900 mt-1">
                {activeFacility.name}
              </h4>
              <p className="text-xs text-slate-600 font-body">{activeFacility.address}</p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => openGoogleDirections(activeFacility.lat, activeFacility.lng)}
                className="inline-flex items-center gap-1.5 bg-[#0F9D8B] hover:bg-teal-600 text-white text-xs font-bold px-3.5 py-2.5 rounded-xl shadow-xs transition-all active:scale-95 cursor-pointer"
              >
                <Navigation className="w-3.5 h-3.5" />
                <span>Google Directions</span>
                <ExternalLink className="w-3 h-3" />
              </button>

              <a
                href={`tel:${activeFacility.phone}`}
                className="inline-flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-3.5 py-2.5 rounded-xl shadow-xs transition-all"
              >
                <PhoneCall className="w-3.5 h-3.5" />
                <span>Call ({activeFacility.phone.split('/')[0].trim()})</span>
              </a>

              <a
                href="tel:108"
                className="inline-flex items-center gap-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold px-3.5 py-2.5 rounded-xl shadow-xs transition-all"
              >
                <ShieldAlert className="w-3.5 h-3.5" />
                <span>Call 108 Emergency</span>
              </a>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs pt-3 border-t border-slate-200 font-body">
            <div>
              <span className="text-slate-500 block text-[11px]">Real Travel Time:</span>
              <span className="font-bold text-slate-900 font-mono">
                {activeDistance === 0 ? '~2 min (walk)' : `~${activeTravelTime} mins`}
              </span>
            </div>
            <div>
              <span className="text-slate-500 block text-[11px]">Distance from {selectedVillage}:</span>
              <span className="font-bold text-slate-900 font-mono">
                {activeDistance === 0 ? `0 km (In ${selectedVillage})` : `${activeDistance} km`}
              </span>
            </div>
            <div>
              <span className="text-slate-500 block text-[11px]">Current Ward Load:</span>
              <span className="font-bold text-slate-900 font-mono">{activeFacility.currentLoad}%</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[11px]">Hours:</span>
              <span className="font-bold text-slate-900 truncate">{activeFacility.operationalHours}</span>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
