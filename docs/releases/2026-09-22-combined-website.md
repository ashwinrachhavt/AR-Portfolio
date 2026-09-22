# Combined website release — 0.3.0

The owner chose a single website release on September 22, 2026, covering positioning, interactive hiring exploration, writing, optional subscriptions, and a publishing connection. This document describes the actual release, replacing the staged delivery proposal in the Navigator specification.

## Experience

- Positioning: a product engineer building with AI, curious about the whole product from implementation to design and adoption. Product design, sales, conversion, marketing, and brand are presented as interests; career accomplishments remain sourced from `src/content/resume.json`.
- `/fit`: three usable examples and a role-description form produce source-linked public work, explicit evidence gaps, and conversation prompts. There is no hiring score. All ten claims are verbatim résumé facts; five `/work/[id]` pages provide their sources.
- Home links both the Career Fit Navigator and the existing AI Workflow Readiness Lab. The homepage and writing hub foreground the expanded MCP and Buzz articles.
- MCP and Buzz have reviewed Markdown editions under their existing article URLs. They distinguish protocol proposals from stable behavior, and architectural analysis from work personally built by the author.
- Newsletter invitations can be skipped and stay dismissed during the browsing session. Articles remain free without signup. The verified Substack profile is the current signup destination. No visitor identity is inferred and no email is stored by this application.

## Jev and the free-access requirement

The intended flow is public role text → fixed capability questions → Jev probabilities → application-selected public evidence. Jev supplies no prose, facts, URLs, or hiring recommendation. Examples and keyword mapping work with no provider credentials.

The Vercel gateway integration accepts `AI_GATEWAY_API_KEY` or `VERCEL_OIDC_TOKEN`, behind `CAREER_FIT_LIVE_ENABLED=true`. It first retrieves the public model catalog and requires both input and output prices to be exactly zero, with no extra pricing fields. It checks the catalog on every request without caching. Missing, nonzero, or uncertain pricing uses keyword mapping. Evaluation is also disabled at and after `2026-09-25T00:00:00Z`, before the advertised promotion ends. No direct TypeSafe or other paid-model fallback exists.

**Live mode remains disabled for this release.** At validation time, Vercel's promotional page advertised free access until September 25 while its live catalog returned input `0.000000042` dollars per token. We made no live evaluation requests. The application price check cannot guarantee provider billing terms or eliminate a price-change race; verify account-level zero-spend protection before enabling it. Free trial credits are not evidence that a model is free.

Requests have input validation, bounded streamed bodies, same-origin browser checks, secret-pattern rejection, a 12-second provider timeout, no retries, and no application logging/storage of submitted text. The existing process-local limiter is best-effort abuse protection, not a distributed quota or billing cap.

Official references checked September 22, 2026:

- [Vercel Jev model and promotion](https://vercel.com/ai-gateway/models/jev?trk=public_post_comment-text)
- [Live gateway model catalog](https://ai-gateway.vercel.sh/v1/models)
- [Jev HTTP evaluation contract](https://vercel.com/changelog/ai-gateway-now-supports-typesafe-clients-and-http-api-for-jev)
- [TypeSafe direct pricing](https://docs.typesafe.ai/models)

## Publishing connection

Notion remains the CMS for existing published blog entries in the configured database. Reviewed local Markdown editions override only matching article IDs. The MCP and Buzz URLs are preserved. If Notion is unavailable, those local articles remain available.

An Obsidian note can be explicitly imported as one public Markdown file. The publishing command does not search a vault, follow private links, or sync personal notes. A published Notion article can also be imported as a reviewed snapshot. Both paths generate the same static catalog and are committed/deployed with the site. This is one-way publication, not bidirectional synchronization. The user's actual local vault was not accessed.

The importer requires `published: true`, a safe unique ID, valid metadata, and a nonempty body. It rejects unknown frontmatter fields, obvious credentials, unresolved wikilinks, local attachment paths, and expiring signed media URLs. Catalog validation happens before source creation; generated output is atomically replaced; failed imports roll back their own new source file. Manual editorial review is still necessary before publishing.

## Validation

- 73 automated tests pass, including public-fact provenance, capability matching, malformed and oversized requests, rate limits, provider schema failures, free-access guards, publishing boundaries, atomic import failures, existing Notion access controls, feeds, and the Readiness Lab.
- `pnpm lint`, `pnpm typecheck`, and `pnpm build` pass; the production build generates 29 routes.
- Browser checks cover desktop and 390px mobile layout, actual keyword form submission, example rendering, cancellation with a late response, text preservation, newsletter skip persistence, and article navigation. Additional release checks are recorded in the PR.
- Provider responses are mocked in automated tests. Live Jev accuracy, provider billing, email delivery, and a real Obsidian vault import are not validated or represented as live integrations.

## Differences from the original Navigator draft

The implementation uses a small public catalog rather than a private evidence-bank workflow or 30–50-capability ontology. It presents related evidence and honest gaps rather than strong/partial scores, role-family or seniority judgments. The source pages show approved résumé facts rather than newly invented case-study narratives. A Jev essay embed and broader model evaluation set are not included. These are documented differences, not a phased release plan.
