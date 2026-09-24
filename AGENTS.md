# Project guidance

Use pnpm for this app. The project root is this directory, not its parent.
Run `pnpm lint`, `pnpm typecheck`, and `pnpm build` for framework changes.
Read version-matched Next.js documentation in `node_modules/next/dist/docs/` before changing framework APIs or configuration.

Keep the resume and portfolio facts consistent with `src/content/resume.json`.
The public agent must only use approved public career facts. Private recruiter correspondence and work-authorization notes are not public agent context.

Public knowledge lives in `src/content/knowledge/curated.json` plus approved résumé and article sources. `pnpm knowledge:build` regenerates the validated catalog; do not hand-edit `catalog.json`. Import an explicitly reviewed companion export with `pnpm knowledge:import <path-to-public.json>`. Eve and public endpoints must reuse `src/lib/knowledge.mjs`, preserve citations, and never query a private Notion workspace at visitor request time. New interactive article components require reviewed source-linked content; never execute generated MDX. Keep the default website experience free of metered inference.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
