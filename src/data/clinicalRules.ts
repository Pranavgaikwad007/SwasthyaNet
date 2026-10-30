import { 
  RiskTier, 
  DiseaseCategoryConfidence, 
  RedFlagCheckResult, 
  CareLevel, 
  Facility 
} from '../types';

export const RED_FLAG_SYMPTOMS = [
  {
    id: 'rf_chest_pain',
    label: 'Chest pain with sweating, shortness of breath, or pain radiating to left arm/jaw',
    reason: 'Possible Acute Coronary Event / Cardiac Emergency'
  },
  {
    id: 'rf_breathless_rest',
    label: 'Severe breathlessness or gasping while sitting still at rest',
    reason: 'Critical Respiratory Distress / Airway Compromise'
  },
  {
    id: 'rf_altered_mental',
    label: 'Altered consciousness, confusion, sudden fainting, or active convulsions/seizures',
    reason: 'Acute Neurological Emergency / Hypoxia'
  },
  {
    id: 'rf_maternal_bleeding',
    label: 'Vaginal bleeding or severe sudden abdominal pain during pregnancy',
    reason: 'Obstetric Emergency / Antepartum Hemorrhage'
  },
  {
    id: 'rf_stiff_neck_fever',
    label: 'High fever accompanied by a rigid/stiff neck and light sensitivity',
    reason: 'Possible Acute Meningitis / CNS Infection'
  },
  {
    id: 'rf_child_distress',
    label: 'Child under 5 with chest in-drawing, rapid labored breathing, or unable to drink/feed',
    reason: 'Severe Pediatric Respiratory Distress / Sepsis Risk'
  },
  {
    id: 'rf_severe_dehydration',
    label: 'Severe dehydration: no urine for 12+ hours, sunken eyes, skin pinch does not bounce back',
    reason: 'Hypovolemic Shock / Critical Fluid Depletion'
  },
  {
    id: 'rf_self_harm',
    label: 'Thoughts of severe self-harm, extreme despair, or suicidal ideation',
    reason: 'Immediate Mental Health Crisis & Safety Risk'
  }
];

export function checkRedFlags(
  selectedSymptomIds: string[], 
  ageGroup: string, 
  freeText: string = ''
): RedFlagCheckResult {
  const freeTextLower = freeText.toLowerCase();

  // Check specific red flag IDs
  for (const rf of RED_FLAG_SYMPTOMS) {
    if (selectedSymptomIds.includes(rf.id)) {
      return {
        isTriggered: true,
        reason: rf.reason,
        suggestedImmediateAction: 'Immediate transfer to nearest District Hospital with 24x7 Emergency Room & Ambulance.'
      };
    }
  }

  // Check age-specific red flag overrides
  if (ageGroup === 'child_under_5') {
    if (
      selectedSymptomIds.includes('sym_rapid_breathing') || 
      selectedSymptomIds.includes('sym_unable_to_feed') ||
      freeTextLower.includes('chest in-drawing') ||
      freeTextLower.includes('not feeding') ||
      freeTextLower.includes('fast breathing')
    ) {
      return {
        isTriggered: true,
        reason: 'Child under 5 showing signs of acute respiratory distress or critical inability to feed.',
        suggestedImmediateAction: 'Immediate referral to District Hospital / Neonatal Emergency.'
      };
    }
  }

  if (ageGroup === 'pregnant') {
    if (
      selectedSymptomIds.includes('sym_vaginal_bleeding') || 
      selectedSymptomIds.includes('sym_severe_pelvic_pain') ||
      freeTextLower.includes('bleeding') ||
      freeTextLower.includes('severe pelvic pain')
    ) {
      return {
        isTriggered: true,
        reason: 'Maternal emergency: High risk obstetric distress.',
        suggestedImmediateAction: 'Immediate transfer to First Referral Unit (FRU) / District Hospital with obstetrician on duty.'
      };
    }
  }

  // Free text keyword scan for critical red flags
  const criticalKeywords = [
    { kw: 'unconscious', reason: 'Loss of consciousness reported' },
    { kw: 'convulsion', reason: 'Active seizure or convulsions reported' },
    { kw: 'seizure', reason: 'Active seizure or convulsions reported' },
    { kw: 'suicide', reason: 'Immediate mental health crisis risk' },
    { kw: 'kill myself', reason: 'Immediate mental health crisis risk' },
    { kw: 'blood vomit', reason: 'Acute upper gastrointestinal hemorrhage' },
    { kw: 'vomiting blood', reason: 'Acute upper gastrointestinal hemorrhage' }
  ];

  for (const item of criticalKeywords) {
    if (freeTextLower.includes(item.kw)) {
      return {
        isTriggered: true,
        reason: item.reason,
        suggestedImmediateAction: 'Activate 108 Emergency Medical Services immediately.'
      };
    }
  }

  return { isTriggered: false };
}

// Master list of clinical disease categories
export const DISEASE_CATEGORIES: Record<string, {
  name: string;
  description: string;
  typicalCareLevel: CareLevel;
  symptomSignatures: string[];
}> = {
  respiratory_infection: {
    name: 'Acute Respiratory Condition',
    description: 'Infection or inflammation of upper or lower respiratory tract (e.g. URI, bronchitis, seasonal pneumonia).',
    typicalCareLevel: 'PHC',
    symptomSignatures: ['sym_cough', 'sym_sore_throat', 'sym_runny_nose', 'sym_fever_mild', 'sym_chest_congestion', 'sym_wheezing']
  },
  acute_febrile: {
    name: 'Acute Febrile Syndrome',
    description: 'Systemic febrile illness requiring rapid point-of-care testing (e.g. malaria, dengue, enteric fever, viral fever).',
    typicalCareLevel: 'PHC',
    symptomSignatures: ['sym_high_fever', 'sym_chills', 'sym_body_ache', 'sym_headache_severe', 'sym_joint_pain', 'sym_eye_pain']
  },
  acute_gastroenteritis: {
    name: 'Gastrointestinal / Diarrheal Illness',
    description: 'Waterborne or foodborne infection causing acute fluid loss and abdominal distress.',
    typicalCareLevel: 'HWC',
    symptomSignatures: ['sym_watery_diarrhea', 'sym_vomiting', 'sym_stomach_cramps', 'sym_nausea', 'sym_mild_dehydration']
  },
  dermatological: {
    name: 'Dermatological / Cutaneous Issue',
    description: 'Skin infection, fungal rash, allergic dermatitis, or scabies requiring localized treatment.',
    typicalCareLevel: 'HWC',
    symptomSignatures: ['sym_skin_rash', 'sym_itching', 'sym_skin_boils', 'sym_swelling_local']
  },
  musculoskeletal_trauma: {
    name: 'Musculoskeletal / Pain Disorder',
    description: 'Joint inflammation, occupational back strain, arthritis, or minor physical trauma.',
    typicalCareLevel: 'HWC',
    symptomSignatures: ['sym_joint_swelling', 'sym_back_pain', 'sym_muscle_stiffness', 'sym_chronic_knee_pain']
  },
  chronic_metabolic_hypertension: {
    name: 'Chronic NCD (Hypertension / Diabetes Screening)',
    description: 'Signs suggesting uncontrolled blood pressure, hyperglycemia, or non-communicable disease risk.',
    typicalCareLevel: 'PHC',
    symptomSignatures: ['sym_dizziness', 'sym_excessive_thirst', 'sym_frequent_urination', 'sym_blurred_vision', 'sym_fatigue_chronic']
  },
  urinary_tract: {
    name: 'Urinary Tract / Renal Concern',
    description: 'Lower urinary tract inflammation or infection requiring urinalysis and basic diagnostics.',
    typicalCareLevel: 'PHC',
    symptomSignatures: ['sym_burning_urination', 'sym_flank_pain', 'sym_frequent_urination', 'sym_fever_mild']
  },
  complex_systemic: {
    name: 'Complex Systemic / Multi-organ Condition',
    description: 'Sub-acute multi-system complaints requiring secondary diagnostic workup (CHC / District Hospital).',
    typicalCareLevel: 'CHC',
    symptomSignatures: ['sym_unexplained_weight_loss', 'sym_prolonged_fever', 'sym_jaundice', 'sym_lymph_swelling', 'sym_severe_anemia']
  }
};

export interface TriageResult {
  riskTier: RiskTier;
  diseaseCategories: DiseaseCategoryConfidence[];
  isAbstention: boolean;
  abstentionReason?: string;
  redFlagResult: RedFlagCheckResult;
  recommendedCareLevel: CareLevel;
  plainLanguageSummary: string;
  recommendedTimeframe: string;
  selfCareGuidance: string[];
}

export function computeTriageResult(
  selectedSymptomIds: string[],
  durationDays: number,
  ageGroup: string,
  freeText: string = ''
): TriageResult {
  // 1. Check Deterministic Red Flags FIRST
  const redFlag = checkRedFlags(selectedSymptomIds, ageGroup, freeText);
  if (redFlag.isTriggered) {
    return {
      riskTier: 'RED',
      diseaseCategories: [
        {
          category: 'Critical / Medical Emergency Override',
          confidence: 99,
          description: redFlag.reason || 'Immediate emergency override triggered.',
          typicalCareLevel: 'DISTRICT_HOSPITAL',
          commonIndicators: selectedSymptomIds
        }
      ],
      isAbstention: false,
      redFlagResult: redFlag,
      recommendedCareLevel: 'DISTRICT_HOSPITAL',
      plainLanguageSummary: 'EMERGENCY: Urgent symptoms detected. Do not wait for a clinic appointment.',
      recommendedTimeframe: 'Immediate — Call 108 or go straight to District Hospital Emergency.',
      selfCareGuidance: [
        'Do NOT attempt home remedies or delay.',
        'Keep the patient sitting upright and calm while waiting for transport.',
        'Keep emergency helpline 108 active on your mobile phone.'
      ]
    };
  }

  // 2. Check for Abstention State (insufficient or contradictory signals)
  if (selectedSymptomIds.length === 0 && (!freeText || freeText.trim().length < 3)) {
    return {
      riskTier: 'GREEN',
      diseaseCategories: [],
      isAbstention: true,
      abstentionReason: 'No specific physical symptoms were provided. We cannot accurately estimate risk.',
      redFlagResult: { isTriggered: false },
      recommendedCareLevel: 'HWC',
      plainLanguageSummary: "We can't tell from this description. Please see a community health worker or clinician.",
      recommendedTimeframe: 'Visit your nearest Health & Wellness Centre (HWC) or speak with your village ASHA worker.',
      selfCareGuidance: [
        'Rest adequately and drink plenty of clean boiled water.',
        'Observe how you feel over the next 24 hours.',
        'If new symptoms develop or you feel worsening fatigue, visit your local clinic.'
      ]
    };
  }

  // 3. Category Scoring Algorithm
  const categoryScores: Record<string, number> = {};
  for (const catKey of Object.keys(DISEASE_CATEGORIES)) {
    categoryScores[catKey] = 0;
  }

  selectedSymptomIds.forEach(symId => {
    for (const [catKey, catData] of Object.entries(DISEASE_CATEGORIES)) {
      if (catData.symptomSignatures.includes(symId)) {
        categoryScores[catKey] += 20;
      }
    }
  });

  // Calculate weighted confidence
  const totalScore = Object.values(categoryScores).reduce((a, b) => a + b, 0);
  
  // Sort categories by score
  const sortedCategories = Object.entries(categoryScores)
    .filter(([_, score]) => score > 0)
    .sort((a, b) => b[1] - a[1]);

  // If no category matched or confidence is extremely low and dispersed
  if (sortedCategories.length === 0) {
    return {
      riskTier: 'YELLOW',
      diseaseCategories: [
        {
          category: 'Undifferentiated Mild Symptom Complex',
          confidence: 45,
          description: 'Non-specific symptoms requiring physical clinical examination.',
          typicalCareLevel: 'PHC',
          commonIndicators: selectedSymptomIds
        }
      ],
      isAbstention: true,
      abstentionReason: "Your reported symptoms are non-specific and don't match a single clear pattern.",
      redFlagResult: { isTriggered: false },
      recommendedCareLevel: 'PHC',
      plainLanguageSummary: "We can't tell — please see a clinician at your local PHC for proper examination.",
      recommendedTimeframe: 'Visit your Primary Health Centre within 24 to 48 hours.',
      selfCareGuidance: [
        'Drink plenty of clean fluids and get sufficient rest.',
        'Record when symptoms occur to share with the doctor.',
        'Seek urgent care if fever spikes or severe pain occurs.'
      ]
    };
  }

  // Top 3 categories with normalized confidence
  const topCategories: DiseaseCategoryConfidence[] = sortedCategories.slice(0, 3).map(([catKey, score], index) => {
    const cat = DISEASE_CATEGORIES[catKey];
    // Base confidence formula bounded between 35% and 88%
    let conf = Math.min(88, Math.max(35, Math.round((score / Math.max(totalScore, 20)) * 90) - (index * 12)));
    return {
      category: cat.name,
      confidence: conf,
      description: cat.description,
      typicalCareLevel: cat.typicalCareLevel,
      commonIndicators: cat.symptomSignatures.filter(s => selectedSymptomIds.includes(s))
    };
  });

  // 4. Compute Risk Tier (Rules + Weighted Duration + Symptom Severity)
  let severityScore = 0;
  
  // Duration weighting
  if (durationDays >= 7) severityScore += 30;
  else if (durationDays >= 3) severityScore += 15;
  else severityScore += 5;

  // Number of symptoms
  severityScore += selectedSymptomIds.length * 8;

  // Vulnerable group weighting
  if (ageGroup === 'child_under_5' || ageGroup === 'senior_60_plus' || ageGroup === 'pregnant') {
    severityScore += 18;
  }

  // Specific high severity symptoms (non-red flag but significant)
  const orangeSymptoms = ['sym_high_fever', 'sym_wheezing', 'sym_watery_diarrhea', 'sym_jaundice', 'sym_prolonged_fever'];
  const hasOrangeSymptom = selectedSymptomIds.some(s => orangeSymptoms.includes(s));
  if (hasOrangeSymptom) severityScore += 25;

  let riskTier: RiskTier = 'GREEN';
  let recommendedCareLevel: CareLevel = 'HWC';
  let plainLanguageSummary = '';
  let recommendedTimeframe = '';
  let selfCareGuidance: string[] = [];

  if (severityScore >= 65 || (hasOrangeSymptom && durationDays >= 4)) {
    riskTier = 'ORANGE';
    recommendedCareLevel = 'CHC';
    plainLanguageSummary = 'High priority: Symptoms require clinical evaluation, diagnostic tests, or doctor review today.';
    recommendedTimeframe = 'Visit a Community Health Centre (CHC) or sub-district hospital TODAY.';
    selfCareGuidance = [
      'Avoid heavy physical labor; maintain quiet rest.',
      'Stay hydrated with clean water, light broths, or oral hydration solutions.',
      'Have someone accompany you to the Community Health Centre today.',
      'Escalate to emergency 108 if breathing difficulty, confusion, or severe chest pain develops.'
    ];
  } else if (severityScore >= 35 || durationDays >= 3 || hasOrangeSymptom) {
    riskTier = 'YELLOW';
    recommendedCareLevel = 'PHC';
    plainLanguageSummary = 'Moderate priority: Symptoms need medical review to prevent escalation.';
    recommendedTimeframe = 'Visit your Primary Health Centre (PHC) or Ayushman Arogya Mandir within 24 to 48 hours.';
    selfCareGuidance = [
      'Take complete rest and drink plenty of clean fluids.',
      'Eat light, freshly prepared, easily digestible food.',
      'Avoid strenuous work in the sun or fields.',
      'Visit the PHC doctor if fever persists beyond 48 hours or pain worsens.'
    ];
  } else {
    riskTier = 'GREEN';
    recommendedCareLevel = 'HWC';
    plainLanguageSummary = 'Low priority / Self-care: Mild symptoms that can typically be managed safely at home.';
    recommendedTimeframe = 'Monitor at home for 48 hours; visit your village HWC / ASHA worker if symptoms do not improve.';
    selfCareGuidance = [
      'Drink plenty of clean boiled and cooled drinking water throughout the day.',
      'Get ample sleep and avoid physical strain.',
      'Eat fresh, warm meals and maintain good hand hygiene.',
      'When to escalate: Seek clinic care if temperature rises above 101°F, diarrhea exceeds 4 times/day, or cough lasts > 5 days.'
    ];
  }

  return {
    riskTier,
    diseaseCategories: topCategories,
    isAbstention: false,
    redFlagResult: { isTriggered: false },
    recommendedCareLevel,
    plainLanguageSummary,
    recommendedTimeframe,
    selfCareGuidance
  };
}

// Deterministic Facility Ranking Algorithm:
// 1. Care-Level Match (Primary)
// 2. Travel Time / Distance (Secondary)
// 3. Service Availability (Tertiary)
// 4. Current Load (Quaternary)
export function rankFacilitiesForScreening(
  facilities: Facility[],
  targetCareLevel: CareLevel,
  requiredServices: string[] = []
): { facility: Facility; suitabilityScore: number; matchReasons: string[] }[] {
  
  const careLevelHierarchy: Record<CareLevel, number> = {
    HWC: 1,
    PHC: 2,
    CHC: 3,
    DISTRICT_HOSPITAL: 4
  };

  const targetRank = careLevelHierarchy[targetCareLevel];

  return facilities.map(facility => {
    let suitabilityScore = 50;
    const matchReasons: string[] = [];
    const facilityRank = careLevelHierarchy[facility.type];

    // Factor 1: Care-Level Match (Primary — up to 100 points)
    if (facility.type === targetCareLevel) {
      suitabilityScore += 100;
      matchReasons.push(`Exact care-level match (${facility.careLevelName})`);
    } else if (facilityRank > targetRank) {
      // Higher capability facility can handle lower care level
      const diff = facilityRank - targetRank;
      suitabilityScore += (70 - diff * 15);
      matchReasons.push(`Higher capability referral facility (${facility.careLevelName})`);
    } else {
      // Under-resourced for the target level (severe penalty)
      suitabilityScore -= 120;
      matchReasons.push(`Under-equipped for recommended ${targetCareLevel} care`);
    }

    // Factor 2: Travel Time & Distance (Secondary — up to 25 points)
    if (facility.travelTimeMin <= 15) {
      suitabilityScore += 25;
      matchReasons.push(`Close proximity (~${facility.travelTimeMin} min / ${facility.distanceKm} km)`);
    } else if (facility.travelTimeMin <= 30) {
      suitabilityScore += 15;
      matchReasons.push(`Moderate travel distance (~${facility.travelTimeMin} min)`);
    } else if (facility.travelTimeMin <= 60) {
      suitabilityScore += 5;
    } else {
      suitabilityScore -= 10;
      matchReasons.push(`Extended travel time (~${facility.travelTimeMin} min)`);
    }

    // Factor 3: Service Availability (Tertiary — up to 15 points)
    let servicesMatchedCount = 0;
    if (requiredServices.length > 0) {
      for (const service of requiredServices) {
        if (facility.servicesOffered.includes(service)) {
          servicesMatchedCount++;
        }
      }
      if (servicesMatchedCount === requiredServices.length) {
        suitabilityScore += 15;
        matchReasons.push('All recommended diagnostic services available');
      } else if (servicesMatchedCount > 0) {
        suitabilityScore += 8;
        matchReasons.push('Partial diagnostic services available');
      }
    } else {
      suitabilityScore += 10;
    }

    // Factor 4: Current Load & Queue (Quaternary — up to 10 points)
    if (facility.currentLoad < 50) {
      suitabilityScore += 10;
      matchReasons.push(`Available bed capacity (${facility.currentLoad}% load)`);
    } else if (facility.currentLoad < 80) {
      suitabilityScore += 5;
      matchReasons.push(`Normal operational load (${facility.currentLoad}%)`);
    } else {
      suitabilityScore -= 8;
      matchReasons.push(`High current wait time (~${facility.currentWaitTimeMin} min)`);
    }

    // Normalize to 0-100 scale for UI display
    const normalizedScore = Math.max(10, Math.min(100, Math.round((suitabilityScore / 185) * 100)));

    return {
      facility,
      suitabilityScore: normalizedScore,
      matchReasons
    };
  }).sort((a, b) => b.suitabilityScore - a.suitabilityScore);
}
