import { SoundTrack } from '@/types';

export const SOUND_TRACKS: SoundTrack[] = [
  {
    id: 'rain',
    title: 'Gentle Rain',
    subtitle: 'Soft precipitation & window resonance',
    category: 'rain',
    description: 'Rhythmic, gentle rainfall descending upon quiet cedar rooftops and mossy stone paths. Naturally calms wandering thoughts.',
    moodTags: ['Focus', 'Reading', 'Rain'],
    audioSrc: '/audio/rain/gentle_rain.mp3',
    artwork: '/images/soundscapes/rain.jpg',
    tintColor: '#303E52', // Rain Blue
    defaultVolume: 0.75,
  },
  {
    id: 'ocean',
    title: 'Deep Ocean Swell',
    subtitle: 'Continuous rolling waves & deep surf',
    category: 'ocean',
    description: 'Continuous, non-stop deep ocean swells with rhythmic rolling waves, gentle foamy crests, and an uninterrupted deep-water undercurrent.',
    moodTags: ['Sleep', 'Decompress', 'Calm'],
    audioSrc: '/audio/ocean/ocean-waves.mp3',
    artwork: '/images/soundscapes/ocean.jpg',
    tintColor: '#284654',
    defaultVolume: 0.75,
  },
  {
    id: 'forest',
    title: 'Whispering Forest',
    subtitle: 'Pine canopy, mountain creek & woodpecker',
    category: 'forest',
    description: 'Deep alpine pine forest with an active bubbling mountain creek, rhythmic woodpecker drumming, and ethereal wood thrush flutes.',
    moodTags: ['Focus', 'Wilderness', 'Stream'],
    audioSrc: '/audio/forest/nature-forest-sound.mp3',
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
    audioSrc: '/audio/fireplace/hearth-fireplace.mp3',
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
