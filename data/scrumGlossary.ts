import type { GlossaryPhases } from "@/lib/glossaryPhases";

export type GlossaryItem = {
  term: string;
  definition: string;
  phase: GlossaryPhases;
};

export const glossary: GlossaryItem[] = [
  {
    term: "UX Research",
    definition:
      "Ensemble de méthodes utilisées pour comprendre les comportements, les besoins et les motivations des utilisateurs afin de guider les décisions produit.",
    phase: "Discovery",
  },
  {
    term: "Personas",
    definition:
      "Profils fictifs représentant les types d'utilisateurs cibles, créés à partir de données réelles pour guider le développement produit.",
    phase: "Discovery",
  },
  {
    term: "Product Discovery",
    definition:
      "Phase amont de la conception produit permettant d’identifier les besoins utilisateurs, les opportunités business et les solutions à explorer.",
    phase: "Discovery",
  },
  {
    term: "Product-Market Fit",
    definition:
      "Alignement entre le produit développé et les attentes réelles du marché, souvent mesuré par la satisfaction et la rétention des utilisateurs.",
    phase: "Discovery",
  },
  {
    term: "OKR (Objectives & Key Results)",
    definition:
      "Cadre de définition d’objectifs clairs et mesurables pour aligner les équipes sur des résultats concrets et ambitieux.",
    phase: "Discovery",
  },
  {
    term: "KPI (Key Performance Indicator)",
    definition:
      "Indicateur chiffré permettant de mesurer la performance du produit ou l’avancement des objectifs.",
    phase: "Discovery",
  },
  {
    term: "Heatmap",
    definition:
      "Outil de visualisation du comportement utilisateur (clics, scrolls, mouvements) pour identifier les zones d’intérêt et les points de friction sur une interface.",
    phase: "Discovery",
  },
  {
    term: "Roadmap",
    definition:
      "Vision macro. Vue d'ensemble des grands jalons et objectifs produits sur une période donnée (trimestres, semestres…).",
    phase: "Vision Produit",
  },
  {
    term: "MVP",
    definition:
      "Produit Minimum Viable : version initiale d’un produit avec juste assez de fonctionnalités pour satisfaire les premiers utilisateurs et recueillir des feedbacks.",
    phase: "Vision Produit",
  },
  {
    term: "Lean",
    definition:
      "Méthodologie visant à maximiser la valeur tout en minimisant le gaspillage, souvent associée à l'approche Agile.",
    phase: "Vision Produit",
  },
  {
    term: "Epic",
    definition:
      "Grande fonctionnalité regroupant plusieurs User Stories liées à un même objectif produit.",
    phase: "Vision Produit",
  },
  {
    term: "Design System",
    definition:
      "Bibliothèque de composants UI réutilisables accompagnée de règles et de bonnes pratiques assurant la cohérence visuelle et fonctionnelle du produit.",
    phase: "Design & Cadrage",
  },
  {
    term: "User Story",
    definition:
      "Fonctionnalité décrite du point de vue de l'utilisateur final, souvent sous forme : 'En tant que... je veux... afin de...'.",
    phase: "Design & Cadrage",
  },
  {
    term: "Acceptance Criteria",
    definition:
      "Conditions précises à remplir pour qu'une User Story soit considérée comme terminée. Ils définissent les attentes fonctionnelles et non fonctionnelles.",
    phase: "Design & Cadrage",
  },
  {
    term: "Prioritization (MoSCoW)",
    definition:
      "Méthode de priorisation : Must have / Should have / Could have / Won't have",
    phase: "Design & Cadrage",
  },
  {
    term: "Backlog Grooming",
    definition:
      "Processus d'affinage et de priorisation du Product Backlog, souvent réalisé en continu.",
    phase: "Design & Cadrage",
  },
  {
    term: "Product Backlog",
    definition:
      "Liste ordonnée de toutes les fonctionnalités, améliorations, corrections ou idées pouvant être intégrées au produit. Gérée et priorisée par le Product Owner.",
    phase: "Design & Cadrage",
  },
  {
    term: "Definition of Done (DoD)",
    definition:
      "Ensemble clair de critères que chaque User Story ou fonctionnalité doit remplir pour être considérée comme terminée et prête à être livrée. Cela inclut souvent des tests, la documentation, la validation par le Product Owner, et d'autres exigences spécifiques à l'équipe ou au projet.",
    phase: "Design & Cadrage",
  },
  {
    term: "Story Points",
    definition:
      "Unité d'estimation relative de l'effort requis pour développer une User Story.",
    phase: "Planification & Estimation",
  },
  {
    term: "Capacity",
    definition:
      "Charge de travail que l'équipe peut absorber sur un sprint, en fonction de ses disponibilités.",
    phase: "Planification & Estimation",
  },
  {
    term: "Velocity",
    definition:
      "Nombre moyen de Story Points livrés par l’équipe à chaque sprint (vitesse de livraison).",
    phase: "Planification & Estimation",
  },
  {
    term: "Timeline",
    definition:
      "Représentation visuelle et chronologique des jalons, tâches ou releases prévues dans le projet.",
    phase: "Planification & Estimation",
  },
  {
    term: "Spike",
    definition:
      "Tâche exploratoire visant à rechercher, analyser ou tester une solution technique avant de s'engager sur un développement.",
    phase: "Planification & Estimation",
  },
  {
    term: "Refinement",
    definition:
      "Moment où l’équipe discute, découpe, clarifie et estime les User Stories en préparation d’un sprint futur.",
    phase: "Planification & Estimation",
  },
  {
    term: "Sprint Planning",
    definition:
      "Cérémonie Scrum où l'équipe définit les User Stories à réaliser durant le sprint en fonction de la priorité et de la capacité.",
    phase: "Planification & Estimation",
  },
  {
    term: "Sprint Board",
    definition:
      "Tableau Kanban utilisé pour visualiser l’état des tâches pendant un sprint (To Do / In Progress / In Test / Done).",
    phase: "Exécution Agile (Scrum/Kanban)",
  },
  {
    term: "Kanban",
    definition:
      "Méthode de gestion visuelle du travail, permettant de suivre l'avancement des tâches et d'optimiser le flux de travail.",
    phase: "Exécution Agile (Scrum/Kanban)",
  },
  {
    term: "Daily Scrum (Stand-up)",
    definition:
      "Réunion quotidienne de l’équipe pour synchroniser les efforts, lever les blocages et adapter le plan de travail.",
    phase: "Exécution Agile (Scrum/Kanban)",
  },
  {
    term: "Increment",
    definition:
      "Version fonctionnelle et potentiellement livrable du produit à la fin d’un sprint.",
    phase: "Exécution Agile (Scrum/Kanban)",
  },
  {
    term: "Iterative",
    definition:
      "Approche de développement basée sur des cycles courts et répétés (sprints), permettant des ajustements réguliers.",
    phase: "Exécution Agile (Scrum/Kanban)",
  },
  {
    term: "Sprint Review",
    definition:
      "Réunion de fin de sprint où l’équipe présente le travail terminé aux parties prenantes pour obtenir du feedback.",
    phase: "Suivi, validation & amélioration continue",
  },
  {
    term: "Sprint Retrospective",
    definition:
      "Réunion permettant à l’équipe d’identifier ce qui a bien fonctionné, ce qui peut être amélioré, et de définir des actions concrètes pour le sprint suivant.",
    phase: "Suivi, validation & amélioration continue",
  },
  {
    term: "Burndown & Burn-up Charts",
    definition:
      "Graphiques représentant le travail restant (burndown) ou accompli (burn-up) au fil du temps.",
    phase: "Suivi, validation & amélioration continue",
  },
  {
    term: "Feature Flag (Toggle)",
    definition:
      "Mécanisme permettant d’activer ou désactiver des fonctionnalités dans un produit sans redéploiement.",
    phase: "Suivi, validation & amélioration continue",
  },
  {
    term: "Release",
    definition:
      "Livraison d'une ou plusieurs fonctionnalités en production, prête(s) à être utilisée(s) par les utilisateurs finaux.",
    phase: "Suivi, validation & amélioration continue",
  },
  {
    term: "CI/CD (Continuous Integration / Continuous Deployment)",
    definition:
      "Pratiques DevOps permettant d’intégrer et de déployer le code de manière fréquente, fiable et automatisée.",
    phase: "Suivi, validation & amélioration continue",
  },
  {
    term: "Technical Debt",
    definition:
      "Compromis techniques à court terme qui peuvent ralentir le développement futur ou créer des problèmes de maintenance si non traités.",
    phase: "Suivi, validation & amélioration continue",
  },
  {
    term: "Tests A/B",
    definition:
      "Méthode d'expérimentation permettant de comparer deux versions d’un élément (page, bouton, fonctionnalité…) auprès d’utilisateurs pour identifier celle qui génère les meilleures performances (taux de clic, conversion…).",
    phase: "Suivi, validation & amélioration continue",
  },
  {
    term: "Product Owner",
    definition:
      "Responsable de la vision produit et de la gestion du Product Backlog, garantissant la valeur business. Il est l’interface entre l’équipe et les parties prenantes, tout en gardant l'alignement entre les besoins utilisateurs, l'objectif business et les contraintes techniques.",
    phase: "Rôles clés",
  },
  {
    term: "Scrum Master",
    definition:
      "Facilitateur du cadre Scrum, veille à la bonne application des principes et au bon fonctionnement de l’équipe.",
    phase: "Rôles clés",
  },
  {
    term: "Tech lead",
    definition:
      "Référent technique de l'équipe de développement, garant des choix d’architecture et des bonnes pratiques.",
    phase: "Rôles clés",
  },
  {
    term: "agent",
    definition:
      "Un composant ou programme qui agit en tant qu’intermédiaire ou représentant pour accomplir une tâche spécifique.",
    phase: "Vision Produit",
  },
  {
    term: "rag",
    definition:
      "Dans le contexte de l’IA, RAG (Retrieve and Generate) désigne une approche combinant la récupération d’informations pertinentes dans une base de données (Retrieve) avec la génération de réponses textuelles à l’aide d’un modèle de langage (Generate).",
    phase: "Exécution Agile (Scrum/Kanban)",
  },
  {
    term: "orchestration",
    definition:
      "La coordination et la gestion de plusieurs processus ou services pour qu’ils fonctionnent ensemble de manière harmonieuse, souvent dans des environnements complexes.",
    phase: "Planification & Estimation",
  },
  {
    term: "llm vecteur",
    definition:
      "Un vecteur généré par un modèle de langage de grande taille (Large Language Model), utilisé pour représenter des mots, des phrases ou des documents dans un espace numérique afin de faciliter des comparaisons ou des recherches.",
    phase: "Discovery",
  },
  {
    term: "discovery design",
    definition:
      "Une phase initiale dans le développement de produits ou services où l’objectif est de comprendre les besoins des utilisateurs, d’identifier les opportunités et de définir les priorités avant de passer à la conception détaillée.",
    phase: "Discovery",
  },
  {
    term: "design thinking",
    definition:
      "Une approche centrée sur l’humain pour résoudre des problèmes en encourageant la créativité, l’expérimentation, et une compréhension approfondie des besoins des utilisateurs à travers des étapes comme l’empathie, la définition, l’idéation, le prototypage, et le test.",
    phase: "Design & Cadrage",
  },
  {
    term: "shurn",
    definition:
      "Ce terme est peu courant et pourrait être une variante ou une erreur typographique d’un mot tel que ‘churn’ ou ‘turn’. Si vous faisiez référence à ‘churn’, il désigne souvent le taux de perte de clients ou d’utilisateurs dans un service ou une plateforme.",
    phase: "Suivi, validation & amélioration continue",
  },
  {
    term: "verbatim",
    definition:
      "Le mot à mot ou la transcription exacte des propos ou contenus exprimés, souvent utilisé dans le contexte d’entretiens ou d’enquêtes pour représenter fidèlement les réponses ou commentaires des participants.",
    phase: "Discovery",
  },
  {
    term: "interview",
    definition:
      "Une méthode de collecte d’informations ou d’opinions impliquant une interaction directe entre un interviewer et un interviewé.",
    phase: "Discovery",
  },
  {
    term: "feedback",
    definition:
      "Les commentaires, observations ou informations donnés en retour par un utilisateur, un client ou un pair afin d’évaluer, améliorer ou ajuster un produit, un service ou une performance.",
    phase: "Suivi, validation & amélioration continue",
  },
];
