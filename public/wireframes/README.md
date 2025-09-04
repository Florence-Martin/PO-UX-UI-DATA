# 📐 Images Wireframes

Ce dossier contient les images uploadées pour les grilles wireframes de l'application.

## 🔧 Fonctionnement

- **Upload** : Via l'interface `/analysis` → Grille Wireframes
- **API** : Gestion par `/api/upload-wireframe` et `/api/delete-wireframe`
- **Métadonnées** : Stockées dans Firestore (`wireframe_images`)
- **Accès** : Images servies directement par Next.js

## 📡 URLs d'Accès

- **Production** : `https://votre-domaine.vercel.app/wireframes/nom-du-fichier.png`
- **Local** : `http://localhost:3000/wireframes/nom-du-fichier.png`

## 📝 Convention de Nommage

Format : `{gridId}_cell_{cellIndex}_{timestamp}_{originalName}`

Exemple : `LpIOR9hbIDOFsuwfwR32_cell_0_1756994849580_dashboard-wiring-diagram.png`

## ⚠️ Limitations Vercel

- **Limite** : 1000 fichiers max par déploiement
- **Taille** : 5MB max par image (configuré dans l'API)
- **Formats** : PNG, JPG, GIF, WebP supportés

## 🔍 Maintenance

Pour nettoyer les images orphelines (sans métadonnées Firestore), exécuter :

```bash
# Script à développer si nécessaire
npm run cleanup-wireframes
```

---

**Architecture :** Next.js 14 + Stockage Local  
**Documentation complète :** `documentation/wireframes-architecture.md`
