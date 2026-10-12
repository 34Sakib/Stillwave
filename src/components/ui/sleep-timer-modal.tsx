'use client';

import React, { useState } from 'react';
import { X, Moon, Clock, AlertCircle } from 'lucide-react';
import { usePlayerStore } from '@/stores/player-store';

interface SleepTimerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SleepTimerModal: React.FC<SleepTimerModalProps> = ({ isOpen, onClose }) => {
  const { sleepTimer, setSleepTimer, cancelSleepTimer } = usePlayerStore();
  const [customMin, setCustomMin] = useState<number>(20);

  if (!isOpen) return null;

  const presets = [15, 30, 45, 60, 90];

  const formatTime = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
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
              <p className="text-xs text-[#B3BDB6]">Gradual 30-second fade out before stopping</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#B3BDB6] hover:text-[#F1F3EF] hover:bg-[#101816]/50 transition-colors"
            aria-label="Close sleep timer modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Active Timer Display */}
        {sleepTimer.isRunning ? (
          <div className="my-6 p-4 rounded-xl bg-[#101816]/80 border border-[#91AFA9]/30 text-center">
            <span className="text-xs uppercase tracking-widest text-[#91AFA9] font-medium">Timer Active</span>
            <div className="text-4xl font-light font-mono mt-2 text-[#F1F3EF] tracking-wider">
              {formatTime(sleepTimer.remainingSeconds)}
            </div>
            <p className="text-xs text-[#B3BDB6] mt-2 flex items-center justify-center gap-1.5">
              <AlertCircle className="w-3.5 h-3.5 text-[#91AFA9]" />
              Volume will gently fade out in the final 30 seconds
            </p>
            <button
              onClick={() => {
                cancelSleepTimer();
              }}
              className="mt-4 px-4 py-2 rounded-xl bg-red-900/30 text-red-300 border border-red-500/30 text-xs font-medium hover:bg-red-900/50 transition-colors"
            >
              Cancel Timer
            </button>
          </div>
        ) : (
          <div className="my-6 space-y-4">
            <p className="text-xs text-[#B3BDB6]">
              Choose a duration to drift off peacefully. Audio will lower imperceptibly before pausing:
            </p>

            <div className="grid grid-cols-3 gap-2.5">
              {presets.map((min) => (
                <button
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
          </div>
        )}

        {/* Footer */}
        <div className="pt-3 border-t border-[#91AFA9]/10 flex justify-end">
          <button
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
