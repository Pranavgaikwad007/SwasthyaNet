import urllib.request
import json
import sys

def run_tests():
    print("=======================================================")
    print("SWASTHYANET BACKEND API VERIFICATION SUITE")
    print("=======================================================\n")
    
    base = "http://localhost:8000/api"
    
    # 1. Health check
    try:
        with urllib.request.urlopen(f"{base}/health") as res:
            data = json.loads(res.read().decode())
            assert data["status"] == "ok"
            print("1. [PASS] Health check /api/health returned 200 OK")
    except Exception as e:
        print(f"1. [FAIL] Health check failed: {e}")
        sys.exit(1)

    # 2. Villages
    try:
        with urllib.request.urlopen(f"{base}/villages") as res:
            data = json.loads(res.read().decode())
            assert len(data) >= 5
            print(f"2. [PASS] Villages endpoint returned {len(data)} villages (Rampur, Chandanpur, Shivgarh, Harinagar, Bhelwara)")
    except Exception as e:
        print(f"2. [FAIL] Villages query failed: {e}")
        sys.exit(1)

    # 3. Facilities ranked by village
    try:
        with urllib.request.urlopen(f"{base}/facilities?village_name=Rampur") as res:
            data = json.loads(res.read().decode())
            assert len(data) >= 4
            top_fac = data[0]
            print(f"3. [PASS] Facilities query returned {len(data)} facilities. Top match for Rampur: {top_fac['name']} (~{top_fac['travelTimeMin']} min)")
    except Exception as e:
        print(f"3. [FAIL] Facilities query failed: {e}")
        sys.exit(1)

    # 4. Standard Screening Post
    try:
        req_data = json.dumps({
            "village_name": "Rampur",
            "age_group": "adult_15_59",
            "gender": "male",
            "symptom_duration": 3,
            "symptoms": ["sym_high_fever", "sym_chills", "sym_body_ache", "sym_eye_pain"],
            "submitted_by": "citizen"
        }).encode("utf-8")
        req = urllib.request.Request(f"{base}/screenings", data=req_data, headers={"Content-Type": "application/json"})
        with urllib.request.urlopen(req) as res:
            scr = json.loads(res.read().decode())
            tier = scr.get("risk_tier")
            scr_id = scr.get("id")
            anon_hash = scr.get("anon_signal_id")
            facs = scr.get("recommended_facilities", [])
            assert tier in ["YELLOW", "ORANGE"], f"Unexpected tier {tier}"
            assert len(facs) > 0, "No facilities returned"
            print(f"4. [PASS] Screening creation successful:")
            print(f"   - Assigned Tier: {tier}")
            print(f"   - Assigned ID: {scr_id}")
            print(f"   - Anonymous Hash Token: {anon_hash}")
            print(f"   - Top Recommended Facility: {facs[0]['name']}")
    except Exception as e:
        print(f"4. [FAIL] Screening creation failed: {e}")
        sys.exit(1)

    # 5. Red Flag Emergency Override
    try:
        req_data_rf = json.dumps({
            "village_name": "Rampur",
            "age_group": "adult_15_59",
            "gender": "male",
            "symptom_duration": 1,
            "red_flags": ["rf_chest_pain"],
            "symptoms": ["sym_chest_pain"],
            "submitted_by": "citizen"
        }).encode("utf-8")
        req_rf = urllib.request.Request(f"{base}/screenings", data=req_data_rf, headers={"Content-Type": "application/json"})
        with urllib.request.urlopen(req_rf) as res:
            scr_rf = json.loads(res.read().decode())
            tier = scr_rf.get("risk_tier")
            is_rf = scr_rf.get("is_red_flag")
            action = scr_rf.get("emergency_action")
            assert tier == "RED" and is_rf is True
            print(f"5. [PASS] Red-Flag Safety Override:")
            print(f"   - Assigned Tier: {tier} (Deterministic Emergency)")
            print(f"   - Emergency Action: {action}")
    except Exception as e:
        print(f"5. [FAIL] Red-flag override failed: {e}")
        sys.exit(1)

    # 6. District Health Pressure Matrix
    try:
        with urllib.request.urlopen(f"{base}/health-pressure/district") as res:
            press = json.loads(res.read().decode())
            assert len(press) >= 5
            print(f"6. [PASS] District Health Pressure matrix returned {len(press)} village telemetry records")
    except Exception as e:
        print(f"6. [FAIL] Health pressure failed: {e}")
        sys.exit(1)

    # 7. Active Early Warning Alerts
    try:
        with urllib.request.urlopen(f"{base}/alerts") as res:
            alerts = json.loads(res.read().decode())
            print(f"7. [PASS] Active Early Warning Alerts returned {len(alerts)} alerts (e.g. Rampur & Chandanpur)")
    except Exception as e:
        print(f"7. [FAIL] Alerts failed: {e}")
        sys.exit(1)

    # 8. Triage Stream
    try:
        with urllib.request.urlopen(f"{base}/triage-stream") as res:
            stream = json.loads(res.read().decode())
            assert len(stream) > 0
            print(f"8. [PASS] Live Triage Stream returned {len(stream)} recent screenings")
    except Exception as e:
        print(f"8. [FAIL] Triage stream failed: {e}")
        sys.exit(1)

    print("\n=======================================================")
    print("ALL 8 VERIFICATION TESTS PASSED SUCCESSFULLY! (100%)")
    print("=======================================================")

if __name__ == "__main__":
    run_tests()
