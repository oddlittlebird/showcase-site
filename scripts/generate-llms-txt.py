#!/usr/bin/env python3
"""Generate website/static/llms.txt from scripts/llms-txt.template plus live
repo facts, so its factual claims (rule counts, rule names, workflow count)
can't drift from reality the way hand-typed prose can.

Content that isn't derivable from the filesystem (what each Vale rule does in
plain English, the API renderer name) lives in scripts/pipeline-facts.json,
the one place that has to be hand-updated when something new is added. If a
Vale rule file exists with no matching entry there, or vice versa, this
script fails loudly instead of silently generating an inaccurate file.

Run with --check to verify the checked-out template+facts would produce
exactly what's currently committed, without writing anything (a local/CI
sanity check that the source file wasn't hand-edited out of sync with its
generator). Run with --stdout to print the generated content instead of
writing it, so it can be diffed against the live deployed llms.txt (see
scripts/check-llms-facts.sh) -- that's the check that actually matters,
since the source can be correct while the deployed site still lags behind it.
"""

import json
import sys
import textwrap
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parent.parent
FACTS_PATH = REPO_ROOT / "scripts" / "pipeline-facts.json"
TEMPLATE_PATH = REPO_ROOT / "scripts" / "llms-txt.template"
OUTPUT_PATH = REPO_ROOT / "website" / "static" / "llms.txt"
VALE_RULES_DIR = REPO_ROOT / ".vale" / "styles" / "Diana"
WORKFLOWS_DIR = REPO_ROOT / ".github" / "workflows"

NUMBER_WORDS = {
    1: "one", 2: "two", 3: "three", 4: "four", 5: "five",
    6: "six", 7: "seven", 8: "eight", 9: "nine", 10: "ten",
    11: "eleven", 12: "twelve", 13: "thirteen", 14: "fourteen", 15: "fifteen",
    16: "sixteen", 17: "seventeen", 18: "eighteen", 19: "nineteen", 20: "twenty",
}


def number_word(n):
    return NUMBER_WORDS.get(n, str(n))


def wrap_bullet(text, width=78, indent="  "):
    return textwrap.fill(
        text,
        width=width,
        initial_indent="- ",
        subsequent_indent=indent,
        break_long_words=False,
        break_on_hyphens=False,
    )


def load_facts():
    return json.loads(FACTS_PATH.read_text(encoding="utf-8"))


def discover_vale_rule_files():
    return sorted(p.name for p in VALE_RULES_DIR.glob("*.yml"))


def validate_vale_rules(facts):
    documented = {r["file"] for r in facts["valeRules"]}
    actual = set(discover_vale_rule_files())

    missing_descriptions = actual - documented
    stale_descriptions = documented - actual

    if missing_descriptions or stale_descriptions:
        lines = ["Vale rule facts are out of sync with .vale/styles/Diana/:"]
        for f in sorted(missing_descriptions):
            lines.append(f"  - {f} exists but has no description in {FACTS_PATH.relative_to(REPO_ROOT)}")
        for f in sorted(stale_descriptions):
            lines.append(f"  - {f} has a description in {FACTS_PATH.relative_to(REPO_ROOT)} but no longer exists")
        lines.append("Update pipeline-facts.json to match before regenerating llms.txt.")
        print("\n".join(lines), file=sys.stderr)
        sys.exit(1)


def render(facts):
    validate_vale_rules(facts)

    rule_count = len(facts["valeRules"])
    workflow_count = len(list(WORKFLOWS_DIR.glob("*.yml")))

    rule_list = "\n".join(
        wrap_bullet(f"{r['file']}: {r['description']}") for r in facts["valeRules"]
    )
    rule_names_csv = ", ".join(r["file"] for r in facts["valeRules"])

    template = TEMPLATE_PATH.read_text(encoding="utf-8")
    output = (
        template
        .replace("{{VALE_RULE_COUNT_CAP}}", number_word(rule_count).capitalize())
        .replace("{{VALE_RULE_COUNT_WORD}}", number_word(rule_count))
        .replace("{{VALE_RULE_LIST}}", rule_list)
        .replace("{{VALE_RULE_NAMES_CSV}}", rule_names_csv)
        .replace("{{WORKFLOW_COUNT_WORD}}", number_word(workflow_count))
        .replace("{{API_RENDERER}}", facts["apiRenderer"])
    )
    return output


def main():
    check_mode = "--check" in sys.argv
    stdout_mode = "--stdout" in sys.argv

    facts = load_facts()
    generated = render(facts)

    if stdout_mode:
        sys.stdout.write(generated)
        return

    if check_mode:
        if not OUTPUT_PATH.exists():
            print(f"FAIL: {OUTPUT_PATH.relative_to(REPO_ROOT)} does not exist", file=sys.stderr)
            sys.exit(1)
        current = OUTPUT_PATH.read_text(encoding="utf-8")
        if current != generated:
            print("FAIL: website/static/llms.txt does not match what the template + live repo facts would generate.", file=sys.stderr)
            print("Run: python3 scripts/generate-llms-txt.py", file=sys.stderr)
            sys.exit(1)
        print("PASS: website/static/llms.txt matches the generated content.")
        return

    OUTPUT_PATH.write_text(generated, encoding="utf-8")
    print(f"Wrote {OUTPUT_PATH.relative_to(REPO_ROOT)}")


if __name__ == "__main__":
    main()
