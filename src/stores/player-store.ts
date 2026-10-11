import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { audioEngine } from '@/audio/audio-engine';
import { SoundTrack, PlaybackStatus, AtmospherePreset, CustomMix, SleepTimerState } from '@/types';
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
  tickSleepTimer: () => void;
  openMiniPlayer: () => void;
  closeMiniPlayer: () => void;
}

let timerInterval: ReturnType<typeof setInterval> | null = null;

export const usePlayerStore = create<PlayerStoreState>()(
  persist(
    (set, get) => ({
      currentSound: null,
      playbackStatus: 'idle',
      masterVolume: 0.8,
      activeLayers: {
        rain: { volume: 0.75, isMuted: false, isPlaying: false },
        ocean: { volume: 0.70, isMuted: false, isPlaying: false },
        forest: { volume: 0.65, isMuted: false, isPlaying: false },
        village: { volume: 0.65, isMuted: false, isPlaying: false },
        fireplace: { volume: 0.60, isMuted: false, isPlaying: false },
        wind: { volume: 0.55, isMuted: false, isPlaying: false },
        night: { volume: 0.60, isMuted: false, isPlaying: false },
      },
      isLooping: true,
      sleepTimer: {
        durationMinutes: 0,
        remainingSeconds: 0,
        isRunning: false,
      },
      favorites: ['rain', 'forest'],
      customMixes: [],
      activePresetId: null,
      isMiniPlayerOpen: true,

      playSingleSound: async (sound: SoundTrack) => {
        set({ playbackStatus: 'switching', currentSound: sound, activePresetId: null, isMiniPlayerOpen: true });
        try {
          const currentLayers = { ...get().activeLayers };
          // Mark target layer as playing, others stopped
          Object.keys(currentLayers).forEach((key) => {
            currentLayers[key] = {
              ...currentLayers[key],
              isPlaying: key === sound.id,
            };
          });

          await audioEngine.playExclusive(sound.id, sound.audioSrc, sound.defaultVolume);

          set({
            currentSound: sound,
            playbackStatus: 'playing',
            activeLayers: currentLayers,
          });
        } catch (error) {
          console.error('Play single sound failure:', error);
          set({ playbackStatus: 'error' });
        }
      },

      togglePlayPause: async () => {
        const { playbackStatus, currentSound } = get();

        if (playbackStatus === 'playing') {
          audioEngine.pauseAll();
          set({ playbackStatus: 'paused' });
        } else if (playbackStatus === 'paused') {
          set({ playbackStatus: 'loading' });
          await audioEngine.resumeAll();
          set({ playbackStatus: 'playing' });
        } else {
          // If idle or stopped, play current sound or default to rain
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

        const activeLayers = { ...get().activeLayers };
        const layerState = activeLayers[soundId] || { volume: sound.defaultVolume, isMuted: false, isPlaying: false };

        if (layerState.isPlaying) {
          audioEngine.pauseLayer(soundId);
          activeLayers[soundId] = { ...layerState, isPlaying: false };
          set({ activeLayers });

          // If no layers remain playing, pause status
          const anyPlaying = Object.values(activeLayers).some((l) => l.isPlaying);
          if (!anyPlaying) set({ playbackStatus: 'paused' });
        } else {
          try {
            await audioEngine.startLayer(soundId, sound.audioSrc, layerState.volume);
            activeLayers[soundId] = { ...layerState, isPlaying: true };
            set({
              activeLayers,
              playbackStatus: 'playing',
              currentSound: sound,
              isMiniPlayerOpen: true,
            });
          } catch (err) {
            console.error('Failed to toggle layer', soundId, err);
          }
        }
      },

      loadPreset: async (preset: AtmospherePreset) => {
        set({ playbackStatus: 'loading', activePresetId: preset.id, isMiniPlayerOpen: true });
        const currentLayers = { ...get().activeLayers };

        // Silence all unselected layers
        Object.keys(currentLayers).forEach((key) => {
          const presetLayer = preset.layers.find((l) => l.soundId === key);
          if (presetLayer) {
            currentLayers[key] = {
              volume: presetLayer.volume,
              isMuted: false,
              isPlaying: true,
            };
          } else {
            currentLayers[key] = {
              ...currentLayers[key],
              isPlaying: false,
            };
          }
        });

        // Stop all current playing audio
        audioEngine.stopAll();

        // Start each preset layer
        for (const l of preset.layers) {
          const snd = getSoundById(l.soundId);
          if (snd) {
            await audioEngine.startLayer(l.soundId, snd.audioSrc, l.volume);
          }
        }

        const primarySound = getSoundById(preset.layers[0]?.soundId) || SOUND_TRACKS[0];

        // Apply preset sleep timer if provided
        if (preset.sleepTimerMinutes) {
          get().setSleepTimer(preset.sleepTimerMinutes);
        }

        set({
          currentSound: primarySound,
          activeLayers: currentLayers,
          playbackStatus: 'playing',
        });
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
        set({
          sleepTimer: {
            durationMinutes: minutes,
            remainingSeconds: totalSeconds,
            isRunning: true,
          },
        });

        timerInterval = setInterval(() => {
          get().tickSleepTimer();
        }, 1000);
      },

      cancelSleepTimer: () => {
        if (timerInterval) {
          clearInterval(timerInterval);
          timerInterval = null;
        }
        audioEngine.cancelSleepTimer();
        set({
          sleepTimer: {
            durationMinutes: 0,
            remainingSeconds: 0,
            isRunning: false,
          },
        });
      },

      tickSleepTimer: () => {
        const { sleepTimer } = get();
        if (!sleepTimer.isRunning) return;

        const remaining = sleepTimer.remainingSeconds - 1;

        // When 30 seconds remain, initiate Web Audio exponential volume fade down
        if (remaining === 30) {
          audioEngine.startSleepTimerFade(30, () => {
            get().cancelSleepTimer();
            get().stopPlayback();
          });
        }

        if (remaining <= 0) {
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
    }),
    {
      name: 'stillwave-player-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        masterVolume: state.masterVolume,
        favorites: state.favorites,
        customMixes: state.customMixes,
        activeLayers: state.activeLayers,
      }),
    }
  )
);
