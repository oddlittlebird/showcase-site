#!/usr/bin/env bash
# Confirm the live llms.txt matches what scripts/generate-llms-txt.py would
# currently produce from the checked-out template + live repo facts (Vale
# rule count and names, workflow count). This is a full content diff, not a
# heading count -- if the deployed file has drifted from what the current
# repo state says it should say, in any way the template covers, this fails.
#
# The live side and the generated side aren't the same kind of fetch: "live"
# reflects whatever GitHub Pages last finished deploying, and "generated"
# reflects the commit this workflow just checked out -- which can be seconds
# old. Right after a merge that changes llms.txt's underlying facts, the
# push-triggered test can start running before the deploy it depends on has
# finished, so a first-attempt mismatch doesn't necessarily mean drift, it
# can just mean deploy hasn't caught up yet. Retry with a bounded wait before
# treating a mismatch as real.
set -euo pipefail

BASE_URL="https://oddlittlebird.github.io/showcase-site"
MAX_ATTEMPTS=10
SLEEP_SECONDS=15

generated_content=$(python3 scripts/generate-llms-txt.py --stdout)

attempt=1
while [ "$attempt" -le "$MAX_ATTEMPTS" ]; do
  live_content=$(curl -sf "${BASE_URL}/llms.txt") || {
    echo "FAIL: could not fetch ${BASE_URL}/llms.txt"
    exit 1
  }

  if [ "$live_content" == "$generated_content" ]; then
    echo "PASS: live llms.txt matches the current repo facts."
    exit 0
  fi

  if [ "$attempt" -lt "$MAX_ATTEMPTS" ]; then
    echo "Live content doesn't match yet (attempt ${attempt}/${MAX_ATTEMPTS}) -- deploy may still be in progress, retrying in ${SLEEP_SECONDS}s..."
    sleep "$SLEEP_SECONDS"
  fi
  attempt=$((attempt + 1))
done

echo "FAIL: the live llms.txt still does not match what the current repo facts would generate after ${MAX_ATTEMPTS} attempts (~$((MAX_ATTEMPTS * SLEEP_SECONDS)) seconds)."
echo "--- diff (live vs. generated) ---"
diff <(echo "$live_content") <(echo "$generated_content") || true
exit 1
