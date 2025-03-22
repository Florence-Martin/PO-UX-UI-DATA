"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"
import { FileText, Users, UserCircle } from "lucide-react"
import { useState } from "react"

export function UserResearch() {
  const [activeTemplate, setActiveTemplate] = useState<string | null>(null)

  const templates = [
    {
      id: "questionnaire",
      title: "Questionnaire Utilisateur",
      icon: FileText,
      content: `# Questionnaire Utilisateur

1. Quel est votre usage principal de notre produit ?
2. Quelles fonctionnalités utilisez-vous le plus ?
3. Quels sont les points de friction principaux ?
4. Quelles améliorations souhaiteriez-vous voir ?
5. Comment évaluez-vous la facilité d'utilisation ?`
    },
    {
      id: "interview",
      title: "Guide d'Interview Stakeholder",
      icon: Users,
      content: `# Guide d'Interview Stakeholder

1. Objectifs business :
   - Quels sont vos objectifs principaux ?
   - Comment mesurez-vous le succès ?

2. Contraintes :
   - Quelles sont les contraintes techniques ?
   - Quelles sont les contraintes business ?

3. Timeline :
   - Quel est le planning idéal ?
   - Quelles sont les deadlines critiques ?`
    },
    {
      id: "persona",
      title: "Générateur de Personas",
      icon: UserCircle,
      content: `# Template de Persona

Nom : [Nom du persona]
Rôle : [Rôle professionnel]
Age : [Age]

Objectifs :
- [Objectif principal]
- [Objectif secondaire]

Points de friction :
- [Point de friction 1]
- [Point de friction 2]

Besoins principaux :
- [Besoin 1]
- [Besoin 2]`
    }
  ]

  return (
    <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
      <Card className="col-span-1">
        <CardHeader>
          <CardTitle>Templates</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {templates.map((template) => (
            <Button
              key={template.id}
              variant={activeTemplate === template.id ? "default" : "outline"}
              className="w-full justify-start"
              onClick={() => setActiveTemplate(template.id)}
            >
              <template.icon className="mr-2 h-4 w-4" />
              {template.title}
            </Button>
          ))}
        </CardContent>
      </Card>

      <Card className="col-span-2">
        <CardHeader>
          <CardTitle>
            {activeTemplate ? templates.find(t => t.id === activeTemplate)?.title : "Sélectionnez un template"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {activeTemplate ? (
            <div className="space-y-4">
              <ScrollArea className="h-[400px] w-full rounded-md border p-4">
                <Textarea
                  className="min-h-[350px] font-mono"
                  defaultValue={templates.find(t => t.id === activeTemplate)?.content}
                />
              </ScrollArea>
              <div className="flex justify-end space-x-2">
                <Button variant="outline">Réinitialiser</Button>
                <Button>Sauvegarder</Button>
              </div>
            </div>
          ) : (
            <div className="flex h-[400px] items-center justify-center text-muted-foreground">
              Sélectionnez un template pour commencer
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}