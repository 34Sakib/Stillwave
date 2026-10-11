'use client';

import React, { useEffect, useState } from 'react';
import {
  CloudRain,
  Play,
  Pause,
  Square,
  Volume2,
  Sliders,
  RotateCcw,
  X,
  Sparkles,
  Headphones,
  Droplets,
  Timer,
  Check,
} from 'lucide-react';
import { useRainStore } from '@/stores/rain-store';
import { usePlayerStore } from '@/stores/player-store';
import { RAIN_PRESETS } from '@/audio/rain-presets';
import { SOUND_TRACKS } from '@/data/sounds';

export const RainPlayer: React.FC = () => {
  const {
    parameters,
    activePresetId,
    isCustomizerOpen,
    setVolume,
    setIntensity,
    setDropDensity,
    setSplashDensity,
    setStereoWidth,
    applyPreset,
    resetToDefault,
    closeCustomizer,
  } = useRainStore();

  const {
    activeLayers,
    playSingleSound,
    toggleLayerPlay,
    setSleepTimer,
    sleepTimer,
  } = usePlayerStore();

  const isRainPlaying = activeLayers.rain?.isPlaying ?? false;
  const [selectedTimerMin, setSelectedTimerMin] = useState<number | null>(null);

  // Sync keyboard Esc to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isCustomizerOpen) {
        closeCustomizer();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isCustomizerOpen, closeCustomizer]);

  if (!isCustomizerOpen) return null;

  const handlePlayPause = async () => {
    const rainTrack = SOUND_TRACKS.find((s) => s.id === 'rain');
    if (!rainTrack) return;

    if (isRainPlaying) {
      await toggleLayerPlay('rain');
    } else {
      await playSingleSound(rainTrack);
    }
  };

  const handleStop = async () => {
    if (isRainPlaying) {
      await toggleLayerPlay('rain');
    }
  };

  const handleTimerSelect = (mins: number) => {
    if (selectedTimerMin === mins) {
      setSelectedTimerMin(null);
    } else {
      setSelectedTimerMin(mins);
      setSleepTimer(mins);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="rain-customizer-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/75 backdrop-blur-md animate-in fade-in duration-200"
    >
      {/* Backdrop tap to close */}
      <div
        className="absolute inset-0"
        onClick={closeCustomizer}
        aria-hidden="true"
      />

      {/* Main Studio Card */}
      <div className="relative w-full max-w-2xl bg-neutral-900/95 border border-neutral-800 rounded-3xl shadow-2xl overflow-hidden z-10 flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="relative px-6 py-5 border-b border-neutral-800 flex items-center justify-between bg-gradient-to-r from-sky-950/30 via-neutral-900 to-neutral-900">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400">
              <CloudRain className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2
                  id="rain-customizer-title"
                  className="text-lg font-semibold text-neutral-100 tracking-tight"
                >
                  Rain Sound Studio
                </h2>
                <span className="px-2 py-0.5 text-[10px] uppercase font-bold tracking-wider bg-sky-500/15 text-sky-400 rounded-full border border-sky-500/20">
                  Real-Time Engine
                </span>
              </div>
              <p className="text-xs text-neutral-400 mt-0.5">
                Multi-layer procedural acoustics calibrated to natural rainfall
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={resetToDefault}
              className="px-3 py-1.5 text-xs text-neutral-400 hover:text-neutral-200 bg-neutral-800/60 hover:bg-neutral-800 rounded-xl transition-colors flex items-center gap-1.5 border border-neutral-700/50"
              title="Reset parameters to default"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Reset</span>
            </button>
            <button
              onClick={closeCustomizer}
              aria-label="Close Rain Studio"
              className="p-2 text-neutral-400 hover:text-neutral-100 hover:bg-neutral-800 rounded-xl transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Body */}
        <div className="overflow-y-auto p-6 space-y-6 flex-1 custom-scrollbar">
          {/* Preset Selector */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold tracking-wider text-neutral-400 uppercase flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-sky-400" />
                Acoustic Presets
              </span>
              <span className="text-[11px] text-neutral-500">
                Click to load calibrated profile
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {RAIN_PRESETS.map((preset) => {
                const isSelected = activePresetId === preset.id;
                return (
                  <button
                    key={preset.id}
                    onClick={() => applyPreset(preset)}
                    className={`relative p-3 rounded-2xl text-left transition-all border ${
                      isSelected
                        ? 'bg-sky-500/15 border-sky-500/40 text-sky-200 shadow-lg shadow-sky-950/50'
                        : 'bg-neutral-800/40 border-neutral-800 text-neutral-300 hover:bg-neutral-800/70 hover:border-neutral-700'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-medium truncate">
                        {preset.name}
                      </span>
                      {isSelected && (
                        <Check className="w-3.5 h-3.5 text-sky-400 shrink-0 ml-1" />
                      )}
                    </div>
                    <p className="text-[10px] text-neutral-400 line-clamp-2 leading-relaxed">
                      {preset.description}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Real-Time Parameter Sliders */}
          <div className="space-y-4 pt-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold tracking-wider text-neutral-400 uppercase flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5 text-sky-400" />
                Live Acoustic Parameters
              </span>
              <span className="text-[11px] text-neutral-500">
                Real-time Web Audio DSP
              </span>
            </div>

            {/* Slider 1: Rain Intensity */}
            <div className="p-3.5 bg-neutral-800/30 border border-neutral-800/80 rounded-2xl space-y-2">
              <div className="flex justify-between items-center text-xs">
                <div className="flex items-center gap-2">
                  <CloudRain className="w-4 h-4 text-sky-400" />
                  <span className="text-neutral-200 font-medium">
                    Rain Intensity (Bed Warmth & Fullness)
                  </span>
                </div>
                <span className="font-mono text-sky-400 font-semibold">
                  {Math.round(parameters.intensity * 100)}%
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={parameters.intensity}
                onChange={(e) => setIntensity(parseFloat(e.target.value))}
                className="w-full h-1.5 bg-neutral-700 rounded-lg appearance-none cursor-pointer accent-sky-400"
              />
              <p className="text-[11px] text-neutral-400 leading-tight">
                Controls the low-pass frequency curve and volume of the continuous rainfall bed without harsh hiss.
              </p>
            </div>

            {/* Slider 2: Raindrop Detail */}
            <div className="p-3.5 bg-neutral-800/30 border border-neutral-800/80 rounded-2xl space-y-2">
              <div className="flex justify-between items-center text-xs">
                <div className="flex items-center gap-2">
                  <Droplets className="w-4 h-4 text-cyan-400" />
                  <span className="text-neutral-200 font-medium">
                    Raindrop Detail (Patter Density)
                  </span>
                </div>
                <span className="font-mono text-cyan-400 font-semibold">
                  {Math.round(parameters.dropDensity * 100)}%
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={parameters.dropDensity}
                onChange={(e) => setDropDensity(parseFloat(e.target.value))}
                className="w-full h-1.5 bg-neutral-700 rounded-lg appearance-none cursor-pointer accent-cyan-400"
              />
              <p className="text-[11px] text-neutral-400 leading-tight">
                Generates irregular, non-repeating Poisson micro-transient droplets across the stereo field.
              </p>
            </div>

            {/* Slider 3: Splash Density */}
            <div className="p-3.5 bg-neutral-800/30 border border-neutral-800/80 rounded-2xl space-y-2">
              <div className="flex justify-between items-center text-xs">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-teal-400" />
                  <span className="text-neutral-200 font-medium">
                    Splash Density (Surface Puddle Droplets)
                  </span>
                </div>
                <span className="font-mono text-teal-400 font-semibold">
                  {Math.round(parameters.splashDensity * 100)}%
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={parameters.splashDensity}
                onChange={(e) => setSplashDensity(parseFloat(e.target.value))}
                className="w-full h-1.5 bg-neutral-700 rounded-lg appearance-none cursor-pointer accent-teal-400"
              />
              <p className="text-[11px] text-neutral-400 leading-tight">
                Occasional resonant downward pitch sweeps simulating soft water splashes and pond ripples.
              </p>
            </div>

            {/* Slider 4: Stereo Width */}
            <div className="p-3.5 bg-neutral-800/30 border border-neutral-800/80 rounded-2xl space-y-2">
              <div className="flex justify-between items-center text-xs">
                <div className="flex items-center gap-2">
                  <Headphones className="w-4 h-4 text-indigo-400" />
                  <span className="text-neutral-200 font-medium">
                    Stereo Width (Spatial Immersion)
                  </span>
                </div>
                <span className="font-mono text-indigo-400 font-semibold">
                  {Math.round(parameters.stereoWidth * 100)}%
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={parameters.stereoWidth}
                onChange={(e) => setStereoWidth(parseFloat(e.target.value))}
                className="w-full h-1.5 bg-neutral-700 rounded-lg appearance-none cursor-pointer accent-indigo-400"
              />
              <p className="text-[11px] text-neutral-400 leading-tight">
                Subtle headphone spatialization and decorrelation for an expansive, enveloping 3D atmosphere.
              </p>
            </div>

            {/* Slider 5: Master Volume */}
            <div className="p-3.5 bg-neutral-800/30 border border-neutral-800/80 rounded-2xl space-y-2">
              <div className="flex justify-between items-center text-xs">
                <div className="flex items-center gap-2">
                  <Volume2 className="w-4 h-4 text-emerald-400" />
                  <span className="text-neutral-200 font-medium">
                    Rain Master Volume
                  </span>
                </div>
                <span className="font-mono text-emerald-400 font-semibold">
                  {Math.round(parameters.volume * 100)}%
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={parameters.volume}
                onChange={(e) => setVolume(parseFloat(e.target.value))}
                className="w-full h-1.5 bg-neutral-700 rounded-lg appearance-none cursor-pointer accent-emerald-400"
              />
            </div>
          </div>

          {/* Sleep Timer Section */}
          <div className="p-4 bg-neutral-800/30 border border-neutral-800 rounded-2xl space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-medium text-neutral-200 flex items-center gap-2">
                <Timer className="w-4 h-4 text-amber-400" />
                Sleep Timer & Gentle Fade-Out
              </span>
              {sleepTimer.isRunning && (
                <span className="font-mono text-amber-400 text-xs font-semibold">
                  {Math.floor(sleepTimer.remainingSeconds / 60)}:
                  {(sleepTimer.remainingSeconds % 60).toString().padStart(2, '0')}{' '}
                  remaining
                </span>
              )}
            </div>
            <div className="flex gap-2">
              {[15, 30, 45, 60].map((mins) => {
                const isActive =
                  sleepTimer.isRunning &&
                  sleepTimer.durationMinutes === mins;
                return (
                  <button
                    key={mins}
                    onClick={() => handleTimerSelect(mins)}
                    className={`flex-1 py-1.5 px-2 rounded-xl text-xs font-medium transition-all border ${
                      isActive
                        ? 'bg-amber-500/20 border-amber-500/40 text-amber-300'
                        : 'bg-neutral-800/60 border-neutral-700/60 text-neutral-300 hover:bg-neutral-800 hover:text-white'
                    }`}
                  >
                    {mins}m
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer Playback Controls */}
        <div className="px-6 py-4 border-t border-neutral-800 bg-neutral-900/90 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <button
              onClick={handlePlayPause}
              className="px-5 py-2.5 rounded-2xl bg-sky-500 hover:bg-sky-400 text-neutral-950 font-semibold text-sm transition-all flex items-center gap-2 shadow-lg shadow-sky-500/20 active:scale-95"
            >
              {isRainPlaying ? (
                <>
                  <Pause className="w-4 h-4 fill-current" />
                  <span>Pause Rain</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-current ml-0.5" />
                  <span>Play Rain</span>
                </>
              )}
            </button>

            <button
              onClick={handleStop}
              disabled={!isRainPlaying}
              className="p-2.5 rounded-2xl bg-neutral-800 hover:bg-neutral-700 disabled:opacity-40 disabled:hover:bg-neutral-800 text-neutral-300 hover:text-white transition-colors"
              title="Stop Rain"
            >
              <Square className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={closeCustomizer}
            className="px-4 py-2 text-xs font-medium text-neutral-400 hover:text-neutral-200 transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
