'use client';

import React, { useEffect, createContext, useContext } from 'react';
import { usePlayerStore } from '@/stores/player-store';
import { getThemeForSoundId, SoundscapeTheme } from '@/data/themes';

interface ThemeContextType {
  theme: SoundscapeTheme;
}

const ThemeContext = createContext<ThemeContextType | null>(null);

export const useActiveTheme = (): SoundscapeTheme => {
  const context = useContext(ThemeContext);
  if (!context) {
    return getThemeForSoundId('default');
  }
  return context.theme;
};

interface AmbientThemeProviderProps {
  children: React.ReactNode;
}

export const AmbientThemeProvider: React.FC<AmbientThemeProviderProps> = ({ children }) => {
  const currentSound = usePlayerStore((state) => state.currentSound);
  const theme = getThemeForSoundId(currentSound?.id);

  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--theme-bg', theme.bgBase);
    root.style.setProperty('--theme-surface', theme.bgSurface);
    root.style.setProperty('--theme-elevated', theme.bgElevated);
    root.style.setProperty('--theme-hover', theme.bgHover);
    root.style.setProperty('--theme-accent', theme.accent);
    root.style.setProperty('--theme-accent-hover', theme.accentHover);
    root.style.setProperty('--theme-accent-rgb', theme.accentRgb);
    root.style.setProperty('--theme-glow', theme.glow);
    root.style.setProperty('--theme-glow-sec', theme.glowSecondary);
    root.style.setProperty('--theme-border-subtle', theme.borderSubtle);
    root.style.setProperty('--theme-border-active', theme.borderActive);
    root.style.setProperty('--theme-text-accent', theme.textAccent);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme }}>
      {/* Dynamic Ambient Atmospheric Glow Orbs (Subtle Backdrop Mesh) */}
      <div
        className="fixed inset-0 pointer-events-none z-0 overflow-hidden transition-all duration-1000 ease-in-out"
        aria-hidden="true"
      >
        {/* Primary Ambient Atmosphere Orb */}
        <div
          className="absolute -top-32 left-1/2 -translate-x-1/2 w-[720px] sm:w-[900px] h-[500px] rounded-full blur-[150px] opacity-40 transition-all duration-1000 ease-out"
          style={{
            background: `radial-gradient(circle, ${theme.glow} 0%, ${theme.glowSecondary} 60%, transparent 100%)`,
          }}
        />

        {/* Secondary Low-Horizon Atmospheric Mesh */}
        <div
          className="absolute top-1/2 -right-48 w-[600px] h-[600px] rounded-full blur-[160px] opacity-30 transition-all duration-1000 ease-out"
          style={{
            background: `radial-gradient(circle, ${theme.glow} 0%, transparent 70%)`,
          }}
        />

        {/* Floating Under-Current Mesh */}
        <div
          className="absolute -bottom-48 -left-48 w-[700px] h-[700px] rounded-full blur-[170px] opacity-25 transition-all duration-1000 ease-out"
          style={{
            background: `radial-gradient(circle, ${theme.glowSecondary} 0%, transparent 70%)`,
          }}
        />
      </div>

      <div className="relative z-10 w-full min-h-screen">
        {children}
      </div>
    </ThemeContext.Provider>
  );
};
