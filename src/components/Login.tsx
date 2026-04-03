import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { User, Lock, RefreshCw, UserPlus, LogIn, Stethoscope, Trees } from "lucide-react";
import { cn } from "../lib/utils";

interface LoginProps {
  onLogin: (username: string) => void;
  onNavigateToRegister: () => void;
}

export default function Login({ onLogin, onNavigateToRegister }: LoginProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [captchaInput, setCaptchaInput] = useState("");
  const [captchaCode, setCaptchaCode] = useState("");
  const [error, setError] = useState("");

  const generateCaptcha = () => {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    let result = "";
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setCaptchaCode(result);
  };

  useEffect(() => {
    generateCaptcha();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (captchaInput.toUpperCase() !== captchaCode) {
      setError("CAPTCHA tidak sesuai");
      generateCaptcha();
      return;
    }
    if (username && password) {
      onLogin(username);
    } else {
      setError("Username dan password harus diisi");
    }
  };

  return (
    <div className="min-h-screen bg-cloud-blue/30 flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white rounded-3xl shadow-xl overflow-hidden border border-nature-brown/10"
      >
        <div className="bg-gradient-to-br from-nature-brown to-primary p-10 text-center text-white relative">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <Trees size={120} />
          </div>
          <div className="flex justify-center mb-4">
            <div className="bg-white/20 p-4 rounded-2xl backdrop-blur-sm">
              <Trees size={48} className="text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold tracking-tight mb-1">DentiScan RSKGM</h1>
          <p className="text-secondary/80 text-sm font-medium uppercase tracking-widest">Sistem Pemeriksaan Gigi Digital</p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          {error && (
            <div className="bg-rose-50 text-rose-600 p-3 rounded-xl text-sm font-medium border border-rose-100">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700 ml-1">USERNAME</label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                placeholder="Masukkan username"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700 ml-1">PASSWORD</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                placeholder="Masukkan password"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700 ml-1">VERIFIKASI CAPTCHA</label>
            <div className="flex gap-3">
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={captchaInput}
                  onChange={(e) => setCaptchaInput(e.target.value)}
                  className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  placeholder="Ketik kode"
                />
              </div>
              <div className="flex items-center gap-2 bg-slate-100 px-4 py-2 rounded-2xl border border-slate-200">
                <span className="font-mono font-bold text-xl tracking-widest text-blue-600 select-none italic">
                  {captchaCode}
                </span>
                <button 
                  type="button" 
                  onClick={generateCaptcha}
                  className="p-1 hover:bg-slate-200 rounded-full transition-colors text-slate-500"
                >
                  <RefreshCw size={18} />
                </button>
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-nature-brown text-white py-4 rounded-2xl font-bold text-lg hover:bg-nature-brown/90 transition-all shadow-lg shadow-nature-brown/20 flex items-center justify-center gap-2"
          >
            <LogIn size={20} />
            Masuk Sekarang
          </button>

          <div className="text-center">
            <button
              type="button"
              onClick={onNavigateToRegister}
              className="text-leaf-green font-bold hover:underline flex items-center justify-center gap-1 mx-auto"
            >
              <UserPlus size={18} />
              Belum punya akun? Daftar
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
