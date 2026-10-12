'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import {
  Sunrise,
  Sun,
  Sunset,
  Moon,
  Clock,
  Play,
  Pause,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Activity,
} from 'lucide-react';
import { usePlayerStore } from '@/stores/player-store';
import { SOUND_TRACKS, getSoundById } from '@/data/sounds';
import { SoundTrack } from '@/types';

export interface CircadianPhase {
  id: 'dawn' | 'midday' | 'dusk' | 'night';
  title: 'Dawn Awakening' | 'Solar Midday' | 'Twilight Unwind' | 'Nocturne Sanctuary';
  timeRange: string;
  startHour: number;
  endHour: number;
  icon: React.ComponentType<{ className?: string }>;
  tagline: string;
  primarySoundId: string;
  alternateSoundIds: string[];
  cognitiveBenefit: string;
  acousticProfile: string;
  optimalActivity: string;
}

const CIRCADIAN_PHASES: CircadianPhase[] = [
  {
    id: 'dawn',
    title: 'Dawn Awakening',
    timeRange: '06:00 – 11:00',
    startHour: 6,
    endHour: 11,
    icon: Sunrise,
    tagline: 'Gently clear sleep inertia with refreshing natural flow.',
    primarySoundId: 'stream',
    alternateSoundIds: ['forest', 'wind'],
    cognitiveBenefit: 'Cortisol Awakening Response',
    acousticProfile: 'Crisp mountain water partials & alpine birdsong to spark dopamine without cognitive rush.',
    optimalActivity: 'Morning coffee, stretching, journaling & planning the day.',
  },
  {
    id: 'midday',
    title: 'Solar Midday',
    timeRange: '11:00 – 17:00',
    startHour: 11,
    endHour: 17,
    icon: Sun,
    tagline: 'Deep cognitive shielding against open-office & urban noise.',
    primarySoundId: 'rain',
    alternateSoundIds: ['ocean', 'stream'],
    cognitiveBenefit: 'Sustained Alpha-Wave Flow',
    acousticProfile: '1/f pink noise spectrum cushions intrusive sounds and stabilizes neural focus.',
    optimalActivity: 'Deep work sprints, complex problem solving & immersive writing.',
  },
  {
    id: 'dusk',
    title: 'Twilight Unwind',
    timeRange: '17:00 – 21:00',
    startHour: 17,
    endHour: 21,
    icon: Sunset,
    tagline: 'Downshift your nervous system and shed work tension.',
    primarySoundId: 'fireplace',
    alternateSoundIds: ['zen-bowls', 'wind'],
    cognitiveBenefit: 'Vagal Nerve Relaxation',
    acousticProfile: 'Warm hickory embers & 432 Hz bronze resonance lower heart rate and reduce cortisol.',
    optimalActivity: 'Transitioning home, cooking, reading & restorative conversation.',
  },
  {
    id: 'night',
    title: 'Nocturne Sanctuary',
    timeRange: '21:00 – 06:00',
    startHour: 21,
    endHour: 6,
    icon: Moon,
    tagline: 'Silky acoustic cocoon for uninterrupted delta-wave sleep.',
    primarySoundId: 'night',
    alternateSoundIds: ['brown-noise', 'thunder'],
    cognitiveBenefit: 'Slow-Wave Delta Sleep Induction',
    acousticProfile: 'Soft 4.3 kHz nocturnal meadow buzzing & low-frequency Brownian masking cushion tinnitus.',
    optimalActivity: 'Pre-sleep meditation, bedroom sanctuary & deep restorative rest.',
  },
];

const getCurrentPhaseId = (hour: number): CircadianPhase['id'] => {
  if (hour >= 6 && hour < 11) return 'dawn';
  if (hour >= 11 && hour < 17) return 'midday';
  if (hour >= 17 && hour < 21) return 'dusk';
  return 'night';
};

export const CircadianSection: React.FC = () => {
  const { currentSound, playbackStatus, playSingleSound, togglePlayPause } = usePlayerStore();
  const [currentTime, setCurrentTime] = useState<Date | null>(null);
  const [selectedPhaseId, setSelectedPhaseId] = useState<CircadianPhase['id']>('dawn');

  // Track live client clock & set initial current phase
  useEffect(() => {
    const update = () => {
      const now = new Date();
      setCurrentTime(now);
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  // Update initial selected phase once client time is ready
  useEffect(() => {
    if (currentTime) {
      const currentHour = currentTime.getHours();
      setSelectedPhaseId(getCurrentPhaseId(currentHour));
    }
  }, [currentTime === null]); // only trigger on first resolution

  const currentHour = currentTime ? currentTime.getHours() : 12;
  const livePhaseId = getCurrentPhaseId(currentHour);

  const selectedPhase =
    CIRCADIAN_PHASES.find((p) => p.id === selectedPhaseId) || CIRCADIAN_PHASES[0];

  const primarySound: SoundTrack =
    getSoundById(selectedPhase.primarySoundId) || SOUND_TRACKS[0];

  const alternateSounds: SoundTrack[] = selectedPhase.alternateSoundIds
    .map((id) => getSoundById(id))
    .filter((s): s is SoundTrack => Boolean(s));

  const isPrimaryPlaying =
    currentSound?.id === primarySound.id && playbackStatus === 'playing';

  const formatClockString = (date: Date | null) => {
    if (!date) return '--:--';
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };

  return (
    <section id="circadian" className="py-24 px-5 sm:px-8 max-w-7xl mx-auto">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs uppercase font-mono tracking-widest text-[var(--theme-accent,#91AFA9)]">
              Chronobiology & Acoustic Rhythm
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--theme-accent,#91AFA9)]" />
            <span className="text-xs font-mono text-[var(--theme-text-muted,#7E8D86)]">
              24-Hour Cycle
            </span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-light tracking-tight text-[var(--theme-text-primary,#F1F3EF)] font-heading">
            Tuned to Your Day
          </h2>
          <p className="text-sm sm:text-base text-[var(--theme-text-secondary,#B3BDB6)] max-w-xl mt-3 leading-relaxed">
            Your nervous system requires different auditory inputs from sunrise to midnight. Match your soundscape to your body's natural circadian clock.
          </p>
        </div>

        {/* Live Local Time Indicator Pill */}
        <div className="inline-flex items-center gap-3 px-4 py-2.5 rounded-2xl bg-[var(--theme-surface,#202B28)] border border-[var(--theme-border-subtle,rgba(145,175,169,0.2))] shadow-lg shrink-0">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-[var(--theme-accent,#91AFA9)] animate-pulse" />
            <span className="font-mono text-xs uppercase tracking-wider text-[var(--theme-text-muted,#7E8D86)]">
              Local Time:
            </span>
          </div>
          <span className="font-mono text-sm font-semibold text-[var(--theme-text-primary,#F1F3EF)]">
            {formatClockString(currentTime)}
          </span>
          <span className="px-2 py-0.5 rounded-full bg-[var(--theme-accent,#91AFA9)]/15 border border-[var(--theme-accent,#91AFA9)]/30 text-[10px] font-mono uppercase text-[var(--theme-accent,#91AFA9)] font-medium">
            {livePhaseId.toUpperCase()} ACTIVE
          </span>
        </div>
      </div>

      {/* 4 Phase Selectors (Interactive Chrono Tabs) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-8">
        {CIRCADIAN_PHASES.map((phase) => {
          const isSelected = selectedPhaseId === phase.id;
          const isLive = livePhaseId === phase.id;
          const Icon = phase.icon;

          return (
            <button
              type="button"
              key={phase.id}
              onClick={() => setSelectedPhaseId(phase.id)}
              className={`p-4 sm:p-5 rounded-2xl sm:rounded-3xl border transition-all text-left flex flex-col justify-between gap-3 cursor-pointer relative overflow-hidden group ${
                isSelected
                  ? 'bg-[var(--theme-surface,#202B28)] border-[var(--theme-accent,#91AFA9)] shadow-xl ring-1 ring-[var(--theme-accent,#91AFA9)]/40'
                  : 'bg-[var(--theme-surface,#202B28)]/60 hover:bg-[var(--theme-surface,#202B28)]/90 border-[var(--theme-border-subtle,rgba(145,175,169,0.2))] hover:border-[var(--theme-border-active,rgba(145,175,169,0.4))]'
              }`}
            >
              {/* Live Badge for Current Local Time */}
              {isLive && (
                <div className="absolute top-2.5 right-2.5 flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-[var(--theme-accent,#91AFA9)] text-[var(--theme-bg,#101816)] text-[9px] font-mono font-bold tracking-wider uppercase shadow-sm">
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--theme-bg,#101816)] animate-ping" />
                  <span>Now</span>
                </div>
              )}

              <div className="flex items-center gap-3">
                <div
                  className={`p-2.5 rounded-xl border transition-colors ${
                    isSelected
                      ? 'bg-[var(--theme-accent,#91AFA9)]/20 border-[var(--theme-accent,#91AFA9)]/50 text-[var(--theme-accent,#91AFA9)]'
                      : 'bg-[var(--theme-elevated,#182420)] border-[var(--theme-border-subtle,rgba(145,175,169,0.15))] text-[var(--theme-text-muted,#7E8D86)] group-hover:text-[var(--theme-accent,#91AFA9)]'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-heading font-medium text-sm sm:text-base text-[var(--theme-text-primary,#F1F3EF)]">
                    {phase.title}
                  </div>
                  <div className="font-mono text-[11px] text-[var(--theme-text-muted,#7E8D86)]">
                    {phase.timeRange}
                  </div>
                </div>
              </div>

              <div className="text-[11px] text-[var(--theme-text-secondary,#B3BDB6)] line-clamp-1">
                {phase.cognitiveBenefit}
              </div>
            </button>
          );
        })}
      </div>

      {/* Showcase Stage for the Selected Phase */}
      <div className="rounded-3xl bg-[var(--theme-surface,#202B28)]/80 border border-[var(--theme-border-subtle,rgba(145,175,169,0.2))] p-6 sm:p-10 shadow-2xl relative overflow-hidden transition-all duration-700">
        {/* Subtle Ambient Radial Glow */}
        <div
          className="absolute -right-24 -bottom-24 w-96 h-96 rounded-full blur-[140px] pointer-events-none opacity-25"
          style={{ background: 'var(--theme-glow, rgba(145, 175, 169, 0.2))' }}
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center relative z-10">
          {/* Left Column: Big Artwork Showcase */}
          <div className="lg:col-span-5 flex flex-col items-center">
            <div className="relative w-full max-w-[340px] aspect-square rounded-3xl overflow-hidden border border-[var(--theme-border-subtle,rgba(145,175,169,0.25))] shadow-2xl group bg-black/40">
              <img
                src={primarySound.artwork}
                alt={primarySound.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                loading="eager"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-black/35 pointer-events-none" />

              {/* Phase Chip on Photo */}
              <div className="absolute top-4 left-4 z-10 flex items-center gap-2 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10 font-mono text-[10px] uppercase text-[#F1F3EF]">
                <Sparkles className="w-3 h-3 text-[var(--theme-accent,#91AFA9)]" />
                <span>Recommended for {selectedPhase.timeRange}</span>
              </div>

              {/* Bottom Frequency Pill */}
              <div className="absolute bottom-4 left-4 right-4 z-10 flex items-center justify-between font-mono text-[11px] text-[#F1F3EF]/90 drop-shadow">
                <span>{primarySound.frequencyLabel}</span>
                <span>∞ SEAMLESS BED</span>
              </div>
            </div>
          </div>

          {/* Right Column: Deep Explanation, Benefits, and Controls */}
          <div className="lg:col-span-7 space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-2 font-mono text-xs text-[var(--theme-accent,#91AFA9)] uppercase tracking-wider">
                <Activity className="w-3.5 h-3.5" />
                <span>Chronobiological Acoustic Target</span>
              </div>
              <h3 className="text-3xl sm:text-4xl font-light font-heading text-[var(--theme-text-primary,#F1F3EF)]">
                {selectedPhase.title} • {primarySound.title}
              </h3>
              <p className="text-base text-[var(--theme-text-secondary,#B3BDB6)] mt-2 font-light leading-relaxed">
                {selectedPhase.tagline}
              </p>
            </div>

            {/* Scientific Breakdown Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div className="p-4 rounded-2xl bg-[var(--theme-elevated,#1A2623)] border border-[var(--theme-border-subtle,rgba(145,175,169,0.15))] space-y-1">
                <div className="flex items-center gap-2 text-xs font-mono uppercase text-[var(--theme-accent,#91AFA9)]">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Cognitive Objective</span>
                </div>
                <div className="text-xs text-[var(--theme-text-secondary,#B3BDB6)] leading-relaxed">
                  {selectedPhase.optimalActivity}
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-[var(--theme-elevated,#1A2623)] border border-[var(--theme-border-subtle,rgba(145,175,169,0.15))] space-y-1">
                <div className="flex items-center gap-2 text-xs font-mono uppercase text-[var(--theme-accent,#91AFA9)]">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Acoustic Profile</span>
                </div>
                <div className="text-xs text-[var(--theme-text-secondary,#B3BDB6)] leading-relaxed">
                  {selectedPhase.acousticProfile}
                </div>
              </div>
            </div>

            {/* Primary Action Button to Play Recommended Soundscape */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
              <button
                type="button"
                onClick={() => {
                  if (currentSound?.id === primarySound.id) {
                    togglePlayPause();
                  } else {
                    playSingleSound(primarySound);
                  }
                }}
                className="px-8 py-4 rounded-full bg-[var(--theme-accent,#91AFA9)] hover:brightness-110 text-[var(--theme-bg,#101816)] font-medium text-sm flex items-center justify-center gap-3 transition-all shadow-xl active:scale-95 cursor-pointer group"
              >
                {isPrimaryPlaying ? (
                  <>
                    <Pause className="w-4 h-4 fill-current" />
                    <span>Pause {primarySound.title}</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 fill-current group-hover:scale-110 transition-transform ml-0.5" />
                    <span>Immerse in {primarySound.title}</span>
                  </>
                )}
              </button>

              <span className="text-xs font-mono text-[var(--theme-text-muted,#7E8D86)] text-center sm:text-left">
                Plays immediately with gentle crossfade
              </span>
            </div>

            {/* Alternates Section */}
            <div className="pt-3 border-t border-[var(--theme-border-subtle,rgba(145,175,169,0.15))] space-y-2.5">
              <span className="text-[11px] font-mono uppercase tracking-wider text-[var(--theme-text-muted,#7E8D86)]">
                Alternative Companions for this Time Window:
              </span>
              <div className="flex flex-wrap gap-2.5">
                {alternateSounds.map((alt) => {
                  const isAltActive = currentSound?.id === alt.id;
                  const isAltPlaying = isAltActive && playbackStatus === 'playing';

                  return (
                    <button
                      type="button"
                      key={alt.id}
                      onClick={() => playSingleSound(alt)}
                      className={`flex items-center gap-2.5 py-1.5 px-3 rounded-xl border text-xs transition-all cursor-pointer ${
                        isAltActive
                          ? 'bg-[var(--theme-accent,#91AFA9)]/20 border-[var(--theme-accent,#91AFA9)] text-[var(--theme-accent,#91AFA9)] font-medium'
                          : 'bg-[var(--theme-elevated,#1A2623)] border-[var(--theme-border-subtle,rgba(145,175,169,0.15))] text-[var(--theme-text-secondary,#B3BDB6)] hover:border-[var(--theme-accent,#91AFA9)] hover:text-[var(--theme-text-primary,#F1F3EF)]'
                      }`}
                    >
                      <img
                        src={alt.artwork}
                        alt={alt.title}
                        className="w-5 h-5 rounded-md object-cover"
                      />
                      <span>{alt.title}</span>
                      {isAltPlaying ? (
                        <span className="w-1.5 h-1.5 rounded-full bg-[var(--theme-accent,#91AFA9)] animate-pulse" />
                      ) : (
                        <ArrowRight className="w-3 h-3 opacity-60" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
