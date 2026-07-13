# PROMPT PENTRU SESIUNE NOUĂ — Florăria Iris „Povestea unui buchet"

Copiază tot ce e mai jos într-o sesiune nouă, din folderul `C:\Users\volteanu\Downloads\floraria-iris-scrolly`.

---

## ROL ȘI OBIECTIV

Ești motion designer + creative developer pe un film de scrollytelling generat cu AI.
Obiectivul unic al sesiunii: **prima generare de cadre-ancoră — actul 1 validat vizual,
apoi restul lanțului de cadre**. Setup-ul e DEJA făcut cu /new-client: brief-ul, povestea,
refs, tokens, ADN-ul vizual din `image-generate.mjs`/`veo-generate.mjs` sunt validate —
nu le reinventa. Lucrezi DOAR pe generarea și validarea cadrelor-ancoră.

## CONTEXT PROIECT — CE EXISTĂ DEJA (nu reconstrui)

- `PRODUCT.md` — brief validat: pagină cinematică mobil-first care vinde buchete-cadou
  pentru Florăria Iris (din 1970, București); CTA sticky „Comandă buchetul"; scroll scurt.
- `DESIGN.md` — tokens validate: paper `#F4F1EC`, ink `#141114`, accent `#D6367E` (doar UI,
  nu în film), Cormorant Garamond + Inter + JetBrains Mono.
- `02-content-pipeline/image-generate.mjs` — generator funcțional (Gemini 3 Pro Image,
  cheie pe tier plătit); VENUE + FILM + SCENES completate: 3 acte, lanțuri dolly
  wide→mid→close (`act1-f1/f2`, `act2-f1/f2`, `act3-f1`). Rulare: `node image-generate.mjs <id>`.
- `02-content-pipeline/veo-generate.mjs` — Veo 3.1 confirmat pe cheie; SHOTS completate:
  act1/act2/act3 (travelling) + bridge12 (tulpina din apă) + bridge23 (bucla panglicii),
  toate `durationSeconds: 8` (obligatoriu la first+last frame conditioning).
- `02-content-pipeline/refs/` — 5 cadre reale (decupate din materialul Instagram al
  florăriei; originalele în `refs-raw/`). ADEVĂRUL VIZUAL ABSOLUT: bujori roz dublii,
  anthurium visiniu lucios, ghirlande de cireșe pe sârmă, structură cilindrică neagră din
  fire împletite, lumânări negre conice, masă neagră cu tacâmuri aurii, perete alb
  texturat, lumină naturală cu umbre dure, ferigă vopsită visinie. Nu au voie să derive.
- `anchors/`, `out/` — goale; nimic generat încă.
- Unelte: node v24 ✓, ffmpeg 8 ✓, cheie în `.env` ✓ (`gemini-3-pro-image` + `veo-3.1` confirmate).

## POVESTEA (VALIDATĂ — nu o schimba)

1. **Atelierul în zori** — flori crude în găleți, lumină de dimineață, abur; materia primă
   a unui cadou. *Punte 1→2: tulpina ridicată din apă, picături în contra-lumină.*
2. **Mâinile care leagă** — close pe mâinile floristului, tulpini în spirală, buchetul
   crește; meșteșug din 1970. *Punte 2→3: panglica trasă se înfășoară peste cadru.*
3. **Dăruirea** — buchetul finit, ambalat, întins spre cameră; CTA-ul sticky e continuarea
   gestului.

## PROBLEMA DE REZOLVAT — SINGURUL SCOP AL SESIUNII

Prima generare de cadre-ancoră. Nimic nu e generat încă — riscul de sesiune e să produci
mult și prost în loc de puțin și validat.

**Ce vrea clientul, în cuvintele lui:** să fie „impresionat de cât de smooth se desfășoară
animația și ce frumos se formează buchetul de flori" — fluiditatea E produsul.

**Gramatica de calitate (spec):** TASTE-RULES § Gramatica tranzițiilor — pornire
contextuală → zoom pe element diegetic → reveal DIN element; mișcarea nu se oprește
niciodată; punțile trec prin element sau lumină, niciodată swap la vedere.

## METODE PERMISE

Metoda e deja aleasă și configurată: cadre-ancoră Gemini (refs + base chaining) →
Veo 3.1 first→last frame → canvas scrub pe scroll. Nu explora alternative în sesiunea asta.

Recomandare: prototipează întâi UN SINGUR beat cap-coadă la calitate maximă —
**actul 1 + puntea tulpinii (bridge12)** — arată-l, și abia după validare scalează.
NU construi tot și abia apoi arăți.

## BARA DE CALITATE — CRITERII DE ACCEPTARE

- Cadrele reproduc refs-urile: aceleași flori, materiale, perete, lumină — zero derivă.
- Nicio schimbare de cadru vizibilă ca „swap"; orice cut e mascat de element sau lumină.
- Mișcarea nu se oprește, nu-și schimbă brusc viteza, nu „aterizează" vizibil.
- Fără AI tells: fețe citibile, sincron, morphing, colaje (vezi TASTE-RULES § AI tells).
- Mobil-first: totul se validează la final pe telefon, nu doar pe desktop.

## CE SĂ NU FACI

- Nu schimba povestea, punțile, VENUE/FILM/SCENES/SHOTS validate sau paleta.
- Nu pune text peste film; accentul roz nu intră în film (doar UI).
- Nu regenera cadre fără motiv — foarfeca înainte de regenerare; ce e lăudat nu se atinge.
- Nu-i cere clientului specificații — validează VIZUAL: arată, cere verdict.
- Sesiunea asta NU se ocupă de: SEGS/VH_PER_UNIT/START_AT în `scroll-film.html`
  (depind de cadrele care nu există încă), copy-ul paginii, deploy.

## PRIM PAS RECOMANDAT

1. Citește `PRODUCT.md`, `DESIGN.md`, `04-session-handoff/TASTE-RULES.md`.
2. Uită-te la cele 5 refs din `02-content-pipeline/refs/` până poți enumera adevărul vizual.
3. Rulează `node image-generate.mjs act1-bg` și **validează vizual cadrul înainte de orice
   video** — comparație directă cu refs (materiale, flori, perete, lumină).
4. Doar după validare: lanțul dolly (`act1-f1`, `act1-f2`), apoi `veo-generate.mjs act1 --fast`
   ca probă ieftină de mișcare.
5. Arată beat-ul, așteaptă verdictul, abia apoi scalează la actele 2-3 și punți.
