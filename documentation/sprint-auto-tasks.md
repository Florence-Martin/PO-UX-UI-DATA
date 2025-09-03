# 🆕 Fonctionnalité : Création Automatique de Tâches Sprint

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
- Le processus est entièrement automatisé

## 🔧 Fonctionnement Technique

### Logique implémentée dans `useSprintForm.ts`

1. **Création du sprint** avec les User Stories sélectionnées
2. **Mise à jour des User Stories** (ajout du `sprintId` et du badge "sprint")
3. **Mise à jour des tâches existantes** liées aux US (ajout du badge "sprint")
4. **🆕 Création automatique de tâches** pour les US sans tâches existantes

### Exemple de tâche créée automatiquement

```typescript
{
  title: "Implémenter: [Titre de l'US]",
  description: "Tâche principale pour implémenter la User Story: [Titre de l'US]",
  priority: "high" | "medium" | "low", // Hérite de la priorité de l'US
  storyPoints: 2, // Hérite des story points de l'US
  status: "todo", // Toujours créée en "À Faire"
  userStoryIds: ["us-id"],
  badge: "sprint", // Directement avec le badge sprint
}
```

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
