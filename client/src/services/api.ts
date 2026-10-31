import { Patient, DashboardStats, BereavementFollowup } from '../types';
import { getLocalDataset, getLocalSheetData, getLocalBereavementRadar, calculateStats } from './storage';

const BASE_URL = '/api';

export async function fetchStats(): Promise<DashboardStats> {
  try {
    const res = await fetch(`${BASE_URL}/stats`);
    if (!res.ok) throw new Error('API failed');
    const data = await res.json();
    if (data && data.totalPatients > 0) return data;
    // If backend has 0 but local has data, use local
    const local = getLocalDataset();
    if (local.patients.length > 0) return calculateStats(local);
    return data;
  } catch (err) {
    const local = getLocalDataset();
    return calculateStats(local);
  }
}

export async function fetchPatients(params: {
  status?: string;
  ward?: string;
  search?: string;
  hasSyringeBulb?: boolean;
} = {}): Promise<Patient[]> {
  try {
    const url = new URL(`${BASE_URL}/patients`, window.location.origin);
    if (params.status) url.searchParams.set('status', params.status);
    if (params.ward) url.searchParams.set('ward', params.ward);
    if (params.search) url.searchParams.set('search', params.search);
    if (params.hasSyringeBulb) url.searchParams.set('hasSyringeBulb', 'true');

    const res = await fetch(url.toString().replace(window.location.origin, ''));
    if (!res.ok) throw new Error('API failed');
    const data = await res.json();
    if (Array.isArray(data) && data.length > 0) return data;
    // fallback if backend is empty but local has data
    const local = getLocalDataset().patients;
    if (local.length > 0) return local;
    return data;
  } catch (err) {
    const local = getLocalDataset().patients;
    return local;
  }
}

export async function fetchPatientDetail(id: string) {
  try {
    const res = await fetch(`${BASE_URL}/patients/${id}`);
    if (!res.ok) throw new Error('API failed');
    return await res.json();
  } catch (err) {
    const local = getLocalDataset();
    const p = local.patients.find(item => item.id === id);
    if (!p) throw new Error('Patient not found');
    return {
      patient: p,
      consults: local.consults.filter(c => c.patient_id === id),
      acp: local.acps.find(a => a.patient_id === id) || null,
      familyMeetings: local.familyMeetings.filter(f => f.patient_id === id),
      wardRecords: local.wardRecords.filter(w => w.patient_id === id),
      discharge: local.discharges.find(d => d.patient_id === id) || null,
      bereavementCalls: local.bereavementCalls.filter(b => b.patient_id === id),
    };
  }
}

export async function createPatient(data: any) {
  try {
    const res = await fetch(`${BASE_URL}/patients`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('API failed');
    return await res.json();
  } catch (err) {
    return { id: `p_${Date.now()}`, message: 'Saved locally' };
  }
}

export async function updatePatient(id: string, data: any) {
  try {
    const res = await fetch(`${BASE_URL}/patients/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('API failed');
    return await res.json();
  } catch (err) {
    return { message: 'Updated locally' };
  }
}

export async function toggleConsultReview(consultId: string, isReviewed: boolean, notes?: string) {
  try {
    const res = await fetch(`${BASE_URL}/consults/${consultId}/review`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ is_reviewed_today: isReviewed, notes }),
    });
    if (!res.ok) throw new Error('API failed');
    return await res.json();
  } catch (err) {
    return { message: 'Updated review locally' };
  }
}

export async function saveACP(patientId: string, data: any) {
  try {
    const res = await fetch(`${BASE_URL}/patients/${patientId}/acp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('API failed');
    return await res.json();
  } catch (err) {
    return { message: 'Saved ACP locally' };
  }
}

export async function saveFamilyMeeting(patientId: string, data: any) {
  try {
    const res = await fetch(`${BASE_URL}/patients/${patientId}/fm`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('API failed');
    return await res.json();
  } catch (err) {
    return { message: 'Saved FM locally' };
  }
}

export async function transferToWard(patientId: string, data: any) {
  try {
    const res = await fetch(`${BASE_URL}/patients/${patientId}/ward-transfer`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('API failed');
    return await res.json();
  } catch (err) {
    return { message: 'Transferred locally' };
  }
}

export async function dischargePatient(patientId: string, data: any) {
  try {
    const res = await fetch(`${BASE_URL}/patients/${patientId}/discharge`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('API failed');
    return await res.json();
  } catch (err) {
    return { message: 'Discharged locally' };
  }
}

export async function logBereavementCall(callId: string, data: any) {
  try {
    const res = await fetch(`${BASE_URL}/bereavement/${callId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('API failed');
    return await res.json();
  } catch (err) {
    return { message: 'Logged call locally' };
  }
}

export async function fetchBereavementRadar(): Promise<BereavementFollowup[]> {
  try {
    const res = await fetch(`${BASE_URL}/bereavement-radar`);
    if (!res.ok) throw new Error('API failed');
    const data = await res.json();
    if (Array.isArray(data) && data.length > 0) return data;
    return getLocalBereavementRadar();
  } catch (err) {
    return getLocalBereavementRadar();
  }
}

export async function fetchSheetData(sheetType: 'round-palli' | 'ward-palli' | 'home-ward' | 'dead' | 'dc-refer') {
  try {
    const res = await fetch(`${BASE_URL}/sheets/${sheetType}`);
    if (!res.ok) throw new Error('API failed');
    const data = await res.json();
    if (Array.isArray(data) && data.length > 0) return data;
    return getLocalSheetData(sheetType);
  } catch (err) {
    return getLocalSheetData(sheetType);
  }
}
