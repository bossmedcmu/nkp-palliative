# NKP Palliative Care Network Platform
### ระบบบันทึกข้อมูลและบริหารเครือข่ายผู้ป่วยบริบาลประคับประคอง (Palliative Care Information & Pedigrow-Style System)

ระบบ Web Application ออกแบบและพัฒนาตามโครงสร้างตั้งต้นจาก **Google Sheets Palliative Care** ร่วมกับคอนเซปต์ **Pedigrow** (Patient-Centric Longitudinal Care Tree) โดยเชื่อมโยงข้อมูลผู้ป่วยตั้งต้น (Core Profile) แตกกิ่งไปสู่บริการเฉพาะทาง (Consult & Triage, Advance Care Plan, Family Meeting, Ward Palliative ขอนตาล, Home Ward PC, Discharge/Terminal Care, และ Grief & Bereavement Care)

---

## 🌟 จุดเด่นและการออกแบบตามโครงสร้าง Google Sheet & Pedigrow

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

### 1. แดชบอร์ดบริหารจัดการ (Operational Dashboard)
- ตัวเลขสถิติเคส Active Consult, ผู้ป่วยใน Ward ขอนตาล, Home Ward PC, ผู้เสียชีวิต, อุปกรณ์ Syringe Bulb ที่ยืมใช้, และนัดหมาย Bereavement ที่รอโทร
- **ตัววัดความก้าวหน้าการราวน์ประจำวัน**: แจ้งจำนวนเคสที่ตรวจแล้ว (Highlight เขียว) เทียบกับเคสทั้งหมด
- **Clinical Audit Checklist**: แบบรายงาน รง 501, รง 510, และการให้รหัส ICD-10 `Z51.5` (Palliative care) & `Z71.8` (Counseling) ตามข้อความเตือนใน Google Sheet

### 2. ผังบริการแบบ Pedigrow (Interactive Patient Tree View)
- เมื่อคลิกดูผู้ป่วยรายใดก็ตาม จะแสดงผังบริการแบบแตกกิ่ง (Visual Longitudinal Journey) พร้อมสถานะของแต่ละโหนด (Root, Consult, ACP, FM, Ward Care, D/C & Bereavement)
- เข้าถึงข้อมูลเชิงลึก บันทึกความก้าวหน้า และกดแก้ไขหรือเพิ่มกิจกรรมบริการได้โดยตรงจากแท็บของแต่ละบริการ

### 3. ตารางมุมมองตาม Google Sheets ดั้งเดิม (Spreadsheet Grid Views)
ถอดแบบคอลัมน์และลำดับหัวตารางตามไฟล์ Google Sheets ครบทั้ง 5 ชีตหลัก:
- **Sheet `Round Palli`**: ตารางราวน์ผู้ป่วย Consult ปัจจุบัน พร้อมปุ่มกดตรวจแล้วเพื่อ **Highlight สีเขียว** ทันที
- **Sheet `WardPalli`**: ตารางผู้ป่วยใน Inpatient ศูนย์ขอนตาล (PPS %, Diagnosis, Med, ETT, CPR, FM, สิทธิ, เบอร์ Bereavement, ปัญหา/กิจกรรมการดูแล, Syringe bulb)
- **Sheet `Home ward PC`**: ตารางผู้ป่วยโรงพยาบาลเสมือนที่บ้าน พร้อมตัวติดตาม รง 510
- **Sheet `Dead, ปฏิเสธรักษา`**: รวมเคสเสียชีวิตและปฏิเสธการรักษากลับไปเสียชีวิตที่บ้าน พร้อมวันที่ COC รับเคส, Syringe bulb, และคอลัมน์ติดตาม Bereavement (@ 1 wk, 1 mo, 3 mo)
- **Sheet `DC, Refer`**: เคสจำหน่ายอาการทรงตัว หรือ Refer รพช.

### 4. เรดาร์ติดตามการสูญเสีย (Grief & Bereavement Radar)
- เมื่อมีการบันทึกเคสเสียชีวิต หรือปฏิเสธการรักษากลับบ้าน ระบบจะคำนวณและตั้งเวลาเตือนการโทรอัตโนมัติ 3 ระยะ:
  - 📞 **@ ภายใน 1 สัปดาห์**: แสดงความเสียใจและช่วยเหลือเรื่องเอกสาร
  - 📞 **@ 1 เดือน**: ติดตามภาวะเศร้าโศกและการปรับตัว
  - 📞 **@ 3 เดือน**: ประเมินความเสี่ยง Complicated Grief Reaction
- บันทึกผลการโทร, สถานะสาย, และข้อสังเกตได้ทันที

---

## 🛠️ เทคโนโลยีที่ใช้ (Tech Stack)

- **Frontend**: React 19 + TypeScript + Vite + Tailwind CSS + Lucide Icons
- **Backend API**: Node.js v24 + Express + Native `node:sqlite` (SQLite Database ประสิทธิภาพสูง ไม่ต้องติดตั้งฐานข้อมูลภายนอก)
- **Database**: SQLite พร้อมโครงสร้างตารางครอบคลุม:
  - `patients`, `consults`, `advance_care_plans`, `family_meetings`, `ward_palliative_records`, `discharges`, `bereavement_followups`

---

## 🚀 วิธีการรันระบบ (How to Run)

1. รันเซิร์ฟเวอร์แบบรวม (Full-Stack Single Command):
```bash
npm start
```
หรือ
```bash
node server/index.js
```

2. เปิดเว็บเบราว์เซอร์ที่:
👉 **http://localhost:3001**
