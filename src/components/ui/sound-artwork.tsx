'use client';

import React from 'react';
import { SoundTrack } from '@/types';
import { SOUND_TRACKS } from '@/data/sounds';

interface SoundArtworkProps {
  sound: SoundTrack;
  index?: number;
  className?: string;
  isSpinning?: boolean;
}

export const SoundArtwork: React.FC<SoundArtworkProps> = ({
  sound,
  index,
  className = 'w-full h-full',
  isSpinning = false,
}) => {
  const i = index !== undefined ? index : Math.max(0, SOUND_TRACKS.findIndex((s) => s.id === sound.id));
  const c = sound.accentColor || sound.tintColor || '#8FC1DD';
  const f = sound.surfaceColor || '#17354A';
  const b = sound.bgColor || '#0F2433';

  const n = 5 + (i % 4);
  const cx = 30 + ((i * 13) % 40);
  const cy = 28 + ((i * 17) % 40);
  const gradId = `art-grad-${sound.id}-${i}`;

  const rings: React.ReactNode[] = [];
  for (let k = 1; k <= n; k++) {
    const r = k * (9 + (i % 3) * 2);
    const opacity = Math.max(0.08, 0.38 - k * 0.04);
    rings.push(
      <circle
        key={k}
        cx={cx}
        cy={cy}
        r={r}
        fill="none"
        stroke={c}
        strokeOpacity={opacity}
        strokeWidth="0.4"
      />
    );
  }

  return (
    <div className={`relative overflow-hidden ${className}`}>
      <svg
        viewBox="0 0 100 100"
        preserveAspectRatio="xMidYMid slice"
        className={`w-full h-full transition-transform duration-700 ${
          isSpinning ? 'animate-[spin_90s_linear_infinite]' : ''
        }`}
      >
        <defs>
          <radialGradient id={gradId} cx={`${cx}%`} cy={`${cy}%`} r="75%">
            <stop offset="0%" stopColor={c} stopOpacity="0.55" />
            <stop offset="55%" stopColor={f} />
            <stop offset="100%" stopColor={b} />
          </radialGradient>
        </defs>
        <rect width="100" height="100" fill={`url(#${gradId})`} />
        {rings}
        <circle cx={cx} cy={cy} r="3" fill={c} opacity="0.9" />
      </svg>
    </div>
  );
};
