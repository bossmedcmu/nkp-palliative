import React, { useState, useEffect } from 'react';
import { HeartHandshake, Phone, Calendar, CheckCircle2, AlertCircle, Clock, Search, Filter } from 'lucide-react';
import { fetchBereavementRadar } from '../services/api';
import { BereavementFollowup } from '../types';

interface BereavementRadarProps {
  onOpenCallModal: (call: BereavementFollowup) => void;
  onSelectPatient: (patientId: string) => void;
}

export const BereavementRadar: React.FC<BereavementRadarProps> = ({
  onOpenCallModal,
  onSelectPatient
}) => {
  const [calls, setCalls] = useState<BereavementFollowup[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterTag, setFilterTag] = useState<string>('ALL');
  const [filterStatus, setFilterStatus] = useState<string>('PENDING');

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await fetchBereavementRadar();
      setCalls(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const filtered = calls.filter((c) => {
    if (filterTag !== 'ALL' && c.interval_tag !== filterTag) return false;
    if (filterStatus !== 'ALL' && c.call_status !== filterStatus) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <HeartHandshake className="w-6 h-6 text-purple-600" />
              เรดาร์ติดตามการสูญเสียและภาวะเศร้าโศก (Grief & Bereavement Care Radar)
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              ระบบอัตโนมัติจัดตารางและแจ้งเตือนการโทรเยี่ยมญาติ/ผู้ดูแลหลังผู้ป่วยเสียชีวิต: @ ภายใน 1 สัปดาห์, @ 1 เดือน, @ 3 เดือน
            </p>
          </div>

          <div className="flex items-center gap-3">
            <select
              value={filterTag}
              onChange={(e) => setFilterTag(e.target.value)}
              className="text-xs rounded-xl border border-slate-200 px-3 py-2 bg-slate-50 focus:outline-none"
            >
              <option value="ALL">ทุกช่วงเวลา (@ 1w, 1m, 3m)</option>
              <option value="1_WEEK">@ ภายใน 1 สัปดาห์</option>
              <option value="1_MONTH">@ 1 เดือน</option>
              <option value="3_MONTH">@ 3 เดือน</option>
            </select>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="text-xs rounded-xl border border-slate-200 px-3 py-2 bg-slate-50 focus:outline-none"
            >
              <option value="PENDING">รอดำเนินการโทร (Pending)</option>
              <option value="COMPLETED">โทรติดตามเรียบร้อย (Completed)</option>
              <option value="ALL">สถานะทั้งหมด</option>
            </select>
          </div>
        </div>
      </div>

      {/* Calls Grid */}
      {loading ? (
        <div className="p-12 text-center text-slate-500 bg-white rounded-2xl border border-slate-200">
          กำลังโหลดรายการติดตาม Bereavement...
        </div>
      ) : filtered.length === 0 ? (
        <div className="p-12 text-center text-slate-400 bg-white rounded-2xl border border-slate-200">
          ไม่มีรายการตามเงื่อนไขที่เลือก
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {filtered.map((call) => (
            <div 
              key={call.id} 
              className={`bg-white rounded-2xl p-5 border shadow-xs transition-all flex flex-col justify-between ${
                call.call_status === 'COMPLETED' ? 'border-emerald-200 bg-emerald-50/20' : 'border-slate-200 hover:border-purple-300'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                    call.interval_tag === '1_WEEK' ? 'bg-indigo-100 text-indigo-800' :
                    call.interval_tag === '1_MONTH' ? 'bg-purple-100 text-purple-800' :
                    'bg-pink-100 text-pink-800'
                  }`}>
                    {call.interval_tag === '1_WEEK' ? '@ ภายใน 1 สัปดาห์' :
                     call.interval_tag === '1_MONTH' ? '@ 1 เดือน' : '@ 3 เดือน'}
                  </span>

                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    call.call_status === 'COMPLETED' ? 'bg-emerald-100 text-emerald-800' :
                    call.call_status === 'NO_ANSWER' ? 'bg-rose-100 text-rose-800' :
                    'bg-amber-100 text-amber-800'
                  }`}>
                    {call.call_status}
                  </span>
                </div>

                <h3 className="font-bold text-base text-slate-900">{call.patient_name}</h3>
                <p className="text-xs text-slate-500">HN: {call.hn} | วินิจฉัย: {call.main_diagnosis}</p>
                <p className="text-xs text-slate-600 mt-1">
                  ประเภทจำหน่าย: <span className="font-semibold text-purple-900">{call.discharge_type}</span>
                </p>

                <div className="mt-4 pt-3 border-t border-slate-100 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">กำหนดโทร:</span>
                    <strong className="text-slate-800 font-mono">{call.due_date}</strong>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">ผู้รับสาย / ญาติ:</span>
                    <strong className="text-slate-900">{call.contact_person}</strong>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">เบอร์โทรศัพท์:</span>
                    <strong className="text-teal-700 font-mono font-bold">📞 {call.contact_phone}</strong>
                  </div>
                </div>

                {call.call_date && (
                  <div className="mt-3 p-3 bg-white rounded-xl border border-slate-100 text-xs">
                    <span className="font-bold text-slate-700 block mb-0.5">ผลการโทรเมื่อ {call.call_date}:</span>
                    {call.grief_assessment && (
                      <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-teal-100 text-teal-800 mb-1">
                        {call.grief_assessment}
                      </span>
                    )}
                    <p className="text-slate-700 italic">{call.notes}</p>
                  </div>
                )}
              </div>

              <div className="mt-5 pt-3 border-t border-slate-100 flex items-center gap-2">
                <button
                  onClick={() => onOpenCallModal(call)}
                  className="flex-1 py-2 px-3 rounded-xl text-xs font-bold bg-purple-600 hover:bg-purple-700 text-white shadow-xs transition-colors flex items-center justify-center gap-1.5"
                >
                  <Phone className="w-3.5 h-3.5" />
                  {call.call_status === 'COMPLETED' ? 'ดู / แก้ไขบันทึก' : 'บันทึกการโทร'}
                </button>
                <button
                  onClick={() => onSelectPatient(call.patient_id)}
                  className="py-2 px-3 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                >
                  โปรไฟล์
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
