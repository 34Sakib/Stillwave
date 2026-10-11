import { SoundTrack } from '@/types';

export const SOUND_TRACKS: SoundTrack[] = [
  {
    id: 'rain',
    title: 'Gentle Rain',
    subtitle: 'Soft precipitation & window resonance',
    category: 'rain',
    description: 'Rhythmic, gentle rainfall descending upon quiet cedar rooftops and mossy stone paths. Naturally calms wandering thoughts.',
    moodTags: ['Focus', 'Reading', 'Rain'],
    audioSrc: '/audio/rain/gentle-rain.wav',
    artwork: '/images/soundscapes/rain.jpg',
    tintColor: '#303E52', // Rain Blue
    defaultVolume: 0.75,
  },
  {
    id: 'ocean',
    title: 'Deep Ocean Swell',
    subtitle: 'Rolling tide & shore wash',
    category: 'ocean',
    description: 'Slow rhythmic pulse of tidal currents rolling against a remote Nordic coastline. Ebb and flow cadence synced for decompression.',
    moodTags: ['Sleep', 'Decompress', 'Calm'],
    audioSrc: '/audio/ocean/soft-waves.wav',
    artwork: '/images/soundscapes/ocean.jpg',
    tintColor: '#284654',
    defaultVolume: 0.70,
  },
  {
    id: 'forest',
    title: 'Whispering Forest',
    subtitle: 'Pine canopy, birdsong & stream',
    category: 'forest',
    description: 'Sunlight filtering through ancient pine groves with gentle distant mountain runoff and quiet woodland sparrow calls.',
    moodTags: ['Focus', 'Flow', 'Nature'],
    audioSrc: '/audio/forest/forest-ambience.wav',
    artwork: '/images/soundscapes/forest.jpg',
    tintColor: '#2C4033', // Deep Moss
    defaultVolume: 0.65,
  },
  {
    id: 'fireplace',
    title: 'Hearth Fireplace',
    subtitle: 'Aromatic wood crackle & gentle embers',
    category: 'fireplace',
    description: 'A glowing stone hearth burning birch and hickory. Gentle pops, soft resin crackles, and grounding warmth.',
    moodTags: ['Cozy', 'Evening', 'Comfort'],
    audioSrc: '/audio/fireplace/soft-crackling.wav',
    artwork: '/images/soundscapes/fireplace.jpg',
    tintColor: '#4A3326', // Earth Sand
    defaultVolume: 0.60,
  },
  {
    id: 'wind',
    title: 'Highland Breeze',
    subtitle: 'Mountain gust & swaying grasses',
    category: 'wind',
    description: 'Clean high-altitude air moving gently across misty mountain meadows and ridge pines. Expansive, uncluttered soundscape.',
    moodTags: ['Meditate', 'Breathe', 'Clarity'],
    audioSrc: '/audio/wind/gentle-breeze.wav',
    artwork: '/images/soundscapes/wind.jpg',
    tintColor: '#354341',
    defaultVolume: 0.55,
  },
  {
    id: 'night',
    title: 'Midnight Meadow',
    subtitle: 'Cicadas, night insects & stillness',
    category: 'night',
    description: 'Warm nocturnal air buzzing softly with peaceful summer crickets and distant tranquil resonance under starry skies.',
    moodTags: ['Sleep', 'Rest', 'Midnight'],
    audioSrc: '/audio/night/night-insects.wav',
    artwork: '/images/soundscapes/night.jpg',
    tintColor: '#1A2129',
    defaultVolume: 0.60,
  },
];

export const getSoundById = (id: string): SoundTrack | undefined => {
  return SOUND_TRACKS.find((s) => s.id === id);
};
