import React, { useState } from 'react';
import { useRecordingStore } from '../store/recordingStore';
import { Settings, Plus, Trash2, Save, Edit2 } from 'lucide-react';
import type { LetterTemplate } from '../types';

export const LetterTemplateSelector: React.FC = () => {
  const { 
    letterTemplates,
    selectedLetterTemplate,
    setSelectedLetterTemplate,
    addLetterTemplate,
    updateLetterTemplate,
    deleteLetterTemplate
  } = useRecordingStore();

  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<LetterTemplate | null>(null);
  const [isCreatingNew, setIsCreatingNew] = useState(false);

  const handleEditTemplate = (template: LetterTemplate) => {
    setEditingTemplate({ ...template });
    setIsCreatingNew(false);
    setIsConfigOpen(true);
  };

  const handleCreateNew = () => {
    setEditingTemplate({
      id: `letter-${Date.now()}`,
      name: 'Nouveau modèle',
      pathology: '',
      template: '',
      customInstructions: ''
    });
    setIsCreatingNew(true);
    setIsConfigOpen(true);
  };

  const handleSaveTemplate = () => {
    if (!editingTemplate) return;
    
    if (isCreatingNew) {
      addLetterTemplate(editingTemplate);
    } else {
      updateLetterTemplate(editingTemplate);
    }
    
    if (selectedLetterTemplate?.id === editingTemplate.id) {
      setSelectedLetterTemplate(editingTemplate);
    }
    
    setIsConfigOpen(false);
    setEditingTemplate(null);
    setIsCreatingNew(false);
  };

  return (
    <div className="flex items-center space-x-2">
      <select
        value={selectedLetterTemplate?.id || ''}
        onChange={(e) => {
          const selected = letterTemplates.find(t => t.id === e.target.value);
          setSelectedLetterTemplate(selected || null);
        }}
        className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
      >
        <option value="">Sélectionnez un modèle de lettre</option>
        {letterTemplates.map(template => (
          <option key={template.id} value={template.id}>
            {template.name} ({template.pathology})
          </option>
        ))}
      </select>

      <button
        onClick={() => selectedLetterTemplate && handleEditTemplate(selectedLetterTemplate)}
        className="p-2 text-gray-600 hover:text-gray-900 rounded-full hover:bg-gray-100"
        title="Configurer le modèle"
      >
        <Settings className="h-5 w-5" />
      </button>

      <button
        onClick={handleCreateNew}
        className="p-2 text-blue-600 hover:text-blue-700 rounded-full hover:bg-blue-50"
        title="Nouveau modèle"
      >
        <Plus className="h-5 w-5" />
      </button>

      {isConfigOpen && editingTemplate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold mb-4">
              {isCreatingNew ? 'Créer un nouveau modèle de lettre' : 'Modifier le modèle de lettre'}
            </h3>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nom du modèle
                </label>
                <input
                  type="text"
                  value={editingTemplate.name}
                  onChange={(e) => setEditingTemplate({
                    ...editingTemplate,
                    name: e.target.value
                  })}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder="Nom du modèle de lettre"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Pathologie
                </label>
                <input
                  type="text"
                  value={editingTemplate.pathology}
                  onChange={(e) => setEditingTemplate({
                    ...editingTemplate,
                    pathology: e.target.value
                  })}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder="Ex: Cardiologie, Neurologie, etc."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Template de la lettre
                </label>
                <textarea
                  value={editingTemplate.template}
                  onChange={(e) => setEditingTemplate({
                    ...editingTemplate,
                    template: e.target.value
                  })}
                  className="w-full h-64 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 font-mono"
                  placeholder="Modèle de lettre..."
                />
                <p className="mt-1 text-sm text-gray-500">
                  Utilisez des placeholders entre crochets [comme ceci] pour les éléments à remplacer.
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Consignes personnalisées pour l'IA
                </label>
                <textarea
                  value={editingTemplate.customInstructions || ''}
                  onChange={(e) => setEditingTemplate({
                    ...editingTemplate,
                    customInstructions: e.target.value
                  })}
                  className="w-full h-32 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder="Instructions spécifiques pour guider l'IA dans la rédaction de la lettre..."
                />
                <p className="mt-1 text-sm text-gray-500">
                  Ces instructions aideront l'IA à mieux comprendre le style, le ton et les éléments spécifiques à inclure dans la lettre.
                </p>
              </div>
            </div>

            <div className="mt-6 flex justify-between">
              <div>
                {!isCreatingNew && (
                  <button
                    onClick={() => {
                      deleteLetterTemplate(editingTemplate.id);
                      setIsConfigOpen(false);
                      setEditingTemplate(null);
                    }}
                    className="px-4 py-2 text-red-600 bg-red-50 rounded-md hover:bg-red-100 flex items-center space-x-2"
                  >
                    <Trash2 className="h-4 w-4" />
                    <span>Supprimer</span>
                  </button>
                )}
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={() => {
                    setIsConfigOpen(false);
                    setEditingTemplate(null);
                    setIsCreatingNew(false);
                  }}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                >
                  Annuler
                </button>
                <button
                  onClick={handleSaveTemplate}
                  className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 flex items-center space-x-2"
                >
                  <Save className="h-4 w-4" />
                  <span>Enregistrer</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};