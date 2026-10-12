'use client';

import React from 'react';
import Image from 'next/image';
import {
  Play,
  Pause,
  Moon,
  Volume2,
  PanelRight,
} from 'lucide-react';
import { usePlayerStore } from '@/stores/player-store';
import { SOUND_TRACKS } from '@/data/sounds';

export const MiniPlayer: React.FC = () => {
  const {
    currentSound,
    playbackStatus,
    togglePlayPause,
    masterVolume,
    setMasterVolume,
    sleepTimer,
    openNowPlayingDrawer,
    toggleNowPlayingDrawer,
  } = usePlayerStore();

  const isPlaying = playbackStatus === 'playing';
  const sound = currentSound || SOUND_TRACKS[0];

  const formatTimerLabel = () => {
    if (!sleepTimer.isRunning) return 'Timer';
    if (sleepTimer.isPaused) return 'Paused';
    const mins = Math.floor(sleepTimer.remainingSeconds / 60);
    const secs = sleepTimer.remainingSeconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div
      className="fixed left-1/2 -translate-x-1/2 bottom-4 sm:bottom-6 z-40 w-[calc(100%-24px)] max-w-4xl"
      role="region"
      aria-label="Audio player dock"
    >
      <div className="flex items-center justify-between gap-3 sm:gap-5 px-3.5 py-2.5 rounded-full bg-[var(--theme-surface,#101816)]/80 backdrop-blur-2xl border border-[var(--theme-border,#91AFA9)]/30 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.7)] transition-all duration-700">
        {/* Left: Thumbnail & Title (Clicking opens the Now Playing drawer) */}
        <button
          type="button"
          onClick={openNowPlayingDrawer}
          className="flex items-center gap-3 min-w-0 text-left hover:opacity-90 transition-opacity cursor-pointer flex-1"
          aria-label="Open now playing drawer"
        >
          <div className="relative w-11 h-11 rounded-full overflow-hidden shrink-0 border border-[var(--theme-border-subtle,rgba(145,175,169,0.2))] shadow-sm bg-black/30">
            <img
              src={sound.artwork}
              alt={sound.title}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>

          <div className="min-w-0 pr-1">
            <div className="font-heading font-medium text-sm text-[var(--theme-text-primary,#F1F3EF)] truncate">
              {currentSound ? sound.title : 'Nothing playing'}
            </div>
            <div className="text-[11px] text-[var(--theme-text-secondary,#B3BDB6)] truncate font-sans">
              {currentSound ? sound.subtitle : 'Choose a soundscape to begin'}
            </div>
          </div>
        </button>

        {/* Center/Right Controls: Timer, Volume, Drawer Toggle, Play/Pause */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Sleep Timer Button */}
          <button
            type="button"
            onClick={openNowPlayingDrawer}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-mono border transition-all cursor-pointer ${
              sleepTimer.isRunning
                ? 'bg-[var(--theme-accent,#91AFA9)]/20 border-[var(--theme-accent,#91AFA9)] text-[var(--theme-accent,#91AFA9)] font-medium'
                : 'bg-[var(--theme-elevated,#1A2623)] border-[var(--theme-border-subtle,rgba(145,175,169,0.2))] text-[var(--theme-text-secondary,#B3BDB6)] hover:text-[var(--theme-text-primary,#F1F3EF)] hover:border-[var(--theme-accent,#91AFA9)]'
            }`}
            title="Configure Sleep Timer"
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                sleepTimer.isRunning
                  ? sleepTimer.isPaused
                    ? 'bg-amber-400'
                    : 'bg-emerald-400 animate-pulse'
                  : 'bg-transparent'
              }`}
            />
            <Moon className="w-3 h-3" />
            <span className="hidden sm:inline">{formatTimerLabel()}</span>
          </button>

          {/* Inline Volume Slider (desktop/tablet) */}
          <div className="hidden md:flex items-center gap-2 w-28 px-2 py-1 rounded-full bg-[var(--theme-elevated,#1A2623)] border border-[var(--theme-border-subtle,rgba(145,175,169,0.2))]">
            <Volume2 className="w-3.5 h-3.5 text-[var(--theme-text-secondary,#B3BDB6)] shrink-0" />
            <input
              type="range"
              min={0}
              max={100}
              value={Math.round(masterVolume * 100)}
              onChange={(e) => setMasterVolume(Number(e.target.value) / 100)}
              className="w-full accent-[var(--theme-accent,#91AFA9)] cursor-pointer h-1"
              aria-label="Dock volume slider"
            />
          </div>

          {/* Toggle Now Playing Drawer Button */}
          <button
            type="button"
            onClick={toggleNowPlayingDrawer}
            className="p-2 rounded-full bg-[var(--theme-elevated,#1A2623)] hover:bg-[var(--theme-hover,#243430)] border border-[var(--theme-border-subtle,rgba(145,175,169,0.2))] text-[var(--theme-text-secondary,#B3BDB6)] hover:text-[var(--theme-text-primary,#F1F3EF)] transition-all cursor-pointer"
            title="Toggle Now Playing Panel"
            aria-label="Toggle now playing panel"
          >
            <PanelRight className="w-4 h-4 text-[var(--theme-accent,#91AFA9)]" />
          </button>

          {/* Large Circular Play/Pause Button */}
          <button
            type="button"
            onClick={togglePlayPause}
            className="w-11 h-11 rounded-full bg-[var(--theme-accent,#91AFA9)] text-[var(--theme-bg,#101816)] flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-md shrink-0 cursor-pointer"
            aria-label={isPlaying ? 'Pause audio' : 'Play audio'}
          >
            {isPlaying ? (
              <Pause className="w-4 h-4 fill-current" />
            ) : (
              <Play className="w-4 h-4 fill-current ml-0.5" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
