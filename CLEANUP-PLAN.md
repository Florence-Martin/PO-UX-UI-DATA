# 🧹 Plan de Nettoyage - Version 1.0 Propre

**Date** : 14 novembre 2025  
**Branche** : main  
**Objectif** : Optimiser et nettoyer le projet avant release v1.0

---

## 📊 Résumé de l'Analyse

### ✅ Points Forts

- Architecture Next.js 14 bien structurée
- 166 tests unitaires (100% coverage)
- TypeScript strict mode activé
- Shadcn/ui bien configuré
- Services Firestore bien organisés

### ⚠️ Points à Améliorer

- **14 fichiers modifiés** non commités
- **Dossiers dev/debug** à nettoyer
- **Console.log** en production
- **Configuration** à optimiser
- **Documentation** manquante (.env.example)

---

## 🎯 Plan d'Action par Priorité

### 🔴 PRIORITÉ HAUTE - À faire immédiatement

#### 1. Nettoyer les Fichiers Git

**Fichiers modifiés (14)** :

```bash
# Responsive + Documentation (À COMMITER)
✅ ReadMe.md
✅ app/admin/**/*.tsx (7 fichiers)
✅ components/dashboard/**/*.tsx (3 fichiers)
✅ documentation/contributing.md
✅ documentation/developer-guide.md
✅ tsconfig.json

# Supprimé (OK)
❌ documentation/firebase-security-analysis.md

# Régénéré (OK)
✅ package-lock.json
```

**Action** :

```bash
git add ReadMe.md app/admin components/dashboard documentation tsconfig.json
git commit -m "chore: responsive improvements, doc updates and tsconfig optimization"
git add -A
git commit -m "chore: package-lock regeneration after cleanup"
```

---

#### 2. Supprimer les Dossiers de Développement

**Dossiers à supprimer** :

```bash
# app/dev/ - 4 pages d'import désactivées
app/dev/import-roadmap/
app/dev/import-tasks/
app/dev/import-testScenarios/
app/dev/import-user-stories/

# app/debug/ - Page de test Firebase
app/debug/firebase-test/

# app/sandbox/ - Page de test générale
app/sandbox/page.tsx
```

**Raison** : Ces pages sont déjà ignorées dans `.gitignore` mais toujours présentes dans le repo.

**Action** :

```bash
rm -rf app/dev
rm -rf app/debug
rm -rf app/sandbox
```

---

#### 3. Créer .env.example

**Fichier manquant** : `.env.example`

**Action** :

```bash
# Créer .env.example
```

**Contenu** :

```bash
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abcdef

# App Configuration (Optional)
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

### 🟡 PRIORITÉ MOYENNE - Améliorations recommandées

#### 4. Nettoyer les console.log en Production

**19 console.log/error trouvés** dans les composants :

**À remplacer par un système de logging** :

```typescript
// lib/utils/logger.ts
export const logger = {
  log: (...args: unknown[]) => {
    if (process.env.NODE_ENV === "development") {
      console.log(...args);
    }
  },
  error: (...args: unknown[]) => {
    console.error(...args); // Toujours logger les erreurs
  },
  warn: (...args: unknown[]) => {
    if (process.env.NODE_ENV === "development") {
      console.warn(...args);
    }
  },
};
```

**Fichiers à modifier** (19) :

- components/sprint/SprintBoard.tsx
- components/sprint/SprintHistoryBoard.tsx
- components/definition-of-done/DefinitionOfDone.tsx
- components/admin/DataManagement.tsx
- components/dashboard/\*.tsx (3 fichiers)
- components/backlog/KanbanItem.tsx
- components/prioritization/MoscowPrioritization.tsx
- components/wireframes/\*.tsx (3 fichiers)
- components/analysis/\*.tsx (3 fichiers)

---

#### 5. Optimiser next.config.js

**Problèmes actuels** :

```javascript
eslint: {
  ignoreDuringBuilds: true,  // ⚠️ Masque les erreurs
},
images: { unoptimized: true }, // ⚠️ Pas d'optimisation
```

**Configuration optimisée** :

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  // Activer ESLint en build
  eslint: {
    ignoreDuringBuilds: false,
  },

  // Optimiser les images
  images: {
    unoptimized: false,
    domains: ["firebasestorage.googleapis.com"], // Si images Firebase
    formats: ["image/webp", "image/avif"],
  },

  // Optimisations production
  reactStrictMode: true,
  swcMinify: true,

  // Headers sécurité
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
```

---

#### 6. Ajouter Scripts NPM Manquants

**package.json - Scripts à ajouter** :

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "lint:fix": "next lint --fix",
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "type-check": "tsc --noEmit",
    "format": "prettier --write \"**/*.{ts,tsx,md,json}\"",
    "format:check": "prettier --check \"**/*.{ts,tsx,md,json}\"",
    "clean": "rm -rf .next node_modules package-lock.json && npm install",
    "analyze": "ANALYZE=true npm run build"
  }
}
```

---

#### 7. Configurer Prettier

**Fichier manquant** : `.prettierrc`

**Action** :

```json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": false,
  "tabWidth": 2,
  "printWidth": 80,
  "arrowParens": "always",
  "endOfLine": "lf"
}
```

**.prettierignore** :

```
node_modules
.next
out
build
coverage
*.md
package-lock.json
pnpm-lock.yaml
```

---

### 🟢 PRIORITÉ BASSE - Optimisations futures

#### 8. Optimiser les Composants Wireframe

**9 composants wireframes** identifiés :

```
components/wireframes/
├── WireframeConfig.tsx
├── WireframeGrid.tsx
├── WireframeGridSimplified.tsx          ← Version simplifiée (à conserver)
├── WireframeImageList.tsx
├── WireframeImageUpload.tsx
├── WireframeImageViewer.tsx
├── WireframeImageViewerSimple.tsx       ← Version simple (doublon ?)
├── WireframeWithConfig.tsx
└── WireframesProgressPad.tsx
```

**Recommandation** :

- Vérifier si `WireframeImageViewer.tsx` et `WireframeImageViewerSimple.tsx` peuvent être fusionnés
- Documenter quel composant utiliser dans quels cas

---

#### 9. Ajouter Lazy Loading

**Composants lourds à lazy load** :

```typescript
// app/analysis/page.tsx
import dynamic from "next/dynamic";

const Wireframes = dynamic(() => import("@/components/analysis/Wireframes"), {
  loading: () => <div>Chargement...</div>,
  ssr: false,
});

const UserStories = dynamic(() => import("@/components/analysis/UserStories"));
```

**Bénéfice** : Réduction du bundle initial

---

#### 10. Optimiser les Imports

**Pattern à éviter** :

```typescript
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
// ... 10 imports
```

**Pattern optimisé** :

```typescript
// Créer components/ui/index.ts
export { Button } from "./button";
export { Card, CardContent, CardHeader } from "./card";
export { Input } from "./input";
// ...

// Puis importer
import { Button, Card, CardContent, Input } from "@/components/ui";
```

---

## 📋 Checklist de Nettoyage

### Phase 1 : Nettoyage Immédiat (30 min)

- [ ] Commiter les 14 fichiers modifiés
- [ ] Supprimer `app/dev/`, `app/debug/`, `app/sandbox/`
- [ ] Créer `.env.example`
- [ ] Vérifier que le build fonctionne : `npm run build`

### Phase 2 : Configuration (30 min)

- [ ] Optimiser `next.config.js`
- [ ] Créer `.prettierrc` et `.prettierignore`
- [ ] Ajouter scripts npm manquants
- [ ] Créer `lib/utils/logger.ts`

### Phase 3 : Code Quality (1-2h)

- [ ] Remplacer console.log par logger (19 fichiers)
- [ ] Formatter tout le code : `npm run format`
- [ ] Vérifier types : `npm run type-check`
- [ ] Lancer les tests : `npm test`

### Phase 4 : Documentation (30 min)

- [ ] Mettre à jour README avec nouvelles commandes
- [ ] Documenter l'architecture des composants wireframe
- [ ] Ajouter CHANGELOG.md pour v1.0

### Phase 5 : Validation Finale (15 min)

- [ ] Build production : `npm run build`
- [ ] Tests : `npm test`
- [ ] Lint : `npm run lint`
- [ ] Type check : `npm run type-check`
- [ ] Vérifier le projet en local : `npm run start`

---

## 🚀 Commandes d'Exécution Rapide

### Nettoyage Complet en une fois

```bash
# 1. Commit des modifications
git add ReadMe.md app/admin components/dashboard documentation tsconfig.json
git commit -m "chore: v1.0 - responsive improvements and config optimization"

# 2. Suppression dossiers dev
rm -rf app/dev app/debug app/sandbox

# 3. Créer .env.example (voir contenu ci-dessus)
touch .env.example

# 4. Créer .prettierrc (voir contenu ci-dessus)
touch .prettierrc .prettierignore

# 5. Build test
npm run build

# 6. Commit final
git add .
git commit -m "chore: v1.0 - cleanup dev folders and add config files"
```

---

## 📈 Métriques Avant/Après

### Avant Nettoyage

- Fichiers modifiés non commités : 14
- Dossiers dev/debug : 3 dossiers (5+ fichiers)
- Console.log en prod : 19 occurrences
- Configuration manquante : .env.example, .prettierrc
- next.config.js : Non optimisé

### Après Nettoyage ✅

- Fichiers modifiés : 0 (tout commité)
- Dossiers dev/debug : 0 (supprimés)
- Console.log en prod : 0 (remplacés par logger)
- Configuration : Complète
- next.config.js : Optimisé avec sécurité

---

## 🎯 Version 1.0 - Critères d'Acceptation

✅ Tous les fichiers modifiés sont commités  
✅ Aucun dossier dev/debug dans le repo  
✅ .env.example présent et documenté  
✅ .prettierrc configuré  
✅ next.config.js optimisé  
✅ Logger système en place (pas de console.log)  
✅ `npm run build` réussit sans erreur  
✅ `npm test` passe avec 100% de couverture  
✅ `npm run lint` sans erreur  
✅ Documentation à jour

---

**Prêt à démarrer le nettoyage ?** 🧹✨
