import React from "react";
import { Examination } from "../types";
import { motion } from "motion/react";
import { User, Heart, Activity, ClipboardList, Calendar } from "lucide-react";

interface ExaminationFormProps {
  exam: Partial<Examination>;
  onChange: (exam: Partial<Examination>) => void;
}

export default function ExaminationForm({ exam, onChange }: ExaminationFormProps) {
  const handleExtraChange = (field: keyof Examination["extraOral"], value: string) => {
    onChange({
      ...exam,
      extraOral: { ...exam.extraOral!, [field]: value },
    });
  };

  const handleIntraChange = (field: keyof Examination["intraOral"], value: string) => {
    onChange({
      ...exam,
      intraOral: { ...exam.intraOral!, [field]: value },
    });
  };

  const handleDateChange = (value: string) => {
    onChange({
      ...exam,
      tanggalPeriksa: value,
    });
  };

  return (
    <div className="space-y-8">
      {/* Date of Examination */}
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100"
      >
        <div className="flex items-center gap-4">
          <div className="bg-cloud-blue p-3 rounded-2xl text-nature-brown">
            <Calendar size={24} />
          </div>
          <div className="flex-1">
            <label className="text-sm font-bold text-slate-600 ml-1">Tanggal Pemeriksaan</label>
            <input
              type="date"
              value={exam.tanggalPeriksa || ""}
              onChange={(e) => handleDateChange(e.target.value)}
              className="w-full mt-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-nature-brown outline-none"
            />
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Extra Oral */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 space-y-6"
        >
          <div className="flex items-center gap-4 mb-2">
            <div className="bg-cloud-blue p-3 rounded-2xl text-nature-brown">
              <User size={24} />
            </div>
            <h3 className="text-xl font-bold text-slate-800">Pemeriksaan Ekstra Oral</h3>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-600">Bentuk Muka / Wajah</label>
              <select
                value={exam.extraOral?.wajah || "Normal / Simetris"}
                onChange={(e) => handleExtraChange("wajah", e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-nature-brown outline-none"
              >
                <option>Normal / Simetris</option>
                <option>Asimetris</option>
                <option>Pembengkakan</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-600">Kelenjar Limfe Submandibula</label>
              <select
                value={exam.extraOral?.limfe || "Normal / Tidak Teraba"}
                onChange={(e) => handleExtraChange("limfe", e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-nature-brown outline-none"
              >
                <option>Normal / Tidak Teraba</option>
                <option>Teraba Lunak</option>
                <option>Teraba Keras / Sakit</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-600">Bibir (Lips)</label>
              <select
                value={exam.extraOral?.bibir || "Normal"}
                onChange={(e) => handleExtraChange("bibir", e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-nature-brown outline-none"
              >
                <option>Normal</option>
                <option>Sumbing</option>
                <option>Luka / Sariawan</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-600">Kelainan Ekstra Oral Lainnya</label>
              <textarea
                value={exam.extraOral?.lainnya || ""}
                onChange={(e) => handleExtraChange("lainnya", e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-nature-brown outline-none min-h-[100px]"
                placeholder="Sebutkan jika ada..."
              />
            </div>
          </div>
        </motion.div>

        {/* Intra Oral */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 space-y-6"
        >
          <div className="flex items-center gap-4 mb-2">
            <div className="bg-leaf-green/10 p-3 rounded-2xl text-leaf-green">
              <Heart size={24} />
            </div>
            <h3 className="text-xl font-bold text-slate-800">Pemeriksaan Intra Oral</h3>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-600">Mukosa Pipi</label>
              <select
                value={exam.intraOral?.mukosa || "Normal"}
                onChange={(e) => handleIntraChange("mukosa", e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-nature-brown outline-none"
              >
                <option>Normal</option>
                <option>Luka / Sariawan</option>
                <option>Bercak Putih</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-600">Palatum</label>
              <select
                value={exam.intraOral?.palatum || "Normal"}
                onChange={(e) => handleIntraChange("palatum", e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-nature-brown outline-none"
              >
                <option>Normal</option>
                <option>Torus Palatinus</option>
                <option>Celah Palatum</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-600">Lidah</label>
              <select
                value={exam.intraOral?.lidah || "Normal"}
                onChange={(e) => handleIntraChange("lidah", e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-nature-brown outline-none"
              >
                <option>Normal</option>
                <option>Lidah Geografik</option>
                <option>Lidah Berbulu</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-600">Dasar Mulut</label>
              <select
                value={exam.intraOral?.dasarMulut || "Normal"}
                onChange={(e) => handleIntraChange("dasarMulut", e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-nature-brown outline-none"
              >
                <option>Normal</option>
                <option>Ranula</option>
                <option>Torus Mandibularis</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-600">Gingiva (Gusi)</label>
              <select
                value={exam.intraOral?.gingiva || "Normal"}
                onChange={(e) => handleIntraChange("gingiva", e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-nature-brown outline-none"
              >
                <option>Normal</option>
                <option>Gingivitis</option>
                <option>Periodontitis</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-600">Karang Gigi</label>
              <select
                value={exam.intraOral?.karangGigi || "Tidak Ada"}
                onChange={(e) => handleIntraChange("karangGigi", e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-nature-brown outline-none"
              >
                <option>Tidak Ada</option>
                <option>Ada (Ringan)</option>
                <option>Ada (Sedang)</option>
                <option>Ada (Berat)</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-600">Catatan Intra Oral Lainnya</label>
            <textarea
              value={exam.intraOral?.lainnya || ""}
              onChange={(e) => handleIntraChange("lainnya", e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-nature-brown outline-none min-h-[80px]"
              placeholder="Detail kelainan..."
            />
          </div>
        </motion.div>
      </div>
    </div>
  );
}
