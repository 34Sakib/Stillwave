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

  // Seamless 1.8-second equal-power loop crossfade at boundaries
  const fadeLength = Math.floor(sampleRate * 1.8);
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
const DURATION = 24; // 24 seconds loopable for rich variety, distinct avian phrases, and deep breathing room

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

// Helper: Synthesizes a realistic bird note with syrinx harmonics and smooth envelope
function birdSyllable(t, startT, dur, startFreq, endFreq, curve = 1.0, vibratoFreq = 0, vibratoDepth = 0) {
  if (t < startT || t > startT + dur) return 0;
  const relT = (t - startT) / dur;
  const env = Math.pow(Math.sin(relT * Math.PI), 1.25);
  let freq = startFreq + (endFreq - startFreq) * Math.pow(relT, curve);
  if (vibratoFreq > 0) {
    freq += Math.sin(relT * dur * vibratoFreq * Math.PI * 2) * vibratoDepth;
  }
  const phase = (t - startT) * freq * Math.PI * 2;
  const fundamental = Math.sin(phase);
  const secondHarmonic = Math.sin(phase * 2) * 0.16;
  const thirdHarmonic = Math.sin(phase * 3) * 0.04;
  return (fundamental + secondHarmonic + thirdHarmonic) * env;
}

// =========================================================================
// 1. IMPROVED CALM GENTLE RAIN (Soft, warm, restful patter with zero harsh hiss)
// =========================================================================
function genCalmRain(left, right, totalSamples, sampleRate) {
  const lpL = new BiquadLP(900, sampleRate, 0.7);
  const lpR = new BiquadLP(900, sampleRate, 0.7);
  const warmthL = new BiquadLP(350, sampleRate, 0.8);
  const warmthR = new BiquadLP(350, sampleRate, 0.8);

  let b0L = 0, b1L = 0, b2L = 0;
  let b0R = 0, b1R = 0, b2R = 0;

  for (let i = 0; i < totalSamples; i++) {
    const wL = Math.random() * 2 - 1;
    b0L = 0.997 * b0L + wL * 0.07;
    b1L = 0.985 * b1L + wL * 0.12;
    b2L = 0.950 * b2L + wL * 0.25;
    const pinkL = (b0L + b1L + b2L) * 0.22;

    const wR = Math.random() * 2 - 1;
    b0R = 0.997 * b0R + wR * 0.07;
    b1R = 0.985 * b1R + wR * 0.12;
    b2R = 0.950 * b2R + wR * 0.25;
    const pinkR = (b0R + b1R + b2R) * 0.22;

    const softL = lpL.process(pinkL);
    const softR = lpR.process(pinkR);
    const deepL = warmthL.process(pinkL) * 0.8;
    const deepR = warmthR.process(pinkR) * 0.8;

    let dropL = 0, dropR = 0;
    if (Math.random() < 0.0006) dropL = (Math.random() * 0.35 + 0.1) * (Math.random() > 0.5 ? 1 : -1);
    if (Math.random() < 0.0006) dropR = (Math.random() * 0.35 + 0.1) * (Math.random() > 0.5 ? 1 : -1);

    left[i] = softL * 0.7 + deepL * 0.3 + dropL * 0.25;
    right[i] = softR * 0.7 + deepR * 0.3 + dropR * 0.25;
  }
}

// =========================================================================
// 2. IMPROVED CALMING OCEAN WAVES (Deep Nordic swell, gentle foamy crest, slow hypnotic 12s period)
// =========================================================================
function genCalmOcean(left, right, totalSamples, sampleRate) {
  const deepLP_L = new BiquadLP(180, sampleRate, 1.2);
  const deepLP_R = new BiquadLP(180, sampleRate, 1.2);
  const surfBP_L = new BiquadBP(750, sampleRate, 1.4);
  const surfBP_R = new BiquadBP(820, sampleRate, 1.4);

  let brownL = 0, brownR = 0;

  for (let i = 0; i < totalSamples; i++) {
    const t = i / sampleRate;
    const wavePhase = (t % 12) / 12;

    let swell;
    if (wavePhase < 0.5) {
      swell = Math.pow(Math.sin(wavePhase * Math.PI), 1.6);
    } else if (wavePhase < 0.7) {
      swell = 0.95 + 0.05 * Math.sin((wavePhase - 0.5) * Math.PI * 5);
    } else {
      const decay = (wavePhase - 0.7) / 0.3;
      swell = Math.exp(-decay * 2.8) * 0.95 + 0.12;
    }

    const swell2 = 0.25 * Math.sin(((t + 3) / 12) * Math.PI * 2);
    const totalEnvelope = Math.max(0.1, swell + swell2);

    const wL = Math.random() * 2 - 1;
    brownL = (brownL + 0.03 * wL) / 1.03;
    const wR = Math.random() * 2 - 1;
    brownR = (brownR + 0.03 * wR) / 1.03;

    const bassL = deepLP_L.process(brownL * 4.5);
    const bassR = deepLP_R.process(brownR * 4.5);

    const foamWhiteL = (Math.random() * 2 - 1) * Math.pow(swell, 2.2);
    const foamWhiteR = (Math.random() * 2 - 1) * Math.pow(swell, 2.2);
    const foamL = surfBP_L.process(foamWhiteL) * 1.6;
    const foamR = surfBP_R.process(foamWhiteR) * 1.6;

    const panL = 0.7 + 0.3 * Math.sin(t * 0.6);
    const panR = 0.7 - 0.3 * Math.sin(t * 0.6);

    left[i] = (bassL * 0.9 * totalEnvelope + foamL * 0.45) * panL;
    right[i] = (bassR * 0.9 * totalEnvelope + foamR * 0.45) * panR;
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
// 4. DEEP TEMPERATE PINE FOREST (Mountain Creek, Pine Wind & Woodland Birds)
// Strictly temperate wilderness: Woodpecker drumming, Wood Thrush flute,
// and Great Tit calls. ZERO village or tropical sounds.
// =========================================================================
function genCalmForest(left, right, totalSamples, sampleRate) {
  // Mountain brook filters (active bubbling creek over river pebbles)
  const creekLP_L = new BiquadLP(580, sampleRate, 0.85);
  const creekLP_R = new BiquadLP(580, sampleRate, 0.85);
  const creekBP_L = new BiquadBP(950, sampleRate, 1.8);
  const creekBP_R = new BiquadBP(1020, sampleRate, 1.8);

  // Pine canopy wind filters (deep trunk resonance + high needle whisper)
  const pineTrunkLP = new BiquadLP(110, sampleRate, 1.4);
  const pineNeedleBP_L = new BiquadBP(1400, sampleRate, 1.6);
  const pineNeedleBP_R = new BiquadBP(1550, sampleRate, 1.6);

  // Woodpecker resonant acoustic cavity filter
  const woodBP = new BiquadBP(440, sampleRate, 3.2);

  let cL = 0, cR = 0;
  let pL = 0, pR = 0;

  // Spacious temperate canopy stereo delay line
  const delaySamples = Math.floor(sampleRate * 0.09);
  const delayBufferL = new Float32Array(delaySamples);
  const delayBufferR = new Float32Array(delaySamples);
  let delayIndex = 0;

  for (let i = 0; i < totalSamples; i++) {
    const t = i / sampleRate;

    // --- Creek Noise Base ---
    const wL = Math.random() * 2 - 1;
    cL = cL * 0.80 + wL * 0.20;
    const wR = Math.random() * 2 - 1;
    cR = cR * 0.80 + wR * 0.20;

    // Liquid pebble water droplets
    let pebbleL = 0, pebbleR = 0;
    if (Math.random() < 0.0016) pebbleL = (Math.random() * 0.22 - 0.11);
    if (Math.random() < 0.0016) pebbleR = (Math.random() * 0.22 - 0.11);

    const creekWaterL = creekLP_L.process(cL) * 0.45 + creekBP_L.process(cL + pebbleL) * 0.25;
    const creekWaterR = creekLP_R.process(cR) * 0.45 + creekBP_R.process(cR + pebbleR) * 0.25;

    // --- Pine Canopy Wind ---
    const wWindL = Math.random() * 2 - 1;
    pL = pL * 0.92 + wWindL * 0.08;
    const wWindR = Math.random() * 2 - 1;
    pR = pR * 0.92 + wWindR * 0.08;

    const trunkSway = pineTrunkLP.process(pL + pR) * 0.35;
    const needleWhisperL = pineNeedleBP_L.process(pL) * 0.20 * (0.8 + 0.2 * Math.sin(t * 0.3));
    const needleWhisperR = pineNeedleBP_R.process(pR) * 0.20 * (0.8 + 0.2 * Math.cos(t * 0.3));

    // --- Temperate Forest Avian Synthesis ---
    let forestAvianL = 0;
    let forestAvianR = 0;

    // 1. WOODPECKER DRUMMING (Rapid acoustic trunk strikes on hollow pine: tat-tat-tat-tat-tat)
    // Drumming Burst 1 at t = 3.2s to 3.7s
    if (t > 3.2 && t < 3.7) {
      const burstT = t - 3.2; // 0 to 0.5s
      const tapInterval = 0.045; // ~22 taps per second
      const tapPhase = (burstT % tapInterval) / tapInterval;
      if (tapPhase < 0.25) {
        const tapEnv = Math.exp(-tapPhase * 16);
        const impulse = (Math.sin(tapPhase * 440 * Math.PI * 2) + (Math.random() * 0.5 - 0.25)) * tapEnv;
        const drum = woodBP.process(impulse) * 0.32;
        forestAvianR += drum * 0.8;
        forestAvianL += drum * 0.3; // Stereo panning to right distance
      }
    }

    // Drumming Burst 2 at t = 14.5s to 15.0s
    if (t > 14.5 && t < 15.0) {
      const burstT = t - 14.5;
      const tapInterval = 0.048;
      const tapPhase = (burstT % tapInterval) / tapInterval;
      if (tapPhase < 0.25) {
        const tapEnv = Math.exp(-tapPhase * 16);
        const impulse = (Math.sin(tapPhase * 420 * Math.PI * 2) + (Math.random() * 0.5 - 0.25)) * tapEnv;
        const drum = woodBP.process(impulse) * 0.28;
        forestAvianL += drum * 0.85;
        forestAvianR += drum * 0.25;
      }
    }

    // 2. WOOD THRUSH (Ethereal flute-like harmonic double-tone whistles)
    // Phrase 1 (t = 6.2s to 8.2s): Classic bell-like ascending flute motif
    forestAvianL += birdSyllable(t, 6.20, 0.28, 2200, 2800, 0.8) * 0.30;
    forestAvianL += birdSyllable(t, 6.55, 0.24, 2800, 3350, 1.1) * 0.32;
    forestAvianL += birdSyllable(t, 6.88, 0.38, 3350, 2400, 0.7, 10, 120) * 0.35;

    // Phrase 2 (t = 17.5s to 19.4s): Twilight wood thrush call
    forestAvianL += birdSyllable(t, 17.50, 0.26, 2400, 3050, 0.9) * 0.32;
    forestAvianL += birdSyllable(t, 17.82, 0.25, 3050, 3500, 1.1) * 0.30;
    forestAvianL += birdSyllable(t, 18.15, 0.42, 3500, 2600, 0.8, 12, 140) * 0.34;

    // 3. GREAT TIT / CHICKADEE (Crisp bright two-tone "tea-cher, tea-cher" staccato call)
    // Call 1 at t = 10.4s to 11.6s
    forestAvianR += birdSyllable(t, 10.40, 0.16, 3800, 3400, 1.0) * 0.26;
    forestAvianR += birdSyllable(t, 10.62, 0.16, 3400, 3000, 1.0) * 0.24;
    forestAvianR += birdSyllable(t, 10.90, 0.16, 3850, 3450, 1.0) * 0.26;
    forestAvianR += birdSyllable(t, 11.12, 0.16, 3450, 3050, 1.0) * 0.24;

    // Distant response call at t = 21.0s to 22.0s
    forestAvianR += birdSyllable(t, 21.00, 0.15, 3900, 3500, 1.0) * 0.20;
    forestAvianR += birdSyllable(t, 21.22, 0.15, 3500, 3100, 1.0) * 0.18;

    // Forest canopy spatial reverberation
    const delL = delayBufferL[delayIndex];
    const delR = delayBufferR[delayIndex];
    delayBufferL[delayIndex] = forestAvianL + delL * 0.25;
    delayBufferR[delayIndex] = forestAvianR + delR * 0.25;
    delayIndex = (delayIndex + 1) % delaySamples;

    const totalAvianL = forestAvianL + delL * 0.18;
    const totalAvianR = forestAvianR + delR * 0.18;

    left[i] = (creekWaterL + needleWhisperL + trunkSway) * 0.75 + totalAvianL;
    right[i] = (creekWaterR + needleWhisperR + trunkSway) * 0.75 + totalAvianR;
  }
}

// =========================================================================
// 5. BANGLADESH VILLAGE MORNING (বাংলার সকাল ও পুকুর ঘাট)
// Direct acoustic emulation of the Epidemic Sound reference:
// - Tranquil rural pond water surface (Pukur ghat) with soft waterbody ripples
// - Swaying bamboo grove (Bansh-bagan) & coconut palms with organic stem creaks
// - Asian Koel (Kokil) resonant ascending "Koo... koo-EL!" call
// - Oriental Magpie-Robin (Doyel) dawn whistling phrases
// - Common Myna (Shalik) social chattering & distant shoreline waterbird
// =========================================================================
function genBangladeshVillageMorning(left, right, totalSamples, sampleRate) {
  // Village pond water filters (placid, muddy shore water surface, soft droplets)
  const pondWaterLP_L = new BiquadLP(360, sampleRate, 0.95);
  const pondWaterLP_R = new BiquadLP(360, sampleRate, 0.95);
  const waterLapBP_L = new BiquadBP(480, sampleRate, 1.6);
  const waterLapBP_R = new BiquadBP(520, sampleRate, 1.6);

  // Bamboo grove & palm frond wind (soft humid dawn breeze)
  const bambooLeafBP_L = new BiquadBP(420, sampleRate, 1.2);
  const bambooLeafBP_R = new BiquadBP(460, sampleRate, 1.2);

  // Koel echo acoustic cavity filter
  const koelResonanceBP = new BiquadBP(1650, sampleRate, 2.5);

  let nL = 0, nR = 0;
  let bL = 0, bR = 0;

  // Open-air rural village reverberation delay line
  const delaySamples = Math.floor(sampleRate * 0.14);
  const delayBufferL = new Float32Array(delaySamples);
  const delayBufferR = new Float32Array(delaySamples);
  let delayIndex = 0;

  for (let i = 0; i < totalSamples; i++) {
    const t = i / sampleRate;

    // --- Village Pond Water Surface (পুকুর ঘাটের পানি) ---
    const wL = Math.random() * 2 - 1;
    nL = nL * 0.88 + wL * 0.12;
    const wR = Math.random() * 2 - 1;
    nR = nR * 0.88 + wR * 0.12;

    // Soft water droplets & lily pad surface ripples
    let dropL = 0, dropR = 0;
    if (Math.random() < 0.0005) dropL = (Math.random() * 0.14 - 0.07);
    if (Math.random() < 0.0005) dropR = (Math.random() * 0.14 - 0.07);

    const waterL = pondWaterLP_L.process(nL) * 0.36 + waterLapBP_L.process(nL + dropL) * 0.18;
    const waterR = pondWaterLP_R.process(nR) * 0.36 + waterLapBP_R.process(nR + dropR) * 0.18;

    // --- Bamboo Grove Breeze (বাঁশবাগান ও নারিকেল পাতা) ---
    const wbL = Math.random() * 2 - 1;
    bL = bL * 0.90 + wbL * 0.10;
    const wbR = Math.random() * 2 - 1;
    bR = bR * 0.90 + wbR * 0.10;

    const dawnBreeze = 0.70 + 0.30 * Math.sin(t * 0.28);
    const bambooRustleL = bambooLeafBP_L.process(bL) * 0.32 * dawnBreeze;
    const bambooRustleR = bambooLeafBP_R.process(bR) * 0.32 * dawnBreeze;

    // Organic bamboo stalk creak (leaning tall bamboo in dawn breeze)
    let bambooCreakL = 0, bambooCreakR = 0;
    if (t > 9.2 && t < 9.8) {
      const creakT = (t - 9.2) / 0.6;
      bambooCreakL = Math.sin(creakT * Math.PI) * Math.sin(creakT * 310 * Math.PI * 2) * 0.040;
    }
    if (t > 19.5 && t < 20.1) {
      const creakT = (t - 19.5) / 0.6;
      bambooCreakR = Math.sin(creakT * Math.PI) * Math.sin(creakT * 285 * Math.PI * 2) * 0.038;
    }

    // --- South Asian Rural Avian Acoustics (Epidemic Sound Reference Emulation) ---
    let villageAvianL = 0;
    let villageAvianR = 0;

    // 1. ASIAN KOEL (Kokil / কোকিল) - Resonant ascending call ("Kooo... koo-EL!")
    // Phrase 1 at t = 3.8s to 6.2s in right orchard:
    // Syllable 1: Low warm "Kooo..."
    const koelSyllable1 = birdSyllable(t, 3.80, 0.52, 1360, 1620, 0.9);
    // Syllable 2: Sweet ascending resonant "koo-EL!"
    const koelSyllable2 = birdSyllable(t, 4.45, 0.62, 1420, 1920, 1.25);
    const koelCall1 = (koelSyllable1 * 0.38 + koelSyllable2 * 0.46);
    villageAvianR += koelCall1 + koelResonanceBP.process(koelCall1) * 0.25;
    villageAvianL += (koelCall1 * 0.30); // Open air stereo bleed

    // Phrase 2 at t = 13.5s to 15.9s (Echoing second call across the pond):
    const koelSyllable3 = birdSyllable(t, 13.50, 0.48, 1380, 1640, 0.9);
    const koelSyllable4 = birdSyllable(t, 14.12, 0.58, 1440, 1950, 1.25);
    const koelCall2 = (koelSyllable3 * 0.36 + koelSyllable4 * 0.44);
    villageAvianR += koelCall2 + koelResonanceBP.process(koelCall2) * 0.22;
    villageAvianL += (koelCall2 * 0.32);

    // 2. ORIENTAL MAGPIE-ROBIN (Doyel / দোয়েল - National Bird)
    // Morning dawn flute melody from high mango tree:
    // Motif 1 at t = 1.2s to 3.2s:
    villageAvianL += birdSyllable(t, 1.20, 0.22, 2300, 2750, 0.9) * 0.36;
    villageAvianL += birdSyllable(t, 1.48, 0.24, 2750, 3150, 1.1) * 0.38;
    villageAvianL += birdSyllable(t, 1.78, 0.28, 3150, 2600, 0.8, 12, 140) * 0.35;
    villageAvianL += birdSyllable(t, 2.12, 0.36, 2600, 2150, 0.7) * 0.30;

    // Motif 2 at t = 10.8s to 12.8s:
    villageAvianL += birdSyllable(t, 10.80, 0.20, 2400, 2900, 0.9) * 0.34;
    villageAvianL += birdSyllable(t, 11.06, 0.24, 2900, 3250, 1.2) * 0.37;
    villageAvianL += birdSyllable(t, 11.36, 0.30, 3250, 2700, 0.8, 14, 160) * 0.35;
    villageAvianL += birdSyllable(t, 11.72, 0.38, 2700, 2200, 0.7) * 0.30;

    // Motif 3 at t = 20.4s to 22.2s:
    villageAvianL += birdSyllable(t, 20.40, 0.22, 2500, 3000, 0.9) * 0.32;
    villageAvianL += birdSyllable(t, 20.68, 0.26, 3000, 2550, 0.8, 12, 140) * 0.34;
    villageAvianL += birdSyllable(t, 21.00, 0.36, 2550, 2100, 0.7) * 0.28;

    // 3. COMMON MYNA / SHALIK (শালিক - Social morning chattering in bamboo bushes)
    // Chattering phrase 1 at t = 7.0s to 8.2s:
    villageAvianR += birdSyllable(t, 7.00, 0.08, 3100, 2600, 1.1) * 0.22;
    villageAvianR += birdSyllable(t, 7.14, 0.08, 3250, 2750, 1.1) * 0.24;
    villageAvianR += birdSyllable(t, 7.30, 0.16, 2900, 2300, 0.8, 22, 180) * 0.26;
    villageAvianR += birdSyllable(t, 7.54, 0.10, 3400, 2800, 1.0) * 0.22;

    // Chattering phrase 2 at t = 16.8s to 18.0s:
    villageAvianR += birdSyllable(t, 16.80, 0.08, 3150, 2650, 1.1) * 0.22;
    villageAvianR += birdSyllable(t, 16.94, 0.08, 3300, 2800, 1.1) * 0.24;
    villageAvianR += birdSyllable(t, 17.10, 0.16, 2950, 2350, 0.8, 20, 160) * 0.25;

    // 4. DISTANT WATERBIRD / POND HERON (Waterbody dawn atmosphere)
    // Gentle shoreline low cluck at t = 8.8s
    if (t > 8.8 && t < 9.15) {
      const hT = (t - 8.8) / 0.35;
      const hEnv = Math.pow(Math.sin(hT * Math.PI), 1.5);
      const heron = (Math.sin(hT * 820 * Math.PI * 2) + Math.sin(hT * 1640 * Math.PI * 2) * 0.3) * hEnv * 0.16;
      villageAvianL += heron;
    }

    // Rural open-air acoustic reflection & spatial field
    const delL = delayBufferL[delayIndex];
    const delR = delayBufferR[delayIndex];
    delayBufferL[delayIndex] = villageAvianL + delL * 0.28;
    delayBufferR[delayIndex] = villageAvianR + delR * 0.28;
    delayIndex = (delayIndex + 1) % delaySamples;

    const totalAvianL = villageAvianL + delL * 0.20;
    const totalAvianR = villageAvianR + delR * 0.20;

    left[i] = (waterL + bambooRustleL + bambooCreakL) * 0.82 + totalAvianL;
    right[i] = (waterR + bambooRustleR + bambooCreakR) * 0.82 + totalAvianR;
  }
}

// =========================================================================
// 6. HEARTH FIREPLACE (Warm hearth rumble + gentle birch crackles & soft ember pop)
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
// 7. MIDNIGHT MEADOW (Serene summer crickets, warm night resonance, tranquil pulsing)
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
  { folder: 'village', file: 'morning-village.wav', gen: genBangladeshVillageMorning },
  { folder: 'fireplace', file: 'soft-crackling.wav', gen: genCalmFireplace },
  { folder: 'wind', file: 'gentle-breeze.wav', gen: genCalmWind },
  { folder: 'night', file: 'night-insects.wav', gen: genCalmNight },
];

console.log('Generating ultra-calming, high-fidelity ambient soundscapes (Distinct Forest vs Bangladesh Village)...');
sounds.forEach(({ folder, file, gen }) => {
  const dir = path.join(__dirname, '..', 'public', 'audio', folder);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  const filePath = path.join(dir, file);
  const buf = createWavBuffer(SAMPLE_RATE, DURATION, gen);
  fs.writeFileSync(filePath, buf);
  console.log(`✓ Generated ${filePath} (${(buf.length / 1024).toFixed(1)} KB)`);
});
console.log('All 7 soundscapes successfully synthesized and perfected!');
