#!/bin/bash
# Renders ad-tiktok.html into a 1080x1920 9:16 video via headless-Chrome frame-seeks
# (?t=<ms> freezes animations at that time) + ffmpeg. TikTok-native both-cars ad.
set -e
cd "$(dirname "$0")"
CHROME="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
SRC="file://$PWD/ad-tiktok.html"
FPS=24
DUR_MS=8500                 # 5 scenes x 1.7s
FRAMES=$(( DUR_MS * FPS / 1000 ))
STEP=$(python3 -c "print(1000/$FPS)")
DIR=$(mktemp -d)
echo "rendering $FRAMES frames @ ${FPS}fps into $DIR ..."
for i in $(seq 0 $((FRAMES-1))); do
  t=$(python3 -c "print(int($i*$STEP))")
  out=$(printf "$DIR/f_%04d.png" "$i")
  "$CHROME" --headless=new --disable-gpu --hide-scrollbars \
    --force-device-scale-factor=1 --window-size=1080,1920 \
    --screenshot="$out" "$SRC?t=$t" >/dev/null 2>&1
done
echo "encoding mp4 ..."
ffmpeg -y -framerate $FPS -i "$DIR/f_%04d.png" \
  -c:v libx264 -pix_fmt yuv420p -movflags +faststart -r $FPS \
  redline-tiktok.mp4 >/dev/null 2>&1
rm -rf "$DIR"
echo "done -> $PWD/redline-tiktok.mp4"
ls -la redline-tiktok.mp4 | awk '{print $5, "bytes"}'
