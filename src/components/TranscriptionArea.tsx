import React, { useState, useRef } from 'react';
import { useRecordingStore } from '../store/recordingStore';
import { Loader, Copy, Check, Edit2, Save, Mail, FileText, Printer, Stethoscope, Download } from 'lucide-react';
import { generateColleagueLetter, extractPatientAdvice } from '../services/transcription';
import { useReactToPrint } from 'react-to-print';
import JSZip from 'jszip';

export const TranscriptionArea: React.FC = () => {
  const { 
    transcription,
    isRecording, 
    isProcessing, 
    report,
    colleagueLetter,
    patientAdvice,
    error,
    setTranscription,
    setColleagueLetter,
    setPatientAdvice,
    setIsProcessing,
    setError,
    logoUrl
  } = useRecordingStore();
  
  const [copied, setCopied] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedTranscription, setEditedTranscription] = useState(transcription);
  const [activeTab, setActiveTab] = useState<'transcription' | 'report' | 'letter' | 'advice'>('transcription');
  const contentRef = useRef<HTMLDivElement>(null);
  const saveDialogRef = useRef<HTMLInputElement>(null);

  const handlePrint = useReactToPrint({
    content: () => contentRef.current,
    documentTitle: `Medical_Report_${new Date().toISOString().split('T')[0]}`,
  });

  const handleCopy = async (content: string | null) => {
    if (!content) return;
    
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Erreur lors de la copie:', err);
    }
  };

  const handleSaveAll = async () => {
    const zip = new JSZip();
    const timestamp = new Date().toISOString().split('T')[0];
    
    if (transcription) {
      zip.file(`transcription_${timestamp}.txt`, transcription);
    }
    if (report) {
      zip.file(`rapport_${timestamp}.txt`, report);
    }
    if (colleagueLetter) {
      zip.file(`lettre_${timestamp}.txt`, colleagueLetter);
    }
    if (patientAdvice) {
      zip.file(`conseils_${timestamp}.txt`, patientAdvice);
    }

    try {
      const content = await zip.generateAsync({ type: "blob" });
      const url = URL.createObjectURL(content);
      const link = document.createElement('a');
      link.href = url;
      link.download = `consultation_${timestamp}.zip`;
      link.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Erreur lors de la création du ZIP:', error);
      setError('Erreur lors de la sauvegarde des documents');
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
    setEditedTranscription(transcription);
  };

  const handleSave = () => {
    setTranscription(editedTranscription);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedTranscription(transcription);
  };

  const handleExtractAdvice = async () => {
    if (!report) {
      setError('Aucun rapport disponible pour extraire les conseils.');
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      const advice = await extractPatientAdvice(report);
      setPatientAdvice(advice);
      setActiveTab('advice');
    } catch (error) {
      console.error('Erreur d\'extraction des conseils:', error);
      setError(error instanceof Error ? error.message : 'L\'extraction des conseils a échoué.');
    } finally {
      setIsProcessing(false);
    }
  };

  const renderContent = () => {
    const content = (
      <div className="print:p-8">
        {logoUrl && (
          <div className="mb-6 print:mb-8">
            <img src={logoUrl} alt="Logo Cabinet" className="h-16 object-contain" />
          </div>
        )}
        {activeTab === 'transcription' ? (
          isEditing ? (
            <div className="space-y-4">
              <textarea
                value={editedTranscription}
                onChange={(e) => setEditedTranscription(e.target.value)}
                className="w-full min-h-[200px] p-4 font-mono text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Modifiez la transcription ici..."
              />
              <div className="flex justify-end space-x-3">
                <button
                  onClick={handleCancel}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
                >
                  Annuler
                </button>
                <button
                  onClick={handleSave}
                  className="flex items-center space-x-2 px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"
                >
                  <Save className="h-4 w-4" />
                  <span>Enregistrer</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="min-h-[200px] bg-gray-50 rounded-lg p-4 font-mono text-sm whitespace-pre-wrap print:bg-white">
              {transcription || 'La transcription apparaîtra ici...'}
            </div>
          )
        ) : activeTab === 'report' ? (
          report ? (
            <div className="prose max-w-none">
              {report.split('\n').map((line, index) => (
                <p key={index}>{line}</p>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 italic">Générez d'abord un rapport...</p>
          )
        ) : activeTab === 'letter' ? (
          colleagueLetter ? (
            <div className="prose max-w-none">
              {colleagueLetter.split('\n').map((line, index) => (
                <p key={index}>{line}</p>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 italic">Générez d'abord une lettre...</p>
          )
        ) : (
          patientAdvice ? (
            <div className="prose max-w-none">
              {patientAdvice.split('\n').map((line, index) => (
                <p key={index}>{line}</p>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 italic">Extrayez d'abord les conseils du rapport...</p>
          )
        )}
      </div>
    );

    return content;
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <Stethoscope className="h-8 w-8 text-blue-600" />
            <h2 className="text-lg font-semibold text-gray-900">Transcription en direct</h2>
          </div>
          <div className="flex items-center space-x-4">
            {isRecording && (
              <div className="flex items-center">
                <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse mr-2" />
                <span className="text-sm text-gray-600">Enregistrement en cours</span>
              </div>
            )}
            {isProcessing && (
              <div className="flex items-center">
                <Loader className="w-5 h-5 text-blue-500 animate-spin mr-2" />
                <span className="text-sm text-gray-600">Traitement en cours</span>
              </div>
            )}
          </div>
        </div>

        <div className="mb-4">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setActiveTab('transcription')}
              className={`px-4 py-2 rounded-md transition-colors ${
                activeTab === 'transcription'
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Transcription
            </button>
            {report && (
              <button
                onClick={() => setActiveTab('report')}
                className={`px-4 py-2 rounded-md transition-colors ${
                  activeTab === 'report'
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                Rapport
              </button>
            )}
            {colleagueLetter && (
              <button
                onClick={() => setActiveTab('letter')}
                className={`px-4 py-2 rounded-md transition-colors ${
                  activeTab === 'letter'
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                Lettre
              </button>
            )}
            {patientAdvice && (
              <button
                onClick={() => setActiveTab('advice')}
                className={`px-4 py-2 rounded-md transition-colors ${
                  activeTab === 'advice'
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                Conseils patient
              </button>
            )}
          </div>
        </div>

        <div ref={contentRef}>
          {renderContent()}
        </div>

        <div className="mt-4">
          <div className="flex flex-wrap items-center gap-2">
            {!isRecording && !isEditing && activeTab === 'transcription' && (
              <button
                onClick={handleEdit}
                className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
                title="Modifier la transcription"
              >
                <Edit2 className="h-4 w-4" />
                <span>Modifier</span>
              </button>
            )}
            {report && activeTab === 'report' && (
              <button
                onClick={handleExtractAdvice}
                className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
                disabled={isProcessing}
              >
                <FileText className="h-4 w-4" />
                <span>Extraire les conseils</span>
              </button>
            )}
            <button
              onClick={() => handleCopy(
                activeTab === 'transcription' ? transcription :
                activeTab === 'report' ? report :
                activeTab === 'letter' ? colleagueLetter :
                patientAdvice
              )}
              className={`inline-flex items-center space-x-2 px-3 py-1.5 rounded-md transition-colors ${
                copied 
                  ? 'bg-green-100 text-green-700 hover:bg-green-200' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              title="Copier le contenu"
            >
              {copied ? (
                <>
                  <Check className="h-4 w-4" />
                  <span>Copié !</span>
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4" />
                  <span>Copier</span>
                </>
              )}
            </button>
            <button
              onClick={handlePrint}
              className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
              title="Imprimer le contenu"
            >
              <Printer className="h-4 w-4" />
              <span>Imprimer</span>
            </button>
            <button
              onClick={handleSaveAll}
              className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition-colors"
              title="Sauvegarder tous les documents"
            >
              <Download className="h-4 w-4" />
              <span>Tout sauvegarder</span>
            </button>
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};