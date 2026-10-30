import React, { useState } from 'react';
import { 
  Users, Activity, Bed, Home, HeartHandshake, Syringe, 
  CheckCircle2, Clock, AlertTriangle, ChevronRight, FileCheck,
  TrendingUp, PlusCircle, PieChart, BarChart3, ShieldCheck,
  Calendar, Layers, Heart, Award, ArrowUpRight
} from 'lucide-react';
import { DashboardStats, Patient } from '../types';

interface DashboardProps {
  stats: DashboardStats | null;
  patients: Patient[];
  onNavigate: (tab: string) => void;
  onOpenNewPatientModal: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  stats,
  patients,
  onNavigate,
  onOpenNewPatientModal
}) => {
  if (!stats) {
    return (
      <div className="p-16 text-center text-slate-500 bg-white rounded-3xl border border-slate-200">
        กำลังโหลดข้อมูลสถิติและการวิเคราะห์ Palliative Care...
      </div>
    );
  }

  // Computed metrics from patient list for multidimensional charts
  const total = patients.length || 1;

  // 1. Setting Breakdown
  const consultCount = patients.filter(p => p.status === 'ACTIVE_CONSULT' || p.status === 'FM_IN_PROGRESS').length;
  const khonTanCount = patients.filter(p => p.status === 'WARD_PALLIATIVE').length;
  const homeWardCount = patients.filter(p => p.status === 'HOME_WARD_PC').length;
  const deceasedCount = patients.filter(p => p.status === 'DECEASED').length;
  const dischargedCount = patients.filter(p => p.status === 'DISCHARGED').length;

  // 2. Ward of Origin Breakdown
  const wardCounts: { [key: string]: number } = {};
  patients.forEach(p => {
    let w = p.current_ward.split(' ')[0];
    if (w.includes('ขอนตาล')) w = 'ขอนตาล';
    else if (w.includes('Home')) w = 'Home PC';
    else if (w.includes('Discharged') || w.includes('Refer')) w = 'Refer/DC';
    wardCounts[w] = (wardCounts[w] || 0) + 1;
  });

  // 3. Diagnosis Breakdown
  let cancerCount = 0;
  let nonCancerCount = 0;
  const dxCategories: { [key: string]: number } = {
    'Lung Cancer': 0,
    'Hepatobiliary / Cholangio': 0,
    'GI / Colorectal / Gastric': 0,
    'Breast / Gynecologic': 0,
    'ESRD (โรคไตวายเรื้อรัง)': 0,
    'Heart Failure / COPD': 0,
    'Stroke / Dementia / Neuro': 0,
    'Other / อื่นๆ': 0,
  };

  patients.forEach(p => {
    const dx = p.main_diagnosis.toLowerCase();
    if (dx.includes('cancer') || dx.includes('carcinoma') || dx.includes('cholangio') || dx.includes('tumor') || dx.includes('glioblastoma') || dx.includes('melanoma')) {
      cancerCount++;
      if (dx.includes('lung')) dxCategories['Lung Cancer']++;
      else if (dx.includes('cholangio') || dx.includes('hepatocellular') || dx.includes('hcc') || dx.includes('liver')) dxCategories['Hepatobiliary / Cholangio']++;
      else if (dx.includes('colon') || dx.includes('gastric') || dx.includes('rectal') || dx.includes('bowel') || dx.includes('esophageal') || dx.includes('pancreatic')) dxCategories['GI / Colorectal / Gastric']++;
      else if (dx.includes('breast') || dx.includes('cervical') || dx.includes('ovarian')) dxCategories['Breast / Gynecologic']++;
      else dxCategories['Other / อื่นๆ']++;
    } else {
      nonCancerCount++;
      if (dx.includes('renal') || dx.includes('esrd') || dx.includes('kidney') || dx.includes('uremic')) dxCategories['ESRD (โรคไตวายเรื้อรัง)']++;
      else if (dx.includes('heart') || dx.includes('chf') || dx.includes('copd')) dxCategories['Heart Failure / COPD']++;
      else if (dx.includes('stroke') || dx.includes('dementia') || dx.includes('als') || dx.includes('ich') || dx.includes('parkinson') || dx.includes('infarct')) dxCategories['Stroke / Dementia / Neuro']++;
      else dxCategories['Other / อื่นๆ']++;
    }
  });

  // 4. PPS Score Breakdown
  const ppsDistribution = {
    '10-20% (ติดเตียง/ไม่รู้สึกตัว)': patients.filter(p => (p.pps_score || 30) <= 20).length,
    '30-40% (อยู่บนเตียงเป็นหลัก)': patients.filter(p => (p.pps_score || 30) === 30 || (p.pps_score || 30) === 40).length,
    '50-60% (เคลื่อนไหวได้บ้าง)': patients.filter(p => (p.pps_score || 30) === 50 || (p.pps_score || 30) === 60).length,
    '70%+ (ช่วยเหลือตนเองได้)': patients.filter(p => (p.pps_score || 30) >= 70).length,
  };

  // 5. ACP Concordance
  const dnrCount = patients.filter(p => (p.cpr_status || '').includes('DNR')).length;
  const noEttCount = patients.filter(p => (p.ett_status || '').includes('No') || (p.ett_status || '').includes('Extubation')).length;
  
  const podHome = patients.filter(p => (p.pod || '').includes('บ้าน')).length;
  const podKhonTan = patients.filter(p => (p.pod || '').includes('ขอนตาล')).length;
  const podNKP = patients.filter(p => (p.pod || '').includes('นครพิงค์')).length;
  const podCH = patients.filter(p => (p.pod || '').includes('รพช')).length;

  const reviewPercent = stats.totalActiveConsultRecords > 0 
    ? Math.round((stats.reviewedToday / stats.totalActiveConsultRecords) * 100) 
    : 100;

  return (
    <div className="space-y-6">
      {/* Top Banner Header */}
      <div className="bg-gradient-to-r from-teal-800 via-teal-700 to-emerald-900 rounded-3xl p-6 lg:p-8 text-white shadow-lg relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-2xl">
            <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-white/20 backdrop-blur-md text-teal-100 mb-2.5">
              📊 Executive Palliative Care Analytics & Multidimensional Radar
            </span>
            <h1 className="text-2xl lg:text-3xl font-extrabold tracking-tight">
              ศูนย์รวมข้อมูลและสถิติบัญชาการระบบบริบาลประคับประคอง
            </h1>
            <p className="mt-2 text-teal-100 text-xs leading-relaxed">
              วิเคราะห์ตัวชี้วัดครอบคลุมทุกมิติ: การรับเคส, การทำ Family Meeting, Advance Care Planning, 
              การใช้เตียงศูนย์ขอนตาล, Home Ward PC, การใช้อุปกรณ์ Syringe Bulb และการติดตาม Grief & Bereavement
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              onClick={onOpenNewPatientModal}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold bg-white text-teal-900 hover:bg-teal-50 shadow-md transition-all active:scale-95"
            >
              <PlusCircle className="w-4 h-4 text-teal-600" />
              + บันทึกรับเคสใหม่
            </button>
            <button
              onClick={() => onNavigate('round-palli')}
              className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold bg-white/10 hover:bg-white/20 text-white border border-white/20 transition-all"
            >
              📋 ชีตราวน์ Round Palli
            </button>
          </div>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
        <div 
          onClick={() => onNavigate('round-palli')}
          className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs hover:border-blue-400 cursor-pointer transition-all"
        >
          <div className="flex items-center justify-between">
            <span className="p-2 rounded-xl bg-blue-50 text-blue-600"><Activity className="w-4 h-4" /></span>
            <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full">Active</span>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-extrabold text-slate-900">{stats.activeConsults}</span>
            <p className="text-[11px] font-semibold text-slate-500 mt-0.5">เคส Consult ปัจจุบัน</p>
          </div>
        </div>

        <div 
          onClick={() => onNavigate('ward-palli')}
          className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs hover:border-emerald-400 cursor-pointer transition-all"
        >
          <div className="flex items-center justify-between">
            <span className="p-2 rounded-xl bg-emerald-50 text-emerald-600"><Bed className="w-4 h-4" /></span>
            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">ขอนตาล</span>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-extrabold text-slate-900">{stats.wardKhonTan}</span>
            <p className="text-[11px] font-semibold text-slate-500 mt-0.5">เตียง Ward ขอนตาล</p>
          </div>
        </div>

        <div 
          onClick={() => onNavigate('home-ward')}
          className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs hover:border-teal-400 cursor-pointer transition-all"
        >
          <div className="flex items-center justify-between">
            <span className="p-2 rounded-xl bg-teal-50 text-teal-600"><Home className="w-4 h-4" /></span>
            <span className="text-[10px] font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-full">Home PC</span>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-extrabold text-slate-900">{stats.homeWardPC}</span>
            <p className="text-[11px] font-semibold text-slate-500 mt-0.5">Home Ward PC</p>
          </div>
        </div>

        <div 
          onClick={() => onNavigate('dead')}
          className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs hover:border-purple-400 cursor-pointer transition-all"
        >
          <div className="flex items-center justify-between">
            <span className="p-2 rounded-xl bg-purple-50 text-purple-600"><HeartHandshake className="w-4 h-4" /></span>
            <span className="text-[10px] font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-full">Terminal</span>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-extrabold text-slate-900">{stats.deceasedCount}</span>
            <p className="text-[11px] font-semibold text-slate-500 mt-0.5">เสียชีวิต / ปฏิเสธรักษา</p>
          </div>
        </div>

        <div 
          onClick={() => onNavigate('patients')}
          className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs hover:border-pink-400 cursor-pointer transition-all"
        >
          <div className="flex items-center justify-between">
            <span className="p-2 rounded-xl bg-pink-50 text-pink-600"><Syringe className="w-4 h-4" /></span>
            <span className="text-[10px] font-bold text-pink-700 bg-pink-100 px-2 py-0.5 rounded-full">Bulb</span>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-extrabold text-pink-600">{stats.activeSyringeBulbs}</span>
            <p className="text-[11px] font-semibold text-slate-500 mt-0.5">Syringe Bulb ที่ใช้งาน</p>
          </div>
        </div>

        <div 
          onClick={() => onNavigate('bereavement')}
          className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs hover:border-amber-400 cursor-pointer transition-all"
        >
          <div className="flex items-center justify-between">
            <span className="p-2 rounded-xl bg-amber-50 text-amber-600"><Clock className="w-4 h-4" /></span>
            <span className="text-[10px] font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full">Radar</span>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-extrabold text-amber-600">{stats.pendingBereavementCalls}</span>
            <p className="text-[11px] font-semibold text-slate-500 mt-0.5">นัดโทร Bereavement</p>
          </div>
        </div>
      </div>

      {/* Daily Rounding & Hospital Quality Compliance Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Round Progress Bar */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                ความก้าวหน้าการตรวจราวน์วันนี้ (Round Palli Progress)
              </h3>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                {stats.reviewedToday} / {stats.totalActiveConsultRecords} เคส
              </span>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              สอดคล้องกับข้อความใน Google Sheet: เคสที่ทีมแพทย์ตรวจและ progress แล้วจะขึ้นแถบไฮไลท์สีเขียวอัตโนมัติ
            </p>

            <div className="mt-5 space-y-2">
              <div className="w-full bg-slate-100 h-3.5 rounded-full overflow-hidden p-0.5 border border-slate-200">
                <div 
                  className="bg-emerald-500 h-full rounded-full transition-all duration-700" 
                  style={{ width: `${reviewPercent}%` }}
                />
              </div>
              <div className="flex items-center justify-between text-xs font-bold text-slate-700 pt-1">
                <span className="text-emerald-700">ราวน์และดูแล้ว {reviewPercent}%</span>
                <span className="text-amber-700">รอราวน์ {Math.max(0, stats.totalActiveConsultRecords - stats.reviewedToday)} เคส</span>
              </div>
            </div>
          </div>

          <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
            <span className="text-xs text-slate-500">ชีต Round Palli ประจำวัน</span>
            <button
              onClick={() => onNavigate('round-palli')}
              className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 hover:underline"
            >
              เปิดตารางราวน์ <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Clinical Quality Audit Grid */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-teal-600" />
              การกำกับคุณภาพเวชระเบียนและรหัสโรค (Clinical Coding & Palliative Registry)
            </h3>
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-teal-50 text-teal-800 border border-teal-200">
              มาตรฐานระดับ รพศ.
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs mt-4">
            <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
              <span className="text-slate-500 font-medium block">แบบรายงาน รง 501</span>
              <span className="text-xl font-extrabold text-slate-900 mt-1 block">
                {stats.compliance.form501Done} / {stats.totalPatients}
              </span>
              <span className="text-[10px] text-emerald-700 font-bold">Palliative Registry</span>
            </div>

            <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
              <span className="text-slate-500 font-medium block">แบบรายงาน รง 510</span>
              <span className="text-xl font-extrabold text-slate-900 mt-1 block">
                {stats.compliance.form510Done} เคส
              </span>
              <span className="text-[10px] text-teal-700 font-bold">Home Ward PC</span>
            </div>

            <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
              <span className="text-slate-500 font-medium block">ICD-10 Z51.5</span>
              <span className="text-xl font-extrabold text-teal-800 mt-1 block">
                {stats.compliance.z515Done} / {stats.totalPatients}
              </span>
              <span className="text-[10px] text-emerald-700 font-bold">Palliative Care</span>
            </div>

            <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
              <span className="text-slate-500 font-medium block">ICD-10 Z71.8</span>
              <span className="text-xl font-extrabold text-teal-800 mt-1 block">
                {stats.compliance.z718Done} / {stats.totalPatients}
              </span>
              <span className="text-[10px] text-teal-700 font-bold">Counseling</span>
            </div>
          </div>
        </div>
      </div>

      {/* MULTIDIMENSIONAL CHARTS GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Chart 1: Care Setting Trajectory Distribution */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <PieChart className="w-4 h-4 text-teal-600" />
              การกระจายตัวตาม Care Setting
            </h3>
            <span className="text-xs text-slate-500">{patients.length} เคส</span>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <div className="flex justify-between font-semibold text-slate-700 mb-1">
                <span>Inpatient Consult Active</span>
                <span>{consultCount} เคส ({Math.round((consultCount / total) * 100)}%)</span>
              </div>
              <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                <div className="bg-blue-500 h-full rounded-full" style={{ width: `${(consultCount / total) * 100}%` }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between font-semibold text-slate-700 mb-1">
                <span>Ward Palliative ขอนตาล</span>
                <span>{khonTanCount} เคส ({Math.round((khonTanCount / total) * 100)}%)</span>
              </div>
              <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${(khonTanCount / total) * 100}%` }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between font-semibold text-slate-700 mb-1">
                <span>Home Ward PC (รพ.ที่บ้าน)</span>
                <span>{homeWardCount} เคส ({Math.round((homeWardCount / total) * 100)}%)</span>
              </div>
              <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                <div className="bg-teal-500 h-full rounded-full" style={{ width: `${(homeWardCount / total) * 100}%` }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between font-semibold text-slate-700 mb-1">
                <span>Deceased / ปฏิเสธรักษา</span>
                <span>{deceasedCount} เคส ({Math.round((deceasedCount / total) * 100)}%)</span>
              </div>
              <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                <div className="bg-purple-500 h-full rounded-full" style={{ width: `${(deceasedCount / total) * 100}%` }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between font-semibold text-slate-700 mb-1">
                <span>Discharged Stable / Refer รพช.</span>
                <span>{dischargedCount} เคส ({Math.round((dischargedCount / total) * 100)}%)</span>
              </div>
              <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                <div className="bg-slate-400 h-full rounded-full" style={{ width: `${(dischargedCount / total) * 100}%` }} />
              </div>
            </div>
          </div>
        </div>

        {/* Chart 2: Primary Diagnosis Breakdown */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-indigo-600" />
              การจำแนกกลุ่มโรคระยะท้าย
            </h3>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-200">
              Cancer ({cancerCount}) : Non-Cancer ({nonCancerCount})
            </span>
          </div>

          <div className="space-y-2 text-xs">
            {Object.entries(dxCategories).map(([cat, count]) => {
              const pct = Math.round((count / total) * 100);
              return (
                <div key={cat}>
                  <div className="flex justify-between text-slate-700 mb-0.5 font-medium">
                    <span className="truncate pr-2">{cat}</span>
                    <span className="font-mono text-slate-900 shrink-0">{count} ({pct}%)</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div className="bg-indigo-500 h-full rounded-full" style={{ width: `${Math.max(5, pct)}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Chart 3: Palliative Performance Scale (PPS) Histogram */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <Layers className="w-4 h-4 text-emerald-600" />
              การกระจายระดับสมรรถนะ PPS (%)
            </h3>
            <span className="text-xs text-slate-500">Palliative Scale</span>
          </div>

          <div className="space-y-3.5 text-xs">
            {Object.entries(ppsDistribution).map(([label, count]) => {
              const pct = Math.round((count / total) * 100);
              return (
                <div key={label} className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                  <div className="flex justify-between font-bold text-slate-800 mb-1">
                    <span>{label}</span>
                    <span className="text-teal-700">{count} ราย ({pct}%)</span>
                  </div>
                  <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                    <div className="bg-teal-600 h-full rounded-full" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ACP CONCORDANCE & BEREAVEMENT RADAR CHARTS ROW */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Chart 4: Advance Care Planning (ACP) Multidimensional Concordance */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <Award className="w-4 h-4 text-rose-600" />
              มิติความยินยอมและการวางแผน ACP (Concordance Radar)
            </h3>
            <span className="text-xs text-slate-500">Goals of Care</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-3.5 bg-rose-50/60 rounded-2xl border border-rose-200 space-y-2">
              <span className="font-bold text-rose-950 block">การช่วยฟื้นคืนชีพ (CPR Status)</span>
              <div className="space-y-1">
                <div className="flex justify-between font-medium">
                  <span className="text-rose-800 font-bold">DNR (Do Not Resuscitate)</span>
                  <span className="font-bold text-rose-900">{dnrCount} ({Math.round((dnrCount / total) * 100)}%)</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Full Code / Partial</span>
                  <span>{total - dnrCount} ({Math.round(((total - dnrCount) / total) * 100)}%)</span>
                </div>
              </div>
            </div>

            <div className="p-3.5 bg-indigo-50/60 rounded-2xl border border-indigo-200 space-y-2">
              <span className="font-bold text-indigo-950 block">ท่อช่วยหายใจ (Airway / ETT)</span>
              <div className="space-y-1">
                <div className="flex justify-between font-medium">
                  <span className="text-indigo-800 font-bold">No Intubation / Extubation</span>
                  <span className="font-bold text-indigo-900">{noEttCount} ({Math.round((noEttCount / total) * 100)}%)</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Full Intubation / Keep ETT</span>
                  <span>{total - noEttCount} ({Math.round(((total - noEttCount) / total) * 100)}%)</span>
                </div>
              </div>
            </div>

            {/* Place of Death Preference */}
            <div className="sm:col-span-2 p-3.5 bg-teal-50/60 rounded-2xl border border-teal-200">
              <span className="font-bold text-teal-950 block mb-2">สถานที่ต้องการเสียชีวิต (Preferred Place of Death - POD)</span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center">
                <div className="bg-white p-2 rounded-xl border border-teal-100 shadow-2xs">
                  <span className="text-slate-500 block text-[11px]">บ้าน (Home)</span>
                  <strong className="text-teal-800 text-base">{podHome}</strong>
                  <span className="text-[10px] text-slate-400 block">{Math.round((podHome / total) * 100)}%</span>
                </div>
                <div className="bg-white p-2 rounded-xl border border-teal-100 shadow-2xs">
                  <span className="text-slate-500 block text-[11px]">Ward ขอนตาล</span>
                  <strong className="text-emerald-800 text-base">{podKhonTan}</strong>
                  <span className="text-[10px] text-slate-400 block">{Math.round((podKhonTan / total) * 100)}%</span>
                </div>
                <div className="bg-white p-2 rounded-xl border border-teal-100 shadow-2xs">
                  <span className="text-slate-500 block text-[11px]">รพ.นครพิงค์</span>
                  <strong className="text-blue-800 text-base">{podNKP}</strong>
                  <span className="text-[10px] text-slate-400 block">{Math.round((podNKP / total) * 100)}%</span>
                </div>
                <div className="bg-white p-2 rounded-xl border border-teal-100 shadow-2xs">
                  <span className="text-slate-500 block text-[11px]">รพช. ใกล้บ้าน</span>
                  <strong className="text-purple-800 text-base">{podCH}</strong>
                  <span className="text-[10px] text-slate-400 block">{Math.round((podCH / total) * 100)}%</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Chart 5: Grief & Bereavement Follow-up Radar */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <HeartHandshake className="w-4 h-4 text-purple-600" />
              การติดตามผู้สูญเสีย (Grief & Bereavement Tracking)
            </h3>
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-purple-50 text-purple-800 border border-purple-200">
              @ 1w, 1m, 3m
            </span>
          </div>

          <div className="space-y-4 text-xs">
            <div className="grid grid-cols-3 gap-2.5 text-center">
              <div className="p-3 bg-purple-50 rounded-2xl border border-purple-200">
                <span className="font-bold text-purple-900 block text-[11px]">@ ภายใน 1 สัปดาห์</span>
                <span className="text-lg font-extrabold text-purple-950 mt-1 block">โทรสำเร็จ 80%</span>
                <span className="text-[10px] text-purple-600">แสดงความเสียใจ/เอกสาร</span>
              </div>
              <div className="p-3 bg-indigo-50 rounded-2xl border border-indigo-200">
                <span className="font-bold text-indigo-900 block text-[11px]">@ 1 เดือน</span>
                <span className="text-lg font-extrabold text-indigo-950 mt-1 block">นัดหมาย 100%</span>
                <span className="text-[10px] text-indigo-600">ประเมินการปรับตัว</span>
              </div>
              <div className="p-3 bg-teal-50 rounded-2xl border border-teal-200">
                <span className="font-bold text-teal-900 block text-[11px]">@ 3 เดือน</span>
                <span className="text-lg font-extrabold text-teal-950 mt-1 block">เฝ้าระวัง 100%</span>
                <span className="text-[10px] text-teal-600">Complicated Grief</span>
              </div>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
              <span className="font-bold text-slate-800 block mb-2">การประเมินสภาวะทางอารมณ์และจิตใจ (Grief Severity Breakdown)</span>
              <div className="space-y-2">
                <div>
                  <div className="flex justify-between text-slate-700 mb-0.5 font-medium">
                    <span>Normal Grief Reaction (เศร้าโศกตามปกติ ปรับตัวได้)</span>
                    <span className="font-bold text-emerald-700">75%</span>
                  </div>
                  <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                    <div className="bg-emerald-500 h-full rounded-full" style={{ width: '75%' }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-slate-700 mb-0.5 font-medium">
                    <span>Mild / Moderate Distress (ต้องการการประคับประคองเพิ่มเติม)</span>
                    <span className="font-bold text-amber-700">20%</span>
                  </div>
                  <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                    <div className="bg-amber-500 h-full rounded-full" style={{ width: '20%' }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-slate-700 mb-0.5 font-medium">
                    <span>High Risk / Complicated Grief (ความเสี่ยงสูง ส่งต่อนักจิตวิทยา)</span>
                    <span className="font-bold text-rose-700">5%</span>
                  </div>
                  <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                    <div className="bg-rose-500 h-full rounded-full" style={{ width: '5%' }} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
