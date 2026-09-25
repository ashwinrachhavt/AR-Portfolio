# Decision Lab: From Documents to Decisions

Status: proposal only. No production experience or live Jev integration is claimed by this document.

## Intent and truth boundary

Create an interactive editorial article about how Ashwin approaches ambiguous AI decisions in consequential workflows. The two chapters draw on Lois (Loan Labs, mortgage documents) and Classify AI (Finally, bookkeeping transactions). Jev is a contemporary experimental decision layer shown alongside simplified public reconstructions; it was NOT part of either original product. Do not imply otherwise. Use fictional documents, transactions, customers, lender rules, and charts of accounts, with conspicuous synthetic-example labels. No employer data, proprietary prompts, customer records, or production screenshots without permission. Distinguish documented historical architecture, reconstructed illustrative behavior, deterministic local playback, recorded Jev output, and verified live Jev output everywhere.

Working title: From Documents to Decisions. Subtitle: Two interactive investigations into a mortgage file and a bank transaction, with Jev as an experimental decision layer. Thesis: the model can propose a typed judgment; application code owns authority, evidence, human review, and side effects. The reader should see Ashwin's system and product judgment, not an advertisement for a model.

## Editorial route

Prefer one indexable article at /blog/from-documents-to-decisions with two anchored chapters and stable links to /work/lois and /work/classify-ai (resolve actual case-study slugs before implementation). Introduce the human problem before Jev or the stack. First viewport: a fictional, badly named document beside an ambiguous bank line; ask 'Would you let software decide what these are?' Let the visitor choose a chapter. The default story takes three minutes; an optional Inspect implementation layer exposes the underlying contracts, traces, and test fixtures. Preserve an accessible, complete narrative without JavaScript. Unique title, canonical, Article schema, readable headings, and descriptive links; do not manufacture SEO claims.

## Chapter A: Lois — document investigation

Use a fictional loan file with a PDF-like preview, labeled extracted text, a short active document catalog, and a lender-specific naming rule. Visitor predicts a type before revealing evidence. Run an illustrative path: intake -> text extraction -> catalog lookup -> candidate document type -> evidence sufficiency -> review/record update -> lender rename -> separate policy checks. The historical story describes Rails-orchestrated LangGraph/Bedrock AgentCore agents and scoped API tools; this exhibit is not its code or a reproduction of its actual outputs. Jev only receives curated text state, never raw PDF/image bytes.

Interactions: switch to an unreadable page; change an extracted heading that contradicts the filename; add a missing metadata field; switch to a lender rule requiring different naming; simulate permission revocation between proposal and attempted write. Show the affected stages, not a fake universal confidence animation. A policy gate must block mutations without tenant/owner scope, permitted tool, valid evidence, or current authorization. Sending messages and renaming documents are separate authorized actions. The visitor can choose classify, ask for a clearer file, or route for review; no real mutation occurs.

## Chapter B: Classify AI — transaction investigation

Use a fictional transaction with amount, date, messy merchant string, tenant-specific chart of accounts, a synthetic prior classified transaction, and optional company/industry context. Visitor picks an account; then reveal an illustrative historical path: bank/CSV intake -> transaction normalization -> tenant-history retrieval -> merchant/industry context if useful -> candidate account -> bookkeeper lanes (approve / ask client / review later) -> reconciliation -> ledger sync only after appropriate checks. Explain that Classify AI used LangChain, Pinecone, Elasticsearch, Redis/Celery, human review, reconciliation, and QuickBooks integration across product iterations; Jev was not in the original stack.

Interactions: change the business's chart while keeping the transaction fixed; reveal a conflicting historical example; alter the merchant description; mark it a transfer rather than an expense; remove merchant context. Show how a model candidate and a bookkeeper's action can differ. Never claim that an identical merchant always maps to one account. Reconciliation and permission checks remain deterministic application responsibilities; no actual ledger is updated.

## Jev experiment and inspectable contract

Introduce after the original-workflow reconstruction with an explicit label: 'What if a typed decision model evaluated this handoff today? Experimental; not the original implementation.' Present the sanitized text state, a bounded candidate set, exact questions, typed output, and a separate policy result. Choice may select among displayed document types or account candidates; Noul can express a bounded yes/no judgment such as evidence sufficiency or need for clarification; Score can represent a defined numeric dimension only when the scale has a clear domain meaning. Check TypeSafe's current API schema before building; never rename a Noul value, Choice probability, or Score confidence into a universal probability of correctness. The model does not OCR a PDF, invent the candidate catalog, authorize a tool, reconcile books, or determine borrower/accountant intent.

Offer three clearly distinct modes: (1) deterministic local example, no provider call; (2) recorded Jev response with timestamp/model version and immutable synthetic fixture; (3) verified live Jev call, if cost, privacy, rate limits, and credential safeguards are validated. Never animate guessed intermediate model tokens; stage labels reflect actual work. Do not turn on metered calls by default or silently fall back to a paid provider. Live input must be bounded, sanitized, sent server-side, and disclosed before submission. Do not accept real customer PDFs or financial transactions. If Jev is unavailable, retain a useful deterministic walkthrough and label it honestly.

## Interaction repertoire, ranked

P0: Prediction before reveal. The reader makes a first call, then sees evidence and why the easy answer may fail.
P0: Evidence perturbation. Change one fact; highlight only downstream stages affected.
P0: Disagreement view. Compare reader judgment, typed model answer, and final application-policy outcome without treating disagreement as failure.
P0: Review desk. Visitor selects approve, request more information, or hold, and sees the audit note and unperformed actions.
P1: Counterfactual replay. Pin two runs side by side: same merchant/different customer chart; same file/missing page. Include accessible textual diffs.
P1: Failure gallery. Three synthetic cases per chapter, with the safeguard that detects or escalates each.
P1: Provenance drawer. Every conclusion points to a text span, candidate entry, fixture, or deterministic rule; distinguish source evidence from post-hoc explanation.
P1: Policy laboratory. Toggle narrowly scoped read/write/send permission and revoke mid-run; model answer does not override access control.
P2: Threshold workshop. Let reader change a demonstration review threshold and observe changed triage counts over a small labeled synthetic fixture set. Label all metrics illustrative; do not equate raw model values with calibrated error rates.
P2: Decision budget. Reveal a simple latency/cost trade-off across deterministic lookup, Jev experiment, and human review with measured numbers only when independently verified.
P2: Design fork. Reader picks aggressive automation or human escalation; compare risks and user workload qualitatively without fabricated business-impact numbers.
P2: Test bench. Provide a tiny downloadable synthetic JSON fixture set with expected policy outcomes and one adversarial instruction embedded as data; include readable tests for provenance, permission revocation, and unavailable provider.

## Visual and accessibility direction

A calm editorial systems museum: a single warm/dark base, one accent, generous whitespace, a crisp evidence highlight, and a small, legible flow diagram that lights up one stage at a time. No fake dashboards, stock AI art, excessive particle effects, autoplay, or fabricated live activity. Motion explains state change; honor reduced-motion. Keyboard support, focus rings, visible labels, screen-reader status, color-independent states, accessible PDF-like text alternative, and a static readable transcript are required. On mobile use vertical cards instead of squeezing three-column traces.

## Architecture and delivery

Keep scenario fixtures and the deterministic reducer independent of page rendering. Proposed shapes: Scenario {id, chapter, synthetic: true, state, candidates, evidenceSpans, variants, expectedPolicy}; DecisionTrace {mode, fixtureVersion, modelVersion?, observedAt?, questions, typedAnswers, policyChecks, outcome}. Policy checks must be explicit pure functions rather than hidden inside prose. All public links and historical career facts come from approved site content. No private Notion material is shipped to the browser. Prefer an ordinary in-page React component on the existing blog route, not an iframe or a new chatbot.

Phase 1 (no-cost): write complete article, two synthetic hero cases, P0 interactions, deterministic playback, accessible transcript, source links, and tests. Phase 2: provenance/counterfactuals, failure gallery, and small fixture-based test bench. Phase 3 (optional): recorded Jev outputs; live Jev only after verified access, server-side guards, privacy notice, spend protection, and actual evaluation. Reuse existing fit-provider safety and mode-labeling patterns where appropriate without coupling the essay to recruiter scoring.

## Acceptance and review

- A first-time reader can explain the difference between a model judgment and an authorized product action after either chapter.
- Every scene is clearly synthetic, every historical claim maps to approved public work, and Jev is explicitly experimental relative to Lois/Classify AI.
- Document classification, renaming, policy checks, and tool authorization are not conflated; transaction categorization, review, reconciliation, and ledger sync are not conflated.
- Changing tenant chart, evidence, or permission yields a corresponding trace/policy change; replay is deterministic and test-covered.
- Every mode accurately states whether Jev was called; no fake probabilities, streaming tokens, throughput, or financial/customer claims.
- Keyboard, mobile, reduced-motion, screen-reader, and no-JS reading paths are checked.
- Content owner reviews public details and employer confidentiality before publication.

Background for editorial verification (not automatic public-source authorization): Notion Loan Labs full story https://app.notion.com/p/3e32e26208a5816f84e8cad9219f0a19 ; Notion Finally full story https://app.notion.com/p/3e32e26208a58175a8afe1bd0865118e ; existing career-fit spec docs/specs/career-fit-navigator.md ; TypeSafe documentation https://docs.typesafe.ai/introduction .
