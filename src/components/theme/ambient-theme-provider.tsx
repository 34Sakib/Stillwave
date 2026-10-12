'use client';

import React, { useEffect, createContext, useContext } from 'react';
import { motion } from 'motion/react';
import { usePlayerStore } from '@/stores/player-store';
import { getThemeForSoundId, SoundscapeTheme } from '@/data/themes';

const LIGHT_BEIGE_THEME: SoundscapeTheme = {
  id: 'beige',
  name: 'Light Beige',
  iconName: 'Sparkles',
  bgBase: '#F6F3EB',
  bgSurface: '#EFEAE0',
  bgElevated: '#E5DFD4',
  bgHover: '#DFD9CD',
  accent: '#6E6051',
  accentHover: '#574B3E',
  accentRgb: '110, 96, 81',
  glow: 'rgba(110, 96, 81, 0.14)',
  glowSecondary: 'rgba(110, 96, 81, 0.06)',
  borderSubtle: 'rgba(110, 96, 81, 0.22)',
  borderActive: 'rgba(110, 96, 81, 0.50)',
  textAccent: '#574B3E',
};

const COLD_COLOR_THEME: SoundscapeTheme = {
  id: 'cold',
  name: 'Cold Color',
  iconName: 'Sparkles',
  bgBase: '#0A1820',
  bgSurface: '#102430',
  bgElevated: '#17303E',
  bgHover: '#1D3A4B',
  accent: '#32ABD0',
  accentHover: '#5AC3E2',
  accentRgb: '50, 171, 208',
  glow: 'rgba(50, 171, 208, 0.24)',
  glowSecondary: 'rgba(50, 171, 208, 0.10)',
  borderSubtle: 'rgba(50, 171, 208, 0.25)',
  borderActive: 'rgba(50, 171, 208, 0.55)',
  textAccent: '#32ABD0',
};

interface ThemeContextType {
  theme: SoundscapeTheme;
  themeMode: 'motive' | 'beige' | 'cold';
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
  const themeMode = usePlayerStore((state) => state.themeMode) || 'motive';

  // Determine active palette based on user selection or dynamic motive
  let activeTheme: SoundscapeTheme;
  if (themeMode === 'beige') {
    activeTheme = LIGHT_BEIGE_THEME;
  } else if (themeMode === 'cold') {
    activeTheme = COLD_COLOR_THEME;
  } else {
    activeTheme = getThemeForSoundId(currentSound?.id);
  }

  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--theme-bg', activeTheme.bgBase);
    root.style.setProperty('--theme-surface', activeTheme.bgSurface);
    root.style.setProperty('--theme-elevated', activeTheme.bgElevated);
    root.style.setProperty('--theme-hover', activeTheme.bgHover);
    root.style.setProperty('--theme-accent', activeTheme.accent);
    root.style.setProperty('--theme-accent-hover', activeTheme.accentHover);
    root.style.setProperty('--theme-accent-rgb', activeTheme.accentRgb);
    root.style.setProperty('--theme-glow', activeTheme.glow);
    root.style.setProperty('--theme-glow-sec', activeTheme.glowSecondary);
    root.style.setProperty('--theme-border-subtle', activeTheme.borderSubtle);
    root.style.setProperty('--theme-border-active', activeTheme.borderActive);
    root.style.setProperty('--theme-text-accent', activeTheme.textAccent);

    // Synchronize document body background and text colors
    document.body.style.backgroundColor = activeTheme.bgBase;
    if (themeMode === 'beige') {
      root.style.setProperty('--theme-text-primary', '#1C1E1B');
      root.style.setProperty('--theme-text-secondary', '#4D534E');
      root.style.setProperty('--theme-text-muted', '#78807A');
      root.style.setProperty('--theme-border', 'rgba(110, 96, 81, 0.35)');
      document.body.style.color = '#1C1E1B';
      root.classList.add('theme-light-beige');
    } else {
      root.style.setProperty('--theme-text-primary', '#F1F3EF');
      root.style.setProperty('--theme-text-secondary', '#B3BDB6');
      root.style.setProperty('--theme-text-muted', '#7E8D86');
      root.style.setProperty('--theme-border', activeTheme.accent);
      document.body.style.color = '#F1F3EF';
      root.classList.remove('theme-light-beige');
    }
  }, [activeTheme, themeMode]);

  return (
    <ThemeContext.Provider value={{ theme: activeTheme, themeMode }}>
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
            background: `radial-gradient(circle, ${activeTheme.glow} 0%, ${activeTheme.glowSecondary} 60%, transparent 100%)`,
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
            background: `radial-gradient(circle, ${activeTheme.glow} 0%, transparent 70%)`,
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
            background: `radial-gradient(circle, ${activeTheme.glowSecondary} 0%, transparent 70%)`,
          }}
        />
      </div>

      <div className="relative z-10 w-full min-h-screen">
        {children}
      </div>
    </ThemeContext.Provider>
  );
};
