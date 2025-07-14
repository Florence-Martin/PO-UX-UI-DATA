# Changelog

Toutes les modifications notables de ce projet seront documentées dans ce fichier.

Le format est basé sur [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
et ce projet respecte le [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Non publié]

### Prochaines fonctionnalités
- Intégration JIRA et Confluence
- Modules IA pour la génération automatique
- Authentification Firebase complète
- Dashboard temps réel avec WebSockets

## [1.0.0] - 2025-01-XX

### Ajouté
- **Documentation complète** : Guide développeur, contribution, API
- **Configuration VSCode** : Settings et extensions recommandées
- **Tests unitaires** : Couverture de 92.53% avec 72 tests
- **Types TypeScript** : Système de types complet et cohérent
- **Hooks personnalisés** : useUserStories, useBacklogTasks, useRoadmap
- **Services** : progressService, userStoryService, sprintService
- **Utilitaires** : buildTimelineItemsUserStories, gestion des erreurs

### Amélioré
- **Couverture de tests** : Portée à 92.53% statements, 77.85% branches
- **Architecture** : Séparation claire des responsabilités
- **Performance** : Optimisation des hooks et composants
- **Gestion d'erreurs** : Système robuste avec classes d'erreurs personnalisées

### Corrigé
- **Doublons de tests** : Suppression des fichiers `*.branches.test.ts`
- **Types** : Correction des types dans les données de test
- **Imports** : Nettoyage des imports non utilisés

## [0.9.0] - 2024-12-XX

### Ajouté
- **Dashboard UX/Data** : Métriques temps réel et KPIs
- **Roadmap Produit** : Planification trimestrielle interactive
- **Backlog Product** : Kanban avec drag-and-drop
- **Sprint Management** : Planning et suivi de vélocité
- **Validation & Qualité** : Checklists et tests API

### Fonctionnalités opérationnelles
- ✅ Gestion des user stories (CRUD complet)
- ✅ Backlog interactif avec statuts
- ✅ Sprint planning et suivi
- ✅ Personas et recherche utilisateur
- ✅ Wireframes modulaires
- ✅ Métriques et analytics

## [0.8.0] - 2024-11-XX

### Ajouté
- **Architecture Next.js** : App Router avec TypeScript
- **Configuration Firebase** : Firestore pour le stockage
- **Design System** : TailwindCSS + Shadcn UI
- **Composants de base** : Sidebar, ThemeProvider, formulaires
- **Routing** : Pages principales et navigation

### Technique
- Configuration Jest pour les tests
- ESLint et Prettier pour la qualité du code
- Structure de projet modulaire
- Hooks React personnalisés

## [0.7.0] - 2024-10-XX

### Ajouté
- **Prototype initial** : Maquettes et wireframes
- **Recherche utilisateur** : Personas et interviews
- **Spécifications** : Règles métier et fonctionnalités
- **Planning** : Roadmap produit et technique

### Conception
- UX/UI des écrans principaux
- Workflow utilisateur
- Architecture technique
- Choix technologiques

---

## Types de changements

- **Ajouté** : Nouvelles fonctionnalités
- **Modifié** : Changements dans des fonctionnalités existantes
- **Déprécié** : Fonctionnalités qui seront supprimées
- **Supprimé** : Fonctionnalités supprimées
- **Corrigé** : Corrections de bugs
- **Sécurité** : Vulnérabilités corrigées

---

## Conventions de version

- **Version Majeure** (X.0.0) : Changements incompatibles
- **Version Mineure** (0.X.0) : Nouvelles fonctionnalités compatibles
- **Version Corrective** (0.0.X) : Corrections de bugs compatibles

---

**Auteur** : Florence Martin - PO / UX/UI / Frontend Developer  
**Dernière mise à jour** : Janvier 2025
