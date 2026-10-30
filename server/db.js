const { DatabaseSync } = require('node:sqlite');
const path = require('node:path');

const dbPath = path.join(__dirname, 'palliative.db');
const db = new DatabaseSync(dbPath);

// Enable WAL mode and foreign keys for performance and safety
db.exec('PRAGMA foreign_keys = ON;');

function initSchema() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS patients (
      id TEXT PRIMARY KEY,
      hn TEXT UNIQUE NOT NULL,
      an TEXT,
      full_name TEXT NOT NULL,
      age INTEGER,
      gender TEXT,
      id_card TEXT,
      phone TEXT,
      insurance TEXT,
      main_diagnosis TEXT NOT NULL,
      secondary_diagnosis TEXT,
      current_ward TEXT NOT NULL,
      current_bed TEXT,
      primary_caregiver TEXT,
      caregiver_relation TEXT,
      caregiver_phone TEXT,
      bereavement_contact_name TEXT,
      bereavement_contact_phone TEXT,
      status TEXT NOT NULL DEFAULT 'ACTIVE_CONSULT',
      admission_date TEXT,
      discharge_date TEXT,
      has_syringe_bulb INTEGER DEFAULT 0,
      syringe_bulb_details TEXT,
      form_501_done INTEGER DEFAULT 0,
      form_510_done INTEGER DEFAULT 0,
      icd_z515 INTEGER DEFAULT 0,
      icd_z718 INTEGER DEFAULT 0,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS consults (
      id TEXT PRIMARY KEY,
      patient_id TEXT NOT NULL,
      consult_date TEXT NOT NULL,
      from_ward TEXT NOT NULL,
      referring_physician TEXT,
      reason_for_consult TEXT NOT NULL,
      triage_level TEXT DEFAULT 'Routine',
      palliative_doctor TEXT,
      palliative_nurse TEXT,
      daily_progress_notes TEXT,
      is_reviewed_today INTEGER DEFAULT 0,
      review_date TEXT,
      status TEXT DEFAULT 'active',
      remarks TEXT,
      created_at TEXT NOT NULL,
      FOREIGN KEY(patient_id) REFERENCES patients(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS advance_care_plans (
      id TEXT PRIMARY KEY,
      patient_id TEXT UNIQUE NOT NULL,
      recorded_date TEXT NOT NULL,
      cpr_status TEXT DEFAULT 'DNR',
      ett_status TEXT DEFAULT 'No ETT',
      med_comfort TEXT DEFAULT 'Morphine comfort protocol',
      med_details TEXT,
      pod TEXT DEFAULT 'บ้าน (Home)',
      living_will_status TEXT DEFAULT 'ไม่มีหนังสือแสดงเจตนา',
      surrogate_decision_maker TEXT,
      nutrition_preference TEXT,
      notes TEXT,
      updated_at TEXT NOT NULL,
      FOREIGN KEY(patient_id) REFERENCES patients(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS family_meetings (
      id TEXT PRIMARY KEY,
      patient_id TEXT NOT NULL,
      meeting_date TEXT NOT NULL,
      location TEXT,
      team_attendees TEXT,
      family_attendees TEXT,
      illness_understanding TEXT,
      goals_of_care TEXT,
      spiritual_cultural_wishes TEXT,
      consensus TEXT,
      action_plan TEXT,
      fm_status TEXT DEFAULT 'Completed',
      recorded_by TEXT,
      created_at TEXT NOT NULL,
      FOREIGN KEY(patient_id) REFERENCES patients(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS ward_palliative_records (
      id TEXT PRIMARY KEY,
      patient_id TEXT NOT NULL,
      ward_type TEXT NOT NULL, -- 'Khon Tan' or 'Home Ward PC'
      bed_number TEXT,
      admitted_from_ward TEXT,
      admission_date TEXT NOT NULL,
      pps_score INTEGER DEFAULT 40,
      care_problems TEXT,
      nursing_interventions TEXT,
      transfer_criteria_met INTEGER DEFAULT 1,
      transfer_criteria_notes TEXT,
      daily_notes TEXT,
      is_reviewed_today INTEGER DEFAULT 0,
      status TEXT DEFAULT 'admitted',
      updated_at TEXT NOT NULL,
      FOREIGN KEY(patient_id) REFERENCES patients(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS discharges (
      id TEXT PRIMARY KEY,
      patient_id TEXT NOT NULL,
      discharge_date TEXT NOT NULL,
      discharge_type TEXT NOT NULL,
      from_ward TEXT,
      destination_details TEXT,
      coc_referral_date TEXT,
      coc_coordinator TEXT,
      has_syringe_bulb INTEGER DEFAULT 0,
      syringe_bulb_protocol TEXT,
      cause_of_death TEXT,
      death_location TEXT,
      icd_z515_checked INTEGER DEFAULT 1,
      icd_z718_checked INTEGER DEFAULT 1,
      summary_notes TEXT,
      created_at TEXT NOT NULL,
      FOREIGN KEY(patient_id) REFERENCES patients(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS bereavement_followups (
      id TEXT PRIMARY KEY,
      patient_id TEXT NOT NULL,
      contact_person TEXT NOT NULL,
      contact_phone TEXT NOT NULL,
      interval_tag TEXT NOT NULL, -- '1_WEEK', '1_MONTH', '3_MONTH'
      due_date TEXT NOT NULL,
      call_date TEXT,
      call_status TEXT DEFAULT 'PENDING', -- 'PENDING', 'COMPLETED', 'NO_ANSWER', 'POSTPONED'
      caller_name TEXT,
      grief_assessment TEXT,
      notes TEXT,
      created_at TEXT NOT NULL,
      FOREIGN KEY(patient_id) REFERENCES patients(id) ON DELETE CASCADE
    );
  `);
}

initSchema();

module.exports = { db, initSchema };
