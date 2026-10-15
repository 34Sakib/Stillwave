'use client';

import React from 'react';
import { Feather } from 'lucide-react';

export const EditorialSilence: React.FC = () => {
  return (
    <section id="beauty-of-silence" className="py-20 sm:py-32 px-4 sm:px-8 max-w-5xl mx-auto">
      <div className="relative text-center space-y-10 sm:space-y-12">
        {/* Subtle decorative acoustic sound wave line */}
        <div className="flex items-center justify-center gap-1.5 opacity-60">
          <div className="w-1.5 h-1.5 rounded-full bg-[var(--theme-accent,#91AFA9)] transition-colors duration-1000" />
          <div className="w-8 h-[1px] bg-gradient-to-r from-transparent to-[var(--theme-accent,#91AFA9)] transition-colors duration-1000" />
          <div className="w-16 h-[1.5px] bg-[var(--theme-accent,#91AFA9)] transition-colors duration-1000" />
          <div className="w-8 h-[1px] bg-gradient-to-l from-transparent to-[var(--theme-accent,#91AFA9)] transition-colors duration-1000" />
          <div className="w-1.5 h-1.5 rounded-full bg-[var(--theme-accent,#91AFA9)] transition-colors duration-1000" />
        </div>

        {/* Section Tag */}
        <div>
          <div className="text-xs uppercase font-mono tracking-widest text-[var(--theme-accent,#91AFA9)] inline-flex items-center gap-3 transition-colors duration-1000">
            <span className="w-6 h-[1px] bg-current opacity-70" />
            <span>05 / Mindful Stillness</span>
          </div>
          <h2 className="text-2xl sm:text-4xl md:text-5xl font-light tracking-tight text-[#F1F3EF] mt-3 font-heading leading-tight px-2">
            The Architecture of Silence
          </h2>
        </div>

        {/* Editorial Text Reveal with Generous Whitespace */}
        <div className="max-w-2xl mx-auto space-y-6 sm:space-y-8 text-sm sm:text-lg text-[#B3BDB6] font-light leading-relaxed px-2">
          <p>
            Silence in the modern world is rarely absolute. It is not the sterile void of an anechoic chamber, but the absence of cognitive friction — the gentle hush that allows your nervous system to exhale.
          </p>

          <blockquote className="my-8 sm:my-10 py-5 px-5 sm:py-6 sm:px-8 rounded-2xl bg-[var(--theme-surface,#202B28)]/50 border-l-2 border-[var(--theme-accent,#91AFA9)] text-[#F1F3EF] italic font-serif text-lg sm:text-2xl leading-relaxed text-left transition-colors duration-1000">
            “When sound reflects the organic rhythm of the earth, the mind ceases guarding against noise and naturally returns to its center.”
          </blockquote>

          <p>
            Stillwave was built on a foundational discipline: sound is the primary product. Visuals exist solely to shelter your gaze, and motion never demands your attention. In an era that constantly competes for your focus, here is permission to simply listen.
          </p>
        </div>

        {/* Delicate Acoustic Wave Graphic */}
        <div className="pt-8 flex items-center justify-center gap-2 text-[#7E8D86]">
          <Feather className="w-4 h-4 text-[var(--theme-accent,#91AFA9)] transition-colors duration-1000" />
          <span className="text-xs font-mono tracking-widest uppercase">
            Restrained · Organic · Restorative
          </span>
        </div>
      </div>
    </section>
  );
};
