# 🚀 Guide Rapide : Ajouter les KPIs PO dans Firebase

## 📋 Instructions

### Méthode 1 : Via Firebase Console (Recommandé)

1. **Va sur Firebase Console** : https://console.firebase.google.com
2. Sélectionne ton projet → **Firestore Database**
3. Clique sur la collection **`documented_kpis`**
4. Pour chaque KPI ci-dessous, clique sur **"+ Ajouter un document"**
5. Laisse Firebase générer l'**ID automatiquement**
6. Copie-colle les champs suivants :

---

## 📦 CATÉGORIE 1 : PRODUCT HEALTH (Santé Produit)

### KPI 1 - Taux d'Adoption Features
```
name: Taux d'Adoption des Nouvelles Fonctionnalités
definition: % d'utilisateurs actifs qui utilisent une nouvelle feature dans les 30 jours suivant sa sortie
source: Mixpanel / Amplitude
objective: > 40% dans le 1er mois
frequency: weekly
owner: Product Owner
category: product
createdAt: [Cliquer sur "timestamp" et laisser la valeur actuelle]
```

### KPI 2 - Time to Value
```
name: Time to Value (TTV)
definition: Temps moyen pour qu'un nouvel utilisateur obtienne sa première valeur du produit
source: Analytics Produit
objective: < 5 minutes
frequency: weekly
owner: Product Owner
category: product
createdAt: [timestamp actuel]
```

### KPI 3 - Feature Usage Rate
```
name: Feature Usage Rate
definition: Taux d'utilisation moyen des fonctionnalités principales du produit
source: Analytics Produit
objective: > 60% des utilisateurs actifs
frequency: weekly
owner: Product Owner
category: product
createdAt: [timestamp actuel]
```

### KPI 4 - NPS
```
name: Net Promoter Score (NPS)
definition: Probabilité qu'un utilisateur recommande le produit (échelle -100 à +100)
source: Enquêtes utilisateurs trimestrielles
objective: > 50 points
frequency: quarterly
owner: Product Owner
category: product
createdAt: [timestamp actuel]
```

---

## 🏃 CATÉGORIE 2 : DELIVERY PERFORMANCE (Performance Agile)

### KPI 5 - Vélocité Sprint
```
name: Vélocité de l'Équipe
definition: Nombre moyen de story points livrés par sprint sur les 3 derniers sprints
source: Jira / Azure DevOps
objective: Moyenne stable ±10%
frequency: daily
owner: Product Owner
category: agile
createdAt: [timestamp actuel]
```

### KPI 6 - Taux Complétion Sprint
```
name: Taux de Complétion des Sprints
definition: Pourcentage de User Stories terminées vs planifiées par sprint
source: Backlog Management Tool
objective: > 85%
frequency: weekly
owner: Product Owner
category: agile
createdAt: [timestamp actuel]
```

### KPI 7 - Lead Time
```
name: Lead Time (Idée → Production)
definition: Temps moyen entre l'idéation d'une feature et sa mise en production
source: Jira / Linear
objective: < 4 semaines
frequency: weekly
owner: Product Owner
category: agile
createdAt: [timestamp actuel]
```

### KPI 8 - Cycle Time
```
name: Cycle Time (Dev → Prod)
definition: Temps moyen entre le début du développement et la mise en production
source: CI/CD Pipeline
objective: < 5 jours
frequency: daily
owner: Engineering Lead
category: agile
createdAt: [timestamp actuel]
```

---

## 💰 CATÉGORIE 3 : BUSINESS IMPACT

### KPI 9 - Revenue per User
```
name: Revenue per User (RPU)
definition: Revenu moyen généré par utilisateur actif mensuel
source: CRM + Analytics
objective: Croissance +5% MoM
frequency: monthly
owner: Product Owner
category: business
createdAt: [timestamp actuel]
```

### KPI 10 - Taux de Conversion
```
name: Taux de Conversion Global
definition: Pourcentage de visiteurs qui deviennent des utilisateurs payants
source: Google Analytics + CRM
objective: 4.5% à fin Q2 2025
frequency: daily
owner: Product Owner
category: business
createdAt: [timestamp actuel]
```

### KPI 11 - CLV
```
name: Customer Lifetime Value (CLV)
definition: Valeur totale qu'un client génère sur toute sa durée de vie
source: CRM + Analytics
objective: € 500+ par client
frequency: monthly
owner: Product Owner
category: business
createdAt: [timestamp actuel]
```

### KPI 12 - Rétention
```
name: Taux de Rétention (D7 / D30)
definition: % d'utilisateurs qui reviennent après 7 et 30 jours
source: Analytics Produit
objective: D7 > 40%, D30 > 20%
frequency: weekly
owner: Product Owner
category: business
createdAt: [timestamp actuel]
```

---

## 👥 CATÉGORIE 4 : USER EXPERIENCE

### KPI 13 - SUS Score
```
name: System Usability Scale (SUS)
definition: Score de facilité d'utilisation du produit (échelle 0-100)
source: Tests utilisateurs + Questionnaires
objective: > 75 points (Good)
frequency: quarterly
owner: UX Lead
category: ux
createdAt: [timestamp actuel]
```

### KPI 14 - Taux de Rebond
```
name: Taux de Rebond
definition: Pourcentage d'utilisateurs qui quittent le site après une seule page
source: Google Analytics
objective: < 30%
frequency: daily
owner: UX Lead
category: ux
createdAt: [timestamp actuel]
```

### KPI 15 - Bug Escape Rate
```
name: Bug Escape Rate
definition: Nombre de bugs critiques découverts en production par release
source: Bug Tracking System (Jira/Linear)
objective: < 2 bugs critiques par release
frequency: weekly
owner: Product Owner
category: quality
createdAt: [timestamp actuel]
```

### KPI 16 - Support Tickets
```
name: Volume de Tickets Support
definition: Nombre de tickets support créés par 100 utilisateurs actifs
source: Zendesk / Intercom
objective: < 5 tickets / 100 users
frequency: weekly
owner: Product Owner
category: quality
createdAt: [timestamp actuel]
```

---

## 🚚 LIVRABLES BI (Collection: `deliverables`)

### Livrable 1
```
name: Dashboard Product Health
status: in_progress
dueDate: 2025-12-01
owner: Équipe BI
description: Dashboard Looker Studio regroupant NPS, Feature Adoption, TTV et Usage Rate
createdAt: [timestamp actuel]
```

### Livrable 2
```
name: Rapport Vélocité & Prédictibilité Sprint
status: completed
dueDate: 2025-11-15
owner: Scrum Master
description: Analyse de la vélocité sur 6 sprints + prédictibilité de livraison
createdAt: [timestamp actuel]
```

### Livrable 3
```
name: Cohort Retention Analysis Q4 2025
status: in_progress
dueDate: 2025-12-20
owner: Équipe Data
description: Analyse des cohortes utilisateurs D7/D30/D90 avec segmentation
createdAt: [timestamp actuel]
```

### Livrable 4
```
name: Revenue Attribution Model
status: pending
dueDate: 2026-01-10
owner: Équipe BI
description: Modèle d'attribution du revenu par feature/canal d'acquisition
createdAt: [timestamp actuel]
```

### Livrable 5
```
name: User Journey Mapping Dashboard
status: delayed
dueDate: 2025-11-10
owner: Équipe UX + BI
description: Visualisation des parcours utilisateurs avec points de friction
createdAt: [timestamp actuel]
```

### Livrable 6
```
name: A/B Testing Framework Setup
status: completed
dueDate: 2025-10-30
owner: Équipe Engineering
description: Infrastructure pour tests A/B avec tracking automatique des metrics
createdAt: [timestamp actuel]
```

---

## ✅ Après avoir ajouté les données

1. **Rafraîchis** `http://localhost:3000/metrics` (Cmd+Shift+R)
2. Tu devrais voir **16 KPIs** répartis en 4 catégories
3. Tu devrais voir **6 Livrables** avec différents statuts

---

## 🎨 Catégories disponibles

- `product` - Santé produit (📦 vert)
- `agile` - Performance de livraison (🏃 bleu)
- `business` - Impact business (💰 or)
- `ux` - Expérience utilisateur (👥 violet)
- `quality` - Qualité (🔧 rouge)

---

## 💡 Astuce : Import en masse

Si tu veux gagner du temps, tu peux aussi utiliser l'**import JSON** de Firebase :

1. Firebase Console → Firestore → ⋮ (menu)
2. **Import data**
3. Sélectionne un fichier JSON formaté correctement

Mais pour 16 KPIs, l'ajout manuel reste rapide (5-10 min max) ! 🚀
