**Mises à jour successives — 18 novembre 2026**

Branche de prévisualisation : `chore/dependencies-2026-11`.
Chaque étape est vérifiée, commitée et poussée séparément. La production reste sur `main` jusqu'à validation de la prévisualisation.

**1. Next.js**

- Next.js et eslint-config-next : 16.4.6.
- Node cible : 24.x (`engines`, `.nvmrc`), vérifications locales avec Node 24.22.3 installé de façon isolée.
- Le build contrôle désormais les erreurs TypeScript : suppression de `ignoreBuildErrors`.
- Le chargement initial des User Stories utilise un callback stable déclaré avant son effet.
- Les nouveaux diagnostics `set-state-in-effect` restent visibles comme avertissements sur une liste explicite de 18 fichiers préexistants. Ils restent bloquants ailleurs. Leur refonte est une dette distincte de la mise à jour de sécurité.
- TypeScript, lint (0 erreur, 21 avertissements), 216 tests et build réussis.
- Commit `3e0e6ea` ; [prévisualisation Vercel réussie](https://vercel.com/florencemartins-projects/po-ux-ui-data/4W2S57guuGt56sKPGvAxq6fKAJKG).

**2. DOMPurify**

- DOMPurify : 3.4.18.
- Trois tests vérifient le nettoyage réellement utilisé par les formulaires de sprint : conservation du texte français et du HTML inoffensif, suppression des scripts/gestionnaires d'événements, neutralisation des liens JavaScript.
- Typage, lint, 219 tests et build réussis. Commit `25861b8` ; [prévisualisation réussie](https://vercel.com/florencemartins-projects/po-ux-ui-data/32LVaTAbgoNUnteC3hChvAL9iUyA).

**3. Joi**

- Joi : 17.13.9, correctif dans la même version majeure.
- Tests du schéma de sprint : cas valide, ordre des dates, limites de titre et types des identifiants de User Stories.
- Typage, lint, 225 tests et build réussis. Commit `1afcaed` ; [prévisualisation réussie](https://vercel.com/florencemartins-projects/po-ux-ui-data/Gwm5mT81RJgKMQRrvwnLawTwvMMC).

**4. Zod**

- Zod : 4.6.7 ; TypeScript : 5.9.3 (compatible avec Zod 4 et ts-jest existant) ; resolvers : 7.0.7.
- La route d'analyse expose les erreurs via `issues`, conserve le statut HTTP 400 et borne les textes (titre 300 caractères, description/critères 20 000, code/priorité 100).
- Les réponses IA sont limitées à 50 éléments par liste et 4 000 caractères par texte. Ces limites s'appliquent à la validation, pas au téléchargement du corps HTTP.
- Tests de l'API valide/invalide, des limites de taille et de l'intégration avec React Hook Form.

Le rapport `AUDIT-DEPENDANCES-2026-11-18.md` reste l'instantané avant ces mises à jour.
