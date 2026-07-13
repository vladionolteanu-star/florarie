// Primul pas la orice proiect nou: verifica ce modele vede cheia ta.
// Cauta in output: gemini-3-pro-image (cadre-ancora) si veo-3.1-generate-preview (video).
// Daca Veo lipseste, cheia nu e pe tier platit.
// usage: node list-models.mjs
import { readFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const root = dirname(fileURLToPath(import.meta.url));
const KEY = readFileSync(resolve(root, ".env"), "utf8").match(/GEMINI_API_KEY=(.+)/)[1].trim();

async function listModels() {
  console.log("Se obtin modelele de la Google AI Studio...\n");
  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${KEY}`);
    const data = await response.json();

    if (data.models) {
      console.log(`S-au gasit ${data.models.length} modele:\n`);
      data.models.forEach(m => {
        console.log(`Model: ${m.name}`);
        console.log(`Nume complet: ${m.displayName}`);
        console.log(`Metode suportate: ${(m.supportedGenerationMethods || []).join(', ')}`);
        console.log("--------------------------------------------------");
      });
    } else {
      console.error("Eroare la obtinerea modelelor:", data);
    }
  } catch (err) {
    console.error("Eroare retea:", err);
  }
}

listModels();
