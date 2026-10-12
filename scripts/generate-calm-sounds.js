const fs = require('fs');
const path = require('path');

// WAV header writer with seamless loop crossfade
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
    let l = Math.tanh(left[i] * 0.92) * 0.88;
    let r = Math.tanh(right[i] * 0.92) * 0.88;
    const intL = Math.max(-32767, Math.min(32767, Math.floor(l * 32767)));
    const intR = Math.max(-32767, Math.min(32767, Math.floor(r * 32767)));
    buffer.writeInt16LE(intL, offset);
    buffer.writeInt16LE(intR, offset + 2);
    offset += 4;
  }
  return buffer;
}

const SAMPLE_RATE = 44100;
const DURATION = 30; // 30s seamless loop

// Low-Pass Filter
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

// Band-Pass Filter
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

// 1. ZEN SINGING BOWLS (432Hz harmonic meditation tone with gentle brass chime pulses)
function genZenBowls(left, right, totalSamples, sampleRate) {
  const f0 = 432; // Sacred harmonic frequency
  const harmonics = [f0, f0 * 1.5, f0 * 2.0, f0 * 2.76, f0 * 3.5];
  const phases = harmonics.map(() => 0);

  for (let i = 0; i < totalSamples; i++) {
    const t = i / sampleRate;
    // Slow breathing envelope
    const swell = 0.5 + 0.5 * Math.sin(2 * Math.PI * (t / 10));
    const slowLFO = Math.sin(2 * Math.PI * 0.15 * t);
    
    let sumL = 0;
    let sumR = 0;
    harmonics.forEach((freq, idx) => {
      phases[idx] += 2 * Math.PI * freq / sampleRate;
      const amp = (1 / (idx + 1)) * 0.12;
      const panMod = 0.5 + 0.2 * Math.sin(t * 0.3 + idx);
      const val = Math.sin(phases[idx]);
      sumL += val * amp * panMod;
      sumR += val * amp * (1 - panMod);
    });

    // Gentle distant singing chime bell strike every 7.5 seconds
    const strikeInterval = 7.5;
    const strikeTime = (t % strikeInterval);
    const strikeDecay = Math.exp(-strikeTime * 0.8) * Math.sin(2 * Math.PI * 864 * t) * 0.08;

    left[i] = (sumL * (0.6 + 0.4 * swell) + strikeDecay * 0.7) * 0.75;
    right[i] = (sumR * (0.6 + 0.4 * swell) + strikeDecay * 0.5) * 0.75;
  }
}

// 2. MOUNTAIN PEBBLE STREAM (Clear continuous flowing water with soft bubbling ripples)
function genMountainStream(left, right, totalSamples, sampleRate) {
  const lpL = new BiquadLP(1800, sampleRate, 0.8);
  const lpR = new BiquadLP(1800, sampleRate, 0.8);
  const bpL = new BiquadBP(750, sampleRate, 1.4);
  const bpR = new BiquadBP(820, sampleRate, 1.4);

  let bubblePhase = 0;

  for (let i = 0; i < totalSamples; i++) {
    const t = i / sampleRate;
    const whiteL = (Math.random() * 2 - 1);
    const whiteR = (Math.random() * 2 - 1);

    // Natural stream turbulence modulation
    const flowModL = 0.65 + 0.35 * Math.sin(2 * Math.PI * 0.3 * t + 0.2);
    const flowModR = 0.65 + 0.35 * Math.cos(2 * Math.PI * 0.28 * t + 0.5);

    const baseStreamL = lpL.process(whiteL) * flowModL * 0.4;
    const baseStreamR = lpR.process(whiteR) * flowModR * 0.4;
    const resonanceL = bpL.process(whiteL) * 0.25;
    const resonanceR = bpR.process(whiteR) * 0.25;

    // Soft pebble water drops
    let drop = 0;
    if (Math.random() < 0.003) {
      const dropFreq = 600 + Math.random() * 400;
      bubblePhase += 2 * Math.PI * dropFreq / sampleRate;
      drop = Math.sin(bubblePhase) * 0.08;
    }

    left[i] = (baseStreamL + resonanceL + drop) * 0.8;
    right[i] = (baseStreamR + resonanceR + drop * 0.7) * 0.8;
  }
}

// 3. VELVET BROWN NOISE (Deep low-frequency Brownian rumble for deep sleep)
function genBrownNoise(left, right, totalSamples, sampleRate) {
  let lastOutL = 0.0;
  let lastOutR = 0.0;
  const lpL = new BiquadLP(320, sampleRate, 0.707);
  const lpR = new BiquadLP(320, sampleRate, 0.707);

  for (let i = 0; i < totalSamples; i++) {
    const whiteL = (Math.random() * 2 - 1);
    const whiteR = (Math.random() * 2 - 1);

    // True 1/f^2 Brownian integration with low-pass softening
    lastOutL = (lastOutL + (0.02 * whiteL)) / 1.02;
    lastOutR = (lastOutR + (0.02 * whiteR)) / 1.02;

    const smoothL = lpL.process(lastOutL * 2.8);
    const smoothR = lpR.process(lastOutR * 2.8);

    left[i] = smoothL * 0.85;
    right[i] = smoothR * 0.85;
  }
}

// 4. DISTANT THUNDERSTORM (Steady rain with soft distant rolling thunder)
function genDistantThunder(left, right, totalSamples, sampleRate) {
  const rainLP_L = new BiquadLP(1400, sampleRate, 0.7);
  const rainLP_R = new BiquadLP(1400, sampleRate, 0.7);
  const thunderBP = new BiquadBP(75, sampleRate, 0.6);

  let thunderTime = 0;
  let thunderActive = false;

  for (let i = 0; i < totalSamples; i++) {
    const t = i / sampleRate;
    const rainNoiseL = (Math.random() * 2 - 1);
    const rainNoiseR = (Math.random() * 2 - 1);
    const rainL = rainLP_L.process(rainNoiseL) * 0.35;
    const rainR = rainLP_R.process(rainNoiseR) * 0.35;

    // Trigger distant thunder rumble every 15 seconds
    if (!thunderActive && (t % 15) < 0.05) {
      thunderActive = true;
      thunderTime = 0;
    }

    let thunderVal = 0;
    if (thunderActive) {
      thunderTime += 1 / sampleRate;
      if (thunderTime > 6) {
        thunderActive = false;
      } else {
        const env = Math.sin((thunderTime / 6) * Math.PI) * Math.exp(-thunderTime * 0.25);
        const rumbleNoise = (Math.random() * 2 - 1);
        thunderVal = thunderBP.process(rumbleNoise) * env * 1.2;
      }
    }

    left[i] = rainL + thunderVal * 0.7;
    right[i] = rainR + thunderVal * 0.7;
  }
}

const sounds = [
  { folder: 'zen-bowls', file: 'zen-bowls.wav', gen: genZenBowls },
  { folder: 'stream', file: 'mountain-stream.wav', gen: genMountainStream },
  { folder: 'brown-noise', file: 'velvet-brown-noise.wav', gen: genBrownNoise },
  { folder: 'thunder', file: 'distant-thunder.wav', gen: genDistantThunder },
];

console.log('Generating expanded calm soundscapes...');
sounds.forEach(({ folder, file, gen }) => {
  const dir = path.join(__dirname, '..', 'public', 'audio', folder);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  const filePath = path.join(dir, file);
  const buf = createWavBuffer(SAMPLE_RATE, DURATION, gen);
  fs.writeFileSync(filePath, buf);
  console.log(`✓ Synthesized ${filePath} (${(buf.length / 1024).toFixed(1)} KB)`);
});
console.log('All 4 calm soundscapes successfully created!');
