import React, { useRef, useEffect } from 'react';
import { Mic, Square, FileText, Mail, Pause, Play, FileCheck } from 'lucide-react';
import { useRecordingStore } from '../store/recordingStore';
import { startLiveTranscription, stopTranscription, generateReport, generateColleagueLetter, extractRecommendations } from '../services/transcription';
import type { AudioRecorder } from '../types';

export const Controls: React.FC = () => {
  const { 
    isRecording,
    isPaused,
    selectedPrompt,
    setIsRecording,
    setIsPaused,
    setAudioStream,
    setTranscription,
    appendTranscription,
    setReport,
    setColleagueLetter,
    setPatientAdvice,
    setRecommendations,
    setIsProcessing,
    setError,
    audioStream,
    transcription,
    report
  } = useRecordingStore();

  const recorder = useRef<AudioRecorder>({
    mediaRecorder: null,
    audioChunks: []
  });

  useEffect(() => {
    return () => {
      if (recorder.current.mediaRecorder?.stream) {
        recorder.current.mediaRecorder.stream.getTracks().forEach(track => track.stop());
      }
      stopTranscription();
    };
  }, []);

  const handleStartRecording = async () => {
    const supportsSpeechRecognition =
      'SpeechRecognition' in window || 'webkitSpeechRecognition' in window;
    if (!supportsSpeechRecognition) {
      setError('Votre navigateur ne supporte pas la reconnaissance vocale. Utilisez Chrome ou Edge en HTTPS.');
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setAudioStream(stream);
      setIsRecording(true);
      setIsPaused(false);
      setError(null);
      setTranscription('');

      await startLiveTranscription(stream, (transcript) => {
        appendTranscription(transcript);
      });
    } catch (error) {
      console.error('Erreur d\'accès au microphone:', error);
      setError('Impossible d\'accéder au microphone. Veuillez vérifier vos permissions.');
      handleStopRecording();
    }
  };

  const handleStopRecording = async () => {
    setIsRecording(false);
    setIsPaused(false);
    await stopTranscription();
    
    if (recorder.current.mediaRecorder?.stream) {
      recorder.current.mediaRecorder.stream.getTracks().forEach(track => track.stop());
    }
    
    setAudioStream(null);
  };

  const handlePauseRecording = () => {
    setIsPaused(true);
    if (audioStream) {
      audioStream.getTracks().forEach(track => track.enabled = false);
    }
  };

  const handleResumeRecording = () => {
    setIsPaused(false);
    if (audioStream) {
      audioStream.getTracks().forEach(track => track.enabled = true);
    }
  };

  const handleGenerateReport = async () => {
    if (!selectedPrompt) {
      setError('Veuillez sélectionner un type de compte rendu.');
      return;
    }

    if (!transcription) {
      setError('Aucune transcription disponible pour générer le rapport.');
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      const report = await generateReport(transcription, selectedPrompt.template);
      setReport(report);
    } catch (error) {
      console.error('Erreur de génération du rapport:', error);
      setError(error instanceof Error ? error.message : 'La génération du compte rendu a échoué.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleGenerateColleagueLetter = async () => {
    if (!transcription) {
      setError('Aucune transcription disponible pour générer la lettre.');
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      const letter = await generateColleagueLetter(transcription, report || '');
      setColleagueLetter(letter);
    } catch (error) {
      console.error('Erreur de génération de la lettre:', error);
      setError(error instanceof Error ? error.message : 'La génération de la lettre a échoué.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleExtractRecommendations = async () => {
    if (!report) {
      setError('Aucun rapport disponible pour extraire les recommandations.');
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      const recommendations = extractRecommendations(report);
      setRecommendations(recommendations);
    } catch (error) {
      console.error('Erreur d\'extraction des recommandations:', error);
      setError(error instanceof Error ? error.message : 'L\'extraction des recommandations a échoué.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-start gap-4">
        <div className="flex-1 flex flex-wrap gap-4">
          {!isRecording ? (
            <button
              onClick={handleStartRecording}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={useRecordingStore.getState().isProcessing}
            >
              <Mic className="h-5 w-5" />
              <span>Démarrer l'Enregistrement</span>
            </button>
          ) : (
            <>
              <button
                onClick={handleStopRecording}
                className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors"
              >
                <Square className="h-5 w-5" />
                <span>Arrêter l'Enregistrement</span>
              </button>
              
              {isPaused ? (
                <button
                  onClick={handleResumeRecording}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors"
                >
                  <Play className="h-5 w-5" />
                  <span>Reprendre</span>
                </button>
              ) : (
                <button
                  onClick={handlePauseRecording}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 transition-colors"
                >
                  <Pause className="h-5 w-5" />
                  <span>Pause</span>
                </button>
              )}
            </>
          )}
          
          <button
            onClick={handleGenerateReport}
            className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={!transcription || useRecordingStore.getState().isProcessing}
          >
            <FileText className="h-5 w-5" />
            <span>Générer le Rapport</span>
          </button>

          <button
            onClick={handleGenerateColleagueLetter}
            className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={!transcription || useRecordingStore.getState().isProcessing}
          >
            <Mail className="h-5 w-5" />
            <span>Courrier à un Confrère</span>
          </button>

          <button
            onClick={handleExtractRecommendations}
            className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={!report || useRecordingStore.getState().isProcessing}
          >
            <FileCheck className="h-5 w-5" />
            <span>Recommandations</span>
          </button>
        </div>
      </div>
    </div>
  );
};