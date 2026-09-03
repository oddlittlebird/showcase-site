---
title: Documentation Pipeline Portfolio
description: "The agent-facing description of this site's documentation pipeline: every automated check, the tool that runs it, when it runs, and what it blocks."
last_reviewed: 2026-08-05
---

# Documentation Pipeline Portfolio

This site is a working demonstration of an end-to-end documentation quality
pipeline. It exists to show, with running code rather than claims, that the person
who built it can design, implement, and maintain documentation systems that
work for both human readers and AI agents.

## What the pipeline does

Every content change passes through automated quality gates before reaching
the published site:

| Check | Tool | When it runs | What it blocks |
|-------|------|-------------|----------------|
| Style and terminology | Vale | Pull request | Errors block merge |
| Spelling | codespell | Pull request | Any misspelling blocks merge |
| Broken external links | Lychee | Push to main + weekly | Any broken URL |
| Procedural accuracy | Doc Detective | Push to main | Any failed UI test |
| Front matter | docmeta | Pull request | Missing or malformed metadata blocks merge |

## What each tool demonstrates

Each tool in the stack was chosen to catch a specific failure mode. Here is what each one does and what the implementation shows.

### Vale — custom rule authoring

The site runs three rule sets: Vale's built-in rules, the Google developer
documentation style guide, and a custom style written for this pipeline.

The custom rules:

**Passive.yml** — warns on passive voice constructions using Vale's
`existence` extension with a regex token list. Level: warning. Surfaces in
pull request review comments via the reviewdog integration, not just as a
failed check.

**Terminology.yml** — enforces preferred terms using Vale's `substitution`
extension. `utilize`, `leverage`, `spin up`, and `kick off` are flagged
as errors that block merge. Level: error.

**StackedHeadings.yml** — flags headings that immediately follow other
headings with no prose between them. Uses `scope: text` with a raw
multiline regex. That pattern requires understanding how Vale's scope
system works at the document level, beyond what most users ever reach.

**Acronyms.yml** — extends Vale's `conditional` rule to require that an
acronym be spelled out on first use, with an exception list of acronyms
common enough to skip (API, HTML, URL, and similar). Level: suggestion.

**Headings.yml** — extends Vale's `capitalization` rule to enforce
sentence-style capitalization in headings, with an exception list for
proper nouns and product names (TypeScript, Kubernetes, macOS, and
similar). Level: warning.

### codespell — spell checking

codespell runs against all content files on every pull request. A
`.codespellignore` file whitelists technical terms that are not misspellings:
`Docusaurus`, `Mintlify`, `Hackmamba`, `llms`, `mdx`, `openapi`, and others.
The `check_filenames: true` setting catches misspellings in file names as well
as file contents.

### Doc Detective — docs-as-tests

Doc Detective runs a browser against the deployed site and verifies that what
the documentation describes actually exists. Tests are defined in JSON in
`doc-detective/tests/`. This is not a smoke test. It treats documentation as
a contract with the product. When a product changes and the docs are not
updated, the test fails and the failure is visible in CI.

### Lychee — link checking

Lychee runs on every push to main and on a weekly schedule via cron. The
scheduled run is the important one: a link can be valid when written and break
six months later without any content change triggering a check. The
`.lychee.toml` configuration excludes localhost, example domains, mailto
links, and root-relative Docusaurus routes, which are client-side paths that
do not exist as HTTP endpoints Lychee can reach.

### docmeta — metadata validation

Vale checks how the prose reads and Doc Detective checks whether the
procedures still work. Neither looks at front matter, so before docmeta a page
could ship with no description at all, or with a `last_reviewed` value that was
not a date, and every gate would pass.

The site validates against two layers. The built-in Docusaurus schemas
(`docusaurus:docs:3.10`, `docusaurus:blog:3.10`, `docusaurus:pages:3.10`)
constrain the shape of every field the Docusaurus plugins accept. They require
none of them, so they are a format check rather than a presence check, and any
file that builds will pass them.

`docmeta/showcase.schema.json` supplies the presence check. Every published
page must carry a title, a description, and a `last_reviewed` value that
validates as a date. `docmeta.config.yaml` maps each content directory to its
matching Docusaurus schema plus the custom one, and excludes the
underscore-prefixed blog drafts that Docusaurus omits from the build.

The job pins Node 24. docmeta requires it, and on older Node versions npm
reports the engine mismatch as a warning rather than an error, installs
anyway, and the step reports success while doing nothing useful.

### GitHub Actions — the pipeline itself

Fourteen workflows wire the tools together. Path filtering keeps each workflow
focused: a CSS change does not trigger a lint run; a workflow change does not
trigger a doc test. The filters reduce noise and make failures meaningful.

The five gates described above:

- `lint.yml` — Vale and docmeta on pull request, filtered to content files
  and to the metadata schema and config themselves
- `spellcheck.yml` — codespell on pull request, filtered to content files
- `links.yml` — Lychee on push and weekly schedule
- `test.yml` — Doc Detective on push to main, filtered to docs and test files

Seven more granular checks, each a separate Doc Detective or verification job:

- `llms-txt.yml` — verifies `llms.txt` against the live site on push to main:
  reachability, structure, a full content diff against what
  `scripts/generate-llms-txt.py` would currently produce, and that every
  root-relative link inside it still resolves
- `generate-llms-txt.yml` — regenerates `llms.txt` from a template and live
  repo facts (Vale rule count and names, workflow count) whenever those facts
  change, and commits the result; see "Agent-facing documentation" below
- `api-reference.yml` — Doc Detective screenshot test against the API reference page
- `responsive-test.yml` — Doc Detective screenshot test across viewport sizes
- `doodle.yml` — regenerates a daily doodle on a cron schedule
- `portfolio-link-test.yml` — Doc Detective `checkLink` plus a content check
  (PDF file signature, minimum byte size) against the portfolio's linked work
  samples, catching corrupted or emptied files that a plain link check like
  Lychee's would still report as passing
- `cli-flag-check.yml` — Doc Detective `runShell` test that runs
  `doc-detective --help` and confirms the `--config` and `--input` flags still
  exist, since every "Run the test manually" command on this site and every
  Doc Detective workflow in this list passes both

One check that never fails the build, only asks a question:

- `coupling-check.yml` — on every pull request, diffs the changed files
  against `scripts/coupling-map.json`, a maintained list of file pairs known
  to state the same facts (CLAUDE.md and its portfolio write-up, pipeline.md
  and llms.txt). If one side of a pair changed and the other didn't, it
  comments on the PR asking for confirmation. It doesn't discover new
  couplings on its own; it only ever flags a relationship someone already
  wrote down.
- `coupling-map-review.yml` — the monthly counterpart to the check above: on
  the first of each month, runs Claude Code (via `anthropics/claude-code-action`)
  against the live repo to judge whether `coupling-map.json`'s existing
  entries are still accurate and whether new file pairs deserve an entry,
  then reports its findings as a GitHub issue. It never edits the map
  itself; a human decides what to do with what it finds.

And the deploy itself:

- `deploy.yml` — Docusaurus build and GitHub Pages deployment, triggered on
  push to main and by `workflow_run` completion of `doodle.yml`,
  `llms-txt.yml`, `generate-llms-txt.yml`, `api-reference.yml`,
  `portfolio-link-test.yml`, and `cli-flag-check.yml`, so the site republishes
  once all upstream checks
  have run

### OpenAPI 3.1 — API documentation

The Garden Companion API is documented in `website/static/api/garden.yaml`
and rendered via Scalar. The spec covers three endpoints, four error responses
with specific, user-facing error messages, and example responses built from
original research. The relationship model uses a two-value enum (`beneficial`,
`harmful`) with a deliberate decision not to include a neutral value, because
neutral relationships cover nearly every plant combination and add no useful
signal.

### Agent-facing documentation — pipeline.md and llms.txt

This file and `llms.txt` are the agent-facing layer of the pipeline. They go
through the same Vale linting, spell checking, and link checking as every
other content file. They are not exceptions to the pipeline. They are part
of it.

`llms.txt`'s factual claims (Vale rule count and names, workflow count) are
no longer hand-typed. `scripts/generate-llms-txt.py` renders them from a
template plus live repo state, so the numbers can't silently drift the way
this file's own numbers once did. See
[the llms.txt verification test](/showcase-site/doc-detective/llms-txt-test)
for the incident that motivated it. What still requires human judgment (the
plain-English gloss of what each Vale rule does, which pages are worth
linking) lives in `scripts/pipeline-facts.json`, hand-maintained on purpose:
the generator refuses to run if a Vale rule exists with no matching entry
there, turning a silent gap into a loud build failure.

The central point this site is built to illustrate: machine-readable
documentation is a formatting problem. Machine-trustworthy documentation is a
process problem. A well-structured file that contains wrong information is
worse than no file, because an agent acts on it with confidence.

## Repository structure

```
.github/workflows/       Thirteen CI/CD workflow definitions
.vale/styles/Diana/      Five custom Vale rules
doc-detective/           Doc Detective config and test specs
website/docs/            Documentation pages
website/static/api/      OpenAPI 3.1 spec (garden.yaml)
website/static/llms.txt  Agent discovery file
website/src/pages/       React pages (home, about, portfolio)
website/blog/            Blog posts
```

## Contact

[linkedin.com/in/dianapayton](https://www.linkedin.com/in/dianapayton/)
