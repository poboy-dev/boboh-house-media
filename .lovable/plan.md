## Objectif

Ajouter une barre de recherche/filtre sur toutes les pages qui listent des articles (Portfolio, Boboh Geek, BH Association, pages de catégorie), pour que le visiteur puisse trouver rapidement un article par mot-clé.

## Approche

Toutes ces pages utilisent le même composant `ArticlesList`. On ajoute la barre de recherche directement dans ce composant — un seul changement, bénéfice partout, aucune duplication.

## Ce qui sera ajouté

1. **Barre de recherche** en haut de la grille d'articles
   - Champ texte avec icône loupe (composant `Input` shadcn + icône Lucide `Search`)
   - Placeholder : « Rechercher un article… »
   - Bouton « ✕ » pour effacer la recherche quand un texte est saisi

2. **Filtrage côté client**
   - Recherche insensible à la casse et aux accents
   - Cherche dans le **titre** et la **description** de l'article
   - Mise à jour instantanée (au fur et à mesure de la frappe, avec un léger debounce de 200 ms pour la fluidité)

3. **États visuels**
   - Compteur discret : « 12 articles » / « 3 résultats pour "musique" »
   - Si aucun résultat : message « Aucun article ne correspond à votre recherche » + bouton « Réinitialiser »

4. **Pages concernées** (automatiquement via `ArticlesList`)
   - `/portfolio`
   - `/boboh-geek`
   - `/bh-association`
   - `/categories/:slug`

## Détails techniques

- Filtrage **client-side** uniquement (les listes restent petites, pas besoin d'aller-retour serveur)
- Normalisation Unicode (`.normalize("NFD").replace(/\p{Diacritic}/gu, "")`) pour gérer les accents
- Aucune modification de la base de données, du backend ou des routes
- Aucune modification des autres composants — uniquement `src/components/ArticlesList.tsx`

## Hors scope

- Sections « Articles récents » et « Articles populaires » de la page d'accueil (elles affichent une sélection limitée, pas une liste filtrable — peuvent être ajoutées plus tard si souhaité)
- Filtres avancés (par date, par auteur, par catégorie multiple) — peuvent être ajoutés dans une itération future
