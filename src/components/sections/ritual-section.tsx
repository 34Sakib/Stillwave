'use client';

import React, { useState } from 'react';
import {
  Moon,
  Heart,
  RotateCcw,
  Sliders,
} from 'lucide-react';
import { SleepTimerModal } from '@/components/ui/sleep-timer-modal';
import { usePlayerStore } from '@/stores/player-store';

export const RitualSection: React.FC = () => {
  const [timerModalOpen, setTimerModalOpen] = useState(false);
  const { favorites, customMixes } = usePlayerStore();

  const ritualSteps = [
    {
      icon: <Moon className="w-5 h-5 text-[var(--theme-accent,#91AFA9)]" />,
      title: 'Sleep Timer & Fade-Out',
      description:
        'Set a 15, 30, 45, or 60-minute duration. In the final 30 seconds, volume lowers exponentially so you never wake up to an abrupt silence.',
      actionText: 'Configure Timer',
      onAction: () => setTimerModalOpen(true),
    },
    {
      icon: <Heart className="w-5 h-5 text-[var(--theme-accent,#91AFA9)]" />,
      title: 'Starred Favorites',
      description:
        `Star any ambience card to bookmark your most effective sanctuaries. Stored safely in your browser across sessions. (${favorites.length} saved)`,
      actionText: 'View Sounds',
      href: '#soundscapes',
    },
    {
      icon: <RotateCcw className="w-5 h-5 text-[var(--theme-accent,#91AFA9)]" />,
      title: 'Session Recall & State',
      description:
        'Stillwave automatically remembers your volume sliders, favorite frequencies, and active preset whenever you return. No login required.',
      actionText: 'Explore Console',
      href: '#atmosphere-mixer',
    },
    {
      icon: <Sliders className="w-5 h-5 text-[var(--theme-accent,#91AFA9)]" />,
      title: 'Acoustic Precision Faders',
      description:
        'Fine-tune frequencies for your exact environment. Tactile faders let you balance individual track volumes for deep focus or restful sleep.',
      actionText: 'Open Console',
      href: '#atmosphere-mixer',
    },
  ];

  return (
    <section id="ritual" className="py-20 sm:py-24 px-4 sm:px-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-10 sm:mb-14">
        <span className="text-xs uppercase font-mono tracking-widest text-[var(--theme-accent,#91AFA9)] block mb-2 transition-colors duration-1000">
          07 · Daily Habits
        </span>
        <h2 className="text-2xl sm:text-4xl font-light tracking-tight text-[#F1F3EF] font-heading">
          Create Your Daily Ritual
        </h2>
        <p className="text-xs sm:text-sm text-[#B3BDB6] max-w-xl mt-2 leading-relaxed">
          How to weave acoustic sanctuaries into your morning flow, deep work sprints, and evening wind-down.
        </p>
      </div>

      {/* Grid of ritual pillars */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        {ritualSteps.map((step, idx) => (
          <div
            key={idx}
            className="p-6 sm:p-8 rounded-2xl sm:rounded-3xl bg-[var(--theme-surface,#202B28)]/70 border border-[var(--theme-border-subtle,rgba(145,175,169,0.15))] hover:border-[var(--theme-border-active,rgba(145,175,169,0.4))] transition-all duration-500 flex flex-col justify-between group shadow-lg"
          >
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 rounded-2xl bg-[var(--theme-bg,#101816)] border border-[var(--theme-border-subtle,rgba(145,175,169,0.25))] group-hover:scale-110 transition-transform">
                  {step.icon}
                </div>
                <h3 className="text-lg font-medium text-[#F1F3EF] tracking-wide">
                  {step.title}
                </h3>
              </div>

              <p className="text-xs sm:text-sm text-[#B3BDB6] leading-relaxed">
                {step.description}
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-[var(--theme-border-subtle,rgba(145,175,169,0.1))] flex items-center justify-between">
              <span className="text-[11px] font-mono text-[#7E8D86]">
                Feature 0{idx + 1}
              </span>

              {step.onAction ? (
                <button
                  type="button"
                  onClick={step.onAction}
                  className="text-xs font-medium text-[var(--theme-accent,#91AFA9)] hover:text-[#F1F3EF] transition-colors cursor-pointer"
                >
                  {step.actionText} →
                </button>
              ) : (
                <a
                  href={step.href}
                  className="text-xs font-medium text-[var(--theme-accent,#91AFA9)] hover:text-[#F1F3EF] transition-colors"
                >
                  {step.actionText} →
                </a>
              )}
            </div>
          </div>
        ))}
      </div>

      <SleepTimerModal isOpen={timerModalOpen} onClose={() => setTimerModalOpen(false)} />
    </section>
  );
};
