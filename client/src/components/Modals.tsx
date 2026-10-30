import React, { useState } from 'react';
import { X, Save, Syringe, HeartHandshake, AlertTriangle, Check, UserPlus } from 'lucide-react';
import { Patient, AdvanceCarePlan, BereavementFollowup } from '../types';

// ==========================================================================
// 1. NEW PATIENT & INITIAL CONSULT MODAL
// ==========================================================================
interface NewPatientModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => Promise<void>;
}

export const NewPatientModal: React.FC<NewPatientModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    hn: '',
    an: '',
    full_name: '',
    age: '',
    gender: 'ชาย',
    insurance: 'UC (บัตรทอง รพ.นครพิงค์)',
    main_diagnosis: '',
    current_ward: 'Med 1',
    current_bed: '',
    primary_caregiver: '',
    caregiver_relation: '',
    caregiver_phone: '',
    bereavement_contact_name: '',
    bereavement_contact_phone: '',
    has_syringe_bulb: false,
    reason_for_consult: 'Pain & Symptom control, Goals of care & ACP discussion',
    triage_level: 'Routine',
    palliative_doctor: 'พญ.อรุณี (Palliative Care)',
    palliative_nurse: 'พว.สุดารัตน์',
    cpr_status: 'DNR (Do Not Resuscitate)',
    ett_status: 'No Intubation (No ETT)',
    pod: 'บ้าน (Home)',
  });
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      await onSubmit(formData);
      onClose();
    } catch (err) {
      alert('เกิดข้อผิดพลาดในการบันทึกข้อมูล');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-xl w-full max-w-2xl overflow-hidden my-8 max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-slate-50">
          <div className="flex items-center gap-2">
            <UserPlus className="w-5 h-5 text-teal-600" />
            <h2 className="text-lg font-bold text-slate-900">บันทึกรับเคส Consult ผู้ป่วย Palliative ใหม่</h2>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-200">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5 text-xs flex-1">
          {/* Patient Core Baseline */}
          <div className="space-y-3">
            <h3 className="font-bold text-slate-800 text-sm border-b pb-1 text-teal-800">1. ข้อมูลผู้ป่วยตั้งต้น (Core Profile)</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">HN *</label>
                <input
                  required
                  type="text"
                  placeholder="เช่น 6062575"
                  value={formData.hn}
                  onChange={(e) => setFormData({ ...formData, hn: e.target.value })}
                  className="w-full p-2 border rounded-xl"
                />
              </div>
              <div className="md:col-span-2">
                <label className="font-semibold text-slate-700 block mb-1">ชื่อ-สกุล *</label>
                <input
                  required
                  type="text"
                  placeholder="เช่น นายสมบูรณ์ ปิ่นแก้ว"
                  value={formData.full_name}
                  onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                  className="w-full p-2 border rounded-xl"
                />
              </div>
              <div>
                <label className="font-semibold text-slate-700 block mb-1">อายุ (ปี) *</label>
                <input
                  required
                  type="number"
                  placeholder="65"
                  value={formData.age}
                  onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                  className="w-full p-2 border rounded-xl"
                />
              </div>
              <div>
                <label className="font-semibold text-slate-700 block mb-1">เพศ</label>
                <select
                  value={formData.gender}
                  onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                  className="w-full p-2 border rounded-xl bg-white"
                >
                  <option value="ชาย">ชาย</option>
                  <option value="หญิง">หญิง</option>
                </select>
              </div>
              <div>
                <label className="font-semibold text-slate-700 block mb-1">สิทธิการรักษา</label>
                <input
                  type="text"
                  value={formData.insurance}
                  onChange={(e) => setFormData({ ...formData, insurance: e.target.value })}
                  className="w-full p-2 border rounded-xl"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="md:col-span-2">
                <label className="font-semibold text-slate-700 block mb-1">การวินิจฉัยโรคหลัก (Diagnosis - Dx) *</label>
                <input
                  required
                  type="text"
                  placeholder="เช่น Cholangiocarcinoma stage IV with liver metastases"
                  value={formData.main_diagnosis}
                  onChange={(e) => setFormData({ ...formData, main_diagnosis: e.target.value })}
                  className="w-full p-2 border rounded-xl"
                />
              </div>
              <div>
                <label className="font-semibold text-slate-700 block mb-1">หอผู้ป่วยปัจจุบัน *</label>
                <input
                  required
                  type="text"
                  placeholder="Med 1, Bed 04"
                  value={formData.current_ward}
                  onChange={(e) => setFormData({ ...formData, current_ward: e.target.value })}
                  className="w-full p-2 border rounded-xl"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 bg-slate-50 p-3 rounded-xl border">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">ชื่อผู้ดูแลหลัก</label>
                <input
                  type="text"
                  placeholder="นางสมศรี (ภรรยา)"
                  value={formData.primary_caregiver}
                  onChange={(e) => setFormData({ ...formData, primary_caregiver: e.target.value })}
                  className="w-full p-2 border rounded-xl bg-white"
                />
              </div>
              <div>
                <label className="font-semibold text-slate-700 block mb-1">เบอร์โทรตาม Grief & Bereavement *</label>
                <input
                  required
                  type="text"
                  placeholder="081-xxxxxxx"
                  value={formData.bereavement_contact_phone}
                  onChange={(e) => setFormData({ ...formData, bereavement_contact_phone: e.target.value, caregiver_phone: e.target.value })}
                  className="w-full p-2 border rounded-xl bg-white"
                />
              </div>
            </div>
          </div>

          {/* Consult Info */}
          <div className="space-y-3 pt-2">
            <h3 className="font-bold text-slate-800 text-sm border-b pb-1 text-blue-800">2. ข้อมูลการส่งปรึกษา (Consult Intake)</h3>
            <div>
              <label className="font-semibold text-slate-700 block mb-1">เหตุผลการปรึกษา (Reason for Consult) *</label>
              <textarea
                required
                rows={2}
                value={formData.reason_for_consult}
                onChange={(e) => setFormData({ ...formData, reason_for_consult: e.target.value })}
                className="w-full p-2 border rounded-xl"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">ระดับความเร่งด่วน</label>
                <select
                  value={formData.triage_level}
                  onChange={(e) => setFormData({ ...formData, triage_level: e.target.value })}
                  className="w-full p-2 border rounded-xl bg-white"
                >
                  <option value="Routine">Routine (ทั่วไป)</option>
                  <option value="High">High (เร่งด่วน)</option>
                  <option value="Urgent">Urgent (วิกฤต/ฉุกเฉิน)</option>
                </select>
              </div>
              <div>
                <label className="font-semibold text-slate-700 block mb-1">แพทย์ Palliative</label>
                <input
                  type="text"
                  value={formData.palliative_doctor}
                  onChange={(e) => setFormData({ ...formData, palliative_doctor: e.target.value })}
                  className="w-full p-2 border rounded-xl"
                />
              </div>
              <div>
                <label className="font-semibold text-slate-700 block mb-1">พยาบาล Palliative</label>
                <input
                  type="text"
                  value={formData.palliative_nurse}
                  onChange={(e) => setFormData({ ...formData, palliative_nurse: e.target.value })}
                  className="w-full p-2 border rounded-xl"
                />
              </div>
            </div>
          </div>

          {/* Initial ACP */}
          <div className="space-y-3 pt-2">
            <h3 className="font-bold text-slate-800 text-sm border-b pb-1 text-indigo-800">3. ข้อตกลง ACP เบื้องต้น</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">CPR Status</label>
                <select
                  value={formData.cpr_status}
                  onChange={(e) => setFormData({ ...formData, cpr_status: e.target.value })}
                  className="w-full p-2 border rounded-xl bg-white"
                >
                  <option value="DNR (Do Not Resuscitate)">DNR (Do Not Resuscitate)</option>
                  <option value="Full Code">Full Code</option>
                  <option value="Partial Code">Partial Code</option>
                </select>
              </div>
              <div>
                <label className="font-semibold text-slate-700 block mb-1">ท่อช่วยหายใจ (ETT)</label>
                <select
                  value={formData.ett_status}
                  onChange={(e) => setFormData({ ...formData, ett_status: e.target.value })}
                  className="w-full p-2 border rounded-xl bg-white"
                >
                  <option value="No Intubation (No ETT)">ไม่ใส่ท่อช่วยหายใจ (No ETT)</option>
                  <option value="Keep existing ETT, No re-ETT">คา ETT เดิม ไม่ใส่ซ้ำ</option>
                  <option value="Palliative Extubation">ถอดท่อแบบประคับประคอง</option>
                </select>
              </div>
              <div>
                <label className="font-semibold text-slate-700 block mb-1">POD (ที่ต้องการเสียชีวิต)</label>
                <select
                  value={formData.pod}
                  onChange={(e) => setFormData({ ...formData, pod: e.target.value })}
                  className="w-full p-2 border rounded-xl bg-white"
                >
                  <option value="บ้าน (Home)">บ้าน (Home)</option>
                  <option value="Ward Palliative ขอนตาล">Ward Palliative ขอนตาล</option>
                  <option value="รพ.นครพิงค์">รพ.นครพิงค์</option>
                  <option value="รพช. ใกล้บ้าน">รพช. ใกล้บ้าน</option>
                </select>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border text-slate-600 hover:bg-slate-100 font-semibold"
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold shadow-xs transition-colors"
            >
              {submitting ? 'กำลังบันทึก...' : 'บันทึกข้อมูลเข้าสู่ระบบ'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ==========================================================================
// 2. ADVANCE CARE PLAN (ACP) MODAL
// ==========================================================================
interface AcpModalProps {
  isOpen: boolean;
  onClose: () => void;
  patientId: string;
  initialAcp: AdvanceCarePlan | null;
  onSubmit: (data: any) => Promise<void>;
}

export const AcpModal: React.FC<AcpModalProps> = ({
  isOpen,
  onClose,
  initialAcp,
  onSubmit
}) => {
  const [formData, setFormData] = useState({
    cpr_status: initialAcp?.cpr_status || 'DNR (Do Not Resuscitate)',
    ett_status: initialAcp?.ett_status || 'No Intubation (No ETT)',
    med_comfort: initialAcp?.med_comfort || 'Morphine comfort protocol for pain & dyspnea',
    med_details: initialAcp?.med_details || '',
    pod: initialAcp?.pod || 'บ้าน (Home)',
    living_will_status: initialAcp?.living_will_status || 'มีหนังสือแสดงเจตนา (Living Will)',
    surrogate_decision_maker: initialAcp?.surrogate_decision_maker || '',
    nutrition_preference: initialAcp?.nutrition_preference || 'Oral feeding as tolerated, No NG tube',
    notes: initialAcp?.notes || '',
  });
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      await onSubmit(formData);
      onClose();
    } catch (err) {
      alert('บันทึก ACP ไม่สำเร็จ');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-xl w-full max-w-xl overflow-hidden my-8 max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-indigo-50">
          <h2 className="text-lg font-bold text-indigo-900">บันทึก Advance Care Plan (ACP) & Code Status</h2>
          <button onClick={onClose} className="p-2 rounded-xl text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 text-xs flex-1">
          <div>
            <label className="font-semibold text-slate-700 block mb-1">Code Status / CPR *</label>
            <select
              value={formData.cpr_status}
              onChange={(e) => setFormData({ ...formData, cpr_status: e.target.value })}
              className="w-full p-2.5 border rounded-xl bg-white font-bold text-rose-700"
            >
              <option value="DNR (Do Not Resuscitate)">DNR (Do Not Resuscitate - ปฏิเสธการกู้ชีพ)</option>
              <option value="Full Code">Full Code (กู้ชีพเต็มรูปแบบ)</option>
              <option value="Partial / Chemical Code Only">Partial / Chemical Code Only</option>
            </select>
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">ท่อช่วยหายใจ (ETT / reETT) *</label>
            <select
              value={formData.ett_status}
              onChange={(e) => setFormData({ ...formData, ett_status: e.target.value })}
              className="w-full p-2.5 border rounded-xl bg-white"
            >
              <option value="No Intubation (No ETT)">No Intubation (ปฏิเสธการใส่ท่อช่วยหายใจ)</option>
              <option value="Keep existing ETT, No re-ETT">Keep existing ETT, No re-ETT (คา ETT เดิม ไม่ใส่ซ้ำ)</option>
              <option value="Palliative Extubation / Weaning">Palliative Extubation / Weaning (ถอดท่อแบบประคับประคอง)</option>
              <option value="Full Intubation">Full Intubation</option>
            </select>
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">ยาสุขสบาย / อาการรบกวน (Med Comfort) *</label>
            <input
              type="text"
              value={formData.med_comfort}
              onChange={(e) => setFormData({ ...formData, med_comfort: e.target.value })}
              className="w-full p-2.5 border rounded-xl"
            />
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">สถานที่ต้องการเสียชีวิต (POD - Place of Death) *</label>
            <select
              value={formData.pod}
              onChange={(e) => setFormData({ ...formData, pod: e.target.value })}
              className="w-full p-2.5 border rounded-xl bg-white font-bold text-teal-800"
            >
              <option value="บ้าน (Home)">บ้าน (Home)</option>
              <option value="Ward Palliative ขอนตาล">Ward Palliative ขอนตาล</option>
              <option value="รพ.นครพิงค์">รพ.นครพิงค์</option>
              <option value="รพช. ใกล้บ้าน">รพช. ใกล้บ้าน</option>
            </select>
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">หนังสือแสดงเจตนา (Living Will ม.12)</label>
            <select
              value={formData.living_will_status}
              onChange={(e) => setFormData({ ...formData, living_will_status: e.target.value })}
              className="w-full p-2.5 border rounded-xl bg-white"
            >
              <option value="มีหนังสือแสดงเจตนา (Living Will มีผลสมบูรณ์)">มีหนังสือแสดงเจตนา (Living Will มีผลสมบูรณ์)</option>
              <option value="ไม่มีหนังสือแสดงเจตนา">ไม่มีหนังสือแสดงเจตนา</option>
              <option value="อยู่ระหว่างปรึกษาจัดทำ">อยู่ระหว่างปรึกษาจัดทำ</option>
            </select>
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">บันทึกเพิ่มเติม / เจตนารมณ์ผู้ป่วย</label>
            <textarea
              rows={3}
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="w-full p-2.5 border rounded-xl"
              placeholder="ระบุข้อตกลงและเจตนารมณ์เฉพาะ..."
            />
          </div>

          <div className="pt-4 border-t flex items-center justify-end gap-3">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-xl border text-slate-600 font-semibold">
              ยกเลิก
            </button>
            <button type="submit" disabled={submitting} className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold">
              {submitting ? 'กำลังบันทึก...' : 'บันทึก Advance Care Plan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ==========================================================================
// 3. FAMILY MEETING (FM) MODAL
// ==========================================================================
interface FmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => Promise<void>;
}

export const FamilyMeetingModal: React.FC<FmModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    meeting_date: new Date().toISOString().replace('T', ' ').substring(0, 16),
    location: 'ห้องให้คำปรึกษา Palliative',
    team_attendees: 'พญ.อรุณี, พว.สุดารัตน์, นักสังคมสงเคราะห์',
    family_attendees: '',
    illness_understanding: '',
    goals_of_care: '',
    spiritual_cultural_wishes: '',
    consensus: '',
    action_plan: '',
    fm_status: 'Completed',
    recorded_by: 'ทีม Palliative',
  });
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      await onSubmit(formData);
      onClose();
    } catch (err) {
      alert('บันทึก Family Meeting ไม่สำเร็จ');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-xl w-full max-w-xl overflow-hidden my-8 max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-amber-50">
          <h2 className="text-lg font-bold text-amber-900">บันทึกการประชุมครอบครัว (Family Meeting)</h2>
          <button onClick={onClose} className="p-2 rounded-xl text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 text-xs flex-1">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">วันและเวลาที่ประชุม *</label>
              <input
                type="text"
                required
                value={formData.meeting_date}
                onChange={(e) => setFormData({ ...formData, meeting_date: e.target.value })}
                className="w-full p-2 border rounded-xl"
              />
            </div>
            <div>
              <label className="font-semibold text-slate-700 block mb-1">สถานที่ประชุม</label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full p-2 border rounded-xl"
              />
            </div>
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">ญาติ/ครอบครัวที่เข้าร่วม (พร้อมระบุความสัมพันธ์) *</label>
            <input
              type="text"
              required
              placeholder="เช่น ผู้ป่วย, ภรรยา, บุตรสาว 2 คน"
              value={formData.family_attendees}
              onChange={(e) => setFormData({ ...formData, family_attendees: e.target.value })}
              className="w-full p-2 border rounded-xl"
            />
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">ความเข้าใจโรคของผู้ป่วยและครอบครัว</label>
            <textarea
              rows={2}
              placeholder="รับทราบโรคและเข้าใจว่าไม่ตอบสนองต่อการรักษาเชิงรุกแล้ว..."
              value={formData.illness_understanding}
              onChange={(e) => setFormData({ ...formData, illness_understanding: e.target.value })}
              className="w-full p-2 border rounded-xl"
            />
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">เป้าหมายการดูแล (Goals of Care) *</label>
            <textarea
              rows={2}
              required
              placeholder="เน้นความสุขสบาย ควบคุมความปวดและอาการเหนื่อย..."
              value={formData.goals_of_care}
              onChange={(e) => setFormData({ ...formData, goals_of_care: e.target.value })}
              className="w-full p-2 border rounded-xl"
            />
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">ข้อสรุปและมติที่ประชุมครอบครัว (Consensus) *</label>
            <textarea
              rows={2}
              required
              placeholder="มติครอบครัวเห็นพ้องต้องกัน: DNR, No ETT, รับการดูแลแบบประคับประคอง..."
              value={formData.consensus}
              onChange={(e) => setFormData({ ...formData, consensus: e.target.value })}
              className="w-full p-2 border rounded-xl font-medium"
            />
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">แผนการดำเนินงานต่อไป (Action Plan)</label>
            <textarea
              rows={2}
              placeholder="1. ปรับยา Morphine 2. ย้าย Ward ขอนตาล 3. ประสาน COC..."
              value={formData.action_plan}
              onChange={(e) => setFormData({ ...formData, action_plan: e.target.value })}
              className="w-full p-2 border rounded-xl"
            />
          </div>

          <div className="pt-4 border-t flex items-center justify-end gap-3">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-xl border text-slate-600 font-semibold">
              ยกเลิก
            </button>
            <button type="submit" disabled={submitting} className="px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold">
              {submitting ? 'กำลังบันทึก...' : 'บันทึก Family Meeting'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ==========================================================================
// 4. WARD PALLIATIVE TRANSFER MODAL
// ==========================================================================
interface WardTransferModalProps {
  isOpen: boolean;
  onClose: () => void;
  patient: Patient;
  onSubmit: (data: any) => Promise<void>;
}

export const WardTransferModal: React.FC<WardTransferModalProps> = ({
  isOpen,
  onClose,
  patient,
  onSubmit
}) => {
  const [formData, setFormData] = useState({
    ward_type: 'Khon Tan',
    bed_number: 'ขอนตาล 01',
    admitted_from_ward: patient.current_ward,
    pps_score: 30,
    care_problems: '1. อาการปวดและเหนื่อยหอบ 2. อ่อนเพลีย ช่วยเหลือตนเองได้น้อย',
    nursing_interventions: '1. On Subcutaneous infusion 2. พลิกตัวป้องกันแผลกดทับ q 2 hr 3. Mouth care',
    transfer_criteria_met: true,
    transfer_criteria_notes: 'ผู้ป่วยระยะท้าย มีข้อตกลง Goals of care ชัดเจน ญาติพร้อมร่วมดูแล',
    daily_notes: 'รับย้ายเข้าวอร์ด สัญญาณชีพคงที่',
    has_syringe_bulb: false,
  });
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      await onSubmit(formData);
      onClose();
    } catch (err) {
      alert('ย้ายเข้าวอร์ดไม่สำเร็จ');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-xl w-full max-w-xl overflow-hidden my-8 max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-emerald-50">
          <div>
            <h2 className="text-lg font-bold text-emerald-900">รับย้ายเข้า Ward Palliative / Home Ward PC</h2>
            <p className="text-xs text-emerald-700">{patient.full_name} (HN: {patient.hn})</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 text-xs flex-1">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">ประเภท Ward *</label>
              <select
                value={formData.ward_type}
                onChange={(e) => setFormData({ 
                  ...formData, 
                  ward_type: e.target.value,
                  bed_number: e.target.value === 'Khon Tan' ? 'ขอนตาล 01' : 'Home-01'
                })}
                className="w-full p-2.5 border rounded-xl bg-white font-bold text-emerald-800"
              >
                <option value="Khon Tan">Ward Palliative ขอนตาล</option>
                <option value="Home Ward PC">Home Ward PC (รพ.เสมือนที่บ้าน)</option>
              </select>
            </div>
            <div>
              <label className="font-semibold text-slate-700 block mb-1">หมายเลขเตียง *</label>
              <input
                type="text"
                required
                value={formData.bed_number}
                onChange={(e) => setFormData({ ...formData, bed_number: e.target.value })}
                className="w-full p-2.5 border rounded-xl"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Palliative Performance Scale (PPS) *</label>
              <select
                value={formData.pps_score}
                onChange={(e) => setFormData({ ...formData, pps_score: Number(e.target.value) })}
                className="w-full p-2.5 border rounded-xl bg-white font-bold text-teal-700"
              >
                <option value={10}>10% - Totally bedbound, Comatose</option>
                <option value={20}>20% - Totally bedbound, Sips/Minimal</option>
                <option value={30}>30% - Totally bedbound, Normal/Reduced intake</option>
                <option value={40}>40% - Mainly in bed &gt;50%, Normal intake</option>
                <option value={50}>50% - Mainly sit/lie, Consider assistance</option>
                <option value={60}>60% - Reduced ambulation, Occasional assist</option>
                <option value={70}>70% - Reduced ambulation, Full self-care</option>
              </select>
            </div>
            <div className="flex items-center pt-5">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.has_syringe_bulb}
                  onChange={(e) => setFormData({ ...formData, has_syringe_bulb: e.target.checked })}
                  className="rounded w-4 h-4 text-pink-600"
                />
                <span className="font-bold text-pink-700 flex items-center gap-1">
                  <Syringe className="w-4 h-4" />
                  มีการใช้ Syringe Bulb
                </span>
              </label>
            </div>
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">ปัญหาสำคัญของผู้ป่วย (Care Problems) *</label>
            <textarea
              rows={2}
              required
              value={formData.care_problems}
              onChange={(e) => setFormData({ ...formData, care_problems: e.target.value })}
              className="w-full p-2 border rounded-xl"
            />
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">กิจกรรมการพยาบาล & การดูแล (Interventions) *</label>
            <textarea
              rows={2}
              required
              value={formData.nursing_interventions}
              onChange={(e) => setFormData({ ...formData, nursing_interventions: e.target.value })}
              className="w-full p-2 border rounded-xl"
            />
          </div>

          <div className="bg-emerald-50 p-3 rounded-xl border border-emerald-200">
            <label className="flex items-center gap-2 cursor-pointer font-bold text-emerald-900">
              <input
                type="checkbox"
                checked={formData.transfer_criteria_met}
                onChange={(e) => setFormData({ ...formData, transfer_criteria_met: e.target.checked })}
                className="rounded w-4 h-4 text-emerald-600"
              />
              เข้าเกณฑ์ย้าย Ward Palliative ครบถ้วน
            </label>
            <input
              type="text"
              value={formData.transfer_criteria_notes}
              onChange={(e) => setFormData({ ...formData, transfer_criteria_notes: e.target.value })}
              className="w-full mt-2 p-2 border rounded-lg bg-white text-xs"
            />
          </div>

          <div className="pt-4 border-t flex items-center justify-end gap-3">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-xl border text-slate-600 font-semibold">
              ยกเลิก
            </button>
            <button type="submit" disabled={submitting} className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold">
              {submitting ? 'กำลังบันทึก...' : 'ยืนยันการรับย้ายเข้าวอร์ด'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ==========================================================================
// 5. DISCHARGE & DECEASED MODAL
// ==========================================================================
interface DischargeModalProps {
  isOpen: boolean;
  onClose: () => void;
  patient: Patient;
  onSubmit: (data: any) => Promise<void>;
}

export const DischargeModal: React.FC<DischargeModalProps> = ({
  isOpen,
  onClose,
  patient,
  onSubmit
}) => {
  const [formData, setFormData] = useState({
    discharge_date: new Date().toISOString().replace('T', ' ').substring(0, 16),
    discharge_type: 'Dead/ปฏิเสธการรักษากลับไปเสียชีวิตที่บ้าน',
    from_ward: patient.current_ward,
    destination_details: 'บ้านผู้ป่วย',
    coc_referral_date: new Date().toISOString().split('T')[0],
    coc_coordinator: 'พว.วัชราภรณ์ (ศูนย์ COC นครพิงค์)',
    has_syringe_bulb: patient.has_syringe_bulb === 1,
    syringe_bulb_protocol: 'Morphine 20mg sc via bulb',
    cause_of_death: patient.main_diagnosis,
    death_location: 'บ้าน (Home)',
    icd_z515_checked: true,
    icd_z718_checked: true,
    summary_notes: 'ผู้ป่วยและครอบครัวประสงค์กลับไปเสียชีวิตอย่างสงบที่บ้าน ทีม COC ร่วมกับ รพ.สต. ในพื้นที่รับช่วงดูแลต่อเนื่อง',
  });
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      await onSubmit(formData);
      onClose();
    } catch (err) {
      alert('บันทึกการจำหน่ายไม่สำเร็จ');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-xl w-full max-w-xl overflow-hidden my-8 max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-rose-50">
          <div>
            <h2 className="text-lg font-bold text-rose-950">จำหน่าย / Refer / เสียชีวิต (D/C & Dead)</h2>
            <p className="text-xs text-rose-800">{patient.full_name} (HN: {patient.hn})</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 text-xs flex-1">
          <div>
            <label className="font-semibold text-slate-700 block mb-1">ประเภทการจำหน่าย (Type of D/C) *</label>
            <select
              value={formData.discharge_type}
              onChange={(e) => setFormData({ ...formData, discharge_type: e.target.value })}
              className="w-full p-2.5 border rounded-xl bg-white font-bold text-purple-900"
            >
              <option value="Dead/ปฏิเสธการรักษากลับไปเสียชีวิตที่บ้าน">Dead/ปฏิเสธการรักษากลับไปเสียชีวิตที่บ้าน (Terminal Discharge)</option>
              <option value="Death ใน รพ./ใน Ward">Death ใน รพ./ใน Ward (เสียชีวิตในโรงพยาบาล)</option>
              <option value="D/C แนวโน้มยังไม่เสียชีวิต">D/C แนวโน้มยังไม่เสียชีวิต (อาการทรงตัว กลับบ้าน)</option>
              <option value="Refer รพช.">Refer รพช. (ส่งต่อโรงพยาบาลชุมชน)</option>
              <option value="Refer ขอนตาล">Refer ขอนตาล (ย้ายไปศูนย์ขอนตาล)</option>
              <option value="Refer กลับนครพิงค์">Refer กลับนครพิงค์ (จากขอนตาลกลับรพ.ใหญ่)</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">วันที่จำหน่าย/เสียชีวิต *</label>
              <input
                type="text"
                required
                value={formData.discharge_date}
                onChange={(e) => setFormData({ ...formData, discharge_date: e.target.value })}
                className="w-full p-2 border rounded-xl"
              />
            </div>
            <div>
              <label className="font-semibold text-slate-700 block mb-1">ปลายทาง / สถานที่</label>
              <input
                type="text"
                value={formData.destination_details}
                onChange={(e) => setFormData({ ...formData, destination_details: e.target.value })}
                className="w-full p-2 border rounded-xl"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 bg-slate-50 p-3 rounded-xl border">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">วันที่ศูนย์ COC รับเคส</label>
              <input
                type="date"
                value={formData.coc_referral_date}
                onChange={(e) => setFormData({ ...formData, coc_referral_date: e.target.value })}
                className="w-full p-2 border rounded-xl bg-white"
              />
            </div>
            <div className="flex items-center pt-4">
              <label className="flex items-center gap-2 cursor-pointer font-bold text-pink-700">
                <input
                  type="checkbox"
                  checked={formData.has_syringe_bulb}
                  onChange={(e) => setFormData({ ...formData, has_syringe_bulb: e.target.checked })}
                  className="rounded w-4 h-4 text-pink-600"
                />
                <Syringe className="w-4 h-4" />
                มี Syringe Bulb กลับบ้าน
              </label>
            </div>
          </div>

          {/* Clinical coding reminder from Google sheet */}
          <div className="bg-teal-50 p-3 rounded-xl border border-teal-200">
            <span className="font-bold text-teal-900 block mb-1">
              ** อย่าลืมเพิ่ม z515 z718 ใน D/C ทุกเคสที่ได้รับการ consult ด้วยค่ะ **
            </span>
            <div className="flex items-center gap-4 text-teal-800">
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.icd_z515_checked}
                  onChange={(e) => setFormData({ ...formData, icd_z515_checked: e.target.checked })}
                  className="rounded text-teal-600"
                />
                เพิ่ม ICD-10 Z51.5 (Palliative care)
              </label>
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.icd_z718_checked}
                  onChange={(e) => setFormData({ ...formData, icd_z718_checked: e.target.checked })}
                  className="rounded text-teal-600"
                />
                เพิ่ม ICD-10 Z71.8 (Counseling)
              </label>
            </div>
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">สรุปการจำหน่ายและการดูแล</label>
            <textarea
              rows={2}
              value={formData.summary_notes}
              onChange={(e) => setFormData({ ...formData, summary_notes: e.target.value })}
              className="w-full p-2 border rounded-xl"
            />
          </div>

          <p className="text-[11px] text-purple-700 bg-purple-50 p-2 rounded-lg border border-purple-200">
            💡 ระบบจะจัดตารางการติดตาม Grief & Bereavement อัตโนมัติ @ 1 สัปดาห์, @ 1 เดือน, และ @ 3 เดือน สำหรับเคสเสียชีวิตทุกราย
          </p>

          <div className="pt-4 border-t flex items-center justify-end gap-3">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-xl border text-slate-600 font-semibold">
              ยกเลิก
            </button>
            <button type="submit" disabled={submitting} className="px-5 py-2 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-bold">
              {submitting ? 'กำลังบันทึก...' : 'ยืนยันการจำหน่าย'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ==========================================================================
// 6. BEREAVEMENT CALL MODAL
// ==========================================================================
interface BereavementCallModalProps {
  isOpen: boolean;
  onClose: () => void;
  call: BereavementFollowup | null;
  onSubmit: (callId: string, data: any) => Promise<void>;
}

export const BereavementCallModal: React.FC<BereavementCallModalProps> = ({
  isOpen,
  onClose,
  call,
  onSubmit
}) => {
  const [formData, setFormData] = useState({
    call_date: new Date().toISOString().split('T')[0],
    call_status: 'COMPLETED',
    caller_name: 'พว.สุดารัตน์',
    grief_assessment: 'Normal Grief Reaction',
    notes: '',
  });
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen || !call) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      await onSubmit(call.id, formData);
      onClose();
    } catch (err) {
      alert('บันทึกการโทรไม่สำเร็จ');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-xl w-full max-w-lg overflow-hidden my-8 max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-purple-50">
          <div>
            <h2 className="text-lg font-bold text-purple-950">บันทึกการโทรติดตาม Grief & Bereavement</h2>
            <p className="text-xs text-purple-700">
              ช่วงเวลา: {call.interval_tag === '1_WEEK' ? '@ ภายใน 1 สัปดาห์' : call.interval_tag === '1_MONTH' ? '@ 1 เดือน' : '@ 3 เดือน'}
            </p>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 text-xs flex-1">
          <div className="bg-slate-50 p-3 rounded-xl border space-y-1">
            <p className="text-slate-800"><strong>ผู้รับสาย/ญาติ:</strong> {call.contact_person}</p>
            <p className="text-teal-700 font-mono"><strong>เบอร์โทรศัพท์:</strong> 📞 {call.contact_phone}</p>
            <p className="text-slate-500"><strong>กำหนดโทร:</strong> {call.due_date}</p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">วันที่โทร *</label>
              <input
                type="date"
                required
                value={formData.call_date}
                onChange={(e) => setFormData({ ...formData, call_date: e.target.value })}
                className="w-full p-2 border rounded-xl"
              />
            </div>
            <div>
              <label className="font-semibold text-slate-700 block mb-1">สถานะการโทร *</label>
              <select
                value={formData.call_status}
                onChange={(e) => setFormData({ ...formData, call_status: e.target.value })}
                className="w-full p-2 border rounded-xl bg-white font-bold"
              >
                <option value="COMPLETED">โทรสำเร็จ (Completed)</option>
                <option value="NO_ANSWER">ไม่รับสาย / โทรไม่ติด</option>
                <option value="POSTPONED">ขอเลื่อนการพูดคุย</option>
              </select>
            </div>
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">การประเมินภาวะเศร้าโศก (Grief Assessment)</label>
            <select
              value={formData.grief_assessment}
              onChange={(e) => setFormData({ ...formData, grief_assessment: e.target.value })}
              className="w-full p-2.5 border rounded-xl bg-white font-medium"
            >
              <option value="Normal Grief Reaction">Normal Grief Reaction (เศร้าตามปกติ ปรับตัวได้)</option>
              <option value="Mild/Moderate Distress">Mild/Moderate Distress (เศร้ามาก ต้องการการประคับประคอง)</option>
              <option value="High Risk / Complicated Grief">High Risk / Complicated Grief (เสี่ยงภาวะเศร้าโศกซับซ้อน)</option>
            </select>
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">เจ้าหน้าที่ผู้โทรติดตาม</label>
            <input
              type="text"
              value={formData.caller_name}
              onChange={(e) => setFormData({ ...formData, caller_name: e.target.value })}
              className="w-full p-2 border rounded-xl"
            />
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">บันทึกการพูดคุย / ข้อสังเกตและคำแนะนำ</label>
            <textarea
              rows={3}
              placeholder="ญาติกล่าวขอบคุณทีมงาน, สภาพจิตใจ, การดำเนินชีวิตประจำวัน..."
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="w-full p-2 border rounded-xl"
            />
          </div>

          <div className="pt-4 border-t flex items-center justify-end gap-3">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-xl border text-slate-600 font-semibold">
              ยกเลิก
            </button>
            <button type="submit" disabled={submitting} className="px-5 py-2 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-bold">
              {submitting ? 'กำลังบันทึก...' : 'บันทึกผลการติดตาม'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
