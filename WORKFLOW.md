# WORKFLOW — pipeline-ul complet, pas cu pas

Rețeta validată pe Headliners: un film scrollytelling generat integral cu AI, de la
fotografii reale până la pagina live. Fiecare pas are fișierul lui în retetar.

```
Fotografii reale (refs/)
  → Cadre-ancoră (image-generate.mjs / Gemini Pro Image)
    → Clipuri video (veo-generate.mjs / Veo 3.1, first→last frame)
      → Post-producție (extract-frames.sh / ffmpeg: trim, grade, tratamente)
        → Prototip UN beat (beat-prototype.html) → VALIDARE CLIENT
          → Filmul întreg (scroll-film.html, timeline SEGS/HOLD/LEAD)
            → Runde de feedback (04-session-handoff/)
              → Integrare + deploy (06-deploy/)
```

---

## 0. Brief + setup

> **Scurtătura**: `/new-client` din Claude Code face tot pasul 0 ghidat (interviu +
> scaffold + prompturi redactate) și te lasă direct la pasul 1. Manual, pașii sunt:

- Completează `05-project-templates/PRODUCT-TEMPLATE.md` (de ce există pagina) și
  `DESIGN-TEMPLATE.md` (tokens). Copiază `CLAUDE-TEMPLATE.md` ca `CLAUDE.md` în proiect.
- `02-content-pipeline/`: copiază `.env.example` → `.env`, pune `GEMINI_API_KEY`.
- **Primul call**: `node list-models.mjs` — confirmă că cheia vede `gemini-3-pro-image`
  și `veo-3.1-generate-preview` (Veo = tier plătit).
- Pune 3-5 **fotografii reale** ale locației în `refs/` (vezi `refs/README.md`).

## 1. Povestea + cadrele-ancoră

- Scrie povestea în acte (3-5), fiecare act o propoziție. Pentru FIECARE trecere între
  acte alege **elementul-portal diegetic** PRIN care trece camera (picătură, buclă de
  panglică, rig, fantă de lumină) — punțile sunt **portaluri, nu perdele**: camera intră
  ÎN element, îi traversează interiorul, iese în lumea următoare
  (TASTE-RULES § „Punți = portaluri", țintă nivel ≥3). Fără punte clară = povestea nu e gata.
- Completează `VENUE` + `FILM` (ADN-ul vizual) în `image-generate.mjs`, apoi scenele.
- Generează: `node image-generate.mjs all`. Wide → mid → close per act prin `seq()`
  (base chaining). Validează VIZUAL fiecare cadru-ancoră înainte de video —
  video-ul moștenește tot ce e greșit în ancoră.
- Per punte generezi **două ancore de portal**: INTERIOR (macro în interiorul elementului,
  lumea 2 refractată) + EMERGE (base-chained din wide-ul actului următor). Sunt cele mai
  exotice cadre din film — le validezi ca stills ÎNAINTE de orice video.
- Regulile din `04-session-handoff/TASTE-RULES.md` se aplică DE LA PRIMUL CADRU
  (siluete, nu fețe; asincron; logica spațială).

## 2. Clipurile video

- Completează `SHOTS` în `veo-generate.mjs`: acte (travelling într-o lume) + punți-portal.
  **Lanțul de cusături** (fiecare joint = două cadre identice):
  actul A se termină pe cadrul X → puntea a: X → INTERIOR → puntea b: INTERIOR → EMERGE →
  actul B pornește pe EMERGE. Starea nouă a elementului-portal se naște ÎN clip, nu între clipuri.
- **Ordinea pe punți** (cele mai scumpe la regenerări): 1) validezi ancorele-portal ca stills;
  2) probă single-clip X→EMERGE pe `--fast` — dacă Veo ține continuitatea, puntea rămâne UN clip;
  3) dacă nu, split a/b pe INTERIOR; 4) abia apoi modelul full. Prototipezi O punte, o validezi,
  abia apoi le faci pe celelalte.
- `node veo-generate.mjs <shot>` (~90-145s/clip; `--fast` pentru teste).
- **Gotcha**: first+last frame conditioning merge NUMAI cu `durationSeconds: 8`.
- Un clip = UN drum de cameră, viteză constantă. Camera care pulsează = regenerezi cu
  constrângere dură sau tai în pasul 3. Filmul e scrubuit — orice cadru înghețat trebuie să
  stea în picioare ca still crisp (fără motion blur smear la momentul de străpungere).
- Masterele rămân în `out/` — nu se șterg, nu se ating; tot montajul e refăcut din ele.

## 3. Post-producție (montaj + DI)

- `extract-frames.sh`: SPEC cu trim per segment + număr fix de cadre. Rețeta de livrare:
  **18fps, 1344w, libwebp q54** (~600 cadre ≈ 40MB).
- Extrage **probe** întâi (cadre la 0.5s), uită-te la ele, apoi decide trim-urile.
- Gradează DOAR după boardul de racorduri (ultimul cadru A lângă primul cadru B).
  Lecțiile DI sunt în capul scriptului și în TASTE-RULES § Culoare.

## 4. Prototipul de UN beat → validare client

- `01-canvas-scrub/beat-prototype.html`: pune secvența beat-ului cel mai spectaculos
  (climaxul, puntea cea mai clară). Arată-l clientului. **Nu construi mai departe fără verdict.**

## 5. Filmul întreg

- `01-canvas-scrub/scroll-film.html`: completează blocul CONFIG — `SEGS` (ordinea +
  cadrele + actul + respiro-ul), `LEAD`, `VH_PER_UNIT` (ritmul), `START_AT` (release-ul).
- Posterele: primul cadru al fiecărui act ca `background-image` pe stage + fallback-ul
  `prefers-reduced-motion`.
- Verifică pe throttling (Fast 3G): release rapid? clamp-ul ține? decode jank la salturi?

## 6. Rundele de feedback

- Runda de montaj: `04-session-handoff/FEEDBACK-ROUND.md`.
- Runda de finisare (culori + loading): `04-session-handoff/POLISH-ROUND.md`.
- Orice regulă nouă învățată se scrie înapoi în `TASTE-RULES.md`.
- Kickoff-ul oricărei sesiuni noi: `SESSION-KICKOFF.md`. **Fiecare sesiune se închide
  scriind handoff-ul pentru următoarea** — ăsta e mecanismul care nu pierde context.

## 7. Integrare + deploy

- Filmul se integrează în pagina finală între markeri clari
  (`<!-- SECTION: film START/END -->`): CSS scoped + secțiunea + fallback + engine IIFE.
- Smooth scroll pe restul paginii: `03-smooth-scroll/lenis-gsap.html` (Lenis + GSAP +
  CSS scroll-driven + IntersectionObserver).
- Deploy dintr-un **folder curat de deploy** (oglindă a paginii + assets, fără tooling,
  fără mastere). Local ↔ deploy rămân identice.
- `06-deploy/vercel.json`: cache headers pe secvențe.
- După deploy: verifică live (200 pe pagină + primul/ultimul cadru din fiecare segment),
  confirmă că pagina e legată în homepage, trimite clientului link-ul.

---

## Alte pattern-uri din același proiect (nereplicate aici)

- **Hero canvas „chaos → order"** — particule care se ordonează + custom events
  (`hl:slogan`, `hl:resolved`) care orchestrează reveal-uri de UI + fallback timers.
  E specific brandului Headliners; vezi `Headliners/hero-animation-standalone.html`
  ca referință dacă un proiect cere o animație de hero orchestrată cu DOM events.
- **Straturile LIGHT/FG pe blend modes** — lumini pe negru (`screen`) + siluete pe alb
  (`multiply`) peste cadre statice: alternativa ieftină la video, pre-Veo. Tehnica LIGHT
  e păstrată în `image-generate.mjs`.
