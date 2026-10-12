'use client';

import React, { useRef, useEffect } from 'react';
import Image from 'next/image';
import {
  X,
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Share2,
  Volume2,
  ChevronLeft,
  Moon,
  Sparkles,
  Check,
} from 'lucide-react';
import { usePlayerStore } from '@/stores/player-store';
import { audioEngine } from '@/audio/audio-engine';
import { SOUND_TRACKS, getSoundById } from '@/data/sounds';
import { ThemeMode } from '@/types';

export const NowPlayingDrawer: React.FC = () => {
  const {
    isNowPlayingDrawerOpen,
    closeNowPlayingDrawer,
    toggleNowPlayingDrawer,
    currentSound,
    playbackStatus,
    togglePlayPause,
    playSingleSound,
    playNextSound,
    playPrevSound,
    masterVolume,
    setMasterVolume,
    sleepTimer,
    setSleepTimer,
    cancelSleepTimer,
    openShareModal,
    themeMode,
    setThemeMode,
  } = usePlayerStore();

  const isPlaying = playbackStatus === 'playing';
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Real-time canvas frequency visualizer
  useEffect(() => {
    let animId: number;
    const canvas = canvasRef.current;
    if (!canvas || !isNowPlayingDrawerOpen) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const bufferLength = 128;
    const dataArray = new Uint8Array(bufferLength);
    let phase = 0;

    const render = () => {
      phase += 0.03;
      const width = canvas.width;
      const height = canvas.height;

      ctx.clearRect(0, 0, width, height);

      audioEngine.getVisualizerData(dataArray);

      const accent = getComputedStyle(document.documentElement)
        .getPropertyValue('--theme-accent')
        .trim() || '#91AFA9';

      // Draw multi-layer wave
      for (let layer = 0; layer < 3; layer++) {
        ctx.beginPath();
        ctx.strokeStyle = accent;
        ctx.globalAlpha = [0.85, 0.35, 0.15][layer];
        ctx.lineWidth = layer === 0 ? 1.6 : 1;

        for (let x = 0; x <= width; x += 3) {
          const u = x / width;
          const env = Math.sin(u * Math.PI);

          let y: number;
          if (isPlaying) {
            const dataIdx = Math.floor(u * (bufferLength - 1));
            const val = (dataArray[dataIdx] - 128) / 128;
            y = val * height * 0.7 * env + Math.sin(u * 9 + phase + layer) * height * 0.05 * layer;
          } else {
            y = Math.sin(u * 8 + phase * (1 + layer * 0.4)) * height * 0.12 * env;
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
  }, [isNowPlayingDrawerOpen, isPlaying]);

  const sound = currentSound || SOUND_TRACKS[0];

  const formatClock = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const companionIds = sound?.recommendations || ['rain', 'forest', 'zen-bowls'];
  const companionSounds = companionIds
    .map((id) => getSoundById(id))
    .filter((s): s is NonNullable<typeof s> => Boolean(s));

  const themeOptions: { id: ThemeMode; label: string; color: string }[] = [
    { id: 'motive', label: 'Sound Motive (Default)', color: 'var(--theme-accent, #91AFA9)' },
    { id: 'beige', label: 'Light Beige', color: '#EAE6DD' },
    { id: 'cold', label: 'Cold #32ABD0', color: '#32ABD0' },
  ];

  return (
    <>
      {/* Floating Vertical Right-Edge Tab Button */}
      <button
        type="button"
        onClick={toggleNowPlayingDrawer}
        className={`fixed right-0 top-1/2 -translate-y-1/2 z-40 flex flex-col items-center gap-2.5 py-4 px-2 rounded-l-2xl border-y border-l transition-all duration-500 shadow-2xl cursor-pointer ${
          isNowPlayingDrawerOpen
            ? 'translate-x-[440px] opacity-0 pointer-events-none'
            : 'bg-[var(--theme-surface,#141E1C)]/90 backdrop-blur-xl border-[var(--theme-border,#91AFA9)]/30 text-[var(--theme-text-primary,#F1F3EF)] hover:brightness-110 hover:-translate-x-1'
        }`}
        aria-label="Toggle Now Playing Drawer"
      >
        {/* Animated 3-Bar Equalizer */}
        <span className="flex items-end gap-[2px] h-3.5 mb-1">
          <span
            className={`w-[2px] bg-[var(--theme-accent,#91AFA9)] rounded-full transition-all ${
              isPlaying ? 'animate-[pulse_0.8s_ease-in-out_infinite] h-3.5' : 'h-1.5'
            }`}
          />
          <span
            className={`w-[2px] bg-[var(--theme-accent,#91AFA9)] rounded-full transition-all ${
              isPlaying ? 'animate-[pulse_1.1s_ease-in-out_infinite] h-2.5' : 'h-1'
            }`}
          />
          <span
            className={`w-[2px] bg-[var(--theme-accent,#91AFA9)] rounded-full transition-all ${
              isPlaying ? 'animate-[pulse_0.9s_ease-in-out_infinite] h-3' : 'h-2'
            }`}
          />
        </span>

        {/* Vertical Text */}
        <span className="[writing-mode:vertical-rl] font-mono text-[10px] tracking-[0.2em] uppercase text-[var(--theme-text-secondary,#B3BDB6)]">
          Now Playing
        </span>

        <ChevronLeft className="w-3.5 h-3.5 text-[var(--theme-accent,#91AFA9)] mt-1" />
      </button>

      {/* Scrim Overlay */}
      {isNowPlayingDrawerOpen && (
        <div
          onClick={closeNowPlayingDrawer}
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm transition-opacity duration-300 cursor-pointer"
        />
      )}

      {/* Sliding Drawer Container */}
      <aside
        className={`fixed top-0 right-0 bottom-0 z-50 w-full max-w-[440px] bg-[var(--theme-surface,#141E1C)]/95 backdrop-blur-2xl border-l border-[var(--theme-border,#91AFA9)]/30 shadow-2xl transition-transform duration-500 ease-out overflow-y-auto p-6 flex flex-col gap-5 text-[var(--theme-text-primary,#F1F3EF)] ${
          isNowPlayingDrawerOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        role="dialog"
        aria-label="Now Playing Drawer"
      >
        {/* Drawer Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[var(--theme-border-subtle,rgba(145,175,169,0.2))]">
          <div className="flex items-center gap-2">
            <span className="font-mono text-[11px] tracking-[0.18em] uppercase text-[var(--theme-accent,#91AFA9)] font-medium">
              Now Playing
            </span>
          </div>
          <button
            type="button"
            onClick={closeNowPlayingDrawer}
            className="p-1.5 rounded-xl text-[var(--theme-text-secondary,#B3BDB6)] hover:text-[var(--theme-text-primary,#F1F3EF)] hover:bg-black/10 dark:hover:bg-white/5 transition-colors cursor-pointer"
            aria-label="Close now playing drawer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Big Artwork Box with Live Badge and Technical Indicator */}
        <div className="relative w-full aspect-square min-h-[260px] sm:min-h-[300px] rounded-3xl overflow-hidden border border-[var(--theme-border,#91AFA9)]/30 shadow-2xl group bg-black/40">
          <img
            src={sound.artwork}
            alt={sound.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 block"
            loading="eager"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-black/35 pointer-events-none" />

          {/* Category Tag (Top-Left) */}
          <span className="absolute top-3.5 left-3.5 z-10 px-2.5 py-1 rounded-full bg-black/55 backdrop-blur-md font-mono text-[10px] tracking-wider uppercase text-[#F1F3EF] border border-white/10 shadow-sm">
            {sound.moodTags[0] || 'Focus'}
          </span>

          {/* Live Playing EQ Badge (Top-Right) */}
          <span className="absolute top-3.5 right-3.5 z-10 flex items-center gap-2 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md font-mono text-[10px] tracking-wider uppercase border border-white/10 shadow-sm">
            <span className="inline-flex items-end gap-[2px] h-2.5">
              <span
                className={`w-[2px] bg-[var(--theme-accent,#91AFA9)] rounded-full ${
                  isPlaying ? 'animate-[pulse_0.8s_ease-in-out_infinite] h-2.5' : 'h-1'
                }`}
              />
              <span
                className={`w-[2px] bg-[var(--theme-accent,#91AFA9)] rounded-full ${
                  isPlaying ? 'animate-[pulse_1.1s_ease-in-out_infinite] h-2' : 'h-1.5'
                }`}
              />
              <span
                className={`w-[2px] bg-[var(--theme-accent,#91AFA9)] rounded-full ${
                  isPlaying ? 'animate-[pulse_0.9s_ease-in-out_infinite] h-2.5' : 'h-1'
                }`}
              />
            </span>
            <span className="text-[var(--theme-accent,#91AFA9)] font-semibold">
              {isPlaying ? 'Playing' : 'Paused'}
            </span>
          </span>

          {/* Bottom Technical Frequency Readout */}
          <div className="absolute bottom-3.5 left-4 right-4 z-10 flex items-center justify-between font-mono text-[11px] text-[#F1F3EF]/90 drop-shadow">
            <span>{sound.frequencyLabel || 'Harmonic Bed'}</span>
            <span>∞ SEAMLESS LOOP</span>
          </div>
        </div>

        {/* Track Title, Evocative Subtitle & Hz */}
        <div>
          <h3 className="text-3xl font-light font-heading tracking-tight text-[var(--theme-text-primary,#F1F3EF)]">
            {sound.title}
          </h3>
          <p className="text-sm text-[var(--theme-text-secondary,#B3BDB6)] mt-1 line-clamp-2">
            {sound.subtitle}
          </p>
          <div className="font-mono text-[11px] text-[var(--theme-text-muted,#7E8D86)] mt-2 tracking-wide">
            {sound.frequencyLabel} • 30s synthesized seamless loop
          </div>
        </div>

        {/* Dedicated Real-Time Visualizer Canvas */}
        <div className="rounded-2xl bg-[var(--theme-elevated,#121C1A)] border border-[var(--theme-border-subtle,rgba(145,175,169,0.2))] p-2">
          <canvas
            ref={canvasRef}
            width={380}
            height={60}
            className="w-full h-14 block"
          />
        </div>

        {/* Playback Controls (Prev, Big Play/Pause, Next) */}
        <div className="flex items-center justify-center gap-6 py-1">
          <button
            type="button"
            onClick={playPrevSound}
            className="w-11 h-11 rounded-full border border-[var(--theme-border-subtle,rgba(145,175,169,0.2))] hover:border-[var(--theme-accent,#91AFA9)]/60 bg-[var(--theme-elevated,#121C1A)] hover:bg-[var(--theme-hover,#1C2A26)] flex items-center justify-center text-[var(--theme-text-secondary,#B3BDB6)] hover:text-[var(--theme-text-primary,#F1F3EF)] transition-all cursor-pointer"
            aria-label="Previous soundscape"
          >
            <SkipBack className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={togglePlayPause}
            className="w-16 h-16 rounded-full bg-[var(--theme-accent,#91AFA9)] text-[var(--theme-bg,#101816)] flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-xl cursor-pointer"
            aria-label={isPlaying ? 'Pause audio' : 'Play audio'}
          >
            {isPlaying ? (
              <Pause className="w-6 h-6 fill-current" />
            ) : (
              <Play className="w-6 h-6 fill-current ml-0.5" />
            )}
          </button>

          <button
            type="button"
            onClick={playNextSound}
            className="w-11 h-11 rounded-full border border-[var(--theme-border-subtle,rgba(145,175,169,0.2))] hover:border-[var(--theme-accent,#91AFA9)]/60 bg-[var(--theme-elevated,#121C1A)] hover:bg-[var(--theme-hover,#1C2A26)] flex items-center justify-center text-[var(--theme-text-secondary,#B3BDB6)] hover:text-[var(--theme-text-primary,#F1F3EF)] transition-all cursor-pointer"
            aria-label="Next soundscape"
          >
            <SkipForward className="w-4 h-4" />
          </button>
        </div>

        {/* Share Button */}
        <button
          type="button"
          onClick={() => openShareModal(sound.id)}
          className="w-full py-2.5 px-4 rounded-xl border border-[var(--theme-border,#91AFA9)]/30 hover:border-[var(--theme-accent,#91AFA9)] bg-[var(--theme-elevated,#121C1A)] hover:bg-[var(--theme-hover,#1C2A26)] text-xs font-medium text-[var(--theme-text-primary,#F1F3EF)] flex items-center justify-center gap-2 transition-all cursor-pointer"
        >
          <Share2 className="w-3.5 h-3.5 text-[var(--theme-accent,#91AFA9)]" />
          <span>Share this sound with friends</span>
        </button>

        {/* Volume Slider Block */}
        <div className="rounded-2xl border border-[var(--theme-border-subtle,rgba(145,175,169,0.2))] bg-[var(--theme-elevated,#121C1A)] p-4 space-y-2">
          <div className="flex items-center justify-between font-mono text-[11px] text-[var(--theme-text-secondary,#B3BDB6)] uppercase tracking-wider">
            <span className="flex items-center gap-1.5">
              <Volume2 className="w-3.5 h-3.5 text-[var(--theme-accent,#91AFA9)]" />
              Volume
            </span>
            <span>{Math.round(masterVolume * 100)}%</span>
          </div>
          <input
            type="range"
            min={0}
            max={100}
            value={Math.round(masterVolume * 100)}
            onChange={(e) => setMasterVolume(Number(e.target.value) / 100)}
            className="w-full accent-[var(--theme-accent,#91AFA9)] cursor-pointer"
            aria-label="Master volume slider"
          />
        </div>

        {/* Sleep Timer Block */}
        <div className="rounded-2xl border border-[var(--theme-border-subtle,rgba(145,175,169,0.2))] bg-[var(--theme-elevated,#121C1A)] p-4 space-y-3">
          <div className="flex items-center justify-between font-mono text-[11px] text-[var(--theme-text-secondary,#B3BDB6)] uppercase tracking-wider">
            <span className="flex items-center gap-1.5">
              <Moon className="w-3.5 h-3.5 text-[var(--theme-accent,#91AFA9)]" />
              Sleep Timer
            </span>
            <span
              className={
                sleepTimer.isRunning
                  ? sleepTimer.isPaused
                    ? 'text-amber-500 font-medium'
                    : 'text-emerald-500 font-medium'
                  : 'text-[var(--theme-text-muted,#7E8D86)]'
              }
            >
              {sleepTimer.isRunning
                ? sleepTimer.isPaused
                  ? 'Paused'
                  : 'Running'
                : 'Off'}
            </span>
          </div>

          <div className="text-center font-mono text-4xl font-light text-[var(--theme-text-primary,#F1F3EF)] py-1">
            {sleepTimer.isRunning ? formatClock(sleepTimer.remainingSeconds) : '00:00'}
          </div>

          {/* Quick Timer Chips */}
          <div className="flex items-center justify-center gap-2 flex-wrap">
            {[15, 30, 60].map((mins) => (
              <button
                type="button"
                key={mins}
                onClick={() => setSleepTimer(mins)}
                className={`px-3 py-1.5 rounded-full font-mono text-xs border transition-all cursor-pointer ${
                  sleepTimer.isRunning && sleepTimer.durationMinutes === mins
                    ? 'bg-[var(--theme-accent,#91AFA9)] text-[var(--theme-bg,#101816)] border-[var(--theme-accent,#91AFA9)] font-semibold'
                    : 'bg-[var(--theme-surface,#182420)] border-[var(--theme-border-subtle,rgba(145,175,169,0.2))] text-[var(--theme-text-secondary,#B3BDB6)] hover:border-[var(--theme-accent,#91AFA9)] hover:text-[var(--theme-text-primary,#F1F3EF)]'
                }`}
              >
                {mins}m
              </button>
            ))}

            {/* Quick +5m Extend Button */}
            <button
              type="button"
              onClick={() => {
                const currentRemainingMin = Math.ceil(sleepTimer.remainingSeconds / 60);
                setSleepTimer(currentRemainingMin + 5);
              }}
              className="px-3 py-1.5 rounded-full font-mono text-xs border bg-[var(--theme-surface,#182420)] border-[var(--theme-border-subtle,rgba(145,175,169,0.2))] text-[var(--theme-accent,#91AFA9)] hover:border-[var(--theme-accent,#91AFA9)] transition-all cursor-pointer"
            >
              +5m
            </button>

            {/* Off / Cancel Button */}
            <button
              type="button"
              onClick={cancelSleepTimer}
              className="px-3 py-1.5 rounded-full font-mono text-xs border bg-red-950/20 border-red-500/30 text-red-500 hover:bg-red-950/40 transition-all cursor-pointer"
            >
              Off
            </button>
          </div>

          <p className="text-[11px] text-[var(--theme-text-muted,#7E8D86)] text-center pt-1">
            Ends with a gentle 30 second volume fade-out.
          </p>
        </div>

        {/* Background Aesthetic Selector */}
        <div className="rounded-2xl border border-[var(--theme-border-subtle,rgba(145,175,169,0.2))] bg-[var(--theme-elevated,#121C1A)] p-4 space-y-2.5">
          <div className="flex items-center justify-between font-mono text-[11px] text-[var(--theme-text-secondary,#B3BDB6)] uppercase tracking-wider">
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[var(--theme-accent,#91AFA9)]" />
              Background Mode
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {themeOptions.map((opt) => (
              <button
                type="button"
                key={opt.id}
                onClick={() => setThemeMode(opt.id)}
                className={`p-2 rounded-xl border text-[11px] font-medium transition-all flex flex-col items-center gap-1 text-center cursor-pointer ${
                  themeMode === opt.id
                    ? 'bg-[var(--theme-accent,#91AFA9)]/20 border-[var(--theme-accent,#91AFA9)] text-[var(--theme-text-primary,#F1F3EF)] shadow-sm'
                    : 'bg-[var(--theme-surface,#182420)] border-[var(--theme-border-subtle,rgba(145,175,169,0.2))] text-[var(--theme-text-secondary,#B3BDB6)] hover:border-[var(--theme-accent,#91AFA9)]'
                }`}
              >
                <span
                  className="w-3 h-3 rounded-full border border-black/20 dark:border-white/20 shrink-0"
                  style={{ backgroundColor: opt.color }}
                />
                <span className="line-clamp-1">{opt.label}</span>
                {themeMode === opt.id && (
                  <Check className="w-3 h-3 text-[var(--theme-accent,#91AFA9)]" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Recommended Companion Sounds */}
        <div className="space-y-2.5 pt-1">
          <div className="font-mono text-[11px] tracking-wider uppercase text-[var(--theme-accent,#91AFA9)] font-medium">
            Recommended Companions
          </div>
          <p className="text-xs text-[var(--theme-text-muted,#7E8D86)]">
            Pairs well with {sound.title}. Selecting one crossfades the current sound.
          </p>

          <div className="space-y-2">
            {companionSounds.map((comp) => (
              <button
                type="button"
                key={comp.id}
                onClick={() => playSingleSound(comp)}
                className="w-full flex items-center gap-3 p-2.5 rounded-2xl border border-[var(--theme-border-subtle,rgba(145,175,169,0.15))] hover:border-[var(--theme-accent,#91AFA9)]/60 bg-[var(--theme-elevated,#121C1A)] hover:bg-[var(--theme-hover,#1C2A26)] transition-all text-left group cursor-pointer"
              >
                <div className="relative w-12 h-12 rounded-xl overflow-hidden shrink-0 bg-black/30">
                  <img
                    src={comp.artwork}
                    alt={comp.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    loading="lazy"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-heading font-medium text-sm text-[var(--theme-text-primary,#F1F3EF)] group-hover:text-[var(--theme-accent,#91AFA9)] transition-colors truncate">
                    {comp.title}
                  </div>
                  <div className="text-[11px] text-[var(--theme-text-secondary,#B3BDB6)] truncate">
                    {comp.subtitle}
                  </div>
                </div>
                <span className="font-mono text-[10px] uppercase text-[var(--theme-accent,#91AFA9)] tracking-wider px-2 py-0.5 rounded bg-[var(--theme-surface,#182420)] border border-[var(--theme-border-subtle,rgba(145,175,169,0.2))] shrink-0">
                  {comp.moodTags[0]}
                </span>
              </button>
            ))}
          </div>
        </div>
      </aside>
    </>
  );
};
