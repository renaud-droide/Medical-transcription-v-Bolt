import React from 'react';
import { Controls } from './components/Controls';
import { TranscriptionArea } from './components/TranscriptionArea';
import { PromptSelector } from './components/PromptSelector';
import { GlobalSettings } from './components/GlobalSettings';
import { QuestionnaireGuide } from './components/QuestionnaireGuide';
import { AkosLogo } from './components/AkosLogo';

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <header className="bg-white shadow-sm">
        <div className="w-full px-4 py-4">
          <div className="flex items-center justify-between">
            <AkosLogo />
            <GlobalSettings />
          </div>
        </div>
      </header>

      {/* Controls Section */}
      <div className="w-full bg-white shadow-sm mt-4">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <Controls />
        </div>
      </div>

      <main className="w-full px-4 py-8">
        <div className="grid grid-cols-12 gap-8">
          {/* Main Content Area */}
          <div className="col-span-12 xl:col-span-4 space-y-8">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Type de Rapport</h2>
              <PromptSelector />
            </div>

            <TranscriptionArea />
          </div>

          {/* Guide Area */}
          <div className="col-span-12 xl:col-span-8">
            <QuestionnaireGuide />
          </div>
        </div>
      </main>

      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="w-full px-4 py-4">
          <p className="text-sm text-gray-500 text-center">
            Application de Transcription Médicale - Sécurisée et Efficace
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;