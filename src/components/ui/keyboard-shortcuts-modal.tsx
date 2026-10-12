'use client';

import React from 'react';
import { X, Keyboard } from 'lucide-react';

interface KeyboardShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const KeyboardShortcutsModal: React.FC<KeyboardShortcutsModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const shortcuts = [
    { key: 'Space', desc: 'Play / Pause active soundscape' },
    { key: 'S', desc: 'Stop all playback and reset' },
    { key: 'M', desc: 'Mute / Unmute audio' },
    { key: '↑ / ↓', desc: 'Increase / Decrease master volume' },
    { key: 'T', desc: 'Open sleep timer' },
    { key: 'Esc', desc: 'Close any active modal' },
  ];

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md cursor-pointer"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md bg-[var(--theme-surface,#202B28)] border border-[var(--theme-border-subtle,rgba(145,175,169,0.2))] rounded-2xl p-6 shadow-2xl text-[#F1F3EF] relative cursor-default transition-colors duration-1000"
        role="dialog"
        aria-modal="true"
        aria-labelledby="shortcuts-title"
      >
        <div className="flex items-center justify-between pb-4 border-b border-[#91AFA9]/10">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-[#101816] text-[#91AFA9] border border-[#91AFA9]/20">
              <Keyboard className="w-5 h-5" />
            </div>
            <div>
              <h2 id="shortcuts-title" className="text-lg font-semibold">
                Keyboard Shortcuts
              </h2>
              <p className="text-xs text-[#B3BDB6]">Control Stillwave hands-free</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#B3BDB6] hover:text-[#F1F3EF] hover:bg-[#101816]/50 transition-colors"
            aria-label="Close keyboard shortcuts modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="my-5 space-y-2.5">
          {shortcuts.map((item, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between py-2 px-3 rounded-xl bg-[#101816]/60 border border-[#91AFA9]/10 text-xs"
            >
              <span className="text-[#B3BDB6]">{item.desc}</span>
              <kbd className="px-2 py-1 bg-[#283633] border border-[#91AFA9]/30 rounded-md font-mono text-[11px] text-[#F1F3EF] shadow-sm">
                {item.key}
              </kbd>
            </div>
          ))}
        </div>

        <div className="pt-3 border-t border-[#91AFA9]/10 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs text-[#B3BDB6] hover:text-[#F1F3EF] hover:bg-[#101816] transition-colors"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
};
