'use client';

import React, { useState, useEffect } from 'react';
import { Moon, Play, Pause, Keyboard } from 'lucide-react';
import { usePlayerStore } from '@/stores/player-store';
import { SleepTimerModal } from '@/components/ui/sleep-timer-modal';
import { KeyboardShortcutsModal } from '@/components/ui/keyboard-shortcuts-modal';
import { MobileMenu } from './mobile-menu';

export const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [timerModalOpen, setTimerModalOpen] = useState(false);
  const [shortcutsModalOpen, setShortcutsModalOpen] = useState(false);

  const {
    playbackStatus,
    currentSound,
    togglePlayPause,
    masterVolume,
    setMasterVolume,
    sleepTimer,
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
      // Don't trigger if user is typing in an input
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
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setMasterVolume(Math.min(1, masterVolume + 0.05));
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setMasterVolume(Math.max(0, masterVolume - 0.05));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [togglePlayPause, masterVolume, setMasterVolume]);

  const navLinks = [
    { label: 'Sounds', href: '#soundscapes' },
    { label: 'Lounge', href: '#listening-room' },
    { label: 'Atmosphere Mixer', href: '#atmosphere-mixer' },
    { label: 'Intentions', href: '#intentions' },
    { label: 'Silence', href: '#beauty-of-silence' },
    { label: 'Ritual', href: '#ritual' },
    { label: 'About', href: '#about' },
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          isScrolled
            ? 'glass-nav py-3.5 shadow-lg shadow-black/20'
            : 'bg-transparent py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-8 flex items-center justify-between">
          {/* Logo */}
          <a
            href="#"
            className="flex items-center gap-2 sm:gap-2.5 text-[#F1F3EF] hover:opacity-90 transition-opacity group"
            aria-label="Stillwave Home"
          >
            <div className="relative flex items-center justify-center w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-[var(--theme-surface,#202B28)] border border-[var(--theme-border-subtle,rgba(145,175,169,0.3))] transition-colors duration-1000">
              <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-[var(--theme-accent,#91AFA9)] group-hover:scale-125 transition-all duration-700" />
              {isPlaying && (
                <span className="absolute inset-0 rounded-lg border border-[var(--theme-accent,#91AFA9)] animate-ping opacity-40" />
              )}
            </div>
            <div className="flex flex-col">
              <span className="text-sm sm:text-base font-medium tracking-[0.16em] sm:tracking-[0.2em] font-heading uppercase">
                Stillwave
              </span>
              <span className="text-[8px] sm:text-[9px] tracking-widest text-[#B3BDB6] uppercase -mt-0.5 font-mono">
                Sound Sanctuary
              </span>
            </div>
          </a>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-6 text-xs tracking-wider text-[#B3BDB6]">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="hover:text-[#F1F3EF] transition-colors py-1 relative group"
              >
                {link.label}
                <span className="absolute bottom-0 left-0 w-0 h-[1.5px] bg-[var(--theme-accent,#91AFA9)] transition-all group-hover:w-full" />
              </a>
            ))}
          </nav>

          {/* Right Action Controls */}
          <div className="flex items-center gap-3">
            {/* Sleep Timer Indicator Button */}
            <button
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

            {/* Shortcuts Guide Button */}
            <button
              onClick={() => setShortcutsModalOpen(true)}
              className="hidden md:flex p-2 rounded-full bg-[#202B28]/80 border border-[#91AFA9]/20 text-[#B3BDB6] hover:text-[#F1F3EF] hover:border-[#91AFA9]/40 transition-colors"
              title="Keyboard Shortcuts (?)"
              aria-label="View keyboard shortcuts"
            >
              <Keyboard className="w-3.5 h-3.5" />
            </button>

            {/* Animated Luxury Hamburger Menu Button */}
            <button
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
