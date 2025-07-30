import { API_CONFIG } from '../config/api';
import { useRecordingStore } from '../store/recordingStore';
import { handleAPIError } from '../utils/errorHandling';
import { chatCompletion } from './openai';

let recognition: SpeechRecognition | null = null;

export function configureTranscription() {
  // Configuration simplifiée - pas de paramètres nécessaires
}

export function cleanTranscriptionForAPI(transcription: string): string {
  // Retourne la transcription telle quelle, sans nettoyage
  return transcription;
}

function stopAndCleanupRecognition() {
  if (recognition) {
    try {
      recognition.stop();
    } catch (error) {
      console.warn('Error stopping recognition:', error);
    }
    recognition.onresult = null;
    recognition.onerror = null;
    recognition.onend = null;
    recognition = null;
  }
}

async function initializeRecognition(
  stream: MediaStream,
  onTranscript: (transcript: string) => void
): Promise<SpeechRecognition> {
  const SpeechRecognitionCtor =
    (window as any).SpeechRecognition ||
    // @ts-ignore - vendor-prefixed API for some browsers
    (window as any).webkitSpeechRecognition;
  if (!window.isSecureContext) {
    throw new Error("L'API SpeechRecognition nécessite une connexion HTTPS.");
  }
  if (!SpeechRecognitionCtor || typeof SpeechRecognitionCtor !== 'function') {
    throw new Error(
      'API SpeechRecognition non prise en charge par ce navigateur. ' +
        'Utilisez Google Chrome ou Microsoft Edge.'
    );
  }
  const newRecognition = new SpeechRecognitionCtor();

  // Mode continu sans résultats intermédiaires
  newRecognition.continuous = true;
  newRecognition.interimResults = false;
  newRecognition.lang = 'fr-FR';

  newRecognition.onresult = (event) => {
    const results = event.results;
    const latestResult = results[results.length - 1];
    const transcript = latestResult[0].transcript.trim();

    // Ajoute simplement le texte à la transcription
    onTranscript(transcript + '\n');
  };

  newRecognition.onerror = (event) => {
    console.error('Erreur de reconnaissance vocale:', event.error);
    useRecordingStore.getState().setError(`Erreur de reconnaissance vocale: ${event.error}`);
  };

  newRecognition.onend = () => {
    if (useRecordingStore.getState().isRecording && !useRecordingStore.getState().isPaused) {
      try {
        newRecognition.start();
      } catch (error) {
        console.error('Erreur lors du redémarrage de la reconnaissance:', error);
      }
    }
  };

  return newRecognition;
}

export async function startLiveTranscription(
  stream: MediaStream,
  onTranscript: (transcript: string) => void
): Promise<void> {
  try {
    stopAndCleanupRecognition();
    recognition = await initializeRecognition(stream, onTranscript);
    recognition.start();
  } catch (error) {
    console.error('Erreur d\'initialisation de la reconnaissance vocale:', error);
    throw new Error('Impossible d\'initialiser la reconnaissance vocale');
  }
}

export function stopTranscription(): void {
  stopAndCleanupRecognition();
}

export async function generateReport(transcription: string, template: string): Promise<string> {
  if (!transcription || !template) {
    throw new Error('La transcription et le template sont requis pour générer le rapport');
  }

  try {
    const { aiSettings } = useRecordingStore.getState();

    const messages = [
      {
        role: 'system',
        content: 'You are a medical professional assistant helping to generate structured medical reports.'
      },
      {
        role: 'user',
        content: `${template}\n\nTranscription:\n${transcription}`
      }
    ];

    return await chatCompletion(messages, {
      temperature: aiSettings.temperature,
      presence_penalty: aiSettings.presencePenalty,
      frequency_penalty: aiSettings.frequencyPenalty,
      max_tokens: aiSettings.maxTokens
    });
  } catch (error) {
    console.error('Erreur de génération du rapport:', error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Une erreur inattendue est survenue lors de la génération du rapport');
  }
}

export async function generateColleagueLetter(transcription: string, report: string): Promise<string> {
  try {
    const { aiSettings, selectedLetterTemplate } = useRecordingStore.getState();

    const messages = [
      {
        role: 'system',
        content: selectedLetterTemplate?.customInstructions ||
          'You are a medical professional assistant helping to write formal letters to colleagues.'
      },
      {
        role: 'user',
        content: `Veuillez générer une lettre professionnelle à un collègue basée sur cette consultation médicale.
${selectedLetterTemplate?.template ? `\nTemplate à suivre:\n${selectedLetterTemplate.template}` : ''}
Transcription:\n${transcription}\n\n${report ? `Rapport médical:\n${report}` : ''}`
      }
    ];

    return await chatCompletion(messages, {
      temperature: aiSettings.temperature,
      presence_penalty: aiSettings.presencePenalty,
      frequency_penalty: aiSettings.frequencyPenalty,
      max_tokens: aiSettings.maxTokens
    });
  } catch (error) {
    console.error('Erreur de génération de la lettre:', error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Une erreur inattendue est survenue lors de la génération de la lettre');
  }
}

export function extractRecommendations(report: string): string {
  if (!report) {
    throw new Error('Aucun rapport disponible pour extraire les recommandations.');
  }

  // Liste des mots-clés qui indiquent le début de la section des recommandations
  const startKeywords = [
    'Recommandations',
    'Conseils',
    'Plan de traitement',
    'Traitement proposé',
    'Prise en charge',
    'Conduite à tenir',
    'Mesures à prendre',
    'Instructions'
  ];

  // Liste des mots-clés qui indiquent la fin de la section des recommandations
  const endKeywords = [
    'Conclusion',
    'Suivi',
    'Prochain rendez-vous',
    'Signature',
    'Date',
    'Docteur',
    'Dr.',
    'Médecin'
  ];

  // Diviser le rapport en lignes
  const lines = report.split('\n');
  let recommendationLines: string[] = [];
  let isInRecommendationSection = false;
  let hasFoundRecommendations = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    // Vérifier si la ligne contient un mot-clé de début
    if (!isInRecommendationSection) {
      if (startKeywords.some(keyword => 
        line.toLowerCase().includes(keyword.toLowerCase())
      )) {
        isInRecommendationSection = true;
        hasFoundRecommendations = true;
        // Ajouter le titre de la section
        recommendationLines.push(line);
        continue;
      }
    }

    // Si nous sommes dans la section des recommandations
    if (isInRecommendationSection) {
      // Vérifier si nous atteignons la fin de la section
      if (endKeywords.some(keyword => 
        line.toLowerCase().includes(keyword.toLowerCase())
      )) {
        isInRecommendationSection = false;
        continue;
      }

      // Ajouter la ligne si elle n'est pas vide
      if (line) {
        recommendationLines.push(line);
      }
    }
  }

  // Si aucune section de recommandations n'a été trouvée, chercher des phrases qui ressemblent à des recommandations
  if (!hasFoundRecommendations) {
    const recommendationIndicators = [
      'il est recommandé',
      'il est conseillé',
      'vous devez',
      'il faut',
      'à faire',
      'éviter',
      'continuer',
      'prendre',
      'suivre',
      'maintenir',
      'surveiller'
    ];

    recommendationLines.push('Recommandations :');
    lines.forEach(line => {
      const lineLC = line.toLowerCase();
      if (recommendationIndicators.some(indicator => lineLC.includes(indicator))) {
        recommendationLines.push(line);
      }
    });
  }

  // Si toujours aucune recommandation trouvée
  if (recommendationLines.length <= 1) {
    throw new Error('Aucune recommandation n\'a pu être extraite du rapport.');
  }

  return recommendationLines.join('\n');
}

export function extractPatientAdvice(report: string): string {
  if (!report) {
    throw new Error('Aucun rapport disponible pour extraire les conseils.');
  }

  // Liste des mots-clés qui indiquent le début de la section des conseils
  const startKeywords = [
    'Recommandations',
    'Conseils',
    'Conseils au patient',
    'Recommandations au patient',
    'Conseils et recommandations',
    'Instructions au patient',
    'Mesures à suivre',
    'À faire',
    'Consignes'
  ];

  // Liste des mots-clés qui indiquent la fin de la section des conseils
  const endKeywords = [
    'Conclusion',
    'Suivi',
    'Prochain rendez-vous',
    'Signature',
    'Date',
    'Docteur',
    'Dr.',
    'Médecin'
  ];

  // Diviser le rapport en lignes
  const lines = report.split('\n');
  let adviceLines: string[] = [];
  let isInAdviceSection = false;
  let hasFoundAdvice = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    // Vérifier si la ligne contient un mot-clé de début
    if (!isInAdviceSection) {
      if (startKeywords.some(keyword => 
        line.toLowerCase().includes(keyword.toLowerCase())
      )) {
        isInAdviceSection = true;
        hasFoundAdvice = true;
        // Ajouter le titre de la section
        adviceLines.push(line);
        continue;
      }
    }

    // Si nous sommes dans la section des conseils
    if (isInAdviceSection) {
      // Vérifier si nous atteignons la fin de la section
      if (endKeywords.some(keyword => 
        line.toLowerCase().includes(keyword.toLowerCase())
      )) {
        isInAdviceSection = false;
        continue;
      }

      // Ajouter la ligne si elle n'est pas vide
      if (line) {
        adviceLines.push(line);
      }
    }
  }

  // Si aucune section de conseils n'a été trouvée, chercher des points qui ressemblent à des conseils
  if (!hasFoundAdvice) {
    const adviceIndicators = [
      'il est recommandé',
      'il est conseillé',
      'vous devez',
      'il faut',
      'à faire',
      'éviter',
      'continuer',
      'prendre',
      'suivre',
      'maintenir',
      'surveiller'
    ];

    adviceLines.push('Conseils au patient :');
    lines.forEach(line => {
      const lineLC = line.toLowerCase();
      if (adviceIndicators.some(indicator => lineLC.includes(indicator))) {
        adviceLines.push(line);
      }
    });
  }

  // Si toujours aucun conseil trouvé
  if (adviceLines.length <= 1) {
    throw new Error('Aucun conseil n\'a pu être extrait du rapport.');
  }

  return adviceLines.join('\n');
}