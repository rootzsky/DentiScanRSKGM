import React, { useState } from "react";
import { Examination, Patient } from "../types";
import { analyzeExamination } from "../services/geminiService";
import { motion } from "motion/react";
import { Sparkles, MapPin, FileText, Send, Loader2, CheckCircle2 } from "lucide-react";

interface ResultsViewProps {
  patient: Patient;
  exam: Examination;
  onUpdateExam: (exam: Examination) => void;
}

export default function ResultsView({ patient, exam, onUpdateExam }: ResultsViewProps) {
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

  const handleRujukanChange = (field: keyof NonNullable<Examination["rujukan"]>, value: string) => {
    onUpdateExam({
      ...exam,
      rujukan: { ...(exam.rujukan || { tujuan: "Puskesmas", instansi: "", alasan: "" }), [field]: value },
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
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
  );
}
