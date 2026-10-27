import type { Metadata, Viewport } from 'next';
import Script from 'next/script';
import './globals.css';

export const metadata: Metadata = {
  title: 'STILLWAVE - A Sanctuary for Wandering Minds',
  description: 'Over fifty soundscapes, one at a time. Step away from the noise of the day and let the room change color around you. Calm sound for focus, sleep and quiet.',
  keywords: [
    'ambient sounds',
    'focus music',
    'rain sounds',
    'sleep sounds',
    'white noise',
    'soundscapes',
    'relaxation',
    'meditation',
    'stillwave',
  ],
  icons: {
    icon: [
      { url: '/icon.svg?v=stillwave-2', type: 'image/svg+xml' },
      { url: '/favicon.ico?v=stillwave-2', sizes: '32x32' },
    ],
    shortcut: '/icon.svg?v=stillwave-2',
    apple: '/icon.svg?v=stillwave-2',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: '#0A2B2A',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Newsreader:ital,opsz,wght@0,6..72,300;1,6..72,300;1,6..72,400&family=Geist:wght@400;500&family=JetBrains+Mono:wght@400&display=swap"
          rel="stylesheet"
        />
        <link rel="icon" type="image/svg+xml" href="/icon.svg?v=stillwave-2" />
        <link rel="alternate icon" href="/favicon.ico?v=stillwave-2" />
        <Script
          src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"
          strategy="beforeInteractive"
        />
        <Script
          src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js"
          strategy="beforeInteractive"
        />
        <Script
          src="https://cdn.jsdelivr.net/npm/lenis@1.1.13/dist/lenis.min.js"
          strategy="beforeInteractive"
        />
        <Script
          src="/js/stillwave-engine.js"
          strategy="afterInteractive"
        />
      </head>
      <body suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
