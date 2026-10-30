import { Facility, HealthPressureSignal, ScreeningSubmission, VillageProfile } from '../types';

const API_BASE = '/api';

export interface BackendScreeningPayload {
  village_id?: string;
  village_name?: string;
  age_group: string;
  gender: string;
  symptom_duration: number;
  red_flags: string[];
  symptoms: string[];
  free_text?: string;
  submitted_by: 'citizen' | 'worker' | 'asha';
  asha_field_notes?: string;
}

export interface BackendScreeningResponse {
  id: string;
  risk_tier: string;
  disease_category: string;
  disease_categories: Array<{
    category: string;
    confidence: number;
    description: string;
    typicalCareLevel: string;
  }>;
  is_abstention: boolean;
  abstention_reason?: string;
  is_red_flag: boolean;
  red_flag_reason?: string;
  emergency_action?: string;
  anon_signal_id: string;
  recommended_facilities: any[];
  created_at: string;
}

export const api = {
  async submitScreening(payload: BackendScreeningPayload): Promise<BackendScreeningResponse> {
    const res = await fetch(`${API_BASE}/screenings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...payload,
        submitted_by: payload.submitted_by === 'worker' ? 'asha' : payload.submitted_by
      })
    });
    if (!res.ok) {
      throw new Error(`Screening submission failed: ${res.statusText}`);
    }
    return res.json();
  },

  async getFacilities(villageName?: string, careLevel?: string): Promise<Facility[]> {
    const params = new URLSearchParams();
    if (villageName) params.append('village_name', villageName);
    if (careLevel && careLevel !== 'ALL') params.append('care_level', careLevel);

    const res = await fetch(`${API_BASE}/facilities?${params.toString()}`);
    if (!res.ok) {
      throw new Error(`Failed to fetch facilities: ${res.statusText}`);
    }
    return res.json();
  },

  async getFacilityDetail(id: string): Promise<any> {
    const res = await fetch(`${API_BASE}/facilities/${id}`);
    if (!res.ok) throw new Error(`Facility not found: ${res.statusText}`);
    return res.json();
  },

  async getDistrictHealthPressure(): Promise<HealthPressureSignal[]> {
    const res = await fetch(`${API_BASE}/health-pressure/district`);
    if (!res.ok) throw new Error(`District health pressure fetch failed: ${res.statusText}`);
    return res.json();
  },

  async getVillageHealthPressure(villageIdOrName: string): Promise<HealthPressureSignal> {
    const res = await fetch(`${API_BASE}/health-pressure/${encodeURIComponent(villageIdOrName)}`);
    if (!res.ok) throw new Error(`Village health pressure fetch failed: ${res.statusText}`);
    return res.json();
  },

  async getAlerts(): Promise<Array<{ id: string; type: string; village_name: string; message: string; severity: string; created_at: string }>> {
    const res = await fetch(`${API_BASE}/alerts`);
    if (!res.ok) throw new Error(`Alerts fetch failed: ${res.statusText}`);
    return res.json();
  },

  async getTriageStream(): Promise<ScreeningSubmission[]> {
    const res = await fetch(`${API_BASE}/triage-stream`);
    if (!res.ok) throw new Error(`Triage stream fetch failed: ${res.statusText}`);
    return res.json();
  },

  async getVillages(): Promise<VillageProfile[]> {
    const res = await fetch(`${API_BASE}/villages`);
    if (!res.ok) throw new Error(`Villages fetch failed: ${res.statusText}`);
    return res.json();
  },

  async sendVoiceAssistantMessage(payload: {
    message: string;
    language_code?: string;
    conversation_history?: any[];
    village_name?: string;
  }): Promise<{
    reply_text: string;
    spoken_audio_text: string;
    detected_language: string;
    is_red_flag: boolean;
    red_flag_reason?: string;
    possible_conditions: any[];
    suggested_follow_up_questions: string[];
    quick_responses: string[];
    is_medicine_query: boolean;
    medicine_safety_note?: string;
    recommended_facilities: any[];
  }> {
    const res = await fetch(`${API_BASE}/voice-assistant/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (!res.ok) {
      throw new Error(`Voice assistant chat request failed: ${res.statusText}`);
    }
    return res.json();
  },

  async notifyLogin(payload: {
    name?: string;
    email_or_phone: string;
    role?: string;
    village?: string;
    login_method?: string;
  }): Promise<{ success: boolean; message: string; notification: any }> {
    const res = await fetch(`${API_BASE}/auth/login-notify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (!res.ok) {
      throw new Error(`Login notification failed: ${res.statusText}`);
    }
    return res.json();
  }
};


