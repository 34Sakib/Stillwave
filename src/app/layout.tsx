import type { Metadata, Viewport } from 'next';
import { Manrope, Inter } from 'next/font/google';
import './globals.css';

const manrope = Manrope({
  subsets: ['latin'],
  variable: '--font-heading',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Stillwave — Premium Ambient Soundscape Sanctuary',
  description: 'A calm, cinematic nature-inspired ambient sound sanctuary for focus, rest, and sleep. Continuous playback, custom multi-track mixing, and restrained atmospheric motion.',
  keywords: ['ambient sounds', 'focus music', 'rain sounds', 'sleep sounds', 'white noise', 'soundscapes', 'relaxation'],
  authors: [{ name: 'Stillwave Sanctuary' }],
  icons: {
    icon: [
      { url: '/icon.svg', type: 'image/svg+xml' },
      { url: '/favicon.ico' },
    ],
  },
};

export const viewport: Viewport = {
  themeColor: '#101816',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${manrope.variable} ${inter.variable} scroll-smooth dark`}>
      <body className="min-h-screen bg-[#101816] text-[#F1F3EF] selection:bg-[#91AFA9]/30 selection:text-[#F1F3EF] flex flex-col antialiased">
        {children}
      </body>
    </html>
  );
}
