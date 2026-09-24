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

Open `/fit` to explore three role examples or submit a role description. The site maps requirements to 15 capabilities and selects complementary results from 13 approved public evidence entries, including underwriting, Gurukul research, and computer vision. Visitors can adjust topics, prioritize an area, expand source-linked details, and explore all related work without another AI request. Examples and keyword mapping work without any provider credential. Results are labeled by mode and are conversation starters, not hiring scores.

The browser and API use a validated, versioned snapshot derived from `src/content/resume.json` and the reviewed supporting catalog. Run `pnpm evidence:build` after approved content changes; `pnpm evidence:check` blocks stale or invalid snapshots during the production build. See [publication, source reconciliation, ranking, and measurement](docs/career-evidence.md). The profile README is never fetched at runtime.

Jev answers fixed capability questions; application code selects the evidence and final wording. The production configuration uses **Vercel’s verified free Jev promotion**. Recruiters see actual request stages, requirement probabilities and response time alongside cited public work. These probabilities describe the role, never the candidate’s suitability. Examples make no AI call; fallback results explicitly say Jev was not used.

Live activation uses `CAREER_FIT_PROVIDER=vercel`, `CAREER_FIT_LIVE_ENABLED=true`, `CAREER_FIT_VERCEL_PROMO_VERIFIED=2026-09-22`, and the server-only `CAREER_FIT_GATEWAY_API_KEY`. The dedicated credential variable keeps other AI features from becoming enabled by this change. The base catalog price differs from the promotional charge: actual authenticated Jev receipts reported zero cost and left the free $5 balance untouched. Six synthetic role cases produced expected signals, including negation and an embedded instruction attempt; provider errors occurred during validation and remain recoverable in the interface.

The dated promotion exception accepts only the exact observed base rate, an untouched $5 credit balance, and zero metered usage. Every returned Vercel result must include a zero-cost receipt. Unknown pricing, changed credit state or expiry prevents promotional inference. **All Vercel Jev calls stop at `2026-09-25T00:00:00Z`**, before the advertised promotion ends, and return labeled keyword previews thereafter. This is not permanent free access or an automatic switch to paid usage. See [verified access, evaluation evidence and operating limits](docs/jev-free-access.md).

Venice remains an explicit alternative adapter, requiring zero catalog prices and a key with USD spending disabled. This account’s key authenticates, but its API reports no credits and `accessPermitted: false`; it is not a usable free fallback. `.env.example` lists the supported variables. Never commit credentials or use `NEXT_PUBLIC_` for a provider key.

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
