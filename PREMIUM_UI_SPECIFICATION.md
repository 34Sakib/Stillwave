# 🌊 STILLWAVE — Premium UI/UX Design System & Product Specification

> **A Masterclass in Organic Serenity, Subtractive Luxury, and Sensory Audio Design.**  
> *Use this document as an authoritative design brief for UI/UX designers, Figma creators, frontend developers, and AI design generators (v0, Midjourney, Claude, ChatGPT).*

---

## 1. Executive Vision & Aesthetic Identity

### 1.1 Brand DNA
**STILLWAVE** is an ultra-luxury ambient sound sanctuary engineered for deep work, mindfulness, meditation, and restorative delta sleep. It bridges the acoustic precision of **Teenage Engineering** and **Bang & Olufsen** with the fluid, living ambient aesthetics of **Endel** and **Apple Human Interface Design**.

### 1.2 Design Philosophy: *Subtractive Serenity*
- **Noise Zero**: Every pixel serves a psychoacoustic purpose. No clutter, no gratuitous gradients, no generic icons.
- **Fluid Living Atmosphere**: The website is not a static webpage — it is an organic, breathing ecosystem. When the user changes soundscapes, the **entire website’s visual motive seamlessly morphs in color, ambient glow, and border radiance** over a 1.2s cubic ease curve.
- **Tactile High-Fidelity**: Minimalist glassmorphic surfaces (frosted glass, fine hairline borders, noise textures, and deep charcoal/obsidian surfaces) that feel physical, premium, and calm.
- **Audio-First Spatial Architecture**: Audio status and controls are perpetually accessible without interrupting focus or visual serenity.

---

## 2. Dynamic Sound Motive Color System

STILLWAVE features **10 Curated Sound Motives**. Each soundscape commands a bespoke ambient color palette that dynamically drives CSS custom properties across the background, card surfaces, borders, glow halos, and visualizer canvases:

| # | Soundscape | Motive Atmosphere | Primary Accent | Accent HSL | Ambient Base | Surface Card |
|---|------------|-------------------|----------------|------------|--------------|--------------|
| 1 | **Gentle Rain** | Deep Slate Mist | `#7FA2B8` | `hsl(202, 30%, 61%)` | `#0C1217` | `#131C24` |
| 2 | **Deep Ocean Swell** | Marine Abyss & Surf | `#4EA1A4` | `hsl(182, 35%, 48%)` | `#091418` | `#0F2026` |
| 3 | **Whispering Forest** | Alpine Moss & Pine | `#6EA383` | `hsl(143, 23%, 53%)` | `#0A1410` | `#11211A` |
| 4 | **Hearth Fireplace** | Warm Birch & Embers | `#D1845A` | `hsl(21, 57%, 59%)` | `#160F0C` | `#231713` |
| 5 | **Highland Breeze** | High-Altitude Mist | `#A8B8BA` | `hsl(187, 12%, 69%)` | `#101416` | `#192023` |
| 6 | **Midnight Meadow** | Nocturnal Cosmos | `#9D8BC9` | `hsl(257, 36%, 66%)` | `#110E1A` | `#1A1629` |
| 7 | **Zen Singing Bowls** | Sacred Temple Brass | `#CFA356` | `hsl(38, 56%, 57%)` | `#14110A` | `#211C11` |
| 8 | **Mountain Stream** | Glacial Aquamarine | `#4DB6AC` | `hsl(174, 42%, 51%)` | `#091515` | `#0F2222` |
| 9 | **Velvet Brown Noise** | Deep Umber Earth | `#B88A72` | `hsl(20, 32%, 58%)` | `#14100D` | `#201A16` |
| 10 | **Distant Thunder** | Storm Indigo Steel | `#6B8BB8` | `hsl(215, 36%, 57%)` | `#0D1119` | `#141B26` |

### 2.1 CSS Custom Property Tokens
```css
:root {
  /* Dynamic Tokens (Interpolated on Sound Switch via Ambient Theme Provider) */
  --theme-bg: #0C1210;
  --theme-surface: #141E1C;
  --theme-surface-hover: #1C2926;
  --theme-accent: #91AFA9;
  --theme-accent-hover: #B4CCC7;
  --theme-glow: rgba(145, 175, 169, 0.15);
  --theme-border: rgba(145, 175, 169, 0.25);
  --theme-border-subtle: rgba(145, 175, 169, 0.10);
  
  /* Static Neutral Accents */
  --text-primary: #F1F3EF;
  --text-secondary: #B3BDB6;
  --text-muted: #7E8D86;
  --border-hairline: rgba(255, 255, 255, 0.08);
}
```

---

## 3. Typography & Hierarchy

The typography balances **editorial literary warmth** with **modern geometric precision**:

- **Editorial Serif / Brand Display**: *Playfair Display* / *Fraunces* / *Newsreader*
  - Use for: Section headlines, emotional quotes, brand logomark, editorial philosophy.
  - Character: Serene, introspective, high-fashion editorial.
  - Styling: `font-light tracking-tight italic` pairings.
- **Primary Interface Geometric Sans**: *Inter* / *Plus Jakarta Sans* / *Geist*
  - Use for: Navigation links, body copy, card labels, metadata badges.
  - Styling: `text-sm font-medium tracking-wide`.
- **Acoustic Monospace**: *JetBrains Mono* / *Geist Mono*
  - Use for: Sleep timer digital clocks (`24:59`), frequency readouts (`432Hz`, `1/f²`), volume percentages (`75%`), acoustic metadata chips.

---

## 4. Architectural Layout & Page Components

### 4.1 Header & Navigation (Ultra-Minimalist Floating Glass Capsule)
- **Structure**: Floating frosted pill anchored at the top:
  - **Left**: Minimal wave icon + `STILLWAVE` typographic wordmark (`tracking-widest uppercase text-xs`).
  - **Center**: Exactly **3 Core Navigation Links**:
    1. `Soundscapes` (`#soundscapes`)
    2. `Intentions` (`#intentions`)
    3. `Rituals` (`#rituals`)
  - **Right**:
    - **Active Motive Badge**: Pill displaying current sound title + live pulsing colored theme dot.
    - **Sleep Timer Quick Trigger**: Moon icon with active status indicator.
    - **GitHub Repository Link**: Direct link to the open-source repository.
- **Glassmorphism Spec**: `backdrop-blur-xl bg-black/40 border border-white/10 rounded-full shadow-2xl`.

---

### 4.2 Hero Sanctuary (Immersive Atmospheric Entry)
- **Visual Backdrop**:
  - Full-viewport dark canvas blended with **Motion fluid mesh orbs** that gently drift and breathe (`scale: 1 -> 1.08 -> 1`, 18s duration).
  - Subtle film grain texture overlay (3% opacity SVG noise) to prevent digital banding and give organic vinyl warmth.
- **Content Hierarchy**:
  1. *Subtle Pill Badge*: `● ACTIVE ACOUSTIC SANCTUARY • EXCLUSIVE SINGLE-SOUND PLAYBACK`
  2. *Editorial Headline*: `"A Sanctuary for Wandering Minds."` with subtle soundscape-specific accent glow.
  3. *Serene Subtitle*: A two-sentence invitation to disconnect from digital exhaustion and step into natural acoustics.
  4. *Dual Action CTA*:
     - **Primary CTA**: Glass-sheen pill button `[ Begin Session ]` triggering instant playback.
     - **Secondary CTA**: Minimalist ghost border button `[ Explore Soundscapes ]`.
  5. *Live Real-Time Frequency Waveform Canvas*: Ultra-fine reactive audio visualizer lines matching the current sound spectrum.

---

### 4.3 Soundscape Library (Curated Acoustic Gallery)
- **Single Sound Exclusivity Rule**: Only **ONE** sound can play at any time across the entire website. Clicking any sound instantly crossfades and turns off the previous sound.
- **Card Aesthetics**:
  - Aspect ratio: `4:5` portrait or `16:10` wide cards.
  - Ultra-high-resolution custom artwork with dark vignette gradient at the base.
  - Top-left: Category & mood tags (`Focus`, `Deep Sleep`, `Meditation`).
  - Center/Hover: Tactile circular solo play button (`scale-105 active:scale-95`).
  - Bottom: Track title, evocative subtitle, audio technical indicator (`Seamless Loop • 30s High-Res WAV/MP3`).
  - Border: Hairline border that illuminates to `--theme-border` when active.

---

### 4.4 Acoustic Console / Fader Studio (Individual Sound Finetuning)
- **Concept**: A high-end minimalist mixing console (inspired by Teenage Engineering OP-1 & Braun design).
- **Features**:
  - Each channel corresponds to a soundscape.
  - Active channel displays **Live Solo Indicator** with illuminated meter bars.
  - **Tactile Vertical/Horizontal Volume Fader**: Smooth dragging slider with percentage readout (`0% – 100%`).
  - Solo Mute / Play toggle button.
  - Instant crossfader: Selecting a new channel gracefully transitions the master motive and audio.

---

### 4.5 Intentions & Atmosphere Presets
- **Curated Intentions**:
  1. **Deep Focus & Flow**: *Alpine Forest* + *Highland Breeze* (Optimized for coding, writing, research).
  2. **Delta Sleep Cocoon**: *Gentle Rain* + *Velvet Brown Noise* (30-minute auto sleep timer).
  3. **Zen Presence & Meditation**: *Tibetan Singing Bowls* (Harmonic 432Hz grounding).
  4. **Stress & Anxiety Relief**: *Mountain Stream* + *Ocean Surf*.
- **Card Design**: Minimalist bordered cards with intention icon, emotional description, and one-tap `[ Activate Intention ]` trigger.

---

### 4.6 Daily Rituals (Circadian Rhythm Flow)
- **Circadian Timeline**:
  - **Dawn Rising (07:00 – 10:00)**: Uplifting birdsong and brisk mountain wind.
  - **Midday Focus (11:00 – 17:00)**: Steady continuous gentle rain for distraction-free work.
  - **Twilight Unwind (18:00 – 21:00)**: Crackling hearth fireplace and soft embers.
  - **Deep Night (22:00 – 06:00)**: Velvet brown noise with auto-shutoff sleep timer.

---

### 4.7 Floating Glass Mini-Player (Persistent Sanctuary Dock)
- **Position**: Bottom-docked floating frosted glass capsule (centered, `max-w-4xl`, responsive on mobile).
- **Elements**:
  - **Track Info**: 48px rounded artwork thumbnail + Track Title + Subtitle.
  - **Playback Controller**: Large Play/Pause button with tactile spring feedback.
  - **Sleep Timer Indicator**: Clickable pill badge displaying live remaining minutes (`• 24m`) with a pulsing green indicator (amber when paused).
  - **Volume Fader**: Custom styled slider with speaker mute toggle.
  - **Quick Open Console**: Sliders icon jumping directly to acoustic faders.

---

### 4.8 Sleep Timer & Mobile Lock-Screen Experience
- **Mobile Screen-Off Playback Architecture**:
  - Fully integrated with the **MediaSession API** (`navigator.mediaSession`).
  - When the phone screen turns off or locks, audio **continues playing uninterrupted** with full iOS Lock Screen / Dynamic Island and Android Media Notification controls (Track Title, Artist: *Stillwave*, Album Artwork, Play, Pause, Prev, Next).
- **Audio-Driven Wall-Clock Expiry**:
  - Timer countdowns are anchored to `Date.now() + durationMs`, immune to background `setInterval` throttling.
  - Active `HTMLAudioElement` native `timeupdate` background heartbeat triggers **automatic audio shut-off and sleep timer completion at the exact scheduled second**, preceded by a gentle 30-second volume fade-out.
- **Sleep Timer Modal Controls**:
  - Large digital font clock (`24:59`).
  - **Pause Sound / Resume Sound** button: Freezes remaining countdown duration so no time is lost while paused.
  - **Turn Off Timer** button: Immediately cancels the timer.
  - **Quick Extend Chips**: One-tap `+5m`, `+15m`, `+30m` buttons.
  - Informative badge: *"Plays in background when screen is locked or turned off"*.

---

## 5. Interaction Design & Micro-Animations

### 5.1 Motion Curves & Transitions
- **Theme Motive Morph**: `transition: all 1200ms cubic-bezier(0.16, 1, 0.3, 1)` across all background surfaces, cards, and borders.
- **Button Hover & Tap**:
  - Hover: `scale: 1.02, translateY: -1px, shadow: 0 10px 25px -5px var(--theme-glow)`.
  - Tap / Active: `scale: 0.98, transition: duration 100ms`.
- **Modals & Dialogs**:
  - Backdrop: `bg-black/60 backdrop-blur-md animate-fade-in`.
  - Content: `scale: 0.96 -> 1.0, opacity: 0 -> 1` with 250ms spring ease.
  - Dismiss: Click outside on backdrop triggers `onClose` reliably with `e.stopPropagation()` protection.

---

## 6. AI & Designer Prompts (Ready to Copy & Paste)

### 6.1 Prompt for UI Designers / Figma / v0 / Claude:
```text
Design an ultra-premium, luxury ambient sound and mindfulness web application named "STILLWAVE".

AESTHETIC STYLE:
- Dark luxury minimalism, inspired by Bang & Olufsen, Teenage Engineering, Apple Music, and Endel.
- Primary surfaces: Obsidian black (#0C1210) with frosted glassmorphic card containers (#141E1C), fine hairline borders (rgba(255,255,255,0.08)), and subtle ambient glow halos.
- Typography: Editorial serif for elegant headlines ("A Sanctuary for Wandering Minds") paired with modern geometric sans (Inter/Plus Jakarta Sans) and monospaced digital timers (JetBrains Mono).

KEY SCREENS & COMPONENTS:
1. Floating Header: Glass pill capsule with STILLWAVE wordmark, exactly 3 links (Soundscapes, Intentions, Rituals), and an active motive badge with a glowing live status dot.
2. Hero Section: Ambient breathing mesh orb background, serene typography, live audio frequency wave visualizer, and "Begin Session" glass CTA button.
3. Soundscape Gallery (10 Tracks): Rain, Ocean Swell, Alpine Forest, Hearth Fireplace, Highland Wind, Midnight Meadow, Zen Singing Bowls, Mountain Stream, Velvet Brown Noise, Distant Thunder. Each card has high-res nature photography, subtle tags, and an instant solo play ring.
4. Dynamic Color Motives: The entire UI color scheme (backgrounds, borders, glow) morphs smoothly based on the active sound (Slate Blue for Rain, Brass Gold for Zen Bowls, Marine Teal for Ocean, Deep Terracotta for Brown Noise).
5. Floating Mini-Player: Frosted glass dock at bottom of the screen with artwork, track info, play/pause, volume fader, and a clickable sleep timer badge (e.g. "• 25m" with pulsing green dot).
6. Sleep Timer Modal: Large digital countdown clock, "Pause Sound / Resume Sound" toggle, "Turn Off Timer" button, quick-add chips (+5m, +15m), and badge confirming mobile lock-screen background playback support.

Make the design feel serene, museum-grade, peaceful, and extraordinarily expensive. Avoid generic SaaS cards, bright blue buttons, or crowded layouts.
```

### 6.2 Prompt for Midjourney (Soundscape Cover Artwork):
```text
Ultra-minimalist aesthetic photography of a serene zen singing bowl on dark polished slate stone, misty morning atmosphere, sacred geometry reflections, warm golden brass candlelight glow, fine atmospheric fog, cinematic lighting, 8k resolution, shot on Hasselblad 100mm, moody fine-art minimalism --ar 16:9 --style raw
```

---

## 7. Technical Implementation Stack

- **Framework**: Next.js 16.4 (Turbopack, App Router, React 19)
- **State Architecture**: Zustand 5 with local storage persistence
- **Audio Processing**: Web Audio API (`AudioContext`, `AnalyserNode`, `GainNode`) + native `HTMLAudioElement` multi-channel engine with `MediaSession API` lock-screen streaming
- **Styling**: Tailwind CSS v4 + Vanilla CSS custom variables
- **Animations**: Motion for React (`motion/react`)
- **Icons**: Lucide React

---

*Document Version 2.0 • STILLWAVE Sanctuary*
