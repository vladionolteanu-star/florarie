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

## Montaj

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
