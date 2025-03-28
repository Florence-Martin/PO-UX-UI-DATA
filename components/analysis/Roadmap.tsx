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
import SprintTimeline from "../sprint/SprintTimeline";

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
                Q1 2025 (Janvier à Mars 2025) : Générateur de Personas
              </div>
              <ul className="list-disc list-inside pl-4 mt-2 text-muted-foreground space-y-1">
                <li>Mise en place des fondations</li>
                <li>Générateur de personas interactif</li>
                <li>Structuration des modèles d’analyse utilisateur</li>
              </ul>
            </div>

            {/* Q2 2025 */}
            <div>
              <div className="flex items-center gap-2 font-medium">
                <RefreshCw className="w-4 h-4 text-blue-500" />
                Q2 2025 (Avril à Juin 2025) : Wireframes dynamiques + User
                Stories connectées
              </div>
              <ul className="list-disc list-inside pl-4 mt-2 text-muted-foreground space-y-1">
                <li>Grille de wireframes paramétrable</li>
                <li>Templates UX importables</li>
                <li>Éditeur de User Stories structuré (Jira/Confluence)</li>
              </ul>
            </div>

            {/* Q3 2025 */}
            <div>
              <div className="flex items-center gap-2 font-medium">
                <TowerControl className="w-4 h-4 text-orange-500" />
                Q3 2025 (Juillet à Septembre 2025) : Backlog agile + Sprint
                planning
              </div>
              <ul className="list-disc list-inside pl-4 mt-2 text-muted-foreground space-y-1">
                <li>Backlog en tableau Kanban interactif</li>
                <li>Priorisation MoSCoW et Sprint planning intégré</li>
                <li>Liens entre User Stories et tâches techniques</li>
              </ul>
            </div>

            {/* Q4 2025 */}
            <div>
              <div className="flex items-center gap-2 font-medium">
                <TrendingUp className="w-4 h-4 text-yellow-500" />
                Q4 2025 (Octobre à Décembre 2025) : Dashboard dataviz UX + KPIs
              </div>
              <ul className="list-disc list-inside pl-4 mt-2 text-muted-foreground space-y-1">
                <li>Explorateur de données + documentation des KPIs</li>
                <li>Graphiques de scroll, rebond, conversion, engagement</li>
                <li>Suivi des livrables + statut + équipe responsable</li>
              </ul>
            </div>

            {/* Q1 2026 */}
            <div>
              <div className="flex items-center gap-2 font-medium">
                <Brain className="w-4 h-4 text-purple-500" />
                Q1 2026 (Janvier à Mars 2026) : Intégration IA & recommandations
                automatiques
              </div>
              <ul className="list-disc list-inside pl-4 mt-2 text-muted-foreground space-y-1">
                <li>Analyse automatique des métriques UX</li>
                <li>Suggestions d’optimisation (par page, par device)</li>
                <li>Préparation automatique des sprints suivants</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <SprintTimeline />
      </Card>
    </div>
  );
}
