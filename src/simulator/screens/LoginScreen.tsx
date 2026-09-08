import React, { useState } from 'react';
import { GraduationCap, Mail, Lock, Eye, EyeOff, Loader2, AlertCircle } from 'lucide-react';
import { User } from '../types';
import { mockBackend, TOKEN_STORAGE_KEY } from '../mockApi';

interface LoginScreenProps {
  onLoginSuccess: (user: User, token: string) => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleLogin = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setErrorMessage(null);

    if (!email.trim()) {
      setErrorMessage('Alamat email wajib diisi.');
      return;
    }
    if (!password) {
      setErrorMessage('Kata sandi wajib diisi.');
      return;
    }

    setIsLoading(true);
    try {
      const { user, token } = await mockBackend.login(email, password);
      localStorage.setItem(TOKEN_STORAGE_KEY, token);
      onLoginSuccess(user, token);
    } catch (err: any) {
      setErrorMessage(err.message || 'Gagal masuk ke akun.');
    } finally {
      setIsLoading(false);
    }
  };

  const fillDevAccount = (devEmail: string, devPass: string) => {
    setEmail(devEmail);
    setPassword(devPass);
    setErrorMessage(null);
  };

  return (
    <div className="flex-1 w-full bg-white flex flex-col justify-between p-6 overflow-y-auto">
      <div className="flex flex-col items-center pt-2">
        <div className="w-14 h-14 rounded-2xl bg-[#1E3A8A] flex items-center justify-center shadow-md shadow-blue-900/20">
          <GraduationCap size={30} className="text-white" />
        </div>
        <h2 className="text-lg font-black text-slate-900 mt-2 tracking-wide">SEKOLAH MODEL</h2>
        <span className="text-[11px] text-slate-500 font-medium">Sistem Pembelajaran Digital</span>

        <h3 className="text-xl font-bold text-slate-800 mt-5">Selamat Datang</h3>
        <p className="text-xs text-slate-500 text-center mt-1 px-4 leading-relaxed">
          Masuk ke akun Anda untuk memulai pembelajaran digital
        </p>
      </div>

      <form onSubmit={handleLogin} className="w-full mt-4 space-y-3.5">
        {errorMessage && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-xs p-3 rounded-xl flex items-start gap-2 animate-shake">
            <AlertCircle size={16} className="shrink-0 mt-0.5 text-red-600" />
            <span className="flex-1 font-medium leading-snug">{errorMessage}</span>
          </div>
        )}

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            Alamat Email
          </label>
          <div className="relative flex items-center">
            <Mail size={16} className="absolute left-3.5 text-slate-400 pointer-events-none" />
            <input
              type="email"
              placeholder="nama@sekolahmodel.sch.id"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
              className="w-full bg-slate-50 text-slate-900 pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-blue-600 focus:bg-white transition"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            Kata Sandi
          </label>
          <div className="relative flex items-center">
            <Lock size={16} className="absolute left-3.5 text-slate-400 pointer-events-none" />
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Masukkan kata sandi"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
              className="w-full bg-slate-50 text-slate-900 pl-10 pr-10 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-blue-600 focus:bg-white transition"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 text-slate-400 hover:text-slate-600 p-1"
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-[#1E3A8A] hover:bg-[#1E40AF] text-white font-bold text-xs py-3 rounded-xl shadow-md shadow-blue-900/20 active:scale-[0.98] transition flex items-center justify-center gap-2 mt-2"
        >
          {isLoading ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              <span>Memverifikasi...</span>
            </>
          ) : (
            <span>Masuk ke Akun</span>
          )}
        </button>
      </form>

      {/* Dev Account Quick Switcher */}
      <div className="pt-3 border-t border-slate-100 flex flex-col items-center">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
          Akun Uji Coba Cepat (Seed Data)
        </span>
        <div className="flex flex-wrap gap-1.5 justify-center">
          <button
            type="button"
            onClick={() => fillDevAccount('admin@sekolahmodel.sch.id', 'Admin123!')}
            className="px-2.5 py-1 rounded-lg border border-purple-200 bg-purple-50 text-purple-700 text-[11px] font-bold hover:bg-purple-100 transition active:scale-95"
          >
            Admin
          </button>
          <button
            type="button"
            onClick={() => fillDevAccount('guru.budi@sekolahmodel.sch.id', 'Guru123!')}
            className="px-2.5 py-1 rounded-lg border border-sky-200 bg-sky-50 text-sky-700 text-[11px] font-bold hover:bg-sky-100 transition active:scale-95"
          >
            Guru Budi
          </button>
          <button
            type="button"
            onClick={() => fillDevAccount('siswa.ahmad@sekolahmodel.sch.id', 'Siswa123!')}
            className="px-2.5 py-1 rounded-lg border border-emerald-200 bg-emerald-50 text-emerald-700 text-[11px] font-bold hover:bg-emerald-100 transition active:scale-95"
          >
            Siswa Ahmad
          </button>
        </div>
        <span className="text-[10px] text-slate-400 mt-3 text-center">
          Sekolah Model LMS • Satu Akun untuk Semua Peran
        </span>
      </div>
    </div>
  );
};
