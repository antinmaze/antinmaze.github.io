# Antoine Mazé — Portfolio

Portfolio professionnel bilingue français/anglais : architecture IT, cloud, sécurité, projets GitHub et musique avec Atomic Dusk.

## Stack

Node.js 22.12+, Vite, TypeScript, CSS et icônes Lucide. HTML statique indexable, sans serveur applicatif, Ruby ou Jekyll.

## Développement

- `npm ci` : installer les dépendances.
- `npm run dev` : démarrer le serveur de développement.
- `npm run build` : vérifier TypeScript et générer le site dans `dist/`.
- `npm test` : contrôler le site généré après compilation.
- `npm run preview` : prévisualiser le résultat de production.

## Contenu

Le contenu français est dans `index.html`, les traductions anglaises et les messages interactifs dans `src/translations.ts`, les interactions dans `src/main.ts` et les styles dans `src/style.css`. Les projets sont sélectionnés à partir des dépôts publics, sans appel API ni suivi publicitaire au chargement.

## Langues

- Français : `/` ; anglais : `/en/`.
- Le sélecteur FR / EN est accessible sur ordinateur et mobile et conserve l’ancre de la section consultée.
- `vite.config.ts` et `lib/localize.ts` génèrent la page anglaise au développement et à la compilation. Les deux versions contiennent leur texte dans le HTML : aucun JavaScript n’est nécessaire pour lire la traduction ou changer de langue.
- Les titres, descriptions, libellés accessibles, balises `lang`, URL canoniques, liens `hreflang` et le sitemap sont localisés.
- Après une modification du contenu français, mettre à jour le dictionnaire anglais puis exécuter la compilation et les tests.

Le parcours détaillé et le téléchargement du CV ne sont pas publiés tant que le PDF n’a pas été fourni et vérifié. Aucun employeur, diplôme ou certification n’a été inventé. Le contact utilise LinkedIn : l’ancienne configuration contenait deux adresses email différentes, non vérifiées.

## GitHub Pages

Dans **Settings → Pages → Build and deployment**, sélectionner **GitHub Actions**. Le workflow compile et teste les pull requests, puis publie `dist/` lors d’un push sur `main`. Le domaine `antoinemaze.fr` est conservé via `public/CNAME`. Le fichier `public/.nojekyll` désactive Jekyll.

Le code et les ressources de l’ancien thème ont été supprimés. `public/CNAME` est l’unique source de configuration du domaine ; Vite la copie dans le site compilé.

## Structure

- `index.html` : contenu français et structure des pages.
- `src/` : styles clair/sombre, interactions et traductions.
- `lib/` : génération du HTML anglais.
- `public/` : ressources et configuration du site publié.
- `tests/` : contrôles de la compilation et du contenu.
- `.github/workflows/` : vérification et déploiement GitHub Pages.

## Accessibilité

Navigation clavier, lien d’évitement, menu mobile avec fermeture par Échap, filtres avec états accessibles et annonce des résultats, respect de la réduction des animations. Les liens externes sont protégés par `noopener noreferrer`.

