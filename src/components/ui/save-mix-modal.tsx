'use client';

import React, { useState } from 'react';
import { X, Sparkles, Check, BookmarkPlus } from 'lucide-react';
import { usePlayerStore } from '@/stores/player-store';

interface SaveMixModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SaveMixModal: React.FC<SaveMixModalProps> = ({ isOpen, onClose }) => {
  const { saveCustomMix, activeLayers } = usePlayerStore();
  const [mixName, setMixName] = useState('');
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  const activeCount = Object.values(activeLayers).filter((l) => l.isPlaying).length;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!mixName.trim()) return;

    saveCustomMix(mixName.trim());
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      setMixName('');
      onClose();
    }, 1200);
  };

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
        aria-labelledby="save-mix-title"
      >
        <div className="flex items-center justify-between pb-4 border-b border-[#91AFA9]/10">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-[#101816] text-[#91AFA9] border border-[#91AFA9]/20">
              <BookmarkPlus className="w-5 h-5" />
            </div>
            <div>
              <h2 id="save-mix-title" className="text-lg font-semibold">
                Save Atmosphere
              </h2>
              <p className="text-xs text-[#B3BDB6]">
                Save your custom {activeCount} sound combination
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#B3BDB6] hover:text-[#F1F3EF] hover:bg-[#101816]/50 transition-colors"
            aria-label="Close save mix modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {savedSuccess ? (
          <div className="my-8 text-center py-4">
            <div className="w-12 h-12 mx-auto rounded-full bg-[#91AFA9]/20 text-[#91AFA9] flex items-center justify-center mb-3">
              <Check className="w-6 h-6" />
            </div>
            <h3 className="text-base font-medium">Atmosphere Saved!</h3>
            <p className="text-xs text-[#B3BDB6] mt-1">Available under Your Saved Mixes</p>
          </div>
        ) : (
          <form onSubmit={handleSave} className="my-6 space-y-4">
            <div>
              <label htmlFor="mix-name-input" className="block text-xs font-medium text-[#B3BDB6] mb-2">
                Mix Name
              </label>
              <input
                id="mix-name-input"
                type="text"
                required
                placeholder="e.g. Rainy Cabin Night, Nordic Dawn..."
                value={mixName}
                onChange={(e) => setMixName(e.target.value)}
                className="w-full px-4 py-3 bg-[#101816] border border-[#91AFA9]/20 rounded-xl text-sm focus:border-[#91AFA9] outline-none text-[#F1F3EF] placeholder-[#7E8D86]"
                autoFocus
              />
            </div>

            <div className="p-3 rounded-xl bg-[#101816]/60 border border-[#91AFA9]/10 text-xs text-[#B3BDB6] flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#91AFA9] shrink-0" />
              <span>
                Preserves individual volume faders and active audio layers in your browser storage.
              </span>
            </div>

            <div className="pt-2 flex justify-end gap-2.5">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl text-xs text-[#B3BDB6] hover:text-[#F1F3EF] hover:bg-[#101816] transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!mixName.trim()}
                className="px-5 py-2.5 rounded-xl bg-[#91AFA9] text-[#101816] font-medium text-xs hover:bg-[#B4CCC7] disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-md"
              >
                Save Mix
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
