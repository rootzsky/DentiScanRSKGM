import { GoogleGenAI, Type } from "@google/genai";
import { Examination, Patient } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function analyzeExamination(patient: Patient, exam: Examination) {
  try {
    const prompt = `
      Analisis hasil pemeriksaan gigi dan mulut untuk pasien berikut:
      Nama: ${patient.namaLengkap}
      Umur: ${new Date().getFullYear() - new Date(patient.tanggalLahir).getFullYear()} tahun
      Jenis Kelamin: ${patient.jenisKelamin === "L" ? "Laki-laki" : "Perempuan"}
      
      Data Odontogram (Status Gigi):
      ${JSON.stringify(exam.odontogram)}
      
      Data OHI-S:
      DI: ${JSON.stringify(exam.ohis.di)}
      CI: ${JSON.stringify(exam.ohis.ci)}
      
      Data Intra Oral:
      ${JSON.stringify(exam.intraOral)}
      
      Data Extra Oral:
      ${JSON.stringify(exam.extraOral)}
      
      Berikan ringkasan diagnosis medis yang singkat dan padat.
      Berikan analisis kasus dan rekomendasi solusi yang komprehensif.
      Format output harus JSON.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3.1-pro-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            diagnosis: { type: Type.STRING },
            rekomendasi: { type: Type.STRING },
          },
          required: ["diagnosis", "rekomendasi"],
        },
      },
    });

    return JSON.parse(response.text || "{}");
  } catch (error) {
    console.error("AI Analysis Error:", error);
    return {
      diagnosis: "Gagal menganalisis data. Silakan coba lagi.",
      rekomendasi: "Gagal memberikan rekomendasi. Silakan coba lagi.",
    };
  }
}

export async function analyzeDatabase(patients: Patient[], exams: Examination[], filterDesc: string) {
  try {
    const prompt = `
      Analisis data epidemiologi kesehatan gigi dan mulut dari database berikut:
      Filter yang dipilih: ${filterDesc}
      Total Pasien: ${patients.length}
      
      Data Pasien: ${JSON.stringify(patients.map(p => ({ 
        jk: p.jenisKelamin, 
        umur: new Date().getFullYear() - new Date(p.tanggalLahir).getFullYear(), 
        kota: p.kota,
        pekerjaan: p.pekerjaan 
      })))}
      
      Berikan ringkasan analisis kesehatan gigi masyarakat berdasarkan data tersebut, perhatikan korelasi antara demografi (seperti pekerjaan, umur, lokasi) dengan status kesehatan jika memungkinkan.
      Berikan rekomendasi kebijakan atau tindakan preventif yang spesifik dan aplikatif untuk populasi ini.
      Format output harus JSON.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3.1-pro-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: { type: Type.STRING },
            recommendations: { type: Type.STRING },
          },
          required: ["summary", "recommendations"],
        },
      },
    });

    return JSON.parse(response.text || "{}");
  } catch (error) {
    console.error("AI Database Analysis Error:", error);
    return {
      summary: "Gagal menganalisis database.",
      recommendations: "Gagal memberikan rekomendasi.",
    };
  }
}
