'use client';

import React from 'react';
import Image from 'next/image';
import { Play, Pause, Plus, Check, Heart } from 'lucide-react';
import { SoundTrack } from '@/types';
import { usePlayerStore } from '@/stores/player-store';

interface SoundCardProps {
  sound: SoundTrack;
  isActive: boolean;
  isPlaying: boolean;
}

export const SoundCard: React.FC<SoundCardProps> = ({ sound, isActive, isPlaying }) => {
  const { playSingleSound, togglePlayPause, toggleLayerPlay, activeLayers, favorites, toggleFavorite } =
    usePlayerStore();

  const isLayerActive = activeLayers[sound.id]?.isPlaying;
  const isFav = favorites.includes(sound.id);
  const pointerStart = React.useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  const handlePointerDown = (e: React.PointerEvent) => {
    pointerStart.current = { x: e.clientX, y: e.clientY };
  };

  const handleCardClick = () => {
    if (isActive && isPlaying) {
      togglePlayPause();
    } else {
      playSingleSound(sound);
    }
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    const dx = Math.abs(e.clientX - pointerStart.current.x);
    const dy = Math.abs(e.clientY - pointerStart.current.y);
    // If pointer moved more than 8px, it was a carousel drag gesture
    if (dx > 8 || dy > 8) return;
    handleCardClick();
  };

  const handleMixLayerToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleLayerPlay(sound.id);
  };

  const handleFavoriteToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleFavorite(sound.id);
  };

  return (
    <div
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      className={`group relative flex flex-col justify-end w-full h-[360px] sm:h-[390px] rounded-2xl overflow-hidden cursor-pointer select-none border transition-all duration-300 ${
        isActive
          ? 'border-[#91AFA9] ring-2 ring-[#91AFA9]/30 shadow-2xl scale-[1.02]'
          : 'border-[#91AFA9]/15 hover:border-[#91AFA9]/50 hover:shadow-xl hover:-translate-y-1'
      }`}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleCardClick();
        }
      }}
      aria-label={`Soundscape card for ${sound.title}. ${isActive && isPlaying ? 'Currently playing' : 'Click to listen'}`}
    >
      {/* Background Image with Dark Vignette */}
      <div className="absolute inset-0 z-0 bg-[#101816]">
        <Image
          src={sound.artwork}
          alt={sound.title}
          fill
          sizes="(max-width: 768px) 85vw, 360px"
          className="object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
          priority={sound.id === 'rain' || sound.id === 'forest'}
        />
        {/* Gradients to protect readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#101816] via-[#101816]/60 to-transparent" />
        <div className="absolute inset-0 bg-black/25 group-hover:bg-black/10 transition-colors" />
      </div>

      {/* Top Floating Badges */}
      <div className="absolute top-3.5 left-3.5 right-3.5 sm:top-4 sm:left-4 sm:right-4 z-10 flex items-center justify-between">
        <span className="px-2.5 py-1 rounded-full text-[10px] uppercase font-mono tracking-wider bg-[#101816]/75 backdrop-blur-md border border-[#91AFA9]/20 text-[#D8D6C9]">
          {sound.category}
        </span>

        <button
          onClick={handleFavoriteToggle}
          className={`p-2 rounded-full backdrop-blur-md border transition-all ${
            isFav
              ? 'bg-rose-950/70 border-rose-500/40 text-rose-300'
              : 'bg-[#101816]/75 border-[#91AFA9]/20 text-[#B3BDB6] hover:text-[#F1F3EF]'
          }`}
          title={isFav ? 'Remove from favorites' : 'Add to favorites'}
          aria-label={isFav ? 'Remove from favorites' : 'Add to favorites'}
        >
          <Heart className={`w-3.5 h-3.5 ${isFav ? 'fill-current' : ''}`} />
        </button>
      </div>

      {/* Card Body */}
      <div className="relative z-10 p-4 sm:p-5 space-y-2">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-lg sm:text-xl font-semibold tracking-wide text-[#F1F3EF] group-hover:text-[#91AFA9] transition-colors">
              {sound.title}
            </h3>
            {isActive && isPlaying && (
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#91AFA9] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#91AFA9]"></span>
              </span>
            )}
          </div>
          <p className="text-xs text-[#B3BDB6] line-clamp-2 mt-1 leading-relaxed">
            {sound.description}
          </p>
        </div>

        {/* Mood Tags */}
        <div className="flex flex-wrap gap-1.5 pt-1">
          {sound.moodTags.map((tag) => (
            <span
              key={tag}
              className="text-[10px] px-2 py-0.5 rounded-md bg-[#202B28]/80 text-[#91AFA9] border border-[#91AFA9]/15 font-mono"
            >
              #{tag.toLowerCase()}
            </span>
          ))}
        </div>

        {/* Action Controls */}
        <div className="pt-2 flex items-center justify-between border-t border-[#91AFA9]/15">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-medium text-[#D8D6C9]">
              {isActive && isPlaying ? 'Playing' : 'Listen Now'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Add to Mixer Button */}
            <button
              onClick={handleMixLayerToggle}
              className={`p-2 rounded-xl text-xs font-medium border transition-all ${
                isLayerActive
                  ? 'bg-[#91AFA9]/20 border-[#91AFA9] text-[#91AFA9]'
                  : 'bg-[#202B28]/90 border-[#91AFA9]/20 text-[#B3BDB6] hover:text-[#F1F3EF]'
              }`}
              title={isLayerActive ? 'Active in atmosphere mix' : 'Add to atmosphere mix'}
              aria-label={isLayerActive ? 'Remove from atmosphere mix' : 'Add to atmosphere mix'}
            >
              {isLayerActive ? <Check className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
            </button>

            {/* Play / Pause Primary Button */}
            <div
              className={`p-2.5 rounded-xl border transition-all ${
                isActive && isPlaying
                  ? 'bg-[#91AFA9] text-[#101816] border-[#91AFA9] shadow-lg'
                  : 'bg-[#202B28] text-[#F1F3EF] border-[#91AFA9]/30 group-hover:bg-[#91AFA9] group-hover:text-[#101816] group-hover:border-[#91AFA9]'
              }`}
            >
              {isActive && isPlaying ? (
                <Pause className="w-4 h-4 fill-current" />
              ) : (
                <Play className="w-4 h-4 fill-current ml-0.5" />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
