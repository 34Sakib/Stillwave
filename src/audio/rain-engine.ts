/**
 * Procedural Multi-Layer Web Audio Rain Engine
 * 
 * Synthesizes a high-fidelity, non-repeating rain soundscape inspired by
 * reference acoustics (soft, continuous, non-fatiguing rainfall).
 * 
 * Architecture:
 * - Layer A: Continuous Rain Bed (Stereo decorrelated pink/brown noise, multi-band filtered)
 * - Layer B: Fine Raindrop Patter (Stochastically scheduled Poisson micro-transients)
 * - Layer C: Subtle Water Splashes (Resonant pitch-swept drops with spatial panning)
 */

import { RainParameters, RainEngineState } from '@/types/rain';
import { createRainBedBuffer } from './noise-generator';
import { DEFAULT_RAIN_PARAMETERS } from './rain-presets';

export class RainAudioEngine {
  private ctx: AudioContext | null = null;
  private isExternalContext: boolean = false;
  private state: RainEngineState = 'uninitialized';

  // Routing Nodes
  private destinationNode: AudioNode | null = null;
  private masterGain: GainNode | null = null;
  private bedGain: GainNode | null = null;
  private patterGain: GainNode | null = null;
  private splashGain: GainNode | null = null;

  // Layer A Nodes
  private bedSource: AudioBufferSourceNode | null = null;
  private bedBuffer: AudioBuffer | null = null;
  private bedHighPass: BiquadFilterNode | null = null;
  private bedLowPass: BiquadFilterNode | null = null;
  private bedPeakFilter: BiquadFilterNode | null = null;
  private driftLfoTimer: ReturnType<typeof setInterval> | null = null;

  // Layer B & C Scheduling
  private isScheduling: boolean = false;
  private schedulerTimerId: ReturnType<typeof setTimeout> | null = null;
  private nextPatterTime: number = 0;
  private nextSplashTime: number = 0;

  // Active Parameters
  private params: RainParameters = { ...DEFAULT_RAIN_PARAMETERS };

  // Sleep Timer Fade
  private fadeIntervalId: ReturnType<typeof setInterval> | null = null;

  /**
   * Initializes the engine with either an existing AudioContext or creates a new one.
   */
  public async initialize(
    audioContext?: AudioContext,
    destination?: AudioNode
  ): Promise<void> {
    if (this.state !== 'uninitialized' && this.ctx) {
      if (destination && this.masterGain && this.destinationNode !== destination) {
        try {
          this.masterGain.disconnect();
          this.masterGain.connect(destination);
          this.destinationNode = destination;
        } catch {
          // ignore reconnection errors
        }
      }
      return;
    }

    if (audioContext) {
      this.ctx = audioContext;
      this.isExternalContext = true;
    } else {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
      this.isExternalContext = false;
    }

    this.destinationNode = destination || this.ctx.destination;

    // Build Master Bus
    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.setValueAtTime(this.params.volume, this.ctx.currentTime);
    this.masterGain.connect(this.destinationNode);

    // Build Layer A (Rain Bed)
    this.bedGain = this.ctx.createGain();
    this.bedHighPass = this.ctx.createBiquadFilter();
    this.bedHighPass.type = 'highpass';
    this.bedHighPass.frequency.setValueAtTime(110, this.ctx.currentTime);

    this.bedLowPass = this.ctx.createBiquadFilter();
    this.bedLowPass.type = 'lowpass';
    this.bedLowPass.Q.setValueAtTime(0.7, this.ctx.currentTime);
    this.updateBedFilterCutoff(this.params.intensity);

    this.bedPeakFilter = this.ctx.createBiquadFilter();
    this.bedPeakFilter.type = 'peaking';
    this.bedPeakFilter.frequency.setValueAtTime(650, this.ctx.currentTime);
    this.bedPeakFilter.gain.setValueAtTime(2.5, this.ctx.currentTime);
    this.bedPeakFilter.Q.setValueAtTime(1.0, this.ctx.currentTime);

    this.bedHighPass.connect(this.bedPeakFilter);
    this.bedPeakFilter.connect(this.bedLowPass);
    this.bedLowPass.connect(this.bedGain);
    this.bedGain.connect(this.masterGain);

    // Build Layer B (Patter) Bus
    this.patterGain = this.ctx.createGain();
    this.updatePatterGain(this.params.dropDensity);
    this.patterGain.connect(this.masterGain);

    // Build Layer C (Splash) Bus
    this.splashGain = this.ctx.createGain();
    this.updateSplashGain(this.params.splashDensity);
    this.splashGain.connect(this.masterGain);

    // Synthesize organic stereo noise buffer for Layer A
    this.bedBuffer = createRainBedBuffer(this.ctx, 10);

    // Start subtle organic micro-drift LFO
    this.startOrganicDrift();

    this.state = 'stopped';
  }

  /**
   * Starts or resumes rain playback smoothly without clicks.
   */
  public async play(): Promise<void> {
    if (!this.ctx) {
      await this.initialize();
    }
    if (!this.ctx) return;

    if (this.ctx.state === 'suspended') {
      await this.ctx.resume();
    }

    if (this.state === 'playing') return;

    // Start Layer A Looping Source
    this.startBedSource();

    // Start Stochastic Schedulers for Layers B & C
    this.isScheduling = true;
    this.nextPatterTime = this.ctx.currentTime + 0.05;
    this.nextSplashTime = this.ctx.currentTime + 0.2;
    this.scheduleRainLoop();

    // Smooth fade in
    if (this.masterGain) {
      const now = this.ctx.currentTime;
      this.masterGain.gain.cancelScheduledValues(now);
      this.masterGain.gain.setValueAtTime(0.001, now);
      this.masterGain.gain.exponentialRampToValueAtTime(
        Math.max(0.001, this.params.volume),
        now + 0.8
      );
    }

    this.state = 'playing';
  }

  /**
   * Pauses audio playback with a gentle 300ms fade to avoid clicks.
   */
  public pause(): void {
    if (!this.ctx || this.state !== 'playing') return;

    const now = this.ctx.currentTime;
    if (this.masterGain) {
      this.masterGain.gain.cancelScheduledValues(now);
      this.masterGain.gain.setValueAtTime(this.masterGain.gain.value, now);
      this.masterGain.gain.linearRampToValueAtTime(0.0001, now + 0.3);
    }

    setTimeout(() => {
      this.stopBedSource();
      this.isScheduling = false;
      if (this.schedulerTimerId) {
        clearTimeout(this.schedulerTimerId);
        this.schedulerTimerId = null;
      }
      this.state = 'paused';
    }, 320);
  }

  /**
   * Resumes paused audio.
   */
  public async resume(): Promise<void> {
    await this.play();
  }

  /**
   * Completely stops playback and resets scheduled transients.
   */
  public stop(): void {
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    if (this.masterGain) {
      this.masterGain.gain.cancelScheduledValues(now);
      this.masterGain.gain.setValueAtTime(this.masterGain.gain.value, now);
      this.masterGain.gain.linearRampToValueAtTime(0.0001, now + 0.2);
    }

    setTimeout(() => {
      this.stopBedSource();
      this.isScheduling = false;
      if (this.schedulerTimerId) {
        clearTimeout(this.schedulerTimerId);
        this.schedulerTimerId = null;
      }
      this.state = 'stopped';
    }, 220);
  }

  /**
   * Real-time Master Volume Control (0.0 to 1.0)
   */
  public setVolume(value: number): void {
    this.params.volume = Math.max(0, Math.min(1, value));
    if (this.masterGain && this.ctx && this.state === 'playing') {
      const now = this.ctx.currentTime;
      this.masterGain.gain.cancelScheduledValues(now);
      this.masterGain.gain.setValueAtTime(this.masterGain.gain.value, now);
      this.masterGain.gain.linearRampToValueAtTime(Math.max(0.0001, this.params.volume), now + 0.08);
    }
  }

  /**
   * Real-time Rain Intensity Control (0.0 to 1.0)
   * Modulates the acoustic fullness, low-pass cutoff, and bed presence.
   */
  public setRainIntensity(value: number): void {
    this.params.intensity = Math.max(0, Math.min(1, value));
    this.updateBedFilterCutoff(this.params.intensity);
  }

  /**
   * Real-time Raindrop Detail / Density Control (0.0 to 1.0)
   * Controls the rate and presence of irregular foreground raindrops.
   */
  public setDropDensity(value: number): void {
    this.params.dropDensity = Math.max(0, Math.min(1, value));
    this.updatePatterGain(this.params.dropDensity);
  }

  /**
   * Real-time Splash Density Control (0.0 to 1.0)
   * Controls the frequency of gentle water droplets and surface puddles.
   */
  public setSplashDensity(value: number): void {
    this.params.splashDensity = Math.max(0, Math.min(1, value));
    this.updateSplashGain(this.params.splashDensity);
  }

  /**
   * Real-time Stereo Width Control (0.0 to 1.0)
   */
  public setStereoWidth(value: number): void {
    this.params.stereoWidth = Math.max(0, Math.min(1, value));
  }

  /**
   * Applies all parameters at once (e.g., when switching presets)
   */
  public setParameters(params: Partial<RainParameters>): void {
    if (params.volume !== undefined) this.setVolume(params.volume);
    if (params.intensity !== undefined) this.setRainIntensity(params.intensity);
    if (params.dropDensity !== undefined) this.setDropDensity(params.dropDensity);
    if (params.splashDensity !== undefined) this.setSplashDensity(params.splashDensity);
    if (params.stereoWidth !== undefined) this.setStereoWidth(params.stereoWidth);
  }

  public getParameters(): RainParameters {
    return { ...this.params };
  }

  public getState(): RainEngineState {
    return this.state;
  }

  /**
   * Smooth Sleep Timer Fade-out
   */
  public startSleepTimerFade(durationMinutes: number, onComplete?: () => void): void {
    if (this.fadeIntervalId) clearInterval(this.fadeIntervalId);
    if (!this.ctx || this.state !== 'playing') return;

    const totalSeconds = durationMinutes * 60;
    const fadeStartSeconds = Math.min(60, totalSeconds * 0.2); // Fade over final 60 seconds (or 20% of timer)
    const fadeStartTime = totalSeconds - fadeStartSeconds;

    let elapsed = 0;
    this.fadeIntervalId = setInterval(() => {
      elapsed++;
      if (elapsed >= fadeStartTime && this.masterGain && this.ctx) {
        const remaining = totalSeconds - elapsed;
        const fadeRatio = Math.max(0, remaining / fadeStartSeconds);
        const currentTarget = this.params.volume * fadeRatio;
        this.masterGain.gain.setValueAtTime(Math.max(0.0001, currentTarget), this.ctx.currentTime);
      }

      if (elapsed >= totalSeconds) {
        if (this.fadeIntervalId) clearInterval(this.fadeIntervalId);
        this.fadeIntervalId = null;
        this.stop();
        if (onComplete) onComplete();
      }
    }, 1000);
  }

  public cancelSleepTimer(): void {
    if (this.fadeIntervalId) {
      clearInterval(this.fadeIntervalId);
      this.fadeIntervalId = null;
    }
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(this.params.volume, this.ctx.currentTime);
    }
  }

  /**
   * Clean destruction and release of AudioNodes and timers.
   */
  public destroy(): void {
    this.stop();
    if (this.driftLfoTimer) {
      clearInterval(this.driftLfoTimer);
      this.driftLfoTimer = null;
    }
    if (this.fadeIntervalId) {
      clearInterval(this.fadeIntervalId);
      this.fadeIntervalId = null;
    }
    if (!this.isExternalContext && this.ctx) {
      try {
        this.ctx.close();
      } catch {
        // ignore close error
      }
    }
    this.ctx = null;
    this.masterGain = null;
    this.bedGain = null;
    this.patterGain = null;
    this.splashGain = null;
    this.state = 'uninitialized';
  }

  // =========================================================================
  // Private Audio Synthesis & Scheduling Methods
  // =========================================================================

  private startBedSource(): void {
    if (!this.ctx || !this.bedBuffer || !this.bedHighPass) return;
    this.stopBedSource();

    this.bedSource = this.ctx.createBufferSource();
    this.bedSource.buffer = this.bedBuffer;
    this.bedSource.loop = true;
    this.bedSource.connect(this.bedHighPass);
    this.bedSource.start();
  }

  private stopBedSource(): void {
    if (this.bedSource) {
      try {
        this.bedSource.stop();
        this.bedSource.disconnect();
      } catch {
        // already stopped
      }
      this.bedSource = null;
    }
  }

  private updateBedFilterCutoff(intensity: number): void {
    if (!this.ctx || !this.bedLowPass || !this.bedGain) return;
    const now = this.ctx.currentTime;

    // Map intensity (0.0 - 1.0) to warm frequency curve (2.1kHz to 4.8kHz)
    // Reference acoustic calibration: never exceed 5.2kHz to preserve soothing warmth
    const targetCutoff = 2100 + Math.pow(intensity, 1.4) * 2700;
    const targetBedGain = 0.45 + intensity * 0.45;

    this.bedLowPass.frequency.cancelScheduledValues(now);
    this.bedLowPass.frequency.setTargetAtTime(targetCutoff, now, 0.15);

    this.bedGain.gain.cancelScheduledValues(now);
    this.bedGain.gain.setTargetAtTime(targetBedGain, now, 0.15);
  }

  private updatePatterGain(density: number): void {
    if (!this.ctx || !this.patterGain) return;
    const now = this.ctx.currentTime;
    const targetGain = 0.2 + density * 0.55;
    this.patterGain.gain.cancelScheduledValues(now);
    this.patterGain.gain.setTargetAtTime(targetGain, now, 0.1);
  }

  private updateSplashGain(density: number): void {
    if (!this.ctx || !this.splashGain) return;
    const now = this.ctx.currentTime;
    const targetGain = 0.15 + density * 0.4;
    this.splashGain.gain.cancelScheduledValues(now);
    this.splashGain.gain.setTargetAtTime(targetGain, now, 0.1);
  }

  /**
   * Organic breathing drift: slowly alters bed filter cutoff by +/- 4% every 3.5s
   * preventing any synthetic monotony over hours of listening.
   */
  private startOrganicDrift(): void {
    if (this.driftLfoTimer) clearInterval(this.driftLfoTimer);
    this.driftLfoTimer = setInterval(() => {
      if (this.ctx && this.bedLowPass && this.state === 'playing') {
        const driftFactor = 1.0 + (Math.random() * 0.08 - 0.04);
        const baseCutoff = 2100 + Math.pow(this.params.intensity, 1.4) * 2700;
        const drifted = baseCutoff * driftFactor;
        this.bedLowPass.frequency.setTargetAtTime(drifted, this.ctx.currentTime, 1.8);
      }
    }, 3500);
  }

  /**
   * Lookahead stochastic scheduler for Layer B (Patter) and Layer C (Splashes)
   */
  private scheduleRainLoop = (): void => {
    if (!this.isScheduling || !this.ctx || this.state !== 'playing') return;

    const scheduleAheadTime = 0.25; // 250ms lookahead
    const currentTime = this.ctx.currentTime;

    // Schedule Layer B: Raindrop Patter events (Poisson distribution)
    while (this.nextPatterTime < currentTime + scheduleAheadTime) {
      this.triggerRaindropPatterEvent(this.nextPatterTime);

      // Average interval inversely proportional to dropDensity (30 to 110 drops/second)
      const baseRate = 35 + this.params.dropDensity * 75;
      const interval = (-Math.log(1.0 - Math.random()) / baseRate);
      this.nextPatterTime += Math.max(0.005, interval);
    }

    // Schedule Layer C: Water Splash / Droplet events (Sparse: 0.3 to 2.2 per second)
    while (this.nextSplashTime < currentTime + scheduleAheadTime) {
      if (Math.random() < (0.25 + this.params.splashDensity * 0.75)) {
        this.triggerSplashEvent(this.nextSplashTime);
      }
      const splashInterval = (1.2 / (0.4 + this.params.splashDensity * 1.6)) * (0.6 + Math.random() * 0.8);
      this.nextSplashTime += Math.max(0.2, splashInterval);
    }

    this.schedulerTimerId = setTimeout(this.scheduleRainLoop, 75);
  };

  /**
   * Synthesizes an individual micro-transient raindrop patter
   */
  private triggerRaindropPatterEvent(time: number): void {
    if (!this.ctx || !this.patterGain) return;

    try {
      // Noise burst through dynamic bandpass
      const burstLength = 0.015 + Math.random() * 0.025; // 15ms - 40ms
      const buffer = this.ctx.createBuffer(1, Math.floor(this.ctx.sampleRate * burstLength), this.ctx.sampleRate);
      const data = buffer.getChannelData(0);

      // Fill with shaped noise transient
      for (let i = 0; i < data.length; i++) {
        const white = Math.random() * 2 - 1;
        const progress = i / data.length;
        const env = Math.exp(-progress * 5); // Smooth exponential decay
        data[i] = white * env * 0.35;
      }

      const source = this.ctx.createBufferSource();
      source.buffer = buffer;

      // Random bandpass frequency between 1.1kHz and 3.6kHz
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      const centerFreq = 1100 + Math.random() * 2500;
      filter.frequency.setValueAtTime(centerFreq, time);
      filter.Q.setValueAtTime(1.8 + Math.random() * 2.2, time);

      // Dynamic Gain envelope
      const gain = this.ctx.createGain();
      const dropVolume = (0.08 + Math.random() * 0.22) * (0.6 + this.params.dropDensity * 0.4);
      gain.gain.setValueAtTime(0.001, time);
      gain.gain.linearRampToValueAtTime(dropVolume, time + 0.002);
      gain.gain.exponentialRampToValueAtTime(0.0001, time + burstLength);

      // Stereo Panning (-0.85 to +0.85 scaled by stereoWidth)
      const panner = this.ctx.createStereoPanner();
      const panPos = (Math.random() * 1.7 - 0.85) * this.params.stereoWidth;
      panner.pan.setValueAtTime(panPos, time);

      source.connect(filter);
      filter.connect(gain);
      gain.connect(panner);
      panner.connect(this.patterGain);

      source.start(time);
      source.stop(time + burstLength + 0.01);
    } catch {
      // Drop scheduling fallback
    }
  }

  /**
   * Synthesizes an organic resonant water droplet / splash
   */
  private triggerSplashEvent(time: number): void {
    if (!this.ctx || !this.splashGain) return;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const panner = this.ctx.createStereoPanner();

      // Pitch sweep downward: simulates surface tension drop splash
      const startPitch = 1200 + Math.random() * 800; // 1.2kHz to 2.0kHz
      const endPitch = startPitch * (0.65 + Math.random() * 0.15); // drops down
      const duration = 0.045 + Math.random() * 0.035; // 45ms to 80ms

      osc.type = 'sine';
      osc.frequency.setValueAtTime(startPitch, time);
      osc.frequency.exponentialRampToValueAtTime(Math.max(100, endPitch), time + duration);

      // Very soft gain staging to prevent startling
      const splashVolume = (0.03 + Math.random() * 0.06) * (0.5 + this.params.splashDensity * 0.5);
      gain.gain.setValueAtTime(0.001, time);
      gain.gain.linearRampToValueAtTime(splashVolume, time + 0.004);
      gain.gain.exponentialRampToValueAtTime(0.0001, time + duration);

      const panPos = (Math.random() * 1.6 - 0.8) * this.params.stereoWidth;
      panner.pan.setValueAtTime(panPos, time);

      osc.connect(gain);
      gain.connect(panner);
      panner.connect(this.splashGain);

      osc.start(time);
      osc.stop(time + duration + 0.01);
    } catch {
      // Splash scheduling fallback
    }
  }
}

// Singleton instance
export const rainAudioEngine = new RainAudioEngine();
