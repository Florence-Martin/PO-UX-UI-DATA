"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FileText, Users, UserCircle } from "lucide-react";
import { getTemplate, saveTemplate } from "@/lib/templateService";
import { toast } from "@/hooks/use-toast";

// Définition des templates disponibles dans l'interface utilisateur
const templatesMeta = [
  { id: "questionnaire", title: "Questionnaire Utilisateur", icon: FileText },
  { id: "interview", title: "Guide d'Interview Stakeholder", icon: Users },
  { id: "persona", title: "Générateur de Personas", icon: UserCircle },
];

export function UserResearch() {
  const [activeTemplate, setActiveTemplate] = useState<string | null>(null);
  const [content, setContent] = useState<string>("");
  const [title, setTitle] = useState<string>("");
  const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
    questionnaire: FileText,
    interview: Users,
    persona: UserCircle,
  };

  // Charger le template depuis Firestore en fonction de l'ID
  const loadTemplate = async (id: string) => {
    try {
      const data = await getTemplate(id);
      if (data) {
        setActiveTemplate(id);
        setContent(data.content.replace(/\\n/g, "\n"));
        setTitle(data.title);
      } else {
        toast({
          title: "Erreur",
          description: `Aucun template trouvé pour : ${id}`,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Erreur lors du chargement",
        description: "Impossible de charger le template depuis Firestore.",
        variant: "destructive",
      });
    }
  };

  // Sauvegarder le template dans Firebase
  const handleSave = async () => {
    if (!activeTemplate) return;

    try {
      await saveTemplate(activeTemplate, { title, content });
      toast({
        title: "Succès ✅",
        description: "Le template a été sauvegardé dans Firebase 🔥",
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "La sauvegarde a échoué. Veuillez réessayer.",
        variant: "destructive",
      });
    }
  };

  // Réinitialiser le contenu du template
  const handleReset = async () => {
    if (activeTemplate) {
      try {
        await loadTemplate(activeTemplate);
        toast({
          title: "Succès ✅",
          description: "Les modifications ont été annulées 🔥",
        });
      } catch (error) {
        toast({
          title: "Erreur",
          description: "La sauvegarde a échoué. Veuillez réessayer.",
          variant: "destructive",
        });
      }
    }
  };

  return (
    <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
      <Card className="col-span-1">
        <CardHeader>
          <CardTitle>Templates</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {templatesMeta.map((template) => {
            const Icon = iconMap[template.id];
            return (
              <Button
                key={template.id}
                variant={activeTemplate === template.id ? "default" : "outline"}
                className="w-full justify-start"
                onClick={() => loadTemplate(template.id)}
              >
                <Icon className="mr-2 h-4 w-4" />
                {template.title}
              </Button>
            );
          })}
        </CardContent>
      </Card>

      <Card className="col-span-2">
        <CardHeader>
          <CardTitle>
            {activeTemplate ? title : "Sélectionnez un template"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {activeTemplate ? (
            <div className="space-y-4">
              <ScrollArea className="h-[400px] w-full rounded-md border p-4">
                <Textarea
                  className="min-h-[350px] font-mono"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                />
              </ScrollArea>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={handleReset}>
                  Annuler les modifications
                </Button>
                <Button onClick={handleSave}>Sauvegarder</Button>
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
  );
}
