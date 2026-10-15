'use client';

import React, { useState, useEffect } from 'react';
import { Play, Pause } from 'lucide-react';
import { usePlayerStore } from '@/stores/player-store';
import { getSoundById } from '@/data/sounds';

interface DayHabitRitual {
  timeRange: string;
  name: string;
  description: string;
  soundId: string;
  timerMinutes?: number;
  startHour: number;
  endHour: number;
}

const RITUAL_SCHEDULE: DayHabitRitual[] = [
  {
    timeRange: '07:00 — 10:00',
    name: 'Dawn Rising',
    description: 'Brisk air and open space to wake up without a jolt.',
    soundId: 'wind', // Highland Breeze
    startHour: 7,
    endHour: 10,
  },
  {
    timeRange: '11:00 — 17:00',
    name: 'Midday Focus',
    description: 'Steady rain, the same texture for hours so your attention can disappear into the work.',
    soundId: 'rain', // Gentle Rain
    startHour: 11,
    endHour: 17,
  },
  {
    timeRange: '18:00 — 21:00',
    name: 'Twilight Unwind',
    description: 'A hearth and soft embers to mark the end of the working day.',
    soundId: 'fireplace', // Hearth Fireplace
    startHour: 18,
    endHour: 21,
  },
  {
    timeRange: '22:00 — 06:00',
    name: 'Deep Night',
    description: 'Low brown noise with the sleep timer already running.',
    soundId: 'brown-noise', // Velvet Brown Noise
    timerMinutes: 30,
    startHour: 22,
    endHour: 6,
  },
];

export const RitualSection: React.FC = () => {
  const { currentSound, playbackStatus, playSingleSound, togglePlayPause, setSleepTimer } =
    usePlayerStore();
  const [currentHour, setCurrentHour] = useState<number | null>(null);

  useEffect(() => {
    const updateHour = () => {
      setCurrentHour(new Date().getHours());
    };
    updateHour();
    const interval = setInterval(updateHour, 30000);
    return () => clearInterval(interval);
  }, []);

  const getActiveIndex = (h: number | null): number => {
    if (h === null) return 1;
    if (h >= 7 && h <= 10) return 0;
    if (h >= 11 && h <= 17) return 1;
    if (h >= 18 && h <= 21) return 2;
    return 3;
  };

  const activeIndex = getActiveIndex(currentHour);

  const handleActivate = (ritual: DayHabitRitual) => {
    const sound = getSoundById(ritual.soundId);
    if (!sound) return;

    if (currentSound?.id === sound.id && playbackStatus === 'playing') {
      togglePlayPause();
    } else {
      playSingleSound(sound);
      if (ritual.timerMinutes) {
        setSleepTimer(ritual.timerMinutes);
      }
    }
  };

  return (
    <section id="rituals" className="scroll-mt-24 py-14 sm:py-20 px-4 sm:px-8 max-w-[1040px] mx-auto w-full">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-8 sm:mb-9">
        <div>
          <div className="font-mono text-[10px] tracking-[0.16em] uppercase text-[var(--theme-accent,#91AFA9)] mb-1.5 flex items-center gap-2.5 transition-colors duration-1000">
            <span className="w-5 h-[1px] bg-current opacity-70" />
            <span>04 / Rituals &middot; Daily Habits</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-light tracking-[-0.02em] leading-tight text-[#F1F3EF] font-heading">
            A day, <em className="italic text-[#B3BDB6]">scored.</em>
          </h2>
        </div>
        <p className="text-xs font-mono text-[#7E8D86] max-w-xs leading-relaxed">
          Acoustic rituals synchronized to your day. Activates lead frequency beds with automatic timer fading.
        </p>
      </div>

      {/* Ritual Schedule List */}
      <div className="border-t border-white/[0.08] divide-y divide-white/[0.08]">
        {RITUAL_SCHEDULE.map((item, idx) => {
          const isNow = idx === activeIndex;
          const isPlayingThis =
            currentSound?.id === item.soundId && playbackStatus === 'playing';

          return (
            <div
              key={item.name}
              onClick={() => handleActivate(item)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleActivate(item);
                }
              }}
              className={`group grid grid-cols-1 md:grid-cols-[130px_1fr_1.3fr_auto] gap-2.5 md:gap-5 items-center py-4 sm:py-5 px-3 sm:px-4 rounded-xl transition-all duration-400 cursor-pointer ${
                isNow
                  ? 'bg-gradient-to-r from-[var(--theme-accent,#91AFA9)]/15 via-[var(--theme-accent,#91AFA9)]/5 to-transparent border-l-2 border-l-[var(--theme-accent,#91AFA9)] pl-4 sm:pl-5'
                  : 'hover:bg-white/[0.03] hover:pl-5 sm:hover:pl-6'
              }`}
            >
              {/* Time Column (.tm) */}
              <div className="font-mono text-xs text-[var(--theme-accent,#91AFA9)] flex items-center gap-1.5 transition-colors duration-1000">
                <span>{item.timeRange}</span>
                {isNow && (
                  <span className="text-[10px] tracking-wider text-[var(--theme-accent,#91AFA9)] font-semibold inline-flex items-center gap-1 ml-0.5">
                    &middot; <span className="w-1.5 h-1.5 rounded-full bg-[#7bd88f] animate-pulse" /> NOW
                  </span>
                )}
              </div>

              {/* Title (h3) */}
              <h3 className="font-heading font-light text-base sm:text-lg md:text-xl tracking-tight text-[#F1F3EF] group-hover:text-[var(--theme-accent,#91AFA9)] transition-colors duration-300">
                {item.name}
              </h3>

              {/* Description (p) */}
              <p className="text-xs sm:text-[13px] text-[#B3BDB6] leading-relaxed">
                {item.description}
                {item.timerMinutes && (
                  <span className="block mt-0.5 font-mono text-[10px] text-[#7E8D86]">
                    Starts a {item.timerMinutes} minute sleep timer automatically.
                  </span>
                )}
              </p>

              {/* Play / Pause Action Button */}
              <div className="flex md:justify-end mt-1.5 md:mt-0">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleActivate(item);
                  }}
                  className={`w-9 h-9 rounded-full flex items-center justify-center border transition-all active:scale-95 ${
                    isPlayingThis
                      ? 'bg-[var(--theme-accent,#91AFA9)] text-[#0A0F0E] border-[var(--theme-accent,#91AFA9)] shadow-md'
                      : 'border-white/15 bg-white/5 text-[#F1F3EF] hover:border-white/40 hover:bg-white/15'
                  }`}
                  aria-label={isPlayingThis ? `Pause ${item.name}` : `Play ${item.name}`}
                >
                  {isPlayingThis ? (
                    <Pause className="w-3.5 h-3.5 fill-current" />
                  ) : (
                    <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
