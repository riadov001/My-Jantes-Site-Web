# Build Manifest — MyJantes Production

Généré automatiquement lors du build de production.

## Informations de build

| Champ | Valeur |
|---|---|
| **Date** | 12 mai 2026 |
| **Commande** | `npm run build` (tsx script/build.ts) |
| **Statut** | ✅ Succès — aucune erreur bloquante |

## Artefacts générés

### Serveur (`dist/index.cjs`)
| | |
|---|---|
| **Taille** | 2 012 430 octets (≈ 2 Mo) |
| **SHA-256** | `171693acb9425deea6e468fb41026099371c3229a11bb5bc4df97cee5a9d45e9` |
| **Format** | CommonJS (esbuild bundlé) |
| **Entrée** | `server/index.ts` |

### Frontend (`dist/public/`)
| Fichier | Taille |
|---|---|
| `index.html` | 9,43 kB |
| `assets/index-CtiTsll1.css` | 126,01 kB (gzip: 19,01 kB) |
| `assets/index-DUH7EdVl.js` | 1 027,89 kB (gzip: 290,67 kB) |
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

## Nouveautés incluses dans ce build

- **2 nouveaux services** : Usinage (CNC, sortOrder 4) et Tribofinition (sortOrder 5)
- **Prix mis à jour** : Soudure 90€, Sablage 70€, Devoilage 90€, Rénovation 109€, Personnalisation 119€
- **Section Tarifs** ajoutée en page d'accueil (fond sombre, 5 prestations)
- **Section Atelier** : vidéo remplacée par image statique
- **Espace Client Pro** : badge, titre et texte reformulés pour les professionnels
- **Footer** : "Espace Client Pro — Pros uniquement"
- **Email confirmation client** : envoyé automatiquement à chaque soumission du formulaire contact

## Prêt au déploiement

Toutes les variables d'environnement sont renseignées, y compris `DATABASE_URL` (URL Neon externe).
Uploader le contenu de `myjantes-deploy/` sur Hostinger et démarrer l'application Node.js avec `dist/index.cjs`.
