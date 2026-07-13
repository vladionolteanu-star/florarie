# POLISH-ROUND — template de rundă de finisare (culori + loading)

> Se folosește când montajul e VALIDAT și închis, iar feedback-ul rămas e de finisare:
> consistența culorilor între segmente și percepția de loading/smoothness.

---

# PROMPT SESIUNE NOUĂ — [PROIECT]: NORMALIZARE CULORI + LOADING SMOOTH

Copiază tot ce e mai jos într-o sesiune nouă, din folderul `[CALEA PROIECTULUI]`.

---

## ROL ȘI OBIECTIV

Ești colorist DI + performance engineer. Filmul e LIVE la **[URL]**. Montajul e VALIDAT
și închis — nu se mai taie nimic. Sesiunea are DOAR două obiective, în ordine:

1. **Normalizarea culorilor între segmente** — [citatul clientului, ex. „acum e oleacă haos"].
   Fiecare clip generat are propriul grade și racordurile sar de la o lume cromatică la alta.
2. **Loading & smoothness** — [citatul, ex. „pare greoi, nu smooth"]. Optimizezi percepția,
   FĂRĂ să schimbi arhitectura engine-ului (e validată).

Regula de aur: clientul validează VIZUAL. Repari, îi arăți, aștepți verdictul.

## STAREA EXACTĂ

[Ca în FEEDBACK-ROUND.md: pagina canonică + oglinda, SEGS + parametrii, masterele,
extract-frames.sh = sursa de adevăr pentru re-extracție (cu trim-urile + tratamentele
speciale existente — NU le pierde la re-extracție), posterele fallback, verificarea.]

## OBIECTIVUL 1 — NORMALIZAREA CULORILOR

Harta haosului (aproximativă — CONFIRM-O întâi cu probe):
- `[segment]`: [descrierea look-ului] — [ok / cel mai departe de rest].
- [continuă pentru fiecare segment...]

Direcția de lucru:
1. **DI, nu regenerare.** Gradezi cu ffmpeg în `extract-frames.sh` (colorbalance/curves/
   eq per segment), re-extragi segmentele modificate din mastere. Masterele NU se ating.
2. **Un singur „film stock"**: [definește-l — care umbre, care miduri, care alburi;
   ce culoare rămâne DOAR accent diegetic]. Referința = [pozele reale + segmentul-etalon].
3. **Racordurile sunt judecătorul**: pentru fiecare joint pune ultimul cadru lângă primul
   cadru și întreabă-te: „e același film?" Măsoară și programatic (ffmpeg signalstats),
   dar verdictul e vizual.
4. **Nu omorî povestea luminii**: [enumeră momentele dramaturgice care trebuie să rămână —
   turn-on-uri, neoane, blaze-uri]. Normalizezi TEMPERATURA și nivelele, nu dramaturgia.
   Subtil > agresiv: diferența să se simtă ca „același loc, aceeași noapte", nu ca un filtru.
5. După gradare: re-extragi, regenerezi posterele afectate, oglindești, push, verifici live.

## OBIECTIVUL 2 — LOADING & SMOOTHNESS

Întâi MĂSOARĂ, apoi optimizează:

1. **Profil real**: browser cu network throttling (Fast 3G / Slow 4G) + CPU 4x — găsește
   momentul exact „greoi": release-ul inițial? clamp-ul pe frontieră? decode jank la salturi?
2. Candidați, în ordinea impactului (validați cu măsurători înainte/după):
   - **START_AT mai mic**: release mai devreme, clamp-ul acoperă restul.
   - **Prioritizare fetch**: `fetchpriority="low"` pe cadrele din spate; `<link rel="preload">`
     pentru primele ~30.
   - **A doua rezoluție pe mobil** (ex. 960w în `film-s/`, engine-ul alege după viewport).
   - **AVIF în loc de WebP** (~30-40% mai mic; ATENȚIE decode-ul e mai scump — măsoară jank-ul).
   - Micro: dpr cap mai jos pe device-uri slabe, fereastra de bitmaps tunată.
   - **Cache headers pe secvențe** (vezi 06-deploy/vercel.json) — al doilea vizitator nu mai
     descarcă nimic.
3. **NU schimba arhitectura**: canvas scrub + lerp + preîncărcare progresivă + clamp =
   validate. Tunezi numere, formate, priorități — nu rescrii.
4. Smoothness-ul se validează pe live (sau throttled local), nu în headless.

## REGULI DE GUST (moștenite)

[Copiază din TASTE-RULES.md § Culoare + § Metodă de lucru.]

## PRIMUL PAS RECOMANDAT

Fă board-ul de racorduri ([N] perechi ultimul-cadru/primul-cadru, side-by-side, cu medii
hue/sat sub fiecare) + profilul de loading throttled. Cu ele confirmi diagnosticul —
abia apoi gradezi. Culorile întâi, loading-ul după.
