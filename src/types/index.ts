export type RiskTier = 'GREEN' | 'YELLOW' | 'ORANGE' | 'RED';

export type UserChannel = 'citizen' | 'worker';

export type CareLevel = 'HWC' | 'PHC' | 'CHC' | 'DISTRICT_HOSPITAL';

export interface DiseaseCategoryConfidence {
  category: string;
  confidence: number; // 0 - 100
  description: string;
  typicalCareLevel: CareLevel;
  commonIndicators: string[];
}

export interface SymptomOption {
  id: string;
  label: string;
  category: 'Respiratory' | 'Fever & Infection' | 'Gastrointestinal' | 'Neurological & Pain' | 'Maternal & Child' | 'General & Chronic';
  severityWeight: number; // 1 to 5
  isRedFlagTrigger?: boolean;
  redFlagReason?: string;
  indicatesCategories: string[];
}

export interface RedFlagCheckResult {
  isTriggered: boolean;
  reason?: string;
  suggestedImmediateAction?: string;
}

export interface ScreeningSubmission {
  id: string;
  submittedBy: UserChannel;
  patientAgeGroup: 'child_under_5' | 'child_5_14' | 'adult_15_59' | 'senior_60_plus' | 'pregnant';
  patientGender: 'male' | 'female' | 'other' | 'prefer_not_to_say';
  village: string;
  symptoms: string[];
  freeTextSymptoms?: string;
  durationDays: number;
  riskTier: RiskTier;
  diseaseCategories: DiseaseCategoryConfidence[];
  isAbstention: boolean;
  abstentionReason?: string;
  redFlagTriggered: boolean;
  redFlagReason?: string;
  timestamp: string; // ISO string
  anonymizedHash: string;
  notes?: string;
}

export interface Facility {
  id: string;
  name: string;
  type: CareLevel;
  careLevelName: string;
  village: string;
  distanceKm: number;
  travelTimeMin: number;
  servicesOffered: string[];
  capacityPerDay: number;
  currentLoad: number; // e.g. 78%
  currentWaitTimeMin: number;
  operationalHours: string;
  phone: string;
  address: string;
  lat: number;
  lng: number;
  ambulanceAvailable: boolean;
  specialties: string[];
  isEmergencyCenter: boolean;
  suitabilityScore?: number;
}

export interface HealthPressureSignal {
  village: string;
  date: string;
  caseCount: number;
  dominantCategory: string;
  pressureScore: number; // 0 to 100
  trend: 'up' | 'flat' | 'down';
  baselineCases: number;
  activeAlert: boolean;
  alertSeverity: 'LOW' | 'MODERATE' | 'ELEVATED' | 'HIGH';
  alertMessage: string;
  highRiskPercentage: number;
  categoryBreakdown: Record<string, number>;
}

export interface VillageProfile {
  name: string;
  district: string;
  population: number;
  primaryFacilityId: string;
  lat: number;
  lng: number;
  recentTrends: {
    respiratory: number;
    gastrointestinal: number;
    fever: number;
  };
}

export interface TimeLapseDayState {
  dayIndex: number;
  dateLabel: string;
  screeningsCount: number;
  signals: HealthPressureSignal[];
  highlightVillage: string;
  eventDescription: string;
}

// ---------------------------------------------------------------------------
// Multilingual Health Voice Assistant Types
// ---------------------------------------------------------------------------

export type SupportedLanguageCode = 
  | 'auto'
  | 'hi'  // Hindi
  | 'mr'  // Marathi
  | 'bn'  // Bengali
  | 'te'  // Telugu
  | 'ta'  // Tamil
  | 'gu'  // Gujarati
  | 'kn'  // Kannada
  | 'ml'  // Malayalam
  | 'pa'  // Punjabi
  | 'or'  // Odia
  | 'as'  // Assamese
  | 'ur'  // Urdu
  | 'en'; // English

export interface LanguageOption {
  code: SupportedLanguageCode;
  name: string;
  nativeName: string;
  scriptLabel: string;
  speechCode: string;
  flag?: string;
}

export interface PossibleCondition {
  id: string;
  name: string;
  explanation: string;
  commonSymptoms: string[];
  whyRelevant: string;
  whenToSeeDoctor: string;
  severityLevel: 'low' | 'moderate' | 'high' | 'urgent';
  suggestedCareFacility?: 'HWC' | 'PHC' | 'CHC' | 'DISTRICT_HOSPITAL';
}

export interface VoiceAssistantMessage {
  id: string;
  sender: 'user' | 'assistant' | 'system';
  text: string;
  spokenAudioText?: string;
  languageCode?: SupportedLanguageCode;
  detectedLanguage?: string;
  timestamp: string;
  inputMode: 'voice' | 'text' | 'action';
  isRedFlagAlert?: boolean;
  redFlagReason?: string;
  emergencyPhone?: string;
  possibleConditions?: PossibleCondition[];
  suggestedFollowUpQuestions?: string[];
  quickResponses?: string[];
  isThinking?: boolean;
  isAudioPlaying?: boolean;
  isMedicineQuery?: boolean;
  medicineSafetyNote?: string;
  showFacilityRecommendation?: boolean;
}

export interface DemoScenario {
  id: string;
  title: string;
  languageCode: SupportedLanguageCode;
  languageName: string;
  userPrompt: string;
  assistantReplies: string[];
  sampleSymptoms: string[];
  conditions: PossibleCondition[];
  isRedFlag?: boolean;
}

export interface VoiceAssistantState {
  currentLanguage: SupportedLanguageCode;
  isListening: boolean;
  isSpeaking: boolean;
  isMuted: boolean;
  isDemoMode: boolean;
  messages: VoiceAssistantMessage[];
  lastSpokenText: string;
  micPermissionState: 'prompt' | 'granted' | 'denied' | 'unsupported';
  recognizedTranscript: string;
  interimTranscript: string;
  errorMessage: string | null;
  activeFollowUpsCollected: {
    durationDays?: number;
    severity?: 'mild' | 'moderate' | 'severe';
    temperatureKnown?: boolean;
    accompanyingSymptoms?: string[];
    patientAgeGroup?: string;
    existingConditions?: string[];
  };
}

