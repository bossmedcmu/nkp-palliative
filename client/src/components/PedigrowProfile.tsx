import React, { useState } from 'react';
import { 
  User, Activity, FileText, Users, Bed, LogOut, HeartHandshake,
  CheckCircle2, AlertCircle, Clock, Calendar, Phone, Shield,
  ChevronRight, ArrowRight, Stethoscope, AlertTriangle, Syringe,
  MapPin, Check, Plus, RefreshCw, FileCheck
} from 'lucide-react';
import { Patient, Consult, AdvanceCarePlan, FamilyMeeting, WardRecord, Discharge, BereavementFollowup } from '../types';

interface PedigrowProfileProps {
  patient: Patient;
  consults: Consult[];
  acp: AdvanceCarePlan | null;
  familyMeetings: FamilyMeeting[];
  wardRecords: WardRecord[];
  discharge: Discharge | null;
  bereavementCalls: BereavementFollowup[];
  onRefresh: () => void;
  onOpenAcpModal: () => void;
  onOpenFmModal: () => void;
  onOpenTransferModal: () => void;
  onOpenDischargeModal: () => void;
  onOpenBereavementModal: (call: BereavementFollowup) => void;
  onToggleReview: (consultId: string, currentStatus: number) => void;
}

export const PedigrowProfile: React.FC<PedigrowProfileProps> = ({
  patient,
  consults,
  acp,
  familyMeetings,
  wardRecords,
  discharge,
  bereavementCalls,
  onRefresh,
  onOpenAcpModal,
  onOpenFmModal,
  onOpenTransferModal,
  onOpenDischargeModal,
  onOpenBereavementModal,
  onToggleReview
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'consult' | 'acp' | 'fm' | 'ward' | 'discharge' | 'bereavement'>('overview');

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ACTIVE_CONSULT':
        return <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 border border-blue-200">Consult Active</span>;
      case 'FM_IN_PROGRESS':
        return <span className="px-3 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-200">เคส Family Meeting</span>;
      case 'WARD_PALLIATIVE':
        return <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">Ward Palliative ขอนตาล</span>;
      case 'HOME_WARD_PC':
        return <span className="px-3 py-1 rounded-full text-xs font-semibold bg-teal-100 text-teal-800 border border-teal-200">Home Ward PC (รพ.ที่บ้าน)</span>;
      case 'DISCHARGED':
        return <span className="px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-800 border border-slate-200">D/C จำหน่ายแล้ว</span>;
      case 'DECEASED':
        return <span className="px-3 py-1 rounded-full text-xs font-semibold bg-purple-100 text-purple-800 border border-purple-200">Deceased / เสียชีวิต</span>;
      default:
        return <span className="px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-800">{status}</span>;
    }
  };

  const latestConsult = consults[0];
  const activeWardRecord = wardRecords.find(w => w.status === 'admitted');

  return (
    <div className="space-y-6">
      {/* Top Patient Header Banner */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-5">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-2xl bg-teal-600 text-white flex items-center justify-center font-bold text-2xl shadow-md shadow-teal-100">
              {patient.full_name.charAt(patient.full_name.indexOf(' ') + 1) || patient.full_name.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="text-2xl font-bold text-slate-900">{patient.full_name}</h1>
                <span className="text-sm font-semibold bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded-md border border-slate-200">
                  HN: {patient.hn}
                </span>
                {patient.an && (
                  <span className="text-sm text-slate-600 bg-slate-50 px-2 py-0.5 rounded border border-slate-200">
                    AN: {patient.an}
                  </span>
                )}
                {getStatusBadge(patient.status)}
                {patient.has_syringe_bulb === 1 && (
                  <span className="inline-flex items-center gap-1 text-xs font-bold bg-pink-100 text-pink-700 px-2.5 py-1 rounded-full border border-pink-200 animate-pulse">
                    <Syringe className="w-3.5 h-3.5" />
                    มี Syringe Bulb
                  </span>
                )}
              </div>
              <p className="text-slate-600 mt-1 font-medium flex items-center gap-3 text-sm">
                <span>อายุ: <strong>{patient.age}</strong> ปี</span>
                <span>เพศ: <strong>{patient.gender}</strong></span>
                <span>วอร์ดปัจจุบัน: <strong className="text-teal-700">{patient.current_ward} {patient.current_bed ? `(เตียง ${patient.current_bed})` : ''}</strong></span>
                <span>สิทธิ: <strong className="text-slate-800">{patient.insurance}</strong></span>
              </p>
            </div>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={onOpenAcpModal}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg bg-indigo-50 text-indigo-700 border border-indigo-200 hover:bg-indigo-100 transition-colors"
            >
              <FileText className="w-3.5 h-3.5" />
              {acp ? 'แก้ไข ACP' : '+ บันทึก ACP'}
            </button>
            <button
              onClick={onOpenFmModal}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100 transition-colors"
            >
              <Users className="w-3.5 h-3.5" />
              + บันทึก Family Meeting
            </button>
            <button
              onClick={onOpenTransferModal}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 transition-colors"
            >
              <Bed className="w-3.5 h-3.5" />
              ย้ายเข้า Ward Palli / Home
            </button>
            {patient.status !== 'DECEASED' && (
              <button
                onClick={onOpenDischargeModal}
                className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100 transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
                จำหน่าย / Refer / เสียชีวิต
              </button>
            )}
            <button
              onClick={onRefresh}
              className="p-2 text-slate-500 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
              title="รีเฟรชข้อมูล"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Diagnosis & Key Indicators */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-5 text-sm">
          <div className="md:col-span-2 bg-slate-50 p-3 rounded-xl border border-slate-100">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Diagnosis (การวินิจฉัย)</span>
            <p className="text-slate-900 font-semibold mt-0.5">{patient.main_diagnosis}</p>
            {patient.secondary_diagnosis && (
              <p className="text-slate-500 text-xs mt-1">โรคร่วม: {patient.secondary_diagnosis}</p>
            )}
          </div>
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">ผู้ดูแลหลัก / Bereavement</span>
            <p className="text-slate-900 font-medium mt-0.5">
              {patient.primary_caregiver || '-'} {patient.caregiver_relation ? `(${patient.caregiver_relation})` : ''}
            </p>
            <p className="text-slate-600 text-xs flex items-center gap-1 mt-1 font-mono">
              <Phone className="w-3 h-3 text-slate-400" />
              {patient.bereavement_contact_phone || patient.caregiver_phone || 'ไม่มีเบอร์โทร'}
            </p>
          </div>
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">มาตรฐาน & Audit รพ.</span>
            <div className="flex flex-wrap gap-1.5 mt-1.5">
              <span className={`px-2 py-0.5 text-xs rounded font-medium ${patient.form_501_done ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-600'}`}>
                รง 501: {patient.form_501_done ? '✓' : '✗'}
              </span>
              <span className={`px-2 py-0.5 text-xs rounded font-medium ${patient.form_510_done ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-600'}`}>
                รง 510: {patient.form_510_done ? '✓' : '✗'}
              </span>
              <span className={`px-2 py-0.5 text-xs rounded font-medium ${patient.icd_z515 ? 'bg-teal-100 text-teal-800' : 'bg-slate-200 text-slate-600'}`}>
                Z51.5: {patient.icd_z515 ? '✓' : '✗'}
              </span>
              <span className={`px-2 py-0.5 text-xs rounded font-medium ${patient.icd_z718 ? 'bg-teal-100 text-teal-800' : 'bg-slate-200 text-slate-600'}`}>
                Z71.8: {patient.icd_z718 ? '✓' : '✗'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* INTERACTIVE LONGITUDINAL SERVICE TREE & PATHWAY */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Activity className="w-5 h-5 text-teal-600" />
              แผนผังการดูแลผู้ป่วยแบบองค์รวม (Holistic Palliative Care Pathway)
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              แสดงความเชื่อมโยงของข้อมูลผู้ป่วยตั้งต้น และแตกกิ่งตาม Service ต่างๆ (Consult, ACP, FM, Ward Palliative, D/C & Bereavement)
            </p>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
            Longitudinal Patient Care Journey
          </span>
        </div>

        {/* Tree Nodes Diagram */}
        <div className="grid grid-cols-1 md:grid-cols-6 gap-3 pt-2">
          {/* Node 1: Baseline Core */}
          <div 
            onClick={() => setActiveTab('overview')}
            className={`cursor-pointer p-4 rounded-xl border-2 transition-all duration-200 relative ${
              activeTab === 'overview' ? 'border-teal-600 bg-teal-50/50 shadow-sm' : 'border-slate-200 hover:border-teal-300 bg-white'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="p-2 rounded-lg bg-teal-100 text-teal-700">
                <User className="w-4 h-4" />
              </span>
              <span className="text-[10px] font-bold text-teal-700 bg-teal-50 px-1.5 py-0.5 rounded border border-teal-200">ROOT</span>
            </div>
            <h3 className="font-bold text-sm text-slate-900">ข้อมูลผู้ป่วยตั้งต้น</h3>
            <p className="text-xs text-slate-500 mt-1 line-clamp-2">HN {patient.hn} | วอร์ด {patient.current_ward}</p>
            <div className="mt-3 flex items-center text-xs font-semibold text-teal-700">
              <span>ดูข้อมูลพื้นฐาน</span>
              <ChevronRight className="w-3.5 h-3.5 ml-1" />
            </div>
          </div>

          {/* Node 2: Consult & Round */}
          <div 
            onClick={() => setActiveTab('consult')}
            className={`cursor-pointer p-4 rounded-xl border-2 transition-all duration-200 relative ${
              activeTab === 'consult' ? 'border-blue-600 bg-blue-50/50 shadow-sm' : 'border-slate-200 hover:border-blue-300 bg-white'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="p-2 rounded-lg bg-blue-100 text-blue-700">
                <Stethoscope className="w-4 h-4" />
              </span>
              {latestConsult?.is_reviewed_today === 1 ? (
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded border border-emerald-300">
                  ราวน์แล้ว ✓
                </span>
              ) : (
                <span className="text-[10px] font-bold text-amber-700 bg-amber-100 px-1.5 py-0.5 rounded border border-amber-300">
                  รอราวน์
                </span>
              )}
            </div>
            <h3 className="font-bold text-sm text-slate-900">เคส Consult & Round</h3>
            <p className="text-xs text-slate-500 mt-1 line-clamp-2">
              {latestConsult ? latestConsult.reason_for_consult : 'ไม่มีประวัติ Consult'}
            </p>
            <div className="mt-3 flex items-center text-xs font-semibold text-blue-700">
              <span>{consults.length} บันทึก</span>
              <ChevronRight className="w-3.5 h-3.5 ml-1" />
            </div>
          </div>

          {/* Node 3: ACP */}
          <div 
            onClick={() => setActiveTab('acp')}
            className={`cursor-pointer p-4 rounded-xl border-2 transition-all duration-200 relative ${
              activeTab === 'acp' ? 'border-indigo-600 bg-indigo-50/50 shadow-sm' : 'border-slate-200 hover:border-indigo-300 bg-white'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="p-2 rounded-lg bg-indigo-100 text-indigo-700">
                <FileText className="w-4 h-4" />
              </span>
              {acp ? (
                <span className="text-[10px] font-bold text-indigo-700 bg-indigo-100 px-1.5 py-0.5 rounded border border-indigo-200">
                  {acp.cpr_status.split(' ')[0]}
                </span>
              ) : (
                <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                  ยังไม่มี
                </span>
              )}
            </div>
            <h3 className="font-bold text-sm text-slate-900">Advance Care Plan</h3>
            <p className="text-xs text-slate-500 mt-1 line-clamp-2">
              {acp ? `POD: ${acp.pod} | ${acp.ett_status}` : 'ยังไม่ได้ระบุ ACP'}
            </p>
            <div className="mt-3 flex items-center text-xs font-semibold text-indigo-700">
              <span>{acp ? 'รายละเอียด ACP' : '+ สร้าง ACP'}</span>
              <ChevronRight className="w-3.5 h-3.5 ml-1" />
            </div>
          </div>

          {/* Node 4: Family Meeting */}
          <div 
            onClick={() => setActiveTab('fm')}
            className={`cursor-pointer p-4 rounded-xl border-2 transition-all duration-200 relative ${
              activeTab === 'fm' ? 'border-amber-600 bg-amber-50/50 shadow-sm' : 'border-slate-200 hover:border-amber-300 bg-white'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="p-2 rounded-lg bg-amber-100 text-amber-700">
                <Users className="w-4 h-4" />
              </span>
              <span className="text-[10px] font-bold text-amber-700 bg-amber-100 px-1.5 py-0.5 rounded border border-amber-200">
                {familyMeetings.length} ครั้ง
              </span>
            </div>
            <h3 className="font-bold text-sm text-slate-900">Family Meeting (FM)</h3>
            <p className="text-xs text-slate-500 mt-1 line-clamp-2">
              {familyMeetings[0]?.goals_of_care || 'ยังไม่มีการประชุมครอบครัว'}
            </p>
            <div className="mt-3 flex items-center text-xs font-semibold text-amber-700">
              <span>ประวัติการประชุม</span>
              <ChevronRight className="w-3.5 h-3.5 ml-1" />
            </div>
          </div>

          {/* Node 5: Ward Palliative / Home Ward */}
          <div 
            onClick={() => setActiveTab('ward')}
            className={`cursor-pointer p-4 rounded-xl border-2 transition-all duration-200 relative ${
              activeTab === 'ward' ? 'border-emerald-600 bg-emerald-50/50 shadow-sm' : 'border-slate-200 hover:border-emerald-300 bg-white'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="p-2 rounded-lg bg-emerald-100 text-emerald-700">
                <Bed className="w-4 h-4" />
              </span>
              {activeWardRecord ? (
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded border border-emerald-300">
                  PPS {activeWardRecord.pps_score}%
                </span>
              ) : (
                <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                  {wardRecords.length > 0 ? 'เคย Admit' : 'วอร์ดทั่วไป'}
                </span>
              )}
            </div>
            <h3 className="font-bold text-sm text-slate-900">Ward Palliative / Home</h3>
            <p className="text-xs text-slate-500 mt-1 line-clamp-2">
              {activeWardRecord ? `${activeWardRecord.ward_type} (เตียง ${activeWardRecord.bed_number})` : 'ศูนย์ขอนตาล / Home Ward'}
            </p>
            <div className="mt-3 flex items-center text-xs font-semibold text-emerald-700">
              <span>{activeWardRecord ? 'แผนการดูแล' : '+ รับย้ายเข้าวอร์ด'}</span>
              <ChevronRight className="w-3.5 h-3.5 ml-1" />
            </div>
          </div>

          {/* Node 6: Discharge & Bereavement */}
          <div 
            onClick={() => setActiveTab('discharge')}
            className={`cursor-pointer p-4 rounded-xl border-2 transition-all duration-200 relative ${
              activeTab === 'discharge' ? 'border-purple-600 bg-purple-50/50 shadow-sm' : 'border-slate-200 hover:border-purple-300 bg-white'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="p-2 rounded-lg bg-purple-100 text-purple-700">
                <HeartHandshake className="w-4 h-4" />
              </span>
              {discharge ? (
                <span className="text-[10px] font-bold text-purple-700 bg-purple-100 px-1.5 py-0.5 rounded border border-purple-200">
                  {patient.status === 'DECEASED' ? 'เสียชีวิต' : 'D/C แล้ว'}
                </span>
              ) : (
                <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                  ยังรักษาอยู่
                </span>
              )}
            </div>
            <h3 className="font-bold text-sm text-slate-900">D/C, Dead & Bereavement</h3>
            <p className="text-xs text-slate-500 mt-1 line-clamp-2">
              {discharge ? discharge.discharge_type : 'ติดตามผลและการดูแลผู้สูญเสีย'}
            </p>
            <div className="mt-3 flex items-center text-xs font-semibold text-purple-700">
              <span>{bereavementCalls.length} การติดตาม</span>
              <ChevronRight className="w-3.5 h-3.5 ml-1" />
            </div>
          </div>
        </div>
      </div>

      {/* DETAIL CONTENT TABS */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        {/* Tab navigation headers */}
        <div className="flex items-center gap-1 border-b border-slate-200 bg-slate-50/60 p-2 overflow-x-auto">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'overview' ? 'bg-white text-teal-700 shadow-sm border border-slate-200' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <User className="w-4 h-4" />
            ข้อมูลผู้ป่วยตั้งต้น
          </button>
          <button
            onClick={() => setActiveTab('consult')}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'consult' ? 'bg-white text-blue-700 shadow-sm border border-slate-200' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Stethoscope className="w-4 h-4" />
            เคส Consult ({consults.length})
          </button>
          <button
            onClick={() => setActiveTab('acp')}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'acp' ? 'bg-white text-indigo-700 shadow-sm border border-slate-200' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <FileText className="w-4 h-4" />
            Advance Care Plan (ACP)
          </button>
          <button
            onClick={() => setActiveTab('fm')}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'fm' ? 'bg-white text-amber-700 shadow-sm border border-slate-200' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Users className="w-4 h-4" />
            Family Meeting ({familyMeetings.length})
          </button>
          <button
            onClick={() => setActiveTab('ward')}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'ward' ? 'bg-white text-emerald-700 shadow-sm border border-slate-200' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Bed className="w-4 h-4" />
            Ward Palliative ขอนตาล & Home ({wardRecords.length})
          </button>
          <button
            onClick={() => setActiveTab('discharge')}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'discharge' ? 'bg-white text-purple-700 shadow-sm border border-slate-200' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <HeartHandshake className="w-4 h-4" />
            D/C, เสียชีวิต & Bereavement ({bereavementCalls.length})
          </button>
        </div>

        {/* Tab 1: Overview & Demographics */}
        {activeTab === 'overview' && (
          <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-slate-50 p-5 rounded-xl border border-slate-200">
                <h3 className="font-bold text-slate-900 text-sm mb-4 flex items-center gap-2">
                  <User className="w-4 h-4 text-teal-600" />
                  ข้อมูลระบุตัวตนและข้อมูลพื้นฐาน (Demographics)
                </h3>
                <dl className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <dt className="text-xs text-slate-500 font-medium">ชื่อ-สกุล</dt>
                    <dd className="font-semibold text-slate-800">{patient.full_name}</dd>
                  </div>
                  <div>
                    <dt className="text-xs text-slate-500 font-medium">Hospital Number (HN)</dt>
                    <dd className="font-mono font-bold text-teal-700">{patient.hn}</dd>
                  </div>
                  <div>
                    <dt className="text-xs text-slate-500 font-medium">อายุ / เพศ</dt>
                    <dd className="text-slate-800">{patient.age} ปี / {patient.gender}</dd>
                  </div>
                  <div>
                    <dt className="text-xs text-slate-500 font-medium">สิทธิการรักษา (สิทธิ รพ.)</dt>
                    <dd className="text-slate-800 font-medium">{patient.insurance}</dd>
                  </div>
                  <div>
                    <dt className="text-xs text-slate-500 font-medium">หอผู้ป่วยปัจจุบัน</dt>
                    <dd className="text-slate-800 font-semibold">{patient.current_ward} {patient.current_bed ? `(เตียง ${patient.current_bed})` : ''}</dd>
                  </div>
                  <div>
                    <dt className="text-xs text-slate-500 font-medium">วันที่เข้ารับการรักษา</dt>
                    <dd className="text-slate-800">{patient.admission_date || '-'}</dd>
                  </div>
                </dl>
              </div>

              <div className="bg-slate-50 p-5 rounded-xl border border-slate-200">
                <h3 className="font-bold text-slate-900 text-sm mb-4 flex items-center gap-2">
                  <Phone className="w-4 h-4 text-teal-600" />
                  ผู้ดูแลและช่องทางติดต่อสำหรับ Bereavement
                </h3>
                <dl className="space-y-3 text-sm">
                  <div>
                    <dt className="text-xs text-slate-500 font-medium">ผู้ดูแลหลัก (Primary Caregiver)</dt>
                    <dd className="font-semibold text-slate-800">
                      {patient.primary_caregiver || 'ไม่ได้ระบุ'} {patient.caregiver_relation ? `(${patient.caregiver_relation})` : ''}
                    </dd>
                    <p className="text-xs text-slate-600 font-mono mt-0.5">เบอร์โทร: {patient.caregiver_phone || '-'}</p>
                  </div>
                  <div className="pt-2 border-t border-slate-200">
                    <dt className="text-xs text-slate-500 font-medium">ชื่อและเบอร์ตาม Grief & Bereavement</dt>
                    <dd className="font-semibold text-teal-900">{patient.bereavement_contact_name || patient.primary_caregiver || '-'}</dd>
                    <p className="text-xs text-teal-700 font-mono font-bold mt-0.5">
                      📞 {patient.bereavement_contact_phone || patient.caregiver_phone || '-'}
                    </p>
                  </div>
                </dl>
              </div>
            </div>

            {/* Quick summary of care flags */}
            <div className="bg-teal-50/50 border border-teal-200 p-5 rounded-xl">
              <h3 className="font-bold text-teal-900 text-sm mb-3 flex items-center gap-2">
                <Shield className="w-4 h-4 text-teal-700" />
                สถานะการติดตามคุณภาพและเอกสารสำคัญ (Hospital Audit)
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div className="bg-white p-3 rounded-lg border border-teal-100 shadow-xs">
                  <span className="text-xs text-slate-500 block">แบบรายงาน รง 501</span>
                  <span className={`inline-flex items-center gap-1 font-bold text-sm mt-1 ${patient.form_501_done ? 'text-emerald-700' : 'text-slate-400'}`}>
                    {patient.form_501_done ? '✓ บันทึกเรียบร้อย' : '✗ ยังไม่บันทึก'}
                  </span>
                </div>
                <div className="bg-white p-3 rounded-lg border border-teal-100 shadow-xs">
                  <span className="text-xs text-slate-500 block">แบบรายงาน รง 510 (Home)</span>
                  <span className={`inline-flex items-center gap-1 font-bold text-sm mt-1 ${patient.form_510_done ? 'text-emerald-700' : 'text-slate-400'}`}>
                    {patient.form_510_done ? '✓ บันทึกเรียบร้อย' : '✗ ยังไม่บันทึก'}
                  </span>
                </div>
                <div className="bg-white p-3 rounded-lg border border-teal-100 shadow-xs">
                  <span className="text-xs text-slate-500 block">ICD-10 Z51.5 (Palliative Care)</span>
                  <span className={`inline-flex items-center gap-1 font-bold text-sm mt-1 ${patient.icd_z515 ? 'text-emerald-700' : 'text-rose-600'}`}>
                    {patient.icd_z515 ? '✓ ให้รหัสแล้ว' : '⚠️ ต้องลงรหัสใน D/C'}
                  </span>
                </div>
                <div className="bg-white p-3 rounded-lg border border-teal-100 shadow-xs">
                  <span className="text-xs text-slate-500 block">ICD-10 Z71.8 (Counseling)</span>
                  <span className={`inline-flex items-center gap-1 font-bold text-sm mt-1 ${patient.icd_z718 ? 'text-emerald-700' : 'text-rose-600'}`}>
                    {patient.icd_z718 ? '✓ ให้รหัสแล้ว' : '⚠️ ต้องลงรหัสใน D/C'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Consults & Round Notes */}
        {activeTab === 'consult' && (
          <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-slate-900 text-base">รายการ Consult และประวัติการราวน์</h3>
                <p className="text-xs text-slate-500">บันทึกการปรึกษาจากตึกต่างๆ และความก้าวหน้าการตรวจเยี่ยม</p>
              </div>
            </div>

            {consults.length === 0 ? (
              <div className="text-center py-12 text-slate-500 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                ยังไม่มีรายการ Consult
              </div>
            ) : (
              <div className="space-y-4">
                {consults.map((c) => (
                  <div 
                    key={c.id} 
                    className={`p-5 rounded-xl border transition-all ${
                      c.is_reviewed_today === 1 
                        ? 'bg-emerald-50/60 border-emerald-300' 
                        : 'bg-white border-slate-200 shadow-xs'
                    }`}
                  >
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-100 pb-3">
                      <div className="flex items-center gap-3">
                        <span className={`px-2.5 py-1 rounded-md text-xs font-bold ${
                          c.triage_level === 'Urgent' ? 'bg-rose-100 text-rose-800 border border-rose-300' :
                          c.triage_level === 'High' ? 'bg-amber-100 text-amber-800 border border-amber-300' :
                          'bg-blue-100 text-blue-800 border border-blue-200'
                        }`}>
                          {c.triage_level}
                        </span>
                        <span className="text-sm font-semibold text-slate-900">
                          ส่งปรึกษาจาก: {c.from_ward}
                        </span>
                        <span className="text-xs text-slate-500 font-mono">
                          {c.consult_date}
                        </span>
                      </div>

                      {/* Review Toggle (Google sheet highlight green requirement!) */}
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => onToggleReview(c.id, c.is_reviewed_today)}
                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                            c.is_reviewed_today === 1
                              ? 'bg-emerald-600 text-white shadow-xs'
                              : 'bg-slate-100 text-slate-700 hover:bg-emerald-100 hover:text-emerald-800'
                          }`}
                        >
                          <Check className="w-3.5 h-3.5" />
                          {c.is_reviewed_today === 1 ? 'ราวน์แล้ววันนี้ (เขียว)' : 'ทำเครื่องหมายว่าราวน์แล้ว'}
                        </button>
                      </div>
                    </div>

                    <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">เหตุผลการส่งปรึกษา</span>
                        <p className="text-slate-900 font-medium mt-1">{c.reason_for_consult}</p>
                        {c.referring_physician && (
                          <p className="text-xs text-slate-500 mt-1">แพทย์ผู้ส่ง: {c.referring_physician}</p>
                        )}
                      </div>
                      <div>
                        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">ทีม Palliative ผู้รับผิดชอบ</span>
                        <p className="text-slate-800 text-xs mt-1">
                          แพทย์: <strong className="text-slate-900">{c.palliative_doctor || 'ทีมส่วนกลาง'}</strong> | พยาบาล: <strong className="text-slate-900">{c.palliative_nurse || 'ทีมส่วนกลาง'}</strong>
                        </p>
                        {c.remarks && (
                          <p className="text-xs text-amber-700 bg-amber-50 p-2 rounded mt-2 border border-amber-200">
                            <strong>หมายเหตุ:</strong> {c.remarks}
                          </p>
                        )}
                      </div>
                    </div>

                    {c.daily_progress_notes && (
                      <div className="mt-4 pt-3 border-t border-slate-100 bg-white/70 p-3 rounded-lg border border-slate-100">
                        <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5 mb-1">
                          <Activity className="w-3.5 h-3.5 text-teal-600" />
                          บันทึกความก้าวหน้าประจำวัน (Daily Progress Note)
                        </span>
                        <p className="text-slate-800 text-sm whitespace-pre-line">{c.daily_progress_notes}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Advance Care Plan (ACP) */}
        {activeTab === 'acp' && (
          <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-slate-900 text-base">Advance Care Plan (ACP) & Code Status</h3>
                <p className="text-xs text-slate-500">การวางแผนการดูแลล่วงหน้า เจตนารมณ์ในการรักษา และสถานที่เสียชีวิตที่ต้องการ</p>
              </div>
              <button
                onClick={onOpenAcpModal}
                className="px-3.5 py-2 text-xs font-semibold rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 shadow-xs"
              >
                {acp ? 'แก้ไข Advance Care Plan' : '+ สร้าง Advance Care Plan'}
              </button>
            </div>

            {!acp ? (
              <div className="text-center py-12 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                <FileText className="w-12 h-12 text-slate-400 mx-auto mb-2" />
                <p className="text-slate-600 font-medium">ยังไม่มีข้อมูล Advance Care Plan ของผู้ป่วยรายนี้</p>
                <button
                  onClick={onOpenAcpModal}
                  className="mt-3 px-4 py-2 text-xs font-semibold rounded-lg bg-indigo-600 text-white hover:bg-indigo-700"
                >
                  + บันทึก Advance Care Plan ตอนนี้
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Code Status / การช่วยฟื้นคืนชีพ (CPR)</span>
                    <p className="text-lg font-bold text-rose-700 mt-1 flex items-center gap-2">
                      <AlertTriangle className="w-5 h-5 text-rose-600" />
                      {acp.cpr_status}
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">การใส่ท่อช่วยหายใจ (ETT / reETT)</span>
                    <p className="text-base font-bold text-slate-800 mt-1">
                      {acp.ett_status}
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">ยาสุขสบาย / บรรเทาอาการ (Med / Comfort Care)</span>
                    <p className="text-sm font-semibold text-indigo-900 mt-1">{acp.med_comfort}</p>
                    {acp.med_details && (
                      <p className="text-xs text-slate-600 mt-1 bg-white p-2 rounded border border-slate-200">{acp.med_details}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">สถานที่ต้องการเสียชีวิต (Preferred Place of Death - POD)</span>
                    <p className="text-lg font-bold text-teal-800 mt-1 flex items-center gap-2">
                      <MapPin className="w-5 h-5 text-teal-600" />
                      {acp.pod}
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">หนังสือแสดงเจตนา (Living Will ตาม ม.12)</span>
                    <p className="text-sm font-semibold text-slate-800 mt-1">{acp.living_will_status}</p>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">ผู้มีอำนาจตัดสินใจแทน (Surrogate Decision Maker)</span>
                    <p className="text-sm font-semibold text-slate-800 mt-1">{acp.surrogate_decision_maker || patient.primary_caregiver || '-'}</p>
                  </div>
                </div>

                {acp.notes && (
                  <div className="md:col-span-2 p-4 rounded-xl bg-indigo-50/50 border border-indigo-100">
                    <span className="text-xs font-semibold text-indigo-900 uppercase tracking-wider block">บันทึกเพิ่มเติมเกี่ยวกับ ACP</span>
                    <p className="text-sm text-slate-800 mt-1 whitespace-pre-line">{acp.notes}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Tab 4: Family Meetings */}
        {activeTab === 'fm' && (
          <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-slate-900 text-base">บันทึกการประชุมครอบครัว (Family Meeting)</h3>
                <p className="text-xs text-slate-500">การสื่อสารเป้าหมายการดูแล ข้อสรุปและมติของครอบครัว</p>
              </div>
              <button
                onClick={onOpenFmModal}
                className="px-3.5 py-2 text-xs font-semibold rounded-lg bg-amber-600 text-white hover:bg-amber-700 shadow-xs"
              >
                + บันทึก Family Meeting ครั้งใหม่
              </button>
            </div>

            {familyMeetings.length === 0 ? (
              <div className="text-center py-12 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                <Users className="w-12 h-12 text-slate-400 mx-auto mb-2" />
                <p className="text-slate-600 font-medium">ยังไม่มีประวัติ Family Meeting</p>
                <button
                  onClick={onOpenFmModal}
                  className="mt-3 px-4 py-2 text-xs font-semibold rounded-lg bg-amber-600 text-white hover:bg-amber-700"
                >
                  + นัดหมาย / บันทึก Family Meeting
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {familyMeetings.map((fm) => (
                  <div key={fm.id} className="p-5 rounded-xl border border-slate-200 bg-white shadow-xs">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-100 pb-3">
                      <div className="flex items-center gap-3">
                        <span className={`px-2.5 py-1 rounded-md text-xs font-bold ${
                          fm.fm_status === 'Completed' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                        }`}>
                          {fm.fm_status}
                        </span>
                        <span className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                          <Calendar className="w-4 h-4 text-slate-400" />
                          {fm.meeting_date}
                        </span>
                        <span className="text-xs text-slate-500">
                          สถานที่: {fm.location || 'ห้องประชุม Palliative'}
                        </span>
                      </div>
                      <span className="text-xs text-slate-500">
                        ผู้บันทึก: {fm.recorded_by || 'ทีม Palliative'}
                      </span>
                    </div>

                    <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">ผู้เข้าร่วมประชุม</span>
                        <p className="text-xs text-slate-700 mt-1">
                          <strong>ทีมแพทย์/พยาบาล:</strong> {fm.team_attendees || '-'}
                        </p>
                        <p className="text-xs text-slate-700 mt-1">
                          <strong>ครอบครัว/ญาติ:</strong> {fm.family_attendees || '-'}
                        </p>
                      </div>

                      <div>
                        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">ความเข้าใจโรค (Illness Understanding)</span>
                        <p className="text-xs text-slate-800 mt-1">{fm.illness_understanding || '-'}</p>
                      </div>

                      <div>
                        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">เป้าหมายการดูแล (Goals of Care)</span>
                        <p className="text-xs text-slate-800 mt-1">{fm.goals_of_care || '-'}</p>
                      </div>

                      <div>
                        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">มิติจิตวิญญาณและความต้องการเฉพาะ</span>
                        <p className="text-xs text-slate-800 mt-1">{fm.spiritual_cultural_wishes || '-'}</p>
                      </div>

                      <div className="md:col-span-2 bg-amber-50/60 p-3 rounded-lg border border-amber-200">
                        <span className="text-xs font-bold text-amber-900 uppercase tracking-wider block">ข้อสรุปและมติครอบครัว (Consensus)</span>
                        <p className="text-sm font-semibold text-slate-900 mt-1">{fm.consensus || '-'}</p>
                      </div>

                      {fm.action_plan && (
                        <div className="md:col-span-2 bg-slate-50 p-3 rounded-lg border border-slate-200">
                          <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">แผนการปฏิบัติงานต่อไป (Action Plan)</span>
                          <p className="text-xs text-slate-800 mt-1 whitespace-pre-line">{fm.action_plan}</p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 5: Ward Palliative (Khon Tan / Home Ward PC) */}
        {activeTab === 'ward' && (
          <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-slate-900 text-base">Module Ward Palliative (ศูนย์ขอนตาล & Home Ward PC)</h3>
                <p className="text-xs text-slate-500">การบริหารจัดการเตียง ระดับ PPS เกณฑ์ย้ายวอร์ด และกิจกรรมการพยาบาล</p>
              </div>
              <button
                onClick={onOpenTransferModal}
                className="px-3.5 py-2 text-xs font-semibold rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 shadow-xs"
              >
                + ย้ายเข้า / ปรับปรุงข้อมูล Ward Palli
              </button>
            </div>

            {wardRecords.length === 0 ? (
              <div className="text-center py-12 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                <Bed className="w-12 h-12 text-slate-400 mx-auto mb-2" />
                <p className="text-slate-600 font-medium">ยังไม่เคยมีประวัติเข้ารับการรักษาใน Ward Palliative หรือ Home Ward</p>
                <button
                  onClick={onOpenTransferModal}
                  className="mt-3 px-4 py-2 text-xs font-semibold rounded-lg bg-emerald-600 text-white hover:bg-emerald-700"
                >
                  + รับย้ายเข้า Ward Palliative ขอนตาล หรือ Home Ward PC
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                {wardRecords.map((w) => (
                  <div key={w.id} className="p-5 rounded-xl border border-slate-200 bg-white shadow-xs">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-100 pb-3">
                      <div className="flex items-center gap-3">
                        <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                          {w.ward_type === 'Khon Tan' ? 'Ward Palliative ขอนตาล' : 'Home Ward PC'}
                        </span>
                        <span className="text-sm font-bold text-slate-900">
                          เตียง: {w.bed_number || '-'}
                        </span>
                        <span className="text-xs text-slate-500">
                          ย้ายมาจาก: {w.admitted_from_ward || 'Med'} (เมื่อ {w.admission_date})
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="px-3 py-1 rounded-full text-xs font-bold bg-teal-50 text-teal-700 border border-teal-200">
                          PPS: {w.pps_score}%
                        </span>
                        <span className={`px-2.5 py-1 rounded-md text-xs font-semibold ${
                          w.status === 'admitted' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'
                        }`}>
                          {w.status === 'admitted' ? 'Active Inpatient' : w.status}
                        </span>
                      </div>
                    </div>

                    <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                        <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1">
                          ปัญหาสำคัญ (Care Problems)
                        </span>
                        <p className="text-slate-800 whitespace-pre-line text-xs">{w.care_problems || 'ไม่มีระบุ'}</p>
                      </div>

                      <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                        <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1">
                          กิจกรรมการดูแล & การพยาบาล (Nursing Interventions)
                        </span>
                        <p className="text-slate-800 whitespace-pre-line text-xs">{w.nursing_interventions || 'ไม่มีระบุ'}</p>
                      </div>

                      <div className="md:col-span-2 bg-emerald-50/40 p-4 rounded-xl border border-emerald-200">
                        <span className="text-xs font-bold text-emerald-900 uppercase tracking-wider block mb-1">
                          เกณฑ์การย้าย Ward Palliative
                        </span>
                        <p className="text-xs text-emerald-800">
                          {w.transfer_criteria_met ? '✓ เข้าเกณฑ์ย้าย Ward Palliative' : '✗ ไม่เข้าเกณฑ์'} : {w.transfer_criteria_notes || 'ครบถ้วนตามเกณฑ์'}
                        </p>
                      </div>

                      {w.daily_notes && (
                        <div className="md:col-span-2 p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs">
                          <span className="font-bold text-slate-700 block mb-0.5">บันทึกความก้าวหน้าการดูแลล่าสุด:</span>
                          <p className="text-slate-800 whitespace-pre-line">{w.daily_notes}</p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 6: Discharge, Deceased & Bereavement Radar */}
        {activeTab === 'discharge' && (
          <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-slate-900 text-base">การจำหน่าย / เสียชีวิต & ติดตาม Grief & Bereavement</h3>
                <p className="text-xs text-slate-500">บันทึกการส่งต่อ COC เครื่อง Syringe bulb และการโทรติดตามผู้สูญเสีย @ 1 สัปดาห์, 1 เดือน, 3 เดือน</p>
              </div>
              {patient.status !== 'DECEASED' && (
                <button
                  onClick={onOpenDischargeModal}
                  className="px-3.5 py-2 text-xs font-semibold rounded-lg bg-rose-600 text-white hover:bg-rose-700 shadow-xs"
                >
                  + บันทึกจำหน่าย / เสียชีวิต
                </button>
              )}
            </div>

            {/* Discharge Summary Banner */}
            {discharge ? (
              <div className="p-5 rounded-xl bg-purple-50/70 border border-purple-200">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-purple-200 pb-3">
                  <div>
                    <span className="text-xs font-bold text-purple-700 uppercase tracking-wider block">ประเภทการจำหน่าย</span>
                    <h4 className="text-lg font-bold text-purple-950 mt-0.5">{discharge.discharge_type}</h4>
                    <p className="text-xs text-purple-800 mt-1">
                      วันที่จำหน่าย: <strong>{discharge.discharge_date}</strong> | จากวอร์ด: <strong>{discharge.from_ward}</strong>
                    </p>
                  </div>
                  {discharge.has_syringe_bulb === 1 && (
                    <div className="p-3 bg-pink-100 rounded-xl border border-pink-300 text-xs text-pink-900 font-semibold flex items-center gap-2">
                      <Syringe className="w-5 h-5 text-pink-600" />
                      <span>มี Syringe Bulb กลับบ้าน</span>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 text-xs">
                  <div>
                    <span className="font-semibold text-slate-500 block">ปลายทาง / สถานที่เสียชีวิต</span>
                    <p className="text-slate-900 font-medium mt-0.5">{discharge.destination_details || discharge.death_location || '-'}</p>
                  </div>
                  <div>
                    <span className="font-semibold text-slate-500 block">ศูนย์ COC รับเคสเมื่อวันที่</span>
                    <p className="text-slate-900 font-medium mt-0.5">{discharge.coc_referral_date || 'ไม่มีส่งต่อ COC'}</p>
                    {discharge.coc_coordinator && <p className="text-slate-500">ผู้ประสานงาน: {discharge.coc_coordinator}</p>}
                  </div>
                  <div>
                    <span className="font-semibold text-slate-500 block">สาเหตุการเสียชีวิต (ถ้ามี)</span>
                    <p className="text-slate-900 font-medium mt-0.5">{discharge.cause_of_death || '-'}</p>
                  </div>
                </div>

                {discharge.summary_notes && (
                  <div className="mt-3 p-3 bg-white rounded-lg border border-purple-100 text-xs">
                    <span className="font-bold text-slate-700 block mb-0.5">สรุปการจำหน่าย:</span>
                    <p className="text-slate-800">{discharge.summary_notes}</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 flex items-center justify-between">
                <span>ผู้ป่วยยังอยู่ระหว่างการรักษา ไม่มีการจำหน่าย</span>
                <button
                  onClick={onOpenDischargeModal}
                  className="px-3 py-1.5 rounded-lg bg-slate-200 text-slate-700 hover:bg-slate-300 font-semibold"
                >
                  จำหน่าย / Refer เคส
                </button>
              </div>
            )}

            {/* Bereavement Follow-up Radar Cards */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                  <HeartHandshake className="w-4 h-4 text-teal-600" />
                  การติดตามภาวะเศร้าโศกและการสูญเสีย (Grief & Bereavement Follow-up Schedule)
                </h4>
                <span className="text-xs text-slate-500">ตามโครงสร้าง Google Sheet: @ 1 wk, @ 1 month, @ 3 month</span>
              </div>

              {bereavementCalls.length === 0 ? (
                <div className="text-center py-8 bg-slate-50 rounded-xl border border-dashed border-slate-200 text-xs text-slate-500">
                  ระบบจะสร้างตารางการติดตาม Bereavement อัตโนมัติเมื่อมีการจำหน่ายแบบเสียชีวิต หรือ ปฏิเสธการรักษากลับไปเสียชีวิตที่บ้าน
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {bereavementCalls.map((call) => (
                    <div 
                      key={call.id} 
                      className={`p-4 rounded-xl border transition-all ${
                        call.call_status === 'COMPLETED' ? 'bg-emerald-50/50 border-emerald-300' : 'bg-white border-slate-200 shadow-xs'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-bold text-xs uppercase px-2 py-0.5 rounded bg-slate-100 text-slate-800">
                          {call.interval_tag === '1_WEEK' ? '@ ภายใน 1 สัปดาห์' :
                           call.interval_tag === '1_MONTH' ? '@ 1 เดือน' : '@ 3 เดือน'}
                        </span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                          call.call_status === 'COMPLETED' ? 'bg-emerald-100 text-emerald-800' :
                          call.call_status === 'NO_ANSWER' ? 'bg-rose-100 text-rose-800' :
                          'bg-amber-100 text-amber-800'
                        }`}>
                          {call.call_status}
                        </span>
                      </div>

                      <p className="text-xs text-slate-500">
                        กำหนดโทร: <strong className="text-slate-800">{call.due_date}</strong>
                      </p>
                      <p className="text-xs text-slate-700 mt-1">
                        ผู้รับสาย: <strong>{call.contact_person}</strong>
                      </p>
                      <p className="text-xs font-mono text-teal-700">
                        📞 {call.contact_phone}
                      </p>

                      {call.call_date && (
                        <div className="mt-2 pt-2 border-t border-slate-100 text-xs">
                          <p className="text-slate-500">โทรเมื่อ: {call.call_date} โดย {call.caller_name || 'พยาบาล'}</p>
                          {call.grief_assessment && (
                            <span className="inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-bold bg-teal-100 text-teal-800">
                              {call.grief_assessment}
                            </span>
                          )}
                          <p className="text-slate-800 mt-1 italic text-[11px]">{call.notes}</p>
                        </div>
                      )}

                      <button
                        onClick={() => onOpenBereavementModal(call)}
                        className="w-full mt-3 py-1.5 px-3 text-xs font-semibold rounded-lg bg-teal-50 text-teal-700 hover:bg-teal-100 border border-teal-200 transition-colors"
                      >
                        {call.call_status === 'COMPLETED' ? 'ดู / แก้ไขบันทึกการโทร' : '📞 บันทึกผลการโทรติดตาม'}
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
