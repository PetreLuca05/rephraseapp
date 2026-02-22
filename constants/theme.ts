// Design Language — single source of truth for all visual tokens

export const colors = {
  // Brand
  primary: '#5B5BD6',
  primaryDark: '#4343B0',
  primaryLight: '#EEF2FF',

  // Neutrals
  background: '#FFFFFF',
  surface: '#F8FAFC',
  border: '#E2E8F0',

  // Text
  text: '#0F172A',
  textSecondary: '#64748B',
  textDisabled: '#CBD5E1',
  textInverse: '#FFFFFF',

  // Semantic
  error: '#EF4444',
  errorLight: '#FEF2F2',
  success: '#22C55E',
  successLight: '#F0FDF4',
} as const

export const typography = {
  heading1: { fontSize: 32, fontWeight: '700' as const, lineHeight: 40 },
  heading2: { fontSize: 24, fontWeight: '700' as const, lineHeight: 32 },
  heading3: { fontSize: 20, fontWeight: '600' as const, lineHeight: 28 },
  body:     { fontSize: 16, fontWeight: '400' as const, lineHeight: 24 },
  bodyMedium: { fontSize: 16, fontWeight: '500' as const, lineHeight: 24 },
  bodySmall:  { fontSize: 14, fontWeight: '400' as const, lineHeight: 20 },
  label:    { fontSize: 14, fontWeight: '600' as const, lineHeight: 20 },
  caption:  { fontSize: 12, fontWeight: '400' as const, lineHeight: 16 },
} as const

export const spacing = {
  xs:  4,
  sm:  8,
  md:  16,
  lg:  24,
  xl:  32,
  xxl: 48,
} as const

export const radius = {
  sm:   4,
  md:   8,
  lg:   12,
  xl:   16,
  full: 9999,
} as const

export const shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
} as const
