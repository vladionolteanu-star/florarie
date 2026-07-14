#!/bin/sh
# Post-productie (DI): extrage secventele WebP din masterele mp4 — reteta Headliners.
# usage: sh extract-frames.sh   (ruleaza din 02-content-pipeline/; masterele in out/)
#
# ROLUL FISIERULUI ASTA = SURSA DE ADEVAR pentru montaj + culoare:
#   - TRIM per segment (ss/to in secunde) — nu tot clipul intra in film; genereaza generos,
#     taie aici. Orice re-taiere se face DIN MASTER, niciodata din WebP-uri.
#   - numar FIX de cadre livrate (-frames:v) — pin-uit ca rotunjirile de fps sa nu difere
#     intre versiuni de ffmpeg; numerele TREBUIE sa ramana sincron cu SEGS din pagina.
#   - GRADE per segment (grade_for) — fiecare clip Veo vine cu propriul "look";
#     aici il racordezi la stock-ul comun al filmului.
#   - exemple pastrate din productia reala (comentate): rampa temporala de grade (blend)
#     si vinieta cu rampa (geq) — le adaptezi cand un segment cere tratament special.
#
# RETETA DE LIVRARE (validata in productie): 18fps, 1344w, libwebp q54.
#   ~60-90KB/cadru; un film intreg de ~600 cadre = ~40MB. Pe mobil poti extrage si o
#   a doua rezolutie (960w, folder film-s/) daca traficul o cere.
#
# LECTII DI (sesiunea "acum e oleaca haos" — nu le reinvata):
#   - Alegi un singur "film stock" de referinta (segmentul cu look-ul corect) si aduci
#     restul LA EL. Normalizezi TEMPERATURA si nivelele, NU dramaturgia luminii —
#     un turn-on de lumina, un neon diegetic, un blaze final raman ce sunt.
#   - Judecatorul = RACORDURILE: ultimul cadru al segmentului A langa primul al lui B.
#     Intrebarea: "e acelasi film?" Masori si programatic (ffmpeg signalstats), decizi vizual.
#   - NU folosi pl=1 la colorbalance — face pete gri-verzui in umbrele saturate.
#   - Masterele mp4 NU se ating niciodata; tot DI-ul e refacut din ele, idempotent.
set -e
cd "$(dirname "$0")"

OUTDIR="../01-canvas-scrub/assets/film"   # unde ajung secventele (schimba per proiect)
FPS=18
WIDTH=1344
QUALITY=54

# id  ss(sec)  to(sec)  frames  — gol (.) inseamna de la inceput / pana la final
# COMPLETEAZA cu segmentele proiectului tau; numerele de cadre = coloana 2 din SEGS.
# FILMUL INTREG din masterele existente (fara regenerari):
#   - bridge12b INTREG (0-8s: startul pastreaza jointul IDENTIC cu finalul lui bridge12a,
#     finalul = ancora emerge, singurul cadru registrat cu act2 => sursa buna de blend)
#     dar COMPRIMAT la 60 de cadre: trecerea prin apa e o maturare rapida pe scroll.
#   - cusatura bridge12b->act2 e netezita DUPA extractie (vezi JOINT SMOOTHING la final).
#     Cauza de fond (pt. urmatoarea runda platita): ancora bridge12-emerge are valul ca
#     LINIE DE APA orizontala peste incapere => citeste "atelier inundat". La regenerare:
#     valul = picaturi/dare pe LENTILA, niciodata waterline peste camera.
#   - bridge23 e masterul vechi (perdea/nivel 2) — placeholder pana la portalul 2->3.
SPEC="
act1 . . 144
bridge12a . . 144
bridge12b . . 60
act2 . . 144
bridge23 . . 144
act3 . . 144
"

# Gradul de culoare per segment — porneste gol, completezi DUPA boardul de racorduri.
# Exemple REALE din productia Headliners (magenta/violet adus la tungsten cald):
#   beat12)   echo "colorbalance=rs=0.03:bs=-0.10:bm=-0.05";;
#   filmact2) echo "colorbalance=rs=0.03:bs=-0.11:bm=-0.06,eq=saturation=0.92";;
grade_for() {
  case "$1" in
    *)        echo "";;
  esac
}

echo "$SPEC" | while read -r id ss to fr; do
  [ -z "$id" ] && continue
  if [ ! -f "out/$id.mp4" ]; then echo "LIPSESTE: out/$id.mp4"; continue; fi
  args=""
  [ "$ss" != "." ] && args="$args -ss $ss"
  [ "$to" != "." ] && args="$args -to $to"
  # fps-ul REAL = cadre / durata intervalului — asa numarul cerut de cadre acopera TOT
  # intervalul (compresie temporala), nu doar primele fr/FPS secunde (truncare!).
  dur=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "out/$id.mp4")
  s0=$ss; [ "$s0" = "." ] && s0=0
  s1=$to; [ "$s1" = "." ] && s1=$dur
  segfps=$(awk "BEGIN{printf \"%.6f\", $fr / ($s1 - $s0)}")
  vf="fps=$segfps,scale=$WIDTH:-2"
  g=$(grade_for "$id")
  [ -n "$g" ] && vf="$vf,$g"

  # ——— EXEMPLE DE TRATAMENT SPECIAL (din productia reala; decomenteaza si adapteaza) ———
  # 1. RAMPA TEMPORALA DE GRADE: capul segmentului primeste grade-ul segmentului precedent,
  #    care se stinge treptat pana la T=2.8s (racord perfect de culoare la joint):
  # if [ "$id" = "bridge34" ]; then
  #   GRADE_PREV="colorbalance=rs=0.02:bs=-0.13:bm=-0.06"
  #   vf="$vf,split[o1][o2];[o1]$GRADE_PREV[g1];[g1][o2]blend=all_expr='B+(A-B)*max(0\,1-T/2.8)'"
  # fi
  # 2. VINIETA CU RAMPA TEMPORALA (geq): intuneca progresiv o margine a cadrului pe coada
  #    segmentului (N = nr. cadrului) — ex. ascunde ce nu trebuie vazut langa un element:
  # if [ "$id" = "bridge34" ]; then
  #   G="(1-clip((N-95.5)/11\,0\,1)*0.93*clip((0.36-X/W)/0.20\,0\,1))"
  #   vf="$vf,geq=r='r(X,Y)*$G':g='g(X,Y)*$G':b='b(X,Y)*$G'"
  # fi

  mkdir -p "$OUTDIR/$id"
  rm -f "$OUTDIR/$id"/f_*.webp
  ffmpeg -nostdin -y -v error $args -i "out/$id.mp4" -vf "$vf" -frames:v "$fr" -c:v libwebp -q:v "$QUALITY" "$OUTDIR/$id/f_%03d.webp"
  n=$(ls "$OUTDIR/$id" | wc -l | tr -d ' ')
  kb=$(du -sk "$OUTDIR/$id" | cut -f1)
  echo "$id: $n cadre, ${kb}KB (asteptat $fr)"
done

# ——— JOINT SMOOTHING (post, fara regenerare): cusatura bridge12b -> act2 ———
# bridge12b se termina cu val de apa pe lentila; masterul act2 porneste curat => pop dur.
# Crossfade IN ACEEASI LUME (permis — nu e trecere intre lumi: acelasi atelier, doar valul
# de apa se stinge): ULTIMUL cadru de apa (f_060 — compozitional aproape identic cu startul
# act2, ambele derivate din act2-wide) se stinge peste primele J cadre din act2. Contra unui
# cadru FIX, nu pereche-cu-pereche — altfel mainile din apa (deplasate) fac dubluri vizibile.
# Idempotent: ruleaza dupa extractia act2 (cadrele-tinta sunt mereu proaspete).
J=12
if [ -f "$OUTDIR/bridge12b/f_060.webp" ] && [ -f "$OUTDIR/act2/f_001.webp" ]; then
  k=1
  while [ "$k" -le "$J" ]; do
    kk=$(printf "%03d" "$k")
    w=$(awk "BEGIN{printf \"%.4f\", $k/($J+1)}")
    ffmpeg -nostdin -y -v error -i "$OUTDIR/act2/f_$kk.webp" -i "$OUTDIR/bridge12b/f_060.webp" \
      -filter_complex "[0:v]format=gbrp[a];[1:v]format=gbrp[b];[a][b]blend=all_expr='A*$w+B*(1-$w)'" \
      -frames:v 1 -c:v libwebp -q:v "$QUALITY" "$OUTDIR/act2/tmp_$kk.webp"
    mv "$OUTDIR/act2/tmp_$kk.webp" "$OUTDIR/act2/f_$kk.webp"
    k=$((k + 1))
  done
  echo "joint bridge12b->act2: crossfade pe $J cadre (valul de apa se stinge in act2)"
fi
