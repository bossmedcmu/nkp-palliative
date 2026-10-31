# NKP Palliative Care Cloud Platform
### กลุ่มงานเวชกรรมสังคม โรงพยาบาลนครพิงค์
**ระบบบันทึกและเชื่อมโยงข้อมูลการดูแลผู้ป่วยแบบประคับประคอง (Holistic Palliative Care Information System)**

ระบบ Web Application ออกแบบและพัฒนาเพื่อรองรับงานบริบาลผู้ป่วยประคับประคองของ **กลุ่มงานเวชกรรมสังคม โรงพยาบาลนครพิงค์ และศูนย์บริบาลประคับประคองขอนตาล** โดยถอดแบบโครงสร้างจาก **Google Sheets Palliative Care** ของหน่วยงานจริง และเชื่อมโยงข้อมูลผู้ป่วยตั้งต้น (Core Profile) สู่ทุกเส้นทางการดูแล (Consultation, Advance Care Plan, Family Meeting, Ward Palliative ขอนตาล, Home Ward PC, Discharge/Terminal Care, และ Grief & Bereavement Care)

🌐 **เข้าชมระบบออนไลน์ (Online Live Demo):** [https://bossmedcmu.github.io/nkp-palliative/](https://bossmedcmu.github.io/nkp-palliative/)

---

## 🔐 ข้อมูลเข้าสู่ระบบ (Login Credentials)
- **ชื่อผู้ใช้ (Username):** `nkp`
- **รหัสผ่าน (Password):** `Palli@nkp2026`
*(หมายเหตุ: หน้า Login ออกแบบเพื่อความปลอดภัย ให้ผู้ใช้งานกรอกรหัสผ่านด้วยตนเอง)*

---

## 🌟 โครงสร้างการเชื่อมโยงข้อมูลและการบริการ (Care Pathway Architecture)

```
                    ┌──────────────────────────────────────────────┐
                    │      ข้อมูลผู้ป่วยตั้งต้น (Core Patient Profile)  │
                    │   HN, AN, ชื่อ-สกุล, อายุ, สิทธิ, Dx, Caregiver │
                    └──────────────────────┬───────────────────────┘
                                           │
         ┌───────────────────┬─────────────┴───────┬────────────────────┐
         ▼                   ▼                     ▼                    ▼
┌──────────────────┐┌──────────────────┐┌──────────────────┐┌──────────────────┐
│ 1. Consult/Round ││ 2. ACP / Code    ││ 3. Family Meeting││ 4. Ward Palli    │
│  - หอผู้ป่วยต้นทาง ││  - CPR / DNR     ││  - สมาชิกครอบครัว ││  - ศูนย์ขอนตาล   │
│  - ความเร่งด่วน   ││  - ETT / reETT   ││  - Illness under ││  - Home Ward PC  │
│  - Highlight เขียว││  - Med comfort   ││  - Goals of Care ││  - PPS Score %   │
│  - รง 501        ││  - POD (ที่เสียชีวิต)││  - ข้อสรุปมติ FM ││  - ปัญหา/การพยาบาล │
└──────────────────┘└──────────────────┘└──────────────────┘└─────────┬────────┘
                                                                       │
                                           ┌───────────────────────────┴──────────┐
                                           ▼                                      ▼
                                ┌────────────────────────┐             ┌────────────────────┐
                                │ 5. D/C & Terminal Care │             │ 6. Grief Radar     │
                                │  - Dead/ปฏิเสธการรักษา  ├────────────►│  - @ ภายใน 1 wk    │
                                │  - เสียชีวิตใน รพ.      │ (Auto-Plan) │  - @ 1 เดือน       │
                                │  - Refer รพช./ขอนตาล   │             │  - @ 3 เดือน       │
                                │  - ศูนย์ COC รับเคส    │             │  - ประเมิน Grief   │
                                │  - มี Syringe Bulb     │             │  - บันทึกการโทร    │
                                └────────────────────────┘             └────────────────────┘
```

---

## 🚀 ฟังก์ชันหลักของระบบ (Key Features)

### 1. หน้าแรก (Home Page)
- ภาพวาดหมอและทีมงานกำลังราวน์คนไข้ บรรยากาศอบอุ่น สดใส เป็นมิตร
- ปุ่ม **"โหลดข้อมูลผู้ป่วยจำลอง (30 ราย)"** เพื่อทดสอบระบบได้ทันที
- ปุ่ม **"ล้างข้อมูลผู้ป่วยทั้งหมด"** เพื่อให้เจ้าหน้าที่สามารถเริ่มต้นบันทึกข้อมูลจริงด้วยตนเอง
- เข้าสู่หน้าแรกได้ตลอดเวลาเพียงคลิกที่โลโก้ `NKP PALLIATIVE CARE` ด้านบนซ้าย

### 2. แดชบอร์ดสถิติและการวิเคราะห์เชิงลึก (Clinical & Operational Dashboard)
- **KPI Cards ครบทุกมิติ**: Active Consult, ผู้ป่วยใน Ward ขอนตาล, Home Ward PC, ผู้เสียชีวิต, อุปกรณ์ Syringe Bulb ที่ยืมใช้, นัดหมาย Bereavement ที่รอโทร
- **แผนภูมิวงกลมและแท่ง (Charts)**:
  - สัดส่วนกลุ่มโรคหลัก (Cancer vs Non-Cancer vs Neuro/ESRD)
  - สถิติ CPR Status (Full CPR vs DNR vs Palliative Sedation)
  - การกระจายตัวตามสถานที่ต้องการเสียชีวิต (Place of Death: บ้าน, รพ.นครพิงค์, ศูนย์ขอนตาล, รพช.)
  - ระดับสมรรถนะผู้ป่วย (Palliative Performance Scale - PPS Level)
  - สิทธิการรักษาและการใช้อุปกรณ์ Syringe Bulb
- **Clinical Audit Checklist**: แจ้งเตือนแบบรายงาน รง 501, รง 510, และการให้รหัส ICD-10 `Z51.5` (Palliative care) & `Z71.8` (Counseling)

### 3. ทะเบียนและแผนการดูแลผู้ป่วย (Patient Directory & Holistic Care Profile)
- ค้นหาผู้ป่วยตามชื่อ-สกุล, HN, โรคหลัก, หรือหอผู้ป่วย
- แผนผังเส้นทางการดูแลรายบุคคล (Visual Longitudinal Care Pathway) แบ่งตาม 6 มิติบริการ:
  1. ข้อมูลผู้ป่วยตั้งต้น (Core Profile)
  2. การรับปรึกษาและการราวน์ (Consult & Round History)
  3. แผนการดูแลล่วงหน้า (Advance Care Plan - ACP & Code Status)
  4. การประชุมครอบครัว (Family Meeting - FM Summary & Goals of Care)
  5. บันทึกการดูแลในหอผู้ป่วย (Ward Palliative & Home Ward PC Logs)
  6. การจำหน่ายและการดูแลผู้สูญเสีย (Discharge, COC & Bereavement Radar)

### 4. ตารางข้อมูลแยกตาม Google Sheets ดั้งเดิม (Spreadsheet Grid Views)
แสดงผลรายชื่อผู้ป่วยตรงตามแต่ละชีตต้นฉบับ 100%:
- **ชีต `Round Palli`**: รายชื่อเคส Consult ปัจจุบัน พร้อมปุ่มคลิกตรวจแล้วเพื่อ Highlight สีเขียวทันที
- **ชีต `Ward ขอนตาล`**: รายชื่อผู้ป่วยใน Inpatient ศูนย์ขอนตาล พร้อม PPS %, แผนยา, ETT, CPR, สถานะ FM, สิทธิ, เบอร์โทรญาติ
- **ชีต `Home Ward PC`**: รายชื่อผู้ป่วยโรงพยาบาลเสมือนที่บ้าน พร้อมตัวติดตาม รง 510
- **ชีต `Dead & ปฏิเสธรักษา`**: รวมเคสเสียชีวิตและปฏิเสธการรักษาเพื่อกลับไปเสียชีวิตที่บ้าน พร้อมวันที่ COC รับเคส, Syringe Bulb, และสถานะการติดตาม Bereavement 3 ระยะ
- **ชีต `D/C & Refer`**: รายชื่อเคสจำหน่ายอาการทรงตัว หรือส่งต่อไป รพช.

### 5. เรดาร์ติดตามการสูญเสีย (Grief & Bereavement Radar)
ระบบอัตโนมัติเมื่อมีผู้ป่วยเสียชีวิตหรือส่งกลับบ้าน:
- 📞 **@ ภายใน 1 สัปดาห์**: แสดงความเสียใจและประสานเอกสาร
- 📞 **@ 1 เดือน**: ติดตามภาวะเศร้าโศกและการปรับตัว
- 📞 **@ 3 เดือน**: ประเมินความเสี่ยง Complicated Grief Reaction
- บันทึกผลการโทร, สถานะสาย, และระดับความเสี่ยงได้โดยตรง

### 6. หน้าเกี่ยวกับระบบจริง (About Social Medicine Department)
- ข้อมูลความเป็นมา โครงสร้างองค์กร พันธกิจ และขอบเขตบริการของกลุ่มงานเวชกรรมสังคม โรงพยาบาลนครพิงค์

---

## 🛠️ เทคโนโลยีที่ใช้ (Tech Stack)

- **Frontend**: React 19 + TypeScript + Vite + Tailwind CSS + Lucide Icons + Recharts
- **Backend API**: Node.js + Express + Native SQLite (`node:sqlite`)
- **Offline / Static Support**: LocalStorage Data Adapter จำลองฐานข้อมูลแบบครบวงจร รองรับการทำงานบน GitHub Pages แบบ Serverless โดยไม่ต้องพึ่งพาเซิร์ฟเวอร์ภายนอก

---

## 💻 วิธีการรันระบบบนเครื่องคอมพิวเตอร์ (Local Setup)

```bash
# 1. ติดตั้ง Dependencies
npm install
cd client && npm install && cd ..

# 2. เริ่มต้นรันเซิร์ฟเวอร์แบบ Full-Stack
npm start

# 3. เปิดเบราว์เซอร์
# เข้าใช้งานที่: http://localhost:3001
```

---

## 👥 หน่วยงานรับผิดชอบ
**กลุ่มงานเวชกรรมสังคม โรงพยาบาลนครพิงค์**  
ศูนย์บริบาลประคับประคองขอนตาล และบริการ Home Ward Palliative Care  
อำเภอแม่ริม จังหวัดเชียงใหม่
