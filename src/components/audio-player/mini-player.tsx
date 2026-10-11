'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import {
  Play,
  Pause,
  Square,
  Volume2,
  VolumeX,
  Moon,
  ChevronUp,
  X,
  Sliders,
  AlertCircle,
  Loader2,
} from 'lucide-react';
import { usePlayerStore } from '@/stores/player-store';
import { SleepTimerModal } from '@/components/ui/sleep-timer-modal';

export const MiniPlayer: React.FC = () => {
  const {
    currentSound,
    playbackStatus,
    togglePlayPause,
    stopPlayback,
    masterVolume,
    setMasterVolume,
    sleepTimer,
    isMiniPlayerOpen,
    closeMiniPlayer,
    openMiniPlayer,
    activeLayers,
  } = usePlayerStore();

  const [timerModalOpen, setTimerModalOpen] = useState(false);

  // If no sound has been selected yet or mini-player closed, show subtle floating pill or dock
  if (!currentSound || !isMiniPlayerOpen) {
    if (playbackStatus === 'playing' && currentSound) {
      return (
        <div className="fixed bottom-5 right-5 z-40">
          <button
            onClick={openMiniPlayer}
            className="flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-[#202B28] border border-[#91AFA9]/40 text-[#F1F3EF] shadow-2xl hover:border-[#91AFA9] transition-all"
            aria-label="Re-open audio player"
          >
            <div className="w-2.5 h-2.5 rounded-full bg-[#91AFA9] animate-pulse" />
            <span className="text-xs font-medium font-mono">{currentSound.title}</span>
            <ChevronUp className="w-3.5 h-3.5 text-[#91AFA9]" />
          </button>
        </div>
      );
    }
    return null;
  }

  const isPlaying = playbackStatus === 'playing';
  const isLoading = playbackStatus === 'loading' || playbackStatus === 'switching';
  const isError = playbackStatus === 'error';
  const activeLayersCount = Object.values(activeLayers).filter((l) => l.isPlaying).length;

  return (
    <>
      <div
        className="fixed bottom-0 left-0 right-0 z-40 px-3 sm:px-6 pb-3 pt-2 bg-gradient-to-t from-black/80 via-black/40 to-transparent pointer-events-none"
        role="region"
        aria-label="Persistent Mini Audio Player"
      >
        <div className="max-w-5xl mx-auto glass-panel rounded-2xl p-3 sm:px-5 sm:py-3.5 border border-[#91AFA9]/25 shadow-2xl flex items-center justify-between gap-3 sm:gap-6 pointer-events-auto">
          {/* Left: Artwork, Track Info, State Badges */}
          <div className="flex items-center gap-3 min-w-0">
            <div className="relative w-11 h-11 rounded-xl overflow-hidden border border-[#91AFA9]/20 shrink-0 bg-[#101816]">
              <Image
                src={currentSound.artwork}
                alt={currentSound.title}
                fill
                sizes="44px"
                className="object-cover"
              />
              {isPlaying && (
                <div className="absolute inset-0 bg-[#91AFA9]/20 flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-[#91AFA9] animate-ping" />
                </div>
              )}
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <a
                  href="#listening-room"
                  className="text-xs sm:text-sm font-medium text-[#F1F3EF] hover:text-[#91AFA9] transition-colors truncate block"
                  title="Go to Listening Lounge"
                >
                  {currentSound.title}
                </a>

                {activeLayersCount > 1 && (
                  <span className="hidden sm:inline-block px-2 py-0.5 rounded-full text-[10px] font-mono bg-[#91AFA9]/20 text-[#91AFA9] border border-[#91AFA9]/20 shrink-0">
                    +{activeLayersCount - 1} layers
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2 text-[10px] text-[#B3BDB6] font-mono">
                {isLoading ? (
                  <span className="text-[#D8D6C9] flex items-center gap-1">
                    <Loader2 className="w-2.5 h-2.5 animate-spin text-[#91AFA9]" />
                    Fading in...
                  </span>
                ) : isError ? (
                  <span className="text-rose-400 flex items-center gap-1">
                    <AlertCircle className="w-2.5 h-2.5" />
                    Playback error
                  </span>
                ) : isPlaying ? (
                  <span className="text-[#91AFA9]">Playing ambience</span>
                ) : (
                  <span>Paused</span>
                )}

                {sleepTimer.isRunning && (
                  <span className="text-[#D8D6C9]">
                    • Timer: {Math.floor(sleepTimer.remainingSeconds / 60)}m
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Center: Playback Controls */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Play/Pause Button */}
            <button
              onClick={togglePlayPause}
              disabled={isLoading}
              className="p-3 rounded-xl bg-[#91AFA9] text-[#101816] hover:bg-[#B4CCC7] active:scale-95 transition-all shadow-md"
              aria-label={isPlaying ? 'Pause audio' : 'Play audio'}
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin text-[#101816]" />
              ) : isPlaying ? (
                <Pause className="w-4 h-4 fill-current" />
              ) : (
                <Play className="w-4 h-4 fill-current ml-0.5" />
              )}
            </button>

            {/* Stop button */}
            <button
              onClick={stopPlayback}
              className="p-2.5 rounded-xl bg-[#101816] text-[#B3BDB6] hover:text-[#F1F3EF] hover:bg-[#283633] border border-[#91AFA9]/20 transition-colors"
              title="Stop playback"
              aria-label="Stop playback"
            >
              <Square className="w-3.5 h-3.5 fill-current" />
            </button>
          </div>

          {/* Right: Master Volume Slider & Sleep & Dismiss */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Volume Control (hidden on extra small screens) */}
            <div className="hidden md:flex items-center gap-2.5 w-32">
              <button
                onClick={() => setMasterVolume(masterVolume > 0 ? 0 : 0.8)}
                className="text-[#B3BDB6] hover:text-[#F1F3EF] transition-colors"
                title="Toggle Mute"
              >
                {masterVolume === 0 ? (
                  <VolumeX className="w-4 h-4 text-rose-400" />
                ) : (
                  <Volume2 className="w-4 h-4 text-[#91AFA9]" />
                )}
              </button>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={masterVolume}
                onChange={(e) => setMasterVolume(parseFloat(e.target.value))}
                className="w-full"
                aria-label="Master volume"
              />
            </div>

            {/* Sleep Timer button */}
            <button
              onClick={() => setTimerModalOpen(true)}
              className={`p-2 rounded-xl border transition-all ${
                sleepTimer.isRunning
                  ? 'bg-[#91AFA9]/20 border-[#91AFA9] text-[#91AFA9]'
                  : 'bg-[#101816] border-[#91AFA9]/20 text-[#B3BDB6] hover:text-[#F1F3EF]'
              }`}
              title="Sleep Timer"
              aria-label="Sleep timer"
            >
              <Moon className="w-3.5 h-3.5" />
            </button>

            {/* Open Mixer Anchor */}
            <a
              href="#atmosphere-mixer"
              className="hidden sm:flex p-2 rounded-xl bg-[#101816] border border-[#91AFA9]/20 text-[#B3BDB6] hover:text-[#F1F3EF] transition-colors"
              title="Open Multi-Track Mixer"
              aria-label="Open atmosphere mixer"
            >
              <Sliders className="w-3.5 h-3.5 text-[#91AFA9]" />
            </a>

            {/* Minimize / Dismiss player */}
            <button
              onClick={closeMiniPlayer}
              className="p-1.5 rounded-lg text-[#7E8D86] hover:text-[#F1F3EF] hover:bg-[#101816] transition-colors"
              title="Minimize player"
              aria-label="Minimize player"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <SleepTimerModal isOpen={timerModalOpen} onClose={() => setTimerModalOpen(false)} />
    </>
  );
};
