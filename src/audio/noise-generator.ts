/**
 * Noise Generation & AudioBuffer synthesis utilities
 * Generates continuous, click-free pink noise, brownian noise,
 * and stereo-decorrelated loop buffers with seamless boundary crossfades.
 */

/**
 * Creates a seamlessly looping stereo noise buffer with equal-power boundary crossfade.
 * Uses Paul Kellet's refined pink noise filter algorithm blended with brown noise
 * to achieve a warm, organic rainfall bed without harsh high-frequency hiss.
 */
export function createRainBedBuffer(
  ctx: AudioContext,
  durationSeconds: number = 8
): AudioBuffer {
  const sampleRate = ctx.sampleRate;
  const numSamples = Math.floor(sampleRate * durationSeconds);
  const buffer = ctx.createBuffer(2, numSamples, sampleRate);

  const leftChannel = buffer.getChannelData(0);
  const rightChannel = buffer.getChannelData(1);

  // Generate left and right channels with independent pink/brown generators
  fillOrganicRainBedChannel(leftChannel, numSamples);
  fillOrganicRainBedChannel(rightChannel, numSamples);

  // Apply smooth equal-power crossfade across the loop boundary (last 0.8 seconds into first 0.8 seconds)
  applySeamlessLoopCrossfade(leftChannel, sampleRate, 0.8);
  applySeamlessLoopCrossfade(rightChannel, sampleRate, 0.8);

  return buffer;
}

/**
 * Fills a Float32Array with a warm, natural rain-bed noise spectrum (Pink + Brown blend).
 */
function fillOrganicRainBedChannel(channel: Float32Array, length: number): void {
  // Kellet's filter state variables
  let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
  let brown = 0;

  for (let i = 0; i < length; i++) {
    const white = Math.random() * 2 - 1;

    // Paul Kellet's filter for true -3dB/octave pink noise
    b0 = 0.99886 * b0 + white * 0.0555179;
    b1 = 0.99332 * b1 + white * 0.0750759;
    b2 = 0.96900 * b2 + white * 0.1538520;
    b3 = 0.86650 * b3 + white * 0.3104856;
    b4 = 0.55000 * b4 + white * 0.5329522;
    b5 = -0.7616 * b5 - white * 0.0168980;
    const pink = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
    b6 = white * 0.115926;

    // Brown noise integration for deep natural warmth
    brown = (brown + 0.03 * white) / 1.02;

    // Blend: 75% Pink noise, 25% Brown noise, normalized to soft headroom (~0.15 RMS)
    const rawSample = (pink * 0.11 * 0.75) + (brown * 0.25);
    channel[i] = Math.max(-0.95, Math.min(0.95, rawSample));
  }
}

/**
 * Ensures zero-click looping by crossfading the tail of the buffer into the head.
 */
function applySeamlessLoopCrossfade(
  channel: Float32Array,
  sampleRate: number,
  fadeDurationSec: number
): void {
  const fadeSamples = Math.min(Math.floor(sampleRate * fadeDurationSec), Math.floor(channel.length / 4));
  const totalSamples = channel.length;

  for (let i = 0; i < fadeSamples; i++) {
    // Equal-power crossfade curve: cos^2 + sin^2 = 1
    const progress = i / fadeSamples;
    const fadeInGain = Math.sin((progress * Math.PI) / 2);
    const fadeOutGain = Math.cos((progress * Math.PI) / 2);

    const headIdx = i;
    const tailIdx = totalSamples - fadeSamples + i;

    const blendedHead = channel[headIdx] * fadeInGain + channel[tailIdx] * fadeOutGain;
    channel[headIdx] = blendedHead;
    channel[tailIdx] = blendedHead;
  }
}

/**
 * Creates a short micro-burst noise buffer for raindrop patter transient generation.
 */
export function createRaindropNoisePatterBuffer(
  ctx: AudioContext,
  durationSeconds: number = 0.08
): AudioBuffer {
  const sampleRate = ctx.sampleRate;
  const numSamples = Math.floor(sampleRate * durationSeconds);
  const buffer = ctx.createBuffer(1, numSamples, sampleRate);
  const data = buffer.getChannelData(0);

  let last = 0;
  for (let i = 0; i < numSamples; i++) {
    const white = Math.random() * 2 - 1;
    // Slight high-pass pink shaping for crisp water drop impacts
    last = white - last * 0.7;
    const env = Math.exp(-i / (numSamples * 0.25));
    data[i] = last * env * 0.4;
  }

  return buffer;
}
