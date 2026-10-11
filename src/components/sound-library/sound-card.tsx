'use client';

import React from 'react';
import Image from 'next/image';
import { Play, Pause, Plus, Check, Heart, Sliders } from 'lucide-react';
import { SoundTrack } from '@/types';
import { usePlayerStore } from '@/stores/player-store';
import { useRainStore } from '@/stores/rain-store';

interface SoundCardProps {
  sound: SoundTrack;
  isActive: boolean;
  isPlaying: boolean;
}

export const SoundCard: React.FC<SoundCardProps> = ({
  sound,
  isActive,
  isPlaying,
}) => {
  const {
    playSingleSound,
    togglePlayPause,
    toggleLayerPlay,
    activeLayers,
    favorites,
    toggleFavorite,
  } = usePlayerStore();

  const isLayerActive = activeLayers[sound.id]?.isPlaying;
  const isFav = favorites.includes(sound.id);

  const handleCardClick = () => {
    if (isActive && isPlaying) {
      togglePlayPause();
    } else {
      playSingleSound(sound);
    }
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
      onClick={handleCardClick}
      className={`group relative flex flex-col justify-end w-full h-[360px] sm:h-[390px] md:h-[420px] rounded-2xl overflow-hidden cursor-pointer select-none border transition-all duration-300 ${
        isActive
          ? 'border-[#91AFA9] ring-2 ring-[#91AFA9]/30 shadow-2xl scale-[1.01]'
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
          sizes="(max-width: 640px) 85vw, (max-width: 1024px) 48vw, 380px"
          className="object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
          priority={sound.id === 'rain' || sound.id === 'forest'}
        />
        {/* Gradients to protect readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#101816] via-[#101816]/65 to-transparent" />
        <div className="absolute inset-0 bg-black/25 group-hover:bg-black/10 transition-colors" />
      </div>

      {/* Top Floating Badges */}
      <div className="absolute top-3 left-3 right-3 sm:top-4 sm:left-4 sm:right-4 z-10 flex items-center justify-between pointer-events-none">
        <span className="px-2.5 py-1 rounded-full text-[10px] uppercase font-mono tracking-wider bg-[#101816]/85 backdrop-blur-md border border-[#91AFA9]/25 text-[#D8D6C9] pointer-events-auto">
          {sound.category}
        </span>

        <button
          onClick={handleFavoriteToggle}
          className={`p-2 sm:p-2.5 rounded-full backdrop-blur-md border transition-all pointer-events-auto min-w-[34px] min-h-[34px] flex items-center justify-center ${
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
      <div className="relative z-10 p-4 sm:p-5 space-y-2 sm:space-y-2.5">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base sm:text-lg md:text-xl font-semibold tracking-wide text-[#F1F3EF] group-hover:text-[#91AFA9] transition-colors">
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
        <div className="flex flex-wrap gap-1.5 pt-0.5">
          {sound.moodTags.map((tag) => (
            <span
              key={tag}
              className="text-[10px] px-2 py-0.5 rounded-md bg-[#202B28]/85 text-[#91AFA9] border border-[#91AFA9]/15 font-mono"
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
            {/* Tune Rain Procedural Studio Button */}
            {sound.id === 'rain' && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  useRainStore.getState().openCustomizer();
                }}
                className="px-2.5 py-1.5 rounded-xl text-xs font-medium border border-sky-500/30 bg-sky-500/10 text-sky-300 hover:bg-sky-500/20 hover:border-sky-400/50 transition-all flex items-center gap-1.5 shadow-sm"
                title="Customize realistic rain acoustics, intensity, and patter"
                aria-label="Open Rain Sound Studio"
              >
                <Sliders className="w-3.5 h-3.5 text-sky-400" />
                <span className="hidden sm:inline">Tune</span>
              </button>
            )}

            {/* Add to Mixer Button */}
            <button
              onClick={handleMixLayerToggle}
              className={`p-2 sm:p-2.5 rounded-xl text-xs font-medium border transition-all min-w-[34px] min-h-[34px] flex items-center justify-center ${
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
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleCardClick();
              }}
              className={`p-2.5 sm:p-3 rounded-xl border transition-all min-w-[38px] min-h-[38px] flex items-center justify-center ${
                isActive && isPlaying
                  ? 'bg-[#91AFA9] text-[#101816] border-[#91AFA9] shadow-lg'
                  : 'bg-[#202B28] text-[#F1F3EF] border-[#91AFA9]/30 group-hover:bg-[#91AFA9] group-hover:text-[#101816] group-hover:border-[#91AFA9]'
              }`}
              title={isActive && isPlaying ? 'Pause sound' : 'Play sound'}
              aria-label={isActive && isPlaying ? `Pause ${sound.title}` : `Play ${sound.title}`}
            >
              {isActive && isPlaying ? (
                <Pause className="w-4 h-4 fill-current" />
              ) : (
                <Play className="w-4 h-4 fill-current ml-0.5" />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
