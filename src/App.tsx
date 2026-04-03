import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  User, 
  Database, 
  ClipboardList, 
  Activity, 
  CheckCircle2, 
  LogOut, 
  Stethoscope,
  Plus,
  Save,
  RefreshCw,
  LayoutDashboard,
  Trees,
  ChevronRight,
  ArrowLeft
} from "lucide-react";
import Login from "./components/Login";
import Register from "./components/Register";
import PatientForm from "./components/PatientForm";
import Odontogram from "./components/Odontogram";
import ExaminationForm from "./components/ExaminationForm";
import ResultsView from "./components/ResultsView";
import PatientDatabase from "./components/PatientDatabase";
import { Patient, Examination } from "./types";
import { cn } from "./lib/utils";

type View = "LOGIN" | "REGISTER" | "DASHBOARD";
type Tab = "IDENTITAS" | "ODONTOGRAM" | "INTRA_EXTRA" | "HASIL" | "DATABASE";

const MOCK_PATIENTS: Patient[] = [
  {
    id: "1",
    noRM: "001",
    nik: "1234567890123456",
    namaLengkap: "Aaleyah Aufa Arsyad",
    tanggalLahir: "2018-05-12",
    jenisKelamin: "P",
    alamat: "Jl. Merdeka No. 10",
    pekerjaan: "Pelajar/Mahasiswa",
    pendidikan: "SD",
    penghasilan: "-",
    patientType: "UKGS",
    namaSekolah: "SDN 01 Bandung",
    kelas: "1A",
    pekerjaanOrtu: "PNS/TNI/Polri",
    pendidikanOrtu: "Sarjana (S1)",
    penghasilanOrtu: "Rp 5.000.000 - Rp 10.000.000",
    kecamatan: "Cicendo",
    kota: "Bandung",
  },
  {
    id: "2",
    noRM: "002",
    nik: "1234567890123457",
    namaLengkap: "Ali Naufal Arsyad",
    tanggalLahir: "2015-08-20",
    jenisKelamin: "L",
    alamat: "Jl. Merdeka No. 10",
    pekerjaan: "Pelajar/Mahasiswa",
    pendidikan: "SMP",
    penghasilan: "-",
    patientType: "UKGS",
    namaSekolah: "SMPN 02 Bandung",
    kelas: "7B",
    pekerjaanOrtu: "PNS/TNI/Polri",
    pendidikanOrtu: "Sarjana (S1)",
    penghasilanOrtu: "Rp 5.000.000 - Rp 10.000.000",
    kecamatan: "Cicendo",
    kota: "Bandung",
  },
  {
    id: "3",
    noRM: "003",
    nik: "1234567890123458",
    namaLengkap: "Julia Rahma Wati",
    tanggalLahir: "2012-02-14",
    jenisKelamin: "P",
    alamat: "Jl. Dago No. 45",
    pekerjaan: "Pelajar/Mahasiswa",
    pendidikan: "SMA/SMK",
    penghasilan: "-",
    patientType: "UKGS",
    namaSekolah: "SMAN 03 Bandung",
    kelas: "10C",
    pekerjaanOrtu: "Wiraswasta",
    pendidikanOrtu: "Diploma (D1-D4)",
    penghasilanOrtu: "Rp 3.000.000 - Rp 5.000.000",
    kecamatan: "Coblong",
    kota: "Bandung",
  },
  {
    id: "4",
    noRM: "004",
    nik: "1234567890123459",
    namaLengkap: "Budi Santoso",
    tanggalLahir: "1985-03-10",
    jenisKelamin: "L",
    alamat: "Jl. Antapani No. 22",
    pekerjaan: "Tidak Bekerja",
    pendidikan: "SMA/SMK",
    penghasilan: "< Rp 1.000.000",
    patientType: "UMUM",
    kecamatan: "Antapani",
    kota: "Bandung",
  },
  {
    id: "5",
    noRM: "005",
    nik: "1234567890123460",
    namaLengkap: "Siti Aminah",
    tanggalLahir: "1990-11-25",
    jenisKelamin: "P",
    alamat: "Jl. Kopo No. 15",
    pekerjaan: "Tidak Bekerja",
    pendidikan: "SMP",
    penghasilan: "< Rp 1.000.000",
    patientType: "UMUM",
    kecamatan: "Bojongloa Kaler",
    kota: "Bandung",
  }
];

export default function App() {
  const [view, setView] = useState<View>("LOGIN");
  const [activeTab, setActiveTab] = useState<Tab>("IDENTITAS");
  const [user, setUser] = useState<string | null>(null);
  
  const [patients, setPatients] = useState<Patient[]>(MOCK_PATIENTS);
  const [exams, setExams] = useState<Examination[]>([]);
  
  const getNextNoRM = (patientList: Patient[]) => {
    const lastNoRM = patientList.reduce((max, p) => {
      const num = parseInt(p.noRM);
      return isNaN(num) ? max : Math.max(max, num);
    }, 0);
    return (lastNoRM + 1).toString().padStart(3, "0");
  };

  const [currentPatient, setCurrentPatient] = useState<Partial<Patient>>({
    patientType: "UMUM",
    jenisKelamin: "L",
    noRM: getNextNoRM(MOCK_PATIENTS),
  });
  
  const [currentExam, setCurrentExam] = useState<Partial<Examination>>({
    tanggalPeriksa: new Date().toISOString().split("T")[0],
    odontogram: {},
    ohis: { di: {}, ci: {} },
    extraOral: { wajah: "Normal / Simetris", limfe: "Normal / Tidak Teraba", bibir: "Normal", lainnya: "" },
    intraOral: { mukosa: "Normal", palatum: "Normal", lidah: "Normal", dasarMulut: "Normal", gingiva: "Normal", karangGigi: "Tidak Ada", gigiBerjejal: "Tidak Ada", lainnya: "" },
  });

  const handleLogin = (username: string) => {
    setUser(username);
    setView("DASHBOARD");
  };

  const handleLogout = () => {
    setUser(null);
    setView("LOGIN");
  };

  const handleSaveToDatabase = () => {
    if (!currentPatient.namaLengkap) {
      alert("Nama lengkap pasien harus diisi!");
      return;
    }

    const newPatient: Patient = {
      ...currentPatient as Patient,
      id: currentPatient.id || Math.random().toString(36).substr(2, 9),
    };

    const newExam: Examination = {
      ...currentExam as Examination,
      id: Math.random().toString(36).substr(2, 9),
      patientId: newPatient.id,
      tanggalPeriksa: currentExam.tanggalPeriksa || new Date().toISOString().split("T")[0],
    };

    setPatients(prev => {
      const exists = prev.find(p => p.id === newPatient.id);
      if (exists) return prev.map(p => p.id === newPatient.id ? newPatient : p);
      return [...prev, newPatient];
    });
    
    setExams(prev => [...prev, newExam]);
    
    alert("Data berhasil disimpan ke database!");
    setActiveTab("DATABASE");
  };

  const handleNewPatient = () => {
    setCurrentPatient({ 
      patientType: "UMUM", 
      jenisKelamin: "L",
      noRM: getNextNoRM(patients)
    });
    setCurrentExam({
      odontogram: {},
      ohis: { di: {}, ci: {} },
      extraOral: { wajah: "Normal / Simetris", limfe: "Normal / Tidak Teraba", bibir: "Normal", lainnya: "" },
      intraOral: { mukosa: "Normal", palatum: "Normal", lidah: "Normal", dasarMulut: "Normal", gingiva: "Normal", karangGigi: "Tidak Ada", gigiBerjejal: "Tidak Ada", lainnya: "" },
    });
    setActiveTab("IDENTITAS");
  };

  const handleEditPatient = (patient: Patient) => {
    setCurrentPatient(patient);
    const patientExam = exams.find(e => e.patientId === patient.id);
    if (patientExam) {
      setCurrentExam(patientExam);
    } else {
      setCurrentExam({
        odontogram: {},
        ohis: { di: {}, ci: {} },
        extraOral: { wajah: "Normal / Simetris", limfe: "Normal / Tidak Teraba", bibir: "Normal", lainnya: "" },
        intraOral: { mukosa: "Normal", palatum: "Normal", lidah: "Normal", dasarMulut: "Normal", gingiva: "Normal", karangGigi: "Tidak Ada", gigiBerjejal: "Tidak Ada", lainnya: "" },
      });
    }
    setActiveTab("IDENTITAS");
  };

  const handleDeletePatient = (id: string) => {
    if (confirm("Apakah Anda yakin ingin menghapus data pasien ini?")) {
      setPatients(prev => prev.filter(p => p.id !== id));
      setExams(prev => prev.filter(e => e.patientId !== id));
    }
  };

  const handleNextTab = () => {
    const tabs: Tab[] = ["IDENTITAS", "ODONTOGRAM", "INTRA_EXTRA", "HASIL"];
    const currentIndex = tabs.indexOf(activeTab);
    if (currentIndex < tabs.length - 1) {
      setActiveTab(tabs[currentIndex + 1]);
    }
  };

  const handlePrevTab = () => {
    const tabs: Tab[] = ["IDENTITAS", "ODONTOGRAM", "INTRA_EXTRA", "HASIL"];
    const currentIndex = tabs.indexOf(activeTab);
    if (currentIndex > 0) {
      setActiveTab(tabs[currentIndex - 1]);
    }
  };

  if (view === "LOGIN") return <Login onLogin={handleLogin} onNavigateToRegister={() => setView("REGISTER")} />;
  if (view === "REGISTER") return <Register onRegister={() => setView("LOGIN")} onNavigateToLogin={() => setView("LOGIN")} />;

  return (
    <div className="min-h-screen bg-cloud-blue/30 flex flex-col font-sans text-slate-900">
      {/* Header */}
      <header className="bg-nature-brown text-white px-8 py-4 flex items-center justify-between sticky top-0 z-40 shadow-xl border-b border-white/10 no-print">
        <div className="flex items-center gap-4">
          <div className="bg-leaf-green p-2.5 rounded-2xl shadow-lg shadow-leaf-green/20">
            <Trees size={28} className="text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">DentiScan RSKGM</h1>
            <p className="text-[10px] font-bold text-secondary uppercase tracking-widest">Sistem Pemeriksaan Gigi Digital</p>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="hidden md:flex items-center gap-3 bg-white/5 px-4 py-2 rounded-2xl border border-white/10">
            <div className="bg-emerald-500 w-2 h-2 rounded-full animate-pulse" />
            <span className="text-xs font-bold text-slate-300">Terhubung ke Cloud Database</span>
          </div>
          
          <div className="flex items-center gap-4 border-l border-white/10 pl-6">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-bold">{user}</p>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Administrator</p>
            </div>
            <div className="bg-gradient-to-br from-nature-brown to-primary w-10 h-10 rounded-xl flex items-center justify-center font-bold text-lg shadow-lg">
              {user?.charAt(0).toUpperCase()}
            </div>
            <button 
              onClick={handleLogout}
              className="p-2 hover:bg-white/10 rounded-xl transition-colors text-slate-400 hover:text-white"
              title="Logout"
            >
              <LogOut size={20} />
            </button>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="bg-white border-b border-slate-200 px-8 py-4 sticky top-[76px] z-30 shadow-sm no-print">
        <div className="max-w-7xl mx-auto flex flex-wrap gap-2">
          {[
            { id: "IDENTITAS", label: "Identitas Pasien", icon: User },
            { id: "ODONTOGRAM", label: "Odontogram", icon: Stethoscope },
            { id: "INTRA_EXTRA", label: "Pemeriksaan", icon: Activity },
            { id: "HASIL", label: "Hasil & Rujukan", icon: ClipboardList },
            { id: "DATABASE", label: "Database Pasien", icon: Database },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as Tab)}
              className={cn(
                "flex items-center gap-2.5 px-6 py-3 rounded-2xl font-bold text-sm transition-all relative overflow-hidden group",
                activeTab === tab.id 
                  ? "bg-nature-brown text-white shadow-lg shadow-nature-brown/20" 
                  : "bg-slate-50 text-slate-500 hover:bg-slate-100 hover:text-slate-700"
              )}
            >
              <tab.icon size={18} className={activeTab === tab.id ? "text-white" : "text-slate-400 group-hover:text-slate-600"} />
              {tab.label}
            </button>
          ))}
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-7xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {activeTab === "IDENTITAS" && (
                <PatientForm patient={currentPatient} onChange={setCurrentPatient} />
              )}
              {activeTab === "ODONTOGRAM" && (
                <Odontogram exam={currentExam} onChange={setCurrentExam} />
              )}
              {activeTab === "INTRA_EXTRA" && (
                <ExaminationForm exam={currentExam} onChange={setCurrentExam} />
              )}
              {activeTab === "HASIL" && (
                <ResultsView 
                  patient={currentPatient as Patient} 
                  exam={currentExam as Examination} 
                  onUpdateExam={setCurrentExam} 
                />
              )}
              {activeTab === "DATABASE" && (
                <PatientDatabase 
                  patients={patients} 
                  exams={exams} 
                  onDelete={handleDeletePatient}
                  onEdit={handleEditPatient}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      {/* Footer Actions */}
      {activeTab !== "DATABASE" && (
        <footer className="bg-white border-t border-slate-200 p-6 sticky bottom-0 z-20 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] no-print">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-4">
              {activeTab !== "IDENTITAS" && (
                <button 
                  onClick={handlePrevTab}
                  className="flex items-center gap-2 px-6 py-3 bg-slate-100 text-slate-600 rounded-2xl font-bold hover:bg-slate-200 transition-all"
                >
                  <ArrowLeft size={20} />
                  Kembali
                </button>
              )}
              <button 
                onClick={handleNewPatient}
                className="flex items-center gap-2 px-6 py-3 bg-cloud-blue text-nature-brown rounded-2xl font-bold hover:bg-cloud-blue/80 transition-all"
              >
                <Plus size={20} />
                Pasien Baru
              </button>
            </div>
            
            <div className="flex items-center gap-4">
              {activeTab !== "HASIL" ? (
                <button 
                  onClick={handleNextTab}
                  className="flex items-center gap-2 px-8 py-3 bg-nature-brown text-white rounded-2xl font-bold hover:bg-nature-brown/90 transition-all shadow-lg shadow-nature-brown/20"
                >
                  Lanjut
                  <ChevronRight size={20} />
                </button>
              ) : (
                <button 
                  onClick={handleSaveToDatabase}
                  className="flex items-center gap-2 px-8 py-3 bg-leaf-green text-white rounded-2xl font-bold hover:bg-leaf-green/90 transition-all shadow-lg shadow-leaf-green/20"
                >
                  <Save size={20} />
                  Simpan ke Database
                </button>
              )}
            </div>
          </div>
        </footer>
      )}
    </div>
  );
}
