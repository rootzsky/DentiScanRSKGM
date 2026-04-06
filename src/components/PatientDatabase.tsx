import React, { useState, useMemo } from "react";
import { Patient, Examination } from "../types";
import { analyzeDatabase } from "../services/geminiService";
import { motion, AnimatePresence } from "motion/react";
import { Search, Filter, RefreshCw, Download, PieChart, Users, MapPin, Calendar, Sparkles, Loader2, ChevronDown, Trash2, Edit3, Activity, Printer } from "lucide-react";
import { PieChart as RePieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";

interface PatientDatabaseProps {
  patients: Patient[];
  exams: Examination[];
  onDelete: (id: string) => void;
  onEdit: (patient: Patient) => void;
  user: string | null;
  showNotification: (message: string, type?: "success" | "error" | "info") => void;
}

export default function PatientDatabase({ patients, exams, onDelete, onEdit, user, showNotification }: PatientDatabaseProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterJK, setFilterJK] = useState<string>("");
  const [filterAgeRange, setFilterAgeRange] = useState<string>("");
  const [filterKota, setFilterKota] = useState<string>("");
  const [filterPekerjaan, setFilterPekerjaan] = useState<string>("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiSummary, setAiSummary] = useState<{ summary: string; recommendations: string } | null>(null);
  const [showStats, setShowStats] = useState(true);

  const filteredPatients = useMemo(() => {
    return patients.filter((p) => {
      const age = new Date().getFullYear() - new Date(p.tanggalLahir).getFullYear();
      const matchesSearch = p.namaLengkap.toLowerCase().includes(searchTerm.toLowerCase()) || p.noRM.includes(searchTerm);
      const matchesJK = filterJK ? p.jenisKelamin === filterJK : true;
      const matchesKota = filterKota ? p.kota.toLowerCase().includes(filterKota.toLowerCase()) : true;
      const matchesPekerjaan = filterPekerjaan ? p.pekerjaan === filterPekerjaan : true;
      
      let matchesAge = true;
      if (filterAgeRange === "anak") matchesAge = age <= 12;
      else if (filterAgeRange === "remaja") matchesAge = age > 12 && age <= 18;
      else if (filterAgeRange === "dewasa") matchesAge = age > 18 && age <= 60;
      else if (filterAgeRange === "lansia") matchesAge = age > 60;

      return matchesSearch && matchesJK && matchesKota && matchesAge && matchesPekerjaan;
    });
  }, [patients, searchTerm, filterJK, filterAgeRange, filterKota, filterPekerjaan]);

  const statsData = useMemo(() => {
    const total = filteredPatients.length;
    if (total === 0) return [];
    
    const jkCounts = filteredPatients.reduce((acc, p) => {
      acc[p.jenisKelamin] = (acc[p.jenisKelamin] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return [
      { name: "Laki-laki", value: jkCounts["L"] || 0, color: "#5D4037" },
      { name: "Perempuan", value: jkCounts["P"] || 0, color: "#2E7D32" },
    ];
  }, [filteredPatients]);

  const handleAIAnalysis = async (specificFilter?: string) => {
    setIsAnalyzing(true);
    const filterToUse = specificFilter || filterPekerjaan;
    const filterDesc = `JK: ${filterJK || "Semua"}, Umur: ${filterAgeRange || "Semua"}, Kota: ${filterKota || "Semua"}, Pekerjaan: ${filterToUse || "Semua"}`;
    
    let targetPatients = filteredPatients;
    if (specificFilter) {
      targetPatients = patients.filter(p => p.pekerjaan === specificFilter);
    }

    const result = await analyzeDatabase(targetPatients, exams, filterDesc);
    setAiSummary(result);
    setIsAnalyzing(false);
  };

  const handleExportCSV = () => {
    const headers = ["No. RM", "Nama Lengkap", "NIK", "Jenis Kelamin", "Tanggal Lahir", "Alamat", "Kecamatan", "Kota", "Pekerjaan", "Pendidikan", "Penghasilan"];
    const csvRows = [
      headers.join(","),
      ...filteredPatients.map(p => [
        p.noRM,
        `"${p.namaLengkap}"`,
        p.nik || "-",
        p.jenisKelamin,
        p.tanggalLahir,
        `"${p.alamat || "-"}"`,
        p.kecamatan || "-",
        p.kota || "-",
        p.pekerjaan || "-",
        p.pendidikan || "-",
        p.penghasilan || "-"
      ].join(","))
    ];

    const csvString = csvRows.join("\n");
    const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `database_pasien_${new Date().toISOString().split("T")[0]}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    try {
      showNotification("Mempersiapkan database untuk dicetak...", "info");
      window.focus();
      window.print();
      
      if (window.self !== window.top) {
        showNotification("Jika dialog cetak tidak muncul, silakan klik 'Buka di tab baru' di pojok kanan atas.", "info");
      }
    } catch (e) {
      console.error("Print failed:", e);
      document.execCommand('print', false, undefined);
    }
  };

  return (
    <div className="space-y-8">
      <style dangerouslySetInnerHTML={{ __html: `
        @media print {
          .no-print { display: none !important; }
          .print-only { display: block !important; }
          body { background: white !important; padding: 0 !important; margin: 0 !important; }
          .bg-white { border: none !important; box-shadow: none !important; }
          table { width: 100% !important; border-collapse: collapse !important; margin-top: 20px; }
          th, td { border: 1px solid #cbd5e1 !important; padding: 10px !important; text-align: left !important; font-size: 10px !important; }
          th { background-color: #f8fafc !important; color: #1e293b !important; font-weight: bold !important; }
          main { overflow: visible !important; height: auto !important; padding: 0 !important; }
          .min-h-screen { min-height: auto !important; }
          .overflow-hidden, .overflow-x-auto { overflow: visible !important; }
          * { transform: none !important; animation: none !important; transition: none !important; }
          .print-header { border-bottom: 4px solid #3E2723 !important; padding-bottom: 20px !important; margin-bottom: 30px !important; }
        }
      `}} />
      
      <div className="hidden print-only">
        <div className="print-header text-center">
          <h1 className="text-3xl font-black text-nature-brown uppercase tracking-tighter">Database Rekam Medis Pasien</h1>
          <p className="text-slate-500 font-bold">Sistem Informasi DentiScan RSKGM</p>
          <div className="flex justify-between mt-6 text-xs font-bold text-slate-400">
            <span>Dicetak oleh: {user || "Administrator"}</span>
            <span>Tanggal Cetak: {new Date().toLocaleString('id-ID')}</span>
          </div>
        </div>

        <table className="w-full">
          <thead>
            <tr>
              <th>No. RM</th>
              <th>Nama Lengkap</th>
              <th>NIK</th>
              <th>Gender</th>
              <th>Tgl Lahir</th>
              <th>Alamat</th>
              <th>Pekerjaan</th>
              <th>DMF-T</th>
              <th>OHI-S</th>
            </tr>
          </thead>
          <tbody>
            {filteredPatients.map(p => {
              const latestExam = exams.filter(e => e.patientId === p.id).sort((a, b) => 
                new Date(b.tanggalPeriksa).getTime() - new Date(a.tanggalPeriksa).getTime()
              )[0];
              return (
                <tr key={p.id}>
                  <td className="font-bold">{p.noRM}</td>
                  <td>{p.namaLengkap}</td>
                  <td>{p.nik || "-"}</td>
                  <td>{p.jenisKelamin}</td>
                  <td>{p.tanggalLahir}</td>
                  <td>{p.alamat}</td>
                  <td>{p.pekerjaan}</td>
                  <td className="text-center font-bold">{latestExam?.dmft?.total || "-"}</td>
                  <td className="text-center font-bold">{latestExam?.ohisScore || "-"}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
        
        <div className="mt-12 flex justify-end">
          <div className="text-center space-y-12">
            <p className="text-xs font-bold text-slate-400">Petugas Rekam Medis,</p>
            <div className="w-40 border-b border-slate-300 mx-auto"></div>
            <p className="text-xs font-bold text-slate-800">(..................................................)</p>
          </div>
        </div>
      </div>
      
      {/* Header & Filters */}
      <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 space-y-6 no-print">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">Database Rekam Medis</h2>
            <p className="text-sm text-slate-500 font-medium flex items-center gap-1.5">
              <Users size={14} /> Tersimpan di Cloud Database
            </p>
          </div>
          <div className="flex items-center gap-3">
            {window.self !== window.top && (
              <div className="bg-amber-50 border border-amber-200 px-3 py-1.5 rounded-xl flex items-center gap-2 animate-pulse">
                <AlertCircle size={12} className="text-amber-600" />
                <span className="text-[10px] text-amber-700 font-bold leading-tight">
                  Cetak terblokir di pratinjau. <br/> Gunakan "Buka di tab baru"
                </span>
              </div>
            )}
            <button 
              onClick={() => setShowStats(!showStats)}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-2xl font-bold transition-all ${
                showStats ? "bg-nature-brown text-white shadow-lg shadow-nature-brown/20" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              <PieChart size={20} />
              {showStats ? "Sembunyikan Statistik" : "Tampilkan Statistik"}
            </button>
            <button 
              onClick={handlePrint}
              className="flex items-center gap-2 bg-slate-100 text-slate-600 px-6 py-2.5 rounded-2xl font-bold hover:bg-slate-200 transition-all border border-slate-200"
            >
              <Printer size={20} />
              Cetak
            </button>
            <button 
              onClick={handleExportCSV}
              className="flex items-center gap-2 bg-leaf-green text-white px-6 py-2.5 rounded-2xl font-bold hover:bg-leaf-green/90 transition-all shadow-md shadow-leaf-green/20"
            >
              <Download size={20} />
              Export CSV
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input
              type="text"
              placeholder="Cari Nama / No. RM..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-nature-brown outline-none"
            />
          </div>
          <select
            value={filterJK}
            onChange={(e) => setFilterJK(e.target.value)}
            className="px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-nature-brown outline-none font-medium text-slate-600"
          >
            <option value="">Semua Jenis Kelamin</option>
            <option value="L">Laki-laki</option>
            <option value="P">Perempuan</option>
          </select>
          <select
            value={filterAgeRange}
            onChange={(e) => setFilterAgeRange(e.target.value)}
            className="px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-nature-brown outline-none font-medium text-slate-600"
          >
            <option value="">Semua Range Umur</option>
            <option value="anak">Anak (0-12)</option>
            <option value="remaja">Remaja (13-18)</option>
            <option value="dewasa">Dewasa (19-60)</option>
            <option value="lansia">Lansia (60+)</option>
          </select>
          <input
            type="text"
            placeholder="Kecamatan / Kota..."
            value={filterKota}
            onChange={(e) => setFilterKota(e.target.value)}
            className="px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-nature-brown outline-none font-medium text-slate-600"
          />
          <select
            value={filterPekerjaan}
            onChange={(e) => setFilterPekerjaan(e.target.value)}
            className="px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-nature-brown outline-none font-medium text-slate-600"
          >
            <option value="">Semua Pekerjaan</option>
            <option value="Tidak Bekerja">Tidak Bekerja</option>
            <option value="Ibu Rumah Tangga">Ibu Rumah Tangga</option>
            <option value="Pelajar/Mahasiswa">Pelajar/Mahasiswa</option>
            <option value="Karyawan Swasta">Karyawan Swasta</option>
            <option value="PNS/TNI/Polri">PNS/TNI/Polri</option>
          </select>
        </div>
      </div>

      {/* Statistics & AI Analysis */}
      <AnimatePresence>
        {showStats && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden no-print"
          >
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
              <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 flex flex-col items-center">
                <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
                  <Users size={20} className="text-nature-brown" /> Distribusi Pasien
                </h3>
                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%" debounce={50}>
                    <RePieChart>
                      <Pie
                        data={statsData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {statsData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </RePieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="lg:col-span-2 bg-gradient-to-br from-nature-brown to-primary p-8 rounded-3xl shadow-xl text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-10">
                  <Sparkles size={120} />
                </div>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold flex items-center gap-3">
                    <div className="bg-leaf-green p-2 rounded-xl">
                      <Sparkles size={20} />
                    </div>
                    Analisa AI Populasi
                  </h3>
                  <div className="flex flex-wrap gap-3">
                    <button
                      onClick={() => handleAIAnalysis()}
                      disabled={isAnalyzing || filteredPatients.length === 0}
                      className="bg-white/10 hover:bg-white/20 px-6 py-2.5 rounded-2xl font-bold transition-all flex items-center gap-2 border border-white/20 disabled:opacity-50"
                    >
                      {isAnalyzing ? <Loader2 className="animate-spin" size={20} /> : <RefreshCw size={20} />}
                      Analisa Filter
                    </button>
                    <button
                      onClick={() => {
                        setFilterPekerjaan("Tidak Bekerja");
                        handleAIAnalysis("Tidak Bekerja");
                      }}
                      disabled={isAnalyzing || patients.filter(p => p.pekerjaan === "Tidak Bekerja").length === 0}
                      className="bg-rose-500/20 hover:bg-rose-500/30 px-6 py-2.5 rounded-2xl font-bold transition-all flex items-center gap-2 border border-rose-500/30 disabled:opacity-50"
                    >
                      <Users size={20} />
                      Analisa Tidak Bekerja
                    </button>
                  </div>
                </div>

                <div className="space-y-6">
                  {aiSummary ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <p className="text-secondary text-xs font-bold uppercase tracking-widest">Ringkasan Epidemiologi</p>
                        <p className="text-slate-100 text-sm leading-relaxed">{aiSummary.summary}</p>
                      </div>
                      <div className="space-y-2">
                        <p className="text-accent text-xs font-bold uppercase tracking-widest">Rekomendasi Kebijakan</p>
                        <p className="text-slate-100 text-sm leading-relaxed">{aiSummary.recommendations}</p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-12 text-slate-100/50 space-y-4">
                      <div className="bg-white/5 p-4 rounded-full">
                        <Activity size={48} className="opacity-20" />
                      </div>
                      <p className="text-center max-w-md">Klik tombol 'Mulai Analisa' untuk mendapatkan wawasan kesehatan masyarakat berdasarkan filter yang Anda pilih.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Patient Table */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="px-8 py-5 text-xs font-bold text-slate-500 uppercase tracking-widest">No. RM</th>
                <th className="px-8 py-5 text-xs font-bold text-slate-500 uppercase tracking-widest">Nama Lengkap</th>
                <th className="px-8 py-5 text-xs font-bold text-slate-500 uppercase tracking-widest">L/P</th>
                <th className="px-8 py-5 text-xs font-bold text-slate-500 uppercase tracking-widest">Umur</th>
                <th className="px-8 py-5 text-xs font-bold text-slate-500 uppercase tracking-widest">Lokasi</th>
                <th className="px-8 py-5 text-xs font-bold text-slate-500 uppercase tracking-widest">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredPatients.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-8 py-5 font-bold text-slate-600">{p.noRM}</td>
                  <td className="px-8 py-5">
                    <div className="font-bold text-slate-800">{p.namaLengkap}</div>
                    <div className="text-xs text-slate-400 font-medium">{p.patientType}</div>
                  </td>
                  <td className="px-8 py-5">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      p.jenisKelamin === "L" ? "bg-nature-brown/10 text-nature-brown" : "bg-leaf-green/10 text-leaf-green"
                    }`}>
                      {p.jenisKelamin}
                    </span>
                  </td>
                  <td className="px-8 py-5 text-slate-600 font-medium">
                    {new Date().getFullYear() - new Date(p.tanggalLahir).getFullYear()} thn
                  </td>
                  <td className="px-8 py-5">
                    <div className="text-sm font-bold text-slate-700">{p.kecamatan}</div>
                    <div className="text-xs text-slate-400">{p.kota}</div>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity no-print">
                      <button 
                        onClick={() => onEdit(p)}
                        className="p-2 bg-nature-brown/10 text-nature-brown rounded-xl hover:bg-nature-brown/20 transition-colors"
                      >
                        <Edit3 size={18} />
                      </button>
                      <button 
                        onClick={() => onDelete(p.id)}
                        className="p-2 bg-rose-50 text-rose-600 rounded-xl hover:bg-rose-100 transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredPatients.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-8 py-20 text-center text-slate-400 italic">
                    Tidak ada data pasien yang ditemukan.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
