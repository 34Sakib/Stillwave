'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowLeft,
  Play,
  Pause,
  Volume2,
  Share2,
  Moon,
  Clock,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Activity,
  Layers,
} from 'lucide-react';
import { SoundTrack } from '@/types';
import { SOUND_TRACKS, getSoundById } from '@/data/sounds';
import { usePlayerStore } from '@/stores/player-store';
import { SoundArtwork } from '@/components/ui/sound-artwork';

interface SoundDetailViewProps {
  sound: SoundTrack;
}

export const SoundDetailView: React.FC<SoundDetailViewProps> = ({ sound }) => {
  const {
    currentSound,
    playbackStatus,
    playSingleSound,
    togglePlayPause,
    masterVolume,
    setMasterVolume,
    sleepTimer,
    setSleepTimer,
    cancelSleepTimer,
    openShareModal,
  } = usePlayerStore();

  const isCurrent = currentSound?.id === sound.id;
  const isPlaying = isCurrent && playbackStatus === 'playing';

  const currentIndex = SOUND_TRACKS.findIndex((s) => s.id === sound.id);
  const prevSound = SOUND_TRACKS[(currentIndex - 1 + SOUND_TRACKS.length) % SOUND_TRACKS.length];
  const nextSound = SOUND_TRACKS[(currentIndex + 1) % SOUND_TRACKS.length];

  const handlePlayToggle = () => {
    if (isCurrent) {
      togglePlayPause();
    } else {
      playSingleSound(sound);
    }
  };

  const companions = (sound.recommendations || ['rain', 'forest', 'ocean'])
    .map((recId) => getSoundById(recId))
    .filter((s): s is SoundTrack => Boolean(s));

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const accentColor = sound.accentColor || sound.tintColor || '#8FC1DD';
  const bgColor = sound.bgColor || '#0F2433';
  const surfaceColor = sound.surfaceColor || '#17354A';

  return (
    <div
      className="min-h-screen text-[#F1F3EF] transition-colors duration-1000 relative pb-36 pt-6 sm:pt-10 px-4 sm:px-8 max-w-6xl mx-auto"
      style={{
        background: `radial-gradient(90% 60% at 85% 0%, ${accentColor}25, transparent 65%), linear-gradient(180deg, ${bgColor} 0%, #0A0F0E 100%)`,
      }}
    >
      {/* Top Header / Breadcrumb Navigation */}
      <div className="flex items-center justify-between py-4 border-b border-white/10 mb-8 sm:mb-12">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-mono tracking-wider text-[#B3BDB6] hover:text-[#F1F3EF] transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>Sanctuary Home</span>
        </Link>

        <div className="flex items-center gap-3">
          <Link
            href="/library"
            className="text-xs font-mono tracking-wider px-3 py-1.5 rounded-full border border-white/15 bg-white/5 text-[#B3BDB6] hover:text-[#F1F3EF] hover:border-white/30 transition-all"
          >
            Library (20)
          </Link>
          <button
            onClick={() => openShareModal(sound.id)}
            className="p-2 rounded-full border border-white/15 bg-white/5 text-[#B3BDB6] hover:text-[#F1F3EF] hover:border-white/30 transition-all"
            title="Share this sound"
            aria-label="Share soundscape"
          >
            <Share2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Sanctuary Hero Stage */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center">
        {/* Large Concentric Ripple Artwork */}
        <div className="lg:col-span-5 flex flex-col items-center">
          <div
            className="relative w-full max-w-[380px] sm:max-w-[420px] aspect-square rounded-[32px] overflow-hidden border border-white/20 shadow-2xl p-1"
            style={{
              boxShadow: `0 30px 80px -20px ${accentColor}40`,
            }}
          >
            {sound.artwork ? (
              <div className="relative w-full h-full rounded-[28px] overflow-hidden">
                <Image
                  src={sound.artwork}
                  alt={sound.title}
                  fill
                  priority
                  sizes="(max-width: 640px) 380px, 420px"
                  className="object-cover object-center group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/30 pointer-events-none" />
              </div>
            ) : (
              <SoundArtwork sound={sound} isSpinning={isPlaying} className="w-full h-full rounded-[28px]" />
            )}

            {/* Tag Badge */}
            <span className="absolute top-4 left-4 z-10 px-3 py-1 rounded-full text-[11px] font-mono uppercase tracking-wider bg-black/50 backdrop-blur-md border border-white/20 text-[#F1F3EF]">
              {sound.tag || sound.category}
            </span>

            {/* Live Playing Status Pill */}
            <span className="absolute top-4 right-4 z-10 flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-mono uppercase tracking-wider bg-black/50 backdrop-blur-md border border-white/20 text-[#F1F3EF]">
              <span
                className={`w-2 h-2 rounded-full ${
                  isPlaying ? 'bg-[#7bd88f] animate-pulse' : 'bg-[#e0b25a]'
                }`}
              />
              <span>{isPlaying ? 'Playing' : 'Paused'}</span>
            </span>

            {/* Bottom Loop / Frequency Specs */}
            <div className="absolute bottom-4 left-4 right-4 z-10 flex items-center justify-between text-[11px] font-mono tracking-wider text-[#B3BDB6] bg-black/45 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/15">
              <span>{sound.frequencyLabel || '1/f noise'}</span>
              <span>∞ SEAMLESS LOOP</span>
            </div>
          </div>

          {/* Quick Prev / Next Room Switcher */}
          <div className="flex items-center justify-between w-full max-w-[380px] sm:max-w-[420px] mt-6 px-2">
            <Link
              href={`/sound/${prevSound.id}`}
              className="inline-flex items-center gap-1.5 text-xs font-mono text-[#B3BDB6] hover:text-[#F1F3EF] transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>{prevSound.title}</span>
            </Link>
            <Link
              href={`/sound/${nextSound.id}`}
              className="inline-flex items-center gap-1.5 text-xs font-mono text-[#B3BDB6] hover:text-[#F1F3EF] transition-colors"
            >
              <span>{nextSound.title}</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Sound Info & Interactive Controls */}
        <div className="lg:col-span-7 space-y-6 sm:space-y-8">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-mono tracking-widest text-[#B3BDB6] uppercase mb-2">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: accentColor }} />
              <span>Soundscape Room · {currentIndex + 1} of 20</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-light tracking-tight text-[#F1F3EF] font-heading">
              {sound.title}
            </h1>
            <p className="text-base sm:text-lg text-[#B3BDB6] italic mt-2">
              &ldquo;{sound.subtitle}&rdquo;
            </p>
          </div>

          <p className="text-sm sm:text-base text-[#D8D6C9] leading-relaxed max-w-xl">
            {sound.description}
          </p>

          {/* Primary Play Button & Action Row */}
          <div className="flex flex-wrap items-center gap-4 pt-2">
            <button
              onClick={handlePlayToggle}
              className="flex items-center gap-3 px-8 py-4 rounded-full font-medium text-sm transition-all shadow-xl active:scale-95 text-[#0A0F0E]"
              style={{
                background: `linear-gradient(180deg, #FFFFFF, ${accentColor})`,
              }}
            >
              {isPlaying ? (
                <>
                  <Pause className="w-5 h-5 fill-current" />
                  <span>Pause Soundscape</span>
                </>
              ) : (
                <>
                  <Play className="w-5 h-5 fill-current" />
                  <span>Listen Now</span>
                </>
              )}
            </button>

            <button
              onClick={() => openShareModal(sound.id)}
              className="flex items-center gap-2 px-5 py-4 rounded-full border border-white/20 hover:border-white/40 bg-white/5 text-[#F1F3EF] text-sm font-medium transition-all active:scale-95"
            >
              <Share2 className="w-4 h-4" />
              <span>Share Sanctuary</span>
            </button>
          </div>

          {/* Volume Control Card */}
          <div
            className="p-5 rounded-2xl border border-white/15 bg-black/30 backdrop-blur-md max-w-xl space-y-3"
            style={{ borderColor: `${accentColor}30` }}
          >
            <div className="flex items-center justify-between text-xs font-mono text-[#B3BDB6]">
              <span className="flex items-center gap-2">
                <Volume2 className="w-4 h-4 text-[#F1F3EF]" />
                <span>Atmospheric Volume</span>
              </span>
              <span>{Math.round(masterVolume * 100)}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={Math.round(masterVolume * 100)}
              onChange={(e) => setMasterVolume(Number(e.target.value) / 100)}
              className="w-full accent-[#F1F3EF] h-1.5 bg-white/20 rounded-lg cursor-pointer"
              aria-label="Master volume fader"
            />
          </div>

          {/* Sleep Timer Card */}
          <div
            className="p-5 rounded-2xl border border-white/15 bg-black/30 backdrop-blur-md max-w-xl space-y-3"
            style={{ borderColor: `${accentColor}30` }}
          >
            <div className="flex items-center justify-between text-xs font-mono text-[#B3BDB6]">
              <span className="flex items-center gap-2">
                <Moon className="w-4 h-4 text-[#F1F3EF]" />
                <span>Sleep Timer Fade-Out</span>
              </span>
              <span className="text-[#F1F3EF]">
                {sleepTimer.isRunning ? (
                  <span className="text-[#7bd88f] flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 animate-spin" />
                    {formatTimer(sleepTimer.remainingSeconds)}
                  </span>
                ) : (
                  'Off'
                )}
              </span>
            </div>

            <div className="flex flex-wrap gap-2 pt-1">
              {[15, 30, 60].map((mins) => (
                <button
                  key={mins}
                  onClick={() => setSleepTimer(mins)}
                  className={`px-3 py-1.5 rounded-full text-xs font-mono border transition-all ${
                    sleepTimer.isRunning && sleepTimer.durationMinutes === mins
                      ? 'border-white bg-white text-[#0A0F0E] font-medium'
                      : 'border-white/15 bg-white/5 text-[#B3BDB6] hover:text-[#F1F3EF] hover:border-white/30'
                  }`}
                >
                  {mins}m
                </button>
              ))}
              {sleepTimer.isRunning && (
                <button
                  onClick={cancelSleepTimer}
                  className="px-3 py-1.5 rounded-full text-xs font-mono border border-red-500/30 text-red-300 bg-red-950/30 hover:bg-red-900/40 transition-all"
                >
                  Turn Off
                </button>
              )}
            </div>
            <p className="text-[11px] text-[#7E8D86] font-mono">
              Volume smoothly drops to zero in the final 30 seconds.
            </p>
          </div>
        </div>
      </div>

      {/* Companion Soundscapes ("Pairs well with...") */}
      {companions.length > 0 && (
        <div className="mt-16 sm:mt-24 pt-10 border-t border-white/10">
          <div className="flex items-center justify-between mb-8">
            <div>
              <span className="text-xs uppercase font-mono tracking-widest text-[#B3BDB6] block mb-1">
                Acoustic Companions
              </span>
              <h2 className="text-2xl sm:text-3xl font-light tracking-tight text-[#F1F3EF] font-heading">
                Pairs well with {sound.title}
              </h2>
            </div>
            <Link
              href="/library"
              className="text-xs font-mono text-[#B3BDB6] hover:text-[#F1F3EF] transition-colors"
            >
              Browse all 20 &rarr;
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {companions.map((comp) => (
              <Link
                key={comp.id}
                href={`/sound/${comp.id}`}
                className="group p-4 rounded-2xl border border-white/10 bg-white/5 hover:border-white/25 hover:bg-white/10 transition-all flex items-center gap-4"
              >
                <div className="relative w-14 h-14 rounded-xl overflow-hidden flex-shrink-0 border border-white/15 bg-black/40">
                  {comp.artwork ? (
                    <Image
                      src={comp.artwork}
                      alt={comp.title}
                      fill
                      sizes="56px"
                      className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <SoundArtwork sound={comp} className="w-full h-full" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="text-sm font-medium text-[#F1F3EF] group-hover:text-white truncate">
                    {comp.title}
                  </h3>
                  <p className="text-xs text-[#B3BDB6] truncate mt-0.5">{comp.subtitle}</p>
                  <span className="text-[10px] font-mono text-[#7E8D86] uppercase block mt-1">
                    {comp.tag || comp.category}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
