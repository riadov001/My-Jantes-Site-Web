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
- **Contenu du site** : éditer hero (badge, titre, sous-titre, CTA), stats (4 blocs), bande de confiance, coordonnées (téléphone, WhatsApp, adresse, email), titres des sections, typographie (choix police)

## Intégration externe (CORS)
- `appmyjantes.mytoolsgroup.eu` autorisé via CORS
- POST `/api/contact` accepte les demandes cross-origin depuis l'espace client
- Les demandes arrivent dans l'onglet Contacts/Devis de l'admin

## Services affichés
Soudure, Sablage, Devoilage, Rénovation, Personnalisation, Hydrodipping (coming soon)

## Réseaux sociaux (footer)
Instagram, Snapchat, Facebook, TikTok, Google Avis

## Pages
- `/` Accueil (hero avec logo agrandi, services, comment ça marche, atelier, galerie, avis, app promo, CTA)
- `/services` Détails des 6 services
- `/galerie` Réalisations avant/après
- `/a-propos` À propos
- `/garanties` Garanties
- `/contact` Formulaire + coordonnées
- `/faq` FAQ dynamique
- `/admin` Panel admin sécurisé avec CRUD complet
- `/mentions-legales`, `/politique-confidentialite`

## Notes techniques
- Seed auto (server/seed.ts) : crée admin + données démo si vide, rehash password au démarrage
- WhatsApp en Step 1 "Comment ça marche" (numéro 06.71.37.04.18) avec lien direct
- "garantie*" partout (pas de "Garantie 12 mois")
- "diamantage sur tour numérique" partout (pas de "Diamond cut")
- Lien espace client → appmyjantes.mytoolsgroup.eu
