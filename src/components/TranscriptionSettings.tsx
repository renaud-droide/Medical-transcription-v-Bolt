import React from 'react';
import { Info } from 'lucide-react';
import { useRecordingStore } from '../store/recordingStore';
import { configureTranscription } from '../services/transcription';

interface SettingSliderProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  step: number;
  tooltip: string;
  unit?: string;
}

const SettingSlider: React.FC<SettingSliderProps> = ({
  label,
  value,
  onChange,
  min,
  max,
  step,
  tooltip,
  unit
}) => {
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-gray-700">{label}</label>
          <div className="relative group">
            <Info className="h-4 w-4 text-gray-400" />
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 w-64 z-50">
              {tooltip}
            </div>
          </div>
        </div>
        <span className="text-sm text-gray-500">
          {value}{unit}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
      />
    </div>
  );
};

export const TranscriptionSettings: React.FC = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [settings, setSettings] = React.useState({
    silenceThreshold: 3000,
    minSpeechDuration: 500,
    confidenceThreshold: 0.7,
    timbreThreshold: 0.3,
    energyThreshold: -50,
    minSpeakerDuration: 1500,
    speakerOverlapThreshold: 0.4
  });

  const handleSettingChange = (key: keyof typeof settings, value: number) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    
    // Configure transcription service with new settings
    configureTranscription({
      [key]: value
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-3 flex items-center justify-between text-left"
      >
        <span className="font-medium text-gray-900">Paramètres avancés de transcription</span>
        <svg
          className={`h-5 w-5 transform transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="px-4 pb-4 space-y-4">
          <SettingSlider
            label="Seuil de silence"
            value={settings.silenceThreshold}
            onChange={(value) => handleSettingChange('silenceThreshold', value)}
            min={1000}
            max={5000}
            step={100}
            unit="ms"
            tooltip="Durée de silence nécessaire avant de considérer qu'un segment de parole est terminé. Une valeur plus élevée permet de mieux gérer les pauses naturelles dans le discours."
          />

          <SettingSlider
            label="Durée minimale de parole"
            value={settings.minSpeechDuration}
            onChange={(value) => handleSettingChange('minSpeechDuration', value)}
            min={200}
            max={1000}
            step={50}
            unit="ms"
            tooltip="Durée minimale d'un segment de parole pour qu'il soit pris en compte. Aide à filtrer les bruits parasites et les sons courts non pertinents."
          />

          <SettingSlider
            label="Seuil de confiance"
            value={settings.confidenceThreshold}
            onChange={(value) => handleSettingChange('confidenceThreshold', value)}
            min={0.3}
            max={0.9}
            step={0.05}
            tooltip="Niveau de confiance minimum pour la reconnaissance vocale. Une valeur plus élevée donne des résultats plus précis mais peut ignorer certaines parties du discours."
          />

          <SettingSlider
            label="Seuil de timbre"
            value={settings.timbreThreshold}
            onChange={(value) => handleSettingChange('timbreThreshold', value)}
            min={0.1}
            max={0.5}
            step={0.05}
            tooltip="Sensibilité à la variation du timbre de voix pour la détection des changements de locuteur. Une valeur plus basse détecte plus facilement les changements de voix."
          />

          <SettingSlider
            label="Seuil d'énergie"
            value={settings.energyThreshold}
            onChange={(value) => handleSettingChange('energyThreshold', value)}
            min={-70}
            max={-30}
            step={1}
            unit="dB"
            tooltip="Niveau minimum d'énergie sonore pour détecter la parole. Une valeur plus basse capte les voix plus faibles mais peut augmenter les bruits parasites."
          />

          <SettingSlider
            label="Durée minimale par locuteur"
            value={settings.minSpeakerDuration}
            onChange={(value) => handleSettingChange('minSpeakerDuration', value)}
            min={500}
            max={3000}
            step={100}
            unit="ms"
            tooltip="Durée minimale avant de considérer un changement de locuteur. Évite les changements trop fréquents dus aux variations naturelles de la voix."
          />

          <SettingSlider
            label="Seuil de chevauchement"
            value={settings.speakerOverlapThreshold}
            onChange={(value) => handleSettingChange('speakerOverlapThreshold', value)}
            min={0.2}
            max={0.6}
            step={0.05}
            tooltip="Seuil de détection pour le chevauchement des voix. Une valeur plus élevée rend la détection des changements de locuteur plus stricte."
          />
        </div>
      )}
    </div>
  );
};