'use client';

import React from 'react';
import Link from 'next/link';
import { SOUND_TRACKS } from '@/data/sounds';
import { usePlayerStore } from '@/stores/player-store';

export const SoundMarquee: React.FC = () => {
  const { playSingleSound } = usePlayerStore();
  // Duplicate array so translateX(-50%) creates a seamless continuous infinite loop
  const marqueeItems = [...SOUND_TRACKS, ...SOUND_TRACKS];

  return (
    <div
      className="relative w-full overflow-hidden border-y border-white/[0.08] py-3.5 sm:py-4 select-none my-2 sm:my-3"
      style={{
        maskImage: 'linear-gradient(90deg, transparent, #000 12%, #000 88%, transparent)',
        WebkitMaskImage: 'linear-gradient(90deg, transparent, #000 12%, #000 88%, transparent)',
      }}
      aria-hidden="true"
    >
      <style>{`
        @keyframes stillwaveMarquee {
          0% {
            transform: translate3d(0, 0, 0);
          }
          100% {
            transform: translate3d(-50%, 0, 0);
          }
        }
        .stillwave-marquee-inner {
          display: flex !important;
          flex-direction: row !important;
          flex-wrap: nowrap !important;
          width: max-content !important;
          animation: stillwaveMarquee 42s linear infinite !important;
          will-change: transform;
        }
        .stillwave-marquee-inner:hover {
          animation-play-state: paused !important;
        }
      `}</style>

      <div className="stillwave-marquee-inner flex flex-row flex-nowrap items-center w-max">
        {marqueeItems.map((sound, idx) => (
          <Link
            key={`${sound.id}-${idx}`}
            href={`/sound/${sound.id}`}
            onClick={() => playSingleSound(sound)}
            className="inline-flex shrink-0 items-center gap-8 sm:gap-12 pr-8 sm:pr-12 font-serif italic font-light text-lg sm:text-2xl text-[#7E8D86] hover:text-[#F1F3EF] transition-colors whitespace-nowrap cursor-pointer"
            title={`Listen to ${sound.title}`}
          >
            <span className="tracking-tight">{sound.title}</span>
            <span className="w-1.5 h-1.5 rounded-full shrink-0 bg-[var(--theme-accent,#91AFA9)] opacity-60 transition-colors duration-1000" />
          </Link>
        ))}
      </div>
    </div>
  );
};

