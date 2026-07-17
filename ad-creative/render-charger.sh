#!/bin/bash
# Renders the Charger ad in all four Meta placement sizes via headless Chrome.
# Note: if Chrome was restarted mid-render, re-run this (headless procs get killed).
set -e
cd "$(dirname "$0")"
CHROME="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
SRC="file://$PWD/ad-charger.html"

# fmt:WIDTHxHEIGHT  (Meta placements)
#   portrait  1080x1350  4:5    feed master (primary)
#   story     1080x1920  9:16   Stories + Reels
#   square    1080x1080  1:1    carousel + Marketplace
#   landscape 1200x628   1.91:1 right column + desktop + Audience Network
for spec in portrait:1080,1350 story:1080,1920 square:1080,1080 landscape:1200,628; do
  fmt="${spec%%:*}"; size="${spec#*:}"
  out="$PWD/rl-charger-$fmt.png"
  rm -f "$out"
  "$CHROME" --headless=new --disable-gpu --hide-scrollbars \
    --force-device-scale-factor=1 --default-background-color=00000000 \
    --window-size="$size" --screenshot="$out" "$SRC?fmt=$fmt" >/dev/null 2>&1
  echo "rendered rl-charger-$fmt.png ($size)"
done
