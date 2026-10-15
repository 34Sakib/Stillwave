'use client';

import React from 'react';
import Link from 'next/link';
import { Sparkles, ArrowRight } from 'lucide-react';
import { SOUND_TRACKS } from '@/data/sounds';
import { usePlayerStore } from '@/stores/player-store';

interface CollectionItem {
  tag: string;
  headline: string;
  description: string;
}

const COLLECTIONS: CollectionItem[] = [
  {
    tag: 'Deep Sleep',
    headline: 'Fall asleep faster',
    description: 'Snow, rain, music boxes and low hums to slow the mind down.',
  },
  {
    tag: 'Focus',
    headline: 'Stay in the work',
    description: 'Steady textures with no melody to pull your attention away.',
  },
  {
    tag: 'Meditation',
    headline: 'Settle and breathe',
    description: 'Bowls, drones and slow tides for bodily stillness and presence.',
  },
  {
    tag: 'Unwind',
    headline: 'Close the day',
    description: 'Fire, lake water and window drizzle for peaceful evenings.',
  },
];

export const CollectionsSection: React.FC = () => {
  const { playSingleSound } = usePlayerStore();

  return (
    <section id="collections" className="py-20 px-4 sm:px-8 max-w-7xl mx-auto">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
        <div>
          <div className="text-xs uppercase font-mono tracking-widest text-[var(--theme-accent,#91AFA9)] flex items-center gap-3 mb-2 transition-colors duration-1000">
            <span className="w-6 h-[1px] bg-current opacity-70" />
            <span>02 / Collections</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-light tracking-tight text-[#F1F3EF] font-heading">
            Find your <em>state.</em>
          </h2>
        </div>
        <p className="text-xs sm:text-sm text-[#7E8D86] font-mono max-w-sm">
          Sounds grouped by what they do for you. Open one to see them all.
        </p>
      </div>

      {/* 4 Collections Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {COLLECTIONS.map((col) => {
          const soundsInCol = SOUND_TRACKS.filter((s) => s.tag === col.tag);
          const sampleNames = soundsInCol.slice(0, 3).map((s) => s.title).join(' · ');

          return (
            <div
              key={col.tag}
              className="p-7 rounded-3xl border border-white/10 bg-white/[0.03] hover:border-white/30 hover:bg-white/[0.06] transition-all duration-300 flex flex-col justify-between group shadow-lg min-h-[300px]"
            >
              <div>
                <span className="text-[11px] font-mono text-[#7E8D86] block mb-3">
                  {soundsInCol.length} sounds
                </span>
                <h3 className="text-2xl font-light tracking-tight text-[#F1F3EF] font-heading group-hover:text-[var(--theme-accent,#91AFA9)] transition-colors">
                  {col.headline}
                </h3>
                <p className="text-xs sm:text-sm text-[#B3BDB6] mt-3 leading-relaxed">
                  {col.description}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-white/10 space-y-4">
                <span className="text-[10px] font-mono text-[#7E8D86] block truncate">
                  {sampleNames}
                </span>

                <div className="flex items-center justify-between">
                  <Link
                    href={`/library`}
                    className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[var(--theme-accent,#91AFA9)] hover:text-[#F1F3EF] transition-colors"
                  >
                    <span>Open {col.tag}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>

                  {soundsInCol[0] && (
                    <button
                      onClick={() => playSingleSound(soundsInCol[0])}
                      className="text-[11px] font-mono text-[#B3BDB6] hover:text-[#F1F3EF] px-2.5 py-1 rounded-full border border-white/15 bg-white/5 hover:border-white/30 transition-all"
                      title={`Listen to ${soundsInCol[0].title}`}
                    >
                      Play Lead
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
