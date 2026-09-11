import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { LucideIcon, BookOpen, Sparkles, GraduationCap } from 'lucide-react';

/**
 * ============================================================================
 * EDUCATION MOTION SYSTEM - BISA SMART ACADEMY
 * Primary Red: #D62828 | Primary Green: #168A5B
 * Soft Red: #FDECEC    | Soft Green: #E8F5EE
 * ============================================================================
 */

// 1. ANIMASI LEARNING PROGRESS: Mengisi secara smooth dari 0% -> target value saat halaman dibuka
export const AnimatedLearningProgressBar: React.FC<{
  value: number;
  max?: number;
  height?: string;
  variant?: 'green' | 'red' | 'gradient';
  showLabel?: boolean;
  className?: string;
}> = ({
  value,
  max = 100,
  height = 'h-2.5',
  variant = 'gradient',
  showLabel = true,
  className = '',
}) => {
  const [currentProgress, setCurrentProgress] = useState(0);
  const targetPct = Math.min(100, Math.max(0, Math.round((value / max) * 100)));

  useEffect(() => {
    let startTimestamp: number | null = null;
    const duration = 1200; // 1.2 seconds smooth progression

    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const elapsed = timestamp - startTimestamp;
      const progressRatio = Math.min(1, elapsed / duration);
      // Ease out cubic
      const easeOut = 1 - Math.pow(1 - progressRatio, 3);
      setCurrentProgress(Math.round(easeOut * targetPct));

      if (progressRatio < 1) {
        requestAnimationFrame(step);
      }
    };

    const rafId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafId);
  }, [targetPct]);

  let barGradient = 'from-[#168A5B] via-[#2BA468] to-[#D62828]';
  if (variant === 'green') {
    barGradient = 'from-[#168A5B] to-[#2BA468]';
  } else if (variant === 'red') {
    barGradient = 'from-[#D62828] to-[#EF5350]';
  }

  return (
    <div className={`w-full ${className}`}>
      {showLabel && (
        <div className="flex items-center justify-between mb-1.5 text-xs">
          <span className="text-[11px] font-semibold text-slate-500 flex items-center gap-1">
            <BookOpen size={12} className="text-[#168A5B]" />
            Progres Pembelajaran
          </span>
          <span className="text-[11px] font-mono font-bold text-[#168A5B]">
            {currentProgress}%
          </span>
        </div>
      )}
      <div className={`w-full bg-slate-200/80 ${height} rounded-full overflow-hidden p-[1px] border border-slate-300/40 shadow-inner`}>
        <motion.div
          className={`h-full rounded-full bg-gradient-to-r ${barGradient} shadow-xs transition-all duration-75 ease-out`}
          style={{ width: `${currentProgress}%` }}
        />
      </div>
    </div>
  );
};

// 2. ANIMASI BUKU / MODUL: Floating perlahan & halaman sedikit terbuka halus
export const FloatingBookIllustration: React.FC<{ size?: number; className?: string }> = ({
  size = 56,
  className = '',
}) => {
  return (
    <motion.div
      animate={{
        y: [0, -5, 0],
        rotate: [-1, 1, -1],
      }}
      transition={{
        duration: 3.5,
        repeat: Infinity,
        repeatType: 'reverse',
        ease: 'easeInOut',
      }}
      className={`relative inline-flex items-center justify-center select-none ${className}`}
      style={{ width: size, height: size }}
    >
      <svg
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-sm"
      >
        {/* Book Spine & Cover Left */}
        <path
          d="M8 48 C16 45, 28 45, 32 48 L32 18 C28 15, 16 15, 8 18 Z"
          fill="#168A5B"
        />
        {/* Book Cover Right */}
        <path
          d="M56 48 C48 45, 36 45, 32 48 L32 18 C36 15, 48 15, 56 18 Z"
          fill="#116E48"
        />
        {/* Inner Pages Left */}
        <path
          d="M10 45 C18 42, 28 42, 32 45 L32 19 C28 16, 18 16, 10 19 Z"
          fill="#F8FAFC"
        />
        {/* Inner Pages Right */}
        <path
          d="M54 45 C46 42, 36 42, 32 45 L32 19 C36 16, 46 16, 54 19 Z"
          fill="#FFFFFF"
        />
        {/* Soft lines representing text on pages */}
        <line x1="14" y1="24" x2="26" y2="23" stroke="#CBD5E1" strokeWidth="1.2" strokeLinecap="round" />
        <line x1="14" y1="28" x2="28" y2="27" stroke="#CBD5E1" strokeWidth="1.2" strokeLinecap="round" />
        <line x1="14" y1="32" x2="24" y2="31" stroke="#CBD5E1" strokeWidth="1.2" strokeLinecap="round" />
        <line x1="14" y1="36" x2="26" y2="35" stroke="#CBD5E1" strokeWidth="1.2" strokeLinecap="round" />

        <line x1="38" y1="23" x2="50" y2="24" stroke="#CBD5E1" strokeWidth="1.2" strokeLinecap="round" />
        <line x1="36" y1="27" x2="50" y2="28" stroke="#CBD5E1" strokeWidth="1.2" strokeLinecap="round" />
        <line x1="40" y1="31" x2="50" y2="32" stroke="#CBD5E1" strokeWidth="1.2" strokeLinecap="round" />
        <line x1="38" y1="35" x2="48" y2="36" stroke="#CBD5E1" strokeWidth="1.2" strokeLinecap="round" />

        {/* Central Red Bookmark Ribbon */}
        <path
          d="M30 18 L30 38 L32 36 L34 38 L34 18 Z"
          fill="#D62828"
        />
      </svg>
    </motion.div>
  );
};

// 3. ANIMASI PENSIL: Bergerak halus seperti sedang menulis catatan belajar
export const WritingPencilIllustration: React.FC<{ size?: number; className?: string }> = ({
  size = 40,
  className = '',
}) => {
  return (
    <motion.div
      animate={{
        x: [0, 4, 1, 3, 0],
        y: [0, -3, -1, -2, 0],
        rotate: [25, 29, 24, 28, 25],
      }}
      transition={{
        duration: 3.2,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
      className={`relative inline-flex items-center justify-center select-none ${className}`}
      style={{ width: size, height: size }}
    >
      <svg
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-xs"
      >
        {/* Pencil Wooden Body (Gold/Yellow) */}
        <path
          d="M12 36 L16 32 L36 12 L32 8 L12 28 Z"
          fill="#F59E0B"
        />
        {/* Metal Ferrule */}
        <path
          d="M32 8 L36 12 L39 9 L35 5 Z"
          fill="#94A3B8"
        />
        {/* Eraser Tip (Red BISA) */}
        <path
          d="M35 5 L39 9 L42 6 C43 5, 43 3, 41 2 C40 1, 38 1, 37 3 Z"
          fill="#D62828"
        />
        {/* Sharpened Wood Point */}
        <polygon points="12,28 12,36 4,44 12,36 16,32" fill="#FED7AA" />
        {/* Graphite Tip */}
        <polygon points="4,44 6,40 8,42" fill="#1F2937" />
        {/* Pencil Highlight Stripe */}
        <line x1="16" y1="28" x2="33" y2="11" stroke="#FDE68A" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    </motion.div>
  );
};

// 4. ANIMASI GRADUATION CAP: Subtle floating and star sparkle
export const GraduationCapBadge: React.FC<{ size?: number; className?: string }> = ({
  size = 42,
  className = '',
}) => {
  return (
    <motion.div
      animate={{
        y: [0, -3, 0],
      }}
      transition={{
        duration: 2.8,
        repeat: Infinity,
        repeatType: 'reverse',
        ease: 'easeInOut',
      }}
      className={`relative inline-flex items-center justify-center select-none ${className}`}
      style={{ width: size, height: size }}
    >
      <svg
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-xs"
      >
        {/* Mortarboard Diamond */}
        <polygon points="24,10 42,18 24,26 6,18" fill="#1F2937" />
        {/* Skull cap underneath */}
        <path d="M14 22 L14 30 C14 36, 34 36, 34 30 L34 22 Z" fill="#111827" />
        {/* Tassel Red Swoop */}
        <path d="M24 18 C30 20, 36 24, 36 32" stroke="#D62828" strokeWidth="2" strokeLinecap="round" fill="none" />
        <circle cx="36" cy="33" r="2" fill="#D62828" />
        {/* Gold Star Accent */}
        <polygon points="10,12 11.5,14.5 14,14.5 12,16.5 13,19 10,17.5 7,19 8,16.5 6,14.5 8.5,14.5" fill="#F59E0B" />
      </svg>
    </motion.div>
  );
};

// 5. EMPTY STATE BERTEMA PENDIDIKAN: Buku, modul, pesan friendly, micro-interaction
export const EducationEmptyState: React.FC<{
  title: string;
  description: string;
  actionText?: string;
  onAction?: () => void;
  iconType?: 'book' | 'module' | 'task' | 'student';
  className?: string;
}> = ({
  title,
  description,
  actionText,
  onAction,
  iconType = 'book',
  className = '',
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className={`bg-white rounded-2xl p-6 border border-slate-200/90 shadow-sm flex flex-col items-center text-center select-none ${className}`}
    >
      {/* Central Animated Illustration */}
      <div className="relative mb-3.5 flex items-center justify-center">
        {/* Soft Background Halo */}
        <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-[#E8F5EE] via-[#F7F9F8] to-[#FDECEC] border border-slate-100 flex items-center justify-center shadow-inner" />

        {/* Floating Book / Illustration in Center */}
        <div className="absolute inset-0 flex items-center justify-center">
          <FloatingBookIllustration size={48} />
        </div>

        {/* Decorative Writing Pencil floating at the top-right */}
        <div className="absolute -top-1 -right-2">
          <WritingPencilIllustration size={28} />
        </div>
      </div>

      {/* Title */}
      <h4 className="text-xs sm:text-sm font-bold text-slate-800 tracking-tight">
        {title}
      </h4>

      {/* Description */}
      <p className="text-[11px] text-slate-500 leading-relaxed max-w-[240px] mt-1">
        {description}
      </p>

      {/* Action Button */}
      {actionText && onAction && (
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={onAction}
          className="mt-3.5 inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#168A5B] hover:bg-[#116E48] text-white text-[11px] font-bold shadow-xs transition"
        >
          <Sparkles size={12} className="text-amber-300" />
          <span>{actionText}</span>
        </motion.button>
      )}
    </motion.div>
  );
};

// 6. EDUCATION STAT CARD: Card metrik dengan icon pendidikan & animasi entrance
export const EducationStatCard: React.FC<{
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  accent: 'green' | 'red' | 'blue' | 'purple';
  onClick?: () => void;
  index?: number;
}> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  accent,
  onClick,
  index = 0,
}) => {
  let iconBg = 'bg-[#E8F5EE] text-[#168A5B]';
  let borderHover = 'hover:border-[#168A5B]';
  let badgeBorder = 'border-[#168A5B]/20';

  if (accent === 'red') {
    iconBg = 'bg-[#FDECEC] text-[#D62828]';
    borderHover = 'hover:border-[#D62828]';
    badgeBorder = 'border-[#D62828]/20';
  } else if (accent === 'blue') {
    iconBg = 'bg-sky-50 text-sky-600';
    borderHover = 'hover:border-sky-400';
    badgeBorder = 'border-sky-200';
  } else if (accent === 'purple') {
    iconBg = 'bg-purple-50 text-purple-600';
    borderHover = 'hover:border-purple-400';
    badgeBorder = 'border-purple-200';
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.08, ease: 'easeOut' }}
      whileHover={onClick ? { scale: 1.02, y: -2 } : undefined}
      whileTap={onClick ? { scale: 0.98 } : undefined}
      onClick={onClick}
      className={`bg-white rounded-2xl p-3.5 border border-slate-200 shadow-sm flex flex-col items-center text-center transition-all ${
        onClick ? `cursor-pointer ${borderHover}` : ''
      }`}
    >
      <div className={`w-10 h-10 rounded-xl ${iconBg} flex items-center justify-center mb-1.5 border ${badgeBorder} shadow-2xs`}>
        <Icon size={20} />
      </div>
      <span className="text-2xl font-black text-slate-900 leading-tight">
        {value}
      </span>
      <span className="text-xs font-bold text-slate-700 mt-0.5">{title}</span>
      {subtitle && <span className="text-[10px] text-slate-400 mt-0.5">{subtitle}</span>}
    </motion.div>
  );
};
