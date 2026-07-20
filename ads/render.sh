#!/bin/bash
# Renders the COMPLIANT sweepstakes ad (ad.html) in all Meta placement sizes via
# headless Chrome. Copy follows the post-ban Meta rules: NPN + free entry + all
# disclaimers, "Sweepstakes" not "Giveaway", Learn More CTA, not-affiliated note.
set -e
cd "$(dirname "$0")"
CHROME="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
SRC="file://$PWD/ad.html"

# fmt:WIDTHxHEIGHT  (Meta 2026 recommended pixel sizes)
#   square    1080x1080  1:1    Feed / carousel / right column
#   feed      1080x1350  4:5    single-image Feed (most vertical space)
#   story     1080x1920  9:16   Stories + Reels (safe-zoned)
#   landscape 1200x628   1.91:1 links / desktop
for spec in square:1080,1080 feed:1080,1350 story:1080,1920 landscape:1200,628; do
  fmt="${spec%%:*}"; size="${spec#*:}"
  out="$PWD/rl-sweeps-$fmt.png"
  rm -f "$out"
  "$CHROME" --headless=new --disable-gpu --hide-scrollbars \
    --force-device-scale-factor=1 --window-size="$size" --screenshot="$out" "$SRC?fmt=$fmt" >/dev/null 2>&1
  echo "rendered rl-sweeps-$fmt.png ($size)"
done
