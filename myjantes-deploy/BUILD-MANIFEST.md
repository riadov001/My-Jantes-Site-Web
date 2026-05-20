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
| **Taille** | 2 033 637 octets (≈ 1,9 Mo) |
| **SHA-256** | `2759c5422ca2e29df1f69e640c54d4d5219ab4349be71df0114ba282c77e30ef` |
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

| Variable | Statut | Description |
|---|---|---|
| `DATABASE_URL` | ✅ Renseignée | URL PostgreSQL Neon production |
| `PROD_DB_URL` | ✅ Renseignée | Même URL (prioritaire en prod) |
| `SESSION_SECRET` | ✅ Présent | Clé de chiffrement sessions |
| `NODE_ENV` | ✅ `production` | Mode production |
| `SITE_URL` | ✅ `https://myjantes.fr` | URL publique du site |
| `RESEND_API_KEY` | ✅ Présent | Clé Resend pour l'envoi d'emails |
| `RESEND_FROM_EMAIL` | ✅ `MyJantes <contact@apps.myjantes.fr>` | Expéditeur email |
| `ADMIN_EMAIL` | ✅ Présent | Email de notification admin |
| `GEMINI_API_KEY` | ⚠️ À remplir | Clé Google AI Studio pour le chatbot |

> **Note chatbot IA** : Sur Replit, l'intégration native Gemini est utilisée (aucune clé requise).
> Sur Hostinger, renseignez `GEMINI_API_KEY` depuis https://aistudio.google.com/apikey.

## Changements depuis le build précédent (14 mai 2026)

- ✅ **BDD production** : nouvelle URL Neon (`ep-cold-cherry-aqtge5ff`) dans `DATABASE_URL` et `PROD_DB_URL`
- ✅ **Reconnexion automatique Neon** : retry exponentiel (jusqu'à 4 tentatives) si l'endpoint est en veille
- ✅ **Email expéditeur** : `contact@apps.myjantes.fr` + fallback auto `myjantes.mytoolsgroup.eu`
- ✅ **Chatbot IA Gemini** (`gemini-2.5-flash`) : widget flottant, streaming SSE, prompt MyJantes
- ✅ **Intégration native Replit Gemini** : plus besoin de clé perso sur Replit (crédits Replit)

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
├── start.cjs                  ✅ Point d'entrée — charge .env puis démarre le serveur
├── package.json               Dépendances Node
├── package-lock.json          Verrouillage des versions
├── drizzle.config.ts          Config ORM
├── .env                       Variables d'environnement (DÉJÀ REMPLIES — sauf GEMINI_API_KEY)
├── BUILD-MANIFEST.md          Ce fichier
└── README-DEPLOIEMENT.md      Guide de déploiement complet
```

## Prêt au déploiement

Uploadez le contenu de `myjantes-deploy/` sur Hostinger, renseignez `GEMINI_API_KEY` dans le `.env`,
puis démarrez avec `start.cjs`. Les tables sont créées automatiquement au premier démarrage.
