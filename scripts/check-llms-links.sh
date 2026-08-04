#!/usr/bin/env bash
# Confirm every root-relative link inside the live llms.txt actually resolves.
# Lychee already link-checks this site, but its config excludes root-relative
# paths (they resolve against a localhost base and get caught by the
# localhost exclude rule) -- see .lychee.toml's comment. This test exists
# specifically to cover the class of link Lychee structurally can't.
set -euo pipefail

BASE_URL="https://oddlittlebird.github.io/showcase-site"

content=$(curl -sf "${BASE_URL}/llms.txt") || {
  echo "FAIL: could not fetch ${BASE_URL}/llms.txt"
  exit 1
}

links=$(echo "$content" | grep -oE '\]\(/[^)]*\)' | sed -E 's/^\]\(//; s/\)$//' | sort -u)

if [ -z "$links" ]; then
  echo "FAIL: no root-relative links found in llms.txt to check"
  exit 1
fi

failed=0
while IFS= read -r link; do
  url="${BASE_URL}${link}"
  code=$(curl -s -o /dev/null -w '%{http_code}' -L "$url")
  if [ "$code" != "200" ]; then
    echo "FAIL: ${link} -> ${url} returned ${code}"
    failed=1
  else
    echo "PASS: ${link} -> ${code}"
  fi
done <<< "$links"

exit $failed
