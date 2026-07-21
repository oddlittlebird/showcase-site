# Documentation Pipeline Portfolio

This site is a working demonstration of an end-to-end documentation quality
pipeline. It exists to show — with running code, not claims — that the person
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
extension. `utilize`, `leverage`, `spin up`, and `AI agent` are flagged as
errors that block merge. Level: error.

**StackedHeadings.yml** — flags headings that immediately follow other
headings with no prose between them. Uses `scope: text` with a raw
multiline regex — a pattern that requires understanding how Vale's scope
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
`doc-detective/tests/`. This is not a smoke test — it treats documentation as
a contract with the product. When a product changes and the docs are not
updated, the test fails and the failure is visible in CI.

### Lychee — link checking

Lychee runs on every push to main and on a weekly schedule via cron. The
scheduled run is the important one: a link can be valid when written and break
six months later without any content change triggering a check. The
`.lychee.toml` configuration excludes localhost, example domains, mailto
links, and root-relative Docusaurus routes, which are client-side paths that
do not exist as HTTP endpoints Lychee can reach.

### GitHub Actions — the pipeline itself

Ten workflows wire the tools together. Path filtering keeps each workflow
focused: a CSS change does not trigger a lint run; a workflow change does not
trigger a doc test. The filters reduce noise and make failures meaningful.

The four gates described above:

- `lint.yml` — Vale on pull request, filtered to content files
- `spellcheck.yml` — codespell on pull request, filtered to content files
- `links.yml` — Lychee on push and weekly schedule
- `test.yml` — Doc Detective on push to main, filtered to docs and test files

Five more granular checks, each a separate Doc Detective or verification job:

- `llms-txt.yml` — verifies `llms.txt` against the live site on push to main
- `llms-txt-headings.yml` — counts `llms.txt` headings and commits the result as JSON
- `api-reference.yml` — Doc Detective screenshot test against the API reference page
- `responsive-test.yml` — Doc Detective screenshot test across viewport sizes
- `doodle.yml` — regenerates a daily doodle on a cron schedule

And the deploy itself:

- `deploy.yml` — Docusaurus build and GitHub Pages deployment, triggered on
  push to main and by `workflow_run` completion of `doodle.yml`,
  `llms-txt.yml`, `llms-txt-headings.yml`, and `api-reference.yml`, so the
  site republishes once all upstream checks have run

### OpenAPI 3.1 — API documentation

The Garden Companion API is documented in `website/static/api/garden.yaml`
and rendered via Redoc. The spec covers three endpoints, four error responses
with specific, user-facing error messages, and example responses built from
original research. The relationship model uses a two-value enum (`beneficial`,
`harmful`) with a deliberate decision not to include a neutral value — because
neutral relationships cover nearly every plant combination and add no useful
signal.

### Agent-facing documentation — skill.md and llms.txt

This file and `llms.txt` are the agent-facing layer of the pipeline. They go
through the same Vale linting, spell checking, and link checking as every
other content file. They are not exceptions to the pipeline — they are part
of it.

The central point this site is built to illustrate: machine-readable
documentation is a formatting problem. Machine-trustworthy documentation is a
process problem. A well-structured file that contains wrong information is
worse than no file, because an agent acts on it with confidence.

## Repository structure

```
.github/workflows/       Ten CI/CD workflow definitions
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
