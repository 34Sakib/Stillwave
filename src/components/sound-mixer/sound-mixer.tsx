'use client';

import React, { useState } from 'react';
import {
  RotateCcw,
  BookmarkPlus,
  Trash2,
  Play,
  Sparkles,
  Layers,
} from 'lucide-react';
import { SOUND_TRACKS, getSoundById } from '@/data/sounds';
import { INTENTION_PRESETS } from '@/data/presets';
import { MixerChannel } from './mixer-channel';
import { SaveMixModal } from '@/components/ui/save-mix-modal';
import { usePlayerStore } from '@/stores/player-store';
import { CustomMix } from '@/types';

export const SoundMixer: React.FC = () => {
  const [saveModalOpen, setSaveModalOpen] = useState(false);
  const {
    resetMix,
    customMixes,
    deleteCustomMix,
    activeLayers,
    loadPreset,
    activePresetId,
  } = usePlayerStore();

  const playingLayersCount = Object.values(activeLayers).filter((l) => l.isPlaying).length;

  const handleApplyCustomMix = async (mix: CustomMix) => {
    // Convert custom mix to temporary preset and load
    await loadPreset({
      id: mix.id,
      title: mix.name,
      subtitle: 'Custom Atmosphere',
      description: 'Your saved soundscape mixture.',
      intention: 'Relax',
      iconName: 'Bookmark',
      badge: 'User Saved',
      layers: mix.layers,
    });
  };

  return (
    <section id="atmosphere-mixer" className="py-24 px-5 sm:px-8 max-w-7xl mx-auto">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
        <div>
          <span className="text-xs uppercase font-mono tracking-widest text-[#91AFA9] block mb-2">
            04 · Multi-Track Engine
          </span>
          <h2 className="text-3xl sm:text-4xl font-light tracking-tight text-[#F1F3EF] font-heading">
            Build Your Atmosphere
          </h2>
          <p className="text-sm text-[#B3BDB6] max-w-xl mt-2 leading-relaxed">
            Layer multiple ambient frequencies at once. Fine-tune individual intensities, mute tracks, and save your personalized sanctuary recipes locally.
          </p>
        </div>

        {/* Global Mixer Actions */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => setSaveModalOpen(true)}
            disabled={playingLayersCount === 0}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#91AFA9] text-[#101816] hover:bg-[#B4CCC7] disabled:opacity-40 disabled:cursor-not-allowed font-medium text-xs transition-all shadow-md active:scale-95"
            title="Save your current audio layer combination"
          >
            <BookmarkPlus className="w-4 h-4" />
            <span>Save Custom Mix</span>
          </button>

          <button
            onClick={resetMix}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#202B28] border border-[#91AFA9]/20 text-[#B3BDB6] hover:text-[#F1F3EF] hover:border-[#91AFA9]/40 font-medium text-xs transition-all active:scale-95"
            title="Reset all tracks to silence"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reset Mix</span>
          </button>
        </div>
      </div>

      {/* Preset Shortcuts Bar */}
      <div className="mb-8 p-4 rounded-2xl bg-[#101816]/70 border border-[#91AFA9]/15 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-xs text-[#B3BDB6]">
          <Layers className="w-4 h-4 text-[#91AFA9]" />
          <span>Quick Sound Recipes:</span>
        </div>

        <div className="flex flex-wrap gap-2">
          {INTENTION_PRESETS.map((p) => {
            const isSelected = activePresetId === p.id;
            return (
              <button
                key={p.id}
                onClick={() => loadPreset(p)}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-all ${
                  isSelected
                    ? 'bg-[#91AFA9] text-[#101816] border-[#91AFA9] shadow-sm font-semibold'
                    : 'bg-[#202B28] border-[#91AFA9]/20 text-[#D8D6C9] hover:border-[#91AFA9]/40 hover:text-[#F1F3EF]'
                }`}
              >
                {p.title}
              </button>
            );
          })}
        </div>
      </div>

      {/* 6 Track Channel Fader Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {SOUND_TRACKS.map((snd) => (
          <MixerChannel key={snd.id} sound={snd} />
        ))}
      </div>

      {/* Saved Custom Mixes Section */}
      {customMixes.length > 0 && (
        <div className="mt-14 p-6 rounded-2xl bg-[#202B28]/60 border border-[#91AFA9]/20">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-4 h-4 text-[#91AFA9]" />
            <h3 className="text-sm font-medium uppercase tracking-wider text-[#F1F3EF]">
              Your Saved Atmospheres ({customMixes.length})
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {customMixes.map((mix) => (
              <div
                key={mix.id}
                className="p-4 rounded-xl bg-[#101816] border border-[#91AFA9]/20 flex items-center justify-between gap-3 group"
              >
                <div>
                  <h4 className="text-sm font-medium text-[#F1F3EF] group-hover:text-[#91AFA9] transition-colors">
                    {mix.name}
                  </h4>
                  <p className="text-[11px] text-[#B3BDB6] mt-0.5 font-mono">
                    {mix.layers.map((l) => getSoundById(l.soundId)?.title).join(', ')}
                  </p>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleApplyCustomMix(mix)}
                    className="p-2 rounded-lg bg-[#202B28] hover:bg-[#91AFA9] hover:text-[#101816] text-[#F1F3EF] transition-all"
                    title="Load this mix"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                  </button>
                  <button
                    onClick={() => deleteCustomMix(mix.id)}
                    className="p-2 rounded-lg bg-[#202B28] hover:bg-red-900/40 text-[#B3BDB6] hover:text-red-300 transition-all"
                    title="Delete mix"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Save Modal */}
      <SaveMixModal isOpen={saveModalOpen} onClose={() => setSaveModalOpen(false)} />
    </section>
  );
};
