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
import {
  createScenario,
  deleteScenario,
  getAllScenarios,
  getScenario,
  saveScenario,
  Scenario,
} from "@/lib/services/scenarioService";
import { getTemplate, saveTemplate } from "@/lib/services/templateService";
import { parsePersona, formatPersona } from "@/hooks/usePersonaLogic";
import { parseScenario, formatScenario } from "@/hooks/useScenarioLogic";

const TEMPLATE_IDS = ["questionnaire", "interview", "persona", "scenario"];

export function useUserResearch() {
  const [activeTemplate, setActiveTemplate] = useState<string | null>(null);
  const [content, setContent] = useState<string>("");
  const [title, setTitle] = useState<string>("");
  const [personas, setPersonas] = useState<Persona[]>([]);
  const [scenarios, setScenarios] = useState<Scenario[]>([]);

  useEffect(() => {
    getAllPersonas().then(setPersonas);
    getAllScenarios().then(setScenarios);
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

    if (TEMPLATE_IDS.includes(activeTemplate)) {
      await saveTemplate(activeTemplate, { title, content });
      toast({ title: "Succès ✅", description: "Template sauvegardé 🔥" });
      return;
    }

    const persona = personas.find((p) => p.id === activeTemplate);
    if (persona) {
      try {
        const parsed = parsePersona(content);
        await savePersona(activeTemplate, parsed);
        toast({ title: "Succès ✅", description: "Persona mis à jour 🔥" });
        setPersonas(await getAllPersonas());
        return;
      } catch (error) {
        console.error("Erreur lors de la sauvegarde du persona:", error);
        toast({
          title: "Erreur",
          description: "Échec de la sauvegarde du persona",
          variant: "destructive",
        });
        return;
      }
    }

    const scenario = scenarios.find((s) => s.id === activeTemplate);
    if (scenario) {
      try {
        const parsed = parseScenario(content);
        await saveScenario(activeTemplate, parsed);
        toast({ title: "Succès ✅", description: "Scénario mis à jour 🔥" });
        setScenarios(await getAllScenarios());
        return;
      } catch (error) {
        console.error("Erreur lors de la sauvegarde du scénario:", error);
        toast({
          title: "Erreur",
          description: "Échec de la sauvegarde du scénario",
          variant: "destructive",
        });
      }
    }
  };

  const handleReset = async () => {
    if (!activeTemplate) return;

    if (TEMPLATE_IDS.includes(activeTemplate)) {
      await loadTemplate(activeTemplate);
      toast({ title: "Réinitialisé", description: "Template restauré 🔄" });
    } else {
      const persona = await getPersona(activeTemplate);
      if (persona) {
        setTitle(persona.name);
        setContent(formatPersona(persona));
        toast({ title: "Réinitialisé", description: "Persona restauré 🔄" });
        return;
      }

      const scenario = await getScenario(activeTemplate);
      if (scenario) {
        setTitle(scenario.title);
        setContent(formatScenario(scenario));
        toast({ title: "Réinitialisé", description: "Scénario restauré 🔄" });
        return;
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

  const handleDeletePersona = async (id: string) => {
    await deletePersona(id);
    toast({ title: "Supprimé", description: `❌ Persona supprimé.` });
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

  // Cette fonction permet de créer un scénario par défaut
  const handleCreateScenario = async () => {
    const defaultScenario = {
      title: "Nouveau scénario",
      context:
        "[Ex. : L’utilisateur souhaite rechercher un bien immobilier dans une ville ciblée]",
      objective:
        "[Ex. : Identifier les blocages dans le processus de filtrage]",
      expectedInsights: [
        "[Ex. : Comprendre pourquoi les utilisateurs ne cliquent pas sur le CTA]",
      ],
      associatedPersonaId: "[Ex. : Jean Dupont]",
      targetKPI: "[Ex. : Taux de clic sur le bouton Valider]",
      testedComponents: ["[Ex. : Barre de recherche, filtres, résultats]"],
      painPointsObserved: ["[Ex. : Trop de résultats non pertinents]"],
      notes: "[Ex. : À tester également sur mobile]",
    };

    const id = await createScenario(defaultScenario);
    const updated = await getAllScenarios();
    setScenarios(updated);

    const newScenario = updated.find((s) => s.id === id);
    if (newScenario) {
      setActiveTemplate(id);
      setTitle(newScenario.title);
      setContent(formatScenario(newScenario)); // Affiche squelette complet
    }
  };

  const handleDeleteScenario = async (id: string) => {
    await deleteScenario(id);
    toast({ title: "Supprimé", description: `❌ Scénario supprimé.` });
    setScenarios(await getAllScenarios());

    if (activeTemplate === id) {
      setActiveTemplate(null);
      setTitle("");
      setContent("");
    }
  };

  const handleSelectScenario = async (id: string) => {
    const data = await getScenario(id);
    if (data) {
      setActiveTemplate(data.id);
      setTitle(data.title);
      setContent(formatScenario(data));
    }
  };

  return {
    activeTemplate,
    content,
    title,
    personas,
    scenarios,
    setContent,
    setTitle,
    handleSave,
    handleReset,
    handleCreatePersona,
    handleDeletePersona,
    handleCreateScenario,
    handleDeleteScenario,
    loadTemplate,
    setActiveTemplate,
    handleSelectPersona,
    handleSelectScenario,
  };
}
