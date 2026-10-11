'use client';

import React, { useEffect, useRef } from 'react';
import { audioEngine } from '@/audio/audio-engine';
import { usePlayerStore } from '@/stores/player-store';

interface VisualizerCanvasProps {
  className?: string;
  height?: number;
}

export const VisualizerCanvas: React.FC<VisualizerCanvasProps> = ({
  className = '',
  height = 70,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const playbackStatus = usePlayerStore((s) => s.playbackStatus);
  const isPlaying = playbackStatus === 'playing';

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    const bufferLength = 64;
    const dataArray = new Uint8Array(bufferLength);

    const render = () => {
      animationId = requestAnimationFrame(render);
      const width = canvas.width;
      const h = canvas.height;

      ctx.clearRect(0, 0, width, h);

      if (isPlaying) {
        audioEngine.getVisualizerData(dataArray);
      } else {
        // Idle gentle breathing wave
        for (let i = 0; i < bufferLength; i++) {
          dataArray[i] = 12 + Math.sin((Date.now() / 1000) + (i * 0.2)) * 6;
        }
      }

      // Draw elegant symmetrical soundwave
      const barWidth = (width / bufferLength) * 2;
      let x = 0;

      ctx.fillStyle = 'rgba(145, 175, 169, 0.45)';

      for (let i = 0; i < bufferLength / 2; i++) {
        const val = dataArray[i];
        // Low amplitude - spec: "Low-amplitude signal response; optional and never distracting"
        const barHeight = Math.max(3, (val / 255) * (h * 0.75));

        const y = (h - barHeight) / 2;

        // Soft rounded cap
        ctx.beginPath();
        ctx.roundRect(x, y, Math.max(2, barWidth - 3), barHeight, [2, 2, 2, 2]);
        ctx.fill();

        x += barWidth;
      }
    };

    render();

    return () => {
      cancelAnimationFrame(animationId);
    };
  }, [isPlaying]);

  return (
    <canvas
      ref={canvasRef}
      width={320}
      height={height}
      className={`w-full max-w-sm rounded-lg opacity-80 ${className}`}
      aria-label="Soundwave visualizer"
    />
  );
};
