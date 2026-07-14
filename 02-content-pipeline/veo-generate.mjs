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
anthurium and dark cherries; the buckets are always dark metal, never plastic.
This film is SCRUBBED frame by frame on scroll, not played: every single frame must stand alone
as a crisp 35mm still — no long-exposure motion blur, no smeared frames, even at the fastest moment.`;

// apararea contra AI tells — completeaz-o cu ce descoperi la probele proiectului tau
const NEG = `cuts, jump cut, editing, crossfade, text, captions, subtitles, watermark, logo,
cartoon, CGI look, camera shake, whip pan, speed ramp, timelapse,
frantic movement, fast clapping, waving at camera, distorted hands, extra fingers, morphing faces,
synchronized movement, readable faces, wilting or morphing flowers`;

// ═══════════════ SHOTS — COMPLETEAZA PER PROIECT ═══════════════
// Doua tipuri de clipuri:
//   * ACTE (travelling in interiorul unei lumi): first/last = cadrele wide/close ale actului.
//     Push-in simplu, o singura decizie de camera. Astea sunt RESPIRATIILE dintre punti.
//   * PUNTI (bridge intre acte) = PORTALURI, nu masti. Punctile sunt ~30% din durata dar ~80%
//     din impactul emotional — singurul moment in care vizitatorul simte "nu e o prezentare, e
//     un film". Nivelul tintit e 3-4 din taxonomie (NICIODATA sub 3):
//       0 cut · 1 wipe · 2 masca (element umple opac cadrul) · 3 PORTAL (camera intra IN
//       element, il traverseaza, iese REFRACTAT) · 4 metamorfoza (elementul se transforma in lumea 2).
//     Camera intra IN elementul diegetic (picatura de apa, bucla de panglica), ii traverseaza
//     interiorul, si iese in lumea urmatoare. Lumea 2 NU se vede niciodata simultan — apare doar
//     REFRACTATA prin element, apoi devine reala. Elementul exista fizic in AMBELE lumi.
//     Doua ancore dedicate per punte (image-generate.mjs): INTERIOR (macro in interiorul
//     elementului, lumea 2 refractata = punct de control) si EMERGE (iesirea, refractia se
//     resoarbe; base-chained din wide-ul actului urmator — NU refolosesti wide-ul direct).
//     LANTUL DE CUSATURI E SFANT PE AMBELE CAPETE: puntea PORNESTE pe chiar ultimul cadru al
//     actului precedent (orice stare noua a elementului — picatura, bucla — se naste IN clip,
//     nu intre clipuri), iar actul urmator PORNESTE pe cadrul EMERGE. Fiecare joint din montaj
//     cade astfel pe doua cadre identice.
//     Puntea ruleaza in 2 clipuri (a/b) care se intalnesc pe cadrul INTERIOR (cel mai adanc punct,
//     nu o masca opaca). Prompturile de punte sunt 3-4x mai lungi ca ale actelor: traseu optic
//     cadru-cu-cadru, ce vede camera la 25/50/75%, ce NU face, fizica luminii in element.
//     TIP: proba intai single-clip <ultimul cadru al actului> -> EMERGE pe --fast; daca tine
//     continuitatea, puntea ramane UN clip (si montajul foloseste "bridge12" in loc de a/b).
//     Detalii de gust: 04-session-handoff/TASTE-RULES.md (sectiunea "Punti = portaluri").
const SHOTS = {
  /* ——— ACT 1: travelling prin atelierul gol, in zori ——— */
  act1: {
    first: "act1-wide.png", last: "act1-f2.png", duration: 8,
    prompt: `${FILM}\n${MOTION}
The camera starts wide in the dawn atelier and glides slowly FORWARD in one single direction,
toward the tall peony stem leaning out of its dark metal bucket of water.
A travelling is ONE decision: the camera NEVER slows, NEVER pulls back, never reverses.
CRITICAL: the atelier is completely EMPTY for the ENTIRE duration of the shot — ZERO people,
zero hands, zero figures; NOBODY enters the frame at any moment; only flowers, buckets and light.
The tall leaning peony stem is ALREADY present from the very first frame, small among the buckets
in the distance, and simply GROWS in frame as the camera physically approaches it — it never
appears suddenly, nothing dissolves, every frame is one solid physical camera position.
It ends with the stem large in frame, water glinting at its base — the atelier holding its breath.`,
    negative: `${NEG}, people, hands, silhouettes, staff, dissolve, double exposure, ghosting, superimposition`,
  },

  /* ——— PUNTEA 1->2 = PORTAL prin PICATURA de apa, in doua clipuri care se intalnesc pe cadrul
         INTERIOR (bridge12-portal.png = din interiorul picaturii). Nu o masca opaca — un drum
         de camera continuu care INTRA in picatura si iese in atelier. Joint a/b pe cadrul interior
         identic. In montaj: bridge12a intreg + bridge12b intreg. ——— */
  /* proba single-clip (preferata daca tine): tot drumul portal intr-un singur clip.
     Daca reuseste, montajul foloseste "bridge12" si renunti la split-ul a/b. */
  bridge12: {
    first: "act1-f2.png", last: "bridge12-emerge.png", duration: 8,
    prompt: `${FILM}\n${MOTION}
PORTAL BRIDGE in ONE continuous take — the camera ENTERS a water droplet and comes out in the next
world. The shot begins exactly on the tall pink peony leaning out of its dark metal bucket, water
glinting at its base, the atelier still and empty.
AT 25%: a dark-clad hand enters softly from the side and lifts the stem just clear of the water — a
single large, backlit water DROPLET forms and hangs pendant at the base of the bloom, a warm caustic
highlight glowing inside it. This droplet is the portal. The camera commits: one continuous accelerating
dive straight at it — never veering around, never slowing, never pulling back.
AT 50%: the camera pierces the droplet's convex surface — the whole frame becomes liquid: macro water,
warm caustics, floating micro-bubbles, the world bending at the edges, every frame crisp and readable.
AT 75%: the camera keeps gliding forward and SURFACES out of the water on the other side — the last
caustics slide off the top of the frame and the refraction resolves into the atelier: the florist's
dark-clad hands laying pink peony stems into a spiral bouquet on the black-clothed table, warm daylight
from the side, the florist seen from BEHIND, face NEVER visible.
IT ENDS above the table, clean and steady, a last thin veil of water-light lifting off the top edge.
One single continuous forward journey at constant speed. The two worlds are NEVER visible at the same
time — the change happens strictly INSIDE the water. No cut, no dissolve, no fade, no double exposure.`,
    negative: `${NEG}, dissolve, double exposure, ghosting, superimposition, fade, split screen, diptych, side by side, two scenes at once, visible face`,
  },

  bridge12a: {
    first: "act1-f2.png", last: "bridge12-portal.png", duration: 8,
    prompt: `${FILM}\n${MOTION}
PORTAL BRIDGE, part 1 of 2 — the camera does NOT mask a cut; it ENTERS a water droplet and dives toward
its centre. The shot begins exactly on the tall pink peony leaning out of its dark metal bucket, water
glinting at its base — the atelier still and empty.
AT 25%: a dark-clad ARM enters softly from the side — ONLY the hand and forearm, the figure it belongs
to stays entirely OUT of frame — and lifts the stem just clear of the water. A single large, backlit
water DROPLET forms and hangs pendant at the base of the bloom, trembling, a warm caustic highlight
glowing inside it. This droplet is the portal. The camera commits to it: one continuous accelerating
MACRO dive straight at the droplet — it never veers around it, never slows, never pulls back.
AT 50%: the droplet grows to fill a third of the frame, its surface tension bulging, warm caustics
sliding across its skin, a few micro-bubbles suspended inside it. This is a MACRO journey: the water
exists ONLY as this one droplet and the water in the bucket — the atelier NEVER floods, there is no
pool, no lake, no waterline across the room.
AT 75%: the camera reaches and pierces the droplet's convex surface — the whole frame becomes the liquid
lens, the world bending and inverting at the edges, every frame still crisp and readable.
IT ENDS fully inside the water: macro water, caustics, floating micro-bubbles, and, refracted and turned
upside-down deep in the lens, the faint blurred shapes of the florist's dark-clad hands at work on the
black table. One single forward dive, constant acceleration. The camera does NOT stop, does NOT pull back,
does NOT dissolve, does NOT fade, and NEVER shows two worlds side by side.`,
    negative: `${NEG}, dissolve, double exposure, ghosting, superimposition, fade, split screen, diptych, side by side, two scenes at once, visible face, swimming pool, flooded room, underwater room, lake, pond`,
  },
  bridge12b: {
    first: "bridge12-portal.png", last: "bridge12-emerge.png", duration: 8,
    prompt: `${FILM}\n${MOTION}
PORTAL BRIDGE, part 2 of 2 — the camera travels THROUGH the water and SURFACES into the next world.
It begins inside the droplet: macro water, warm caustics, floating micro-bubbles, and the refracted,
upside-down shapes of the florist's hands deep in the liquid lens. The camera keeps gliding FORWARD
through the water in one unbroken move — it never reverses, never stops, never dissolves.
This is a MACRO journey through ONE droplet — the atelier never floods, no pool, no lake, no waterline
across the room; the water is only the inside of the droplet.
AT 25%: the refracted hands grow larger and slowly rotate upright as the camera nears the far surface.
AT 50%: the camera pierces the water's surface from within — a burst of surface tension and light, the
last caustics sliding off the top of the frame, every frame crisp and readable.
AT 75%: the refraction resolves — we are now above the black-clothed table, distortion draining from the
edges into clean focus, the florist's dark-clad hands laying pink peony stems one over another into a
spiral bouquet, warm daylight from the side. The florist is seen from BEHIND the whole time, head bowed,
face NEVER visible, not even in profile.
IT ENDS on the atelier table, framed clean and steady, a last thin veil of water-light lifting off the top
edge. One single continuous forward move, constant speed. No cut, no dissolve, no fade, never two worlds at once.`,
    negative: `${NEG}, dissolve, double exposure, ghosting, superimposition, fade, split screen, diptych, side by side, visible face, profile of a face, woman looking at camera, swimming pool, flooded room, underwater room, lake, pond`,
  },

  /* ——— ACT 2: push-in pe mainile care leaga buchetul ———
         Porneste pe EMERGE (nu pe act2-wide): valul de refractie ramas de la punte se resoarbe
         organic in prima secunda a actului — joint identic cu finalul lui bridge12b. */
  act2: {
    first: "bridge12-emerge.png", last: "act2-f2.png", duration: 8,
    prompt: `${FILM}\n${MOTION}
It begins the instant the camera has just surfaced from the water: a last thin veil of water-light
lifts off the top edge and clears within the first second, leaving the scene clean and sharp.
Then one slow constant push-in on the florist's hands building the spiral bouquet above the black
table: peony stems cross one over another and the bouquet visibly grows between the hands.
The camera NEVER slows, NEVER pulls back; it ends close on the binding point,
where a black ribbon starts its first loop. Craft since 1970, visible only in the hands.`,
    negative: `${NEG}, faces, second person, dissolve, double exposure, ghosting, superimposition`,
  },

  /* ——— PUNTEA 2->3 = PORTAL prin BUCLA de panglica (tunel de satin), in doua clipuri care se
         intalnesc pe cadrul INTERIOR (bridge23-portal.png = din interiorul tunelului). Camera
         intra IN bucla, traverseaza tunelul de satin, iese pe buchetul finit. Panglica din tunel
         E ACEEASI panglica de pe buchet — continuitate fizica de obiect. ——— */
  bridge23a: {
    first: "act2-f2.png", last: "bridge23-portal.png", duration: 8,
    prompt: `${FILM}\n${MOTION}
PORTAL BRIDGE, part 1 of 2 — the camera enters the loop of black ribbon as if it were a tunnel.
The florist's dark-clad hands pull the black satin ribbon tight around the binding point of the bouquet
and the first loop opens into a small dark eye. This loop is the portal. The camera glides FORWARD straight
into the mouth of the loop in one continuous move — it never circles it, never slows, never pulls back.
AT 25%: the loop grows until its dark opening fills the centre of the frame, the satin edge catching a
thin warm rim of light.
AT 50%: the camera crosses the threshold and the black ribbon wraps the whole frame — we are inside a
tunnel of black satin, the weave of the fabric visible in macro, faint specular highlights running along
the fibres.
AT 75%: the tunnel deepens and far ahead a warm point of window light appears at its end.
IT ENDS deep inside the satin tunnel, the far light glowing, the finished bouquet only a warm blur at the
tunnel's mouth. One single forward glide, constant speed. No cut, no dissolve, no fade, never two worlds at once.`,
    negative: `${NEG}, dissolve, double exposure, ghosting, superimposition, fade, split screen, diptych, side by side, two scenes at once`,
  },
  bridge23b: {
    first: "bridge23-portal.png", last: "bridge23-emerge.png", duration: 8,
    prompt: `${FILM}\n${MOTION}
PORTAL BRIDGE, part 2 of 2 — the camera travels through the ribbon tunnel and EMERGES on the finished bouquet.
It begins deep inside the tunnel of black satin: macro fabric weave, specular highlights on the fibres, a
warm point of window light far ahead. The camera keeps gliding FORWARD toward that light in one unbroken
move — it never reverses, never stops, never dissolves.
AT 25%: the far light widens and warms.
AT 50%: the camera reaches the tunnel's mouth and the black satin sweeps outward to the edges of the frame.
AT 75%: we emerge fully — the finished wrapped bouquet (lush pink peonies, deep burgundy anthurium, a
threaded cherry strand, bound in the same black ribbon) is held out toward the camera by a single dark-clad
arm against the rough white plaster wall, rim-lit by warm daylight, the last of the ribbon still framing the
edges of the frame.
The ribbon that made the tunnel IS the ribbon on this bouquet — one physical object, one continuous journey.
IT ENDS on the bouquet held out, ribbon edges just leaving frame. One single continuous forward move,
constant speed. No cut, no dissolve, no fade, never two worlds at once.`,
    negative: `${NEG}, dissolve, double exposure, ghosting, superimposition, fade, split screen, diptych, side by side`,
  },

  /* ——— ACT 3: apropierea finala — daruirea ———
         Porneste pe EMERGE (nu pe act3-wide): marginile de panglica ramase de la punte ies din
         cadru in prima secunda — joint identic cu finalul lui bridge23b. */
  act3: {
    first: "bridge23-emerge.png", last: "act3-f1.png", duration: 8,
    prompt: `${FILM}\n${MOTION}
It begins with the last soft dark edges of the black satin ribbon just leaving the corners of the
frame, clearing within the first second and leaving the bouquet clean and sharp.
Then one slow constant forward glide toward the wrapped bouquet extended to the camera,
until the pink blooms fill the frame. The camera NEVER slows, NEVER pulls back.
The moment of giving — the film ends in the visitor's hands.`,
    negative: `${NEG}, faces, dissolve, double exposure, ghosting, superimposition`,
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
