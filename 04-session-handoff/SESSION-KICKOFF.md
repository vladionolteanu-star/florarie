# SESSION-KICKOFF — template de pornire sesiune AI

> Meta-pattern-ul: documentezi sesiunea curentă astfel încât următoarea sesiune AI să preia
> fără pierdere de context. Un handoff bun are: starea exactă, constrângerile de gust,
> metoda pas cu pas, guardrails („ce NU faci") și primul pas recomandat.
>
> Completează parantezele drepte, șterge ce nu se aplică, copiază tot în sesiunea nouă.

---

# PROMPT PENTRU SESIUNE NOUĂ — [PROIECT] „[NUMELE POVEȘTII]"

Copiază tot ce e mai jos într-o sesiune nouă, din folderul `[CALEA PROIECTULUI]`.

---

## ROL ȘI OBIECTIV

Ești [motion designer + creative developer / regizor de montaj / colorist DI].
Obiectivul unic al sesiunii: **[UN SINGUR OBIECTIV — ex. „tranzițiile și mișcarea din
pagina X trebuie să ajungă la nivelul <referință>"]**. [CE E DEJA VALIDAT — ex. „storyline-ul,
imaginile și look-ul sunt DEJA validate — nu le reinventa."] Lucrezi DOAR pe [zona sesiunii].

## CONTEXT PROIECT — CE EXISTĂ DEJA (nu reconstrui)

- `[fișier principal]` — [starea lui: ce funcționează, ce NU satisface clientul și de ce]
- `[scripturi pipeline]` — [generatoare funcționale, modele folosite, cum se rulează]
- `[refs/]` — [câte poze reale, ce loc; enumeră ADEVĂRUL VIZUAL ABSOLUT: materiale,
  mobilier, palete — detaliile care nu au voie să derive]
- `[assets/]` — [ce cadre sunt generate și validate, cu numele lor exacte]

## POVESTEA (VALIDATĂ — nu o schimba)

[Actele, într-o propoziție fiecare. Ex.:]
1. **[Actul 1]** — [o propoziție].
2. **[Actul 2]** — [o propoziție].
3. **[Finalul]** — [o propoziție].

## PROBLEMA DE REZOLVAT — SINGURUL SCOP AL SESIUNII

[Ce a respins clientul și DE CE, în cuvintele lui, cu ghilimele. Ex.: „sacadat", „nu e artă".]

**Ce vrea, în cuvintele lui:** [citat + referințele pe care le-a dat].

**Analiza gramaticii referinței (folosește-o ca spec):**
[Descompune referința în pași — vezi TASTE-RULES.md § Gramatica tranzițiilor.]

## METODE PERMISE — NU EXCLUDE NIMIC, ALEGE CE ATINGE CALITATEA

[Opțiunile tehnice, în ordinea probabilă a raportului calitate/efort, cu trade-off-uri.
Pe Headliners au fost: (1) video scrubbed pe scroll — Veo first→last frame + canvas;
(2) element persistent + match-cuts; (3) 2.5D depth parallax WebGL; (4) GSAP pur disciplinat.
A câștigat (1).]

Recomandare: prototipează întâi UN SINGUR beat cap-coadă la calitate maximă —
**[beat-ul cu puntea cea mai clară / climaxul]** — arată-l clientului, și abia după validare
scalează metoda. NU construi tot și abia apoi arăți.

## BARA DE CALITATE — CRITERII DE ACCEPTARE

- Nicio schimbare de cadru vizibilă ca „swap"; orice cut e mascat de element, lumină sau mișcare.
- Mișcarea nu se oprește, nu-și schimbă brusc viteza, nu „aterizează" cu decelerări vizibile.
- Fiecare tranziție are o logică narativă pe care o poți spune în cuvinte.
- 60fps la scroll pe desktop (doar transform/opacity pe DOM; canvas pentru secvențe).
- `prefers-reduced-motion`: layout static cu cadrele-cheie.
- Mobil: flux simplificat, fără scroll-hijack agresiv.

## CE SĂ NU FACI

- Nu schimba [povestea / cadrele validate / look-ul / paleta].
- Nu pune text peste imagini. [Alte interdicții vizuale ale proiectului.]
- Nu regenera cadre fără motiv — doar dacă o punte cere un cadru nou.
- Nu-i cere clientului specificații — el validează VIZUAL. Arată-i prototipul, cere verdict.
- Sesiunea asta NU se ocupă de: [lista zonelor explicit excluse].

## PRIM PAS RECOMANDAT

1. [Deschide starea actuală și înțelege-o.]
2. [Uită-te la assets + refs.]
3. [Studiază referința de calitate până poți descrie gramatica fiecărui beat.]
4. [Decide metoda pentru beat-ul-prototip; verifică întâi accesul la API-uri cu un call minim.]
5. [Construiește DOAR beat-ul ăla, arată-l, așteaptă verdictul.]
