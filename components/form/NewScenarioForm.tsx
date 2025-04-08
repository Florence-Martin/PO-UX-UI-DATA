"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { createScenario } from "@/lib/services/scenarioService";

export function NewScenarioForm() {
  const [title, setTitle] = useState("");
  const [context, setContext] = useState("");

  const handleCreate = async () => {
    if (!title || !context) {
      toast({
        title: "Champs requis",
        description: "Le titre et le contexte sont obligatoires.",
        variant: "destructive",
      });
      return;
    }

    try {
      await createScenario({
        title,
        context,
        objective: "",
        expectedInsights: [""],
        associatedPersonaId: "",
        targetKPI: "",
        testedComponents: [""],
        painPointsObserved: [],
        notes: "",
      });

      toast({
        title: "Scénario créé",
        description: `Le scénario "${title}" a été ajouté 🎉`,
      });

      setTitle("");
      setContext("");
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de créer le scénario",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-2">
      <Input
        placeholder="Titre du scénario"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <Input
        placeholder="Contexte d’utilisation"
        value={context}
        onChange={(e) => setContext(e.target.value)}
      />
      <Button onClick={handleCreate}>Créer le Scénario</Button>
    </div>
  );
}
