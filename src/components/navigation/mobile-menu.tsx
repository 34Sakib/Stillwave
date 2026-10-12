'use client';

import React, { useEffect } from 'react';
import Image from 'next/image';
import {
  X,
  Play,
  Pause,
  Moon,
  Volume2,
  VolumeX,
  Keyboard,
  ChevronRight,
  Headphones,
  Sparkles,
} from 'lucide-react';
import { usePlayerStore } from '@/stores/player-store';
import { SOUND_TRACKS } from '@/data/sounds';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenTimer: () => void;
  onOpenShortcuts: () => void;
}

export const MobileMenu: React.FC<MobileMenuProps> = ({
  isOpen,
  onClose,
  onOpenTimer,
  onOpenShortcuts,
}) => {
  const {
    playbackStatus,
    currentSound,
    togglePlayPause,
    playSingleSound,
    masterVolume,
    setMasterVolume,
    sleepTimer,
    activeLayers,
  } = usePlayerStore();

  const isPlaying = playbackStatus === 'playing';
  const activeLayersCount = Object.values(activeLayers).filter((l) => l.isPlaying).length;

  // Lock background scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isOpen]);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const menuItems: Array<{
    num: string;
    label: string;
    description: string;
    href: string;
    badge?: string;
  }> = [
    {
      num: '01',
      label: 'Soundscapes',
      description: 'Continuous loopable natural acoustic environments',
      href: '#soundscapes',
    },
    {
      num: '02',
      label: 'Intentions',
      description: 'Curated cognitive session recipes for Focus, Sleep & Calm',
      href: '#intentions',
    },
    {
      num: '03',
      label: 'Rituals',
      description: 'Circadian daily habits, timers & acoustic presets',
      href: '#ritual',
    },
  ];

  const handleStartDefaultTrack = () => {
    const defaultTrack = SOUND_TRACKS[0]; // Gentle rain
    playSingleSound(defaultTrack);
  };

  return (
    <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true" aria-label="Navigation Menu">
      {/* Dark Frosted Glass Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-[#0A0F0E]/80 backdrop-blur-md transition-opacity duration-300"
        aria-hidden="true"
      />

      {/* Slide-Over Drawer Container */}
      <div className="fixed inset-y-0 right-0 w-full sm:max-w-md bg-[#101816]/98 backdrop-blur-2xl border-l border-[#91AFA9]/20 shadow-2xl flex flex-col justify-between overflow-hidden animate-slide-left">
        {/* Drawer Header */}
        <div className="px-6 py-5 border-b border-[#91AFA9]/15 flex items-center justify-between bg-[#101816]/70">
          <div className="flex items-center gap-2.5">
            <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-[#202B28] border border-[#91AFA9]/30">
              <span className={`w-2.5 h-2.5 rounded-full bg-[#91AFA9] ${isPlaying ? 'animate-pulse' : ''}`} />
            </div>
            <div>
              <span className="text-sm font-medium tracking-[0.2em] font-heading uppercase text-[#F1F3EF] block">
                Stillwave
              </span>
              <span className="text-[9px] tracking-widest text-[#91AFA9] uppercase font-mono block -mt-0.5">
                Sound Sanctuary
              </span>
            </div>
          </div>

          {/* Close Button */}
          <button
            onClick={onClose}
            className="p-2.5 rounded-xl bg-[#202B28] border border-[#91AFA9]/25 text-[#F1F3EF] hover:bg-[#283633] hover:text-[#91AFA9] transition-all active:scale-95"
            aria-label="Close navigation menu"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Center Content */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">
          {/* Live Audio Capsule Card */}
          <div className="p-4 rounded-2xl bg-[#202B28]/80 border border-[#91AFA9]/20 shadow-lg relative overflow-hidden">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                {currentSound ? (
                  <div className="relative w-12 h-12 rounded-xl overflow-hidden shrink-0 border border-[#91AFA9]/30">
                    <Image
                      src={currentSound.artwork}
                      alt={currentSound.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-12 h-12 rounded-xl bg-[#101816] border border-[#91AFA9]/25 flex items-center justify-center shrink-0 text-[#91AFA9]">
                    <Headphones className="w-5 h-5" />
                  </div>
                )}

                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] uppercase font-mono tracking-wider text-[#91AFA9]">
                      {currentSound ? currentSound.category : 'Acoustics'}
                    </span>
                    {isPlaying && (
                      <div className="flex items-end gap-0.5 h-3">
                        <span className="w-0.5 h-3 bg-[#91AFA9] animate-pulse" />
                        <span className="w-0.5 h-2 bg-[#91AFA9] animate-pulse delay-75" />
                        <span className="w-0.5 h-3.5 bg-[#91AFA9] animate-pulse delay-150" />
                      </div>
                    )}
                  </div>
                  <h4 className="text-sm font-medium text-[#F1F3EF] truncate">
                    {currentSound ? currentSound.title : 'Ready to listen'}
                  </h4>
                  <p className="text-[11px] text-[#B3BDB6] truncate">
                    {isPlaying
                      ? 'Continuous natural playback'
                      : currentSound
                      ? 'Paused · Tap to resume'
                      : 'Explore curated atmospheres'}
                  </p>
                </div>
              </div>

              {/* Play / Pause Action Button */}
              {currentSound ? (
                <button
                  onClick={togglePlayPause}
                  className={`p-3 rounded-xl border transition-all shrink-0 active:scale-95 ${
                    isPlaying
                      ? 'bg-[#91AFA9] text-[#101816] border-[#91AFA9] shadow-md'
                      : 'bg-[#101816] text-[#F1F3EF] border-[#91AFA9]/30 hover:bg-[#91AFA9] hover:text-[#101816]'
                  }`}
                  aria-label={isPlaying ? 'Pause current sound' : 'Resume playback'}
                >
                  {isPlaying ? (
                    <Pause className="w-4 h-4 fill-current" />
                  ) : (
                    <Play className="w-4 h-4 fill-current ml-0.5" />
                  )}
                </button>
              ) : (
                <button
                  onClick={handleStartDefaultTrack}
                  className="px-3.5 py-2 rounded-xl bg-[#91AFA9] text-[#101816] font-medium text-xs border border-[#91AFA9] shadow-md flex items-center gap-1.5 shrink-0 active:scale-95"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Start</span>
                </button>
              )}
            </div>

            {/* Quick Volume Slider in Card */}
            <div className="mt-3.5 pt-3 border-t border-[#91AFA9]/10 flex items-center gap-3">
              <button
                onClick={() => setMasterVolume(masterVolume > 0 ? 0 : 0.8)}
                className="text-[#91AFA9] hover:text-[#F1F3EF] transition-colors p-1"
                aria-label={masterVolume === 0 ? 'Unmute master volume' : 'Mute master volume'}
              >
                {masterVolume === 0 ? (
                  <VolumeX className="w-3.5 h-3.5 text-rose-300" />
                ) : (
                  <Volume2 className="w-3.5 h-3.5" />
                )}
              </button>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={masterVolume}
                onChange={(e) => setMasterVolume(parseFloat(e.target.value))}
                className="w-full accent-[#91AFA9] h-1.5 bg-[#101816] rounded-full"
                aria-label="Master volume"
              />
              <span className="text-[10px] font-mono text-[#B3BDB6] w-7 text-right">
                {Math.round(masterVolume * 100)}%
              </span>
            </div>
          </div>

          {/* Navigation Links Catalog */}
          <div>
            <span className="text-[10px] uppercase font-mono tracking-widest text-[#7E8D86] block mb-3 px-1">
              Sanctuary Index
            </span>
            <nav className="space-y-1">
              {menuItems.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={onClose}
                  className="group flex items-center justify-between p-3 rounded-xl hover:bg-[#202B28]/90 transition-all border border-transparent hover:border-[#91AFA9]/20"
                >
                  <div className="flex items-start gap-3">
                    <span className="text-xs font-mono text-[#91AFA9]/70 group-hover:text-[#91AFA9] transition-colors pt-0.5">
                      {item.num}
                    </span>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-base font-light text-[#F1F3EF] group-hover:text-[#91AFA9] transition-colors font-heading">
                          {item.label}
                        </span>
                        {item.badge && (
                          <span className="text-[9px] px-2 py-0.5 rounded-full bg-[#91AFA9]/20 text-[#91AFA9] font-mono border border-[#91AFA9]/30">
                            {item.badge}
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-[#7E8D86] group-hover:text-[#B3BDB6] transition-colors leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-[#7E8D86] group-hover:text-[#91AFA9] group-hover:translate-x-0.5 transition-all shrink-0 ml-2" />
                </a>
              ))}
            </nav>
          </div>

          {/* Sanctuary Quick Utilities */}
          <div className="pt-2 border-t border-[#91AFA9]/10 space-y-2.5">
            <span className="text-[10px] uppercase font-mono tracking-widest text-[#7E8D86] block px-1">
              Quick Tools
            </span>
            <div className="grid grid-cols-2 gap-2.5">
              <button
                onClick={() => {
                  onClose();
                  onOpenTimer();
                }}
                className={`p-3 rounded-xl border flex flex-col items-start gap-1.5 transition-all active:scale-95 ${
                  sleepTimer.isRunning
                    ? 'bg-[#91AFA9]/15 border-[#91AFA9] text-[#91AFA9]'
                    : 'bg-[#202B28] border-[#91AFA9]/20 text-[#F1F3EF] hover:border-[#91AFA9]/40'
                }`}
              >
                <Moon className="w-4 h-4 text-[#91AFA9]" />
                <span className="text-xs font-medium">Sleep Timer</span>
                <span className="text-[10px] font-mono text-[#B3BDB6]">
                  {sleepTimer.isRunning
                    ? `${Math.floor(sleepTimer.remainingSeconds / 60)}m left`
                    : 'Set countdown'}
                </span>
              </button>

              <button
                onClick={() => {
                  onClose();
                  onOpenShortcuts();
                }}
                className="p-3 rounded-xl bg-[#202B28] border border-[#91AFA9]/20 text-[#F1F3EF] hover:border-[#91AFA9]/40 flex flex-col items-start gap-1.5 transition-all active:scale-95"
              >
                <Keyboard className="w-4 h-4 text-[#91AFA9]" />
                <span className="text-xs font-medium">Shortcuts</span>
                <span className="text-[10px] font-mono text-[#B3BDB6]">
                  Press &apos;?&apos; anytime
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Drawer Footer */}
        <div className="px-6 py-4 border-t border-[#91AFA9]/15 bg-[#101816]/90 flex items-center justify-between text-[11px] text-[#7E8D86] font-mono">
          <span>Continuous Natural Acoustics</span>
          <span className="text-[#91AFA9]">v1.0 · Stillwave</span>
        </div>
      </div>
    </div>
  );
};
