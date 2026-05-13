# Build Manifest — MyJantes Production

Généré automatiquement lors du build de production.

## Informations de build

| Champ | Valeur |
|---|---|
| **Date** | 13 mai 2026 |
| **Commande** | `npm run build` (tsx script/build.ts) |
| **Statut** | ✅ Succès — aucune erreur bloquante |

## Artefacts générés

### Serveur (`dist/index.cjs`)
| | |
|---|---|
| **Taille** | 2 013 840 octets (≈ 1,9 Mo) |
| **SHA-256** | `35ad672d89d5f5b33dcd5c03d28bc3bbd76cc9382bc2f2ef09774fcc7d7b135c` |
| **Format** | CommonJS (esbuild bundlé) |
| **Entrée** | `server/index.ts` |

### Frontend (`dist/public/`)
| Fichier | Taille |
|---|---|
| `index.html` | 9,43 kB |
| `assets/index-B3rHBRd_.css` | 126,22 kB (gzip: 19,04 kB) |
| `assets/index-DcAATfRB.js` | 1 036,12 kB (gzip: 292,55 kB) |
| `images/` | 18 fichiers statiques |
| **Total** | ≈ 18 Mo |

## Variables d'environnement (.env) — statut

| Variable | Statut |
|---|---|
| `DATABASE_URL` | ✅ URL PostgreSQL externe Neon (renseignée depuis PROD_DB_URL) |
| `SESSION_SECRET` | ✅ Présent |
| `NODE_ENV` | ✅ `production` |
| `SITE_URL` | ✅ `https://myjantes.fr` |
| `RESEND_API_KEY` | ✅ Présent |
| `RESEND_FROM_EMAIL` | ✅ `MyJantes <contact@no-replay.myjantes.fr>` |
| `ADMIN_EMAIL` | ✅ `contact@myjantes.fr` |

## Nouveautés incluses dans ce build (mise à jour 13 mai 2026)

- **Réseaux sociaux réels** : liens Instagram, Facebook, Snapchat, TikTok, Google Avis dans le footer
- **Avis Google réels** : intégration API Google Places (Place ID configurable depuis l'admin CMS)
- **google_review_url** sur les témoignages : lien vers l'avis Google d'origine
- **Page contact** : texte du domaine géré dynamiquement via CMS
- **Script SQL ajouté** : `database-schema.sql` — création manuelle des tables si nécessaire
- *(build du 12 mai)* 2 nouveaux services : Usinage CNC et Tribofinition
- *(build du 12 mai)* Section Tarifs, Espace Client Pro, email confirmation client

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
├── public/                    Assets statiques (fonts)
├── database-schema.sql        ✅ Script SQL de création de toutes les tables
├── package.json               Dépendances Node
├── package-lock.json          Verrouillage des versions
├── drizzle.config.ts          Config ORM
├── .env                       Variables d'environnement (DÉJÀ REMPLIES)
├── .env.production            Copie de sauvegarde
├── BUILD-MANIFEST.md          Ce fichier
└── README-DEPLOIEMENT.md      Guide de déploiement complet
```

## Prêt au déploiement

Toutes les variables d'environnement sont renseignées, y compris `DATABASE_URL` (URL Neon externe).
Les tables sont créées automatiquement au premier démarrage. Le fichier `database-schema.sql`
permet une initialisation manuelle si besoin (Neon SQL Editor, psql, etc.).
Uploader le contenu de `myjantes-deploy/` sur Hostinger et démarrer avec `dist/index.cjs`.
