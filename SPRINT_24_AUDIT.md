# 🔍 Audit Sprint 24 - Definition of Done

**Date de clôture :** 19 juillet 2025  
**Date d'audit :** 20 juillet 2025

## ✅ Checklist Definition of Done

Pour chaque User Story marquée "Done" dans le Sprint 24, vérifiez que **TOUS** les critères suivants sont respectés :

### 📋 Critères DoD (6/6 obligatoires)

```
□ Code relu par un pair
□ Tests unitaires écrits
□ Fonction testée en local
□ Fonction validée en staging
□ Documentation mise à jour
□ Ticket passé en "Done" sur Jira/Kanban
```

## 📊 Process d'Audit

### ÉTAPE 1 : Inventaire des User Stories

- [ ] Lister toutes les US du Sprint 24
- [ ] Identifier celles marquées "Done"
- [ ] Identifier celles "En cours" ou "À faire"

### ÉTAPE 2 : Audit DoD par User Story

| Code US | Titre | 1️⃣ Code Review | 2️⃣ Tests     | 3️⃣ Test Local | 4️⃣ Test Staging | 5️⃣ Doc       | 6️⃣ Ticket    | ✅ Statut Final     |
| ------- | ----- | -------------- | ------------ | ------------- | --------------- | ------------ | ------------ | ------------------- |
| US-XXX  | ...   | ⚪ / ✅ / ❌   | ⚪ / ✅ / ❌ | ⚪ / ✅ / ❌  | ⚪ / ✅ / ❌    | ⚪ / ✅ / ❌ | ⚪ / ✅ / ❌ | 🔄 DONE / 📋 REPORT |

**Légende :**

- ✅ Critère respecté
- ❌ Critère non respecté
- ⚪ Non applicable / Non vérifié
- 🔄 DONE = Reste "Done"
- 📋 REPORT = À reporter au Sprint 25

### ÉTAPE 3 : Actions Post-Audit

#### 🎯 User Stories Conformes (100% DoD)

- [x] Garder le statut "Done"
- [x] Compter dans la vélocité finale
- [x] Documenter les bonnes pratiques

#### 📋 User Stories Non-Conformes

- [x] Changer statut : "Done" → "In Progress" ou "To Do"
- [x] Reporter au Sprint 25
- [x] Créer des tâches pour compléter les critères manquants
- [x] Ne PAS compter dans la vélocité du Sprint 24

## 📈 Impact sur les Métriques

### Avant Audit DoD

- US planifiées : X
- US "Done" : Y
- Vélocité apparente : Z points

### Après Audit DoD

- US réellement terminées : ?
- US reportées : ?
- **Vélocité réelle : ? points**

## 🔄 Actions Recommandées

### Immédiat

1. **Auditer chaque US** contre les 6 critères DoD
2. **Mettre à jour les statuts** selon les résultats
3. **Recalculer la vélocité** basée sur les US vraiment terminées

### Sprint Review & Retrospective

4. **Présenter uniquement les US conformes DoD** en Sprint Review
5. **Analyser les écarts DoD** en Retrospective
6. **Définir des actions d'amélioration** pour respecter la DoD

### Clôture

7. **Marquer hasReview: true** après Sprint Review
8. **Marquer hasRetrospective: true** après Retrospective
9. **Changer status: "active" → "done"**
10. **Ajouter closedAt: 19 juillet 2025**

## 💡 Bonnes Pratiques pour le Futur

- **Formation équipe** sur l'importance de la DoD
- **Vérification DoD en continu** pendant le sprint (pas seulement à la fin)
- **Daily Scrum** : "Cette US respecte-t-elle déjà la DoD ?"
- **Automatisation** des critères DoD quand possible (CI/CD, tests auto)

---

**⚠️ Règle d'Or :** Une User Story n'est Done que si elle respecte 100% de la Definition of Done. Aucune exception !
