# Reguli de lucru

## Comunicare
- Răspunde în **română**, scurt și la obiect. Fără explicații lungi — arată rezultatul.
- Nu inventa niciodată date (prețuri, date de calendar, copy, nume). Dacă lipsesc, întreabă-mă.

## Brand Florăria Iris
- Culori (derivate din refs la setup, 2026 — nu există brandbook formal):
  Paper `#F4F1EC`, Ink `#141114`, Accent roz bujor `#D6367E`.
- Fonturi: Cormorant Garamond (titluri) + Inter (text) + JetBrains Mono (eyebrows/loader).
- Brand: „Florăria Iris — din 1970". Copy autentic de pe florariairis.ro — nu inventat.
- UN singur accent (rozul); accentul NU intră în film, doar în UI. Vezi `DESIGN.md`.
- La orice animație/hero: cere-mi întâi specs (culori, font, referință vizuală) și
  potrivește-le exact din prima.

## Scrollytelling
- Clientul validează VIZUAL — nu-i cere specificații; arată-i, cere verdict.
- Prototip pe UN beat → validare → scalare. Niciodată tot dintr-o dată.
- Regulile de gust din `04-session-handoff/TASTE-RULES.md` sunt barem implicit.
- Engine-ul canvas-scrub validat NU se rescrie; se schimbă doar CONFIG (SEGS/HOLD/LEAD/…).
- CTA-ul „Comandă buchetul" e sticky și nu dispare niciodată la scroll — e regulă de produs.
- Adevărul vizual = `02-content-pipeline/refs/` (5 cadre): bujori roz dublii, anthurium
  visiniu, ghirlande de cireșe, structură neagră împletită, perete alb texturat, lumină
  naturală. Detaliile astea nu au voie să derive între cadre.

## UI / HTML
- Mobil-first: pagina se validează pe telefon (Instagram in-app browser, Safari iOS,
  Chrome Android) înainte de desktop.
- După orice modificare de UI, verifică că n-ai stricat altceva (header, carduri, poze,
  butoane) înainte să zici „gata".
- La deploy: confirmă că pagina e legată în homepage/bio (nu orfană), dă-mi link-ul live.
- Folderul local și folderul de deploy rămân oglinzi identice.
