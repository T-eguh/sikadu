// Centralized Design System for BISA (Bisa Insani Smart Academy)
// PKBM Bina Insani • Motto: HEBAT • MANDIRI • KREATIF
// Exact Color Palette requested:
// Primary Red: #D62828, Secondary Red: #EF5350, Soft Red: #FDECEC
// Primary Green: #168A5B, Secondary Green: #36A269, Soft Green: #E8F5EE
// Background: #F7F9F8, Surface: #FFFFFF
// Text Primary: #1F2937, Text Secondary: #64748B, Border: #E5E7EB

export const THEME = {
  colors: {
    // Primary Red
    primaryRed: '#D62828',
    secondaryRed: '#EF5350',
    softRed: '#FDECEC',

    // Primary Green
    primaryGreen: '#168A5B',
    secondaryGreen: '#36A269',
    softGreen: '#E8F5EE',

    // Neutrals & Surface
    background: '#F7F9F8',
    surface: '#FFFFFF',
    textPrimary: '#1F2937',
    textSecondary: '#64748B',
    border: '#E5E7EB',

    // Supporting Accents
    accentYellow: '#F59E0B',
    softYellow: '#FEF3C7',

    // Subjects
    subjects: {
      math: {
        bg: '#FDECEC',
        border: '#FECDD3',
        accent: '#D62828',
        text: '#991B1B',
      },
      bahasa: {
        bg: '#E8F5EE',
        border: '#A7F3D0',
        accent: '#168A5B',
        text: '#064E3B',
      },
      ipa: {
        bg: '#E8F5EE',
        border: '#BBF7D0',
        accent: '#36A269',
        text: '#047857',
      },
      english: {
        bg: '#FDECEC',
        border: '#FECDD3',
        accent: '#EF5350',
        text: '#991B1B',
      },
    },
  },

  borderRadius: {
    card: '22px',
    largeCTA: '20px',
    heroCard: '24px',
    input: '16px',
    pill: '9999px',
  },

  shadows: {
    soft: '0 4px 20px -2px rgba(31, 41, 55, 0.06)',
    card: '0 6px 24px -4px rgba(22, 138, 91, 0.08)',
    redCTA: '0 8px 24px -4px rgba(214, 40, 40, 0.32)',
    greenCTA: '0 8px 24px -4px rgba(22, 138, 91, 0.32)',
  },
} as const;
