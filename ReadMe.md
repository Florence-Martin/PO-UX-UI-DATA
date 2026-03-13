# 🧭 PO-UX-UI-DATA

**Where product discovery, design and development meet.**

Cockpit collaboratif pour les équipes produit.

PO-UX-UI-DATA est une boîte à outils conçue pour relier les différentes étapes du développement d’un produit numérique : **product discovery, UX/UI design, analyse data et développement**.

L’objectif est de faciliter le **cadrage produit, l’alignement des parties prenantes et le pilotage collaboratif du produit**.

![Tests](https://img.shields.io/badge/Tests-166%20passing-brightgreen)
![Coverage](https://img.shields.io/badge/Coverage-100%25-brightgreen)
![TypeScript](https://img.shields.io/badge/TypeScript-5.2.2-blue)
![Next.js](https://img.shields.io/badge/Next.js-14-black)
![License](https://img.shields.io/badge/License-MIT-green)

---

## ⚠️ Mode Démo

La version actuelle du projet fonctionne en **mode démonstration** avec des règles Firebase ouvertes afin de faciliter les tests.

- Base Firestore : `allow read, write: if true`
- Lecture / écriture autorisées uniquement pour les démonstrations
- Aucune donnée sensible n’est stockée
- Un système d’authentification sera ajouté dans une prochaine version

---

## 🚀 Objectifs du projet

PO-UX-UI-DATA vise à créer un **point de convergence entre discovery, design et delivery**.

Les fonctionnalités explorées dans ce projet incluent :

- Structurer la **product discovery** à partir de personas, interviews et questionnaires
- Concevoir rapidement des **wireframes interactifs** (connectés à Figma)
- Gérer un **backlog produit agile** avec priorisation (MoSCoW / Scrum)
- Organiser les **sprints** et suivre la vélocité
- Visualiser les **KPIs UX et business**
- Faciliter la collaboration entre **Product, UX, Data et Développement**
- Sécuriser la qualité produit via **checklists, tests et validations**

---

## 📋 Table of Contents

1. [Getting Started](#getting-started)
2. [Dashboard UX/Data](#dashboard-uxdata)
3. [Roadmap Produit](#roadmap-produit)
4. [Analyse Produit & Wireframes](#analyse-produit--wireframes)
5. [Backlog & Organisation Agile](#backlog--organisation-agile)
6. [Collaboration BI & Data](#collaboration-bi--data)
7. [Validation Produit & Qualité](#validation-produit--qualité)
8. [Fonctionnalités IA (Prochaines évolutions)](#fonctionnalités-ia-prochaines-évolutions)
9. [Stack Technique](#stack-technique)
10. [Documentation](#documentation)
11. [Dernières Améliorations](#dernières-améliorations-juillet-2025)
12. [Statut du Projet](#statut-du-projet)
13. [Licence & Attribution](#licence--attribution)

---

## Getting Started

### 📦 Installation rapide

```bash
# Cloner le repository
git clone https://github.com/Florence-Martin/PO-UX-UI-DATA.git
cd PO-UX-UI-DATA

# Installer les dépendances
npm install

# Configurer l'environnement (copier .env.example vers .env.local)
cp .env.example .env.local
# Puis éditer .env.local avec vos clés Firebase

# Lancer en développement
npm run dev
```

### 🛠️ Scripts disponibles

```bash
npm run dev              # Serveur de développement (localhost:3000)
npm run build            # Build de production
npm run start            # Serveur de production
npm run lint             # Vérification ESLint
npm run lint:fix         # Correction automatique ESLint
npm run type-check       # Vérification TypeScript (sans build)
npm run format           # Formater le code avec Prettier
npm run format:check     # Vérifier le formatage (CI)
npm run test             # Lancer les tests Jest
npm run test:watch       # Tests en mode watch
npm run test:coverage    # Tests avec couverture de code
npm run clean            # Nettoyer et réinstaller
```

## 📋 Prérequis

- Node.js >= 18.0.0
- npm >= 8.0.0

---

## 🔧 Configuration

- Configurer Firebase (voir guide développeur)
- Variables d’environnement dans `.env.local`

---

## Documentation

- **[Documentation complète](./documentation/README.md)** - Index de toute la documentation
- **[Guide développeur](./documentation/developer-guide.md)** - Installation, développement, tests
- **[Guide API](./documentation/api-guide.md)** - Services et hooks
- **[Cheatsheet](./documentation/cheatsheet.md)** - Raccourcis et patterns utiles

---

## Dashboard UX/Data

- Visualisation de KPIs UX & produit : taux de conversion, rebond, scroll, engagement
- Composants dataviz : line chart, bar chart, heatmaps, funnel
- Interface responsive avec dark/light mode
- Design system basé sur TailwindCSS + Shadcn UI

---

## Roadmap Produit

| Trimestre | Objectif principal                       |
| --------- | ---------------------------------------- |
| Q1 2025   | Structuration UX et création de personas |
| Q2 2025   | Wireframes + User Stories connectées     |
| Q3 2025   | Backlog agile et Sprint Planning         |
| Q4 2025   | Dashboard UX/Data + KPIs                 |
| Q1 2026   | Intégration IA et automatisations        |

---

## Analyse Produit & Wireframes

### Product Discovery

- Éditeur de questionnaires et interviews
- Création de personas (nom, entreprise, objectifs, besoins, points de friction, canaux)
- Multi-personas : liste, édition et suppression dynamiques
- Sauvegarde dans Firebase

### Wireframes

- Grilles dynamiques (2×2 à 5×5 cellules)
- Upload d’images via API Next.js
- Métadonnées Firestore + stockage local `/public/wireframes/`
- Drag & drop, redimensionnement, suppression
- Preview visuel + liaison possible avec maquettes Figma

### Documentation fonctionnelle

- Éditeur de User Stories (format “En tant que… je veux… afin de…”)
- Lien automatique vers backlog/tâche associée
- Gestion des doublons et édition dynamique

---

## Backlog & Organisation Agile

- Kanban interactif : To Do, In Progress, In Testing, Done
- Drag & drop avec mise à jour Firestore en temps réel
- Sprint Planning : sélection de stories, vélocité calculée dynamiquement
- MoSCoW Priorization : Must / Should / Could / Won’t
- Vue unifiée entre user stories et tâches techniques liées

---

## Collaboration BI & Data

- Fiche KPI (titre, description, source, fréquence, objectif, responsable)
- Explorateur de données & A/B testing
- Liaison possible avec datasets fictifs ou APIs mockées

---

## Validation Produit & Qualité

- Checklists UX/UI : responsive, accessibilité, performance, critères d’acceptation
- Tests API intégrés : méthodes, endpoints, headers, body, résultats attendus
- Liens externes : JIRA, Postman, Confluence

---

## Fonctionnalités IA (Prochaines évolutions)

- Génération automatique de personas, user stories et KPIs
- Suggestions UX pour améliorer l’engagement
- Planification de sprint assistée
- Simulation de tests utilisateurs et scoring des livrables
- Disponible dès T1 2026 (version locale puis API)

---

## Stack Technique

- Next.js 14 (App Router) + API Routes
- TypeScript 5.2.2
- TailwindCSS + Shadcn UI
- Chart.js + Framer Motion (dataviz & animations)
- Firebase Firestore (métadonnées uniquement)
- Stockage local : `/public/wireframes/`
- Jest (166 tests unitaires, 16 suites, mocks Firestore)
- Lucide Icons

---

## Documentation

- Documentation technique
- Guide développeur (installation, développement, tests)
- Guide API (services et hooks)
- Cheatsheet (patterns utiles)
- Roadmap de développement
- Analyse performance et optimisations Lighthouse
- Guide sécurité (risques, protections, conformité RGPD)
- Règles de gestion

---

## Dernières Améliorations (Novembre 2025)

### 🎯 Nettoyage v1.0 - Phases 1 à 4 terminées
- ✅ **Phase 1** : Suppression dossiers dev/debug/sandbox, création .env.example
- ✅ **Phase 2** : Configuration Prettier, scripts npm, système de logging centralisé
- ✅ **Phase 3** : Remplacement de 51 console.log par logger (8 services)
- ✅ **Phase 4** : Documentation complète, corrections bugs build, déploiement Vercel

### 📊 Qualité & Performance
- **Tests unitaires** : 166/166 tests passés (16 suites, 100% coverage)
- **Performance Lighthouse (Production Vercel)** :
  - **Desktop** : Performance 100/100, Accessibilité 98/100, Best Practices 93/100, SEO 100/100
  - **Mobile** : Performance 71/100, Accessibilité 92/100, Best Practices 93/100, SEO 100/100
- **Logging** : Système centralisé masquant les logs en production (sauf erreurs)
- **Build** : 19 pages statiques générées, 0 erreur TypeScript/ESLint

### 🚀 Fonctionnalités
- Sprint Management robuste (nettoyage automatique, migration des US, badges sprints terminés)
- Architecture modulaire avec types TypeScript stricts
- Conformité RGPD avec bannière cookies
- UX : interface fluide et responsive avec dark/light mode

---

## Statut du projet

- Certaines fonctionnalités sont déjà dynamiques et connectées à Firebase (personas, backlog, sprints).
- D’autres modules sont encore en mode statique ou preview, en attente d’implémentation complète.
- Le projet évolue en continu avec des mises à jour régulières.

---

## Licence & Attribution

Distribué sous licence **MIT**.  
Merci de mentionner l’autrice : **Florence Martin**.  
Basé sur le projet **PO-UX-UI-DATA**.

---

👩‍💻 Projet conçu par **Florence Martin – Product Owner / UX-UI / Developer**
