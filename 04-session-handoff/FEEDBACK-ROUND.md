# FEEDBACK-ROUND — template de rundă de feedback pe filmul live

> Se folosește după ce clientul a văzut filmul și a dat feedback. Structura transformă
> feedback-ul brut în diagnostice de montaj cu direcție de rezolvare per punct — ca un
> regizor de montaj, nu ca un dev care „face fix-uri".

---

# PROMPT SESIUNE NOUĂ — [PROIECT]: RUNDA [N] DE FEEDBACK PE FILMUL LIVE

Copiază tot ce e mai jos într-o sesiune nouă, din folderul `[CALEA PROIECTULUI]`.

---

## ROL ȘI OBIECTIV

Ești regizor de montaj + creative developer. Filmul scroll-scrub „[NUME]" e LIVE la
**[URL]** și a primit feedback de la [CLIENT]. Sesiunea asta rezolvă DOAR cele [N] puncte
de mai jos, în ordinea impactului. Nimic altceva: [zonele excluse].

Regula de aur: clientul validează VIZUAL. Nu-i cere specificații. Repari, îi arăți, aștepți verdictul.

## STAREA EXACTĂ A PROIECTULUI (nu redescoperit, e totul aici)

- **Pagina**: `[fișier]` = [motorul + parametrii actuali: SEGS, LEAD, VH_PER_UNIT, START_AT].
  Dacă tai/adaugi cadre, actualizezi DOAR aceste numere.
- **Ordinea filmului** (`[cale]/f_%03d.webp`, [X]w, [Y]fps, q[Z]): [lista segmentelor în ordine,
  cu o propoziție ce e fiecare].
- **Sursele video**: `[out/<seg>.mp4]`. Orice re-tăiere se face DIN MP4, nu din WebP-uri:
  trim în `extract-frames.sh` → re-extragere.
- **Generare video nouă**: `veo-generate.mjs` — [modelul; ATENȚIE: first→last frame merge
  NUMAI cu durationSeconds: 8; render ~90-145s/clip].
- **Generare cadre statice noi**: `image-generate.mjs` — [modelul + refs; ce cadre-ancoră
  există deja și NU se regenerează].
- **Deploy**: [cum ajunge live + regula oglinzilor: folderul local și cel de deploy identice].
- **Verificare**: [playwright/browser + ce limite are măsurarea headless].

## FEEDBACKUL — PUNCTELE, CU DIRECȚIA DE REZOLVARE

> Citește-le ca un monteur. Tipic, problema comună: actele stau prea mult pe loc și expun
> exact ce nu suportă ochiul la imagine generată (repetiție, identități care derivă, sincron).
> Filmul devine mai bun tăind, nu adăugând.

### 1. [Zona] : „[citatul exact al clientului]"
[Diagnostic artistic: CE anume produce senzația reclamată.]
Fix, în ordinea costului:
a) **Taie din montaj**: [ce probe extragi, ce porțiune păstrezi, ce numere actualizezi].
b) Dacă nu ajunge: **regenerează cu constrângere dură**: „[promptul corectiv]" + negative „[...]".

### 2. [Zona] : „[citatul]"
[Diagnostic + fix recomandat + riscul lui + varianta de rezervă.]
[Dacă un segment vecin e LĂUDAT: marchează-l explicit „NU se atinge — e etalonul".]

### [continuă pentru fiecare punct...]

## REGULI DE GUST — CE OMOARĂ ILUZIA

[Copiază secțiunile relevante din TASTE-RULES.md + ce ai învățat NOU în runda asta.
Regulile noi se adaugă înapoi în TASTE-RULES.md la finalul sesiunii.]

## METODĂ DE LUCRU

1. **Probe întâi**: extrage cadre la 0.5s din segmentele suspecte și uită-te la ele.
   Confirmă diagnosticele înainte să tai.
2. **Montaj înainte de regenerare**: tot ce se poate rezolva cu foarfeca (trim + SEGS +
   HOLD/LEAD) se rezolvă cu foarfeca. Regenerarea e pentru [punctele care o cer].
3. [Validarea intermediară — DOAR pe drumul critic: cadrul de care depind celelalte
   regenerări se validează cu clientul înainte să construiești pe el.]
4. După validare: re-encodezi segmentele modificate ([rețeta de livrare]), oglindești în
   [folderul de deploy], push, verifici live.
5. Actualizează [memoria / TASTE-RULES.md] cu ce s-a schimbat.

## CE SĂ NU FACI

- Nu schimba engine-ul paginii (e validat). Doar SEGS/HOLD/LEAD/timeline.
- Nu atinge [zonele excluse]. Nu adăuga text peste imagini.
- Nu regenera cadrele-ancoră validate — excepția e DOAR [excepția rundei].
- Nu-i cere clientului specificații. Arată-i. El decide vizual.

## PRIMUL PAS RECOMANDAT

[Pasul 1 concret + de ce el e drumul critic.]
