<div align="center">

# 🌊 STILLWAVE

### *Your Sanctuary of Sound, Focus, and Serenity*

An ultra-refined ambient sound generator and sensory focus web application crafted for deep work, meditation, and restful sleep. Features single-sound solo playback, a dynamic sound motive theming engine, and background audio streaming for mobile devices with the screen turned off.

[![Next.js](https://img.shields.io/badge/Next.js-16.4.0-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.0-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-emerald?style=for-the-badge)](LICENSE)

[Live Demo](https://stillwave-sound.vercel.app/) · [Design System & UI Spec](./PREMIUM_UI_SPECIFICATION.md) · [Report Bug](https://github.com/34Sakib/Stillwave/issues) · [Request Feature](https://github.com/34Sakib/Stillwave/issues)

</div>

<img width="1915" height="3404" alt="Stillwave Preview" src="https://github.com/user-attachments/assets/6c3c70db-f4a1-4f62-83ec-f26a4861dc7e" />

---

## ✨ Features

### 🎧 10 High-Fidelity Natural Soundscapes
Each soundscape is crafted with psychoacoustic care and seamless looping:
- **🌧️ Gentle Rain** — Soft, meditative raindrops tapping against cedar rooftops and foliage *(Deep Slate Blue Motive)*.
- **🌊 Deep Ocean Swell** — Continuous rolling oceanic swells and deep-water undercurrent *(Marine Teal Motive)*.
- **🌲 Whispering Forest** — Alpine pine canopy, remote babbling creek, and subtle woodland thrush calls *(Evergreen Moss Motive)*.
- **🔥 Hearth Fireplace** — Warm cedar crackles, gentle wood popping, and grounding hearth warmth *(Warm Birch Amber Motive)*.
- **💨 Highland Breeze** — Clean high-altitude air moving gently across misty mountain meadows *(Misty Quartz Motive)*.
- **🌙 Midnight Meadow** — Distant twilight crickets, peaceful katydids, and nocturnal calm *(Nocturnal Violet Motive)*.
- **🧘 Zen Singing Bowls** — Deep harmonic Tibetan singing bowl vibrations tuned for presence *(Sacred Brass Ochre Motive)*.
- **🏞️ Mountain Stream** — Pristine alpine brook with bubbling current over smooth stones *(Glacial Aquamarine Motive)*.
- **🟤 Velvet Brown Noise** — Deep 1/f² filtered low-frequency rumble for instant sensory quiet *(Warm Umber Motive)*.
- **⛈️ Distant Thunder** — Atmospheric rolling rumbles and distant rainfall *(Storm Indigo Motive)*.

---

### 🎨 Dynamic Sound Motive Theming Engine
- **Living Color Motives**: When you select any soundscape, the **entire website’s visual palette seamlessly shifts** (background, surfaces, cards, borders, glow halos, and visualizers) over a smooth 1.2s cubic ease curve.
- **Motion Ambient Meshes**: Fluid background orbs drift and breathe in the background via Framer Motion (`motion/react`).
- **3-Link Ultra-Clean Navigation**: Streamlined header with exactly 3 destinations (`Soundscapes`, `Intentions`, `Rituals`) plus a live **Active Motive Badge** indicating the current acoustic state.

---

### 📱 Screen-Off Mobile Background Playback & MediaSession API
- **Screen-Off Audio Continuity**: Playback continues uninterrupted when you lock your phone or turn the screen off (iOS & Android).
- **Native Lock-Screen Controls**: Integrated with the **MediaSession API** for full lock screen, Dynamic Island, and Android notification controls (Track Title, Artist: *Stillwave*, High-Res Artwork, Play, Pause, Previous, Next).
- **Audio-Driven Wall-Clock Sleep Timer**:
  - Timers are anchored to absolute timestamps (`Date.now() + durationMs`), completely immune to mobile background `setInterval` throttling.
  - Active audio `timeupdate` thread monitors time and **automatically stops audio at the exact scheduled second**, preceded by a gentle 30-second volume fade-out.
  - **Full Mid-Timer Control**: Pause or resume audio anytime (freezing remaining countdown while paused) or cancel the timer with one tap.

---

### 🎛️ Acoustic Console & Exclusive Solo Playback
- **Strict Single-Sound Playback**: Only one sound plays at any given time across the entire site. Starting any sound instantly crossfades out the previous audio.
- **Tactile Faders**: Tune individual sound volume levels with fine analog faders.
- **Persistent Floating Glass Mini-Player**: Bottom-docked frosted glass capsule with track metadata, playback waveform, clickable live sleep timer badge, and master volume controls.

---

### 🎯 Curated Intention Presets
One-tap crafted audio profiles for instant mood shifting:
| Preset | Primary Soundscape | Recommended Duration | Intention |
| :--- | :--- | :--- | :--- |
| **Deep Focus & Flow** | Whispering Forest | 60 mins | Eliminate distractions for sustained focus |
| **Delta Sleep Cocoon** | Velvet Brown Noise | 45 mins (Auto-Timer) | Calming lullaby for deep restorative rest |
| **Zen Presence** | Tibetan Singing Bowls | 30 mins | 432Hz grounding for meditation & mindfulness |
| **Mindful Breathing** | Deep Ocean Swell | 20 mins | Steady ocean tide rhythm for breathwork |
| **Rainy Reading** | Gentle Rain | 45 mins | Cozy introspective sanctuary |

---

## 🎨 Design System & UI Specification

For detailed UI tokens, component design specs, and copy-paste AI/Figma prompts to design ultra-luxury visuals for Stillwave, see:
👉 [**PREMIUM_UI_SPECIFICATION.md**](./PREMIUM_UI_SPECIFICATION.md)

---

## 🛠️ Tech Stack

- **Framework**: [Next.js 16.4](https://nextjs.org/) (App Router, Turbopack, React 19)
- **Language**: [TypeScript](https://www.typescriptlang.org/) (Strict type-safety)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) + Dynamic Vanilla CSS Variables & Glassmorphism
- **Animations**: [Motion for React](https://motion.dev/) (`motion/react`)
- **State Management**: [Zustand](https://zustand-demo.pmnd.rs/) with localStorage persistence
- **Audio Engine**: Web Audio API (`AudioContext`, `AnalyserNode`, `GainNode`) + `HTMLAudioElement` + `MediaSession API`
- **Icons**: [Lucide React](https://lucide.dev/)

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18.18.0 or higher recommended)
- `npm` or `pnpm` or `yarn`

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/34Sakib/Stillwave.git
   cd Stillwave
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   ```

4. **Open Stillwave**:
   Navigate to [http://localhost:3000](http://localhost:3000) in your browser.

5. **Build for production**:
   ```bash
   npm run build
   ```

---

## ⌨️ Fluid Keyboard Shortcuts

| Shortcut | Action |
| :---: | :--- |
| <kbd>Space</kbd> | Toggle Global Play / Pause |
| <kbd>M</kbd> | Toggle Global Mute |
| <kbd>F</kbd> | Open / Close Fullscreen Listening Room |
| <kbd>T</kbd> | Open Sleep Timer Modal |
| <kbd>?</kbd> | Show Keyboard Shortcuts Guide |
| <kbd>Esc</kbd> | Close Modals or Exit Fullscreen Room |

---

## 🔒 Privacy & Performance

- **Zero Tracking**: Stillwave does not track, harvest personal data, or require accounts.
- **Screen-Off Audio**: Fully optimized background audio playback with OS-level MediaSession battery efficiency.
- **Offline Capable**: Audio assets loop smoothly in the browser once loaded.

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

---

<div align="center">

Made with care for calm minds and deep work.  
*Star ⭐ this repository if Stillwave helped your focus!*

</div>
