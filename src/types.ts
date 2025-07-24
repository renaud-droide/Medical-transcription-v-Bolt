export interface TranscriptionPrompt {
  id: string;
  name: string;
  template: string;
  points: string[];
  customInstructions?: string;
  letterInstructions?: string;
  questionnaire?: string;
}

export interface LetterTemplate {
  id: string;
  name: string;
  pathology: string;
  template: string;
  customInstructions?: string;
}

export interface AISettings {
  temperature: number;
  presencePenalty: number;
  frequencyPenalty: number;
  maxTokens: number;
}

export interface RecordingState {
  isRecording: boolean;
  isPaused: boolean;
  audioStream: MediaStream | null;
  transcription: string;
  processedTranscription: string;
  selectedPrompt: TranscriptionPrompt | null;
  selectedLetterTemplate: LetterTemplate | null;
  letterTemplates: LetterTemplate[];
  report: string | null;
  colleagueLetter: string | null;
  patientAdvice: string | null;
  recommendations: string | null;
  isProcessing: boolean;
  error: string | null;
  aiSettings: AISettings;
  logoUrl: string;
  setLogoUrl: (url: string) => void;
  setIsRecording: (isRecording: boolean) => void;
  setIsPaused: (isPaused: boolean) => void;
  setAudioStream: (stream: MediaStream | null) => void;
  setTranscription: (text: string) => void;
  setProcessedTranscription: (text: string) => void;
  appendTranscription: (text: string) => void;
  setSelectedPrompt: (prompt: TranscriptionPrompt | null) => void;
  setSelectedLetterTemplate: (template: LetterTemplate | null) => void;
  setReport: (report: string | null) => void;
  setColleagueLetter: (letter: string | null) => void;
  setPatientAdvice: (advice: string | null) => void;
  setRecommendations: (recommendations: string | null) => void;
  setIsProcessing: (isProcessing: boolean) => void;
  setError: (error: string | null) => void;
  setAISettings: (settings: AISettings) => void;
  addLetterTemplate: (template: LetterTemplate) => void;
  updateLetterTemplate: (template: LetterTemplate) => void;
  deleteLetterTemplate: (id: string) => void;
}

export interface AudioRecorder {
  mediaRecorder: MediaRecorder | null;
  audioChunks: Blob[];
}

declare global {
  interface Window {
    SpeechRecognition: typeof SpeechRecognition;
    webkitSpeechRecognition: typeof SpeechRecognition;
  }
}