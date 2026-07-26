export const lightColors = {
  // surfaces
  page: '#f9f9f7',
  card: '#fcfcfb',

  // ink
  textPrimary: '#0b0b0b',
  textSecondary: '#52514e',
  textMuted: '#898781',
  border: 'rgba(11,11,11,0.10)',

  // brand / categorical
  blue: '#2a78d6',
  orange: '#eb6834',
  aqua: '#1baf7a',
  yellow: '#eda100',
  magenta: '#e87ba4',
  violet: '#4a3aa7',

  // sequential (blue ramp) for progress bars
  blue100: '#cde2fb',
  blue300: '#6da7ec',
  blue500: '#256abf',

  // status (fixed, never themed)
  good: '#0ca30c',
  warning: '#fab219',
  serious: '#ec835a',
  critical: '#d03b3b',

  white: '#ffffff',
};

export const darkColors = {
  page: '#0d0d0d',
  card: '#1a1a19',

  textPrimary: '#ffffff',
  textSecondary: '#c3c2b7',
  textMuted: '#898781',
  border: 'rgba(255,255,255,0.10)',

  blue: '#3987e5',
  orange: '#d95926',
  aqua: '#199e70',
  yellow: '#c98500',
  magenta: '#d55181',
  violet: '#9085e9',

  blue100: '#184f95',
  blue300: '#2a78d6',
  blue500: '#6da7ec',

  good: '#0ca30c',
  warning: '#fab219',
  serious: '#ec835a',
  critical: '#e66767',

  white: '#ffffff',
};

export type ThemeColors = typeof lightColors;

// Backwards-compatible static export (light palette) for any code that hasn't
// migrated to useTheme() yet.
export const colors = lightColors;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
};

export const radius = {
  sm: 8,
  md: 14,
  lg: 20,
  pill: 999,
};

export const typography = {
  hero: { fontSize: 34, fontWeight: '700' as const },
  h1: { fontSize: 22, fontWeight: '700' as const },
  h2: { fontSize: 17, fontWeight: '600' as const },
  body: { fontSize: 15, fontWeight: '400' as const },
  caption: { fontSize: 13, fontWeight: '500' as const },
  tiny: { fontSize: 11, fontWeight: '500' as const },
};

export const shadow = {
  card: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
};
