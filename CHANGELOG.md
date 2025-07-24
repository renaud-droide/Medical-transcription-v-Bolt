# Changelog

## [3.0.0] - 2024-03-02

### Améliorations majeures
- Intégration de Whisper pour la transcription locale
- Traitement audio en temps réel avec WebAssembly
- Amélioration significative de la qualité de transcription
- Réduction de la latence de transcription
- Support hors-ligne complet

### Nouvelles fonctionnalités
- Transcription locale sans dépendance à des services externes
- Détection automatique de la langue
- Traitement par chunks pour une meilleure réactivité
- Gestion intelligente des changements de locuteur

### Optimisations
- Réduction de la consommation mémoire
- Amélioration des performances de traitement
- Meilleure gestion des ressources audio

### Technique
- Utilisation de @xenova/transformers pour Whisper
- Implémentation WebAssembly pour le traitement audio
- Optimisation du pipeline de transcription
- Amélioration de la gestion de la mémoire

## [2.0.0] - 2024-03-02

### Améliorations majeures
- Refonte complète du système de diarisation avec une meilleure détection des changements de locuteur
- Amélioration de l'analyse spectrale pour une meilleure identification des voix
- Ajout de l'analyse des formants pour une détection plus précise des caractéristiques vocales
- Nouveau système de segmentation des locuteurs avec gestion de la durée minimale
- Optimisation du traitement audio en temps réel

### Améliorations de la transcription
- Suppression des messages système de la transcription
- Réduction des répétitions tout en conservant l'intégralité du contenu
- Meilleure gestion des transitions entre locuteurs
- Amélioration de la détection des silences

### Corrections
- Correction des problèmes de répétition dans la transcription
- Amélioration de la gestion des erreurs de reconnaissance vocale
- Optimisation de la reconnexion en cas de perte de signal audio

### Technique
- Ajout de l'analyse des formants vocaux
- Implémentation d'un nouveau système de score pour la détection des changements de locuteur
- Amélioration de la gestion de la mémoire pour les profils vocaux
- Optimisation des performances du traitement audio