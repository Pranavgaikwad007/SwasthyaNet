import { 
  SymptomOption, 
  Facility, 
  HealthPressureSignal, 
  VillageProfile, 
  TimeLapseDayState,
  ScreeningSubmission
} from '../types';

export const SYMPTOM_OPTIONS: SymptomOption[] = [
  // Respiratory
  {
    id: 'sym_cough',
    label: 'Cough (Dry or with phlegm)',
    category: 'Respiratory',
    severityWeight: 2,
    indicatesCategories: ['respiratory_infection']
  },
  {
    id: 'sym_sore_throat',
    label: 'Sore throat or pain when swallowing',
    category: 'Respiratory',
    severityWeight: 1,
    indicatesCategories: ['respiratory_infection']
  },
  {
    id: 'sym_runny_nose',
    label: 'Runny nose / nasal congestion',
    category: 'Respiratory',
    severityWeight: 1,
    indicatesCategories: ['respiratory_infection']
  },
  {
    id: 'sym_wheezing',
    label: 'Wheezing or whistling sound in chest',
    category: 'Respiratory',
    severityWeight: 3,
    indicatesCategories: ['respiratory_infection']
  },
  {
    id: 'sym_chest_congestion',
    label: 'Chest tightness / congestion',
    category: 'Respiratory',
    severityWeight: 2,
    indicatesCategories: ['respiratory_infection']
  },

  // Fever & Infection
  {
    id: 'sym_high_fever',
    label: 'High fever (Body hot to touch > 101°F / 38.3°C)',
    category: 'Fever & Infection',
    severityWeight: 3,
    indicatesCategories: ['acute_febrile', 'respiratory_infection']
  },
  {
    id: 'sym_fever_mild',
    label: 'Mild or recurring fever / warmth',
    category: 'Fever & Infection',
    severityWeight: 1,
    indicatesCategories: ['acute_febrile', 'respiratory_infection', 'urinary_tract']
  },
  {
    id: 'sym_chills',
    label: 'Chills and shivering episodes',
    category: 'Fever & Infection',
    severityWeight: 2,
    indicatesCategories: ['acute_febrile']
  },
  {
    id: 'sym_body_ache',
    label: 'Severe generalized body / muscle aches',
    category: 'Fever & Infection',
    severityWeight: 2,
    indicatesCategories: ['acute_febrile']
  },
  {
    id: 'sym_joint_pain',
    label: 'Acute severe joint pain',
    category: 'Fever & Infection',
    severityWeight: 2,
    indicatesCategories: ['acute_febrile', 'musculoskeletal_trauma']
  },
  {
    id: 'sym_eye_pain',
    label: 'Pain behind the eyes (Retro-orbital pain)',
    category: 'Fever & Infection',
    severityWeight: 2,
    indicatesCategories: ['acute_febrile']
  },

  // Gastrointestinal
  {
    id: 'sym_watery_diarrhea',
    label: 'Watery loose stools (> 3 times per day)',
    category: 'Gastrointestinal',
    severityWeight: 3,
    indicatesCategories: ['acute_gastroenteritis']
  },
  {
    id: 'sym_vomiting',
    label: 'Vomiting / unable to keep liquids down',
    category: 'Gastrointestinal',
    severityWeight: 3,
    indicatesCategories: ['acute_gastroenteritis']
  },
  {
    id: 'sym_stomach_cramps',
    label: 'Abdominal cramps / sharp stomach pain',
    category: 'Gastrointestinal',
    severityWeight: 2,
    indicatesCategories: ['acute_gastroenteritis']
  },
  {
    id: 'sym_nausea',
    label: 'Nausea or loss of appetite',
    category: 'Gastrointestinal',
    severityWeight: 1,
    indicatesCategories: ['acute_gastroenteritis', 'acute_febrile']
  },
  {
    id: 'sym_mild_dehydration',
    label: 'Dry mouth, increased thirst, dark yellow urine',
    category: 'Gastrointestinal',
    severityWeight: 2,
    indicatesCategories: ['acute_gastroenteritis']
  },

  // Neurological & Pain
  {
    id: 'sym_headache_severe',
    label: 'Severe throbbing headache',
    category: 'Neurological & Pain',
    severityWeight: 2,
    indicatesCategories: ['acute_febrile', 'chronic_metabolic_hypertension']
  },
  {
    id: 'sym_dizziness',
    label: 'Dizziness or feeling lightheaded when standing',
    category: 'Neurological & Pain',
    severityWeight: 2,
    indicatesCategories: ['chronic_metabolic_hypertension']
  },
  {
    id: 'sym_back_pain',
    label: 'Lower back or spine strain',
    category: 'Neurological & Pain',
    severityWeight: 1,
    indicatesCategories: ['musculoskeletal_trauma', 'urinary_tract']
  },

  // General & Chronic / Skin
  {
    id: 'sym_skin_rash',
    label: 'Skin rash, red spots, or localized itching',
    category: 'General & Chronic',
    severityWeight: 1,
    indicatesCategories: ['dermatological', 'acute_febrile']
  },
  {
    id: 'sym_burning_urination',
    label: 'Burning sensation or pain when urinating',
    category: 'General & Chronic',
    severityWeight: 2,
    indicatesCategories: ['urinary_tract']
  },
  {
    id: 'sym_excessive_thirst',
    label: 'Excessive thirst and frequent night urination',
    category: 'General & Chronic',
    severityWeight: 2,
    indicatesCategories: ['chronic_metabolic_hypertension']
  },
  {
    id: 'sym_fatigue_chronic',
    label: 'Extreme unusual weakness and fatigue',
    category: 'General & Chronic',
    severityWeight: 2,
    indicatesCategories: ['complex_systemic', 'acute_febrile']
  },
  {
    id: 'sym_jaundice',
    label: 'Yellowing of eyes / skin (Jaundice)',
    category: 'General & Chronic',
    severityWeight: 4,
    indicatesCategories: ['complex_systemic', 'acute_gastroenteritis']
  },

  // Maternal & Child Special Flags
  {
    id: 'sym_rapid_breathing',
    label: 'Child: Breathing much faster than normal or nostril flaring',
    category: 'Maternal & Child',
    severityWeight: 4,
    indicatesCategories: ['respiratory_infection']
  },
  {
    id: 'sym_unable_to_feed',
    label: 'Child: Unable to drink milk, breastfeed, or keep fluids',
    category: 'Maternal & Child',
    severityWeight: 4,
    indicatesCategories: ['acute_gastroenteritis', 'respiratory_infection']
  },
  {
    id: 'sym_vaginal_bleeding',
    label: 'Pregnant: Any spotting, vaginal bleeding, or fluid leakage',
    category: 'Maternal & Child',
    severityWeight: 5,
    isRedFlagTrigger: true,
    redFlagReason: 'Obstetric Emergency in Pregnancy',
    indicatesCategories: ['complex_systemic']
  }
];

export const VILLAGES: VillageProfile[] = [
  {
    name: 'Rampur',
    district: 'Sitapur District',
    population: 3420,
    primaryFacilityId: 'fac_hwc_rampur',
    lat: 27.5706,
    lng: 80.6698,
    recentTrends: {
      respiratory: 42,
      gastrointestinal: 78,
      fever: 84
    }
  },
  {
    name: 'Chandanpur',
    district: 'Sitapur District',
    population: 4150,
    primaryFacilityId: 'fac_phc_chandanpur',
    lat: 27.5921,
    lng: 80.7125,
    recentTrends: {
      respiratory: 35,
      gastrointestinal: 40,
      fever: 48
    }
  },
  {
    name: 'Shivgarh',
    district: 'Sitapur District',
    population: 2890,
    primaryFacilityId: 'fac_chc_shivgarh',
    lat: 27.5342,
    lng: 80.6210,
    recentTrends: {
      respiratory: 18,
      gastrointestinal: 22,
      fever: 19
    }
  },
  {
    name: 'Harinagar',
    district: 'Sitapur District',
    population: 1980,
    primaryFacilityId: 'fac_hwc_rampur',
    lat: 27.6110,
    lng: 80.6450,
    recentTrends: {
      respiratory: 12,
      gastrointestinal: 15,
      fever: 14
    }
  },
  {
    name: 'Bhelwara',
    district: 'Sitapur District',
    population: 2450,
    primaryFacilityId: 'fac_phc_chandanpur',
    lat: 27.5615,
    lng: 80.7480,
    recentTrends: {
      respiratory: 20,
      gastrointestinal: 24,
      fever: 22
    }
  }
];

export const MOCK_FACILITIES: Facility[] = [
  {
    id: 'fac_hwc_rampur',
    name: 'Ayushman Arogya Mandir (HWC) Rampur',
    type: 'HWC',
    careLevelName: 'Health & Wellness Centre (Sub-Centre)',
    village: 'Rampur',
    distanceKm: 0.8,
    travelTimeMin: 6,
    servicesOffered: [
      'Basic Symptom Screening',
      'Blood Pressure & Glucose Check',
      'Rapid Malaria / Dengue Kit Test',
      'Oral Rehydration Therapy (ORS Corner)',
      'Maternal & Child Immunization Advice',
      'Tele-consultation to PHC Doctor'
    ],
    capacityPerDay: 45,
    currentLoad: 42, // %
    currentWaitTimeMin: 10,
    operationalHours: '9:00 AM – 5:00 PM (Mon–Sat)',
    phone: '+91 94501 22891',
    address: 'Near Gram Panchayat Bhavan, Rampur Village',
    lat: 27.5706,
    lng: 80.6698,
    ambulanceAvailable: false,
    specialties: ['Community Health Officer (CHO)', 'ANM Staff Nurse', 'ASHA Facilitation'],
    isEmergencyCenter: false
  },
  {
    id: 'fac_phc_chandanpur',
    name: 'Chandanpur 24x7 Primary Health Centre (PHC)',
    type: 'PHC',
    careLevelName: 'Primary Health Centre (24x7 Clinical)',
    village: 'Chandanpur',
    distanceKm: 5.4,
    travelTimeMin: 18,
    servicesOffered: [
      'MBBS Medical Officer Consultation',
      'Basic Diagnostic Lab (CBC, Urine, Smear)',
      'Pharmacy & Free Essential Supplies',
      '24x7 Normal Delivery Room (Labour Ward)',
      'IV Fluid Administration & Observation Beds',
      'Emergency First Aid & Stabilization'
    ],
    capacityPerDay: 120,
    currentLoad: 68,
    currentWaitTimeMin: 25,
    operationalHours: '24x7 Emergency & Inpatient / OPD: 8:00 AM – 2:00 PM',
    phone: '+91 94150 88219',
    address: 'Main Road, Opposite Block Development Office, Chandanpur',
    lat: 27.5921,
    lng: 80.7125,
    ambulanceAvailable: true,
    specialties: ['General Medicine', 'Maternal Health', 'Pediatric Primary Care'],
    isEmergencyCenter: false
  },
  {
    id: 'fac_chc_shivgarh',
    name: 'Shivgarh Community Health Centre (CHC)',
    type: 'CHC',
    careLevelName: 'Community Health Centre (First Referral Unit)',
    village: 'Shivgarh',
    distanceKm: 12.8,
    travelTimeMin: 32,
    servicesOffered: [
      'Specialist Doctors (Physician, Gynecologist, Pediatrician)',
      '30-Bed Inpatient Ward',
      'Digital X-Ray & Ultrasound Diagnostics',
      'Comprehensive Blood Biochemistry Lab',
      'Minor Operation Theatre',
      '24x7 108 Ambulance Hub Station'
    ],
    capacityPerDay: 280,
    currentLoad: 74,
    currentWaitTimeMin: 40,
    operationalHours: '24x7 Full Inpatient, Casualty & Diagnostic Services',
    phone: '+91 94511 44102',
    address: 'Tehsil Road, Shivgarh Central Crossing',
    lat: 27.5342,
    lng: 80.6210,
    ambulanceAvailable: true,
    specialties: ['Internal Medicine', 'Obstetrics & Gynecology', 'Pediatrics', 'General Surgery'],
    isEmergencyCenter: true
  },
  {
    id: 'fac_dist_sitapur',
    name: 'Sitapur District Hospital (Emergency Trauma Centre)',
    type: 'DISTRICT_HOSPITAL',
    careLevelName: 'District Hospital (Tertiary & Critical Care)',
    village: 'Sitapur HQ',
    distanceKm: 24.5,
    travelTimeMin: 48,
    servicesOffered: [
      '24x7 Critical Care / Intensive Care Unit (ICU)',
      'Dedicated Trauma & Emergency Ward',
      'Blood Bank & 24x7 Advanced Pathology',
      'CT Scan, Advanced Ultrasound & ECG',
      'Pediatric Intensive Care Unit (PICU) & SNCU',
      'Emergency Surgical Theatres'
    ],
    capacityPerDay: 850,
    currentLoad: 88,
    currentWaitTimeMin: 30,
    operationalHours: '24x7 Dedicated Emergency & Trauma Care',
    phone: '108 (Toll-Free Emergency) / +91 5862 242100',
    address: 'Hospital Road, Civil Lines, Sitapur HQ',
    lat: 27.5680,
    lng: 80.6780,
    ambulanceAvailable: true,
    specialties: ['Emergency Medicine', 'Critical Care', 'Cardiology', 'Neurology', 'Neonatology'],
    isEmergencyCenter: true
  }
];

// Seeded Time-Lapse Data across 7 Days showing rising Health Pressure in Rampur
export const SEEDED_TIMELAPSE_DAYS: TimeLapseDayState[] = [
  {
    dayIndex: 1,
    dateLabel: 'Day 1 (Baseline)',
    screeningsCount: 14,
    highlightVillage: 'Rampur',
    eventDescription: 'Normal seasonal baseline. Isolated mild cough and general fatigue reported across villages.',
    signals: [
      {
        village: 'Rampur',
        date: '2026-08-16',
        caseCount: 4,
        dominantCategory: 'Acute Respiratory Condition',
        pressureScore: 18,
        trend: 'flat',
        baselineCases: 5,
        activeAlert: false,
        alertSeverity: 'LOW',
        alertMessage: 'Normal baseline activity in Rampur. No unusual symptom clusters detected.',
        highRiskPercentage: 0,
        categoryBreakdown: { 'Acute Respiratory Condition': 3, 'Musculoskeletal': 1 }
      },
      {
        village: 'Chandanpur',
        date: '2026-08-16',
        caseCount: 5,
        dominantCategory: 'Chronic NCD',
        pressureScore: 14,
        trend: 'flat',
        baselineCases: 6,
        activeAlert: false,
        alertSeverity: 'LOW',
        alertMessage: 'Normal baseline activity in Chandanpur.',
        highRiskPercentage: 0,
        categoryBreakdown: { 'Chronic NCD': 3, 'Respiratory': 2 }
      },
      {
        village: 'Shivgarh',
        date: '2026-08-16',
        caseCount: 5,
        dominantCategory: 'Musculoskeletal',
        pressureScore: 12,
        trend: 'flat',
        baselineCases: 5,
        activeAlert: false,
        alertSeverity: 'LOW',
        alertMessage: 'Normal baseline activity in Shivgarh.',
        highRiskPercentage: 0,
        categoryBreakdown: { 'Musculoskeletal': 3, 'General': 2 }
      }
    ]
  },
  {
    dayIndex: 2,
    dateLabel: 'Day 2',
    screeningsCount: 19,
    highlightVillage: 'Rampur',
    eventDescription: 'Slight uptick in acute fever screenings reported by ASHA workers in North Rampur hamlet.',
    signals: [
      {
        village: 'Rampur',
        date: '2026-08-17',
        caseCount: 7,
        dominantCategory: 'Acute Febrile Syndrome',
        pressureScore: 28,
        trend: 'up',
        baselineCases: 5,
        activeAlert: false,
        alertSeverity: 'LOW',
        alertMessage: 'Mild increase in febrile screenings in Rampur within standard deviation.',
        highRiskPercentage: 14,
        categoryBreakdown: { 'Acute Febrile Syndrome': 4, 'Respiratory': 2, 'Gastrointestinal': 1 }
      },
      {
        village: 'Chandanpur',
        date: '2026-08-17',
        caseCount: 6,
        dominantCategory: 'Acute Respiratory Condition',
        pressureScore: 16,
        trend: 'flat',
        baselineCases: 6,
        activeAlert: false,
        alertSeverity: 'LOW',
        alertMessage: 'Normal activity in Chandanpur.',
        highRiskPercentage: 0,
        categoryBreakdown: { 'Respiratory': 3, 'Chronic NCD': 2, 'Skin': 1 }
      },
      {
        village: 'Shivgarh',
        date: '2026-08-17',
        caseCount: 6,
        dominantCategory: 'Musculoskeletal',
        pressureScore: 15,
        trend: 'flat',
        baselineCases: 5,
        activeAlert: false,
        alertSeverity: 'LOW',
        alertMessage: 'Normal activity in Shivgarh.',
        highRiskPercentage: 0,
        categoryBreakdown: { 'Musculoskeletal': 4, 'Respiratory': 2 }
      }
    ]
  },
  {
    dayIndex: 3,
    dateLabel: 'Day 3',
    screeningsCount: 28,
    highlightVillage: 'Rampur',
    eventDescription: 'Concentrated surge: 8 new households in Rampur report high fever with joint chills and nausea.',
    signals: [
      {
        village: 'Rampur',
        date: '2026-08-18',
        caseCount: 12,
        dominantCategory: 'Acute Febrile Syndrome',
        pressureScore: 46,
        trend: 'up',
        baselineCases: 5,
        activeAlert: false,
        alertSeverity: 'MODERATE',
        alertMessage: 'Moderate increase in febrile illness in Rampur. Monitored for cluster formation.',
        highRiskPercentage: 25,
        categoryBreakdown: { 'Acute Febrile Syndrome': 8, 'Gastrointestinal': 3, 'Respiratory': 1 }
      },
      {
        village: 'Chandanpur',
        date: '2026-08-18',
        caseCount: 8,
        dominantCategory: 'Acute Febrile Syndrome',
        pressureScore: 24,
        trend: 'up',
        baselineCases: 6,
        activeAlert: false,
        alertSeverity: 'LOW',
        alertMessage: 'Normal activity in Chandanpur.',
        highRiskPercentage: 12,
        categoryBreakdown: { 'Acute Febrile Syndrome': 4, 'Respiratory': 2, 'Other': 2 }
      },
      {
        village: 'Shivgarh',
        date: '2026-08-18',
        caseCount: 8,
        dominantCategory: 'Musculoskeletal',
        pressureScore: 18,
        trend: 'flat',
        baselineCases: 5,
        activeAlert: false,
        alertSeverity: 'LOW',
        alertMessage: 'Normal activity in Shivgarh.',
        highRiskPercentage: 0,
        categoryBreakdown: { 'Musculoskeletal': 5, 'Respiratory': 3 }
      }
    ]
  },
  {
    dayIndex: 4,
    dateLabel: 'Day 4',
    screeningsCount: 39,
    highlightVillage: 'Rampur',
    eventDescription: 'Rampur daily volume reaches 3x baseline. Symptoms show consistent Acute Febrile cluster.',
    signals: [
      {
        village: 'Rampur',
        date: '2026-08-19',
        caseCount: 18,
        dominantCategory: 'Acute Febrile Syndrome',
        pressureScore: 64,
        trend: 'up',
        baselineCases: 5,
        activeAlert: true,
        alertSeverity: 'ELEVATED',
        alertMessage: 'Unusual increase in similar reported symptoms in Rampur. Increased screening capacity may be required.',
        highRiskPercentage: 38,
        categoryBreakdown: { 'Acute Febrile Syndrome': 13, 'Gastrointestinal': 4, 'Respiratory': 1 }
      },
      {
        village: 'Chandanpur',
        date: '2026-08-19',
        caseCount: 11,
        dominantCategory: 'Acute Febrile Syndrome',
        pressureScore: 38,
        trend: 'up',
        baselineCases: 6,
        activeAlert: false,
        alertSeverity: 'MODERATE',
        alertMessage: 'Moderate uptick in Chandanpur neighboring Rampur border.',
        highRiskPercentage: 18,
        categoryBreakdown: { 'Acute Febrile Syndrome': 6, 'Respiratory': 3, 'Gastrointestinal': 2 }
      },
      {
        village: 'Shivgarh',
        date: '2026-08-19',
        caseCount: 10,
        dominantCategory: 'Respiratory',
        pressureScore: 22,
        trend: 'flat',
        baselineCases: 5,
        activeAlert: false,
        alertSeverity: 'LOW',
        alertMessage: 'Normal baseline activity in Shivgarh.',
        highRiskPercentage: 0,
        categoryBreakdown: { 'Respiratory': 6, 'Musculoskeletal': 4 }
      }
    ]
  },
  {
    dayIndex: 5,
    dateLabel: 'Day 5 (Early Warning Spike)',
    screeningsCount: 54,
    highlightVillage: 'Rampur',
    eventDescription: 'CRITICAL EARLY-WARNING TRIGGER: Health Pressure reaches 79/100. Automated alert surfaced to Chandanpur PHC and Rampur HWC.',
    signals: [
      {
        village: 'Rampur',
        date: '2026-08-20',
        caseCount: 26,
        dominantCategory: 'Acute Febrile Syndrome',
        pressureScore: 79,
        trend: 'up',
        baselineCases: 5,
        activeAlert: true,
        alertSeverity: 'HIGH',
        alertMessage: 'Unusual increase in similar reported symptoms in Rampur. Increased screening capacity may be required.',
        highRiskPercentage: 50,
        categoryBreakdown: { 'Acute Febrile Syndrome': 19, 'Gastrointestinal': 5, 'Respiratory': 2 }
      },
      {
        village: 'Chandanpur',
        date: '2026-08-20',
        caseCount: 16,
        dominantCategory: 'Acute Febrile Syndrome',
        pressureScore: 54,
        trend: 'up',
        baselineCases: 6,
        activeAlert: true,
        alertSeverity: 'ELEVATED',
        alertMessage: 'Unusual increase in similar reported symptoms in Chandanpur. Increased screening capacity may be required.',
        highRiskPercentage: 31,
        categoryBreakdown: { 'Acute Febrile Syndrome': 10, 'Gastrointestinal': 4, 'Respiratory': 2 }
      },
      {
        village: 'Shivgarh',
        date: '2026-08-20',
        caseCount: 12,
        dominantCategory: 'Musculoskeletal',
        pressureScore: 26,
        trend: 'flat',
        baselineCases: 5,
        activeAlert: false,
        alertSeverity: 'LOW',
        alertMessage: 'Normal baseline activity in Shivgarh.',
        highRiskPercentage: 8,
        categoryBreakdown: { 'Musculoskeletal': 6, 'Respiratory': 4, 'Other': 2 }
      }
    ]
  },
  {
    dayIndex: 6,
    dateLabel: 'Day 6',
    screeningsCount: 68,
    highlightVillage: 'Rampur',
    eventDescription: 'Peak pressure (89/100). Medical Officer dispatches mobile fever screening team & rapid testing supplies.',
    signals: [
      {
        village: 'Rampur',
        date: '2026-08-21',
        caseCount: 32,
        dominantCategory: 'Acute Febrile Syndrome',
        pressureScore: 89,
        trend: 'up',
        baselineCases: 5,
        activeAlert: true,
        alertSeverity: 'HIGH',
        alertMessage: 'Unusual increase in similar reported symptoms in Rampur. Increased screening capacity may be required.',
        highRiskPercentage: 56,
        categoryBreakdown: { 'Acute Febrile Syndrome': 24, 'Gastrointestinal': 6, 'Respiratory': 2 }
      },
      {
        village: 'Chandanpur',
        date: '2026-08-21',
        caseCount: 22,
        dominantCategory: 'Acute Febrile Syndrome',
        pressureScore: 68,
        trend: 'up',
        baselineCases: 6,
        activeAlert: true,
        alertSeverity: 'ELEVATED',
        alertMessage: 'Unusual increase in similar reported symptoms in Chandanpur. Increased screening capacity may be required.',
        highRiskPercentage: 41,
        categoryBreakdown: { 'Acute Febrile Syndrome': 15, 'Gastrointestinal': 5, 'Respiratory': 2 }
      },
      {
        village: 'Shivgarh',
        date: '2026-08-21',
        caseCount: 14,
        dominantCategory: 'Musculoskeletal',
        pressureScore: 28,
        trend: 'flat',
        baselineCases: 5,
        activeAlert: false,
        alertSeverity: 'LOW',
        alertMessage: 'Normal baseline activity in Shivgarh.',
        highRiskPercentage: 7,
        categoryBreakdown: { 'Musculoskeletal': 7, 'Respiratory': 4, 'Other': 3 }
      }
    ]
  },
  {
    dayIndex: 7,
    dateLabel: 'Day 7 (Proactive Response Deployed)',
    screeningsCount: 48,
    highlightVillage: 'Rampur',
    eventDescription: 'PHC mobile camp deployed in Rampur. RDT testing identified localized vector cluster; early treatment underway before hospital overload.',
    signals: [
      {
        village: 'Rampur',
        date: '2026-08-22',
        caseCount: 21,
        dominantCategory: 'Acute Febrile Syndrome',
        pressureScore: 62,
        trend: 'down',
        baselineCases: 5,
        activeAlert: true,
        alertSeverity: 'ELEVATED',
        alertMessage: 'Unusual increase in similar reported symptoms in Rampur. Increased screening capacity may be required.',
        highRiskPercentage: 33,
        categoryBreakdown: { 'Acute Febrile Syndrome': 14, 'Gastrointestinal': 5, 'Respiratory': 2 }
      },
      {
        village: 'Chandanpur',
        date: '2026-08-22',
        caseCount: 17,
        dominantCategory: 'Acute Febrile Syndrome',
        pressureScore: 50,
        trend: 'down',
        baselineCases: 6,
        activeAlert: true,
        alertSeverity: 'MODERATE',
        alertMessage: 'Screening volume stabilizing under active field intervention.',
        highRiskPercentage: 24,
        categoryBreakdown: { 'Acute Febrile Syndrome': 10, 'Gastrointestinal': 4, 'Respiratory': 3 }
      },
      {
        village: 'Shivgarh',
        date: '2026-08-22',
        caseCount: 10,
        dominantCategory: 'Musculoskeletal',
        pressureScore: 20,
        trend: 'down',
        baselineCases: 5,
        activeAlert: false,
        alertSeverity: 'LOW',
        alertMessage: 'Normal baseline activity in Shivgarh.',
        highRiskPercentage: 0,
        categoryBreakdown: { 'Musculoskeletal': 6, 'Respiratory': 3, 'Other': 1 }
      }
    ]
  }
];

// Seed recent screening queue items for realistic facility view
export const SEED_RECENT_SCREENINGS: ScreeningSubmission[] = [
  {
    id: 'scr-9021',
    submittedBy: 'worker',
    patientAgeGroup: 'adult_15_59',
    patientGender: 'male',
    village: 'Rampur',
    symptoms: ['sym_high_fever', 'sym_chills', 'sym_body_ache', 'sym_eye_pain'],
    durationDays: 3,
    riskTier: 'ORANGE',
    diseaseCategories: [
      {
        category: 'Acute Febrile Syndrome',
        confidence: 84,
        description: 'Systemic febrile illness requiring rapid point-of-care testing.',
        typicalCareLevel: 'PHC',
        commonIndicators: ['sym_high_fever', 'sym_chills', 'sym_body_ache']
      },
      {
        category: 'Acute Respiratory Condition',
        confidence: 42,
        description: 'Upper respiratory infection.',
        typicalCareLevel: 'PHC',
        commonIndicators: ['sym_high_fever']
      }
    ],
    isAbstention: false,
    redFlagTriggered: false,
    timestamp: '2026-08-22T08:14:00Z',
    anonymizedHash: 'anon_sig_a74f81'
  },
  {
    id: 'scr-9022',
    submittedBy: 'citizen',
    patientAgeGroup: 'child_5_14',
    patientGender: 'female',
    village: 'Rampur',
    symptoms: ['sym_watery_diarrhea', 'sym_vomiting', 'sym_stomach_cramps'],
    durationDays: 2,
    riskTier: 'YELLOW',
    diseaseCategories: [
      {
        category: 'Gastrointestinal / Diarrheal Illness',
        confidence: 86,
        description: 'Waterborne infection causing acute fluid loss.',
        typicalCareLevel: 'HWC',
        commonIndicators: ['sym_watery_diarrhea', 'sym_vomiting']
      }
    ],
    isAbstention: false,
    redFlagTriggered: false,
    timestamp: '2026-08-22T08:32:00Z',
    anonymizedHash: 'anon_sig_c99b12'
  },
  {
    id: 'scr-9023',
    submittedBy: 'worker',
    patientAgeGroup: 'senior_60_plus',
    patientGender: 'female',
    village: 'Chandanpur',
    symptoms: ['sym_cough', 'sym_sore_throat', 'sym_fever_mild'],
    durationDays: 4,
    riskTier: 'YELLOW',
    diseaseCategories: [
      {
        category: 'Acute Respiratory Condition',
        confidence: 76,
        description: 'Infection of upper respiratory tract.',
        typicalCareLevel: 'PHC',
        commonIndicators: ['sym_cough', 'sym_sore_throat']
      }
    ],
    isAbstention: false,
    redFlagTriggered: false,
    timestamp: '2026-08-22T09:05:00Z',
    anonymizedHash: 'anon_sig_e120da'
  },
  {
    id: 'scr-9024',
    submittedBy: 'citizen',
    patientAgeGroup: 'adult_15_59',
    patientGender: 'female',
    village: 'Shivgarh',
    symptoms: ['sym_back_pain', 'sym_body_ache'],
    durationDays: 1,
    riskTier: 'GREEN',
    diseaseCategories: [
      {
        category: 'Musculoskeletal / Pain Disorder',
        confidence: 68,
        description: 'Physical strain / posture fatigue.',
        typicalCareLevel: 'HWC',
        commonIndicators: ['sym_back_pain']
      }
    ],
    isAbstention: false,
    redFlagTriggered: false,
    timestamp: '2026-08-22T09:40:00Z',
    anonymizedHash: 'anon_sig_f839c4'
  }
];
