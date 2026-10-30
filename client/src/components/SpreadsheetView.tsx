import React, { useState, useEffect } from 'react';
import { 
  FileSpreadsheet, Check, Download, Search, AlertCircle, 
  ExternalLink, Syringe, Sparkles, Filter, ChevronRight 
} from 'lucide-react';
import { fetchSheetData, toggleConsultReview } from '../services/api';

interface SpreadsheetViewProps {
  sheetType: 'round-palli' | 'ward-palli' | 'home-ward' | 'dead' | 'dc-refer';
  onSelectPatient: (patientId: string) => void;
  onRefreshStats: () => void;
}

export const SpreadsheetView: React.FC<SpreadsheetViewProps> = ({
  sheetType,
  onSelectPatient,
  onRefreshStats
}) => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const loadData = async () => {
    try {
      setLoading(true);
      const res = await fetchSheetData(sheetType);
      setData(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [sheetType]);

  const handleToggleReview = async (consultId: string, current: number) => {
    try {
      await toggleConsultReview(consultId, current === 0);
      loadData();
      onRefreshStats();
    } catch (err) {
      console.error(err);
    }
  };

  const filteredData = data.filter(item => {
    const term = searchTerm.toLowerCase();
    return (
      (item.full_name && item.full_name.toLowerCase().includes(term)) ||
      (item.hn && item.hn.toLowerCase().includes(term)) ||
      (item.dx && item.dx.toLowerCase().includes(term)) ||
      (item.ward && item.ward.toLowerCase().includes(term))
    );
  });

  const getSheetTitle = () => {
    switch (sheetType) {
      case 'round-palli':
        return {
          title: 'Sheet: Round Palli (ชีตราวน์ผู้ป่วย Consult ปัจจุบัน)',
          subtitle: 'ตารางราวน์ผู้ป่วย Palliative ประจำวันทุกตึกใน รพ.นครพิงค์',
          notice: '** อย่าลืมเพิ่ม z515  z718 ใน D/C ทุกเคสที่ได้รับการ consult ด้วยค่ะ **',
          highlightHint: '**** เคสใดๆที่ progress แล้ว ขอความร่วมมือ Highlight สีเขียว จะได้เข้าใจร่วมกันว่าดูแล้ว'
        };
      case 'ward-palli':
        return {
          title: 'Sheet: WardPalli (หอผู้ป่วยประคับประคอง ศูนย์ขอนตาล)',
          subtitle: 'รายการผู้ป่วยใน Inpatient Palliative Care Unit ฝั่งขอนตาล',
          notice: 'ศูนย์บริบาลประคับประคองขอนตาล รพ.นครพิงค์ - เตียงขอนตาล 01-12',
          highlightHint: 'ติดตามค่า PPS, ปัญหา/กิจกรรมการดูแล, Syringe bulb และ Bereavement contact'
        };
      case 'home-ward':
        return {
          title: 'Sheet: Home ward PC (โรงพยาบาลเสมือนที่บ้าน)',
          subtitle: 'การบริบาลประคับประคองที่บ้าน (Hospital at Home Palliative Care)',
          notice: 'ตรวจสอบการลงแบบรายงาน รง 510 สำหรับเคส Home Ward ทุกราย',
          highlightHint: 'ติดตามร่วมกับศูนย์ COC นครพิงค์ และ รพ.สต. ในพื้นที่'
        };
      case 'dead':
        return {
          title: 'Sheet: Dead, ปฏิเสธรักษา (ขอนตาล / รพ.นครพิงค์ / Home Ward)',
          subtitle: 'บันทึกเคสเสียชีวิตและเคสปฏิเสธการรักษาเพื่อกลับไปเสียชีวิตที่บ้าน',
          notice: 'ระบุการส่งต่อศูนย์ COC, การคืน Syringe bulb และการติดตาม Grief & Bereavement',
          highlightHint: 'เกณฑ์ติดตาม Bereavement: @ ภายใน 1 สัปดาห์, @ 1 เดือน, @ 3 เดือน'
        };
      case 'dc-refer':
        return {
          title: 'Sheet: DC, Refer (รพ.นครพิงค์ / ขอนตาล / รพช.)',
          subtitle: 'รายการผู้ป่วย D/C อาการทรงตัว (แนวโน้มยังไม่เสียชีวิต) หรือ Refer รพช.',
          notice: 'ไม่รวมเคส Dead หรือปฏิเสธการรักษาเพื่อกลับไปเสียชีวิตที่บ้าน',
          highlightHint: 'ประสาน รพช. ปลายทางในการรับยาแก้ปวด Morphine ต่อเนื่อง'
        };
    }
  };

  const meta = getSheetTitle();

  return (
    <div className="space-y-4">
      {/* Notice Banners from Google Sheet */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <FileSpreadsheet className="w-6 h-6 text-emerald-600" />
              {meta.title}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">{meta.subtitle}</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="ค้นหา ชื่อ, HN, โรค, วอร์ด..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 pr-4 py-1.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500 w-64"
              />
            </div>
            <button
              onClick={loadData}
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
              title="รีเฟรชข้อมูลชีต"
            >
              🔄
            </button>
          </div>
        </div>

        {/* Highlight Note & Clinical Reminder from Google Sheets */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
          <div className="bg-amber-50 border border-amber-200 p-2.5 rounded-xl text-amber-900 flex items-center gap-2 font-medium">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
            <span>{meta.notice}</span>
          </div>
          <div className="bg-emerald-50 border border-emerald-200 p-2.5 rounded-xl text-emerald-900 flex items-center gap-2 font-medium">
            <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{meta.highlightHint}</span>
          </div>
        </div>
      </div>

      {/* Spreadsheet Data Grid */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-12 text-center text-slate-500">
              กำลังโหลดข้อมูลจากฐานข้อมูล Google Sheet Structure...
            </div>
          ) : filteredData.length === 0 ? (
            <div className="p-12 text-center text-slate-400 text-sm">
              ไม่พบข้อมูลผู้ป่วยในหมวดหมู่นี้
            </div>
          ) : (
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-100/90 text-slate-700 font-bold border-b border-slate-200 select-none">
                  <th className="p-3 w-10 text-center">#</th>
                  <th className="p-3 min-w-[160px]">ชื่อ-สกุล</th>
                  <th className="p-3 w-12 text-center">อายุ</th>
                  <th className="p-3 w-20">HN</th>
                  <th className="p-3 w-28">Ward / Bed</th>
                  <th className="p-3 min-w-[200px]">Diagnosis (Dx)</th>
                  
                  {/* ACP Group */}
                  <th className="p-3 min-w-[120px] bg-slate-200/60 text-slate-800">ACP: Med</th>
                  <th className="p-3 min-w-[120px] bg-slate-200/60 text-slate-800">ACP: ETT</th>
                  <th className="p-3 min-w-[110px] bg-slate-200/60 text-slate-800">ACP: CPR</th>
                  
                  {sheetType === 'ward-palli' && (
                    <th className="p-3 w-16 text-center bg-teal-100 text-teal-900">PPS</th>
                  )}

                  {(sheetType === 'round-palli' || sheetType === 'home-ward') && (
                    <th className="p-3 min-w-[110px]">POD (ที่เสียชีวิต)</th>
                  )}

                  <th className="p-3 min-w-[100px]">Family Meeting</th>

                  {sheetType === 'round-palli' && (
                    <>
                      <th className="p-3 w-16 text-center">รง 501</th>
                      <th className="p-3 min-w-[110px]">เกณฑ์ย้าย ward</th>
                      <th className="p-3 min-w-[140px]">ความก้าวหน้า / หมายเหตุ</th>
                      <th className="p-3 w-24 text-center bg-emerald-100 text-emerald-900">สถานะราวน์</th>
                    </>
                  )}

                  {sheetType === 'ward-palli' && (
                    <>
                      <th className="p-3 min-w-[100px]">สิทธิ รพ</th>
                      <th className="p-3 min-w-[140px]">ชื่อ & เบอร์ Bereavement</th>
                      <th className="p-3 min-w-[180px]">ปัญหา / กิจกรรมการดูแล</th>
                      <th className="p-3 w-20 text-center">Syringe Bulb</th>
                    </>
                  )}

                  {sheetType === 'home-ward' && (
                    <>
                      <th className="p-3 w-16 text-center">รง 510</th>
                      <th className="p-3 min-w-[100px]">สิทธิ รพ</th>
                      <th className="p-3 min-w-[140px]">เบอร์ Bereavement</th>
                      <th className="p-3 min-w-[180px]">การดูแลที่บ้าน</th>
                    </>
                  )}

                  {sheetType === 'dead' && (
                    <>
                      <th className="p-3 min-w-[120px]">วันที่ Dead/D/C</th>
                      <th className="p-3 min-w-[140px]">Type of D/C</th>
                      <th className="p-3 min-w-[100px]">วันที่ COC รับ</th>
                      <th className="p-3 w-16 text-center">Syringe Bulb</th>
                      <th className="p-3 min-w-[120px] bg-purple-50 text-purple-900">Bereavement @ 1 wk</th>
                      <th className="p-3 min-w-[120px] bg-purple-50 text-purple-900">Bereavement @ 1 mo</th>
                      <th className="p-3 min-w-[120px] bg-purple-50 text-purple-900">Bereavement @ 3 mo</th>
                    </>
                  )}

                  {sheetType === 'dc-refer' && (
                    <>
                      <th className="p-3 min-w-[100px]">วันที่ D/C</th>
                      <th className="p-3 min-w-[140px]">Type of D/C</th>
                      <th className="p-3 min-w-[140px]">Refer / ปลายทาง</th>
                      <th className="p-3 w-16 text-center">Syringe Bulb</th>
                      <th className="p-3 min-w-[160px]">สรุปการดูแล</th>
                    </>
                  )}

                  <th className="p-3 w-16 text-center">ดูประวัติ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {filteredData.map((row, idx) => {
                  // Exactly replicate Google Sheet row styling: Highlight green when reviewed!
                  const isReviewed = row.is_reviewed_today === 1;
                  const rowClass = isReviewed 
                    ? 'bg-emerald-50/80 hover:bg-emerald-100/70 text-slate-900' 
                    : 'bg-white hover:bg-slate-50/80 text-slate-800';

                  return (
                    <tr key={row.id || idx} className={`${rowClass} transition-colors`}>
                      <td className="p-3 text-center text-slate-400 font-mono text-[11px]">{idx + 1}</td>
                      <td className="p-3 font-semibold text-slate-900">
                        <button
                          onClick={() => onSelectPatient(row.id)}
                          className="text-left hover:text-teal-700 hover:underline flex items-center gap-1 group"
                        >
                          {row.full_name}
                          <ExternalLink className="w-3 h-3 text-slate-400 group-hover:text-teal-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </button>
                      </td>
                      <td className="p-3 text-center">{row.age}</td>
                      <td className="p-3 font-mono font-medium text-slate-600">{row.hn}</td>
                      <td className="p-3">
                        <span className="font-semibold text-teal-800">{row.ward || row.from_ward}</span>
                        {row.bed && <span className="text-slate-500 ml-1">({row.bed})</span>}
                      </td>
                      <td className="p-3 max-w-xs truncate" title={row.dx}>{row.dx}</td>
                      
                      {/* ACP Cells */}
                      <td className="p-3 bg-slate-50/60 max-w-[140px] truncate" title={row.acp_med}>{row.acp_med || '-'}</td>
                      <td className="p-3 bg-slate-50/60 max-w-[130px] truncate" title={row.acp_ett}>{row.acp_ett || '-'}</td>
                      <td className="p-3 bg-slate-50/60 font-semibold text-rose-700">{row.acp_cpr || '-'}</td>

                      {sheetType === 'ward-palli' && (
                        <td className="p-3 text-center font-bold text-teal-700 bg-teal-50/40">{row.pps}%</td>
                      )}

                      {(sheetType === 'round-palli' || sheetType === 'home-ward') && (
                        <td className="p-3 font-medium text-slate-700">{row.pod || '-'}</td>
                      )}

                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                          row.fm === 'Completed' || row.fm_status === 'Completed' ? 'bg-emerald-100 text-emerald-800' :
                          row.fm === 'Planned' || row.fm_status === 'Planned' ? 'bg-amber-100 text-amber-800' :
                          'bg-slate-100 text-slate-500'
                        }`}>
                          {row.fm || row.fm_status || 'รอประชุม'}
                        </span>
                      </td>

                      {sheetType === 'round-palli' && (
                        <>
                          <td className="p-3 text-center font-semibold">
                            {row.form_501_done ? <span className="text-emerald-700">✓</span> : <span className="text-slate-300">-</span>}
                          </td>
                          <td className="p-3 text-slate-600">เข้าเกณฑ์ย้าย</td>
                          <td className="p-3 max-w-xs truncate text-slate-600" title={row.daily_progress_notes || row.remarks}>
                            {row.daily_progress_notes || row.remarks || '-'}
                          </td>
                          <td className="p-3 text-center">
                            <button
                              onClick={() => handleToggleReview(row.consult_id, row.is_reviewed_today)}
                              className={`p-1.5 rounded-lg text-xs font-bold transition-all ${
                                isReviewed 
                                  ? 'bg-emerald-600 text-white shadow-xs' 
                                  : 'bg-slate-200 text-slate-600 hover:bg-emerald-100 hover:text-emerald-800'
                              }`}
                              title={isReviewed ? 'ราวน์แล้ว (คลิกเพื่อยกเลิก)' : 'คลิกเพื่อทำเครื่องหมายว่าราวน์แล้ว (ไฮไลท์สีเขียว)'}
                            >
                              <Check className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </>
                      )}

                      {sheetType === 'ward-palli' && (
                        <>
                          <td className="p-3 text-slate-700">{row.insurance || '-'}</td>
                          <td className="p-3 text-slate-700">
                            <div>{row.bereavement_contact_name || '-'}</div>
                            <div className="font-mono text-teal-700 text-[11px]">{row.bereavement_contact_phone}</div>
                          </td>
                          <td className="p-3 max-w-xs truncate text-slate-600" title={row.care_problems}>
                            {row.care_problems || '-'}
                          </td>
                          <td className="p-3 text-center">
                            {row.has_syringe_bulb ? (
                              <span className="inline-flex items-center text-pink-700 font-bold bg-pink-100 px-2 py-0.5 rounded-full text-[10px]">
                                <Syringe className="w-3 h-3 mr-0.5" /> มี
                              </span>
                            ) : '-'}
                          </td>
                        </>
                      )}

                      {sheetType === 'home-ward' && (
                        <>
                          <td className="p-3 text-center font-semibold">
                            {row.form_510_done ? <span className="text-emerald-700">✓</span> : <span className="text-slate-300">-</span>}
                          </td>
                          <td className="p-3 text-slate-700">{row.insurance || '-'}</td>
                          <td className="p-3 font-mono text-teal-700">{row.bereavement_contact_phone || '-'}</td>
                          <td className="p-3 max-w-xs truncate text-slate-600" title={row.care_problems || row.daily_notes}>
                            {row.care_problems || row.daily_notes || '-'}
                          </td>
                        </>
                      )}

                      {sheetType === 'dead' && (
                        <>
                          <td className="p-3 text-slate-700 font-medium">{row.dead_date}</td>
                          <td className="p-3 font-semibold text-purple-900">{row.discharge_type}</td>
                          <td className="p-3 text-slate-600">{row.coc_referral_date || '-'}</td>
                          <td className="p-3 text-center">
                            {row.has_syringe_bulb ? <span className="text-pink-600 font-bold">✓ มี</span> : '-'}
                          </td>
                          <td className="p-3 bg-purple-50/40 text-[11px] text-slate-700">
                            <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                              row.bf_1w_status === 'COMPLETED' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                            }`}>
                              {row.bf_1w_status || 'PENDING'}
                            </span>
                          </td>
                          <td className="p-3 bg-purple-50/40 text-[11px] text-slate-700">
                            <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                              row.bf_1m_status === 'COMPLETED' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'
                            }`}>
                              {row.bf_1m_status || 'PENDING'}
                            </span>
                          </td>
                          <td className="p-3 bg-purple-50/40 text-[11px] text-slate-700">
                            <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                              row.bf_3m_status === 'COMPLETED' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'
                            }`}>
                              {row.bf_3m_status || 'PENDING'}
                            </span>
                          </td>
                        </>
                      )}

                      {sheetType === 'dc-refer' && (
                        <>
                          <td className="p-3 text-slate-700">{row.discharge_date}</td>
                          <td className="p-3 font-semibold text-slate-800">{row.discharge_type}</td>
                          <td className="p-3 text-teal-800 font-medium">{row.destination_details || '-'}</td>
                          <td className="p-3 text-center">
                            {row.has_syringe_bulb ? <span className="text-pink-600 font-bold">✓</span> : '-'}
                          </td>
                          <td className="p-3 max-w-xs truncate text-slate-600" title={row.summary_notes}>
                            {row.summary_notes || '-'}
                          </td>
                        </>
                      )}

                      <td className="p-3 text-center">
                        <button
                          onClick={() => onSelectPatient(row.id)}
                          className="px-2 py-1 rounded-md text-[11px] font-semibold bg-slate-100 hover:bg-teal-100 text-slate-700 hover:text-teal-900 border border-slate-200 transition-colors"
                        >
                          เปิดดู
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};
