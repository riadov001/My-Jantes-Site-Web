// Chargement des variables d'environnement depuis .env (si présent)
try {
  require("dotenv").config();
} catch (e) {
  // dotenv non installé — les variables doivent être définies dans hPanel
}

// Lancement du serveur principal
require("./dist/index.cjs");
