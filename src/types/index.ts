export type SoundCategory = 'rain' | 'ocean' | 'forest' | 'fireplace' | 'wind' | 'night' | 'village';

export type PlaybackStatus = 'idle' | 'loading' | 'playing' | 'paused' | 'stopped' | 'switching' | 'error';

export interface SoundTrack {
  id: string;
  title: string;
  category: SoundCategory;
  subtitle: string;
  description: string;
  moodTags: string[];
  audioSrc: string;
  artwork: string;
  tintColor: string; // e.g., for local accents
  defaultVolume: number;
}

export interface ActiveLayer {
  soundId: string;
  volume: number; // 0.0 to 1.0
  isMuted: boolean;
  isPlaying: boolean;
}

export interface AtmospherePreset {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  intention: 'Focus' | 'Sleep' | 'Relax' | 'Read' | 'Meditate';
  iconName: string;
  badge: string;
  layers: {
    soundId: string;
    volume: number;
  }[];
  sleepTimerMinutes?: number;
}

export interface CustomMix {
  id: string;
  name: string;
  createdAt: number;
  layers: {
    soundId: string;
    volume: number;
  }[];
}

export interface SleepTimerState {
  durationMinutes: number;
  remainingSeconds: number;
  isRunning: boolean;
}
