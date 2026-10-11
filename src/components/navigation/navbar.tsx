'use client';

import React, { useState, useEffect } from 'react';
import { Moon, Play, Pause, Menu, X, Keyboard } from 'lucide-react';
import { usePlayerStore } from '@/stores/player-store';
import { SleepTimerModal } from '@/components/ui/sleep-timer-modal';
import { KeyboardShortcutsModal } from '@/components/ui/keyboard-shortcuts-modal';

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
        <div className="max-w-7xl mx-auto px-5 sm:px-8 flex items-center justify-between">
          {/* Logo */}
          <a
            href="#"
            className="flex items-center gap-2.5 text-[#F1F3EF] hover:opacity-90 transition-opacity group"
            aria-label="Stillwave Home"
          >
            <div className="relative flex items-center justify-center w-7 h-7 rounded-lg bg-[#202B28] border border-[#91AFA9]/30">
              <span className="w-2.5 h-2.5 rounded-full bg-[#91AFA9] group-hover:scale-125 transition-transform" />
              {isPlaying && (
                <span className="absolute inset-0 rounded-lg border border-[#91AFA9] animate-ping opacity-40" />
              )}
            </div>
            <div className="flex flex-col">
              <span className="text-base font-medium tracking-[0.2em] font-heading uppercase">
                Stillwave
              </span>
              <span className="text-[9px] tracking-widest text-[#B3BDB6] uppercase -mt-1 font-mono">
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
                <span className="absolute bottom-0 left-0 w-0 h-[1.5px] bg-[#91AFA9] transition-all group-hover:w-full" />
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
                  ? 'bg-[#91AFA9]/15 border-[#91AFA9] text-[#91AFA9] animate-pulse'
                  : 'bg-[#202B28]/80 border-[#91AFA9]/20 text-[#B3BDB6] hover:text-[#F1F3EF] hover:border-[#91AFA9]/40'
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
                  ? 'bg-[#91AFA9] text-[#101816] border-[#91AFA9] shadow-sm'
                  : 'bg-[#202B28]/80 border-[#91AFA9]/20 text-[#F1F3EF] hover:border-[#91AFA9]/40'
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

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl bg-[#202B28] border border-[#91AFA9]/20 text-[#F1F3EF]"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden glass-nav border-t border-[#91AFA9]/10 px-6 py-6 space-y-4 animate-fade-in shadow-2xl">
            <nav className="flex flex-col space-y-3 text-sm text-[#B3BDB6]">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-1.5 hover:text-[#F1F3EF] border-b border-[#91AFA9]/10"
                >
                  {link.label}
                </a>
              ))}
            </nav>
            <div className="pt-2 flex flex-col gap-2.5">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  setTimerModalOpen(true);
                }}
                className="w-full py-2.5 px-4 rounded-xl bg-[#202B28] border border-[#91AFA9]/20 text-xs text-[#F1F3EF] flex items-center justify-center gap-2"
              >
                <Moon className="w-4 h-4 text-[#91AFA9]" />
                <span>Sleep Timer Settings</span>
              </button>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  setShortcutsModalOpen(true);
                }}
                className="w-full py-2.5 px-4 rounded-xl bg-[#202B28] border border-[#91AFA9]/20 text-xs text-[#F1F3EF] flex items-center justify-center gap-2"
              >
                <Keyboard className="w-4 h-4 text-[#91AFA9]" />
                <span>Keyboard Shortcuts</span>
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Modals */}
      <SleepTimerModal isOpen={timerModalOpen} onClose={() => setTimerModalOpen(false)} />
      <KeyboardShortcutsModal
        isOpen={shortcutsModalOpen}
        onClose={() => setShortcutsModalOpen(false)}
      />
    </>
  );
};
