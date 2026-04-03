import React, { useState } from "react";
import { Patient, PatientType } from "../types";
import { User, FileText, MapPin, Briefcase, GraduationCap, DollarSign, School, Users, ChevronDown } from "lucide-react";
import { motion } from "motion/react";
import { INCOME_RANGES, EDUCATION_OPTIONS, JOB_OPTIONS } from "../constants";

interface PatientFormProps {
  patient: Partial<Patient>;
  onChange: (patient: Partial<Patient>) => void;
}

export default function PatientForm({ patient, onChange }: PatientFormProps) {
  const handleChange = (field: keyof Patient, value: string) => {
    onChange({ ...patient, [field]: value });
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      <div className="flex items-center justify-between bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
        <div className="flex items-center gap-4">
          <div className="bg-cloud-blue p-3 rounded-2xl text-nature-brown">
            <User size={24} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-800">Formulir Identitas Pasien</h2>
            <p className="text-sm text-slate-500 font-medium">Lengkapi data diri pasien dengan benar</p>
          </div>
        </div>
        
        <div className="relative">
          <select
            value={patient.patientType || "UMUM"}
            onChange={(e) => handleChange("patientType", e.target.value as PatientType)}
            className="appearance-none bg-cloud-blue text-nature-brown font-bold px-6 py-3 pr-12 rounded-2xl border border-secondary/20 focus:outline-none focus:ring-2 focus:ring-nature-brown transition-all cursor-pointer"
          >
            <option value="UMUM">🏥 Pasien Umum / Klinik</option>
            <option value="UKGS">🏫 Siswa Sekolah (UKGS)</option>
          </select>
          <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-nature-brown pointer-events-none" size={20} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Column */}
        <div className="space-y-6 bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-600 ml-1">No. Rekam Medis</label>
              <input
                type="text"
                value={patient.noRM || ""}
                onChange={(e) => handleChange("noRM", e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-nature-brown outline-none"
                placeholder="001"
                readOnly
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-600 ml-1">NIK <span className="text-slate-400 font-normal">(Opsional)</span></label>
              <input
                type="text"
                value={patient.nik || ""}
                onChange={(e) => handleChange("nik", e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-nature-brown outline-none"
                placeholder="16 Digit NIK"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-600 ml-1">Nama Lengkap Pasien <span className="text-rose-500">*</span></label>
            <input
              type="text"
              value={patient.namaLengkap || ""}
              onChange={(e) => handleChange("namaLengkap", e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-nature-brown outline-none"
              placeholder="Masukkan nama lengkap..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-600 ml-1">Tanggal Lahir</label>
              <input
                type="date"
                value={patient.tanggalLahir || ""}
                onChange={(e) => handleChange("tanggalLahir", e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-nature-brown outline-none"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-600 ml-1">Jenis Kelamin</label>
              <select
                value={patient.jenisKelamin || "L"}
                onChange={(e) => handleChange("jenisKelamin", e.target.value as "L" | "P")}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-nature-brown outline-none"
              >
                <option value="L">Laki-laki</option>
                <option value="P">Perempuan</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-600 ml-1">Kecamatan</label>
              <input
                type="text"
                value={patient.kecamatan || ""}
                onChange={(e) => handleChange("kecamatan", e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-nature-brown outline-none"
                placeholder="Kecamatan"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-600 ml-1">Kota/Kabupaten</label>
              <input
                type="text"
                value={patient.kota || ""}
                onChange={(e) => handleChange("kota", e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-nature-brown outline-none"
                placeholder="Kota"
              />
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6 bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-600 ml-1">Alamat Lengkap</label>
            <textarea
              value={patient.alamat || ""}
              onChange={(e) => handleChange("alamat", e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-nature-brown outline-none min-h-[100px]"
              placeholder="Domisili saat ini..."
            />
          </div>

          {patient.patientType === "UMUM" ? (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-600 ml-1">Pekerjaan</label>
                  <select
                    value={patient.pekerjaan || ""}
                    onChange={(e) => handleChange("pekerjaan", e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-nature-brown outline-none"
                  >
                    <option value="">Pilih Pekerjaan</option>
                    {JOB_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-600 ml-1">Pendidikan</label>
                  <select
                    value={patient.pendidikan || ""}
                    onChange={(e) => handleChange("pendidikan", e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-nature-brown outline-none"
                  >
                    <option value="">Pilih Pendidikan</option>
                    {EDUCATION_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                  </select>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-600 ml-1">Range Penghasilan</label>
                <select
                  value={patient.penghasilan || ""}
                  onChange={(e) => handleChange("penghasilan", e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-nature-brown outline-none"
                >
                  <option value="">Pilih Range Penghasilan</option>
                  {INCOME_RANGES.map(range => <option key={range} value={range}>{range}</option>)}
                </select>
              </div>
            </>
          ) : (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-600 ml-1">Nama Sekolah</label>
                  <input
                    type="text"
                    value={patient.namaSekolah || ""}
                    onChange={(e) => handleChange("namaSekolah", e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-nature-brown outline-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-600 ml-1">Kelas</label>
                  <input
                    type="text"
                    value={patient.kelas || ""}
                    onChange={(e) => handleChange("kelas", e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-nature-brown outline-none"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-600 ml-1">Pekerjaan Ortu</label>
                  <select
                    value={patient.pekerjaanOrtu || ""}
                    onChange={(e) => handleChange("pekerjaanOrtu", e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-nature-brown outline-none"
                  >
                    <option value="">Pilih Pekerjaan Ortu</option>
                    {JOB_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-600 ml-1">Pendidikan Ortu</label>
                  <select
                    value={patient.pendidikanOrtu || ""}
                    onChange={(e) => handleChange("pendidikanOrtu", e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-nature-brown outline-none"
                  >
                    <option value="">Pilih Pendidikan Ortu</option>
                    {EDUCATION_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                  </select>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-600 ml-1">Range Penghasilan Orang Tua</label>
                <select
                  value={patient.penghasilanOrtu || ""}
                  onChange={(e) => handleChange("penghasilanOrtu", e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-nature-brown outline-none"
                >
                  <option value="">Pilih Range Penghasilan Ortu</option>
                  {INCOME_RANGES.map(range => <option key={range} value={range}>{range}</option>)}
                </select>
              </div>
            </>
          )}
        </div>
      </div>
    </motion.div>
  );
}

