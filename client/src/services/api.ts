import { Patient, DashboardStats, BereavementFollowup } from '../types';

const BASE_URL = '/api';

export async function fetchStats(): Promise<DashboardStats> {
  const res = await fetch(`${BASE_URL}/stats`);
  if (!res.ok) throw new Error('Failed to fetch stats');
  return res.json();
}

export async function fetchPatients(params: {
  status?: string;
  ward?: string;
  search?: string;
  hasSyringeBulb?: boolean;
} = {}): Promise<Patient[]> {
  const url = new URL(`${BASE_URL}/patients`, window.location.origin);
  if (params.status) url.searchParams.set('status', params.status);
  if (params.ward) url.searchParams.set('ward', params.ward);
  if (params.search) url.searchParams.set('search', params.search);
  if (params.hasSyringeBulb) url.searchParams.set('hasSyringeBulb', 'true');

  const res = await fetch(url.toString().replace(window.location.origin, ''));
  if (!res.ok) throw new Error('Failed to fetch patients');
  return res.json();
}

export async function fetchPatientDetail(id: string) {
  const res = await fetch(`${BASE_URL}/patients/${id}`);
  if (!res.ok) throw new Error('Failed to fetch patient detail');
  return res.json();
}

export async function createPatient(data: any) {
  const res = await fetch(`${BASE_URL}/patients`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to create patient');
  return res.json();
}

export async function updatePatient(id: string, data: any) {
  const res = await fetch(`${BASE_URL}/patients/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to update patient');
  return res.json();
}

export async function toggleConsultReview(consultId: string, isReviewed: boolean, notes?: string) {
  const res = await fetch(`${BASE_URL}/consults/${consultId}/review`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ is_reviewed_today: isReviewed, notes }),
  });
  if (!res.ok) throw new Error('Failed to update review status');
  return res.json();
}

export async function saveACP(patientId: string, data: any) {
  const res = await fetch(`${BASE_URL}/patients/${patientId}/acp`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to save ACP');
  return res.json();
}

export async function saveFamilyMeeting(patientId: string, data: any) {
  const res = await fetch(`${BASE_URL}/patients/${patientId}/fm`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to save family meeting');
  return res.json();
}

export async function transferToWard(patientId: string, data: any) {
  const res = await fetch(`${BASE_URL}/patients/${patientId}/ward-transfer`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to transfer to ward');
  return res.json();
}

export async function dischargePatient(patientId: string, data: any) {
  const res = await fetch(`${BASE_URL}/patients/${patientId}/discharge`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to discharge patient');
  return res.json();
}

export async function logBereavementCall(callId: string, data: any) {
  const res = await fetch(`${BASE_URL}/bereavement/${callId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to log bereavement call');
  return res.json();
}

export async function fetchBereavementRadar(): Promise<BereavementFollowup[]> {
  const res = await fetch(`${BASE_URL}/bereavement-radar`);
  if (!res.ok) throw new Error('Failed to fetch bereavement radar');
  return res.json();
}

export async function fetchSheetData(sheetType: 'round-palli' | 'ward-palli' | 'home-ward' | 'dead' | 'dc-refer') {
  const res = await fetch(`${BASE_URL}/sheets/${sheetType}`);
  if (!res.ok) throw new Error(`Failed to fetch sheet data for ${sheetType}`);
  return res.json();
}
