export interface Patient {
  id: string;
  hn: string;
  an?: string | null;
  full_name: string;
  age: number;
  gender: string;
  id_card?: string | null;
  phone?: string | null;
  insurance: string;
  main_diagnosis: string;
  secondary_diagnosis?: string | null;
  current_ward: string;
  current_bed?: string | null;
  primary_caregiver?: string | null;
  caregiver_relation?: string | null;
  caregiver_phone?: string | null;
  bereavement_contact_name?: string | null;
  bereavement_contact_phone?: string | null;
  status: 'ACTIVE_CONSULT' | 'FM_IN_PROGRESS' | 'WARD_PALLIATIVE' | 'HOME_WARD_PC' | 'OFF_SERVICE' | 'DISCHARGED' | 'DECEASED';
  admission_date?: string | null;
  discharge_date?: string | null;
  has_syringe_bulb: number;
  syringe_bulb_details?: string | null;
  form_501_done: number;
  form_510_done: number;
  icd_z515: number;
  icd_z718: number;
  created_at: string;
  updated_at: string;

  // Joined fields from query
  consult_reviewed?: number;
  triage_level?: string;
  palliative_doctor?: string;
  consult_date?: string;
  cpr_status?: string;
  ett_status?: string;
  med_comfort?: string;
  pod?: string;
  pps_score?: number;
  ward_bed?: string;
  discharge_type?: string;
  dc_date?: string;
}

export interface Consult {
  id: string;
  patient_id: string;
  consult_date: string;
  from_ward: string;
  referring_physician?: string | null;
  reason_for_consult: string;
  triage_level: 'Urgent' | 'High' | 'Routine';
  palliative_doctor?: string | null;
  palliative_nurse?: string | null;
  daily_progress_notes?: string | null;
  is_reviewed_today: number;
  review_date?: string | null;
  status: string;
  remarks?: string | null;
  created_at: string;
}

export interface AdvanceCarePlan {
  id: string;
  patient_id: string;
  recorded_date: string;
  cpr_status: string;
  ett_status: string;
  med_comfort: string;
  med_details?: string | null;
  pod: string;
  living_will_status: string;
  surrogate_decision_maker?: string | null;
  nutrition_preference?: string | null;
  notes?: string | null;
  updated_at: string;
}

export interface FamilyMeeting {
  id: string;
  patient_id: string;
  meeting_date: string;
  location?: string | null;
  team_attendees?: string | null;
  family_attendees?: string | null;
  illness_understanding?: string | null;
  goals_of_care?: string | null;
  spiritual_cultural_wishes?: string | null;
  consensus?: string | null;
  action_plan?: string | null;
  fm_status: 'Planned' | 'Completed' | 'Follow-up Needed';
  recorded_by?: string | null;
  created_at: string;
}

export interface WardRecord {
  id: string;
  patient_id: string;
  ward_type: 'Khon Tan' | 'Home Ward PC';
  bed_number?: string | null;
  admitted_from_ward?: string | null;
  admission_date: string;
  pps_score: number;
  care_problems?: string | null;
  nursing_interventions?: string | null;
  transfer_criteria_met: number;
  transfer_criteria_notes?: string | null;
  daily_notes?: string | null;
  is_reviewed_today: number;
  status: string;
  updated_at: string;
}

export interface Discharge {
  id: string;
  patient_id: string;
  discharge_date: string;
  discharge_type: string;
  from_ward?: string | null;
  destination_details?: string | null;
  coc_referral_date?: string | null;
  coc_coordinator?: string | null;
  has_syringe_bulb: number;
  syringe_bulb_protocol?: string | null;
  cause_of_death?: string | null;
  death_location?: string | null;
  icd_z515_checked: number;
  icd_z718_checked: number;
  summary_notes?: string | null;
  created_at: string;
}

export interface BereavementFollowup {
  id: string;
  patient_id: string;
  contact_person: string;
  contact_phone: string;
  interval_tag: '1_WEEK' | '1_MONTH' | '3_MONTH';
  due_date: string;
  call_date?: string | null;
  call_status: 'PENDING' | 'COMPLETED' | 'NO_ANSWER' | 'POSTPONED';
  caller_name?: string | null;
  grief_assessment?: string | null;
  notes?: string | null;
  created_at: string;

  // Joined
  patient_name?: string;
  hn?: string;
  main_diagnosis?: string;
  discharge_date?: string;
  discharge_type?: string;
}

export interface DashboardStats {
  totalPatients: number;
  activeConsults: number;
  wardKhonTan: number;
  homeWardPC: number;
  deceasedCount: number;
  dischargedCount: number;
  activeSyringeBulbs: number;
  pendingBereavementCalls: number;
  reviewedToday: number;
  totalActiveConsultRecords: number;
  compliance: {
    form501Done: number;
    form510Done: number;
    z515Done: number;
    z718Done: number;
  };
}
