export type PatientType = "UMUM" | "UKGS";

export interface ToothStatus {
  id: string;
  status: string;
  code: string;
  color: string;
}

export const WHO_TOOTH_STATUS: ToothStatus[] = [
  { id: "0", status: "Sehat", code: "0", color: "bg-emerald-500" },
  { id: "1", status: "Berlubang/Karies", code: "1", color: "bg-rose-500" },
  { id: "2", status: "Tumpatan dgn karies", code: "2", color: "bg-amber-500" },
  { id: "3", status: "Tumpatan tanpa karies", code: "3", color: "bg-cyan-500" },
  { id: "4", status: "Dicabut krn karies", code: "4", color: "bg-slate-500" },
  { id: "5", status: "Dicabut krn sebab lain", code: "5", color: "bg-slate-400" },
  { id: "6", status: "Fissure Sealant", code: "6", color: "bg-indigo-500" },
  { id: "7", status: "Protesa Cekat", code: "7", color: "bg-violet-500" },
  { id: "8", status: "Gigi tidak tumbuh", code: "8", color: "bg-gray-300" },
  { id: "9", status: "Gigi tidak tercatat", code: "9", color: "bg-gray-200" },
];

export interface Patient {
  id: string;
  noRM: string;
  nik: string;
  namaLengkap: string;
  tanggalLahir: string;
  jenisKelamin: "L" | "P";
  alamat: string;
  pekerjaan: string;
  pendidikan: string;
  penghasilan: string;
  patientType: PatientType;
  // UKGS specific
  namaSekolah?: string;
  kelas?: string;
  pekerjaanOrtu?: string;
  pendidikanOrtu?: string;
  penghasilanOrtu?: string;
  kecamatan: string;
  kota: string;
}

export interface Examination {
  id: string;
  patientId: string;
  tanggalPeriksa: string;
  odontogram: Record<string, string>; // toothId -> statusId
  ohis: {
    di: Record<string, number>;
    ci: Record<string, number>;
  };
  extraOral: {
    wajah: string;
    limfe: string;
    bibir: string;
    lainnya: string;
  };
  intraOral: {
    mukosa: string;
    palatum: string;
    lidah: string;
    dasarMulut: string;
    gingiva: string;
    karangGigi: string;
    gigiBerjejal: string;
    lainnya: string;
  };
  aiAnalysis?: {
    diagnosis: string;
    rekomendasi: string;
  };
  dmft?: { d: number; m: number; f: number; total: number };
  deft?: { d: number; e: number; f: number; total: number };
  ohisScore?: string;
  rujukan?: {
    tujuan: string;
    instansi: string;
    alasan: string;
  };
}
