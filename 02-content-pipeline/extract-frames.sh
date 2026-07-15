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

# id  ss(sec)  to(sec)  frames  [src]  — gol (.) = de la inceput / pana la final;
# src (optional) = masterul mp4 din out/ daca difera de id (mai multe segmente pot
# taia din acelasi master, sau un segment poate purta alt nume decat masterul).
# COMPLETEAZA cu segmentele proiectului tau; numerele de cadre = coloana 2 din SEGS.
#
# MONTAJUL CURENT (2026-07-14, "cat se poate din edit, fara regenerari"):
#   - bridge12 + bridge12x = bridge12-ts.mp4 (proba fast cu logica cea mai corecta:
#     picatura pendanta din tulpina, fara cascade). 0-6s ritm normal; 6-8s comprimat
#     in 20 de cadre — fereastra de ghosting (~6.2-7.2s) trece rapid pe scroll.
#     Masterele respinse: bridge12-v1/v2-respins (AT% / full cu picatura "din cer").
#   - bridge23 (vechi, perdea) taiat la 5.5s = NEGRU complet (panglica acopera tot),
#     cusut IN INTUNERIC cu bridge23p = bridge23-portal.mp4 de la 2.0s (tunel intunecat,
#     punctul de lumina se aprinde in fata). Asa tunelul de satin se naste DIN panglica
#     trasa peste cadru — diegetic, nu "picat din cer". Intrarea cu tub rigid (0-2s din
#     portal) e ARUNCATA la montaj.
# Montaj v3 (review 2026-07-14 14:43, 4 marcaje):
#   ACT1 ELIMINAT COMPLET — filmul incepe direct pe tulpina (bridge12 @0.4s); primele
#   8 secunde nu ajutau povestea · bridge23w primeste ZOOM DE PLONJARE in tunel (crop
#   progresiv, vezi zoom_seg jos) · act3 se opreste la 2.0s (inainte de festivalul
#   mainilor) si se incheie cu zoom progresiv IN buchet.
# SMOOTHNESS PASS (2026-07-14, "sacadat/lag"): fiecare segment adus la ~18fps (reteta de
#   livrare) — act2 70->103 (era 12fps, sacadat) si tunelul bridge23p 30->58 (era 9fps,
#   cel mai sacadat cadru din film). Ritmul de scroll ramane 3.85vh/cadru => act2 si
#   tunelul ocupa proportional mai mult scroll, dar curg fin. Lag-ul se taie din LERP_K
#   (6.5->9) in beat-prototype.html, nu de aici.
SPEC="
bridge12 0.4 6 100 bridge12-ts
bridge12x 6 7.3 13 bridge12-ts
act2 2.3 8 103
bridge23 0.3 5.1 86
bridge23w 5.1 5.92 9 bridge23
bridge23p 2.25 5.5 58 bridge23-portal
bridge23r 5.5 7.35 34 bridge23-portal
act3 0 2.0 36
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

echo "$SPEC" | while read -r id ss to fr src; do
  [ -z "$id" ] && continue
  [ -z "$src" ] || [ "$src" = "." ] && src=$id
  if [ ! -f "out/$src.mp4" ]; then echo "LIPSESTE: out/$src.mp4"; continue; fi
  args=""
  [ "$ss" != "." ] && args="$args -ss $ss"
  [ "$to" != "." ] && args="$args -to $to"
  # fps-ul REAL = cadre / durata intervalului — asa numarul cerut de cadre acopera TOT
  # intervalul (compresie temporala), nu doar primele fr/FPS secunde (truncare!).
  dur=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "out/$src.mp4")
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
  ffmpeg -nostdin -y -v error $args -i "out/$src.mp4" -vf "$vf" -frames:v "$fr" -c:v libwebp -q:v "$QUALITY" "$OUTDIR/$id/f_%03d.webp"
  n=$(ls "$OUTDIR/$id" | wc -l | tr -d ' ')
  kb=$(du -sk "$OUTDIR/$id" | cut -f1)
  echo "$id: $n cadre, ${kb}KB (asteptat $fr)"
done

# ——— JOINT SMOOTHING: valul de apa se stinge lin in act2 (readus 2026-07-14, montaj v2) ———
# bridge12x se termina cu val pe lentila (7.3s), act2 porneste curat (2.3s) => "dispare
# brusc" (marcaj Vlad). Crossfade IN ACEEASI LUME (permis — acelasi atelier, doar valul se
# stinge): ULTIMUL cadru cu val (bridge12x/f_013) se stinge peste primele J cadre din act2.
# Contra unui cadru FIX, nu pereche-cu-pereche. Idempotent (cadrele-tinta sunt proaspete).
J=10
if [ -f "$OUTDIR/bridge12x/f_013.webp" ] && [ -f "$OUTDIR/act2/f_001.webp" ]; then
  k=1
  while [ "$k" -le "$J" ]; do
    kk=$(printf "%03d" "$k")
    w=$(awk "BEGIN{printf \"%.4f\", $k/($J+1)}")
    ffmpeg -nostdin -y -v error -i "$OUTDIR/act2/f_$kk.webp" -i "$OUTDIR/bridge12x/f_013.webp" \
      -filter_complex "[0:v]format=gbrp[a];[1:v]format=gbrp[b];[a][b]blend=all_expr='A*$w+B*(1-$w)'" \
      -frames:v 1 -c:v libwebp -q:v "$QUALITY" "$OUTDIR/act2/tmp_$kk.webp"
    mv "$OUTDIR/act2/tmp_$kk.webp" "$OUTDIR/act2/f_$kk.webp"
    k=$((k + 1))
  done
  echo "joint bridge12x->act2: crossfade pe $J cadre (valul se stinge in act2)"
fi

# ——— ZOOM DE PLONJARE (DI pe cadre, montaj v3): crop progresiv centrat ———
# Simuleaza camera care se avanta: in tunelul de satin (bridge23w — "il bagi pe
# privitor in tunel") si in buchet la final (act3 — "zoom pe buchet si aia e").
# Idempotent: ruleaza dupa extractie, cadrele-tinta sunt mereu proaspete.
zoom_seg() { # $1=folder $2=primul_cadru $3=ultimul_cadru $4=zoom_final
  n=$2
  while [ "$n" -le "$3" ]; do
    kk=$(printf "%03d" "$n")
    z=$(awk "BEGIN{printf \"%.4f\", 1 + ($4 - 1) * ($n - $2 + 1) / ($3 - $2 + 1)}")
    ffmpeg -nostdin -y -v error -i "$OUTDIR/$1/f_$kk.webp" \
      -vf "crop=iw/$z:ih/$z,scale=$WIDTH:-2" \
      -c:v libwebp -q:v "$QUALITY" "$OUTDIR/$1/tmp_$kk.webp"
    mv "$OUTDIR/$1/tmp_$kk.webp" "$OUTDIR/$1/f_$kk.webp"
    n=$((n + 1))
  done
  echo "zoom $1: f_$2..f_$3 -> ${4}x (plonjare)"
}
zoom_seg bridge23w 1 9 1.35
zoom_seg act3 23 36 1.30
