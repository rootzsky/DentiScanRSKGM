import React from "react";
import { WHO_TOOTH_STATUS } from "../types";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface ToothDropdownProps {
  toothId: string;
  onSelect: (statusId: string) => void;
  onClose: () => void;
}

export default function ToothDropdown({ toothId, onSelect, onClose }: ToothDropdownProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden"
      >
        <div className="bg-nature-brown text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-leaf-green text-white w-10 h-10 rounded-xl flex items-center justify-center font-bold text-xl">
              {toothId}
            </div>
            <h3 className="font-bold text-lg">Status Gigi</h3>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
            <X size={24} />
          </button>
        </div>
        
        <div className="p-4 max-h-[60vh] overflow-y-auto custom-scrollbar">
          <div className="grid gap-2">
            {WHO_TOOTH_STATUS.map((status) => (
              <button
                key={status.id}
                onClick={() => onSelect(status.id)}
                className="flex items-center gap-4 p-4 rounded-2xl hover:bg-cloud-blue/30 border border-transparent hover:border-secondary/20 transition-all group text-left"
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-sm ${status.color}`}>
                  {status.code}
                </div>
                <div>
                  <div className="font-bold text-slate-800 group-hover:text-nature-brown transition-colors">
                    {status.status}
                  </div>
                  <div className="text-xs text-slate-500 font-medium uppercase tracking-wider">
                    WHO Code: {status.code}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
        
        <div className="p-4 bg-slate-50 border-t border-slate-100">
          <button 
            onClick={() => onSelect("")}
            className="w-full py-3 rounded-xl border-2 border-dashed border-slate-300 text-slate-500 font-bold hover:bg-white hover:border-slate-400 transition-all"
          >
            Kosongkan / Reset Status
          </button>
        </div>
      </motion.div>
    </div>
  );
}
