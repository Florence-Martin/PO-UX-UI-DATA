# 📐 Architecture Wireframes - Documentation Technique

## 🏗️ Architecture Actuelle

L'application utilise une **architecture hybride** pour la gestion des wireframes :

- **Firestore** : Stockage des métadonnées (grilles et images)
- **Système de fichiers local** : Stockage physique des images dans `public/wireframes/`
- **API Routes Next.js** : Gestion des uploads/suppressions

## 🔧 Composants Techniques

### 📁 Structure des Fichiers

```
app/
├── api/
│   ├── upload-wireframe/route.ts     # Upload d'images
│   └── delete-wireframe/route.ts     # Suppression d'images
├── analysis/page.tsx                 # Page principale wireframes

components/
├── analysis/Wireframes.tsx           # Composant principal
├── wireframes/
│   ├── WireframeGridSimplified.tsx   # Grille interactive
│   ├── WireframeWithConfig.tsx       # Wrapper avec configuration
│   └── WireframeImageViewer.tsx      # Viewer modal

lib/services/
└── wireframeService.ts               # Service principal Firestore

hooks/
└── useWireframeGrid.ts               # Hook de gestion d'état

public/
└── wireframes/                       # Stockage physique des images
    ├── README.md
    └── [images uploadées]
```

### 🗄️ Collections Firestore

#### Collection `wireframe_grids`

```typescript
interface WireframeGrid {
  id?: string;
  name: string;
  description?: string;
  gridSize: {
    cols: number;
    rows: number;
  };
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

#### Collection `wireframe_images`

```typescript
interface WireframeImage {
  id?: string;
  gridId: string;
  cellIndex: number;
  name: string;
  fileName: string;
  storageUrl: string; // Chemin local (ex: public/wireframes/image.png)
  downloadUrl: string; // URL publique (ex: /wireframes/image.png)
  position: {
    row: number;
    col: number;
  };
  uploadedAt: Timestamp;
}
```

## 🚀 Flux de Données

### Upload d'Image

1. **User** sélectionne image → `WireframeGridSimplified.tsx`
2. **Hook** `useWireframeGrid.ts` → appelle `wireframeService.uploadImage()`
3. **Service** envoie FormData → `/api/upload-wireframe`
4. **API Route** sauvegarde fichier → `public/wireframes/`
5. **Service** sauvegarde métadonnées → Firestore `wireframe_images`
6. **Hook** met à jour l'état local → Re-render composant

### Affichage des Images

1. **Hook** charge grille → `wireframeService.getGrid()`
2. **Hook** charge images → `wireframeService.getGridImages()`
3. **Composant** affiche → `<img src="/wireframes/filename.png" />`

### Suppression d'Image

1. **User** clique supprimer → `WireframeGridSimplified.tsx`
2. **Hook** appelle → `wireframeService.deleteImage()`
3. **Service** supprime métadonnées → Firestore
4. **Service** appelle → `/api/delete-wireframe`
5. **API Route** supprime fichier → `public/wireframes/`

## ⚡ Avantages de cette Architecture

### ✅ Avantages

- **Gratuit** : Pas de coûts Firebase Storage
- **Simple** : Pas de configuration CORS complexe
- **Rapide** : Images servies directement par Next.js
- **Scalable** : Métadonnées séparées du stockage physique
- **SEO-Friendly** : URLs d'images publiques et indexables

### ⚠️ Considérations

- **Vercel Limits** : 1000 fichiers max par déploiement
- **Git Repository** : Images commises avec le code
- **Backup** : Pas de backup automatique des images

## 🔧 Configuration Requise

### Variables d'Environnement (.env)

```env
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
NEXT_PUBLIC_FIREBASE_APP_ID=...
```

### Règles Firestore

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /wireframe_grids/{gridId} {
      allow read, write: if true;
    }

    match /wireframe_images/{imageId} {
      allow read, write: if true;  // ⚠️ Important : pas d'auth requise
    }
  }
}
```

## 🛠️ Maintenance

### Ajout d'une Grille

```typescript
const gridData = {
  name: "Nouvelle Grille",
  description: "Description optionnelle",
  gridSize: { cols: 4, rows: 3 },
};
const gridId = await wireframeService.createGrid(gridData);
```

### Nettoyage des Images Orphelines

```bash
# Vérifier les images sans métadonnées Firestore
# (Script à développer si nécessaire)
```

### Backup des Images

```bash
# Backup manuel du dossier public/wireframes/
tar -czf wireframes-backup-$(date +%Y%m%d).tar.gz public/wireframes/
```

## 🔍 Débogage

### Vérifications Communes

1. **Grille ne se charge pas** : Vérifier collection `wireframe_grids` dans Firestore
2. **Images ne s'affichent pas** : Vérifier `public/wireframes/` et URLs
3. **Upload échoue** : Vérifier règles Firestore et API routes
4. **Erreurs CORS** : Plus d'actualité avec cette architecture

### Logs Utiles

```javascript
// Dans le service wireframeService.ts
console.log("Upload terminé:", imageData);

// Dans le hook useWireframeGrid.ts
console.log("Images chargées:", images);

// Dans l'API route
console.log("Fichier sauvé:", filePath);
```

---

**Dernière mise à jour :** Septembre 2025  
**Architecture :** Next.js 14 + Firestore + Stockage Local
