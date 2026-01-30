/**
 * Theme constants for the application
 * Define colors, spacing, and typography
 */

export const COLORS = {
  // Primary colors from Figma
  primary: '#1F2937',
  secondary: '#374151',
  gold: '#FFD700',
  
  // Status colors
  success: '#22C55E',
  danger: '#EF4444',
  warning: '#FF9500',
  info: '#5AC8FA',
  
  // Neutral colors
  white: '#FFFFFF',
  black: '#000000',
  gray: '#9CA3AF',
  lightGray: '#E5E5EA',
  darkGray: '#1C1C1C',
  slateGray: '#94A3B8',
  
  // Background colors
  background: '#1C1C1C',
  backgroundLight: '#FFFFFF',
  backgroundCard: 'rgba(30, 41, 59, 0.3)',
  
  // Text colors (estructura anidada para mejor organización)
  text: {
    primary: '#FFFFFF',
    secondary: '#9CA3AF',
    muted: '#94A3B8',
    light: '#FFFFFF',
    dark: '#000000'
  },
  
  // Colores legacy (mantenidos para compatibilidad)
  textSecondary: '#9CA3AF',
  textMuted: '#94A3B8',
  textLight: '#FFFFFF',
  textDark: '#000000',
  inputPlaceholder: '#757575',
  
  // Button colors
  buttonBackground: '#1F2937',
  buttonText: '#BBBEC5',
};

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const FONT_SIZES = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 24,
  xxl: 32,
};

export const FONT_WEIGHTS = {
  regular: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
};

export const BORDER_RADIUS = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  round: 999,
};
