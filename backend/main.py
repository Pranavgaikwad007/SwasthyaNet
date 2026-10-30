import os
import json
import math
import uuid
import smtplib
import ssl
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from datetime import datetime, timezone
from typing import List, Optional, Dict, Any

from fastapi import FastAPI, HTTPException, Query, Depends, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from sqlalchemy import (
    create_engine, Column, String, Integer, Float, Boolean, DateTime, Text, Enum
)
from sqlalchemy.orm import declarative_base, sessionmaker, Session

# ---------------------------------------------------------------------------
# Database Configuration (SQLite)
# ---------------------------------------------------------------------------
DATABASE_URL = "sqlite:///./swasthyanet.db"
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# ---------------------------------------------------------------------------
# SQLAlchemy Models
# ---------------------------------------------------------------------------
class VillageModel(Base):
    __tablename__ = "villages"
    id = Column(String, primary_key=True, index=True)
    name = Column(String, unique=True, index=True)
    district = Column(String, default="Sitapur District")
    population = Column(Integer, default=3000)
    primary_facility_id = Column(String, default="fac_hwc_rampur")
    lat = Column(Float, nullable=False)
    lng = Column(Float, nullable=False)

class FacilityModel(Base):
    __tablename__ = "facilities"
    id = Column(String, primary_key=True, index=True)
    name = Column(String, nullable=False)
    care_level = Column(String, nullable=False)  # HWC, PHC, CHC, DISTRICT_HOSPITAL
    care_level_name = Column(String, nullable=False)
    village = Column(String, nullable=False)
    address = Column(String, nullable=False)
    lat = Column(Float, nullable=False)
    lng = Column(Float, nullable=False)
    services = Column(Text, default="[]")  # JSON string
    operational_hours = Column(String, default="24x7")
    daily_capacity = Column(Integer, default=100)
    current_load_pct = Column(Integer, default=50)
    current_wait_time_min = Column(Integer, default=20)
    phone = Column(String, default="108")
    is_108_hub = Column(Boolean, default=False)
    specialties = Column(Text, default="[]")  # JSON string
    is_emergency_center = Column(Boolean, default=False)

class ScreeningModel(Base):
    __tablename__ = "screenings"
    id = Column(String, primary_key=True, index=True)
    village_id = Column(String, nullable=False)
    village_name = Column(String, nullable=False)
    age_group = Column(String, default="adult_15_59")
    gender = Column(String, default="prefer_not_to_say")
    symptom_duration = Column(Integer, default=2)
    red_flags = Column(Text, default="[]")  # JSON string
    symptoms = Column(Text, default="[]")   # JSON string
    free_text = Column(Text, nullable=True)
    submitted_by = Column(String, default="citizen")  # citizen, asha
    asha_field_notes = Column(Text, nullable=True)
    risk_tier = Column(String, default="GREEN")  # GREEN, YELLOW, ORANGE, RED
    disease_category = Column(String, default="General Assessment")
    disease_categories = Column(Text, default="[]")  # JSON list
    is_abstention = Column(Boolean, default=False)
    abstention_reason = Column(Text, nullable=True)
    recommended_facility_id = Column(String, nullable=True)
    anon_signal_id = Column(String, unique=True, index=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

class AlertModel(Base):
    __tablename__ = "alerts"
    id = Column(String, primary_key=True, index=True)
    type = Column(String, default="early_warning")  # early_warning, red_flag_emergency
    village_id = Column(String, nullable=False)
    village_name = Column(String, nullable=False)
    facility_id = Column(String, nullable=True)
    message = Column(Text, nullable=False)
    severity = Column(String, default="MODERATE")  # LOW, MODERATE, ELEVATED, HIGH
    acknowledged = Column(Boolean, default=False)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

class HealthPressureSnapshotModel(Base):
    __tablename__ = "health_pressure_snapshots"
    id = Column(String, primary_key=True, index=True)
    village_id = Column(String, nullable=False)
    village_name = Column(String, nullable=False)
    date = Column(String, nullable=False)
    score = Column(Integer, default=20)
    cases_today = Column(Integer, default=5)
    baseline_avg = Column(Integer, default=5)
    dominant_cluster = Column(String, default="Acute Respiratory Condition")
    trend = Column(String, default="flat")  # up, down, flat
    status = Column(String, default="normal")  # normal, surge_warning
    high_risk_pct = Column(Integer, default=0)
    category_breakdown = Column(Text, default="{}")  # JSON dict

Base.metadata.create_all(bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# ---------------------------------------------------------------------------
# Seed Data Initialization
# ---------------------------------------------------------------------------
def seed_database():
    db = SessionLocal()
    if db.query(VillageModel).count() > 0:
        db.close()
        return

    villages_data = [
        {"id": "vil_rampur", "name": "Rampur", "district": "Sitapur District", "population": 3420, "primary_facility_id": "fac_hwc_rampur", "lat": 27.5706, "lng": 80.6698},
        {"id": "vil_chandanpur", "name": "Chandanpur", "district": "Sitapur District", "population": 4150, "primary_facility_id": "fac_phc_chandanpur", "lat": 27.5921, "lng": 80.7125},
        {"id": "vil_shivgarh", "name": "Shivgarh", "district": "Sitapur District", "population": 2890, "primary_facility_id": "fac_chc_shivgarh", "lat": 27.5342, "lng": 80.6210},
        {"id": "vil_harinagar", "name": "Harinagar", "district": "Sitapur District", "population": 1980, "primary_facility_id": "fac_hwc_rampur", "lat": 27.6110, "lng": 80.6450},
        {"id": "vil_bhelwara", "name": "Bhelwara", "district": "Sitapur District", "population": 2450, "primary_facility_id": "fac_phc_chandanpur", "lat": 27.5615, "lng": 80.7480},
    ]
    for v in villages_data:
        db.add(VillageModel(**v))

    facilities_data = [
        {
            "id": "fac_hwc_rampur",
            "name": "Ayushman Arogya Mandir (HWC) Rampur",
            "care_level": "HWC",
            "care_level_name": "Health & Wellness Centre (Sub-Centre)",
            "village": "Rampur",
            "address": "Near Gram Panchayat Bhavan, Rampur Village",
            "lat": 27.5706,
            "lng": 80.6698,
            "services": json.dumps([
                "Basic Symptom Screening",
                "Blood Pressure & Glucose Check",
                "Rapid Malaria / Dengue Kit Test",
                "Oral Rehydration Therapy (ORS Corner)",
                "Maternal & Child Immunization Advice",
                "Tele-consultation to PHC Doctor"
            ]),
            "operational_hours": "9:00 AM – 5:00 PM (Mon–Sat)",
            "daily_capacity": 45,
            "current_load_pct": 42,
            "current_wait_time_min": 10,
            "phone": "+91 94501 22891",
            "is_108_hub": False,
            "specialties": json.dumps(["Community Health Officer (CHO)", "ANM Staff Nurse", "ASHA Facilitation"]),
            "is_emergency_center": False
        },
        {
            "id": "fac_phc_chandanpur",
            "name": "Chandanpur 24x7 Primary Health Centre (PHC)",
            "care_level": "PHC",
            "care_level_name": "Primary Health Centre (24x7 Clinical)",
            "village": "Chandanpur",
            "address": "Main Road, Opposite Block Development Office, Chandanpur",
            "lat": 27.5921,
            "lng": 80.7125,
            "services": json.dumps([
                "MBBS Medical Officer Consultation",
                "Basic Diagnostic Lab (CBC, Urine, Smear)",
                "Pharmacy & Free Essential Supplies",
                "24x7 Normal Delivery Room (Labour Ward)",
                "IV Fluid Administration & Observation Beds",
                "Emergency First Aid & Stabilization"
            ]),
            "operational_hours": "24x7 Emergency & Inpatient / OPD: 8:00 AM – 2:00 PM",
            "daily_capacity": 120,
            "current_load_pct": 68,
            "current_wait_time_min": 25,
            "phone": "+91 94150 88219",
            "is_108_hub": True,
            "specialties": json.dumps(["General Medicine", "Maternal Health", "Pediatric Primary Care"]),
            "is_emergency_center": False
        },
        {
            "id": "fac_chc_shivgarh",
            "name": "Shivgarh Community Health Centre (CHC)",
            "care_level": "CHC",
            "care_level_name": "Community Health Centre (First Referral Unit)",
            "village": "Shivgarh",
            "address": "Tehsil Road, Shivgarh Central Crossing",
            "lat": 27.5342,
            "lng": 80.6210,
            "services": json.dumps([
                "Specialist Doctors (Physician, Gynecologist, Pediatrician)",
                "30-Bed Inpatient Ward",
                "Digital X-Ray & Ultrasound Diagnostics",
                "Comprehensive Blood Biochemistry Lab",
                "Minor Operation Theatre",
                "24x7 108 Ambulance Hub Station"
            ]),
            "operational_hours": "24x7 Full Inpatient, Casualty & Diagnostic Services",
            "daily_capacity": 280,
            "current_load_pct": 74,
            "current_wait_time_min": 40,
            "phone": "+91 94511 44102",
            "is_108_hub": True,
            "specialties": json.dumps(["Internal Medicine", "Obstetrics & Gynecology", "Pediatrics", "General Surgery"]),
            "is_emergency_center": True
        },
        {
            "id": "fac_dist_sitapur",
            "name": "Sitapur District Hospital (Emergency Trauma Centre)",
            "care_level": "DISTRICT_HOSPITAL",
            "care_level_name": "District Hospital (Tertiary & Critical Care)",
            "village": "Sitapur HQ",
            "address": "Hospital Road, Civil Lines, Sitapur HQ",
            "lat": 27.5680,
            "lng": 80.6780,
            "services": json.dumps([
                "24x7 Critical Care / Intensive Care Unit (ICU)",
                "Dedicated Trauma & Emergency Ward",
                "Blood Bank & 24x7 Advanced Pathology",
                "CT Scan, Advanced Ultrasound & ECG",
                "Pediatric Intensive Care Unit (PICU) & SNCU",
                "Emergency Surgical Theatres"
            ]),
            "operational_hours": "24x7 Dedicated Emergency & Trauma Care",
            "daily_capacity": 850,
            "current_load_pct": 88,
            "current_wait_time_min": 30,
            "phone": "108 (Toll-Free Emergency) / +91 5862 242100",
            "is_108_hub": True,
            "specialties": json.dumps(["Emergency Medicine", "Critical Care", "Cardiology", "Neurology", "Neonatology"]),
            "is_emergency_center": True
        }
    ]
    for f in facilities_data:
        db.add(FacilityModel(**f))

    # Seed Initial Snapshots for Rampur & other villages
    snapshots = [
        {"id": "snap_rampur_cur", "village_id": "vil_rampur", "village_name": "Rampur", "date": "2026-08-22", "score": 79, "cases_today": 26, "baseline_avg": 5, "dominant_cluster": "Acute Febrile Syndrome", "trend": "up", "status": "surge_warning", "high_risk_pct": 50, "category_breakdown": json.dumps({"Acute Febrile Syndrome": 19, "Gastrointestinal": 5, "Respiratory": 2})},
        {"id": "snap_chandanpur_cur", "village_id": "vil_chandanpur", "village_name": "Chandanpur", "date": "2026-08-22", "score": 54, "cases_today": 16, "baseline_avg": 6, "dominant_cluster": "Acute Febrile Syndrome", "trend": "up", "status": "surge_warning", "high_risk_pct": 31, "category_breakdown": json.dumps({"Acute Febrile Syndrome": 10, "Gastrointestinal": 4, "Respiratory": 2})},
        {"id": "snap_shivgarh_cur", "village_id": "vil_shivgarh", "village_name": "Shivgarh", "date": "2026-08-22", "score": 26, "cases_today": 12, "baseline_avg": 5, "dominant_cluster": "Musculoskeletal", "trend": "flat", "status": "normal", "high_risk_pct": 8, "category_breakdown": json.dumps({"Musculoskeletal": 6, "Respiratory": 4, "Other": 2})},
        {"id": "snap_harinagar_cur", "village_id": "vil_harinagar", "village_name": "Harinagar", "date": "2026-08-22", "score": 15, "cases_today": 4, "baseline_avg": 4, "dominant_cluster": "Respiratory", "trend": "flat", "status": "normal", "high_risk_pct": 0, "category_breakdown": json.dumps({"Respiratory": 3, "General": 1})},
        {"id": "snap_bhelwara_cur", "village_id": "vil_bhelwara", "village_name": "Bhelwara", "date": "2026-08-22", "score": 22, "cases_today": 7, "baseline_avg": 5, "dominant_cluster": "Gastrointestinal", "trend": "flat", "status": "normal", "high_risk_pct": 14, "category_breakdown": json.dumps({"Gastrointestinal": 4, "Respiratory": 3})},
    ]
    for s in snapshots:
        db.add(HealthPressureSnapshotModel(**s))

    # Seed Initial Alerts
    alerts = [
        {
            "id": "alt_rampur_01",
            "type": "early_warning",
            "village_id": "vil_rampur",
            "village_name": "Rampur",
            "facility_id": "fac_phc_chandanpur",
            "message": "Unusual increase in similar reported symptoms in Rampur. Increased screening capacity may be required.",
            "severity": "HIGH",
            "acknowledged": False
        },
        {
            "id": "alt_chandanpur_01",
            "type": "early_warning",
            "village_id": "vil_chandanpur",
            "village_name": "Chandanpur",
            "facility_id": "fac_phc_chandanpur",
            "message": "Unusual increase in similar reported symptoms in Chandanpur. Increased screening capacity may be required.",
            "severity": "ELEVATED",
            "acknowledged": False
        }
    ]
    for a in alerts:
        db.add(AlertModel(**a))

    # Seed Initial Screenings for Triage Stream
    screenings_seed = [
        {"id": "scr-9021", "village_id": "vil_rampur", "village_name": "Rampur", "age_group": "adult_15_59", "gender": "male", "symptom_duration": 3, "red_flags": "[]", "symptoms": json.dumps(["sym_high_fever", "sym_chills", "sym_body_ache", "sym_eye_pain"]), "submitted_by": "asha", "asha_field_notes": "Oral temp 102.1F, chills", "risk_tier": "ORANGE", "disease_category": "Acute Febrile Syndrome", "disease_categories": json.dumps([{"category": "Acute Febrile Syndrome", "confidence": 84, "description": "Systemic febrile illness requiring rapid testing", "typicalCareLevel": "PHC"}]), "anon_signal_id": "anon_sig_a74f81"},
        {"id": "scr-9022", "village_id": "vil_rampur", "village_name": "Rampur", "age_group": "child_5_14", "gender": "female", "symptom_duration": 2, "red_flags": "[]", "symptoms": json.dumps(["sym_watery_diarrhea", "sym_vomiting", "sym_stomach_cramps"]), "submitted_by": "citizen", "risk_tier": "YELLOW", "disease_category": "Gastrointestinal / Diarrheal Illness", "disease_categories": json.dumps([{"category": "Gastrointestinal / Diarrheal Illness", "confidence": 86, "description": "Waterborne infection causing fluid loss", "typicalCareLevel": "HWC"}]), "anon_signal_id": "anon_sig_c99b12"},
        {"id": "scr-9023", "village_id": "vil_chandanpur", "village_name": "Chandanpur", "age_group": "senior_60_plus", "gender": "female", "symptom_duration": 4, "red_flags": "[]", "symptoms": json.dumps(["sym_cough", "sym_sore_throat", "sym_fever_mild"]), "submitted_by": "asha", "risk_tier": "YELLOW", "disease_category": "Acute Respiratory Condition", "disease_categories": json.dumps([{"category": "Acute Respiratory Condition", "confidence": 76, "description": "Upper respiratory infection", "typicalCareLevel": "PHC"}]), "anon_signal_id": "anon_sig_e120da"},
        {"id": "scr-9024", "village_id": "vil_shivgarh", "village_name": "Shivgarh", "age_group": "adult_15_59", "gender": "female", "symptom_duration": 1, "red_flags": "[]", "symptoms": json.dumps(["sym_back_pain", "sym_body_ache"]), "submitted_by": "citizen", "risk_tier": "GREEN", "disease_category": "Musculoskeletal / Pain Disorder", "disease_categories": json.dumps([{"category": "Musculoskeletal / Pain Disorder", "confidence": 68, "description": "Physical strain / posture fatigue", "typicalCareLevel": "HWC"}]), "anon_signal_id": "anon_sig_f839c4"},
    ]
    for sc in screenings_seed:
        db.add(ScreeningModel(**sc))

    db.commit()
    db.close()

seed_database()

# ---------------------------------------------------------------------------
# FastAPI App & Endpoints
# ---------------------------------------------------------------------------
app = FastAPI(
    title="SwasthyaNet Backend API",
    description="Early-warning and health screening assistant for rural healthcare (PSE13).",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------------------------------------------------------------------------
# Clinical Rules & Scoring Engine (Server-side)
# ---------------------------------------------------------------------------
RED_FLAG_KEYWORDS = [
    "unconscious", "convulsion", "seizure", "suicide", "kill myself", "blood vomit", "vomiting blood", "chest pain", "bleeding"
]

DISEASE_SIGNATURES = {
    "Acute Febrile Syndrome": ["sym_high_fever", "sym_chills", "sym_body_ache", "sym_joint_pain", "sym_eye_pain"],
    "Acute Respiratory Condition": ["sym_cough", "sym_sore_throat", "sym_runny_nose", "sym_wheezing", "sym_chest_congestion"],
    "Gastrointestinal / Diarrheal Illness": ["sym_watery_diarrhea", "sym_vomiting", "sym_stomach_cramps", "sym_nausea", "sym_mild_dehydration"],
    "Musculoskeletal / Pain Disorder": ["sym_back_pain", "sym_joint_pain", "sym_body_ache"],
    "Chronic NCD (Hypertension/Diabetes)": ["sym_dizziness", "sym_excessive_thirst", "sym_fatigue_chronic", "sym_headache_severe"],
    "Dermatological Issue": ["sym_skin_rash"],
    "Urinary Tract Issue": ["sym_burning_urination"]
}

def haversine_km(lat1, lon1, lat2, lon2):
    R = 6371.0
    dlat = math.radians(lat2 - lat1)
    dlon = math.radians(lon2 - lon1)
    a = math.sin(dlat / 2)**2 + math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) * math.sin(dlon / 2)**2
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    return round(R * c, 1)

# ---------------------------------------------------------------------------
# Schemas
# ---------------------------------------------------------------------------
class ScreeningRequest(BaseModel):
    village_id: Optional[str] = "vil_rampur"
    village_name: Optional[str] = "Rampur"
    age_group: str = "adult_15_59"
    gender: str = "prefer_not_to_say"
    symptom_duration: int = 2
    red_flags: List[str] = []
    symptoms: List[str] = []
    free_text: Optional[str] = ""
    submitted_by: str = "citizen"  # citizen, asha
    asha_field_notes: Optional[str] = None

class ScreeningResponse(BaseModel):
    id: str
    risk_tier: str
    disease_category: str
    disease_categories: List[Dict[str, Any]]
    is_abstention: bool
    abstention_reason: Optional[str]
    is_red_flag: bool
    red_flag_reason: Optional[str]
    emergency_action: Optional[str]
    anon_signal_id: str
    recommended_facilities: List[Dict[str, Any]]
    created_at: str

# ---------------------------------------------------------------------------
# Routes
# ---------------------------------------------------------------------------

@app.get("/api/health")
def health_check():
    return {"status": "ok", "service": "SwasthyaNet API", "timestamp": datetime.now(timezone.utc).isoformat()}

@app.get("/api/villages")
def get_villages(db: Session = Depends(get_db)):
    villages = db.query(VillageModel).all()
    return villages

@app.post("/api/screenings", response_model=ScreeningResponse)
def create_screening(req: ScreeningRequest, db: Session = Depends(get_db)):
    # 1. Deterministic Red-Flag Check
    is_red_flag = False
    red_flag_reason = None

    if req.red_flags and len(req.red_flags) > 0:
        is_red_flag = True
        red_flag_reason = "Deterministic safety override: Critical symptoms reported directly."
    
    # Check age-specific conditions
    if req.age_group == "child_under_5" and ("sym_rapid_breathing" in req.symptoms or "sym_unable_to_feed" in req.symptoms):
        is_red_flag = True
        red_flag_reason = "Pediatric Emergency: Child under 5 showing signs of respiratory distress or inability to feed."
    
    if req.age_group == "pregnant" and "sym_vaginal_bleeding" in req.symptoms:
        is_red_flag = True
        red_flag_reason = "Obstetric Emergency: Bleeding in pregnancy reported."

    # Check free-text keywords
    if req.free_text:
        ft_lower = req.free_text.lower()
        for kw in RED_FLAG_KEYWORDS:
            if kw in ft_lower:
                is_red_flag = True
                red_flag_reason = f"Urgent keyword detected: '{kw}'"
                break

    # 2. Compute Triage Tier & Disease Categories
    if is_red_flag:
        risk_tier = "RED"
        disease_category = "Critical / Medical Emergency Override"
        disease_categories = [{
            "category": "Critical / Medical Emergency Override",
            "confidence": 99,
            "description": red_flag_reason,
            "typicalCareLevel": "DISTRICT_HOSPITAL"
        }]
        is_abstention = False
        abstention_reason = None
        emergency_action = "Call 108 Emergency now. Direct transfer to nearest District Hospital."
        target_care_level = "DISTRICT_HOSPITAL"
    elif len(req.symptoms) == 0 and (not req.free_text or len(req.free_text.strip()) < 3):
        risk_tier = "GREEN"
        disease_category = "Undifferentiated Mild Symptoms"
        disease_categories = []
        is_abstention = True
        abstention_reason = "We can't tell from this description. Please see a community health worker or clinician."
        emergency_action = None
        target_care_level = "HWC"
    else:
        # Category scoring
        cat_scores = {}
        for cat, sym_list in DISEASE_SIGNATURES.items():
            matched = sum(1 for s in req.symptoms if s in sym_list)
            if matched > 0:
                cat_scores[cat] = matched * 25
        
        if not cat_scores:
            cat_scores["General Viral Illness"] = 40

        sorted_cats = sorted(cat_scores.items(), key=lambda x: x[1], reverse=True)
        top_cat = sorted_cats[0][0]
        disease_category = top_cat

        disease_categories = []
        for cat_name, score in sorted_cats[:3]:
            conf = min(88, max(40, score + 20))
            typical_level = "PHC" if "Febrile" in cat_name or "Respiratory" in cat_name else "HWC"
            disease_categories.append({
                "category": cat_name,
                "confidence": conf,
                "description": f"Clinical symptom match for {cat_name}.",
                "typicalCareLevel": typical_level
            })

        # Severity Score
        severity = len(req.symptoms) * 10 + req.symptom_duration * 8
        if req.age_group in ["child_under_5", "senior_60_plus", "pregnant"]:
            severity += 15

        if any(s in ["sym_high_fever", "sym_watery_diarrhea", "sym_wheezing", "sym_jaundice"] for s in req.symptoms):
            severity += 20

        if severity >= 65:
            risk_tier = "ORANGE"
            target_care_level = "CHC"
        elif severity >= 35:
            risk_tier = "YELLOW"
            target_care_level = "PHC"
        else:
            risk_tier = "GREEN"
            target_care_level = "HWC"

        is_abstention = False
        abstention_reason = None
        emergency_action = None

    # Generate unique anonymous token
    screening_id = f"scr-{uuid.uuid4().hex[:6]}"
    anon_signal_id = f"anon_sig_{uuid.uuid4().hex[:6]}"

    # Save to Database
    village_name = req.village_name or "Rampur"
    screening = ScreeningModel(
        id=screening_id,
        village_id=req.village_id or "vil_rampur",
        village_name=village_name,
        age_group=req.age_group,
        gender=req.gender,
        symptom_duration=req.symptom_duration,
        red_flags=json.dumps(req.red_flags),
        symptoms=json.dumps(req.symptoms),
        free_text=req.free_text,
        submitted_by=req.submitted_by,
        asha_field_notes=req.asha_field_notes,
        risk_tier=risk_tier,
        disease_category=disease_category,
        disease_categories=json.dumps(disease_categories),
        is_abstention=is_abstention,
        abstention_reason=abstention_reason,
        anon_signal_id=anon_signal_id
    )
    db.add(screening)

    # 3. Update Health Pressure Snapshot for village
    snapshot = db.query(HealthPressureSnapshotModel).filter(
        HealthPressureSnapshotModel.village_name == village_name
    ).first()
    if snapshot:
        snapshot.cases_today += 1
        if risk_tier in ["ORANGE", "RED"]:
            snapshot.score = min(100, snapshot.score + 3)
            snapshot.trend = "up"
        elif risk_tier == "YELLOW":
            snapshot.score = min(100, snapshot.score + 1)
        
        if snapshot.score >= 60:
            snapshot.status = "surge_warning"
            # create alert if none exists
            existing_alert = db.query(AlertModel).filter(
                AlertModel.village_name == village_name,
                AlertModel.acknowledged == False
            ).first()
            if not existing_alert:
                alert = AlertModel(
                    id=f"alt-{uuid.uuid4().hex[:6]}",
                    type="early_warning",
                    village_id=req.village_id or "vil_rampur",
                    village_name=village_name,
                    message=f"Unusual increase in similar reported symptoms in {village_name}. Increased screening capacity may be required.",
                    severity="HIGH" if snapshot.score >= 75 else "ELEVATED"
                )
                db.add(alert)

    db.commit()

    # 4. Rank Facilities for response
    facilities = db.query(FacilityModel).all()
    ranked_facilities = []
    care_hierarchy = {"HWC": 1, "PHC": 2, "CHC": 3, "DISTRICT_HOSPITAL": 4}
    target_rank = care_hierarchy.get(target_care_level, 2)

    v_model = db.query(VillageModel).filter(VillageModel.name == village_name).first()
    v_lat = v_model.lat if v_model else 27.5706
    v_lng = v_model.lng if v_model else 80.6698

    for fac in facilities:
        dist_km = haversine_km(v_lat, v_lng, fac.lat, fac.lng)
        travel_time = max(5, int(dist_km * 2.2))
        f_rank = care_hierarchy.get(fac.care_level, 2)
        
        score = 50
        if fac.care_level == target_care_level:
            score += 100
        elif f_rank > target_rank:
            score += (70 - (f_rank - target_rank) * 15)
        else:
            score -= 120

        if travel_time <= 15:
            score += 25
        elif travel_time <= 30:
            score += 15
        else:
            score -= 10

        norm_score = max(10, min(100, int((score / 185) * 100)))

        ranked_facilities.append({
            "id": fac.id,
            "name": fac.name,
            "care_level": fac.care_level,
            "care_level_name": fac.care_level_name,
            "village": fac.village,
            "distance_km": dist_km,
            "travel_time_min": travel_time,
            "phone": fac.phone,
            "address": fac.address,
            "current_load_pct": fac.current_load_pct,
            "suitability_score": norm_score,
            "lat": fac.lat,
            "lng": fac.lng,
            "ambulance_available": fac.is_108_hub
        })

    ranked_facilities.sort(key=lambda x: x["suitability_score"], reverse=True)

    return ScreeningResponse(
        id=screening_id,
        risk_tier=risk_tier,
        disease_category=disease_category,
        disease_categories=disease_categories,
        is_abstention=is_abstention,
        abstention_reason=abstention_reason,
        is_red_flag=is_red_flag,
        red_flag_reason=red_flag_reason,
        emergency_action=emergency_action,
        anon_signal_id=anon_signal_id,
        recommended_facilities=ranked_facilities[:3],
        created_at=datetime.now(timezone.utc).isoformat()
    )

@app.get("/api/facilities")
def get_facilities(
    village_id: Optional[str] = None,
    village_name: Optional[str] = None,
    care_level: Optional[str] = None,
    db: Session = Depends(get_db)
):
    query = db.query(FacilityModel)
    if care_level and care_level != "ALL":
        query = query.filter(FacilityModel.care_level == care_level)
    
    facilities = query.all()
    
    # Calculate distance from chosen village
    v_name = village_name or "Rampur"
    v_model = db.query(VillageModel).filter(VillageModel.name == v_name).first()
    v_lat = v_model.lat if v_model else 27.5706
    v_lng = v_model.lng if v_model else 80.6698

    result = []
    for fac in facilities:
        dist_km = haversine_km(v_lat, v_lng, fac.lat, fac.lng)
        travel_time = max(5, int(dist_km * 2.2))
        
        # Calculate suitability
        score = 80
        if travel_time <= 15:
            score += 15
        if fac.current_load_pct < 60:
            score += 5

        result.append({
            "id": fac.id,
            "name": fac.name,
            "type": fac.care_level,
            "care_level": fac.care_level,
            "careLevelName": fac.care_level_name,
            "village": fac.village,
            "distanceKm": dist_km,
            "travelTimeMin": travel_time,
            "servicesOffered": json.loads(fac.services),
            "capacityPerDay": fac.daily_capacity,
            "currentLoad": fac.current_load_pct,
            "currentWaitTimeMin": fac.current_wait_time_min,
            "operationalHours": fac.operational_hours,
            "phone": fac.phone,
            "address": fac.address,
            "lat": fac.lat,
            "lng": fac.lng,
            "ambulanceAvailable": fac.is_108_hub,
            "specialties": json.loads(fac.specialties),
            "isEmergencyCenter": fac.is_emergency_center,
            "suitabilityScore": min(100, score)
        })

    return result

@app.get("/api/facilities/{id}")
def get_facility_detail(id: str, db: Session = Depends(get_db)):
    fac = db.query(FacilityModel).filter(FacilityModel.id == id).first()
    if not fac:
        raise HTTPException(status_code=404, detail="Facility not found")
    return {
        "id": fac.id,
        "name": fac.name,
        "care_level": fac.care_level,
        "care_level_name": fac.care_level_name,
        "village": fac.village,
        "address": fac.address,
        "lat": fac.lat,
        "lng": fac.lng,
        "services": json.loads(fac.services),
        "operational_hours": fac.operational_hours,
        "daily_capacity": fac.daily_capacity,
        "current_load_pct": fac.current_load_pct,
        "current_wait_time_min": fac.current_wait_time_min,
        "phone": fac.phone,
        "is_108_hub": fac.is_108_hub,
        "specialties": json.loads(fac.specialties)
    }

@app.get("/api/health-pressure/district")
def get_district_health_pressure(db: Session = Depends(get_db)):
    snapshots = db.query(HealthPressureSnapshotModel).all()
    result = []
    for s in snapshots:
        result.append({
            "village": s.village_name,
            "date": s.date,
            "caseCount": s.cases_today,
            "dominantCategory": s.dominant_cluster,
            "pressureScore": s.score,
            "trend": s.trend,
            "baselineCases": s.baseline_avg,
            "activeAlert": s.status == "surge_warning",
            "alertSeverity": "HIGH" if s.score >= 75 else "ELEVATED" if s.score >= 50 else "LOW",
            "alertMessage": f"Unusual increase in similar reported symptoms in {s.village_name}. Increased screening capacity may be required.",
            "highRiskPercentage": s.high_risk_pct,
            "categoryBreakdown": json.loads(s.category_breakdown) if s.category_breakdown else {}
        })
    return result

@app.get("/api/health-pressure/{village_id_or_name}")
def get_village_health_pressure(village_id_or_name: str, db: Session = Depends(get_db)):
    snapshot = db.query(HealthPressureSnapshotModel).filter(
        (HealthPressureSnapshotModel.village_id == village_id_or_name) |
        (HealthPressureSnapshotModel.village_name == village_id_or_name)
    ).first()
    
    if not snapshot:
        # Return fallback for Rampur
        snapshot = db.query(HealthPressureSnapshotModel).filter(
            HealthPressureSnapshotModel.village_name == "Rampur"
        ).first()

    if not snapshot:
        raise HTTPException(status_code=404, detail="Village not found")

    return {
        "village": snapshot.village_name,
        "date": snapshot.date,
        "caseCount": snapshot.cases_today,
        "dominantCategory": snapshot.dominant_cluster,
        "pressureScore": snapshot.score,
        "trend": snapshot.trend,
        "baselineCases": snapshot.baseline_avg,
        "activeAlert": snapshot.status == "surge_warning",
        "alertSeverity": "HIGH" if snapshot.score >= 75 else "ELEVATED" if snapshot.score >= 50 else "LOW",
        "alertMessage": f"Unusual increase in similar reported symptoms in {snapshot.village_name}. Increased screening capacity may be required.",
        "highRiskPercentage": snapshot.high_risk_pct,
        "categoryBreakdown": json.loads(snapshot.category_breakdown) if snapshot.category_breakdown else {}
    }

@app.get("/api/alerts")
def get_active_alerts(db: Session = Depends(get_db)):
    alerts = db.query(AlertModel).filter(AlertModel.acknowledged == False).order_by(AlertModel.created_at.desc()).all()
    return [{
        "id": a.id,
        "type": a.type,
        "village_id": a.village_id,
        "village_name": a.village_name,
        "message": a.message,
        "severity": a.severity,
        "created_at": a.created_at.isoformat() if a.created_at else datetime.now(timezone.utc).isoformat()
    } for a in alerts]

@app.get("/api/triage-stream")
def get_triage_stream(limit: int = 15, db: Session = Depends(get_db)):
    screenings = db.query(ScreeningModel).order_by(ScreeningModel.created_at.desc()).limit(limit).all()
    result = []
    for sc in screenings:
        result.append({
            "id": sc.id,
            "submittedBy": sc.submitted_by,
            "patientAgeGroup": sc.age_group,
            "patientGender": sc.gender,
            "village": sc.village_name,
            "symptoms": json.loads(sc.symptoms) if sc.symptoms else [],
            "durationDays": sc.symptom_duration,
            "riskTier": sc.risk_tier,
            "diseaseCategories": json.loads(sc.disease_categories) if sc.disease_categories else [],
            "isAbstention": sc.is_abstention,
            "timestamp": sc.created_at.isoformat() if sc.created_at else datetime.now(timezone.utc).isoformat(),
            "anonymizedHash": sc.anon_signal_id
        })
    return result

# ---------------------------------------------------------------------------
# Multilingual Rural Health Voice Assistant AI Endpoint
# ---------------------------------------------------------------------------
class VoiceAssistantChatRequest(BaseModel):
    message: str
    language_code: Optional[str] = "auto"
    conversation_history: Optional[List[Dict[str, Any]]] = []
    village_name: Optional[str] = "Rampur"

@app.post("/api/voice-assistant/chat")
def voice_assistant_chat(req: VoiceAssistantChatRequest, db: Session = Depends(get_db)):
    user_msg = req.message.strip()
    lang = req.language_code or "auto"
    msg_lower = user_msg.lower()

    # Detect language if auto
    if lang == "auto":
        if any(c in user_msg for c in "आहेआहेतनाहीझालाझालीहोतआणिमलामाझेदुखतवाटतसांगा"):
            lang = "mr"
        elif any('\u0900' <= c <= '\u097F' for c in user_msg):
            lang = "hi"
        elif any(w in msg_lower for w in ["mala", "kalpasun", "khokla", "thakva", "angdukhi", "tap"]):
            lang = "mr"
        elif any(w in msg_lower for w in ["mujhe", "bukhar", "dard", "khansi", "sar", "pet"]):
            lang = "hi"
        else:
            lang = "en"

    # 1. Red-Flag Check
    red_flag_triggers = [
        ("severe breathing", "Severe respiratory distress / shortness of breath"),
        ("difficulty breathing", "Severe breathing difficulty"),
        ("breathless", "Acute breathlessness"),
        ("saans", "सांस लेने में अत्यधिक तकलीफ / Acute breathing distress"),
        ("saans lene", "सांस लेने में अत्यधिक तकलीफ"),
        ("saans fulna", "सांस फूलना"),
        ("shwas", "श्वास घेण्यास तीव्र अडचण / Respiratory emergency"),
        ("shwas ghenyala", "श्वास घेण्यास तीव्र अडचण"),
        ("dum ghutna", "दम घुटने का अहसास"),
        ("chest pain", "Severe chest pain / possible cardiac event"),
        ("chhati", "छाती में तेज दर्द या दबाव / Chest pressure"),
        ("chhati me dard", "छाती में तेज दर्द या दबाव"),
        ("chhatit vedna", "छातीत तीव्र वेदना"),
        ("unconscious", "Loss of consciousness / fainting"),
        ("behosh", "बेहोशी अथवा अचानक अचेत होना"),
        ("bheshuddh", "बेशुद्ध पडणे"),
        ("lakwa", "लकवा अथवा बोलने में कठिनाई"),
        ("paralysis", "Sudden paralysis or facial drooping"),
        ("heavy bleeding", "Severe uncontrollable bleeding"),
        ("khoon", "अत्यधिक रक्तस्राव / Internal bleeding"),
        ("khoon ki ulti", "खून की उल्टी / Internal bleeding"),
        ("सांस", "सांस लेने में तकलीफ / Acute breathlessness"),
        ("श्वास", "श्वास घेण्यास त्रास"),
        ("छाती", "छाती में तेज दर्द"),
        ("बेहोश", "बेहोशी"),
        ("बेशुद्ध", "बेशुद्ध पडणे"),
        ("रक्तस्राव", "अत्यधिक रक्तस्राव")
    ]

    is_red_flag = False
    red_flag_reason = None
    for kw, reason in red_flag_triggers:
        if kw in msg_lower or kw in user_msg:
            is_red_flag = True
            red_flag_reason = reason
            break


    # Get local facilities matching village
    facs = db.query(FacilityModel).all()
    rec_facilities = [{
        "id": f.id,
        "name": f.name,
        "care_level": f.care_level,
        "care_level_name": f.care_level_name,
        "village": f.village,
        "operational_hours": f.operational_hours,
        "phone": f.phone,
        "is_emergency_center": f.is_emergency_center
    } for f in facs[:3]]

    if is_red_flag:
        if lang == "hi":
            return {
                "reply_text": f"⚠️ **अत्यंत जरूरी चिकित्सा सूचना (Emergency Warning)**\n\nआपके बताए गए लक्षण ({red_flag_reason}) तुरंत चिकित्सकीय जांच की मांग करते हैं।\n\n🚨 **तुरंत कदम उठाएं:**\n1. तुरंत **108 नंबर** पर फोन करके एम्बुलेंस बुलाएं।\n2. मरीज को शांत रखें और आराम की मुद्रा में बिठाएं।\n3. खुद से कोई दवा या घरेलू नुस्खा न दें। सीधे नजदीकी सामुदायिक स्वास्थ्य केंद्र (CHC) या जिला अस्पताल पहुंचे।",
                "spoken_audio_text": "चेतावनी! आपके लक्षण गंभीर हो सकते हैं। कृपया तुरंत 108 नंबर पर फोन करें या नजदीकी सरकारी अस्पताल पहुंचें।",
                "detected_language": lang,
                "is_red_flag": True,
                "red_flag_reason": red_flag_reason,
                "possible_conditions": [],
                "suggested_follow_up_questions": ["108 पर कॉल करें", "नजदीकी अस्पताल देखें"],
                "quick_responses": ["एम्बुलेंस बुलाएं (Call 108)", "अस्पताल का पता बताएं"],
                "is_medicine_query": False,
                "medicine_safety_note": None,
                "recommended_facilities": rec_facilities
            }
        elif lang == "mr":
            return {
                "reply_text": f"⚠️ **तातडीची वैद्यकीय मदत आवश्यक (Emergency Warning)**\n\nतुम्ही सांगितलेली लक्षणे ({red_flag_reason}) तातडीने डॉक्टरी तपासणीची गरज दर्शवतात.\n\n🚨 **तातडीने पुढील पावले उचला:**\n1. ताबडतोब **108 क्रमांकावर** संपर्क साधून रुग्णवाहिका बोलवा.\n2. रुग्णाला शांत ठेवा आणि मोकळ्या हवेत विश्रांती घेऊ द्या.\n3. स्वतःहून कोणतेही औषध देऊ नका. थेट जवळच्या ग्रामीण रुग्णालय (RH/CHC) किंवा जिल्हा रुग्णालयात जा.",
                "spoken_audio_text": "सावधान! तुमची लक्षणे गंभीर असू शकतात. कृपया त्वरित 108 वर फोन करा किंवा जवळच्या सरकारी रुग्णालयात जा.",
                "detected_language": lang,
                "is_red_flag": True,
                "red_flag_reason": red_flag_reason,
                "possible_conditions": [],
                "suggested_follow_up_questions": ["108 वर कॉल करा", "जवळचे रुग्णालय शोधा"],
                "quick_responses": ["रुग्णवाहिका बोलवा (108)", "जवळचे रुग्णालय दाखवा"],
                "is_medicine_query": False,
                "medicine_safety_note": None,
                "recommended_facilities": rec_facilities
            }
        else:
            return {
                "reply_text": f"⚠️ **URGENT MEDICAL ATTENTION REQUIRED**\n\nThe symptoms described ({red_flag_reason}) indicate an urgent medical situation.\n\n🚨 **Immediate Action:**\n1. Call **108 Emergency Helpline** immediately for an ambulance.\n2. Do not administer unprescribed medicines or solid foods.\n3. Head directly to the nearest Primary/Community Health Centre (CHC) or District Hospital.",
                "spoken_audio_text": "Warning. Your symptoms may require immediate medical care. Please call 108 now or visit the nearest hospital.",
                "detected_language": lang,
                "is_red_flag": True,
                "red_flag_reason": red_flag_reason,
                "possible_conditions": [],
                "suggested_follow_up_questions": ["Call 108 Emergency", "Find Nearest Hospital"],
                "quick_responses": ["Call 108 Ambulance", "Show Nearest Hospital"],
                "is_medicine_query": False,
                "medicine_safety_note": None,
                "recommended_facilities": rec_facilities
            }

    # 2. Medicine Safety Questions
    if any(w in msg_lower for w in ["medicine", "dawa", "davai", "dawai", "aushadh", "tablet", "paracetamol", "dose"]):
        if lang == "hi":
            return {
                "reply_text": "💊 **दवाइयों की सुरक्षा एवं मार्गदर्शन:**\n\n* SwasthyaNet कोई दवा या खुराक (dosage) निर्धारित नहीं करता है।\n* सामान्य बुखार में सिर्फ ओआरएस (ORS) या पर्याप्त पानी पिएं और आराम करें।\n* गर्भवती महिलाएं, छोटे बच्चे या किसी पुरानी बीमारी वाले व्यक्ति डॉक्टर या एएनएम/आशा दीदी की सलाह के बिना कोई भी दवा न लें।\n* बुखार या दर्द 2-3 दिन से ज्यादा रहे तो सीधे नजदीकी प्राथमिक स्वास्थ्य केंद्र (PHC) में डॉक्टर को दिखाएं।",
                "spoken_audio_text": "दवाइयों की सही खुराक के लिए कृपया अपने नजदीकी प्राथमिक स्वास्थ्य केंद्र के डॉक्टर या आशा कार्यकर्ता से संपर्क करें। बिना डॉक्टर की सलाह के दवा न लें।",
                "detected_language": lang,
                "is_red_flag": False,
                "red_flag_reason": None,
                "possible_conditions": [],
                "suggested_follow_up_questions": ["डॉक्टर से परामर्श लें", "नजदीकी PHC देखें"],
                "quick_responses": ["मेरे लक्षण जांचें", "नजदीकी स्वास्थ्य केंद्र खोजें"],
                "is_medicine_query": True,
                "medicine_safety_note": "Important: Always consult a licensed medical professional before taking medicines.",
                "recommended_facilities": rec_facilities
            }
        elif lang == "mr":
            return {
                "reply_text": "💊 **औषध सुरक्षेबाबत आवश्यक माहिती:**\n\n* SwasthyaNet कोणत्याही औषधाचे प्रमाण किंवा प्रिस्क्रिप्शन देत नाही.\n* ताप असल्यास भरपूर पाणी प्यावे, विश्रांती घ्यावी व ओआरएस (ORS) घ्यावे.\n* गरोदर महिला, लहान मुले आणि वृद्ध व्यक्तींनी डॉक्टरांच्या किंवा आशा सेविकांच्या सल्ल्याशिवाय कोणतेही औषध घेऊ नये.\n* लक्षणे अधिक असल्यास जवळच्या प्राथमिक आरोग्य केंद्रातील (PHC) डॉक्टरांशी संपर्क साधा.",
                "spoken_audio_text": "औषधांच्या योग्य प्रमाणासाठी कृपया तुमच्या जवळच्या प्राथमिक आरोग्य केंद्रातील डॉक्टर किंवा आशा ताईंशी संपर्क साधा. स्वतःहून औषध घेऊ नका.",
                "detected_language": lang,
                "is_red_flag": False,
                "red_flag_reason": None,
                "possible_conditions": [],
                "suggested_follow_up_questions": ["डॉक्टरांचा सल्ला घ्या", "जवळचे PHC पहा"],
                "quick_responses": ["माझी लक्षणे तपासा", "जवळचे आरोग्य केंद्र शोधा"],
                "is_medicine_query": True,
                "medicine_safety_note": "औषधांचा योग्य वापर केवळ वैद्यकीय सल्ल्यानुसारच करावा.",
                "recommended_facilities": rec_facilities
            }
        else:
            return {
                "reply_text": "💊 **Medicine Safety & Guidance:**\n\n* SwasthyaNet does not prescribe medications or specific dosages.\n* For mild fever or weakness, drink plenty of fluids (boiled water/ORS) and rest.\n* Children, pregnant women, and high-risk patients should strictly avoid self-medicating.\n* Please consult a qualified doctor or local health worker for prescription advice.",
                "spoken_audio_text": "For proper medicine prescriptions and dosages, please consult a qualified doctor or your local health centre.",
                "detected_language": lang,
                "is_red_flag": False,
                "red_flag_reason": None,
                "possible_conditions": [],
                "suggested_follow_up_questions": ["Consult Doctor", "Find Nearby PHC"],
                "quick_responses": ["Check My Symptoms", "Find Nearby Clinic"],
                "is_medicine_query": True,
                "medicine_safety_note": "Prescription medicines should only be taken under direct medical supervision.",
                "recommended_facilities": rec_facilities
            }

    # 3. Follow-up symptom evaluation & differential conditions
    has_duration = any(w in msg_lower for w in ["din", "day", "days", "kal", "yesterday", "hafte", "week", "ghante", "hour", "kalpasun"])
    has_fever = any(w in msg_lower for w in ["fever", "tap", "bukhar", "taap", "garam"])
    has_cough = any(w in msg_lower for w in ["cough", "cold", "khansi", "khokla", "sardi", "gala"])
    
    if not has_duration and len(req.conversation_history or []) <= 1:
        if lang == "hi":
            return {
                "reply_text": "🩺 **मैं आपकी पूरी मदद करूंगा।**\n\nकृपया कुछ और जरूरी बातें बताएं:\n1. आपको यह परेशानी **कितने दिनों या घंटों से** हो रही है?\n2. क्या इसके साथ **खांसी, सिरदर्द, उल्टी, या बदन दर्द** भी है?\n3. मरीज की उम्र क्या है (बच्चा, वयस्क या बुजुर्ग)?",
                "spoken_audio_text": "आपको यह समस्या कितने समय से है? और क्या इसके साथ सर्दी, खांसी या शरीर में दर्द भी महसूस हो रहा है?",
                "detected_language": lang,
                "is_red_flag": False,
                "red_flag_reason": None,
                "possible_conditions": [],
                "suggested_follow_up_questions": ["1-2 दिन से है", "3 दिन से ज्यादा", "खांसी भी है", "सिर्फ बुखार है"],
                "quick_responses": ["1-2 दिन से", "3 दिन से ज्यादा", "खांसी और सिरदर्द भी है", "सिर्फ बुखार है"],
                "is_medicine_query": False,
                "medicine_safety_note": None,
                "recommended_facilities": rec_facilities
            }
        elif lang == "mr":
            return {
                "reply_text": "🩺 **मी तुम्हाला योग्य माहिती देतो.**\n\nकृपया मला अधिक माहिती सांगा:\n1. तुम्हाला हा त्रास **कधीपासून (किती दिवसांपासून)** जाणवत आहे?\n2. सोबत **खोकला, सर्दी, डोकेदुखी किंवा उलट्या** होत आहेत का?\n3. रुग्णाचे वय किती आहे (लहान मूल, तरुण की वृद्ध)?",
                "spoken_audio_text": "हा त्रास तुम्हाला किती दिवसांपासून होत आहे? आणि सोबत खोकला, सर्दी किंवा अंगदुखी आहे का?",
                "detected_language": lang,
                "is_red_flag": False,
                "red_flag_reason": None,
                "possible_conditions": [],
                "suggested_follow_up_questions": ["कालपासून आहे", "२-३ दिवस झाले", "खोकला आणि सर्दी आहे", "फक्त ताप आहे"],
                "quick_responses": ["कालपासून आहे", "२-३ दिवसांपेक्षा जास्त", "सोबत खोकला आहे", "फक्त अंगदुखी आहे"],
                "is_medicine_query": False,
                "medicine_safety_note": None,
                "recommended_facilities": rec_facilities
            }
        else:
            return {
                "reply_text": "🩺 **I can help guide you.**\n\nTo give you the most accurate advice, please let me know:\n1. **How long** have you had these symptoms?\n2. Do you also have a **cough, cold, headache, or body ache**?\n3. What is the approximate age of the patient?",
                "spoken_audio_text": "How long have you had these symptoms? And do you also have a cough, cold, headache, or body pain?",
                "detected_language": lang,
                "is_red_flag": False,
                "red_flag_reason": None,
                "possible_conditions": [],
                "suggested_follow_up_questions": ["Since 1-2 days", "More than 3 days", "Also have mild cough", "Just fever"],
                "quick_responses": ["Since 1-2 days", "More than 3 days", "With cough & cold", "Just fever"],
                "is_medicine_query": False,
                "medicine_safety_note": None,
                "recommended_facilities": rec_facilities
            }

    # Differential possibilities
    if lang == "mr":
        possibilities = [
            {
                "id": "cond_viral_mr",
                "name": "सामान्य व्हायरल संसर्ग (Common Viral Infection)",
                "explanation": "हवामानातील बदलामुळे होणारा सामान्य ताप व संसर्ग, जो विश्रांती आणि योग्य पाण्याने बरा होतो.",
                "commonSymptoms": ["ताप", "अंगदुखी", "घसा खवखवणे", "थकवा"],
                "whyRelevant": "तुमच्या लक्षणांशी जुळणारे प्राथमिक कारण असू शकते.",
                "whenToSeeDoctor": "जर ताप ३ दिवसांपेक्षा जास्त राहिला तर PHC ला भेट द्या.",
                "severityLevel": "low",
                "suggestedCareFacility": "HWC"
            },
            {
                "id": "cond_flu_mr",
                "name": "फ्लू सदृश आजार (Flu-like Illness)",
                "explanation": "श्वसनसंस्थेचा संसर्ग, ज्यामध्ये खोकला, सर्दी आणि डोकेदुखी जाणवते.",
                "commonSymptoms": ["खोकला", "सर्दी", "डोकेदुखी"],
                "whyRelevant": "खोकला व ताप असल्यास फ्लूची शक्यता असू शकते.",
                "whenToSeeDoctor": "श्वास घेण्यास त्रास झाल्यास तात्काळ डॉक्टरांना दाखवा.",
                "severityLevel": "moderate",
                "suggestedCareFacility": "PHC"
            }
        ]
        return {
            "reply_text": "🩺 **आरोग्य सल्ला व संभाव्य कारणे:**\n\nतुम्ही सांगितलेल्या लक्षणांवर आधारित, **खालील संभाव्य शक्यता असू शकतात:**\n*(टीप: हा अंतिम वैद्यकीय निदान नाही. प्रत्यक्ष खात्रीसाठी डॉक्टर किंवा आरोग्य सेविकांची मदत आवश्यक आहे.)*\n\n💧 **घरगुती काळजी व पुढील पावले:**\n* उकळलेले पाणी प्या आणि भरपूर विश्रांती घ्या.\n* जेवणात हलका व पचणारा आहार (मऊ भात, पेज) घ्या.\n* जर लक्षणे २-३ दिवसांत बरी झाली नाहीत, तर जवळच्या **प्राथमिक आरोग्य केंद्रात (PHC)** तपासणी करून घ्या.",
            "spoken_audio_text": "तुमच्या लक्षणांवरून हे सामान्य व्हायरल संसर्ग किंवा मौसमी आजार असण्याची शक्यता आहे. पुरेसे पाणी प्या आणि आराम करा. त्रास वाढल्यास प्राथमिक आरोग्य केंद्रात डॉक्टरांना दाखवा.",
            "detected_language": lang,
            "is_red_flag": False,
            "red_flag_reason": None,
            "possible_conditions": possibilities,
            "suggested_follow_up_questions": ["जवळचे आरोग्य केंद्र कोणते?", "कोणती काळजी घ्यावी?"],
            "quick_responses": ["जवळचे रुग्णालय शोधा", "नवीन लक्षण सांगा"],
            "is_medicine_query": False,
            "medicine_safety_note": None,
            "recommended_facilities": rec_facilities
        }
    elif lang == "hi":
        possibilities = [
            {
                "id": "cond_viral_hi",
                "name": "सामान्य वायरल बुखार (Common Viral Infection)",
                "explanation": "मौसम बदलने पर होने वाला आम बुखार, जो पर्याप्त आराम और तरल पदार्थों से ठीक हो जाता है।",
                "commonSymptoms": ["हल्का बुखार", "बदन दर्द", "कमजोरी"],
                "whyRelevant": "आपके बताए गए बुखार और दर्द के लक्षणों से मेल खाता है।",
                "whenToSeeDoctor": "यदि बुखार 3 दिन से अधिक रहे तो PHC में डॉक्टर को दिखाएं।",
                "severityLevel": "low",
                "suggestedCareFacility": "HWC"
            },
            {
                "id": "cond_flu_hi",
                "name": "मौसमी फ्लू एवं श्वसन संक्रमण (Flu-like Respiratory Illness)",
                "explanation": "गले और नाक का मौसमी संक्रमण, जिसमें खांसी और सिर में भारीपन रहता है।",
                "commonSymptoms": ["खांसी", "सर्दी", "सिरदर्द"],
                "whyRelevant": "सर्दी और खांसी के साथ बुखार होने पर इसकी संभावना होती है।",
                "whenToSeeDoctor": "सांस लेने में भारीपन होने पर चिकित्सीय जांच आवश्यक है।",
                "severityLevel": "moderate",
                "suggestedCareFacility": "PHC"
            }
        ]
        return {
            "reply_text": "🩺 **स्वास्थ्य सलाह एवं संभावित कारण:**\n\nआपके बताए गए लक्षणों के आधार पर **निम्नलिखित संभावनाएं हो सकती हैं:**\n*(कृपया ध्यान दें: यह पक्का चिकित्सीय निदान नहीं है। अंतिम पुष्टि के लिए डॉक्टर की जांच जरूरी है।)*\n\n💧 **प्राथमिक देखभाल व सुझाव:**\n* पर्याप्त मात्रा में उबला पानी व ओआरएस का घोल पिएं।\n* पूरा आराम करें और हल्का, सुपाच्य भोजन लें।\n* यदि लक्षण 2-3 दिनों में ठीक न हों या बढ़ें, तो नजदीकी **प्राथमिक स्वास्थ्य केंद्र (PHC)** में डॉक्टर को दिखाएं।",
            "spoken_audio_text": "आपके लक्षणों से यह सामान्य वायरल बुखार या मौसमी संक्रमण हो सकता है। पर्याप्त पानी पिएं और आराम करें। यदि परेशानी बढ़े तो नजदीकी प्राथमिक स्वास्थ्य केंद्र जाएं।",
            "detected_language": lang,
            "is_red_flag": False,
            "red_flag_reason": None,
            "possible_conditions": possibilities,
            "suggested_follow_up_questions": ["नजदीकी PHC कहां है?", "क्या दवा ले सकते हैं?"],
            "quick_responses": ["नजदीकी अस्पताल खोजें", "आशा कार्यकर्ता से मदद"],
            "is_medicine_query": False,
            "medicine_safety_note": None,
            "recommended_facilities": rec_facilities
        }
    else:
        possibilities = [
            {
                "id": "cond_viral_en",
                "name": "Common Viral Infection",
                "explanation": "A routine viral infection that usually resolves with adequate rest, hydration, and nutrition.",
                "commonSymptoms": ["Fever", "Body aches", "Fatigue"],
                "whyRelevant": "Matches your reported symptoms of fever and generalized fatigue.",
                "whenToSeeDoctor": "If fever persists beyond 3 days, visit your local clinic.",
                "severityLevel": "low",
                "suggestedCareFacility": "HWC"
            },
            {
                "id": "cond_flu_en",
                "name": "Flu-like Upper Respiratory Illness",
                "explanation": "A seasonal respiratory infection affecting the nose, throat, and chest airways.",
                "commonSymptoms": ["Cough", "Runny nose", "Sore throat"],
                "whyRelevant": "Likely if fever is accompanied by respiratory symptoms like cough.",
                "whenToSeeDoctor": "Seek evaluation if breathing becomes difficult or cough persists.",
                "severityLevel": "moderate",
                "suggestedCareFacility": "PHC"
            }
        ]
        return {
            "reply_text": "🩺 **Health Guidance & Possible Conditions:**\n\nBased on the symptoms described, **possibilities may include:**\n*(Note: This is not a confirmed medical diagnosis. A qualified healthcare professional is required for formal evaluation.)*\n\n💧 **Recommended Next Steps:**\n* Drink plenty of safe fluids (boiled water/ORS) and ensure adequate rest.\n* Eat light, nutritious meals and avoid strenuous activity.\n* If symptoms persist beyond 2-3 days or worsen, visit your local **Primary Health Centre (PHC)**.",
            "spoken_audio_text": "Based on your symptoms, this could be a common viral infection or seasonal illness. Stay well hydrated and rest. If symptoms worsen, please visit your local health centre.",
            "detected_language": lang,
            "is_red_flag": False,
            "red_flag_reason": None,
            "possible_conditions": possibilities,
            "suggested_follow_up_questions": ["Find nearby PHC", "When to see a doctor?"],
            "quick_responses": ["Find Nearby Healthcare", "Check Another Symptom"],
            "is_medicine_query": False,
            "medicine_safety_note": None,
            "recommended_facilities": rec_facilities
        }

# ---------------------------------------------------------------------------
# Email Notification Configuration & Login Notification Dispatcher
# ---------------------------------------------------------------------------
NOTIFICATION_TARGET_EMAIL = os.getenv("NOTIFICATION_EMAIL", "admin@example.org")
SMTP_HOST = os.getenv("SMTP_HOST", "smtp.gmail.com")
SMTP_PORT = int(os.getenv("SMTP_PORT", "587"))
SMTP_USER = os.getenv("SMTP_USER", "")
SMTP_PASSWORD = os.getenv("SMTP_PASSWORD", "")
SMTP_FROM = os.getenv("SMTP_FROM", SMTP_USER or "alerts@swasthyanet.org")

def send_login_notification_email(
    user_name: str,
    email_or_phone: str,
    role: str = "citizen",
    village: str = "Rampur",
    login_method: str = "Standard Login"
) -> Dict[str, Any]:
    timestamp_utc = datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M:%S UTC")
    subject = f"🔔 [SwasthyaNet Alert] User Login: {user_name} ({email_or_phone})"
    
    html_content = f"""<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>SwasthyaNet Login Alert</title>
</head>
<body style="margin: 0; padding: 20px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f1f5f9; color: #0f172a;">
  <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid #e2e8f0; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);">
    
    <!-- Header -->
    <div style="background: linear-gradient(135deg, #0F9D8B 0%, #0B1220 100%); padding: 24px 28px; color: #ffffff; text-align: left;">
      <div style="display: inline-block; padding: 4px 10px; background: rgba(255,255,255,0.15); border-radius: 20px; font-size: 11px; font-weight: 700; letter-spacing: 0.05em; text-transform: uppercase; margin-bottom: 8px;">
        SwasthyaNet Platform Security
      </div>
      <h1 style="margin: 0; font-size: 22px; font-weight: 800; color: #ffffff;">User Login Notification</h1>
      <p style="margin: 4px 0 0 0; font-size: 13px; color: #99f6e4;">Real-time authentication alert delivered to administrator</p>
    </div>

    <!-- Body Content -->
    <div style="padding: 28px;">
      <p style="font-size: 15px; line-height: 1.6; margin-top: 0; color: #334155;">
        A user has just successfully logged into the <strong>SwasthyaNet Rural Health Early-Warning Network</strong>.
      </p>

      <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 18px; margin: 20px 0;">
        <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
          <tr style="border-bottom: 1px solid #edf2f7;">
            <td style="padding: 9px 0; color: #64748b; font-weight: 600; width: 38%;">User / Name:</td>
            <td style="padding: 9px 0; color: #0f172a; font-weight: 700;">{user_name}</td>
          </tr>
          <tr style="border-bottom: 1px solid #edf2f7;">
            <td style="padding: 9px 0; color: #64748b; font-weight: 600;">Email / Phone:</td>
            <td style="padding: 9px 0; color: #0F9D8B; font-weight: 700; font-family: monospace;">{email_or_phone}</td>
          </tr>
          <tr style="border-bottom: 1px solid #edf2f7;">
            <td style="padding: 9px 0; color: #64748b; font-weight: 600;">Role:</td>
            <td style="padding: 9px 0; color: #0f172a; text-transform: uppercase; font-weight: 600;">{role}</td>
          </tr>
          <tr style="border-bottom: 1px solid #edf2f7;">
            <td style="padding: 9px 0; color: #64748b; font-weight: 600;">Village Catchment:</td>
            <td style="padding: 9px 0; color: #0f172a;">{village}</td>
          </tr>
          <tr style="border-bottom: 1px solid #edf2f7;">
            <td style="padding: 9px 0; color: #64748b; font-weight: 600;">Login Method:</td>
            <td style="padding: 9px 0; color: #0f172a;">{login_method}</td>
          </tr>
          <tr>
            <td style="padding: 9px 0; color: #64748b; font-weight: 600;">Timestamp:</td>
            <td style="padding: 9px 0; color: #0f172a; font-family: monospace; font-size: 13px;">{timestamp_utc}</td>
          </tr>
        </table>
      </div>

      <div style="background: #ecfdf5; border-left: 4px solid #0F9D8B; padding: 12px 16px; border-radius: 6px; font-size: 13px; color: #065f46;">
        <strong>Recipient:</strong> This security event was automatically dispatched to <code>{NOTIFICATION_TARGET_EMAIL}</code>.
      </div>
    </div>

    <!-- Footer -->
    <div style="background: #f8fafc; border-top: 1px solid #e2e8f0; padding: 16px 28px; font-size: 12px; color: #64748b; text-align: center;">
      SwasthyaNet · Rural Early-Warning & Epidemiological Surveillance Network
    </div>
  </div>
</body>
</html>
"""

    plain_content = f"""
[SwasthyaNet Platform Security Alert]
User Login Notification
--------------------------------------------------
Recipient: {NOTIFICATION_TARGET_EMAIL}
User: {user_name}
Email/Phone: {email_or_phone}
Role: {role}
Village: {village}
Method: {login_method}
Timestamp: {timestamp_utc}
--------------------------------------------------
SwasthyaNet Rural Early-Warning Network
"""

    print(f"\n=================================================================")
    print(f"📧 [LOGIN NOTIFICATION EVENT] -> {NOTIFICATION_TARGET_EMAIL}")
    print(f"👤 User: {user_name} | Identifier: {email_or_phone} | Role: {role}")
    print(f"🔑 Method: {login_method} | Village: {village}")
    print(f"⏰ Timestamp: {timestamp_utc}")
    print(f"=================================================================\n")

    email_sent = False
    delivery_status = "Logged to server console & database audit log"

    if SMTP_USER and SMTP_PASSWORD:
        try:
            msg = MIMEMultipart("alternative")
            msg["Subject"] = subject
            msg["From"] = SMTP_FROM
            msg["To"] = NOTIFICATION_TARGET_EMAIL

            msg.attach(MIMEText(plain_content, "plain"))
            msg.attach(MIMEText(html_content, "html"))

            if SMTP_PORT == 465:
                context = ssl.create_default_context()
                with smtplib.SMTP_SSL(SMTP_HOST, SMTP_PORT, context=context) as server:
                    server.login(SMTP_USER, SMTP_PASSWORD)
                    server.sendmail(SMTP_FROM, NOTIFICATION_TARGET_EMAIL, msg.as_string())
            else:
                with smtplib.SMTP(SMTP_HOST, SMTP_PORT, timeout=10) as server:
                    server.ehlo()
                    server.starttls()
                    server.login(SMTP_USER, SMTP_PASSWORD)
                    server.sendmail(SMTP_FROM, NOTIFICATION_TARGET_EMAIL, msg.as_string())
            email_sent = True
            delivery_status = f"Successfully delivered email via SMTP to {NOTIFICATION_TARGET_EMAIL}"
            print(f"✅ SMTP Email successfully delivered to {NOTIFICATION_TARGET_EMAIL}")
        except Exception as e:
            delivery_status = f"SMTP dispatch failed ({str(e)}), recorded in server audit log"
            print(f"⚠️ SMTP Send Error: {e}")
    else:
        delivery_status = f"Notification recorded for {NOTIFICATION_TARGET_EMAIL} (SMTP credentials not configured in .env, logged to console & DB)"

    return {
        "target_email": NOTIFICATION_TARGET_EMAIL,
        "email_sent": email_sent,
        "status": delivery_status,
        "timestamp": timestamp_utc
    }

class LoginNotificationRequest(BaseModel):
    name: Optional[str] = "Community Member"
    email_or_phone: str
    role: Optional[str] = "citizen"
    village: Optional[str] = "Rampur"
    login_method: Optional[str] = "Standard Login"

@app.post("/api/auth/login-notify")
def notify_login_event(
    req: LoginNotificationRequest, 
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db)
):
    # Log alert in database
    new_alert = AlertModel(
        id=f"alert_login_{uuid.uuid4().hex[:8]}",
        type="user_login",
        village_id=req.village.lower(),
        village_name=req.village,
        message=f"User login: {req.name} ({req.email_or_phone}) via {req.login_method}",
        severity="LOW",
        acknowledged=False
    )
    db.add(new_alert)
    db.commit()

    # Dispatch email notification in background
    notification_result = send_login_notification_email(
        user_name=req.name or "Community Member",
        email_or_phone=req.email_or_phone,
        role=req.role or "citizen",
        village=req.village or "Rampur",
        login_method=req.login_method or "Standard Login"
    )

    return {
        "success": True,
        "message": f"Login notification processed for {NOTIFICATION_TARGET_EMAIL}",
        "notification": notification_result
    }

@app.post("/api/auth/login")
def auth_login(
    req: LoginNotificationRequest, 
    db: Session = Depends(get_db)
):
    # Process login and notify
    notification_result = send_login_notification_email(
        user_name=req.name or "Community Member",
        email_or_phone=req.email_or_phone,
        role=req.role or "citizen",
        village=req.village or "Rampur",
        login_method=req.login_method or "Standard Login"
    )

    new_alert = AlertModel(
        id=f"alert_login_{uuid.uuid4().hex[:8]}",
        type="user_login",
        village_id=req.village.lower(),
        village_name=req.village,
        message=f"User login: {req.name} ({req.email_or_phone})",
        severity="LOW",
        acknowledged=False
    )
    db.add(new_alert)
    db.commit()

    return {
        "success": True,
        "user": {
            "id": f"usr_{uuid.uuid4().hex[:6]}",
            "name": req.name,
            "emailOrPhone": req.email_or_phone,
            "role": req.role,
            "village": req.village,
            "isLoggedIn": True
        },
        "notification": notification_result
    }

# ---------------------------------------------------------------------------
# AI Multilingual Voice Assistant Endpoint
# ---------------------------------------------------------------------------

class VoiceChatRequest(BaseModel):
    message: str
    language_code: Optional[str] = "auto"
    conversation_history: Optional[List[Dict[str, Any]]] = []
    village_name: Optional[str] = "Rampur"

@app.post("/api/voice-assistant/chat")
def voice_assistant_chat(
    req: VoiceChatRequest,
    db: Session = Depends(get_db)
):
    user_text = req.message.strip()
    lower = user_text.lower()
    lang = req.language_code or "auto"

    # Detect language if auto
    if lang == "auto":
        if any(ord(char) >= 0x0900 and ord(char) <= 0x097F for char in user_text):
            if any(w in user_text for w in ["आहे", "नाही", "झाला", "झाली", "होत", "आणि", "कालपासून", "मला", "माझे", "दुखत"]):
                lang = "mr"
            else:
                lang = "hi"
        elif any(w in lower for w in ["mala", "kalpasun", "ahe", "aahe", "khokla", "thakva", "angdukhi", "tap"]):
            lang = "mr"
        elif any(w in lower for w in ["mujhe", "mera", "meri", "hai", "hain", "bukhar", "dard", "khansi", "sar", "gala", "pet"]):
            lang = "hi"
        else:
            lang = "en"

    # Red flag checking
    is_red_flag = any(k in lower for k in [
        "severe breathing", "difficulty breathing", "saans", "shwas", "chest pain", "chhati", "unconscious",
        "behosh", "bheshuddh", "blood vomiting", "khoon", "bleeding", "paralysis", "lakwa", "heart attack"
    ])

    if is_red_flag:
        if lang == "hi":
            return {
                "reply_text": "⚠️ **अत्यंत जरूरी चिकित्सा चेतावनी (EMERGENCY)**\n\nआपके लक्षण गंभीर हो सकते हैं। कृपया तुरंत **108 नंबर** पर कॉल करके एम्बुलेंस बुलाएं या नजदीकी **सामुदायिक स्वास्थ्य केंद्र (CHC)** जाएं।",
                "spoken_audio_text": "चेतावनी! आपके लक्षण गंभीर हो सकते हैं। तुरंत 108 नंबर पर एम्बुलेंस बुलाएं या नजदीकी अस्पताल जाएं।",
                "detected_language": lang,
                "is_red_flag": True,
                "red_flag_reason": "संभावित आपातकालीन लक्षण (Severe / Emergency Red-Flag)",
                "possible_conditions": [],
                "suggested_follow_up_questions": ["108 पर कॉल करें", "नजदीकी अस्पताल देखें"],
                "quick_responses": ["एम्बुलेंस बुलाएं (108)", "अस्पताल का रास्ता दिखाएं"],
                "is_medicine_query": False,
                "recommended_facilities": []
            }
        elif lang == "mr":
            return {
                "reply_text": "⚠️ **तातडीची वैद्यकीय मदत आवश्यक (EMERGENCY)**\n\nतुमची लक्षणे अत्यंत गंभीर असू शकतात. कृपया त्वरित **१०८ क्रमांकावर** फोन करून रुग्णवाहिका बोलवा किंवा जवळच्या **ग्रामीण रुग्णालयात (CHC)** जा.",
                "spoken_audio_text": "सावधान! तुमची लक्षणे गंभीर असू शकतात. त्वरित 108 वर फोन करा किंवा जवळच्या सरकारी रुग्णालयात जा.",
                "detected_language": lang,
                "is_red_flag": True,
                "red_flag_reason": "आपत्कालीन लक्षणे (Emergency Symptoms)",
                "possible_conditions": [],
                "suggested_follow_up_questions": ["108 वर कॉल करा", "जवळचे रुग्णालय शोधा"],
                "quick_responses": ["रुग्णवाहिका बोलवा (108)", "जवळचे रुग्णालय दाखवा"],
                "is_medicine_query": False,
                "recommended_facilities": []
            }
        else:
            return {
                "reply_text": "⚠️ **URGENT MEDICAL ATTENTION REQUIRED**\n\nYour symptoms indicate a potential medical emergency. Please call **108 for an ambulance** or visit the nearest **Community Health Centre (CHC)** immediately.",
                "spoken_audio_text": "Warning! Your symptoms require urgent care. Please call 108 for an ambulance or visit the nearest hospital right away.",
                "detected_language": lang,
                "is_red_flag": True,
                "red_flag_reason": "Acute Emergency Warning Sign",
                "possible_conditions": [],
                "suggested_follow_up_questions": ["Call 108", "Find Nearest Hospital"],
                "quick_responses": ["Call 108 Ambulance", "Show Hospital Location"],
                "is_medicine_query": False,
                "recommended_facilities": []
            }

    # Clinical categories
    is_fever = any(k in lower for k in ["fever", "tap", "bukhar", "taap", "garam", "shivering", "chills", "ताप", "बुखार"])
    is_cough = any(k in lower for k in ["cough", "cold", "khansi", "khokla", "sardi", "gala", "sore throat", "खोकला", "सर्दी", "खांसी"])
    is_stomach = any(k in lower for k in ["stomach", "pet", "pot", "vomit", "vomiting", "loose motion", "dast", "nausea", "gas", "acidity", "उल्टी", "दस्त", "पोटात", "पेट दर्द"])
    is_headache = any(k in lower for k in ["headache", "sar dard", "dokedukhi", "sir dard", "migraine", "सिर दर्द", "डोकेदुखी"])
    is_skin = any(k in lower for k in ["skin", "rash", "itching", "khujli", "daane", "fungal", "allergy", "त्वचा", "खुजली", "दाने", "पुरळ"])
    is_joint = any(k in lower for k in ["joint", "knee", "ghutna", "kamar", "back pain", "sprain", "moch", "sujan", "घुटने", "कमर दर्द", "सांधेदुखी", "मोच"])

    conditions = []
    facilities_db = db.query(FacilityModel).all()
    facility_list = [{
        "id": f.id,
        "name": f.name,
        "care_level": f.care_level,
        "village": f.village,
        "distance_km": round(calculate_distance(27.56, 80.68, f.lat, f.lng), 1)
    } for f in facilities_db[:3]]

    if is_fever:
        if lang == "mr":
            conditions.append({
                "id": "mr_fever",
                "name": "व्हायरल ताप / मौसमी संसर्ग",
                "explanation": "हवामानातील बदलामुळे होणारा ताप व अंगदुखी. विश्रांती आणि पाण्याने आराम मिळतो.",
                "commonSymptoms": ["ताप", "अंगदुखी", "थकवा"],
                "whyRelevant": "सांगितलेल्या तापाच्या लक्षणांशी सुसंगत.",
                "whenToSeeDoctor": "३ दिवसांपेक्षा जास्त राहिल्यास तपासणी करा.",
                "severityLevel": "low",
                "suggestedCareFacility": "PHC"
            })
            return {
                "reply_text": "🩺 **आरोग्य सल्ला: ताप आणि अंगदुखी**\n\nतुमच्या लक्षणांवरून हे **व्हायरल ताप किंवा मौसमी संसर्ग** असू शकते.\n\n💧 **तातडीची काळजी:**\n* कोमट पाणी किंवा ओआरएस (ORS) भरपूर प्या.\n* कपाळावर पाण्याच्या पट्ट्या ठेवून ताप कमी करा.\n* ३ दिवसांपेक्षा जास्त ताप राहिल्यास प्राथमिक आरोग्य केंद्रात (PHC) रक्त तपासणी करा.",
                "spoken_audio_text": "तुमच्या लक्षणांवरून हे सामान्य ताप असू शकते. भरपूर पाणी प्या, आराम करा आणि ताप तीन दिवसांपेक्षा जास्त राहिल्यास प्राथमिक आरोग्य केंद्रात जा.",
                "detected_language": lang,
                "is_red_flag": False,
                "possible_conditions": conditions,
                "suggested_follow_up_questions": ["ताप किती दिवसांपासून आहे?", "थंडी वाजून येते का?"],
                "quick_responses": ["कालपासून आहे", "३ दिवसांपेक्षा जास्त", "जवळचे रुग्णालय"],
                "is_medicine_query": False,
                "recommended_facilities": facility_list
            }
        elif lang == "hi":
            conditions.append({
                "id": "hi_fever",
                "name": "सामान्य वायरल बुखार (Viral Fever)",
                "explanation": "मौसम बदलाव से होने वाला बुखार जो आराम और तरल पदार्थों से ठीक होता है।",
                "commonSymptoms": ["बुखार", "बदन दर्द", "कमजोरी"],
                "whyRelevant": "आपके बताए गए बुखार से मेल खाता है।",
                "whenToSeeDoctor": "3 दिन से अधिक रहने पर PHC में जांच कराएं।",
                "severityLevel": "low",
                "suggestedCareFacility": "PHC"
            })
            return {
                "reply_text": "🩺 **स्वास्थ्य सलाह: बुखार और बदन दर्द**\n\nआपके बताए गए लक्षणों से यह **सामान्य वायरल बुखार** हो सकता है।\n\n💧 **प्राथमिक देखभाल:**\n* पर्याप्त मात्रा में उबला पानी व ओआरएस का घोल पिएं।\n* माथे पर ताजे पानी की पट्टियां रखें और पूरा आराम करें।\n* यदि बुखार 3 दिन से ज्यादा रहे, तो नजदीकी **प्राथमिक स्वास्थ्य केंद्र (PHC)** में डॉक्टर को दिखाएं।",
                "spoken_audio_text": "आपके लक्षणों से यह सामान्य बुखार हो सकता है। पर्याप्त मात्रा में पानी पिएं, आराम करें और बुखार तीन दिन से अधिक रहे तो प्राथमिक स्वास्थ्य केंद्र जाएं।",
                "detected_language": lang,
                "is_red_flag": False,
                "possible_conditions": conditions,
                "suggested_follow_up_questions": ["बुखार कितने दिन से है?", "क्या कंपकंपी छूटती है?"],
                "quick_responses": ["1-2 दिन से है", "3 दिन से ज्यादा", "नजदीकी PHC"],
                "is_medicine_query": False,
                "recommended_facilities": facility_list
            }
        else:
            conditions.append({
                "id": "en_fever",
                "name": "Acute Viral Fever",
                "explanation": "Seasonal viral fever manageable with hydration and rest.",
                "commonSymptoms": ["Fever", "Body aches", "Fatigue"],
                "whyRelevant": "Matches reported fever and fatigue symptoms.",
                "whenToSeeDoctor: "If fever persists >3 days.",
                "severityLevel": "low",
                "suggestedCareFacility": "PHC"
            })
            return {
                "reply_text": "🩺 **Clinical Assessment: Fever & Aches**\n\nYour symptoms indicate a **seasonal viral fever**.\n\n💧 **Home Care:**\n* Drink plenty of fluids (ORS / boiled water).\n* Apply cool compresses on forehead for comfort.\n* If fever lasts >3 days, visit your local **Primary Health Centre (PHC)**.",
                "spoken_audio_text": "I understand you have fever. Please stay hydrated with ORS and rest. If it lasts more than three days, please visit your local clinic.",
                "detected_language": lang,
                "is_red_flag": False,
                "possible_conditions": conditions,
                "suggested_follow_up_questions": ["How many days of fever?", "Any chills?"],
                "quick_responses": ["1-2 days", "More than 3 days", "Show Nearby PHC"],
                "is_medicine_query": False,
                "recommended_facilities": facility_list
            }

    if is_stomach:
        if lang == "mr":
            return {
                "reply_text": "🩺 **आरोग्य सल्ला: पोटाचा त्रास आणि उलट्या/जुलाब**\n\nहे **पोटाचा संसर्ग किंवा अपचन** असू शकते. ओआरएस (ORS) किंवा ताक वारंवार प्या. तेलकट अन्न टाळा.",
                "spoken_audio_text": "पोटाचा त्रास असल्यास ओआरएसचे पाणी वारंवार प्या आणि हलका आहार घ्या. उलट्या न थांबल्यास जवळच्या आरोग्य केंद्रात जा.",
                "detected_language": lang,
                "is_red_flag": False,
                "possible_conditions": [],
                "suggested_follow_up_questions": ["उलट्या किंवा जुलाब किती वेळा झाले?"],
                "quick_responses": ["२-३ वेळा झाले", "पाणी टिकत नाही", "जवळचे रुग्णालय"],
                "is_medicine_query": False,
                "recommended_facilities": facility_list
            }
        else:
            return {
                "reply_text": "🩺 **स्वास्थ्य सलाह: पेट दर्द और उल्टी/दस्त**\n\nयह **पेट का संक्रमण (Gastroenteritis)** हो सकता है। सबसे जरूरी है ओआरएस (ORS) का घोल पीना ताकि डिहाइड्रेशन न हो। हल्का भोजन लें।",
                "spoken_audio_text": "पेट खराब होने पर ओआरएस का घोल पिएं और हल्का भोजन लें। यदि लगातार उल्टी हो तो तुरंत प्राथमिक स्वास्थ्य केंद्र जाएं।",
                "detected_language": lang,
                "is_red_flag": False,
                "possible_conditions": [],
                "suggested_follow_up_questions": ["उल्टी या दस्त कितनी बार हुए?"],
                "quick_responses": ["2-3 बार हुआ", "ORS की विधि", "नजदीकी PHC"],
                "is_medicine_query": False,
                "recommended_facilities": facility_list
            }

    # Default localized triage
    if lang == "mr":
        return {
            "reply_text": "🩺 **आरोग्य सल्ला व मार्गदर्शन:**\n\nमी तुमची लक्षणे समजून घेतली आहेत. पुरेसे पाणी प्या, विश्रांती घ्या आणि आवश्यकतेनुसार जवळच्या **प्राथमिक आरोग्य केंद्रात (PHC)** तपासणी करून घ्या.",
            "spoken_audio_text": "मी तुमची समस्या समजून घेतली आहे. पुरेसे पाणी प्या आणि तपासणीसाठी जवळच्या आरोग्य केंद्रात संपर्क साधा.",
            "detected_language": lang,
            "is_red_flag": False,
            "possible_conditions": [],
            "suggested_follow_up_questions": ["हा त्रास कधीपासून आहे?", "जवळचे रुग्णालय कोणते?"],
            "quick_responses": ["कालपासून आहे", "२-३ दिवस झाले", "जवळचे आरोग्य केंद्र"],
            "is_medicine_query": False,
            "recommended_facilities": facility_list
        }
    elif lang == "hi":
        return {
            "reply_text": "🩺 **स्वास्थ्य सलाह एवं मार्गदर्शन:**\n\nमैंने आपकी बताई गई समस्या को नोट कर लिया है। पर्याप्त पानी पिएं, आराम करें और सही जांच के लिए अपने गांव के **प्राथमिक स्वास्थ्य केंद्र (PHC)** में डॉक्टर से मिलें।",
            "spoken_audio_text": "मैंने आपकी समस्या समझ ली है। पर्याप्त पानी पिएं, आराम करें और सही जांच के लिए नजदीकी प्राथमिक स्वास्थ्य केंद्र में डॉक्टर से मिलें।",
            "detected_language": lang,
            "is_red_flag": False,
            "possible_conditions": [],
            "suggested_follow_up_questions": ["यह परेशानी कितने दिन से है?", "नजदीकी PHC कहां है?"],
            "quick_responses": ["1-2 दिन से है", "3 दिन से ज्यादा", "नजदीकी अस्पताल"],
            "is_medicine_query": False,
            "recommended_facilities": facility_list
        }
    else:
        return {
            "reply_text": "🩺 **Health Guidance & Care:**\n\nI have evaluated the symptoms you described. Please rest well, stay hydrated, and visit your local **Primary Health Centre (PHC)** for a physical examination.",
            "spoken_audio_text": "I have noted your symptoms. Please drink plenty of fluids, rest well, and visit your local health centre for a checkup.",
            "detected_language": lang,
            "is_red_flag": False,
            "possible_conditions": [],
            "suggested_follow_up_questions": ["How long have you had this?", "Find nearby PHC"],
            "quick_responses": ["Since 1-2 days", "More than 3 days", "Show Nearby Clinic"],
            "is_medicine_query": False,
            "recommended_facilities": facility_list
        }


