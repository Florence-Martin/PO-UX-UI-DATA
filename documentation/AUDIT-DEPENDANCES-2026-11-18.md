**Audit des dépendances — 18 novembre 2026**

Projet PO-UX-UI-DATA, branche `main`, commit audité `48500f1`. Cet audit ne modifie aucune dépendance. Les versions disponibles proviennent du registre npm consulté le 18 novembre 2026 ; elles constituent des cibles à évaluer, pas des migrations déjà validées.

**État du projet**

- 84 dépendances directes : 76 dans `dependencies`, 8 dans `devDependencies`.
- 1 039 entrées de dépendances dans le verrouillage npm, y compris les paquets optionnels propres à différentes plateformes ; ce n'est pas la taille du bundle livré au navigateur.
- 67 dépendances directes signalées par `npm outdated` ; 43 disposent d'une mise à jour dans la plage autorisée par le manifeste, 24 nécessitent de modifier cette plage pour progresser. Certaines des 43 ont également une version majeure plus récente hors plage.
- `npm ls --depth=0` réussit : pas de dépendance directe manquante ou invalide.
- `npm audit` : 24 paquets affectés (2 critiques, 6 élevés, 16 modérés), correspondant à 14 avis distincts. Les paquets parents peuvent être comptés à cause d'une même dépendance vulnérable. Ce ne sont pas 24 failles indépendantes ni une preuve d'exploitation.
- Le précédent message GitHub annonçait 14 alertes avec une autre répartition. Les instantanés et méthodes de regroupement diffèrent ; le chiffre ci-dessus provient de l'audit npm exécuté aujourd'hui sur le verrouillage local.

**Correction du déploiement déjà livrée**

La mise à jour Dependabot avait remplacé Tailwind 3.3.3 par 4.3.3 sans migrer `postcss.config.js`, `tailwind.config.ts` et `app/globals.css`. L'erreur PostCSS a été reproduite localement et confirmée par les logs Vercel transmis.

Le commit `48500f1`, envoyé sur `main`, fixe Tailwind à 3.4.19 et synchronise `package-lock.json`. Next reste en 16.3.8. Le verrouillage utilise désormais `postcss-selector-parser` 6.1.6, non signalé par l'audit actuel. Le résultat du nouveau déploiement Vercel n'a pas été observé.

**Contrôles exécutés**

| Contrôle | Résultat | Limite |
| --- | --- | --- |
| `npm run build` | Réussi après la correction : 20 pages générées | Exécuté durant la correction, sur le même commit ; variables locales, pas l'environnement Vercel |
| `npm run type-check` | Réussi durant cet audit | Contrôle statique |
| `npm run lint` | Réussi durant cet audit | Pas de validation visuelle |
| `npm test -- --runInBand` | 21 suites, 216 tests réussis | Ne remplace pas les essais des parcours avec Firebase réel |
| `npm ls --depth=0` | Réussi | Cohérence des dépendances directes |
| `npm audit --json` | 24 paquets affectés | Signalement de versions, sans test d'exploitation |

`next.config.js` conserve `typescript.ignoreBuildErrors: true`. Un build vert seul ne garantit donc pas la validité TypeScript. Le contrôle séparé passe aujourd'hui : retirer cette exception et rendre le contrôle obligatoire dans la CI est recommandé.

**Corrections de sécurité prioritaires**

| Paquet | Installé | Cible proposée | Analyse |
| --- | --- | --- | --- |
| `next` | 16.3.8 | 16.4.6 | Plusieurs avis, jusqu'au niveau critique ; cible compatible avec la plage actuelle. Aligner `eslint-config-next` de 16.1.6 à 16.4.6 et vérifier ses prérequis. |
| `dompurify` | 3.4.16 | 3.4.18 | Avis critique et élevé ; mise à jour patch dans la plage actuelle. Utilisé dans les formulaires de sprint. |
| `joi` | 17.13.8 | 17.13.9 | Correctif de déni de service dans la branche 17 ; inutile de migrer en 18 pour cet avis. |
| `zod` | 3.25.76 | 4.6.7 | Avis élevé, correctif à partir de 4.6.6 ; migration de code nécessaire. |
| `@grpc/grpc-js` via Firebase | 1.9.16 | Branche corrigée à valider | Avis élevé ; 1.13.6 et 1.14.5 sont des versions corrigées pour l'avis principal, hors de la contrainte Firebase `~1.9.0`. |
| Chaînes Jest / ESLint | Plusieurs versions | Mises à jour ciblées puis nouvel audit | `glob` et `minimatch` produisent des alertes modérées propagées à leurs parents. Une simple montée de Jest n'est pas une garantie de résolution. |

Ces priorités ne signifient pas que chaque scénario vulnérable est accessible dans l'application :

- **Next** : `images.unoptimized: true` est actif et `sharp` est déjà en 0.35.5. Cette version de Sharp satisfait le contournement officiel pour l'avis sur l'optimisation SVG. Aucun usage de `use cache`, `unstable_cache` ou directive `use server` n'a été trouvé dans les sources applicatives inspectées. Cela réduit l'exposition apparente à certains avis, sans remplacer la mise à jour ni une analyse complète d'exécution. [Avis optimisation d'images](https://github.com/advisories/GHSA-2464-fhr4-w9xw), [avis use cache](https://github.com/advisories/GHSA-673q-mjm6-r5xr).
- **DOMPurify** : le code appelle `DOMPurify.sanitize(input)` sur une chaîne, sans les options particulières `SAFE_FOR_TEMPLATES`, `IN_PLACE` ou `PARSER_MEDIA_TYPE` des avis remontés. Les préconditions de l'avis critique n'ont pas été retrouvées dans cet usage. [Avis DOMPurify](https://github.com/advisories/GHSA-cg2g-xh64-v4q7).
- **Joi** : le schéma de sprint ne fait pas appel à `string().email({ multiple: true })`, visé par l'avis. Le patch reste simple et utile. [Avis Joi](https://github.com/advisories/GHSA-4528-x5fx-h6hg).
- **gRPC** : la chaîne est `firebase@11.10.0 → @firebase/firestore@4.8.0 → @grpc/grpc-js@1.9.16`. L'avis principal vise des usages serveur de `getAuthContext` avec des certificats clients ; aucun serveur gRPC correspondant n'a été trouvé dans le code inspecté. La présence du paquet dans le verrouillage ne démontre donc pas une exposition du navigateur. [Avis gRPC](https://github.com/advisories/GHSA-m9gg-hp2v-232j).
- **Zod** : la route `/api/ai/us-quality` valide des chaînes en entrée, puis des tableaux dans la réponse IA. Cette réponse est actuellement un stub local. Les tableaux n'ont pas de limite explicite : les borner sera particulièrement important lors du branchement à un service IA réel. [Avis Zod](https://github.com/advisories/GHSA-mrhx-c7xc-m3w5).

**Blocages et migrations à traiter séparément**

1. **Firebase / gRPC** : les métadonnées npm de `firebase@13.4.0` pointent vers `@firebase/firestore@4.20.0`, qui dépend encore de `@grpc/grpc-js: ~1.9.0`. Monter Firebase à la dernière version ne résout donc pas mécaniquement cette alerte. Ce Firestore exige aussi Node >=24.12.0. Étudier le correctif amont ou un override ciblé avec essais Firestore côté Node et navigateur. Ne pas imposer globalement une version sans validation. Le blocage de plage explique plausiblement l'échec Dependabot observé, mais ses logs détaillés n'ont pas été consultés.
2. **Zod 4** : adapter notamment `error.errors` dans `app/api/ai/us-quality/route.ts` à l'API d'erreurs Zod 4 (`issues`), vérifier les schémas et les éventuels resolvers de formulaires. Ajouter un test de réponse HTTP 400 sur entrée invalide et des limites de taille pertinentes. [Guide de migration](https://zod.dev/v4/changelog).
3. **React 19** : maintenir `react`, `react-dom` et leurs types ensemble. `react-beautiful-dnd@13.1.1` et `react-day-picker@8.10.1` déclarent des pairs limités à React 18 ou antérieur. La version installée de DayPicker exige aussi `date-fns` 2 ou 3 : ne pas monter `date-fns` en 4 isolément.
4. **Glisser-déposer** : `react-beautiful-dnd` est archivé et déprécié. Il est encore utilisé dans `components/definition-of-done/EditDodDrawver.tsx`, tandis que le reste du projet utilise déjà `@dnd-kit`. Migrer cet écran vers la solution déjà présente avant React 19. [Dépôt officiel](https://github.com/atlassian/react-beautiful-dnd).
5. **Tailwind 4** : conserver 3.4.19 pour stabiliser le déploiement. La migration future doit couvrir PostCSS, CSS, thème, classes et comparaison visuelle. Garder `tailwind-merge` sur une branche compatible avec Tailwind 3 ; sa version 3 vise Tailwind 4. [Migration Tailwind](https://tailwindcss.com/docs/upgrade-guide), [compatibilité tailwind-merge](https://github.com/dcastil/tailwind-merge/blob/main/README.md).
6. **TypeScript / Jest** : TypeScript est en 5.2.2, la dernière version publiée est 7.0.2. `ts-jest@29.4.1` accepte TypeScript >=4.3 <6 ; même `ts-jest@29.4.15`, dernière version consultée, n'accepte que >=4.3 <7. Une montée directe vers TypeScript 7 sortirait donc de la compatibilité déclarée. En revanche, `ts-jest` 29.4 prend explicitement en charge Jest 30 : leur différence de numéro majeur n'est pas à elle seule une anomalie. Aligner aussi `@types/jest` 29.5.14 sur Jest 30.
7. **Autres composants** : Recharts 3, Framer Motion 14, DayPicker 10, react-resizable-panels 4, Sonner 2, Vaul 1 et les nouveaux resolvers nécessitent chacun une revue de migration et des essais des écrans concernés. Les mises à jour Radix dans les plages actuelles peuvent être regroupées, avec validation des dialogues, menus, sélecteurs et navigation clavier.

**Environnement et entretien du manifeste**

- Node local : **20.16.0**, ligne désormais en fin de vie selon Node.js. Aucune version Node n'est fixée dans `package.json`. Proposition : aligner poste, CI et Vercel sur Node 24 LTS à jour, puis déclarer la cible avec `engines` et un fichier de version. La version réellement choisie dans Vercel reste à vérifier. Vercel propose actuellement les branches 22, 24 et 26. [Cycle Node](https://nodejs.org/en/about/eol), [versions Vercel](https://vercel.com/docs/functions/runtimes/node-js/node-js-versions).
- `@next/swc-wasm-nodejs@13.5.1` ne correspond pas à Next 16 ; aucun usage explicite trouvé. Vérifier puis supprimer cette dépendance directe si elle n'est plus nécessaire, plutôt que la mettre à jour aveuglément.
- `@eslint/config-array`, `@eslint/object-schema`, `motion-utils`, `styled-jsx`, `uuid` et le plugin `@tailwindcss/line-clamp` sont des candidats à revue des dépendances directes : pas d'usage explicite trouvé dans les sources inspectées. Certains restent utiles transitivement ; une absence d'import ne suffit pas à conclure qu'on peut tout supprimer.
- `@types/joi` est un paquet de substitution : Joi fournit ses types. DOMPurify fournit également des types ; évaluer le retrait de `@types/dompurify` après vérification TypeScript.
- ESLint, TypeScript et plusieurs paquets de types sont placés dans `dependencies`. Revoir la répartition vers `devDependencies` pour clarifier la surface d'exécution, en conservant leur disponibilité au build Vercel. Un paquet classé production dans npm n'est pas nécessairement livré à l'utilisateur.
- Le script `clean` supprime `package-lock.json`, puis réinstalle : il peut changer beaucoup de versions. Préférer un nettoyage des artefacts et `npm ci` pour une réinstallation reproductible.
- Aucun workflow `.github/workflows` ni fichier Dependabot versionné n'a été trouvé. Cela ne permet pas de déduire tous les réglages activés dans l'interface GitHub. Ajouter une CI imposant installation verrouillée, lint, typage, tests et build ; organiser les mises à jour en petits lots, avec revue explicite des versions majeures.
- Éviter `npm audit fix --force` : l'audit propose notamment des retours à Firebase 9.14.0 et Jest 29.7.0. Ces propositions automatiques ne constituent pas une stratégie validée pour ce projet.

**Ordre d'intervention proposé**

| Lot | Contenu | Validation attendue |
| --- | --- | --- |
| 1 — Correctifs immédiats | Next 16.4.6 + config ESLint alignée ; DOMPurify 3.4.18 ; Joi 17.13.9 | Type-check, lint, 216 tests, build et preview Vercel ; essai des formulaires sprint |
| 2 — Reproductibilité | Node 24 à jour, CI, suppression du contournement TypeScript, nettoyage du manifeste et du script clean | Installation fraîche verrouillée et mêmes contrôles sur Node cible |
| 3 — Sécurité avec adaptation | Zod 4 ; traitement ciblé de gRPC ; mises à jour des chaînes Jest/ESLint | Tests API d'erreurs et tailles limites ; essais Firestore ; nouvel audit et justification du résiduel |
| 4 — Entretien courant | Radix, React Hook Form, Chart.js, outils et patches compatibles | Lots réduits, tests et contrôle des composants affectés |
| 5 — Migrations majeures | Retrait de react-beautiful-dnd, calendrier, React 19, Tailwind 4, graphiques et animations | Branches distinctes, tests de parcours, comparaison visuelle et previews avant production |

Les chiffres d'audit et les cibles devront être recalculés après chaque lot. Aucun `npm update`, `npm audit fix`, changement de dépendance ou nouveau déploiement n'a été effectué pendant ce bilan.


**Inventaire complet des dépendances directes**

`Autorisée` correspond à la valeur `wanted` de npm, selon les plages actuelles du manifeste. `Dernière` correspond au tag `latest` observé ; cette colonne ne garantit pas la compatibilité. Un tiret indique que le paquet ne figure pas dans la sortie `npm outdated`.

| Paquet | Déclarée | Installée | Autorisée | Dernière | Groupe |
| --- | --- | --- | --- | --- | --- |
| @dnd-kit/core | ^6.3.1 | 6.3.1 | — | — | dependencies |
| @dnd-kit/sortable | ^8.0.0 | 8.0.0 | 8.0.0 | 10.0.0 | dependencies |
| @dnd-kit/utilities | ^3.2.2 | 3.2.2 | — | — | dependencies |
| @eslint/config-array | ^0.19.2 | 0.19.2 | 0.19.2 | 0.21.2 | dependencies |
| @eslint/object-schema | ^2.1.6 | 2.1.7 | — | — | dependencies |
| @hookform/resolvers | ^3.9.0 | 3.10.0 | 3.10.0 | 7.0.7 | dependencies |
| @next/swc-wasm-nodejs | 13.5.1 | 13.5.1 | 13.5.1 | 16.4.6 | dependencies |
| @radix-ui/react-accordion | ^1.2.0 | 1.2.12 | 1.3.1 | 1.3.1 | dependencies |
| @radix-ui/react-alert-dialog | ^1.1.1 | 1.1.15 | 1.2.1 | 1.2.1 | dependencies |
| @radix-ui/react-aspect-ratio | ^1.1.0 | 1.1.7 | 1.2.0 | 1.2.0 | dependencies |
| @radix-ui/react-avatar | ^1.1.0 | 1.1.10 | 1.3.1 | 1.3.1 | dependencies |
| @radix-ui/react-checkbox | ^1.1.1 | 1.3.3 | 1.4.1 | 1.4.1 | dependencies |
| @radix-ui/react-collapsible | ^1.1.0 | 1.1.12 | 1.2.1 | 1.2.1 | dependencies |
| @radix-ui/react-context-menu | ^2.2.1 | 2.2.16 | 2.4.1 | 2.4.1 | dependencies |
| @radix-ui/react-dialog | ^1.1.1 | 1.1.15 | 1.3.1 | 1.3.1 | dependencies |
| @radix-ui/react-dropdown-menu | ^2.1.1 | 2.1.16 | 2.2.1 | 2.2.1 | dependencies |
| @radix-ui/react-hover-card | ^1.1.1 | 1.1.15 | 1.2.1 | 1.2.1 | dependencies |
| @radix-ui/react-label | ^2.1.0 | 2.1.7 | 2.1.17 | 2.1.17 | dependencies |
| @radix-ui/react-menubar | ^1.1.1 | 1.1.16 | 1.2.1 | 1.2.1 | dependencies |
| @radix-ui/react-navigation-menu | ^1.2.0 | 1.2.14 | 1.4.1 | 1.4.1 | dependencies |
| @radix-ui/react-popover | ^1.1.1 | 1.1.15 | 1.3.1 | 1.3.1 | dependencies |
| @radix-ui/react-progress | ^1.1.2 | 1.1.7 | 1.2.1 | 1.2.1 | dependencies |
| @radix-ui/react-radio-group | ^1.2.0 | 1.3.8 | 1.5.1 | 1.5.1 | dependencies |
| @radix-ui/react-scroll-area | ^1.1.0 | 1.2.10 | 1.4.0 | 1.4.0 | dependencies |
| @radix-ui/react-select | ^2.1.1 | 2.2.6 | 2.4.1 | 2.4.1 | dependencies |
| @radix-ui/react-separator | ^1.1.0 | 1.1.7 | 1.2.0 | 1.2.0 | dependencies |
| @radix-ui/react-slider | ^1.2.0 | 1.3.6 | 1.6.1 | 1.6.1 | dependencies |
| @radix-ui/react-slot | ^1.1.0 | 1.2.3 | 1.5.0 | 1.5.0 | dependencies |
| @radix-ui/react-switch | ^1.1.0 | 1.2.6 | 1.4.1 | 1.4.1 | dependencies |
| @radix-ui/react-tabs | ^1.1.0 | 1.1.13 | 1.2.1 | 1.2.1 | dependencies |
| @radix-ui/react-toast | ^1.2.1 | 1.2.15 | 1.3.1 | 1.3.1 | dependencies |
| @radix-ui/react-toggle | ^1.1.0 | 1.1.10 | 1.2.1 | 1.2.1 | dependencies |
| @radix-ui/react-toggle-group | ^1.1.0 | 1.1.11 | 1.2.1 | 1.2.1 | dependencies |
| @radix-ui/react-tooltip | ^1.1.2 | 1.2.8 | 1.4.1 | 1.4.1 | dependencies |
| @tailwindcss/line-clamp | ^0.4.4 | 0.4.4 | — | — | dependencies |
| @types/dompurify | ^3.0.5 | 3.0.5 | — | — | dev |
| @types/jest | ^29.5.14 | 29.5.14 | 29.5.14 | 30.0.0 | dev |
| @types/joi | ^17.2.2 | 17.2.2 | — | — | dev |
| @types/node | 20.6.2 | 20.6.2 | 20.6.2 | 26.6.6 | dependencies |
| @types/react | 18.2.22 | 18.2.22 | 18.2.22 | 19.3.0 | dependencies |
| @types/react-beautiful-dnd | ^13.1.8 | 13.1.8 | — | — | dev |
| @types/react-dom | 18.2.7 | 18.2.7 | 18.2.7 | 19.3.0 | dependencies |
| aria-hidden | ^1.2.4 | 1.2.6 | — | — | dependencies |
| autoprefixer | 10.4.15 | 10.4.15 | 10.4.15 | 10.6.2 | dependencies |
| busboy | ^1.6.0 | 1.6.0 | — | — | dependencies |
| chart.js | ^4.4.8 | 4.5.0 | 4.6.1 | 4.6.1 | dependencies |
| class-variance-authority | ^0.7.0 | 0.7.1 | — | — | dependencies |
| clsx | ^2.1.1 | 2.1.1 | — | — | dependencies |
| cmdk | ^1.0.0 | 1.1.1 | — | — | dependencies |
| date-fns | ^3.6.0 | 3.6.0 | 3.6.0 | 4.4.0 | dependencies |
| dompurify | ^3.4.16 | 3.4.16 | 3.4.18 | 3.4.18 | dependencies |
| embla-carousel-react | ^8.3.0 | 8.6.0 | — | — | dependencies |
| eslint | ^9.39.2 | 9.39.2 | 9.39.5 | 9.39.5 | dependencies |
| eslint-config-next | 16.1.6 | 16.1.6 | 16.1.6 | 16.4.6 | dependencies |
| firebase | ^11.5.0 | 11.10.0 | 11.10.0 | 13.4.0 | dependencies |
| framer-motion | ^12.5.0 | 12.23.12 | 12.43.0 | 14.14.0 | dependencies |
| input-otp | ^1.2.4 | 1.4.2 | 1.5.0 | 1.5.0 | dependencies |
| jest | ^30.0.4 | 30.1.3 | 30.5.2 | 30.5.2 | dev |
| jest-environment-jsdom | ^30.0.4 | 30.1.2 | 30.5.2 | 30.5.2 | dev |
| joi | ^17.13.8 | 17.13.8 | 17.13.9 | 18.3.2 | dependencies |
| lucide-react | ^0.446.0 | 0.446.0 | 0.446.0 | 1.75.0 | dependencies |
| motion-utils | ^12.23.6 | 12.23.6 | 12.39.0 | 14.7.0 | dependencies |
| next | ^16.3.8 | 16.3.8 | 16.4.6 | 16.4.6 | dependencies |
| next-themes | ^0.3.0 | 0.3.0 | 0.3.0 | 0.4.6 | dependencies |
| postcss | 8.5.26 | 8.5.26 | 8.5.26 | 8.5.33 | dependencies |
| prettier | ^3.6.2 | 3.6.2 | 3.10.1 | 3.10.1 | dev |
| react | ^18.3.1 | 18.3.1 | 18.3.1 | 19.3.1 | dependencies |
| react-beautiful-dnd | ^13.1.1 | 13.1.1 | — | — | dependencies |
| react-chartjs-2 | ^5.3.0 | 5.3.1 | — | — | dependencies |
| react-day-picker | ^8.10.1 | 8.10.1 | 8.10.2 | 10.0.2 | dependencies |
| react-dom | ^18.3.1 | 18.3.1 | 18.3.1 | 19.3.1 | dependencies |
| react-hook-form | ^7.53.0 | 7.62.0 | 7.92.0 | 7.92.0 | dependencies |
| react-resizable-panels | ^2.1.3 | 2.1.9 | 2.1.9 | 4.24.1 | dependencies |
| recharts | ^2.12.7 | 2.15.4 | 2.15.4 | 3.11.0 | dependencies |
| sonner | ^1.7.4 | 1.7.4 | 1.7.4 | 2.0.8 | dependencies |
| styled-jsx | ^5.1.6 | 5.1.7 | — | — | dependencies |
| tailwind-merge | ^2.5.2 | 2.6.0 | 2.6.1 | 3.7.0 | dependencies |
| tailwindcss | 3.4.19 | 3.4.19 | 3.4.19 | 4.3.5 | dependencies |
| tailwindcss-animate | ^1.0.7 | 1.0.7 | — | — | dependencies |
| ts-jest | ^29.4.0 | 29.4.1 | 29.4.15 | 29.4.15 | dev |
| typescript | 5.2.2 | 5.2.2 | 5.2.2 | 7.0.2 | dependencies |
| uuid | ^14.0.0 | 14.0.0 | 14.0.3 | 14.0.3 | dependencies |
| vaul | ^0.9.9 | 0.9.9 | 0.9.9 | 1.1.2 | dependencies |
| zod | ^3.23.8 | 3.25.76 | 3.25.76 | 4.6.7 | dependencies |

**Détail des 24 paquets affectés selon npm audit**

La sévérité est celle du paquet dans le rapport npm ; les lignes « via » propagent les avis de leurs dépendances et ne constituent pas de nouveaux avis.

| Paquet | Sévérité | Origine des alertes |
| --- | --- | --- |
| @firebase/firestore | Élevée | via @grpc/grpc-js |
| @firebase/firestore-compat | Élevée | via @firebase/firestore |
| @grpc/grpc-js | Élevée | [GHSA-m9gg-hp2v-232j](https://github.com/advisories/GHSA-m9gg-hp2v-232j) ; [GHSA-f596-whhp-79r4](https://github.com/advisories/GHSA-f596-whhp-79r4) |
| @jest/core | Modérée | via @jest/reporters ; via jest-config ; via jest-runner ; via jest-runtime |
| @jest/reporters | Modérée | via glob |
| @typescript-eslint/eslint-plugin | Modérée | via @typescript-eslint/type-utils ; via @typescript-eslint/utils |
| @typescript-eslint/parser | Modérée | via @typescript-eslint/typescript-estree |
| @typescript-eslint/type-utils | Modérée | via @typescript-eslint/typescript-estree ; via @typescript-eslint/utils |
| @typescript-eslint/typescript-estree | Modérée | via minimatch |
| @typescript-eslint/utils | Modérée | via @typescript-eslint/typescript-estree |
| dompurify | Critique | [GHSA-cg2g-xh64-v4q7](https://github.com/advisories/GHSA-cg2g-xh64-v4q7) ; [GHSA-mrv2-3pqr-j5jr](https://github.com/advisories/GHSA-mrv2-3pqr-j5jr) ; [GHSA-c6gr-qvv4-5v3f](https://github.com/advisories/GHSA-c6gr-qvv4-5v3f) |
| firebase | Élevée | via @firebase/firestore ; via @firebase/firestore-compat |
| glob | Modérée | [GHSA-3g3m-2fjr-6pw4](https://github.com/advisories/GHSA-3g3m-2fjr-6pw4) ; via minimatch |
| jest | Modérée | via @jest/core ; via jest-cli |
| jest-circus | Modérée | via jest-runtime |
| jest-cli | Modérée | via @jest/core ; via jest-config |
| jest-config | Modérée | via glob ; via jest-circus ; via jest-runner |
| jest-runner | Modérée | via jest-runtime |
| jest-runtime | Modérée | via glob |
| joi | Élevée | [GHSA-4528-x5fx-h6hg](https://github.com/advisories/GHSA-4528-x5fx-h6hg) |
| minimatch | Modérée | [GHSA-g3hv-75wg-m249](https://github.com/advisories/GHSA-g3hv-75wg-m249) |
| next | Critique | [GHSA-2464-fhr4-w9xw](https://github.com/advisories/GHSA-2464-fhr4-w9xw) ; [GHSA-p3m5-59mp-jv5r](https://github.com/advisories/GHSA-p3m5-59mp-jv5r) ; [GHSA-673q-mjm6-r5xr](https://github.com/advisories/GHSA-673q-mjm6-r5xr) ; [GHSA-mfr8-8qww-v76h](https://github.com/advisories/GHSA-mfr8-8qww-v76h) ; [GHSA-vc7v-qv4w-wrv8](https://github.com/advisories/GHSA-vc7v-qv4w-wrv8) |
| typescript-eslint | Modérée | via @typescript-eslint/eslint-plugin ; via @typescript-eslint/parser ; via @typescript-eslint/typescript-estree ; via @typescript-eslint/utils |
| zod | Élevée | [GHSA-mrhx-c7xc-m3w5](https://github.com/advisories/GHSA-mrhx-c7xc-m3w5) |

**Méthode et limites**

Sources : manifeste et verrouillage du dépôt ; `npm outdated --json`, `npm audit --json`, `npm ls --depth=0`, `npm explain @grpc/grpc-js` ; métadonnées `npm view` de Firebase 13.4.0, Firestore 4.20.0 et ts-jest 29.4.15 ; recherches des usages dans le code ; documentation et avis officiels liés ci-dessus. Les commandes de consultation npm ont interrogé le registre avec accès réseau autorisé. Aucun test de pénétration ni validation du déploiement distant ne fait partie de cet audit.
