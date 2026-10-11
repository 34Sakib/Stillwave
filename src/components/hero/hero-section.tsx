'use client';

import React from 'react';
import Image from 'next/image';
import { Play, Pause, Compass, Sparkles, Volume2 } from 'lucide-react';
import { usePlayerStore } from '@/stores/player-store';
import { SOUND_TRACKS } from '@/data/sounds';

export const HeroSection: React.FC = () => {
  const { playbackStatus, currentSound, togglePlayPause, playSingleSound } = usePlayerStore();
  const isPlaying = playbackStatus === 'playing';

  const handleStartListening = () => {
    if (isPlaying) {
      togglePlayPause();
    } else if (currentSound) {
      togglePlayPause();
    } else {
      // Start with gentle rain as the signature starter ambience
      playSingleSound(SOUND_TRACKS[0]);
    }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20 pb-16 px-5 sm:px-8">
      {/* Background Image with Depth & Dark Mask */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/hero-bg.jpg"
          alt="Nordic pine forest shrouded in gentle morning fog"
          fill
          priority
          className="object-cover object-center scale-105 animate-float-gentle opacity-80"
        />
        {/* Cinematic Vignette Overlays */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#101816]/70 via-[#101816]/50 to-[#101816]" />
        <div className="absolute inset-0 bg-[#101816]/40 backdrop-blur-[2px]" />
      </div>

      {/* Floating Organic Aura Accent */}
      <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-[#91AFA9]/10 blur-[130px] pointer-events-none animate-soft-pulse" />

      {/* Hero Content */}
      <div className="relative z-10 max-w-4xl mx-auto text-center space-y-8">
        {/* Subtle pill tag */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#202B28]/80 border border-[#91AFA9]/25 backdrop-blur-md text-xs font-mono tracking-widest text-[#D8D6C9] uppercase shadow-lg">
          <Sparkles className="w-3.5 h-3.5 text-[#91AFA9]" />
          <span>Continuous Ambient Sound Sanctuary</span>
        </div>

        {/* Headline */}
        <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-light tracking-tight text-[#F1F3EF] font-heading leading-[1.08] px-2">
          Find Your <span className="italic font-serif text-[#91AFA9]">Quiet</span>.
        </h1>

        {/* Subheading */}
        <p className="text-sm sm:text-lg md:text-xl text-[#B3BDB6] max-w-2xl mx-auto font-light leading-relaxed px-4">
          Real, uninterrupted nature acoustic soundscapes designed for deep focus, restorative rest, and intentional stillness.
        </p>

        {/* Hero CTA Actions */}
        <div className="pt-2 sm:pt-4 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 w-full max-w-md sm:max-w-none mx-auto">
          <button
            onClick={handleStartListening}
            className="w-full sm:w-auto px-7 py-3.5 sm:px-8 sm:py-4 rounded-2xl bg-[#91AFA9] hover:bg-[#B4CCC7] text-[#101816] font-medium text-sm tracking-wide transition-all shadow-xl shadow-[#91AFA9]/15 flex items-center justify-center gap-3 group active:scale-95"
            aria-label={isPlaying ? 'Pause current soundscape' : 'Start listening to ambient soundscape'}
          >
            {isPlaying ? (
              <>
                <Pause className="w-4 h-4 fill-current" />
                <span>Pause Soundscape</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-current group-hover:scale-110 transition-transform" />
                <span>Start Listening</span>
              </>
            )}
          </button>

          <a
            href="#soundscapes"
            className="w-full sm:w-auto px-7 py-3.5 sm:px-8 sm:py-4 rounded-2xl bg-[#202B28]/90 hover:bg-[#283633] text-[#F1F3EF] border border-[#91AFA9]/25 hover:border-[#91AFA9]/50 font-medium text-sm tracking-wide transition-all backdrop-blur-md flex items-center justify-center gap-2.5 active:scale-95"
          >
            <Compass className="w-4 h-4 text-[#91AFA9]" />
            <span>Explore Sounds</span>
          </a>
        </div>

        {/* Sound Status Micro-Badge */}
        {isPlaying && currentSound && (
          <div className="pt-4 sm:pt-6 animate-fade-in inline-flex items-center gap-2 px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-xl bg-[#101816]/80 border border-[#91AFA9]/30 backdrop-blur-md text-[11px] sm:text-xs text-[#D8D6C9]">
            <Volume2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#91AFA9] animate-pulse" />
            <span>Listening to <strong className="text-[#F1F3EF] font-medium">{currentSound.title}</strong></span>
          </div>
        )}
      </div>

      {/* Subtle Scroll Down Indicator */}
      <div className="hidden sm:flex absolute bottom-6 left-1/2 -translate-x-1/2 flex-col items-center gap-2 text-[#7E8D86] text-[11px] font-mono tracking-widest uppercase">
        <span>Scroll to Explore</span>
        <div className="w-5 h-8 rounded-full border border-[#91AFA9]/25 flex items-start justify-center p-1">
          <div className="w-1 h-2 rounded-full bg-[#91AFA9] animate-bounce" />
        </div>
      </div>
    </section>
  );
};
