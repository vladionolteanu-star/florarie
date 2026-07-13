# refs/ — fotografiile reale ale locației

Pune aici **3–5 fotografii reale** ale locației/subiectului (jpg sau png).
Ele sunt **adevărul vizual absolut** al proiectului: `image-generate.mjs` le atașează
la fiecare scenă cu `refs: true`, iar modelul reproduce locația exactă — arhitectură,
materiale, mobilier, paletă.

Reguli învățate în producție:

- Poze cu **lumina reală a locului** (nu blitz), din unghiuri diferite.
- Detaliile care apar în poze devin lege — enumeră-le explicit și în `VENUE`
  (ex. „dark WOODEN cross-back bistro chairs, NEVER plastic").
- **Imagen nu ține referințele** — inventează altă locație. Pentru scene se folosește
  doar Gemini Pro Image cu refs. (Testul de comparație există în `image-generate.mjs`.)
