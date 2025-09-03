## 📦 PO-UX-UI-DATA – UX Product Owner Toolkit

![Tests](https://img.shields.io/badge/Tests-141%20passing-brightgreen)
![Coverage](https://img.shields.io/badge/Coverage-100%25-brightgreen)
![TypeScript](https://img.shields.io/badge/TypeScript-5.2.2-blue)
![Next.js](https://img.shields.io/badge/Next.js-14.2.31-black)
![ESLint](https://img.shields.io/badge/ESLint-0%20warnings-brightgreen)
![Lighthouse Desktop](https://img.shields.io/badge/Lighthouse-100%2F98%2F96%2F100-brightgreen)
![License](https://img.shields.io/badge/License-MIT-yellow)

Cette application est conçue comme une boîte à outils moderne pour Product Owner spécialisé en UX/UI et Datavisualisation, intégrant les meilleures pratiques agiles (Scrum), la recherche utilisateur, le backlog produit et la documentation fonctionnelle.

Pensée pour un usage terrain, elle centralise tous les outils nécessaires pour cadrer, piloter, et valider un produit numérique dans un contexte collaboratif (UX, BI, Tech).

> ⚠️ Démo Firebase publique (allow read, write: if true)

- Aucune donnée sensible n’est stockée
- L’application est en lecture/écriture publique uniquement à des fins de démonstration
- Ces règles seront renforcées dans une future version avec authentification Firebase

⸻

## Table of Contents

- [Objectif du projet](#objectif-du-projet)
- [Getting Started](#getting-started)
- [1. Dashboard UX/Data](#1-dashboard-uxdata)
- [2. Roadmap Produit](#2-roadmap-produit)
- [3. Analyse Produit & Wireframes](#3-analyse-produit--wireframes)
- [4. Backlog & Organisation Agile](#4-backlog--organisation-agile)
- [5. Collaboration BI & Data](#5-collaboration-bi--data)
- [6. Validation Produit & Qualité](#6-validation-produit--qualité)
- [7. Fonctionnalités IA (à venir)](#7-fonctionnalités-ia-à-venir)
- [Stack Technique](#stack-technique)
- [Documentation](#documentation)
- [Statut du projet](#statut-du-projet)
- [Suivre le projet](#suivre-le-projet)

⸻

## Objectif du projet

- Structurer les besoins métier à partir de personas, interviews et questionnaires.
- Concevoir rapidement des wireframes interactifs connectés à Figma.
- Gérer un backlog produit agile basé sur Scrum et la priorisation MoSCoW.
- Organiser les sprints et suivre la vélocité de manière itérative.
- Visualiser les indicateurs UX et business clés.
- Coordonner les actions entre les équipes UX, BI et développement.
- Assurer la qualité fonctionnelle via des checklists, tests et validations.

⸻

## Getting Started

### 🚀 Installation rapide

```bash
# Cloner le repository
git clone https://github.com/Florence-Martin/PO-UX-UI-DATA.git
cd PO-UX-UI-DATA

# Installer les dépendances
npm install

# Lancer en développement
npm run dev
```

### 📋 Prérequis

- Node.js >= 18.0.0
- npm >= 8.0.0

### 🔧 Configuration

- Configurer Firebase (voir [guide développeur](./documentation/developer-guide.md#configuration-firebase))
- Variables d'environnement dans `.env.local`

### 📚 Pour les développeurs

- **[Documentation complète](./documentation/README.md)** - Index de toute la documentation
- **[Guide développeur](./documentation/developer-guide.md)** - Installation, développement, tests
- **[Guide API](./documentation/api-guide.md)** - Services et hooks
- **[Cheatsheet](./documentation/cheatsheet.md)** - Raccourcis et patterns utiles

⸻

### 1. Dashboard UX/Data

- Visualisation de KPIs UX & produit : taux de conversion, rebond, scroll, engagement
- Composants dataviz : line chart, bar chart, heatmaps, funnel
- Interface responsive avec dark/light mode
- Design system avec TailwindCSS et Shadcn UI

⸻

### 2. Roadmap Produit

| Trimestre   | Objectif principal                       |
| ----------- | ---------------------------------------- |
| **Q1 2025** | Structuration UX et création de personas |
| **Q2 2025** | Wireframes + User Stories connectées     |
| **Q3 2025** | Backlog agile et Sprint Planning         |
| **Q4 2025** | Dashboard UX/Data + KPIs                 |
| **Q1 2026** | Intégration IA et automatisations        |

⸻

### 3. Analyse Produit & Wireframes

**Product Discovery**

- Éditeur de **questionnaires** et **interviews**
- Création de **personas** avec :
  - Nom, entreprise/type d’utilisateur
  - Objectifs, besoins, points de friction
  - Canaux de communication
- Liste dynamique des personas (multi-persona avec édition & suppression)
- Sauvegarde dans **Firebase**

**Wireframes**

- Grilles modulables de **wireframes basse fidélité**
- Aperçu visuel type **grid preview** pour faciliter le prototypage
- Liaison possible avec des maquettes Figma

**Documentation fonctionnelle**

- Éditeur complet de **User Stories**
- Validation du format (ex : "En tant que... je veux... afin de...")
- Lien automatique vers la fiche ou tâche associée
- Formulaire pré-rempli si redirection depuis le backlog
- Gestion des doublons et édition dynamique

⸻

### 4. Backlog & Organisation Agile

- **Kanban interactif** : To Do, In Progress, In Testing, Done
- **Drag-and-drop** avec mise à jour du statut en temps réel (Firestore)
- **Sprint Planning** :
  - Sélection de stories par sprint
  - Vélocité et complétion calculées dynamiquement
- **MoSCoW Priorization** : Must / Should / Could / Won’t
- Vue unifiée entre stories et tâches techniques liées

⸻

### 5. Collaboration BI & Data

- **Fiche KPI** : titre, description, source, fréquence, objectif, responsable
- Explorateur de données & A/B testing
- Liaison possible avec jeux de données fictifs ou APIs mockées

⸻

### 6. Validation Produit & Qualité

- **Checklists de validation UX/UI** :
  - Responsive
  - Accessibilité
  - Performance
  - Respect des critères d’acceptation
- **Tests API** avec éditeur intégré :
  - Méthode (GET, POST…)
  - Endpoint, headers, body
  - Résultats attendus
- Intégration d’**outils externes** :
  - JIRA
  - Postman
  - Confluence

⸻

### 7. Fonctionnalités IA (Prochaines évolutions)

L’IA vise à transformer le rôle du PO dans l’analyse, la priorisation et la planification produit :

- Génération automatique de **personas**, **user stories**, **KPIs**
- Suggestions UX pour améliorer l’engagement
- Planification de sprint assistée
- Simulation de tests utilisateurs et scoring des livrables

L’IA sera disponible dès **T1 2026** (version locale puis API).

⸻

## Stack Technique

- `Next.js` (App Router)
- `TypeScript`
- `TailwindCSS` + `Shadcn UI`
- `Chart.js`
- `Firebase` (Auth + Firestore)
- `Lucide Icons`
- `Framer Motion`

⸻

## Documentation

### 📚 Documentation complète

- **[Documentation technique](./documentation/README.md)** - Guide complet et index de la documentation
- **[Guide développeur](./documentation/developer-guide.md)** - Installation, développement, tests
- **[Guide de contribution](./documentation/contributing.md)** - Standards et processus
- **[Guide API](./documentation/api-guide.md)** - Services et hooks
- **[Cheatsheet](./documentation/cheatsheet.md)** - Raccourcis et patterns utiles
- **[Roadmap développement](./documentation/roadmap-development.md)** - Plan technique et évolutions
- **[Résumé exécutif](./documentation/executive-summary.md)** - Analyse et recommandations
- **[Analyse Performance](./documentation/PERFORMANCE_OPTIMIZATION.md)** - Leçons et bonnes pratiques
- **[Optimisations Lighthouse](./documentation/LIGHTHOUSE_OPTIMIZATIONS.md)** - Guide d'optimisation web
- **[Guide de Sécurité](./documentation/security-guide.md)** - Analyse des risques, protections et conformité RGPD

### 📋 Règles de gestion

Un document détaillé des **règles métier et fonctionnelles** est disponible ici :
👉 [Voir les règles de gestion](./documentation/business-rules.md)

⸻

## 🆕 Dernières améliorations (Juillet 2025)

### Sprint Management robuste

- **Filtrage intelligent** : Le Sprint Backlog affiche uniquement les éléments du sprint actif
- **Nettoyage automatique** : Les badges des sprints terminés sont automatiquement nettoyés
- **Migration automatique** : Clôture automatique des sprints expirés avec report des éléments incomplets
- **Interface d'administration** : Outils de debug et de gestion des migrations
- **Préservation de l'historique** : Les données restent visibles dans les vues historiques

### Qualité technique

- **Couverture de tests** : 100% avec 139 tests unitaires passant
- **Types TypeScript** : Configuration stricte activée
- **Architecture modulaire** : Services métier séparés et réutilisables
- **Standards ESLint** : 5 warnings à corriger (hooks dependencies)
- **Sécurité** : Architecture protégée, pas de vulnérabilités d'injection, conformité RGPD

### Performances web

- **Lighthouse Desktop** : Performance 100, Accessibilité 98, Best Practices 96, SEO 100
- **Optimisations** : Bundle optimisé, lazy loading, cache intelligent
- **UX** : Interface fluide et responsive avec dark/light mode

⸻

## Statut du projet

L’application est en cours de développement itératif.  
Certaines fonctionnalités (comme la gestion du backlog, des user stories et des tâches) sont déjà **fonctionnelles et interactives**, avec des données dynamiques connectées à Firebase.

D’autres sections sont pour le moment **présentées sous forme statique ou en prévisualisation**, dans l’attente de leur connexion aux données ou d’une implémentation complète.

> Le projet évolue en continu avec des mises à jour régulières pour enrichir les fonctionnalités et renforcer l’aspect dynamique de chaque module.

⸻

## Suivre le projet

- Suivre les updates sur [GitHub](https://github.com/Florence-Martin/PO-UX-UI-DATA)
- Échanger sur [LinkedIn](https://www.linkedin.com/in/florence-martin-922b3861/)

⸻

> _Projet conçu par Florence Martin – PO / UX/UI / Frontend Developer._
