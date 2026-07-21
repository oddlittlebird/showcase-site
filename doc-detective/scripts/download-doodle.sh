#!/usr/bin/env bash
set -euo pipefail

UA="Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
HTML=$(curl -fsSL -A "$UA" "https://www.google.com")

GIF_PATH=$(echo "$HTML" | { grep -oE 'src="/logos/doodles/[^"]+\.gif"' || true; } | head -1 | sed 's/src="//;s/"//')

if [ -z "$GIF_PATH" ]; then
  echo "No animated doodle today. Leaving the existing GIF untouched."
  exit 0
fi

GIF_URL="https://www.google.com$GIF_PATH"
curl -fsSL -o "website/static/doc-detective/doodle.gif" "$GIF_URL"
echo "Downloaded: $GIF_URL"

TODAY=$(date -u +"%Y-%m-%d")
printf '{"date": "%s"}\n' "$TODAY" > "website/static/doc-detective/doodle-gif-updated.json"
