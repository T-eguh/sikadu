import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Volume2, VolumeX, Heart, Sparkles, Smile } from 'lucide-react';

/**
 * ============================================================================
 * ANIMASI KAMPUS SEKOLAH SUPER CANTIK, RAPI & RAMAI (CAMPUS LIFE ECOSYSTEM)
 * PKBM BINA INSANI - SMART ACADEMY
 *
 * Pembaruan Utama Sesuai Masukan Pengguna:
 * 1. Tanpa teks "Kampus Aktif" sama sekali.
 * 2. Tidak lagi hanya 2 orang yang sepi, melainkan suasana kampus yang ramai,
 *    hidup, dan harmonis:
 *    - GRUP SISWA MELANGKAH KE SAMPING (Foreground): 3 sahabat (siswa ransel,
 *      siswi ceria, dan siswa pembawa buku) berjalan beriringan melintasi jalan setapak.
 *    - SISWI BERPAPASAN (Arah Berlawanan): Siswi berseragam rapi melangkah dari kanan ke kiri,
 *      menciptakan suasana berpapasan yang sangat alami dan hidup.
 *    - SISWA DUDUK DI BANGKU TAMAN: Duduk santai membaca buku di bawah pohon rindang.
 *    - GURU/TUTOR DI PINTU MASUK SEKOLAH: Guru ramah berdiri di teras menyambut siswa
 *      dengan lambaian tangan hangat bersama siswa yang menaiki tangga.
 * 3. Desain grafis dipercantik & diperjelas:
 *    - Siluet karakter proporsional, rapi, bersih, bergaya anime/chibi elegan.
 *    - Lampu taman klasik kampus dengan lentera bercahaya keemasan.
 *    - Kupu-kupu mungil mengepakkan sayap di taman bunga warna-warni.
 *    - Bus sekolah kuning melintas di jalan raya tengah.
 *    - Menara jam PKBM Bina Insani dengan jarum detik aktif & lonceng berayun bersuara.
 *    - Bendera Merah Putih berkibar anggun di tiang bendera.
 *    - Pesawat kertas dan burung walet meluncur di langit senja pastel.
 * ============================================================================
 */

export const SchoolCampusAnimation: React.FC = () => {
  const [isSoundOn, setIsSoundOn] = useState(false);
  const [tapEffect, setTapEffect] = useState<{ id: number; x: number; y: number }[]>([]);
  const [dialogText, setDialogText] = useState<string | null>(null);

  // Web Audio Synthesizer untuk denting lonceng sekolah yang jernih & ramah
  const playSchoolBellChime = () => {
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();

      const now = ctx.currentTime;
      const notes = [523.25, 659.25, 783.99, 1046.5]; // C5 - E5 - G5 - C6
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.16);

        gain.gain.setValueAtTime(0.001, now + idx * 0.16);
        gain.gain.exponentialRampToValueAtTime(0.12, now + idx * 0.16 + 0.03);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.16 + 0.55);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + idx * 0.16);
        osc.stop(now + idx * 0.16 + 0.6);
      });
    } catch {
      // Audio context policy guard
    }
  };

  const handleScreenClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const newBurst = { id: Date.now(), x, y };
    setTapEffect((prev) => [...prev.slice(-3), newBurst]);

    const greetings = [
      'Selamat pagi kawan, ayo ke kelas! 🎒',
      'Semangat belajar bersama di PKBM Bina Insani! ✨',
      'Belajar cerdas, masa depan gemilang! 🌟',
      'Halo! Senang belajar bersama teman-teman! 🎓',
      'Kreatif, mandiri, dan pantang menyerah! 🚀',
    ];
    setDialogText(greetings[Math.floor(Math.random() * greetings.length)]);

    if (isSoundOn) {
      playSchoolBellChime();
    }

    setTimeout(() => {
      setTapEffect((prev) => prev.filter((item) => item.id !== newBurst.id));
    }, 1200);

    setTimeout(() => {
      setDialogText(null);
    }, 2800);
  };

  const handleToggleSound = (e: React.MouseEvent) => {
    e.stopPropagation();
    const nextState = !isSoundOn;
    setIsSoundOn(nextState);
    if (nextState) {
      playSchoolBellChime();
    }
  };

  return (
    <div
      id="super-lively-school-campus"
      onClick={handleScreenClick}
      className="relative w-full max-w-[350px] h-[250px] sm:h-[265px] mx-auto select-none my-1 rounded-2xl overflow-hidden shadow-xl border-2 border-emerald-500/25 bg-gradient-to-b from-[#A5B4FC] via-[#FBCFE8] to-[#FED7AA] cursor-pointer group"
      title="Sentuh untuk efek interaktif dan sapaan siswa!"
    >
      {/* Sound Chime Toggle Button at Top-Right */}
      <button
        type="button"
        onClick={handleToggleSound}
        className="absolute top-2.5 right-2.5 z-40 p-1.5 rounded-full bg-white/90 hover:bg-white backdrop-blur-md text-[#168A5B] shadow-md border border-[#168A5B]/30 transition-all hover:scale-110 active:scale-95"
        title={isSoundOn ? 'Matikan nada lonceng' : 'Nyalakan nada lonceng sekolah'}
      >
        {isSoundOn ? <Volume2 size={13} className="text-[#168A5B]" /> : <VolumeX size={13} className="text-slate-400" />}
      </button>

      {/* Interactive Floating Speech Bubble */}
      <AnimatePresence>
        {dialogText && (
          <motion.div
            initial={{ opacity: 0, y: 14, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.85 }}
            transition={{ duration: 0.28, ease: 'easeOut' }}
            className="absolute top-9 inset-x-3 z-40 mx-auto px-3.5 py-1.5 rounded-full bg-white/95 backdrop-blur-md border-2 border-[#168A5B] shadow-lg shadow-emerald-950/20 flex items-center justify-center gap-1.5 text-[11px] font-extrabold text-[#1F2937]"
          >
            <Smile size={14} className="text-[#168A5B] shrink-0" />
            <span className="text-[#168A5B] leading-tight text-center">{dialogText}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Click Tap Effect (Burst of Hearts and Stars) */}
      {tapEffect.map((eff) => (
        <motion.div
          key={eff.id}
          initial={{ opacity: 1, scale: 0.5, x: eff.x - 12, y: eff.y - 12 }}
          animate={{ opacity: 0, scale: 2.2, y: eff.y - 45 }}
          transition={{ duration: 0.9, ease: 'easeOut' }}
          className="absolute pointer-events-none z-50 text-rose-500 font-bold flex items-center gap-1"
        >
          <Heart size={16} fill="#F43F5E" />
          <Sparkles size={14} className="text-amber-400" />
        </motion.div>
      ))}

      {/* =====================================================================
          MASTER ANIMATED SVG CANVAS (VIBRANT & POPULATED CAMPUS ECOSYSTEM)
          ===================================================================== */}
      <svg
        viewBox="0 0 390 260"
        className="w-full h-full relative z-10 select-none overflow-visible"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Sunset Atmosphere Gradient */}
          <linearGradient id="scSkyGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#818CF8" />
            <stop offset="30%" stopColor="#C084FC" />
            <stop offset="60%" stopColor="#FB7185" />
            <stop offset="85%" stopColor="#FBBF24" />
            <stop offset="100%" stopColor="#FDE68A" />
          </linearGradient>

          {/* School Building Golden Ochre Warmth */}
          <linearGradient id="scBldgYellow" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FEF08A" />
            <stop offset="25%" stopColor="#FBBF24" />
            <stop offset="100%" stopColor="#D97706" />
          </linearGradient>

          {/* Red Roof Eaves */}
          <linearGradient id="scRoofRed" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#EF4444" />
            <stop offset="100%" stopColor="#991B1B" />
          </linearGradient>

          {/* Windows Glass Reflection */}
          <linearGradient id="scWindowGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#E0F2FE" />
            <stop offset="45%" stopColor="#38BDF8" />
            <stop offset="100%" stopColor="#0284C7" />
          </linearGradient>

          {/* Lush Green Lawn */}
          <linearGradient id="scLawnGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#86EFAC" />
            <stop offset="30%" stopColor="#4ADE80" />
            <stop offset="100%" stopColor="#15803D" />
          </linearGradient>

          {/* Walking Pavement Gradient */}
          <linearGradient id="scPavementGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#F8FAFC" />
            <stop offset="35%" stopColor="#E2E8F0" />
            <stop offset="100%" stopColor="#94A3B8" />
          </linearGradient>

          {/* Stone Path */}
          <linearGradient id="scStoneGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#B45309" />
            <stop offset="100%" stopColor="#78350F" />
          </linearGradient>

          {/* Navy Blue Uniforms */}
          <linearGradient id="scNavyGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#2563EB" />
            <stop offset="100%" stopColor="#1E3A8A" />
          </linearGradient>

          {/* Bus Yellow Gradient */}
          <linearGradient id="scBusGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#F59E0B" />
            <stop offset="100%" stopColor="#D97706" />
          </linearGradient>

          {/* Warm Lamp Glow Filter */}
          <filter id="scLampGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* -----------------------------------------------------------------
            1. SKY & SUNSET WITH ANIME SUN & CLOUDS
            ----------------------------------------------------------------- */}
        <rect width="390" height="260" fill="url(#scSkyGrad)" />

        {/* Glowing Sun Orb with Soft Corona */}
        <g transform="translate(285, 75)">
          <circle cx="0" cy="0" r="26" fill="#FEF08A" opacity="0.38" filter="url(#scLampGlow)" />
          <circle cx="0" cy="0" r="16" fill="#FFFBEB" opacity="0.95" />
          <motion.g
            animate={{ rotate: 360 }}
            transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
          >
            {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
              <line
                key={deg}
                x1={19 * Math.cos((deg * Math.PI) / 180)}
                y1={19 * Math.sin((deg * Math.PI) / 180)}
                x2={25 * Math.cos((deg * Math.PI) / 180)}
                y2={25 * Math.sin((deg * Math.PI) / 180)}
                stroke="#FEF08A"
                strokeWidth="1.4"
                strokeLinecap="round"
                opacity="0.75"
              />
            ))}
          </motion.g>
        </g>

        {/* Fluffy Anime Sunset Clouds */}
        <motion.g
          animate={{ x: [-15, 25, -15] }}
          transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
        >
          <path
            d="M20 28 C32 16, 60 16, 75 25 C85 14, 115 14, 130 26 C140 22, 160 28, 165 40 C145 46, 40 48, 20 28 Z"
            fill="#FFFFFF"
            opacity="0.5"
          />
        </motion.g>
        <motion.g
          animate={{ x: [20, -20, 20] }}
          transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
        >
          <path
            d="M230 22 C245 12, 275 12, 290 20 C300 12, 330 12, 345 22 C358 20, 375 28, 375 38 C355 44, 250 44, 230 22 Z"
            fill="#FFFFFF"
            opacity="0.55"
          />
        </motion.g>

        {/* Swallows Flying Gently Across the Sky */}
        <motion.g
          animate={{ x: [400, -50], y: [35, 18] }}
          transition={{ duration: 14, repeat: Infinity, ease: 'linear' }}
        >
          <path d="M0 0 Q 6 -5, 12 0 Q 18 -5, 24 0 Q 12 2, 0 0 Z" fill="#312E81" />
          <path d="M-18 8 Q -13 4, -8 8 Q -3 4, 2 8 Q -8 9, -18 8 Z" fill="#312E81" opacity="0.8" />
          <path d="M16 12 Q 20 8, 24 12 Q 28 8, 32 12 Q 24 13, 16 12 Z" fill="#312E81" opacity="0.7" />
        </motion.g>

        {/* Paper Plane of Dreams Banking Through the Sunset */}
        <motion.g
          animate={{
            x: [-30, 120, 250, 420],
            y: [52, 28, 45, 22],
            rotate: [6, -10, 12, -4],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
        >
          <path d="M-18 3 C-10 1, -2 4, 4 2" stroke="#FFFFFF" strokeWidth="1" strokeDasharray="2 3" fill="none" opacity="0.7" />
          <polygon points="0,0 16,-5 12,4" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="0.8" />
          <polygon points="0,0 16,-5 7,-1" fill="#E0F2FE" />
        </motion.g>

        {/* -----------------------------------------------------------------
            2. DISTANT CAMPUS / CITY BUILDINGS
            ----------------------------------------------------------------- */}
        <polygon points="12,50 46,32 55,40 20,60" fill="#CBD5E1" />
        <polygon points="20,60 55,40 55,125 20,138" fill="#64748B" />
        <polygon points="12,50 20,60 20,138 12,130" fill="#475569" />
        {[50, 68, 86, 104].map((yVal, idx) => (
          <polygon key={idx} points={`24,${yVal} 51,${yVal - 14} 51,${yVal - 5} 24,${yVal + 9}`} fill="#38BDF8" opacity="0.85" />
        ))}

        <polygon points="340,32 374,50 365,60 332,40" fill="#CBD5E1" />
        <polygon points="332,40 365,60 365,138 332,125" fill="#64748B" />
        <polygon points="365,60 374,50 374,130 365,138" fill="#475569" />
        {[50, 68, 86, 104].map((yVal, idx) => (
          <polygon key={idx} points={`336,${yVal - 14} 362,${yVal} 362,${yVal + 9} 336,${yVal - 5}`} fill="#38BDF8" opacity="0.85" />
        ))}

        {/* -----------------------------------------------------------------
            3. MAIN SCHOOL COMPLEX: PKBM BINA INSANI
            ----------------------------------------------------------------- */}
        <g id="grand-school-building">
          {/* Left Wing Facade */}
          <rect x="42" y="86" width="104" height="66" fill="url(#scBldgYellow)" stroke="#B45309" strokeWidth="1" />
          <polygon points="36,86 150,86 150,93 36,93" fill="url(#scRoofRed)" />
          <line x1="36" y1="93" x2="150" y2="93" stroke="#FFFFFF" strokeWidth="1.2" />
          {[0, 1, 2, 3].map((col) => (
            <g key={col}>
              <rect x={50 + col * 23} y={98} width="16" height="16" rx="1.5" fill="url(#scWindowGrad)" stroke="#FFFFFF" strokeWidth="1.2" />
              <line x1={50 + col * 23 + 8} y1={98} x2={50 + col * 23 + 8} y2={114} stroke="#FFFFFF" strokeWidth="0.8" />
              <line x1={50 + col * 23} y1={106} x2={50 + col * 23 + 16} y2={106} stroke="#FFFFFF" strokeWidth="0.8" />

              <rect x={50 + col * 23} y={122} width="16" height="16" rx="1.5" fill="url(#scWindowGrad)" stroke="#FFFFFF" strokeWidth="1.2" />
              <line x1={50 + col * 23 + 8} y1={122} x2={50 + col * 23 + 8} y2={138} stroke="#FFFFFF" strokeWidth="0.8" />
              <line x1={50 + col * 23} y1={130} x2={50 + col * 23 + 16} y2={130} stroke="#FFFFFF" strokeWidth="0.8" />
            </g>
          ))}

          {/* Right Wing Facade */}
          <rect x="244" y="86" width="104" height="66" fill="url(#scBldgYellow)" stroke="#B45309" strokeWidth="1" />
          <polygon points="244,86 354,86 354,93 244,93" fill="url(#scRoofRed)" />
          <line x1="244" y1="93" x2="354" y2="93" stroke="#FFFFFF" strokeWidth="1.2" />
          {[0, 1, 2, 3].map((col) => (
            <g key={col}>
              <rect x={252 + col * 23} y={98} width="16" height="16" rx="1.5" fill="url(#scWindowGrad)" stroke="#FFFFFF" strokeWidth="1.2" />
              <line x1={252 + col * 23 + 8} y1={98} x2={252 + col * 23 + 8} y2={114} stroke="#FFFFFF" strokeWidth="0.8" />
              <line x1={252 + col * 23} y1={106} x2={252 + col * 23 + 16} y2={106} stroke="#FFFFFF" strokeWidth="0.8" />

              <rect x={252 + col * 23} y={122} width="16" height="16" rx="1.5" fill="url(#scWindowGrad)" stroke="#FFFFFF" strokeWidth="1.2" />
              <line x1={252 + col * 23 + 8} y1={122} x2={252 + col * 23 + 8} y2={138} stroke="#FFFFFF" strokeWidth="0.8" />
              <line x1={252 + col * 23} y1={130} x2={252 + col * 23 + 16} y2={130} stroke="#FFFFFF" strokeWidth="0.8" />
            </g>
          ))}

          {/* Central Clock Tower */}
          <rect x="144" y="58" width="102" height="94" fill="url(#scBldgYellow)" stroke="#B45309" strokeWidth="1.2" />
          <rect x="144" y="58" width="4" height="94" fill="#FFFBEB" />
          <rect x="242" y="58" width="4" height="94" fill="#FFFBEB" />

          {/* Triangular Red Roof of Clock Tower */}
          <polygon points="136,60 195,20 254,60" fill="url(#scRoofRed)" stroke="#7F1D1D" strokeWidth="1" />
          <line x1="136" y1="60" x2="195" y2="20" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="195" y1="20" x2="254" y2="60" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" />
          <polygon points="146,58 195,26 244,58" fill="#FFFBEB" opacity="0.9" />

          {/* Menara Lonceng Emas di Puncak Roof */}
          <motion.g
            transform="translate(195, 16)"
            animate={{ rotate: [-10, 10, -10] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            style={{ transformOrigin: '0px -6px' }}
          >
            <path d="M-4 0 L4 0 L6 8 L-6 8 Z" fill="#FBBF24" stroke="#D97706" strokeWidth="0.8" />
            <circle cx="0" cy="8" r="1.8" fill="#B45309" />
          </motion.g>
          {/* Musical Notes Floating from the Bell */}
          <motion.text
            x="203"
            y="14"
            fill="#D97706"
            fontSize="9"
            fontWeight="bold"
            animate={{ y: [14, 4, -4], opacity: [0, 1, 0], x: [203, 209, 215] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: 'easeOut' }}
          >
            ♫
          </motion.text>
          <motion.text
            x="183"
            y="16"
            fill="#168A5B"
            fontSize="8"
            fontWeight="bold"
            animate={{ y: [16, 6, -2], opacity: [0, 1, 0], x: [183, 177, 173] }}
            transition={{ duration: 2.8, repeat: Infinity, ease: 'easeOut', delay: 0.8 }}
          >
            ♪
          </motion.text>

          {/* Analog Clock on Tower with Smooth Rotating Seconds Hand */}
          <g id="tower-clock" transform="translate(195, 44)">
            <circle cx="0" cy="0" r="13" fill="#FFFFFF" stroke="#0F172A" strokeWidth="1.8" />
            {[0, 90, 180, 270].map((deg) => (
              <line
                key={deg}
                x1={8 * Math.sin((deg * Math.PI) / 180)}
                y1={-8 * Math.cos((deg * Math.PI) / 180)}
                x2={10 * Math.sin((deg * Math.PI) / 180)}
                y2={-10 * Math.cos((deg * Math.PI) / 180)}
                stroke="#0F172A"
                strokeWidth="1.2"
              />
            ))}
            <line x1="0" y1="0" x2="-5" y2="2.5" stroke="#0F172A" strokeWidth="1.6" strokeLinecap="round" />
            <motion.line
              x1="0"
              y1="0"
              x2="0"
              y2="-7.5"
              stroke="#DC2626"
              strokeWidth="1.2"
              strokeLinecap="round"
              animate={{ rotate: 360 }}
              transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
              style={{ transformOrigin: '0px 0px' }}
            />
            <circle cx="0" cy="0" r="1.5" fill="#0F172A" />
          </g>

          {/* OFFICIAL SIGNBOARD: "PKBM BINA INSANI" */}
          <rect x="150" y="65" width="90" height="15" rx="3.5" fill="#168A5B" stroke="#065F46" strokeWidth="1" />
          <rect x="152" y="67" width="86" height="11" rx="2" fill="none" stroke="#6EE7B7" strokeWidth="0.8" opacity="0.7" />
          <text x="195" y="74.5" fill="#FFFFFF" fontSize="6.2" fontWeight="900" textAnchor="middle" letterSpacing="0.6">
            PKBM BINA INSANI
          </text>
          <text x="195" y="79" fill="#FEF08A" fontSize="3.8" fontWeight="800" textAnchor="middle" letterSpacing="0.4">
            HEBAT • MANDIRI • KREATIF
          </text>

          {/* Central Tower Windows */}
          {[0, 1, 2].map((col) => (
            <g key={col}>
              <rect x={154 + col * 26} y={88} width="18" height="16" rx="1.5" fill="url(#scWindowGrad)" stroke="#FFFFFF" strokeWidth="1.2" />
              <line x1={154 + col * 26 + 9} y1={88} x2={154 + col * 26 + 9} y2={104} stroke="#FFFFFF" strokeWidth="0.8" />
              <line x1={154 + col * 26} y1={96} x2={154 + col * 26 + 18} y2={96} stroke="#FFFFFF" strokeWidth="0.8" />
            </g>
          ))}

          {/* Main Entrance Porch */}
          <polygon points="146,114 244,114 240,122 150,122" fill="url(#scRoofRed)" />
          <line x1="146" y1="122" x2="244" y2="122" stroke="#FFFFFF" strokeWidth="1.5" />
          <rect x="152" y="122" width="6" height="30" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="0.8" />
          <rect x="232" y="122" width="6" height="30" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="0.8" />
          <rect x="171" y="124" width="48" height="28" rx="1.5" fill="#5F1E14" stroke="#3D120B" strokeWidth="1" />
          <rect x="174" y="127" width="19" height="22" fill="#8B2C1C" />
          <rect x="197" y="127" width="19" height="22" fill="#8B2C1C" />
          <rect x="177" y="130" width="13" height="9" fill="#BAE6FD" opacity="0.8" />
          <rect x="200" y="130" width="13" height="9" fill="#BAE6FD" opacity="0.8" />
          <circle cx="191" cy="140" r="1.2" fill="#FDE047" />
          <circle cx="199" cy="140" r="1.2" fill="#FDE047" />

          {/* Tiered Entry Steps */}
          <polygon points="144,152 246,152 250,156 140,156" fill="#E2E8F0" />
          <polygon points="140,156 250,156 254,160 136,160" fill="#CBD5E1" />
        </g>

        {/* -----------------------------------------------------------------
            4. TOKOH DI TERAS DEPAN: GURU RAMAH & SISWA MENYAPA DI TANGGA
            ----------------------------------------------------------------- */}
        {/* Guru / Tutor Ramah di Pintu Teras Menyambut Siswa */}
        <g id="teacher-welcoming" transform="translate(162, 134)">
          {/* Tubuh Guru (Batik Blazer Cokelat Rapi) */}
          <rect x="0" y="8" width="9" height="15" rx="2" fill="#047857" stroke="#065F46" strokeWidth="0.6" />
          <rect x="1" y="19" width="7" height="4" fill="#0F172A" />
          {/* Kaki Guru */}
          <rect x="1.5" y="23" width="2.5" height="5" fill="#1E293B" />
          <rect x="5" y="23" width="2.5" height="5" fill="#1E293B" />
          <rect x="1" y="28" width="3.5" height="1.5" fill="#0F172A" />
          <rect x="4.5" y="28" width="3.5" height="1.5" fill="#0F172A" />
          {/* Kepala Guru & Jilbab/Rambut Rapi */}
          <circle cx="4.5" cy="4" r="4.2" fill="#FED7AA" />
          <circle cx="4.5" cy="3.5" r="4.6" fill="#065F46" />
          <circle cx="4.5" cy="4.2" r="3.2" fill="#FED7AA" />
          {/* Senyum Ramah Guru */}
          <path d="M3.2 5.5 Q 4.5 6.8, 5.8 5.5" stroke="#B91C1C" strokeWidth="0.8" strokeLinecap="round" fill="none" />
          <circle cx="3.2" cy="4.2" r="0.6" fill="#0F172A" />
          <circle cx="5.8" cy="4.2" r="0.6" fill="#0F172A" />
          {/* Map Kerja / Clipboard di Tangan Kiri */}
          <rect x="-3" y="12" width="3.5" height="6" rx="0.5" fill="#D97706" />
          <line x1="-2" y1="14" x2="-0.5" y2="14" stroke="#FFFFFF" strokeWidth="0.5" />
          <line x1="-2" y1="16" x2="-0.5" y2="16" stroke="#FFFFFF" strokeWidth="0.5" />
          {/* Lengan Kanan Guru Melambai Hangat Menyambut Siswa */}
          <motion.g
            animate={{ rotate: [-10, 20, -10] }}
            transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
            style={{ transformOrigin: '8px 9px' }}
          >
            <line x1="8" y1="9" x2="13" y2="4" stroke="#047857" strokeWidth="2.4" strokeLinecap="round" />
            <circle cx="13" cy="4" r="1.4" fill="#FED7AA" />
          </motion.g>
        </g>

        {/* Siswa Lain Menaiki Tangga Sekolah */}
        <g id="student-entering-steps" transform="translate(222, 142)">
          {/* Kaki menaiki tangga */}
          <path d="M1 14 L3 10 L5 10 L5 16" stroke="#1D4ED8" strokeWidth="2" strokeLinecap="round" fill="none" />
          <path d="M6 14 L7 12 L9 12 L9 16" stroke="#1D4ED8" strokeWidth="2" strokeLinecap="round" fill="none" />
          {/* Badan Kemeja Putih */}
          <rect x="1" y="4" width="8" height="9" rx="1.5" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="0.5" />
          {/* Ransel Biru di Punggung */}
          <rect x="6" y="5" width="4" height="7" rx="1.5" fill="#0284C7" />
          {/* Kepala Tampak Belakang/Samping */}
          <circle cx="5" cy="1" r="3.2" fill="#1E293B" />
          <circle cx="5" cy="2" r="2.8" fill="#FED7AA" />
          <path d="M3 0 C3 -2, 7 -2, 7 0 C7 2, 3 2, 3 0 Z" fill="#1E293B" />
        </g>

        {/* -----------------------------------------------------------------
            5. TIANG BENDERA MERAH PUTIH BERKIBAR MEGAH
            ----------------------------------------------------------------- */}
        <g id="flag-merah-putih" transform="translate(112, 108)">
          <circle cx="2" cy="0" r="2.4" fill="#F59E0B" />
          <line x1="2" y1="0" x2="2" y2="52" stroke="#94A3B8" strokeWidth="1.8" strokeLinecap="round" />
          <motion.g
            animate={{
              skewY: [-4, 4, -4],
              scaleY: [0.96, 1.04, 0.96],
            }}
            transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
            style={{ transformOrigin: '2px 2px' }}
          >
            <path d="M2 2 Q 14 -1, 26 2 L26 12 Q 14 9, 2 12 Z" fill="#EF4444" />
            <path d="M2 12 Q 14 9, 2 12 L2 22 Q 14 19, 2 22 Z" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="0.5" />
          </motion.g>
        </g>

        {/* -----------------------------------------------------------------
            6. JALAN RAYA TENGAH & BUS SEKOLAH KUNING MELINTAS
            ----------------------------------------------------------------- */}
        <polygon points="0,158 390,158 390,174 0,174" fill="#94A3B8" />
        <line x1="0" y1="166" x2="390" y2="166" stroke="#FEF08A" strokeWidth="1.2" strokeDasharray="8 6" opacity="0.85" />

        {/* Bus Sekolah Kuning melintas */}
        <motion.g
          animate={{ x: [-70, 430] }}
          transition={{ duration: 14, repeat: Infinity, ease: 'linear' }}
        >
          <g transform="translate(0, 150)">
            <ellipse cx="26" cy="18" rx="26" ry="2.5" fill="#0F172A" opacity="0.25" />
            <rect x="0" y="2" width="52" height="15" rx="3.5" fill="url(#scBusGrad)" stroke="#B45309" strokeWidth="0.8" />
            <rect x="0" y="0" width="52" height="3" rx="1.5" fill="#FFFFFF" />
            <rect x="4" y="4" width="8" height="6" rx="1" fill="#E0F2FE" />
            <rect x="15" y="4" width="8" height="6" rx="1" fill="#E0F2FE" />
            <rect x="26" y="4" width="8" height="6" rx="1" fill="#E0F2FE" />
            <rect x="37" y="4" width="10" height="8" rx="1" fill="#BAE6FD" />
            <rect x="0" y="12" width="52" height="2" fill="#168A5B" />
            <polygon points="50,10 65,7 65,16 50,13" fill="#FEF08A" opacity="0.35" />
            <circle cx="50" cy="11.5" r="1.5" fill="#FEF08A" />
            {/* Spinning wheels */}
            <motion.g
              transform="translate(12, 16)"
              animate={{ rotate: 360 }}
              transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
            >
              <circle cx="0" cy="0" r="3.5" fill="#1E293B" />
              <circle cx="0" cy="0" r="1.5" fill="#E2E8F0" />
            </motion.g>
            <motion.g
              transform="translate(40, 16)"
              animate={{ rotate: 360 }}
              transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
            >
              <circle cx="0" cy="0" r="3.5" fill="#1E293B" />
              <circle cx="0" cy="0" r="1.5" fill="#E2E8F0" />
            </motion.g>
          </g>
        </motion.g>

        {/* -----------------------------------------------------------------
            7. NATURE, LAWN & COURTYARD GARDEN
            ----------------------------------------------------------------- */}
        <polygon points="0,172 390,172 390,260 0,260" fill="url(#scLawnGrad)" />

        {/* Stepping Stone Garden Path */}
        <g id="stepping-stones">
          <path d="M176 173 Q 190 172, 198 174 Q 202 178, 192 180 Q 178 180, 174 176 Z" fill="url(#scStoneGrad)" />
          <path d="M164 182 Q 184 180, 196 183 Q 200 188, 188 191 Q 166 191, 160 186 Z" fill="url(#scStoneGrad)" />
          <path d="M152 193 Q 178 191, 192 195 Q 196 201, 180 204 Q 154 204, 148 198 Z" fill="url(#scStoneGrad)" />
        </g>

        {/* Pohon Rindang Kiri dengan Daun Bergoyang */}
        <g id="tree-left">
          <path d="M-10 260 Q 24 240, 26 195 Q 28 170, 10 156" stroke="#78350F" strokeWidth="14" strokeLinecap="round" fill="none" />
          <path d="M26 195 Q 46 182, 54 168" stroke="#78350F" strokeWidth="7" strokeLinecap="round" fill="none" />
          <motion.g
            animate={{ rotate: [-2, 2, -2] }}
            transition={{ duration: 4.8, repeat: Infinity, ease: 'easeInOut' }}
            style={{ transformOrigin: '20px 165px' }}
          >
            <circle cx="8" cy="136" r="32" fill="#15803D" />
            <circle cx="44" cy="146" r="28" fill="#16A34A" />
            <circle cx="-12" cy="156" r="30" fill="#16A34A" />
            <circle cx="28" cy="124" r="26" fill="#22C55E" />
            <circle cx="68" cy="166" r="22" fill="#16A34A" />
          </motion.g>
        </g>

        {/* -----------------------------------------------------------------
            8. SISWA DUDUK DI BANGKU TAMAN MEMBACA BUKU (COURTYARD BENCH)
            ----------------------------------------------------------------- */}
        <g id="garden-bench-reader" transform="translate(42, 182)">
          {/* Bayangan Bangku */}
          <ellipse cx="14" cy="22" rx="16" ry="2.5" fill="#0F172A" opacity="0.2" />

          {/* Bangku Taman Kayu Cantik */}
          <line x1="0" y1="12" x2="28" y2="12" stroke="#78350F" strokeWidth="3" strokeLinecap="round" />
          <line x1="2" y1="6" x2="26" y2="6" stroke="#9A3412" strokeWidth="2" strokeLinecap="round" />
          <line x1="4" y1="12" x2="3" y2="22" stroke="#1E293B" strokeWidth="1.8" />
          <line x1="24" y1="12" x2="25" y2="22" stroke="#1E293B" strokeWidth="1.8" />
          <line x1="4" y1="6" x2="4" y2="12" stroke="#1E293B" strokeWidth="1.5" />
          <line x1="24" y1="6" x2="24" y2="12" stroke="#1E293B" strokeWidth="1.5" />

          {/* Siswa Sedang Duduk Santai Membaca */}
          <g transform="translate(9, -6)">
            {/* Kaki Bergoyang Santai */}
            <rect x="2" y="14" width="3" height="7" fill="#1D4ED8" />
            <motion.g
              animate={{ rotate: [-8, 8, -8] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
              style={{ transformOrigin: '3.5px 19px' }}
            >
              <rect x="2" y="19" width="3" height="6" rx="1" fill="#1D4ED8" />
              <rect x="2" y="24" width="4" height="2" fill="#0F172A" />
            </motion.g>
            <rect x="6" y="14" width="3" height="11" rx="1" fill="#1E3A8A" />
            <rect x="6" y="24" width="4" height="2" fill="#0F172A" />

            {/* Badan Kemeja Putih */}
            <rect x="1" y="6" width="9" height="10" rx="2" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="0.6" />
            {/* Kepala Sedikit Menunduk Membaca */}
            <circle cx="5.5" cy="2.5" r="4" fill="#FED7AA" />
            <path d="M2.5 0 C2.5 -2.5, 8.5 -2.5, 8.5 0 C8.5 2, 7 4, 3 3 Z" fill="#1E293B" />
            {/* Mata Melirik ke Buku */}
            <circle cx="6.5" cy="3" r="0.7" fill="#0F172A" />
            <path d="M5.5 5 Q 6.5 6, 7.5 5" stroke="#DC2626" strokeWidth="0.7" fill="none" />

            {/* Buku Terbuka di Tangan */}
            <motion.g
              animate={{ rotate: [-2, 2, -2] }}
              transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
              style={{ transformOrigin: '5px 10px' }}
            >
              <path d="M5 8 L10 10 L10 16 L5 14 Z" fill="#38BDF8" stroke="#0284C7" strokeWidth="0.6" />
              <path d="M10 10 L15 8 L15 14 L10 16 Z" fill="#E0F2FE" stroke="#0284C7" strokeWidth="0.6" />
              <line x1="10" y1="10" x2="10" y2="16" stroke="#0369A1" strokeWidth="0.8" />
            </motion.g>

            {/* Lampu Inspirasi/Ide Berpendar di Atas Siswa yang Membaca */}
            <motion.g
              transform="translate(14, -4)"
              animate={{ scale: [0.8, 1.2, 0.8], opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            >
              <circle cx="0" cy="0" r="2.5" fill="#FDE047" />
              <line x1="0" y1="-4" x2="0" y2="-3" stroke="#F59E0B" strokeWidth="0.8" />
              <line x1="3" y1="0" x2="4" y2="0" stroke="#F59E0B" strokeWidth="0.8" />
            </motion.g>
          </g>
        </g>

        {/* Lampu Taman Klasik Kampus (Victorian Campus Lamppost) */}
        <g id="campus-lamppost" transform="translate(292, 160)">
          <ellipse cx="4" cy="46" rx="6" ry="1.8" fill="#0F172A" opacity="0.25" />
          <rect x="3" y="10" width="2" height="36" fill="#1E293B" />
          <polygon points="1,46 7,46 5,42 3,42" fill="#0F172A" />
          <polygon points="1,12 7,12 5,9 3,9" fill="#0F172A" />
          {/* Lentera Emas Bercahaya */}
          <polygon points="0,4 8,4 6,9 2,9" fill="#FBBF24" />
          <polygon points="1,4 7,4 6,-1 2,-1" fill="#FEF08A" opacity="0.9" filter="url(#scLampGlow)" />
          <circle cx="4" cy="2" r="4" fill="#FEF08A" opacity="0.35" filter="url(#scLampGlow)" />
          <line x1="4" y1="-1" x2="4" y2="-3" stroke="#0F172A" strokeWidth="1" />
          <circle cx="4" cy="-3.5" r="1" fill="#D97706" />
        </g>

        {/* Pohon Rindang Kanan dengan Daun Bergoyang */}
        <g id="tree-right">
          <path d="M400 260 Q 370 225, 365 188 Q 362 170, 376 156" stroke="#78350F" strokeWidth="13" strokeLinecap="round" fill="none" />
          <motion.g
            animate={{ rotate: [2, -2, 2] }}
            transition={{ duration: 5.2, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
            style={{ transformOrigin: '365px 170px' }}
          >
            <circle cx="370" cy="140" r="30" fill="#15803D" />
            <circle cx="340" cy="150" r="26" fill="#16A34A" />
            <circle cx="390" cy="160" r="28" fill="#16A34A" />
            <circle cx="355" cy="128" r="24" fill="#22C55E" />
            <circle cx="320" cy="165" r="20" fill="#16A34A" />
          </motion.g>
        </g>

        {/* Foreground Walking Pavement Path (Jalan Setapak Utama yang Ramai) */}
        <polygon points="0,210 390,210 390,260 0,260" fill="url(#scPavementGrad)" opacity="0.96" />
        <line x1="0" y1="210" x2="390" y2="210" stroke="#E2E8F0" strokeWidth="2" />
        <line x1="0" y1="214" x2="390" y2="214" stroke="#64748B" strokeWidth="1" strokeDasharray="16 8" opacity="0.4" />

        {/* Bunga-bunga Segar Berwarna-warni di Sepanjang Jalur Taman */}
        {[
          { x: 18, y: 206, color: '#F43F5E' },
          { x: 30, y: 204, color: '#FBBF24' },
          { x: 92, y: 207, color: '#EC4899' },
          { x: 104, y: 205, color: '#F43F5E' },
          { x: 268, y: 205, color: '#FBBF24' },
          { x: 280, y: 207, color: '#EC4899' },
          { x: 355, y: 206, color: '#F43F5E' },
          { x: 368, y: 204, color: '#38BDF8' },
        ].map((flw, idx) => (
          <g key={idx} transform={`translate(${flw.x}, ${flw.y})`}>
            <circle cx="0" cy="0" r="3" fill={flw.color} />
            <circle cx="0" cy="0" r="1.2" fill="#FEF08A" />
            <path d="M0 3 L0 7" stroke="#15803D" strokeWidth="1.2" />
          </g>
        ))}

        {/* Kupu-kupu Mungil Berterbangan di Atas Taman */}
        <motion.g
          animate={{
            x: [80, 110, 85, 75],
            y: [195, 185, 198, 192],
          }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        >
          <motion.ellipse
            cx="-2"
            cy="0"
            rx="2.5"
            ry="1.5"
            fill="#EC4899"
            animate={{ scaleX: [1, 0.2, 1] }}
            transition={{ duration: 0.25, repeat: Infinity }}
          />
          <motion.ellipse
            cx="2"
            cy="0"
            rx="2.5"
            ry="1.5"
            fill="#EC4899"
            animate={{ scaleX: [1, 0.2, 1] }}
            transition={{ duration: 0.25, repeat: Infinity }}
          />
        </motion.g>

        {/* Daun-daun Berguguran Melayang Lembut */}
        {[
          { x: 35, y: 140, dur: 6, del: 0 },
          { x: 95, y: 160, dur: 7, del: 1.8 },
          { x: 285, y: 150, dur: 6.5, del: 0.8 },
          { x: 340, y: 170, dur: 7.2, del: 2.5 },
        ].map((leaf, idx) => (
          <motion.g
            key={idx}
            animate={{
              x: [leaf.x, leaf.x - 60, leaf.x - 120],
              y: [leaf.y, leaf.y + 40, leaf.y + 80],
              rotate: [0, 180, 360],
              opacity: [0, 0.9, 0],
            }}
            transition={{ duration: leaf.dur, repeat: Infinity, ease: 'easeInOut', delay: leaf.del }}
          >
            <ellipse cx="0" cy="0" rx="3" ry="1.5" fill="#4ADE80" transform="rotate(25)" />
          </motion.g>
        ))}

        {/* -----------------------------------------------------------------
            9. PEJALAN KAKI SEBERANG (SISWI BERJALAN DARI KANAN KE KIRI)
               Menciptakan Suasana Ramai Saling Berpapasan di Halaman Sekolah!
            ----------------------------------------------------------------- */}
        <motion.g
          id="student-walking-left"
          animate={{ x: [420, -80] }}
          transition={{
            duration: 17,
            repeat: Infinity,
            ease: 'linear',
            delay: 1,
          }}
        >
          {/* Bayangan Langkah Siswi yang Berjalan ke Kiri */}
          <ellipse cx="12" cy="242" rx="14" ry="3" fill="#0F172A" opacity="0.18" />

          <g transform="translate(10, 174)">
            {/* Pantulan Langkah Berjalan */}
            <motion.g
              animate={{ y: [0, -3, 0, -3, 0] }}
              transition={{ duration: 0.8, repeat: Infinity, ease: 'easeInOut' }}
            >
              {/* Kaki Berjalan ke Kiri (Menghadap Kiri) */}
              <motion.g
                animate={{ rotate: [-20, 20, -20] }}
                transition={{ duration: 0.8, repeat: Infinity, ease: 'easeInOut' }}
                style={{ transformOrigin: '4px 44px' }}
              >
                <rect x="2" y="44" width="4.5" height="15" rx="1.5" fill="#FDBA74" />
                <rect x="1.5" y="55" width="5.5" height="6" fill="#FFFFFF" />
                <path d="M-1 61 L9 61 L9 65 L-1 65 Z" fill="#0F172A" />
              </motion.g>

              <motion.g
                animate={{ rotate: [20, -20, 20] }}
                transition={{ duration: 0.8, repeat: Infinity, ease: 'easeInOut' }}
                style={{ transformOrigin: '7px 44px' }}
              >
                <rect x="5" y="44" width="4.5" height="15" rx="1.5" fill="#FED7AA" />
                <rect x="4.5" y="55" width="5.5" height="6" fill="#FFFFFF" />
                <path d="M2 61 L12 61 L12 65 L2 65 Z" fill="#0F172A" />
              </motion.g>

              {/* Rok Panjang Biru / Rok Seragam */}
              <polygon points="1,34 11,34 14,46 -2,46" fill="url(#scNavyGrad)" />

              {/* Badan Seragam Putih */}
              <rect x="0" y="20" width="12" height="15" rx="2" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="0.8" />
              {/* Kerudung/Hijab Modern Rapi Warna Peach Pastel */}
              <path d="M-1 12 C-1 6, 12 6, 12 12 L12 24 L-1 24 Z" fill="#FDBA74" />
              <ellipse cx="5.5" cy="14" rx="4" ry="4.5" fill="#FED7AA" />
              <path d="M2 12 Q 5.5 8, 9 12" stroke="#F97316" strokeWidth="1.2" fill="none" />
              {/* Wajah Tampak Samping Kiri */}
              <circle cx="3" cy="14" r="0.8" fill="#0F172A" />
              <path d="M2.5 16.5 Q 4 17.5, 5.5 16.5" stroke="#DC2626" strokeWidth="0.8" fill="none" />
              {/* Tas Punggung Pastel */}
              <rect x="10" y="22" width="5" height="12" rx="2" fill="#F472B6" />
            </motion.g>
          </g>
        </motion.g>

        {/* -----------------------------------------------------------------
            10. GRUP TIGA SISWA UTAMA BERJALAN KE SAMPING (KIRI KE KANAN)
                - Siswa 1: Laki-laki beransel hitam gagah & rapi.
                - Siswa 2: Siswi manis rok lipit dengan tas selempang.
                - Siswa 3: Sahabat ceria memegang buku & folder pelajaran.
                Berjalan beriringan dengan langkah teratur dan hidup!
            ----------------------------------------------------------------- */}
        <motion.g
          id="trio-students-walking-right"
          animate={{ x: [-120, 420] }}
          transition={{
            duration: 13.5,
            repeat: Infinity,
            ease: 'linear',
          }}
        >
          {/* Bayangan Langkah Kaki Bersama di Atas Jalan Pavement */}
          <ellipse cx="64" cy="246" rx="55" ry="5.5" fill="#0F172A" opacity="0.24" />

          {/* ===============================================================
              TOKOH 1: SISWA LAKI-LAKI (BOY) - BERJALAN TEGAP & CERIA
              =============================================================== */}
          <g id="boy-1" transform="translate(16, 172)">
            {/* Pantulan Tubuh Saat Berjalan (Bobbing Motion) */}
            <motion.g
              animate={{ y: [0, -3.5, 0, -3.5, 0] }}
              transition={{ duration: 0.75, repeat: Infinity, ease: 'easeInOut' }}
            >
              {/* Tas Ransel Hitam di Punggung (Di Belakang Badan saat Hadap Kanan) */}
              <rect x="-8" y="24" width="13" height="24" rx="5" fill="#0F172A" stroke="#334155" strokeWidth="1" />
              <rect x="-10" y="28" width="4" height="14" rx="2" fill="#1E293B" />

              {/* KAKI BELAKANG (LEFT LEG - NAVY PANTS) */}
              <motion.g
                animate={{ rotate: [-24, 24, -24] }}
                transition={{ duration: 0.75, repeat: Infinity, ease: 'easeInOut' }}
                style={{ transformOrigin: '7px 48px' }}
              >
                <path d="M4 48 L10 48 L12 69 L5 69 Z" fill="#1D4ED8" />
                <path d="M4 69 L15 69 L15 74 L3 74 Z" fill="#0F172A" />
                <rect x="3" y="72" width="12" height="2" fill="#FFFFFF" />
              </motion.g>

              {/* KAKI DEPAN (RIGHT LEG - BERLAWANAN ARAH LANGKAH) */}
              <motion.g
                animate={{ rotate: [24, -24, 24] }}
                transition={{ duration: 0.75, repeat: Infinity, ease: 'easeInOut' }}
                style={{ transformOrigin: '11px 48px' }}
              >
                <path d="M8 48 L15 48 L17 69 L9 69 Z" fill="url(#scNavyGrad)" />
                <path d="M8 69 L19 69 L19 74 L7 74 Z" fill="#0F172A" />
                <rect x="7" y="72" width="12" height="2" fill="#FFFFFF" />
              </motion.g>

              {/* Badan: Kemeja Seragam Putih Siswa */}
              <rect x="2" y="22" width="16" height="26" rx="3" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="0.8" />
              <rect x="2" y="44" width="16" height="4.5" fill="#0F172A" />
              <rect x="8" y="44" width="4" height="4.5" fill="#E2E8F0" />
              <polygon points="10,22 18,22 15,27 10,24" fill="#F1F5F9" stroke="#CBD5E1" strokeWidth="0.6" />
              <path d="M3 24 Q 7 30, 8 44" stroke="#0F172A" strokeWidth="2.5" strokeLinecap="round" fill="none" />

              {/* Lengan Depan Berayun Alami Memegang Tali Ransel */}
              <motion.g
                animate={{ rotate: [-16, 20, -16] }}
                transition={{ duration: 0.75, repeat: Infinity, ease: 'easeInOut' }}
                style={{ transformOrigin: '8px 24px' }}
              >
                <path d="M7 24 L14 36 L11 40" stroke="#FFFFFF" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                <circle cx="11" cy="40" r="3" fill="#FED7AA" />
              </motion.g>

              {/* Kepala Siswa Hadap Samping Kanan */}
              <g transform="translate(10, 11)">
                <circle cx="0" cy="0" r="10.5" fill="#FED7AA" />
                <path d="M9 -1 L12 1 L9 3" stroke="#FDBA74" strokeWidth="1.2" strokeLinecap="round" fill="none" />
                <circle cx="4" cy="3" r="2.5" fill="#F87171" opacity="0.45" />
                <path
                  d="M-10 -2 C-10 -13, 8 -13, 10 -2 C10 1, 9 3, 7 3 C4 -2, -1 -3, -4 4 C-7 5, -10 3, -10 -2 Z"
                  fill="#1E293B"
                />
                <path d="M-10 -2 C-10 6, -5 6, -5 -2 Z" fill="#1E293B" />
                <polygon points="2,-7 11,-2 6,1" fill="#1E293B" />
                <motion.circle
                  cx="5"
                  cy="-1"
                  r="1.8"
                  fill="#0F172A"
                  animate={{ scaleY: [1, 0.1, 1] }}
                  transition={{ duration: 3.2, repeat: Infinity, times: [0, 0.05, 0.1] }}
                />
                <circle cx="5.6" cy="-1.6" r="0.7" fill="#FFFFFF" />
                <path d="M4 4 Q 7 7, 9 4" stroke="#DC2626" strokeWidth="1.4" strokeLinecap="round" fill="none" />
              </g>
            </motion.g>
          </g>

          {/* ===============================================================
              TOKOH 2: SISWI PEREMPUAN (GIRL) - BERJALAN ANGGUN DENGAN ROK LIPIT
              =============================================================== */}
          <g id="girl-2" transform="translate(56, 175)">
            <motion.g
              animate={{ y: [0, -3.5, 0, -3.5, 0] }}
              transition={{ duration: 0.75, repeat: Infinity, ease: 'easeInOut', delay: 0.1 }}
            >
              {/* Tas Selempang di Pinggul Belakang */}
              <rect x="-6" y="32" width="11" height="13" rx="3" fill="#1E293B" stroke="#0F172A" strokeWidth="0.8" />
              <rect x="-6" y="32" width="11" height="4" rx="1" fill="#475569" />

              {/* KAKI BELAKANG */}
              <motion.g
                animate={{ rotate: [22, -22, 22] }}
                transition={{ duration: 0.75, repeat: Infinity, ease: 'easeInOut' }}
                style={{ transformOrigin: '6px 46px' }}
              >
                <rect x="3" y="46" width="5.5" height="16" rx="2" fill="#FDBA74" />
                <rect x="2.5" y="58" width="6.5" height="7" rx="1.5" fill="#FFFFFF" />
                <path d="M2 65 L12 65 L12 69 L1 69 Z" fill="#0F172A" />
              </motion.g>

              {/* KAKI DEPAN */}
              <motion.g
                animate={{ rotate: [-22, 22, -22] }}
                transition={{ duration: 0.75, repeat: Infinity, ease: 'easeInOut' }}
                style={{ transformOrigin: '10px 46px' }}
              >
                <rect x="7" y="46" width="5.5" height="16" rx="2" fill="#FED7AA" />
                <rect x="6.5" y="58" width="6.5" height="7" rx="1.5" fill="#FFFFFF" />
                <path d="M6 65 L16 65 L16 69 L5 69 Z" fill="#0F172A" />
              </motion.g>

              {/* Rok Lipit Biru Rempel */}
              <motion.g
                animate={{ rotate: [-4, 4, -4] }}
                transition={{ duration: 0.75, repeat: Infinity, ease: 'easeInOut' }}
                style={{ transformOrigin: '7px 34px' }}
              >
                <polygon points="1,34 14,34 18,48 -1,48" fill="url(#scNavyGrad)" />
                <line x1="4" y1="34" x2="3" y2="48" stroke="#1E3A8A" strokeWidth="1" />
                <line x1="8" y1="34" x2="9" y2="48" stroke="#1E3A8A" strokeWidth="1" />
                <line x1="12" y1="34" x2="14" y2="48" stroke="#1E3A8A" strokeWidth="1" />
              </motion.g>

              {/* Badan: Kemeja Seragam Putih Siswi */}
              <rect x="1" y="20" width="14" height="15" rx="3" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="0.8" />
              <polygon points="8,20 15,20 12,24 8,22" fill="#F1F5F9" stroke="#CBD5E1" strokeWidth="0.6" />
              <line x1="6" y1="20" x2="-1" y2="34" stroke="#1E293B" strokeWidth="2" strokeLinecap="round" />

              {/* Lengan Berayun Lembut */}
              <motion.g
                animate={{ rotate: [18, -16, 18] }}
                transition={{ duration: 0.75, repeat: Infinity, ease: 'easeInOut' }}
                style={{ transformOrigin: '7px 22px' }}
              >
                <path d="M6 21 L12 33 L10 37" stroke="#FFFFFF" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                <circle cx="10" cy="37" r="2.8" fill="#FED7AA" />
              </motion.g>

              {/* Kepala Siswi Hadap Samping Kanan */}
              <g transform="translate(8, 10)">
                <circle cx="0" cy="0" r="9.8" fill="#FED7AA" />
                <path d="M8 -1 L10.5 0.5 L8 2" stroke="#FDBA74" strokeWidth="1.2" strokeLinecap="round" fill="none" />
                <circle cx="3" cy="2.5" r="2.5" fill="#F87171" opacity="0.45" />

                <path
                  d="M-9 -2 C-9 -12, 6 -12, 8 -2 C8 2, 7 4, 5 3 C2 -2, -2 -2, -4 4 C-7 5, -9 3, -9 -2 Z"
                  fill="#1E293B"
                />
                <path d="M-9 -2 C-9 8, -4 8, -4 -2 Z" fill="#1E293B" />
                <circle cx="1" cy="-5" r="2" fill="#F43F5E" />

                <motion.g
                  animate={{ scaleY: [1, 0.2, 1] }}
                  transition={{ duration: 3.5, repeat: Infinity, times: [0, 0.06, 0.12] }}
                  style={{ transformOrigin: '4px 0px' }}
                >
                  <path d="M3 -1 Q 5 -3, 7 -1" stroke="#0F172A" strokeWidth="1.6" strokeLinecap="round" fill="none" />
                </motion.g>
                <path d="M3 3.5 Q 5.5 6, 7.5 3.5" stroke="#DC2626" strokeWidth="1.4" strokeLinecap="round" fill="none" />
              </g>
            </motion.g>
          </g>

          {/* ===============================================================
              TOKOH 3: TEMAN CERIA PEMBAWA BUKU & MAP (BOY 3)
              =============================================================== */}
          <g id="boy-3-folder" transform="translate(96, 174)">
            <motion.g
              animate={{ y: [0, -3.5, 0, -3.5, 0] }}
              transition={{ duration: 0.75, repeat: Infinity, ease: 'easeInOut', delay: 0.2 }}
            >
              {/* Kaki Belakang Celana Abu-abu/Biru */}
              <motion.g
                animate={{ rotate: [-20, 20, -20] }}
                transition={{ duration: 0.75, repeat: Infinity, ease: 'easeInOut' }}
                style={{ transformOrigin: '6px 46px' }}
              >
                <path d="M4 46 L9 46 L10 67 L4 67 Z" fill="#3B82F6" />
                <path d="M3 67 L13 67 L13 72 L2 72 Z" fill="#0F172A" />
              </motion.g>

              {/* Kaki Depan */}
              <motion.g
                animate={{ rotate: [20, -20, 20] }}
                transition={{ duration: 0.75, repeat: Infinity, ease: 'easeInOut' }}
                style={{ transformOrigin: '10px 46px' }}
              >
                <path d="M8 46 L14 46 L15 67 L8 67 Z" fill="#1D4ED8" />
                <path d="M7 67 L17 67 L17 72 L6 72 Z" fill="#0F172A" />
              </motion.g>

              {/* Badan: Rompi Hijau Emerald Keren di Atas Kemeja Putih */}
              <rect x="2" y="21" width="15" height="25" rx="3" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="0.8" />
              <path d="M2 23 L2 42 L17 42 L17 23 L12 28 L7 28 Z" fill="#168A5B" />
              <rect x="2" y="42" width="15" height="4" fill="#0F172A" />

              {/* Tangan Kanan Memegang Buku/Dokumen Pelajaran */}
              <motion.g
                animate={{ rotate: [-12, 14, -12] }}
                transition={{ duration: 0.75, repeat: Infinity, ease: 'easeInOut' }}
                style={{ transformOrigin: '7px 24px' }}
              >
                <path d="M7 24 L14 34" stroke="#FFFFFF" strokeWidth="4" strokeLinecap="round" fill="none" />
                {/* Buku / Folder Biru */}
                <rect x="11" y="29" width="10" height="13" rx="1.5" fill="#38BDF8" stroke="#0284C7" strokeWidth="0.8" />
                <rect x="12" y="31" width="8" height="2" fill="#FFFFFF" />
                <rect x="12" y="34" width="6" height="1.5" fill="#E0F2FE" />
                <circle cx="12" cy="36" r="2.5" fill="#FED7AA" />
              </motion.g>

              {/* Kepala Siswa 3 Ceria dengan Kacamata Keren */}
              <g transform="translate(9, 10)">
                <circle cx="0" cy="0" r="10" fill="#FED7AA" />
                {/* Rambut Cokelat Ceria */}
                <path d="M-9 -2 C-9 -12, 7 -12, 9 -2 C9 1, 8 3, 6 2 C3 -2, -1 -2, -3 4 C-6 5, -9 3, -9 -2 Z" fill="#78350F" />
                {/* Kacamata Bulat Pelajar Pintar */}
                <circle cx="4" cy="-0.5" r="3.2" fill="none" stroke="#0F172A" strokeWidth="1" />
                <line x1="7" y1="-0.5" x2="9" y2="-0.5" stroke="#0F172A" strokeWidth="1" />
                <circle cx="4" cy="-0.5" r="1.3" fill="#0F172A" />
                {/* Rona Pipi & Senyum Ceria */}
                <circle cx="3" cy="3" r="2" fill="#F87171" opacity="0.4" />
                <path d="M3 4 Q 6 6.5, 8 4" stroke="#DC2626" strokeWidth="1.2" strokeLinecap="round" fill="none" />
              </g>
            </motion.g>
          </g>

          {/* Not Nada & Bintang Ceria Melayang Mengikuti Ketiga Siswa */}
          <motion.text
            x="36"
            y="168"
            fill="#F59E0B"
            fontSize="10"
            fontWeight="bold"
            animate={{ y: [168, 158, 168], opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
          >
            ♪
          </motion.text>
          <motion.text
            x="84"
            y="164"
            fill="#168A5B"
            fontSize="9"
            fontWeight="bold"
            animate={{ y: [164, 155, 164], opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
          >
            ♫
          </motion.text>
          <motion.g
            transform="translate(118, 162)"
            animate={{ scale: [0.8, 1.3, 0.8], opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut', delay: 0.4 }}
          >
            <polygon points="3,0 4,2 6,3 4,4 3,6 2,4 0,3 2,2" fill="#F43F5E" />
          </motion.g>
        </motion.g>

        {/* -----------------------------------------------------------------
            11. FLOATING SPARKLES (✦) AURA KAMPUS CERDAS
            ----------------------------------------------------------------- */}
        <motion.g
          transform="translate(148, 38)"
          animate={{ scale: [1, 1.4, 1], opacity: [0.3, 1, 0.3], rotate: [0, 90, 0] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
        >
          <polygon points="3,0 4,2 6,3 4,4 3,6 2,4 0,3 2,2" fill="#FDE047" />
        </motion.g>
        <motion.g
          transform="translate(258, 32)"
          animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.9, 0.3], rotate: [0, -90, 0] }}
          transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut', delay: 0.6 }}
        >
          <polygon points="3,0 4,2 6,3 4,4 3,6 2,4 0,3 2,2" fill="#FFFFFF" />
        </motion.g>
      </svg>
    </div>
  );
};
