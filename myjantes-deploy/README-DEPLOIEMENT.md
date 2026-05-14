# MyJantes — Guide de déploiement Hostinger

Site web complet (vitrine + admin) prêt à déployer.
**Stack :** Node.js 20 + Express + React + PostgreSQL.

---

## Contenu du dossier

```
myjantes-deploy/
├── dist/                    Application compilée (serveur + frontend)
│   ├── index.cjs            Serveur Node.js bundlé (1,6 Mo)
│   └── public/              Frontend React buildé (18 Mo avec assets)
├── public/                  Assets statiques (polices locales)
│   └── fonts/               EurostileExtended, BebasNeue, etc.
├── shared/                  Schéma de base de données partagé
├── uploads/                 Médias uploadés depuis l'admin
├── database-schema.sql      ✅ Script SQL de création de toutes les tables
├── start.cjs                ✅ Point d'entrée — charge .env puis démarre le serveur
├── package.json             Dépendances Node (inclut dotenv)
├── package-lock.json        Verrouillage des versions
├── drizzle.config.ts        Config ORM (migrations DB)
├── .env                     ✅ Variables d'environnement (DÉJÀ REMPLIES)
├── BUILD-MANIFEST.md        Informations de build
└── README-DEPLOIEMENT.md    Ce fichier
```

---

## Pré-requis Hostinger

1. **Plan compatible Node.js** : Premium / Business / Cloud / VPS
   (les hébergements mutualisés "Single" et anciens plans ne supportent pas Node).
2. **Node.js 20.x** disponible dans hPanel → Avancé → "Node.js".
3. **Base PostgreSQL externe** : Hostinger ne fournit que MySQL en mutualisé.
   ✅ La base Neon est déjà configurée dans le `.env` — rien à faire.
4. **Resend — domaine expéditeur** : Le domaine `no-replay.myjantes.fr` doit être **vérifié dans Resend**.
   Allez sur https://resend.com → Domains → vérifiez que `no-replay.myjantes.fr` est actif (DNS TXT configurés).

---

## Déploiement étape par étape

### 1. Téléverser le dossier

**Option A — File Manager (le plus simple)**
1. Connectez-vous à hPanel.
2. Allez dans **Fichiers → Gestionnaire de fichiers**.
3. Naviguez vers `domains/myjantes.fr/`.
4. Téléversez le fichier `myjantes-deploy.zip`.
5. Extrayez le zip dans un dossier `app` (ou directement à la racine du domaine).

**Option B — FTP (FileZilla, etc.)**
- Hôte FTP, identifiants disponibles dans hPanel → **Fichiers → Comptes FTP**.
- Téléversez tout le contenu de `myjantes-deploy/` dans le dossier cible.

### 2. Créer l'application Node.js

1. hPanel → **Avancé → Node.js** → **Créer une application**.
2. Renseignez :
   - **Version Node.js** : `20.x` (la plus récente disponible).
   - **Mode application** : `Production`.
   - **Racine de l'application** : chemin vers le dossier où les fichiers ont été uploadés
     (ex. : `/home/USER/domains/myjantes.fr/app`)
   - **URL de l'application** : `myjantes.fr`
   - **Fichier de démarrage** : `start.cjs`
3. Cliquez sur **Créer**.

### 3. Installer les dépendances

Dans la page Node.js de votre app :
1. Cliquez sur **Exécuter NPM Install**.
2. Attendez la fin (peut prendre 1-2 minutes).

### 4. Variables d'environnement

Le fichier `.env` est **déjà rempli avec toutes les valeurs** et sera chargé
automatiquement par `start.cjs` via dotenv au démarrage. Aucune saisie manuelle
n'est nécessaire dans hPanel.

> ⚠️ Si vous préférez ne pas utiliser le `.env`, vous pouvez copier-coller les
> variables dans hPanel → Node.js → onglet **"Variables d'environnement"**.

**Récapitulatif des variables clés (toutes présentes dans `.env`) :**

| Variable | Statut | Description |
|---|---|---|
| `DATABASE_URL` | ✅ Renseignée | URL PostgreSQL Neon externe |
| `SESSION_SECRET` | ✅ Renseignée | Clé de session Express |
| `NODE_ENV` | ✅ `production` | Mode production |
| `SITE_URL` | ✅ `https://myjantes.fr` | URL du site |
| `RESEND_API_KEY` | ✅ Renseignée | Clé Resend pour l'envoi d'emails |
| `RESEND_FROM_EMAIL` | ✅ Renseignée | Expéditeur email (`contact@no-replay.myjantes.fr`) |
| `ADMIN_EMAIL` | ✅ `contact@myjantes.com` | Email de notification admin |

> ⚠️ **Email** : Le domaine `no-replay.myjantes.fr` doit être **vérifié dans Resend**
> pour que les emails partent. Allez sur https://resend.com → Domains → vérifiez que
> `no-replay.myjantes.fr` est bien actif (DNS TXT/MX configurés).

### 5. Démarrer l'application

1. hPanel → Node.js → cliquez sur **Démarrer l'application**.
2. Visitez `https://myjantes.fr` — le site doit s'afficher.
3. Visitez `https://myjantes.fr/admin` :
   - **Identifiant** : `contact@myjantes.com`
   - **Mot de passe** : `MyJantes@2026!*`

> Astuce : Si le site ne démarre pas, vérifiez dans les logs hPanel que le
> fichier de démarrage est bien `start.cjs` (et non `dist/index.cjs` ou `server.js`).

### 6. Vérifications post-déploiement

- [ ] Page d'accueil charge avec le bon design (polices Mishorma + Exo 2).
- [ ] Le bouton "Devis gratuit" en navbar redirige vers `/contact#formulaire`.
- [ ] Navigation entre les pages fonctionne (Services, Galerie, À propos, Contact, FAQ).
- [ ] Formulaire `/contact#formulaire` envoie un e-mail (testez avec votre adresse).
  - Vous devez recevoir une notification admin ET une confirmation client.
- [ ] Login admin `/admin` fonctionne avec les identifiants ci-dessus.
- [ ] Onglets admin : Contacts / Galerie / Prestations / Avis / FAQ / Contenu s'affichent.
- [ ] Les 5 avis Google statiques s'affichent sur l'accueil et la page À propos.
- [ ] Le lien "Laisser un avis sur Google" redirige vers le bon lien Google.

---

## Mise à jour du site

Quand vous modifiez quelque chose sur Replit :
1. Reconstruisez : le dossier `myjantes-deploy` et le zip sont régénérés automatiquement.
2. Téléversez à nouveau `dist/` (et `public/` si les polices changent).
3. Dans hPanel → Node.js → **Redémarrer l'application**.

Pas besoin de relancer NPM Install sauf si `package.json` a changé.

---

## Dépannage

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
- Assurez-vous que le dossier `public/fonts/` est bien présent (polices locales).

### Sessions perdues à chaque rafraîchissement
- Vérifiez que la table `session` existe en base (créée automatiquement au 1er démarrage).
- Vérifiez que `SESSION_SECRET` est défini.

### Les e-mails ne partent pas
- Vérifiez `RESEND_API_KEY`.
- Vérifiez que le domaine `no-replay.myjantes.fr` est bien vérifié dans Resend.
- Consultez le dashboard Resend → Logs pour voir les tentatives d'envoi.

### Les polices ne s'affichent pas (Mishorma, Exo 2)
- Mishorma est chargée depuis un CDN externe (cdnfonts.com) — connexion internet requise.
- Exo 2 est chargée depuis Google Fonts — connexion internet requise.
- Les polices locales (Eurostile, Bebas) sont dans `public/fonts/`.

---

## Identifiants admin par défaut

- **URL** : `https://myjantes.fr/admin`
- **Identifiant** : `contact@myjantes.com`
- **Mot de passe** : `MyJantes@2026!*`

⚠️ **Changez ce mot de passe** après le premier login (Admin → Sécurité → Changer le mot de passe).

---

## Données initiales

Au premier démarrage, le serveur exécute automatiquement un script de seed :
- Crée le compte admin par défaut.
- Insère les **8 services** (Soudure, Sablage, Devoilage, Usinage, Tribofinition, Rénovation, Personnalisation, Hydrodipping) avec les tarifs.
- Insère 5 témoignages clients, les FAQ, et tous les contenus CMS.
- Crée la table `session` pour les connexions.

C'est idempotent : ça ne dupliquera jamais les données existantes.

---

## Base de données — initialisation manuelle (optionnel)

Le serveur crée automatiquement toutes les tables au premier démarrage.
Si vous souhaitez les créer manuellement (ex. : depuis Neon SQL Editor), utilisez le fichier `database-schema.sql` :

1. Ouvrez [console.neon.tech](https://console.neon.tech) → votre projet → onglet **SQL Editor**.
2. Copiez-collez le contenu de `database-schema.sql`.
3. Exécutez. Toutes les tables seront créées (idempotent — sans risque si elles existent déjà).

Tables créées : `session`, `users`, `activity_logs`, `contact_requests`, `blog_posts`,
`gallery_items`, `testimonials`, `faq_items`, `site_services`, `site_content`,
`page_views`, `media_files`, `conversations`, `messages`.
