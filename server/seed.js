const { db } = require('./db');

function seedDatabase() {
  console.log('Checking database status...');
  const count = db.prepare('SELECT count(*) as count FROM patients').get();
  if (count && count.count > 0) {
    console.log(`Database already contains ${count.count} patients. Skipping seed.`);
    return;
  }

  console.log('Seeding initial Palliative Care data...');

  const patients = [
    {
      id: 'p1',
      hn: '6062575',
      an: '6700142',
      full_name: 'นายคำปัน ใจมั่น',
      age: 68,
      gender: 'ชาย',
      id_card: '5500100234112',
      phone: '081-4567890',
      insurance: 'UC (บัตรทอง รพ.นครพิงค์)',
      main_diagnosis: 'Cholangiocarcinoma with multiple liver metastases and malignant ascites',
      secondary_diagnosis: 'Hypertension, Dyslipidemia',
      current_ward: 'Med 1',
      current_bed: '04',
      primary_caregiver: 'นางจันทร์แรม ใจมั่น',
      caregiver_relation: 'ภรรยา',
      caregiver_phone: '081-4567891',
      bereavement_contact_name: 'นางจันทร์แรม ใจมั่น (ภรรยา)',
      bereavement_contact_phone: '081-4567891',
      status: 'ACTIVE_CONSULT',
      admission_date: '2026-10-25',
      discharge_date: null,
      has_syringe_bulb: 0,
      syringe_bulb_details: null,
      form_501_done: 1,
      form_510_done: 0,
      icd_z515: 1,
      icd_z718: 1,
      created_at: '2026-10-25 09:30:00',
      updated_at: '2026-10-31 08:00:00',
      consult: {
        id: 'c1',
        consult_date: '2026-10-25',
        from_ward: 'Med 1',
        referring_physician: 'นพ.เกียรติศักดิ์ (อายุรกรรม)',
        reason_for_consult: 'Pain & Abdominal distension, Goals of care & ACP discussion, Family meeting',
        triage_level: 'High',
        palliative_doctor: 'พญ.อรุณี (Palliative Care)',
        palliative_nurse: 'พว.สุดารัตน์',
        daily_progress_notes: 'ผู้ป่วยรู้สึกตัวดี Pain VAS 2-3 หลังปรับ Morphine syrup 10mg q 4 hr. ทานอาหารเหลวได้เล็กน้อย ญาติเข้าใจแนวทางการดูแลแบบประคับประคอง',
        is_reviewed_today: 1,
        review_date: '2026-10-31',
        status: 'active',
        remarks: 'มีแผนย้าย Ward Palliative ขอนตาล เมื่อมีเตียงว่าง'
      },
      acp: {
        id: 'acp1',
        recorded_date: '2026-10-26',
        cpr_status: 'DNR (Do Not Resuscitate)',
        ett_status: 'No Intubation (No ETT)',
        med_comfort: 'Morphine comfort protocol for pain & dyspnea',
        med_details: 'Morphine syrup 10mg q 4 hr oral + Haloperidol 0.5mg hs prn delirium',
        pod: 'บ้าน (Home)',
        living_will_status: 'มีหนังสือแสดงเจตนา (Living Will ตาม ม.12)',
        surrogate_decision_maker: 'นางจันทร์แรม ใจมั่น (ภรรยา)',
        nutrition_preference: 'Oral feeding as tolerated, No NG tube',
        notes: 'ผู้ป่วยและภรรยามีเจตนารมณ์ชัดเจน ไม่ต้องการการกู้ชีพ ปฏิเสธการใส่ท่อและฟอกไต ต้องการกลับไปเสียชีวิตที่บ้านแม่ริม'
      },
      fm: {
        id: 'fm1',
        meeting_date: '2026-10-26 14:00',
        location: 'ห้องให้คำปรึกษา Palliative ชั้น 2',
        team_attendees: 'พญ.อรุณี, พว.สุดารัตน์, นักสังคมสงเคราะห์',
        family_attendees: 'ผู้ป่วย, ภรรยา, บุตรสาว 2 คน',
        illness_understanding: 'ครอบครัวรับทราบว่าโรคมะเร็งท่อน้ำดีแพร่กระจายตับและไม่ตอบสนองต่อเคมีบำบัดแล้ว',
        goals_of_care: 'มุ่งเน้นการควบคุมความปวด ความสุขสบาย ไม่ทรมาน และรักษาตามอาการ',
        spiritual_cultural_wishes: 'ต้องการฟังบทสวดพระคาถาชินบัญชร และนิมนต์พระสงฆ์มาทำสังฆทานที่ข้างเตียง',
        consensus: 'มติครอบครัวเป็นเอกฉันท์ DNR, No ETT, รับการดูแลแบบประคับประคอง',
        action_plan: '1. คุมอาการปวด 2. เตรียมประสานศูนย์ขอนตาล และ 3. หากทรุดลงมาก ประสาน COC นำส่งกลับบ้าน',
        fm_status: 'Completed',
        recorded_by: 'พว.สุดารัตน์'
      }
    },
    {
      id: 'p2',
      hn: '6128490',
      an: '6700892',
      full_name: 'นางบัวเรียว สิทธิคำ',
      age: 74,
      gender: 'หญิง',
      id_card: '5500100582910',
      phone: '089-7654321',
      insurance: 'เบิกจ่ายตรง (ข้าราชการบำนาญ)',
      main_diagnosis: 'Non-Small Cell Lung Cancer Stage IV with multiple brain & bone metastases',
      secondary_diagnosis: 'COPD, Osteoporosis',
      current_ward: 'Med 3',
      current_bed: '12',
      primary_caregiver: 'นายพงษ์ศักดิ์ สิทธิคำ',
      caregiver_relation: 'บุตรชาย',
      caregiver_phone: '089-7654322',
      bereavement_contact_name: 'นายพงษ์ศักดิ์ สิทธิคำ (บุตรชาย)',
      bereavement_contact_phone: '089-7654322',
      status: 'FM_IN_PROGRESS',
      admission_date: '2026-10-27',
      discharge_date: null,
      has_syringe_bulb: 0,
      syringe_bulb_details: null,
      form_501_done: 1,
      form_510_done: 0,
      icd_z515: 1,
      icd_z718: 0,
      created_at: '2026-10-27 11:15:00',
      updated_at: '2026-10-31 07:30:00',
      consult: {
        id: 'c2',
        consult_date: '2026-10-27',
        from_ward: 'Med 3',
        referring_physician: 'พญ.ชลธิชา (อายุรกรรมระบบทางเดินหายใจ)',
        reason_for_consult: 'On ETT ventilator weaning failure, Family meeting regarding Palliative Extubation & Goals of care',
        triage_level: 'Urgent',
        palliative_doctor: 'นพ.ธีรวัฒน์ (Palliative Care)',
        palliative_nurse: 'พว.นงนุช',
        daily_progress_notes: 'ผู้ป่วย On ETT No.7.5, Sedated, Oxygen saturation 95%. รอจัด Family meeting ญาติครบทุกคนในวันที่ 1 พ.ย.',
        is_reviewed_today: 0,
        review_date: null,
        status: 'active',
        remarks: 'เคส Family meeting รอปรึกษาการถอดท่อแบบประคับประคอง (Terminal Wean)'
      },
      acp: {
        id: 'acp2',
        recorded_date: '2026-10-28',
        cpr_status: 'DNR (Do Not Resuscitate)',
        ett_status: 'Keep existing ETT, No re-ETT / Considering Palliative Extubation',
        med_comfort: 'Morphine drip + Midazolam drip comfort protocol',
        med_details: 'Morphine 2mg/hr IV drip titrate for dyspnea, Midazolam 1mg/hr IV drip for restlessness',
        pod: 'Ward Palliative ขอนตาล',
        living_will_status: 'ไม่มีหนังสือแสดงเจตนา (ครอบครัวเป็นผู้ตัดสินใจแทน)',
        surrogate_decision_maker: 'นายพงษ์ศักดิ์ สิทธิคำ (บุตรคนโต)',
        nutrition_preference: 'On NG tube feeding cautiously',
        notes: 'บุตร 3 คน มีความเห็นต่างกันเล็กน้อย กำลังรอประชุมครอบครัวร่วมกันพร้อมหน้า'
      },
      fm: {
        id: 'fm2',
        meeting_date: '2026-11-01 10:00',
        location: 'ห้องประชุมชั้น 3 ตึกอายุรกรรม',
        team_attendees: 'นพ.ธีรวัฒน์, พญ.ชลธิชา, พว.นงนุช',
        family_attendees: 'บุตรชายคนโต, บุตรสาวคนรอง, บุตรชายคนเล็ก (มาจาก กทม.)',
        illness_understanding: 'รอประชุมอย่างเป็นทางการ',
        goals_of_care: 'เป้าหมาย: ประเมินความต้องการในการถอดท่อช่วยหายใจแบบประคับประคอง',
        spiritual_cultural_wishes: 'เตรียมพระพุทธรูปองค์เล็กไว้ข้างเตียง',
        consensus: 'นัดหมายประชุมเรียบร้อย รอผลประชุม',
        action_plan: '1. จัดห้อง Family meeting 2. ให้ข้อมูลทางเลือกการดูแลประคับประคองและการถอดท่อ',
        fm_status: 'Planned',
        recorded_by: 'พว.นงนุช'
      }
    },
    {
      id: 'p3',
      hn: '5894102',
      an: '6700511',
      full_name: 'นายสมศักดิ์ วงศ์ใหญ่',
      age: 71,
      gender: 'ชาย',
      id_card: '5500100192837',
      phone: '089-1234567',
      insurance: 'UC (บัตรทอง รพ.นครพิงค์)',
      main_diagnosis: 'Gastric Adenocarcinoma with Peritoneal Carcinomatosis & Malignant Bowel Obstruction',
      secondary_diagnosis: 'Old CVA with left hemiparesis',
      current_ward: 'Ward Palliative ขอนตาล',
      current_bed: 'ขอนตาล 01',
      primary_caregiver: 'นางนิตยา วงศ์ใหญ่',
      caregiver_relation: 'ภรรยา',
      caregiver_phone: '089-1234568',
      bereavement_contact_name: 'นางนิตยา วงศ์ใหญ่ (ภรรยา)',
      bereavement_contact_phone: '089-1234568',
      status: 'WARD_PALLIATIVE',
      admission_date: '2026-10-18',
      discharge_date: null,
      has_syringe_bulb: 1,
      syringe_bulb_details: 'Syringe bulb (Morphine 30mg + Haloperidol 2.5mg + Hyoscine 40mg / 24 hr sc infusion)',
      form_501_done: 1,
      form_510_done: 0,
      icd_z515: 1,
      icd_z718: 1,
      created_at: '2026-10-18 10:00:00',
      updated_at: '2026-10-31 08:30:00',
      ward_palliative: {
        id: 'wp1',
        ward_type: 'Khon Tan',
        bed_number: 'ขอนตาล 01',
        admitted_from_ward: 'Med 2',
        admission_date: '2026-10-18',
        pps_score: 30,
        care_problems: '1. Chronic abdominal colic pain จาก Malignant bowel obstruction 2. Nausea & Vomiting 3. Malnutrition',
        nursing_interventions: '1. On continuous subcutaneous infusion via Syringe bulb 2. Decompression via NG tube to gravity 3. Mouth care q 2 hr 4. พลิกตัวป้องกันแผลกดทับ q 2 hr',
        transfer_criteria_met: 1,
        transfer_criteria_notes: 'เข้าเกณฑ์ย้าย Ward Palliative: CA stomach stage IV, ACP DNR ชัดเจน, ญาติพร้อมร่วมดูแล',
        daily_notes: 'ผู้ป่วยนอนหลับพักได้ สีหน้าผ่อนคลาย ปวดท้องลดลง VAS 1-2 ไม่มีอาเจียนซ้ำ ภรรยาคอยเช็ดตัวและดูแลข้างเตียง',
        is_reviewed_today: 1,
        status: 'admitted'
      },
      acp: {
        id: 'acp3',
        recorded_date: '2026-10-17',
        cpr_status: 'DNR (Do Not Resuscitate)',
        ett_status: 'No Intubation (No ETT)',
        med_comfort: 'Continuous Subcutaneous Syringe Bulb comfort protocol',
        med_details: 'Morphine 30mg + Haloperidol 2.5mg + Hyoscine-N-butylbromide 40mg sc continuously',
        pod: 'Ward Palliative ขอนตาล',
        living_will_status: 'มีหนังสือแสดงเจตนา (Living Will)',
        surrogate_decision_maker: 'นางนิตยา วงศ์ใหญ่ (ภรรยา)',
        nutrition_preference: 'Sips of water for comfort, No force feeding',
        notes: 'ผู้ป่วยขอรับการดูแลที่ศูนย์ขอนตาลจนถึงวาระสุดท้าย ไม่ประสงค์กลับบ้านเนื่องจากบ้านไม่มีผู้ดูแลต่อเนื่อง'
      },
      fm: {
        id: 'fm3',
        meeting_date: '2026-10-17 13:30',
        location: 'Med 2 Consult room',
        team_attendees: 'พญ.อรุณี, พว.ปิยวรรณ (ขอนตาล)',
        family_attendees: 'ผู้ป่วย, ภรรยา, หลานชาย',
        illness_understanding: 'เข้าใจภาวะลำไส้อุดตันจากมะเร็งลุกลาม ผ่าตัดไม่ได้แล้ว',
        goals_of_care: 'ควบคุมอาการคลื่นไส้ อาเจียน และปวดท้อง ให้สงบที่สุด',
        spiritual_cultural_wishes: 'เปิดบทสวดมนต์เมืองเหนือ และมีพระพุทธรูปประจำตัว',
        consensus: 'ย้ายเข้า Ward Palliative ขอนตาล เพื่อรับการดูแลเฉพาะทาง',
        action_plan: 'ย้ายเตียงขอนตาล 01 พร้อม Syringe bulb',
        fm_status: 'Completed',
        recorded_by: 'พว.ปิยวรรณ'
      }
    },
    {
      id: 'p4',
      hn: '6103452',
      an: '6700620',
      full_name: 'นางคำน้อย วงค์แก้ว',
      age: 79,
      gender: 'หญิง',
      id_card: '5500100445566',
      phone: '084-5678901',
      insurance: 'เบิกจ่ายตรง (กรมบัญชีกลาง)',
      main_diagnosis: 'End-Stage Congestive Heart Failure (NYHA Class IV, LVEF 18%)',
      secondary_diagnosis: 'Chronic Kidney Disease Stage 5, Atrial Fibrillation',
      current_ward: 'Ward Palliative ขอนตาล',
      current_bed: 'ขอนตาล 02',
      primary_caregiver: 'นางสาวรัตนา วงค์แก้ว',
      caregiver_relation: 'บุตรสาว',
      caregiver_phone: '084-5678902',
      bereavement_contact_name: 'นางสาวรัตนา วงค์แก้ว (บุตรสาว)',
      bereavement_contact_phone: '084-5678902',
      status: 'WARD_PALLIATIVE',
      admission_date: '2026-10-22',
      discharge_date: null,
      has_syringe_bulb: 0,
      syringe_bulb_details: null,
      form_501_done: 1,
      form_510_done: 0,
      icd_z515: 1,
      icd_z718: 1,
      created_at: '2026-10-22 14:00:00',
      updated_at: '2026-10-31 08:15:00',
      ward_palliative: {
        id: 'wp2',
        ward_type: 'Khon Tan',
        bed_number: 'ขอนตาล 02',
        admitted_from_ward: 'Med 1',
        admission_date: '2026-10-22',
        pps_score: 20,
        care_problems: '1. Dyspnea on minimal exertion & Orthopnea 2. Generalized edema 3. Bedbound weakness',
        nursing_interventions: '1. Oxygen cannula 3 LPM 2. Morphine 2.5mg sc prn for dyspnea 3. Furosemide low dose 4. จัดท่านอนศีรษะสูง 45 องศา',
        transfer_criteria_met: 1,
        transfer_criteria_notes: 'End stage heart failure refractory to maximum medical therapy, DNR agreed',
        daily_notes: 'หายใจสม่ำเสมอ ชีพจร 78 bpm หายใจเหนื่อยน้อยลงหลังได้ Morphine sc prn 1 dose ตอนเช้า',
        is_reviewed_today: 1,
        status: 'admitted'
      },
      acp: {
        id: 'acp4',
        recorded_date: '2026-10-21',
        cpr_status: 'DNR (Do Not Resuscitate)',
        ett_status: 'No Intubation (No ETT)',
        med_comfort: 'Morphine sc prn for dyspnea + Lorazepam for anxiety',
        med_details: 'Morphine 2.5mg sc q 4 hr prn dyspnea, Lorazepam 0.5mg sublingual prn anxiety',
        pod: 'Ward Palliative ขอนตาล',
        living_will_status: 'มีหนังสือแสดงเจตนา',
        surrogate_decision_maker: 'นางสาวรัตนา วงค์แก้ว (บุตรสาว)',
        nutrition_preference: 'กินอาหารเหลวหรือโจ๊กตามชอบ',
        notes: 'ขอสงบที่ขอนตาล มีลูกสาวเฝ้าตลอด'
      }
    },
    {
      id: 'p5',
      hn: '6157891',
      an: null,
      full_name: 'นางฟองจันทร์ ปัญญาดี',
      age: 85,
      gender: 'หญิง',
      id_card: '5500100778899',
      phone: '081-9876543',
      insurance: 'UC (บัตรทอง)',
      main_diagnosis: 'Severe Mixed Dementia (Alzheimer + Vascular) Bedridden stage',
      secondary_diagnosis: 'Recurrent aspiration pneumonia, Pressure injury grade 2 at sacrum',
      current_ward: 'Home Ward PC',
      current_bed: 'Home-01 (อ.สันทราย)',
      primary_caregiver: 'นายวีระ ปัญญาดี',
      caregiver_relation: 'บุตรชาย',
      caregiver_phone: '081-9876543',
      bereavement_contact_name: 'นายวีระ ปัญญาดี (บุตรชาย)',
      bereavement_contact_phone: '081-9876543',
      status: 'HOME_WARD_PC',
      admission_date: '2026-10-10',
      discharge_date: null,
      has_syringe_bulb: 0,
      syringe_bulb_details: null,
      form_501_done: 1,
      form_510_done: 1,
      icd_z515: 1,
      icd_z718: 1,
      created_at: '2026-10-10 11:00:00',
      updated_at: '2026-10-31 09:00:00',
      ward_palliative: {
        id: 'wp3',
        ward_type: 'Home Ward PC',
        bed_number: 'Home-01',
        admitted_from_ward: 'Med 2',
        admission_date: '2026-10-10',
        pps_score: 20,
        care_problems: '1. Bedridden total dependent 2. Secretion accumulation 3. Risk of recurrent pneumonia 4. Sacral ulcer',
        nursing_interventions: '1. เยี่ยมบ้านติดตามสัปดาห์ละ 1 ครั้ง ร่วมกับ รพ.สต.สันทรายน้อย 2. แนะนำการดูดเสมหะและเคาะปอด 3. ทำแผลกดทับด้วย Hydrocolloid dressing 4. Tele-consultation via Line',
        transfer_criteria_met: 1,
        transfer_criteria_notes: 'ผู้ป่วยและครอบครัวประสงค์รับการดูแลต่อเนื่องที่บ้าน (Hospital at Home Palliative Care)',
        daily_notes: 'โทรติดตามอาการเช้าวันนี้: ไข้ไม่มี เสมหะดูดได้สะดวก แผลกดทับขนาดเล็กลง สัญญาณชีพอุ่นดี ญาติดูแลได้ดี',
        is_reviewed_today: 1,
        status: 'admitted'
      },
      acp: {
        id: 'acp5',
        recorded_date: '2026-10-09',
        cpr_status: 'DNR (Do Not Resuscitate)',
        ett_status: 'No Intubation (No ETT)',
        med_comfort: 'Comfort medication at home',
        med_details: 'Paracetamol syrup, Hyoscine drops for excess secretions, Morphine oral prn',
        pod: 'บ้าน (Home)',
        living_will_status: 'มีหนังสือแสดงเจตนา',
        surrogate_decision_maker: 'นายวีระ ปัญญาดี (บุตรชาย)',
        nutrition_preference: 'Blenderized diet via NG tube',
        notes: 'เป้าหมายคือรักษาตัวและเสียชีวิตอย่างสงบที่บ้าน ไม่พามา รพ. หากไม่จำเป็น'
      }
    },
    {
      id: 'p6',
      hn: '6049213',
      an: null,
      full_name: 'นายสมบูรณ์ ปิ่นแก้ว',
      age: 72,
      gender: 'ชาย',
      id_card: '5500100332211',
      phone: '086-5544332',
      insurance: 'UC (บัตรทอง)',
      main_diagnosis: 'Hepatocellular Carcinoma (HCC) BCLC Stage D with portal vein thrombosis',
      secondary_diagnosis: 'Cirrhosis Child C from Hepatitis B',
      current_ward: 'Home Ward PC',
      current_bed: 'Home-02 (อ.แม่ริม)',
      primary_caregiver: 'นางบัวตอง ปิ่นแก้ว',
      caregiver_relation: 'ภรรยา',
      caregiver_phone: '086-5544332',
      bereavement_contact_name: 'นางบัวตอง ปิ่นแก้ว (ภรรยา)',
      bereavement_contact_phone: '086-5544332',
      status: 'HOME_WARD_PC',
      admission_date: '2026-10-15',
      discharge_date: null,
      has_syringe_bulb: 1,
      syringe_bulb_details: 'Syringe bulb (Morphine 20mg + Haloperidol 2mg / 24 hr sc infusion)',
      form_501_done: 1,
      form_510_done: 1,
      icd_z515: 1,
      icd_z718: 1,
      created_at: '2026-10-15 15:30:00',
      updated_at: '2026-10-31 08:45:00',
      ward_palliative: {
        id: 'wp4',
        ward_type: 'Home Ward PC',
        bed_number: 'Home-02',
        admitted_from_ward: 'Med 1',
        admission_date: '2026-10-15',
        pps_score: 30,
        care_problems: '1. Severe hepatic pain VAS 6-7 2. Jaundice & Pruritus 3. Delirium risk',
        nursing_interventions: '1. On Syringe bulb sc infusion 2. Co-visit กับ COC นครพิงค์ และ รพ.สต.ริมใต้ 3. ให้คำปรึกษาญาติในการเฝ้าระวังอาการช่วงระยะท้าย',
        transfer_criteria_met: 1,
        transfer_criteria_notes: 'ผู้ป่วยมี Syringe bulb กลับบ้าน COC รับเคสติดตามร่วม',
        daily_notes: 'ญาติส่งรายงานทางไลน์: นอนหลับได้ดีขึ้น อาการปวดลดลง เหลือ VAS 2 สีหน้าสงบ ปากชุ่มชื้นดี',
        is_reviewed_today: 1,
        status: 'admitted'
      },
      acp: {
        id: 'acp6',
        recorded_date: '2026-10-14',
        cpr_status: 'DNR (Do Not Resuscitate)',
        ett_status: 'No Intubation (No ETT)',
        med_comfort: 'Syringe bulb Morphine + Haloperidol sc continuous',
        med_details: 'Morphine 20mg + Haloperidol 2mg / 24 hr sc infusion',
        pod: 'บ้าน (Home)',
        living_will_status: 'มีหนังสือแสดงเจตนา (Living Will)',
        surrogate_decision_maker: 'นางบัวตอง ปิ่นแก้ว (ภรรยา)',
        nutrition_preference: 'จิบน้ำและซุปเท่าที่อยากรับประทาน',
        notes: 'ขอเสียชีวิตที่บ้านในหมู่บ้านริมใต้ อ.แม่ริม ญาติเตรียมสถานที่และพิธีการพร้อมแล้ว'
      }
    },
    {
      id: 'p7',
      hn: '5782341',
      an: '6700109',
      full_name: 'นายอินถา สุขใจ',
      age: 76,
      gender: 'ชาย',
      id_card: '5500100990011',
      phone: '085-1122334',
      insurance: 'UC (บัตรทอง)',
      main_diagnosis: 'Adenocarcinoma of Sigmoid Colon with widespread peritoneal carcinomatosis',
      secondary_diagnosis: 'Hypertension',
      current_ward: 'Ward Palliative ขอนตาล (Discharged Deceased)',
      current_bed: null,
      primary_caregiver: 'นางสุภา สุขใจ',
      caregiver_relation: 'บุตรสาว',
      caregiver_phone: '085-1122334',
      bereavement_contact_name: 'นางสุภา สุขใจ (บุตรสาว)',
      bereavement_contact_phone: '085-1122334',
      status: 'DECEASED',
      admission_date: '2026-10-01',
      discharge_date: '2026-10-15',
      has_syringe_bulb: 1,
      syringe_bulb_details: 'Syringe bulb Morphine 30mg/24h sc (คืนอุปกรณ์เรียบร้อยแล้ว)',
      form_501_done: 1,
      form_510_done: 0,
      icd_z515: 1,
      icd_z718: 1,
      created_at: '2026-10-01 09:00:00',
      updated_at: '2026-10-25 10:00:00',
      discharge: {
        id: 'dc1',
        discharge_date: '2026-10-15',
        discharge_type: 'Dead/ปฏิเสธการรักษากลับไปเสียชีวิตที่บ้าน',
        from_ward: 'Ward Palliative ขอนตาล',
        destination_details: 'บ้านผู้ป่วย อ.แม่ริม จ.เชียงใหม่ (เสียชีวิตอย่างสงบที่บ้านเมื่อ 18 ต.ค. 2569)',
        coc_referral_date: '2026-10-15',
        coc_coordinator: 'พว.วัชราภรณ์ (ศูนย์ COC นครพิงค์)',
        has_syringe_bulb: 1,
        syringe_bulb_protocol: 'Morphine 30mg + Haloperidol 2mg sc via bulb',
        cause_of_death: 'Peritoneal carcinomatosis from Colon cancer',
        death_location: 'บ้าน (Home)',
        icd_z515_checked: 1,
        icd_z718_checked: 1,
        summary_notes: 'ผู้ป่วยและครอบครัวขอปฏิเสธการรักษาเชิงรุก และขอนำส่งกลับไปเสียชีวิตที่บ้านพร้อม Syringe bulb ทีม COC ร่วมกับ รพ.สต. ติดตามดูแลจนเสียชีวิตอย่างสงบ'
      },
      bereavement_calls: [
        {
          id: 'bf1',
          contact_person: 'นางสุภา สุขใจ (บุตรสาว)',
          contact_phone: '085-1122334',
          interval_tag: '1_WEEK',
          due_date: '2026-10-25',
          call_date: '2026-10-25',
          call_status: 'COMPLETED',
          caller_name: 'พว.สุดารัตน์',
          grief_assessment: 'Normal Grief Reaction',
          notes: 'โทรติดตามสัปดาห์แรก: บุตรสาวกล่าวขอบคุณทีมงาน Palliative คุณพ่อจากไปอย่างสงบที่บ้านตามที่ตั้งใจ งานศพเสร็จสิ้นเรียบร้อย บุตรสาวมีอาการเศร้าแต่สามารถนอนหลับและดำเนินชีวิตประจำวันได้ มีญาติพี่น้องคอยให้กำลังใจ'
        },
        {
          id: 'bf2',
          contact_person: 'นางสุภา สุขใจ (บุตรสาว)',
          contact_phone: '085-1122334',
          interval_tag: '1_MONTH',
          due_date: '2026-11-18',
          call_date: null,
          call_status: 'PENDING',
          caller_name: null,
          grief_assessment: null,
          notes: 'กำหนดโทรติดตาม 1 เดือน'
        },
        {
          id: 'bf3',
          contact_person: 'นางสุภา สุขใจ (บุตรสาว)',
          contact_phone: '085-1122334',
          interval_tag: '3_MONTH',
          due_date: '2027-01-18',
          call_date: null,
          call_status: 'PENDING',
          caller_name: null,
          grief_assessment: null,
          notes: 'กำหนดโทรติดตาม 3 เดือน'
        }
      ]
    },
    {
      id: 'p8',
      hn: '5912443',
      an: '6700778',
      full_name: 'นางบัวผัน ใจวรรณ',
      age: 80,
      gender: 'หญิง',
      id_card: '5500100667788',
      phone: '087-6543210',
      insurance: 'UC (บัตรทอง)',
      main_diagnosis: 'Massive Intracerebral Hemorrhage with midline shift & brainstem compression',
      secondary_diagnosis: 'Hypertension, Atrial Fibrillation',
      current_ward: 'Med 1 (Discharged Deceased)',
      current_bed: null,
      primary_caregiver: 'นายประดิษฐ์ ใจวรรณ',
      caregiver_relation: 'สามี',
      caregiver_phone: '087-6543210',
      bereavement_contact_name: 'นายประดิษฐ์ ใจวรรณ (สามี)',
      bereavement_contact_phone: '087-6543210',
      status: 'DECEASED',
      admission_date: '2026-10-21',
      discharge_date: '2026-10-24',
      has_syringe_bulb: 0,
      syringe_bulb_details: null,
      form_501_done: 1,
      form_510_done: 0,
      icd_z515: 1,
      icd_z718: 1,
      created_at: '2026-10-21 16:00:00',
      updated_at: '2026-10-28 11:00:00',
      discharge: {
        id: 'dc2',
        discharge_date: '2026-10-24 18:45',
        discharge_type: 'Death ใน รพ./ใน Ward',
        from_ward: 'Med 1',
        destination_details: 'เสียชีวิตในตึก Med 1 รพ.นครพิงค์',
        coc_referral_date: null,
        coc_coordinator: null,
        has_syringe_bulb: 0,
        syringe_bulb_protocol: null,
        cause_of_death: 'Brain herniation from massive ICH',
        death_location: 'รพ.นครพิงค์ (Med 1)',
        icd_z515_checked: 1,
        icd_z718_checked: 1,
        summary_notes: 'ผู้ป่วย Coma GCS E1VTM1 ศัลยแพทย์ระบบประสาทประเมินผ่าตัดไม่ได้ ญาติทำ Family meeting ตกลง DNR & Comfort care ได้รับ Morphine infusion ควบคุมอาการเหนื่อย เสียชีวิตอย่างสงบในตึก Med 1'
      },
      bereavement_calls: [
        {
          id: 'bf4',
          contact_person: 'นายประดิษฐ์ ใจวรรณ (สามี)',
          contact_phone: '087-6543210',
          interval_tag: '1_WEEK',
          due_date: '2026-10-31',
          call_date: '2026-10-31',
          call_status: 'COMPLETED',
          caller_name: 'พว.นงนุช',
          grief_assessment: 'Mild/Moderate Distress',
          notes: 'โทรติดตามสัปดาห์แรก: สามีอายุ 82 ปี อาศัยอยู่กับหลาน มีความเศร้าโศกมาก คิดถึงภรรยา รับประทานอาหารได้น้อย ทีมงานได้ให้กำลังใจ แนะนำการดูแลสุขภาพ แนะนำหลานให้คอยดูแลใกล้ชิด และนัดหมายโทรซ้ำใน 1 เดือน'
        },
        {
          id: 'bf5',
          contact_person: 'นายประดิษฐ์ ใจวรรณ (สามี)',
          contact_phone: '087-6543210',
          interval_tag: '1_MONTH',
          due_date: '2026-11-24',
          call_date: null,
          call_status: 'PENDING',
          caller_name: null,
          grief_assessment: null,
          notes: 'กำหนดโทรติดตาม 1 เดือน (เฝ้าระวังผู้สูงอายุสูญเสียคู่สมรส)'
        },
        {
          id: 'bf6',
          contact_person: 'นายประดิษฐ์ ใจวรรณ (สามี)',
          contact_phone: '087-6543210',
          interval_tag: '3_MONTH',
          due_date: '2027-01-24',
          call_date: null,
          call_status: 'PENDING',
          caller_name: null,
          grief_assessment: null,
          notes: 'กำหนดโทรติดตาม 3 เดือน'
        }
      ]
    },
    {
      id: 'p9',
      hn: '6192834',
      an: '6700418',
      full_name: 'นางดวงใจ ชัยชนะ',
      age: 58,
      gender: 'หญิง',
      id_card: '5500100889900',
      phone: '082-3456789',
      insurance: 'ประกันสังคม รพ.นครพิงค์',
      main_diagnosis: 'Metastatic Breast Carcinoma (ER+, PR+, HER2-) with painful bone metastases',
      secondary_diagnosis: 'None',
      current_ward: 'Discharged / OPD Palliative Follow-up',
      current_bed: null,
      primary_caregiver: 'นายชาญวิทย์ ชัยชนะ',
      caregiver_relation: 'สามี',
      caregiver_phone: '082-3456789',
      bereavement_contact_name: 'นายชาญวิทย์ ชัยชนะ (สามี)',
      bereavement_contact_phone: '082-3456789',
      status: 'DISCHARGED',
      admission_date: '2026-10-12',
      discharge_date: '2026-10-26',
      has_syringe_bulb: 0,
      syringe_bulb_details: null,
      form_501_done: 1,
      form_510_done: 0,
      icd_z515: 1,
      icd_z718: 1,
      created_at: '2026-10-12 10:00:00',
      updated_at: '2026-10-26 15:00:00',
      discharge: {
        id: 'dc3',
        discharge_date: '2026-10-26',
        discharge_type: 'D/C แนวโน้มยังไม่เสียชีวิต',
        from_ward: 'Ward Palliative ขอนตาล',
        destination_details: 'กลับบ้าน อ.แม่ริม และ Refer รพช.แม่ริม ติดตามรับยาแก้ปวดต่อเนื่อง',
        coc_referral_date: '2026-10-26',
        coc_coordinator: 'พว.สุดารัตน์',
        has_syringe_bulb: 0,
        syringe_bulb_protocol: null,
        cause_of_death: null,
        death_location: null,
        icd_z515_checked: 1,
        icd_z718_checked: 1,
        summary_notes: 'อาการปวดกระดูกควบคุมได้ดีด้วยยา MST (Morphine sulfate tablets) 30mg oral bid + MO syrup 10mg prn. ผู้ป่วยเดินได้ด้วย Walker ช่วยเหลือตนเองได้ดี D/C กลับบ้านพร้อม Care plan ส่งต่อ รพช.แม่ริม'
      }
    }
  ];

  const insertPatient = db.prepare(`
    INSERT INTO patients (
      id, hn, an, full_name, age, gender, id_card, phone, insurance,
      main_diagnosis, secondary_diagnosis, current_ward, current_bed,
      primary_caregiver, caregiver_relation, caregiver_phone,
      bereavement_contact_name, bereavement_contact_phone, status,
      admission_date, discharge_date, has_syringe_bulb, syringe_bulb_details,
      form_501_done, form_510_done, icd_z515, icd_z718, created_at, updated_at
    ) VALUES (
      ?, ?, ?, ?, ?, ?, ?, ?, ?,
      ?, ?, ?, ?,
      ?, ?, ?,
      ?, ?, ?,
      ?, ?, ?, ?,
      ?, ?, ?, ?, ?, ?
    )
  `);

  const insertConsult = db.prepare(`
    INSERT INTO consults (
      id, patient_id, consult_date, from_ward, referring_physician,
      reason_for_consult, triage_level, palliative_doctor, palliative_nurse,
      daily_progress_notes, is_reviewed_today, review_date, status, remarks, created_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const insertAcp = db.prepare(`
    INSERT INTO advance_care_plans (
      id, patient_id, recorded_date, cpr_status, ett_status, med_comfort,
      med_details, pod, living_will_status, surrogate_decision_maker,
      nutrition_preference, notes, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const insertFm = db.prepare(`
    INSERT INTO family_meetings (
      id, patient_id, meeting_date, location, team_attendees, family_attendees,
      illness_understanding, goals_of_care, spiritual_cultural_wishes,
      consensus, action_plan, fm_status, recorded_by, created_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const insertWard = db.prepare(`
    INSERT INTO ward_palliative_records (
      id, patient_id, ward_type, bed_number, admitted_from_ward, admission_date,
      pps_score, care_problems, nursing_interventions, transfer_criteria_met,
      transfer_criteria_notes, daily_notes, is_reviewed_today, status, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const insertDischarge = db.prepare(`
    INSERT INTO discharges (
      id, patient_id, discharge_date, discharge_type, from_ward, destination_details,
      coc_referral_date, coc_coordinator, has_syringe_bulb, syringe_bulb_protocol,
      cause_of_death, death_location, icd_z515_checked, icd_z718_checked, summary_notes, created_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const insertBereavement = db.prepare(`
    INSERT INTO bereavement_followups (
      id, patient_id, contact_person, contact_phone, interval_tag, due_date,
      call_date, call_status, caller_name, grief_assessment, notes, created_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  for (const p of patients) {
    insertPatient.run(
      p.id, p.hn, p.an, p.full_name, p.age, p.gender, p.id_card, p.phone, p.insurance,
      p.main_diagnosis, p.secondary_diagnosis, p.current_ward, p.current_bed,
      p.primary_caregiver, p.caregiver_relation, p.caregiver_phone,
      p.bereavement_contact_name, p.bereavement_contact_phone, p.status,
      p.admission_date, p.discharge_date, p.has_syringe_bulb, p.syringe_bulb_details,
      p.form_501_done, p.form_510_done, p.icd_z515, p.icd_z718, p.created_at, p.updated_at
    );

    if (p.consult) {
      insertConsult.run(
        p.consult.id, p.id, p.consult.consult_date, p.consult.from_ward,
        p.consult.referring_physician, p.consult.reason_for_consult,
        p.consult.triage_level, p.consult.palliative_doctor, p.consult.palliative_nurse,
        p.consult.daily_progress_notes, p.consult.is_reviewed_today, p.consult.review_date,
        p.consult.status, p.consult.remarks, p.created_at
      );
    }

    if (p.acp) {
      insertAcp.run(
        p.acp.id, p.id, p.acp.recorded_date, p.acp.cpr_status, p.acp.ett_status,
        p.acp.med_comfort, p.acp.med_details, p.acp.pod, p.acp.living_will_status,
        p.acp.surrogate_decision_maker, p.acp.nutrition_preference, p.acp.notes, p.updated_at
      );
    }

    if (p.fm) {
      insertFm.run(
        p.fm.id, p.id, p.fm.meeting_date, p.fm.location, p.fm.team_attendees,
        p.fm.family_attendees, p.fm.illness_understanding, p.fm.goals_of_care,
        p.fm.spiritual_cultural_wishes, p.fm.consensus, p.fm.action_plan,
        p.fm.fm_status, p.fm.recorded_by, p.created_at
      );
    }

    if (p.ward_palliative) {
      insertWard.run(
        p.ward_palliative.id, p.id, p.ward_palliative.ward_type,
        p.ward_palliative.bed_number, p.ward_palliative.admitted_from_ward,
        p.ward_palliative.admission_date, p.ward_palliative.pps_score,
        p.ward_palliative.care_problems, p.ward_palliative.nursing_interventions,
        p.ward_palliative.transfer_criteria_met, p.ward_palliative.transfer_criteria_notes,
        p.ward_palliative.daily_notes, p.ward_palliative.is_reviewed_today,
        p.ward_palliative.status, p.updated_at
      );
    }

    if (p.discharge) {
      insertDischarge.run(
        p.discharge.id, p.id, p.discharge.discharge_date, p.discharge.discharge_type,
        p.discharge.from_ward, p.discharge.destination_details,
        p.discharge.coc_referral_date, p.discharge.coc_coordinator,
        p.discharge.has_syringe_bulb, p.discharge.syringe_bulb_protocol,
        p.discharge.cause_of_death, p.discharge.death_location,
        p.discharge.icd_z515_checked, p.discharge.icd_z718_checked,
        p.discharge.summary_notes, p.created_at
      );
    }

    if (p.bereavement_calls) {
      for (const bc of p.bereavement_calls) {
        insertBereavement.run(
          bc.id, p.id, bc.contact_person, bc.contact_phone, bc.interval_tag,
          bc.due_date, bc.call_date, bc.call_status, bc.caller_name,
          bc.grief_assessment, bc.notes, p.created_at
        );
      }
    }
  }

  console.log('Seeded patients successfully!');
}

module.exports = { seedDatabase };

if (require.main === module) {
  seedDatabase();
}
