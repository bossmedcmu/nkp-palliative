import { Patient, Consult, AdvanceCarePlan, FamilyMeeting, WardRecord, Discharge, BereavementFollowup, DashboardStats } from '../types';
import { generate30MockPatients, CompleteDataset } from './mockDataGenerator';

const STORAGE_KEYS = {
  PATIENTS: 'nkp_palli_patients',
  CONSULTS: 'nkp_palli_consults',
  ACPS: 'nkp_palli_acps',
  FMS: 'nkp_palli_fms',
  WARDS: 'nkp_palli_wards',
  DISCHARGES: 'nkp_palli_discharges',
  BEREAVEMENT: 'nkp_palli_bereavement',
  AUTH: 'nkp_palli_auth',
};

// Check if localStorage has data
export function hasStoredData(): boolean {
  const p = localStorage.getItem(STORAGE_KEYS.PATIENTS);
  return !!p && JSON.parse(p).length > 0;
}

// Get all dataset from localStorage
export function getLocalDataset(): CompleteDataset {
  return {
    patients: JSON.parse(localStorage.getItem(STORAGE_KEYS.PATIENTS) || '[]'),
    consults: JSON.parse(localStorage.getItem(STORAGE_KEYS.CONSULTS) || '[]'),
    acps: JSON.parse(localStorage.getItem(STORAGE_KEYS.ACPS) || '[]'),
    familyMeetings: JSON.parse(localStorage.getItem(STORAGE_KEYS.FMS) || '[]'),
    wardRecords: JSON.parse(localStorage.getItem(STORAGE_KEYS.WARDS) || '[]'),
    discharges: JSON.parse(localStorage.getItem(STORAGE_KEYS.DISCHARGES) || '[]'),
    bereavementCalls: JSON.parse(localStorage.getItem(STORAGE_KEYS.BEREAVEMENT) || '[]'),
  };
}

// Save complete dataset to localStorage
export function saveLocalDataset(dataset: CompleteDataset) {
  localStorage.setItem(STORAGE_KEYS.PATIENTS, JSON.stringify(dataset.patients));
  localStorage.setItem(STORAGE_KEYS.CONSULTS, JSON.stringify(dataset.consults));
  localStorage.setItem(STORAGE_KEYS.ACPS, JSON.stringify(dataset.acps));
  localStorage.setItem(STORAGE_KEYS.FMS, JSON.stringify(dataset.familyMeetings));
  localStorage.setItem(STORAGE_KEYS.WARDS, JSON.stringify(dataset.wardRecords));
  localStorage.setItem(STORAGE_KEYS.DISCHARGES, JSON.stringify(dataset.discharges));
  localStorage.setItem(STORAGE_KEYS.BEREAVEMENT, JSON.stringify(dataset.bereavementCalls));
}

// Reset / Empty the database
export async function resetDatabase(): Promise<void> {
  const empty: CompleteDataset = {
    patients: [],
    consults: [],
    acps: [],
    familyMeetings: [],
    wardRecords: [],
    discharges: [],
    bereavementCalls: []
  };
  saveLocalDataset(empty);

  // Also notify backend if running
  try {
    await fetch('/api/reset', { method: 'POST' });
  } catch (e) {
    // offline or static github pages
  }
}

// Load 30 Mock Patients
export async function load30MockPatients(): Promise<CompleteDataset> {
  const data = generate30MockPatients();
  saveLocalDataset(data);

  // Also push to backend if available
  try {
    await fetch('/api/seed-30', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
  } catch (e) {
    // offline or static
  }

  return data;
}

// Calculate comprehensive dashboard stats from local dataset
export function calculateStats(dataset: CompleteDataset): DashboardStats {
  const patients = dataset.patients;
  const consults = dataset.consults;
  const bereavement = dataset.bereavementCalls;

  const activeConsults = patients.filter(p => p.status === 'ACTIVE_CONSULT' || p.status === 'FM_IN_PROGRESS').length;
  const wardKhonTan = patients.filter(p => p.status === 'WARD_PALLIATIVE' || p.current_ward.includes('ขอนตาล')).length;
  const homeWardPC = patients.filter(p => p.status === 'HOME_WARD_PC' || p.current_ward.includes('Home')).length;
  const deceasedCount = patients.filter(p => p.status === 'DECEASED' || (p as any).discharge_type?.includes('Dead') || (p as any).discharge_type?.includes('Death')).length;
  const dischargedCount = patients.filter(p => p.status === 'DISCHARGED' && !(p as any).discharge_type?.includes('Dead') && !(p as any).discharge_type?.includes('Death')).length;
  const activeSyringeBulbs = patients.filter(p => p.has_syringe_bulb === 1 && p.status !== 'DECEASED').length;
  const pendingBereavementCalls = bereavement.filter(b => b.call_status === 'PENDING').length;
  const reviewedToday = consults.filter(c => c.is_reviewed_today === 1).length;
  const totalActiveConsultRecords = consults.filter(c => c.status === 'active').length;

  const form501Done = patients.filter(p => p.form_501_done === 1).length;
  const form510Done = patients.filter(p => p.form_510_done === 1).length;
  const z515Done = patients.filter(p => p.icd_z515 === 1).length;
  const z718Done = patients.filter(p => p.icd_z718 === 1).length;

  return {
    totalPatients: patients.length,
    activeConsults,
    wardKhonTan,
    homeWardPC,
    deceasedCount,
    dischargedCount,
    activeSyringeBulbs,
    pendingBereavementCalls,
    reviewedToday,
    totalActiveConsultRecords: totalActiveConsultRecords || activeConsults,
    compliance: {
      form501Done,
      form510Done,
      z515Done,
      z718Done
    }
  };
}

// Get Sheet Data from Local Storage (Ensures 100% reliability on GitHub Pages & offline)
export function getLocalSheetData(sheetType: 'round-palli' | 'ward-palli' | 'home-ward' | 'dead' | 'dc-refer'): any[] {
  const local = getLocalDataset();
  const { patients, consults, acps, familyMeetings, wardRecords, discharges, bereavementCalls } = local;

  switch (sheetType) {
    case 'round-palli': {
      const activePts = patients.filter(p => p.status === 'ACTIVE_CONSULT' || p.status === 'FM_IN_PROGRESS');
      return activePts.map(p => {
        const c = consults.find(item => item.patient_id === p.id && item.status === 'active') || consults.find(item => item.patient_id === p.id);
        const acp = acps.find(item => item.patient_id === p.id);
        const fm = familyMeetings.find(item => item.patient_id === p.id);
        return {
          id: p.id,
          full_name: p.full_name,
          age: p.age,
          hn: p.hn,
          ward: p.current_ward,
          bed: p.current_bed || '-',
          dx: p.main_diagnosis,
          acp_med: acp?.med_comfort || p.med_comfort || '-',
          acp_ett: acp?.ett_status || p.ett_status || '-',
          acp_cpr: acp?.cpr_status || p.cpr_status || 'DNR',
          pod: acp?.pod || p.pod || 'บ้าน (Home)',
          fm_status: fm?.fm_status || (p.status === 'FM_IN_PROGRESS' ? 'Planned' : 'Completed'),
          form_501_done: p.form_501_done,
          bereavement_contact_phone: p.bereavement_contact_phone,
          consult_id: c?.id || `c_${p.id}`,
          is_reviewed_today: c?.is_reviewed_today ?? p.consult_reviewed ?? 1,
          daily_progress_notes: c?.daily_progress_notes || 'ผู้ป่วยรู้สึกตัวดี อาการปวดควบคุมได้',
          remarks: c?.remarks || (p.status === 'FM_IN_PROGRESS' ? 'รอประชุมครอบครัว' : ''),
          triage_level: c?.triage_level || p.triage_level || 'Routine',
          status: p.status
        };
      });
    }

    case 'ward-palli': {
      const wardPts = patients.filter(p => p.status === 'WARD_PALLIATIVE' || p.current_ward.includes('ขอนตาล'));
      return wardPts.map(p => {
        const w = wardRecords.find(item => item.patient_id === p.id && item.ward_type === 'Khon Tan') || wardRecords.find(item => item.patient_id === p.id);
        const acp = acps.find(item => item.patient_id === p.id);
        const fm = familyMeetings.find(item => item.patient_id === p.id);
        return {
          id: p.id,
          full_name: p.full_name,
          age: p.age,
          hn: p.hn,
          from_ward: w?.admitted_from_ward || 'Med',
          bed: p.current_bed || w?.bed_number || 'ขอนตาล 01',
          dx: p.main_diagnosis,
          acp_med: acp?.med_comfort || p.med_comfort || '-',
          acp_ett: acp?.ett_status || p.ett_status || '-',
          acp_cpr: acp?.cpr_status || p.cpr_status || 'DNR',
          pps: w?.pps_score || p.pps_score || 30,
          fm: fm?.fm_status || 'Completed',
          insurance: p.insurance,
          bereavement_contact_name: p.bereavement_contact_name,
          bereavement_contact_phone: p.bereavement_contact_phone,
          care_problems: w?.care_problems || 'ปัญหาอาการรบกวนและความสุขสบาย',
          nursing_interventions: w?.nursing_interventions || 'การพยาบาลประคับประคองเฉพาะทาง',
          is_reviewed_today: w?.is_reviewed_today ?? 1,
          daily_notes: w?.daily_notes || 'นอนหลับพักได้ สัญญาณชีพคงที่',
          has_syringe_bulb: p.has_syringe_bulb,
          syringe_bulb_details: p.syringe_bulb_details,
          status: p.status
        };
      });
    }

    case 'home-ward': {
      const homePts = patients.filter(p => p.status === 'HOME_WARD_PC' || p.current_ward.includes('Home'));
      return homePts.map(p => {
        const w = wardRecords.find(item => item.patient_id === p.id && item.ward_type === 'Home Ward PC') || wardRecords.find(item => item.patient_id === p.id);
        const acp = acps.find(item => item.patient_id === p.id);
        const fm = familyMeetings.find(item => item.patient_id === p.id);
        return {
          id: p.id,
          full_name: p.full_name,
          age: p.age,
          hn: p.hn,
          ward: p.current_ward,
          bed: p.current_bed || w?.bed_number || 'Home-01',
          dx: p.main_diagnosis,
          acp_med: acp?.med_comfort || p.med_comfort || '-',
          acp_ett: acp?.ett_status || p.ett_status || '-',
          acp_cpr: acp?.cpr_status || p.cpr_status || 'DNR',
          pod: acp?.pod || p.pod || 'บ้าน (Home)',
          fm: fm?.fm_status || 'Completed',
          insurance: p.insurance,
          form_510_done: p.form_510_done,
          bereavement_contact_name: p.bereavement_contact_name,
          bereavement_contact_phone: p.bereavement_contact_phone,
          care_problems: w?.care_problems || 'ดูแลต่อเนื่องที่บ้านร่วมกับศูนย์ COC',
          daily_notes: w?.daily_notes || 'ญาติดูแลได้ดี ไม่มีไข้',
          has_syringe_bulb: p.has_syringe_bulb,
          status: p.status
        };
      });
    }

    case 'dead': {
      const deadPts = patients.filter(p => 
        p.status === 'DECEASED' || 
        (p as any).discharge_type?.includes('Dead') || 
        (p as any).discharge_type?.includes('Death') ||
        discharges.some(d => d.patient_id === p.id && (d.discharge_type.includes('Dead') || d.discharge_type.includes('Death')))
      );
      return deadPts.map(p => {
        const dc = discharges.find(item => item.patient_id === p.id);
        const acp = acps.find(item => item.patient_id === p.id);
        const bf1w = bereavementCalls.find(b => b.patient_id === p.id && b.interval_tag === '1_WEEK');
        const bf1m = bereavementCalls.find(b => b.patient_id === p.id && b.interval_tag === '1_MONTH');
        const bf3m = bereavementCalls.find(b => b.patient_id === p.id && b.interval_tag === '3_MONTH');

        return {
          id: p.id,
          full_name: p.full_name,
          age: p.age,
          hn: p.hn,
          from_ward: dc?.from_ward || p.current_ward,
          dx: p.main_diagnosis,
          acp_med: acp?.med_comfort || p.med_comfort || '-',
          acp_ett: acp?.ett_status || p.ett_status || '-',
          acp_cpr: acp?.cpr_status || p.cpr_status || 'DNR',
          insurance: p.insurance,
          bereavement_contact_name: p.bereavement_contact_name,
          bereavement_contact_phone: p.bereavement_contact_phone,
          dead_date: dc?.discharge_date || p.discharge_date || '2026-10-20',
          discharge_type: dc?.discharge_type || (p as any).discharge_type || 'Dead/ปฏิเสธการรักษากลับไปเสียชีวิตที่บ้าน',
          destination_details: dc?.destination_details || 'บ้านผู้ป่วย',
          cause_of_death: dc?.cause_of_death || p.main_diagnosis,
          coc_referral_date: dc?.coc_referral_date || '2026-10-18',
          has_syringe_bulb: dc?.has_syringe_bulb ?? p.has_syringe_bulb,
          bf_1w: bf1w?.notes || '',
          bf_1w_status: bf1w?.call_status || 'COMPLETED',
          bf_1m: bf1m?.notes || '',
          bf_1m_status: bf1m?.call_status || 'PENDING',
          bf_3m: bf3m?.notes || '',
          bf_3m_status: bf3m?.call_status || 'PENDING'
        };
      });
    }

    case 'dc-refer': {
      const dcPts = patients.filter(p => 
        p.status === 'DISCHARGED' && 
        !(p as any).discharge_type?.includes('Dead') && 
        !(p as any).discharge_type?.includes('Death') &&
        (!discharges.some(d => d.patient_id === p.id && (d.discharge_type.includes('Dead') || d.discharge_type.includes('Death'))))
      );
      return dcPts.map(p => {
        const dc = discharges.find(item => item.patient_id === p.id);
        const acp = acps.find(item => item.patient_id === p.id);
        return {
          id: p.id,
          full_name: p.full_name,
          age: p.age,
          hn: p.hn,
          from_ward: dc?.from_ward || p.current_ward,
          dx: p.main_diagnosis,
          acp_med: acp?.med_comfort || p.med_comfort || '-',
          acp_ett: acp?.ett_status || p.ett_status || '-',
          acp_cpr: acp?.cpr_status || p.cpr_status || 'DNR',
          insurance: p.insurance,
          bereavement_contact_name: p.bereavement_contact_name,
          bereavement_contact_phone: p.bereavement_contact_phone,
          discharge_date: dc?.discharge_date || p.discharge_date || '2026-10-26',
          discharge_type: dc?.discharge_type || (p as any).discharge_type || 'D/C แนวโน้มยังไม่เสียชีวิต',
          destination_details: dc?.destination_details || 'กลับบ้าน / Refer รพช.',
          coc_referral_date: dc?.coc_referral_date || null,
          has_syringe_bulb: dc?.has_syringe_bulb ?? p.has_syringe_bulb,
          summary_notes: dc?.summary_notes || 'อาการทรงตัว ควบคุมอาการปวดได้ดี'
        };
      });
    }
  }
}

// Get Bereavement Radar from Local Storage
export function getLocalBereavementRadar(): BereavementFollowup[] {
  const local = getLocalDataset();
  const { bereavementCalls, patients, discharges } = local;

  return bereavementCalls.map(b => {
    const p = patients.find(item => item.id === b.patient_id);
    const dc = discharges.find(item => item.patient_id === b.patient_id);
    return {
      ...b,
      patient_name: b.patient_name || p?.full_name || 'ผู้ป่วย',
      hn: b.hn || p?.hn || '-',
      main_diagnosis: b.main_diagnosis || p?.main_diagnosis || '-',
      discharge_date: b.discharge_date || dc?.discharge_date || p?.discharge_date || '-',
      discharge_type: b.discharge_type || dc?.discharge_type || 'Dead/ปฏิเสธการรักษา'
    };
  });
}
