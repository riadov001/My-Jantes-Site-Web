# Build Manifest — MyJantes Production

Généré automatiquement lors du build de production.

## Informations de build

| Champ | Valeur |
|---|---|
| **Date** | 20 mai 2026 |
| **Commande** | `npm run build` (tsx script/build.ts) |
| **Statut** | ✅ Succès — aucune erreur bloquante |

## Artefacts générés

### Serveur (`dist/index.cjs`)
| | |
|---|---|
| **Taille** | 2 012 084 octets (≈ 1,9 Mo) |
| **SHA-256** | `44a572db5c23e08eac8ef43ce8901feff05cc504b67c93f6b7575ff430ecb705` |
| **Format** | CommonJS (esbuild bundlé) |
| **Entrée** | `server/index.ts` |

### Frontend (`dist/public/`)
| Fichier | Taille |
|---|---|
| `index.html` | 9,58 kB |
| `assets/index-Dj6mrKb8.css` | 124,80 kB (gzip: ~18,8 kB) |
| `assets/index-ChHU7lFU.js` | 1 033,88 kB (gzip: ~293 kB) |
| `images/` | 18 fichiers statiques |
| **Total** | ≈ 18 Mo |

## Variables d'environnement (.env) — statut

| Variable | Statut |
|---|---|
| `DATABASE_URL` | ✅ URL PostgreSQL externe Neon (renseignée) |
| `PROD_DB_URL` | ✅ URL PostgreSQL production (prioritaire en prod) |
| `SESSION_SECRET` | ✅ Présent |
| `NODE_ENV` | ✅ `production` |
| `SITE_URL` | ✅ `https://myjantes.fr` |
| `RESEND_API_KEY` | ✅ Présent |
| `RESEND_FROM_EMAIL` | ✅ `MyJantes <contact@apps.myjantes.fr>` |
| `ADMIN_EMAIL` | ✅ Présent |
| `GOOGLE_API_KEY` | ✅ Présent (Google Reviews) |
| `GEMINI_API_KEY` | ✅ Présent (chatbot IA) |

## Changements depuis le build précédent (14 mai 2026)

- ✅ **Email expéditeur** : `contact@apps.myjantes.fr` (principal) avec fallback automatique sur `contact@myjantes.mytoolsgroup.eu` si le domaine principal est rejeté
- ✅ **Variable `RESEND_FROM_EMAIL`** : ajoutée et configurée
- ✅ **Chatbot IA Gemini** (`gemini-2.5-flash`) : widget flottant sur toutes les pages publiques, assistant spécialisé MyJantes
- ✅ **Routes chatbot** enregistrées (`/api/conversations`, `/api/conversations/:id/messages`)
- ✅ **Logique fallback email** : réessai automatique avec domaine secondaire en cas d'erreur domaine/403/422

## Fichiers inclus dans ce dossier

```
myjantes-deploy/
├── dist/
│   ├── index.cjs              Serveur Node.js compilé (1,9 Mo)
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
├── uploads/                   Médias uploadés depuis l'admin
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
