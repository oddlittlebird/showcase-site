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
