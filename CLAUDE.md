# Working in this repo

## Keep pipeline.md and llms.txt honest

[website/docs/pipeline.md](website/docs/pipeline.md) is the site's agent-facing
claim about its own pipeline: which tools run, how many workflows exist, how
many custom Vale rules exist, and what each one does. Treat every number and
name in it as a claim that must match the repo, not prose.

Whenever a change touches anything pipeline.md describes — adding, removing,
or renaming a workflow in `.github/workflows/`, adding or removing a rule in
`.vale/styles/Diana/`, changing what `.codespellignore` or `.lychee.toml`
exclude, or changing the OpenAPI spec's shape — re-read the relevant section
of pipeline.md and update it in the same change. Pure content edits (blog
posts, docs prose that isn't describing the pipeline itself) don't need this.

A quick self-check before finishing a non-content change:

```
ls .github/workflows/ | wc -l
ls .vale/styles/Diana/ | wc -l
```

Compare both counts against what pipeline.md states in "GitHub Actions — the
pipeline itself" and "Vale — custom rule authoring." If they don't match,
fix pipeline.md, not just the count — describe the new/changed workflow or
rule the same way its siblings are described.

`website/static/llms.txt` states the same two counts and is not hand-edited:
`scripts/generate-llms-txt.py` renders it from `scripts/llms-txt.template`
plus live repo state, so the counts themselves can't drift the way
pipeline.md's once did. After adding or removing a workflow, run
`python3 scripts/generate-llms-txt.py` — the workflow count updates
automatically. After adding or removing a Vale rule, add or remove that
rule's plain-English description in `scripts/pipeline-facts.json` in the
same change, then run the generator — it refuses to run if a rule exists
with no matching description, rather than silently shipping an inaccurate
count. Never hand-edit the generated sections of `llms.txt` directly; a
manual edit there just gets overwritten the next time the generator runs.

The same rule applies to merge conflicts, which are the likelier way to get
this wrong. `generate-llms-txt.yml` commits a regenerated `llms.txt` to main
on a schedule and whenever the source facts change, so any branch that touches
`scripts/pipeline-facts.json` or `scripts/llms-txt.template` will conflict on
`llms.txt` if it stays open long enough. Don't resolve that conflict by picking
a side or by editing the merge result — both sides are stale renderings of
different sources, and hand-merging them produces a file that matches neither.
Resolve the source files first, run `python3 scripts/generate-llms-txt.py`, and
stage its output as the resolution. Confirm with
`python3 scripts/generate-llms-txt.py --check` before committing; it fails if
the committed file isn't exactly what the current sources produce.

## Keep Doc Detective test pages consistent

Pages under `website/src/pages/doc-detective/` each document one Doc
Detective test and share a structure: an `<h1>` matching the page's
frontmatter `title`, a "Why this matters" section, a "Latest result" section
with the relevant status badge, a "How the test works" section with
numbered steps, and a "Run the test manually" section with the exact
commands to run it locally, plus a "Run the test on GitHub Actions"
subsection when the test has its own workflow. A "What makes this test
fail" section appears whenever the failure condition isn't obvious from
"How the test works" alone.

Before adding a new page to this directory, read an existing sibling page
and match its heading order and level rather than inventing a new shape.
A page can deviate from a piece of this structure (for example, an
explainer page with no dedicated workflow can skip "Run the test on GitHub
Actions"), but say why in the prose the way
[the screenshot comparison test](website/src/pages/doc-detective/screenshot-comparison-test.mdx)
does, rather than silently dropping a section its siblings have.
