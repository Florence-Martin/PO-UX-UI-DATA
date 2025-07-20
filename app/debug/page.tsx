"use client";

import { useEffect, useState } from "react";
import { getAllSprints } from "@/lib/services/sprintService";
import { getAllUserStories } from "@/lib/services/userStoryService";
import { syncSprintUserStories } from "@/lib/services/sprintService";
import { Sprint } from "@/lib/types/sprint";
import { UserStory } from "@/lib/types/userStory";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function DebugPage() {
  const [sprints, setSprints] = useState<Sprint[]>([]);
  const [userStories, setUserStories] = useState<UserStory[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const [sprintsData, userStoriesData] = await Promise.all([
        getAllSprints(),
        getAllUserStories(),
      ]);
      setSprints(sprintsData);
      setUserStories(userStoriesData);
    } catch (error) {
      console.error("Erreur lors du chargement des données:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSync = async () => {
    try {
      const result = await syncSprintUserStories();
      toast.success(`Synchronisation terminée : ${result.synced} sprint(s) mis à jour`);
      // Recharger les données
      await fetchData();
    } catch (error) {
      console.error("Erreur lors de la synchronisation:", error);
      toast.error("Erreur lors de la synchronisation");
    }
  };

  if (loading) {
    return <div className="p-6">Chargement...</div>;
  }

  const activeSprints = sprints.filter(sprint => sprint.isActive);
  const sprint25 = sprints.find(sprint => sprint.title.includes("Sprint 25") || sprint.title.includes("25"));

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Debug - État des Sprints et User Stories</h1>
        <Button onClick={handleSync} className="bg-blue-600 hover:bg-blue-700">
          🔄 Synchroniser User Stories/Sprints
        </Button>
      </div>
      
      <div className="bg-gray-100 p-4 rounded">
        <h2 className="text-lg font-semibold mb-2">Sprints marqués comme actifs (isActive: true)</h2>
        {activeSprints.length === 0 ? (
          <p className="text-red-500">Aucun sprint marqué comme actif !</p>
        ) : (
          activeSprints.map(sprint => (
            <div key={sprint.id} className="mb-4 p-3 bg-white rounded border">
              <h3 className="font-medium">{sprint.title}</h3>
              <p>ID: {sprint.id}</p>
              <p>Status: {sprint.status}</p>
              <p>IsActive: {sprint.isActive ? "✅ true" : "❌ false"}</p>
              <p>UserStoryIds dans le sprint: [{sprint.userStoryIds?.join(", ") || "aucun"}]</p>
            </div>
          ))
        )}
      </div>

      {sprint25 && (
        <div className="bg-blue-100 p-4 rounded">
          <h2 className="text-lg font-semibold mb-2">Sprint 25 (détails)</h2>
          <div className="p-3 bg-white rounded border">
            <h3 className="font-medium">{sprint25.title}</h3>
            <p>ID: {sprint25.id}</p>
            <p>Status: {sprint25.status}</p>
            <p>IsActive: {sprint25.isActive ? "✅ true" : "❌ false"}</p>
            <p>UserStoryIds dans le sprint: [{sprint25.userStoryIds?.join(", ") || "aucun"}]</p>
          </div>
        </div>
      )}

      <div className="bg-green-100 p-4 rounded">
        <h2 className="text-lg font-semibold mb-2">User Stories avec sprintId</h2>
        {userStories
          .filter(us => us.sprintId)
          .map(us => (
            <div key={us.id} className="mb-2 p-2 bg-white rounded border text-sm">
              <span className="font-medium">{us.code}</span> - {us.title}
              <br />
              <span className="text-gray-600">SprintId: {us.sprintId}</span>
            </div>
          ))
        }
      </div>

      <div className="bg-yellow-100 p-4 rounded">
        <h2 className="text-lg font-semibold mb-2">User Stories US-013 et US-031</h2>
        {["US-013", "US-031"].map(code => {
          const us = userStories.find(story => story.code === code);
          return us ? (
            <div key={us.id} className="mb-2 p-2 bg-white rounded border text-sm">
              <span className="font-medium">{us.code}</span> - {us.title}
              <br />
              <span className="text-gray-600">SprintId: {us.sprintId || "❌ aucun"}</span>
            </div>
          ) : (
            <div key={code} className="mb-2 p-2 bg-white rounded border text-sm text-red-500">
              {code} - ❌ Non trouvé
            </div>
          );
        })}
      </div>
    </div>
  );
}
