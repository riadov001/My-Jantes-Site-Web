# MyJantes — Guide de déploiement Hostinger

Dossier **100% prêt à déployer** sur Hostinger Node.js.
Stack : Node.js 20 · Express · React (pré-compilé) · PostgreSQL Neon.

---

## Contenu du dossier

```
myjantes-hostinger/
├── dist/
│   ├── index.cjs          Serveur Express compilé (tout inclus)
│   └── public/            Frontend React compilé (HTML + CSS + JS)
├── public/
│   ├── fonts/             Polices personnalisées (Eurostile, etc.)
│   └── media/             Vidéos et médias statiques
├── uploads/               Dossier des photos uploadées par les clients
├── start.cjs              Script de démarrage (charge .env + lance le serveur)
├── package.json           Dépendances runtime uniquement
├── .env                   Variables d'environnement (pré-remplies)
└── README-DEPLOIEMENT.md  Ce guide
```

---

## Pré-requis Hostinger

- Plan **Premium, Business, Cloud ou VPS** (les mutualisés basiques ne supportent pas Node.js).
- Section **hPanel → Avancé → Node.js** disponible.
- Node.js **20.x** (ou 18.x minimum).

---

## Déploiement — Étape par étape

### 1. Téléverser les fichiers

**Option A — Via le Gestionnaire de fichiers hPanel (recommandé)**

1. Connectez-vous à hPanel.
2. Allez dans **Fichiers → Gestionnaire de fichiers**.
3. Naviguez vers le dossier de votre domaine (ex : `domains/myjantes.fr/`).
4. Créez un sous-dossier `app` (ou utilisez la racine directement).
5. **Téléversez le fichier `myjantes-hostinger.zip`** dans ce dossier.
6. Cliquez droit sur le zip → **Extraire** → extraire dans le dossier courant.
7. Vérifiez que vous avez bien : `start.cjs`, `package.json`, `.env`, `dist/`, `public/`, `uploads/`.

**Option B — Via FTP (FileZilla)**

- Identifiants FTP disponibles dans **hPanel → Fichiers → Comptes FTP**.
- Transférez tout le contenu de `myjantes-hostinger/` vers votre dossier cible.

---

### 2. Créer l'application Node.js dans hPanel

1. Dans hPanel, allez dans **Avancé → Node.js**.
2. Cliquez sur **"Créer une application"**.
3. Remplissez :

| Champ | Valeur |
|---|---|
| Version Node.js | `20.x` (ou la plus récente dispo) |
| Mode | `Production` |
| Racine de l'application | Chemin vers votre dossier (ex: `/home/u123456/domains/myjantes.fr/app`) |
| URL de l'application | `votre-domaine.fr` ou sous-domaine |
| Fichier de démarrage | `start.cjs` |

4. Cliquez sur **Créer**.

---

### 3. Installer les dépendances

Sur la page de votre application Node.js dans hPanel :

1. Cliquez sur **"Exécuter NPM Install"** (ou "Run NPM Install").
2. Attendez 1-3 minutes que l'installation se termine.

---

### 4. Variables d'environnement

Le fichier `.env` est **déjà rempli** avec les vraies valeurs de votre base Neon et Resend.

**Méthode recommandée sur Hostinger — Saisir dans hPanel :**

Dans hPanel → Node.js → onglet **"Variables d'environnement"**, ajoutez chaque ligne :

```
NODE_ENV          production
PORT              3000
DATABASE_URL      postgresql://neondb_owner:npg_3ukK6RxencLs@ep-orange-mountain-aq1wcq60.c-8.us-east-1.aws.neon.tech/neondb?sslmode=require
PROD_DB_URL       postgresql://neondb_owner:npg_3ukK6RxencLs@ep-orange-mountain-aq1wcq60.c-8.us-east-1.aws.neon.tech/neondb?sslmode=require
SESSION_SECRET    haFb0NsA2UO4s8xaJMQvR1mudrzEjwtLtp9drGTtiF6T/FQ9SSEA56K25sCsm/r4R5OQoggwEqBFmBTL3dvGDQ==
RESEND_API_KEY    re_eGAAcDNX_FYFsTFkEvXAdCXRa7bbY7RQC
RESEND_FROM_EMAIL contact@no-replay.myjantes.fr
ADMIN_EMAIL       contact@myjantes.com
GOOGLE_API_KEY    AIzaSyAFrLP8PP5PV4xm2d0Qe5Gdp8dg9CsvPOw
SITE_URL          https://myjantes.fr
```

> Remplacez `https://votre-domaine.fr` par votre vrai domaine.

**Alternative — garder le fichier `.env` :**
Le `start.cjs` charge automatiquement le `.env` si présent. Ouvrez le fichier `.env`
et remplacez `https://votre-domaine.fr` par votre vrai domaine. Aucune autre modification nécessaire.

---

### 5. Démarrer l'application

1. Dans hPanel → Node.js → cliquez sur **"Démarrer"** (ou Restart).
2. Visitez `https://votre-domaine.fr` — le site doit s'afficher immédiatement.

---

### 6. Vérifications post-déploiement

- [ ] Page d'accueil s'affiche avec le bon design (jantes, rouge/noir).
- [ ] Les polices Eurostile s'affichent correctement.
- [ ] Navigation entre les pages fonctionne (Services, Réalisations, Contact).
- [ ] Formulaire `/contact` : remplissez et soumettez → vérifiez réception email.
- [ ] Login admin sur `/admin` :
  - **Identifiant** : `contact@myjantes.com`
  - **Mot de passe** : `MyJantes@2026!*`
- [ ] L'onglet **Contacts** dans l'admin affiche la demande de test.
- [ ] Galerie, Témoignages, FAQ visibles dans l'admin.

> ⚠️ **Changez le mot de passe admin** après le premier login (onglet "Sécurité").

---

## Base de données

La base de données est hébergée sur **Neon PostgreSQL** (cloud, externe).
Elle est déjà configurée avec toutes les tables et les données initiales (services, FAQ, témoignages).

- **Accès console Neon** : https://console.neon.tech
- Si vous avez une erreur `ECONNREFUSED` ou connexion refusée :
  → Allez sur Neon Console → Settings → **IP Allow** → ajoutez `0.0.0.0/0`.

---

## Mise à jour du site

Quand vous modifiez le code source sur Replit :

1. Lancez `npm run build` sur Replit.
2. Téléversez à nouveau le dossier `dist/` (via FTP ou File Manager).
3. Dans hPanel → Node.js → **Redémarrer l'application**.

---

## Dépannage

### "Application failed to start" / logs d'erreur
- Consultez les logs Node.js dans hPanel → Node.js → Logs.
- Vérifiez que `DATABASE_URL` est bien défini et accessible.
- Vérifiez que Node.js est en version 18 ou 20.

### Page blanche sur `/`
- Vérifiez que `dist/public/index.html` existe.
- Vérifiez que le fichier de démarrage est bien `start.cjs`.

### "Cannot find module '...'"
- Relancez **NPM Install** dans hPanel.
- Vérifiez que `package.json` est présent à la racine de l'app.

### Les polices ne s'affichent pas
- Vérifiez que le dossier `public/fonts/` est bien présent.
- Les polices sont servies depuis `/fonts/...` via Express.

### Les emails ne partent pas
- Vérifiez `RESEND_API_KEY` dans les variables d'environnement.
- Vérifiez que le domaine expéditeur (`myjantes.fr`) est vérifié dans Resend.
- Consultez le dashboard Resend : https://resend.com/emails

### Sessions perdues / admin déconnecté à chaque refresh
- Vérifiez que `SESSION_SECRET` est bien défini.
- La table `session` est créée automatiquement au démarrage.
- Vérifiez que les cookies `sameSite: none` fonctionnent (HTTPS requis en prod).

---

## Identifiants par défaut

| | |
|---|---|
| **URL admin** | `https://votre-domaine.fr/admin` |
| **Identifiant** | `contact@myjantes.com` |
| **Mot de passe** | `MyJantes@2026!*` |

> Changez le mot de passe immédiatement après le premier login.

---

## Informations techniques

- **Serveur** : Express 5 (Node.js)
- **Frontend** : React 18 + Vite (pré-compilé, statique)
- **Base de données** : PostgreSQL via Neon (ORM : Drizzle)
- **Emails** : Resend API
- **Uploads photos** : dossier local `uploads/`
- **Port par défaut** : `3000` (Hostinger l'assigne automatiquement via `PORT`)
