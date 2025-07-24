import React, { useEffect, useRef } from 'react';
import { Info } from 'lucide-react';

interface AudioMeterProps {
  audioStream: MediaStream | null;
  sensitivity: number;
  onSensitivityChange: (value: number) => void;
}

export const AudioMeter: React.FC<AudioMeterProps> = ({ audioStream, sensitivity, onSensitivityChange }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number>();
  const analyzerRef = useRef<AnalyserNode | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    if (!audioStream) {
      if (audioContextRef.current) {
        audioContextRef.current.close();
        audioContextRef.current = null;
      }
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      return;
    }

    const audioContext = new AudioContext();
    const analyzer = audioContext.createAnalyser();
    const source = audioContext.createMediaStreamSource(audioStream);
    
    analyzer.fftSize = 256;
    analyzer.smoothingTimeConstant = 0.8;
    source.connect(analyzer);
    
    audioContextRef.current = audioContext;
    analyzerRef.current = analyzer;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dataArray = new Uint8Array(analyzer.frequencyBinCount);
    
    const draw = () => {
      if (!ctx || !analyzer) return;

      animationFrameRef.current = requestAnimationFrame(draw);
      analyzer.getByteFrequencyData(dataArray);

      const average = dataArray.reduce((acc, val) => acc + val, 0) / dataArray.length;
      const normalizedVolume = (average / 255) * sensitivity;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#f3f4f6';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
      gradient.addColorStop(0, '#34d399');
      gradient.addColorStop(0.6, '#fbbf24');
      gradient.addColorStop(1, '#ef4444');

      ctx.fillStyle = gradient;
      const barWidth = canvas.width * Math.min(1, normalizedVolume);
      ctx.fillRect(0, 0, barWidth, canvas.height);

      ctx.strokeStyle = '#d1d5db';
      ctx.strokeRect(0, 0, canvas.width, canvas.height);
    };

    draw();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, [audioStream, sensitivity]);

  return (
    <div className="space-y-1">
      <div className="flex items-center gap-2">
        <div className="flex-1">
          <canvas
            ref={canvasRef}
            width="150"
            height="16"
            className="w-full h-4 rounded"
          />
        </div>
        <div className="text-xs text-gray-500 w-8">
          {Math.round(sensitivity * 100)}%
        </div>
      </div>
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1">
          <span className="text-xs text-gray-700 font-medium">Sensibilité de détection</span>
          <div className="relative group">
            <Info className="h-4 w-4 text-gray-400" />
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 w-64 z-50">
              Ajuste la sensibilité de la reconnaissance vocale. Une valeur plus élevée permet de mieux détecter les voix faibles mais peut augmenter les erreurs. Une valeur plus basse exige une voix plus forte mais donne des résultats plus précis.
            </div>
          </div>
        </div>
        <input
          type="range"
          min="0.1"
          max="2"
          step="0.1"
          value={sensitivity}
          onChange={(e) => onSensitivityChange(parseFloat(e.target.value))}
          className="flex-1 h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer"
        />
      </div>
    </div>
  );
};