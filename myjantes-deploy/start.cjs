const path = require("path");
const fs = require("fs");

// Charge le .env avec les modules natifs Node.js — aucune dépendance externe requise
const envPath = path.resolve(__dirname, ".env");
if (fs.existsSync(envPath)) {
  const lines = fs.readFileSync(envPath, "utf-8").split("\n");
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eqIdx = trimmed.indexOf("=");
    if (eqIdx === -1) continue;
    const key = trimmed.slice(0, eqIdx).trim();
    const val = trimmed.slice(eqIdx + 1).trim();
    if (key && process.env[key] === undefined) {
      process.env[key] = val;
    }
  }
  console.log("[start] .env chargé depuis", envPath);
} else {
  console.warn("[start] Fichier .env introuvable:", envPath);
}

require("./dist/index.cjs");
