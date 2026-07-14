# TASTE-RULES — ce omoară iluzia în conținut generat cu AI

Regulile de gust acumulate în producția Headliners (3 runde de feedback client pe un film
scroll-scrub generat integral cu AI). Ele sunt **baremul implicit** al oricărui proiect nou
de scrollytelling din retetarul ăsta. Copiază-le în prompturile de sesiune și tratează-le
ca ne-negociabile până când clientul proiectului tău spune altceva.

## AI tells fatale (le tai sau regenerezi, nu le „reparăm în post")

1. **Identitatea derivă.** Orice personaj care își schimbă sexul/părul/hainele între două
   cadre consecutive rupe tot. Personajele se văd puțin, din spate sau în contre-jour.
2. **Sincronul.** Mulțimile reale sunt asincrone: fiecare pe beat-ul lui, amplitudini mici.
   „Râd toți sincron" = se vede că e AI de la o poștă. În prompt: *„each person on their own
   beat, small contained movements"* + negative *„synchronized laughter, uniform crowd motion"*.
3. **Fețe citibile în lumină directă = risc maxim.** Siluete, bokeh, contre-jour — mereu.
   În ADN-ul vizual: *„people only as dim silhouettes or backlit shapes, faces barely readable"*.
4. **Logica spațială e sfântă.** Un spațiu închis rămâne închis; lumea de dincolo se vede
   doar prin fanta care o definește. Nicio cameră nu „trișează" un unghi care dezvăluie
   ce nu ar trebui să existe încă.
5. **Camera care pulsează.** Un travelling e O SINGURĂ decizie: intri, punct. Zoom in–zoom out
   în același clip = tăiat din montaj sau regenerat cu constrângere dură
   (*„the camera NEVER slows, NEVER pulls back, one uninterrupted forward glide"*).

## Gramatica tranzițiilor (bara tinyPod)

Referința de calitate: thetinypod.com. Gramatica fiecărui beat:

1. **Pornire contextuală** — scena respiră larg, te așezi în context.
2. **Zoom deștept pe un ELEMENT diegetic** — nu pe coordonate abstracte; obiectul rămâne
   vizibil și coerent pe tot parcursul.
3. **Reveal** — următoarea lume se deschide DIN elementul respectiv; elementul e puntea logică.
4. Mișcarea **nu se oprește și nu sare niciodată**; totul e o singură curgere cu bătăi de ritm.

Corolar: **punțile dintre lumi trec printr-un element diegetic sau prin lumină** (prin rig,
prin glare, prin cortină) — niciodată swap de imagini la vedere, niciodată crossfade expus.
Dar „a trece printr-un element" e doar minimul: ridică-l la standard de **portal** — vezi secțiunea
următoare, e cea mai importantă și cea mai des ratată regulă de tranziție.

## Punți = portaluri, nu perdele (regula de bridge)

O punte proastă e o **perdea**: un element trece prin fața camerei, acoperă cadrul, lumea se schimbă
în spate, elementul se retrage. Funcțional, dar previzibil — spectatorul înțelege că „ceva a mascat un
cut" și scrollează mai departe fără să-l observe. O punte bună e un **portal**: camera intră ÎN elementul
diegetic, îi traversează interiorul, și iese în lumea următoare. Cele două lumi **nu sunt niciodată
vizibile simultan** — lumea 2 apare doar *refractată prin element* (prin picătură, prin bucla de
panglică, prin reflexie pe metal), apoi devine reală pe măsură ce traversezi. Elementul-punte există
**fizic în ambele lumi** (aceeași picătură de pe tulpină, aceeași panglică de pe buchet).

Taxonomie — de la banal la magic. **Ținta e nivel 3-4, niciodată sub 3:**

| Nivel | Tehnică | Efect |
|-------|---------|-------|
| 0 · Cut | cadrul se schimbă brusc | rupere |
| 1 · Wipe | obiect trece prin fața camerei | „am ascuns un cut" |
| 2 · Mască fizică | camera intră în element, fill 100% opac | „n-am văzut cut-ul" |
| 3 · **Portal optic** | camera intră ÎN element, traversează, iese refractat | „cum au făcut asta?!" |
| 4 · **Metamorfoză** | elementul se *transformă* în ceva din lumea 2 | „e aceeași lume" |

**Nota la nivel 4:** metamorfoza se face prin **rimă de formă** (spirala tulpinilor → spirala
panglicii: potrivire de compoziție și de mișcare), NICIODATĂ prin texture-morph — „morphing
flowers" e AI tell fatal, nu tranziție. Dacă nu poți construi rima de formă, rămâi la nivel 3.

**Nota de scrub:** filmul nu rulează, e SCRUBUIT — degetul vizitatorului poate îngheța ORICE cadru.
Momentul de străpungere (pierce) trebuie să stea în picioare ca fotografie crispă: fără motion blur
smear, fără „burst" ilizibil. În MOTION: *„every frame must stand alone as a crisp 35mm still"*.

Concret în pipeline (`02-content-pipeline/`), o punte-portal cere patru lucruri:

1. **Cadre-ancoră dedicate** per punte — NU refolosești wide-ul actului următor ca last-frame.
   Două ancore noi: INTERIOR (macro în interiorul elementului, lumea 2 refractată — punctul de
   control) și EMERGE (ieșirea, refracția se resoarbe; base-chained din wide-ul actului următor).
   **Lanțul de cusături e sfânt pe AMBELE capete**: puntea PORNEȘTE pe chiar ultimul cadru al
   actului precedent — orice stare nouă a elementului-portal (picătura, bucla) se naște ÎN clip,
   nu între clipuri — iar actul următor PORNEȘTE pe cadrul EMERGE. Fiecare joint din montaj cade
   pe două cadre identice; altfel ai reintrodus un cut nivel 0 chiar la ușa portalului.
2. **Prompturi de bridge 3-4× mai lungi decât actele** — cu traseul optic (refracție, focus shift,
   distorsiunea care se corectează), ce vede camera pe etape, ce NU face (nu se oprește, nu se
   întoarce, nu face dissolve, nu arată două lumi simultan), și fizica luminii în interior (caustice
   prin apă, reflexii pe satin).
   **Etapele se scriu cu TIMESTAMP PROMPTING, nu cu procente** (validat pe Iris, 2026-07-14):
   sintaxa oficială Veo 3.1 `[00:00-00:02] … [00:02-00:04] …` a ținut traseul optic al portalului
   prin picătură acolo unde „AT 25%/50%/75%" eșuase de 3 ori (fără picătură, atelier inundat).
   Timestamps = shot list pe care modelul o respectă; procentele = doar sugestie.
   Template-ul complet: `scrollytelling-boilerplate/toolkit/VEO-TEMPLATES.md` §3+§7.
3. **Cadru macro-interior generat** (nu doar scris ca PNG de reparație) ca punct de control intermediar:
   puntea rulează în 2 clipuri care se întâlnesc pe cadrul INTERIOR (cel mai adânc punct), nu pe o mască
   opacă. Probează întâi single-clip <ultimul cadru al actului>→EMERGE pe `--fast`; dacă ține
   continuitatea, puntea rămâne UN clip și montajul se simplifică.
4. **Ancorele de portal se validează ca stills înainte de orice video** — sunt cele mai exotice cadre
   din film. La INTERIOR, diferența dintre nivel 3 și un AI tell e lizibilitatea apei/țesăturii:
   menisc, bule, caustice vizibile — altfel „refracția" citește ca double exposure. Regula asta e
   implicită de-acum pentru orice punte din retetar.

Punțile sunt ~30% din durata filmului dar ~80% din impactul emoțional — singurul moment în care
vizitatorul simte „nu e o prezentare, e un film". Dacă tratezi puntea ca pe un cut mascat, ai ratat
oportunitatea principală a întregului pipeline.

## Montaj

- **Cusătura în negru** (validată pe Iris, 2026-07-14): două mastere diferite se pot coase
  invizibil pe cadre complet NEGRE — ex. perdeaua care acoperă cadrul (masterul vechi) tăiată
  exact pe negrul complet + interiorul de tunel al altui master, cu punctul de lumină care se
  „aprinde" imediat după cusătură. Așa un element care altfel „pică din cer" (tunelul de satin)
  se leagă diegetic de obiectul care a umplut cadrul. Fereastra de negru e de obicei sub 0.5s —
  se găsește cu probe fine (fps=8), nu cu ochiul liber pe play.
- **Zonele slabe se comprimă temporal, nu se taie** când sunt în mijlocul unui drum de cameră:
  aceleași secunde primesc de 2-3× mai puține cadre în SPEC (segment separat, ex. bridge12x) —
  pe scroll defectul trece în câteva cadre în loc să locuiască acolo.
- **Mai scurt e mai bun.** Fiecare act ține cât să respiri o dată. Punțile sunt vedetele;
  actele sunt respirațiile dintre ele. **Când tai, taie din acte, niciodată din punți.**
- **Foarfeca înainte de regenerare.** Tot ce se rezolvă cu trim + SEGS/HOLD/LEAD se rezolvă
  așa; regenerarea e ultima soluție (mai scumpă, riscă să strice ce era bun).
- **Nu regenera ce e lăudat.** Segmentele validate explicit de client sunt etaloane —
  mp4-urile lor nu se șterg, clipurile nu se ating.
- Un element care apare de două ori consecutiv (două segmente la rând) își expune
  genericitatea — personajul principal apare O dată pe secvență, apoi camera merge mai departe.

## Culoare (DI)

- **Normalizezi TEMPERATURA, nu dramaturgia.** Un turn-on de lumină, un neon diegetic,
  un blaze final rămân ce sunt; aduci doar umbrele/midurile la același stock.
- **Racordurile sunt judecătorul**: ultimul cadru al segmentului A lângă primul al lui B —
  „e același film?" Măsori programatic (ffmpeg signalstats), decizi vizual.
- **NU `colorbalance` cu `pl=1`** — face pete gri-verzui în umbrele saturate.
- DI se face din mastere (idempotent), niciodată din cadrele deja extrase.

## Metodă de lucru cu clientul

- **Clientul validează VIZUAL. Nu-i cere specificații.** Repari, îi arăți, aștepți verdictul.
- **Prototipezi UN beat cap-coadă la calitate maximă**, îl arăți, și abia după validare
  scalezi metoda. Niciodată „construiește tot și abia apoi arată".
- O singură validare intermediară per rundă — pe drumul critic (cadrul de care depind
  celelalte regenerări). Restul îi arăți la final, totul deodată.
- **Probe întâi**: înainte să tai sau să regenerezi, extrage cadre la 0.5s din segmentele
  suspecte și confirmă diagnosticul cu ochii tăi.
