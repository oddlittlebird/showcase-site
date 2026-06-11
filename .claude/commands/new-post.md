Scaffold a new blog post. The argument is the post title: /new-post My Post Title

## Steps

1. Get today's date in YYYY-MM-DD format.
2. If no title was provided in $ARGUMENTS, ask for one before proceeding.
3. Generate a slug from the title: lowercase, words separated by hyphens, no special characters (e.g. "My Post Title" → "my-post-title").
4. Create the file at `website/blog/YYYY-MM-DD-{slug}.mdx` with this frontmatter:

```
---
slug: {slug}
title: {title}
authors: [diana]
tags: [workflow]
---

{First sentence or opening hook goes here.}

{/* truncate */}

{Rest of the post goes here.}
```

5. Tell the user the file was created and remind them to:
   - Replace the placeholder content
   - Update the tag if `workflow` isn't the right fit (available tags: `workflow`, `docusaurus`)
   - Add any images to `website/static/img/blog/` and reference them as `/img/blog/filename.png`
