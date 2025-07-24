import React from 'react';
import { Info } from 'lucide-react';

export const VoiceCommandInfo: React.FC = () => {
  return (
    <div className="relative group">
      <Info className="h-5 w-5 text-gray-400 cursor-help" />
      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-80 p-4 bg-gray-900 text-white text-sm rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
        <h4 className="font-semibold mb-2">Commandes vocales disponibles</h4>
        <p className="mb-2 text-gray-300">Utilisez le mot déclencheur "enregistrement" suivi de la commande :</p>
        <ul className="space-y-2 text-gray-300">
          <li>
            <span className="font-semibold text-white">Démarrer</span>
            <br />
            <span className="text-xs">Ex: "enregistrement démarrer"</span>
          </li>
          <li>
            <span className="font-semibold text-white">Pause / Suspendre</span>
            <br />
            <span className="text-xs">Ex: "enregistrement pause"</span>
          </li>
          <li>
            <span className="font-semibold text-white">Reprendre</span>
            <br />
            <span className="text-xs">Ex: "enregistrement reprendre"</span>
          </li>
          <li>
            <span className="font-semibold text-white">Terminer</span>
            <br />
            <span className="text-xs">Ex: "enregistrement terminer"</span>
          </li>
        </ul>
      </div>
    </div>
  );
};