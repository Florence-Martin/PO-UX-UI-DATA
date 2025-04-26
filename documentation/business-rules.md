Ce document constitue la référence fonctionnelle des règles métier de l’application, dans un contexte de gestion produit orienté UX/UI/Data avec méthodologie Scrum.

⸻

### 0. Dashboard UX/Data

- **RG0.1** – Le dashboard affiche la progression globale par section : Analyse des besoins, Wireframes, User Stories, Backlog, Livrables.
- **RG0.2** – Chaque indicateur de progression est calculé à partir des éléments renseignés dans l’application (ex : nombre de user stories créées, taux de complétion des checklists).
- **RG0.3** – Les métriques affichées incluent les taux clés : taux de conversion, taux de rebond, taux de scroll, taux d’engagement. Ces données sont synchronisées avec les KPIs renseignés dans la documentation.
- **RG0.4** – Un tableau d’activité récente affiche les dernières actions effectuées sur les pages (type, statut, date).
- **RG0.5** – Les graphes sont mis à jour dynamiquement pour refléter les tendances mensuelles sur les KPIs suivis.
- **RG0.6** – L’interface est responsive, accessible et utilisable en dark mode.

  ⸻

### 1. Roadmap Produit

- **RG1.1** – La roadmap est structurée par trimestres : Q1, Q2, Q3, Q4.
- **RG1.2** – Chaque trimestre contient des objectifs/livrables, chacun ayant un statut : à venir, en cours, livré.
- **RG1.3** – Les objectifs peuvent être liés à des User Stories ou des tâches du backlog.
- **❌ RG1.4** – Un trimestre ne peut pas être supprimé (historisation obligatoire).
- **RG1.5** – La modification d’un objectif est historisée avec date de mise à jour.

⸻

### 2. User Research & Personas

- **RG2.1** – Un persona doit inclure obligatoirement : un nom, une entreprise (ou type d’utilisateur), des objectifs, des besoins, des points de friction (pains) et des canaux de communication.
- **RG2.2** – Chaque persona est associé à un id unique généré automatiquement.
- **RG2.3** – Un persona peut être créé, édité ou supprimé à partir de l’interface utilisateur.
- **❌ RG2.4** – Deux personas ne peuvent avoir à la fois le même nom et la même entreprise.
- **RG2.5** – Les personas sont utilisés pour orienter l’analyse des besoins, prioriser les fonctionnalités et rédiger les user stories.

⸻

### 3. Éditeur – Modèles UX et User Stories

- **RG3.1** – L’éditeur de recherche utilisateur permet de remplir des modèles de type : questionnaire, interview, et persona.
- **RG3.2** – L’éditeur UX est pré-rempli avec des templates guidés pour chaque type de recherche (ex : modèle d’interview semi-directive).
- **RG3.3** – Les données saisies dans les éditeurs sont sauvegardées dynamiquement dans Firestore.
- **RG3.4** – L’éditeur de User Stories permet de créer, modifier et supprimer des US depuis une interface unique.
- **RG3.5** – Une User Story peut être pré-remplie automatiquement si elle est sélectionnée pour modification depuis une autre vue (ex : backlog).
- **RG3.6** – L’éditeur UX et celui des User Stories peuvent être utilisés en parallèle sans conflit.
- **RG3.7** - Les liens vers Jira et Confluence sont configurables dans l’interface.
- **RG3.8** - Le lien vers Figma configurable dans l’interface, avec une preview sous forme de grille configurable.

⸻

### 4. User Stories

- **RG4.1** – Une User Story respecte la structure : “En tant que [persona], je veux [fonctionnalité] afin de [bénéfice attendu]”.
- **RG4.2** – Chaque User Story contient obligatoirement : un code unique (US-003), un titre, une description, une priorité, une estimation (story points) et des critères d’acceptation.
- **RG4.3** – Une User Story peut être liée à plusieurs tâches techniques dans le backlog.
- **❌ RG4.4** – Une User Story ne peut être créée en double dans le backlog (unicité par code) (même tâche et même US).
- **RG4.5** – Chaque User Story est versionnée pour suivre les modifications dans le temps.

⸻

### 5. Backlog & Tâches

- **RG5.1** – Chaque tâche technique est obligatoirement rattachée à une User Story.
- **RG5.2** – Une tâche contient : un titre, une description technique, une priorité, un statut, des story points et des User Stories associées.
- **RG5.3** – Le statut d’une tâche est l’un des suivants : todo, in-progress, in-testing, done.
- **RG5.4** – Le drag-and-drop dans le Kanban met à jour le statut en temps réel dans Firestore.
- **RG5.5** – Une tâche ne peut pas exister sans User Story associée.
- **RG5.6** – Il est possible de filtrer, éditer ou supprimer les tâches depuis l’interface backlog.

⸻

### 6. Sprint & Suivi d’Avancement

- **RG6.1** – Le Sprint Timeline permet de visualiser chaque sprint sur une frise chronologique, avec les phases clés : préparation, exécution, revue, rétrospective.
- **RG6.2** – Le Sprint Board affiche les user stories en cours, regroupées par statut (à faire, en cours, en test, terminé).
- **RG6.3** – La vélocité affiche la capacité de l’équipe par sprint, calculée à partir des story points complétés.
- **RG6.4** – Il est possible de créer un nouveau sprint en sélectionnant des user stories depuis le backlog.
- **❌ RG6.5** – Une user story ne peut appartenir à plusieurs sprints simultanément.

⸻

### 7. KPIs & Suivi BI

- **RG7.1** – Chaque KPI est documenté avec : un titre, une description, une source, une fréquence, un objectif et un responsable.
- **RG7.2** – Il est possible de créer, modifier ou supprimer un KPI via l’interface.
- **RG7.3** – Un KPI est filtrable dynamiquement via une barre de recherche par mot-clé.
- **❌ RG7.4** – Deux KPIs ne peuvent pas avoir exactement le même titre et la même source.

⸻

### 8. Validation Produit & Qualité

#### 8.1 – Checklists de validation

- **RG8.1** – Chaque checklist est liée à une page ou une fonctionnalité spécifique (ex : Tunnel de Conversion, Page Produit).
- **RG8.2** – Une checklist contient une liste de critères UX/UI à cocher (responsive, performance, accessibilité…).
- **RG8.3** – Le taux de complétion (%) est calculé dynamiquement selon les critères cochés.
- **❌ RG8.4** – Une checklist ne peut pas contenir de critères en double.

#### 8.2 – Tests API

- **RG8.5** – Un test API contient : une méthode (GET, POST…), une URL d’endpoint, des headers, un body (facultatif) et une réponse attendue.
- **RG8.6** – Il est possible d’ajouter, modifier ou supprimer un test API depuis l’interface.
- **RG8.7** – L’utilisateur peut exécuter un test unique ou tous les tests d’un coup.
- **❌ RG8.8** – Une méthode ou une URL vide empêche l’enregistrement du test.
- **RG8.9** – L’état de chaque test (success, failed, pending) est affiché dynamiquement.

#### 8.3 – Outils externes

- **RG8.10** – Les liens vers JIRA et Postman sont configurables dans l’interface.
- **RG8.11** – Chaque outil contient une URL et une courte description visible par les utilisateurs.
- **❌ RG8.12** – Un lien sans URL valide ne peut pas être enregistré.

⸻

### 9. Glossaire

- **RG9.1** – Chaque terme du glossaire appartient à une catégorie (ex : Discovery, Delivery, Analyse, UX).
- **RG9.2** – Un terme contient obligatoirement : un titre, une définition claire, et une étiquette de catégorie.
- **RG9.3** – Le glossaire est filtrable dynamiquement via une barre de recherche.
- **❌ RG9.4** – Deux termes ne peuvent pas avoir le même titre (unicité obligatoire).

### 10. Processus Scrum

- **RG10.1** – Les étapes Scrum sont affichées de manière séquentielle et pédagogique (Backlog → Sprint → Daily → Review → Retrospective).
- **RG10.2** – Chaque étape contient une courte explication illustrée pour faciliter la compréhension du PO.
- **RG10.3** – Les étapes peuvent être enrichies ou modifiées par l’administrateur du kit.

### 11. PO Journey

- **RG11.1** – La journée type d’un Product Owner UX/UI est représentée sous forme de frise (timeline ou zigzag).
- **RG11.2** – Chaque étape de la journée contient : un titre, une icône, une période (matin/après-midi/soirée) et une intensité.
- **RG11.3** – L’intensité est exprimée visuellement via des emojis standardisés.
- **❌ RG11.4** – Aucune étape ne peut être ajoutée sans période ni intensité.

⸻

### 12. Sécurité & Authentification

- **RG12.1** – Seuls les utilisateurs authentifiés peuvent créer, éditer ou supprimer des données dans Firestore.
- **RG12.2** – Les données en lecture sont publiques pour consultation.
- **❌ RG12.3** – Un utilisateur non connecté ne peut pas modifier de document, y compris via requête API.
- **RG12.4** – Les opérations sensibles sont auditées et enregistrées (ex : suppression de persona, tâches, user stories).

⸻

Ce document est versionné et validé par le Product Owner. Il sert de socle pour la validation fonctionnelle et la conformité aux attentes métier.
