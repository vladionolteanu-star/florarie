# DESIGN.md — design system

> Completează-l la începutul proiectului și ține-l lângă cod. Orice sesiune AI îl citește
> înainte să scrie CSS. Registrul vizual = brandul; nu se improvizează per pagină.

---

# Design System — Florăria Iris

## Tokens

```css
:root{
  /* culori — derivate din pozele refs (perete alb texturat, structură neagră, bujori) */
  --paper:    #F4F1EC;   /* fundalul paginii — albul cald al peretelui din refs */
  --paper-2:  #FFFFFF;   /* suprafete ridicate (carduri) */
  --ink:      #141114;   /* text principal — negrul structurii împletite */
  --ink-soft: rgba(20,17,20,.72);
  --accent:   #D6367E;   /* rozul bujorilor; UN singur accent; in film NU intra, doar in UI */

  /* fonturi */
  --head: 'Cormorant Garamond', serif;
  --body: 'Inter', sans-serif;
  --mono: 'JetBrains Mono', monospace;   /* eyebrows, specs, loader */
}
```

## Reguli de tipografie
- Titluri: `--head`, weight 600-700 (seriful e deja dramatic — nu 800), `letter-spacing:-.01em`, `clamp()` pe mărimi.
- Eyebrow-uri: `--mono`, 11-12px, `letter-spacing:.24-.3em`, uppercase, culoare accent.
- Text: `--body`, `line-height:1.6-1.65`, lățime maximă `46-56ch`.

## Reguli de mișcare
- Easing-ul casei: `cubic-bezier(.16,1,.3,1)` pe reveal-uri; `expo.out` pe stagger-e GSAP.
- Doar `transform` + `opacity` pe DOM. Canvas pentru secvențe de cadre.
- Tot ce se mișcă are variantă `prefers-reduced-motion` (static sau instant).
- Fluiditatea E produsul (mood-ul = „impresionat de cât de smooth curge") — orice
  sacadare pe un telefon mid-range e bug de brand, nu detaliu.

## Componente recurente
- **Loader de film**: procent mono + bară de 2px cu `scaleX`.
- **Rail de progres**: dots fixe pe dreapta, unul per act, `.on` = accent + scale 1.6.
- **Lens**: vinietă radială peste film, ține ochiul în centru.
- **Noise**: SVG turbulence fix peste tot, opacity .05.
- **CTA sticky „Comandă buchetul"**: vizibil permanent, `--accent` pe `--paper`,
  nu acoperă centrul filmului; pe mobil jos, atingibil cu degetul mare.

## Ce NU se face
- Al doilea accent de culoare. Gradient-uri decorative pe text. Text peste film.
- Accentul roz în interiorul cadrelor de film — filmul își are culorile lui reale
  (bujori, visiniu, negru); rozul `--accent` există doar în UI.
- CTA care dispare, se ascunde la scroll sau își schimbă poziția — e sticky, punct.
