Run local quality checks on the documentation before pushing.

Run each check that is available and report results. Continue through all checks even if one fails.

## 1. Vale (style linting)

```
vale --config=.vale/.vale.ini website/docs website/blog website/src/pages
```

If Vale is not installed, say so and skip.

## 2. codespell (spell checking)

```
codespell website/docs website/blog website/src/pages website/static/llms.txt README.md
```

If codespell is not installed, say so and skip.

## 3. Lychee (link checking)

```
lychee --config .lychee.toml 'website/docs/**/*.md' 'website/docs/**/*.mdx' 'website/blog/**/*.mdx' 'website/src/pages/**/*.mdx' 'website/static/llms.txt' 'README.md'
```

If lychee is not installed, say so and skip.

## Report

After running all available checks, summarize:
- Which checks passed
- Which checks found issues (list them)
- Which checks were skipped (tool not installed)
