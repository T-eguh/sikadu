// Design System for BISA (Bisa Insani Smart Academy) - PKBM Bina Insani
// Motto: Hebat • Mandiri • Kreatif

export const Colors = {
  // Brand Colors
  primary: '#1E3A8A', // Deep Academic Navy
  primaryDark: '#0F172A', // Deep Midnight
  primaryLight: '#2563EB', // Vibrant Royal Blue
  primarySoft: '#EFF6FF', // Soft Blue tint

  secondary: '#0284C7', // Sky Blue
  secondaryLight: '#E0F2FE',

  // Accent Colors
  accent: '#059669', // Emerald / Mint Green (Growth & Learning)
  accentLight: '#D1FAE5',
  accentDark: '#047857',

  amber: '#D97706', // Warm Amber (Creativity & Focus)
  amberLight: '#FEF3C7',

  purple: '#7C3AED', // Royal Purple
  purpleLight: '#EDE9FE',

  // Neutrals & Surfaces
  background: '#F8FAFC', // Slate 50 clean background
  surface: '#FFFFFF', // Clean White Card
  surfaceSubtle: '#F1F5F9', // Slate 100
  border: '#E2E8F0', // Slate 200
  borderDark: '#CBD5E1', // Slate 300

  // Text Hierarchy
  text: '#0F172A', // Slate 900 primary text
  textSecondary: '#475569', // Slate 600 secondary text
  textMuted: '#94A3B8', // Slate 400 caption text
  textWhite: '#FFFFFF',

  // Semantic Status
  error: '#EF4444',
  errorLight: '#FEE2E2',
  success: '#10B981',
  successLight: '#DCFCE7',
  warning: '#F59E0B',
  warningLight: '#FEF3C7',
  info: '#3B82F6',
  infoLight: '#DBEAFE',

  // Roles
  roles: {
    admin: '#7C3AED',
    adminLight: '#EDE9FE',
    teacher: '#0284C7',
    teacherLight: '#E0F2FE',
    student: '#059669',
    studentLight: '#D1FAE5',
  },
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const Typography = {
  h1: {
    fontSize: 28,
    fontWeight: '800' as const,
    lineHeight: 34,
    letterSpacing: -0.5,
  },
  h2: {
    fontSize: 22,
    fontWeight: '700' as const,
    lineHeight: 28,
    letterSpacing: -0.3,
  },
  h3: {
    fontSize: 18,
    fontWeight: '600' as const,
    lineHeight: 24,
  },
  body: {
    fontSize: 15,
    fontWeight: '400' as const,
    lineHeight: 22,
  },
  bodyMedium: {
    fontSize: 15,
    fontWeight: '500' as const,
    lineHeight: 22,
  },
  caption: {
    fontSize: 13,
    fontWeight: '400' as const,
    lineHeight: 18,
  },
  small: {
    fontSize: 11,
    fontWeight: '500' as const,
    lineHeight: 14,
  },
  button: {
    fontSize: 15,
    fontWeight: '600' as const,
    letterSpacing: 0.2,
  },
};

export const BorderRadius = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 28,
  full: 9999,
};

export const Shadows = {
  soft: {
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  medium: {
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  elevated: {
    shadowColor: '#1E3A8A',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 8,
  },
};

export const Animation = {
  duration: {
    fast: 150,
    normal: 250,
    slow: 400,
  },
};
