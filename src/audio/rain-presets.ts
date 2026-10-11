import { RainPreset } from '@/types/rain';

export const RAIN_PRESETS: RainPreset[] = [
  {
    id: 'calm-window-patter',
    name: 'Calm Window Patter',
    description: 'Soft, immersive rainfall against glass panes. Warm, soothing, and perfectly balanced for sleep.',
    parameters: {
      volume: 0.8,
      intensity: 0.55,
      dropDensity: 0.45,
      splashDensity: 0.3,
      stereoWidth: 0.65,
    },
    iconName: 'CloudRain',
  },
  {
    id: 'gentle-canopy-shower',
    name: 'Gentle Canopy Shower',
    description: 'Rain cascading through lush forest leaves with soft droplet articulation.',
    parameters: {
      volume: 0.75,
      intensity: 0.65,
      dropDensity: 0.6,
      splashDensity: 0.45,
      stereoWidth: 0.8,
    },
    iconName: 'Trees',
  },
  {
    id: 'steady-downpour',
    name: 'Steady Downpour',
    description: 'Continuous, enveloping rain bed providing maximum sound masking for deep focus.',
    parameters: {
      volume: 0.85,
      intensity: 0.8,
      dropDensity: 0.75,
      splashDensity: 0.55,
      stereoWidth: 0.9,
    },
    iconName: 'CloudDrizzle',
  },
  {
    id: 'distant-night-drizzle',
    name: 'Distant Night Drizzle',
    description: 'Quiet, muffled precipitation in the deep night. Deeply grounding and low-frequency.',
    parameters: {
      volume: 0.7,
      intensity: 0.35,
      dropDensity: 0.25,
      splashDensity: 0.15,
      stereoWidth: 0.5,
    },
    iconName: 'Moon',
  },
  {
    id: 'cozy-reading-rain',
    name: 'Cozy Reading Rain',
    description: 'Delicate rooftop rainfall with nuanced patter that accompanies quiet contemplation.',
    parameters: {
      volume: 0.75,
      intensity: 0.5,
      dropDensity: 0.5,
      splashDensity: 0.35,
      stereoWidth: 0.7,
    },
    iconName: 'BookOpen',
  },
];

export const DEFAULT_RAIN_PARAMETERS = RAIN_PRESETS[0].parameters;
