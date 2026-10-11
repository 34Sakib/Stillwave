'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import {
  Play,
  Pause,
  Square,
  Volume2,
  VolumeX,
  Repeat,
  Moon,
  Heart,
  Sliders,
} from 'lucide-react';
import { usePlayerStore } from '@/stores/player-store';
import { VisualizerCanvas } from './visualizer-canvas';
import { SleepTimerModal } from '@/components/ui/sleep-timer-modal';
import { SOUND_TRACKS } from '@/data/sounds';

export const ListeningRoom: React.FC = () => {
  const {
    currentSound,
    playbackStatus,
    togglePlayPause,
    stopPlayback,
    masterVolume,
    setMasterVolume,
    favorites,
    toggleFavorite,
    sleepTimer,
    activeLayers,
    playSingleSound,
  } = usePlayerStore();

  const [timerModalOpen, setTimerModalOpen] = useState(false);

  // If no sound is active yet, default to rain
  const activeSound = currentSound || SOUND_TRACKS[0];
  const isPlaying = playbackStatus === 'playing';
  const isFav = favorites.includes(activeSound.id);

  const activeLayersCount = Object.values(activeLayers).filter((l) => l.isPlaying).length;

  return (
    <section id="listening-room" className="py-24 px-5 sm:px-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-12">
        <span className="text-xs uppercase font-mono tracking-widest text-[#91AFA9] block mb-2">
          03 · Listening Room
        </span>
        <h2 className="text-3xl sm:text-4xl font-light tracking-tight text-[#F1F3EF] font-heading">
          Sanctuary Lounge
        </h2>
        <p className="text-sm text-[#B3BDB6] max-w-xl mt-2 leading-relaxed">
          Your dedicated listening environment. Audio continues effortlessly in the background as you scroll and explore.
        </p>
      </div>

      {/* Main Glass Player Console */}
      <div className="glass-panel rounded-3xl p-6 sm:p-10 border border-[#91AFA9]/20 shadow-2xl relative overflow-hidden">
        {/* Ambient background glow matching sound tint */}
        <div
          className="absolute -right-20 -bottom-20 w-96 h-96 rounded-full blur-[120px] pointer-events-none opacity-20"
          style={{ backgroundColor: activeSound.tintColor || '#91AFA9' }}
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
          {/* Left Column: Artwork & Visualizer */}
          <div className="lg:col-span-5 flex flex-col items-center">
            <div className="relative w-full max-w-[340px] aspect-square rounded-2xl overflow-hidden border border-[#91AFA9]/25 shadow-2xl group">
              <Image
                src={activeSound.artwork}
                alt={activeSound.title}
                fill
                sizes="(max-width: 768px) 90vw, 340px"
                className={`object-cover transition-transform duration-1000 ${
                  isPlaying ? 'scale-105' : 'scale-100'
                }`}
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#101816]/90 via-transparent to-black/20" />

              {/* Top badges */}
              <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
                <span className="px-2.5 py-1 rounded-full text-[10px] uppercase font-mono tracking-wider bg-[#101816]/80 backdrop-blur-md border border-[#91AFA9]/20 text-[#D8D6C9]">
                  {activeSound.category}
                </span>

                <button
                  onClick={() => toggleFavorite(activeSound.id)}
                  className={`p-2 rounded-full backdrop-blur-md border transition-all ${
                    isFav
                      ? 'bg-rose-950/70 border-rose-500/40 text-rose-300'
                      : 'bg-[#101816]/75 border-[#91AFA9]/20 text-[#B3BDB6] hover:text-[#F1F3EF]'
                  }`}
                  aria-label={isFav ? 'Remove from favorites' : 'Add to favorites'}
                >
                  <Heart className={`w-3.5 h-3.5 ${isFav ? 'fill-current' : ''}`} />
                </button>
              </div>

              {/* In-art visualizer */}
              <div className="absolute bottom-4 left-4 right-4 flex flex-col items-center">
                <VisualizerCanvas height={36} className="max-w-[240px]" />
              </div>
            </div>
          </div>

          {/* Right Column: Information, Controls & Mixer Shortcut */}
          <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
            <div>
              <div className="flex items-center gap-3">
                <span className="text-xs font-mono uppercase tracking-widest text-[#91AFA9]">
                  Active Ambience
                </span>
                {activeLayersCount > 1 && (
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-[#91AFA9]/20 text-[#91AFA9] border border-[#91AFA9]/30">
                    {activeLayersCount} Layered Tracks
                  </span>
                )}
              </div>

              <h3 className="text-3xl sm:text-4xl font-medium tracking-wide text-[#F1F3EF] mt-2 font-heading">
                {activeSound.title}
              </h3>
              <p className="text-sm text-[#91AFA9] font-mono mt-1">
                {activeSound.subtitle}
              </p>
              <p className="text-sm text-[#B3BDB6] mt-3 leading-relaxed max-w-xl">
                {activeSound.description}
              </p>
            </div>

            {/* Transport & Volume Controls */}
            <div className="p-6 rounded-2xl bg-[#101816]/80 border border-[#91AFA9]/15 space-y-5">
              {/* Main Playback Bar */}
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  {/* Play / Pause Primary Button */}
                  <button
                    onClick={togglePlayPause}
                    className="p-4 rounded-2xl bg-[#91AFA9] text-[#101816] hover:bg-[#B4CCC7] active:scale-95 transition-all shadow-xl shadow-[#91AFA9]/20 font-medium"
                    aria-label={isPlaying ? 'Pause soundscape' : 'Play soundscape'}
                  >
                    {isPlaying ? (
                      <Pause className="w-5 h-5 fill-current" />
                    ) : (
                      <Play className="w-5 h-5 fill-current ml-0.5" />
                    )}
                  </button>

                  {/* Stop Button */}
                  <button
                    onClick={stopPlayback}
                    className="p-3.5 rounded-2xl bg-[#202B28] text-[#B3BDB6] hover:text-[#F1F3EF] hover:bg-[#283633] border border-[#91AFA9]/20 transition-all active:scale-95"
                    aria-label="Stop playback and reset"
                    title="Stop playback"
                  >
                    <Square className="w-4 h-4 fill-current" />
                  </button>
                </div>

                {/* Auxiliary Toggles: Loop & Sleep Timer & Mixer */}
                <div className="flex items-center gap-2">
                  <button
                    className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-[#202B28] border border-[#91AFA9]/30 text-[#91AFA9] text-xs font-medium cursor-default"
                    title="Seamless Gapless Looping Active"
                  >
                    <Repeat className="w-3.5 h-3.5" />
                    <span className="font-mono">Loop</span>
                  </button>

                  <button
                    onClick={() => setTimerModalOpen(true)}
                    className={`flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl border text-xs font-medium transition-all ${
                      sleepTimer.isRunning
                        ? 'bg-[#91AFA9]/20 border-[#91AFA9] text-[#91AFA9]'
                        : 'bg-[#202B28] border-[#91AFA9]/20 text-[#B3BDB6] hover:text-[#F1F3EF]'
                    }`}
                    title="Sleep Timer"
                  >
                    <Moon className="w-3.5 h-3.5" />
                    <span className="font-mono">
                      {sleepTimer.isRunning
                        ? `${Math.floor(sleepTimer.remainingSeconds / 60)}m`
                        : 'Sleep'}
                    </span>
                  </button>

                  <a
                    href="#atmosphere-mixer"
                    className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-[#202B28] border border-[#91AFA9]/20 text-[#B3BDB6] hover:text-[#F1F3EF] hover:border-[#91AFA9]/40 text-xs font-medium transition-all"
                  >
                    <Sliders className="w-3.5 h-3.5 text-[#91AFA9]" />
                    <span>Mix</span>
                  </a>
                </div>
              </div>

              {/* Master Volume Slider */}
              <div className="space-y-2 pt-2 border-t border-[#91AFA9]/10">
                <div className="flex items-center justify-between text-xs text-[#B3BDB6]">
                  <span className="flex items-center gap-1.5">
                    {masterVolume === 0 ? (
                      <VolumeX className="w-4 h-4 text-red-400" />
                    ) : (
                      <Volume2 className="w-4 h-4 text-[#91AFA9]" />
                    )}
                    <span>Master Headroom Volume</span>
                  </span>
                  <span className="font-mono text-[#D8D6C9]">
                    {Math.round(masterVolume * 100)}%
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={masterVolume}
                    onChange={(e) => setMasterVolume(parseFloat(e.target.value))}
                    className="w-full"
                    aria-label="Master volume slider"
                  />
                </div>
              </div>
            </div>

            {/* Quick-switch Ambient Track Chips */}
            <div className="space-y-2">
              <span className="text-[11px] uppercase tracking-wider text-[#7E8D86] font-mono block">
                Quick Ambience Selector
              </span>
              <div className="flex flex-wrap gap-2">
                {SOUND_TRACKS.map((snd) => (
                  <button
                    key={snd.id}
                    onClick={() => playSingleSound(snd)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all border ${
                      currentSound?.id === snd.id
                        ? 'bg-[#91AFA9]/20 border-[#91AFA9] text-[#91AFA9]'
                        : 'bg-[#101816]/70 border-[#91AFA9]/15 text-[#B3BDB6] hover:text-[#F1F3EF] hover:border-[#91AFA9]/30'
                    }`}
                  >
                    {snd.title}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <SleepTimerModal isOpen={timerModalOpen} onClose={() => setTimerModalOpen(false)} />
    </section>
  );
};
