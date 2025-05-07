// import { useState, useEffect, useRef } from "react";
// import { Sprint } from "@/lib/types/sprint";
// import { UserStory } from "@/lib/types/userStory";
// import { Timestamp } from "firebase/firestore";
// import { toast } from "sonner";
// import {
//   createSprint,
//   updateSprint,
//   deleteSprint,
//   getAllSprints,
// } from "@/lib/services/sprintService";
// import {
//   getAllUserStories,
//   updateUserStorySprint,
// } from "@/lib/services/userStoryService";
// import { sprintSchema, sanitize } from "@/lib/utils/sprintSchema";

// export function useSprint() {
//   // États globaux
//   const [sprints, setSprints] = useState<Sprint[]>([]);
//   const [userStories, setUserStories] = useState<UserStory[]>([]);
//   const [activeSprint, setActiveSprint] = useState<Sprint | null>(null);
//   const [selectedSprint, setSelectedSprint] = useState<Sprint | null>(null);
//   const [isModalOpen, setIsModalOpen] = useState(false);

//   // États pour le formulaire
//   const [formValues, setFormValues] = useState({
//     title: "",
//     startDate: undefined as Date | undefined,
//     endDate: undefined as Date | undefined,
//     userStoryIds: [] as string[],
//   });

//   // Références pour les champs du formulaire
//   const titleRef = useRef<HTMLInputElement>(null);
//   const startDateRef = useRef<HTMLInputElement>(null);
//   const endDateRef = useRef<HTMLInputElement>(null);

//   // Chargement initial des données
//   useEffect(() => {
//     fetchSprints();
//     fetchUserStories();
//   }, []);

//   // Récupération des sprints
//   const fetchSprints = async () => {
//     try {
//       const data = await getAllSprints();
//       setSprints(data);

//       // Détecter le sprint actif
//       const current = data.find(isCurrentSprint) || null;
//       setActiveSprint(current);
//     } catch (error) {
//       console.error("Erreur lors du chargement des sprints :", error);
//     }
//   };

//   // Récupération des User Stories
//   const fetchUserStories = async () => {
//     try {
//       const data = await getAllUserStories();
//       setUserStories(data);
//     } catch (error) {
//       console.error("Erreur lors du chargement des User Stories :", error);
//     }
//   };

//   // Détection du sprint actif
//   const isCurrentSprint = (sprint: Sprint): boolean => {
//     const now = new Date();
//     const start = parseDate(sprint.startDate);
//     const end = parseDate(sprint.endDate);
//     end.setHours(23, 59, 59, 999); // Inclure toute la journée de fin
//     return now >= start && now <= end;
//   };

//   // Conversion des dates
//   const parseDate = (date: Date | string | Timestamp): Date => {
//     if (date instanceof Timestamp) return date.toDate();
//     return new Date(date);
//   };

//   // Gestion des modaux
//   const openModal = () => setIsModalOpen(true);
//   const closeModal = () => setIsModalOpen(false);

//   // Gestion des champs du formulaire
//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = e.target;
//     setFormValues((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleDateChange = (
//     type: "startDate" | "endDate",
//     date: Date | undefined
//   ) => {
//     setFormValues((prev) => ({
//       ...prev,
//       [type]: date,
//     }));
//   };

//   const handleCheckboxChange = (storyId: string) => {
//     setFormValues((prev) => ({
//       ...prev,
//       userStoryIds: prev.userStoryIds.includes(storyId)
//         ? prev.userStoryIds.filter((id) => id !== storyId)
//         : [...prev.userStoryIds, storyId],
//     }));
//   };

//   // Création ou modification d'un sprint
//   const handleSubmit = async () => {
//     const sanitizedTitle = sanitize(formValues.title);

//     const validationResult = sprintSchema.validate({
//       title: sanitizedTitle,
//       startDate: formValues.startDate,
//       endDate: formValues.endDate,
//       userStoryIds: formValues.userStoryIds,
//     });

//     if (validationResult.error) {
//       toast.error(validationResult.error.message);
//       return;
//     }

//     const { startDate, endDate, userStoryIds } = formValues;

//     try {
//       if (!selectedSprint) {
//         // Création
//         const newSprint: Omit<Sprint, "id" | "progress"> = {
//           title: sanitizedTitle,
//           startDate: Timestamp.fromDate(startDate!),
//           endDate: Timestamp.fromDate(endDate!),
//           userStoryIds,
//           velocity: 0,
//           status: "planned",
//         };

//         const sprintId = await createSprint(newSprint);

//         // Mise à jour des User Stories
//         await Promise.all(
//           userStoryIds.map((usId) => updateUserStorySprint(usId, sprintId))
//         );

//         toast.success("Sprint créé avec succès ✅");
//       } else {
//         // Modification
//         await updateSprint(selectedSprint.id, {
//           title: sanitizedTitle,
//           startDate: Timestamp.fromDate(startDate!),
//           endDate: Timestamp.fromDate(endDate!),
//           userStoryIds,
//         });

//         // Mise à jour des User Stories
//         for (const story of userStories) {
//           const shouldBeLinked = userStoryIds.includes(story.id);
//           const alreadyLinked = story.sprintId === selectedSprint.id;

//           if (shouldBeLinked && !alreadyLinked) {
//             await updateUserStorySprint(story.id, selectedSprint.id);
//           } else if (!shouldBeLinked && alreadyLinked) {
//             await updateUserStorySprint(story.id, null);
//           }
//         }

//         toast.success("Sprint modifié avec succès ✅");
//       }

//       fetchSprints();
//       fetchUserStories();
//       resetForm();
//       closeModal();
//     } catch (error) {
//       console.error("Erreur lors de l'enregistrement du sprint :", error);
//       toast.error("Une erreur est survenue.");
//     }
//   };

//   // Suppression d'un sprint
//   const handleDelete = async (id: string) => {
//     try {
//       const userStoriesToUpdate = userStories.filter(
//         (story) => story.sprintId === id
//       );

//       await Promise.all(
//         userStoriesToUpdate.map((story) =>
//           updateUserStorySprint(story.id, null)
//         )
//       );

//       await deleteSprint(id);
//       fetchSprints();
//       fetchUserStories();

//       toast.success("Sprint supprimé avec succès ✅");
//     } catch (error) {
//       console.error("Erreur lors de la suppression du sprint :", error);
//       toast.error("Une erreur est survenue.");
//     }
//   };

//   // Réinitialisation du formulaire
//   const resetForm = () => {
//     setFormValues({
//       title: "",
//       startDate: undefined,
//       endDate: undefined,
//       userStoryIds: [],
//     });
//     setSelectedSprint(null);
//   };

//   // Édition d'un sprint
//   const handleEdit = (sprint: Sprint) => {
//     setSelectedSprint(sprint);
//   };

//   return {
//     sprints,
//     userStories,
//     activeSprint,
//     selectedSprint,
//     isModalOpen,
//     formValues,
//     openModal,
//     closeModal,
//     handleInputChange,
//     handleDateChange,
//     handleCheckboxChange,
//     handleSubmit,
//     handleDelete,
//     resetForm,
//     handleEdit,
//   };
// }

import { useEffect, useState } from "react";
import { getAllSprints } from "@/lib/services/sprintService";
import { Sprint } from "@/lib/types/sprint";
import { Timestamp } from "firebase/firestore";

/**
 * Convertit une date (string, Date ou Timestamp) en instance de Date.
 */
function parseDate(date: Date | string | Timestamp): Date {
  if (date instanceof Timestamp) return date.toDate();
  return new Date(date);
}

/**
 * Vérifie si le sprint est actif (en cours).
 */
function isCurrentSprint(sprint: Sprint): boolean {
  const now = new Date();
  const start = parseDate(sprint.startDate);
  const end = parseDate(sprint.endDate);
  return now >= start && now <= end;
}

/**
 * Hook pour charger les sprints, les trier et identifier celui en cours.
 */
export function useSprints() {
  const [sprints, setSprints] = useState<Sprint[]>([]);
  const [currentSprint, setCurrentSprint] = useState<Sprint | null>(null);

  const refetch = async () => {
    try {
      const data = await getAllSprints();

      // Tri ascendant par date de début
      const sorted = [...data].sort(
        (a, b) =>
          parseDate(a.startDate).getTime() - parseDate(b.startDate).getTime()
      );

      setSprints(sorted);

      const active = sorted.find(isCurrentSprint) || null;
      setCurrentSprint(active);
    } catch (error) {
      console.error("Erreur lors du chargement des sprints :", error);
    }
  };

  useEffect(() => {
    refetch();
  }, []);

  return { sprints, currentSprint, refetch };
}
