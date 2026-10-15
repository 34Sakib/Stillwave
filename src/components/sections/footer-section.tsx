'use client';

import React, { useState } from 'react';
import { Play, Pause, Terminal, ArrowUp } from 'lucide-react';
import { SOUND_TRACKS } from '@/data/sounds';
import { usePlayerStore } from '@/stores/player-store';
import { KeyboardShortcutsModal } from '@/components/ui/keyboard-shortcuts-modal';

export const FooterSection: React.FC = () => {
  const [shortcutsOpen, setShortcutsOpen] = useState(false);
  const { playSingleSound, playbackStatus, togglePlayPause } = usePlayerStore();
  const isPlaying = playbackStatus === 'playing';

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer id="about" className="relative mt-20 border-t border-[var(--theme-border-subtle,rgba(145,175,169,0.15))] bg-[var(--theme-bg,#101816)] text-[#F1F3EF] transition-colors duration-1000">
      {/* Closing CTA Banner */}
      <div className="py-14 sm:py-20 px-4 sm:px-8 max-w-5xl mx-auto text-center space-y-5 sm:space-y-6">
        <div className="text-xs uppercase font-mono tracking-widest text-[var(--theme-accent,#91AFA9)] inline-flex items-center gap-3 transition-colors duration-1000">
          <span className="w-6 h-[1px] bg-current opacity-70" />
          <span>06 · Quiet Conclusion</span>
        </div>
        <h2 className="text-2xl sm:text-4xl md:text-5xl font-light tracking-tight text-[#F1F3EF] font-heading px-2">
          Take a moment for yourself.
        </h2>
        <p className="text-xs sm:text-base text-[#B3BDB6] max-w-xl mx-auto leading-relaxed px-4">
          Allow the noise of the day to dissipate. Return here whenever you seek stillness, focus, or restorative sleep.
        </p>

        <div className="pt-4 flex items-center justify-center gap-4">
          <button
            type="button"
            onClick={togglePlayPause}
            className="px-6 py-3 rounded-xl bg-[var(--theme-accent,#91AFA9)] text-[#101816] font-medium text-xs hover:bg-[var(--theme-accent-hover,#B4CCC7)] transition-all shadow-lg flex items-center gap-2 cursor-pointer"
          >
            {isPlaying ? (
              <>
                <Pause className="w-3.5 h-3.5 fill-current" />
                <span>Pause Audio</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                <span>Resume Sanctuary</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={scrollToTop}
            className="px-5 py-3 rounded-xl bg-[var(--theme-surface,#202B28)] border border-[var(--theme-border-subtle,rgba(145,175,169,0.2))] text-[#B3BDB6] hover:text-[#F1F3EF] text-xs transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <ArrowUp className="w-3.5 h-3.5" />
            <span>Top</span>
          </button>
        </div>
      </div>

      {/* Directory & Metadata Columns */}
      <div className="py-14 border-t border-[var(--theme-border-subtle,rgba(145,175,169,0.1))] px-5 sm:px-8 max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10 text-xs">
        {/* Brand statement */}
        <div className="space-y-3 md:col-span-1">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[var(--theme-accent,#91AFA9)] transition-colors duration-1000" />
            <span className="text-sm font-medium tracking-[0.2em] font-heading uppercase text-[#F1F3EF]">
              Stillwave
            </span>
          </div>
          <p className="text-[#B3BDB6] leading-relaxed">
            A serene, nature-inspired ambient audio sanctuary for focus, reading, meditation, and restorative rest.
          </p>
          <div className="pt-2 text-[11px] font-mono text-[#7E8D86]">
            Zero trackers · 100% Client-side
          </div>
        </div>

        {/* Sound Library directory */}
        <div className="space-y-3">
          <h4 className="font-mono uppercase tracking-wider text-[var(--theme-accent,#91AFA9)] text-[11px] transition-colors duration-1000">
            Sound Library
          </h4>
          <ul className="space-y-2 text-[#B3BDB6]">
            {SOUND_TRACKS.map((snd) => (
              <li key={snd.id}>
                <button
                  type="button"
                  onClick={() => playSingleSound(snd)}
                  className="hover:text-[#F1F3EF] transition-colors text-left cursor-pointer"
                >
                  {snd.title} <span className="text-[#7E8D86]">({snd.category})</span>
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Experiences & Navigation */}
        <div className="space-y-3">
          <h4 className="font-mono uppercase tracking-wider text-[var(--theme-accent,#91AFA9)] text-[11px] transition-colors duration-1000">
            Sanctuary Areas
          </h4>
          <ul className="space-y-2 text-[#B3BDB6]">
            <li>
              <a href="#soundscapes" className="hover:text-[#F1F3EF] transition-colors">
                Soundscapes
              </a>
            </li>
            <li>
              <a href="#intentions" className="hover:text-[#F1F3EF] transition-colors">
                Intentions
              </a>
            </li>
            <li>
              <a href="#ritual" className="hover:text-[#F1F3EF] transition-colors">
                Rituals
              </a>
            </li>
            <li>
              <a href="#atmosphere-mixer" className="hover:text-[#F1F3EF] transition-colors">
                Acoustic Console Faders
              </a>
            </li>
          </ul>
        </div>

        {/* Accessibility & Shortcuts */}
        <div className="space-y-3">
          <h4 className="font-mono uppercase tracking-wider text-[#91AFA9] text-[11px]">
            Accessibility & Engine
          </h4>
          <ul className="space-y-2 text-[#B3BDB6]">
            <li>
              <button
                onClick={() => setShortcutsOpen(true)}
                className="hover:text-[#F1F3EF] transition-colors text-left flex items-center gap-1.5"
              >
                <Terminal className="w-3.5 h-3.5 text-[#91AFA9]" />
                <span>Keyboard Shortcuts</span>
              </button>
            </li>
            <li className="text-[#B3BDB6]">
              Audio Engine: Web Audio API & HTML5 Media
            </li>
            <li className="text-[#B3BDB6]">
              Motion: Reduced-Motion Ready
            </li>
            <li className="text-[#B3BDB6]">
              Storage: Localized Browser Storage
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom Legal bar */}
      <div className="py-6 border-t border-[#91AFA9]/10 px-5 sm:px-8 max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between text-[11px] text-[#7E8D86] gap-3">
        <div>
          © 2026 Stillwave. Dedicated to peaceful listening and mental clarity.
        </div>
        <div className="flex items-center gap-4">
          <span className="hover:text-[#B3BDB6]">Licensed Natural Audio</span>
          <span>•</span>
          <span className="hover:text-[#B3BDB6]">Offline-Ready Web Audio</span>
        </div>
      </div>

      <KeyboardShortcutsModal isOpen={shortcutsOpen} onClose={() => setShortcutsOpen(false)} />
    </footer>
  );
};
