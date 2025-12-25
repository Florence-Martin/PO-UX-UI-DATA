"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UserStoryQualityResponse } from "@/lib/ai/types";
import {
  AlertCircle,
  AlertTriangle,
  CheckCircle2,
  FileText,
  HelpCircle,
  Info,
} from "lucide-react";

interface UserStoryQualityPanelProps {
  analysis: UserStoryQualityResponse;
}

/**
 * Composant d'affichage de l'analyse de qualité d'une User Story
 */
export function UserStoryQualityPanel({
  analysis,
}: UserStoryQualityPanelProps) {
  const { scores, alerts, questionsForBusiness, gherkinSuggestions } = analysis;

  // Helper pour la couleur du score
  const getScoreColor = (score: number): string => {
    if (score >= 8) return "text-green-600 dark:text-green-400";
    if (score >= 6) return "text-yellow-600 dark:text-yellow-400";
    return "text-red-600 dark:text-red-400";
  };

  // Helper pour l'icône de severity
  const getSeverityIcon = (severity: "low" | "medium" | "high") => {
    switch (severity) {
      case "high":
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      case "medium":
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case "low":
        return <Info className="h-4 w-4 text-blue-500" />;
    }
  };

  return (
    <div className="space-y-4">
      {/* Scores */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5" />
            Scores de qualité
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-1">Clarté</p>
              <p
                className={`text-3xl font-bold ${getScoreColor(scores.clarity)}`}
              >
                {scores.clarity}
                <span className="text-sm text-muted-foreground">/10</span>
              </p>
            </div>
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-1">Testabilité</p>
              <p
                className={`text-3xl font-bold ${getScoreColor(scores.testability)}`}
              >
                {scores.testability}
                <span className="text-sm text-muted-foreground">/10</span>
              </p>
            </div>
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-1">Risque</p>
              <p
                className={`text-3xl font-bold ${getScoreColor(10 - scores.risk)}`}
              >
                {scores.risk}
                <span className="text-sm text-muted-foreground">/10</span>
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                (plus bas = mieux)
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Alertes */}
      {alerts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Alertes ({alerts.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {alerts.map((alert, index) => (
              <Alert
                key={index}
                variant={alert.severity === "high" ? "destructive" : "default"}
              >
                <div className="flex items-start gap-2">
                  {getSeverityIcon(alert.severity)}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge
                        variant={
                          alert.severity === "high"
                            ? "destructive"
                            : alert.severity === "medium"
                              ? "default"
                              : "secondary"
                        }
                      >
                        {alert.severity}
                      </Badge>
                    </div>
                    <AlertDescription>{alert.message}</AlertDescription>
                  </div>
                </div>
              </Alert>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Questions pour le métier */}
      {questionsForBusiness.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <HelpCircle className="h-5 w-5" />
              Questions à poser au métier
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {questionsForBusiness.map((question, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="text-muted-foreground mt-1">•</span>
                  <span className="flex-1">{question}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Suggestions Gherkin */}
      {gherkinSuggestions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Suggestions Gherkin
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {gherkinSuggestions.map((suggestion, index) => (
              <div
                key={index}
                className="border-l-4 border-blue-500 pl-4 space-y-1"
              >
                <p className="font-semibold text-sm text-blue-600 dark:text-blue-400">
                  {suggestion.scenario}
                </p>
                <div className="text-sm space-y-1 font-mono bg-muted p-2 rounded">
                  <p>
                    <span className="text-purple-600 dark:text-purple-400">
                      Given
                    </span>{" "}
                    {suggestion.given}
                  </p>
                  <p>
                    <span className="text-blue-600 dark:text-blue-400">
                      When
                    </span>{" "}
                    {suggestion.when}
                  </p>
                  <p>
                    <span className="text-green-600 dark:text-green-400">
                      Then
                    </span>{" "}
                    {suggestion.then}
                  </p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Guidelines INVEST (si présentes) */}
      {analysis.investGuidelines && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Guidelines INVEST</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-2 text-sm">
              {Object.entries(analysis.investGuidelines).map(([key, value]) => (
                <div key={key} className="flex items-center gap-2">
                  {value ? (
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                  ) : (
                    <AlertCircle className="h-4 w-4 text-red-500" />
                  )}
                  <span className="capitalize">{key}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
