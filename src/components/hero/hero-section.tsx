'use client';

import React, { useRef, useEffect } from 'react';
import Image from 'next/image';
import { motion } from 'motion/react';
import { Play, Pause, Compass, Sparkles, Volume2 } from 'lucide-react';
import { usePlayerStore } from '@/stores/player-store';
import { audioEngine } from '@/audio/audio-engine';
import { SOUND_TRACKS } from '@/data/sounds';

export const HeroSection: React.FC = () => {
  const { playbackStatus, currentSound, togglePlayPause, playSingleSound } = usePlayerStore();
  const isPlaying = playbackStatus === 'playing';
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const handleStartListening = () => {
    if (isPlaying) {
      togglePlayPause();
    } else if (currentSound) {
      togglePlayPause();
    } else {
      // Start with gentle rain as signature starter ambience
      playSingleSound(SOUND_TRACKS[0]);
    }
  };

  // Real-time hero waveform visualizer
  useEffect(() => {
    let animId: number;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const bufferLength = 128;
    const dataArray = new Uint8Array(bufferLength);
    let phase = 0;

    const render = () => {
      phase += 0.02;
      const width = canvas.width;
      const height = canvas.height;

      ctx.clearRect(0, 0, width, height);

      audioEngine.getVisualizerData(dataArray);

      const accent = getComputedStyle(document.documentElement)
        .getPropertyValue('--theme-accent')
        .trim() || '#91AFA9';

      // Draw multi-layer wave lines
      for (let layer = 0; layer < 3; layer++) {
        ctx.beginPath();
        ctx.strokeStyle = accent;
        ctx.globalAlpha = [0.9, 0.35, 0.15][layer];
        ctx.lineWidth = layer === 0 ? 1.6 : 1;

        for (let x = 0; x <= width; x += 3) {
          const u = x / width;
          const env = Math.sin(u * Math.PI);

          let y: number;
          if (isPlaying) {
            const dataIdx = Math.floor(u * (bufferLength - 1));
            const val = (dataArray[dataIdx] - 128) / 128;
            y = val * height * 0.75 * env + Math.sin(u * 9 + phase + layer) * height * 0.04 * layer;
          } else {
            y = Math.sin(u * 8 + phase * (1 + layer * 0.4)) * height * 0.10 * env * (1 - layer * 0.25);
          }

          if (x === 0) {
            ctx.moveTo(x, height / 2 + y);
          } else {
            ctx.lineTo(x, height / 2 + y);
          }
        }
        ctx.stroke();
      }

      ctx.globalAlpha = 1;
      animId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, [isPlaying]);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-28 pb-20 px-5 sm:px-8">
      {/* Background Image with Depth & Dark Mask */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/hero-bg.jpg"
          alt="Nordic pine forest shrouded in gentle morning fog"
          fill
          priority
          className="object-cover object-center scale-105 animate-float-gentle opacity-75"
        />
        {/* Dynamic Vignette Overlays matching sound motive */}
        <div className="absolute inset-0 bg-gradient-to-b from-[var(--theme-bg,#101816)]/75 via-[var(--theme-bg,#101816)]/55 to-[var(--theme-bg,#101816)] transition-all duration-1000" />
        <div className="absolute inset-0 bg-[var(--theme-bg,#101816)]/40 backdrop-blur-[2px] transition-all duration-1000" />
      </div>

      {/* Floating Organic Aura Accent */}
      <div
        className="absolute -top-24 left-1/2 -translate-x-1/2 w-[650px] h-[650px] rounded-full blur-[140px] pointer-events-none animate-soft-pulse transition-all duration-1000"
        style={{ background: 'var(--theme-glow, rgba(145, 175, 169, 0.16))' }}
      />

      {/* Hero Content with Motion reveal */}
      <div className="relative z-10 max-w-4xl mx-auto text-center space-y-7">
        {/* Subtle pill tag */}
        <motion.div
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[var(--theme-surface,#202B28)]/90 border border-[var(--theme-border-subtle,rgba(145,175,169,0.25))] backdrop-blur-md text-xs font-mono tracking-widest text-[var(--theme-text-secondary,#D8D6C9)] uppercase shadow-lg transition-colors duration-1000"
        >
          <Sparkles className="w-3.5 h-3.5 text-[var(--theme-accent,#91AFA9)] transition-colors duration-1000" />
          <span>Active Acoustic Sanctuary • One Sound at a Time</span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.1, ease: 'easeOut' }}
          className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-light tracking-tight text-[var(--theme-text-primary,#F1F3EF)] font-heading leading-[1.02] px-2 text-balance"
        >
          A sanctuary for <em className="italic font-serif text-[var(--theme-accent,#91AFA9)] transition-colors duration-1000 not-italic">wandering</em> minds.
        </motion.h1>

        {/* Subheading */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.2, ease: 'easeOut' }}
          className="text-base sm:text-lg md:text-xl text-[var(--theme-text-secondary,#B3BDB6)] max-w-2xl mx-auto font-light leading-relaxed px-4"
        >
          Ten synthesized soundscapes, one at a time. Step away from the noise of the day and let the room change color around you.
        </motion.p>

        {/* Hero CTA Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.3, ease: 'easeOut' }}
          className="pt-2 sm:pt-3 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 w-full max-w-md sm:max-w-none mx-auto"
        >
          <button
            type="button"
            onClick={handleStartListening}
            className="w-full sm:w-auto px-8 py-4 rounded-full bg-[var(--theme-accent,#91AFA9)] hover:brightness-110 text-[var(--theme-bg,#101816)] font-medium text-sm tracking-wide transition-all shadow-xl flex items-center justify-center gap-3 group active:scale-95 cursor-pointer"
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
                <span>Begin Session</span>
              </>
            )}
          </button>

          <a
            href="#soundscapes"
            className="w-full sm:w-auto px-8 py-4 rounded-full bg-[var(--theme-surface,#202B28)]/90 hover:bg-[var(--theme-elevated,#283633)] text-[var(--theme-text-primary,#F1F3EF)] border border-[var(--theme-border-subtle,rgba(145,175,169,0.25))] hover:border-[var(--theme-border-active,rgba(145,175,169,0.5))] font-medium text-sm tracking-wide transition-all backdrop-blur-md flex items-center justify-center gap-2.5 active:scale-95"
          >
            <Compass className="w-4 h-4 text-[var(--theme-accent,#91AFA9)] transition-colors duration-1000" />
            <span>Explore Soundscapes</span>
          </a>
        </motion.div>

        {/* Real-time Hero Waveform Canvas */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2, delay: 0.4 }}
          className="w-full max-w-2xl mx-auto pt-6"
        >
          <canvas
            ref={canvasRef}
            width={760}
            height={90}
            className="w-full h-20 sm:h-24 block opacity-85"
          />
        </motion.div>

        {/* Sound Status Micro-Badge */}
        {isPlaying && currentSound && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-xl bg-[var(--theme-surface,#202B28)]/90 border border-[var(--theme-border-active,rgba(145,175,169,0.3))] backdrop-blur-md text-[11px] sm:text-xs text-[#D8D6C9] transition-colors duration-1000 shadow-md"
          >
            <Volume2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[var(--theme-accent,#91AFA9)] animate-pulse transition-colors duration-1000" />
            <span>Listening to <strong className="text-[var(--theme-text-primary,#F1F3EF)] font-medium">{currentSound.title}</strong></span>
          </motion.div>
        )}
      </div>
    </section>
  );
};
