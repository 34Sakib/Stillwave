/**
 * TypeScript definitions for the Procedural Web Audio Rain Engine
 */

export interface RainParameters {
  volume: number; // 0.0 - 1.0 (Master Rain Volume)
  intensity: number; // 0.0 - 1.0 (Rain Bed warmth, low-pass cutoff & density)
  dropDensity: number; // 0.0 - 1.0 (Layer B: Raindrop patter event rate)
  splashDensity: number; // 0.0 - 1.0 (Layer C: Water droplet / splash frequency)
  stereoWidth: number; // 0.0 - 1.0 (Stereo separation & spatial diffusion)
}

export interface RainPreset {
  id: string;
  name: string;
  description: string;
  parameters: RainParameters;
  iconName?: string;
}

export type RainEngineState = 'uninitialized' | 'stopped' | 'playing' | 'paused';
