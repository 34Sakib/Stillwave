import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { RainParameters, RainPreset } from '@/types/rain';
import { rainAudioEngine } from '@/audio/rain-engine';
import { RAIN_PRESETS, DEFAULT_RAIN_PARAMETERS } from '@/audio/rain-presets';

interface RainStoreState {
  parameters: RainParameters;
  activePresetId: string | null;
  isCustomizerOpen: boolean;
  isPlaying: boolean;

  // Actions
  setVolume: (value: number) => void;
  setIntensity: (value: number) => void;
  setDropDensity: (value: number) => void;
  setSplashDensity: (value: number) => void;
  setStereoWidth: (value: number) => void;
  applyPreset: (preset: RainPreset) => void;
  resetToDefault: () => void;
  openCustomizer: () => void;
  closeCustomizer: () => void;
  setIsPlaying: (isPlaying: boolean) => void;
}

export const useRainStore = create<RainStoreState>()(
  persist(
    (set) => ({
      parameters: { ...DEFAULT_RAIN_PARAMETERS },
      activePresetId: 'calm-window-patter',
      isCustomizerOpen: false,
      isPlaying: false,

      setVolume: (value: number) => {
        set((state) => ({
          parameters: { ...state.parameters, volume: value },
        }));
        rainAudioEngine.setVolume(value);
      },

      setIntensity: (value: number) => {
        set((state) => ({
          parameters: { ...state.parameters, intensity: value },
          activePresetId: null, // manual tweak
        }));
        rainAudioEngine.setRainIntensity(value);
      },

      setDropDensity: (value: number) => {
        set((state) => ({
          parameters: { ...state.parameters, dropDensity: value },
          activePresetId: null,
        }));
        rainAudioEngine.setDropDensity(value);
      },

      setSplashDensity: (value: number) => {
        set((state) => ({
          parameters: { ...state.parameters, splashDensity: value },
          activePresetId: null,
        }));
        rainAudioEngine.setSplashDensity(value);
      },

      setStereoWidth: (value: number) => {
        set((state) => ({
          parameters: { ...state.parameters, stereoWidth: value },
          activePresetId: null,
        }));
        rainAudioEngine.setStereoWidth(value);
      },

      applyPreset: (preset: RainPreset) => {
        set({
          parameters: { ...preset.parameters },
          activePresetId: preset.id,
        });
        rainAudioEngine.setParameters(preset.parameters);
      },

      resetToDefault: () => {
        const defaultPreset = RAIN_PRESETS[0];
        set({
          parameters: { ...DEFAULT_RAIN_PARAMETERS },
          activePresetId: defaultPreset.id,
        });
        rainAudioEngine.setParameters(DEFAULT_RAIN_PARAMETERS);
      },

      openCustomizer: () => set({ isCustomizerOpen: true }),
      closeCustomizer: () => set({ isCustomizerOpen: false }),
      setIsPlaying: (isPlaying: boolean) => set({ isPlaying }),
    }),
    {
      name: 'stillwave-rain-settings',
      partialize: (state) => ({
        parameters: state.parameters,
        activePresetId: state.activePresetId,
      }),
    }
  )
);
