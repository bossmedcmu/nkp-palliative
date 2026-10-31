import React, { useState } from 'react';
import { 
  Users, Activity, Plus, RefreshCw, Trash2, ArrowRight,
  Heart, Sparkles, Building2, Stethoscope, CheckCircle2,
  AlertTriangle, BookOpen, Bed, FileSpreadsheet, HeartHandshake
} from 'lucide-react';

interface HomePageProps {
  patientCount: number;
  onNavigate: (tab: string) => void;
  onLoadMockData: () => Promise<void>;
  onResetData: () => Promise<void>;
  onOpenNewPatientModal: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  patientCount,
  onNavigate,
  onLoadMockData,
  onResetData,
  onOpenNewPatientModal,
}) => {
  const [loadingAction, setLoadingAction] = useState<string | null>(null);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const handleLoadMock = async () => {
    try {
      setLoadingAction('load');
      await onLoadMockData();
    } finally {
      setLoadingAction(null);
    }
  };

  const handleConfirmReset = async () => {
    try {
      setLoadingAction('reset');
      await onResetData();
      setShowResetConfirm(false);
    } finally {
      setLoadingAction(null);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Cartoon Doctor Rounding Hero Card */}
      <div className="bg-white rounded-3xl shadow-md border border-slate-200 overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-12 items-center">
          {/* Left Text & Controls */}
          <div className="lg:col-span-6 p-8 lg:p-10 space-y-5">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-50 border border-teal-200 text-teal-800 text-xs font-bold">
              <Building2 className="w-4 h-4 text-teal-600" />
              <span>โรงพยาบาลนครพิงค์ & ศูนย์ขอนตาล</span>
            </div>

            <div>
              <h1 className="text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
                NKP PALLIATIVE CARE
              </h1>
              <p className="text-sm font-semibold text-teal-700 mt-1">
                ระบบบันทึกและเชื่อมโยงเครือข่ายบริการบริบาลประคับประคอง
              </p>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              ยินดีต้อนรับสู่ระบบงาน Palliative Care ที่เชื่อมโยงการดูแลจากเตียงผู้ป่วยใน รพ.นครพิงค์ 
              สู่หอผู้ป่วยขอนตาลและโรงพยาบาลเสมือนที่บ้าน (Home Ward PC) อย่างอบอุ่นและไร้รอยต่อ
            </p>

            {/* Action Buttons Group */}
            <div className="flex flex-col sm:flex-row flex-wrap gap-2.5 pt-2">
              <button
                disabled={loadingAction !== null}
                onClick={handleLoadMock}
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-teal-600 hover:bg-teal-700 text-white shadow-md hover:shadow-lg transition-all active:scale-[0.98]"
              >
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>{loadingAction === 'load' ? 'กำลังโหลดข้อมูล 30 ราย...' : 'โหลดข้อมูลผู้ป่วยจำลอง (30 ราย)'}</span>
              </button>

              <button
                disabled={loadingAction !== null}
                onClick={() => setShowResetConfirm(true)}
                className="inline-flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-rose-50 text-slate-700 hover:text-rose-700 border border-slate-200 hover:border-rose-300 transition-all"
              >
                <Trash2 className="w-4 h-4 text-rose-500" />
                <span>ล้างข้อมูลทั้งหมด (Reset)</span>
              </button>

              <button
                onClick={onOpenNewPatientModal}
                className="inline-flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-semibold bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 transition-all"
              >
                <Plus className="w-4 h-4 text-emerald-600" />
                <span>+ บันทึกรับเคสใหม่</span>
              </button>

              <button
                onClick={() => onNavigate('dashboard')}
                className="inline-flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-800 transition-all"
              >
                <Activity className="w-4 h-4 text-teal-600" />
                <span>เปิดดู Dashboard</span>
              </button>
            </div>
          </div>

          {/* Right Hero Image (Cartoon Doctor Rounding) */}
          <div className="lg:col-span-6 p-4 lg:p-6 bg-gradient-to-br from-teal-50/50 via-emerald-50/30 to-amber-50/40 flex items-center justify-center">
            <div className="relative w-full rounded-2xl overflow-hidden shadow-md border border-teal-100 group">
              <img
                src="/hero-palliative-round.jpg"
                alt="ทีมแพทย์และพยาบาลตรวจราวน์ผู้ป่วย Palliative Care อย่างอบอุ่น"
                className="w-full h-auto max-h-[380px] object-cover object-center transform group-hover:scale-102 transition-transform duration-500"
                onError={(e) => {
                  // Fallback if image path differs
                  (e.target as HTMLImageElement).src = './hero-palliative-round.jpg';
                }}
              />
              <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-slate-900/70 via-slate-900/30 to-transparent p-4 text-white">
                <span className="text-xs font-bold flex items-center gap-1.5 text-teal-200">
                  <Heart className="w-3.5 h-3.5 text-rose-400 fill-rose-400" />
                  การตรวจเยี่ยมและบริบาลด้วยหัวใจความเป็นมนุษย์
                </span>
                <p className="text-[11px] text-slate-200 mt-0.5">
                  เชื่อมโยงสหสาขาวิชาชีพ: แพทย์ พยาบาล เภสัชกร นักสังคมสงเคราะห์ และครอบครัว
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* State Status Callout */}
        <div className="bg-slate-50 border-t border-slate-100 p-5">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-3">
              <span className={`w-3 h-3 rounded-full shrink-0 ${patientCount > 0 ? 'bg-emerald-500 animate-pulse' : 'bg-slate-300'}`} />
              <div>
                <span className="font-bold text-slate-800">
                  {patientCount === 0 
                    ? 'ขณะนี้ระบบเป็นระบบเปล่า (ยังไม่มีข้อมูลผู้ป่วย)' 
                    : `ปัจจุบันมีข้อมูลผู้ป่วยในระบบทั้งหมด ${patientCount} ราย`}
                </span>
                <p className="text-slate-500 text-[11px] mt-0.5">
                  {patientCount === 0
                    ? 'คุณสามารถคลิก "โหลดข้อมูลผู้ป่วยจำลอง (30 ราย)" เพื่อทดลองระบบ หรือกด "+ บันทึกรับเคสใหม่" เพื่อทดสอบบันทึกด้วยตนเอง'
                    : 'คุณสามารถคลิกเข้าสู่เมนูต่างๆ เพื่อดูทะเบียนและแผนการดูแล, ตารางชีตราวน์ Round Palli, Ward ขอนตาล, หรือกดล้างข้อมูลเพื่อเริ่มใหม่'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => onNavigate('about')}
                className="px-3 py-1.5 rounded-lg text-slate-600 hover:text-teal-700 hover:bg-slate-200 font-semibold transition-colors flex items-center gap-1"
              >
                <BookOpen className="w-3.5 h-3.5" />
                เกี่ยวกับระบบจริง
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Modal for Reset */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-200 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div className="text-center">
              <h3 className="text-lg font-bold text-slate-900">ยืนยันการล้างข้อมูลทั้งหมด?</h3>
              <p className="text-xs text-slate-500 mt-1">
                ระบบจะล้างข้อมูลผู้ป่วย บันทึก Consult, ACP, Family Meeting, Ward และ Bereavement ทั้งหมดออกเพื่อเป็นระบบเปล่า
              </p>
            </div>

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => setShowResetConfirm(false)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 text-xs font-semibold hover:bg-slate-100"
              >
                ยกเลิก
              </button>
              <button
                onClick={handleConfirmReset}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-md"
              >
                ยืนยัน ล้างข้อมูลทั้งหมด
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
