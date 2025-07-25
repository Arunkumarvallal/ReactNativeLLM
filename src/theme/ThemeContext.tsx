import React, { createContext, useContext, useMemo, useState, ReactNode } from 'react';
import { useColorScheme } from 'react-native';
import { lightTheme, darkTheme, ThemeType } from './theme';

export type ThemeOverride = 'light' | 'dark' | null;

interface ThemeContextType {
  theme: ThemeType;
  themeOverride: ThemeOverride;
  setThemeOverride: (override: ThemeOverride) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [themeOverride, setThemeOverride] = useState<ThemeOverride>(null);
  const systemColorScheme = useColorScheme() as 'light' | 'dark' | null;

  const theme = useMemo(() => {
    if (themeOverride === 'dark' || (!themeOverride && systemColorScheme === 'dark')) {
      return darkTheme;
    }
    return lightTheme;
  }, [themeOverride, systemColorScheme]);

  const toggleTheme = () => {
    setThemeOverride(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  return (
    <ThemeContext.Provider value={{ theme, themeOverride, setThemeOverride, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within a ThemeProvider');
  return context;
};
