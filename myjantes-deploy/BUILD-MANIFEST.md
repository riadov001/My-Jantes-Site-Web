# Build Manifest — MyJantes Production

Généré automatiquement lors du build de production.

## Informations de build

| Champ | Valeur |
|---|---|
| **Date** | 14 mai 2026 |
| **Commande** | `npm run build` (tsx script/build.ts) |
| **Statut** | ✅ Succès — aucune erreur bloquante |

## Artefacts générés

### Serveur (`dist/index.cjs`)
| | |
|---|---|
| **Taille** | 1 687 780 octets (≈ 1,6 Mo) |
| **SHA-256** | `7ed0f18d3911471c1919fdb2648edb82b1b9881067bbb5da43f66b71858b0f38` |
| **Format** | CommonJS (esbuild bundlé) |
| **Entrée** | `server/index.ts` |

### Frontend (`dist/public/`)
| Fichier | Taille |
|---|---|
| `index.html` | 9,58 kB |
| `assets/index-B0UNObHA.css` | 120,73 kB (gzip: ~18,6 kB) |
| `assets/index-B_n8ZOxp.js` | 1 003,28 kB (gzip: ~291 kB) |
| `images/` | 18 fichiers statiques |
| **Total** | ≈ 18 Mo |

## Variables d'environnement (.env) — statut

| Variable | Statut |
|---|---|
| `DATABASE_URL` | ✅ URL PostgreSQL externe Neon (renseignée) |
| `SESSION_SECRET` | ✅ Présent |
| `NODE_ENV` | ✅ `production` |
| `SITE_URL` | ✅ `https://myjantes.fr` |
| `RESEND_API_KEY` | ✅ Présent |
| `RESEND_FROM_EMAIL` | ✅ `MyJantes <contact@no-replay.myjantes.fr>` |
| `ADMIN_EMAIL` | ✅ `contact@myjantes.com` |

> Variables supprimées par rapport au build précédent : `GEMINI_API_KEY`, `GOOGLE_API_KEY`
> (chatbot IA et OCR supprimés du site).

## Nouveautés incluses dans ce build (14 mai 2026)

- **Chatbot IA supprimé** : plus de bouton chatbot flottant, route `/api/chatbot` retirée
- **OCR Gemini supprimé** : plus d'analyse de carte grise par IA, route `/api/ocr` retirée
- **Bouton "Devis gratuit"** : redirige maintenant vers `/contact#formulaire` (scroll direct sur le formulaire)
- **Page contact restructurée** : formulaire en premier (`id="formulaire"`), strip horaires + adresse sous le formulaire
- **5 avis Google statiques** : section avis toujours visible (Cédric, David, Aurélien, Aurore, Mickaël)
- **CTA "Laisser un avis Google"** : bouton avec logo Google sur l'accueil et À propos
- **Polices** : Mishorma (titres) + Exo 2 (texte corps) configurées via CMS
- **Tailwind** : `font-sans` → `var(--font-sans)`, `font-heading` → `var(--font-heading)` (dynamiques)
- **garanties.tsx** : CTA "Nous contacter" → `/contact#formulaire`
- **nav.cta_href** : forcé à `/contact#formulaire` en base de données via seed
- **footer.social_google** : lien avis Google réel configuré

## Fichiers inclus dans ce dossier

```
myjantes-deploy/
├── dist/
│   ├── index.cjs              Serveur Node.js compilé (1,6 Mo)
│   └── public/                Frontend React buildé
│       ├── index.html
│       ├── assets/            CSS + JS bundlés
│       ├── images/            18 images statiques
│       ├── robots.txt
│       └── sitemap.xml
├── shared/
│   └── schema.ts              Schéma Drizzle ORM (référence)
├── public/                    Assets statiques (polices locales)
│   └── fonts/                 EurostileExtended, BebasNeue, etc.
├── uploads/                   Médias uploadés depuis l'admin (4 fichiers)
├── database-schema.sql        ✅ Script SQL de création de toutes les tables
├── package.json               Dépendances Node
├── package-lock.json          Verrouillage des versions
├── drizzle.config.ts          Config ORM
├── .env                       Variables d'environnement (DÉJÀ REMPLIES)
├── BUILD-MANIFEST.md          Ce fichier
└── README-DEPLOIEMENT.md      Guide de déploiement complet
```

## Prêt au déploiement

Toutes les variables d'environnement sont renseignées, y compris `DATABASE_URL` (URL Neon externe).
Les tables sont créées automatiquement au premier démarrage. Le fichier `database-schema.sql`
permet une initialisation manuelle si besoin (Neon SQL Editor, psql, etc.).
Uploader le contenu de `myjantes-deploy/` sur Hostinger et démarrer avec `start.cjs`.
