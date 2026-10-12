'use client';

import React, { useState, useEffect } from 'react';
import { Moon, Play, Pause, Palette, Sparkles, Check } from 'lucide-react';
import { usePlayerStore } from '@/stores/player-store';
import { SleepTimerModal } from '@/components/ui/sleep-timer-modal';
import { KeyboardShortcutsModal } from '@/components/ui/keyboard-shortcuts-modal';
import { MobileMenu } from './mobile-menu';
import { ThemeMode } from '@/types';

export const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [timerModalOpen, setTimerModalOpen] = useState(false);
  const [shortcutsModalOpen, setShortcutsModalOpen] = useState(false);
  const [isThemeMenuOpen, setIsThemeMenuOpen] = useState(false);

  const {
    playbackStatus,
    currentSound,
    togglePlayPause,
    masterVolume,
    setMasterVolume,
    sleepTimer,
    themeMode,
    setThemeMode,
    openNowPlayingDrawer,
  } = usePlayerStore();

  const isPlaying = playbackStatus === 'playing';

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Global keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) return;

      if (e.code === 'Space') {
        e.preventDefault();
        togglePlayPause();
      } else if (e.key === 'm' || e.key === 'M') {
        e.preventDefault();
        setMasterVolume(masterVolume > 0 ? 0 : 0.8);
      } else if (e.key === 't' || e.key === 'T') {
        e.preventDefault();
        setTimerModalOpen((prev) => !prev);
      } else if (e.key === '?') {
        e.preventDefault();
        setShortcutsModalOpen((prev) => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [togglePlayPause, masterVolume, setMasterVolume]);

  const navLinks = [
    { label: 'Soundscapes', href: '#soundscapes' },
    { label: 'Intentions', href: '#intentions' },
    { label: 'Rituals', href: '#ritual' },
  ];

  const themeOptions: { id: ThemeMode; label: string; desc: string; color: string }[] = [
    {
      id: 'motive',
      label: 'Sound Motive',
      desc: 'Dynamic color shifting with current sound (Default)',
      color: 'var(--theme-accent, #91AFA9)',
    },
    {
      id: 'beige',
      label: 'Light Beige',
      desc: 'Warm serene linen aesthetic',
      color: '#EAE6DD',
    },
    {
      id: 'cold',
      label: 'Cold Color',
      desc: 'Icy tranquil cyan (#32ABD0)',
      color: '#32ABD0',
    },
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${
          isScrolled
            ? 'py-3 shadow-xl backdrop-blur-xl border-b border-[var(--theme-border-subtle,rgba(145,175,169,0.15))] bg-[var(--theme-bg,#101816)]/80'
            : 'bg-transparent py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-8 flex items-center justify-between">
          {/* Logo & Active Sound Motive Indicator */}
          <div className="flex items-center gap-3 sm:gap-4">
            <a
              href="#"
              className="flex items-center gap-2.5 text-[var(--theme-text-primary,#F1F3EF)] hover:opacity-90 transition-opacity group"
              aria-label="Stillwave Home"
            >
              <div className="relative flex items-center justify-center w-7 h-7 rounded-lg bg-[var(--theme-surface,#202B28)] border border-[var(--theme-border-subtle,rgba(145,175,169,0.3))] transition-colors duration-1000 shadow-sm">
                <span className="w-2 h-2 rounded-full bg-[var(--theme-accent,#91AFA9)] group-hover:scale-125 transition-all duration-700" />
                {isPlaying && (
                  <span className="absolute inset-0 rounded-lg border border-[var(--theme-accent,#91AFA9)] animate-ping opacity-40" />
                )}
              </div>
              <div className="flex flex-col">
                <span className="text-sm sm:text-base font-medium tracking-[0.2em] font-heading uppercase">
                  Stillwave
                </span>
                <span className="text-[8px] sm:text-[9px] tracking-widest text-[#B3BDB6] uppercase -mt-0.5 font-mono">
                  Sound Sanctuary
                </span>
              </div>
            </a>

            {/* Active Sound Motive Badge (Click opens Now Playing drawer) */}
            <button
              type="button"
              onClick={openNowPlayingDrawer}
              className="flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--theme-surface,#202B28)]/90 border border-[var(--theme-border-subtle,rgba(145,175,169,0.25))] hover:border-[var(--theme-accent,#91AFA9)] transition-all duration-500 group cursor-pointer"
              title="Click to open Now Playing drawer"
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${isPlaying ? 'animate-pulse' : ''}`}
                style={{ backgroundColor: 'var(--theme-accent, #91AFA9)' }}
              />
              <span className="text-[11px] font-mono text-[var(--theme-accent,#91AFA9)]">
                {currentSound ? currentSound.title : 'Silence'}
              </span>
            </button>
          </div>

          {/* Desktop Navigation Links — Clean 3 Core Links */}
          <nav className="hidden lg:flex items-center gap-8 text-xs font-medium tracking-wider text-[#B3BDB6]">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="hover:text-[var(--theme-text-primary,#F1F3EF)] transition-colors py-1 relative group"
              >
                {link.label}
                <span className="absolute bottom-0 left-0 w-0 h-[1.5px] bg-[var(--theme-accent,#91AFA9)] transition-all duration-300 group-hover:w-full" />
              </a>
            ))}
          </nav>

          {/* Right Action Controls: Background Theme Switcher, Timer, Play Toggle (No GitHub) */}
          <div className="flex items-center gap-2 sm:gap-3 relative">
            {/* Background Theme Switcher Dropdown Button */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsThemeMenuOpen(!isThemeMenuOpen)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border border-[var(--theme-border-subtle,rgba(145,175,169,0.25))] bg-[var(--theme-surface,#202B28)]/80 hover:border-[var(--theme-accent,#91AFA9)] transition-all text-[var(--theme-text-primary,#F1F3EF)]"
                title="Change background aesthetic"
                aria-label="Background theme selector"
              >
                <Palette className="w-3.5 h-3.5 text-[var(--theme-accent,#91AFA9)]" />
                <span className="text-[11px] hidden sm:inline capitalize">
                  {themeMode === 'motive' ? 'Sound Motive' : themeMode === 'beige' ? 'Light Beige' : 'Cold #32ABD0'}
                </span>
              </button>

              {/* Theme Menu Dropdown */}
              {isThemeMenuOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setIsThemeMenuOpen(false)}
                  />
                  <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-[var(--theme-surface,#182320)] border border-[var(--theme-border,#91AFA9)]/30 p-2 shadow-2xl z-50 backdrop-blur-xl animate-in fade-in zoom-in-95 duration-200">
                    <div className="px-2.5 py-1.5 border-b border-[var(--theme-border-subtle,rgba(145,175,169,0.15))] mb-1.5 flex items-center justify-between">
                      <span className="text-[10px] uppercase font-mono tracking-wider text-[var(--theme-text-secondary,#B3BDB6)]">
                        Background Aesthetic
                      </span>
                      <Sparkles className="w-3 h-3 text-[var(--theme-accent,#91AFA9)]" />
                    </div>
                    {themeOptions.map((opt) => (
                      <button
                        type="button"
                        key={opt.id}
                        onClick={() => {
                          setThemeMode(opt.id);
                          setIsThemeMenuOpen(false);
                        }}
                        className={`w-full flex items-center justify-between p-2 rounded-xl text-left text-xs transition-all cursor-pointer ${
                          themeMode === opt.id
                            ? 'bg-[var(--theme-accent,#91AFA9)]/15 border border-[var(--theme-accent,#91AFA9)]/30 text-[var(--theme-text-primary,#F1F3EF)]'
                            : 'hover:bg-black/5 dark:hover:bg-white/5 text-[var(--theme-text-secondary,#B3BDB6)]'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <span
                            className="w-3 h-3 rounded-full border border-black/20 dark:border-white/20 shrink-0"
                            style={{ backgroundColor: opt.color }}
                          />
                          <div>
                            <div className="font-medium text-[var(--theme-text-primary,#F1F3EF)]">{opt.label}</div>
                            <div className="text-[10px] text-[var(--theme-text-muted,#7E8D86)] line-clamp-1">
                              {opt.desc}
                            </div>
                          </div>
                        </div>
                        {themeMode === opt.id && (
                          <Check className="w-3.5 h-3.5 text-[var(--theme-accent,#91AFA9)]" />
                        )}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Sleep Timer Indicator Button */}
            <button
              type="button"
              onClick={() => setTimerModalOpen(true)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                sleepTimer.isRunning
                  ? 'bg-[var(--theme-accent,#91AFA9)]/15 border-[var(--theme-accent,#91AFA9)] text-[var(--theme-accent,#91AFA9)] animate-pulse'
                  : 'bg-[var(--theme-surface,#202B28)]/80 border-[var(--theme-border-subtle,rgba(145,175,169,0.2))] text-[#B3BDB6] hover:text-[#F1F3EF] hover:border-[var(--theme-border-active,rgba(145,175,169,0.4))]'
              }`}
              title="Sleep Timer"
              aria-label="Configure Sleep Timer"
            >
              <Moon className="w-3.5 h-3.5" />
              <span className="font-mono text-[11px]">
                {sleepTimer.isRunning
                  ? `${Math.floor(sleepTimer.remainingSeconds / 60)}m`
                  : 'Timer'}
              </span>
            </button>

            {/* Quick Play/Pause Badge */}
            <button
              type="button"
              onClick={togglePlayPause}
              className={`hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                isPlaying
                  ? 'bg-[var(--theme-accent,#91AFA9)] text-[#101816] border-[var(--theme-accent,#91AFA9)] shadow-sm'
                  : 'bg-[var(--theme-surface,#202B28)]/80 border-[var(--theme-border-subtle,rgba(145,175,169,0.2))] text-[#F1F3EF] hover:border-[var(--theme-border-active,rgba(145,175,169,0.4))]'
              }`}
              title="Toggle Play / Pause"
              aria-label={isPlaying ? 'Pause playback' : 'Start playback'}
            >
              {isPlaying ? (
                <>
                  <Pause className="w-3.5 h-3.5 fill-current" />
                  <span>{currentSound ? currentSound.title : 'Playing'}</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Listen</span>
                </>
              )}
            </button>

            {/* Mobile Menu Drawer Toggle */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden relative p-2.5 rounded-xl bg-[#202B28]/80 hover:bg-[#283633] border border-[#91AFA9]/25 text-[#F1F3EF] transition-all active:scale-95 flex items-center justify-center w-10 h-10"
              aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
              aria-expanded={mobileMenuOpen}
            >
              <div className="w-4 h-3.5 flex flex-col justify-between items-center">
                <span
                  className={`h-[1.5px] rounded-full transition-all duration-300 origin-center ${
                    mobileMenuOpen
                      ? 'w-4 translate-y-[6px] rotate-45 bg-[#91AFA9]'
                      : 'w-4 bg-[#F1F3EF]'
                  }`}
                />
                <span
                  className={`h-[1.5px] rounded-full transition-all duration-300 ${
                    mobileMenuOpen
                      ? 'w-0 opacity-0 scale-x-0'
                      : 'w-3 -ml-1 bg-[#F1F3EF]'
                  }`}
                />
                <span
                  className={`h-[1.5px] rounded-full transition-all duration-300 origin-center ${
                    mobileMenuOpen
                      ? 'w-4 -translate-y-[6px] -rotate-45 bg-[#91AFA9]'
                      : 'w-4 bg-[#F1F3EF]'
                  }`}
                />
              </div>
            </button>
          </div>
        </div>
      </header>

      {/* Luxury Sanctuary Mobile Drawer */}
      <MobileMenu
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        onOpenTimer={() => setTimerModalOpen(true)}
        onOpenShortcuts={() => setShortcutsModalOpen(true)}
      />

      {/* Modals */}
      <SleepTimerModal isOpen={timerModalOpen} onClose={() => setTimerModalOpen(false)} />
      <KeyboardShortcutsModal
        isOpen={shortcutsModalOpen}
        onClose={() => setShortcutsModalOpen(false)}
      />
    </>
  );
};
