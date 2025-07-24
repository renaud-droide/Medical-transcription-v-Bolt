import React from 'react';
import { useRecordingStore } from '../store/recordingStore';

export const QuestionnaireGuide: React.FC = () => {
  const { selectedPrompt } = useRecordingStore();

  if (!selectedPrompt?.questionnaire) {
    return null;
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-white rounded-lg shadow-md p-6 sticky top-6 h-[calc(100vh-6rem)] overflow-y-auto">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Guide d'interrogatoire</h3>
        <div className="prose prose-sm max-w-none">
          <pre className="whitespace-pre-wrap text-sm font-mono leading-relaxed text-gray-700 bg-gray-50 p-6 rounded-lg">
            {selectedPrompt.questionnaire}
          </pre>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 sticky top-6 h-[calc(100vh-6rem)] overflow-y-auto">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Guide d'examen</h3>
        <div className="prose prose-sm max-w-none">
          <h4 className="text-base font-medium text-gray-800 mb-3">Examen Ostéopathique</h4>
          <pre className="whitespace-pre-wrap text-sm font-mono leading-relaxed text-gray-700 bg-gray-50 p-6 rounded-lg mb-6">
{`Observations globales :
- Posture générale
- Attitude antalgique
- Zones de tensions ou restrictions identifiées
- Tests spécifiques effectués et résultats obtenus`}
          </pre>

          <h4 className="text-base font-medium text-gray-800 mb-3">Conclusion et Plan Thérapeutique</h4>
          <pre className="whitespace-pre-wrap text-sm font-mono leading-relaxed text-gray-700 bg-gray-50 p-6 rounded-lg">
{`- Résumé succinct de l'évaluation
- Techniques utilisées pendant la séance
- Conseils donnés (exercices, mode de vie, précautions)`}
          </pre>
        </div>
      </div>
    </div>
  );
};