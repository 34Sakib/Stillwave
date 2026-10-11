<div align="center">

# 🌊 STILLWAVE

### *Your Sanctuary of Sound, Focus, and Serenity*

An ultra-refined ambient sound generator and sensory focus web application crafted for deep work, meditation, and restful sleep. Seamlessly blend organic soundscapes, customize audio layers, and enter a state of calm.

[![Next.js](https://img.shields.io/badge/Next.js-16.4.0-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.0-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-emerald?style=for-the-badge)](LICENSE)

[Live Demo](https://stillwave-sound.vercel.app/) · [Report Bug](https://github.com/34Sakib/Stillwave/issues) · [Request Feature](https://github.com/34Sakib/Stillwave/issues)

</div>
<img width="1915" height="3404" alt="image" src="https://github.com/user-attachments/assets/6c3c70db-f4a1-4f62-83ec-f26a4861dc7e" />



---

## ✨ Features

### 🎧 6 High-Fidelity Natural Soundscapes
Each soundscape is crafted with psychoacoustic care and seamless looping:
- **🌧️ Gentle Rain** — Soft, meditative raindrops tapping against window panes and foliage.
- **🌊 Ocean Surf** — Rolling oceanic swells and rhythmic tides designed for mental clarity.
- **🌲 Alpine Forest** — Pure mountain wilderness featuring gentle wind through pines, a remote babbling brook, and subtle woodland calls (Wood Thrush & Pileated Woodpecker).
- **🔥 Cozy Fireplace** — Warm cedar crackles, gentle wood popping, and soothing hearth warmth.
- **💨 Mountain Breeze** — Soft alpine wind whistling through evergreen trees.
- **🌙 Night Serenade** — Distant twilight crickets, peaceful katydids, and nocturnal calm.

---

### 🎛️ Multi-Layer Sound Mixer
- **Dynamic Layering** — Play single sounds or layer up to 6 environments simultaneously.
- **Individual Volume Controls** — Precision slider adjustments for every active layer.
- **Master Controls** — Global volume slider, master play/pause, and one-click mute.
- **Active Atmosphere Drawer** — Slide-up mixing tray accessible anytime from the floating bottom player.

---

### 🎯 Curated Intention Presets
One-tap crafted audio profiles for instant mood shifting:
| Preset | Curated Mix | Intention |
| :--- | :--- | :--- |
| **Deep Work** | Gentle Rain (65%) + Soft Wind (30%) | Eliminate distractions for sustained focus |
| **Sleep Sanctuary** | Ocean Waves (60%) + Night Insects (35%) | Gentle lullaby for deep rest |
| **Creative Flow** | Forest Ambience (70%) + Mountain Wind (40%) | Expansive headspace for artistic thinking |
| **Mindful Breathing** | Ocean Waves (80%) + Gentle Rain (20%) | Steady rhythm for breathwork & meditation |
| **Rainy Cafe** | Heavy Rain (75%) + Distant Thunder (30%) | Cozy introspection and reading |
| **Midnight Cabin** | Fireplace (70%) + Night Insects (30%) + Rain (30%) | Ultimate warmth and security |

---

### 🌌 Immersive Fullscreen Listening Room
- Audio-reactive frequency visualizer with smooth fluid waveforms.
- Distraction-free aesthetic mode with auto-hiding controls.
- Quick layer toggle cards directly inside the listening view.

---

### ⏱️ Sleep Timer & Fade-Out
- Timers for **15m**, **30m**, **45m**, **60m**, or **custom durations**.
- Built-in gentle **fade-out** so audio eases into silence rather than cutting abruptly.

---

### ⌨️ Fluid Keyboard Shortcuts
Control your entire auditory environment without touching the mouse:

| Shortcut | Action |
| :---: | :--- |
| <kbd>Space</kbd> | Toggle Global Play / Pause |
| <kbd>M</kbd> | Toggle Global Mute |
| <kbd>F</kbd> | Open / Close Fullscreen Listening Room |
| <kbd>T</kbd> | Open Sleep Timer Modal |
| <kbd>?</kbd> | Show Keyboard Shortcuts Guide |
| <kbd>1</kbd> - <kbd>6</kbd> | Toggle individual soundscape layers (Rain, Ocean, Forest, etc.) |
| <kbd>Esc</kbd> | Close modals or exit Fullscreen Room |

---

### 📱 Responsive & Mobile-Optimized
- Bottom quick-access audio dock and slide-over navigation tray.
- Touch-friendly sliders, smooth micro-interactions, and glassmorphic drawer interfaces.
- Fluid typography and responsive layout engineered for phones, tablets, and desktop displays.

---

## 🛠️ Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router, Turbopack, React 19)
- **Language**: [TypeScript](https://www.typescriptlang.org/) (Strict type-safety)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) + Custom Glassmorphism & Micro-animations
- **State Management**: [Zustand](https://zustand-demo.pmnd.rs/) with persistent volume & settings preferences
- **Icons**: [Lucide React](https://lucide.dev/)
- **Audio Synthesis**: Native Web Audio API & custom PCM lossless looping generators

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

3. **Generate audio assets (optional / pre-bundled)**:
   ```bash
   node scripts/generate-audio.js
   ```

4. **Start the development server**:
   ```bash
   npm run dev
   ```

5. **Open Stillwave**:
   Navigate to [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📁 Project Structure

```text
STILLWAVE/
├── public/
│   ├── audio/              # High-fidelity looping audio files
│   │   ├── rain/
│   │   ├── ocean/
│   │   ├── forest/
│   │   ├── fireplace/
│   │   ├── wind/
│   │   └── night/
│   └── images/soundscapes/ # Atmospheric imagery for each environment
├── scripts/
│   └── generate-audio.js   # Algorithmic audio synthesis pipeline
├── src/
│   ├── app/                # Next.js App Router (layout, page, icon metadata)
│   ├── components/
│   │   ├── audio/          # Audio engine & canvas frequency visualizer
│   │   ├── layout/         # Header, mobile drawer, bottom dock
│   │   ├── sections/       # Hero, Sound Library, Intentions, Listening Room, Footer
│   │   ├── sound-library/  # Sound cards, category chips, layer triggers
│   │   ├── sound-mixer/    # Multi-track mixing sliders and layer controllers
│   │   └── ui/             # Modals (Timer, Keyboard shortcuts, Dialogs)
│   ├── data/               # Sound catalogs and intention presets
│   ├── hooks/              # Audio playback hooks & keyboard event listeners
│   ├── stores/             # Zustand state stores (player, mixer, preferences)
│   └── types/              # TypeScript definitions & interfaces
├── tailwind.config.ts      # Design tokens & color system
└── package.json
```

---

## 🔒 Privacy & Performance

- **Zero Tracking**: Stillwave does not harvest user data or require accounts.
- **Offline Capable**: Audio assets run locally in the browser once loaded.
- **Battery-Friendly**: Optimized canvas rendering throttled during inactivity.

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

---

<div align="center">

Made with care for calm minds and deep work.  
*Star ⭐ this repository if Stillwave helped your focus!*

</div>
