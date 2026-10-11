'use client';

import React from 'react';
import {
  Brain,
  Moon,
  HeartPulse,
  BookOpen,
  Compass,
  Wind,
  Play,
  Clock,
  Sparkles,
} from 'lucide-react';
import { INTENTION_PRESETS } from '@/data/presets';
import { getSoundById } from '@/data/sounds';
import { usePlayerStore } from '@/stores/player-store';
import { AtmospherePreset } from '@/types';

export const IntentionsSection: React.FC = () => {
  const { loadPreset, activePresetId, playbackStatus } = usePlayerStore();
  const isPlaying = playbackStatus === 'playing';

  const iconMap: Record<string, React.ReactNode> = {
    Brain: <Brain className="w-5 h-5" />,
    Moon: <Moon className="w-5 h-5" />,
    HeartPulse: <HeartPulse className="w-5 h-5" />,
    BookOpen: <BookOpen className="w-5 h-5" />,
    Compass: <Compass className="w-5 h-5" />,
    Wind: <Wind className="w-5 h-5" />,
  };

  const handleStartIntention = (preset: AtmospherePreset) => {
    loadPreset(preset);
  };

  return (
    <section id="intentions" className="py-24 px-5 sm:px-8 max-w-7xl mx-auto">
      {/* Section Header */}
      <div className="mb-14 text-center max-w-2xl mx-auto">
        <span className="text-xs uppercase font-mono tracking-widest text-[#91AFA9] block mb-2">
          05 · Purpose-Driven Sessions
        </span>
        <h2 className="text-3xl sm:text-4xl font-light tracking-tight text-[#F1F3EF] font-heading">
          Choose Your Intention
        </h2>
        <p className="text-sm text-[#B3BDB6] mt-3 leading-relaxed">
          Crafted acoustic recipes designed for specific cognitive states. One tap tunes the multi-track mixer to balanced atmospheric levels.
        </p>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {INTENTION_PRESETS.map((preset) => {
          const isActive = activePresetId === preset.id && isPlaying;

          return (
            <div
              key={preset.id}
              onClick={() => handleStartIntention(preset)}
              className={`p-7 rounded-3xl border transition-all duration-300 cursor-pointer flex flex-col justify-between group ${
                isActive
                  ? 'bg-[#202B28] border-[#91AFA9] shadow-2xl ring-2 ring-[#91AFA9]/30 scale-[1.02]'
                  : 'bg-[#101816]/70 border-[#91AFA9]/15 hover:border-[#91AFA9]/45 hover:bg-[#202B28]/60 hover:-translate-y-1'
              }`}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleStartIntention(preset);
                }
              }}
              aria-label={`Start intention ${preset.title}`}
            >
              <div>
                {/* Header Badge & Icon */}
                <div className="flex items-center justify-between mb-5">
                  <div className="p-3 rounded-2xl bg-[#202B28] text-[#91AFA9] border border-[#91AFA9]/25 group-hover:bg-[#91AFA9] group-hover:text-[#101816] transition-colors">
                    {iconMap[preset.iconName] || <Sparkles className="w-5 h-5" />}
                  </div>

                  <span className="px-3 py-1 rounded-full text-[10px] uppercase font-mono tracking-wider bg-[#101816] border border-[#91AFA9]/20 text-[#D8D6C9]">
                    {preset.badge}
                  </span>
                </div>

                <h3 className="text-xl font-medium tracking-wide text-[#F1F3EF] group-hover:text-[#91AFA9] transition-colors">
                  {preset.title}
                </h3>
                <span className="text-xs text-[#91AFA9] font-mono block mt-0.5">
                  {preset.subtitle}
                </span>

                <p className="text-xs text-[#B3BDB6] mt-3 leading-relaxed">
                  {preset.description}
                </p>
              </div>

              {/* Layer details & Action Footer */}
              <div className="mt-6 pt-5 border-t border-[#91AFA9]/15">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {preset.layers.map((l) => (
                      <span
                        key={l.soundId}
                        className="px-2 py-0.5 rounded-md text-[10px] font-mono bg-[#101816] text-[#B3BDB6] border border-[#91AFA9]/10"
                      >
                        {getSoundById(l.soundId)?.title} ({Math.round(l.volume * 100)}%)
                      </span>
                    ))}
                  </div>

                  {preset.sleepTimerMinutes && (
                    <span className="text-[10px] font-mono text-[#D8D6C9] flex items-center gap-1">
                      <Clock className="w-3 h-3 text-[#91AFA9]" />
                      {preset.sleepTimerMinutes}m
                    </span>
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-[#D8D6C9] group-hover:text-[#F1F3EF]">
                    {isActive ? 'Session Active' : 'Begin Experience'}
                  </span>

                  <div
                    className={`p-2.5 rounded-xl border transition-all ${
                      isActive
                        ? 'bg-[#91AFA9] text-[#101816] border-[#91AFA9]'
                        : 'bg-[#202B28] text-[#F1F3EF] border-[#91AFA9]/20 group-hover:bg-[#91AFA9] group-hover:text-[#101816]'
                    }`}
                  >
                    <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
