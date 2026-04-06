import React, { useState } from "react";
import { Examination, Patient } from "../types";
import { analyzeExamination } from "../services/geminiService";
import { motion } from "motion/react";
import { Sparkles, MapPin, FileText, Send, Loader2, CheckCircle2, Printer } from "lucide-react";

interface ResultsViewProps {
  patient: Patient;
  exam: Examination;
  onUpdateExam: (exam: Examination) => void;
  showNotification: (message: string, type?: "success" | "error" | "info") => void;
}

export default function ResultsView({ patient, exam, onUpdateExam, showNotification }: ResultsViewProps) {
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleAIAnalysis = async () => {
    setIsAnalyzing(true);
    const result = await analyzeExamination(patient, exam);
    onUpdateExam({
      ...exam,
      aiAnalysis: result,
    });
    setIsAnalyzing(false);
  };

  const handlePrint = () => {
    try {
      showNotification("Mempersiapkan dokumen untuk dicetak...", "info");
      window.focus();
      window.print();
      
      // Check if print was likely ignored (common in sandboxed iframes)
      // We can't detect it perfectly, but we can show a persistent hint
      if (window.self !== window.top) {
        showNotification("Jika dialog cetak tidak muncul, silakan klik 'Buka di tab baru' di pojok kanan atas.", "info");
      }
    } catch (e) {
      console.error("Print failed:", e);
      document.execCommand('print', false, undefined);
    }
  };

  const handleRujukanChange = (field: keyof NonNullable<Examination["rujukan"]>, value: string) => {
    onUpdateExam({
      ...exam,
      rujukan: { ...(exam.rujukan || { tujuan: "Puskesmas", instansi: "", alasan: "" }), [field]: value },
    });
  };

  return (
    <>
      {/* Print Only Report View */}
      <div className="print-only p-12 space-y-8 bg-white text-slate-900">
        <div className="flex justify-between items-start border-b-4 border-nature-brown pb-6">
          <div className="space-y-1">
            <h1 className="text-3xl font-black text-nature-brown uppercase tracking-tighter">Laporan Pemeriksaan Gigi</h1>
            <p className="text-slate-500 font-bold">Sistem Informasi Kesehatan Gigi & Mulut</p>
          </div>
          <div className="text-right">
            <p className="text-sm font-bold text-slate-400">No. Rekam Medis</p>
            <p className="text-2xl font-black text-slate-800">{patient.noRM}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-12">
          <div className="space-y-4">
            <h2 className="text-sm font-black text-nature-brown uppercase tracking-widest border-b border-slate-200 pb-2">Data Pasien</h2>
            <div className="grid grid-cols-[120px_1fr] gap-y-2 text-sm">
              <span className="text-slate-400 font-bold">Nama Lengkap</span>
              <span className="font-bold text-slate-800">: {patient.namaLengkap}</span>
              <span className="text-slate-400 font-bold">NIK</span>
              <span className="font-bold text-slate-800">: {patient.nik || "-"}</span>
              <span className="text-slate-400 font-bold">Tgl Lahir</span>
              <span className="font-bold text-slate-800">: {patient.tanggalLahir}</span>
              <span className="text-slate-400 font-bold">Jenis Kelamin</span>
              <span className="font-bold text-slate-800">: {patient.jenisKelamin === "L" ? "Laki-laki" : "Perempuan"}</span>
              <span className="text-slate-400 font-bold">Alamat</span>
              <span className="font-bold text-slate-800">: {patient.alamat}</span>
            </div>
          </div>
          <div className="space-y-4">
            <h2 className="text-sm font-black text-nature-brown uppercase tracking-widest border-b border-slate-200 pb-2">Detail Pemeriksaan</h2>
            <div className="grid grid-cols-[120px_1fr] gap-y-2 text-sm">
              <span className="text-slate-400 font-bold">Tanggal Periksa</span>
              <span className="font-bold text-slate-800">: {exam.tanggalPeriksa}</span>
              <span className="text-slate-400 font-bold">Status DMF-T</span>
              <span className="font-bold text-slate-800">: {exam.dmft?.total || 0} (D:{exam.dmft?.d || 0}, M:{exam.dmft?.m || 0}, F:{exam.dmft?.f || 0})</span>
              <span className="text-slate-400 font-bold">Indeks OHI-S</span>
              <span className="font-bold text-slate-800">: {exam.ohisScore || "0.00"}</span>
            </div>
          </div>
        </div>

        <div className="space-y-4 print-break-inside-avoid">
          <h2 className="text-sm font-black text-nature-brown uppercase tracking-widest border-b border-slate-200 pb-2">Ringkasan Diagnosis</h2>
          <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200 text-sm leading-relaxed italic">
            {exam.aiAnalysis?.diagnosis || "Tidak ada ringkasan diagnosis."}
          </div>
        </div>

        <div className="space-y-4 print-break-inside-avoid">
          <h2 className="text-sm font-black text-nature-brown uppercase tracking-widest border-b border-slate-200 pb-2">Analisis & Rekomendasi</h2>
          <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200 text-sm leading-relaxed">
            {exam.aiAnalysis?.rekomendasi || "Tidak ada rekomendasi."}
          </div>
        </div>

        {exam.rujukan && (
          <div className="space-y-4 print-break-inside-avoid">
            <h2 className="text-sm font-black text-nature-brown uppercase tracking-widest border-b border-slate-200 pb-2">Surat Rujukan</h2>
            <div className="p-6 border-2 border-nature-brown/20 rounded-2xl space-y-4">
              <div className="grid grid-cols-[120px_1fr] gap-y-2 text-sm">
                <span className="text-slate-400 font-bold">Tujuan</span>
                <span className="font-bold text-slate-800">: {exam.rujukan.tujuan} {exam.rujukan.instansi && `(${exam.rujukan.instansi})`}</span>
                <span className="text-slate-400 font-bold">Alasan</span>
                <span className="font-bold text-slate-800">: {exam.rujukan.alasan}</span>
              </div>
            </div>
          </div>
        )}

        <div className="pt-24 flex justify-end">
          <div className="text-center space-y-16">
            <p className="text-sm font-bold text-slate-400">Pemeriksa,</p>
            <div className="w-48 border-b border-slate-400 mx-auto"></div>
            <p className="text-sm font-bold text-slate-800">(..................................................)</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 no-print">
        {/* AI Analysis Section */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 space-y-6"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-4">
              <div className="bg-leaf-green/10 p-3 rounded-2xl text-leaf-green">
                <CheckCircle2 size={24} />
              </div>
              <h3 className="text-xl font-bold text-slate-800">Kesimpulan & Edukasi</h3>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 items-end sm:items-center">
              {window.self !== window.top && (
                <div className="bg-amber-50 border border-amber-200 px-3 py-1.5 rounded-xl flex items-center gap-2 animate-pulse">
                  <AlertCircle size={12} className="text-amber-600" />
                  <span className="text-[10px] text-amber-700 font-bold leading-tight">
                    Cetak terblokir di pratinjau. <br/> Gunakan "Buka di tab baru"
                  </span>
                </div>
              )}
              <div className="flex gap-2">
                <button
                  onClick={handlePrint}
                  className="flex items-center gap-2 bg-slate-100 text-slate-600 px-4 py-2.5 rounded-2xl font-bold hover:bg-slate-200 transition-all"
                >
                  <Printer size={20} />
                  Cetak
                </button>
                {!exam.aiAnalysis && (
                  <button
                    onClick={handleAIAnalysis}
                    disabled={isAnalyzing}
                    className="flex items-center gap-2 bg-gradient-to-r from-nature-brown to-primary text-white px-6 py-2.5 rounded-2xl font-bold hover:shadow-lg transition-all disabled:opacity-50"
                  >
                    {isAnalyzing ? <Loader2 className="animate-spin" size={20} /> : <Sparkles size={20} />}
                    Analisa AI
                  </button>
                )}
              </div>
            </div>
          </div>

        <div className="space-y-6">
          {/* Caries & OHI-S Summary */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-cloud-blue/20 rounded-2xl border border-secondary/10">
              <p className="text-[10px] font-bold text-nature-brown uppercase tracking-widest mb-1">Status Karies (DMF-T)</p>
              <p className="text-2xl font-bold text-slate-800">{exam.dmft?.total || 0}</p>
              <div className="flex gap-2 text-[10px] font-bold text-slate-500">
                <span>D:{exam.dmft?.d || 0}</span>
                <span>M:{exam.dmft?.m || 0}</span>
                <span>F:{exam.dmft?.f || 0}</span>
              </div>
            </div>
            <div className="p-4 bg-leaf-green/5 rounded-2xl border border-leaf-green/10">
              <p className="text-[10px] font-bold text-leaf-green uppercase tracking-widest mb-1">Indeks OHI-S</p>
              <p className="text-2xl font-bold text-slate-800">{exam.ohisScore || "0.00"}</p>
              <p className="text-[10px] font-bold text-slate-500">Kebersihan Mulut</p>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-600 ml-1">Ringkasan Diagnosis Medis</label>
            <div className="p-5 bg-slate-50 border border-slate-100 rounded-2xl text-slate-700 leading-relaxed min-h-[100px]">
              {exam.aiAnalysis?.diagnosis || "Klik tombol 'Analisa AI' untuk mendapatkan ringkasan diagnosis otomatis."}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-600 ml-1">Analisis Kasus & Rekomendasi Solusi</label>
            <div className="p-5 bg-cloud-blue/50 border border-secondary/20 rounded-2xl text-slate-700 leading-relaxed min-h-[150px] relative">
              {exam.aiAnalysis ? (
                <div className="flex gap-4">
                  <div className="bg-leaf-green text-white p-1 rounded-full h-fit mt-1">
                    <Sparkles size={14} />
                  </div>
                  <p>{exam.aiAnalysis.rekomendasi}</p>
                </div>
              ) : (
                <p className="text-slate-400 italic">Analisis AI akan muncul di sini...</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-600 ml-1">Rencana Perawatan (Manual Tambahan)</label>
            <textarea
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-nature-brown outline-none min-h-[100px]"
              placeholder="Catatan tambahan tindakan medis atau resep..."
            />
          </div>
        </div>
      </motion.div>

      {/* Referral Section */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-cloud-blue/30 p-8 rounded-3xl shadow-sm border border-secondary/20 space-y-6"
      >
        <div className="flex items-center gap-4 mb-2">
          <div className="bg-nature-brown p-3 rounded-2xl text-white">
            <MapPin size={24} />
          </div>
          <h3 className="text-xl font-bold text-slate-800">Formulir Rujukan</h3>
        </div>

        <div className="space-y-6">
          <div className="space-y-3">
            <label className="text-sm font-bold text-slate-600 ml-1">Tujuan Rujukan Utama</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {["Puskesmas", "RSUD", "RSGM", "Klinik Lain"].map((t) => (
                <button
                  key={t}
                  onClick={() => handleRujukanChange("tujuan", t)}
                  className={`py-2.5 px-2 rounded-xl text-xs font-bold transition-all border ${
                    exam.rujukan?.tujuan === t
                      ? "bg-nature-brown border-nature-brown text-white shadow-md shadow-nature-brown/20"
                      : "bg-white border-slate-200 text-slate-600 hover:border-nature-brown/30"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-600 ml-1">Nama Instansi Spesifik <span className="text-slate-400 font-normal">(Opsional)</span></label>
            <input
              type="text"
              value={exam.rujukan?.instansi || ""}
              onChange={(e) => handleRujukanChange("instansi", e.target.value)}
              className="w-full px-4 py-3 bg-white border border-slate-200 rounded-2xl focus:ring-2 focus:ring-nature-brown outline-none"
              placeholder="Misal: RSUD Hasan Sadikin..."
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-600 ml-1">Alasan Klinis Rujukan</label>
            <textarea
              value={exam.rujukan?.alasan || ""}
              onChange={(e) => handleRujukanChange("alasan", e.target.value)}
              className="w-full px-4 py-3 bg-white border border-slate-200 rounded-2xl focus:ring-2 focus:ring-nature-brown outline-none min-h-[150px]"
              placeholder="Mohon bantuan pencabutan gigi impaksi..."
            />
          </div>
        </div>
      </motion.div>
    </div>
  </>
);
}
