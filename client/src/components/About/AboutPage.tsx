import React from 'react';
import { 
  Building2, Heart, Award, ShieldCheck, Stethoscope, Users, 
  MapPin, Phone, FileText, CheckCircle2, Bed, Home, Sparkles,
  BookOpen, Layers, Activity, Syringe, HeartHandshake
} from 'lucide-react';

export const AboutPage: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-teal-900 via-teal-800 to-emerald-950 rounded-3xl p-8 lg:p-10 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-white/20 backdrop-blur-md text-teal-100 border border-white/20">
            <Building2 className="w-4 h-4 text-teal-300" />
            <span>กลุ่มงานเวชกรรมสังคม โรงพยาบาลนครพิงค์</span>
          </div>

          <h1 className="text-3xl lg:text-4xl font-black tracking-tight">
            เกี่ยวกับเครือข่ายบริการบริบาลประคับประคอง
          </h1>
          <p className="text-sm font-semibold text-teal-200">
            NKP Palliative Care Network • ศูนย์บริบาลประคับประคองขอนตาล & Home Ward PC
          </p>

          <p className="text-xs text-teal-100/90 leading-relaxed pt-2">
            "มุ่งมั่นพัฒนาการบริบาลประคับประคองแบบองค์รวม ทั้งทางกาย จิต สังคม และจิตวิญญาณ 
            เพื่อให้ผู้ป่วยระยะท้ายได้รับการดูแลอย่างสมศักดิ์ศรีความเป็นมนุษย์ สุขสงบ และครอบครัวได้รับการประคับประคองอย่างต่อเนื่อง"
          </p>
        </div>
      </div>

      {/* 4 Core Pillars of NKP Palliative Network */}
      <div className="space-y-4">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-xl font-bold text-slate-900 flex items-center justify-center gap-2">
            <Layers className="w-5 h-5 text-teal-600" />
            4 เสาหลักของเครือข่ายการดูแล (The 4 Care Settings)
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            เชื่อมโยงการดูแลจากเตียงโรงพยาบาลศูนย์ สู่หอผู้ป่วยเฉพาะทาง และชุมชนอย่างไร้รอยต่อ
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Pillar 1 */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-700 flex items-center justify-center mb-4 border border-blue-200">
                <Stethoscope className="w-6 h-6" />
              </div>
              <span className="text-[11px] font-bold text-blue-700 uppercase tracking-wider block">Care Setting 1</span>
              <h3 className="text-base font-bold text-slate-900 mt-1">บริการให้คำปรึกษาในหอผู้ป่วย (Inpatient Consult Service)</h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                ทีมสหสาขาวิชาชีพรับ Consult จากหอผู้ป่วยสามัญทั่วทั้ง รพ.นครพิงค์ (ตึกอายุรกรรม Med 1-3, ศัลยกรรม Surg 1-2, 
                ไอซียู, สูติ-นรี) เพื่อร่วมประเมินและควบคุมอาการรบกวน (Pain & Dyspnea Control), จัดทำ Family Meeting และวางแผน Advance Care Plan (ACP)
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-500 flex items-center gap-1.5 font-medium">
              <CheckCircle2 className="w-4 h-4 text-blue-600" />
              <span>ตรวจราวน์ประจำวัน พร้อมระบบชีตราวน์ Round Palli ไฮไลท์เขียว</span>
            </div>
          </div>

          {/* Pillar 2 */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center mb-4 border border-emerald-200">
                <Bed className="w-6 h-6" />
              </div>
              <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider block">Care Setting 2</span>
              <h3 className="text-base font-bold text-slate-900 mt-1">ศูนย์บริบาลประคับประคองขอนตาล (Khon Tan Palliative Ward)</h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                หอผู้ป่วยเฉพาะทาง Palliative Care Unit ขนาด 12 เตียง ตั้งอยู่ที่ศูนย์ขอนตาล อ.แม่ริม บรรยากาศเงียบสงบ ร่มรื่น 
                เอื้อต่อความสุขสบายและการดูแลของครอบครัว มีการให้ยาสุขสบายทาง Continuous Subcutaneous Infusion (Syringe Bulb) อย่างใกล้ชิด
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-500 flex items-center gap-1.5 font-medium">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>ประเมินคะแนน PPS %, การพยาบาลประคับประคอง และสนับสนุนพิธีกรรมทางจิตวิญญาณ</span>
            </div>
          </div>

          {/* Pillar 3 */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-700 flex items-center justify-center mb-4 border border-teal-200">
                <Home className="w-6 h-6" />
              </div>
              <span className="text-[11px] font-bold text-teal-700 uppercase tracking-wider block">Care Setting 3</span>
              <h3 className="text-base font-bold text-slate-900 mt-1">โรงพยาบาลเสมือนที่บ้าน (Home Ward PC / Hospital at Home)</h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                การบริบาลผู้ป่วยระยะท้ายที่บ้านตามเจตนารมณ์ของผู้ป่วยและครอบครัว โดยได้รับการบันทึกเป็นผู้ป่วยในเสมือน (Home Ward PC) 
                มีการติดตามร่วมกับศูนย์การดูแลต่อเนื่อง (COC นครพิงค์), รพ.สต. และทีมเยี่ยมบ้านในพื้นที่ พร้อมอุปกรณ์ Syringe Bulb กลับบ้าน
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-500 flex items-center gap-1.5 font-medium">
              <CheckCircle2 className="w-4 h-4 text-teal-600" />
              <span>ติดตามตามแบบรายงาน รง 510 และระบบ Tele-consultation สายด่วน 24 ชั่วโมง</span>
            </div>
          </div>

          {/* Pillar 4 */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-700 flex items-center justify-center mb-4 border border-purple-200">
                <HeartHandshake className="w-6 h-6" />
              </div>
              <span className="text-[11px] font-bold text-purple-700 uppercase tracking-wider block">Care Setting 4</span>
              <h3 className="text-base font-bold text-slate-900 mt-1">เครือข่ายชุมชนและการดูแลผู้สูญเสีย (Grief & Bereavement Care)</h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                การส่งต่อข้อมูลแบบไร้รอยต่อไปยัง รพช. เครือข่ายใน จ.เชียงใหม่ (แม่ริม, แม่แตง, สันทราย, สารภี ฯลฯ) 
                และการติดตามผู้ดูแลหลังผู้ป่วยเสียชีวิตอย่างเป็นระบบ ครอบคลุม 3 ระยะ: @ ภายใน 1 สัปดาห์, @ 1 เดือน, และ @ 3 เดือน
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-500 flex items-center gap-1.5 font-medium">
              <CheckCircle2 className="w-4 h-4 text-purple-600" />
              <span>คัดกรองและเฝ้าระวังภาวะเศร้าโศกซับซ้อน (Complicated Grief Assessment)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Clinical Standards, Audit & Google Sheet Integration */}
      <div className="bg-white rounded-3xl p-6 lg:p-8 border border-slate-200 shadow-xs space-y-6">
        <div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-teal-600" />
            การกำกับคุณภาพเวชระเบียนและการเบิกจ่าย (Audit & Coding Compliance)
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            ถอดแบบตามบันทึกข้อความและข้อกำหนดใน Google Sheets ดั้งเดิมของทีม Palliative รพ.นครพิงค์
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-2">
            <div className="font-bold text-amber-900 flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-amber-600" />
              แบบรายงาน รง 501 / 510
            </div>
            <p className="text-slate-700 leading-relaxed">
              <strong>รง 501:</strong> แบบรายงานการให้บริการ Palliative Care ตามมาตรฐานกรมการแพทย์ และ สปสช. สำหรับเคสในโรงพยาบาล<br />
              <strong>รง 510:</strong> แบบรายงานการบริบาลประคับประคองผู้ป่วยที่บ้าน (Home Ward PC)
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-teal-50/70 border border-teal-200 space-y-2">
            <div className="font-bold text-teal-900 flex items-center gap-1.5">
              <Award className="w-4 h-4 text-teal-600" />
              ICD-10 Z51.5 & Z71.8
            </div>
            <p className="text-slate-700 leading-relaxed">
              ** แจ้งเตือนสำคัญ: ให้เพิ่มรหัส <strong>Z51.5 (Palliative care)</strong> และ <strong>Z71.8 (Counseling)</strong> ในบันทึกการจำหน่าย (D/C) ของทุกเคสที่ได้รับการปรึกษา Palliative Care เพื่อความสมบูรณ์ของการเบิกจ่าย DRGs
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-pink-50/70 border border-pink-200 space-y-2">
            <div className="font-bold text-pink-900 flex items-center gap-1.5">
              <Syringe className="w-4 h-4 text-pink-600" />
              Syringe Bulb & Continuous Infusion
            </div>
            <p className="text-slate-700 leading-relaxed">
              เครื่องให้ยาอัตโนมัติชนิด Subcutaneous Continuous Infusion (Syringe Bulb / Driver) 
              สำหรับให้ยา Morphine, Haloperidol, Midazolam, Hyoscine ควบคุมความปวดและอาการเหนื่อยที่บ้านอย่างต่อเนื่อง
            </p>
          </div>
        </div>
      </div>

      {/* Holistic Care Journey UX Philosophy */}
      <div className="bg-slate-50 rounded-3xl p-6 lg:p-8 border border-slate-200 space-y-4">
        <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-teal-600" />
          ปรัชญาการออกแบบแผนผังการดูแลผู้ป่วยแบบองค์รวม (Holistic Patient Journey)
        </h2>
        <p className="text-xs text-slate-600 leading-relaxed">
          ระบบในแอปพลิเคชันนี้ มุ่งเน้นการมองผู้ป่วยเป็นศูนย์กลาง (Patient-Centric Longitudinal Journey) 
          โดยข้อมูลผู้ป่วยตั้งต้น (Core Profile) จะทำหน้าที่เป็นโหนดราก (Root Node) และแตกกิ่งไปตามบริการเฉพาะทาง 
          ทำให้ทีมสุขภาพทุกตึก ทุกกะ สามารถมองเห็นภาพรวมการดูแลผู้ป่วยรายนั้น ตั้งแต่ประวัติการส่ง Consult, ข้อตกลง ACP, 
          มติที่ประชุมครอบครัว Family Meeting, การรักษาใน Ward ขอนตาล หรือ Home Ward, จนถึงการดูแลผู้สูญเสียหลังเสียชีวิต ได้ในหน้าจอเดียว
        </p>
      </div>

      {/* Directory & Contact */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs">
        <h3 className="font-bold text-slate-900 text-sm mb-3 flex items-center gap-2">
          <Phone className="w-4 h-4 text-teal-600" />
          ช่องทางการติดต่อและทีมงานบริบาลประคับประคอง
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-600">
          <div>
            <p><strong>สถานที่ทำการ:</strong> คลินิกบริบาลประคับประคอง ชั้น 2 อาคารผู้ป่วยนอก รพ.นครพิงค์</p>
            <p className="mt-1"><strong>หอผู้ป่วย:</strong> ศูนย์บริบาลประคับประคองขอนตาล ต.ดอนแก้ว อ.แม่ริม จ.เชียงใหม่</p>
            <p className="mt-1"><strong>เบอร์โทรศัพท์ภายใน:</strong> ต่อ 2314, 2315 (Palliative Team)</p>
          </div>
          <div>
            <p><strong>ศูนย์การดูแลต่อเนื่อง (COC):</strong> อาคารอุบัติเหตุ-ฉุกเฉิน ชั้น 2 รพ.นครพิงค์</p>
            <p className="mt-1"><strong>ระบบรายงาน:</strong> สำนักงานหลักประกันสุขภาพแห่งชาติ (สปสช.) เขต 1 เชียงใหม่</p>
            <p className="mt-1"><strong>เวลาทำการ:</strong> ให้บริการตรวจราวน์และปรึกษาทุกวัน 24 ชั่วโมง</p>
          </div>
        </div>
      </div>
    </div>
  );
};
