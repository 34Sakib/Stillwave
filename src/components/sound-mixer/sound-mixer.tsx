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
  const [activeMixerTab, setActiveMixerTab] = useState<'curated' | 'focus' | 'sleep' | 'meditation' | 'all'>('curated');
  const {
    resetMix,
    customMixes,
    deleteCustomMix,
    activeLayers,
    loadPreset,
    activePresetId,
  } = usePlayerStore();

  const curatedSoundIds = ['rain', 'ocean', 'forest', 'fireplace', 'wind', 'snow'];
  const displayedTracks = React.useMemo(() => {
    switch (activeMixerTab) {
      case 'curated':
        return SOUND_TRACKS.filter((s) => curatedSoundIds.includes(s.id));
      case 'focus':
        return SOUND_TRACKS.filter((s) => s.tag === 'Focus');
      case 'sleep':
        return SOUND_TRACKS.filter((s) => s.tag === 'Deep Sleep');
      case 'meditation':
        return SOUND_TRACKS.filter((s) => s.tag === 'Meditation' || s.tag === 'Calm');
      case 'all':
      default:
        return SOUND_TRACKS;
    }
  }, [activeMixerTab]);

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
          <div className="text-xs uppercase font-mono tracking-widest text-[var(--theme-accent,#91AFA9)] flex items-center gap-3 mb-2 transition-colors duration-1000">
            <span className="w-6 h-[1px] bg-current opacity-70" />
            <span>05 / Acoustic Studio</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-light tracking-tight text-[#F1F3EF] font-heading">
            Acoustic Studio & Faders
          </h2>
          <p className="text-sm text-[#B3BDB6] max-w-xl mt-2 leading-relaxed">
            Solo preview and fine-tune individual natural acoustic frequencies. Adjust track volume, mute controls, and balance with tactile precision faders.
          </p>
        </div>

        {/* Global Mixer Actions */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => setSaveModalOpen(true)}
            disabled={playingLayersCount === 0}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[var(--theme-accent,#91AFA9)] text-[#101816] hover:bg-[var(--theme-accent-hover,#B4CCC7)] disabled:opacity-40 disabled:cursor-not-allowed font-medium text-xs transition-all shadow-md active:scale-95"
            title="Save your current audio layer combination"
          >
            <BookmarkPlus className="w-4 h-4" />
            <span>Save Custom Mix</span>
          </button>

          <button
            onClick={resetMix}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[var(--theme-surface,#202B28)] border border-[var(--theme-border-subtle,rgba(145,175,169,0.2))] text-[#B3BDB6] hover:text-[#F1F3EF] hover:border-[var(--theme-border-active,rgba(145,175,169,0.4))] font-medium text-xs transition-all active:scale-95"
            title="Reset all tracks to silence"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reset Mix</span>
          </button>
        </div>
      </div>

      {/* Preset Shortcuts Bar */}
      <div className="mb-8 p-3.5 sm:p-4 rounded-2xl bg-[var(--theme-bg,#101816)]/70 border border-[var(--theme-border-subtle,rgba(145,175,169,0.15))] flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 transition-colors duration-1000">
        <div className="flex items-center gap-2 text-xs text-[#B3BDB6]">
          <Layers className="w-4 h-4 text-[var(--theme-accent,#91AFA9)] transition-colors duration-1000" />
          <span>Quick Sound Recipes:</span>
        </div>

        <div className="flex flex-wrap gap-1.5 sm:gap-2">
          {INTENTION_PRESETS.map((p) => {
            const isSelected = activePresetId === p.id;
            return (
              <button
                key={p.id}
                onClick={() => loadPreset(p)}
                className={`px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-xl text-xs font-medium border transition-all ${
                  isSelected
                    ? 'bg-[var(--theme-accent,#91AFA9)] text-[#101816] border-[var(--theme-accent,#91AFA9)] shadow-sm font-semibold'
                    : 'bg-[var(--theme-surface,#202B28)] border-[var(--theme-border-subtle,rgba(145,175,169,0.2))] text-[#D8D6C9] hover:border-[var(--theme-border-active,rgba(145,175,169,0.4))] hover:text-[#F1F3EF]'
                }`}
              >
                {p.title}
              </button>
            );
          })}
        </div>
      </div>

      {/* Mixer Channel Category Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2 mb-6">
        <span className="text-xs font-mono text-[#7E8D86] mr-2">Faders View:</span>
        {(
          [
            { id: 'curated', label: 'Curated (Top 6)' },
            { id: 'focus', label: 'Focus' },
            { id: 'sleep', label: 'Deep Sleep' },
            { id: 'meditation', label: 'Calm & Zen' },
            { id: 'all', label: 'All 20 Tracks' },
          ] as const
        ).map((tab) => {
          const isSelected = activeMixerTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveMixerTab(tab.id)}
              className={`px-3 py-1.5 rounded-full text-xs font-mono transition-all ${
                isSelected
                  ? 'bg-white text-[#0A0F0E] font-medium shadow-sm'
                  : 'bg-white/5 border border-white/10 text-[#B3BDB6] hover:text-[#F1F3EF] hover:border-white/25'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Track Channel Fader Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {displayedTracks.map((snd) => (
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
