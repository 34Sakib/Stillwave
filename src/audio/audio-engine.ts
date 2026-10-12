import { rainAudioEngine } from './rain-engine';

interface SoundLayerInstance {
  soundId: string;
  audio: HTMLAudioElement;
  sourceNode: MediaElementAudioSourceNode | null;
  gainNode: GainNode;
  userVolume: number; // 0.0 to 1.0
  isMuted: boolean;
  isPlaying: boolean;
}

class StillwaveAudioEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private analyser: AnalyserNode | null = null;
  private layers: Map<string, SoundLayerInstance> = new Map();
  private sleepTimerId: ReturnType<typeof setTimeout> | null = null;
  private isUnlocked: boolean = false;

  constructor() {
    // Lazy AudioContext initialization on first user interaction
  }

  public getAudioContext(): AudioContext | null {
    return this.ctx;
  }

  public getAnalyserNode(): AnalyserNode | null {
    return this.analyser;
  }

  /**
   * Initializes or resumes the AudioContext on deliberate user gesture.
   */
  public async ensureContext(): Promise<AudioContext> {
    if (!this.ctx) {
      const AudioCtxClass =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtxClass();

      // Master Gain Node with conservative headroom to prevent clipping
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0.8, this.ctx.currentTime);

      // Analyser Node for the soundwave visualizer
      this.analyser = this.ctx.createAnalyser();
      this.analyser.fftSize = 256;
      this.analyser.smoothingTimeConstant = 0.85;

      // Connect: Master Gain -> Analyser -> Destination
      this.masterGain.connect(this.analyser);
      this.analyser.connect(this.ctx.destination);

      // Connect Procedural Rain Engine directly to Master Gain
      await rainAudioEngine.initialize(this.ctx, this.masterGain);
    }

    if (this.ctx.state === 'suspended') {
      await this.ctx.resume();
    }

    this.isUnlocked = true;
    return this.ctx;
  }

  /**
   * Registers a sound source if not already registered.
   */
  private getOrCreateLayer(soundId: string, audioSrc: string, initialVolume = 0.7): SoundLayerInstance {
    let layer = this.layers.get(soundId);
    if (!layer) {
      const audio = new Audio();
      audio.src = audioSrc;
      audio.loop = true;
      audio.preload = 'auto';
      audio.crossOrigin = 'anonymous';

      let gainNode: GainNode;
      let sourceNode: MediaElementAudioSourceNode | null = null;

      if (this.ctx && this.masterGain) {
        gainNode = this.ctx.createGain();
        gainNode.gain.setValueAtTime(initialVolume, this.ctx.currentTime);
        try {
          sourceNode = this.ctx.createMediaElementSource(audio);
          sourceNode.connect(gainNode);
          gainNode.connect(this.masterGain);
        } catch {
          // If already connected or CORS issue, fallback to direct element volume
          audio.volume = initialVolume;
        }
      } else {
        // Fallback placeholder gain node will be created upon ensureContext
        gainNode = {} as GainNode;
        audio.volume = initialVolume;
      }

      layer = {
        soundId,
        audio,
        sourceNode,
        gainNode,
        userVolume: initialVolume,
        isMuted: false,
        isPlaying: false,
      };

      this.layers.set(soundId, layer);
    }

    // Attach to Web Audio graph if not yet attached
    if (this.ctx && this.masterGain && !layer.sourceNode) {
      try {
        layer.gainNode = this.ctx.createGain();
        const effectiveVol = layer.isMuted ? 0 : layer.userVolume;
        layer.gainNode.gain.setValueAtTime(effectiveVol, this.ctx.currentTime);

        layer.sourceNode = this.ctx.createMediaElementSource(layer.audio);
        layer.sourceNode.connect(layer.gainNode);
        layer.gainNode.connect(this.masterGain);
      } catch (err) {
        console.warn('Web Audio node connection fallback:', err);
      }
    }

    return layer;
  }

  /**
   * Plays a single sound exclusively, crossfading out all other active tracks.
   */
  public async playExclusive(soundId: string, audioSrc: string, targetVolume = 0.7): Promise<void> {
    await this.ensureContext();

    // Fade out and stop other playing layers
    for (const [id, layer] of this.layers.entries()) {
      if (id !== soundId && layer.isPlaying) {
        this.fadeOutAndStopLayer(layer, 0.8);
      }
    }

    rainAudioEngine.pause();

    // Play target sound
    const targetLayer = this.getOrCreateLayer(soundId, audioSrc, targetVolume);
    targetLayer.userVolume = targetVolume;
    targetLayer.isMuted = false;

    if (this.ctx && targetLayer.gainNode && targetLayer.gainNode.gain) {
      const currTime = this.ctx.currentTime;
      targetLayer.gainNode.gain.cancelScheduledValues(currTime);
      targetLayer.gainNode.gain.setValueAtTime(0.001, currTime);
      targetLayer.gainNode.gain.exponentialRampToValueAtTime(Math.max(0.01, targetVolume), currTime + 0.8);
    } else {
      targetLayer.audio.volume = targetVolume;
    }

    try {
      await targetLayer.audio.play();
      targetLayer.isPlaying = true;
    } catch (error) {
      console.warn('Play error for', soundId, error);
      throw error;
    }
  }

  /**
   * Starts or resumes a sound layer exclusively (enforcing single sound playback).
   */
  public async startLayer(soundId: string, audioSrc: string, volume = 0.7): Promise<void> {
    await this.playExclusive(soundId, audioSrc, volume);
  }

  /**
   * Pauses an active sound layer while preserving its playback cursor position.
   */
  public pauseLayer(soundId: string): void {
    if (soundId === 'rain') {
      rainAudioEngine.pause();
    }
    const layer = this.layers.get(soundId);
    if (layer && layer.isPlaying) {
      layer.audio.pause();
      layer.isPlaying = false;
    }
  }

  /**
   * Stops an active layer and resets its playback cursor to beginning.
   */
  public stopLayer(soundId: string): void {
    if (soundId === 'rain') {
      rainAudioEngine.stop();
    }
    const layer = this.layers.get(soundId);
    if (layer) {
      layer.audio.pause();
      layer.audio.currentTime = 0;
      layer.isPlaying = false;
    }
  }

  /**
   * Pauses all currently playing layers without resetting positions.
   */
  public pauseAll(): void {
    rainAudioEngine.pause();
    for (const layer of this.layers.values()) {
      if (layer.isPlaying) {
        layer.audio.pause();
        layer.isPlaying = false;
      }
    }
  }

  /**
   * Resumes all layers that were in playing state or designated active.
   */
  public async resumeAll(): Promise<void> {
    await this.ensureContext();

    for (const layer of this.layers.values()) {
      if (!layer.isMuted && layer.userVolume > 0 && layer.isPlaying) {
        try {
          await layer.audio.play();
          layer.isPlaying = true;
        } catch (err) {
          console.warn('Resume error', layer.soundId, err);
        }
      }
    }
  }

  /**
   * Stops all layers and resets their playback cursor.
   */
  public stopAll(): void {
    rainAudioEngine.stop();
    for (const layer of this.layers.values()) {
      layer.audio.pause();
      layer.audio.currentTime = 0;
      layer.isPlaying = false;
    }
  }

  /**
   * Sets the volume for an individual layer (0.0 to 1.0).
   */
  public setLayerVolume(soundId: string, volume: number): void {
    if (soundId === 'rain') {
      rainAudioEngine.setVolume(volume);
    }
    const layer = this.layers.get(soundId);
    if (!layer) return;

    layer.userVolume = Math.max(0, Math.min(1, volume));
    if (!layer.isMuted) {
      if (this.ctx && layer.gainNode && layer.gainNode.gain) {
        const currTime = this.ctx.currentTime;
        layer.gainNode.gain.cancelScheduledValues(currTime);
        layer.gainNode.gain.linearRampToValueAtTime(layer.userVolume, currTime + 0.05);
      } else {
        layer.audio.volume = layer.userVolume;
      }
    }
  }

  /**
   * Toggles mute state for a layer.
   */
  public setLayerMute(soundId: string, isMuted: boolean): void {
    const layer = this.layers.get(soundId);
    if (!layer) return;

    layer.isMuted = isMuted;
    const targetVol = isMuted ? 0 : layer.userVolume;

    if (soundId === 'rain') {
      rainAudioEngine.setVolume(targetVol);
    }

    if (this.ctx && layer.gainNode && layer.gainNode.gain) {
      const currTime = this.ctx.currentTime;
      layer.gainNode.gain.cancelScheduledValues(currTime);
      layer.gainNode.gain.linearRampToValueAtTime(targetVol, currTime + 0.05);
    } else {
      layer.audio.volume = targetVol;
    }
  }

  /**
   * Sets Master Volume (0.0 to 1.0) with conservative scaling.
   */
  public setMasterVolume(volume: number): void {
    const safeVolume = Math.max(0, Math.min(1, volume));
    if (this.ctx && this.masterGain) {
      const currTime = this.ctx.currentTime;
      this.masterGain.gain.cancelScheduledValues(currTime);
      this.masterGain.gain.linearRampToValueAtTime(safeVolume * 0.85, currTime + 0.05);
    }
  }

  /**
   * Crossfades an active layer down to zero before pausing.
   */
  private fadeOutAndStopLayer(layer: SoundLayerInstance, duration = 0.8): void {
    if (!layer.isPlaying) return;

    if (layer.soundId === 'rain') {
      rainAudioEngine.pause();
    }

    if (this.ctx && layer.gainNode && layer.gainNode.gain) {
      const currTime = this.ctx.currentTime;
      layer.gainNode.gain.cancelScheduledValues(currTime);
      layer.gainNode.gain.linearRampToValueAtTime(0.001, currTime + duration);
      setTimeout(() => {
        layer.audio.pause();
        layer.isPlaying = false;
      }, duration * 1000);
    } else {
      layer.audio.pause();
      layer.isPlaying = false;
    }
  }

  /**
   * Gradual Sleep Timer Fade-Out over designated duration seconds (default 30s).
   */
  public startSleepTimerFade(fadeDurationSeconds = 30, onComplete?: () => void): void {
    if (!this.ctx || !this.masterGain) {
      this.pauseAll();
      onComplete?.();
      return;
    }

    const currTime = this.ctx.currentTime;
    const currentGain = this.masterGain.gain.value;

    this.masterGain.gain.cancelScheduledValues(currTime);
    this.masterGain.gain.setValueAtTime(currentGain, currTime);
    this.masterGain.gain.linearRampToValueAtTime(0.0001, currTime + fadeDurationSeconds);

    this.sleepTimerId = setTimeout(() => {
      this.pauseAll();
      // Restore master gain for subsequent play
      if (this.masterGain && this.ctx) {
        this.masterGain.gain.setValueAtTime(currentGain, this.ctx.currentTime);
      }
      onComplete?.();
    }, fadeDurationSeconds * 1000);
  }

  public cancelSleepTimer(): void {
    if (this.sleepTimerId) {
      clearTimeout(this.sleepTimerId);
      this.sleepTimerId = null;
    }
    if (this.ctx && this.masterGain) {
      const currTime = this.ctx.currentTime;
      this.masterGain.gain.cancelScheduledValues(currTime);
      this.masterGain.gain.setValueAtTime(0.8, currTime);
    }
  }

  /**
   * Retrieves byte frequency data for the Visualizer Canvas.
   */
  public getVisualizerData(dataArray: Uint8Array): void {
    if (this.analyser) {
      this.analyser.getByteFrequencyData(dataArray as unknown as Uint8Array<ArrayBuffer>);
    } else {
      dataArray.fill(0);
    }
  }
}

// Global Singleton Export
export const audioEngine = new StillwaveAudioEngine();
