#!/usr/bin/env bash
# Fetch each portfolio work-sample file and confirm it's a real, complete
# document, not just a URL that returns 200. Lychee already checks that these
# links resolve; this catches a corrupted upload, an accidentally emptied
# file, or a redirect/error page masquerading as a 200.
set -euo pipefail

BASE_URL="https://oddlittlebird.github.io/showcase-site/portfolio"
MIN_PDF_BYTES=10000
MIN_MD_BYTES=500

# file (URL-encoded, relative to BASE_URL) | type
files=(
  "Add%20a%20query%20variable%20_%20Grafana%20Labs.pdf|pdf"
  "Value%20mappings%20_%20Grafana%20Labs.pdf|pdf"
  "Find%20HTML%20Selector%20_%20Macrometa.pdf|pdf"
  "Manage%20Click%20Interaction%20Policies%20_%20Macrometa.pdf|pdf"
  "Integrate%20Fingerprint%20as%20First%20Party%20_%20Macrometa.pdf|pdf"
  "cockroachdb-tutorial.md|md"
)

failed=0
tmpfile=$(mktemp)
trap 'rm -f "$tmpfile"' EXIT

for entry in "${files[@]}"; do
  file="${entry%%|*}"
  type="${entry##*|}"
  url="${BASE_URL}/${file}"

  if ! curl -sf "$url" -o "$tmpfile"; then
    echo "FAIL: could not fetch ${url}"
    failed=1
    continue
  fi

  size=$(wc -c < "$tmpfile" | tr -d ' ')

  if [ "$type" = "pdf" ]; then
    magic=$(head -c 4 "$tmpfile")
    if [ "$magic" != "%PDF" ]; then
      echo "FAIL: ${file} does not start with a PDF header (got: ${magic})"
      failed=1
      continue
    fi
    if [ "$size" -lt "$MIN_PDF_BYTES" ]; then
      echo "FAIL: ${file} is ${size} bytes, below the ${MIN_PDF_BYTES}-byte minimum for a real PDF"
      failed=1
      continue
    fi
  else
    if ! grep -q "^# " "$tmpfile"; then
      echo "FAIL: ${file} has no top-level markdown heading"
      failed=1
      continue
    fi
    if [ "$size" -lt "$MIN_MD_BYTES" ]; then
      echo "FAIL: ${file} is ${size} bytes, below the ${MIN_MD_BYTES}-byte minimum"
      failed=1
      continue
    fi
  fi

  echo "PASS: ${file} (${size} bytes)"
done

exit $failed
