// Point d'entrée Hostinger — charge les variables d'environnement depuis .env
// puis démarre le serveur Node.js compilé.
// Fichier de démarrage à configurer dans hPanel → Node.js : start.cjs
try { require("dotenv").config(); } catch (e) {}
require("./dist/index.cjs");
