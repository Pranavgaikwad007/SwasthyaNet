import { checkRedFlags, computeTriageResult, rankFacilitiesForScreening } from '../src/data/clinicalRules.js';
import { MOCK_FACILITIES, SEEDED_TIMELAPSE_DAYS } from '../src/data/mockData.js';

console.log('====================================================');
console.log('🧪 SWASTHYANET COMPREHENSIVE VERIFICATION TEST SUITE');
console.log('====================================================\n');

let passedTests = 0;
let totalTests = 0;

function assert(condition, message) {
  totalTests++;
  if (condition) {
    console.log(`✅ PASS: ${message}`);
    passedTests++;
  } else {
    console.error(`❌ FAIL: ${message}`);
    process.exitCode = 1;
  }
}

// 1. Red Flag Tests
console.log('--- TEST GROUP 1: Deterministic Red Flag Safety Overrides ---');
const redFlagChest = checkRedFlags(['rf_chest_pain'], 'adult_15_59');
assert(redFlagChest.isTriggered === true, 'Chest pain triggers emergency red-flag');

const redFlagChild = checkRedFlags(['sym_rapid_breathing'], 'child_under_5');
assert(redFlagChild.isTriggered === true, 'Child under 5 rapid breathing triggers pediatric emergency red-flag');

const redFlagPregnant = checkRedFlags(['sym_vaginal_bleeding'], 'pregnant');
assert(redFlagPregnant.isTriggered === true, 'Maternal bleeding in pregnancy triggers obstetric emergency red-flag');

const redFlagFreeText = checkRedFlags([], 'adult_15_59', 'Patient is having active convulsions and seizure');
assert(redFlagFreeText.isTriggered === true, 'Free-text seizure detection triggers immediate red-flag');

// 2. Triage & Category Prediction Tests
console.log('\n--- TEST GROUP 2: Risk Tiering & Differential Category Match ---');
const febrileTriage = computeTriageResult(['sym_high_fever', 'sym_chills', 'sym_body_ache', 'sym_eye_pain'], 3, 'adult_15_59');
assert(febrileTriage.riskTier === 'YELLOW' || febrileTriage.riskTier === 'ORANGE', 'Febrile syndrome triaged to Yellow/Orange tier');
assert(febrileTriage.diseaseCategories[0]?.category === 'Acute Febrile Syndrome', 'Top disease category is Acute Febrile Syndrome');
assert(febrileTriage.diseaseCategories[0]?.confidence >= 70, 'Confidence score exceeds 70%');

const giTriage = computeTriageResult(['sym_watery_diarrhea', 'sym_vomiting', 'sym_stomach_cramps'], 2, 'child_5_14');
assert(giTriage.diseaseCategories[0]?.category === 'Gastrointestinal / Diarrheal Illness', 'Top disease category is Gastrointestinal / Diarrheal');

const greenTriage = computeTriageResult(['sym_back_pain'], 1, 'adult_15_59');
assert(greenTriage.riskTier === 'GREEN', 'Single mild symptom triaged to GREEN tier self-care');
assert(greenTriage.selfCareGuidance.length >= 3, 'Green tier contains safe self-care guidelines');

// 3. Explicit Abstention State Tests
console.log('\n--- TEST GROUP 3: Explicit Abstention State Verification ---');
const emptyTriage = computeTriageResult([], 1, 'adult_15_59', '');
assert(emptyTriage.isAbstention === true, 'Empty symptoms trigger explicit Abstention state');
assert(emptyTriage.plainLanguageSummary.includes("We can't tell"), 'Abstention copy contains "We can\'t tell" requirement');

// 4. Facility Ranking Multi-Factor Suitability Tests
console.log('\n--- TEST GROUP 4: Multi-Factor Facility Suitability Ranking ---');
const rankedForRed = rankFacilitiesForScreening(MOCK_FACILITIES, 'DISTRICT_HOSPITAL');
assert(rankedForRed[0].facility.type === 'DISTRICT_HOSPITAL', 'Top ranked facility for Emergency RED tier is District Hospital');

const rankedForOrange = rankFacilitiesForScreening(MOCK_FACILITIES, 'CHC');
assert(rankedForOrange[0].facility.type === 'CHC', 'Top ranked facility for ORANGE tier is Community Health Centre (CHC)');

const rankedForYellow = rankFacilitiesForScreening(MOCK_FACILITIES, 'PHC');
assert(rankedForYellow[0].facility.type === 'PHC', 'Top ranked facility for YELLOW tier is Primary Health Centre (PHC)');

// 5. Time-Lapse & Health Pressure Engine Tests
console.log('\n--- TEST GROUP 5: 7-Day Time-Lapse & Health Pressure Telemetry ---');
assert(SEEDED_TIMELAPSE_DAYS.length === 7, '7 days of seeded time-lapse data available');

const day1Rampur = SEEDED_TIMELAPSE_DAYS[0].signals.find(s => s.village === 'Rampur');
assert(day1Rampur.pressureScore <= 20 && day1Rampur.activeAlert === false, 'Day 1 Rampur is at normal baseline (score <= 20, no alert)');

const day5Rampur = SEEDED_TIMELAPSE_DAYS[4].signals.find(s => s.village === 'Rampur');
assert(day5Rampur.pressureScore >= 75 && day5Rampur.activeAlert === true, 'Day 5 Rampur reaches Early-Warning Alert (score >= 75, alert active)');
assert(day5Rampur.alertMessage === 'Unusual increase in similar reported symptoms in Rampur. Increased screening capacity may be required.', 'Alert message matches verbatim required phrasing');

console.log('\n====================================================');
console.log(`🎯 RESULTS: ${passedTests}/${totalTests} TESTS PASSED SUCCESSFULLY`);
console.log('====================================================');
