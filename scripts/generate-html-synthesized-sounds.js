const fs = require('fs');
const path = require('path');

// 16-bit PCM Stereo WAV Buffer Writer with seamless loop crossfade
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

  // Seamless equal-power loop crossfade (2.5 seconds)
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
    let l = Math.tanh(left[i] * 0.90) * 0.85;
    let r = Math.tanh(right[i] * 0.90) * 0.85;
    const intL = Math.max(-32767, Math.min(32767, Math.floor(l * 32767)));
    const intR = Math.max(-32767, Math.min(32767, Math.floor(r * 32767)));
    buffer.writeInt16LE(intL, offset);
    buffer.writeInt16LE(intR, offset + 2);
    offset += 4;
  }
  return buffer;
}

const SAMPLE_RATE = 44100;
const DURATION = 30; // 30-second seamless loop

// Noise Generators
function makeNoiseGenerators() {
  let b0L = 0, b1L = 0, b2L = 0;
  let b0R = 0, b1R = 0, b2R = 0;
  let brownL = 0, brownR = 0;

  return {
    nextWhite() {
      return [Math.random() * 2 - 1, Math.random() * 2 - 1];
    },
    nextPink() {
      const wL = Math.random() * 2 - 1;
      const wR = Math.random() * 2 - 1;
      b0L = 0.99765 * b0L + wL * 0.0990460;
      b1L = 0.96300 * b1L + wL * 0.2965164;
      b2L = 0.57000 * b2L + wL * 1.0526913;
      b0R = 0.99765 * b0R + wR * 0.0990460;
      b1R = 0.96300 * b1R + wR * 0.2965164;
      b2R = 0.57000 * b2R + wR * 1.0526913;
      return [(b0L + b1L + b2L + wL * 0.1848) * 0.2, (b0R + b1R + b2R + wR * 0.1848) * 0.2];
    },
    nextBrown() {
      const wL = Math.random() * 2 - 1;
      const wR = Math.random() * 2 - 1;
      brownL = (brownL + 0.02 * wL) / 1.02;
      brownR = (brownR + 0.02 * wR) / 1.02;
      return [brownL * 3.5, brownR * 3.5];
    }
  };
}

// Lowpass Biquad Filter class
class BiquadLP {
  constructor(freq, sr, q = 0.707) {
    const w0 = 2 * Math.PI * freq / sr;
    const alpha = Math.sin(w0) / (2 * q);
    const cosw0 = Math.cos(w0);
    const b1 = 1 - cosw0;
    const b0 = b1 / 2;
    const b2 = b0;
    const a0 = 1 + alpha;
    const a1 = -2 * cosw0;
    const a2 = 1 - alpha;
    this.b0 = b0 / a0; this.b1 = b1 / a0; this.b2 = b2 / a0;
    this.a1 = a1 / a0; this.a2 = a2 / a0;
    this.x1 = 0; this.x2 = 0; this.y1 = 0; this.y2 = 0;
  }
  process(x) {
    const y = this.b0 * x + this.b1 * this.x1 + this.b2 * this.x2 - this.a1 * this.y1 - this.a2 * this.y2;
    this.x2 = this.x1; this.x1 = x;
    this.y2 = this.y1; this.y1 = y;
    return y;
  }
}

// 1. Midnight Meadow (meadow: 4300Hz crickets with 7Hz LFO + 110Hz/164.8Hz drones + pink noise lowpass 500Hz)
function generateMidnightMeadow(left, right, totalSamples, sampleRate) {
  const noise = makeNoiseGenerators();
  const lpPinkL = new BiquadLP(500, sampleRate);
  const lpPinkR = new BiquadLP(500, sampleRate);

  for (let i = 0; i < totalSamples; i++) {
    const t = i / sampleRate;

    // Cricket oscillator (4300Hz modulated with 7Hz LFO tremolo)
    const cricketLfo = (Math.sin(2 * Math.PI * 7 * t) + 1) * 0.5;
    const cricketBurst = cricketLfo > 0.4 ? (cricketLfo - 0.4) * 1.66 : 0;
    const cricketOscL = Math.sin(2 * Math.PI * 4300 * t) * cricketBurst * 0.08;
    const cricketOscR = Math.sin(2 * Math.PI * 4320 * t) * cricketBurst * 0.08;

    // Harmonic low drones (110Hz & 164.8Hz)
    const drone1 = Math.sin(2 * Math.PI * 110 * t) * 0.06;
    const drone2 = Math.sin(2 * Math.PI * 164.8 * t) * 0.05;

    // Filtered pink noise bed (500Hz LP)
    const [pnL, pnR] = noise.nextPink();
    const bedL = lpPinkL.process(pnL) * 0.20;
    const bedR = lpPinkR.process(pnR) * 0.20;

    left[i] = cricketOscL + drone1 + drone2 * 0.8 + bedL;
    right[i] = cricketOscR + drone1 * 0.8 + drone2 + bedR;
  }
}

// 2. Zen Singing Bowls (bowls: 432Hz harmonic brass partials [1, 2.01, 2.98] * 0.5 decaying every 7.5s + pink noise)
function generateZenSingingBowls(left, right, totalSamples, sampleRate) {
  const noise = makeNoiseGenerators();
  const lpPinkL = new BiquadLP(300, sampleRate);
  const lpPinkR = new BiquadLP(300, sampleRate);

  const baseFreq = 432 * 0.5; // 216 Hz
  const partials = [1, 2.01, 2.98];
  const strikeInterval = 7.5; // Strikes every 7.5s (4 strikes in 30s)

  for (let i = 0; i < totalSamples; i++) {
    const t = i / sampleRate;
    let bowlL = 0;
    let bowlR = 0;

    // Compute strikes
    const numStrikes = Math.floor(DURATION / strikeInterval) + 1;
    for (let s = 0; s < numStrikes; s++) {
      const strikeTime = s * strikeInterval;
      if (t >= strikeTime) {
        const age = t - strikeTime;
        if (age < 7.2) {
          const decay = Math.exp(-age / 2.1);
          const attack = Math.min(1, age / 0.04);
          const envelope = attack * decay;

          partials.forEach((mult, pIdx) => {
            const freq = baseFreq * mult;
            const amp = (0.28 / (pIdx + 1)) * envelope;
            bowlL += Math.sin(2 * Math.PI * freq * age + pIdx * 0.5) * amp;
            bowlR += Math.sin(2 * Math.PI * (freq + 0.3 * (pIdx + 1)) * age + pIdx * 0.8) * amp;
          });
        }
      }
    }

    // Subtle low pink noise bed
    const [pnL, pnR] = noise.nextPink();
    const bedL = lpPinkL.process(pnL) * 0.05;
    const bedR = lpPinkR.process(pnR) * 0.05;

    left[i] = bowlL + bedL;
    right[i] = bowlR + bedR;
  }
}

// 3. Mountain Stream (stream: broadband pink noise 1200-6500Hz with 2.7Hz LFO + 3200Hz white noise splash droplets)
function generateMountainStream(left, right, totalSamples, sampleRate) {
  const noise = makeNoiseGenerators();
  const hpPinkL = new BiquadLP(6500, sampleRate);
  const hpPinkR = new BiquadLP(6500, sampleRate);

  for (let i = 0; i < totalSamples; i++) {
    const t = i / sampleRate;

    // 2.7Hz LFO modulation on water flow
    const lfo = Math.sin(2 * Math.PI * 2.7 * t) * 0.12 + 0.88;

    // Broadband filtered pink noise
    const [pnL, pnR] = noise.nextPink();
    const flowL = hpPinkL.process(pnL) * lfo * 0.55;
    const flowR = hpPinkR.process(pnR) * (2 - lfo) * 0.55;

    // Pebble splash droplets (3200Hz white noise splashes)
    const [wnL, wnR] = noise.nextWhite();
    const splashL = wnL * 0.06 * (Math.sin(2 * Math.PI * 1.8 * t) > 0.6 ? 1 : 0.2);
    const splashR = wnR * 0.06 * (Math.sin(2 * Math.PI * 2.3 * t) > 0.6 ? 1 : 0.2);

    left[i] = flowL + splashL;
    right[i] = flowR + splashR;
  }
}

// 4. Velvet Brown Noise (brown: pure 1/f² noise low-pass filtered at 500Hz)
function generateVelvetBrownNoise(left, right, totalSamples, sampleRate) {
  const noise = makeNoiseGenerators();
  const lpBrownL = new BiquadLP(500, sampleRate);
  const lpBrownR = new BiquadLP(500, sampleRate);

  for (let i = 0; i < totalSamples; i++) {
    const [bnL, bnR] = noise.nextBrown();
    left[i] = lpBrownL.process(bnL) * 0.85;
    right[i] = lpBrownR.process(bnR) * 0.85;
  }
}

// 5. Distant Thunder (thunder: 180Hz / 110Hz Brownian rumbles with swells every 11s)
function generateDistantThunder(left, right, totalSamples, sampleRate) {
  const noise = makeNoiseGenerators();
  const lp180L = new BiquadLP(180, sampleRate);
  const lp180R = new BiquadLP(180, sampleRate);
  const lp110L = new BiquadLP(110, sampleRate);
  const lp110R = new BiquadLP(110, sampleRate);

  for (let i = 0; i < totalSamples; i++) {
    const t = i / sampleRate;

    // Deep continuous 180Hz rumble bed
    const [bn1L, bn1R] = noise.nextBrown();
    const bedL = lp180L.process(bn1L) * 0.35;
    const bedR = lp180R.process(bn1R) * 0.35;

    // Rolling swell every 11 seconds (rising from 0.3 to 1.6 over 1.2s, then easing down over 5s)
    const cycle = t % 11;
    let swellGain = 0.3;
    if (cycle < 1.2) {
      swellGain = 0.3 + (1.3 * (cycle / 1.2));
    } else if (cycle < 6.2) {
      swellGain = 1.6 - (1.3 * ((cycle - 1.2) / 5.0));
    } else {
      swellGain = 0.3;
    }

    const [bn2L, bn2R] = noise.nextBrown();
    const swellL = lp110L.process(bn2L) * swellGain * 0.70;
    const swellR = lp110R.process(bn2R) * swellGain * 0.70;

    left[i] = bedL + swellL;
    right[i] = bedR + swellR;
  }
}

// Output destinations
const targets = [
  {
    name: 'Midnight Meadow (night)',
    file: 'public/audio/night/night-insects.wav',
    gen: generateMidnightMeadow,
  },
  {
    name: 'Zen Singing Bowls (zen-bowls)',
    file: 'public/audio/zen-bowls/zen-bowls.wav',
    gen: generateZenSingingBowls,
  },
  {
    name: 'Mountain Stream (stream)',
    file: 'public/audio/stream/mountain-stream.wav',
    gen: generateMountainStream,
  },
  {
    name: 'Velvet Brown Noise (brown-noise)',
    file: 'public/audio/brown-noise/velvet-brown-noise.wav',
    gen: generateVelvetBrownNoise,
  },
  {
    name: 'Distant Thunder (thunder)',
    file: 'public/audio/thunder/distant-thunder.wav',
    gen: generateDistantThunder,
  },
];

console.log('Synthesizing last 5 soundscapes using reference HTML algorithms...');
const rootDir = path.resolve(__dirname, '..');

targets.forEach((t) => {
  const filePath = path.join(rootDir, t.file);
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  console.log(`Generating ${t.name} -> ${t.file}...`);
  const buf = createWavBuffer(SAMPLE_RATE, DURATION, t.gen);
  fs.writeFileSync(filePath, buf);
  console.log(`✓ ${t.name} created (${(buf.length / 1024 / 1024).toFixed(2)} MB)`);
});

console.log('All 5 synthesized soundscapes successfully replaced!');
