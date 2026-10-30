# MASTER PROMPT: NKP Palliative Care Network Platform
## ระบบบันทึกข้อมูลและบริหารเครือข่ายบริบาลประคับประคอง (Pedigrow-Style Longitudinal System)

เอกสาร Master Prompt ฉบับสมบูรณ์สำหรับสถาปัตยกรรมและกระบวนการสร้างระบบ **NKP Palliative Care Network** เพื่อใช้เป็นคู่มือแม่แบบ (Master Blueprint) ในการสร้าง ขยาย หรือพัฒนาต่อยอดระบบ

---

## 1. วัตถุประสงค์และปรัชญาของระบบ (Executive Overview & Philosophy)

ระบบออกแบบขึ้นเพื่อแก้ไขปัญหาความกระจัดกระจายของข้อมูลผู้ป่วยระยะท้าย (Palliative Care Fragmentation) โดยยึดหลักการ:
1. **Patient-Centric Pedigrow Concept (ผังบริการแบบแตกกิ่ง)**: ยึดข้อมูลผู้ป่วยตั้งต้น (Core Master Profile) เป็นศูนย์กลาง แล้วเชื่อมโยงแตกกิ่งไปยังบริการเฉพาะทาง (Consult & Triage, Advance Care Plan, Family Meeting, Ward Palliative, Discharge & COC, และ Grief & Bereavement)
2. **Google Sheets Structural Parity (ถอดแบบโครงสร้างจากชีตงานจริง)**: รองรับหัวคอลัมน์ ข้อกำหนดทางคลินิก และลำดับข้อมูลตามชีตงานจริงของโรงพยาบาลนครพิงค์ ครบทั้ง 5 ชีตหลัก (`Round Palli`, `WardPalli`, `Home ward PC`, `Dead, ปฏิเสธรักษา`, `DC, Refer`) พร้อมตรรกะการตรวจราวน์แล้วไฮไลท์สีเขียวอัตโนมัติ
3. **Continuous Subcutaneous Infusion & Device Tracking**: ติดตามเครื่อง Syringe Bulb / Syringe Driver สำหรับการให้ยา Morphine และ Haloperidol อย่างต่อเนื่องทั้งในหอผู้ป่วยและที่บ้าน
4. **Automated Grief & Bereavement Radar**: คำนวณวันนัดหมายและเตือนการโทรติดตามญาติผู้สูญเสีย 3 ระยะมาตรฐาน (@ ภายใน 1 สัปดาห์, @ 1 เดือน, @ 3 เดือน) อัตโนมัติเมื่อผู้ป่วยเสียชีวิตหรือจำหน่ายแบบ terminal discharge

---

## 2. ประตูด่านตรวจการเข้าถึง (Authentication Barrier)

เพื่อความปลอดภัยและความเป็นส่วนตัวของข้อมูลผู้ป่วย (PDPA & Medical Privacy) ระบบมีหน้าต่าง Login ขวางกั้นก่อนเข้าใช้งาน:
- **Username**: `nkp`
- **Password**: `Palli@nkp2026`
- **Session Management**: บันทึกสถานะผู้ใช้งานลงใน `localStorage` (`nkp_palli_auth`) แสดงชื่อและบทบาททีมงานใน Navbar พร้อมปุ่มออกจากระบบ (Sign Out)

---

## 3. หน้าแรกระบบ (Landing / Home Page)

- **Hero Banner**: ภาพวาดการ์ตูนสดใส (Warm Storybook Theme) รูปทีมแพทย์และพยาบาลกำลังตรวจราวน์คนไข้ข้างเตียงอย่างอบอุ่นและเปี่ยมด้วยความเห็นอกเห็นใจ
- **Initial Clean State**: เริ่มต้นด้วยหน้าจอสะอาด ไม่มีตารางข้อมูลรกรุงรัง
- **ปุ่มปฏิบัติการหลัก 4 ปุ่ม**:
  1. 📥 **"โหลดข้อมูลผู้ป่วยจำลอง (30 ราย)"**: ป้อนเคสจำลอง 30 รายการที่ครอบคลุมทุกมิติ ทุกสถานะโรค ทุกวอร์ด และทุกบริการ
  2. 🗑️ **"ล้างข้อมูลทั้งหมด (Reset Database)"**: ล้างข้อมูลออกทั้งหมดเป็นระบบเปล่า เพื่อให้ผู้ใช้ทดลองกรอกเคสจริงด้วยตนเอง พร้อม Modal ยืนยันป้องกันการกดพลาด
  3. ➕ **"+ บันทึกรับเคส Consult ใหม่"**: เปิดฟอร์มรับเคสผู้ป่วยใหม่
  4. 📊 **"เข้าสู่กระดานภาพรวม (Dashboard)"**: เข้าสู่การวิเคราะห์แดชบอร์ด

---

## 4. โครงสร้างฐานข้อมูลและโมเดลข้อมูล (Domain Data Models)

### 4.1 ตารางผู้ป่วยหลัก (`patients`)
- `id`: รหัสผู้ป่วย (TEXT PRIMARY KEY)
- `hn`: เลขประจำตัวผู้ป่วย Hospital Number (TEXT UNIQUE NOT NULL)
- `an`: เลขรับไว้รักษาในโรงพยาบาล Admission Number (TEXT)
- `full_name`: ชื่อ-สกุล (TEXT NOT NULL)
- `age`: อายุ (INTEGER)
- `gender`: เพศ ('ชาย', 'หญิง')
- `id_card`: เลขบัตรประชาชน (TEXT)
- `phone`: เบอร์โทรศัพท์ผู้ป่วย (TEXT)
- `insurance`: สิทธิการรักษา เช่น 'UC (บัตรทอง)', 'เบิกจ่ายตรง', 'ประกันสังคม'
- `main_diagnosis`: การวินิจฉัยโรคหลัก (TEXT NOT NULL)
- `secondary_diagnosis`: โรคร่วม (TEXT)
- `current_ward`: หอผู้ป่วยปัจจุบัน เช่น 'Med 1', 'Ward Palliative ขอนตาล', 'Home Ward PC'
- `current_bed`: เตียง
- `primary_caregiver`: ชื่อผู้ดูแลหลัก
- `caregiver_relation`: ความสัมพันธ์กับผู้ป่วย
- `caregiver_phone`: เบอร์โทรศัพท์ผู้ดูแล
- `bereavement_contact_name`: ชื่อผู้รับการติดตาม Bereavement
- `bereavement_contact_phone`: เบอร์โทรตาม Grief & Bereavement
- `status`: สถานะการรักษา (`ACTIVE_CONSULT`, `FM_IN_PROGRESS`, `WARD_PALLIATIVE`, `HOME_WARD_PC`, `OFF_SERVICE`, `DISCHARGED`, `DECEASED`)
- `has_syringe_bulb`: สถานะการใช้อุปกรณ์ Syringe Bulb (1 หรือ 0)
- `syringe_bulb_details`: รายละเอียดยาใน Bulb เช่น Morphine 30mg + Haloperidol 2.5mg sc
- `form_501_done`: บันทึกแบบรายงาน รง 501 แล้ว (1 หรือ 0)
- `form_510_done`: บันทึกแบบรายงาน รง 510 แล้ว (1 หรือ 0)
- `icd_z515`: ลงรหัส ICD-10 Z51.5 แล้ว (1 หรือ 0)
- `icd_z718`: ลงรหัส ICD-10 Z71.8 แล้ว (1 หรือ 0)

### 4.2 ตารางการส่งปรึกษาและตรวจราวน์ (`consults`)
- `id`: TEXT PRIMARY KEY
- `patient_id`: อ้างอิง patients(id)
- `consult_date`: วันที่ส่ง Consult
- `from_ward`: หอผู้ป่วยต้นทางที่ส่งปรึกษา
- `referring_physician`: แพทย์ผู้ส่งปรึกษา
- `reason_for_consult`: เหตุผลการปรึกษา เช่น Pain control, Goals of Care discussion, Terminal wean
- `triage_level`: ระดับความเร่งด่วน ('Routine', 'High', 'Urgent')
- `palliative_doctor`: แพทย์ Palliative ผู้ดูแล
- `palliative_nurse`: พยาบาล Palliative ผู้ดูแล
- `daily_progress_notes`: บันทึกความก้าวหน้าการตรวจราวน์
- `is_reviewed_today`: เครื่องหมายว่าตรวจราวน์แล้ววันนี้ (1 = ไฮไลท์เขียว, 0 = รอราวน์)
- `review_date`: วันที่ตรวจราวน์ล่าสุด
- `status`: สถานะ ('active', 'completed', 'transferred')

### 4.3 ตารางการวางแผนล่วงหน้า (`advance_care_plans` - ACP)
- `patient_id`: อ้างอิง patients(id) UNIQUE
- `cpr_status`: สถานะการกู้ชีพ ('DNR (Do Not Resuscitate)', 'Full Code', 'Partial Code')
- `ett_status`: การใส่ท่อช่วยหายใจ ('No Intubation (No ETT)', 'Keep existing ETT, No re-ETT', 'Palliative Extubation')
- `med_comfort`: แนวทางการใช้ยาสุขสบาย เช่น Morphine comfort protocol
- `pod`: สถานที่ต้องการเสียชีวิต (Preferred Place of Death: 'บ้าน (Home)', 'Ward Palliative ขอนตาล', 'รพ.นครพิงค์', 'รพช.')
- `living_will_status`: สถานะหนังสือแสดงเจตนาตามมาตรา 12
- `surrogate_decision_maker`: ผู้มีอำนาจตัดสินใจแทน

### 4.4 ตารางการประชุมครอบครัว (`family_meetings` - FM)
- `patient_id`: อ้างอิง patients(id)
- `meeting_date`: วันและเวลาที่ประชุม
- `location`: สถานที่ประชุม
- `team_attendees`: สมาชิกทีมสุขภาพที่เข้าร่วม
- `family_attendees`: สมาชิกครอบครัวและผู้มีสิทธิตัดสินใจ
- `illness_understanding`: การรับรู้และความเข้าใจต่อโรคและการดำเนินโรค
- `goals_of_care`: เป้าหมายการดูแลที่ครอบครัวต้องการ
- `spiritual_cultural_wishes`: ความต้องการมิติจิตวิญญาณและพิธีกรรม
- `consensus`: ข้อสรุปและมติเอกฉันท์ของครอบครัว
- `action_plan`: แผนการดูแลต่อไป
- `fm_status`: สถานะ ('Planned', 'Completed', 'Follow-up Needed')

### 4.5 ตารางหอผู้ป่วยขอนตาลและ Home Ward (`ward_palliative_records`)
- `patient_id`: อ้างอิง patients(id)
- `ward_type`: ประเภทวอร์ด ('Khon Tan' หรือ 'Home Ward PC')
- `bed_number`: หมายเลขเตียง เช่น 'ขอนตาล 01', 'Home-01'
- `pps_score`: คะแนน Palliative Performance Scale (10% - 100%)
- `care_problems`: ปัญหาสำคัญของผู้ป่วย
- `nursing_interventions`: กิจกรรมการพยาบาลและการดูแล
- `transfer_criteria_met`: เข้าเกณฑ์การย้าย Ward Palliative (1 หรือ 0)
- `transfer_criteria_notes`: บันทึกเกณฑ์การย้าย
- `daily_notes`: บันทึกอาการประจำวัน

### 4.6 ตารางการจำหน่ายและส่งต่อ (`discharges`)
- `patient_id`: อ้างอิง patients(id)
- `discharge_date`: วันที่จำหน่าย
- `discharge_type`: ประเภทการจำหน่าย ('Dead/ปฏิเสธการรักษากลับไปเสียชีวิตที่บ้าน', 'Death ใน รพ./ใน Ward', 'D/C แนวโน้มยังไม่เสียชีวิต', 'Refer รพช.', 'Refer ขอนตาล', 'Refer กลับนครพิงค์')
- `destination_details`: สถานที่ปลายทาง
- `coc_referral_date`: วันที่ศูนย์ COC นครพิงค์รับเคส
- `has_syringe_bulb`: มีเครื่อง Syringe Bulb กลับบ้าน
- `cause_of_death`: สาเหตุการเสียชีวิต
- `death_location`: สถานที่เสียชีวิต
- `icd_z515_checked`: เพิ่มรหัส ICD-10 Z51.5 ใน D/C
- `icd_z718_checked`: เพิ่มรหัส ICD-10 Z71.8 ใน D/C

### 4.7 ตารางการติดตามผู้สูญเสีย (`bereavement_followups`)
- `patient_id`: อ้างอิง patients(id)
- `contact_person`: ผู้รับสาย/ญาติ
- `contact_phone`: เบอร์โทรศัพท์
- `interval_tag`: ระยะเวลาติดตาม ('1_WEEK', '1_MONTH', '3_MONTH')
- `due_date`: วันที่ครบกำหนดโทร
- `call_date`: วันที่โทรจริง
- `call_status`: สถานะการโทร ('PENDING', 'COMPLETED', 'NO_ANSWER', 'POSTPONED')
- `caller_name`: เจ้าหน้าที่ผู้โทร
- `grief_assessment`: การประเมินภาวะเศร้าโศก ('Normal Grief Reaction', 'Mild/Moderate Distress', 'High Risk / Complicated Grief')
- `notes`: บันทึกการพูดคุยและให้คำปรึกษา

---

## 5. มุมมองตารางถอดแบบ Google Sheets (Spreadsheet Views)

ระบบจำลองตารางให้ตรงกับ Google Sheets ดั้งเดิม 5 มุมมองหลัก:
1. **Sheet `Round Palli`**: คอลัมน์ No, ชื่อ-สกุล, อายุ, HN, ward, Bed, Dx, ACP (Med, ETT, CPR), POD, FM, รง 501, เข้าเกณฑ์ย้าย ward, เบอร์ตาม bereavement, ความก้าวหน้า/หมายเหตุ พร้อมปุ่มคลิกไฮไลท์แถวสีเขียวเมื่อราวน์แล้ว
2. **Sheet `WardPalli`**: คอลัมน์ No, ชื่อ-สกุล, อายุ, HN, From ward, Bed, Diagnosis, ACP, P (PPS %), FM, สิทธิ รพ, ชื่อและเบอร์ Bereavement, ปัญหา/กิจกรรมการดูแล, Syringe bulb
3. **Sheet `Home ward PC`**: คอลัมน์สำหรับผู้ป่วย Hospital at Home พร้อมติดตามแบบรายงาน รง 510
4. **Sheet `Dead, ปฏิเสธรักษา`**: รวมเคสเสียชีวิตทุกแห่ง พร้อมวันที่ COC รับเคส, Syringe bulb, และคอลัมน์ติดตาม Bereavement (@ 1 wk, @ 1 month, @ 3 month)
5. **Sheet `DC, Refer`**: เคสจำหน่ายอาการทรงตัว หรือ Refer รพช.

---

## 6. แดชบอร์ดสถิติและการวิเคราะห์ทุกมิติ (Multidimensional Analytics)

แสดงผลข้อมูลเชิงลึกในทุกมิติ:
- **Card KPIs**: ผู้ป่วย Consult, ผู้ป่วยในขอนตาล, ผู้ป่วย Home Ward PC, ผู้เสียชีวิต, การใช้ Syringe Bulb, นัดโทร Bereavement
- **Daily Round Progress Bar**: ความก้าวหน้าการตรวจราวน์ประจำวันเทียบกับเคสทั้งหมด
- **Chart 1: Care Setting Trajectory**: สัดส่วนผู้ป่วยตาม Setting
- **Chart 2: Diagnosis Classification**: มะเร็ง (Cancer) vs โรคไม่ใช่มะเร็งระยะท้าย (Non-Cancer: ESRD, Heart Failure, COPD, Stroke, Dementia)
- **Chart 3: Palliative Performance Scale (PPS) Histogram**: การกระจายตัวของระดับสมรรถนะผู้ป่วย
- **Chart 4: ACP Concordance Radar**: อัตรา DNR, อัตราไม่ใส่ท่อช่วยหายใจ (No ETT), และความต้องการสถานที่เสียชีวิต (POD: บ้าน, ขอนตาล, รพ., รพช.)
- **Chart 5: Bereavement Radar & Grief Severity**: อัตราการโทรติดตามสำเร็จ 3 ระยะ และผลการประเมินสภาวะทางอารมณ์
- **Chart 6: Clinical Quality & Audit Compliance**: อัตราความสมบูรณ์ของแบบรายงาน รง 501, รง 510 และการให้รหัส ICD-10 Z51.5 / Z71.8

---

## 7. ข้อมูลอ้างอิงระบบจริง (Real-World System References)

- **โรงพยาบาลนครพิงค์**: โรงพยาบาลศูนย์ประจำจังหวัดเชียงใหม่ สังกัดกระทรวงสาธารณสุข
- **ศูนย์บริบาลประคับประคองขอนตาล**: หอผู้ป่วย Palliative Care Unit 12 เตียง ต.ดอนแก้ว อ.แม่ริม
- **ศูนย์การดูแลต่อเนื่อง (COC - Continuity of Care)**: เครือข่ายประสานการเยี่ยมบ้านและเชื่อมโยง รพ.สต. และ รพช. ในพื้นที่
- **พ.ร.บ. สุขภาพแห่งชาติ พ.ศ. 2550 มาตรา 12**: สิทธิการทำหนังสือแสดงเจตนาไม่ประสงค์จะรับบริการสาธารณสุขที่เป็นไปเพียงเพื่อยืดการตายในวาระสุดท้ายของชีวิต (Living Will)
- **แนวทางเวชปฏิบัติ กรมการแพทย์**: การใช้ยาแก้ปวดกลุ่มโอปิออยด์และการบริหารยาใต้ผิวหนังต่อเนื่อง (Continuous Subcutaneous Infusion) ในผู้ป่วยประคับประคองระยะท้าย

---

## 8. วิธีการนำระบบไปใช้งาน (Deployment & Running)

### 8.1 ใช้งานแบบ Localhost (Full-Stack Mode)
```bash
# 1. ติดตั้ง dependencies
npm install
cd client && npm install && cd ..

# 2. คอมไพล์โปรเจกต์
npm run build

# 3. รันระบบ
npm start
# เปิดเบราว์เซอร์ที่ http://localhost:3001
```

### 8.2 ใช้งานแบบ GitHub Pages (Static Standalone Mode)
ระบบมีกลไก Dual Storage Support: เมื่อเปิดบน GitHub Pages โดยไม่มีเซิร์ฟเวอร์ Backend ระบบจะสลับไปใช้ `localStorage` โดยอัตโนมัติ ทำให้สามารถทดลองใช้งาน, โหลดข้อมูลจำลอง 30 เคส, บันทึกเคสใหม่, แก้ไข ACP, และล้างข้อมูลได้เสมือนมีเซิร์ฟเวอร์จริงทุกประการ!
