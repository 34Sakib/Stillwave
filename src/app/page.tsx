import React from 'react';
import { Navbar } from '@/components/navigation/navbar';
import { HeroSection } from '@/components/hero/hero-section';
import { SoundscapeCarousel } from '@/components/sound-library/soundscape-carousel';
import { ListeningRoom } from '@/components/audio-player/listening-room';
import { SoundMixer } from '@/components/sound-mixer/sound-mixer';
import { IntentionsSection } from '@/components/sections/intentions-section';
import { EditorialSilence } from '@/components/sections/editorial-silence';
import { RitualSection } from '@/components/sections/ritual-section';
import { FooterSection } from '@/components/sections/footer-section';
import { MiniPlayer } from '@/components/audio-player/mini-player';

export default function HomePage() {
  return (
    <main className="relative min-h-screen bg-[#101816] text-[#F1F3EF] flex flex-col pb-28 selection:bg-[#91AFA9]/30">
      {/* Global Minimalist Navigation */}
      <Navbar />

      {/* 01 · Immersive Hero */}
      <HeroSection />

      {/* 02 · Soundscape Carousel */}
      <SoundscapeCarousel />

      {/* 03 · Listening Room */}
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

      {/* Persistent Mini-Player Dock */}
      <MiniPlayer />
    </main>
  );
}
