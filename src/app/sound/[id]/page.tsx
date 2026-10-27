import { SoundRedirect } from './sound-redirect';

const SOUND_IDS = [
  'rain', 'ocean', 'forest', 'fire', 'breeze', 'meadow', 'bowls', 'stream',
  'brown', 'thunder', 'snow', 'lake', 'cocoon', 'chimes', 'musicbox', 'drizzle',
  'cloud', 'haze', 'om', 'tide', 'endurance', 'gargantua', 'orbit', 'choir',
  'shire', 'cascade', 'dune', 'biolum', 'neon', 'cafe', 'lofi', 'train',
  'piano', 'strings', 'harp', 'cello', 'whale', 'aurora', 'cabin', 'clock',
  'universe', 'frost', 'mist', 'glacier', 'bamboo', 'moonbeam', 'cloudbed',
  'tidepool', 'wisp', 'lantern', 'deepblue', 'yt_rain'
];

export function generateStaticParams() {
  return SOUND_IDS.map((id) => ({ id }));
}

export default async function SoundPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <SoundRedirect id={id} />;
}
