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
      className={`relative flex flex-col justify-between p-5 rounded-2xl border transition-all duration-300 ${
        isPlaying
          ? 'bg-[#202B28] border-[#91AFA9]/40 shadow-xl ring-1 ring-[#91AFA9]/20'
          : 'bg-[#101816]/70 border-[#91AFA9]/10 hover:border-[#91AFA9]/25'
      }`}
    >
      {/* Top Details & Toggle Power Button */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="relative w-10 h-10 rounded-xl overflow-hidden border border-[#91AFA9]/20 shrink-0">
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
            <span className="text-[11px] text-[#91AFA9] font-mono capitalize">
              {sound.category}
            </span>
          </div>
        </div>

        {/* Toggle Layer On/Off */}
        <button
          onClick={() => toggleLayerPlay(sound.id)}
          className={`p-2.5 rounded-xl border transition-all active:scale-95 ${
            isPlaying
              ? 'bg-[#91AFA9] text-[#101816] border-[#91AFA9] shadow-md shadow-[#91AFA9]/20'
              : 'bg-[#101816] text-[#B3BDB6] border-[#91AFA9]/20 hover:text-[#F1F3EF] hover:border-[#91AFA9]/40'
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
            onClick={() => toggleLayerMute(sound.id)}
            disabled={!isPlaying}
            className={`flex items-center gap-1.5 transition-colors disabled:opacity-30 ${
              isMuted ? 'text-rose-400' : 'hover:text-[#F1F3EF]'
            }`}
            title={isMuted ? 'Unmute' : 'Mute'}
          >
            {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5 text-[#91AFA9]" />}
            <span className="font-mono text-[11px]">
              {isMuted ? 'Muted' : 'Volume'}
            </span>
          </button>

          <span className="font-mono text-[11px] text-[#D8D6C9]">
            {isPlaying && !isMuted ? `${Math.round(volume * 100)}%` : '0%'}
          </span>
        </div>

        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={volume}
          disabled={!isPlaying}
          onChange={(e) => setLayerVolume(sound.id, parseFloat(e.target.value))}
          className="w-full disabled:opacity-30 disabled:cursor-not-allowed"
          aria-label={`${sound.title} volume level`}
        />
      </div>

      {/* Dynamic Sound Active Indicator bar */}
      <div className="mt-3 h-1 w-full rounded-full bg-[#101816] overflow-hidden">
        <div
          className={`h-full transition-all duration-300 ${
            isPlaying && !isMuted ? 'bg-[#91AFA9]' : 'bg-transparent'
          }`}
          style={{ width: isPlaying && !isMuted ? `${volume * 100}%` : '0%' }}
        />
      </div>
    </div>
  );
};
