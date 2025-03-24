"use client";

import { useEffect, useState } from "react";
import { toast } from "@/hooks/use-toast";
import {
  createPersona,
  deletePersona,
  getAllPersonas,
  getPersona,
  savePersona,
  Persona,
} from "@/lib/services/personaService";
import { getTemplate, saveTemplate } from "@/lib/services/templateService";
import { parsePersona, formatPersona } from "@/hooks/usePersonaLogic";

const TEMPLATE_IDS = ["questionnaire", "interview", "persona"];

export function useUserResearch() {
  const [activeTemplate, setActiveTemplate] = useState<string | null>(null);
  const [content, setContent] = useState<string>("");
  const [title, setTitle] = useState<string>("");
  const [personas, setPersonas] = useState<Persona[]>([]);

  useEffect(() => {
    getAllPersonas().then(setPersonas);
  }, []);

  const loadTemplate = async (id: string) => {
    const data = await getTemplate(id);
    if (!data) {
      toast({
        title: "Erreur",
        description: `Aucun template trouvé pour : ${id}`,
        variant: "destructive",
      });
      return;
    }
    setActiveTemplate(id);
    setTitle(data.title);
    setContent(data.content.replace(/\\n/g, "\n"));
  };

  const handleSave = async () => {
    if (!activeTemplate) return;

    // Sauvegarde d’un template
    if (TEMPLATE_IDS.includes(activeTemplate)) {
      await saveTemplate(activeTemplate, { title, content });
      toast({ title: "Succès ✅", description: "Template sauvegardé 🔥" });
      return;
    }

    // Sauvegarde d’un persona
    try {
      const parsed = parsePersona(content);
      const existingPersona = personas.find((p) => p.id === activeTemplate);

      if (existingPersona) {
        await savePersona(activeTemplate, parsed);
        toast({ title: "Succès ✅", description: "Persona mis à jour 🔥" });
      } else {
        const newId = await createPersona(parsed);
        setActiveTemplate(newId);
        toast({ title: "Succès ✅", description: "Nouveau persona créé 🔥" });
      }

      setPersonas(await getAllPersonas());
    } catch (error) {
      console.error("Erreur lors de la sauvegarde :", error);
      toast({
        title: "Erreur",
        description: "Échec de la sauvegarde du persona",
        variant: "destructive",
      });
    }
  };

  const handleReset = async () => {
    if (!activeTemplate) return;

    if (TEMPLATE_IDS.includes(activeTemplate)) {
      await loadTemplate(activeTemplate);
      toast({ title: "Réinitialisé", description: "Template restauré 🔄" });
    } else {
      const data = await getPersona(activeTemplate);
      if (data) {
        setTitle(data.name);
        setContent(formatPersona(data));
        toast({ title: "Réinitialisé", description: "Persona restauré 🔄" });
      }
    }
  };

  const handleCreatePersona = async () => {
    const defaultPersona = {
      name: "Nouveau Persona",
      role: "",
      company: "",
      goals: "",
      pains: "",
      needs: "",
      channels: "",
    };

    const id = await createPersona(defaultPersona);
    const updated = await getAllPersonas();
    setPersonas(updated);

    const newPersona = updated.find((p) => p.id === id);
    if (newPersona) {
      setActiveTemplate(id);
      setTitle(newPersona.name);
      setContent(formatPersona(newPersona));
    }
  };

  const handleDeletePersona = async (id: string, name: string) => {
    await deletePersona(id);
    toast({ title: "Supprimé", description: `${name} a été supprimé.` });
    setPersonas(await getAllPersonas());

    if (activeTemplate === id) {
      setActiveTemplate(null);
      setTitle("");
      setContent("");
    }
  };

  const handleSelectPersona = async (id: string) => {
    const data = await getPersona(id);
    if (data) {
      setActiveTemplate(data.id);
      setTitle(data.name);
      setContent(formatPersona(data));
    }
  };

  return {
    activeTemplate,
    content,
    title,
    personas,
    setContent,
    setTitle,
    handleSave,
    handleReset,
    handleCreatePersona,
    handleDeletePersona,
    loadTemplate,
    setActiveTemplate,
    handleSelectPersona,
  };
}
