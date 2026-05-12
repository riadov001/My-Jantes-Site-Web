# MyJantes — Guide de déploiement Hostinger

Site web complet (vitrine + admin) prêt à déployer.
**Stack :** Node.js 20 + Express + React + PostgreSQL.

---

## Contenu du dossier

```
myjantes-deploy/
├── dist/                    Application compilée (serveur + frontend)
│   ├── index.cjs            Point d'entrée du serveur
│   └── public/              Frontend React buildé
├── public/                  Assets statiques (fonts, médias)
├── shared/                  Schéma de base de données partagé
├── package.json             Dépendances Node
├── package-lock.json        Verrouillage des versions
├── drizzle.config.ts        Config ORM (migrations DB)
├── .env                     ✅ Variables d'environnement (DÉJÀ REMPLIES)
├── .env.production          Copie de sauvegarde
└── README-DEPLOIEMENT.md    Ce fichier
```

---

## Pré-requis Hostinger

1. **Plan compatible Node.js** : Premium / Business / Cloud / VPS
   (les hébergements mutualisés "Single" et anciens plans ne supportent pas Node).
2. **Node.js 20.x** disponible dans hPanel → Avancé → "Node.js".
3. **Base PostgreSQL** : Hostinger ne fournit que MySQL en mutualisé.
   ⚠️ **OBLIGATOIRE** : Vous devez créer une base PostgreSQL externe et renseigner `DATABASE_URL` dans le `.env`.
   - **Neon** (recommandé, gratuit) : https://neon.tech → "New Project" → copier la "Connection string".
   - **Supabase** (alternative gratuite) : https://supabase.com.
   Remplacez la valeur `DATABASE_URL` dans le fichier `.env` avant de déployer.
4. **Resend — domaine expéditeur** : Le domaine `no-replay.myjantes.fr` doit être **vérifié dans Resend**.
   Allez sur https://resend.com → Domains → Add Domain → suivez les instructions DNS.

---

## 🚀 Déploiement étape par étape

### 1. Téléverser le dossier

**Option A — File Manager (le plus simple)**
1. Connectez-vous à hPanel.
2. Allez dans **Fichiers → Gestionnaire de fichiers**.
3. Naviguez vers `domains/votre-domaine.fr/`.
4. Créez un dossier `myjantes` (ou utilisez `public_html` directement).
5. Compressez ce dossier `myjantes-deploy` en `.zip` puis téléversez-le.
6. Extrayez le zip dans le dossier cible.

**Option B — FTP (FileZilla, etc.)**
- Hôte FTP, identifiants disponibles dans hPanel → **Fichiers → Comptes FTP**.
- Téléversez tout le contenu de `myjantes-deploy/` dans le dossier cible.

### 2. Créer l'application Node.js

1. hPanel → **Avancé → Node.js** → **Créer une application**.
2. Renseignez :
   - **Version Node.js** : `20.x` (la plus récente disponible).
   - **Mode application** : `Production`.
   - **Racine de l'application** : `/home/USER/domains/votre-domaine.fr/myjantes`
     (ou le chemin où vous avez extrait les fichiers).
   - **URL de l'application** : `votre-domaine.fr` (ou un sous-domaine).
   - **Fichier de démarrage** : `dist/index.cjs`
3. Cliquez sur **Créer**.

### 3. Installer les dépendances

Dans la page Node.js de votre app :
1. Cliquez sur **Exécuter NPM Install**.
2. Attendez la fin (peut prendre 1-2 minutes).

### 4. Charger les variables d'environnement

Le fichier `.env` contient **toutes les variables déjà renseignées**, y compris `DATABASE_URL` (URL PostgreSQL Neon externe), `SESSION_SECRET`, `RESEND_API_KEY`, clés IA, etc.

**Deux options :**

**Option A — Garder le `.env`** (le plus simple)
Le serveur ne charge pas automatiquement `.env`. Pour l'activer, ajoutez en
haut de votre fichier `dist/index.cjs` (ou via NPM Install) :
```bash
npm install dotenv
```
Puis dans la page Node.js de hPanel → onglet **"Variables"**, cliquez sur
**"Importer depuis .env"** et sélectionnez le fichier.

**Option B — Saisir manuellement** (recommandée Hostinger)
Dans hPanel → Node.js → onglet **"Variables d'environnement"**, ajoutez
chaque clé/valeur depuis le fichier `.env` (ouvrez-le avec un éditeur de texte).

Variables à configurer dans hPanel (toutes présentes dans `.env`) :
- `DATABASE_URL` — URL PostgreSQL Neon (déjà renseignée)
- `SESSION_SECRET` — clé de session (déjà renseignée)
- `NODE_ENV` = `production`
- `PORT` (Hostinger l'injecte tout seul, généralement 3000 ou un port assigné)
- `SITE_URL` = `https://myjantes.fr` (déjà renseignée)

Variables optionnelles (mais déjà fournies) :
- `RESEND_API_KEY` + `RESEND_FROM_EMAIL` (envoi des e-mails formulaire)
- `AI_INTEGRATIONS_GEMINI_API_KEY` (OCR carte grise)

### 5. Démarrer l'application

1. hPanel → Node.js → cliquez sur **Démarrer l'application**.
2. Visitez `https://votre-domaine.fr` — le site doit s'afficher.
3. Visitez `https://votre-domaine.fr/admin` :
   - **Identifiant** : `contact@myjantes.com`
   - **Mot de passe** : `MyJantes@2026!*`

### 6. Vérifications post-déploiement

- [ ] Page d'accueil charge avec le bon design.
- [ ] Navigation entre les pages fonctionne.
- [ ] Formulaire `/contact` envoie un e-mail (testez avec votre adresse).
- [ ] Login admin fonctionne, et les onglets Contacts / Galerie / Avis / FAQ
      affichent des données.
- [ ] Les polices personnalisées (Bebas, Eurostile) s'affichent.

---

## 🔄 Mise à jour du site

Quand vous modifiez quelque chose :
1. Reconstruisez localement : `npm run build`
2. Téléversez à nouveau `dist/` (et `public/` si modifié).
3. Dans hPanel → Node.js → **Redémarrer l'application**.

Pas besoin de relancer NPM Install sauf si `package.json` a changé.

---

## 🛠️ Dépannage

### "Application failed to start"
- Consultez les logs Node.js dans hPanel.
- Vérifiez que `DATABASE_URL` est bien défini et accessible.
- Vérifiez la version de Node.js (doit être ≥ 18, idéalement 20).

### "ECONNREFUSED" vers la base
- Votre IP Hostinger est peut-être bloquée par Neon.
- Allez sur Neon Console → Settings → IP Allow → ajoutez `0.0.0.0/0`
  (ou les IPs de Hostinger).

### Page blanche sur `/`
- Vérifiez que `dist/public/index.html` existe bien dans le dossier déployé.
- Les chemins de polices sont en `/fonts/...` — assurez-vous que
  le dossier `public/fonts/` est bien présent.

### Sessions perdues à chaque rafraîchissement
- Vérifiez que la table `session` existe en base.
  Elle est créée automatiquement au premier démarrage.
- Vérifiez que `SESSION_SECRET` est défini.

### Les e-mails ne partent pas
- Vérifiez `RESEND_API_KEY`.
- Vérifiez que le domaine `myjantes.fr` est bien vérifié dans Resend.
- Consultez le dashboard Resend pour voir les logs d'envoi.

---

## 📞 Identifiants admin par défaut

- **URL** : `https://votre-domaine.fr/admin`
- **Identifiant** : `contact@myjantes.com`
- **Mot de passe** : `MyJantes@2026!*`

⚠️ **Changez ce mot de passe** après le premier login (onglet "Sécurité").

---

## 📂 Données initiales

Au premier démarrage, le serveur exécute automatiquement un script de seed :
- Crée le compte admin par défaut.
- Insère les **8 services** (Soudure, Sablage, Devoilage, Usinage, Tribofinition, Rénovation, Personnalisation, Hydrodipping) avec les tarifs à jour.
- Insère les FAQ, témoignages, et contenus du site (si vide).
- Crée la table `session` pour les connexions.

C'est idempotent : ça ne dupliquera jamais les données existantes.

---

## 🗓️ Informations de build

| | |
|---|---|
| **Date du build** | 12 mai 2026 |
| **Nouveautés** | +2 services (Usinage CNC, Tribofinition), section Tarifs, Espace Client Pro, email confirmation client |
| **Fichier serveur** | `dist/index.cjs` (2 Mo) |
| **Frontend** | `dist/public/` (18 Mo avec assets) |
