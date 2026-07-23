import React, { useEffect, useRef } from 'react';

interface AudioVisualizerProps {
  analyserNode?: AnalyserNode;
  isRecording: boolean;
  barCount?: number;
  height?: number;
}

export const AudioVisualizer: React.FC<AudioVisualizerProps> = ({
  analyserNode,
  isRecording,
  barCount = 32,
  height = 80
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    const dataArray = new Uint8Array(barCount);

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (analyserNode && isRecording) {
        analyserNode.getByteFrequencyData(dataArray);
      } else if (isRecording) {
        // Simulated audio data if microphone analyser is initializing
        for (let i = 0; i < barCount; i++) {
          dataArray[i] = Math.floor(Math.sin(Date.now() / 150 + i * 0.3) * 60 + 100);
        }
      } else {
        // Idle flat bars
        for (let i = 0; i < barCount; i++) {
          dataArray[i] = 10;
        }
      }

      const barWidth = (canvas.width / barCount) - 3;
      let x = 0;

      for (let i = 0; i < barCount; i++) {
        const barHeight = Math.max(6, (dataArray[i] / 255) * canvas.height * 0.85);

        // Gradient from cyan to purple
        const gradient = ctx.createLinearGradient(0, canvas.height - barHeight, 0, canvas.height);
        if (isRecording) {
          gradient.addColorStop(0, '#8B5CF6'); // Purple
          gradient.addColorStop(0.5, '#3B82F6'); // Blue
          gradient.addColorStop(1, '#06B6D4'); // Cyan
        } else {
          gradient.addColorStop(0, '#CBD5E1');
          gradient.addColorStop(1, '#94A3B8');
        }

        ctx.fillStyle = gradient;

        // Draw rounded top bar
        const radius = Math.min(barWidth / 2, 4);
        const y = (canvas.height - barHeight) / 2; // Center vertically

        ctx.beginPath();
        ctx.roundRect(x, y, barWidth, barHeight, radius);
        ctx.fill();

        x += barWidth + 3;
      }

      animationId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationId);
    };
  }, [analyserNode, isRecording, barCount]);

  return (
    <div className="w-full flex flex-col items-center justify-center my-3">
      <canvas
        ref={canvasRef}
        width={360}
        height={height}
        className="w-full max-w-md h-20 rounded-2xl bg-slate-900/5 dark:bg-slate-800/40 backdrop-blur-md px-4 py-2 border border-slate-200/50 dark:border-slate-700/50"
      />
      {isRecording && (
        <div className="flex items-center gap-2 mt-2">
          <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
          <span className="text-xs font-semibold text-rose-500 dark:text-rose-400 uppercase tracking-wider">
            Listening... Speak now
          </span>
        </div>
      )}
    </div>
  );
};
