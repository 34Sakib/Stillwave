export interface SoundscapeTheme {
  id: string;
  name: string;
  iconName: 'CloudRain' | 'Waves' | 'Trees' | 'Flame' | 'Wind' | 'Moon' | 'Sparkles';
  bgBase: string;
  bgSurface: string;
  bgElevated: string;
  bgHover: string;
  accent: string;
  accentHover: string;
  accentRgb: string; // for custom opacity: e.g. "114, 151, 184"
  glow: string;
  glowSecondary: string;
  borderSubtle: string;
  borderActive: string;
  textAccent: string;
}

export const SOUNDSCAPE_THEMES: Record<string, SoundscapeTheme> = {
  default: {
    id: 'default',
    name: 'Nordic Forest Sanctuary',
    iconName: 'Sparkles',
    bgBase: '#101816',
    bgSurface: '#202B28',
    bgElevated: '#283633',
    bgHover: '#33433F',
    accent: '#91AFA9',
    accentHover: '#B4CCC7',
    accentRgb: '145, 175, 169',
    glow: 'rgba(145, 175, 169, 0.16)',
    glowSecondary: 'rgba(40, 54, 51, 0.40)',
    borderSubtle: 'rgba(145, 175, 169, 0.14)',
    borderActive: 'rgba(145, 175, 169, 0.45)',
    textAccent: '#B4CCC7',
  },
  rain: {
    id: 'rain',
    name: 'Gentle Rain Mist',
    iconName: 'CloudRain',
    bgBase: '#0D141C',
    bgSurface: '#151E28',
    bgElevated: '#1D2836',
    bgHover: '#243242',
    accent: '#7297B8',
    accentHover: '#96B9D9',
    accentRgb: '114, 151, 184',
    glow: 'rgba(114, 151, 184, 0.20)',
    glowSecondary: 'rgba(30, 45, 66, 0.45)',
    borderSubtle: 'rgba(114, 151, 184, 0.16)',
    borderActive: 'rgba(114, 151, 184, 0.50)',
    textAccent: '#96B9D9',
  },
  ocean: {
    id: 'ocean',
    name: 'Deep Oceanic Swell',
    iconName: 'Waves',
    bgBase: '#09151C',
    bgSurface: '#10222B',
    bgElevated: '#172E3A',
    bgHover: '#1F3C4B',
    accent: '#4EB1C6',
    accentHover: '#78CEE0',
    accentRgb: '78, 177, 198',
    glow: 'rgba(78, 177, 198, 0.20)',
    glowSecondary: 'rgba(23, 50, 64, 0.45)',
    borderSubtle: 'rgba(78, 177, 198, 0.16)',
    borderActive: 'rgba(78, 177, 198, 0.50)',
    textAccent: '#78CEE0',
  },
  forest: {
    id: 'forest',
    name: 'Whispering Pine Forest',
    iconName: 'Trees',
    bgBase: '#0B1712',
    bgSurface: '#14241C',
    bgElevated: '#1D3227',
    bgHover: '#253E31',
    accent: '#6DBB8A',
    accentHover: '#91D4A9',
    accentRgb: '109, 187, 138',
    glow: 'rgba(109, 187, 138, 0.20)',
    glowSecondary: 'rgba(29, 50, 39, 0.45)',
    borderSubtle: 'rgba(109, 187, 138, 0.16)',
    borderActive: 'rgba(109, 187, 138, 0.50)',
    textAccent: '#91D4A9',
  },
  fireplace: {
    id: 'fireplace',
    name: 'Hearth Fireplace Embers',
    iconName: 'Flame',
    bgBase: '#18110D',
    bgSurface: '#261A13',
    bgElevated: '#35241B',
    bgHover: '#442F24',
    accent: '#E28D54',
    accentHover: '#F2A979',
    accentRgb: '226, 141, 84',
    glow: 'rgba(226, 141, 84, 0.20)',
    glowSecondary: 'rgba(53, 36, 27, 0.45)',
    borderSubtle: 'rgba(226, 141, 84, 0.18)',
    borderActive: 'rgba(226, 141, 84, 0.50)',
    textAccent: '#F2A979',
  },
  wind: {
    id: 'wind',
    name: 'Highland Mountain Breeze',
    iconName: 'Wind',
    bgBase: '#0E1616',
    bgSurface: '#182423',
    bgElevated: '#223230',
    bgHover: '#2C403E',
    accent: '#85BDB4',
    accentHover: '#A9D8CF',
    accentRgb: '133, 189, 180',
    glow: 'rgba(133, 189, 180, 0.18)',
    glowSecondary: 'rgba(34, 50, 48, 0.45)',
    borderSubtle: 'rgba(133, 189, 180, 0.16)',
    borderActive: 'rgba(133, 189, 180, 0.50)',
    textAccent: '#A9D8CF',
  },
  night: {
    id: 'night',
    name: 'Midnight Meadow Cosmos',
    iconName: 'Moon',
    bgBase: '#0A0D15',
    bgSurface: '#131924',
    bgElevated: '#1D2535',
    bgHover: '#263145',
    accent: '#8FA5D6',
    accentHover: '#B2C4EB',
    accentRgb: '143, 165, 214',
    glow: 'rgba(143, 165, 214, 0.20)',
    glowSecondary: 'rgba(29, 37, 53, 0.45)',
    borderSubtle: 'rgba(143, 165, 214, 0.16)',
    borderActive: 'rgba(143, 165, 214, 0.50)',
    textAccent: '#B2C4EB',
  },
};

export const getThemeForSoundId = (soundId?: string | null): SoundscapeTheme => {
  if (!soundId) return SOUNDSCAPE_THEMES.default;
  return SOUNDSCAPE_THEMES[soundId] || SOUNDSCAPE_THEMES.default;
};
