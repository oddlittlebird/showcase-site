# Working in this repo

## Keep pipeline.md honest

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
