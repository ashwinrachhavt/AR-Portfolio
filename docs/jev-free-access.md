# Free Jev access and the recruiter experience

Checked September 22, 2026. The Venice credential is not configured and live mode remains off. The adapter and recruiter interface are implemented; account verification and live activation are pending. This document supersedes the provider findings in the historical 0.3.0 release record.

## The available route

[Venice’s Jev page](https://venice.ai/lp/jev) advertises free input during its current promotion, free output, and new accounts with a daily allowance and 500 welcome credits without a credit card. Its ordinary input price is $0.042 per million tokens. The page does not specify a promotion end date. Model access differs by account; the authenticated Models API is authoritative. No claim of permanently free or unlimited usage is made.

The server uses `POST https://api.venice.ai/api/v1/decisions`, model `jev-latest`, and twelve fixed `noul` questions. Only submitted public role text is sent. Responses provide probabilities; application code owns the career claims, links, evidence selection and gaps. No open-ended generated biography is used.

## Activation

1. Sign in at [Venice API settings](https://venice.ai/settings/api). Create an **Inference Only** key and **disable USD spending**. Do not add funds, a card, auto-top-up, or a paid subscription for this integration. [Venice’s key documentation](https://docs.venice.ai/guides/getting-started/generating-api-key) states that disabling USD spending sets the provider-enforced per-key USD limit to zero.
2. Store the key as `VENICE_API_KEY` in ignored `.env.local`. Do not put it in Git, a public environment variable, browser code, screenshots, logs, or chat.
3. Verify the account/key using authenticated read-only requests to `/api/v1/api_keys/rate_limits` and `/api/v1/models?type=decision`. Confirm access, the zero-USD key limit, and Jev’s zero input/output USD prices. A paid base price in a catalog may differ from a promotion; the current adapter deliberately remains disabled if it cannot establish zero pricing. Do not bypass this guard on the basis of marketing copy alone.
4. Make a bounded live evaluation using public synthetic role text. Check balances/usage before and after, validate the response shape, and evaluate representative positive, negated, unsupported, and adversarial descriptions. Unit tests use fixtures and do not establish model accuracy or free-account eligibility.
5. Set `CAREER_FIT_PROVIDER=venice`, the verified key, and `CAREER_FIT_LIVE_ENABLED=true` in the production build and runtime environment, then redeploy. Confirm a production response has `mode: jev` and `analysis.provider: venice`.

Until those checks pass, leave the live flag false. A zero-price catalog lookup is not a substitute for the provider-enforced zero-USD key setting: pricing can change between lookup and inference. The implementation checks pricing on every request and has no paid fallback or retry. For Venice, both input and output require a zero USD price; any reported Diem price must also be zero. Unknown currencies or extra pricing fields fail the check. An inference response of 402, a timeout, or invalid decision data produces a recoverable error. Missing/free-access-unavailable catalog data yields an explicitly labeled keyword preview. Process-local rate limits reduce accidental repeat usage but are not a global quota.

## What recruiters see

- The initial examples are labeled **Illustrative example · no AI call**. Loading an example does not silently spend a request.
- With live access configured, **Explore this role with Jev** submits the role. The page receives progress as the server checks free access, asks Jev its fixed questions, and connects the answers to approved public work.
- The final **Live Jev result** shows provider and response duration. **See what Jev detected** exposes all twelve returned probabilities and the 65% selection threshold. These values describe the role’s requirements, not the candidate’s ability or hiring potential.
- Evidence cards cite public work and surface missing evidence honestly. Cancellation, provider errors and request limits preserve the entered role.

The decisions API returns the answers together. The page streams actual request stages, not fabricated model tokens or guessed partial decisions. Submitted role text is not stored by the application or sent to analytics. The form discloses the provider before submission.

## Request and streaming contract

`POST /api/career-fit` accepts JSON with `jobTitle` (optional, at most 160 characters) and `jobDescription` (100–8,000 characters). Request bodies are bounded at 36,000 bytes. Existing origin checks, credential-pattern rejection, and process-local limits of eight accepted requests per hour and two concurrent requests remain in place. Provider work has a 12-second timeout; the browser allows 18 seconds for the complete request.

The browser sends `Accept: application/x-ndjson`. The server emits newline-delimited objects with `type: status` and stages `checking`, `interpreting`, and `matching` as the corresponding work occurs. The final object has `type: result` and a `brief`, or `type: error` with a recoverable message. Validation and rate-limit failures before streaming use JSON with their HTTP error status; an error after streaming starts is carried inside the stream. Callers must inspect the event type instead of treating HTTP 200 as proof of successful interpretation. Clients without the streaming Accept header receive the complete JSON brief or an HTTP error.

A Jev brief includes `analysis.provider`, `analysis.model`, `analysis.durationMs`, `analysis.completedAt`, and the twelve validated `analysis.signals`. Duration measures the inference request through answer validation, excluding the preliminary catalog lookup. Keyword previews have `mode: keyword` and no Jev analysis. A missing credential, disabled flag, or unsupported provider selection takes that preview path without inference. The client rejects incomplete or oversized streams and ignores late results after cancellation or switching examples.

## Validation of this implementation

All 88 automated tests, `pnpm lint`, `pnpm typecheck`, and `pnpm build` passed for this change. Tests cover provider selection and pricing guards, typed answer validation, streamed success and errors, malformed or truncated streams, cancellation, and existing evidence/publication boundaries.

The successful Jev interface browser check used a fixture response to exercise progress and the requirement breakdown. It was not a real Jev call. No Venice credential, free-account eligibility, live response quality, or billing behavior has been validated. The rejected Vercel probe below is the only authenticated provider evaluation recorded here; it produced no model result.

## Why the existing Vercel account is not active

The [Vercel Jev page](https://vercel.com/ai-gateway/models/jev) advertises free access until September 25. Its public catalog still reports the ordinary input price; that alone was insufficient evidence to rule out free promotional usage. However, an actual authenticated evaluation on this project returned HTTP 403 with type `customer_verification_required`: “AI Gateway requires a valid credit card on file to service requests.” The account’s credit balance and total used were both zero before and after this rejected probe. No successful Vercel model call occurred.

Vercel’s [free-credit eligibility and model coverage](https://vercel.com/docs/ai-gateway/pricing) also require account verification; monthly credits do not by themselves prove this project has usable free Jev access. Its budgets are not a demonstrated zero-spend hard stop. The legacy adapter remains available only by explicit provider selection and keeps its conservative zero-price/September 25 guards. Venice is the proposed no-card route, pending actual key verification.
