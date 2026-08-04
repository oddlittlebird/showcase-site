#!/usr/bin/env python3
"""Check a PR's changed files against scripts/coupling-map.json and flag any
group where some files changed but not others -- a soft prompt to confirm
the untouched side still matches, not a hard failure. This exists because
CLAUDE.md-style "remember to also update X" instructions don't scale: they
depend on a future session correctly recalling every coupled pair. A known,
maintained map plus a mechanical diff check doesn't depend on anyone
remembering anything except to run this (which CI does automatically).

This does not attempt to discover couplings on its own -- it only ever
flags a relationship someone already wrote down in coupling-map.json. It
can't catch an unknown coupling, only an unconfirmed known one. See the
monthly review routine for the part that asks whether the map itself is
still complete.

Usage: python3 scripts/check-coupling.py <changed-file-path> [<changed-file-path> ...]
Exits 0 always -- this is informational, never a build gate. Prints any
flagged groups to stdout for a CI step to relay as a PR comment.
"""

import json
import sys
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parent.parent
MAP_PATH = REPO_ROOT / "scripts" / "coupling-map.json"


def main():
    changed = set(sys.argv[1:])
    if not changed:
        print("No changed files provided; nothing to check.")
        return

    groups = json.loads(MAP_PATH.read_text(encoding="utf-8"))
    flagged = []

    for group in groups:
        files = group["files"]
        touched = [f for f in files if f in changed]
        untouched = [f for f in files if f not in changed]
        if touched and untouched:
            flagged.append((group["description"], touched, untouched))

    if not flagged:
        print("No coupling gaps found.")
        return

    print("Possible documentation drift -- confirm these still match:\n")
    for description, touched, untouched in flagged:
        print(f"- {description}")
        print(f"  Changed: {', '.join(touched)}")
        print(f"  Not changed, please confirm still accurate: {', '.join(untouched)}")
        print()


if __name__ == "__main__":
    main()
