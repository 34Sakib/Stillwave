'use client';

import React from 'react';
import { Feather } from 'lucide-react';

export const EditorialSilence: React.FC = () => {
  return (
    <section id="beauty-of-silence" className="py-32 px-5 sm:px-8 max-w-5xl mx-auto">
      <div className="relative text-center space-y-12">
        {/* Subtle decorative acoustic sound wave line */}
        <div className="flex items-center justify-center gap-1.5 opacity-60">
          <div className="w-1.5 h-1.5 rounded-full bg-[#91AFA9]" />
          <div className="w-8 h-[1px] bg-gradient-to-r from-transparent to-[#91AFA9]" />
          <div className="w-16 h-[1.5px] bg-[#91AFA9]" />
          <div className="w-8 h-[1px] bg-gradient-to-l from-transparent to-[#91AFA9]" />
          <div className="w-1.5 h-1.5 rounded-full bg-[#91AFA9]" />
        </div>

        {/* Section Tag */}
        <div>
          <span className="text-xs uppercase font-mono tracking-widest text-[#91AFA9]">
            06 · Mindful Stillness
          </span>
          <h2 className="text-3xl sm:text-5xl font-light tracking-tight text-[#F1F3EF] mt-3 font-heading leading-tight">
            The Architecture of Silence
          </h2>
        </div>

        {/* Editorial Text Reveal with Generous Whitespace */}
        <div className="max-w-2xl mx-auto space-y-8 text-base sm:text-lg text-[#B3BDB6] font-light leading-relaxed">
          <p>
            Silence in the modern world is rarely absolute. It is not the sterile void of an anechoic chamber, but the absence of cognitive friction — the gentle hush that allows your nervous system to exhale.
          </p>

          <blockquote className="my-10 py-6 px-8 rounded-2xl bg-[#202B28]/40 border-l-2 border-[#91AFA9] text-[#F1F3EF] italic font-serif text-xl sm:text-2xl leading-relaxed text-left">
            “When sound reflects the organic rhythm of the earth, the mind ceases guarding against noise and naturally returns to its center.”
          </blockquote>

          <p>
            Stillwave was built on a foundational discipline: sound is the primary product. Visuals exist solely to shelter your gaze, and motion never demands your attention. In an era that constantly competes for your focus, here is permission to simply listen.
          </p>
        </div>

        {/* Delicate Acoustic Wave Graphic */}
        <div className="pt-8 flex items-center justify-center gap-2 text-[#7E8D86]">
          <Feather className="w-4 h-4 text-[#91AFA9]" />
          <span className="text-xs font-mono tracking-widest uppercase">
            Restrained · Organic · Restorative
          </span>
        </div>
      </div>
    </section>
  );
};
