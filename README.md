This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

Use Node.js 22.18 or later and pnpm for this project. Install dependencies with `pnpm install`. Add these values to an ignored `.env` file in the project root to include the existing Notion archive:

```dotenv
NOTION_API_KEY=your-notion-integration-secret
NOTION_DATABASE_ID=your-command-center-database-id
```

Share the Command Center database with that integration. The remote blog archive lists entries whose `Status` select is `Blogs`; Notion article requests are restricted to that group. Keep credentials out of Git. Configure both variables in the hosting environment as well when deploying.

The blog index and articles render on the server and are prerendered at build time. Configure both Notion variables during the build to include the remote archive. Reviewed Markdown articles in `src/content/writing/` are compiled into a static catalog before each build and take precedence over Notion articles with the same ID. The revised MCP and Buzz articles retain their original URLs. If Notion is unavailable, the index can still serve the reviewed local articles.

Successful Notion responses and rendered pages are cached for five minutes, then refreshed in the background on demand. A failed background refresh retains the last successful version. Notion edits become visible after a successful refresh; removing a remote post can take up to the cache refresh window. Local editions change through a repository build and deployment. Article links prefetch on hover, focus, or touch, respecting the browser's data-saving preference. Search and topic filters run locally on public metadata.

Run `pnpm test`, `pnpm lint`, `pnpm typecheck`, and `pnpm build` to validate the app. Tests cover public career evidence, request and provider boundaries, publication imports, Notion access, feeds, and the Workflow Readiness Lab. Provider behavior is mocked; tests do not make live model requests.

Then run the development server:

```bash
pnpm dev --port 3000
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `src/app/page.js`. The page auto-updates as you edit the file. Keep career claims consistent with `src/content/resume.json`.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Career Fit Navigator

Open `/fit` to explore three role examples or submit a role description. The site maps requirements to 12 capabilities, selects from ten verbatim public résumé facts, links the supporting `/work/[id]` pages, and identifies evidence gaps. Examples and keyword mapping work without any provider credential. Results are labeled by mode and are conversation starters, not hiring scores. The homepage connects this explorer, the Readiness Lab, writing, and interests in product design and adoption.

Jev answers fixed capability questions; application code selects the evidence and final wording. The default adapter uses Venice’s `jev-latest` decision model. A live request streams actual server stages, then displays Jev’s requirement probabilities and response time alongside the public evidence. These probabilities describe the role, never the candidate’s suitability. Examples make no AI call, and fallback results explicitly say Jev was not used.

Keep `CAREER_FIT_LIVE_ENABLED=false` until free access has been verified for this account. [Venice advertises free Jev input during its current promotion](https://venice.ai/lp/jev), free output, and no-card signup; this is not a promise of permanent free access. Create an **Inference Only** key with **USD spending disabled** in [Venice API settings](https://venice.ai/settings/api). Put it in ignored `.env.local` as `VENICE_API_KEY`, with `CAREER_FIT_PROVIDER=venice`. Before enabling, verify the key’s zero-USD spending limit, account-specific model availability/pricing, and a real evaluation. Use the same verified settings in Vercel for both build and runtime, then redeploy.

Every request checks Venice’s decision-model catalog for zero input/output USD prices. Missing or nonzero prices produce an explicit keyword preview without inference. The key’s provider-enforced zero-USD limit is the billing safeguard; a catalog check alone cannot guarantee billing. There are no retries or automatic provider fallbacks. Vercel remains an explicit legacy option (`CAREER_FIT_PROVIDER=vercel`, gateway key or OIDC), subject to the old zero-catalog-price check and September 25 cutoff. Its actual account probe returned `customer_verification_required`, despite its advertised promotion. See the [free-access findings and activation checklist](docs/jev-free-access.md). No live model accuracy or Venice account eligibility has been verified yet.

## Publish from Obsidian or Notion

Prepare one approved Markdown note with this exact frontmatter shape. The parser accepts a small YAML subset; use JSON-style double quotes and a JSON array for tags:

```markdown
---
id: "my-public-idea"
title: "An idea worth testing"
date: "2026-09-22"
description: "A short summary for the writing index and feeds."
tags: ["AI", "Product"]
published: true
---

Your reviewed, public article goes here.
```

Import that single note, or take a snapshot of a Notion page already published with `Status` set to `Blogs` in the configured database:

```bash
pnpm content:import "/absolute/path/to/approved-note.md" --publish
pnpm content:notion <published-blog-page-id> --publish
```

Each command copies the approved article into `src/content/writing/` and rebuilds `src/content/published-writing.json`. Review both files, preview `/blog/<id>`, run the checks above, and commit/deploy them with the site. `pnpm content:build` rebuilds the catalog after manually editing an existing local edition; `pnpm build` also runs it. Import refuses an existing article ID rather than overwriting it. To revise an imported article, edit its existing source file explicitly.

This is one-way publication into a static catalog. It does not watch an Obsidian vault, import linked notes, write back to Notion, or synchronize edits between editors. Replace wikilinks and private or expiring attachment URLs with reviewed public links before import. Only the documented frontmatter fields are accepted. The importer checks metadata, duplicates, and common secret patterns; editorial review is still required. The user's actual vault has not been accessed.

Newsletter invitations on the homepage and blog are optional and skippable. All articles stay free. The current destination is the verified [Substack profile](https://substack.com/@ashwinrachha); a working publication feed/embed URL is not configured. Substack handles email addresses and unsubscribe preferences. This app has no subscriber database and does not identify visitors from a page view. Read the [writing and subscription guide](docs/cms-content-plan.md) for configuration and publication details.

## AI Workflow Readiness Lab

Open `/tools/workflow-readiness` for a no-account workflow form, a readable example, and an exportable AI Workflow Brief. The page and example render without a model request. Generated briefs identify software, model-assisted work, human approval, readiness gaps, evaluation proposals, and a first experiment. Results can be copied, downloaded as Markdown, or printed to PDF.

Set `OPENAI_API_KEY` in the ignored `.env` file for local generation and in the hosting environment when deploying. `WORKFLOW_LAB_MODEL` optionally overrides the default `gpt-4.1-mini`. `WORKFLOW_LAB_PROVIDER=gateway` explicitly selects the existing Vercel AI Gateway integration using `AI_GATEWAY_API_KEY`; the default provider is direct OpenAI. A request uses only its selected provider and does not fall back or retry automatically.

`POST /api/workflow-readiness` validates input and output, accepts at most 24 KiB of request data, caps model output, and cancels generation after 45 seconds. Human-review steps are required for high-stakes workflows and requests for approval of every result. Submissions and generated briefs stay in browser memory and are not saved to an application database or analytics. Submitted text is processed by OpenAI (through Vercel when gateway mode is selected); provider retention settings still apply. Direct requests use `store: false`.

The endpoint's in-process limiter allows five accepted attempts per client per ten minutes and two concurrent generations per process. This is best-effort protection: separate server instances and restarts do not share limits. Before a public rollout, configure hosting-level rate limits or a shared limiter and provider spending controls. Do not treat this process-local limiter as a global budget cap.

Run the regression tests with `pnpm test`, then `pnpm lint`, `pnpm typecheck`, and `pnpm build`. Live generation additionally requires a valid provider credential; example mode and deterministic tests do not.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

Project references: [release record](docs/releases/2026-09-22-combined-website.md), [original Navigator proposal and implemented scope](docs/specs/career-fit-navigator.md), [Readiness Lab design](docs/superpowers/specs/2026-09-21-workflow-readiness-design.md), [Readiness Lab implementation plan](docs/superpowers/plans/2026-09-21-workflow-readiness.md), [résumé variants](resumes/README.md), and [public agent instructions](agent/instructions.md). Older [performance notes](performance-tips.md) and [implementation logs](src/changelog/) describe historical versions; use this README for current setup and behavior.

## Deploy on Vercel

Deploy the latest `main` commit after merging a PR. Check the deployment's **Source** commit and the **Detected Next.js version** build-log line: this project pins Next.js and `eslint-config-next` to `16.3.5`. [Next.js security releases](https://nextjs.org/blog/august-2026-security-release) require patched dependencies; keep both packages and their lockfiles in sync when upgrading.

Vercel's **Redeploy** action rebuilds the selected deployment's source. Retrying the historical `933996c` deployment still installs Next.js `15.5.2` and is blocked by Vercel. Create a deployment from the current `main` branch instead. Keep Vercel's vulnerability protection enabled.

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
