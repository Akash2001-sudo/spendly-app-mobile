import React, { createContext, ReactNode, useContext, useMemo, useState } from 'react';
import { darkPalette, getShadows, lightPalette, type Palette, type Shadows } from '../theme/ui';

type ThemeMode = 'light' | 'dark';

type ThemeContextType = {
  mode: ThemeMode;
  isDark: boolean;
  palette: Palette;
  shadows: Shadows;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [mode, setMode] = useState<ThemeMode>('light');

  const value = useMemo<ThemeContextType>(() => {
    const isDark = mode === 'dark';
    const palette = isDark ? darkPalette : lightPalette;

    return {
      mode,
      isDark,
      palette,
      shadows: getShadows(isDark),
      toggleTheme: () => setMode((current) => (current === 'dark' ? 'light' : 'dark')),
    };
  }, [mode]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useTheme = () => {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }

  return context;
};
