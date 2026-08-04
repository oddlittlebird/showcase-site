#!/usr/bin/env bash
# Confirm the live llms.txt matches what scripts/generate-llms-txt.py would
# currently produce from the checked-out template + live repo facts (Vale
# rule count and names, workflow count). This is a full content diff, not a
# heading count -- if the deployed file has drifted from what the current
# repo state says it should say, in any way the template covers, this fails.
set -euo pipefail

BASE_URL="https://oddlittlebird.github.io/showcase-site"

live_content=$(curl -sf "${BASE_URL}/llms.txt") || {
  echo "FAIL: could not fetch ${BASE_URL}/llms.txt"
  exit 1
}

generated_content=$(python3 scripts/generate-llms-txt.py --stdout)

if [ "$live_content" != "$generated_content" ]; then
  echo "FAIL: the live llms.txt does not match what the current repo facts would generate."
  echo "--- diff (live vs. generated) ---"
  diff <(echo "$live_content") <(echo "$generated_content") || true
  exit 1
fi

echo "PASS: live llms.txt matches the current repo facts."
