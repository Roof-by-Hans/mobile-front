/**
 * Theme constants for the application
 * Define colors, spacing, and typography
 */

export const COLORS = {
  // Primary colors (diseño Figma)
  primary: '#FDD835', // Amarillo dorado principal
  secondary: '#0A0A0A', // Negro profundo
  
  // Status colors
  success: '#4ADE80', // Verde para montos positivos
  danger: '#EF4444',
  warning: '#FF9500',
  info: '#5AC8FA',
  
  // Neutral colors
  white: '#FFFFFF',
  gray: '#888888', // Gris del diseño Figma
  lightGray: '#E5E5EA',
  
  // Background colors
  background: '#000000', // Fondo principal negro
  backgroundSecondary: '#1C1C1C', // Fondo alternativo
  backgroundCard: 'rgba(255, 255, 255, 0.03)', // Cards con glassmorphism
  backgroundAvatar: '#0A0A0A', // Fondo del avatar
  
  // Text colors (estructura anidada para mejor organización)
  text: {
    primary: '#FFFFFF',
    secondary: '#888888', // Gris medio del diseño
    muted: 'rgba(255, 255, 255, 0.3)', // Texto muy sutil
    icon: 'rgba(255, 255, 255, 0.6)', // Iconos sutiles
    dark: '#000000'
  },
  
  // Colores legacy (mantenidos para compatibilidad)
  textSecondary: '#888888',
  textMuted: 'rgba(255, 255, 255, 0.3)',
  textDark: '#000000',
  inputPlaceholder: '#757575',
  
  // Button colors
  buttonBackground: '#1F2937',
  buttonText: '#BBBEC5',
  
  // Additional UI colors
  border: 'rgba(255, 255, 255, 0.05)', // Bordes sutiles del diseño
  borderGlow: 'rgba(253, 216, 53, 0.6)', // Borde dorado con glow
  borderBadge: 'rgba(253, 216, 53, 0.3)', // Borde del badge
  error: '#EF4444',
  
  // Glassmorphism & Effects
  glassBg: 'rgba(253, 216, 53, 0.05)', // Fondo del badge
  shadowGold: '#FDD835', // Color de sombras doradas
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
  bold: '700',
};

export const BORDER_RADIUS = {
  md: 8,
  lg: 12,
};
