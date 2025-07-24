import React, { useState } from 'react';
import { useRecordingStore } from '../store/recordingStore';
import type { TranscriptionPrompt } from '../types';
import { Settings, Plus, Trash2, Save, Edit2, Info } from 'lucide-react';

const DEFAULT_PROMPTS: TranscriptionPrompt[] = [
  {
    id: 'general',
    name: 'Consultation Générale',
    template: `Veuillez générer un compte rendu médical structuré basé sur la transcription suivante.
Le compte rendu doit inclure :
1. Informations générales
2. Motif de consultation
3. Antécédents pertinents
4. Examen clinique
5. Diagnostic
6. Plan de traitement
7. Recommandations

Utilisez un format professionnel et médical approprié.`,
    points: [
      'Informations générales',
      'Motif de consultation',
      'Antécédents pertinents',
      'Examen clinique',
      'Diagnostic',
      'Plan de traitement',
      'Recommandations'
    ],
    questionnaire: `INTERROGATOIRE CONSULTATION GÉNÉRALE

1. MOTIF DE CONSULTATION
- Raison principale de la visite
- Depuis quand
- Circonstances d'apparition

2. HISTOIRE DE LA MALADIE
- Évolution des symptômes
- Facteurs aggravants/soulageants
- Traitements déjà essayés

3. ANTÉCÉDENTS
Personnels :
- Médicaux
- Chirurgicaux
- Allergies
- Traitements en cours

Familiaux :
- Maladies héréditaires
- Pathologies familiales importantes

4. MODE DE VIE
- Profession
- Activités physiques
- Tabac/Alcool
- Alimentation

5. SYMPTÔMES ASSOCIÉS
- Autres plaintes
- Signes généraux
- Impact sur la vie quotidienne`,
    letterInstructions: `Instructions pour la génération de la lettre au confrère :

1. Format et style
- Utiliser un ton professionnel et formel
- Structurer clairement les informations
- Maintenir une présentation soignée

2. Contenu à inclure
- Présentation du patient et motif d'adressage
- Résumé des éléments cliniques pertinents
- Diagnostic(s) retenu(s)
- Traitements déjà initiés
- Examens complémentaires réalisés
- Demande spécifique au confrère

3. Formules de politesse
- Début : "Cher confrère," ou "Chère consœur,"
- Fin : "Confraternellement," ou "Bien confraternellement,"

4. Points d'attention
- Hiérarchiser les informations par ordre d'importance
- Être concis tout en étant complet
- Mettre en évidence les points nécessitant une attention particulière`
  },
  {
    id: 'commotion',
    name: 'Suivi Commotion',
    template: `Veuillez générer un compte rendu détaillé de suivi post-commotion basé sur la transcription suivante.
Le compte rendu doit inclure :
1. Motif précis de la consultation
2. Historique succinct de la commotion
3. Synthèse détaillée des symptômes actuels (physiques, cognitifs, émotionnels, sensoriels)
4. Résultats de l'évaluation clinique (neurologique, équilibre, cognitive)
5. Propositions thérapeutiques et recommandations spécifiques
6. Adaptation activité physique
7. Aménagements scolaires ou professionnels
8. Suivi thérapeutique complémentaire

Utilisez un format professionnel et médical approprié.`,
    points: [
      'Motif précis de la consultation',
      'Historique succinct de la commotion',
      'Synthèse détaillée des symptômes actuels',
      'Résultats de l\'évaluation clinique',
      'Propositions thérapeutiques',
      'Adaptation activité physique',
      'Aménagements scolaires/professionnels',
      'Suivi thérapeutique complémentaire'
    ],
    questionnaire: `Guide d'interrogatoire pour Suivi d'un Patient ayant eu une Commotion

INFORMATIONS GÉNÉRALES

Mode de vie :
- Activité professionnelle ou scolaire
- Activités physiques et sportives actuelles
- Qualité du sommeil et gestion du stress

MOTIF DE CONSULTATION
- Suivi post-commotion
- Symptômes persistants
- Évaluation avant reprise sportive ou scolaire

HISTORIQUE DE LA COMMOTION
- Date et circonstances de la commotion
- Traitements déjà suivis (médicaments, thérapies)
- Examens médicaux réalisés (imagerie, examens neurologiques)

INTERROGATOIRE FONCTIONNEL DÉTAILLÉ

Décrire précisément les symptômes actuels :
- Maux de tête : fréquence, intensité, localisation
- Vertiges ou troubles de l'équilibre
- Troubles visuels : vision floue, sensibilité à la lumière
- Troubles auditifs : acouphènes, sensibilité au bruit
- Difficultés cognitives : mémoire, concentration, confusion
- Fatigue physique et/ou mentale
- Changements émotionnels ou d'humeur : irritabilité, anxiété, dépression

Sphère cognitive :
- Difficultés d'attention ou de mémoire
- Difficultés scolaires ou professionnelles

Sphère physique :
- Fatigabilité excessive
- Tolérance à l'effort physique

Sphère sensorielle :
- Problèmes visuels persistants
- Troubles auditifs persistants

Sphère émotionnelle et comportementale :
- Changements émotionnels significatifs
- Difficultés dans les interactions sociales

ÉVALUATION CLINIQUE
- Évaluation des fonctions oculaires
- Test de convergences, saccades, poursuite
- Test reflexe occulo-vestibulaire
- Tests d'équilibre et de coordination
- Évaluation cognitive rapide (mémoire, attention)
- Vitesse de réaction et inhibition test de Stroop

CONCLUSION ET PLAN THÉRAPEUTIQUE
- Résumé succinct de l'état actuel du patient
- Niveau palier retour aux apprentissages et retour au jeu
- Recommandations précises sur la reprise d'activités
- Planification des thérapies complémentaires`,
    customInstructions: `Consignes pour la génération du compte rendu :

1. Respecter strictement le plan détaillé ci-dessus
2. Utiliser un langage clair, précis, accessible aux professionnels de santé et aux intervenants scolaires ou sportifs
3. Mettre en évidence les évolutions depuis la dernière consultation
4. Détailler précisément les recommandations de reprise d'activité`,
    letterInstructions: `Consignes pour la lettre au médecin :

Structure recommandée :
1. Introduction amicale avec rappel succinct du motif de consultation
2. Synthèse rapide de l'historique de la commotion
3. Date et niveau des scores de symptômes en début, avec rappel sur les troubles majeurs en début de rééducation et actuellement
4. Niveau du palier actuel
5. Détail des symptômes persistants et résultats des évaluations réalisées
6. Recommandations précises concernant les activités autorisées et précautions
7. Proposition de suivi médical ou examens complémentaires éventuels

Utiliser un ton professionnel, clair et structuré pour favoriser une prise en charge multidisciplinaire efficace.`
  },
  {
    id: 'kine',
    name: 'Suivi Kinésithérapie',
    template: `Veuillez générer un compte rendu de séance de kinésithérapie basé sur la transcription suivante.
Le compte rendu doit inclure :
1. Évolution depuis la dernière séance
2. Évaluation de la douleur
3. Mobilité articulaire
4. Force musculaire
5. Exercices réalisés
6. Techniques manuelles utilisées
7. Recommandations pour la prochaine séance`,
    points: [
      'Évolution depuis la dernière séance',
      'Évaluation de la douleur',
      'Mobilité articulaire',
      'Force musculaire',
      'Exercices réalisés',
      'Techniques manuelles utilisées',
      'Recommandations pour la prochaine séance'
    ],
    questionnaire: `BILAN KINÉSITHÉRAPIQUE

1. ÉVOLUTION
- Ressenti depuis dernière séance
- Observance des exercices
- Difficultés rencontrées

2. DOULEUR
- EVA (/10)
- Localisation précise
- Type (mécanique/inflammatoire)
- Facteurs modulants

3. BILAN ARTICULAIRE
- Amplitudes passives
- Amplitudes actives
- Sensation de fin de course
- Comparaison côté sain

4. BILAN MUSCULAIRE
- Testing (/5)
- Endurance
- Fatigabilité
- Contractures/Tensions

5. BILAN FONCTIONNEL
- Activités limitées
- Gestes douloureux
- Compensations
- Objectifs patient

6. PALPATION
- Points douloureux
- Zones de tension
- État cutané/cicatrices
- Température locale`,
    letterInstructions: `Instructions pour la lettre au médecin prescripteur :

1. Structure du courrier
- Identification du patient et du traitement
- Période de prise en charge
- Nombre de séances réalisées

2. Contenu clinique
- Bilan initial détaillé
- Évolution des symptômes
- Progrès fonctionnels observés
- Adhésion du patient au traitement

3. Aspects techniques
- Techniques utilisées
- Exercices prescrits
- Adaptations effectuées
- Éducation thérapeutique réalisée

4. Recommandations
- Poursuite du traitement si nécessaire
- Adaptations proposées
- Auto-exercices conseillés
- Mesures préventives suggérées`
  },
  {
    id: 'osteo',
    name: 'Consultation Ostéopathie',
    template: `Veuillez générer un compte rendu ostéopathique structuré basé sur la transcription suivante.
Le compte rendu doit inclure :
1. Motif précis de la consultation
2. Antécédents médicaux essentiels
3. Synthèse détaillée des symptômes
4. Résultats de l'examen ostéopathique
5. Techniques ostéopathiques employées
6. Recommandations post-séance
7. Consultations à envisager

Utilisez un format professionnel et médical approprié.`,
    points: [
      'Motif précis de la consultation',
      'Antécédents médicaux essentiels',
      'Synthèse détaillée des symptômes',
      'Résultats de l\'examen ostéopathique',
      'Techniques ostéopathiques employées',
      'Recommandations post-séance',
      'Consultations à envisager'
    ],
    questionnaire: `GUIDE D'INTERROGATOIRE POUR CONSULTATION D'OSTÉOPATHIE

INFORMATIONS GÉNÉRALES

Mode de vie :
- Activité professionnelle et type d'activités physiques pratiquées
- Positions ou gestes répétitifs quotidiens
- Qualité du sommeil, gestion du stress

MOTIF DE CONSULTATION

Motif principal :
- Douleur, limitation fonctionnelle, suivi préventif
- Depuis quand

Description des symptômes :
- Type de douleur (aiguë, chronique, brûlante, diffuse, précise)
- Intensité (échelle 1-10)
- Douleur nocturne, mécanique, à l'effort
- Localisation précise et irradiations éventuelles
- Facteurs aggravants et facteurs soulageants
- Durée et fréquence des symptômes
- Événement déclencheur éventuel (traumatisme, sport, stress)
- Consultation médicale en rapport, imagerie médicale pratiquée

HISTORIQUE MÉDICAL

Antécédents :
- Antécédents médicaux pertinents (maladies chroniques, antécédents traumatiques)
- Traitements médicamenteux actuels
- Antécédents chirurgicaux
- Allergies connues
- Antécédents familiaux

INTERROGATOIRE FONCTIONNEL

Sphère ORL :
- Maux de tête fréquents
- Rhinites, sinusites fréquentes
- Acouphènes, vertiges
- Douleurs mâchoire, travaux dentaires

Sphère cardio-pulmonaire :
- Palpitations, douleurs thoraciques, essoufflements
- Asthme, toux chronique, tabac

Sphère digestive :
- Qualité de la digestion, douleurs associées aux repas
- Reflux gastro-œsophagien, crampes
- Régularité du transit, ballonnements
- Régime alimentaire, aliments mal digérés

Sphère uro-génitale :
- Régularité des règles, douleurs associées aux menstruations (femmes)
- Troubles urinaires éventuels`,
    customInstructions: `Consignes pour la génération du compte rendu :

1. Respecter strictement le plan détaillé suivant :
- Motif précis de la consultation
- Antécédents médicaux essentiels
- Synthèse détaillée des symptômes (type, intensité, localisation, irradiation)
- Résultats de l'examen ostéopathique (observations posturales, restrictions)
- Techniques ostéopathiques employées
- Recommandations post-séance (exercices, modifications du mode de vie)
- Consultations à envisager

2. Style et format :
- Utiliser un langage médical adapté
- Rester compréhensible par des professionnels de santé non spécialisés
- Structurer clairement les informations avec des sous-titres
- Être précis dans la description des techniques et observations

3. Points d'attention particuliers :
- Mettre en évidence les éléments cliniques significatifs
- Détailler les liens entre les symptômes et les observations
- Justifier les techniques choisies
- Expliquer clairement les recommandations`,
    letterInstructions: `Consignes pour la rédaction de la lettre au médecin :

1. Structure et style :
- Respecter les codes professionnels et médicaux
- Maintenir une courtoisie professionnelle
- Être précis et synthétique
- Utiliser un style clair et sobre

2. Organisation du contenu :
- Introduction courtoise et rappel du motif d'envoi
- Motif initial de consultation
- Résumé synthétique des symptômes
- Principales observations et tests effectués
- Description succincte des interventions réalisées
- État du patient après consultation

3. Recommandations et suivi :
- Éviter les formulations directives pour les suggestions d'examens
- Utiliser des tournures respectueuses comme "je vous laisse juge des examens nécessaires"
- Proposer délicatement des pistes de réflexion pour la suite de la prise en charge

4. Points essentiels :
- Souligner les éléments importants pour la coordination des soins
- Faciliter la compréhension interprofessionnelle
- Maintenir une communication constructive
- Respecter le rôle central du médecin traitant`
  }
];

export const PromptSelector: React.FC = () => {
  const { selectedPrompt, setSelectedPrompt } = useRecordingStore();
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const [editingPrompt, setEditingPrompt] = useState<TranscriptionPrompt | null>(null);
  const [prompts, setPrompts] = useState<TranscriptionPrompt[]>(DEFAULT_PROMPTS);
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [newPoint, setNewPoint] = useState('');

  const handleEditPrompt = (prompt: TranscriptionPrompt) => {
    setEditingPrompt({ ...prompt });
    setIsCreatingNew(false);
    setIsConfigOpen(true);
  };

  const handleCreateNew = () => {
    setEditingPrompt({
      id: `template-${Date.now()}`,
      name: 'Nouveau modèle',
      template: '',
      points: [],
      customInstructions: '',
      letterInstructions: '',
      questionnaire: ''
    });
    setIsCreatingNew(true);
    setIsConfigOpen(true);
  };

  const handleAddPoint = () => {
    if (!editingPrompt || !newPoint.trim()) return;

    const updatedPoints = [...editingPrompt.points, newPoint.trim()];
    const updatedTemplate = generateTemplateFromPoints(updatedPoints);

    setEditingPrompt({
      ...editingPrompt,
      points: updatedPoints,
      template: updatedTemplate
    });
    setNewPoint('');
  };

  const handleRemovePoint = (index: number) => {
    if (!editingPrompt) return;

    const updatedPoints = editingPrompt.points.filter((_, i) => i !== index);
    const updatedTemplate = generateTemplateFromPoints(updatedPoints);

    setEditingPrompt({
      ...editingPrompt,
      points: updatedPoints,
      template: updatedTemplate
    });
  };

  const generateTemplateFromPoints = (points: string[]): string => {
    const header = `Veuillez générer un compte rendu médical structuré basé sur la transcription suivante.\nLe compte rendu doit inclure :`;
    const numberedPoints = points.map((point, index) => `${index + 1}. ${point}`).join('\n');
    const footer = `\n\nUtilisez un format professionnel et médical approprié.`;
    return `${header}\n${numberedPoints}${footer}`;
  };

  const handleSavePrompt = () => {
    if (!editingPrompt) return;
    
    if (isCreatingNew) {
      setPrompts([...prompts, editingPrompt]);
    } else {
      const newPrompts = prompts.map(p => 
        p.id === editingPrompt.id ? editingPrompt : p
      );
      setPrompts(newPrompts);
    }
    
    if (selectedPrompt?.id === editingPrompt.id) {
      setSelectedPrompt(editingPrompt);
    }
    
    setIsConfigOpen(false);
    setEditingPrompt(null);
    setIsCreatingNew(false);
  };

  const handleDeletePrompt = (promptId: string) => {
    const newPrompts = prompts.filter(p => p.id !== promptId);
    setPrompts(newPrompts);
    
    if (selectedPrompt?.id === promptId) {
      setSelectedPrompt(null);
    }
    
    setIsConfigOpen(false);
    setEditingPrompt(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <select
            value={selectedPrompt?.id || ''}
            onChange={(e) => {
              const selected = prompts.find(t => t.id === e.target.value);
              setSelectedPrompt(selected || null);
            }}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="">Sélectionnez un type de compte rendu</option>
            {prompts.map(template => (
              <option key={template.id} value={template.id}>
                {template.name}
              </option>
            ))}
          </select>
        </div>
        <div className="flex items-center space-x-2 ml-2">
          {selectedPrompt && (
            <button
              onClick={() => handleEditPrompt(selectedPrompt)}
              className="p-2 text-gray-600 hover:text-gray-900 rounded-full hover:bg-gray-100"
              title="Modifier le modèle"
            >
              <Edit2 className="h-5 w-5" />
            </button>
          )}
          <button
            onClick={handleCreateNew}
            className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 flex items-center space-x-2"
          >
            <Plus className="h-4 w-4" />
            <span>Nouveau modèle</span>
          </button>
        </div>
      </div>

      {isConfigOpen && editingPrompt && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full p-6 max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold mb-4">
              {isCreatingNew ? 'Créer un nouveau modèle' : 'Modifier le modèle'}
            </h3>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nom du modèle
                </label>
                <input
                  type="text"
                  value={editingPrompt.name}
                  onChange={(e) => setEditingPrompt({
                    ...editingPrompt,
                    name: e.target.value
                  })}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder="Entrez le nom du modèle"
                />
              </div>

              <div>
                <div className="flex items-center gap-2 mb-1">
                  <label className="text-sm font-medium text-gray-700">
                    Consignes pour la génération du rapport
                  </label>
                  <div className="relative group">
                    <Info className="h-4 w-4 text-gray-400 cursor-help" />
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 p-3 bg-gray-900 text-white text-sm rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 w-80 z-50">
                      Ces consignes seront utilisées pour guider l'IA dans la génération du rapport médical. Elles définissent le style, la structure et les éléments à inclure.
                    </div>
                  </div>
                </div>
                <textarea
                  value={editingPrompt.customInstructions || ''}
                  onChange={(e) => setEditingPrompt({
                    ...editingPrompt,
                    customInstructions: e.target.value
                  })}
                  className="w-full h-24 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder="Ajoutez des consignes spécifiques pour la génération du rapport..."
                />
              </div>

              <div>
                <div className="flex items-center gap-2 mb-1">
                  <label className="text-sm font-medium text-gray-700">
                    Consignes pour la lettre au confrère
                  </label>
                  <div className="relative group">
                    <Info className="h-4 w-4 text-gray-400 cursor-help" />
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 p-3 bg-gray-900 text-white text-sm rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 w-80 z-50">
                      Ces consignes seront utilisées spécifiquement pour la génération de la lettre au confrère. Elles définissent le format, le style et les informations à inclure dans la correspondance professionnelle.
                    </div>
                  </div>
                </div>
                <textarea
                  value={editingPrompt.letterInstructions || ''}
                  onChange={(e) => setEditingPrompt({
                    ...editingPrompt,
                    letterInstructions: e.target.value
                  })}
                  className="w-full h-48 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder="Ajoutez des consignes spécifiques pour la génération de la lettre au confrère..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Points du compte rendu
                </label>
                <div className="space-y-2">
                  {editingPrompt.points.map((point, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <span className="text-gray-500">{index + 1}.</span>
                      <input
                        type="text"
                        value={point}
                        onChange={(e) => {
                          const updatedPoints = [...editingPrompt.points];
                          updatedPoints[index] = e.target.value;
                          const updatedTemplate = generateTemplateFromPoints(updatedPoints);
                          setEditingPrompt({
                            ...editingPrompt,
                            points: updatedPoints,
                            template: updatedTemplate
                          });
                        }}
                        className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      />
                      <button
                        onClick={() => handleRemovePoint(index)}
                        className="p-1 text-red-600 hover:text-red-800"
                        title="Supprimer ce point"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>

                <div className="mt-2 flex space-x-2">
                  <input
                    type="text"
                    value={newPoint}
                    onChange={(e) => setNewPoint(e.target.value)}
                    placeholder="Nouveau point"
                    className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        handleAddPoint();
                      }
                    }}
                  />
                  <button
                    onClick={handleAddPoint}
                    className="px-3 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 flex items-center space-x-1"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Ajouter</span>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Guide d'interrogatoire
                </label>
                <textarea
                  value={editingPrompt.questionnaire || ''}
                  onChange={(e) => setEditingPrompt({
                    ...editingPrompt,
                    questionnaire: e.target.value
                  })}
                  className="w-full h-96 font-mono text-sm rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder="Entrez le guide d'interrogatoire..."
                />
                <p className="mt-1 text-sm text-gray-500">
                  Ce texte sera affiché comme guide pendant la consultation.
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Aperçu du template généré
                </label>
                <div className="bg-gray-50 p-4 rounded-md">
                  <pre className="whitespace-pre-wrap text-sm font-mono">
                    {editingPrompt.template}
                  </pre>
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-between">
              <div>
                {!isCreatingNew && (
                  <button
                    onClick={() => handleDeletePrompt(editingPrompt.id)}
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
                    setEditingPrompt(null);
                    setIsCreatingNew(false);
                  }}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                >
                  Annuler
                </button>
                <button
                  onClick={handleSavePrompt}
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