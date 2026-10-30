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
  const wardKhonTan = patients.filter(p => p.status === 'WARD_PALLIATIVE').length;
  const homeWardPC = patients.filter(p => p.status === 'HOME_WARD_PC').length;
  const deceasedCount = patients.filter(p => p.status === 'DECEASED').length;
  const dischargedCount = patients.filter(p => p.status === 'DISCHARGED').length;
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
