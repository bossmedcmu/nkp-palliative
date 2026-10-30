import React, { useState } from 'react';
import { 
  Search, Filter, Plus, User, Syringe, Bed, ArrowRight,
  Stethoscope, HeartHandshake, FileText, CheckCircle2 
} from 'lucide-react';
import { Patient } from '../types';

interface PatientDirectoryProps {
  patients: Patient[];
  loading: boolean;
  onSelectPatient: (patientId: string) => void;
  onOpenNewPatientModal: () => void;
}

export const PatientDirectory: React.FC<PatientDirectoryProps> = ({
  patients,
  loading,
  onSelectPatient,
  onOpenNewPatientModal
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [wardFilter, setWardFilter] = useState('all');

  const filtered = patients.filter((p) => {
    const term = searchTerm.toLowerCase();
    const matchSearch =
      p.full_name.toLowerCase().includes(term) ||
      p.hn.toLowerCase().includes(term) ||
      p.main_diagnosis.toLowerCase().includes(term) ||
      p.current_ward.toLowerCase().includes(term);

    if (!matchSearch) return false;

    if (statusFilter !== 'all' && p.status !== statusFilter) return false;
    if (wardFilter !== 'all' && !p.current_ward.includes(wardFilter)) return false;

    return true;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ACTIVE_CONSULT':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">Consult Active</span>;
      case 'FM_IN_PROGRESS':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800">รอ Family Meeting</span>;
      case 'WARD_PALLIATIVE':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">Ward ขอนตาล</span>;
      case 'HOME_WARD_PC':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-teal-100 text-teal-800">Home Ward PC</span>;
      case 'DISCHARGED':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700">D/C จำหน่ายแล้ว</span>;
      case 'DECEASED':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-100 text-purple-800">Deceased / เสียชีวิต</span>;
      default:
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-gray-100 text-gray-800">{status}</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Search & Filter Header Bar */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <User className="w-5 h-5 text-teal-600" />
              ทะเบียนผู้ป่วย Palliative Care ทั้งหมด (Patient Directory)
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              ศูนย์รวมข้อมูลผู้ป่วยตั้งต้นและทางเข้าสู่ระบบผังบริการแบบ Pedigrow ({patients.length} รายชื่อในระบบ)
            </p>
          </div>

          <button
            onClick={onOpenNewPatientModal}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-teal-600 hover:bg-teal-700 text-white shadow-xs transition-colors"
          >
            <Plus className="w-4 h-4" />
            + เพิ่มผู้ป่วย / รับ Consult ใหม่
          </button>
        </div>

        {/* Filter controls */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-4 pt-4 border-t border-slate-100">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="ค้นหา ชื่อ-สกุล, HN, โรคประจำตัว, วอร์ด..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full py-2 px-3 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:outline-none"
            >
              <option value="all">ทุกสถานะการรักษา (All Status)</option>
              <option value="ACTIVE_CONSULT">Active Consult (รับปรึกษา)</option>
              <option value="FM_IN_PROGRESS">เคส Family Meeting</option>
              <option value="WARD_PALLIATIVE">Ward Palliative ขอนตาล</option>
              <option value="HOME_WARD_PC">Home Ward PC (รพ.ที่บ้าน)</option>
              <option value="DISCHARGED">D/C จำหน่าย / Refer</option>
              <option value="DECEASED">Deceased เสียชีวิต</option>
            </select>
          </div>

          <div>
            <select
              value={wardFilter}
              onChange={(e) => setWardFilter(e.target.value)}
              className="w-full py-2 px-3 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:outline-none"
            >
              <option value="all">ทุกหอผู้ป่วย (All Wards)</option>
              <option value="Med">หอผู้ป่วยอายุรกรรม (Med)</option>
              <option value="Surg">หอผู้ป่วยศัลยกรรม (Surg)</option>
              <option value="ขอนตาล">Ward Palliative ขอนตาล</option>
              <option value="Home Ward">Home Ward PC</option>
            </select>
          </div>
        </div>
      </div>

      {/* Patient Cards List */}
      {loading ? (
        <div className="p-12 text-center text-slate-500 bg-white rounded-2xl border border-slate-200">
          กำลังโหลดรายชื่อผู้ป่วย...
        </div>
      ) : filtered.length === 0 ? (
        <div className="p-12 text-center text-slate-400 bg-white rounded-2xl border border-slate-200">
          ไม่พบรายชื่อผู้ป่วยที่ตรงกับเงื่อนไขการค้นหา
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((p) => (
            <div
              key={p.id}
              onClick={() => onSelectPatient(p.id)}
              className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs hover:border-teal-400 hover:shadow-md cursor-pointer transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="w-9 h-9 rounded-xl bg-teal-50 text-teal-700 font-bold flex items-center justify-center text-sm border border-teal-200">
                      {p.full_name.charAt(p.full_name.indexOf(' ') + 1) || p.full_name.charAt(0)}
                    </span>
                    <div>
                      <h3 className="font-bold text-slate-900 group-hover:text-teal-700 transition-colors text-sm">
                        {p.full_name}
                      </h3>
                      <span className="font-mono text-xs text-slate-500">HN: {p.hn}</span>
                    </div>
                  </div>
                  {getStatusBadge(p.status)}
                </div>

                <div className="mt-3.5 space-y-1.5 text-xs">
                  <p className="text-slate-800 font-medium line-clamp-2" title={p.main_diagnosis}>
                    <strong className="text-slate-500 font-normal">Dx:</strong> {p.main_diagnosis}
                  </p>
                  <p className="text-slate-600">
                    <strong className="text-slate-500 font-normal">วอร์ด:</strong> {p.current_ward} {p.current_bed ? `(เตียง ${p.current_bed})` : ''}
                  </p>
                  <p className="text-slate-600">
                    <strong className="text-slate-500 font-normal">สิทธิ:</strong> {p.insurance}
                  </p>
                </div>

                {/* Sub-status badges */}
                <div className="mt-3 flex flex-wrap gap-1.5 text-[11px]">
                  {p.has_syringe_bulb === 1 && (
                    <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded bg-pink-100 text-pink-700 font-bold">
                      <Syringe className="w-3 h-3" /> Bulb
                    </span>
                  )}
                  {p.cpr_status && (
                    <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-medium">
                      {p.cpr_status.split(' ')[0]}
                    </span>
                  )}
                  {p.pod && (
                    <span className="px-2 py-0.5 rounded bg-teal-50 text-teal-700 font-medium">
                      POD: {p.pod.split(' ')[0]}
                    </span>
                  )}
                  {p.consult_reviewed === 1 && (
                    <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold">
                      ✓ ตรวจแล้ว
                    </span>
                  )}
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-teal-700">
                <span>เปิดผัง Pedigrow & บริการ</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
