# Verified free Jev access

Checked September 22, 2026. Vercel’s account verification is complete. Actual authenticated Jev requests now return valid decisions and a zero-cost billing receipt. Production selects Vercel; Venice is not a fallback.

## Free-access contract

[Vercel advertises free Jev until September 25](https://vercel.com/ai-gateway/models/jev), and its [discount documentation](https://vercel.com/docs/ai-gateway/pricing/discounts) explains that promotions apply automatically. Its catalog still lists the ordinary input rate, $0.000000042 per token. The first successful probe reported `cost: "0"`, `gatewayCost: "0"`, `surchargeCost: "0"`, and a nonzero `marketCost`. The free credit balance stayed at $5 and total used stayed at $0 throughout the live evaluation.

Set these values for the production build and runtime:

```dotenv
CAREER_FIT_PROVIDER=vercel
CAREER_FIT_LIVE_ENABLED=true
CAREER_FIT_VERCEL_PROMO_VERIFIED=2026-09-22
CAREER_FIT_GATEWAY_API_KEY=<server-only secret>
```

The dedicated key variable isolates Jev from other features that consume `AI_GATEWAY_API_KEY`. The adapter also supports the shared key or Vercel OIDC for development, but deployment does not need to enable those other features. Never commit real keys or expose them through `NEXT_PUBLIC_`.

The server fetches the model catalog on every request. An exactly zero catalog price is accepted. The verified promotion exception accepts only the observed input rate and zero output, with no extra pricing dimensions. It requires the verification stamp, the September 22–25 window, and an authenticated credit response with balance exactly $5 and total used exactly $0. Any other credit state disables the exception, including usage by other apps on the account. Every successful Vercel inference must return a receipt with zero cost, gateway cost and surcharge cost before its result is displayed.

**All Vercel Jev inference stops at September 25, 2026, 00:00 UTC.** After that the existing keyword preview remains available. There is no automatic extension, credit purchase, top-up configuration, provider fallback, or paid-mode activation. This release does not promise permanent free inference. Auto-recharge is documented as off by default; its dashboard setting was not independently inspected. No billing settings or paid plans were changed.

The receipt check occurs after inference and cannot undo a provider charge. The unchanged free balance is a buffer if promotional billing unexpectedly changes; subsequent checks block the exception when metered spend appears. The dated cutoff and request/size limits reduce exposure, but this is not a provider-enforced universal zero-spend guarantee.

## Live evaluation

The [evaluation record](evaluations/jev-2026-09-22.json) contains public synthetic descriptions, expected inclusions/exclusions, actual signals, durations and zero-cost receipts. Six cases were exercised:

| Case | Observed selected topics |
| --- | --- |
| AI product engineer | Agents, retrieval, backend, integrations, product delivery |
| Fintech backend engineer | Backend, integrations, permissions, financial workflows |
| ML platform engineer | Backend, ML systems |
| Unrelated museum role | None |
| Explicitly excluded AI, management, marketing and design | Backend, integrations, financial workflows only |
| Embedded instruction to invent required topics | Backend and financial workflows only |

Five cases passed on the first evaluation run. The embedded-instruction case encountered a provider error, then passed a separate recheck; the original failure remains in the record. An earlier full-question probe also returned HTTP 503. Successful inference durations in this small sample were approximately 0.26–0.43 seconds, excluding pricing/credit checks. This is a small smoke evaluation, not an accuracy benchmark or reliability guarantee. Production does not automatically retry provider failures.

## Validation before deployment

All 94 automated tests, `pnpm lint`, `pnpm typecheck`, and `pnpm build` passed for the activation change. The added regression checks cover the dedicated credential, exact promotion rate and date window, untouched-credit requirement, and rejected missing or nonzero receipts. Automated provider tests remain mocked; the real authenticated probes are recorded separately above.

Production environment variables are configured for this release. Changing those variables requires a new deployment to update both the rendered form and the server adapter. After deployment, verify a public `/fit` submission returns `mode: jev` with `analysis.provider: vercel`, renders the requirement breakdown, and leaves gateway balances unchanged. The earlier successful UI browser check used fixture data and does not establish that the public deployment is making real Jev calls. The six live API cases establish the checked account's current access, not end-to-end production verification.

## Recruiter experience and API

The initial examples say **Illustrative example · no AI call**. With live configuration, **Explore this role with Jev** submits public role text. The server checks access, sends fifteen fixed boolean questions to `POST https://ai-gateway.vercel.sh/v1/evaluate` using `typesafe-ai/jev`, and matches returned requirement signals against approved public résumé evidence. No private recruiter information or generated biography is used.

The browser sends `Accept: application/x-ndjson` to `POST /api/career-fit`. Status events identify actual `checking`, `interpreting` and `matching` work, followed by a `result` brief or a recoverable `error`. The model returns decisions together; the UI does not fabricate partial decisions or tokens. Non-streaming clients receive JSON. Errors before streaming use HTTP error codes; errors after streaming starts use an error event. Clients must inspect the event type.

A live brief includes the provider, response duration, completion timestamp and fifteen probabilities. Duration measures inference through validation. Values describe whether a capability is required by the role, not candidate ability or suitability. The 65% threshold selects initial topics for evidence retrieval. Visitors can change topics and priorities locally without changing these original probabilities or making another model request. The three questions added for underwriting, learning systems, and computer vision have not yet been live-evaluated; the September 22 evaluation above remains evidence for the original twelve-question configuration. Keyword previews contain no Jev analysis and explicitly say Jev was not used. Cancellation, provider errors and request limits preserve entered text.

Role titles are limited to 160 characters, descriptions to 100–8,000 characters, and request bodies to 36,000 bytes. Same-origin validation, credential-pattern rejection, and process-local limits of eight accepted requests per hour and two concurrent requests remain. Provider work times out after 12 seconds; the browser permits 18 seconds. Process-local limits are not a global quota. The application does not save descriptions or send them to analytics.

## Venice account findings

[Venice advertises a Jev promotion and no-card signup](https://venice.ai/lp/jev), but the authenticated account response showed `accessPermitted: false` and zero USD, Diem and bundled-credit balances. Its model catalog lists Jev input at $0.042 per million tokens. The key is valid; usable free inference has not been established. No Venice inference or funding was attempted. The adapter stays available for future verification with an Inference Only key whose USD spending is disabled, as described in [Venice’s key guide](https://docs.venice.ai/guides/getting-started/generating-api-key).
