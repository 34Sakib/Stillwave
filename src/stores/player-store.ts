import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { audioEngine } from '@/audio/audio-engine';
import { SoundTrack, PlaybackStatus, AtmospherePreset, CustomMix, SleepTimerState, ThemeMode } from '@/types';
import { SOUND_TRACKS, getSoundById } from '@/data/sounds';

interface PlayerStoreState {
  currentSound: SoundTrack | null;
  playbackStatus: PlaybackStatus;
  masterVolume: number;
  activeLayers: Record<string, { volume: number; isMuted: boolean; isPlaying: boolean }>;
  isLooping: boolean;
  sleepTimer: SleepTimerState;
  favorites: string[];
  customMixes: CustomMix[];
  activePresetId: string | null;
  isMiniPlayerOpen: boolean;
  themeMode: ThemeMode;
  isNowPlayingDrawerOpen: boolean;
  isShareModalOpen: boolean;
  shareSoundId: string | null;

  // Actions
  playSingleSound: (sound: SoundTrack) => Promise<void>;
  togglePlayPause: () => Promise<void>;
  stopPlayback: () => void;
  setMasterVolume: (vol: number) => void;
  setLayerVolume: (soundId: string, vol: number) => void;
  toggleLayerMute: (soundId: string) => void;
  toggleLayerPlay: (soundId: string) => Promise<void>;
  loadPreset: (preset: AtmospherePreset) => Promise<void>;
  resetMix: () => void;
  saveCustomMix: (name: string) => void;
  deleteCustomMix: (id: string) => void;
  toggleFavorite: (soundId: string) => void;
  setSleepTimer: (minutes: number) => void;
  cancelSleepTimer: () => void;
  pauseSleepTimer: () => void;
  resumeSleepTimer: () => void;
  syncSleepTimer: () => void;
  tickSleepTimer: () => void;
  openMiniPlayer: () => void;
  closeMiniPlayer: () => void;
  setThemeMode: (mode: ThemeMode) => void;
  openNowPlayingDrawer: () => void;
  closeNowPlayingDrawer: () => void;
  toggleNowPlayingDrawer: () => void;
  openShareModal: (soundId?: string) => void;
  closeShareModal: () => void;
  playNextSound: () => Promise<void>;
  playPrevSound: () => Promise<void>;
}

let timerInterval: ReturnType<typeof setInterval> | null = null;
let audioTickUnsub: (() => void) | null = null;
let isFadingOut: boolean = false;

export const usePlayerStore = create<PlayerStoreState>()(
  persist(
    (set, get) => ({
      currentSound: null,
      playbackStatus: 'idle',
      masterVolume: 0.8,
      activeLayers: SOUND_TRACKS.reduce((acc, s) => {
        acc[s.id] = { volume: s.defaultVolume, isMuted: false, isPlaying: false };
        return acc;
      }, {} as Record<string, { volume: number; isMuted: boolean; isPlaying: boolean }>),
      isLooping: true,
      sleepTimer: {
        durationMinutes: 0,
        remainingSeconds: 0,
        isRunning: false,
      },
      favorites: ['rain', 'forest', 'zen-bowls'],
      customMixes: [],
      activePresetId: null,
      isMiniPlayerOpen: true,
      themeMode: 'motive',
      isNowPlayingDrawerOpen: false,
      isShareModalOpen: false,
      shareSoundId: null,

      playSingleSound: async (sound: SoundTrack) => {
        const currentLayers: Record<string, { volume: number; isMuted: boolean; isPlaying: boolean }> = { ...get().activeLayers };
        SOUND_TRACKS.forEach((s) => {
          if (!currentLayers[s.id]) {
            currentLayers[s.id] = { volume: s.defaultVolume, isMuted: false, isPlaying: false };
          }
          currentLayers[s.id] = {
            ...currentLayers[s.id],
            isPlaying: s.id === sound.id,
          };
        });

        set({
          playbackStatus: 'switching',
          currentSound: sound,
          activePresetId: null,
          isMiniPlayerOpen: true,
          activeLayers: currentLayers,
        });

        try {
          await audioEngine.playExclusive(sound.id, sound.audioSrc, sound.defaultVolume);
          audioEngine.updateMediaSession(sound, true);
          set({
            currentSound: sound,
            playbackStatus: 'playing',
            activeLayers: currentLayers,
          });

          // If a sleep timer was paused, auto-resume countdown
          const { sleepTimer } = get();
          if (sleepTimer.isRunning && sleepTimer.isPaused) {
            get().resumeSleepTimer();
          }
        } catch (error) {
          console.warn('Playback error caught, cleanly falling back to paused:', error);
          set({ playbackStatus: 'paused' });
        }
      },

      togglePlayPause: async () => {
        const { playbackStatus, currentSound } = get();

        if (playbackStatus === 'playing') {
          audioEngine.pauseAll();
          const currentLayers = { ...get().activeLayers };
          Object.keys(currentLayers).forEach((key) => {
            currentLayers[key] = { ...currentLayers[key], isPlaying: false };
          });
          if (currentSound) {
            audioEngine.updateMediaSession(currentSound, false);
          }
          set({ playbackStatus: 'paused', activeLayers: currentLayers });

          // Pause sleep timer countdown while audio is paused
          const { sleepTimer } = get();
          if (sleepTimer.isRunning && !sleepTimer.isPaused) {
            get().pauseSleepTimer();
          }
        } else if (playbackStatus === 'paused') {
          const soundToPlay = currentSound || SOUND_TRACKS[0];
          await get().playSingleSound(soundToPlay);
        } else {
          const soundToPlay = currentSound || SOUND_TRACKS[0];
          await get().playSingleSound(soundToPlay);
        }
      },

      stopPlayback: () => {
        audioEngine.stopAll();
        const currentLayers = { ...get().activeLayers };
        Object.keys(currentLayers).forEach((key) => {
          currentLayers[key] = { ...currentLayers[key], isPlaying: false };
        });
        set({ playbackStatus: 'stopped', activeLayers: currentLayers });
        get().cancelSleepTimer();
      },

      setMasterVolume: (vol: number) => {
        const safe = Math.max(0, Math.min(1, vol));
        audioEngine.setMasterVolume(safe);
        set({ masterVolume: safe });
      },

      setLayerVolume: (soundId: string, vol: number) => {
        const safe = Math.max(0, Math.min(1, vol));
        audioEngine.setLayerVolume(soundId, safe);
        const activeLayers = { ...get().activeLayers };
        if (activeLayers[soundId]) {
          activeLayers[soundId] = { ...activeLayers[soundId], volume: safe };
        }
        set({ activeLayers });
      },

      toggleLayerMute: (soundId: string) => {
        const activeLayers = { ...get().activeLayers };
        if (activeLayers[soundId]) {
          const newMute = !activeLayers[soundId].isMuted;
          activeLayers[soundId] = { ...activeLayers[soundId], isMuted: newMute };
          audioEngine.setLayerMute(soundId, newMute);
          set({ activeLayers });
        }
      },

      toggleLayerPlay: async (soundId: string) => {
        const sound = getSoundById(soundId);
        if (!sound) return;

        const { activeLayers, playbackStatus } = get();
        const isThisPlaying = activeLayers[soundId]?.isPlaying && playbackStatus === 'playing';

        if (isThisPlaying) {
          audioEngine.pauseLayer(soundId);
          const currentLayers = { ...activeLayers };
          Object.keys(currentLayers).forEach((key) => {
            currentLayers[key] = { ...currentLayers[key], isPlaying: false };
          });
          set({ activeLayers: currentLayers, playbackStatus: 'paused' });
        } else {
          // Play target sound exclusively! Stop all other tracks!
          await get().playSingleSound(sound);
        }
      },

      loadPreset: async (preset: AtmospherePreset) => {
        const primarySoundId = preset.layers[0]?.soundId || 'rain';
        const sound = getSoundById(primarySoundId) || SOUND_TRACKS[0];

        if (preset.sleepTimerMinutes) {
          get().setSleepTimer(preset.sleepTimerMinutes);
        }

        set({ activePresetId: preset.id });
        await get().playSingleSound(sound);
      },

      resetMix: () => {
        const resetLayers = { ...get().activeLayers };
        Object.keys(resetLayers).forEach((key) => {
          const snd = getSoundById(key);
          resetLayers[key] = {
            volume: snd ? snd.defaultVolume : 0.6,
            isMuted: false,
            isPlaying: false,
          };
          audioEngine.setLayerVolume(key, snd ? snd.defaultVolume : 0.6);
          audioEngine.setLayerMute(key, false);
        });
        audioEngine.stopAll();
        set({ activeLayers: resetLayers, playbackStatus: 'stopped', activePresetId: null });
      },

      saveCustomMix: (name: string) => {
        const layers = Object.entries(get().activeLayers)
          .filter(([, val]) => val.isPlaying && val.volume > 0)
          .map(([soundId, val]) => ({ soundId, volume: val.volume }));

        if (layers.length === 0) return;

        const newMix: CustomMix = {
          id: `mix-${Date.now()}`,
          name: name.trim() || `Atmosphere ${get().customMixes.length + 1}`,
          createdAt: Date.now(),
          layers,
        };

        set({ customMixes: [newMix, ...get().customMixes] });
      },

      deleteCustomMix: (id: string) => {
        set({ customMixes: get().customMixes.filter((m) => m.id !== id) });
      },

      toggleFavorite: (soundId: string) => {
        const favs = get().favorites;
        if (favs.includes(soundId)) {
          set({ favorites: favs.filter((f) => f !== soundId) });
        } else {
          set({ favorites: [...favs, soundId] });
        }
      },

      setSleepTimer: (minutes: number) => {
        get().cancelSleepTimer();
        const totalSeconds = minutes * 60;
        const targetEndTime = Date.now() + totalSeconds * 1000;
        isFadingOut = false;

        set({
          sleepTimer: {
            durationMinutes: minutes,
            remainingSeconds: totalSeconds,
            isRunning: true,
            isPaused: false,
            targetEndTime,
          },
        });

        // If audio isn't currently playing, auto-start current sound or first calm soundscape
        const { playbackStatus, currentSound } = get();
        if (playbackStatus !== 'playing') {
          const soundToPlay = currentSound || SOUND_TRACKS[0];
          get().playSingleSound(soundToPlay);
        }

        // Active 1-second interval ticker for UI in foreground
        timerInterval = setInterval(() => {
          get().tickSleepTimer();
        }, 1000);

        // Native timeupdate listener for mobile background / screen-off execution
        if (!audioTickUnsub) {
          audioTickUnsub = audioEngine.onAudioTick(() => {
            get().tickSleepTimer();
          });
        }
      },

      cancelSleepTimer: () => {
        if (timerInterval) {
          clearInterval(timerInterval);
          timerInterval = null;
        }
        if (audioTickUnsub) {
          audioTickUnsub();
          audioTickUnsub = null;
        }
        isFadingOut = false;
        audioEngine.cancelSleepTimer();
        set({
          sleepTimer: {
            durationMinutes: 0,
            remainingSeconds: 0,
            isRunning: false,
            isPaused: false,
            targetEndTime: null,
          },
        });
      },

      pauseSleepTimer: () => {
        const { sleepTimer } = get();
        if (!sleepTimer.isRunning || sleepTimer.isPaused) return;

        if (timerInterval) {
          clearInterval(timerInterval);
          timerInterval = null;
        }

        const now = Date.now();
        const remaining = sleepTimer.targetEndTime
          ? Math.max(0, Math.ceil((sleepTimer.targetEndTime - now) / 1000))
          : sleepTimer.remainingSeconds;

        set({
          sleepTimer: {
            ...sleepTimer,
            remainingSeconds: remaining,
            isPaused: true,
            targetEndTime: null,
          },
        });
      },

      resumeSleepTimer: () => {
        const { sleepTimer } = get();
        if (!sleepTimer.isRunning || !sleepTimer.isPaused) return;

        const targetEndTime = Date.now() + sleepTimer.remainingSeconds * 1000;
        isFadingOut = false;

        set({
          sleepTimer: {
            ...sleepTimer,
            isPaused: false,
            targetEndTime,
          },
        });

        if (timerInterval) clearInterval(timerInterval);
        timerInterval = setInterval(() => {
          get().tickSleepTimer();
        }, 1000);

        if (!audioTickUnsub) {
          audioTickUnsub = audioEngine.onAudioTick(() => {
            get().tickSleepTimer();
          });
        }
      },

      syncSleepTimer: () => {
        const { sleepTimer } = get();
        if (!sleepTimer.isRunning || sleepTimer.isPaused || !sleepTimer.targetEndTime) return;

        const now = Date.now();
        const remaining = Math.max(0, Math.ceil((sleepTimer.targetEndTime - now) / 1000));

        if (remaining <= 0) {
          isFadingOut = false;
          get().cancelSleepTimer();
          get().stopPlayback();
        } else {
          set({
            sleepTimer: {
              ...sleepTimer,
              remainingSeconds: remaining,
            },
          });
        }
      },

      tickSleepTimer: () => {
        const { sleepTimer } = get();
        if (!sleepTimer.isRunning || sleepTimer.isPaused || !sleepTimer.targetEndTime) return;

        const now = Date.now();
        const remaining = Math.max(0, Math.ceil((sleepTimer.targetEndTime - now) / 1000));

        // When 30 seconds remain (or less), initiate smooth volume fade-out
        if (remaining <= 30 && remaining > 0 && !isFadingOut) {
          isFadingOut = true;
          audioEngine.startSleepTimerFade(remaining, () => {
            get().cancelSleepTimer();
            get().stopPlayback();
          });
        }

        if (remaining <= 0) {
          isFadingOut = false;
          get().cancelSleepTimer();
          get().stopPlayback();
          return;
        }

        set({
          sleepTimer: {
            ...sleepTimer,
            remainingSeconds: remaining,
          },
        });
      },

      openMiniPlayer: () => set({ isMiniPlayerOpen: true }),
      closeMiniPlayer: () => set({ isMiniPlayerOpen: false }),

      setThemeMode: (mode: ThemeMode) => set({ themeMode: mode }),
      openNowPlayingDrawer: () => set({ isNowPlayingDrawerOpen: true }),
      closeNowPlayingDrawer: () => set({ isNowPlayingDrawerOpen: false }),
      toggleNowPlayingDrawer: () =>
        set((state) => ({ isNowPlayingDrawerOpen: !state.isNowPlayingDrawerOpen })),

      openShareModal: (soundId?: string) =>
        set({
          isShareModalOpen: true,
          shareSoundId: soundId || get().currentSound?.id || 'rain',
        }),
      closeShareModal: () => set({ isShareModalOpen: false, shareSoundId: null }),

      playNextSound: async () => {
        const { currentSound } = get();
        const idx = SOUND_TRACKS.findIndex((s) => s.id === currentSound?.id);
        const nextIdx = (idx + 1) % SOUND_TRACKS.length;
        await get().playSingleSound(SOUND_TRACKS[nextIdx]);
      },

      playPrevSound: async () => {
        const { currentSound } = get();
        const idx = SOUND_TRACKS.findIndex((s) => s.id === currentSound?.id);
        const prevIdx = (idx - 1 + SOUND_TRACKS.length) % SOUND_TRACKS.length;
        await get().playSingleSound(SOUND_TRACKS[prevIdx]);
      },
    }),
    {
      name: 'stillwave-player-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        masterVolume: state.masterVolume,
        favorites: state.favorites,
        customMixes: state.customMixes,
        activeLayers: state.activeLayers,
        themeMode: state.themeMode,
      }),
    }
  )
);

// Client-side background visibility & MediaSession setup
if (typeof window !== 'undefined') {
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') {
      usePlayerStore.getState().syncSleepTimer();
    }
  });

  audioEngine.setupMediaSessionHandlers({
    onPlay: () => {
      usePlayerStore.getState().togglePlayPause();
    },
    onPause: () => {
      usePlayerStore.getState().togglePlayPause();
    },
    onStop: () => {
      usePlayerStore.getState().stopPlayback();
    },
    onNext: () => {
      const state = usePlayerStore.getState();
      const current = state.currentSound;
      const idx = SOUND_TRACKS.findIndex((s) => s.id === current?.id);
      const nextIdx = (idx + 1) % SOUND_TRACKS.length;
      state.playSingleSound(SOUND_TRACKS[nextIdx]);
    },
    onPrev: () => {
      const state = usePlayerStore.getState();
      const current = state.currentSound;
      const idx = SOUND_TRACKS.findIndex((s) => s.id === current?.id);
      const prevIdx = (idx - 1 + SOUND_TRACKS.length) % SOUND_TRACKS.length;
      state.playSingleSound(SOUND_TRACKS[prevIdx]);
    },
  });
}
