# Application de Transcription Médicale V2

## Nouvelles fonctionnalités

### 1. Gestion améliorée des modèles de rapports
- Interface intuitive pour la création et modification des modèles
- Gestion des points structurés avec numérotation automatique
- Génération automatique des templates
- Prévisualisation en temps réel

### 2. Diarisation avancée
- Analyse du timbre de voix pour une meilleure détection des changements de locuteur
- Gestion des profils vocaux
- Paramètres ajustables pour la sensibilité de détection

### 3. Gestion des erreurs améliorée
- Reconnexion automatique en cas de perte réseau
- Messages d'erreur plus descriptifs
- Système de retry intelligent

## Configuration requise
- Node.js 18+
- Navigateur moderne avec support de l'API Web Speech
- Microphone fonctionnel

## Installation
```bash
npm install
```

## Démarrage
```bash
npm run dev
```

## Utilisation
1. Sélectionnez ou créez un modèle de rapport
2. Commencez l'enregistrement
3. Parlez clairement dans le microphone
4. Le système détectera automatiquement les changements de locuteur
5. Générez le compte rendu final

## Configuration de l'API

Pour exploiter l'analyse OpenAI, ouvrez le menu **Paramètres** (icône en forme d'engrenage) et renseignez votre clé API dans le champ *Clé API OpenAI*. Cette clé est nécessaire pour générer les comptes rendus et les lettres.

## Notes de version
- Version 2.0.0 : Refonte majeure de l'interface et des fonctionnalités
- Amélioration significative de la détection des locuteurs
- Interface plus intuitive pour la gestion des modèles