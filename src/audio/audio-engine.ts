import { rainAudioEngine } from './rain-engine';
import { proceduralSynthesizer } from './procedural-synthesizer';

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
  private activeSoundId: string | null = null;
  private audioTickListeners: Set<() => void> = new Set();
  private mediaHandlersRegistered: boolean = false;

  constructor() {
    // Visibility listener to ensure audio continuity and resume context on phone wake
    if (typeof window !== 'undefined') {
      document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible') {
          if (this.ctx && this.ctx.state === 'suspended' && this.isPlayingAny()) {
            this.ctx.resume().catch((err) => console.warn('Context resume failed:', err));
          }
        }
      });
    }
  }

  public isPlayingAny(): boolean {
    if (proceduralSynthesizer.getActiveSoundId() !== null) return true;
    for (const layer of this.layers.values()) {
      if (layer.isPlaying) return true;
    }
    return false;
  }

  public getActiveAudioElement(): HTMLAudioElement | null {
    if (!this.activeSoundId) return null;
    return this.layers.get(this.activeSoundId)?.audio ?? null;
  }

  /**
   * Registers a heartbeat callback attached to the active playing audio element's native timeupdate event.
   * This continues to fire in mobile background / screen-off state as long as audio plays.
   */
  public onAudioTick(callback: () => void): () => void {
    this.audioTickListeners.add(callback);
    return () => {
      this.audioTickListeners.delete(callback);
    };
  }

  private notifyAudioTick(): void {
    this.audioTickListeners.forEach((listener) => {
      try {
        listener();
      } catch (err) {
        console.warn('Error in audio tick listener:', err);
      }
    });
  }

  /**
   * Updates OS-level MediaSession (iOS Lock Screen / Dynamic Island & Android Media Notification).
   */
  public updateMediaSession(
    sound: { title: string; subtitle?: string; artwork?: string },
    isPlaying: boolean
  ): void {
    if (typeof window === 'undefined' || !('mediaSession' in navigator)) return;

    try {
      const artworkList = sound.artwork
        ? [
            { src: sound.artwork, sizes: '512x512', type: 'image/jpeg' },
            { src: sound.artwork, sizes: '256x256', type: 'image/jpeg' },
          ]
        : [];

      navigator.mediaSession.metadata = new MediaMetadata({
        title: sound.title,
        artist: 'Stillwave',
        album: sound.subtitle || 'Calm Soundscapes',
        artwork: artworkList,
      });

      navigator.mediaSession.playbackState = isPlaying ? 'playing' : 'paused';
    } catch (e) {
      console.warn('Error setting MediaSession metadata:', e);
    }
  }

  /**
   * Configures Lock Screen media action handlers (Play, Pause, Stop, Prev, Next).
   */
  public setupMediaSessionHandlers(handlers: {
    onPlay: () => void;
    onPause: () => void;
    onStop: () => void;
    onNext?: () => void;
    onPrev?: () => void;
  }): void {
    if (typeof window === 'undefined' || !('mediaSession' in navigator) || this.mediaHandlersRegistered) return;

    try {
      navigator.mediaSession.setActionHandler('play', () => handlers.onPlay());
      navigator.mediaSession.setActionHandler('pause', () => handlers.onPause());
      navigator.mediaSession.setActionHandler('stop', () => handlers.onStop());
      if (handlers.onNext) navigator.mediaSession.setActionHandler('nexttrack', () => handlers.onNext!());
      if (handlers.onPrev) navigator.mediaSession.setActionHandler('previoustrack', () => handlers.onPrev!());
      this.mediaHandlersRegistered = true;
    } catch (err) {
      console.warn('MediaSession action handler registration failed:', err);
    }
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

      // Keep native audio.volume synchronized for background playback resilience
      audio.volume = initialVolume;

      audio.addEventListener('timeupdate', () => {
        if (layer && layer.isPlaying) {
          this.notifyAudioTick();
        }
      });

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

    // If procedural soundscape (e.g. empty audioSrc or procedural synthetic patch)
    if (!audioSrc || audioSrc.trim() === '' || proceduralSynthesizer.hasSynthesisFor(soundId)) {
      if (!audioSrc || audioSrc.trim() === '') {
        proceduralSynthesizer.startSound(soundId, this.ctx!, this.masterGain!, targetVolume);
        this.activeSoundId = soundId;
        if (typeof window !== 'undefined' && 'mediaSession' in navigator) {
          navigator.mediaSession.playbackState = 'playing';
        }
        return;
      }
    }

    // Play target sound via Audio element, falling back cleanly to procedural if needed
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
      proceduralSynthesizer.stopSound(0.5);
      targetLayer.isPlaying = true;
      this.activeSoundId = soundId;
      if (typeof window !== 'undefined' && 'mediaSession' in navigator) {
        navigator.mediaSession.playbackState = 'playing';
      }
    } catch (error) {
      console.warn('Play audio file fallback to procedural synthesis for:', soundId, error);
      if (proceduralSynthesizer.hasSynthesisFor(soundId)) {
        proceduralSynthesizer.startSound(soundId, this.ctx!, this.masterGain!, targetVolume);
        this.activeSoundId = soundId;
        if (typeof window !== 'undefined' && 'mediaSession' in navigator) {
          navigator.mediaSession.playbackState = 'playing';
        }
      } else {
        throw error;
      }
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
    if (proceduralSynthesizer.getActiveSoundId() === soundId) {
      proceduralSynthesizer.stopSound(0.5);
    }
    const layer = this.layers.get(soundId);
    if (layer && layer.isPlaying) {
      layer.audio.pause();
      layer.isPlaying = false;
    }
    if (typeof window !== 'undefined' && 'mediaSession' in navigator) {
      navigator.mediaSession.playbackState = this.isPlayingAny() ? 'playing' : 'paused';
    }
  }

  /**
   * Stops an active layer and resets its playback cursor to beginning.
   */
  public stopLayer(soundId: string): void {
    if (soundId === 'rain') {
      rainAudioEngine.stop();
    }
    if (proceduralSynthesizer.getActiveSoundId() === soundId) {
      proceduralSynthesizer.stopSound(0.2);
    }
    const layer = this.layers.get(soundId);
    if (layer) {
      layer.audio.pause();
      layer.audio.currentTime = 0;
      layer.isPlaying = false;
    }
    if (this.activeSoundId === soundId) {
      this.activeSoundId = null;
    }
    if (typeof window !== 'undefined' && 'mediaSession' in navigator) {
      navigator.mediaSession.playbackState = this.isPlayingAny() ? 'playing' : 'none';
    }
  }

  /**
   * Pauses all currently playing layers without resetting positions.
   */
  public pauseAll(): void {
    rainAudioEngine.pause();
    proceduralSynthesizer.stopSound(0.5);
    for (const layer of this.layers.values()) {
      if (layer.isPlaying) {
        layer.audio.pause();
        layer.isPlaying = false;
      }
    }
    if (typeof window !== 'undefined' && 'mediaSession' in navigator) {
      navigator.mediaSession.playbackState = 'paused';
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
          this.activeSoundId = layer.soundId;
        } catch (err) {
          console.warn('Resume error', layer.soundId, err);
        }
      }
    }
    if (typeof window !== 'undefined' && 'mediaSession' in navigator) {
      navigator.mediaSession.playbackState = this.isPlayingAny() ? 'playing' : 'paused';
    }
  }

  /**
   * Stops all layers and resets their playback cursor.
   */
  public stopAll(): void {
    rainAudioEngine.stop();
    proceduralSynthesizer.stopSound(0.2);
    for (const layer of this.layers.values()) {
      layer.audio.pause();
      layer.audio.currentTime = 0;
      layer.isPlaying = false;
    }
    this.activeSoundId = null;
    if (typeof window !== 'undefined' && 'mediaSession' in navigator) {
      navigator.mediaSession.playbackState = 'none';
    }
  }

  /**
   * Sets the volume for an individual layer (0.0 to 1.0).
   */
  public setLayerVolume(soundId: string, volume: number): void {
    if (soundId === 'rain') {
      rainAudioEngine.setVolume(volume);
    }
    if (proceduralSynthesizer.getActiveSoundId() === soundId) {
      proceduralSynthesizer.setVolume(volume);
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
    // Keep active audio element volumes aligned for background playback
    for (const layer of this.layers.values()) {
      layer.audio.volume = layer.isMuted ? 0 : layer.userVolume * safeVolume;
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
