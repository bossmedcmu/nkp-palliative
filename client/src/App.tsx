import React, { useState, useEffect } from 'react';
import { 
  Activity, Users, FileSpreadsheet, Bed, Home, HeartHandshake, 
  Plus, RefreshCw, ChevronLeft, Stethoscope, Search, ShieldCheck,
  Building2, PhoneCall, LogOut, BookOpen, Sparkles, UserCheck
} from 'lucide-react';
import { 
  fetchStats, fetchPatients, fetchPatientDetail, createPatient, 
  saveACP, saveFamilyMeeting, transferToWard, dischargePatient, 
  logBereavementCall, toggleConsultReview 
} from './services/api';
import { 
  hasStoredData, getLocalDataset, saveLocalDataset, 
  load30MockPatients, resetDatabase, calculateStats 
} from './services/storage';
import { Patient, DashboardStats, BereavementFollowup } from './types';
import { Login } from './components/Auth/Login';
import { HomePage } from './components/Home/HomePage';
import { Dashboard } from './components/Dashboard';
import { PatientDirectory } from './components/PatientDirectory';
import { PedigrowProfile } from './components/PedigrowProfile';
import { SpreadsheetView } from './components/SpreadsheetView';
import { BereavementRadar } from './components/BereavementRadar';
import { AboutPage } from './components/About/AboutPage';
import { 
  NewPatientModal, AcpModal, FamilyMeetingModal, 
  WardTransferModal, DischargeModal, BereavementCallModal 
} from './components/Modals';

export function App() {
  // Authentication State
  const [currentUser, setCurrentUser] = useState<{ username: string; name: string } | null>(() => {
    const saved = localStorage.getItem('nkp_palli_auth');
    return saved ? JSON.parse(saved) : null;
  });

  // Active View Tab: 'home' is the landing page
  const [activeTab, setActiveTab] = useState<string>('home');
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loadingPatients, setLoadingPatients] = useState<boolean>(true);
  
  // Selected Patient for Pedigrow Profile Detail
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);
  const [patientDetail, setPatientDetail] = useState<any | null>(null);
  const [loadingDetail, setLoadingDetail] = useState<boolean>(false);

  // Modals state
  const [isNewPatientModalOpen, setIsNewPatientModalOpen] = useState(false);
  const [isAcpModalOpen, setIsAcpModalOpen] = useState(false);
  const [isFmModalOpen, setIsFmModalOpen] = useState(false);
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);
  const [isDischargeModalOpen, setIsDischargeModalOpen] = useState(false);
  const [activeBereavementCall, setActiveBereavementCall] = useState<BereavementFollowup | null>(null);

  // Load stats and patient directory (supports backend API or localStorage fallback)
  const loadStatsAndPatients = async () => {
    try {
      setLoadingPatients(true);
      // Try backend first
      try {
        const [sData, pData] = await Promise.all([
          fetchStats(),
          fetchPatients()
        ]);
        setStats(sData);
        setPatients(pData);
        return;
      } catch (err) {
        // Fallback to localStorage
        const local = getLocalDataset();
        setPatients(local.patients);
        setStats(calculateStats(local));
      }
    } catch (err) {
      console.error('Error loading data:', err);
    } finally {
      setLoadingPatients(false);
    }
  };

  useEffect(() => {
    if (currentUser) {
      loadStatsAndPatients();
    }
  }, [currentUser]);

  // Load specific patient detail when selected
  const loadPatientDetail = async (id: string) => {
    try {
      setLoadingDetail(true);
      try {
        const data = await fetchPatientDetail(id);
        setPatientDetail(data);
        return;
      } catch (err) {
        // Fallback to local dataset
        const local = getLocalDataset();
        const p = local.patients.find(item => item.id === id);
        if (!p) throw new Error('Patient not found');
        setPatientDetail({
          patient: p,
          consults: local.consults.filter(c => c.patient_id === id),
          acp: local.acps.find(a => a.patient_id === id) || null,
          familyMeetings: local.familyMeetings.filter(f => f.patient_id === id),
          wardRecords: local.wardRecords.filter(w => w.patient_id === id),
          discharge: local.discharges.find(d => d.patient_id === id) || null,
          bereavementCalls: local.bereavementCalls.filter(b => b.patient_id === id),
        });
      }
    } catch (err) {
      console.error('Error loading patient detail:', err);
    } finally {
      setLoadingDetail(false);
    }
  };

  useEffect(() => {
    if (selectedPatientId) {
      loadPatientDetail(selectedPatientId);
    } else {
      setPatientDetail(null);
    }
  }, [selectedPatientId]);

  // Handle selecting a patient
  const handleSelectPatient = (id: string) => {
    setSelectedPatientId(id);
  };

  const handleBackToDirectory = () => {
    setSelectedPatientId(null);
    setPatientDetail(null);
  };

  // Toggle Consult review status (Green highlight)
  const handleToggleReview = async (consultId: string, current: number) => {
    try {
      await toggleConsultReview(consultId, current === 0);
    } catch (e) {
      // update in local dataset if backend unavailable
      const local = getLocalDataset();
      const c = local.consults.find(item => item.id === consultId);
      if (c) {
        c.is_reviewed_today = current === 0 ? 1 : 0;
        saveLocalDataset(local);
      }
    }
    if (selectedPatientId) {
      await loadPatientDetail(selectedPatientId);
    }
    await loadStatsAndPatients();
  };

  // Handler: Load 30 Mock Patients
  const handleLoadMockData = async () => {
    const dataset = await load30MockPatients();
    setPatients(dataset.patients);
    setStats(calculateStats(dataset));
    alert('โหลดข้อมูลผู้ป่วยจำลอง 30 รายการเข้าสู่ระบบเรียบร้อยแล้ว!');
  };

  // Handler: Reset Database
  const handleResetData = async () => {
    await resetDatabase();
    setPatients([]);
    setStats(calculateStats({
      patients: [],
      consults: [],
      acps: [],
      familyMeetings: [],
      wardRecords: [],
      discharges: [],
      bereavementCalls: []
    }));
    setSelectedPatientId(null);
    setPatientDetail(null);
    alert('ล้างข้อมูลผู้ป่วยทั้งหมดออกจากระบบเรียบร้อยแล้ว คุณสามารถเริ่มบันทึกเคสใหม่ได้ทันที');
  };

  // Logout handler
  const handleLogout = () => {
    if (confirm('คุณต้องการออกจากระบบ Palliative Care หรือไม่?')) {
      localStorage.removeItem('nkp_palli_auth');
      setCurrentUser(null);
    }
  };

  // IF NOT AUTHENTICATED: Show Login screen
  if (!currentUser) {
    return <Login onLoginSuccess={(u) => setCurrentUser(u)} />;
  }

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-900 flex flex-col font-sans">
      {/* Top Main Navigation Bar */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo and Hospital Title - Clickable to return to Home Page */}
            <div 
              onClick={() => { setActiveTab('home'); setSelectedPatientId(null); }}
              className="flex items-center gap-3 cursor-pointer group"
              title="คลิกเพื่อกลับไปหน้าแรก (Home)"
            >
              <div className="w-10 h-10 rounded-xl bg-teal-600 text-white flex items-center justify-center font-black text-xl shadow-md shadow-teal-100 group-hover:bg-teal-700 transition-colors">
                PC
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-slate-900 text-base tracking-tight group-hover:text-teal-700 transition-colors">
                    NKP PALLIATIVE CARE
                  </span>
                  <span className="text-[10px] font-bold uppercase bg-teal-100 text-teal-800 px-2 py-0.5 rounded border border-teal-200">
                    รพ.นครพิงค์ & ขอนตาล
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 font-medium">
                  ระบบบันทึกและเชื่อมโยงบริการดูแลผู้ป่วยแบบประคับประคอง
                </p>
              </div>
            </div>

            {/* User Session & Quick Action Controls */}
            <div className="flex items-center gap-3">
              <div className="hidden md:flex items-center gap-2 bg-slate-50 border border-slate-200 py-1.5 px-3 rounded-xl text-xs">
                <UserCheck className="w-4 h-4 text-teal-600" />
                <span className="font-semibold text-slate-700">{currentUser.name}</span>
              </div>

              <button
                onClick={() => setIsNewPatientModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-teal-600 hover:bg-teal-700 text-white shadow-xs transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline">+ รับเคส Consult ใหม่</span>
              </button>

              <button
                onClick={loadStatsAndPatients}
                className="p-2 text-slate-500 hover:text-slate-800 rounded-xl hover:bg-slate-100 transition-colors"
                title="รีเฟรชข้อมูลทั้งระบบ"
              >
                <RefreshCw className="w-4 h-4" />
              </button>

              <button
                onClick={handleLogout}
                className="p-2 text-rose-500 hover:text-rose-700 rounded-xl hover:bg-rose-50 transition-colors"
                title="ออกจากระบบ (Sign Out)"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Sub Navigation Tabs */}
          <nav className="flex space-x-1 overflow-x-auto py-2 border-t border-slate-100 scrollbar-none text-xs font-semibold">
            <button
              onClick={() => { setActiveTab('home'); setSelectedPatientId(null); }}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'home' && !selectedPatientId
                  ? 'bg-teal-600 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Home className="w-4 h-4" />
              หน้าแรก (Home)
            </button>

            <button
              onClick={() => { setActiveTab('dashboard'); setSelectedPatientId(null); }}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'dashboard' && !selectedPatientId
                  ? 'bg-teal-600 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Activity className="w-4 h-4" />
              แดชบอร์ดสถิติ & กราฟ
            </button>

            <button
              onClick={() => { setActiveTab('patients'); setSelectedPatientId(null); }}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'patients' && !selectedPatientId
                  ? 'bg-teal-600 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Users className="w-4 h-4" />
              ทะเบียนผู้ป่วย & ผัง Pedigrow ({patients.length})
            </button>

            <button
              onClick={() => { setActiveTab('round-palli'); setSelectedPatientId(null); }}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'round-palli' && !selectedPatientId
                  ? 'bg-teal-600 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <FileSpreadsheet className="w-4 h-4" />
              Round Palli (ชีตราวน์)
            </button>

            <button
              onClick={() => { setActiveTab('ward-palli'); setSelectedPatientId(null); }}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'ward-palli' && !selectedPatientId
                  ? 'bg-teal-600 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Bed className="w-4 h-4" />
              Ward ขอนตาล ({stats ? stats.wardKhonTan : '-'})
            </button>

            <button
              onClick={() => { setActiveTab('home-ward'); setSelectedPatientId(null); }}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'home-ward' && !selectedPatientId
                  ? 'bg-teal-600 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Building2 className="w-4 h-4" />
              Home Ward PC ({stats ? stats.homeWardPC : '-'})
            </button>

            <button
              onClick={() => { setActiveTab('dead'); setSelectedPatientId(null); }}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'dead' && !selectedPatientId
                  ? 'bg-teal-600 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <HeartHandshake className="w-4 h-4" />
              Dead & ปฏิเสธรักษา ({stats ? stats.deceasedCount : '-'})
            </button>

            <button
              onClick={() => { setActiveTab('dc-refer'); setSelectedPatientId(null); }}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'dc-refer' && !selectedPatientId
                  ? 'bg-teal-600 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <FileSpreadsheet className="w-4 h-4" />
              D/C & Refer ({stats ? stats.dischargedCount : '-'})
            </button>

            <button
              onClick={() => { setActiveTab('bereavement'); setSelectedPatientId(null); }}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'bereavement' && !selectedPatientId
                  ? 'bg-teal-600 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <PhoneCall className="w-4 h-4" />
              เรดาร์ Bereavement ({stats ? stats.pendingBereavementCalls : '-'})
            </button>

            <button
              onClick={() => { setActiveTab('about'); setSelectedPatientId(null); }}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'about' && !selectedPatientId
                  ? 'bg-teal-600 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              เกี่ยวกับระบบจริง
            </button>
          </nav>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex-1 w-full">
        {/* If a patient is selected, display Pedigrow Profile */}
        {selectedPatientId ? (
          <div>
            <div className="mb-4">
              <button
                onClick={handleBackToDirectory}
                className="inline-flex items-center gap-1 text-xs font-semibold text-slate-600 hover:text-teal-700 bg-white px-3 py-1.5 rounded-xl border border-slate-200 transition-colors shadow-xs"
              >
                <ChevronLeft className="w-4 h-4" />
                ย้อนกลับไปหน้ารวม
              </button>
            </div>

            {loadingDetail ? (
              <div className="p-16 text-center text-slate-500 bg-white rounded-3xl border border-slate-200">
                กำลังโหลดแผนผัง Pedigrow และข้อมูลบริการผู้ป่วย...
              </div>
            ) : patientDetail ? (
              <PedigrowProfile
                patient={patientDetail.patient}
                consults={patientDetail.consults}
                acp={patientDetail.acp}
                familyMeetings={patientDetail.familyMeetings}
                wardRecords={patientDetail.wardRecords}
                discharge={patientDetail.discharge}
                bereavementCalls={patientDetail.bereavementCalls}
                onRefresh={() => loadPatientDetail(selectedPatientId)}
                onOpenAcpModal={() => setIsAcpModalOpen(true)}
                onOpenFmModal={() => setIsFmModalOpen(true)}
                onOpenTransferModal={() => setIsTransferModalOpen(true)}
                onOpenDischargeModal={() => setIsDischargeModalOpen(true)}
                onOpenBereavementModal={(call) => setActiveBereavementCall(call)}
                onToggleReview={handleToggleReview}
              />
            ) : (
              <div className="p-16 text-center text-rose-500 bg-white rounded-3xl border border-slate-200">
                ไม่พบข้อมูลผู้ป่วยรายนี้
              </div>
            )}
          </div>
        ) : (
          /* Normal Tab Views */
          <div>
            {activeTab === 'home' && (
              <HomePage
                patientCount={patients.length}
                onNavigate={(tab) => setActiveTab(tab)}
                onLoadMockData={handleLoadMockData}
                onResetData={handleResetData}
                onOpenNewPatientModal={() => setIsNewPatientModalOpen(true)}
              />
            )}

            {activeTab === 'dashboard' && (
              <Dashboard
                stats={stats}
                patients={patients}
                onNavigate={(tab) => setActiveTab(tab)}
                onOpenNewPatientModal={() => setIsNewPatientModalOpen(true)}
              />
            )}

            {activeTab === 'patients' && (
              <PatientDirectory
                patients={patients}
                loading={loadingPatients}
                onSelectPatient={handleSelectPatient}
                onOpenNewPatientModal={() => setIsNewPatientModalOpen(true)}
              />
            )}

            {activeTab === 'round-palli' && (
              <SpreadsheetView
                sheetType="round-palli"
                onSelectPatient={handleSelectPatient}
                onRefreshStats={loadStatsAndPatients}
              />
            )}

            {activeTab === 'ward-palli' && (
              <SpreadsheetView
                sheetType="ward-palli"
                onSelectPatient={handleSelectPatient}
                onRefreshStats={loadStatsAndPatients}
              />
            )}

            {activeTab === 'home-ward' && (
              <SpreadsheetView
                sheetType="home-ward"
                onSelectPatient={handleSelectPatient}
                onRefreshStats={loadStatsAndPatients}
              />
            )}

            {activeTab === 'dead' && (
              <SpreadsheetView
                sheetType="dead"
                onSelectPatient={handleSelectPatient}
                onRefreshStats={loadStatsAndPatients}
              />
            )}

            {activeTab === 'dc-refer' && (
              <SpreadsheetView
                sheetType="dc-refer"
                onSelectPatient={handleSelectPatient}
                onRefreshStats={loadStatsAndPatients}
              />
            )}

            {activeTab === 'bereavement' && (
              <BereavementRadar
                onOpenCallModal={(call) => setActiveBereavementCall(call)}
                onSelectPatient={handleSelectPatient}
              />
            )}

            {activeTab === 'about' && (
              <AboutPage />
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-4 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-2">
          <span>โรงพยาบาลนครพิงค์ • ศูนย์บริบาลประคับประคองขอนตาล & Home Ward PC</span>
          <span>ระบบบันทึกข้อมูล Palliative Care (โครงสร้างอิง Google Sheets & Pedigrow Concept)</span>
        </div>
      </footer>

      {/* ACTION MODALS */}
      <NewPatientModal
        isOpen={isNewPatientModalOpen}
        onClose={() => setIsNewPatientModalOpen(false)}
        onSubmit={async (data) => {
          let newId = `p_${Date.now()}`;
          try {
            const res = await createPatient(data);
            if (res.id) newId = res.id;
          } catch (e) {
            // local fallback
            const local = getLocalDataset();
            local.patients.unshift({ ...data, id: newId, created_at: new Date().toISOString(), updated_at: new Date().toISOString() });
            saveLocalDataset(local);
          }
          await loadStatsAndPatients();
          setSelectedPatientId(newId);
        }}
      />

      {patientDetail && (
        <>
          <AcpModal
            isOpen={isAcpModalOpen}
            onClose={() => setIsAcpModalOpen(false)}
            patientId={patientDetail.patient.id}
            initialAcp={patientDetail.acp}
            onSubmit={async (data) => {
              try {
                await saveACP(patientDetail.patient.id, data);
              } catch (e) {
                const local = getLocalDataset();
                const existingIndex = local.acps.findIndex(a => a.patient_id === patientDetail.patient.id);
                if (existingIndex >= 0) local.acps[existingIndex] = { ...data, patient_id: patientDetail.patient.id, id: local.acps[existingIndex].id, updated_at: new Date().toISOString() };
                else local.acps.push({ ...data, patient_id: patientDetail.patient.id, id: `acp_${Date.now()}`, updated_at: new Date().toISOString() });
                saveLocalDataset(local);
              }
              await loadPatientDetail(patientDetail.patient.id);
              await loadStatsAndPatients();
            }}
          />

          <FamilyMeetingModal
            isOpen={isFmModalOpen}
            onClose={() => setIsFmModalOpen(false)}
            onSubmit={async (data) => {
              try {
                await saveFamilyMeeting(patientDetail.patient.id, data);
              } catch (e) {
                const local = getLocalDataset();
                local.familyMeetings.unshift({ ...data, patient_id: patientDetail.patient.id, id: `fm_${Date.now()}`, created_at: new Date().toISOString() });
                saveLocalDataset(local);
              }
              await loadPatientDetail(patientDetail.patient.id);
              await loadStatsAndPatients();
            }}
          />

          <WardTransferModal
            isOpen={isTransferModalOpen}
            onClose={() => setIsTransferModalOpen(false)}
            patient={patientDetail.patient}
            onSubmit={async (data) => {
              try {
                await transferToWard(patientDetail.patient.id, data);
              } catch (e) {
                const local = getLocalDataset();
                local.wardRecords.unshift({ ...data, patient_id: patientDetail.patient.id, id: `wp_${Date.now()}`, status: 'admitted', updated_at: new Date().toISOString() });
                const p = local.patients.find(x => x.id === patientDetail.patient.id);
                if (p) {
                  p.current_ward = data.ward_type === 'Khon Tan' ? 'Ward Palliative ขอนตาล' : 'Home Ward PC';
                  p.current_bed = data.bed_number;
                  p.status = data.ward_type === 'Khon Tan' ? 'WARD_PALLIATIVE' : 'HOME_WARD_PC';
                }
                saveLocalDataset(local);
              }
              await loadPatientDetail(patientDetail.patient.id);
              await loadStatsAndPatients();
            }}
          />

          <DischargeModal
            isOpen={isDischargeModalOpen}
            onClose={() => setIsDischargeModalOpen(false)}
            patient={patientDetail.patient}
            onSubmit={async (data) => {
              try {
                await dischargePatient(patientDetail.patient.id, data);
              } catch (e) {
                const local = getLocalDataset();
                local.discharges.unshift({ ...data, patient_id: patientDetail.patient.id, id: `dc_${Date.now()}`, created_at: new Date().toISOString() });
                const p = local.patients.find(x => x.id === patientDetail.patient.id);
                if (p) {
                  p.status = data.discharge_type.includes('Dead') || data.discharge_type.includes('Death') ? 'DECEASED' : 'DISCHARGED';
                  p.discharge_date = data.discharge_date;
                }
                saveLocalDataset(local);
              }
              await loadPatientDetail(patientDetail.patient.id);
              await loadStatsAndPatients();
            }}
          />
        </>
      )}

      {activeBereavementCall && (
        <BereavementCallModal
          isOpen={!!activeBereavementCall}
          onClose={() => setActiveBereavementCall(null)}
          call={activeBereavementCall}
          onSubmit={async (callId, data) => {
            try {
              await logBereavementCall(callId, data);
            } catch (e) {
              const local = getLocalDataset();
              const b = local.bereavementCalls.find(x => x.id === callId);
              if (b) {
                Object.assign(b, data);
                saveLocalDataset(local);
              }
            }
            if (selectedPatientId) {
              await loadPatientDetail(selectedPatientId);
            }
            await loadStatsAndPatients();
          }}
        />
      )}
    </div>
  );
}

export default App;
