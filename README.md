This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

Use pnpm for this project. Add these values to an ignored `.env` file in the project root:

```dotenv
NOTION_API_KEY=your-notion-integration-secret
NOTION_DATABASE_ID=your-command-center-database-id
```

Share the Command Center database with that integration. The blog lists all entries whose `Status` select is `Blogs`; article requests are restricted to that group. Keep credentials out of Git. Configure both variables in the hosting environment as well when deploying.

The blog index and articles render on the server and are prerendered at build time, so both Notion variables must be available during the build. Successful Notion responses and rendered pages are cached for five minutes, then refreshed in the background on demand. A failed background refresh retains the last successful version. New or edited posts become visible after a successful refresh; removing a post can take up to the cache refresh window. Article links prefetch on hover, focus, or touch, respecting the browser's data-saving preference. Search and topic filters run locally on a small list of public fields.

Run `pnpm lint`, `pnpm typecheck`, and `pnpm build` to validate the app. On Node 24+, `node --test src/lib/*.test.mjs` also checks Notion access boundaries, pagination, nested content, metadata, and filtering.

Then run the development server:

```bash
pnpm dev --port 3000
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## AI Workflow Readiness Lab

Open `/tools/workflow-readiness` for a no-account workflow form, a readable example, and an exportable AI Workflow Brief. The page and example render without a model request. Generated briefs identify software, model-assisted work, human approval, readiness gaps, evaluation proposals, and a first experiment. Results can be copied, downloaded as Markdown, or printed to PDF.

Set `OPENAI_API_KEY` in the ignored `.env` file for local generation and in the hosting environment when deploying. `WORKFLOW_LAB_MODEL` optionally overrides the default `gpt-4.1-mini`. `WORKFLOW_LAB_PROVIDER=gateway` explicitly selects the existing Vercel AI Gateway integration using `AI_GATEWAY_API_KEY`; the default provider is direct OpenAI. A request uses only its selected provider and does not fall back or retry automatically.

`POST /api/workflow-readiness` validates input and output, accepts at most 24 KiB of request data, caps model output, and cancels generation after 45 seconds. Human-review steps are required for high-stakes workflows and requests for approval of every result. Submissions and generated briefs stay in browser memory and are not saved to an application database or analytics. Submitted text is processed by OpenAI (through Vercel when gateway mode is selected); provider retention settings still apply. Direct requests use `store: false`.

The endpoint's in-process limiter allows five accepted attempts per client per ten minutes and two concurrent generations per process. This is best-effort protection: separate server instances and restarts do not share limits. Before a public rollout, configure hosting-level rate limits or a shared limiter and provider spending controls. Do not treat this process-local limiter as a global budget cap.

Run the regression tests with `node --experimental-strip-types --test src/lib/*.test.mjs src/lib/workflow/*.test.mjs`, then `pnpm lint`, `pnpm typecheck`, and `pnpm build`. Live generation additionally requires a valid provider credential; example mode and deterministic tests do not.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

Deploy the latest `main` commit after merging a PR. Check the deployment's **Source** commit and the **Detected Next.js version** build-log line: this project pins Next.js and `eslint-config-next` to `16.3.5`. [Next.js security releases](https://nextjs.org/blog/august-2026-security-release) require patched dependencies; keep both packages and their lockfiles in sync when upgrading.

Vercel's **Redeploy** action rebuilds the selected deployment's source. Retrying the historical `933996c` deployment still installs Next.js `15.5.2` and is blocked by Vercel. Create a deployment from the current `main` branch instead. Keep Vercel's vulnerability protection enabled.

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
