# Diana Payton — Documentation Systems Portfolio

An agent confidently using wrong documentation is worse than an agent that finds nothing. This repo demonstrates the process that makes sure it finds the right thing — and that the right thing is true.

## The problem this repo solves

Most documentation pipelines fail in two places that automated scoring tools can't see:

- **Process failure** — inconsistent workflows, unclear ownership, and poor communication produce docs that are incomplete or wrong, even when they look machine-readable.
- **The trust gap** — a high AFdocs score means agents can access your content. It says nothing about whether that content is accurate, complete, or current. An agent acting on well-structured, machine-readable, wrong documentation is a reliability problem, not a formatting problem.

This repo demonstrates a documentation system that addresses both layers: the technical pipeline that enforces quality automatically, and the human process that keeps it trustworthy over time.

## The stack

| Tool | What it does | What it catches |
|------|-------------|-----------------|
| [Vale](https://vale.sh) | Style and terminology linting | Voice inconsistency, rule violations, terminology drift |
| [Doc Detective](https://doc-detective.com) | Docs-as-tests framework | Procedural content that doesn't match the actual product |
| [skill.md](https://skill.md) | Agent capability manifest | Missing or incomplete agent-facing instruction layer |
| GitHub Actions | CI/CD hooks | Enforces the pipeline so it runs automatically, not voluntarily |

## How the pipeline works

1. **Write** — content authored in Markdown/MDX in `website/docs/` and `website/blog/`
2. **Lint** — Vale runs on pull request against changed files; errors block merge
3. **Test** — Doc Detective runs on deploy; failed procedural tests block the release
4. **Serve** — Docusaurus builds and publishes to GitHub Pages

## Site structure

- **Home / About** — who I am and what I do
- **Resume** — linked PDF
- **Portfolio** — linked PDF samples with descriptions
- **Blog** — posts documenting real decisions made building this pipeline
- **API** — companion planting and plant info lookup playground (spec forthcoming)

## What's in this repo

```
.github/workflows/    GitHub Actions pipeline definitions
.vale/                Vale configuration and custom style rules
doc-detective/tests/  Doc Detective test specifications
website/              Docusaurus site (docs, blog, config)
website/docs/skill.md Agent capability manifest (handcrafted)
website/static/llms.txt  Agent discovery file (handcrafted)
portfolio/            PDF portfolio samples
```

## Work with me

I help teams build documentation processes that engineers follow and agents can trust.

[Get in touch](mailto:diana@hackmamba.io)
