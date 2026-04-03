import React, { useState } from "react";
import { WHO_TOOTH_STATUS, Examination } from "../types";
import { motion } from "motion/react";
import ToothDropdown from "./ToothDropdown";

interface OdontogramProps {
  exam: Partial<Examination>;
  onChange: (exam: Partial<Examination>) => void;
}

export default function Odontogram({ exam, onChange }: OdontogramProps) {
  const [selectedTooth, setSelectedTooth] = useState<string | null>(null);
  const odontogram = exam.odontogram || {};
  
  const [ohiData, setOhiData] = useState<Record<string, { di: number; ci: number }>>({
    "16": { di: 0, ci: 0 },
    "11": { di: 0, ci: 0 },
    "26": { di: 0, ci: 0 },
    "46": { di: 0, ci: 0 },
    "31": { di: 0, ci: 0 },
    "36": { di: 0, ci: 0 },
  });

  const teethUpper = [
    ["18", "17", "16", "15", "14", "13", "12", "11"],
    ["21", "22", "23", "24", "25", "26", "27", "28"],
  ];
  const teethDeciduousUpper = [
    ["55", "54", "53", "52", "51"],
    ["61", "62", "63", "64", "65"],
  ];
  const teethDeciduousLower = [
    ["85", "84", "83", "82", "81"],
    ["71", "72", "73", "74", "75"],
  ];
  const teethLower = [
    ["48", "47", "46", "45", "44", "43", "42", "41"],
    ["31", "32", "33", "34", "35", "36", "37", "38"],
  ];

  const calculateOHIS = (data: Record<string, { di: number; ci: number }>) => {
    const values = Object.values(data) as { di: number; ci: number }[];
    const totalDI = values.reduce((sum, item) => sum + item.di, 0);
    const totalCI = values.reduce((sum, item) => sum + item.ci, 0);
    const count = values.length || 1;
    return ((totalDI / count) + (totalCI / count)).toFixed(2);
  };

  const calculateDMFT = (odonto: Record<string, string>) => {
    let d = 0, m = 0, f = 0;
    Object.entries(odonto).forEach(([id, statusId]) => {
      const toothNum = parseInt(id);
      if (toothNum >= 11 && toothNum <= 48) {
        if (["C", "P", "S", "1", "2"].includes(statusId)) d++; // 1: Karies, 2: Tumpatan dgn karies
        if (["M", "E", "4"].includes(statusId)) m++; // 4: Dicabut krn karies
        if (["F", "3"].includes(statusId)) f++; // 3: Tumpatan tanpa karies
      }
    });
    return { d, m, f, total: d + m + f };
  };

  const calculateDEFT = (odonto: Record<string, string>) => {
    let d = 0, e = 0, f = 0;
    Object.entries(odonto).forEach(([id, statusId]) => {
      const toothNum = parseInt(id);
      if (toothNum >= 51 && toothNum <= 85) {
        if (["C", "P", "S", "1", "2"].includes(statusId)) d++;
        if (["E", "4"].includes(statusId)) e++;
        if (["F", "3"].includes(statusId)) f++;
      }
    });
    return { d, e, f, total: d + e + f };
  };

  const updateExamData = (newOdonto: Record<string, string>, newOhiData: Record<string, { di: number; ci: number }>) => {
    const dmft = calculateDMFT(newOdonto);
    const deft = calculateDEFT(newOdonto);
    const ohisScore = calculateOHIS(newOhiData);

    onChange({
      ...exam,
      odontogram: newOdonto,
      dmft,
      deft,
      ohisScore
    });
  };

  const handleToothClick = (id: string) => {
    setSelectedTooth(id);
  };

  const handleStatusSelect = (statusId: string) => {
    const newOdontogram = { ...odontogram };
    if (statusId) {
      newOdontogram[selectedTooth!] = statusId;
    } else {
      delete newOdontogram[selectedTooth!];
    }
    updateExamData(newOdontogram, ohiData);
    setSelectedTooth(null);
  };

  const handleOhiChange = (id: string, type: "di" | "ci", value: string) => {
    const numValue = value === "" ? 0 : parseInt(value);
    const newOhiData = {
      ...ohiData,
      [id]: { ...ohiData[id], [type]: numValue }
    };
    setOhiData(newOhiData);
    updateExamData(odontogram, newOhiData);
  };

  const dmft = calculateDMFT(odontogram);
  const deft = calculateDEFT(odontogram);
  const ohisScore = calculateOHIS(ohiData);

  const renderTooth = (id: string) => {
    const statusId = odontogram[id];
    const status = WHO_TOOTH_STATUS.find((s) => s.id === statusId);
    
    return (
      <button
        key={id}
        onClick={() => handleToothClick(id)}
        className={`w-12 h-16 rounded-xl border-2 flex flex-col items-center justify-center transition-all hover:scale-105 hover:shadow-md ${
          status ? `${status.color} border-transparent text-white` : "bg-white border-slate-200 text-slate-400"
        }`}
      >
        <span className="text-[10px] font-bold opacity-60 mb-1">{id}</span>
        <span className="text-lg font-bold">{status ? status.code : "-"}</span>
      </button>
    );
  };

  return (
    <div className="space-y-8">
      <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold text-slate-800">Peta Odontogram</h2>
          <p className="text-sm text-slate-500 font-medium">Klik pada kotak gigi untuk menetapkan status anatomis</p>
        </div>

        <div className="flex flex-col items-center gap-8 py-4">
          {/* Upper Jaw */}
          <div className="space-y-4">
            <div className="text-center">
              <span className="bg-cloud-blue text-nature-brown text-[10px] font-bold px-4 py-1 rounded-full uppercase tracking-widest">Rahang Atas</span>
            </div>
            <div className="flex gap-8">
              <div className="flex gap-1">{teethUpper[0].map(renderTooth)}</div>
              <div className="w-px bg-slate-200" />
              <div className="flex gap-1">{teethUpper[1].map(renderTooth)}</div>
            </div>
            <div className="flex justify-center gap-8">
              <div className="flex gap-1">{teethDeciduousUpper[0].map(renderTooth)}</div>
              <div className="w-px bg-transparent" />
              <div className="flex gap-1">{teethDeciduousUpper[1].map(renderTooth)}</div>
            </div>
          </div>

          <div className="w-full max-w-2xl h-px bg-slate-100 relative">
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-4 text-slate-300">
              <div className="w-6 h-6 rounded-full border-2 border-slate-200 flex items-center justify-center">
                <div className="w-1 h-1 bg-slate-200 rounded-full" />
              </div>
            </div>
          </div>

          {/* Lower Jaw */}
          <div className="space-y-4">
            <div className="flex justify-center gap-8">
              <div className="flex gap-1">{teethDeciduousLower[0].map(renderTooth)}</div>
              <div className="w-px bg-transparent" />
              <div className="flex gap-1">{teethDeciduousLower[1].map(renderTooth)}</div>
            </div>
            <div className="flex gap-8">
              <div className="flex gap-1">{teethLower[0].map(renderTooth)}</div>
              <div className="w-px bg-slate-200" />
              <div className="flex gap-1">{teethLower[1].map(renderTooth)}</div>
            </div>
            <div className="text-center">
              <span className="bg-cloud-blue text-nature-brown text-[10px] font-bold px-4 py-1 rounded-full uppercase tracking-widest">Rahang Bawah</span>
            </div>
          </div>
        </div>
      </div>

      {/* OHI-S Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-slate-800">Indeks OHI-S</h3>
            <div className="bg-nature-brown text-white px-4 py-2 rounded-2xl font-bold text-sm">
              Total Skor: {ohisScore}
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            {["16", "11", "26", "46", "31", "36"].map(id => (
              <div key={id} className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-500">Gigi {id}</span>
                </div>
                <div className="flex gap-2">
                  <select 
                    value={ohiData[id].di}
                    onChange={(e) => handleOhiChange(id, "di", e.target.value)}
                    className="flex-1 bg-white border border-slate-200 rounded-xl px-2 py-2 text-xs font-bold outline-none focus:ring-2 focus:ring-nature-brown"
                  >
                    <option value="">DI -</option>
                    <option value="0">0</option><option value="1">1</option><option value="2">2</option><option value="3">3</option>
                  </select>
                  <select 
                    value={ohiData[id].ci}
                    onChange={(e) => handleOhiChange(id, "ci", e.target.value)}
                    className="flex-1 bg-white border border-slate-200 rounded-xl px-2 py-2 text-xs font-bold outline-none focus:ring-2 focus:ring-nature-brown"
                  >
                    <option value="">CI -</option>
                    <option value="0">0</option><option value="1">1</option><option value="2">2</option><option value="3">3</option>
                  </select>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gradient-to-br from-nature-brown to-primary p-8 rounded-3xl shadow-xl text-white space-y-6">
          <h3 className="text-xl font-bold">Status Karies</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/10">
              <p className="text-xs font-bold text-cloud-blue uppercase tracking-widest mb-1">Gigi Tetap</p>
              <p className="text-3xl font-bold">{dmft.total} <span className="text-sm font-medium opacity-60">DMF-T</span></p>
              <div className="mt-2 flex gap-2 text-[10px] font-bold opacity-80">
                <span>D:{dmft.d}</span>
                <span>M:{dmft.m}</span>
                <span>F:{dmft.f}</span>
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/10">
              <p className="text-xs font-bold text-cloud-blue uppercase tracking-widest mb-1">Gigi Sulung</p>
              <p className="text-3xl font-bold">{deft.total} <span className="text-sm font-medium opacity-60">def-t</span></p>
              <div className="mt-2 flex gap-2 text-[10px] font-bold opacity-80">
                <span>d:{deft.d}</span>
                <span>e:{deft.e}</span>
                <span>f:{deft.f}</span>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-rose-500/20 p-4 rounded-2xl border border-rose-500/20">
              <p className="text-[10px] font-bold text-rose-200 uppercase mb-1">RTI (Kebutuhan Perawatan)</p>
              <p className="text-xl font-bold">{dmft.total > 0 ? ((dmft.d / dmft.total) * 100).toFixed(1) : 0}%</p>
            </div>
            <div className="bg-emerald-500/20 p-4 rounded-2xl border border-emerald-500/20">
              <p className="text-[10px] font-bold text-emerald-200 uppercase mb-1">PTI (Perawatan Dilakukan)</p>
              <p className="text-xl font-bold">{dmft.total > 0 ? ((dmft.f / dmft.total) * 100).toFixed(1) : 0}%</p>
            </div>
          </div>
        </div>
      </div>

      {selectedTooth && (
        <ToothDropdown
          toothId={selectedTooth}
          onSelect={handleStatusSelect}
          onClose={() => setSelectedTooth(null)}
        />
      )}
    </div>
  );
}
