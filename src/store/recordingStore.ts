import { create } from 'zustand';
import type { RecordingState, AISettings, LetterTemplate } from '../types';

const DEFAULT_AI_SETTINGS: AISettings = {
  temperature: 0.7,
  presencePenalty: 0.0,
  frequencyPenalty: 0.0,
  maxTokens: 1000
};

const DEFAULT_LETTER_TEMPLATES: LetterTemplate[] = [
  {
    id: 'cardio',
    name: 'Consultation Cardiologie',
    pathology: 'Cardiologie',
    template: `Cher confrère,

Je vous adresse ce patient pour [raison de la consultation].

Éléments cliniques importants :
- Antécédents cardiovasculaires
- Symptômes actuels
- Résultats de l'examen clinique
- ECG et autres examens pertinents

Traitement actuel et modifications apportées :
[détails du traitement]

Je vous remercie de votre prise en charge.

Confraternellement,`,
    customInstructions: `En tant que professionnel de santé, rédigez une lettre formelle à un confrère cardiologue.
La lettre doit être :
- Professionnelle et concise
- Focalisée sur les éléments cardiovasculaires pertinents
- Structurée avec des paragraphes clairs
- Incluant les éléments cliniques essentiels
- Terminée par une formule de politesse appropriée`
  },
  {
    id: 'neuro',
    name: 'Consultation Neurologie',
    pathology: 'Neurologie',
    template: `Cher confrère,

Je vous adresse ce patient pour [raison de la consultation].

Tableau clinique :
- Symptômes neurologiques
- Évolution temporelle
- Examen neurologique
- Examens complémentaires réalisés

Traitement initié :
[détails du traitement]

Je vous remercie de votre expertise.

Confraternellement,`,
    customInstructions: `En tant que professionnel de santé, rédigez une lettre formelle à un confrère neurologue.
La lettre doit :
- Être précise et professionnelle
- Mettre en avant les symptômes neurologiques
- Décrire l'évolution temporelle des symptômes
- Inclure les résultats pertinents de l'examen neurologique
- Se terminer par une formule de politesse appropriée`
  }
];

export const useRecordingStore = create<RecordingState>((set) => ({
  isRecording: false,
  isPaused: false,
  audioStream: null,
  transcription: '',
  processedTranscription: '',
  selectedPrompt: null,
  selectedLetterTemplate: null,
  letterTemplates: DEFAULT_LETTER_TEMPLATES,
  report: null,
  colleagueLetter: null,
  patientAdvice: null,
  recommendations: null,
  isProcessing: false,
  error: null,
  aiSettings: DEFAULT_AI_SETTINGS,
  logoUrl: '',
  setLogoUrl: (url) => set({ logoUrl: url }),
  setIsRecording: (isRecording) => set({ isRecording }),
  setIsPaused: (isPaused) => set({ isPaused }),
  setAudioStream: (stream) => set({ audioStream: stream }),
  setTranscription: (text) => set({ transcription: text }),
  setProcessedTranscription: (text) => set({ processedTranscription: text }),
  appendTranscription: (text) => set((state) => ({ 
    transcription: state.transcription + text 
  })),
  setSelectedPrompt: (prompt) => set({ selectedPrompt: prompt }),
  setSelectedLetterTemplate: (template) => set({ selectedLetterTemplate: template }),
  setReport: (report) => set({ report }),
  setColleagueLetter: (letter) => set({ colleagueLetter: letter }),
  setPatientAdvice: (advice) => set({ patientAdvice: advice }),
  setRecommendations: (recommendations) => set({ recommendations }),
  setIsProcessing: (isProcessing) => set({ isProcessing }),
  setError: (error) => set({ error }),
  setAISettings: (settings) => set({ aiSettings: settings }),
  addLetterTemplate: (template) => set((state) => ({
    letterTemplates: [...state.letterTemplates, template]
  })),
  updateLetterTemplate: (template) => set((state) => ({
    letterTemplates: state.letterTemplates.map(t => 
      t.id === template.id ? template : t
    )
  })),
  deleteLetterTemplate: (id) => set((state) => ({
    letterTemplates: state.letterTemplates.filter(t => t.id !== id)
  }))
}));