'use client';

import React from 'react';
import Image from 'next/image';
import { Volume2, VolumeX, Play, Pause } from 'lucide-react';
import { SoundTrack } from '@/types';
import { usePlayerStore } from '@/stores/player-store';

interface MixerChannelProps {
  sound: SoundTrack;
}

export const MixerChannel: React.FC<MixerChannelProps> = ({ sound }) => {
  const {
    activeLayers,
    setLayerVolume,
    toggleLayerMute,
    toggleLayerPlay,
  } = usePlayerStore();

  const layerState = activeLayers[sound.id] || {
    volume: sound.defaultVolume,
    isMuted: false,
    isPlaying: false,
  };

  const isPlaying = layerState.isPlaying;
  const isMuted = layerState.isMuted;
  const volume = layerState.volume;

  return (
    <div
      className={`relative flex flex-col justify-between p-5 rounded-2xl border transition-all duration-500 ${
        isPlaying
          ? 'bg-[var(--theme-surface,#202B28)] border-[var(--theme-border-active,rgba(145,175,169,0.4))] shadow-xl ring-1 ring-[var(--theme-accent,#91AFA9)]/20'
          : 'bg-[var(--theme-bg,#101816)]/70 border-[var(--theme-border-subtle,rgba(145,175,169,0.1))] hover:border-[var(--theme-border-active,rgba(145,175,169,0.25))]'
      }`}
    >
      {/* Top Details & Toggle Power Button */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="relative w-10 h-10 rounded-xl overflow-hidden border border-[var(--theme-border-subtle,rgba(145,175,169,0.2))] shrink-0">
            <Image
              src={sound.artwork}
              alt={sound.title}
              fill
              sizes="40px"
              className="object-cover"
            />
          </div>
          <div>
            <h4 className="text-sm font-medium text-[#F1F3EF] leading-tight">
              {sound.title}
            </h4>
            <span className="text-[11px] text-[var(--theme-accent,#91AFA9)] font-mono capitalize transition-colors duration-500">
              {sound.category}
            </span>
          </div>
        </div>

        {/* Toggle Layer On/Off */}
        <button
          onClick={() => toggleLayerPlay(sound.id)}
          className={`p-2.5 rounded-xl border transition-all active:scale-95 ${
            isPlaying
              ? 'bg-[var(--theme-accent,#91AFA9)] text-[#101816] border-[var(--theme-accent,#91AFA9)] shadow-md'
              : 'bg-[var(--theme-bg,#101816)] text-[#B3BDB6] border-[var(--theme-border-subtle,rgba(145,175,169,0.2))] hover:text-[#F1F3EF] hover:border-[var(--theme-border-active,rgba(145,175,169,0.4))]'
          }`}
          title={isPlaying ? 'Mute/Disable track layer' : 'Activate track layer'}
          aria-label={isPlaying ? `Disable ${sound.title}` : `Enable ${sound.title}`}
        >
          {isPlaying ? <Pause className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 fill-current ml-0.5" />}
        </button>
      </div>

      {/* Volume Slider Section */}
      <div className="mt-5 space-y-2">
        <div className="flex items-center justify-between text-xs text-[#B3BDB6]">
          <button
            type="button"
            onClick={() => toggleLayerMute(sound.id)}
            className={`flex items-center gap-1.5 transition-colors cursor-pointer ${
              isMuted ? 'text-rose-400' : 'hover:text-[#F1F3EF]'
            }`}
            title={isMuted ? 'Unmute' : 'Mute'}
          >
            {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5 text-[var(--theme-accent,#91AFA9)]" />}
            <span className="font-mono text-[11px]">
              {isMuted ? 'Muted' : 'Volume'}
            </span>
          </button>

          <span className="font-mono text-[11px] text-[#D8D6C9]">
            {!isMuted ? `${Math.round(volume * 100)}%` : '0%'}
          </span>
        </div>

        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={volume}
          onChange={(e) => setLayerVolume(sound.id, parseFloat(e.target.value))}
          className="w-full cursor-pointer"
          aria-label={`${sound.title} volume level`}
        />
      </div>

      {/* Dynamic Sound Active Indicator bar */}
      <div className="mt-3 h-1 w-full rounded-full bg-[var(--theme-bg,#101816)] overflow-hidden transition-colors duration-1000">
        <div
          className={`h-full transition-all duration-300 ${
            isPlaying && !isMuted ? 'bg-[var(--theme-accent,#91AFA9)]' : 'bg-transparent'
          }`}
          style={{ width: isPlaying && !isMuted ? `${volume * 100}%` : '0%' }}
        />
      </div>
    </div>
  );
};
