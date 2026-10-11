const fs = require('fs');
const path = require('path');

// =========================================================================
// WAV WRITER — with gentle sleep-friendly limiter
// =========================================================================
function createWavBuffer(sampleRate, durationSec, generateSamples) {
  const numChannels = 2;
  const bytesPerSample = 2;
  const totalSamples = Math.floor(sampleRate * durationSec);
  const blockAlign = numChannels * bytesPerSample;
  const byteRate = sampleRate * blockAlign;
  const dataSize = totalSamples * blockAlign;
  const buffer = Buffer.alloc(44 + dataSize);

  buffer.write('RIFF', 0);
  buffer.writeUInt32LE(36 + dataSize, 4);
  buffer.write('WAVE', 8);
  buffer.write('fmt ', 12);
  buffer.writeUInt32LE(16, 16);
  buffer.writeUInt16LE(1, 20);
  buffer.writeUInt16LE(numChannels, 22);
  buffer.writeUInt32LE(sampleRate, 24);
  buffer.writeUInt32LE(byteRate, 28);
  buffer.writeUInt16LE(blockAlign, 32);
  buffer.writeUInt16LE(bytesPerSample * 8, 34);
  buffer.write('data', 36);
  buffer.writeUInt32LE(dataSize, 40);

  const left = new Float32Array(totalSamples);
  const right = new Float32Array(totalSamples);
  generateSamples(left, right, totalSamples, sampleRate);

  // Seamless equal-power loop crossfade (2.5s)
  const fadeLength = Math.floor(sampleRate * 2.5);
  for (let i = 0; i < fadeLength; i++) {
    const t = i / fadeLength;
    const headWeight = Math.sin(t * Math.PI * 0.5);
    const tailWeight = Math.cos(t * Math.PI * 0.5);
    const tailIndex = totalSamples - fadeLength + i;
    const blendedLeft = left[i] * headWeight + left[tailIndex] * tailWeight;
    const blendedRight = right[i] * headWeight + right[tailIndex] * tailWeight;
    left[i] = blendedLeft;
    right[i] = blendedRight;
    left[tailIndex] = blendedLeft;
    right[tailIndex] = blendedRight;
  }

  // Sleep-friendly: gentle tanh saturation, then soft-knee limiter
  // Target RMS ~0.12 (-18 dBFS) for calm, non-fatiguing level
  let offset = 44;
  for (let i = 0; i < totalSamples; i++) {
    // Warm analog saturation (very gentle)
    let l = Math.tanh(left[i] * 0.95) * 0.90;
    let r = Math.tanh(right[i] * 0.95) * 0.90;

    // Soft-knee peak limiter at 0.92 to prevent any harsh clipping
    if (l > 0.92) l = 0.92 + (l - 0.92) * 0.4;
    else if (l < -0.92) l = -0.92 + (l + 0.92) * 0.4;
    if (r > 0.92) r = 0.92 + (r - 0.92) * 0.4;
    else if (r < -0.92) r = -0.92 + (r + 0.92) * 0.4;

    const intL = Math.max(-32767, Math.min(32767, Math.floor(l * 32767)));
    const intR = Math.max(-32767, Math.min(32767, Math.floor(r * 32767)));
    buffer.writeInt16LE(intL, offset);
    buffer.writeInt16LE(intR, offset + 2);
    offset += 4;
  }
  return buffer;
}

const SAMPLE_RATE = 44100;
const DURATION = 30; // 30s loop — longer = less perceived repetition for sleep

// =========================================================================
// FILTERS
// =========================================================================
class BiquadLP {
  constructor(cutoff, sampleRate, q = 0.707) {
    const w0 = 2 * Math.PI * cutoff / sampleRate;
    const alpha = Math.sin(w0) / (2 * q);
    const cosw0 = Math.cos(w0);
    const a0 = 1 + alpha;
    this.b0 = ((1 - cosw0) / 2) / a0;
    this.b1 = (1 - cosw0) / a0;
    this.b2 = ((1 - cosw0) / 2) / a0;
    this.a1 = (-2 * cosw0) / a0;
    this.a2 = (1 - alpha) / a0;
    this.x1 = 0; this.x2 = 0; this.y1 = 0; this.y2 = 0;
  }
  process(x) {
    const y = this.b0 * x + this.b1 * this.x1 + this.b2 * this.x2 - this.a1 * this.y1 - this.a2 * this.y2;
    this.x2 = this.x1; this.x1 = x;
    this.y2 = this.y1; this.y1 = y;
    return y;
  }
}

class BiquadHP {
  constructor(cutoff, sampleRate, q = 0.707) {
    const w0 = 2 * Math.PI * cutoff / sampleRate;
    const alpha = Math.sin(w0) / (2 * q);
    const cosw0 = Math.cos(w0);
    const a0 = 1 + alpha;
    this.b0 = ((1 + cosw0) / 2) / a0;
    this.b1 = (-(1 + cosw0)) / a0;
    this.b2 = ((1 + cosw0) / 2) / a0;
    this.a1 = (-2 * cosw0) / a0;
    this.a2 = (1 - alpha) / a0;
    this.x1 = 0; this.x2 = 0; this.y1 = 0; this.y2 = 0;
  }
  process(x) {
    const y = this.b0 * x + this.b1 * this.x1 + this.b2 * this.x2 - this.a1 * this.y1 - this.a2 * this.y2;
    this.x2 = this.x1; this.x1 = x;
    this.y2 = this.y1; this.y1 = y;
    return y;
  }
}

class BiquadBP {
  constructor(centerFreq, sampleRate, q = 2.0) {
    const w0 = 2 * Math.PI * centerFreq / sampleRate;
    const alpha = Math.sin(w0) / (2 * q);
    const a0 = 1 + alpha;
    this.b0 = alpha / a0;
    this.b1 = 0;
    this.b2 = -alpha / a0;
    this.a1 = (-2 * Math.cos(w0)) / a0;
    this.a2 = (1 - alpha) / a0;
    this.x1 = 0; this.x2 = 0; this.y1 = 0; this.y2 = 0;
  }
  process(x) {
    const y = this.b0 * x + this.b1 * this.x1 + this.b2 * this.x2 - this.a1 * this.y1 - this.a2 * this.y2;
    this.x2 = this.x1; this.x1 = x;
    this.y2 = this.y1; this.y1 = y;
    return y;
  }
}

// =========================================================================
// PINK & BROWN NOISE GENERATORS (shared, high quality)
// =========================================================================
class PinkNoise {
  constructor() {
    this.b0 = 0; this.b1 = 0; this.b2 = 0;
    this.b3 = 0; this.b4 = 0; this.b5 = 0; this.b6 = 0;
  }
  next() {
    const w = Math.random() * 2 - 1;
    this.b0 = 0.99886 * this.b0 + w * 0.0555179;
    this.b1 = 0.99332 * this.b1 + w * 0.0750759;
    this.b2 = 0.96900 * this.b2 + w * 0.1538520;
    this.b3 = 0.86650 * this.b3 + w * 0.3104856;
    this.b4 = 0.55000 * this.b4 + w * 0.5329522;
    this.b5 = -0.7616 * this.b5 - w * 0.0168980;
    const pink = this.b0 + this.b1 + this.b2 + this.b3 + this.b4 + this.b5 + this.b6 + w * 0.5362;
    this.b6 = w * 0.115926;
    return pink * 0.11;
  }
}

class BrownNoise {
  constructor() {
    this.value = 0;
  }
  next() {
    const w = Math.random() * 2 - 1;
    this.value = (this.value + 0.02 * w) / 1.02;
    return this.value * 3.5;
  }
}

// =========================================================================
// 1. RAIN — Individual droplet physics + smooth bed
// Each drop: sharp transient + resonant body + tiny noise splash.
// Drop sizes follow a power-law distribution (many small, few large).
// =========================================================================
function genCalmRain(left, right, totalSamples, sampleRate) {
  // Bed shaping: warm, no harsh highs. Sleep-friendly: rolloff above 5.5kHz.
  const bedLP_L = new BiquadLP(5500, sampleRate, 0.55);
  const bedLP_R = new BiquadLP(5500, sampleRate, 0.55);
  const bedHP_L = new BiquadHP(200, sampleRate, 0.7);
  const bedHP_R = new BiquadHP(200, sampleRate, 0.7);
  const bedPresence_L = new BiquadBP(900, sampleRate, 0.8);
  const bedPresence_R = new BiquadBP(900, sampleRate, 0.8);
  const bedWarmth_L = new BiquadLP(450, sampleRate, 1.0);
  const bedWarmth_R = new BiquadLP(450, sampleRate, 1.0);

  const pinkL = new PinkNoise();
  const pinkR = new PinkNoise();
  const brownL = new BrownNoise();
  const brownR = new BrownNoise();

  // Drop pool — individual resonant droplets
  const MAX_DROPS = 96;
  const drops = [];
  for (let i = 0; i < MAX_DROPS; i++) {
    drops.push({
      amp: 0, decay: 0, freq: 0, phase: 0,
      panL: 0.5, panR: 0.5, noiseAmt: 0, freqGlide: 0
    });
  }

  // Splash pool — surface impacts
  const MAX_SPLASHES = 40;
  const splashes = [];
  for (let i = 0; i < MAX_SPLASHES; i++) {
    splashes.push({ amp: 0, decay: 0, hpState: 0, panL: 0.5, panR: 0.5 });
  }

  for (let i = 0; i < totalSamples; i++) {
    // ===== BED (continuous, warm, calming) =====
    const pL = pinkL.next();
    const pR = pinkR.next();
    const bL = brownL.next();
    const bR = brownR.next();

    // Mix pink (bright) + brown (warm body) — more brown = warmer rain
    const rawBedL = pL * 0.55 + bL * 0.45;
    const rawBedR = pR * 0.55 + bR * 0.45;

    // Shape: cut sub-rumble, roll off highs, add warm presence
    const bedL = bedLP_L.process(rawBedL) * 0.55
               + bedHP_L.process(rawBedL) * 0.35
               + bedPresence_L.process(rawBedL) * 0.25
               + bedWarmth_L.process(rawBedL) * 0.40;
    const bedR = bedLP_R.process(rawBedR) * 0.55
               + bedHP_R.process(rawBedR) * 0.35
               + bedPresence_R.process(rawBedR) * 0.25
               + bedWarmth_R.process(rawBedR) * 0.40;

    // ===== DROPS =====
    // Spawn rate ~180 drops/sec/channel — realistic steady rainfall
    if (Math.random() < 0.0041) {
      const d = drops[Math.floor(Math.random() * MAX_DROPS)];
      // Power-law size distribution: mostly small, occasionally big
      const size = Math.pow(Math.random(), 2.2);
      d.amp = (0.06 + size * 0.30) * (0.7 + Math.random() * 0.6);
      // Larger drops → lower resonance, longer ring
      d.freq = 3200 - size * 2400 + Math.random() * 500;
      d.freqGlide = 0.9994 - size * 0.0004;
      d.decay = 0.9940 - size * 0.0055;
      d.phase = Math.random() * Math.PI * 2;
      d.noiseAmt = 0.35 + Math.random() * 0.45;
      // Random stereo placement
      const pan = Math.random();
      d.panL = Math.cos(pan * Math.PI * 0.5);
      d.panR = Math.sin(pan * Math.PI * 0.5);
    }

    let dropL = 0, dropR = 0;
    for (let k = 0; k < MAX_DROPS; k++) {
      const d = drops[k];
      if (d.amp < 0.00008) continue;
      d.phase += 2 * Math.PI * d.freq / sampleRate;
      const body = Math.sin(d.phase) * d.amp;
      const noise = (Math.random() * 2 - 1) * d.amp * d.noiseAmt * 0.28;
      const sample = body * 0.75 + noise * 0.25;
      dropL += sample * d.panL;
      dropR += sample * d.panR;
      d.amp *= d.decay;
      d.freq *= d.freqGlide;
    }

    // ===== SPLASHES =====
    if (Math.random() < 0.0009) {
      const s = splashes[Math.floor(Math.random() * MAX_SPLASHES)];
      s.amp = 0.10 + Math.random() * 0.18;
      s.decay = 0.86 + Math.random() * 0.07;
      const pan = Math.random();
      s.panL = Math.cos(pan * Math.PI * 0.5);
      s.panR = Math.sin(pan * Math.PI * 0.5);
    }

    let splashL = 0, splashR = 0;
    for (let k = 0; k < MAX_SPLASHES; k++) {
      const s = splashes[k];
      if (s.amp < 0.00008) continue;
      const noise = Math.random() * 2 - 1;
      s.hpState = s.hpState * 0.72 + noise * 0.28;
      const hpNoise = noise - s.hpState;
      const sample = hpNoise * s.amp;
      splashL += sample * s.panL;
      splashR += sample * s.panR;
      s.amp *= s.decay;
    }

    // ===== MIX: bed dominates (calm), drops add texture =====
    left[i] = bedL * 0.85 + dropL * 0.55 + splashL * 0.22;
    right[i] = bedR * 0.85 + dropR * 0.55 + splashR * 0.22;
  }
}

// =========================================================================
// 2. OCEAN — Deep rolling swells with realistic wave physics
// Physics: Wave envelope is asymmetric (slow build, fast crest, slow recede).
// Foam hiss is tied to wave breaking. Sub-bass gives oceanic pressure.
// Sleep-friendly: cut above 4kHz, warm low-mids, no harsh spray.
// =========================================================================
function genCalmOcean(left, right, totalSamples, sampleRate) {
  // Deep body
  const deepLP_L = new BiquadLP(160, sampleRate, 1.0);
  const deepLP_R = new BiquadLP(160, sampleRate, 1.0);
  const subPeak_L = new BiquadBP(60, sampleRate, 1.3);
  const subPeak_R = new BiquadBP(62, sampleRate, 1.3);
  const lowMid_L = new BiquadLP(320, sampleRate, 0.9);
  const lowMid_R = new BiquadLP(320, sampleRate, 0.9);

  // Foam — soft, rolled off highs
  const foamBP_L = new BiquadBP(650, sampleRate, 1.0);
  const foamBP_R = new BiquadBP(720, sampleRate, 1.0);
  const foamLP_L = new BiquadLP(2000, sampleRate, 0.7);
  const foamLP_R = new BiquadLP(2000, sampleRate, 0.7);
  const foamHP_L = new BiquadHP(280, sampleRate, 0.7);
  const foamHP_R = new BiquadHP(280, sampleRate, 0.7);

  // Wave wet wash (audible water movement)
  const washBP_L = new BiquadBP(480, sampleRate, 1.6);
  const washBP_R = new BiquadBP(520, sampleRate, 1.6);

  const brownL = new BrownNoise();
  const brownR = new BrownNoise();
  const pinkL = new PinkNoise();
  const pinkR = new PinkNoise();

  // Multiple overlapping wave periods (prime-ish to avoid lock-in)
  const P1 = 11.0;
  const P2 = 13.0;
  const P3 = 8.5;

  // Asymmetric wave envelope: slow build, sharp crest, slow recede
  const waveEnv = (phase) => {
    if (phase < 0.38) {
      // Build: power curve for natural acceleration
      return Math.pow(phase / 0.38, 1.7) * 0.82;
    } else if (phase < 0.52) {
      // Crest: peak with slight overshoot
      const c = (phase - 0.38) / 0.14;
      return 0.82 + Math.sin(c * Math.PI) * 0.18;
    } else {
      // Recede: exponential-like fall
      const r = (phase - 0.52) / 0.48;
      return Math.pow(1 - r, 1.5) * 0.82;
    }
  };

  for (let i = 0; i < totalSamples; i++) {
    const t = i / sampleRate;

    const p1 = (t % P1) / P1;
    const p2 = ((t + P2 * 0.5) % P2) / P2;
    const p3 = (t % P3) / P3;

    const wave1 = waveEnv(p1);
    const wave2 = waveEnv(p2);
    const wave3 = waveEnv(p3) * 0.6;

    // Wave 1 → left, Wave 2 → right, Wave 3 → center
    const swellL = 0.55 + wave1 * 0.45 + wave2 * 0.18 + wave3 * 0.20;
    const swellR = 0.55 + wave1 * 0.18 + wave2 * 0.45 + wave3 * 0.20;

    // ===== DEEP WATER BODY =====
    const bL = brownL.next();
    const bR = brownR.next();

    const bassL = deepLP_L.process(bL) + subPeak_L.process(bL) * 0.45;
    const bassR = deepLP_R.process(bR) + subPeak_R.process(bR) * 0.45;

    // ===== WET WASH (audible water movement over rocks) =====
    const wL = pinkL.next();
    const wR = pinkR.next();
    // Sweep the wash filter with wave intensity — creates rushing sensation
    const washL = washBP_L.process(wL) * (0.4 + wave1 * 0.7) * lowMid_L.process(wL) * 0.5;
    const washR = washBP_R.process(wR) * (0.4 + wave2 * 0.7) * lowMid_R.process(wR) * 0.5;

    // ===== FOAM (wave breaking, soft) =====
    const foamIntL = Math.pow(Math.max(0, wave1 - 0.25), 1.4) * 0.8
                   + Math.pow(Math.max(0, wave2 - 0.30), 1.4) * 0.35
                   + Math.pow(Math.max(0, wave3 - 0.30), 1.4) * 0.25;
    const foamIntR = Math.pow(Math.max(0, wave1 - 0.30), 1.4) * 0.35
                   + Math.pow(Math.max(0, wave2 - 0.25), 1.4) * 0.8
                   + Math.pow(Math.max(0, wave3 - 0.30), 1.4) * 0.25;

    const foamL = foamLP_L.process(foamBP_L.process(wL * foamIntL)) - foamHP_L.process(wL * foamIntL) * 0.4;
    const foamR = foamLP_R.process(foamBP_R.process(wR * foamIntR)) - foamHP_R.process(wR * foamIntR) * 0.4;

    // ===== MIX =====
    // Bass always present (ocean never stops), foam swells with crests
    left[i] = bassL * 0.45 * swellL + washL * 0.55 + foamL * 1.6;
    right[i] = bassR * 0.45 * swellR + washR * 0.55 + foamR * 1.6;
  }
}

// =========================================================================
// 3. WIND — Airy, whispering, with natural gust envelopes
// Physics: Gust envelopes from overlapping slow oscillations.
// Turbulence = filtered noise with dynamic filter sweeps.
// Sleep-friendly: soft high rolloff, warm mid body, no whistle.
// =========================================================================
function genCalmWind(left, right, totalSamples, sampleRate) {
  // Low rumble (cavity/trunk resonance)
  const rumbleLP_L = new BiquadLP(180, sampleRate, 1.0);
  const rumbleLP_R = new BiquadLP(180, sampleRate, 1.0);
  const rumbleBP_L = new BiquadBP(75, sampleRate, 1.4);
  const rumbleBP_R = new BiquadBP(78, sampleRate, 1.4);

  // Mid air (soft whoosh)
  const midBP_L = new BiquadBP(420, sampleRate, 1.8);
  const midBP_R = new BiquadBP(480, sampleRate, 1.8);

  // High whisper (rolled off — sleep-friendly, no harsh whistle)
  const whisperBP_L = new BiquadBP(1400, sampleRate, 2.5);
  const whisperBP_R = new BiquadBP(1550, sampleRate, 2.5);
  const whisperLP = new BiquadLP(2800, sampleRate, 0.7);

  // Overall warmth
  const warmLP_L = new BiquadLP(2000, sampleRate, 0.7);
  const warmLP_R = new BiquadLP(2000, sampleRate, 0.7);

  let midStateL = 0, midStateR = 0;
  const brownL = new BrownNoise();
  const brownR = new BrownNoise();
  const pinkL = new PinkNoise();
  const pinkR = new PinkNoise();

  for (let i = 0; i < totalSamples; i++) {
    const t = i / sampleRate;

    // ===== GUST ENVELOPES (overlapping sines, slow) =====
    const g1 = 0.5 + 0.5 * Math.sin(t * 0.11);
    const g2 = 0.5 + 0.5 * Math.sin(t * 0.23 + 1.7);
    const g3 = 0.5 + 0.5 * Math.sin(t * 0.41 + 3.2);
    const g4 = 0.5 + 0.5 * Math.sin(t * 0.83 + 0.8);

    // Weighted sum → organic gusting
    const gustRaw = 0.30 * g1 + 0.30 * g2 + 0.22 * g3 + 0.18 * g4;
    // Sharpen slightly (gusts have faster onsets than pure sine)
    const gust = Math.pow(gustRaw, 1.25);
    const gustClamped = Math.max(0.18, gust);

    // ===== NOISE SOURCES =====
    const bL = brownL.next();
    const bR = brownR.next();
    const pL = pinkL.next();
    const pR = pinkR.next();

    // Mid air state (smoothed pink)
    midStateL = midStateL * 0.90 + pL * 0.10;
    midStateR = midStateR * 0.90 + pR * 0.10;

    // ===== COMPONENTS =====

    // Low rumble — always present, modulated by gust
    const rumbleL = rumbleLP_L.process(bL) + rumbleBP_L.process(bL) * 0.5;
    const rumbleR = rumbleLP_R.process(bR) + rumbleBP_R.process(bR) * 0.5;

    // Mid whoosh — appears during gusts
    const midIntensity = Math.pow(Math.max(0, gust - 0.28), 1.5) * 2.2;
    const midL = midBP_L.process(midStateL) * 0.5 * midIntensity;
    const midR = midBP_R.process(midStateR) * 0.5 * midIntensity;

    // High whisper — only during strong gusts, softly rolled off
    const whisperIntensity = Math.pow(Math.max(0, gust - 0.50), 2.0) * 2.5;
    const whisperL = whisperLP.process(whisperBP_L.process(pL)) * 0.22 * whisperIntensity;
    const whisperR = whisperLP.process(whisperBP_R.process(pR)) * 0.22 * whisperIntensity;

    // ===== MIX =====
    // Warm overall tone — no harsh frequencies
    const mixL = rumbleL * 0.55 * (0.5 + gust * 0.5) + midL * 0.65 + whisperL * 0.45;
    const mixR = rumbleR * 0.55 * (0.5 + gust * 0.5) + midR * 0.65 + whisperR * 0.45;

    left[i] = warmLP_L.process(mixL) * 1.3;
    right[i] = warmLP_R.process(mixR) * 1.3;
  }
}

// =========================================================================
// 4. FOREST — Mountain creek + pine wind + real birds
// =========================================================================
function genCalmForest(left, right, totalSamples, sampleRate) {
  // Creek (bubbling water)
  const creekRushLP_L = new BiquadLP(800, sampleRate, 0.8);
  const creekRushLP_R = new BiquadLP(800, sampleRate, 0.8);
  const creekBubbleBP_L = new BiquadBP(1500, sampleRate, 2.5);
  const creekBubbleBP_R = new BiquadBP(1650, sampleRate, 2.5);

  // Pine wind
  const pineTrunkLP = new BiquadLP(120, sampleRate, 1.3);
  const pineNeedleBP_L = new BiquadBP(1600, sampleRate, 1.5);
  const pineNeedleBP_R = new BiquadBP(1800, sampleRate, 1.5);
  const pineNeedleLP = new BiquadLP(3200, sampleRate, 0.7);

  // Bird tone shaping
  const birdLP = new BiquadLP(5500, sampleRate, 0.7);
  const birdHP = new BiquadHP(1100, sampleRate, 0.7);

  // Forest space (delay)
  const delaySamples = Math.floor(sampleRate * 0.11);
  const delayBufferL = new Float32Array(delaySamples);
  const delayBufferR = new Float32Array(delaySamples);
  let delayIndex = 0;

  let creekStateL = 0, creekStateR = 0;
  let pineStateL = 0, pineStateR = 0;

  // Bubble pool (each bubble = short resonant "plink" with pitch rise)
  const MAX_BUBBLES = 28;
  const bubbles = [];
  for (let i = 0; i < MAX_BUBBLES; i++) {
    bubbles.push({ amp: 0, freq: 0, phase: 0, decay: 0, panL: 0.5, panR: 0.5, rise: 0 });
  }

  for (let i = 0; i < totalSamples; i++) {
    const t = i / sampleRate;

    // ===== MOUNTAIN CREEK =====
    const wcL = Math.random() * 2 - 1;
    creekStateL = creekStateL * 0.86 + wcL * 0.14;
    const wcR = Math.random() * 2 - 1;
    creekStateR = creekStateR * 0.86 + wcR * 0.14;

    const flowMod = 0.85 + 0.15 * Math.sin(t * 0.21) + 0.08 * Math.sin(t * 0.53);

    const creekRushL = creekRushLP_L.process(creekStateL) * 1.4 * flowMod;
    const creekRushR = creekRushLP_R.process(creekStateR) * 1.4 * flowMod;

    // Bubbles: short upward pitch sweeps
    if (Math.random() < 0.0022) {
      const b = bubbles[Math.floor(Math.random() * MAX_BUBBLES)];
      b.amp = 0.05 + Math.random() * 0.10;
      b.freq = 380 + Math.random() * 700;
      b.phase = 0;
      b.decay = 0.986 + Math.random() * 0.008;
      b.rise = 0.5 + Math.random() * 0.7;
      const pan = Math.random();
      b.panL = Math.cos(pan * Math.PI * 0.5);
      b.panR = Math.sin(pan * Math.PI * 0.5);
    }

    let bubbleL = 0, bubbleR = 0;
    for (let k = 0; k < MAX_BUBBLES; k++) {
      const b = bubbles[k];
      if (b.amp < 0.00008) continue;
      b.phase += 2 * Math.PI * b.freq / sampleRate;
      b.freq *= (1 + b.rise * 0.0007);
      const sample = Math.sin(b.phase) * b.amp;
      bubbleL += sample * b.panL;
      bubbleR += sample * b.panR;
      b.amp *= b.decay;
    }

    // ===== PINE WIND =====
    const wpL = Math.random() * 2 - 1;
    pineStateL = pineStateL * 0.94 + wpL * 0.06;
    const wpR = Math.random() * 2 - 1;
    pineStateR = pineStateR * 0.94 + wpR * 0.06;

    const gust = 0.65 + 0.35 * Math.sin(t * 0.19) + 0.18 * Math.sin(t * 0.47 + 1.3);
    const gustClamped = Math.max(0.25, gust);

    const trunkSway = pineTrunkLP.process(pineStateL + pineStateR) * 0.38;
    const needleL = pineNeedleLP.process(pineNeedleBP_L.process(pineStateL)) * 0.30 * gustClamped;
    const needleR = pineNeedleLP.process(pineNeedleBP_R.process(pineStateR)) * 0.30 * gustClamped;

    // ===== BIRDS =====
    let birdL = 0, birdR = 0;

    // Generic bird note: fundamental + harmonics + vibrato + envelope
    const birdNote = (startT, dur, f0, f1, harmonics, vibRate, vibDepth, amp) => {
      if (t < startT || t > startT + dur) return 0;
      const rT = (t - startT) / dur;
      let env;
      if (rT < 0.08) env = rT / 0.08;
      else if (rT < 0.72) env = 1.0;
      else env = 1.0 - (rT - 0.72) / 0.28;
      env = Math.max(0, env);
      const freq = f0 + (f1 - f0) * rT;
      const vib = 1 + vibDepth * Math.sin((t - startT) * vibRate * Math.PI * 2);
      const phase = (t - startT) * freq * vib * Math.PI * 2;
      let sample = 0;
      for (let h = 0; h < harmonics.length; h++) {
        sample += Math.sin(phase * (h + 1)) * harmonics[h];
      }
      return sample * env * amp;
    };

    // European Robin — bright warbling phrases
    birdL += birdNote(4.50, 0.20, 4000, 4400, [1.0, 0.28, 0.10], 8, 0.020, 0.24);
    birdL += birdNote(4.78, 0.15, 4400, 3900, [1.0, 0.24, 0.08], 10, 0.028, 0.22);
    birdL += birdNote(5.00, 0.24, 3800, 4600, [1.0, 0.32, 0.12], 7, 0.022, 0.26);
    birdL += birdNote(5.32, 0.17, 4600, 4200, [1.0, 0.26, 0.09], 9, 0.020, 0.22);
    birdL += birdNote(5.58, 0.32, 4200, 4800, [1.0, 0.30, 0.14], 6, 0.028, 0.28);

    // Blackbird — rich flute-like (warm, low)
    birdR += birdNote(10.20, 0.38, 2500, 2900, [1.0, 0.42, 0.16, 0.06], 5, 0.014, 0.30);
    birdR += birdNote(10.68, 0.30, 2900, 2400, [1.0, 0.38, 0.13, 0.05], 6, 0.016, 0.28);
    birdR += birdNote(11.08, 0.44, 2300, 2800, [1.0, 0.44, 0.19, 0.07], 4, 0.012, 0.32);
    birdR += birdNote(11.62, 0.32, 2800, 2500, [1.0, 0.40, 0.15, 0.05], 5, 0.014, 0.26);

    // Great Tit — two-tone "tea-cher"
    const titPair = (startT, f1, f2) => {
      let s = 0;
      s += birdNote(startT, 0.13, f1, f1 * 0.94, [1.0, 0.38, 0.10], 12, 0.010, 0.22);
      s += birdNote(startT + 0.20, 0.13, f2, f2 * 0.94, [1.0, 0.38, 0.10], 12, 0.010, 0.20);
      return s;
    };
    birdR += titPair(16.50, 4000, 3400);
    birdR += titPair(16.92, 4000, 3400);
    birdR += titPair(17.34, 4000, 3400);

    // Woodpecker — hollow trunk drumming (impulse + resonant modes)
    if (t > 7.5 && t < 8.0) {
      const bT = t - 7.5;
      const tapInterval = 0.040;
      const tapPhase = (bT % tapInterval) / tapInterval;
      if (tapPhase < 0.28) {
        const tapEnv = Math.exp(-tapPhase * 22);
        const impulse = (Math.random() * 2 - 1) * tapEnv;
        const mode1 = Math.sin(bT * 2 * Math.PI * 420) * Math.exp(-tapPhase * 12) * 0.5;
        const mode2 = Math.sin(bT * 2 * Math.PI * 880) * Math.exp(-tapPhase * 15) * 0.22;
        const drum = (impulse * 0.55 + mode1 + mode2) * 0.24;
        birdR += drum * 0.9;
        birdL += drum * 0.3;
      }
    }

    // Bird tone shaping (soften highs, remove rumble)
    birdL = birdLP.process(birdL) - birdHP.process(birdL) * 0.35;
    birdR = birdLP.process(birdR) - birdHP.process(birdR) * 0.35;

    // ===== FOREST DELAY =====
    const delL = delayBufferL[delayIndex];
    const delR = delayBufferR[delayIndex];
    delayBufferL[delayIndex] = birdL + delL * 0.30;
    delayBufferR[delayIndex] = birdR + delR * 0.30;
    delayIndex = (delayIndex + 1) % delaySamples;

    // ===== MIX =====
    left[i] = creekRushL * 0.55 + bubbleL * 0.55 + (needleL + trunkSway) * 0.55 + birdL * 0.70 + delL * 0.18;
    right[i] = creekRushR * 0.55 + bubbleR * 0.55 + (needleR + trunkSway) * 0.55 + birdR * 0.70 + delR * 0.18;
  }
}

// =========================================================================
// 5. FIREPLACE — Combustion roar + flame flicker + wood crackles
// =========================================================================
function genCalmFireplace(left, right, totalSamples, sampleRate) {
  // Combustion roar (low, warm)
  const roarLP_L = new BiquadLP(160, sampleRate, 0.9);
  const roarLP_R = new BiquadLP(160, sampleRate, 0.9);
  const roarBP_L = new BiquadBP(80, sampleRate, 1.2);
  const roarBP_R = new BiquadBP(82, sampleRate, 1.2);

  // Flame flicker (mid-range, modulated)
  const flickerBP_L = new BiquadBP(420, sampleRate, 1.4);
  const flickerBP_R = new BiquadBP(460, sampleRate, 1.4);
  const flickerLP = new BiquadLP(1400, sampleRate, 0.7);

  // Crackle resonance (wood modes)
  const crackleRes = new BiquadBP(260, sampleRate, 4.0);

  const brownL = new BrownNoise();
  const brownR = new BrownNoise();
  let flickerStateL = 0, flickerStateR = 0;

  // Crackle pool
  const MAX_CRACKLES = 56;
  const crackles = [];
  for (let i = 0; i < MAX_CRACKLES; i++) {
    crackles.push({ amp: 0, phase: 0, freq: 0, decay: 0, panL: 0.5, panR: 0.5, noise: 0 });
  }

  for (let i = 0; i < totalSamples; i++) {
    const t = i / sampleRate;

    // ===== COMBUSTION ROAR =====
    const bL = brownL.next();
    const bR = brownR.next();

    const roarL = roarLP_L.process(bL) + roarBP_L.process(bL) * 0.45;
    const roarR = roarLP_R.process(bR) + roarBP_R.process(bR) * 0.45;

    // ===== FLAME FLICKER =====
    const fL = Math.random() * 2 - 1;
    flickerStateL = flickerStateL * 0.72 + fL * 0.28;
    const fR = Math.random() * 2 - 1;
    flickerStateR = flickerStateR * 0.72 + fR * 0.28;

    const flickerModL = 0.5 + 0.5 * Math.sin(t * 43 + Math.sin(t * 11) * 3);
    const flickerModR = 0.5 + 0.5 * Math.sin(t * 49 + Math.sin(t * 15) * 3);

    const flickerL = flickerLP.process(flickerBP_L.process(flickerStateL)) * 0.30 * flickerModL;
    const flickerR = flickerLP.process(flickerBP_R.process(flickerStateR)) * 0.30 * flickerModR;

    // ===== CRACKLES =====
    if (Math.random() < 0.00020) {
      const c = crackles[Math.floor(Math.random() * MAX_CRACKLES)];
      const size = Math.pow(Math.random(), 3);
      c.amp = 0.12 + size * 0.50;
      c.freq = 180 + Math.random() * 380;
      c.phase = 0;
      c.decay = 0.960 + Math.random() * 0.028;
      c.noise = 0.5 + Math.random() * 0.5;
      const pan = Math.random();
      c.panL = Math.cos(pan * Math.PI * 0.5);
      c.panR = Math.sin(pan * Math.PI * 0.5);
    }

    // Occasional big ember pop
    if (Math.random() < 0.000035) {
      const c = crackles[Math.floor(Math.random() * MAX_CRACKLES)];
      c.amp = 0.45 + Math.random() * 0.45;
      c.freq = 120 + Math.random() * 180;
      c.phase = 0;
      c.decay = 0.938 + Math.random() * 0.020;
      c.noise = 0.7;
      c.panL = 0.65; c.panR = 0.65;
    }

    let crackleL = 0, crackleR = 0;
    for (let k = 0; k < MAX_CRACKLES; k++) {
      const c = crackles[k];
      if (c.amp < 0.00008) continue;
      c.phase += 2 * Math.PI * c.freq / sampleRate;
      const body = Math.sin(c.phase) * c.amp;
      const noiseBurst = (Math.random() * 2 - 1) * c.amp * c.noise;
      const sample = body * 0.45 + noiseBurst * 0.55;
      const filtered = crackleRes.process(sample);
      crackleL += (sample * 0.6 + filtered * 0.4) * c.panL;
      crackleR += (sample * 0.6 + filtered * 0.4) * c.panR;
      c.amp *= c.decay;
    }

    // ===== MIX =====
    left[i] = roarL * 0.60 + flickerL * 0.38 + crackleL * 1.0;
    right[i] = roarR * 0.60 + flickerR * 0.38 + crackleR * 1.0;
  }
}

// =========================================================================
// 6. NIGHT — Real cricket chirp trains + katydid + tree frog + night air
// =========================================================================
function genCalmNight(left, right, totalSamples, sampleRate) {
  // Cricket / katydid / frog resonance filters
  const cricketBP_L = new BiquadBP(4100, sampleRate, 7.0);
  const cricketBP_R = new BiquadBP(4400, sampleRate, 7.0);
  const katydidBP_L = new BiquadBP(6300, sampleRate, 5.0);
  const katydidBP_R = new BiquadBP(6600, sampleRate, 5.0);
  const frogBP_L = new BiquadBP(2100, sampleRate, 5.0);
  const frogBP_R = new BiquadBP(2300, sampleRate, 5.0);

  // Night air (soft low ambience)
  const airLP_L = new BiquadLP(380, sampleRate, 0.7);
  const airLP_R = new BiquadLP(380, sampleRate, 0.7);

  const brownL = new BrownNoise();
  const brownR = new BrownNoise();

  // Cricket pool — each has its own chirp train timing
  const MAX_CRICKETS = 14;
  const crickets = [];
  for (let i = 0; i < MAX_CRICKETS; i++) {
    crickets.push({
      phase: 0,
      chirpTimer: Math.random() * 1.5,
      chirpActive: false,
      pulseTimer: 0,
      pulseCount: 0,
      panL: 0.5,
      panR: 0.5,
      baseFreq: 3900 + Math.random() * 900,
      chirpPeriod: 0.40 + Math.random() * 0.30, // seconds between chirps
      pulsePeriod: 0.032 + Math.random() * 0.012, // seconds between pulses
      active: true,
      wobble: Math.random() * Math.PI * 2,
    });
  }

  // Katydid state
  let katydidPhaseL = 0, katydidPhaseR = 0;

  // Tree frog state
  let frogPhaseL = 0, frogPhaseR = 0;
  let frogCallPhase = 0;
  let frogActive = false;

  for (let i = 0; i < totalSamples; i++) {
    const t = i / sampleRate;

    // ===== NIGHT AIR (continuous) =====
    const bL = brownL.next();
    const bR = brownR.next();
    const airL = airLP_L.process(bL) * 1.2;
    const airR = airLP_R.process(bR) * 1.2;

    // ===== CRICKETS =====
    let cricketL = 0, cricketR = 0;

    for (let k = 0; k < MAX_CRICKETS; k++) {
      const c = crickets[k];

      // Slow activity gating (some crickets fade in/out over minutes)
      if (k >= 7) {
        const activity = Math.sin(t * 0.09 + k * 2.3) + Math.sin(t * 0.21 + k * 1.1);
        c.active = activity > -0.4;
      }

      if (!c.active) continue;

      // ===== CHIRP TIMING =====
      if (!c.chirpActive) {
        c.chirpTimer -= 1 / sampleRate;
        if (c.chirpTimer <= 0) {
          c.chirpActive = true;
          c.chirpTimer = c.chirpPeriod;
          c.pulseTimer = 0;
          c.pulseCount = 0;
        }
      } else {
        c.pulseTimer -= 1 / sampleRate;
        if (c.pulseTimer <= 0) {
          c.pulseTimer = c.pulsePeriod;
          c.pulseCount++;
          if (c.pulseCount >= 4) {
            c.chirpActive = false;
          }
        }
      }

      if (c.chirpActive) {
        // Pulse envelope: short, sharpish attack
        const pulsePhase = 1 - (c.pulseTimer / c.pulsePeriod);
        const pulseEnv = Math.max(0, Math.sin(pulsePhase * Math.PI));

        // Carrier with slight wobble
        const wobble = Math.sin(t * 180 + c.wobble) * 35;
        const freq = c.baseFreq + wobble;
        c.phase += 2 * Math.PI * freq / sampleRate;

        // Cricket timbre: sine + 2nd harmonic (buzzy quality)
        const raw = (Math.sin(c.phase) + Math.sin(c.phase * 2) * 0.35) * pulseEnv * 0.13;

        cricketL += cricketBP_L.process(raw) * c.panL;
        cricketR += cricketBP_R.process(raw) * c.panR;
      }
    }

    // ===== KATYDID (continuous buzzy trill with slow pulse) =====
    const katydidPulse = 0.5 + 0.5 * Math.sin(t * 2.1);
    const katydidEnv = 0.25 + 0.75 * Math.pow(katydidPulse, 2);

    katydidPhaseL += 2 * Math.PI * 6400 / sampleRate;
    katydidPhaseR += 2 * Math.PI * 6700 / sampleRate;

    const katydidRawL = (Math.sin(katydidPhaseL) + 0.45 * Math.sin(katydidPhaseL * 2) + 0.20 * Math.sin(katydidPhaseL * 3)) * 0.06 * katydidEnv;
    const katydidRawR = (Math.sin(katydidPhaseR) + 0.45 * Math.sin(katydidPhaseR * 2) + 0.20 * Math.sin(katydidPhaseR * 3)) * 0.06 * katydidEnv;

    const katydidL = katydidBP_L.process(katydidRawL) * 0.5;
    const katydidR = katydidBP_R.process(katydidRawR) * 0.5;

    // ===== TREE FROG =====
    let frogL = 0, frogR = 0;

    if (!frogActive && Math.random() < 0.00012) {
      frogActive = true;
      frogCallPhase = 0;
    }

    if (frogActive) {
      frogCallPhase += 1 / (0.18 * sampleRate);
      if (frogCallPhase >= 1) {
        frogActive = false;
      } else {
        const env = Math.sin(frogCallPhase * Math.PI);
        const freq = 2250 + Math.sin(frogCallPhase * 4) * 180;
        frogPhaseL += 2 * Math.PI * freq / sampleRate;
        frogPhaseR += 2 * Math.PI * (freq + 25) / sampleRate;
        const rawL = Math.sin(frogPhaseL) * env * 0.15;
        const rawR = Math.sin(frogPhaseR) * env * 0.15;
        frogL = frogBP_L.process(rawL) * 0.7;
        frogR = frogBP_R.process(rawR) * 0.7;
      }
    }

    // ===== MIX =====
    left[i] = airL * 0.45 + cricketL * 1.4 + katydidL * 0.7 + frogL * 0.9;
    right[i] = airR * 0.45 + cricketR * 1.4 + katydidR * 0.7 + frogR * 0.9;
  }
}

// =========================================================================
// MAIN
// =========================================================================
const sounds = [
  { folder: 'rain', file: 'gentle-rain.wav', gen: genCalmRain },
  { folder: 'ocean', file: 'soft-waves.wav', gen: genCalmOcean },
  { folder: 'forest', file: 'forest-ambience.wav', gen: genCalmForest },
  { folder: 'fireplace', file: 'soft-crackling.wav', gen: genCalmFireplace },
  { folder: 'wind', file: 'gentle-breeze.wav', gen: genCalmWind },
  { folder: 'night', file: 'night-insects.wav', gen: genCalmNight },
];

console.log('Generating sleep-optimized, ultra-realistic ambient soundscapes...');
sounds.forEach(({ folder, file, gen }) => {
  const dir = path.join(__dirname, '..', 'public', 'audio', folder);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  const filePath = path.join(dir, file);
  const buf = createWavBuffer(SAMPLE_RATE, DURATION, gen);
  fs.writeFileSync(filePath, buf);
  console.log(`✓ Generated ${filePath} (${(buf.length / 1024).toFixed(1)} KB)`);
});
console.log('All 6 sleep-optimized soundscapes successfully synthesized!');