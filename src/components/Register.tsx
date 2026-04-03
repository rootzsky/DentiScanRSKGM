import React, { useState } from "react";
import { motion } from "motion/react";
import { User, Lock, UserPlus, ArrowLeft, Stethoscope, Trees } from "lucide-react";

interface RegisterProps {
  onRegister: () => void;
  onNavigateToLogin: () => void;
}

export default function Register({ onRegister, onNavigateToLogin }: RegisterProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password || !confirmPassword) {
      setError("Semua field harus diisi");
      return;
    }
    if (password !== confirmPassword) {
      setError("Konfirmasi password tidak sesuai");
      return;
    }
    onRegister();
  };

  return (
    <div className="min-h-screen bg-cloud-blue/30 flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md bg-white rounded-3xl shadow-xl overflow-hidden border border-nature-brown/10"
      >
        <div className="bg-gradient-to-br from-nature-brown to-primary p-8 text-center text-white relative">
          <button 
            onClick={onNavigateToLogin}
            className="absolute left-4 top-4 p-2 hover:bg-white/20 rounded-full transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <div className="flex justify-center mb-4">
            <div className="bg-white/20 p-3 rounded-2xl backdrop-blur-sm">
              <Trees size={32} className="text-white" />
            </div>
          </div>
          <h1 className="text-2xl font-bold tracking-tight mb-1">Daftar Akun Baru</h1>
          <p className="text-secondary/80 text-sm">Bergabung dengan DentiScan RSKGM</p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-5">
          {error && (
            <div className="bg-rose-50 text-rose-600 p-3 rounded-xl text-sm font-medium border border-rose-100">
              {error}
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-500 ml-1 uppercase tracking-wider">Username</label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-nature-brown focus:border-transparent outline-none transition-all"
                placeholder="Pilih username"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-500 ml-1 uppercase tracking-wider">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-nature-brown focus:border-transparent outline-none transition-all"
                placeholder="Buat password"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-500 ml-1 uppercase tracking-wider">Konfirmasi Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-nature-brown focus:border-transparent outline-none transition-all"
                placeholder="Ulangi password"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-nature-brown text-white py-4 rounded-2xl font-bold text-lg hover:bg-nature-brown/90 transition-all shadow-lg shadow-nature-brown/20 flex items-center justify-center gap-2 mt-4"
          >
            <UserPlus size={20} />
            Daftar Sekarang
          </button>

          <div className="text-center pt-2">
            <button
              type="button"
              onClick={onNavigateToLogin}
              className="text-slate-500 text-sm font-medium hover:text-leaf-green transition-colors"
            >
              Sudah punya akun? <span className="font-bold text-leaf-green">Masuk</span>
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
