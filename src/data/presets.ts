import { AtmospherePreset } from '@/types';

export const INTENTION_PRESETS: AtmospherePreset[] = [
  {
    id: 'deep-focus',
    title: 'Deep Focus',
    subtitle: 'Flow state sanctuary',
    description: 'An acoustic balance of sunlit pine grove and gentle cedar rain that shields against distractions and invites uninterrupted creative flow.',
    intention: 'Focus',
    iconName: 'Brain',
    badge: 'Productivity',
    layers: [
      { soundId: 'forest', volume: 0.70 },
      { soundId: 'rain', volume: 0.45 },
    ],
  },
  {
    id: 'better-sleep',
    title: 'Better Sleep',
    subtitle: 'Nocturnal drift with auto-timer',
    description: 'Hypnotic rolling ocean waves interlaced with warm meadow crickets. Softens racing thoughts and gently ushers deep sleep.',
    intention: 'Sleep',
    iconName: 'Moon',
    badge: '45m Sleep Timer',
    sleepTimerMinutes: 45,
    layers: [
      { soundId: 'ocean', volume: 0.65 },
      { soundId: 'night', volume: 0.50 },
    ],
  },
  {
    id: 'stress-relief',
    title: 'Stress Relief',
    subtitle: 'Nervous system decompression',
    description: 'Slow rhythmic tidal surf blended with a gentle mountain breeze, tuned to restore autonomic balance and calm rapid breathing.',
    intention: 'Relax',
    iconName: 'HeartPulse',
    badge: 'Recovery',
    layers: [
      { soundId: 'ocean', volume: 0.70 },
      { soundId: 'wind', volume: 0.35 },
    ],
  },
  {
    id: 'reading-time',
    title: 'Reading Time',
    subtitle: 'Warm parchment & fireside stillness',
    description: 'Soft rhythmic rain against glass paired with gentle glowing ember crackles. Creates the intimate atmosphere of a secluded timber library.',
    intention: 'Read',
    iconName: 'BookOpen',
    badge: 'Immersion',
    layers: [
      { soundId: 'fireplace', volume: 0.65 },
      { soundId: 'rain', volume: 0.55 },
    ],
  },
  {
    id: 'mindful-meditation',
    title: 'Mindful Meditation',
    subtitle: 'Spacious alpine awareness',
    description: 'Expansive highland air moving through high altitude grasses, anchoring your breath in stillness and panoramic awareness.',
    intention: 'Meditate',
    iconName: 'Compass',
    badge: 'Presence',
    layers: [
      { soundId: 'wind', volume: 0.60 },
      { soundId: 'forest', volume: 0.40 },
    ],
  },
  {
    id: 'alpine-wind',
    title: 'Highland Wind',
    subtitle: 'Pure expansive mountain air',
    description: 'Crisp, panoramic mountain gusts sweeping over highland ridges. Clears mental fog and inspires expansive clarity.',
    intention: 'Meditate',
    iconName: 'Wind',
    badge: 'Clarity',
    layers: [
      { soundId: 'wind', volume: 0.80 },
    ],
  },
];
