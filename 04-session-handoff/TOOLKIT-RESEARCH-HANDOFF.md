# SESSION HANDOFF — Scrollytelling Toolkit Research

> **Context:** Sesiune de documentare/research. Nu s-a atins cod.
> **Scop:** Optimizare workflow scrollytelling — stop reinventing the wheel.
> **Proiect curent:** Florăria Iris (`floraria-iris-scrolly/`)
> **Data:** 2026-07-14

---

## Problema reală (din interviu grill-me)

**Nu engine-ul de scrub e problema** (ăla merge bine). Problema e că la **iterațiile de generare** (Gemini ancore + Veo video) se pierde enorm de mult timp din cauza:

1. **Prompturi vagi** → Veo nu înțelege ce tranziție vrei → zeci de iterații
2. **Zero referințe vizuale concrete** → nu ai ce să atașezi ca exemplu
3. **Zero prompt templates testate** → scrii de la zero de fiecare dată
4. **Zero catalog de tipuri de tranziții** → nu ai vocabular structurat

**Soluția dorită:** Un toolkit/catalog local cu:
- Referințe vizuale (stills din site-uri de referință + exemplele proprii)
- Prompt templates (curatoriate din ce există deja, NU scrise de la zero)
- Demo-uri interactive folosind **review.html** (editorul existent), nu demo-uri separate
- Folder local separat, refolosibil între proiecte

---

## Ce există DEJA open-source — CURATORIAT

### 🎬 Engine-uri de canvas scrub

| Repo | Ce face | Link |
|------|---------|------|
| **GSAP ScrollTrigger** (free) | Industry standard, scrub + pin + timeline | gsap.com/scrolltrigger |
| **GSAP Gist — Image Sequence** | Helper function canonic pt canvas scrub | github gist GreenSock/cf91d79868c28052445c7170154687d7 |
| **canvas-scroll-clip** | Micro-library standalone | github.com/m5kr1pka/canvas-scroll-clip |
| **basement scrollytelling** (React) | `ImageSequenceCanvas` built-in | github.com/basementstudio/scrollytelling |

### 📚 Liste curatoriate + exemple live

| Resursă | Ce conține | Link |
|---------|-----------|------|
| **awesome-scrollytelling** | Lista master: librării, tools, exemple | github.com/vaitko/awesome-scrollytelling |
| **scrollytelling.ai** | Platformă AI care generează scrollytelling (Lenis+GSAP+chapters), monochrome design system premium — de studiat codul lor ca referință | scrollytelling.ai |
| **Really Good Designs** | 21 exemple curate pe categorii: 3D, product demo, tipografie, ilustrat | reallygooddesigns.com/scrollytelling-website-examples |
| **Shorthand** | 12 exemple scroll-driven de la publisheri mari + tips practice | shorthand.com/the-craft/scrollytelling-examples |
| **GitHub #scrollytelling** | Topic browsable | github.com/topics/scrollytelling |
| **GitHub #scroll-driven-animations** | CSS scroll-driven specific | github.com/topics/scroll-driven-animations |

### 🎥 Prompt generators și ghiduri Veo (NU scrii de la zero)

| Resursă | Ce face | Link |
|---------|---------|------|
| **veo3-prompt-generator** | 10 preseturi (Cinematic, Documentary etc.), parametri cameră, export JSON/MD | github.com/shijincai/veo3-prompt-generator |
| **veo-prompt-generator** (Chrome ext) | Structurează prompturi în JSON | github.com/JayashBhandary/veo-prompt-generator |
| **Veo-3-Prompting-Guide** | "Universal Meta Prompt Engine" + advanced techniques | github.com/snubroot/Veo-3-Prompting-Guide |
| **Google DeepMind — Veo 3 Guide** | Ghid oficial de prompting | deepmind.google/models/veo/prompt-guide |
| **Google Cloud — Veo 3.1 Guide** | Ghid oficial avansat | cloud.google.com/blog/.../veo-3-1 |

### 🎞️ Baze de referințe vizuale cinematice

| Resursă | Ce face | Relevant pentru |
|---------|---------|-----------------|
| **ShotDeck** | 1.8M+ stills din filme, searchable + Clip Tool pt motion | Referințe precise pe tip de tranziție |
| **Film Vibes** | AI search pt camera movement + filtre pe tranziții | "dolly through", "portal" |
| **Genery** | Motion frames (video/GIF) + AI mood boarding | Referințe de mișcare |

### 📐 Notă despre taxonomia tranzițiilor

Taxonomia din TASTE-RULES (nivel 0-4) e deja superioară celei generice din industrie.
NU o înlocui — o completezi cu referințe vizuale concrete din ShotDeck/Film Vibes.

---

## Decizii luate

1. ✅ Template refolosibil între proiecte
2. ✅ Interfață: review.html (editorul existent), nu demo-uri separate
3. ✅ Folder local separat
4. ✅ Cadrele de la Iris ca material de referință inițial
5. ✅ Prompt templates CURATORIATE din resurse existente, nu scrise de la zero
6. ⚠️ Tipurile de tranziții se justifică pe baza taxonomiei TASTE-RULES, nu alese arbitrar
7. ⚠️ scrollytelling.ai — de studiat codul (Lenis+GSAP+chapters, design system monochrome premium, mobile responsive clamps) ca posibil shortcut

---

## Pași concreți pentru sesiunea următoare

### Faza 1: Curatoriere (nu construire)

1. **Clonează/inspectează** `veo3-prompt-generator` și `Veo-3-Prompting-Guide` — extrage template-urile relevante pentru tipurile de tranziție din TASTE-RULES
2. **Parcurge** `awesome-scrollytelling` — identifică exemple live care demonstrează fiecare nivel (0-4)
3. **Inspectează** `canvas-scroll-clip` și GSAP gist — compară cu engine-ul din beat-prototype
4. **Consultă** ShotDeck / Film Vibes — caută stills de referință pe "dolly through", "portal transition", "light wipe", "scale reveal"
5. **Studiază** scrollytelling.ai — design system-ul lor (CSS variables, Fraunces font, mobile clamps, grain/vignette layers) e template premium refolosibil

### Faza 2: Structurare toolkit

6. **Creează folder** `scrollytelling-toolkit/` local
7. **Integrează review.html** ca interfață unică de browsing tranzițiilor
8. **Organizează** referințe vizuale + prompt templates curatoriate per tip de tranziție
9. **Documentează** ce cadrele de la Iris ilustrează (bridge12b = portal optic, act1-3 = dolly through)

### Faza 3: Testare

10. **Testează un prompt** din veo3-prompt-generator pe o tranziție portal — compară cu prompturile manuale din `veo-generate.mjs`
11. **Validează** că workflow-ul nou reduce iterațiile

---

## Fișiere de citit la kickoff

| Fișier | Esențial? |
|--------|-----------|
| `PRODUCT.md` | Da |
| `DESIGN.md` | Da |
| `WORKFLOW.md` | Da |
| `04-session-handoff/TASTE-RULES.md` | **ESENȚIAL** |
| `01-canvas-scrub/beat-prototype.html` | Da |
| `03-smooth-scroll/lenis-gsap.html` | Da |
| `02-content-pipeline/veo-generate.mjs` | Da (de comparat cu templates) |
| `02-content-pipeline/image-generate.mjs` | Da |

---

## Tonul sesiunii

**Curatorezi, nu construiești.** Orice lucru construit de la zero trebuie justificat prin lipsa unei alternative existente.
