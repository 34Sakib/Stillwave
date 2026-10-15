'use client';

import React, { useCallback, useEffect, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import Link from 'next/link';
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

  // Mouse wheel horizontal scroll handler (strict horizontal intent only)
  useEffect(() => {
    if (!emblaApi) return;
    const rootNode = emblaApi.rootNode();
    if (!rootNode) return;

    let lastWheelTime = 0;
    const handleWheel = (e: WheelEvent) => {
      // Only handle true horizontal scrolls (trackpad swipe left/right or Shift+wheel)
      // Do NOT hijack vertical scrolling (deltaY) down the page!
      if (Math.abs(e.deltaX) <= Math.abs(e.deltaY) || Math.abs(e.deltaX) < 16) return;

      const now = Date.now();
      if (now - lastWheelTime < 240) return;
      lastWheelTime = now;

      if (e.deltaX > 0) {
        emblaApi.scrollNext();
      } else {
        emblaApi.scrollPrev();
      }
    };

    rootNode.addEventListener('wheel', handleWheel, { passive: true });
    return () => rootNode.removeEventListener('wheel', handleWheel);
  }, [emblaApi]);

  return (
    <section
      id="soundscapes"
      className="scroll-mt-24 relative py-16 sm:py-20 md:py-24 px-4 sm:px-6 md:px-8 max-w-7xl mx-auto w-full overflow-hidden"
    >
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 sm:mb-10 md:mb-12 gap-5 sm:gap-6">
        <div>
          <div className="text-xs uppercase font-mono tracking-widest text-[var(--theme-accent,#91AFA9)] flex items-center gap-3 mb-2 transition-colors duration-1000">
            <span className="w-6 h-[1px] bg-current opacity-70" />
            <span>01 / Featured</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-light tracking-tight text-[#F1F3EF] font-heading">
            Twenty rooms, <em>one at a time.</em>
          </h2>
          <p className="text-xs sm:text-sm text-[#B3BDB6] max-w-xl mt-2 leading-relaxed">
            Real, continuous natural acoustic soundscapes. Choosing a new sound crossfades the old one out and shifts the room into its atmosphere.
          </p>
        </div>

        {/* Carousel Arrow Controls & Library Link */}
        <div className="flex items-center justify-between md:justify-end gap-4 w-full md:w-auto">
          <Link
            href="/library"
            className="inline-flex items-center gap-1.5 text-xs font-mono text-[var(--theme-accent,#91AFA9)] hover:text-[#F1F3EF] transition-colors"
          >
            <span>Browse all 20 &rarr;</span>
          </Link>

          <div className="flex items-center gap-2">
            <button
              onClick={scrollPrev}
              aria-label="Previous soundscapes"
              className="p-2.5 sm:p-3 rounded-xl bg-[var(--theme-surface,#202B28)] border border-[var(--theme-border-subtle,rgba(145,175,169,0.2))] text-[#F1F3EF] hover:bg-[var(--theme-elevated,#283633)] hover:border-[var(--theme-border-active,rgba(145,175,169,0.5))] transition-colors active:scale-95"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={scrollNext}
              aria-label="Next soundscapes"
              className="p-2.5 sm:p-3 rounded-xl bg-[var(--theme-surface,#202B28)] border border-[var(--theme-border-subtle,rgba(145,175,169,0.2))] text-[#F1F3EF] hover:bg-[var(--theme-elevated,#283633)] hover:border-[var(--theme-border-active,rgba(145,175,169,0.5))] transition-colors active:scale-95"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Embla Carousel Viewport */}
      <div
        className="overflow-hidden cursor-grab active:cursor-grabbing select-none w-full"
        ref={emblaRef}
      >
        <div className="flex -ml-4 sm:-ml-6 touch-pan-y">
          {SOUND_TRACKS.map((sound) => {
            const isSelected = currentSound?.id === sound.id;
            return (
              <div
                key={sound.id}
                className="flex-[0_0_84%] min-[480px]:flex-[0_0_68%] sm:flex-[0_0_48%] md:flex-[0_0_45%] lg:flex-[0_0_31%] pl-4 sm:pl-6 min-w-0"
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

      {/* Carousel Pagination Dots & Count */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 mt-6 sm:mt-8">
        <span className="text-[11px] font-mono tracking-wider text-[#7E8D86] sm:hidden">
          Swipe horizontally to explore
        </span>

        <div className="flex justify-center items-center gap-1.5 sm:gap-2">
          {SOUND_TRACKS.map((sound, idx) => (
            <button
              key={sound.id}
              onClick={() => emblaApi && emblaApi.scrollTo(idx)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                selectedIndex === idx ? 'w-6 sm:w-8 bg-[#91AFA9]' : 'w-2 bg-[#91AFA9]/25 hover:bg-[#91AFA9]/50'
              }`}
              aria-label={`Go to slide ${idx + 1}: ${sound.title}`}
            />
          ))}
        </div>

        <span className="hidden sm:inline-block text-xs font-mono text-[#7E8D86]">
          {selectedIndex + 1} / {SOUND_TRACKS.length}
        </span>
      </div>
    </section>
  );
};
