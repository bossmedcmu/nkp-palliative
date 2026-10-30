const express = require('express');
const cors = require('cors');
const path = require('node:path');
const { db } = require('./db');
const { seedDatabase } = require('./seed');

// Ensure database is seeded on startup
seedDatabase();

const app = express();
app.use(cors());
app.use(express.json());

// Serve static frontend build from client/dist if present
const clientDistPath = path.join(__dirname, '../client/dist');
app.use(express.static(clientDistPath));

const PORT = process.env.PORT || 3001;

// Helper to generate IDs
function genId(prefix = 'id') {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
}

// Reset entire database
app.post('/api/reset', (req, res) => {
  try {
    db.exec(`
      DELETE FROM bereavement_followups;
      DELETE FROM discharges;
      DELETE FROM ward_palliative_records;
      DELETE FROM family_meetings;
      DELETE FROM advance_care_plans;
      DELETE FROM consults;
      DELETE FROM patients;
    `);
    res.json({ message: 'Database reset successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// Seed 30 patients from client
app.post('/api/seed-30', (req, res) => {
  try {
    const { patients, consults, acps, familyMeetings, wardRecords, discharges, bereavementCalls } = req.body;
    
    // Clear first
    db.exec(`
      DELETE FROM bereavement_followups;
      DELETE FROM discharges;
      DELETE FROM ward_palliative_records;
      DELETE FROM family_meetings;
      DELETE FROM advance_care_plans;
      DELETE FROM consults;
      DELETE FROM patients;
    `);

    const insertPatient = db.prepare(`
      INSERT INTO patients (
        id, hn, an, full_name, age, gender, id_card, phone, insurance,
        main_diagnosis, secondary_diagnosis, current_ward, current_bed,
        primary_caregiver, caregiver_relation, caregiver_phone,
        bereavement_contact_name, bereavement_contact_phone, status,
        admission_date, discharge_date, has_syringe_bulb, syringe_bulb_details,
        form_501_done, form_510_done, icd_z515, icd_z718, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    for (const p of patients) {
      insertPatient.run(
        p.id, p.hn, p.an, p.full_name, p.age, p.gender, p.id_card, p.phone, p.insurance,
        p.main_diagnosis, p.secondary_diagnosis, p.current_ward, p.current_bed,
        p.primary_caregiver, p.caregiver_relation, p.caregiver_phone,
        p.bereavement_contact_name, p.bereavement_contact_phone, p.status,
        p.admission_date, p.discharge_date, p.has_syringe_bulb, p.syringe_bulb_details,
        p.form_501_done, p.form_510_done, p.icd_z515, p.icd_z718, p.created_at, p.updated_at
      );
    }

    const insertConsult = db.prepare(`
      INSERT INTO consults (
        id, patient_id, consult_date, from_ward, referring_physician,
        reason_for_consult, triage_level, palliative_doctor, palliative_nurse,
        daily_progress_notes, is_reviewed_today, review_date, status, remarks, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    for (const c of consults) {
      insertConsult.run(
        c.id, c.patient_id, c.consult_date, c.from_ward, c.referring_physician,
        c.reason_for_consult, c.triage_level, c.palliative_doctor, c.palliative_nurse,
        c.daily_progress_notes, c.is_reviewed_today, c.review_date, c.status, c.remarks, c.created_at
      );
    }

    const insertAcp = db.prepare(`
      INSERT INTO advance_care_plans (
        id, patient_id, recorded_date, cpr_status, ett_status, med_comfort,
        med_details, pod, living_will_status, surrogate_decision_maker,
        nutrition_preference, notes, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    for (const a of acps) {
      insertAcp.run(
        a.id, a.patient_id, a.recorded_date, a.cpr_status, a.ett_status, a.med_comfort,
        a.med_details, a.pod, a.living_will_status, a.surrogate_decision_maker,
        a.nutrition_preference, a.notes, a.updated_at
      );
    }

    const insertFm = db.prepare(`
      INSERT INTO family_meetings (
        id, patient_id, meeting_date, location, team_attendees, family_attendees,
        illness_understanding, goals_of_care, spiritual_cultural_wishes,
        consensus, action_plan, fm_status, recorded_by, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    for (const f of familyMeetings) {
      insertFm.run(
        f.id, f.patient_id, f.meeting_date, f.location, f.team_attendees, f.family_attendees,
        f.illness_understanding, f.goals_of_care, f.spiritual_cultural_wishes,
        f.consensus, f.action_plan, f.fm_status, f.recorded_by, f.created_at
      );
    }

    const insertWard = db.prepare(`
      INSERT INTO ward_palliative_records (
        id, patient_id, ward_type, bed_number, admitted_from_ward, admission_date,
        pps_score, care_problems, nursing_interventions, transfer_criteria_met,
        transfer_criteria_notes, daily_notes, is_reviewed_today, status, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    for (const w of wardRecords) {
      insertWard.run(
        w.id, w.patient_id, w.ward_type, w.bed_number, w.admitted_from_ward, w.admission_date,
        w.pps_score, w.care_problems, w.nursing_interventions, w.transfer_criteria_met,
        w.transfer_criteria_notes, w.daily_notes, w.is_reviewed_today, w.status, w.updated_at
      );
    }

    const insertDischarge = db.prepare(`
      INSERT INTO discharges (
        id, patient_id, discharge_date, discharge_type, from_ward, destination_details,
        coc_referral_date, coc_coordinator, has_syringe_bulb, syringe_bulb_protocol,
        cause_of_death, death_location, icd_z515_checked, icd_z718_checked, summary_notes, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    for (const d of discharges) {
      insertDischarge.run(
        d.id, d.patient_id, d.discharge_date, d.discharge_type, d.from_ward, d.destination_details,
        d.coc_referral_date, d.coc_coordinator, d.has_syringe_bulb, d.syringe_bulb_protocol,
        d.cause_of_death, d.death_location, d.icd_z515_checked, d.icd_z718_checked, d.summary_notes, d.created_at
      );
    }

    const insertBereavement = db.prepare(`
      INSERT INTO bereavement_followups (
        id, patient_id, contact_person, contact_phone, interval_tag, due_date,
        call_date, call_status, caller_name, grief_assessment, notes, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    for (const b of bereavementCalls) {
      insertBereavement.run(
        b.id, b.patient_id, b.contact_person, b.contact_phone, b.interval_tag, b.due_date,
        b.call_date, b.call_status, b.caller_name, b.grief_assessment, b.notes, b.created_at
      );
    }

    res.json({ message: 'Successfully seeded 30 mock patients into backend' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// --------------------------------------------------------------------------
// 1. STATS
// --------------------------------------------------------------------------
app.get('/api/stats', (req, res) => {
  try {
    const totalPatients = db.prepare('SELECT COUNT(*) as count FROM patients').get().count;
    const activeConsults = db.prepare("SELECT COUNT(*) as count FROM patients WHERE status IN ('ACTIVE_CONSULT', 'FM_IN_PROGRESS')").get().count;
    const wardKhonTan = db.prepare("SELECT COUNT(*) as count FROM patients WHERE status = 'WARD_PALLIATIVE'").get().count;
    const homeWardPC = db.prepare("SELECT COUNT(*) as count FROM patients WHERE status = 'HOME_WARD_PC'").get().count;
    const deceasedCount = db.prepare("SELECT COUNT(*) as count FROM patients WHERE status = 'DECEASED'").get().count;
    const dischargedCount = db.prepare("SELECT COUNT(*) as count FROM patients WHERE status = 'DISCHARGED'").get().count;
    
    const activeSyringeBulbs = db.prepare("SELECT COUNT(*) as count FROM patients WHERE has_syringe_bulb = 1 AND status != 'DECEASED'").get().count;
    const pendingBereavementCalls = db.prepare("SELECT COUNT(*) as count FROM bereavement_followups WHERE call_status = 'PENDING'").get().count;
    
    const reviewedToday = db.prepare("SELECT COUNT(*) as count FROM consults WHERE is_reviewed_today = 1").get().count;
    const totalActiveConsultRecords = db.prepare("SELECT COUNT(*) as count FROM consults WHERE status = 'active'").get().count;

    const form501Done = db.prepare("SELECT COUNT(*) as count FROM patients WHERE form_501_done = 1").get().count;
    const form510Done = db.prepare("SELECT COUNT(*) as count FROM patients WHERE form_510_done = 1").get().count;
    const z515Done = db.prepare("SELECT COUNT(*) as count FROM patients WHERE icd_z515 = 1").get().count;
    const z718Done = db.prepare("SELECT COUNT(*) as count FROM patients WHERE icd_z718 = 1").get().count;

    res.json({
      totalPatients,
      activeConsults,
      wardKhonTan,
      homeWardPC,
      deceasedCount,
      dischargedCount,
      activeSyringeBulbs,
      pendingBereavementCalls,
      reviewedToday,
      totalActiveConsultRecords,
      compliance: {
        form501Done,
        form510Done,
        z515Done,
        z718Done
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// --------------------------------------------------------------------------
// 2. PATIENT DIRECTORY & QUERY
// --------------------------------------------------------------------------
app.get('/api/patients', (req, res) => {
  try {
    const { status, ward, search, hasSyringeBulb } = req.query;
    let query = `
      SELECT p.*,
        c.is_reviewed_today as consult_reviewed,
        c.triage_level,
        c.palliative_doctor,
        c.consult_date,
        acp.cpr_status,
        acp.ett_status,
        acp.med_comfort,
        acp.pod,
        wp.pps_score,
        wp.bed_number as ward_bed,
        wp.ward_type as wp_ward_type,
        dc.discharge_type,
        dc.discharge_date as dc_date
      FROM patients p
      LEFT JOIN consults c ON p.id = c.patient_id AND c.status = 'active'
      LEFT JOIN advance_care_plans acp ON p.id = acp.patient_id
      LEFT JOIN ward_palliative_records wp ON p.id = wp.patient_id AND wp.status = 'admitted'
      LEFT JOIN discharges dc ON p.id = dc.patient_id
      WHERE 1=1
    `;
    const params = [];

    if (status && status !== 'all') {
      if (status === 'CONSULT_ROUND') {
        query += " AND p.status IN ('ACTIVE_CONSULT', 'FM_IN_PROGRESS')";
      } else {
        query += " AND p.status = ?";
        params.push(status);
      }
    }

    if (ward) {
      query += " AND p.current_ward LIKE ?";
      params.push(`%${ward}%`);
    }

    if (hasSyringeBulb === 'true') {
      query += " AND p.has_syringe_bulb = 1";
    }

    if (search) {
      query += " AND (p.full_name LIKE ? OR p.hn LIKE ? OR p.main_diagnosis LIKE ?)";
      const term = `%${search}%`;
      params.push(term, term, term);
    }

    query += " ORDER BY p.updated_at DESC";

    const rows = db.prepare(query).all(...params);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// --------------------------------------------------------------------------
// 3. FULL PATIENT "PEDIGROW" PROFILE
// --------------------------------------------------------------------------
app.get('/api/patients/:id', (req, res) => {
  try {
    const patient = db.prepare('SELECT * FROM patients WHERE id = ?').get(req.params.id);
    if (!patient) return res.status(404).json({ error: 'Patient not found' });

    const consults = db.prepare('SELECT * FROM consults WHERE patient_id = ? ORDER BY consult_date DESC').all(req.params.id);
    const acp = db.prepare('SELECT * FROM advance_care_plans WHERE patient_id = ?').get(req.params.id) || null;
    const familyMeetings = db.prepare('SELECT * FROM family_meetings WHERE patient_id = ? ORDER BY meeting_date DESC').all(req.params.id);
    const wardRecords = db.prepare('SELECT * FROM ward_palliative_records WHERE patient_id = ? ORDER BY admission_date DESC').all(req.params.id);
    const discharge = db.prepare('SELECT * FROM discharges WHERE patient_id = ? ORDER BY discharge_date DESC LIMIT 1').get(req.params.id) || null;
    const bereavementCalls = db.prepare('SELECT * FROM bereavement_followups WHERE patient_id = ? ORDER BY due_date ASC').all(req.params.id);

    res.json({
      patient,
      consults,
      acp,
      familyMeetings,
      wardRecords,
      discharge,
      bereavementCalls
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// --------------------------------------------------------------------------
// 4. CREATE PATIENT & INITIAL CONSULT
// --------------------------------------------------------------------------
app.post('/api/patients', (req, res) => {
  try {
    const p = req.body;
    const patientId = genId('p');
    const now = new Date().toISOString().replace('T', ' ').substring(0, 19);

    const insertPatient = db.prepare(`
      INSERT INTO patients (
        id, hn, an, full_name, age, gender, id_card, phone, insurance,
        main_diagnosis, secondary_diagnosis, current_ward, current_bed,
        primary_caregiver, caregiver_relation, caregiver_phone,
        bereavement_contact_name, bereavement_contact_phone, status,
        admission_date, discharge_date, has_syringe_bulb, syringe_bulb_details,
        form_501_done, form_510_done, icd_z515, icd_z718, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    insertPatient.run(
      patientId,
      p.hn,
      p.an || null,
      p.full_name,
      Number(p.age) || null,
      p.gender || 'ไม่ระบุ',
      p.id_card || null,
      p.phone || null,
      p.insurance || 'UC (บัตรทอง)',
      p.main_diagnosis,
      p.secondary_diagnosis || null,
      p.current_ward || 'Med 1',
      p.current_bed || null,
      p.primary_caregiver || null,
      p.caregiver_relation || null,
      p.caregiver_phone || null,
      p.bereavement_contact_name || p.primary_caregiver || null,
      p.bereavement_contact_phone || p.caregiver_phone || null,
      p.status || 'ACTIVE_CONSULT',
      p.admission_date || now.split(' ')[0],
      null,
      p.has_syringe_bulb ? 1 : 0,
      p.syringe_bulb_details || null,
      p.form_501_done ? 1 : 0,
      p.form_510_done ? 1 : 0,
      p.icd_z515 ? 1 : 0,
      p.icd_z718 ? 1 : 0,
      now,
      now
    );

    // Initial consult record
    if (p.reason_for_consult) {
      const consultId = genId('c');
      db.prepare(`
        INSERT INTO consults (
          id, patient_id, consult_date, from_ward, referring_physician,
          reason_for_consult, triage_level, palliative_doctor, palliative_nurse,
          daily_progress_notes, is_reviewed_today, review_date, status, remarks, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        consultId,
        patientId,
        p.consult_date || now.split(' ')[0],
        p.current_ward || 'Med 1',
        p.referring_physician || null,
        p.reason_for_consult,
        p.triage_level || 'Routine',
        p.palliative_doctor || null,
        p.palliative_nurse || null,
        p.daily_progress_notes || null,
        0,
        null,
        'active',
        p.remarks || null,
        now
      );
    }

    // Initial ACP if provided
    if (p.cpr_status || p.ett_status || p.pod) {
      const acpId = genId('acp');
      db.prepare(`
        INSERT INTO advance_care_plans (
          id, patient_id, recorded_date, cpr_status, ett_status, med_comfort,
          med_details, pod, living_will_status, surrogate_decision_maker,
          nutrition_preference, notes, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        acpId,
        patientId,
        now.split(' ')[0],
        p.cpr_status || 'DNR',
        p.ett_status || 'No ETT',
        p.med_comfort || 'Morphine comfort protocol',
        p.med_details || null,
        p.pod || 'บ้าน (Home)',
        p.living_will_status || 'ไม่มีหนังสือแสดงเจตนา',
        p.surrogate_decision_maker || p.primary_caregiver || null,
        p.nutrition_preference || null,
        p.acp_notes || null,
        now
      );
    }

    res.status(201).json({ id: patientId, message: 'Patient created successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// --------------------------------------------------------------------------
// 5. UPDATE PATIENT BASELINE
// --------------------------------------------------------------------------
app.put('/api/patients/:id', (req, res) => {
  try {
    const p = req.body;
    const now = new Date().toISOString().replace('T', ' ').substring(0, 19);

    db.prepare(`
      UPDATE patients SET
        full_name = COALESCE(?, full_name),
        age = COALESCE(?, age),
        gender = COALESCE(?, gender),
        phone = COALESCE(?, phone),
        insurance = COALESCE(?, insurance),
        main_diagnosis = COALESCE(?, main_diagnosis),
        secondary_diagnosis = COALESCE(?, secondary_diagnosis),
        current_ward = COALESCE(?, current_ward),
        current_bed = COALESCE(?, current_bed),
        primary_caregiver = COALESCE(?, primary_caregiver),
        caregiver_relation = COALESCE(?, caregiver_relation),
        caregiver_phone = COALESCE(?, caregiver_phone),
        bereavement_contact_name = COALESCE(?, bereavement_contact_name),
        bereavement_contact_phone = COALESCE(?, bereavement_contact_phone),
        status = COALESCE(?, status),
        has_syringe_bulb = COALESCE(?, has_syringe_bulb),
        syringe_bulb_details = COALESCE(?, syringe_bulb_details),
        form_501_done = COALESCE(?, form_501_done),
        form_510_done = COALESCE(?, form_510_done),
        icd_z515 = COALESCE(?, icd_z515),
        icd_z718 = COALESCE(?, icd_z718),
        updated_at = ?
      WHERE id = ?
    `).run(
      p.full_name,
      p.age,
      p.gender,
      p.phone,
      p.insurance,
      p.main_diagnosis,
      p.secondary_diagnosis,
      p.current_ward,
      p.current_bed,
      p.primary_caregiver,
      p.caregiver_relation,
      p.caregiver_phone,
      p.bereavement_contact_name,
      p.bereavement_contact_phone,
      p.status,
      p.has_syringe_bulb !== undefined ? (p.has_syringe_bulb ? 1 : 0) : null,
      p.syringe_bulb_details,
      p.form_501_done !== undefined ? (p.form_501_done ? 1 : 0) : null,
      p.form_510_done !== undefined ? (p.form_510_done ? 1 : 0) : null,
      p.icd_z515 !== undefined ? (p.icd_z515 ? 1 : 0) : null,
      p.icd_z718 !== undefined ? (p.icd_z718 ? 1 : 0) : null,
      now,
      req.params.id
    );

    res.json({ message: 'Patient updated successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// --------------------------------------------------------------------------
// 6. TOGGLE CONSULT REVIEW STATUS (HIGHLIGHT GREEN)
// --------------------------------------------------------------------------
app.put('/api/consults/:id/review', (req, res) => {
  try {
    const { is_reviewed_today, notes } = req.body;
    const now = new Date().toISOString().replace('T', ' ').substring(0, 19);
    const reviewDate = is_reviewed_today ? now.split(' ')[0] : null;

    db.prepare(`
      UPDATE consults SET
        is_reviewed_today = ?,
        review_date = ?,
        daily_progress_notes = COALESCE(?, daily_progress_notes)
      WHERE id = ?
    `).run(is_reviewed_today ? 1 : 0, reviewDate, notes || null, req.params.id);

    res.json({ message: 'Review status updated' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// --------------------------------------------------------------------------
// 7. SAVE / UPDATE ADVANCE CARE PLAN (ACP)
// --------------------------------------------------------------------------
app.post('/api/patients/:id/acp', (req, res) => {
  try {
    const p = req.body;
    const patientId = req.params.id;
    const now = new Date().toISOString().replace('T', ' ').substring(0, 19);

    const existing = db.prepare('SELECT id FROM advance_care_plans WHERE patient_id = ?').get(patientId);

    if (existing) {
      db.prepare(`
        UPDATE advance_care_plans SET
          recorded_date = ?,
          cpr_status = ?,
          ett_status = ?,
          med_comfort = ?,
          med_details = ?,
          pod = ?,
          living_will_status = ?,
          surrogate_decision_maker = ?,
          nutrition_preference = ?,
          notes = ?,
          updated_at = ?
        WHERE patient_id = ?
      `).run(
        p.recorded_date || now.split(' ')[0],
        p.cpr_status,
        p.ett_status,
        p.med_comfort,
        p.med_details,
        p.pod,
        p.living_will_status,
        p.surrogate_decision_maker,
        p.nutrition_preference,
        p.notes,
        now,
        patientId
      );
    } else {
      const acpId = genId('acp');
      db.prepare(`
        INSERT INTO advance_care_plans (
          id, patient_id, recorded_date, cpr_status, ett_status, med_comfort,
          med_details, pod, living_will_status, surrogate_decision_maker,
          nutrition_preference, notes, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        acpId,
        patientId,
        p.recorded_date || now.split(' ')[0],
        p.cpr_status,
        p.ett_status,
        p.med_comfort,
        p.med_details,
        p.pod,
        p.living_will_status,
        p.surrogate_decision_maker,
        p.nutrition_preference,
        p.notes,
        now
      );
    }

    // Touch patient's updated_at
    db.prepare('UPDATE patients SET updated_at = ? WHERE id = ?').run(now, patientId);

    res.json({ message: 'Advance Care Plan saved successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// --------------------------------------------------------------------------
// 8. RECORD FAMILY MEETING (FM)
// --------------------------------------------------------------------------
app.post('/api/patients/:id/fm', (req, res) => {
  try {
    const f = req.body;
    const patientId = req.params.id;
    const fmId = genId('fm');
    const now = new Date().toISOString().replace('T', ' ').substring(0, 19);

    db.prepare(`
      INSERT INTO family_meetings (
        id, patient_id, meeting_date, location, team_attendees, family_attendees,
        illness_understanding, goals_of_care, spiritual_cultural_wishes,
        consensus, action_plan, fm_status, recorded_by, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      fmId,
      patientId,
      f.meeting_date || now,
      f.location || 'ห้องประชุม Palliative',
      f.team_attendees,
      f.family_attendees,
      f.illness_understanding,
      f.goals_of_care,
      f.spiritual_cultural_wishes,
      f.consensus,
      f.action_plan,
      f.fm_status || 'Completed',
      f.recorded_by || 'ทีม Palliative',
      now
    );

    // If meeting completed, update patient status
    if (f.fm_status === 'Completed') {
      db.prepare(`
        UPDATE patients SET
          status = CASE WHEN status = 'FM_IN_PROGRESS' THEN 'ACTIVE_CONSULT' ELSE status END,
          updated_at = ?
        WHERE id = ?
      `).run(now, patientId);
    }

    res.status(201).json({ id: fmId, message: 'Family Meeting recorded' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// --------------------------------------------------------------------------
// 9. TRANSFER TO WARD PALLIATIVE (KHON TAN OR HOME WARD PC)
// --------------------------------------------------------------------------
app.post('/api/patients/:id/ward-transfer', (req, res) => {
  try {
    const w = req.body;
    const patientId = req.params.id;
    const recordId = genId('wp');
    const now = new Date().toISOString().replace('T', ' ').substring(0, 19);

    // Close any previous active ward admission
    db.prepare("UPDATE ward_palliative_records SET status = 'transferred' WHERE patient_id = ? AND status = 'admitted'").run(patientId);

    db.prepare(`
      INSERT INTO ward_palliative_records (
        id, patient_id, ward_type, bed_number, admitted_from_ward, admission_date,
        pps_score, care_problems, nursing_interventions, transfer_criteria_met,
        transfer_criteria_notes, daily_notes, is_reviewed_today, status, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, 'admitted', ?)
    `).run(
      recordId,
      patientId,
      w.ward_type, // 'Khon Tan' or 'Home Ward PC'
      w.bed_number,
      w.admitted_from_ward,
      w.admission_date || now.split(' ')[0],
      Number(w.pps_score) || 40,
      w.care_problems,
      w.nursing_interventions,
      w.transfer_criteria_met ? 1 : 0,
      w.transfer_criteria_notes,
      w.daily_notes,
      now
    );

    // Update patient master record
    const newStatus = w.ward_type === 'Khon Tan' ? 'WARD_PALLIATIVE' : 'HOME_WARD_PC';
    const newWardName = w.ward_type === 'Khon Tan' ? 'Ward Palliative ขอนตาล' : 'Home Ward PC';

    db.prepare(`
      UPDATE patients SET
        current_ward = ?,
        current_bed = ?,
        status = ?,
        has_syringe_bulb = COALESCE(?, has_syringe_bulb),
        form_501_done = 1,
        form_510_done = CASE WHEN ? = 'Home Ward PC' THEN 1 ELSE form_510_done END,
        updated_at = ?
      WHERE id = ?
    `).run(
      newWardName,
      w.bed_number,
      newStatus,
      w.has_syringe_bulb !== undefined ? (w.has_syringe_bulb ? 1 : 0) : null,
      w.ward_type,
      now,
      patientId
    );

    res.json({ message: 'Patient transferred to Palliative Ward successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// --------------------------------------------------------------------------
// 10. DISCHARGE / TERMINAL / DECEASED RECORD
// --------------------------------------------------------------------------
app.post('/api/patients/:id/discharge', (req, res) => {
  try {
    const d = req.body;
    const patientId = req.params.id;
    const dcId = genId('dc');
    const now = new Date().toISOString().replace('T', ' ').substring(0, 19);
    const dcDate = d.discharge_date || now;

    // Insert discharge record
    db.prepare(`
      INSERT INTO discharges (
        id, patient_id, discharge_date, discharge_type, from_ward, destination_details,
        coc_referral_date, coc_coordinator, has_syringe_bulb, syringe_bulb_protocol,
        cause_of_death, death_location, icd_z515_checked, icd_z718_checked, summary_notes, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      dcId,
      patientId,
      dcDate,
      d.discharge_type,
      d.from_ward,
      d.destination_details,
      d.coc_referral_date,
      d.coc_coordinator,
      d.has_syringe_bulb ? 1 : 0,
      d.syringe_bulb_protocol,
      d.cause_of_death,
      d.death_location,
      d.icd_z515_checked ? 1 : 0,
      d.icd_z718_checked ? 1 : 0,
      d.summary_notes,
      now
    );

    // Determine new patient status
    let finalStatus = 'DISCHARGED';
    if (d.discharge_type.includes('Dead') || d.discharge_type.includes('Death')) {
      finalStatus = 'DECEASED';
    }

    db.prepare(`
      UPDATE patients SET
        status = ?,
        discharge_date = ?,
        has_syringe_bulb = ?,
        icd_z515 = 1,
        icd_z718 = 1,
        updated_at = ?
      WHERE id = ?
    `).run(
      finalStatus,
      dcDate,
      d.has_syringe_bulb ? 1 : 0,
      now,
      patientId
    );

    // If deceased or terminal discharge, automatically schedule Grief & Bereavement follow-up!
    if (finalStatus === 'DECEASED' || d.discharge_type.includes('Dead') || d.discharge_type.includes('ปฏิเสธการรักษา')) {
      const p = db.prepare('SELECT bereavement_contact_name, bereavement_contact_phone, primary_caregiver, caregiver_phone FROM patients WHERE id = ?').get(patientId);
      const contactPerson = p.bereavement_contact_name || p.primary_caregiver || 'ครอบครัว';
      const contactPhone = p.bereavement_contact_phone || p.caregiver_phone || '-';

      // 1 week follow-up: +7 days
      const d1w = new Date(Date.now() + 7 * 24 * 3600 * 1000).toISOString().split('T')[0];
      // 1 month follow-up: +30 days
      const d1m = new Date(Date.now() + 30 * 24 * 3600 * 1000).toISOString().split('T')[0];
      // 3 month follow-up: +90 days
      const d3m = new Date(Date.now() + 90 * 24 * 3600 * 1000).toISOString().split('T')[0];

      const insertBf = db.prepare(`
        INSERT INTO bereavement_followups (
          id, patient_id, contact_person, contact_phone, interval_tag, due_date,
          call_date, call_status, caller_name, grief_assessment, notes, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, NULL, 'PENDING', NULL, NULL, ?, ?)
      `);

      insertBf.run(genId('bf'), patientId, contactPerson, contactPhone, '1_WEEK', d1w, 'กำหนดติดตาม ภายใน 1 สัปดาห์', now);
      insertBf.run(genId('bf'), patientId, contactPerson, contactPhone, '1_MONTH', d1m, 'กำหนดติดตาม 1 เดือน', now);
      insertBf.run(genId('bf'), patientId, contactPerson, contactPhone, '3_MONTH', d3m, 'กำหนดติดตาม 3 เดือน', now);
    }

    res.json({ message: 'Discharge recorded successfully and bereavement workflow scheduled' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// --------------------------------------------------------------------------
// 11. BEREAVEMENT CALL UPDATE
// --------------------------------------------------------------------------
app.put('/api/bereavement/:id', (req, res) => {
  try {
    const b = req.body;
    const now = new Date().toISOString().replace('T', ' ').substring(0, 19);

    db.prepare(`
      UPDATE bereavement_followups SET
        call_date = ?,
        call_status = ?,
        caller_name = ?,
        grief_assessment = ?,
        notes = ?
      WHERE id = ?
    `).run(
      b.call_date || now.split(' ')[0],
      b.call_status || 'COMPLETED',
      b.caller_name,
      b.grief_assessment,
      b.notes,
      req.params.id
    );

    res.json({ message: 'Bereavement call logged successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// --------------------------------------------------------------------------
// 12. GET BEREAVEMENT RADAR
// --------------------------------------------------------------------------
app.get('/api/bereavement-radar', (req, res) => {
  try {
    const calls = db.prepare(`
      SELECT bf.*, p.full_name as patient_name, p.hn, p.main_diagnosis, p.discharge_date,
        dc.discharge_type, dc.cause_of_death
      FROM bereavement_followups bf
      JOIN patients p ON bf.patient_id = p.id
      LEFT JOIN discharges dc ON p.id = dc.patient_id
      ORDER BY bf.call_status ASC, bf.due_date ASC
    `).all();

    res.json(calls);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// --------------------------------------------------------------------------
// 13. SPREADSHEET VIEWS (MATCHING GOOGLE SHEET TABS EXACTLY)
// --------------------------------------------------------------------------

// 13.1 Round Palli Sheet View
app.get('/api/sheets/round-palli', (req, res) => {
  try {
    const rows = db.prepare(`
      SELECT
        p.id, p.full_name, p.age, p.hn, p.current_ward as ward, p.current_bed as bed,
        p.main_diagnosis as dx,
        acp.med_comfort as acp_med,
        acp.ett_status as acp_ett,
        acp.cpr_status as acp_cpr,
        acp.pod,
        fm.fm_status as fm_status,
        p.form_501_done,
        p.bereavement_contact_phone,
        c.id as consult_id,
        c.is_reviewed_today,
        c.daily_progress_notes,
        c.remarks,
        c.triage_level,
        p.status
      FROM patients p
      JOIN consults c ON p.id = c.patient_id AND c.status = 'active'
      LEFT JOIN advance_care_plans acp ON p.id = acp.patient_id
      LEFT JOIN family_meetings fm ON p.id = fm.patient_id
      WHERE p.status IN ('ACTIVE_CONSULT', 'FM_IN_PROGRESS')
      ORDER BY c.is_reviewed_today ASC, p.current_ward ASC
    `).all();

    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// 13.2 Ward Palli (Khon Tan) Sheet View
app.get('/api/sheets/ward-palli', (req, res) => {
  try {
    const rows = db.prepare(`
      SELECT
        p.id, p.full_name, p.age, p.hn, wp.admitted_from_ward as from_ward,
        wp.bed_number as bed, p.main_diagnosis as dx,
        acp.med_comfort as acp_med, acp.ett_status as acp_ett, acp.cpr_status as acp_cpr,
        wp.pps_score as pps,
        fm.fm_status as fm,
        p.insurance,
        p.bereavement_contact_name,
        p.bereavement_contact_phone,
        wp.care_problems,
        wp.nursing_interventions,
        wp.is_reviewed_today,
        wp.daily_notes,
        p.has_syringe_bulb,
        p.syringe_bulb_details,
        p.status
      FROM patients p
      JOIN ward_palliative_records wp ON p.id = wp.patient_id AND wp.status = 'admitted' AND wp.ward_type = 'Khon Tan'
      LEFT JOIN advance_care_plans acp ON p.id = acp.patient_id
      LEFT JOIN family_meetings fm ON p.id = fm.patient_id
      WHERE p.status = 'WARD_PALLIATIVE'
      ORDER BY wp.bed_number ASC
    `).all();

    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// 13.3 Home Ward PC Sheet View
app.get('/api/sheets/home-ward', (req, res) => {
  try {
    const rows = db.prepare(`
      SELECT
        p.id, p.full_name, p.age, p.hn, p.current_ward as ward, p.current_bed as bed,
        p.main_diagnosis as dx,
        acp.med_comfort as acp_med, acp.ett_status as acp_ett, acp.cpr_status as acp_cpr,
        acp.pod,
        fm.fm_status as fm,
        p.insurance,
        p.form_510_done,
        p.bereavement_contact_name,
        p.bereavement_contact_phone,
        wp.care_problems,
        wp.daily_notes,
        p.has_syringe_bulb,
        p.status
      FROM patients p
      JOIN ward_palliative_records wp ON p.id = wp.patient_id AND wp.status = 'admitted' AND wp.ward_type = 'Home Ward PC'
      LEFT JOIN advance_care_plans acp ON p.id = acp.patient_id
      LEFT JOIN family_meetings fm ON p.id = fm.patient_id
      WHERE p.status = 'HOME_WARD_PC'
      ORDER BY wp.admission_date DESC
    `).all();

    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// 13.4 Dead & ปฏิเสธรักษา Sheet View (Khon Tan, รพ.นครพิงค์, Home Ward)
app.get('/api/sheets/dead', (req, res) => {
  try {
    const rows = db.prepare(`
      SELECT
        p.id, p.full_name, p.age, p.hn, dc.from_ward, p.main_diagnosis as dx,
        acp.med_comfort as acp_med, acp.ett_status as acp_ett, acp.cpr_status as acp_cpr,
        p.insurance,
        p.bereavement_contact_name,
        p.bereavement_contact_phone,
        dc.discharge_date as dead_date,
        dc.discharge_type,
        dc.destination_details,
        dc.cause_of_death,
        dc.coc_referral_date,
        dc.has_syringe_bulb,
        (SELECT notes FROM bereavement_followups WHERE patient_id = p.id AND interval_tag = '1_WEEK') as bf_1w,
        (SELECT call_status FROM bereavement_followups WHERE patient_id = p.id AND interval_tag = '1_WEEK') as bf_1w_status,
        (SELECT notes FROM bereavement_followups WHERE patient_id = p.id AND interval_tag = '1_MONTH') as bf_1m,
        (SELECT call_status FROM bereavement_followups WHERE patient_id = p.id AND interval_tag = '1_MONTH') as bf_1m_status,
        (SELECT notes FROM bereavement_followups WHERE patient_id = p.id AND interval_tag = '3_MONTH') as bf_3m,
        (SELECT call_status FROM bereavement_followups WHERE patient_id = p.id AND interval_tag = '3_MONTH') as bf_3m_status
      FROM patients p
      JOIN discharges dc ON p.id = dc.patient_id
      LEFT JOIN advance_care_plans acp ON p.id = acp.patient_id
      WHERE p.status = 'DECEASED' OR dc.discharge_type LIKE '%Dead%' OR dc.discharge_type LIKE '%Death%'
      ORDER BY dc.discharge_date DESC
    `).all();

    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// 13.5 DC & Refer Sheet View
app.get('/api/sheets/dc-refer', (req, res) => {
  try {
    const rows = db.prepare(`
      SELECT
        p.id, p.full_name, p.age, p.hn, dc.from_ward, p.main_diagnosis as dx,
        acp.med_comfort as acp_med, acp.ett_status as acp_ett, acp.cpr_status as acp_cpr,
        p.insurance,
        p.bereavement_contact_name,
        p.bereavement_contact_phone,
        dc.discharge_date,
        dc.discharge_type,
        dc.destination_details,
        dc.coc_referral_date,
        dc.has_syringe_bulb,
        dc.summary_notes
      FROM patients p
      JOIN discharges dc ON p.id = dc.patient_id
      LEFT JOIN advance_care_plans acp ON p.id = acp.patient_id
      WHERE p.status = 'DISCHARGED' AND dc.discharge_type NOT LIKE '%Dead%' AND dc.discharge_type NOT LIKE '%Death%'
      ORDER BY dc.discharge_date DESC
    `).all();

    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// Fallback to client/dist/index.html for SPA routing
app.use((req, res, next) => {
  if (req.method === 'GET' && !req.path.startsWith('/api')) {
    return res.sendFile(path.join(clientDistPath, 'index.html'));
  }
  next();
});

app.listen(PORT, () => {
  console.log(`Palliative Care Backend API is running on http://localhost:${PORT}`);
});
