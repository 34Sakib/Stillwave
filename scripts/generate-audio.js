const fs = require('fs');
const path = require('path');

// Helper to write a 16-bit PCM stereo WAV file with seamless loop blending
function createWavBuffer(sampleRate, durationSec, generateSamples) {
  const numChannels = 2;
  const bytesPerSample = 2;
  const totalSamples = Math.floor(sampleRate * durationSec);
  const blockAlign = numChannels * bytesPerSample;
  const byteRate = sampleRate * blockAlign;
  const dataSize = totalSamples * blockAlign;
  const buffer = Buffer.alloc(44 + dataSize);

  // RIFF header
  buffer.write('RIFF', 0);
  buffer.writeUInt32LE(36 + dataSize, 4);
  buffer.write('WAVE', 8);

  // fmt subchunk
  buffer.write('fmt ', 12);
  buffer.writeUInt32LE(16, 16);
  buffer.writeUInt16LE(1, 20); // PCM
  buffer.writeUInt16LE(numChannels, 22);
  buffer.writeUInt32LE(sampleRate, 24);
  buffer.writeUInt32LE(byteRate, 28);
  buffer.writeUInt16LE(blockAlign, 32);
  buffer.writeUInt16LE(bytesPerSample * 8, 34);

  // data subchunk
  buffer.write('data', 36);
  buffer.writeUInt32LE(dataSize, 40);

  const left = new Float32Array(totalSamples);
  const right = new Float32Array(totalSamples);
  generateSamples(left, right, totalSamples, sampleRate);

  // Seamless 2.0-second equal-power loop crossfade at boundaries
  const fadeLength = Math.floor(sampleRate * 2.0);
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

  // Write samples with smooth analog-style warm soft saturation
  let offset = 44;
  for (let i = 0; i < totalSamples; i++) {
    let l = left[i];
    let r = right[i];

    // Warm soft-knee limiter
    l = Math.tanh(l * 1.05) * 0.88;
    r = Math.tanh(r * 1.05) * 0.88;

    const intL = Math.max(-32767, Math.min(32767, Math.floor(l * 32767)));
    const intR = Math.max(-32767, Math.min(32767, Math.floor(r * 32767)));

    buffer.writeInt16LE(intL, offset);
    buffer.writeInt16LE(intR, offset + 2);
    offset += 4;
  }

  return buffer;
}

const SAMPLE_RATE = 44100;
const DURATION = 24; // 24 seconds loopable for rich variety, natural phasing, and breathing room

// Lowpass Biquad Filter helper
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

// Bandpass Biquad Filter helper
class BiquadBP {
  constructor(centerFreq, sampleRate, q = 2.0) {
    const w0 = 2 * Math.PI * centerFreq / sampleRate;
    const alpha = Math.sin(w0) / (2 * q);
    const a0 = 1 + alpha;
    this.b0 = (alpha) / a0;
    this.b1 = 0;
    this.b2 = (-alpha) / a0;
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
// 1. REALISTIC CONTINUOUS RAIN (Acoustically calibrated to YouTube eTeD8DAta4c)
// Layer A: Smooth continuous pink/brown rain bed (warmth peak 650Hz, soft 2.8kHz LP)
// Layer B: Dense irregular stochastic raindrop patter (Poisson distributed micro-bursts)
// Layer C: Subtle resonant water droplets and surface splashes
// =========================================================================
function genCalmRain(left, right, totalSamples, sampleRate) {
  const lpL = new BiquadLP(2800, sampleRate, 0.7);
  const lpR = new BiquadLP(2800, sampleRate, 0.7);
  const warmthL = new BiquadBP(650, sampleRate, 1.2);
  const warmthR = new BiquadBP(650, sampleRate, 1.2);
  const hpL = new BiquadLP(110, sampleRate, 0.7); // subtract sub-bass
  const hpR = new BiquadLP(110, sampleRate, 0.7);

  // Kellet's filter state
  let b0L = 0, b1L = 0, b2L = 0, b3L = 0, b4L = 0, b5L = 0, b6L = 0;
  let b0R = 0, b1R = 0, b2R = 0, b3R = 0, b4R = 0, b5R = 0, b6R = 0;
  let brownL = 0, brownR = 0;

  // Active micro-droplets
  let activeDropL = 0, dropDecayL = 0;
  let activeDropR = 0, dropDecayR = 0;

  // Active resonant splashes
  let splashFreqL = 0, splashPhaseL = 0, splashAmpL = 0, splashDecayL = 0;
  let splashFreqR = 0, splashPhaseR = 0, splashAmpR = 0, splashDecayR = 0;

  for (let i = 0; i < totalSamples; i++) {
    // --- LAYER A: Continuous Bed ---
    const wL = Math.random() * 2 - 1;
    b0L = 0.99886 * b0L + wL * 0.0555179;
    b1L = 0.99332 * b1L + wL * 0.0750759;
    b2L = 0.96900 * b2L + wL * 0.1538520;
    b3L = 0.86650 * b3L + wL * 0.3104856;
    b4L = 0.55000 * b4L + wL * 0.5329522;
    b5L = -0.7616 * b5L - wL * 0.0168980;
    const pinkL = b0L + b1L + b2L + b3L + b4L + b5L + b6L + wL * 0.5362;
    b6L = wL * 0.115926;
    brownL = (brownL + 0.03 * wL) / 1.02;

    const wR = Math.random() * 2 - 1;
    b0R = 0.99886 * b0R + wR * 0.0555179;
    b1R = 0.99332 * b1R + wR * 0.0750759;
    b2R = 0.96900 * b2R + wR * 0.1538520;
    b3R = 0.86650 * b3R + wR * 0.3104856;
    b4R = 0.55000 * b4R + wR * 0.5329522;
    b5R = -0.7616 * b5R - wR * 0.0168980;
    const pinkR = b0R + b1R + b2R + b3R + b4R + b5R + b6R + wR * 0.5362;
    b6R = wR * 0.115926;
    brownR = (brownR + 0.03 * wR) / 1.02;

    const rawBedL = (pinkL * 0.08 * 0.75) + (brownL * 0.22);
    const rawBedR = (pinkR * 0.08 * 0.75) + (brownR * 0.22);

    const bedL = lpL.process(rawBedL) - hpL.process(rawBedL) * 0.8 + warmthL.process(rawBedL) * 0.35;
    const bedR = lpR.process(rawBedR) - hpR.process(rawBedR) * 0.8 + warmthR.process(rawBedR) * 0.35;

    // --- LAYER B: Fine Raindrop Patter (Stochastic bursts) ---
    if (Math.random() < 0.0035) { // ~150 bursts/sec shared
      activeDropL = (Math.random() * 0.25 + 0.08) * (Math.random() * 2 - 1);
      dropDecayL = 0.92 + Math.random() * 0.05;
    }
    if (Math.random() < 0.0035) {
      activeDropR = (Math.random() * 0.25 + 0.08) * (Math.random() * 2 - 1);
      dropDecayR = 0.92 + Math.random() * 0.05;
    }
    activeDropL *= dropDecayL;
    activeDropR *= dropDecayR;

    // --- LAYER C: Subtle Water Splashes (Sparse downward pitch sweeps) ---
    if (Math.random() < 0.00004) { // ~1.7 splashes/sec
      splashFreqL = 1200 + Math.random() * 600;
      splashPhaseL = 0;
      splashAmpL = 0.09 + Math.random() * 0.06;
      splashDecayL = 0.985;
    }
    if (Math.random() < 0.00004) {
      splashFreqR = 1200 + Math.random() * 600;
      splashPhaseR = 0;
      splashAmpR = 0.09 + Math.random() * 0.06;
      splashDecayR = 0.985;
    }

    let splashL = 0;
    if (splashAmpL > 0.001) {
      splashPhaseL += 2 * Math.PI * splashFreqL / sampleRate;
      splashFreqL *= 0.9992; // gentle drop downward
      splashL = Math.sin(splashPhaseL) * splashAmpL;
      splashAmpL *= splashDecayL;
    }

    let splashR = 0;
    if (splashAmpR > 0.001) {
      splashPhaseR += 2 * Math.PI * splashFreqR / sampleRate;
      splashFreqR *= 0.9992;
      splashR = Math.sin(splashPhaseR) * splashAmpR;
      splashAmpR *= splashDecayR;
    }

    // Blend: Bed (65%) + Patter (25%) + Splash (10%)
    left[i] = bedL * 0.68 + activeDropL * 0.22 + splashL * 0.10;
    right[i] = bedR * 0.68 + activeDropR * 0.22 + splashR * 0.10;
  }
}

// =========================================================================
// 2. CONTINUOUS DEEP OCEAN SWELL (Non-stop, seamless rolling ocean without any pause)
// - Continuous deep rolling water body: Never dies down or drops to silence
// - Dual overlapping wave surges (12s primary wave + 6s offset counter-wave)
// - Continuous foamy surf wash that rolls seamlessly
// - 100% gapless non-stop playback
// =========================================================================
function genCalmOcean(left, right, totalSamples, sampleRate) {
  const deepLP_L = new BiquadLP(190, sampleRate, 1.2);
  const deepLP_R = new BiquadLP(190, sampleRate, 1.2);
  const surfBP_L = new BiquadBP(720, sampleRate, 1.3);
  const surfBP_R = new BiquadBP(800, sampleRate, 1.3);
  const foamLP_L = new BiquadLP(1200, sampleRate, 0.7);
  const foamLP_R = new BiquadLP(1200, sampleRate, 0.7);

  let brownL = 0, brownR = 0;

  for (let i = 0; i < totalSamples; i++) {
    const t = i / sampleRate;

    // Wave 1: 12-second primary ocean surge
    const phase1 = (t % 12) / 12;
    const wave1 = 0.5 * (1 - Math.cos(phase1 * Math.PI * 2)); // Smooth raised cosine, never sharp

    // Wave 2: 12-second counter-swell offset by 6 seconds (crests when Wave 1 recedes)
    const phase2 = ((t + 6) % 12) / 12;
    const wave2 = 0.5 * (1 - Math.cos(phase2 * Math.PI * 2));

    // Wave 3: 8-second gentle rolling swell (keeps texture organic and non-repetitive)
    const phase3 = (t % 8) / 8;
    const wave3 = 0.5 * (1 - Math.cos(phase3 * Math.PI * 2));

    // Combined swell envelope: minimum is ALWAYS >= 0.55 so the ocean NEVER pauses or drops to silence!
    const totalSwell = 0.55 + 0.32 * wave1 + 0.28 * wave2 + 0.15 * wave3;

    // Deep ocean water body (continuous rolling brownian noise)
    const wL = Math.random() * 2 - 1;
    brownL = (brownL + 0.03 * wL) / 1.025;
    const wR = Math.random() * 2 - 1;
    brownR = (brownR + 0.03 * wR) / 1.025;

    const bassL = deepLP_L.process(brownL * 3.8);
    const bassR = deepLP_R.process(brownR * 3.8);

    // Dynamic foam wash corresponding to the cresting waves
    const foamWhiteL = (Math.random() * 2 - 1) * (0.35 * Math.pow(wave1, 1.8) + 0.30 * Math.pow(wave2, 1.8) + 0.15);
    const foamWhiteR = (Math.random() * 2 - 1) * (0.35 * Math.pow(wave1, 1.8) + 0.30 * Math.pow(wave2, 1.8) + 0.15);

    const foamL = foamLP_L.process(surfBP_L.process(foamWhiteL) * 2.2);
    const foamR = foamLP_R.process(surfBP_R.process(foamWhiteR) * 2.2);

    // Smooth spatial stereo sway
    const panL = 0.78 + 0.22 * Math.sin(t * 0.45);
    const panR = 0.78 - 0.22 * Math.sin(t * 0.45);

    // Continuous non-stop sound: continuous deep water body + seamless overlapping waves
    left[i] = (bassL * 0.75 * totalSwell + foamL * 0.42) * panL;
    right[i] = (bassR * 0.75 * totalSwell + foamR * 0.42) * panR;
  }
}

// =========================================================================
// 3. CALMING HIGHLAND WIND (Airy, whispering mountain gusts)
// =========================================================================
function genCalmWind(left, right, totalSamples, sampleRate) {
  const bp1_L = new BiquadBP(320, sampleRate, 1.8);
  const bp1_R = new BiquadBP(360, sampleRate, 1.8);
  const bp2_L = new BiquadBP(650, sampleRate, 2.2);
  const bp2_R = new BiquadBP(720, sampleRate, 2.2);
  const lp_L = new BiquadLP(1100, sampleRate, 0.7);
  const lp_R = new BiquadLP(1100, sampleRate, 0.7);

  let noiseL = 0, noiseR = 0;

  for (let i = 0; i < totalSamples; i++) {
    const t = i / sampleRate;
    const gust1 = 0.5 + 0.4 * Math.sin((t / 24) * Math.PI * 2);
    const gust2 = 0.3 + 0.25 * Math.sin((t / 12) * Math.PI * 2 + 1.2);
    const gustEnvelope = Math.max(0.15, (gust1 * 0.65 + gust2 * 0.35));

    const wL = Math.random() * 2 - 1;
    noiseL = noiseL * 0.88 + wL * 0.12;
    const wR = Math.random() * 2 - 1;
    noiseR = noiseR * 0.88 + wR * 0.12;

    const airLowL = bp1_L.process(noiseL) * 2.8;
    const airLowR = bp1_R.process(noiseR) * 2.8;
    const airHighL = bp2_L.process(noiseL) * 1.5;
    const airHighR = bp2_R.process(noiseR) * 1.5;

    const totalL = lp_L.process(airLowL + airHighL);
    const totalR = lp_R.process(airLowR + airHighR);

    left[i] = totalL * 1.4 * gustEnvelope;
    right[i] = totalR * 1.4 * gustEnvelope;
  }
}

// =========================================================================
// 4. DEEP TEMPERATE PINE FOREST (Mountain Creek, Pine Wind, Woodpecker & Thrush)
// Pure Alpine Wilderness: Continuous mountain creek runoff over stones,
// towering pine canopy wind, rhythmic hollow woodpecker trunk drumming,
// and pure crystalline European Wood Thrush whistles.
// ZERO village, ZERO doves, ZERO crows, ZERO koel sounds.
// =========================================================================
function genCalmForest(left, right, totalSamples, sampleRate) {
  // Mountain brook filters (active bubbling creek over granite pebbles)
  const creekLP_L = new BiquadLP(680, sampleRate, 0.85);
  const creekLP_R = new BiquadLP(680, sampleRate, 0.85);
  const creekSprayBP_L = new BiquadBP(1100, sampleRate, 1.8);
  const creekSprayBP_R = new BiquadBP(1250, sampleRate, 1.8);

  // Pine tree canopy wind (deep resonant trunk swaying + high needle whisper)
  const pineTrunkLP = new BiquadLP(110, sampleRate, 1.4);
  const pineNeedleBP_L = new BiquadBP(1550, sampleRate, 1.6);
  const pineNeedleBP_R = new BiquadBP(1750, sampleRate, 1.6);

  // Woodpecker hollow trunk resonance filter
  const woodpeckerBP = new BiquadBP(450, sampleRate, 3.5);

  let cL = 0, cR = 0;
  let pL = 0, pR = 0;

  // Forest delay line for wide alpine space
  const delaySamples = Math.floor(sampleRate * 0.08);
  const delayBufferL = new Float32Array(delaySamples);
  const delayBufferR = new Float32Array(delaySamples);
  let delayIndex = 0;

  for (let i = 0; i < totalSamples; i++) {
    const t = i / sampleRate;

    // --- Active Mountain Brook ---
    const wL = Math.random() * 2 - 1;
    cL = cL * 0.82 + wL * 0.18;
    const wR = Math.random() * 2 - 1;
    cR = cR * 0.82 + wR * 0.18;

    let bubbleL = 0, bubbleR = 0;
    if (Math.random() < 0.0018) bubbleL = (Math.random() * 0.24 - 0.12);
    if (Math.random() < 0.0018) bubbleR = (Math.random() * 0.24 - 0.12);

    const creekL = creekLP_L.process(cL) * 0.42 + creekSprayBP_L.process(cL + bubbleL) * 0.26;
    const creekR = creekLP_R.process(cR) * 0.42 + creekSprayBP_R.process(cR + bubbleR) * 0.26;

    // --- Pine Wind ---
    const wPineL = Math.random() * 2 - 1;
    pL = pL * 0.92 + wPineL * 0.08;
    const wPineR = Math.random() * 2 - 1;
    pR = pR * 0.92 + wPineR * 0.08;

    const trunkSway = pineTrunkLP.process(pL + pR) * 0.32;
    const needleL = pineNeedleBP_L.process(pL) * 0.22 * (0.8 + 0.2 * Math.sin(t * 0.35));
    const needleR = pineNeedleBP_R.process(pR) * 0.22 * (0.8 + 0.2 * Math.cos(t * 0.35));

    // --- Alpine Forest Avian Sounds ---
    let forestL = 0;
    let forestR = 0;

    // 1. WOODPECKER DRUMMING (Dry hollow pine trunk drumming: tat-tat-tat-tat-tat)
    // Burst 1 at t = 2.8s to 3.25s
    if (t > 2.8 && t < 3.25) {
      const bT = t - 2.8;
      const tapInterval = 0.042; // ~24 taps/sec
      const tapPhase = (bT % tapInterval) / tapInterval;
      if (tapPhase < 0.25) {
        const tapEnv = Math.exp(-tapPhase * 18);
        const impulse = (Math.sin(tapPhase * 450 * Math.PI * 2) + (Math.random() * 0.6 - 0.3)) * tapEnv;
        const drum = woodpeckerBP.process(impulse) * 0.35;
        forestR += drum * 0.85;
        forestL += drum * 0.25;
      }
    }
    // Burst 2 at t = 14.2s to 14.65s
    if (t > 14.2 && t < 14.65) {
      const bT = t - 14.2;
      const tapInterval = 0.044;
      const tapPhase = (bT % tapInterval) / tapInterval;
      if (tapPhase < 0.25) {
        const tapEnv = Math.exp(-tapPhase * 18);
        const impulse = (Math.sin(tapPhase * 430 * Math.PI * 2) + (Math.random() * 0.6 - 0.3)) * tapEnv;
        const drum = woodpeckerBP.process(impulse) * 0.30;
        forestL += drum * 0.85;
        forestR += drum * 0.25;
      }
    }

    // 2. EUROPEAN WOOD THRUSH & BLACKBIRD FLUTES (Pure high crystal melody)
    // Phrase 1 (t = 5.8s to 7.8s): Bell-like double-tone flute
    const thrush1 = (startT, dur, f1, f2) => {
      if (t < startT || t > startT + dur) return 0;
      const rT = (t - startT) / dur;
      const env = Math.pow(Math.sin(rT * Math.PI), 1.3);
      const freq = f1 + (f2 - f1) * rT;
      const ph = (t - startT) * freq * Math.PI * 2;
      // Pure glass flute overtone
      return (Math.sin(ph) + Math.sin(ph * 2) * 0.12) * env;
    };

    forestL += thrush1(5.8, 0.28, 2600, 3150) * 0.32;
    forestL += thrush1(6.15, 0.24, 3150, 3550) * 0.34;
    forestL += thrush1(6.46, 0.36, 3550, 2800) * 0.36;

    // Phrase 2 (t = 17.0s to 19.0s)
    forestL += thrush1(17.0, 0.26, 2750, 3250) * 0.32;
    forestL += thrush1(17.32, 0.28, 3250, 3700) * 0.34;
    forestL += thrush1(17.68, 0.40, 3700, 2900) * 0.35;

    // 3. GREAT TIT (Bright two-tone "tea-cher, tea-cher" staccato at t = 9.8s to 11.0s)
    const titNote = (startT, freq) => {
      if (t < startT || t > startT + 0.15) return 0;
      const rT = (t - startT) / 0.15;
      const env = Math.pow(Math.sin(rT * Math.PI), 1.2);
      const ph = (t - startT) * freq * Math.PI * 2;
      return Math.sin(ph) * env;
    };
    forestR += titNote(9.80, 3850) * 0.25;
    forestR += titNote(10.02, 3350) * 0.22;
    forestR += titNote(10.35, 3850) * 0.25;
    forestR += titNote(10.57, 3350) * 0.22;

    // Forest delay
    const delL = delayBufferL[delayIndex];
    const delR = delayBufferR[delayIndex];
    delayBufferL[delayIndex] = forestL + delL * 0.25;
    delayBufferR[delayIndex] = forestR + delR * 0.25;
    delayIndex = (delayIndex + 1) % delaySamples;

    left[i] = (creekL + needleL + trunkSway) * 0.75 + forestL + delL * 0.18;
    right[i] = (creekR + needleR + trunkSway) * 0.75 + forestR + delR * 0.18;
  }
}

// =========================================================================
// 5. HEARTH FIREPLACE (Warm hearth rumble + gentle birch crackles & soft ember pop)
// =========================================================================
function genCalmFireplace(left, right, totalSamples, sampleRate) {
  const hearthLP_L = new BiquadLP(250, sampleRate, 1.1);
  const hearthLP_R = new BiquadLP(250, sampleRate, 1.1);

  let lowL = 0, lowR = 0;

  for (let i = 0; i < totalSamples; i++) {
    const wL = Math.random() * 2 - 1;
    lowL = lowL * 0.95 + wL * 0.05;
    const wR = Math.random() * 2 - 1;
    lowR = lowR * 0.95 + wR * 0.04;

    const warmL = hearthLP_L.process(lowL) * 1.5;
    const warmR = hearthLP_R.process(lowR) * 1.5;

    let popL = 0, popR = 0;
    if (Math.random() < 0.00045) popL = (Math.random() * 0.45 + 0.15) * (Math.random() > 0.5 ? 1 : -1);
    if (Math.random() < 0.00045) popR = (Math.random() * 0.45 + 0.15) * (Math.random() > 0.5 ? 1 : -1);

    left[i] = warmL * 0.75 + popL * 0.35;
    right[i] = warmR * 0.75 + popR * 0.35;
  }
}

// =========================================================================
// 6. MIDNIGHT MEADOW (Serene summer crickets, warm night resonance, tranquil pulsing)
// =========================================================================
function genCalmNight(left, right, totalSamples, sampleRate) {
  for (let i = 0; i < totalSamples; i++) {
    const t = i / sampleRate;
    const pulse = (Math.sin(t * 13 * Math.PI * 2) > 0 ? 1 : 0) * (0.4 + 0.6 * Math.sin(t * 0.7 * Math.PI * 2));
    const carrier = Math.sin(t * 4200 * Math.PI * 2) * 0.11;
    const nightAir = (Math.random() * 2 - 1) * 0.015;

    left[i] = (carrier * pulse * 0.55) + nightAir;
    right[i] = (carrier * pulse * 0.50) + nightAir;
  }
}

const sounds = [
  { folder: 'rain', file: 'gentle-rain.wav', gen: genCalmRain },
  { folder: 'ocean', file: 'soft-waves.wav', gen: genCalmOcean },
  { folder: 'forest', file: 'forest-ambience.wav', gen: genCalmForest },
  { folder: 'fireplace', file: 'soft-crackling.wav', gen: genCalmFireplace },
  { folder: 'wind', file: 'gentle-breeze.wav', gen: genCalmWind },
  { folder: 'night', file: 'night-insects.wav', gen: genCalmNight },
];

console.log('Generating ultra-calming, high-fidelity ambient soundscapes (6 Core Ambient Environments)...');
sounds.forEach(({ folder, file, gen }) => {
  const dir = path.join(__dirname, '..', 'public', 'audio', folder);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  const filePath = path.join(dir, file);
  const buf = createWavBuffer(SAMPLE_RATE, DURATION, gen);
  fs.writeFileSync(filePath, buf);
  console.log(`✓ Generated ${filePath} (${(buf.length / 1024).toFixed(1)} KB)`);
});
console.log('All 6 soundscapes successfully synthesized and perfected!');
