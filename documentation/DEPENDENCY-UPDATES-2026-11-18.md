**Mises à jour successives — 18 novembre 2026**

Branche de prévisualisation : `chore/dependencies-2026-11`.
Chaque étape est vérifiée, commitée et poussée séparément. La production reste sur `main` jusqu'à validation de la prévisualisation.

**1. Next.js**

- Next.js et eslint-config-next : 16.4.6.
- Node cible : 24.x (`engines`, `.nvmrc`), vérifications locales avec Node 24.22.3 installé de façon isolée.
- Le build contrôle désormais les erreurs TypeScript : suppression de `ignoreBuildErrors`.
- Le chargement initial des User Stories utilise un callback stable déclaré avant son effet.
- Les nouveaux diagnostics `set-state-in-effect` restent visibles comme avertissements sur une liste explicite de 18 fichiers préexistants. Ils restent bloquants ailleurs. Leur refonte est une dette distincte de la mise à jour de sécurité.
- TypeScript, lint (0 erreur, 21 avertissements), 216 tests et build doivent réussir avant le push.

Le rapport `AUDIT-DEPENDANCES-2026-11-18.md` reste l'instantané avant ces mises à jour.
