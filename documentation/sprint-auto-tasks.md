# 🆕 Fonctionnalité : Création Automatique de Tâches Sprint

> **📅 Dernière mise à jour** : 27 novembre 2025  
> **⚠️ Note** : Ce document a été mis à jour pour refléter le refactoring Sprint de novembre 2025

## 📋 Description

Lorsque vous créez un sprint et cochez "Marquer comme sprint actif", l'application crée automatiquement des tâches par défaut pour les User Stories qui n'ont pas encore de tâches associées.

## 🎯 Problème Résolu

**Avant :**

- Création d'un sprint avec des User Stories
- Les US étaient assignées au sprint mais n'apparaissaient pas dans le Sprint Backlog
- Il fallait créer manuellement des tâches pour chaque US

**Maintenant :**

- Création automatique d'une tâche par défaut pour chaque US sans tâches existantes
- Les tâches apparaissent immédiatement dans la colonne "À Faire" du Sprint Backlog
- Redirection automatique vers `/sprint?tab=kanban` après création
- Le processus est entièrement automatisé

## 🔧 Fonctionnement Technique

### Logique implémentée dans `useSprintDetail.tsx`

1. **Création du sprint** avec les User Stories sélectionnées
   - `sprint.userStoryIds = ["us1", "us2", ...]` (PUSH)
   
2. **Mise à jour des User Stories**
   - `us.sprintId = sprint.id` (PULL)
   - `us.badge = "sprint"` (décoratif uniquement, synchronisé automatiquement)
   
3. **Synchronisation des badges** (décoratif)
   - Appel de `updateBadgesForSprintUserStories()`
   - ⚠️ Le badge n'est PAS utilisé comme critère de filtrage
   
4. **Redirection automatique**
   - `router.push('/sprint?tab=kanban')` après 500ms
   - Navigation vers Sprint Backlog avec rafraîchissement

### Exemple de tâche créée automatiquement

```typescript
{
  title: "Implémenter: [Titre de l'US]",
  description: "Tâche principale pour implémenter la User Story: [Titre de l'US]",
  priority: "high" | "medium" | "low", // Hérite de la priorité de l'US
  storyPoints: 2, // Hérite des story points de l'US
  status: "todo", // Toujours créée en "À Faire"
  userStoryIds: ["us-id"], // ✅ Source de vérité pour le filtrage
  badge: "sprint", // ⚠️ Décoratif uniquement (synchronisé automatiquement)
}
```

### ⚠️ Nouveau système (2025) : Filtrage des tâches

Le système ne se base **PLUS** sur le champ `badge` pour filtrer les tâches du sprint.

**Logique de filtrage** :
```typescript
// 1. Récupérer les User Stories du sprint (double source de vérité)
const sprintUserStories = getUserStoriesForSprint(activeSprint, userStories);
// PUSH : sprint.userStoryIds (prioritaire)
// PULL : us.sprintId (fallback)

// 2. Filtrer les tâches par intersection userStoryIds
const sprintTasks = getTasksForSprint(allTasks, sprintUserStories.map(us => us.id));
// Logique : task.userStoryIds ∩ sprintUserStoryIds
```

**✅ Source de vérité** : `task.userStoryIds` + `sprint.userStoryIds` + `us.sprintId`  
**❌ Badge** : Champ décoratif uniquement (pas de critère de filtrage)

## ✅ Tests Ajoutés

### `tests/sprintAutoTasks.test.ts`

- ✅ **Test 1** : Création automatique de tâches pour les US sans tâches existantes
- ✅ **Test 2** : Pas de création si l'US a déjà des tâches associées

## 🎉 Bénéfices Utilisateur

1. **Expérience fluide** : Plus besoin de créer manuellement des tâches
2. **Gain de temps** : Automatisation du processus de setup du sprint
3. **Cohérence** : Toutes les US ont au moins une tâche pour apparaître dans le backlog
4. **Visibilité immédiate** : Les éléments du sprint sont visibles dès la création

## 🔍 Mode Dogfooding

Cette fonctionnalité a été développée en utilisant l'application elle-même :

- **Sprint créé** : "Sprint 26 Qualité Code - Septembre 2025"
- **US créée** : [US-034] - Corriger les 5 warnings ESLint
- **Test en conditions réelles** : Validation du comportement attendu

## 📈 Métriques

- **Tests totaux** : 141 (+ 2 nouveaux)
- **Couverture** : Maintenue à 92.53%+
- **Impact** : 0 régression, amélioration de l'UX

## 🚀 Prochaines Améliorations

1. **Templates de tâches** : Permettre des templates personnalisés selon le type d'US
2. **Nombre de tâches** : Option pour créer plusieurs tâches par défaut (analyse, dev, test)
3. **Smart suggestions** : IA pour suggérer des tâches basées sur la description de l'US

---

_Développé en mode dogfooding le 3 septembre 2025_ ✨
