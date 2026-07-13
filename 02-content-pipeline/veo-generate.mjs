// Generator de clipuri video cu Veo 3.1 — reteta Headliners.
// TEHNICA DE BAZA: first-frame -> last-frame conditioning. Dai cadrul de START si cadrul
// de FINAL (ambele validate vizual din image-generate.mjs), modelul completeaza 8 secunde
// de travelling continuu intre ele. Asa nu filmezi nimic si nu cumperi stock — generezi
// un film intreg din cadre-ancora.
//
// GOTCHA-URI INVATATE PE HEADLINERS (nu le redescoperi):
//   - first+last frame conditioning merge NUMAI cu durationSeconds: 8 (6 da eroare 400).
//   - render ~90-145s/clip pe modelul full; --fast pt. teste ieftine.
//   - negative prompt-ul e apararea contra AI tells: sincron, morphing, camera shake.
//   - un clip = UN SINGUR drum de camera, viteza constanta, fara taieturi. Tot ce e
//     "cut mascat" (prin element, prin lumina) se descrie IN prompt, nu se editeaza dupa.
//   - montajul fin (trim) se face DUPA, in extract-frames.sh — genereaza generos.
//
// usage: node veo-generate.mjs <shot>          (genereaza + asteapta + descarca in out/)
//        node veo-generate.mjs <shot> --fast   (model fast, pentru teste ieftine)
import { readFileSync, writeFileSync, mkdirSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const root = dirname(fileURLToPath(import.meta.url));
const KEY = readFileSync(resolve(root, ".env"), "utf8").match(/GEMINI_API_KEY=(.+)/)[1].trim();
const ANCHORS = resolve(root, "anchors");      // cadrele-ancora din image-generate.mjs
const OUT = resolve(root, "out");              // masterele mp4 (gitignored — sunt continut)
mkdirSync(OUT, { recursive: true });

// ═══════════════ ADN-UL FILMULUI — acelasi ca in image-generate.mjs ═══════════════
const FILM = `35mm film look, Kodak Portra 400, fine soft grain, shallow depth of field,
natural window daylight, airy warm whites against deep blacks, saturated pink peony blooms,
burgundy and near-black accents, gentle volumetric haze in the light shafts,
editorial floral-atelier realism. Photorealistic, single continuous take.`;

// regulile de miscare — astea au scos "sacadat" si "mecanic" din verdictele clientului
const MOTION = `Camera speed is calm and constant, floating like a steadicam on rails:
no shake, no whip pan, no speed ramps, strictly ONE single continuous take with no cuts and no editing.
Any people move softly and sparingly, as if filmed at a slightly slow-motion, graceful pace.
Do not add any new objects, furniture, text or logos. The florist is always a dark-clad figure,
face never readable — hands are the protagonists. The flowers are always pink peonies, burgundy
anthurium and dark cherries; the buckets are always dark metal, never plastic.`;

// apararea contra AI tells — completeaz-o cu ce descoperi la probele proiectului tau
const NEG = `cuts, jump cut, editing, crossfade, text, captions, subtitles, watermark, logo,
cartoon, CGI look, camera shake, whip pan, speed ramp, timelapse,
frantic movement, fast clapping, waving at camera, distorted hands, extra fingers, morphing faces,
synchronized movement, readable faces, wilting or morphing flowers`;

// ═══════════════ SHOTS — COMPLETEAZA PER PROIECT ═══════════════
// Doua tipuri de clipuri:
//   * ACTE (travelling in interiorul unei lumi): first/last = cadrele wide/close ale actului.
//   * PUNTI (bridge intre acte): first = ultimul cadru al actului A, last = primul al actului B.
//     REGULA DE AUR: taietura dintre lumi e mereu acoperita de un ELEMENT DIEGETIC sau de
//     LUMINA (treci prin rig, prin glare, prin cortina) — niciodata swap la vedere.
const SHOTS = {
  /* ——— ACT 1: travelling prin atelierul gol, in zori ——— */
  act1: {
    first: "act1-wide.png", last: "act1-f2.png", duration: 8,
    prompt: `${FILM}\n${MOTION}
The camera starts wide in the dawn atelier and glides slowly FORWARD in one single direction,
toward the tall peony stem leaning out of its dark metal bucket of water.
A travelling is ONE decision: the camera NEVER slows, NEVER pulls back, never reverses.
It ends with the stem large in frame, water glinting at its base — the atelier holding its breath.`,
    negative: `${NEG}, people, hands, silhouettes, staff`,
  },

  /* ——— PUNTEA 1->2: tulpina ridicata din apa ——— */
  bridge12: {
    first: "act1-f2.png", last: "act2-wide.png", duration: 8,
    prompt: `${FILM}\n${MOTION}
A dark-clad hand enters the frame and lifts the leaning peony stem out of the water;
the camera rises with the stem in one continuous move. The stem and its backlit falling water
droplets sweep across and FILL the frame, masking the change; emerging on the other side, we are
above the black-clothed table where the florist's hands lay peony stems into a spiral.
The lifted stem with its water droplets is what masks the cut.`,
    negative: NEG,
  },

  /* ——— ACT 2: push-in pe mainile care leaga buchetul ——— */
  act2: {
    first: "act2-wide.png", last: "act2-f2.png", duration: 8,
    prompt: `${FILM}\n${MOTION}
One slow constant push-in on the florist's hands building the spiral bouquet above the black
table: peony stems cross one over another and the bouquet visibly grows between the hands.
The camera NEVER slows, NEVER pulls back; it ends close on the binding point,
where a black ribbon starts its first loop. Craft since 1970, visible only in the hands.`,
    negative: `${NEG}, faces, second person`,
  },

  /* ——— PUNTEA 2->3: bucla panglicii ——— */
  bridge23: {
    first: "act2-f2.png", last: "act3-wide.png", duration: 8,
    prompt: `${FILM}\n${MOTION}
The black ribbon is pulled tight and its loop sweeps across the lens in one continuous motion
until the dark ribbon FILLS the frame, masking the change; emerging on the other side, the
finished wrapped bouquet is held out toward the camera by a single dark-clad arm against the
white plaster wall, rim-lit by daylight. The ribbon loop is what masks the cut.`,
    negative: NEG,
  },

  /* ——— ACT 3: apropierea finala — daruirea ——— */
  act3: {
    first: "act3-wide.png", last: "act3-f1.png", duration: 8,
    prompt: `${FILM}\n${MOTION}
One slow constant forward glide toward the wrapped bouquet extended to the camera,
until the pink blooms fill the frame. The camera NEVER slows, NEVER pulls back.
The moment of giving — the film ends in the visitor's hands.`,
    negative: `${NEG}, faces`,
  },
};

const id = process.argv[2];
const fast = process.argv.includes("--fast");
const shot = SHOTS[id];
if (!shot) { console.error(`unknown shot: ${id}. available: ${Object.keys(SHOTS).join(", ")}`); process.exit(1); }

const MODEL = fast ? "veo-3.1-fast-generate-preview" : "veo-3.1-generate-preview";
const b64 = (f) => readFileSync(resolve(ANCHORS, f)).toString("base64");

async function main() {
  console.log(`[veo] ${id} pe ${MODEL}: ${shot.first} -> ${shot.last}, ${shot.duration}s`);
  const kick = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:predictLongRunning?key=${KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        instances: [{
          prompt: shot.prompt,
          image: { bytesBase64Encoded: b64(shot.first), mimeType: "image/png" },
          lastFrame: { bytesBase64Encoded: b64(shot.last), mimeType: "image/png" },
        }],
        parameters: {
          aspectRatio: "16:9",
          resolution: "1080p",
          durationSeconds: shot.duration,   // ATENTIE: cu first+last frame, DOAR 8 merge
          negativePrompt: shot.negative,
        },
      }),
    }
  );
  const op = await kick.json();
  if (!op.name) { console.error("kickoff failed:", kick.status, JSON.stringify(op).slice(0, 2000)); process.exit(1); }
  console.log(`[veo] operation: ${op.name}`);

  const t0 = Date.now();
  let done = null;
  while (!done) {
    await new Promise(r => setTimeout(r, 10000));
    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/${op.name}?key=${KEY}`);
    const j = await res.json();
    if (j.error) { console.error("poll error:", JSON.stringify(j.error).slice(0, 1000)); process.exit(1); }
    if (j.done) done = j;
    else process.stdout.write(`\r[veo] rendering... ${((Date.now() - t0) / 1000).toFixed(0)}s`);
  }
  console.log(`\n[veo] done in ${((Date.now() - t0) / 1000).toFixed(0)}s`);

  const resp = done.response || {};
  const gvr = resp.generateVideoResponse || resp;
  const sample = gvr.generatedSamples?.[0] || gvr.generatedVideos?.[0] || gvr.videos?.[0];
  const uri = sample?.video?.uri || sample?.uri;
  if (!uri) {
    console.error("no video in response:", JSON.stringify(done).slice(0, 3000));
    process.exit(1);
  }
  console.log(`[veo] downloading: ${uri}`);
  const dl = await fetch(uri, { headers: { "x-goog-api-key": KEY } });
  if (!dl.ok) { console.error("download failed:", dl.status, (await dl.text()).slice(0, 500)); process.exit(1); }
  const buf = Buffer.from(await dl.arrayBuffer());
  const file = resolve(OUT, `${id}.mp4`);
  writeFileSync(file, buf);
  console.log(`[veo] saved ${file} (${(buf.length / 1e6).toFixed(1)} MB)`);
}
main().catch(e => { console.error(e); process.exit(1); });
