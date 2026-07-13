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
SPEC="
act1 . . 94
bridge12 . . 60
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
  vf="fps=$FPS,scale=$WIDTH:-2"
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
