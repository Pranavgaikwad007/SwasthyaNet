import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { 
  ScreeningSubmission, 
  HealthPressureSignal, 
  TimeLapseDayState,
  Facility,
  VillageProfile,
  UserChannel
} from '../types';
import { 
  MOCK_FACILITIES, 
  VILLAGES, 
  SEEDED_TIMELAPSE_DAYS, 
  SEED_RECENT_SCREENINGS 
} from '../data/mockData';
import { api } from '../services/api';

export type PageView = 
  | 'home' 
  | 'screening_citizen' 
  | 'screening_worker' 
  | 'voice_assistant'
  | 'result' 
  | 'facilities' 
  | 'dashboard' 
  | 'about';


export interface ScreeningDraft {
  channel: UserChannel;
  village: string;
  ageGroup: string;
  gender: string;
  durationDays: number;
  selectedSymptoms: string[];
  freeText: string;
  workerNotes: string;
  isDraft: boolean;
}

const defaultDraft: ScreeningDraft = {
  channel: 'citizen',
  village: 'Rampur',
  ageGroup: 'adult_15_59',
  gender: 'male',
  durationDays: 2,
  selectedSymptoms: [],
  freeText: '',
  workerNotes: '',
  isDraft: false
};

interface AppStateContextType {
  currentPage: PageView;
  previousPage: PageView;
  setCurrentPage: (page: PageView) => void;
  navigateBackToScreening: () => void;
  
  // Active Screening & Draft State for Preserved Navigation
  screeningDraft: ScreeningDraft;
  setScreeningDraft: React.Dispatch<React.SetStateAction<ScreeningDraft>>;
  updateDraftField: <K extends keyof ScreeningDraft>(key: K, value: ScreeningDraft[K]) => void;
  
  latestSubmission: ScreeningSubmission | null;
  setLatestSubmission: (sub: ScreeningSubmission | null) => void;
  allScreenings: ScreeningSubmission[];
  addScreeningSubmission: (sub: Omit<ScreeningSubmission, 'id' | 'timestamp' | 'anonymizedHash'>) => Promise<ScreeningSubmission>;
  
  // Facilities & Villages
  facilities: Facility[];
  villages: VillageProfile[];
  selectedVillage: string;
  setSelectedVillage: (v: string) => void;
  userLocationConsent: boolean;
  setUserLocationConsent: (consent: boolean) => void;
  
  // Time Lapse Demo Engine
  activeTimelapseDayIndex: number;
  setActiveTimelapseDayIndex: (index: number) => void;
  isTimelapsePlaying: boolean;
  setIsTimelapsePlaying: (playing: boolean) => void;
  timelapseDays: TimeLapseDayState[];
  currentDayState: TimeLapseDayState;
  
  // Live Backend Sync State
  isBackendConnected: boolean;
  activeAlerts: any[];
  liveDistrictSignals: HealthPressureSignal[];
  
  // Dynamic Real-time Signal Notification
  latestSignalBadge: { village: string; category: string; tier: string; timestamp: number } | null;
  clearLatestSignalBadge: () => void;
}

const AppStateContext = createContext<AppStateContextType | undefined>(undefined);

export const AppStateProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentPage, setCurrentPageState] = useState<PageView>('home');
  const [previousPage, setPreviousPage] = useState<PageView>('home');
  
  // Preserved Form State Draft
  const [screeningDraft, setScreeningDraft] = useState<ScreeningDraft>(defaultDraft);

  const [latestSubmission, setLatestSubmission] = useState<ScreeningSubmission | null>(null);
  const [allScreenings, setAllScreenings] = useState<ScreeningSubmission[]>(SEED_RECENT_SCREENINGS);
  const [facilities, setFacilities] = useState<Facility[]>(MOCK_FACILITIES);
  const [villages, setVillages] = useState<VillageProfile[]>(VILLAGES);
  const [selectedVillage, setSelectedVillage] = useState<string>('Rampur');
  const [userLocationConsent, setUserLocationConsent] = useState<boolean>(false);
  
  // Time-lapse state
  const [activeTimelapseDayIndex, setActiveTimelapseDayIndex] = useState<number>(5); // default to Day 5 (Spike) for instant demo punch
  const [isTimelapsePlaying, setIsTimelapsePlaying] = useState<boolean>(false);
  const timelapseDays = SEEDED_TIMELAPSE_DAYS;
  const currentDayState = timelapseDays[activeTimelapseDayIndex - 1] || timelapseDays[0];

  // Backend Live Telemetry
  const [isBackendConnected, setIsBackendConnected] = useState<boolean>(false);
  const [activeAlerts, setActiveAlerts] = useState<any[]>([]);
  const [liveDistrictSignals, setLiveDistrictSignals] = useState<HealthPressureSignal[]>([]);

  const [latestSignalBadge, setLatestSignalBadge] = useState<{
    village: string;
    category: string;
    tier: string;
    timestamp: number;
  } | null>(null);

  const setCurrentPage = (page: PageView) => {
    setPreviousPage(currentPage);
    setCurrentPageState(page);
  };

  const navigateBackToScreening = () => {
    const targetPage = screeningDraft.channel === 'worker' ? 'screening_worker' : 'screening_citizen';
    setCurrentPage(targetPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const updateDraftField = <K extends keyof ScreeningDraft>(key: K, value: ScreeningDraft[K]) => {
    setScreeningDraft(prev => ({
      ...prev,
      [key]: value,
      isDraft: true
    }));
  };

  // Sync with Backend API
  const fetchLiveBackendData = useCallback(async () => {
    try {
      const [facs, alertsData, stream, distSignals] = await Promise.allSettled([
        api.getFacilities(selectedVillage),
        api.getAlerts(),
        api.getTriageStream(),
        api.getDistrictHealthPressure()
      ]);

      if (facs.status === 'fulfilled' && facs.value.length > 0) {
        setFacilities(facs.value);
        setIsBackendConnected(true);
      }
      if (alertsData.status === 'fulfilled') {
        setActiveAlerts(alertsData.value);
      }
      if (stream.status === 'fulfilled' && stream.value.length > 0) {
        setAllScreenings(stream.value);
      }
      if (distSignals.status === 'fulfilled' && distSignals.value.length > 0) {
        setLiveDistrictSignals(distSignals.value);
      }
    } catch {
      // Graceful fallback to initial seeds if backend is not reachable
      setIsBackendConnected(false);
    }
  }, [selectedVillage]);

  // Initial fetch and 10s polling for live feel
  useEffect(() => {
    fetchLiveBackendData();
    const interval = setInterval(fetchLiveBackendData, 10000);
    return () => clearInterval(interval);
  }, [fetchLiveBackendData]);

  // Time-lapse playback timer
  useEffect(() => {
    let interval: any = null;
    if (isTimelapsePlaying) {
      interval = setInterval(() => {
        setActiveTimelapseDayIndex((prev) => {
          if (prev >= timelapseDays.length) {
            setIsTimelapsePlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, 2400);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTimelapsePlaying, timelapseDays.length]);

  const addScreeningSubmission = async (
    subData: Omit<ScreeningSubmission, 'id' | 'timestamp' | 'anonymizedHash'>
  ): Promise<ScreeningSubmission> => {
    let newSubmission: ScreeningSubmission;

    try {
      // Post to real FastAPI backend
      const response = await api.submitScreening({
        village_name: subData.village,
        age_group: subData.patientAgeGroup,
        gender: subData.patientGender,
        symptom_duration: subData.durationDays,
        red_flags: subData.redFlagTriggered ? (subData.symptoms.filter(s => s.startsWith('rf_')) || ['rf_emergency']) : [],
        symptoms: subData.symptoms,
        free_text: subData.freeTextSymptoms,
        submitted_by: subData.submittedBy,
        asha_field_notes: subData.notes
      });

      newSubmission = {
        ...subData,
        id: response.id,
        timestamp: response.created_at,
        anonymizedHash: response.anon_signal_id,
        riskTier: response.risk_tier as any,
        diseaseCategories: response.disease_categories as any,
        isAbstention: response.is_abstention,
        abstentionReason: response.abstention_reason,
        redFlagTriggered: response.is_red_flag,
        redFlagReason: response.red_flag_reason
      };
      setIsBackendConnected(true);
    } catch {
      // Client-side fallback if backend request fails
      const id = `scr-${Date.now().toString().slice(-4)}`;
      const randomHash = Math.random().toString(36).substring(2, 8);
      newSubmission = {
        ...subData,
        id,
        timestamp: new Date().toISOString(),
        anonymizedHash: `anon_sig_${randomHash}`
      };
    }

    setAllScreenings(prev => [newSubmission, ...prev.filter(s => s.id !== newSubmission.id)]);
    setLatestSubmission(newSubmission);

    // Trigger visual notification badge
    const domCat = newSubmission.diseaseCategories[0]?.category || 'General Assessment';
    setLatestSignalBadge({
      village: newSubmission.village,
      category: domCat,
      tier: newSubmission.riskTier,
      timestamp: Date.now()
    });

    return newSubmission;
  };

  const clearLatestSignalBadge = () => setLatestSignalBadge(null);

  return (
    <AppStateContext.Provider
      value={{
        currentPage,
        previousPage,
        setCurrentPage,
        navigateBackToScreening,
        screeningDraft,
        setScreeningDraft,
        updateDraftField,
        latestSubmission,
        setLatestSubmission,
        allScreenings,
        addScreeningSubmission,
        facilities,
        villages,
        selectedVillage,
        setSelectedVillage,
        userLocationConsent,
        setUserLocationConsent,
        activeTimelapseDayIndex,
        setActiveTimelapseDayIndex,
        isTimelapsePlaying,
        setIsTimelapsePlaying,
        timelapseDays,
        currentDayState,
        isBackendConnected,
        activeAlerts,
        liveDistrictSignals,
        latestSignalBadge,
        clearLatestSignalBadge
      }}
    >
      {children}
    </AppStateContext.Provider>
  );
};

export const useAppState = () => {
  const context = useContext(AppStateContext);
  if (!context) {
    throw new Error('useAppState must be used within an AppStateProvider');
  }
  return context;
};
