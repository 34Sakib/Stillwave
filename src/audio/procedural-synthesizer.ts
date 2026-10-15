/**
 * Procedural Web Audio API Sound Synthesizer
 * Synthesizes acoustic soundscapes natively in the browser without external audio assets.
 * Ported from STILLWAVE acoustic synthesis specification.
 */

interface ActiveSynthesizerChain {
  soundId: string;
  outputGain: GainNode;
  nodes: (AudioNode & { stop?: (when?: number) => void })[];
  timers: ReturnType<typeof setInterval>[];
}

class ProceduralSynthesizer {
  private bufs: Record<string, AudioBuffer> = {};
  private activeChain: ActiveSynthesizerChain | null = null;

  private getNoiseBuffer(ctx: AudioContext, type: 'white' | 'pink' | 'brown'): AudioBuffer {
    if (this.bufs[type] && this.bufs[type].sampleRate === ctx.sampleRate) {
      return this.bufs[type];
    }

    const length = ctx.sampleRate * 5;
    const buffer = ctx.createBuffer(1, length, ctx.sampleRate);
    const data = buffer.getChannelData(0);

    let lastOut = 0;
    let b0 = 0,
      b1 = 0,
      b2 = 0;

    for (let i = 0; i < length; i++) {
      const white = Math.random() * 2 - 1;
      if (type === 'brown') {
        lastOut = (lastOut + 0.02 * white) / 1.02;
        data[i] = lastOut * 3.5;
      } else if (type === 'pink') {
        b0 = 0.99765 * b0 + white * 0.099;
        b1 = 0.963 * b1 + white * 0.2965;
        b2 = 0.57 * b2 + white * 1.05;
        data[i] = (b0 + b1 + b2 + white * 0.18) * 0.2;
      } else {
        data[i] = white;
      }
    }

    this.bufs[type] = buffer;
    return buffer;
  }

  private createNoiseSource(
    ctx: AudioContext,
    type: 'white' | 'pink' | 'brown'
  ): AudioBufferSourceNode {
    const src = ctx.createBufferSource();
    src.buffer = this.getNoiseBuffer(ctx, type);
    src.loop = true;
    src.start();
    return src;
  }

  private createFilter(
    ctx: AudioContext,
    type: BiquadFilterType,
    freq: number,
    q?: number
  ): BiquadFilterNode {
    const f = ctx.createBiquadFilter();
    f.type = type;
    f.frequency.setValueAtTime(freq, ctx.currentTime);
    if (q !== undefined) {
      f.Q.setValueAtTime(q, ctx.currentTime);
    }
    return f;
  }

  private createGain(ctx: AudioContext, value: number): GainNode {
    const g = ctx.createGain();
    g.gain.setValueAtTime(value, ctx.currentTime);
    return g;
  }

  private chainNodes(...nodes: AudioNode[]): AudioNode {
    for (let i = 0; i < nodes.length - 1; i++) {
      nodes[i].connect(nodes[i + 1]);
    }
    return nodes[0];
  }

  private addLfo(
    ctx: AudioContext,
    param: AudioParam,
    rate: number,
    depth: number,
    nodesList: (AudioNode & { stop?: (when?: number) => void })[]
  ): void {
    const osc = ctx.createOscillator();
    osc.frequency.setValueAtTime(rate, ctx.currentTime);
    const depthGain = this.createGain(ctx, depth);
    osc.connect(depthGain);
    depthGain.connect(param);
    osc.start();
    nodesList.push(osc, depthGain);
  }

  private triggerBurst(
    ctx: AudioContext,
    out: AudioNode,
    dur: number,
    vol: number,
    highpassFreq: number
  ): void {
    const src = ctx.createBufferSource();
    src.buffer = this.getNoiseBuffer(ctx, 'white');
    const g = this.createGain(ctx, 0);
    const t = ctx.currentTime;
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(vol, t + 0.004);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);

    const filter = this.createFilter(ctx, 'highpass', highpassFreq);
    this.chainNodes(src, filter, g, out);
    src.start(t, Math.random() * 3, dur + 0.05);
  }

  public hasSynthesisFor(soundId: string): boolean {
    const id = this.canonicalId(soundId);
    return [
      'rain',
      'ocean',
      'forest',
      'fireplace',
      'wind',
      'night',
      'zen-bowls',
      'stream',
      'brown-noise',
      'thunder',
      'snow',
      'lake',
      'cocoon',
      'chimes',
      'musicbox',
      'drizzle',
      'cloud',
      'haze',
      'om',
      'tide',
    ].includes(id);
  }

  private canonicalId(id: string): string {
    switch (id) {
      case 'fire':
        return 'fireplace';
      case 'breeze':
        return 'wind';
      case 'meadow':
        return 'night';
      case 'bowls':
        return 'zen-bowls';
      case 'brown':
        return 'brown-noise';
      default:
        return id;
    }
  }

  public startSound(
    soundId: string,
    ctx: AudioContext,
    destination: AudioNode,
    targetVolume = 0.7
  ): void {
    this.stopSound(0.6);

    const cid = this.canonicalId(soundId);
    const outGain = this.createGain(ctx, 0);
    outGain.connect(destination);

    const nodes: (AudioNode & { stop?: (when?: number) => void })[] = [];
    const timers: ReturnType<typeof setInterval>[] = [];

    switch (cid) {
      case 'snow': {
        const g = this.createGain(ctx, 0.2);
        const pinkSrc = this.createNoiseSource(ctx, 'pink');
        const pinkFilter = this.createFilter(ctx, 'lowpass', 1800);
        nodes.push(this.chainNodes(pinkSrc, pinkFilter, g, outGain));
        this.addLfo(ctx, g.gain, 0.05, 0.08, nodes);

        const brownSrc = this.createNoiseSource(ctx, 'brown');
        const brownFilter = this.createFilter(ctx, 'lowpass', 220);
        const brownGain = this.createGain(ctx, 0.22);
        nodes.push(this.chainNodes(brownSrc, brownFilter, brownGain, outGain));
        break;
      }

      case 'lake': {
        const g = this.createGain(ctx, 0.3);
        const brownSrc = this.createNoiseSource(ctx, 'brown');
        const brownFilter = this.createFilter(ctx, 'lowpass', 450);
        nodes.push(this.chainNodes(brownSrc, brownFilter, g, outGain));
        this.addLfo(ctx, g.gain, 0.22, 0.18, nodes);

        const pinkSrc = this.createNoiseSource(ctx, 'pink');
        const pinkFilter = this.createFilter(ctx, 'bandpass', 900, 0.6);
        const pinkGain = this.createGain(ctx, 0.05);
        nodes.push(this.chainNodes(pinkSrc, pinkFilter, pinkGain, outGain));

        timers.push(
          setInterval(() => {
            if (Math.random() < 0.5) {
              const s = ctx.createOscillator();
              const q = this.createGain(ctx, 0);
              const tt = ctx.currentTime;
              s.frequency.setValueAtTime(500 + Math.random() * 300, tt);
              s.frequency.exponentialRampToValueAtTime(900, tt + 0.08);
              q.gain.linearRampToValueAtTime(0.05, tt + 0.01);
              q.gain.exponentialRampToValueAtTime(0.0001, tt + 0.15);
              this.chainNodes(s, q, outGain);
              s.start(tt);
              s.stop(tt + 0.2);
            }
          }, 1800)
        );
        break;
      }

      case 'cocoon': {
        [55, 55.4, 82.4, 110].forEach((freq, i) => {
          const osc = ctx.createOscillator();
          osc.frequency.setValueAtTime(freq, ctx.currentTime);
          const g = this.createGain(ctx, 0.1 / (i + 1));
          this.chainNodes(osc, g, outGain);
          osc.start();
          nodes.push(osc, g);
        });
        const brownGain = this.createGain(ctx, 0.45);
        const brownSrc = this.createNoiseSource(ctx, 'brown');
        const brownFilter = this.createFilter(ctx, 'lowpass', 260);
        nodes.push(this.chainNodes(brownSrc, brownFilter, brownGain, outGain));
        this.addLfo(ctx, brownGain.gain, 1.1, 0.18, nodes);
        break;
      }

      case 'chimes': {
        const pinkSrc = this.createNoiseSource(ctx, 'pink');
        const pinkFilter = this.createFilter(ctx, 'lowpass', 400);
        const pinkGain = this.createGain(ctx, 0.05);
        nodes.push(this.chainNodes(pinkSrc, pinkFilter, pinkGain, outGain));

        const pitches = [523.25, 587.33, 659.25, 783.99, 880, 1046.5];
        const playChime = () => {
          const osc = ctx.createOscillator();
          const q = this.createGain(ctx, 0);
          const tt = ctx.currentTime;
          osc.frequency.setValueAtTime(pitches[Math.floor(Math.random() * pitches.length)], tt);
          q.gain.linearRampToValueAtTime(0.09, tt + 0.01);
          q.gain.exponentialRampToValueAtTime(0.0001, tt + 4);
          this.chainNodes(osc, q, outGain);
          osc.start(tt);
          osc.stop(tt + 4.2);
        };
        playChime();
        timers.push(
          setInterval(() => {
            if (Math.random() < 0.7) playChime();
          }, 1400)
        );
        break;
      }

      case 'musicbox': {
        const pinkSrc = this.createNoiseSource(ctx, 'pink');
        const pinkFilter = this.createFilter(ctx, 'lowpass', 500);
        const pinkGain = this.createGain(ctx, 0.04);
        nodes.push(this.chainNodes(pinkSrc, pinkFilter, pinkGain, outGain));

        const notes = [392, 523.25, 659.25, 523.25, 440, 587.33, 698.46, 587.33];
        let noteIndex = 0;
        const playMusicNote = () => {
          const osc = ctx.createOscillator();
          const q = this.createGain(ctx, 0);
          const tt = ctx.currentTime;
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(notes[noteIndex++ % notes.length], tt);
          q.gain.linearRampToValueAtTime(0.1, tt + 0.01);
          q.gain.exponentialRampToValueAtTime(0.0001, tt + 1.8);
          this.chainNodes(osc, q, outGain);
          osc.start(tt);
          osc.stop(tt + 2);
        };
        playMusicNote();
        timers.push(setInterval(playMusicNote, 650));
        break;
      }

      case 'drizzle': {
        const pinkSrc = this.createNoiseSource(ctx, 'pink');
        const pinkFilter = this.createFilter(ctx, 'bandpass', 2500, 0.5);
        const pinkGain = this.createGain(ctx, 0.18);
        nodes.push(this.chainNodes(pinkSrc, pinkFilter, pinkGain, outGain));

        const brownSrc = this.createNoiseSource(ctx, 'brown');
        const brownFilter = this.createFilter(ctx, 'lowpass', 250);
        const brownGain = this.createGain(ctx, 0.15);
        nodes.push(this.chainNodes(brownSrc, brownFilter, brownGain, outGain));

        timers.push(
          setInterval(() => {
            if (Math.random() < 0.6) {
              this.triggerBurst(ctx, outGain, 0.05, 0.06 + Math.random() * 0.08, 2500);
            }
          }, 140)
        );
        break;
      }

      case 'cloud': {
        [130.8, 164.8, 196, 246.9].forEach((freq, i) => {
          const osc = ctx.createOscillator();
          const g = this.createGain(ctx, 0.05);
          osc.frequency.setValueAtTime(freq, ctx.currentTime);
          osc.detune.setValueAtTime((i - 1.5) * 4, ctx.currentTime);
          this.chainNodes(osc, g, outGain);
          osc.start();
          nodes.push(osc, g);
          this.addLfo(ctx, g.gain, 0.04 + i * 0.017, 0.03, nodes);
        });
        const pinkSrc = this.createNoiseSource(ctx, 'pink');
        const pinkFilter = this.createFilter(ctx, 'lowpass', 700);
        const pinkGain = this.createGain(ctx, 0.12);
        nodes.push(this.chainNodes(pinkSrc, pinkFilter, pinkGain, outGain));
        break;
      }

      case 'haze': {
        const pinkSrc = this.createNoiseSource(ctx, 'pink');
        const pinkFilter = this.createFilter(ctx, 'lowpass', 2400);
        const pinkGain = this.createGain(ctx, 0.75);
        nodes.push(this.chainNodes(pinkSrc, pinkFilter, pinkGain, outGain));
        break;
      }

      case 'om': {
        [68.05, 136.1, 272.2, 408.3].forEach((freq, i) => {
          const osc = ctx.createOscillator();
          const g = this.createGain(ctx, 0.14 / (i + 1));
          osc.frequency.setValueAtTime(freq, ctx.currentTime);
          this.chainNodes(osc, g, outGain);
          osc.start();
          nodes.push(osc, g);
          if (i === 1) {
            this.addLfo(ctx, g.gain, 0.07, 0.05, nodes);
          }
        });
        const brownSrc = this.createNoiseSource(ctx, 'brown');
        const brownFilter = this.createFilter(ctx, 'lowpass', 200);
        const brownGain = this.createGain(ctx, 0.2);
        nodes.push(this.chainNodes(brownSrc, brownFilter, brownGain, outGain));
        break;
      }

      case 'tide': {
        const brownGain = this.createGain(ctx, 0.4);
        const brownSrc = this.createNoiseSource(ctx, 'brown');
        const brownFilter = this.createFilter(ctx, 'lowpass', 600);
        nodes.push(this.chainNodes(brownSrc, brownFilter, brownGain, outGain));
        this.addLfo(ctx, brownGain.gain, 0.083, 0.36, nodes);

        const osc = ctx.createOscillator();
        osc.frequency.setValueAtTime(110, ctx.currentTime);
        const oscGain = this.createGain(ctx, 0.04);
        this.chainNodes(osc, oscGain, outGain);
        osc.start();
        nodes.push(osc, oscGain);
        break;
      }

      // Procedural fallback generators for core sounds:
      case 'rain': {
        const pSrc = this.createNoiseSource(ctx, 'pink');
        const pHigh = this.createFilter(ctx, 'highpass', 700);
        const pLow = this.createFilter(ctx, 'lowpass', 7000);
        const pGain = this.createGain(ctx, 0.55);
        nodes.push(this.chainNodes(pSrc, pHigh, pLow, pGain, outGain));

        const bSrc = this.createNoiseSource(ctx, 'brown');
        const bLow = this.createFilter(ctx, 'lowpass', 300);
        const bGain = this.createGain(ctx, 0.12);
        nodes.push(this.chainNodes(bSrc, bLow, bGain, outGain));
        break;
      }

      case 'ocean': {
        const bGain = this.createGain(ctx, 0.45);
        const bSrc = this.createNoiseSource(ctx, 'brown');
        const bLow = this.createFilter(ctx, 'lowpass', 650);
        nodes.push(this.chainNodes(bSrc, bLow, bGain, outGain));
        this.addLfo(ctx, bGain.gain, 0.09, 0.35, nodes);

        const pGain = this.createGain(ctx, 0.04);
        const pSrc = this.createNoiseSource(ctx, 'pink');
        const pHigh = this.createFilter(ctx, 'highpass', 2500);
        nodes.push(this.chainNodes(pSrc, pHigh, pGain, outGain));
        this.addLfo(ctx, pGain.gain, 0.09, 0.04, nodes);
        break;
      }

      case 'forest': {
        const pSrc = this.createNoiseSource(ctx, 'pink');
        const pBand = this.createFilter(ctx, 'bandpass', 1800, 0.4);
        const pGain = this.createGain(ctx, 0.12);
        nodes.push(this.chainNodes(pSrc, pBand, pGain, outGain));

        const bSrc = this.createNoiseSource(ctx, 'brown');
        const bLow = this.createFilter(ctx, 'lowpass', 400);
        const bGain = this.createGain(ctx, 0.3);
        nodes.push(this.chainNodes(bSrc, bLow, bGain, outGain));

        timers.push(
          setInterval(() => {
            if (Math.random() < 0.6) {
              const s = ctx.createOscillator();
              const g = this.createGain(ctx, 0);
              const tt = ctx.currentTime;
              const f = 2600 + Math.random() * 1400;
              s.frequency.setValueAtTime(f, tt);
              s.frequency.exponentialRampToValueAtTime(f * 1.3, tt + 0.12);
              g.gain.linearRampToValueAtTime(0.04, tt + 0.03);
              g.gain.exponentialRampToValueAtTime(0.0001, tt + 0.22);
              this.chainNodes(s, g, outGain);
              s.start(tt);
              s.stop(tt + 0.3);
            }
          }, 1300)
        );
        break;
      }

      case 'fireplace': {
        const bSrc = this.createNoiseSource(ctx, 'brown');
        const bLow = this.createFilter(ctx, 'lowpass', 900);
        const bGain = this.createGain(ctx, 0.6);
        nodes.push(this.chainNodes(bSrc, bLow, bGain, outGain));

        timers.push(
          setInterval(() => {
            if (Math.random() < 0.4) {
              this.triggerBurst(
                ctx,
                outGain,
                0.03 + Math.random() * 0.07,
                0.1 + Math.random() * 0.2,
                1200 + Math.random() * 2500
              );
            }
          }, 80)
        );
        break;
      }

      case 'wind': {
        const f = this.createFilter(ctx, 'bandpass', 600, 0.8);
        const pSrc = this.createNoiseSource(ctx, 'pink');
        const pGain = this.createGain(ctx, 0.55);
        nodes.push(this.chainNodes(pSrc, f, pGain, outGain));
        this.addLfo(ctx, f.frequency, 0.07, 320, nodes);

        const bSrc = this.createNoiseSource(ctx, 'brown');
        const bLow = this.createFilter(ctx, 'lowpass', 250);
        const bGain = this.createGain(ctx, 0.25);
        nodes.push(this.chainNodes(bSrc, bLow, bGain, outGain));
        break;
      }

      case 'night': {
        const g = this.createGain(ctx, 0.02);
        const osc = ctx.createOscillator();
        osc.frequency.setValueAtTime(4300, ctx.currentTime);
        this.chainNodes(osc, g, outGain);
        osc.start();
        nodes.push(osc, g);
        this.addLfo(ctx, g.gain, 7, 0.02, nodes);

        [110, 164.8].forEach((freq) => {
          const p = ctx.createOscillator();
          p.frequency.setValueAtTime(freq, ctx.currentTime);
          const pg = this.createGain(ctx, 0.05);
          this.chainNodes(p, pg, outGain);
          p.start();
          nodes.push(p, pg);
        });

        const pSrc = this.createNoiseSource(ctx, 'pink');
        const pLow = this.createFilter(ctx, 'lowpass', 500);
        const pGain = this.createGain(ctx, 0.14);
        nodes.push(this.chainNodes(pSrc, pLow, pGain, outGain));
        break;
      }

      case 'zen-bowls': {
        const playBowlTones = () => {
          [1, 2.01, 2.98].forEach((m, idx) => {
            const s = ctx.createOscillator();
            const g = this.createGain(ctx, 0);
            const tt = ctx.currentTime;
            s.frequency.setValueAtTime(432 * m * 0.5, tt);
            g.gain.linearRampToValueAtTime(0.2 / (idx + 1), tt + 0.03);
            g.gain.exponentialRampToValueAtTime(0.0001, tt + 7);
            this.chainNodes(s, g, outGain);
            s.start(tt);
            s.stop(tt + 7.2);
          });
        };
        playBowlTones();
        timers.push(setInterval(playBowlTones, 7500));

        const pSrc = this.createNoiseSource(ctx, 'pink');
        const pLow = this.createFilter(ctx, 'lowpass', 300);
        const pGain = this.createGain(ctx, 0.03);
        nodes.push(this.chainNodes(pSrc, pLow, pGain, outGain));
        break;
      }

      case 'stream': {
        const pGain = this.createGain(ctx, 0.45);
        const pSrc = this.createNoiseSource(ctx, 'pink');
        const pHigh = this.createFilter(ctx, 'highpass', 1200);
        const pLow = this.createFilter(ctx, 'lowpass', 6500);
        nodes.push(this.chainNodes(pSrc, pHigh, pLow, pGain, outGain));
        this.addLfo(ctx, pGain.gain, 2.7, 0.07, nodes);

        const wSrc = this.createNoiseSource(ctx, 'white');
        const wBand = this.createFilter(ctx, 'bandpass', 3200, 1.5);
        const wGain = this.createGain(ctx, 0.04);
        nodes.push(this.chainNodes(wSrc, wBand, wGain, outGain));
        break;
      }

      case 'brown-noise': {
        const bSrc = this.createNoiseSource(ctx, 'brown');
        const bLow = this.createFilter(ctx, 'lowpass', 500);
        const bGain = this.createGain(ctx, 0.9);
        nodes.push(this.chainNodes(bSrc, bLow, bGain, outGain));
        break;
      }

      case 'thunder': {
        const bSrc1 = this.createNoiseSource(ctx, 'brown');
        const bLow1 = this.createFilter(ctx, 'lowpass', 180);
        const bGain1 = this.createGain(ctx, 0.35);
        nodes.push(this.chainNodes(bSrc1, bLow1, bGain1, outGain));

        const bSrc2 = this.createNoiseSource(ctx, 'brown');
        const bLow2 = this.createFilter(ctx, 'lowpass', 110);
        const bGain2 = this.createGain(ctx, 0.3);
        nodes.push(this.chainNodes(bSrc2, bLow2, bGain2, outGain));

        const rollThunder = () => {
          const tt = ctx.currentTime;
          bGain2.gain.cancelScheduledValues(tt);
          bGain2.gain.setValueAtTime(0.3, tt);
          bGain2.gain.linearRampToValueAtTime(1.6, tt + 1.2);
          bGain2.gain.linearRampToValueAtTime(0.3, tt + 5);
        };
        rollThunder();
        timers.push(setInterval(rollThunder, 11000));
        break;
      }
    }

    // Smooth entry crossfade
    const now = ctx.currentTime;
    outGain.gain.setValueAtTime(0.001, now);
    outGain.gain.linearRampToValueAtTime(targetVolume, now + 1.2);

    this.activeChain = {
      soundId: cid,
      outputGain: outGain,
      nodes,
      timers,
    };
  }

  public stopSound(fadeDurationSeconds = 0.8): void {
    if (!this.activeChain) return;

    const chain = this.activeChain;
    this.activeChain = null;

    chain.timers.forEach((t) => clearInterval(t));

    try {
      const now = chain.outputGain.context.currentTime;
      chain.outputGain.gain.cancelScheduledValues(now);
      chain.outputGain.gain.setValueAtTime(chain.outputGain.gain.value, now);
      chain.outputGain.gain.linearRampToValueAtTime(0.0001, now + fadeDurationSeconds);

      setTimeout(() => {
        chain.nodes.forEach((n) => {
          try {
            if (typeof n.stop === 'function') n.stop();
          } catch {
            // ignore
          }
          try {
            n.disconnect();
          } catch {
            // ignore
          }
        });
        try {
          chain.outputGain.disconnect();
        } catch {
          // ignore
        }
      }, fadeDurationSeconds * 1000 + 100);
    } catch {
      // ignore
    }
  }

  public setVolume(volume: number): void {
    if (this.activeChain) {
      const now = this.activeChain.outputGain.context.currentTime;
      this.activeChain.outputGain.gain.cancelScheduledValues(now);
      this.activeChain.outputGain.gain.linearRampToValueAtTime(
        Math.max(0, Math.min(1, volume)),
        now + 0.05
      );
    }
  }

  public getActiveSoundId(): string | null {
    return this.activeChain?.soundId ?? null;
  }
}

export const proceduralSynthesizer = new ProceduralSynthesizer();
