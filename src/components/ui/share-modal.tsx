'use client';

import React, { useState } from 'react';
import { X, Copy, Check, MessageCircle, Send, Mail, Share2 } from 'lucide-react';
import { usePlayerStore } from '@/stores/player-store';
import { getSoundById } from '@/data/sounds';

const XIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

export const ShareModal: React.FC = () => {
  const { isShareModalOpen, shareSoundId, closeShareModal } = usePlayerStore();
  const [copied, setCopied] = useState(false);

  if (!isShareModalOpen) return null;

  const sound = getSoundById(shareSoundId || 'rain');
  const soundTitle = sound ? sound.title : 'Stillwave Soundscape';
  const soundSubtitle = sound ? sound.subtitle : 'A sanctuary of ambient calm.';

  const url = typeof window !== 'undefined' ? `${window.location.origin}/#${sound?.id || ''}` : 'https://stillwave-sound.vercel.app';
  const shareText = `Listen to ${soundTitle} on STILLWAVE. ${soundSubtitle}`;

  const encodedUrl = encodeURIComponent(url);
  const encodedText = encodeURIComponent(shareText);

  const shareOptions = [
    {
      name: 'WhatsApp',
      icon: MessageCircle,
      href: `https://wa.me/?text=${encodedText}%20${encodedUrl}`,
      color: 'hover:text-emerald-400 hover:border-emerald-500/40',
    },
    {
      name: 'Telegram',
      icon: Send,
      href: `https://t.me/share/url?url=${encodedUrl}&text=${encodedText}`,
      color: 'hover:text-sky-400 hover:border-sky-500/40',
    },
    {
      name: 'X (Twitter)',
      icon: XIcon,
      href: `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`,
      color: 'hover:text-neutral-200 hover:border-neutral-400/40',
    },
    {
      name: 'Email',
      icon: Mail,
      href: `mailto:?subject=${encodeURIComponent(`STILLWAVE · ${soundTitle}`)}&body=${encodeURIComponent(`${shareText}\n\n${url}`)}`,
      color: 'hover:text-amber-300 hover:border-amber-400/40',
    },
  ];

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch {
      // Fallback
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    }
  };

  return (
    <div
      onClick={closeShareModal}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fade-in cursor-pointer"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-sm rounded-3xl bg-[var(--theme-surface,#182420)] border border-[var(--theme-border,#91AFA9)]/30 p-6 shadow-2xl text-[var(--theme-text-primary,#F1F3EF)] relative cursor-default transition-colors duration-700"
        role="dialog"
        aria-modal="true"
        aria-labelledby="share-modal-title"
      >
        <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
          <div className="flex items-center gap-2">
            <Share2 className="w-4 h-4 text-[var(--theme-accent,#91AFA9)]" />
            <h3 id="share-modal-title" className="text-xs uppercase tracking-widest font-mono text-[var(--theme-accent,#91AFA9)] font-medium">
              Share This Sound
            </h3>
          </div>
          <button
            type="button"
            onClick={closeShareModal}
            className="p-1 rounded-lg text-[#B3BDB6] hover:text-[#F1F3EF] hover:bg-white/5 transition-colors"
            aria-label="Close share dialog"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="mb-5">
          <h4 className="text-2xl font-light font-heading tracking-tight text-[var(--theme-text-primary,#F1F3EF)]">
            {soundTitle}
          </h4>
          <p className="text-xs text-[var(--theme-text-secondary,#B3BDB6)] mt-1 line-clamp-2">
            {soundSubtitle}
          </p>
        </div>

        {/* Share links */}
        <div className="space-y-2 mb-4">
          {shareOptions.map((opt) => (
            <a
              key={opt.name}
              href={opt.href}
              target="_blank"
              rel="noopener noreferrer"
              className={`flex items-center gap-3 w-full p-2.5 rounded-xl bg-[var(--theme-elevated,#121C1A)] border border-[var(--theme-border-subtle,rgba(145,175,169,0.2))] text-xs font-medium text-[var(--theme-text-primary,#F1F3EF)] transition-all ${opt.color}`}
            >
              <opt.icon className="w-4 h-4" />
              <span>Share via {opt.name}</span>
            </a>
          ))}
        </div>

        {/* Copy Link Button */}
        <button
          type="button"
          onClick={handleCopy}
          className={`w-full py-2.5 px-4 rounded-xl border text-xs font-medium transition-all flex items-center justify-center gap-2 cursor-pointer ${
            copied
              ? 'bg-emerald-950/60 border-emerald-500/50 text-emerald-300'
              : 'bg-[var(--theme-accent,#91AFA9)] text-[var(--theme-bg,#101816)] border-[var(--theme-accent,#91AFA9)] hover:brightness-110 shadow-md'
          }`}
        >
          {copied ? (
            <>
              <Check className="w-4 h-4 text-emerald-400" />
              Link Copied to Clipboard!
            </>
          ) : (
            <>
              <Copy className="w-4 h-4" />
              Copy Direct Link
            </>
          )}
        </button>
      </div>
    </div>
  );
};
