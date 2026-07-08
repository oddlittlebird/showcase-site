#!/usr/bin/env bash
# Fetch the live llms.txt and compare its h2 count against the stored baseline.
set -euo pipefail

BASE_URL="https://oddlittlebird.github.io/showcase-site"

live_content=$(curl -sf "${BASE_URL}/llms.txt") || {
  echo "FAIL: could not fetch ${BASE_URL}/llms.txt"
  exit 1
}

baseline_json=$(curl -sf "${BASE_URL}/doc-detective/llms-txt-headings.json") || {
  echo "FAIL: could not fetch baseline heading counts"
  exit 1
}

live=$(echo "$live_content" | grep -c "^## " || true)
baseline=$(echo "$baseline_json" | python3 -c "import sys, json; print(json.load(sys.stdin)['h2'])")

if [ "$live" != "$baseline" ]; then
  echo "FAIL: live h2 count (${live}) differs from baseline (${baseline})"
  exit 1
fi

echo "PASS: h2 count matches baseline (${baseline})"
