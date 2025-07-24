import React, { useState, useRef } from 'react';
import { Settings, Upload, Info } from 'lucide-react';
import { useRecordingStore } from '../store/recordingStore';
import type { AISettings } from '../types';

export const GlobalSettings: React.FC = () => {
  const { aiSettings, setAISettings, logoUrl, setLogoUrl } = useRecordingStore();
  const [isOpen, setIsOpen] = useState(false);
  const [tempSettings, setTempSettings] = useState<AISettings>(aiSettings);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSave = () => {
    setAISettings(tempSettings);
    setIsOpen(false);
  };

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setLogoUrl(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const getSettingInfo = (setting: keyof AISettings) => {
    const infos = {
      temperature: "Contrôle la créativité de l'IA. Une valeur plus élevée (>0.7) génère des réponses plus variées et créatives, tandis qu'une valeur plus basse (<0.3) produit des réponses plus cohérentes et conservatrices. Appliqué via le paramètre 'temperature' de l'API.",
      presencePenalty: "Influence la tendance de l'IA à parler de nouveaux sujets. Une valeur positive encourage la diversité thématique, une valeur négative favorise la répétition des thèmes. Appliqué via 'presence_penalty' dans l'API.",
      frequencyPenalty: "Réduit la répétition des mêmes mots/phrases. Une valeur positive (0.1-2.0) encourage l'utilisation de synonymes et la variation du vocabulaire. Appliqué via 'frequency_penalty' dans l'API.",
      maxTokens: "Limite la longueur de la réponse en tokens (1 token ≈ 4 caractères). 4000 tokens = environ 16000 caractères ou 3200 mots. Appliqué via 'max_tokens' dans l'API. Impacte directement les coûts d'utilisation."
    };
    return infos[setting];
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="p-2 text-gray-600 hover:text-gray-900 rounded-full hover:bg-gray-100"
        title="Paramètres globaux"
      >
        <Settings className="h-6 w-6" />
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h3 className="text-lg font-semibold mb-6">Paramètres</h3>
            
            <div className="space-y-6">
              <div className="border-b pb-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Logo du cabinet</h4>
                <div className="flex items-center space-x-4">
                  {logoUrl && (
                    <div className="w-20 h-20 border rounded-lg overflow-hidden">
                      <img src={logoUrl} alt="Logo" className="w-full h-full object-contain" />
                    </div>
                  )}
                  <div>
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleLogoUpload}
                      accept="image/*"
                      className="hidden"
                    />
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="flex items-center space-x-2 px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                    >
                      <Upload className="h-4 w-4" />
                      <span>Choisir un logo</span>
                    </button>
                    <p className="text-xs text-gray-500 mt-1">
                      Format recommandé : PNG ou JPEG, max 1MB
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-2">
                  <label className="text-sm font-medium text-gray-700">
                    Température (Créativité)
                  </label>
                  <div className="relative group">
                    <Info className="h-4 w-4 text-gray-400 cursor-help" />
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 p-3 bg-gray-900 text-white text-sm rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 w-80 z-50">
                      {getSettingInfo('temperature')}
                    </div>
                  </div>
                  <span className="text-sm text-gray-500 ml-auto">
                    {tempSettings.temperature.toFixed(2)}
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="2"
                  step="0.1"
                  value={tempSettings.temperature}
                  onChange={(e) => setTempSettings({
                    ...tempSettings,
                    temperature: parseFloat(e.target.value)
                  })}
                  className="w-full"
                />
              </div>

              <div>
                <div className="flex items-center gap-2 mb-2">
                  <label className="text-sm font-medium text-gray-700">
                    Pénalité de présence
                  </label>
                  <div className="relative group">
                    <Info className="h-4 w-4 text-gray-400 cursor-help" />
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 p-3 bg-gray-900 text-white text-sm rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 w-80 z-50">
                      {getSettingInfo('presencePenalty')}
                    </div>
                  </div>
                  <span className="text-sm text-gray-500 ml-auto">
                    {tempSettings.presencePenalty.toFixed(2)}
                  </span>
                </div>
                <input
                  type="range"
                  min="-2"
                  max="2"
                  step="0.1"
                  value={tempSettings.presencePenalty}
                  onChange={(e) => setTempSettings({
                    ...tempSettings,
                    presencePenalty: parseFloat(e.target.value)
                  })}
                  className="w-full"
                />
              </div>

              <div>
                <div className="flex items-center gap-2 mb-2">
                  <label className="text-sm font-medium text-gray-700">
                    Pénalité de fréquence
                  </label>
                  <div className="relative group">
                    <Info className="h-4 w-4 text-gray-400 cursor-help" />
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 p-3 bg-gray-900 text-white text-sm rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 w-80 z-50">
                      {getSettingInfo('frequencyPenalty')}
                    </div>
                  </div>
                  <span className="text-sm text-gray-500 ml-auto">
                    {tempSettings.frequencyPenalty.toFixed(2)}
                  </span>
                </div>
                <input
                  type="range"
                  min="-2"
                  max="2"
                  step="0.1"
                  value={tempSettings.frequencyPenalty}
                  onChange={(e) => setTempSettings({
                    ...tempSettings,
                    frequencyPenalty: parseFloat(e.target.value)
                  })}
                  className="w-full"
                />
              </div>

              <div>
                <div className="flex items-center gap-2 mb-2">
                  <label className="text-sm font-medium text-gray-700">
                    Longueur maximale
                  </label>
                  <div className="relative group">
                    <Info className="h-4 w-4 text-gray-400 cursor-help" />
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 p-3 bg-gray-900 text-white text-sm rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 w-80 z-50">
                      {getSettingInfo('maxTokens')}
                    </div>
                  </div>
                  <span className="text-sm text-gray-500 ml-auto">
                    {tempSettings.maxTokens}
                  </span>
                </div>
                <input
                  type="range"
                  min="100"
                  max="4000"
                  step="100"
                  value={tempSettings.maxTokens}
                  onChange={(e) => setTempSettings({
                    ...tempSettings,
                    maxTokens: parseInt(e.target.value)
                  })}
                  className="w-full"
                />
              </div>
            </div>

            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => setIsOpen(false)}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
              >
                Annuler
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700"
              >
                Enregistrer
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};