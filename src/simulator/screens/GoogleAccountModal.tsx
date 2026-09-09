import React, { useState } from 'react';
import { X, Check, Plus, ShieldCheck, ArrowRight, UserPlus, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { PkbmOfficialLogo } from '../components/LoginVisualAssets';

interface GoogleAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectAccount: (email: string, name: string) => Promise<void>;
  isLoading: boolean;
}

interface DemoGoogleAccount {
  id: string;
  name: string;
  email: string;
  avatar: string;
  statusText: string;
  statusColor: 'green' | 'amber';
}

const DEMO_ACCOUNTS: DemoGoogleAccount[] = [
  {
    id: '1',
    name: 'Ahmad Fauzi',
    email: 'siswa.ahmad@gmail.com',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150',
    statusText: 'Kelas X MIPA 1 • Siswa Aktif',
    statusColor: 'green',
  },
  {
    id: '2',
    name: 'Dewi Lestari',
    email: 'dewi.lestari@gmail.com',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150',
    statusText: 'Kelas XI IPS 2 • Siswa Aktif',
    statusColor: 'green',
  },
  {
    id: '3',
    name: 'Rian Firmansyah',
    email: 'rian.baru@gmail.com',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    statusText: 'Siswa Baru • Perlu Kode Kelas',
    statusColor: 'amber',
  },
];

export const GoogleAccountModal: React.FC<GoogleAccountModalProps> = ({
  isOpen,
  onClose,
  onSelectAccount,
  isLoading,
}) => {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [customName, setCustomName] = useState('');
  const [customEmail, setCustomEmail] = useState('');

  if (!isOpen) return null;

  const handlePickAccount = async (account: DemoGoogleAccount) => {
    setSelectedId(account.id);
    await onSelectAccount(account.email, account.name);
  };

  const handleCustomSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customEmail.trim()) return;
    const name = customName.trim() || customEmail.split('@')[0];
    await onSelectAccount(customEmail.trim(), name);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end justify-center p-3 select-none">
      <motion.div
        initial={{ y: 220, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 220, opacity: 0 }}
        transition={{ type: 'spring', damping: 26, stiffness: 300 }}
        className="w-full max-w-sm bg-white rounded-3xl p-5 shadow-2xl border border-slate-100 flex flex-col font-sans"
      >
        {/* Header as specified: "Pilih akun", "Gunakan akun untuk masuk ke BISA" */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            {/* Google G Logo */}
            <div className="w-8 h-8 rounded-full bg-white shadow-2xs border border-slate-200 flex items-center justify-center p-1.5">
              <svg className="w-full h-full" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.66v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.15z"
                />
                <path
                  fill="#34A853"
                  d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.24v3.15C3.26 21.36 7.33 24 12 24z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.24C.45 8.16 0 9.98 0 12s.45 3.84 1.24 5.42l4.04-3.15z"
                />
                <path
                  fill="#EA4335"
                  d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.24 6.58l4.04 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                />
              </svg>
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#1F2937]">Pilih akun</h3>
              <p className="text-[10px] text-slate-500">
                Gunakan akun untuk masuk ke BISA
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="w-7 h-7 rounded-full bg-slate-100 text-slate-400 hover:text-slate-600 flex items-center justify-center transition"
          >
            <X size={15} />
          </button>
        </div>

        {/* Account List: Avatar, Nama, Email, Radio selection, Highlight on click */}
        {!showCustomInput ? (
          <div className="mt-3 space-y-2">
            {DEMO_ACCOUNTS.map((acc) => {
              const isSelected = selectedId === acc.id;
              return (
                <motion.button
                  key={acc.id}
                  type="button"
                  onClick={() => handlePickAccount(acc)}
                  disabled={isLoading}
                  whileTap={{ scale: 0.98 }}
                  className={`w-full p-3 rounded-2xl border text-left flex items-center justify-between transition-all duration-150 ${
                    isSelected
                      ? 'border-[#168A5B] bg-[#E8F5EE]/70 shadow-xs'
                      : 'border-slate-200/90 bg-white hover:border-emerald-300 hover:bg-slate-50/80'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={acc.avatar}
                      alt={acc.name}
                      className="w-10 h-10 rounded-full object-cover border border-slate-200"
                    />
                    <div>
                      <h4 className="text-xs font-bold text-[#1F2937] leading-tight">
                        {acc.name}
                      </h4>
                      <p className="text-[11px] text-slate-500 leading-snug">
                        {acc.email}
                      </p>
                      <span
                        className={`text-[9px] font-semibold inline-block mt-0.5 px-1.5 py-0.2 rounded-md ${
                          acc.statusColor === 'green'
                            ? 'bg-[#E8F5EE] text-[#168A5B]'
                            : 'bg-amber-50 text-amber-700'
                        }`}
                      >
                        {acc.statusText}
                      </span>
                    </div>
                  </div>

                  {/* Radio Selection Indicator with Animation */}
                  <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                      isSelected
                        ? 'border-[#168A5B] bg-[#168A5B]'
                        : 'border-slate-300 bg-white'
                    }`}
                  >
                    {isSelected ? (
                      isLoading ? (
                        <Loader2 size={11} className="text-white animate-spin" />
                      ) : (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="w-2 h-2 rounded-full bg-white"
                        />
                      )
                    ) : null}
                  </div>
                </motion.button>
              );
            })}

            {/* Use Another Account Option */}
            <button
              type="button"
              onClick={() => setShowCustomInput(true)}
              disabled={isLoading}
              className="w-full py-2.5 px-3 rounded-2xl border border-dashed border-slate-300 hover:border-[#168A5B] text-slate-600 hover:text-[#168A5B] text-xs font-bold flex items-center justify-center gap-2 transition"
            >
              <UserPlus size={14} />
              <span>Gunakan akun lain</span>
            </button>
          </div>
        ) : (
          /* Custom Account Form */
          <form onSubmit={handleCustomSubmit} className="mt-3 space-y-3">
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                Nama Lengkap
              </label>
              <input
                type="text"
                placeholder="Contoh: Budi Santoso"
                value={customName}
                onChange={(e) => setCustomName(e.target.value)}
                className="w-full bg-slate-50 text-slate-900 px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-medium outline-none focus:border-[#168A5B]"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                Alamat Gmail / Google Account
              </label>
              <input
                type="email"
                required
                placeholder="nama@gmail.com"
                value={customEmail}
                onChange={(e) => setCustomEmail(e.target.value)}
                className="w-full bg-slate-50 text-slate-900 px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-medium outline-none focus:border-[#168A5B]"
              />
            </div>

            <div className="flex items-center gap-2 pt-1">
              <button
                type="button"
                onClick={() => setShowCustomInput(false)}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50"
              >
                Kembali
              </button>
              <button
                type="submit"
                disabled={isLoading || !customEmail.trim()}
                className="flex-1 py-2.5 rounded-xl bg-[#168A5B] hover:bg-[#0f6b46] text-white text-xs font-bold transition flex items-center justify-center gap-1.5"
              >
                {isLoading ? <Loader2 size={13} className="animate-spin" /> : <span>Lanjut</span>}
              </button>
            </div>
          </form>
        )}

        {/* Security / Privacy Footer */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400">
          <span>BISA • PKBM Bina Insani</span>
          <div className="flex items-center gap-2">
            <span>Privasi</span>
            <span>•</span>
            <span>Persyaratan</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
