import React from 'react';
import { Navbar } from '@/components/navigation/navbar';
import { HeroSection } from '@/components/hero/hero-section';
import { SoundscapeCarousel } from '@/components/sound-library/soundscape-carousel';
import { CircadianSection } from '@/components/sections/circadian-section';
import { ListeningRoom } from '@/components/audio-player/listening-room';
import { SoundMixer } from '@/components/sound-mixer/sound-mixer';
import { IntentionsSection } from '@/components/sections/intentions-section';
import { EditorialSilence } from '@/components/sections/editorial-silence';
import { RitualSection } from '@/components/sections/ritual-section';
import { FooterSection } from '@/components/sections/footer-section';
import { MiniPlayer } from '@/components/audio-player/mini-player';
import { RainPlayer } from '@/components/audio-player/rain-player';
import { NowPlayingDrawer } from '@/components/audio-player/now-playing-drawer';
import { ShareModal } from '@/components/ui/share-modal';

export default function HomePage() {
  return (
    <main className="relative min-h-screen bg-transparent text-[var(--theme-text-primary,#F1F3EF)] flex flex-col pb-36 sm:pb-32 transition-colors duration-1000">
      {/* Global Minimalist Navigation */}
      <Navbar />

      {/* 01 · Immersive Hero */}
      <HeroSection />

      {/* 02 · Soundscape Carousel */}
      <SoundscapeCarousel />

      {/* 03 · Circadian Rhythm (Tuned to Your Day) */}
      <CircadianSection />

      {/* 04 · Listening Room */}
      <ListeningRoom />

      {/* 04 · Build Your Atmosphere (Multi-track Mixer) */}
      <SoundMixer />

      {/* 05 · Choose Your Intention (Curated Experiences) */}
      <IntentionsSection />

      {/* 06 · The Beauty of Silence (Editorial Storytelling) */}
      <EditorialSilence />

      {/* 07 · Create a Ritual (Habits & Presets) */}
      <RitualSection />

      {/* 08 · Closing Invitation & Directory Footer */}
      <FooterSection />

      {/* Persistent Mini-Player Bottom Dock */}
      <MiniPlayer />

      {/* Right-Side Now Playing Sliding Drawer ("Hidebar") & Vertical Edge Tab */}
      <NowPlayingDrawer />

      {/* Procedural Rain Sound Customizer Modal */}
      <RainPlayer />

      {/* Global Share Modal Sheet */}
      <ShareModal />
    </main>
  );
}
