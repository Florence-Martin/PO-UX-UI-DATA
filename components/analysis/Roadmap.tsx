"use client";

import { Card, CardContent } from "@/components/ui/card";
import {
  Brain,
  Check,
  FlagTriangleRight,
  RefreshCw,
  TowerControl,
  TrendingUp,
} from "lucide-react";

export default function Roadmap() {
  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold flex items-center gap-2">
        <FlagTriangleRight className="w-5 h-5" /> Roadmap du projet UX Data PO
        Kit
      </h3>
      <Card>
        <CardContent className="p-4 text-sm text-muted-foreground">
          Cette roadmap présente les jalons clés prévus pour le développement
          progressif de l’application UX Data PO Kit. Elle est susceptible
          d’évoluer en fonction des retours utilisateurs, des priorités produit
          et des besoins identifiés au fil de l’usage de l’outil lui-même.
        </CardContent>
      </Card>

      {/* Placeholder pour future timeline dynamique */}
      <Card>
        <CardContent className="p-4">
          <div className="text-xs mb-2">
            *Q = Quarter, soit un trimestre calendaire
          </div>
          <div className="space-y-6 text-sm">
            {/* Q1 2025 */}
            <div>
              <div className="flex items-center gap-2 font-medium">
                <Check className="w-4 h-4 text-green-500" />
                Q1 2025 (Janvier à Mars 2025) : Cadrage UX & Structuration des
                modèles utilisateurs
              </div>

              <blockquote className="border-l-2 border-muted-foreground pl-4 mt-2 text-sm text-muted-foreground italic">
                En tant que Product Owner, je souhaite poser des bases solides
                pour l’application en structurant les modèles d’analyse
                utilisateur, afin de garantir que les décisions UX soient
                fondées sur des personas et insights concrets dès le début du
                projet.
              </blockquote>
              <ul className="space-y-4 mt-2 text-sm text-muted-foreground">
                <li>
                  <div className="font-medium text-foreground">
                    Mise en place des fondations
                  </div>
                  <p className="italic text-muted-foreground text-xs ml-4">
                    Initialisation du projet avec l’architecture, stack,
                    Firebase et les premières pages fonctionnelles.
                  </p>
                </li>

                <li>
                  <div className="font-medium text-foreground">
                    Générateur de personas interactif
                  </div>
                  <p className="italic text-muted-foreground text-xs ml-4">
                    Création d’un outil UI permettant de générer, modifier et
                    sauvegarder plusieurs personas dans Firestore.
                  </p>
                </li>

                <li>
                  <div className="font-medium text-foreground">
                    Définition des champs des personas & analyse qualitative
                  </div>
                  <p className="italic text-muted-foreground text-xs ml-4">
                    Identification des informations clés à inclure dans un
                    persona (objectifs, besoins, frustrations, etc.).
                  </p>
                </li>

                <li>
                  <div className="font-medium text-foreground">
                    Templates UX : Questionnaire utilisateur, Interview
                    stakeholder
                  </div>
                  <p className="italic text-muted-foreground text-xs ml-4">
                    Mise à disposition de modèles d’analyse pour mener des
                    entretiens utilisateurs et collecter des insights.
                  </p>
                </li>

                <li>
                  <div className="font-medium text-foreground">
                    Structuration des modèles d’analyse utilisateur
                  </div>
                  <p className="italic text-muted-foreground text-xs ml-4">
                    Organisation des données utilisateurs de manière exploitable
                    pour guider la conception produit.
                  </p>
                </li>

                <li>
                  <div className="font-medium text-foreground">
                    Préparation des wireframes à venir (structure, hypothèses)
                  </div>
                  <p className="italic text-muted-foreground text-xs ml-4">
                    Anticipation des wireframes avec une grille, une
                    architecture d’écran et les hypothèses UX à tester.
                  </p>
                </li>
              </ul>
            </div>

            {/* Q2 2025 */}
            <div>
              <div className="flex items-center gap-2 font-medium">
                <RefreshCw className="w-4 h-4 text-blue-500" />
                Q2 2025 (Avril à Juin 2025) : Wireframes dynamiques + User
                Stories connectées
              </div>

              {/* Contexte utilisateur (user story) */}
              <blockquote className="border-l-2 border-muted-foreground pl-4 mt-2 text-sm text-muted-foreground italic">
                En tant que Product Owner (ou UX designer), je souhaite créer
                rapidement des wireframes exploitables et connecter chaque
                élément à des user stories structurées, afin de garder une
                cohérence entre les maquettes et les besoins utilisateurs.
              </blockquote>

              <ul className="space-y-4 mt-2 text-sm text-muted-foreground">
                <li>
                  <div className="font-medium text-foreground">
                    Grille de wireframes paramétrable
                  </div>
                  <p className="italic text-muted-foreground text-xs ml-4">
                    Permet de modéliser facilement les écrans en configurant
                    colonnes, lignes et disposition selon les besoins UX.
                  </p>
                </li>

                <li>
                  <div className="font-medium text-foreground">
                    Templates UX importables
                  </div>
                  <p className="italic text-muted-foreground text-xs ml-4">
                    Facilite l’import de maquettes ou modèles récurrents pour
                    accélérer la création de wireframes.
                  </p>
                </li>

                <li>
                  <div className="font-medium text-foreground">
                    Éditeur de User Stories structuré
                  </div>
                  <p className="italic text-muted-foreground text-xs ml-4">
                    Permet de formuler les user stories selon les standards
                    Agile (rôle, action, bénéfice).
                  </p>
                </li>

                <li>
                  <div className="font-medium text-foreground">
                    Éditeur UX complet
                  </div>
                  <p className="italic text-muted-foreground text-xs ml-4">
                    Intègre les priorités, story points, critères
                    d&#39;acceptation et catégorisation métier pour une gestion
                    complète des besoins.
                  </p>
                </li>
              </ul>
            </div>

            {/* Q3 2025 */}
            <div>
              <div className="flex items-center gap-2 font-medium">
                <TowerControl className="w-4 h-4 text-orange-500" />
                Q3 2025 (Juillet à Septembre 2025) : Backlog agile + Sprint
                planning
              </div>

              <blockquote className="border-l-2 border-muted-foreground pl-4 mt-2 text-sm text-muted-foreground italic">
                En tant que Product Owner, je souhaite organiser visuellement
                mon backlog et planifier mes sprints de manière itérative, afin
                d&#39;assurer une exécution agile alignée avec les besoins
                métier priorisés.
              </blockquote>

              <ul className="space-y-4 mt-2 text-sm text-muted-foreground">
                <li>
                  <div className="font-medium text-foreground">
                    Backlog en tableau Kanban interactif
                  </div>
                  <p className="italic text-muted-foreground text-xs ml-4">
                    Permet d&#39;organiser les tâches par statut (à faire, en
                    cours, fait), avec drag and drop et persistance.
                  </p>
                </li>

                <li>
                  {" "}
                  <div className="font-medium text-foreground">
                    Liens entre User Stories et Tasks
                  </div>
                  <p className="italic text-muted-foreground text-xs ml-4">
                    Possibilité d’associer plusieurs tâches à une user story
                    pour garder la traçabilité métier.
                  </p>
                </li>

                <li>
                  <div className="font-medium text-foreground">
                    Sprint Timeline interactive (planning, exécution, review,
                    rétro)
                  </div>
                  <p className="italic text-muted-foreground text-xs ml-4">
                    Visualisation temporelle des différentes phases du sprint
                    avec les tâches associées.
                  </p>
                </li>

                <li>
                  <div className="font-medium text-foreground">
                    Priorisation MoSCoW et Sprint planning intégré
                  </div>

                  <p className="italic text-muted-foreground text-xs ml-4">
                    Aide à la priorisation par criticité
                    (Must/Should/Could/Won’t) et création de sprints planifiés.
                  </p>
                </li>
              </ul>
            </div>

            {/* Q4 2025 */}
            <div>
              <div className="flex items-center gap-2 font-medium">
                <TrendingUp className="w-4 h-4 text-yellow-500" />
                Q4 2025 (Octobre à Décembre 2025) : Dashboard dataviz UX + KPIs
              </div>

              <blockquote className="border-l-2 border-muted-foreground pl-4 mt-2 text-sm text-muted-foreground italic">
                En tant que Product Owner ou UX analyst, je souhaite visualiser
                l’évolution des indicateurs clés pour piloter l’expérience
                utilisateur, identifier les points de friction et mesurer
                l’impact des livrables.
              </blockquote>

              <ul className="space-y-4 mt-2 text-sm text-muted-foreground">
                <li>
                  <div className="font-medium text-foreground">
                    Documentation des KPIs
                  </div>
                  <p className="italic text-muted-foreground text-xs ml-4">
                    Définition claire de chaque indicateur : source, fréquence,
                    objectif et équipe responsable.
                  </p>
                </li>

                <li>
                  <div className="font-medium text-foreground">
                    Vue dataviz des indicateurs : Taux de conversion, rebond,
                    scroll, engagement
                  </div>
                  <p className="italic text-muted-foreground text-xs ml-4">
                    Graphiques interactifs pour suivre les performances UX mois
                    par mois.
                  </p>
                </li>

                <li>
                  <div className="font-medium text-foreground">
                    Analyse des devices (Mobile, Tablet, Desktop)
                  </div>
                  <p className="italic text-muted-foreground text-xs ml-4">
                    Répartition des utilisateurs par device pour mieux adapter
                    les maquettes et tests.
                  </p>
                </li>

                <li>
                  <div className="font-medium text-foreground">
                    Intégration de tests A/B et suivi des résultats UX
                  </div>
                  <p className="italic text-muted-foreground text-xs ml-4">
                    Mise en place d’expérimentations UX (A/B tests) pour valider
                    des variantes de design ou wording.
                  </p>
                </li>

                <li>
                  <div className="font-medium text-foreground">
                    Analyse comportementale via heatmaps
                  </div>
                  <p className="italic text-muted-foreground text-xs ml-4">
                    Utilisation de heatmaps pour détecter les zones d’attention
                    et comportements utilisateurs sur les interfaces.
                  </p>
                </li>

                <li>
                  <div className="font-medium text-foreground">
                    Suivi des livrables : échéances, statuts (terminé, en
                    retard, en cours)
                  </div>
                  <p className="italic text-muted-foreground text-xs ml-4">
                    Visualisation des livrables attendus avec leur statut pour
                    assurer un bon suivi projet.
                  </p>
                </li>

                <li>
                  <div className="font-medium text-foreground">
                    Explorateur de données : API utilisateur / Événements /
                    Exports
                  </div>
                  <p className="italic text-muted-foreground text-xs ml-4">
                    Accès aux données brutes issues de l’API pour vérification,
                    analyse ou export CSV.
                  </p>
                </li>

                <li>
                  <div className="font-medium text-foreground">
                    Connexion à des outils BI externes (ex: Power BI)
                  </div>
                  <p className="italic text-muted-foreground text-xs ml-4">
                    Intégration avec des outils de dataviz externes pour
                    enrichir les tableaux de bord avec des KPIs métiers.
                  </p>
                </li>
              </ul>
            </div>

            {/* Q1 2026 */}
            <div>
              <div className="flex items-center gap-2 font-medium">
                <Brain className="w-4 h-4 text-purple-500" />
                Q1 2026 (Janvier à Mars 2026) : Intégration IA & recommandations
                automatiques
              </div>

              <blockquote className="border-l-2 border-muted-foreground pl-4 mt-2 text-sm text-muted-foreground italic">
                En tant que Product Owner, je souhaite automatiser les tâches de
                recherche utilisateur et de préparation produit grâce à l’IA,
                afin de gagner en rapidité, précision et cohérence dans la prise
                de décision.
              </blockquote>

              <ul className="space-y-4 mt-2 text-sm text-muted-foreground">
                <li>
                  <div className="font-medium text-foreground">
                    Génération automatique de personas et user stories
                  </div>
                  <p className="italic text-muted-foreground text-xs ml-4">
                    Création assistée de profils utilisateur et de récits métier
                    via prompts IA personnalisables.
                  </p>
                </li>

                <li>
                  <div className="font-medium text-foreground">
                    Suggestions IA pour l’optimisation UX / conversion
                  </div>
                  <p className="italic text-muted-foreground text-xs ml-4">
                    Recommandations sur les éléments de design, wording ou
                    parcours à tester ou ajuster.
                  </p>
                </li>

                <li>
                  {" "}
                  <div className="font-medium text-foreground">
                    Générateur de KPIs & dashboard personnalisé
                  </div>
                  <p className="italic text-muted-foreground text-xs ml-4">
                    Proposition automatique d’indicateurs adaptés au projet et
                    visualisation des objectifs.
                  </p>
                </li>

                <li>
                  {" "}
                  <div className="font-medium text-foreground">
                    Préparation automatique des sprints suivants
                  </div>
                  <p className="italic text-muted-foreground text-xs ml-4">
                    Génération de backlogs pré-remplis selon les insights,
                    personas, KPIs et stories validés.
                  </p>
                </li>

                <li>
                  <div className="font-medium text-foreground">
                    Simulation de tests utilisateurs & scoring de livrables
                  </div>
                  <p className="italic text-muted-foreground text-xs ml-4">
                    Évaluation prédictive des livrables via scoring IA basé sur
                    les attentes utilisateurs.
                  </p>
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
