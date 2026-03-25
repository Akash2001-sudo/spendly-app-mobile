export type Palette = {
  background: string;
  surface: string;
  surfaceStrong: string;
  primary: string;
  primarySoft: string;
  accentStrong: string;
  text: string;
  textMuted: string;
  border: string;
  danger: string;
  overlay: string;
  selectedSurface: string;
  chartGrid: string;
  dangerSoft: string;
};

export const lightPalette: Palette = {
  background: '#f6efe7',
  surface: '#fffaf5',
  surfaceStrong: '#ffffff',
  primary: '#1f6f78',
  primarySoft: '#d7efe7',
  accentStrong: '#dd8f52',
  text: '#23313a',
  textMuted: '#6f7f88',
  border: '#eaded1',
  danger: '#c56d5d',
  overlay: 'rgba(35, 49, 58, 0.34)',
  selectedSurface: '#f3fbfa',
  chartGrid: '#efe4d7',
  dangerSoft: '#f6d7d1',
};

export const darkPalette: Palette = {
  background: '#111a20',
  surface: '#17232b',
  surfaceStrong: '#1d2c35',
  primary: '#64d0c6',
  primarySoft: '#1f4749',
  accentStrong: '#f0b06c',
  text: '#eef5f4',
  textMuted: '#95aab2',
  border: '#2c434d',
  danger: '#ef8f82',
  overlay: 'rgba(3, 8, 12, 0.72)',
  selectedSurface: '#163038',
  chartGrid: '#233740',
  dangerSoft: '#4a2725',
};

export type Shadows = {
  card: {
    shadowColor: string;
    shadowOffset: { width: number; height: number };
    shadowOpacity: number;
    shadowRadius: number;
    elevation: number;
  };
};

export const getShadows = (isDark: boolean): Shadows => ({
  card: {
    shadowColor: isDark ? '#000000' : '#7d5f4a',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: isDark ? 0.28 : 0.1,
    shadowRadius: 18,
    elevation: 6,
  },
});
