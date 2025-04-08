// hooks/useUserTestScenarios.ts

import { useCallback, useEffect, useState } from "react";
import {
  Scenario,
  getAllScenarios,
  createScenario,
  deleteScenario,
  saveScenario,
} from "@/lib/services/scenarioService";
import { Timestamp } from "firebase/firestore";

// Récupérer les scénarios existants
export async function getAllScenarios(): Promise<Scenario[]> {
  const ref = collection(db, "user_research_scenarios");
  const snapshot = await getDocs(ref);
  return snapshot.docs.map((doc) => doc.data() as Scenario);
}

export function useUserTestScenarios() {
  const [scenarios, setScenarios] = useState<Scenario[]>([]);
  const [activeScenarioId, setActiveScenarioId] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [context, setContext] = useState("");
  const [objective, setObjective] = useState("");
  const [expectedInsights, setExpectedInsights] = useState<string[]>([""]);
  const [associatedPersonaId, setAssociatedPersonaId] = useState("");
  const [targetKPI, setTargetKPI] = useState("");
  const [testedComponents, setTestedComponents] = useState<string[]>([""]);
  const [painPointsObserved, setPainPointsObserved] = useState<string[]>([]);
  const [notes, setNotes] = useState("");

  // Charger tous les scénarios au démarrage
  useEffect(() => {
    getAllScenarios().then(setScenarios);
  }, []);

  // Sélectionner un scénario existant
  const handleSelectScenario = useCallback(
    (id: string) => {
      const scenario = scenarios.find((s) => s.id === id);
      if (scenario) {
        setActiveScenarioId(scenario.id);
        setTitle(scenario.title);
        setContext(scenario.context);
        setObjective(scenario.objective);
        setExpectedInsights(scenario.expectedInsights);
        setAssociatedPersonaId(scenario.associatedPersonaId);
        setTargetKPI(scenario.targetKPI);
        setTestedComponents(scenario.testedComponents);
        setPainPointsObserved(scenario.painPointsObserved);
        setNotes(scenario.notes);
      }
    },
    [scenarios]
  );

  // Créer un nouveau scénario vide
  const handleCreateScenario = async () => {
    const now = Timestamp.now();
    const newScenario = {
      title: "Nouveau scénario",
      context: "",
      objective: "",
      expectedInsights: [""],
      associatedPersonaId: "",
      targetKPI: "",
      testedComponents: [""],
      painPointsObserved: [],
      notes: "",
      createdAt: now,
      updatedAt: now,
    };
    const id = await createScenario(newScenario);
    setScenarios((prev) => [...prev, { id, ...newScenario }]);
    handleSelectScenario(id);
  };

  // Sauvegarder un scénario
  const handleSaveScenario = async () => {
    if (!activeScenarioId) return;
    const existing = scenarios.find((s) => s.id === activeScenarioId);
    const now = Timestamp.now();
    const data = {
      title,
      context,
      objective,
      expectedInsights,
      associatedPersonaId,
      targetKPI,
      testedComponents,
      painPointsObserved,
      notes,
      createdAt: existing?.createdAt || now,
      updatedAt: now,
    };
    await saveScenario(activeScenarioId, data);
    setScenarios((prev) =>
      prev.map((s) =>
        s.id === activeScenarioId ? { id: activeScenarioId, ...data } : s
      )
    );
  };

  // Supprimer un scénario
  const handleDeleteScenario = async (id: string) => {
    await deleteScenario(id);
    setScenarios((prev) => prev.filter((s) => s.id !== id));
    if (id === activeScenarioId) {
      resetForm();
    }
  };

  // Reset du formulaire
  const resetForm = () => {
    setActiveScenarioId(null);
    setTitle("");
    setContext("");
    setObjective("");
    setExpectedInsights([""]);
    setAssociatedPersonaId("");
    setTargetKPI("");
    setTestedComponents([""]);
    setPainPointsObserved([]);
    setNotes("");
  };

  return {
    scenarios,
    activeScenarioId,
    title,
    context,
    objective,
    expectedInsights,
    associatedPersonaId,
    targetKPI,
    testedComponents,
    painPointsObserved,
    notes,
    setTitle,
    setContext,
    setObjective,
    setExpectedInsights,
    setAssociatedPersonaId,
    setTargetKPI,
    setTestedComponents,
    setPainPointsObserved,
    setNotes,
    handleCreateScenario,
    handleSaveScenario,
    handleDeleteScenario,
    handleSelectScenario,
    resetForm,
  };
}
