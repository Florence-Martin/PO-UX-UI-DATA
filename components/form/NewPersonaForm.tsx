"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { savePersona } from "@/lib/services/personaService";
import { toast } from "@/hooks/use-toast";

export function NewPersonaForm() {
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");

  const handleCreate = async () => {
    if (!name || !company) {
      toast({
        title: "Champs requis",
        description: "Le nom et l'entreprise sont obligatoires.",
        variant: "destructive",
      });
      return;
    }

    const id = name.toLowerCase().replace(/\s+/g, "_"); // ex: jean_dupont

    try {
      await savePersona(id, {
        name,
        role: "",
        company,
        goals: "",
        pains: "",
        needs: "",
        channels: "",
      });

      toast({
        title: "Nouveau persona",
        description: `"${name}" a été créé avec succès 🎉`,
      });

      setName("");
      setCompany("");
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de créer le persona",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-2">
      <Input
        placeholder="Nom du persona"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <Input
        placeholder="Entreprise ou secteur"
        value={company}
        onChange={(e) => setCompany(e.target.value)}
      />
      <Button onClick={handleCreate}>Créer le Persona</Button>
    </div>
  );
}
