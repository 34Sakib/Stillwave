'use client';

import React, { useState } from 'react';
import { X, Moon, Clock, AlertCircle, Play, Pause, Smartphone, Plus } from 'lucide-react';
import { usePlayerStore } from '@/stores/player-store';

interface SleepTimerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SleepTimerModal: React.FC<SleepTimerModalProps> = ({ isOpen, onClose }) => {
  const {
    sleepTimer,
    setSleepTimer,
    cancelSleepTimer,
    togglePlayPause,
    playbackStatus,
    currentSound,
  } = usePlayerStore();
  const [customMin, setCustomMin] = useState<number>(20);

  if (!isOpen) return null;

  const presets = [15, 30, 45, 60, 90];

  const formatTime = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const isAudioPlaying = playbackStatus === 'playing';

  const handleAddMinutes = (additionalMin: number) => {
    const currentRemainingMin = Math.ceil(sleepTimer.remainingSeconds / 60);
    setSleepTimer(currentRemainingMin + additionalMin);
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fade-in cursor-pointer"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md bg-[var(--theme-surface,#202B28)] border border-[var(--theme-border-subtle,rgba(145,175,169,0.2))] rounded-2xl p-6 shadow-2xl text-[#F1F3EF] relative cursor-default transition-colors duration-1000"
        role="dialog"
        aria-modal="true"
        aria-labelledby="timer-modal-title"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#91AFA9]/10">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-[#101816] text-[#91AFA9] border border-[#91AFA9]/20">
              <Moon className="w-5 h-5" />
            </div>
            <div>
              <h2 id="timer-modal-title" className="text-lg font-semibold tracking-wide">
                Sleep Timer
              </h2>
              <p className="text-xs text-[#B3BDB6]">Auto shut-off even with phone screen off</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#B3BDB6] hover:text-[#F1F3EF] hover:bg-[#101816]/50 transition-colors"
            aria-label="Close sleep timer modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Active Timer Display */}
        {sleepTimer.isRunning ? (
          <div className="my-6 p-5 rounded-2xl bg-[#101816]/90 border border-[var(--theme-border,#91AFA9)]/30 text-center space-y-4 shadow-inner">
            <div className="flex items-center justify-center gap-2">
              <span
                className={`w-2 h-2 rounded-full ${
                  sleepTimer.isPaused ? 'bg-amber-400' : 'bg-emerald-400 animate-pulse'
                }`}
              />
              <span className="text-xs uppercase tracking-widest text-[#91AFA9] font-medium">
                {sleepTimer.isPaused ? 'Timer Paused' : 'Timer Active'}
                {currentSound ? ` • ${currentSound.title}` : ''}
              </span>
            </div>

            <div className="text-5xl font-light font-mono text-[#F1F3EF] tracking-wider py-1">
              {formatTime(sleepTimer.remainingSeconds)}
            </div>

            {/* Screen-off background indicator */}
            <div className="flex items-center justify-center gap-1.5 text-[11px] text-[#B3BDB6] bg-[#1a2522]/60 py-1.5 px-3 rounded-lg border border-[#91AFA9]/10">
              <Smartphone className="w-3.5 h-3.5 text-[#91AFA9]" />
              <span>Plays in background when screen is locked or turned off</span>
            </div>

            {/* Mid-timer control buttons (Pause / Resume and Turn Off) */}
            <div className="grid grid-cols-2 gap-2.5 pt-2">
              <button
                type="button"
                onClick={togglePlayPause}
                className="py-2.5 px-3 rounded-xl bg-[#283633] hover:bg-[#344541] border border-[#91AFA9]/25 text-xs font-medium text-[#F1F3EF] flex items-center justify-center gap-2 transition-all shadow-sm"
              >
                {isAudioPlaying ? (
                  <>
                    <Pause className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                    Pause Sound
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5 text-emerald-400 fill-emerald-400" />
                    Resume Sound
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={cancelSleepTimer}
                className="py-2.5 px-3 rounded-xl bg-red-950/40 hover:bg-red-900/60 text-red-300 border border-red-500/30 text-xs font-medium transition-all shadow-sm"
              >
                Turn Off Timer
              </button>
            </div>

            {/* Quick Extension Chips */}
            <div className="pt-2 border-t border-[#91AFA9]/10 flex items-center justify-center gap-2">
              <span className="text-[11px] text-[#7E8D86]">Add time:</span>
              {[5, 15, 30].map((mins) => (
                <button
                  type="button"
                  key={mins}
                  onClick={() => handleAddMinutes(mins)}
                  className="px-2.5 py-1 rounded-lg bg-[#141E1C] hover:bg-[#283633] text-[11px] text-[#91AFA9] border border-[#91AFA9]/20 transition-all flex items-center gap-1"
                >
                  <Plus className="w-2.5 h-2.5" />
                  {mins}m
                </button>
              ))}
            </div>

            <p className="text-[11px] text-[#B3BDB6]/80 flex items-center justify-center gap-1.5 pt-1">
              <AlertCircle className="w-3 h-3 text-[#91AFA9]" />
              Gentle volume fade-out begins in final 30 seconds
            </p>
          </div>
        ) : (
          <div className="my-6 space-y-4">
            <p className="text-xs text-[#B3BDB6]">
              Choose a duration to drift off peacefully. Audio will automatically turn off when time expires, even if your phone screen is off:
            </p>

            <div className="grid grid-cols-3 gap-2.5">
              {presets.map((min) => (
                <button
                  type="button"
                  key={min}
                  onClick={() => {
                    setSleepTimer(min);
                    onClose();
                  }}
                  className="py-2.5 px-3 rounded-xl bg-[#101816] border border-[#91AFA9]/15 hover:border-[#91AFA9]/50 hover:bg-[#283633] text-sm font-medium transition-all text-[#F1F3EF] flex flex-col items-center justify-center gap-1 group"
                >
                  <span className="text-base group-hover:text-[#91AFA9]">{min}m</span>
                  <span className="text-[10px] text-[#7E8D86]">minutes</span>
                </button>
              ))}

              <div className="flex items-center gap-2 col-span-3 pt-2">
                <input
                  type="number"
                  min={1}
                  max={240}
                  value={customMin}
                  onChange={(e) => setCustomMin(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-20 px-3 py-2 bg-[#101816] border border-[#91AFA9]/20 rounded-xl text-center text-sm font-mono focus:border-[#91AFA9] outline-none"
                />
                <button
                  type="button"
                  onClick={() => {
                    setSleepTimer(customMin);
                    onClose();
                  }}
                  className="flex-1 py-2 px-4 rounded-xl bg-[#91AFA9] text-[#101816] font-medium text-xs hover:bg-[#B4CCC7] transition-all flex items-center justify-center gap-1.5 shadow-md"
                >
                  <Clock className="w-3.5 h-3.5" />
                  Set Custom {customMin} Minutes
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2 text-[11px] text-[#91AFA9] bg-[#101816]/60 p-2.5 rounded-xl border border-[#91AFA9]/15">
              <Smartphone className="w-4 h-4 flex-shrink-0" />
              <span>Full Lock Screen & Dynamic Island controls supported on iOS & Android.</span>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="pt-3 border-t border-[#91AFA9]/10 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs text-[#B3BDB6] hover:text-[#F1F3EF] hover:bg-[#101816] transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
