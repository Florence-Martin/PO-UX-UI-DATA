"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { SidebarTemplates } from "@/components/analysis/SidebarTemplates";
import { useUserResearch } from "@/hooks/useUserResearch";
import { FileText, Users, UserCircle } from "lucide-react";

const templatesMeta = [
  { id: "questionnaire", title: "Questionnaire Utilisateur", icon: FileText },
  { id: "interview", title: "Guide d'Interview Stakeholder", icon: Users },
  { id: "persona", title: "Champs des Personas", icon: UserCircle },
];

export function UserResearch() {
  const {
    activeTemplate,
    title,
    content,
    setContent,
    handleSave,
    handleReset,
    handleCreatePersona,
    handleDeletePersona,
    loadTemplate,
    personas,
    handleSelectPersona,
  } = useUserResearch();

  return (
    <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
      <Card className="col-span-1">
        <CardHeader>
          <CardTitle>Templates</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <SidebarTemplates
            templates={templatesMeta}
            activeTemplate={activeTemplate}
            onTemplateClick={loadTemplate}
            onCreatePersona={handleCreatePersona}
            personas={personas}
            onSelectPersona={handleSelectPersona}
            onDeletePersona={handleDeletePersona}
          />
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
