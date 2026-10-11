'use client';

import React, { useCallback, useEffect, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { ChevronLeft, ChevronRight, Sliders } from 'lucide-react';
import { SOUND_TRACKS } from '@/data/sounds';
import { SoundCard } from './sound-card';
import { usePlayerStore } from '@/stores/player-store';

export const SoundscapeCarousel: React.FC = () => {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: 'start',
    loop: true,
    skipSnaps: false,
    dragFree: false,
  });

  const [selectedIndex, setSelectedIndex] = useState(0);

  const { currentSound, playbackStatus } = usePlayerStore();
  const isPlaying = playbackStatus === 'playing';

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap() % SOUND_TRACKS.length);
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.on('select', onSelect);
    emblaApi.on('reInit', onSelect);
    const id = setTimeout(onSelect, 0);
    return () => {
      clearTimeout(id);
    };
  }, [emblaApi, onSelect]);

  // Mouse wheel horizontal scroll handler
  useEffect(() => {
    if (!emblaApi) return;
    const rootNode = emblaApi.rootNode();
    if (!rootNode) return;

    let lastWheelTime = 0;
    const handleWheel = (e: WheelEvent) => {
      const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
      if (Math.abs(delta) < 18) return;

      const now = Date.now();
      if (now - lastWheelTime < 280) return;
      lastWheelTime = now;

      if (delta > 0) {
        emblaApi.scrollNext();
      } else {
        emblaApi.scrollPrev();
      }
    };

    rootNode.addEventListener('wheel', handleWheel, { passive: true });
    return () => rootNode.removeEventListener('wheel', handleWheel);
  }, [emblaApi]);

  return (
    <section id="soundscapes" className="scroll-mt-24 relative py-24 px-5 sm:px-8 max-w-7xl mx-auto">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
        <div>
          <span className="text-xs uppercase font-mono tracking-widest text-[#91AFA9] block mb-2">
            02 · Soundscapes
          </span>
          <h2 className="text-3xl sm:text-4xl font-light tracking-tight text-[#F1F3EF] font-heading">
            Choose Your Atmosphere
          </h2>
          <p className="text-sm text-[#B3BDB6] max-w-xl mt-2 leading-relaxed">
            Real, continuous natural acoustic soundscapes. Swipe or scroll horizontally to explore environments, or layer multiple tracks simultaneously in the mixer.
          </p>
        </div>

        {/* Carousel Arrow Controls */}
        <div className="flex items-center gap-3">
          <a
            href="#atmosphere-mixer"
            className="hidden sm:inline-flex items-center gap-1.5 text-xs text-[#91AFA9] hover:text-[#F1F3EF] mr-4 transition-colors"
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Open Multi-Track Mixer</span>
          </a>

          <button
            onClick={scrollPrev}
            aria-label="Previous soundscapes"
            className="p-3 rounded-xl bg-[#202B28] border border-[#91AFA9]/20 text-[#F1F3EF] hover:bg-[#283633] hover:border-[#91AFA9]/50 transition-colors active:scale-95"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={scrollNext}
            aria-label="Next soundscapes"
            className="p-3 rounded-xl bg-[#202B28] border border-[#91AFA9]/20 text-[#F1F3EF] hover:bg-[#283633] hover:border-[#91AFA9]/50 transition-colors active:scale-95"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Embla Carousel Viewport */}
      <div
        className="overflow-hidden cursor-grab active:cursor-grabbing select-none"
        ref={emblaRef}
      >
        <div className="flex -ml-6 touch-pan-y">
          {SOUND_TRACKS.map((sound) => {
            const isSelected = currentSound?.id === sound.id;
            return (
              <div
                key={sound.id}
                className="flex-[0_0_88%] sm:flex-[0_0_46%] lg:flex-[0_0_31%] pl-6 min-w-0"
              >
                <SoundCard
                  sound={sound}
                  isActive={isSelected}
                  isPlaying={isSelected && isPlaying}
                />
              </div>
            );
          })}
        </div>
      </div>

      {/* Carousel Pagination Dots */}
      <div className="flex justify-center items-center gap-2 mt-8">
        {SOUND_TRACKS.map((_, idx) => (
          <button
            key={idx}
            onClick={() => emblaApi && emblaApi.scrollTo(idx)}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              selectedIndex === idx ? 'w-8 bg-[#91AFA9]' : 'w-2 bg-[#91AFA9]/25 hover:bg-[#91AFA9]/50'
            }`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </section>
  );
};
