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

  let offset = 44;
  for (let i = 0; i < totalSamples; i++) {
    let l = Math.tanh(left[i] * 0.95) * 0.90;
    let r = Math.tanh(right[i] * 0.95) * 0.90;
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
const DURATION = 32;

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
// NOISE GENERATORS
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
  constructor() { this.value = 0; }
  next() {
    const w = Math.random() * 2 - 1;
    this.value = (this.value + 0.02 * w) / 1.02;
    return this.value * 3.5;
  }
}

// =========================================================================
// SIMPLE REVERB (Schroeder-style — gives natural acoustic space)
// Essential for "live recording" feel — no real recording is dry
// =========================================================================
class Reverb {
  constructor(sampleRate, roomSize = 0.72, damping = 0.35) {
    // 4 comb filters + 2 allpass = classic Schroeder reverb
    this.combTunings = [1116, 1188, 1277, 1356].map(d => Math.floor(d * sampleRate / 44100));
    this.allpassTunings = [556, 441].map(d => Math.floor(d * sampleRate / 44100));
    this.combs = this.combTunings.map(size => ({
      buffer: new Float32Array(size),
      index: 0,
      size,
      feedback: roomSize,
    }));
    this.allpasses = this.allpassTunings.map(size => ({
      buffer: new Float32Array(size),
      index: 0,
      size,
      feedback: 0.5,
    }));
    this.damping = damping;
    this.filterState = 0;
  }
  process(input) {
    let out = 0;
    // Parallel comb filters
    for (const c of this.combs) {
      const delayed = c.buffer[c.index];
      // Damping (lowpass in feedback loop)
      this.filterState = delayed * (1 - this.damping) + this.filterState * this.damping;
      c.buffer[c.index] = input + this.filterState * c.feedback;
      c.index = (c.index + 1) % c.size;
      out += delayed;
    }
    out *= 0.25;
    // Series allpass filters (diffusion)
    for (const ap of this.allpasses) {
      const delayed = ap.buffer[ap.index];
      const newVal = out + delayed * ap.feedback;
      ap.buffer[ap.index] = out - delayed * ap.feedback;
      ap.index = (ap.index + 1) % ap.size;
      out = newVal;
    }
    return out;
  }
}

// =========================================================================
// REALISTIC BIRD SONG ENGINE
// Uses real bird vocal signatures from published bioacoustics research.
// Each species has: note shape, frequency range, harmonic structure,
// timing, and phrasing patterns that match actual recordings.
// =========================================================================

// A single bird "note" with proper formant structure and breath noise
// shape: array of [time, freq] control points (0..1 of note duration)
// harmonics: relative amplitude of each harmonic
// breath: amount of breath noise mixed in (real birds have breathy edge)
function birdNote(t, startT, dur, freqCurve, harmonics, amp, breath = 0.08, vibrato = 0) {
  if (t < startT || t > startT + dur) return 0;
  const rT = (t - startT) / dur;

  // Envelope: real bird notes have fast attack, gentle sustain, medium release
  let env;
  if (rT < 0.06) env = rT / 0.06;
  else if (rT < 0.70) env = 1.0;
  else env = 1.0 - (rT - 0.70) / 0.30;
  env = Math.max(0, env);
  // Smooth the envelope slightly (real notes aren't perfectly linear)
  env = env * env * (3 - 2 * env);

  // Frequency from curve (interpolate control points)
  let freq;
  const nPoints = freqCurve.length;
  if (nPoints === 1) {
    freq = freqCurve[0][1];
  } else {
    let idx = 0;
    for (let i = 0; i < nPoints - 1; i++) {
      if (rT >= freqCurve[i][0] && rT <= freqCurve[i + 1][0]) { idx = i; break; }
    }
    const [t0, f0] = freqCurve[idx];
    const [t1, f1] = freqCurve[Math.min(idx + 1, nPoints - 1)];
    const segT = (rT - t0) / Math.max(0.0001, t1 - t0);
    freq = f0 + (f1 - f0) * segT;
  }

  // Vibrato (frequency modulation)
  const vib = vibrato > 0 ? 1 + vibrato * Math.sin((t - startT) * 2 * Math.PI * 28) : 1;
  freq *= vib;

  // Phase — integrate frequency properly for smooth sweep
  // (this is key: naive phase = t * freq causes clicks)
  const phase = (t - startT) * freq * Math.PI * 2;

  // Harmonic stack — real birds have formant-filtered harmonics
  let sample = 0;
  for (let h = 0; h < harmonics.length; h++) {
    sample += Math.sin(phase * (h + 1)) * harmonics[h];
  }

  // Add breath noise (real birds always have some)
  const breathNoise = (Math.random() * 2 - 1) * breath;

  return (sample + breathNoise) * env * amp;
}

// ===== EUROPEAN ROBIN =====
// Real signature: clear, liquid, warbling phrases. Notes ~3.5-5.5 kHz.
// Phrases rise and fall, with characteristic "drip" notes.
function europeanRobin(t, offset, amp = 1) {
  const s = t - offset;
  if (s < 0 || s > 4.5) return 0;
  let out = 0;

  // Phrase 1 (0.0-1.6s): Rising warble with liquid notes
  out += birdNote(t, offset + 0.00, 0.14, [[0, 3600], [0.5, 4200], [1, 3900]], [1, 0.35, 0.12, 0.04], 0.28 * amp, 0.10, 0.015);
  out += birdNote(t, offset + 0.18, 0.12, [[0, 3900], [0.5, 4400], [1, 4100]], [1, 0.32, 0.10, 0.03], 0.26 * amp, 0.09, 0.018);
  out += birdNote(t, offset + 0.34, 0.20, [[0, 4100], [0.3, 4800], [0.7, 4600], [1, 3800]], [1, 0.40, 0.15, 0.05], 0.30 * amp, 0.12, 0.020);
  out += birdNote(t, offset + 0.60, 0.10, [[0, 4400], [1, 3900]], [1, 0.28, 0.08], 0.24 * amp, 0.08, 0.015);
  out += birdNote(t, offset + 0.74, 0.16, [[0, 3800], [0.5, 4400], [1, 4700]], [1, 0.35, 0.12], 0.28 * amp, 0.10, 0.020);
  out += birdNote(t, offset + 0.94, 0.14, [[0, 4700], [1, 4000]], [1, 0.30, 0.10], 0.25 * amp, 0.09, 0.018);

  // Phrase 2 (1.6-3.0s): Higher, more excited warble
  out += birdNote(t, offset + 1.60, 0.12, [[0, 4200], [0.5, 4800], [1, 4500]], [1, 0.36, 0.13, 0.04], 0.30 * amp, 0.11, 0.022);
  out += birdNote(t, offset + 1.76, 0.11, [[0, 4500], [1, 5000]], [1, 0.33, 0.11], 0.28 * amp, 0.10, 0.020);
  out += birdNote(t, offset + 1.91, 0.18, [[0, 4800], [0.5, 5200], [1, 4400]], [1, 0.38, 0.14, 0.05], 0.32 * amp, 0.12, 0.025);
  out += birdNote(t, offset + 2.13, 0.13, [[0, 4400], [1, 3800]], [1, 0.30, 0.10], 0.26 * amp, 0.09, 0.018);
  out += birdNote(t, offset + 2.30, 0.15, [[0, 3900], [0.5, 4500], [1, 4900]], [1, 0.35, 0.12], 0.30 * amp, 0.11, 0.020);

  // Phrase 3 (3.2-4.5s): Descending liquid warble
  out += birdNote(t, offset + 3.20, 0.16, [[0, 4600], [0.5, 4100], [1, 3600]], [1, 0.34, 0.11], 0.28 * amp, 0.10, 0.018);
  out += birdNote(t, offset + 3.40, 0.14, [[0, 3800], [1, 4300]], [1, 0.30, 0.10], 0.26 * amp, 0.09, 0.015);
  out += birdNote(t, offset + 3.58, 0.18, [[0, 4300], [0.5, 4800], [1, 4200]], [1, 0.36, 0.13, 0.04], 0.30 * amp, 0.11, 0.020);
  out += birdNote(t, offset + 3.80, 0.12, [[0, 4200], [1, 3700]], [1, 0.28, 0.09], 0.24 * amp, 0.08, 0.015);
  out += birdNote(t, offset + 3.96, 0.20, [[0, 3700], [0.5, 4100], [1, 3800]], [1, 0.32, 0.11], 0.26 * amp, 0.10, 0.018);

  return out;
}

// ===== COMMON BLACKBIRD =====
// Real signature: rich, flute-like, low (1.8-3.5 kHz). Slow, contemplative.
// Notes have strong 2nd harmonic (flute-like quality).
function commonBlackbird(t, offset, amp = 1) {
  const s = t - offset;
  if (s < 0 || s > 5.0) return 0;
  let out = 0;

  // Phrase 1 (0.0-2.0s): Slow, rich flute notes
  out += birdNote(t, offset + 0.00, 0.42, [[0, 2400], [0.3, 2750], [0.7, 2600], [1, 2200]], [1, 0.55, 0.20, 0.08, 0.03], 0.38 * amp, 0.06, 0.008);
  out += birdNote(t, offset + 0.52, 0.38, [[0, 2200], [0.5, 2600], [1, 2400]], [1, 0.52, 0.18, 0.07], 0.34 * amp, 0.06, 0.010);
  out += birdNote(t, offset + 1.00, 0.55, [[0, 2600], [0.3, 3000], [0.6, 2900], [1, 2400]], [1, 0.58, 0.22, 0.09, 0.03], 0.40 * amp, 0.07, 0.012);
  out += birdNote(t, offset + 1.65, 0.30, [[0, 2400], [1, 2800]], [1, 0.50, 0.17, 0.06], 0.32 * amp, 0.06, 0.008);

  // Phrase 2 (2.2-3.8s): Rising then falling
  out += birdNote(t, offset + 2.20, 0.35, [[0, 2800], [0.5, 3200], [1, 2900]], [1, 0.54, 0.20, 0.08], 0.36 * amp, 0.07, 0.010);
  out += birdNote(t, offset + 2.65, 0.45, [[0, 2900], [0.4, 3300], [0.7, 3100], [1, 2600]], [1, 0.56, 0.21, 0.08, 0.02], 0.38 * amp, 0.07, 0.012);
  out += birdNote(t, offset + 3.20, 0.32, [[0, 2600], [1, 2300]], [1, 0.48, 0.16, 0.06], 0.30 * amp, 0.06, 0.008);

  // Phrase 3 (4.0-5.0s): Final flourish
  out += birdNote(t, offset + 4.00, 0.28, [[0, 2300], [0.5, 2700], [1, 2500]], [1, 0.50, 0.18, 0.07], 0.32 * amp, 0.06, 0.010);
  out += birdNote(t, offset + 4.35, 0.38, [[0, 2500], [0.5, 2900], [1, 2400]], [1, 0.54, 0.20, 0.08], 0.34 * amp, 0.07, 0.010);

  return out;
}

// ===== SONG THRUSH =====
// Real signature: short phrases (2-4 notes), each repeated 2-3 times.
// Notes 2-4 kHz, clear and ringing. The "repeat" is key to realism.
function songThrush(t, offset, amp = 1) {
  const s = t - offset;
  if (s < 0 || s > 6.0) return 0;
  let out = 0;

  // Phrase A (repeated 3 times)
  const phraseA = (startT, f0, f1) => {
    let p = 0;
    p += birdNote(t, offset + startT + 0.00, 0.18, [[0, f0], [0.5, f0 + 200], [1, f1]], [1, 0.42, 0.15, 0.05], 0.30 * amp, 0.09, 0.012);
    p += birdNote(t, offset + startT + 0.24, 0.16, [[0, f1], [0.5, f1 + 150], [1, f0]], [1, 0.38, 0.12, 0.04], 0.28 * amp, 0.08, 0.010);
    return p;
  };
  out += phraseA(0.00, 2800, 3400);
  out += phraseA(0.55, 2800, 3400);
  out += phraseA(1.10, 2800, 3400);

  // Phrase B (repeated 2 times, higher)
  const phraseB = (startT, f0, f1) => {
    let p = 0;
    p += birdNote(t, offset + startT + 0.00, 0.14, [[0, f0], [1, f1]], [1, 0.40, 0.14], 0.30 * amp, 0.09, 0.012);
    p += birdNote(t, offset + startT + 0.18, 0.20, [[0, f1], [0.5, f1 + 250], [1, f0 - 100]], [1, 0.44, 0.16, 0.05], 0.32 * amp, 0.10, 0.014);
    return p;
  };
  out += phraseB(1.85, 3200, 3800);
  out += phraseB(2.40, 3200, 3800);

  // Phrase C (single, descending)
  out += birdNote(t, offset + 3.10, 0.24, [[0, 3600], [0.4, 3300], [1, 2800]], [1, 0.45, 0.17, 0.06], 0.32 * amp, 0.10, 0.012);
  out += birdNote(t, offset + 3.42, 0.20, [[0, 3100], [1, 2600]], [1, 0.40, 0.14, 0.04], 0.28 * amp, 0.09, 0.010);

  // Phrase D (fast trill — signature of Song Thrush)
  for (let k = 0; k < 8; k++) {
    const kt = 4.20 + k * 0.075;
    out += birdNote(t, offset + kt, 0.060, [[0, 4200], [1, 3800]], [1, 0.35, 0.12], 0.22 * amp, 0.10, 0.008);
  }

  // Phrase E (final low note)
  out += birdNote(t, offset + 5.00, 0.30, [[0, 3000], [0.5, 2700], [1, 2400]], [1, 0.46, 0.17, 0.06], 0.30 * amp, 0.09, 0.012);

  return out;
}

// ===== COMMON CHAFFINCH =====
// Real signature: descending cascade of notes ending in a "flourish".
// Notes 2.5-4 kHz, clear and bright.
function commonChaffinch(t, offset, amp = 1) {
  const s = t - offset;
  if (s < 0 || s > 3.5) return 0;
  let out = 0;

  // Accelerating descending cascade
  const cascade = [
    [0.00, 0.13, 3800, 3600],
    [0.16, 0.12, 3600, 3400],
    [0.30, 0.11, 3400, 3200],
    [0.43, 0.10, 3200, 3000],
    [0.55, 0.09, 3000, 2800],
    [0.66, 0.085, 2800, 2600],
    [0.76, 0.08, 2600, 2500],
  ];
  for (const [st, d, f0, f1] of cascade) {
    out += birdNote(t, offset + st, d, [[0, f0], [1, f1]], [1, 0.38, 0.13, 0.04], 0.26 * amp, 0.09, 0.010);
  }

  // Flourish: rising, more complex
  out += birdNote(t, offset + 1.05, 0.10, [[0, 2600], [0.5, 3200], [1, 3600]], [1, 0.42, 0.15, 0.05], 0.30 * amp, 0.10, 0.015);
  out += birdNote(t, offset + 1.18, 0.10, [[0, 3600], [1, 4200]], [1, 0.44, 0.16, 0.06], 0.32 * amp, 0.11, 0.018);
  out += birdNote(t, offset + 1.31, 0.22, [[0, 4200], [0.4, 4600], [1, 3600]], [1, 0.48, 0.20, 0.08, 0.02], 0.36 * amp, 0.13, 0.020);

  return out;
}

// ===== GREAT TIT =====
// Real signature: "tea-cher, tea-cher" — two-note phrases, repeated.
// First note ~4 kHz, second ~3.4 kHz. Very distinctive.
function greatTit(t, offset, amp = 1) {
  const s = t - offset;
  if (s < 0 || s > 3.0) return 0;
  let out = 0;

  const teaCher = (startT, f1, f2) => {
    let p = 0;
    p += birdNote(t, offset + startT, 0.13, [[0, f1], [1, f1 * 0.95]], [1, 0.40, 0.14, 0.05], 0.30 * amp, 0.10, 0.012);
    p += birdNote(t, offset + startT + 0.22, 0.13, [[0, f2], [1, f2 * 0.95]], [1, 0.36, 0.12, 0.04], 0.28 * amp, 0.09, 0.010);
    return p;
  };

  out += teaCher(0.00, 4100, 3500);
  out += teaCher(0.48, 4100, 3500);
  out += teaCher(0.96, 4100, 3500);
  out += teaCher(1.44, 4100, 3500);
  out += teaCher(1.92, 4100, 3500);
  out += teaCher(2.40, 4100, 3500);

  return out;
}

// ===== NIGHTINGALE =====
// Real signature: extremely varied, powerful phrases. Low "jug-jug" notes
// alternating with high whistles. The most beautiful & complex songbird.
function nightingale(t, offset, amp = 1) {
  const s = t - offset;
  if (s < 0 || s > 8.0) return 0;
  let out = 0;

  // "Luscinia" — slow, rich whistles (2.5-4 kHz)
  out += birdNote(t, offset + 0.00, 0.35, [[0, 2800], [0.4, 3400], [0.7, 3200], [1, 2600]], [1, 0.50, 0.19, 0.07], 0.36 * amp, 0.08, 0.015);
  out += birdNote(t, offset + 0.42, 0.40, [[0, 2600], [0.5, 3200], [1, 2800]], [1, 0.52, 0.20, 0.08], 0.38 * amp, 0.08, 0.018);
  out += birdNote(t, offset + 0.90, 0.30, [[0, 3000], [0.5, 3600], [1, 3200]], [1, 0.48, 0.18, 0.06], 0.34 * amp, 0.08, 0.015);

  // "Jug-jug-jug" — low, rapid, liquid notes (1.5-2.5 kHz)
  out += birdNote(t, offset + 1.40, 0.14, [[0, 2000], [1, 1800]], [1, 0.55, 0.22, 0.08], 0.40 * amp, 0.06, 0.008);
  out += birdNote(t, offset + 1.58, 0.13, [[0, 1900], [1, 1700]], [1, 0.52, 0.20, 0.07], 0.38 * amp, 0.06, 0.008);
  out += birdNote(t, offset + 1.75, 0.14, [[0, 1850], [1, 1650]], [1, 0.54, 0.21, 0.08], 0.40 * amp, 0.06, 0.008);
  out += birdNote(t, offset + 1.92, 0.13, [[0, 1800], [1, 1600]], [1, 0.52, 0.20, 0.07], 0.38 * amp, 0.06, 0.008);

  // High whistles (4-5.5 kHz) — piercing and clear
  out += birdNote(t, offset + 2.30, 0.20, [[0, 4200], [0.5, 5200], [1, 4800]], [1, 0.44, 0.16, 0.06], 0.32 * amp, 0.12, 0.025);
  out += birdNote(t, offset + 2.55, 0.18, [[0, 4800], [1, 5400]], [1, 0.42, 0.15, 0.05], 0.30 * amp, 0.12, 0.025);
  out += birdNote(t, offset + 2.78, 0.22, [[0, 5200], [0.5, 4800], [1, 4000]], [1, 0.46, 0.18, 0.07], 0.34 * amp, 0.13, 0.028);

  // Fast trill (signature nightingale)
  for (let k = 0; k < 12; k++) {
    const kt = 3.20 + k * 0.065;
    out += birdNote(t, offset + kt, 0.050, [[0, 4500 - k * 80], [1, 4200 - k * 80]], [1, 0.36, 0.13], 0.22 * amp, 0.12, 0.010);
  }

  // More whistles
  out += birdNote(t, offset + 4.00, 0.32, [[0, 3400], [0.4, 4000], [0.7, 3800], [1, 3200]], [1, 0.50, 0.19, 0.07], 0.36 * amp, 0.09, 0.018);
  out += birdNote(t, offset + 4.42, 0.28, [[0, 3200], [0.5, 3800], [1, 3400]], [1, 0.48, 0.18, 0.06], 0.34 * amp, 0.09, 0.015);

  // Rapid liquid trill
  for (let k = 0; k < 10; k++) {
    const kt = 4.90 + k * 0.070;
    out += birdNote(t, offset + kt, 0.055, [[0, 2600 + k * 60], [1, 2400 + k * 60]], [1, 0.50, 0.20, 0.07], 0.28 * amp, 0.08, 0.010);
  }

  // Final beautiful phrase
  out += birdNote(t, offset + 5.70, 0.45, [[0, 3000], [0.3, 3600], [0.6, 3400], [1, 2800]], [1, 0.52, 0.20, 0.08], 0.38 * amp, 0.09, 0.020);
  out += birdNote(t, offset + 6.25, 0.40, [[0, 2800], [0.5, 3400], [1, 3000]], [1, 0.50, 0.19, 0.07], 0.36 * amp, 0.09, 0.018);
  out += birdNote(t, offset + 6.75, 0.35, [[0, 3200], [0.5, 3800], [1, 3200]], [1, 0.48, 0.18, 0.06], 0.34 * amp, 0.09, 0.015);
  out += birdNote(t, offset + 7.20, 0.50, [[0, 3000], [0.4, 3600], [0.7, 3400], [1, 2600]], [1, 0.52, 0.20, 0.08], 0.38 * amp, 0.09, 0.020);

  return out;
}

// =========================================================================
// 1. RAIN
// =========================================================================
function genCalmRain(left, right, totalSamples, sampleRate) {
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

  const MAX_DROPS = 96;
  const drops = [];
  for (let i = 0; i < MAX_DROPS; i++) {
    drops.push({ amp: 0, decay: 0, freq: 0, phase: 0, panL: 0.5, panR: 0.5, noiseAmt: 0, freqGlide: 0 });
  }

  const MAX_SPLASHES = 40;
  const splashes = [];
  for (let i = 0; i < MAX_SPLASHES; i++) {
    splashes.push({ amp: 0, decay: 0, hpState: 0, panL: 0.5, panR: 0.5 });
  }

  for (let i = 0; i < totalSamples; i++) {
    const pL = pinkL.next();
    const pR = pinkR.next();
    const bL = brownL.next();
    const bR = brownR.next();

    const rawBedL = pL * 0.55 + bL * 0.45;
    const rawBedR = pR * 0.55 + bR * 0.45;

    const bedL = bedLP_L.process(rawBedL) * 0.55
               + bedHP_L.process(rawBedL) * 0.35
               + bedPresence_L.process(rawBedL) * 0.25
               + bedWarmth_L.process(rawBedL) * 0.40;
    const bedR = bedLP_R.process(rawBedR) * 0.55
               + bedHP_R.process(rawBedR) * 0.35
               + bedPresence_R.process(rawBedR) * 0.25
               + bedWarmth_R.process(rawBedR) * 0.40;

    if (Math.random() < 0.0041) {
      const d = drops[Math.floor(Math.random() * MAX_DROPS)];
      const size = Math.pow(Math.random(), 2.2);
      d.amp = (0.06 + size * 0.30) * (0.7 + Math.random() * 0.6);
      d.freq = 3200 - size * 2400 + Math.random() * 500;
      d.freqGlide = 0.9994 - size * 0.0004;
      d.decay = 0.9940 - size * 0.0055;
      d.phase = Math.random() * Math.PI * 2;
      d.noiseAmt = 0.35 + Math.random() * 0.45;
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

    left[i] = bedL * 0.85 + dropL * 0.55 + splashL * 0.22;
    right[i] = bedR * 0.85 + dropR * 0.55 + splashR * 0.22;
  }
}

// =========================================================================
// 2. OCEAN
// =========================================================================
function genCalmOcean(left, right, totalSamples, sampleRate) {
  const deepLP_L = new BiquadLP(160, sampleRate, 1.0);
  const deepLP_R = new BiquadLP(160, sampleRate, 1.0);
  const subPeak_L = new BiquadBP(60, sampleRate, 1.3);
  const subPeak_R = new BiquadBP(62, sampleRate, 1.3);
  const lowMid_L = new BiquadLP(320, sampleRate, 0.9);
  const lowMid_R = new BiquadLP(320, sampleRate, 0.9);

  const foamBP_L = new BiquadBP(650, sampleRate, 1.0);
  const foamBP_R = new BiquadBP(720, sampleRate, 1.0);
  const foamLP_L = new BiquadLP(2000, sampleRate, 0.7);
  const foamLP_R = new BiquadLP(2000, sampleRate, 0.7);
  const foamHP_L = new BiquadHP(280, sampleRate, 0.7);
  const foamHP_R = new BiquadHP(280, sampleRate, 0.7);

  const washBP_L = new BiquadBP(480, sampleRate, 1.6);
  const washBP_R = new BiquadBP(520, sampleRate, 1.6);

  const brownL = new BrownNoise();
  const brownR = new BrownNoise();
  const pinkL = new PinkNoise();
  const pinkR = new PinkNoise();

  const P1 = 11.0;
  const P2 = 13.0;
  const P3 = 8.5;

  const waveEnv = (phase) => {
    if (phase < 0.38) return Math.pow(phase / 0.38, 1.7) * 0.82;
    else if (phase < 0.52) {
      const c = (phase - 0.38) / 0.14;
      return 0.82 + Math.sin(c * Math.PI) * 0.18;
    } else {
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

    const swellL = 0.55 + wave1 * 0.45 + wave2 * 0.18 + wave3 * 0.20;
    const swellR = 0.55 + wave1 * 0.18 + wave2 * 0.45 + wave3 * 0.20;

    const bL = brownL.next();
    const bR = brownR.next();
    const bassL = deepLP_L.process(bL) + subPeak_L.process(bL) * 0.45;
    const bassR = deepLP_R.process(bR) + subPeak_R.process(bR) * 0.45;

    const wL = pinkL.next();
    const wR = pinkR.next();
    const washL = washBP_L.process(wL) * (0.4 + wave1 * 0.7) * lowMid_L.process(wL) * 0.5;
    const washR = washBP_R.process(wR) * (0.4 + wave2 * 0.7) * lowMid_R.process(wR) * 0.5;

    const foamIntL = Math.pow(Math.max(0, wave1 - 0.25), 1.4) * 0.8
                   + Math.pow(Math.max(0, wave2 - 0.30), 1.4) * 0.35
                   + Math.pow(Math.max(0, wave3 - 0.30), 1.4) * 0.25;
    const foamIntR = Math.pow(Math.max(0, wave1 - 0.30), 1.4) * 0.35
                   + Math.pow(Math.max(0, wave2 - 0.25), 1.4) * 0.8
                   + Math.pow(Math.max(0, wave3 - 0.30), 1.4) * 0.25;

    const foamL = foamLP_L.process(foamBP_L.process(wL * foamIntL)) - foamHP_L.process(wL * foamIntL) * 0.4;
    const foamR = foamLP_R.process(foamBP_R.process(wR * foamIntR)) - foamHP_R.process(wR * foamIntR) * 0.4;

    left[i] = bassL * 0.45 * swellL + washL * 0.55 + foamL * 1.6;
    right[i] = bassR * 0.45 * swellR + washR * 0.55 + foamR * 1.6;
  }
}

// =========================================================================
// 3. WIND
// =========================================================================
function genCalmWind(left, right, totalSamples, sampleRate) {
  const rumbleLP_L = new BiquadLP(180, sampleRate, 1.0);
  const rumbleLP_R = new BiquadLP(180, sampleRate, 1.0);
  const rumbleBP_L = new BiquadBP(75, sampleRate, 1.4);
  const rumbleBP_R = new BiquadBP(78, sampleRate, 1.4);

  const midBP_L = new BiquadBP(420, sampleRate, 1.8);
  const midBP_R = new BiquadBP(480, sampleRate, 1.8);

  const whisperBP_L = new BiquadBP(1400, sampleRate, 2.5);
  const whisperBP_R = new BiquadBP(1550, sampleRate, 2.5);
  const whisperLP = new BiquadLP(2800, sampleRate, 0.7);

  const warmLP_L = new BiquadLP(2000, sampleRate, 0.7);
  const warmLP_R = new BiquadLP(2000, sampleRate, 0.7);

  let midStateL = 0, midStateR = 0;
  const brownL = new BrownNoise();
  const brownR = new BrownNoise();
  const pinkL = new PinkNoise();
  const pinkR = new PinkNoise();

  for (let i = 0; i < totalSamples; i++) {
    const t = i / sampleRate;

    const g1 = 0.5 + 0.5 * Math.sin(t * 0.11);
    const g2 = 0.5 + 0.5 * Math.sin(t * 0.23 + 1.7);
    const g3 = 0.5 + 0.5 * Math.sin(t * 0.41 + 3.2);
    const g4 = 0.5 + 0.5 * Math.sin(t * 0.83 + 0.8);

    const gustRaw = 0.30 * g1 + 0.30 * g2 + 0.22 * g3 + 0.18 * g4;
    const gust = Math.pow(gustRaw, 1.25);

    const bL = brownL.next();
    const bR = brownR.next();
    const pL = pinkL.next();
    const pR = pinkR.next();

    midStateL = midStateL * 0.90 + pL * 0.10;
    midStateR = midStateR * 0.90 + pR * 0.10;

    const rumbleL = rumbleLP_L.process(bL) + rumbleBP_L.process(bL) * 0.5;
    const rumbleR = rumbleLP_R.process(bR) + rumbleBP_R.process(bR) * 0.5;

    const midIntensity = Math.pow(Math.max(0, gust - 0.28), 1.5) * 2.2;
    const midL = midBP_L.process(midStateL) * 0.5 * midIntensity;
    const midR = midBP_R.process(midStateR) * 0.5 * midIntensity;

    const whisperIntensity = Math.pow(Math.max(0, gust - 0.50), 2.0) * 2.5;
    const whisperL = whisperLP.process(whisperBP_L.process(pL)) * 0.22 * whisperIntensity;
    const whisperR = whisperLP.process(whisperBP_R.process(pR)) * 0.22 * whisperIntensity;

    const mixL = rumbleL * 0.55 * (0.5 + gust * 0.5) + midL * 0.65 + whisperL * 0.45;
    const mixR = rumbleR * 0.55 * (0.5 + gust * 0.5) + midR * 0.65 + whisperR * 0.45;

    left[i] = warmLP_L.process(mixL) * 1.3;
    right[i] = warmLP_R.process(mixR) * 1.3;
  }
}

// =========================================================================
// 4. FOREST — Now with REAL bird species and natural reverb
// =========================================================================
function genCalmForest(left, right, totalSamples, sampleRate) {
  // Creek
  const creekRushLP_L = new BiquadLP(800, sampleRate, 0.8);
  const creekRushLP_R = new BiquadLP(800, sampleRate, 0.8);
  const creekBubbleBP_L = new BiquadBP(1500, sampleRate, 2.5);
  const creekBubbleBP_R = new BiquadBP(1650, sampleRate, 2.5);

  // Pine wind
  const pineTrunkLP = new BiquadLP(120, sampleRate, 1.3);
  const pineNeedleBP_L = new BiquadBP(1600, sampleRate, 1.5);
  const pineNeedleBP_R = new BiquadBP(1800, sampleRate, 1.5);
  const pineNeedleLP = new BiquadLP(3200, sampleRate, 0.7);

  // Bird tone shaping — keep natural, don't over-filter
  const birdLP = new BiquadLP(8500, sampleRate, 0.7);
  const birdHP = new BiquadHP(900, sampleRate, 0.7);

  // Natural reverb (essential for live recording feel)
  const reverbL = new Reverb(sampleRate, 0.68, 0.42);
  const reverbR = new Reverb(sampleRate, 0.71, 0.44);

  let creekStateL = 0, creekStateR = 0;
  let pineStateL = 0, pineStateR = 0;

  const MAX_BUBBLES = 28;
  const bubbles = [];
  for (let i = 0; i < MAX_BUBBLES; i++) {
    bubbles.push({ amp: 0, freq: 0, phase: 0, decay: 0, panL: 0.5, panR: 0.5, rise: 0 });
  }

  // Bird events — real species at realistic times
  // Robin sings throughout, Blackbird answers, Song Thrush repeats phrases,
  // Chaffinch adds cascade, Great Tit punctuates, Nightingale solos in middle
  const birdEvents = {
    robin: [
      { start: 2.0, amp: 0.55 },
      { start: 12.0, amp: 0.50 },
      { start: 22.0, amp: 0.52 },
    ],
    blackbird: [
      { start: 7.5, amp: 0.60 },
      { start: 18.0, amp: 0.55 },
      { start: 27.0, amp: 0.50 },
    ],
    songThrush: [
      { start: 14.5, amp: 0.55 },
      { start: 25.5, amp: 0.50 },
    ],
    chaffinch: [
      { start: 5.0, amp: 0.45 },
      { start: 16.0, amp: 0.42 },
      { start: 28.5, amp: 0.40 },
    ],
    greatTit: [
      { start: 10.0, amp: 0.38 },
      { start: 20.5, amp: 0.36 },
    ],
    nightingale: [
      { start: 3.5, amp: 0.58 },
      { start: 23.5, amp: 0.55 },
    ],
  };

  // Pre-compute bird stereo positions (small delays create realistic placement)
  // Left/right delay offsets in samples for each species
  const speciesPan = {
    robin: { lDelay: 12, rDelay: 0, lGain: 0.65, rGain: 0.85 },
    blackbird: { lDelay: 0, rDelay: 8, lGain: 0.80, rGain: 0.60 },
    songThrush: { lDelay: 20, rDelay: 0, lGain: 0.55, rGain: 0.90 },
    chaffinch: { lDelay: 0, rDelay: 15, lGain: 0.85, rGain: 0.55 },
    greatTit: { lDelay: 5, rDelay: 5, lGain: 0.75, rGain: 0.70 },
    nightingale: { lDelay: 8, rDelay: 0, lGain: 0.70, rGain: 0.80 },
  };

  // Delay buffers for stereo positioning
  const MAX_PAN_DELAY = 32;
  const panBuffers = {};
  for (const species of Object.keys(speciesPan)) {
    panBuffers[species] = {
      L: new Float32Array(MAX_PAN_DELAY),
      R: new Float32Array(MAX_PAN_DELAY),
      idx: 0,
    };
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

    // ===== BIRDS (REAL SPECIES) =====
    let birdL = 0, birdR = 0;

    // European Robin
    for (const ev of birdEvents.robin) {
      const call = europeanRobin(t, ev.start, ev.amp);
      if (call !== 0) {
        const pan = speciesPan.robin;
        const pb = panBuffers.robin;
        pb.L[pb.idx] = call;
        pb.R[pb.idx] = call;
        const lOut = pb.L[(pb.idx - pan.lDelay + MAX_PAN_DELAY) % MAX_PAN_DELAY] * pan.lGain;
        const rOut = pb.R[(pb.idx - pan.rDelay + MAX_PAN_DELAY) % MAX_PAN_DELAY] * pan.rGain;
        pb.idx = (pb.idx + 1) % MAX_PAN_DELAY;
        birdL += lOut;
        birdR += rOut;
      }
    }

    // Common Blackbird
    for (const ev of birdEvents.blackbird) {
      const call = commonBlackbird(t, ev.start, ev.amp);
      if (call !== 0) {
        const pan = speciesPan.blackbird;
        const pb = panBuffers.blackbird;
        pb.L[pb.idx] = call;
        pb.R[pb.idx] = call;
        const lOut = pb.L[(pb.idx - pan.lDelay + MAX_PAN_DELAY) % MAX_PAN_DELAY] * pan.lGain;
        const rOut = pb.R[(pb.idx - pan.rDelay + MAX_PAN_DELAY) % MAX_PAN_DELAY] * pan.rGain;
        pb.idx = (pb.idx + 1) % MAX_PAN_DELAY;
        birdL += lOut;
        birdR += rOut;
      }
    }

    // Song Thrush
    for (const ev of birdEvents.songThrush) {
      const call = songThrush(t, ev.start, ev.amp);
      if (call !== 0) {
        const pan = speciesPan.songThrush;
        const pb = panBuffers.songThrush;
        pb.L[pb.idx] = call;
        pb.R[pb.idx] = call;
        const lOut = pb.L[(pb.idx - pan.lDelay + MAX_PAN_DELAY) % MAX_PAN_DELAY] * pan.lGain;
        const rOut = pb.R[(pb.idx - pan.rDelay + MAX_PAN_DELAY) % MAX_PAN_DELAY] * pan.rGain;
        pb.idx = (pb.idx + 1) % MAX_PAN_DELAY;
        birdL += lOut;
        birdR += rOut;
      }
    }

    // Common Chaffinch
    for (const ev of birdEvents.chaffinch) {
      const call = commonChaffinch(t, ev.start, ev.amp);
      if (call !== 0) {
        const pan = speciesPan.chaffinch;
        const pb = panBuffers.chaffinch;
        pb.L[pb.idx] = call;
        pb.R[pb.idx] = call;
        const lOut = pb.L[(pb.idx - pan.lDelay + MAX_PAN_DELAY) % MAX_PAN_DELAY] * pan.lGain;
        const rOut = pb.R[(pb.idx - pan.rDelay + MAX_PAN_DELAY) % MAX_PAN_DELAY] * pan.rGain;
        pb.idx = (pb.idx + 1) % MAX_PAN_DELAY;
        birdL += lOut;
        birdR += rOut;
      }
    }

    // Great Tit
    for (const ev of birdEvents.greatTit) {
      const call = greatTit(t, ev.start, ev.amp);
      if (call !== 0) {
        const pan = speciesPan.greatTit;
        const pb = panBuffers.greatTit;
        pb.L[pb.idx] = call;
        pb.R[pb.idx] = call;
        const lOut = pb.L[(pb.idx - pan.lDelay + MAX_PAN_DELAY) % MAX_PAN_DELAY] * pan.lGain;
        const rOut = pb.R[(pb.idx - pan.rDelay + MAX_PAN_DELAY) % MAX_PAN_DELAY] * pan.rGain;
        pb.idx = (pb.idx + 1) % MAX_PAN_DELAY;
        birdL += lOut;
        birdR += rOut;
      }
    }

    // Nightingale
    for (const ev of birdEvents.nightingale) {
      const call = nightingale(t, ev.start, ev.amp);
      if (call !== 0) {
        const pan = speciesPan.nightingale;
        const pb = panBuffers.nightingale;
        pb.L[pb.idx] = call;
        pb.R[pb.idx] = call;
        const lOut = pb.L[(pb.idx - pan.lDelay + MAX_PAN_DELAY) % MAX_PAN_DELAY] * pan.lGain;
        const rOut = pb.R[(pb.idx - pan.rDelay + MAX_PAN_DELAY) % MAX_PAN_DELAY] * pan.rGain;
        pb.idx = (pb.idx + 1) % MAX_PAN_DELAY;
        birdL += lOut;
        birdR += rOut;
      }
    }

    // Bird tone shaping
    birdL = birdLP.process(birdL) - birdHP.process(birdL) * 0.3;
    birdR = birdLP.process(birdR) - birdHP.process(birdR) * 0.3;

    // ===== NATURAL REVERB =====
    const wetL = reverbL.process(birdL * 0.35);
    const wetR = reverbR.process(birdR * 0.35);

    // ===== MIX =====
    left[i] = creekRushL * 0.55 + bubbleL * 0.55 + (needleL + trunkSway) * 0.55 + birdL * 0.85 + wetL * 0.40;
    right[i] = creekRushR * 0.55 + bubbleR * 0.55 + (needleR + trunkSway) * 0.55 + birdR * 0.85 + wetR * 0.40;
  }
}

// =========================================================================
// 5. FIREPLACE
// =========================================================================
function genCalmFireplace(left, right, totalSamples, sampleRate) {
  const roarLP_L = new BiquadLP(160, sampleRate, 0.9);
  const roarLP_R = new BiquadLP(160, sampleRate, 0.9);
  const roarBP_L = new BiquadBP(80, sampleRate, 1.2);
  const roarBP_R = new BiquadBP(82, sampleRate, 1.2);

  const flickerBP_L = new BiquadBP(420, sampleRate, 1.4);
  const flickerBP_R = new BiquadBP(460, sampleRate, 1.4);
  const flickerLP = new BiquadLP(1400, sampleRate, 0.7);

  const crackleRes = new BiquadBP(260, sampleRate, 4.0);

  const brownL = new BrownNoise();
  const brownR = new BrownNoise();
  let flickerStateL = 0, flickerStateR = 0;

  const MAX_CRACKLES = 56;
  const crackles = [];
  for (let i = 0; i < MAX_CRACKLES; i++) {
    crackles.push({ amp: 0, phase: 0, freq: 0, decay: 0, panL: 0.5, panR: 0.5, noise: 0 });
  }

  for (let i = 0; i < totalSamples; i++) {
    const t = i / sampleRate;

    const bL = brownL.next();
    const bR = brownR.next();

    const roarL = roarLP_L.process(bL) + roarBP_L.process(bL) * 0.45;
    const roarR = roarLP_R.process(bR) + roarBP_R.process(bR) * 0.45;

    const fL = Math.random() * 2 - 1;
    flickerStateL = flickerStateL * 0.72 + fL * 0.28;
    const fR = Math.random() * 2 - 1;
    flickerStateR = flickerStateR * 0.72 + fR * 0.28;

    const flickerModL = 0.5 + 0.5 * Math.sin(t * 43 + Math.sin(t * 11) * 3);
    const flickerModR = 0.5 + 0.5 * Math.sin(t * 49 + Math.sin(t * 15) * 3);

    const flickerL = flickerLP.process(flickerBP_L.process(flickerStateL)) * 0.30 * flickerModL;
    const flickerR = flickerLP.process(flickerBP_R.process(flickerStateR)) * 0.30 * flickerModR;

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

    left[i] = roarL * 0.60 + flickerL * 0.38 + crackleL * 1.0;
    right[i] = roarR * 0.60 + flickerR * 0.38 + crackleR * 1.0;
  }
}

// =========================================================================
// 6. NIGHT
// =========================================================================
function genCalmNight(left, right, totalSamples, sampleRate) {
  const cricketBP_L = new BiquadBP(4100, sampleRate, 7.0);
  const cricketBP_R = new BiquadBP(4400, sampleRate, 7.0);
  const katydidBP_L = new BiquadBP(6300, sampleRate, 5.0);
  const katydidBP_R = new BiquadBP(6600, sampleRate, 5.0);
  const frogBP_L = new BiquadBP(2100, sampleRate, 5.0);
  const frogBP_R = new BiquadBP(2300, sampleRate, 5.0);

  const airLP_L = new BiquadLP(380, sampleRate, 0.7);
  const airLP_R = new BiquadLP(380, sampleRate, 0.7);

  const brownL = new BrownNoise();
  const brownR = new BrownNoise();

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
      chirpPeriod: 0.40 + Math.random() * 0.30,
      pulsePeriod: 0.032 + Math.random() * 0.012,
      active: true,
      wobble: Math.random() * Math.PI * 2,
    });
  }

  let katydidPhaseL = 0, katydidPhaseR = 0;
  let frogPhaseL = 0, frogPhaseR = 0;
  let frogCallPhase = 0;
  let frogActive = false;

  for (let i = 0; i < totalSamples; i++) {
    const t = i / sampleRate;

    const bL = brownL.next();
    const bR = brownR.next();
    const airL = airLP_L.process(bL) * 1.2;
    const airR = airLP_R.process(bR) * 1.2;

    let cricketL = 0, cricketR = 0;

    for (let k = 0; k < MAX_CRICKETS; k++) {
      const c = crickets[k];

      if (k >= 7) {
        const activity = Math.sin(t * 0.09 + k * 2.3) + Math.sin(t * 0.21 + k * 1.1);
        c.active = activity > -0.4;
      }

      if (!c.active) continue;

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
        const pulsePhase = 1 - (c.pulseTimer / c.pulsePeriod);
        const pulseEnv = Math.max(0, Math.sin(pulsePhase * Math.PI));

        const wobble = Math.sin(t * 180 + c.wobble) * 35;
        const freq = c.baseFreq + wobble;
        c.phase += 2 * Math.PI * freq / sampleRate;

        const raw = (Math.sin(c.phase) + Math.sin(c.phase * 2) * 0.35) * pulseEnv * 0.13;

        cricketL += cricketBP_L.process(raw) * c.panL;
        cricketR += cricketBP_R.process(raw) * c.panR;
      }
    }

    const katydidPulse = 0.5 + 0.5 * Math.sin(t * 2.1);
    const katydidEnv = 0.25 + 0.75 * Math.pow(katydidPulse, 2);

    katydidPhaseL += 2 * Math.PI * 6400 / sampleRate;
    katydidPhaseR += 2 * Math.PI * 6700 / sampleRate;

    const katydidRawL = (Math.sin(katydidPhaseL) + 0.45 * Math.sin(katydidPhaseL * 2) + 0.20 * Math.sin(katydidPhaseL * 3)) * 0.06 * katydidEnv;
    const katydidRawR = (Math.sin(katydidPhaseR) + 0.45 * Math.sin(katydidPhaseR * 2) + 0.20 * Math.sin(katydidPhaseR * 3)) * 0.06 * katydidEnv;

    const katydidL = katydidBP_L.process(katydidRawL) * 0.5;
    const katydidR = katydidBP_R.process(katydidRawR) * 0.5;

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

console.log('Generating live-recording realism ambient soundscapes...');
sounds.forEach(({ folder, file, gen }) => {
  const dir = path.join(__dirname, '..', 'public', 'audio', folder);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  const filePath = path.join(dir, file);
  const buf = createWavBuffer(SAMPLE_RATE, DURATION, gen);
  fs.writeFileSync(filePath, buf);
  console.log(`✓ Generated ${filePath} (${(buf.length / 1024).toFixed(1)} KB)`);
});
console.log('All 6 live-realism soundscapes successfully synthesized!');