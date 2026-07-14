// Generator de cadre-ancora cu Gemini Pro Image ("Nano Banana Pro") — reteta Headliners.
// Cadrele-ancora = punctele de start/final ale fiecarui clip video (veo-generate.mjs).
//
// TEHNICI IN FISIERUL ASTA:
//   1. Referinte vizuale REALE (refs/) — modelul reproduce locatia ta exacta, nu inventeaza.
//   2. ADN vizual comun (VENUE + FILM) — acelasi look pe TOATE cadrele; consistenta e totul.
//   3. Base chaining (dolly conditionat pe imagine) — cadrul urmator generat din cel precedent,
//      camera "a inaintat 2.5m": asa obtii secvente wide -> mid -> close-up coerente.
//   4. Strat LIGHT — doar lumini/ceata pe negru pur, compozitat cu mix-blend-mode:screen
//      peste cadrul de baza (parallax de lumina separat de decor).
//   5. Fallback intre modele + test imagen (imagen NU tine referintele — respins pe Headliners;
//      pastrat aici doar ca instrument de comparatie).
//
// usage: node image-generate.mjs <id> [...]      (sau: all / bg / light)
// setup: copiaza .env.example -> .env cu GEMINI_API_KEY; pune 3-5 poze reale in refs/
import { readFileSync, writeFileSync, readdirSync, mkdirSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const root = dirname(fileURLToPath(import.meta.url));
const KEY = readFileSync(resolve(root, ".env"), "utf8").match(/GEMINI_API_KEY=(.+)/)[1].trim();
const OUT = resolve(root, "anchors");          // cadrele-ancora generate ajung aici
mkdirSync(OUT, { recursive: true });
const MODELS = ["gemini-3-pro-image", "gemini-3-pro-image-preview"];

// pozele reale ale locatiei — atasate ca referinte vizuale la fiecare scena cu refs:true
const REFS = readdirSync(resolve(root, "refs"))
  .filter(f => /\.(jpe?g|png)$/i.test(f))
  .map(f => ({
    inline_data: {
      mime_type: "image/jpeg",
      data: readFileSync(resolve(root, "refs", f)).toString("base64"),
    },
  }));

// ═══════════════ ADN-UL VIZUAL — COMPLETEAZA PER PROIECT ═══════════════
// VENUE = adevarul locatiei. Enumera CONCRET: materiale, mobilier, culori, ce NU are voie
// sa inventeze. Cu cat mai specific, cu atat mai consistent intre cadre.
const VENUE = `The attached photos are the REAL subject world: the atelier of Floraria Iris,
a flower shop founded in 1970 (Bucharest).
Reproduce THIS exact world in every generated frame — same materials, same flowers, same palette:
- flowers: lush double PINK PEONIES in full bloom (the only pink in the world), deep BURGUNDY
  anthurium with glossy sculptural spathes, strings of dark red CHERRIES threaded on wire like
  garlands, feathery burgundy-dyed asparagus fern
- set: a matte BLACK woven-cord drum structure on thin black metal legs, tall thin BLACK taper
  candles, a round table dressed in BLACK cloth with dark ceramic plates, gold cutlery and clear
  glass stemware, dark metal flower buckets
- walls: rough white-plaster wall, warm natural daylight raking across it, soft but hard-edged shadows
- people: florists dressed in plain black clothing
NEVER: plastic buckets, plastic chairs, printed or colored ribbon (only black ribbon or natural
raffia), red roses or any flower that is not peony/anthurium/cherry/fern, patterned cellophane wrap.
Do NOT invent a different location. Match the references.`;

// FILM = stock-ul cinematografic comun. Nu-l schimba intre cadre — el tine filmul unitar.
const FILM = `Cinematography identical across all frames: 35mm film still, Kodak Portra 400,
fine soft grain, shallow depth of field, natural window daylight, airy warm whites against deep
blacks, saturated pink blooms, gentle volumetric haze in the light shafts, editorial
floral-atelier realism, wide 2.39 framing feel. People only as dark-clad figures seen from behind
or cropped at the shoulders — HANDS are the protagonists, faces never readable.
No readable text or logos beyond what exists in the references.
CRITICAL: output exactly ONE single photograph filling the entire frame —
NEVER a collage, grid, diptych, contact sheet or multiple panels.`;

// strat de LUMINA: doar lumini/ceata pe negru pur -> compozitezi cu mix-blend-mode: screen
const LIGHT = (desc) => `${FILM}\nOn a PURE SOLID BLACK (#000000) background, render ONLY light and atmosphere:
${desc}
No walls, no furniture, no people, no objects — only glowing light, volumetric haze, floating dust.
The background must remain pure black (for screen-blend compositing).`;

// ═══════════════ SCENELE — COMPLETEAZA PER PROIECT ═══════════════
// Fiecare act are: un cadru de baza (-bg, cu refs) + optional un strat de lumina (-light).
// Cheile "base" conditioneaza generarea pe o imagine deja generata (dolly chaining).
const ACT1_SCENE = `Dawn in the atelier: masses of pink peonies resting in dark metal buckets on
and beside the black-clothed table, dark cherries heaped in a dark crate, the black woven-cord
drum standing empty in the background against the rough white plaster wall. One low shaft of warm
morning light from a side window, floating dust. No people. MOOD: the raw material of a gift,
holding its breath.`;

const SCENES = {
  /* ————— ACT 1 · atelierul in zori ————— */
  "act1-bg": { refs: true, file: "act1-wide", prompt: `${VENUE}\n${FILM}\nSCENE: ${ACT1_SCENE}` },
  "act1-light": { refs: false, file: "act1-light", prompt: LIGHT(`one soft warm morning light shaft
    entering from the upper left, gentle volumetric haze and floating dust inside the beam,
    a faint warm bounce low in the frame.`) },

  /* ————— ACT 2 · mainile care leaga ————— */
  "act2-bg": { refs: true, file: "act2-wide", prompt: `${VENUE}\n${FILM}\nSCENE: The florist's hands
    laying pink peony stems one over another into a spiral bouquet above the black-clothed table;
    a burgundy anthurium and a strung cherry garland wait beside; the figure is dark-clad, cropped
    at the shoulders, face out of frame; warm daylight from the side.
    MOOD: craft since 1970, visible only in the hands.` },

  /* ————— ACT 3 · daruirea ————— */
  "act3-bg": { refs: true, file: "act3-wide", prompt: `${VENUE}\n${FILM}\nSCENE: The finished
    bouquet — lush pink peonies, deep burgundy anthurium, one threaded cherry strand — wrapped in
    plain natural kraft paper tied with black ribbon, held out toward the camera by a single
    dark-clad arm against the rough white plaster wall, rim-lit by warm daylight.
    MOOD: the moment of giving.` },

  /* Reteta de reparatie (base conditioning) — cand un cadru validat are UN detaliu gresit,
     adauga o intrare cu base: "<cadru>.png" si promptul:
     "KEEP ABSOLUTELY EVERYTHING ... EXCEPT ONE FIX: <fix>. Do not change anything else." */
  "act1-fix-crate": { base: "act1-wide-v1.png", file: "act1-wide", prompt: `${FILM}
KEEP ABSOLUTELY EVERYTHING in the attached frame identical — composition, camera angle, lighting,
peonies, metal buckets, black-clothed table, rough white plaster wall, black woven-cord drum —
EXCEPT ONE FIX: replace the light natural-wood cherry crate with a DARK, near-black wooden crate,
same position on the table, same dark cherries heaped inside it. Do not change anything else.
CRITICAL: the atelier stays completely EMPTY exactly as in the attached frame — ZERO people,
zero hands, zero figures anywhere in the frame.` },
  /* ═══ PUNTI = PORTALURI (nu masti). Fiecare punte trece PRIN interiorul unui element
     diegetic: camera intra IN el, ii traverseaza interiorul, si iese in lumea urmatoare.
     Cele doua lumi NU se vad niciodata simultan — lumea 2 apare doar refractata prin element,
     apoi devine reala. DOUA cadre-ancora dedicate per punte (NU refolosesti wide-ul actului
     urmator ca last-frame): INTERIOR (macro in interiorul elementului, lumea 2 refractata =
     punctul de control intermediar) si EMERGE (iesirea in lumea 2, refractia se resoarbe;
     base-chained din wide-ul actului urmator).
     LANTUL DE CUSATURI: puntea porneste pe chiar ultimul cadru al actului precedent (starea
     noua a elementului — picatura, bucla — se naste IN clip), iar actul urmator porneste pe
     EMERGE. Validezi ancorele astea ca STILLS inainte de orice video — sunt cele mai exotice
     cadre din film si cele mai predispuse la regenerari. Vezi veo-generate.mjs bridge*a/*b. ═══ */

  /* — Puntea 1->2: prin PICATURA de apa — */
  // (OPTIONAL, nu e pe drumul critic) cadru de control cu picatura-portal pendanta — folosit
  // DOAR daca proba single-clip / split-ul pe INTERIOR nu tine si ai nevoie de un pin in plus.
  "bridge12-drop": { base: "act1-f2.png", file: "bridge12-drop", prompt: `${FILM}
KEEP the attached frame's world identical — same tall pink peony bloom, same dark metal bucket,
same rough white plaster wall, same warm window light, same film stock and color grade — EXCEPT:
the stem is lifted just clear of the water and a SINGLE large water DROPLET hangs pendant at the
base of the bloom, trembling and backlit, a bright warm caustic highlight glowing inside it. The
droplet is prominent and sharp in the foreground — it is the portal the camera will dive into.
Nothing else added, at most a hint of a dark-clad hand at the very edge, no text.` },
  // INTERIOR: punctul de control — din INTERIORUL picaturii, world 2 refractat (joint a/b cade aici)
  "bridge12-portal": { base: "act2-wide.png", file: "bridge12-portal", prompt: `${FILM}
Render a MACRO frame from INSIDE a large water droplet — the camera is submerged in warm sunlit water.
Fill the ENTIRE frame with liquid: soft floating micro-bubbles, warm caustic light rippling across,
the curved meniscus refracting at the edges. Deep inside the liquid lens, REFRACTED and turned slightly
upside-down, appear the blurred shapes of the florist's dark-clad hands laying pink peony stems on the
black-clothed table (the world of the attached frame, seen THROUGH water). No sharp room, no wall — only
water, caustics, bubbles, and the refracted dreamlike hint of the atelier suspended in the lens.
Same film stock and warm grade as the attached frame. ONE single photograph, edge-to-edge water.` },
  // EMERGE: last-frame dedicat — camera iese din apa in atelier, refractia se resoarbe.
  // LECTIE (validare Vlad, 2026-07-14): valul NU are voie sa fie o LINIE DE APA orizontala
  // peste incapere — citeste "atelier inundat" (eroare de logica). La regenerare: valul =
  // picaturi si dare de apa PE LENTILA (lens droplets, streaks), fara waterline in scena.
  "bridge12-emerge": { base: "act2-wide.png", file: "bridge12-emerge", prompt: `${FILM}
KEEP the attached atelier frame's composition, hands, table, peonies, wall and light identical — EXCEPT:
render the instant the camera SURFACES out of water into this scene. A last thin veil of water-refraction
and warm caustic light is lifting off the TOP edge of the frame, a few surface-tension distortions and tiny
droplets still resolving at the very top; the lower two-thirds are already sharp and clean. It reads as
emerging from a droplet into the real atelier. Do not change the underlying scene. ONE single photograph.` },

  /* — Puntea 2->3: prin BUCLA de panglica (tunel de satin) — */
  // INTERIOR: punctul de control — din interiorul tunelului de satin, world 3 la capat (joint a/b)
  "bridge23-portal": { base: "act3-wide.png", file: "bridge23-portal", prompt: `${FILM}
Render a MACRO frame from INSIDE a loop of BLACK SATIN RIBBON — the camera is deep inside a tunnel of
black fabric. Black satin wraps the ENTIRE frame; the weave of the fabric is visible in macro with faint
specular highlights running along the fibres. At the far end of the tunnel a small warm point of window
light glows, and against it the finished bouquet (pink peonies, burgundy anthurium) is only a soft warm
blur. No room, no wall, no hands — only the black satin tunnel and the far warm light. Same film stock and
grade as the attached frame. ONE single photograph, black satin edge-to-edge.` },
  // EMERGE: last-frame dedicat — camera iese din tunelul de panglica pe buchetul finit
  "bridge23-emerge": { base: "act3-wide.png", file: "bridge23-emerge", prompt: `${FILM}
KEEP the attached frame's finished bouquet, dark-clad arm, rough white plaster wall and rim light identical
— EXCEPT: render the instant the camera EMERGES from a tunnel of black satin ribbon onto this bouquet. The
black ribbon that formed the tunnel still frames the very EDGES of the frame (soft, dark, out of focus),
sweeping outward as the bouquet opens sharp in the centre. The ribbon at the edges IS the same black ribbon
tied on the bouquet — one physical object. Do not change the bouquet itself. ONE single photograph.` },
  "act2-fix-wall": { base: "act2-f2.png", file: "act2-f2", prompt: `${FILM}
KEEP ABSOLUTELY EVERYTHING in the attached frame identical — composition, camera angle, lighting,
the hands binding the bouquet, the black ribbon loop, peonies, anthurium, cherry garland, black
woven-cord drum, black candle — EXCEPT ONE FIX: replace the exposed red brick wall in the
background with the same rough white-plaster wall seen elsewhere in the atelier, warm daylight
and soft shadows raking across it. Do not change anything else.` },
};

// ——— secvente de miscare (dolly, efect tinyPod): cadrul urmator conditionat pe cel precedent ———
const DOLLY_PROMPT = (target, note) => `${FILM}\nThe attached image is one frame of a continuous camera DOLLY shot
inside the Floraria Iris atelier. Generate the NEXT frame of the exact same take:
the camera has physically moved about 2.5 meters FORWARD along its viewing axis, closer to ${target}.
IDENTICAL location, IDENTICAL props and set dressing, IDENTICAL lighting state, haze, color grade and lens.
${note}
Perspective changes naturally with the move (near objects shift and enlarge more than far ones).
Do NOT add or remove any object or person.`;

const seq = (act, base, f, target, note) => {
  SCENES[`${act}-f${f}`] = { base, file: `${act}-f${f}`, prompt: DOLLY_PROMPT(target, note || "") };
};
// lanturile dolly: wide -> mid -> close per act (3 cadre per act au fost de-ajuns pe Headliners)
seq("act1", "act1-wide.png", 1, "the peony buckets — one tall peony stem leaning out of a dark metal bucket of water",
  "CRITICAL: the atelier is completely EMPTY, zero people, zero hands.");
seq("act1", "act1-f1.png",   2, "the same leaning peony stem, now filling most of the frame, water glinting at its base");
seq("act2", "act2-wide.png", 1, "the growing bouquet in the florist's hands, peony stems crossing in a spiral");
seq("act2", "act2-f1.png",   2, "the binding point of the bouquet — thumbs pressing the spiral, a black ribbon starting its first loop, filling most of the frame");
seq("act3", "act3-wide.png", 1, "the wrapped bouquet extended toward the camera, now filling the frame");

// test de comparatie: Imagen 4 Ultra (fara referinte — doar text).
// Pe Headliners a fost RESPINS pentru scene: nu tine referintele, inventeaza alta locatie.
// Pastrat doar ca sa poti compara pe proiectul tau.
SCENES["act1-imagen-test"] = { engine: "imagen", file: "act1-imagen-test", prompt: `${VENUE}\n${FILM}\nSCENE: ${ACT1_SCENE}` };

async function genImagen(id, s) {
  const t0 = Date.now();
  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/imagen-4.0-ultra-generate-001:predict?key=${KEY}`,
    { method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ instances: [{ prompt: s.prompt }], parameters: { sampleCount: 1, aspectRatio: "16:9", sampleImageSize: "2K" } }) }
  );
  const json = await res.json();
  const pred = json.predictions?.[0];
  if (pred?.bytesBase64Encoded) {
    writeFileSync(resolve(OUT, `${s.file}.png`), Buffer.from(pred.bytesBase64Encoded, "base64"));
    console.log(`${id} [imagen-4-ultra] -> ${s.file}.png (${((Date.now() - t0) / 1000).toFixed(1)}s)`);
  } else {
    console.error(`${id} @ imagen: ${res.status}`, JSON.stringify(json).slice(0, 240));
  }
}

async function gen(id) {
  const s = SCENES[id];
  if (!s) { console.error(`unknown: ${id}`); return; }
  if (s.engine === "imagen") return genImagen(id, s);
  const parts = [];
  if (s.refs) parts.push(...REFS);
  if (s.base) parts.push({ inline_data: { mime_type: "image/png", data: readFileSync(resolve(OUT, s.base)).toString("base64") } });
  parts.push({ text: s.prompt });
  for (const model of MODELS) {
    const t0 = Date.now();
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts }],
          generationConfig: { imageConfig: { aspectRatio: "16:9", imageSize: "2K" } },
        }),
      }
    );
    const json = await res.json();
    const img = json.candidates?.[0]?.content?.parts?.find(p => p.inlineData);
    if (img) {
      writeFileSync(resolve(OUT, `${s.file}.png`), Buffer.from(img.inlineData.data, "base64"));
      console.log(`${id} [${model}] -> ${s.file}.png (${((Date.now() - t0) / 1000).toFixed(1)}s)`);
      return;
    }
    console.error(`${id} @ ${model}: ${res.status}`, JSON.stringify(json).slice(0, 240));
  }
}

const ids = process.argv.slice(2);
const all = Object.keys(SCENES);
const list =
  ids[0] === "all" || ids.length === 0 ? all :
  ids[0] === "bg" ? all.filter(i => i.endsWith("-bg")) :
  ids[0] === "light" ? all.filter(i => i.endsWith("-light")) :
  ids;
for (const id of list) await gen(id);
