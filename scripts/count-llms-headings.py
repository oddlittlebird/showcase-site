#!/usr/bin/env python3
"""Count headings by level in llms.txt and write results to a JSON file."""

import json
import re
import sys
from datetime import datetime, timezone
from pathlib import Path

src = Path("website/static/llms.txt")
out = Path("website/static/doc-detective/llms-txt-headings.json")

if not src.exists():
    print(f"Error: {src} not found", file=sys.stderr)
    sys.exit(1)

text = src.read_text(encoding="utf-8")

counts = {
    "h1": len(re.findall(r"^# (?!#)", text, re.MULTILINE)),
    "h2": len(re.findall(r"^## (?!#)", text, re.MULTILINE)),
    "h3": len(re.findall(r"^### (?!#)", text, re.MULTILINE)),
    "timestamp": datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ"),
}

out.parent.mkdir(parents=True, exist_ok=True)
out.write_text(json.dumps(counts, indent=2) + "\n", encoding="utf-8")

print(f"h1: {counts['h1']}, h2: {counts['h2']}, h3: {counts['h3']}")
