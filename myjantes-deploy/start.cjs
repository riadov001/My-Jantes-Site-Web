const path = require("path");
const fs = require("fs");

// Charge le .env avec les modules natifs Node.js — aucune dépendance requise
const envPath = path.resolve(__dirname, ".env");
if (fs.existsSync(envPath)) {
  const lines = fs.readFileSync(envPath, "utf-8").split("\n");
  let count = 0;
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eqIdx = trimmed.indexOf("=");
    if (eqIdx === -1) continue;
    const key = trimmed.slice(0, eqIdx).trim();
    const val = trimmed.slice(eqIdx + 1).trim();
    // Ne charge que les valeurs non-vides et non déjà définies
    if (key && val && process.env[key] === undefined) {
      process.env[key] = val;
      count++;
    }
  }
  console.log("[start] .env chargé —", count, "variables");
} else {
  console.error("[start] ERREUR : fichier .env introuvable à", envPath);
  process.exit(1);
}

require("./dist/index.cjs");
