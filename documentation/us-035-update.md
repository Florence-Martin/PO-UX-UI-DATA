# 🔄 Mise à Jour User Story US-035

## ❌ Ancienne Version (Obsolète)

```
US-035 - High Priority - Must Have

En tant que Product Owner, je veux pouvoir ajouter une image
wireframe dans une cellule d'une grille stockée dans Firestore

Tâches liées :
🔧 Ajouter un document wireframe_image

CRITÈRES D'ACCEPTATION
• Chaque document contient : gridId, cellIndex, name, fileName,
  storageUrl, downloadUrl, position{row,col}, uploadedAt.
• Le champ uploadedAt est un Timestamp Firestore (et non une string).
```

## ✅ Nouvelle Version (Architecture Hybride)

```
US-035 - High Priority - Must Have

En tant que Product Owner, je veux pouvoir ajouter une image
wireframe dans une cellule d'une grille avec persistance hybride

Tâches liées :
🔧 Ajouter un document wireframe_image (métadonnées Firestore)
🔧 Upload fichier local via API Next.js

CRITÈRES D'ACCEPTATION
• Upload via API Route `/api/upload-wireframe`
• Stockage physique : `/public/wireframes/{filename}`
• Métadonnées Firestore : gridId, cellIndex, name, fileName,
  localPath, position{row,col}, uploadedAt
• Le champ uploadedAt est un Timestamp Firestore
• Support formats : PNG, JPG, JPEG, WebP
• Suppression via API Route `/api/delete-wireframe`
• Interface drag & drop intuitive
• Prévisualisation temps réel
```

## 🏗️ Architecture Mise à Jour

### Flux de Données

1. **Upload Image** : Frontend → API Route → Stockage local
2. **Métadonnées** : API Route → Firestore
3. **Affichage** : Firestore + Images locales
4. **Suppression** : API Route → Suppression locale + Firestore

### Avantages

- ✅ **Coût** : Zéro coût de stockage (local)
- ✅ **Performance** : Images servies directement
- ✅ **Simplicité** : Pas de configuration Firebase Storage
- ✅ **Fiabilité** : Plus d'erreurs CORS

## 📝 Implémentation Actuelle

### Services

- `wireframeService.ts` : Upload/suppression hybride
- `useWireframeGrid.ts` : Hook de gestion état
- `WireframeWithConfig.tsx` : Interface utilisateur

### API Routes

- `/api/upload-wireframe` : Upload + métadonnées
- `/api/delete-wireframe` : Suppression complète

### Tests

- ✅ `wireframeService.test.ts` : Tests complets
- ✅ `useWireframeGrid.test.ts` : Tests hook
- 166 tests passent (100%)

## 📊 Critères de Validation

| Critère               | Status | Validation            |
| --------------------- | ------ | --------------------- |
| Upload d'images       | ✅     | API fonctionnelle     |
| Métadonnées Firestore | ✅     | Structure complète    |
| Stockage local        | ✅     | `/public/wireframes/` |
| Interface intuitive   | ✅     | Drag & drop           |
| Suppression           | ✅     | API complète          |
| Tests automatisés     | ✅     | 100% passants         |

## 🎯 Points de Story

**Estimation** : 3 points ⭐ (comme dans l'image originale)

**Justification** :

- Complexité moyenne (API + Firestore)
- Architecture bien définie
- Tests inclus
- Interface utilisateur simple

---

**Statut** : ✅ **TERMINÉ** - Implémenté dans l'architecture hybride  
**Dernière mise à jour** : Septembre 2025
