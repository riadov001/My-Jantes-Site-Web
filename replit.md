# MyJantes.fr — Site vitrine + Admin

## Projet
Site de rénovation de jantes alu basé à Liévin (62). Slogan : "L'expert de la jante alu".
Stack : Express + Vite + React + PostgreSQL + Drizzle ORM + TailwindCSS + shadcn/ui.

## Architecture
- `client/` — Frontend React (Vite, wouter, TanStack Query)
- `server/` — Backend Express (routes, storage, seed, vite dev server)
- `shared/schema.ts` — Modèles Drizzle + Zod (users, contactRequests, blogPosts, galleryItems, testimonials, faqItems, siteServices, siteContent)

## Accès Admin
- Route : `/admin`
- Login : `contact@myjantes.com` / `MyJantes@2026!*`
- Session stockée en PostgreSQL (connect-pg-simple), cookie 24h

## Fonctionnalités Admin (CRUD complet)
- **Contacts/Devis** : voir, rechercher, filtrer par statut, trier, changer statut (nouveau/en_cours/traite/annule), supprimer
- **Galerie** : ajouter, modifier, publier/masquer, supprimer (titre, type, images URL, description, aperçu)
- **Prestations** : ajouter, modifier, publier/masquer, supprimer — gère les cartes services dynamiquement (titre, description, image, badge, caractéristiques, tarif, slug, ordre)
- **Avis clients** : ajouter, modifier, publier/masquer, supprimer (nom, ville, véhicule, note 1-5, commentaire)
- **FAQ** : ajouter, modifier, publier/masquer, supprimer (question, réponse, catégorie, ordre)
- **Contenu du site** : éditer toutes les sections ci-dessous

## Contenu CMS (onglet Contenu dans admin)
Categories et clés gérées dynamiquement :
- **Header & Logo** : `header.logo_url`, `header.logo_size` (sm/md/lg/xl)
- **Couleur du site** : `theme.color` (8 presets : red, blue, green, orange, purple, pink, teal, gold) — appliqué via CSS variables `--auto-red`, `--auto-red-dark`, `--auto-red-light`
- **Typographie** : `typography.font` (14 polices Google Fonts : Montserrat, Open Sans, Poppins, Raleway, Inter, Roboto, Lato, Nunito, Oswald, Playfair Display, Bebas Neue, Quicksand, Rubik, Work Sans)
- **Hero** : badge, titre (2 lignes), sous-titre, CTA boutons, `hero.bg_video` (MP4), `hero.bg_image` (fallback)
- **Statistiques** : 4 blocs JSON `stats`
- **Bande de confiance** : `trust_items` JSON array
- **Contact** : phone, whatsapp, adresse, email
- **Sections** : titres et sous-titres de chaque section
- **Footer & Réseaux sociaux** : tagline, horaires (3 formats), liens Instagram/Facebook/Snapchat/TikTok/Google

## Composants globaux (App.tsx)
- `ThemeApplier` : applique police + couleur CSS variables sur `document.documentElement` à chaque changement de siteContent
- `WhatsAppButton` : bouton flottant WhatsApp sur toutes les pages publiques (pas sur /admin)

## Intégration externe (CORS)
- `appmyjantes.mytoolsgroup.eu` autorisé via CORS
- POST `/api/contact` accepte les demandes cross-origin depuis l'espace client

## Services affichés
Soudure, Sablage, Devoilage, Rénovation, Personnalisation, Hydrodipping (coming soon)

## Pages
- `/` Accueil (hero dynamique, services, comment ça marche, atelier, galerie, avis, app promo, CTA)
- `/services` Détails des 6 services
- `/galerie` Réalisations avant/après
- `/a-propos` À propos
- `/garanties` Garanties
- `/contact` Formulaire + coordonnées
- `/faq` FAQ dynamique
- `/admin` Panel admin sécurisé avec CRUD complet
- `/mentions-legales`, `/politique-confidentialite`

## Notes techniques
- Seed auto (server/seed.ts) : crée admin + données démo si vide, ajoute les clés manquantes à chaque redémarrage (idempotent)
- Logo hero supprimé (seul le navbar affiche le logo)
- WhatsApp géré par le bouton flottant global (plus dans Step 1)
- "garantie*" partout (pas de "Garantie 12 mois")
- "diamantage sur tour numérique" partout (pas de "Diamond cut")
- Lien espace client → appmyjantes.mytoolsgroup.eu
- Tailwind `auto-red/dark/light` utilisent des CSS variables pour le theming dynamique
