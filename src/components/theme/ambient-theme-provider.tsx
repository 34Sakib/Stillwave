'use client';

import React, { useEffect, createContext, useContext } from 'react';
import { motion } from 'motion/react';
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

    // Also update document body background style directly for instant, seamless sync
    document.body.style.backgroundColor = theme.bgBase;
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme }}>
      {/* Dynamic Ambient Atmospheric Glow Orbs (Fluid Backdrop Mesh) */}
      <div
        className="fixed inset-0 pointer-events-none z-0 overflow-hidden transition-all duration-1000 ease-in-out"
        aria-hidden="true"
      >
        {/* Primary Ambient Atmosphere Orb with organic breathing motion */}
        <motion.div
          animate={{
            scale: [1, 1.08, 0.96, 1],
            opacity: [0.38, 0.48, 0.35, 0.38],
            x: ['-50%', '-48%', '-52%', '-50%'],
          }}
          transition={{
            duration: 16,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="absolute -top-32 left-1/2 w-[750px] sm:w-[950px] h-[550px] rounded-full blur-[150px] transition-all duration-1000 ease-out"
          style={{
            background: `radial-gradient(circle, ${theme.glow} 0%, ${theme.glowSecondary} 60%, transparent 100%)`,
          }}
        />

        {/* Secondary Low-Horizon Atmospheric Mesh with floating drift */}
        <motion.div
          animate={{
            y: [0, -35, 20, 0],
            scale: [1, 1.05, 0.95, 1],
          }}
          transition={{
            duration: 22,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="absolute top-1/2 -right-48 w-[620px] h-[620px] rounded-full blur-[160px] opacity-30 transition-all duration-1000 ease-out"
          style={{
            background: `radial-gradient(circle, ${theme.glow} 0%, transparent 70%)`,
          }}
        />

        {/* Floating Under-Current Mesh */}
        <motion.div
          animate={{
            x: [0, 30, -20, 0],
            opacity: [0.22, 0.30, 0.20, 0.22],
          }}
          transition={{
            duration: 26,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="absolute -bottom-48 -left-48 w-[720px] h-[720px] rounded-full blur-[170px] transition-all duration-1000 ease-out"
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
