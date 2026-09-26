# Lois interactive article and search discovery — product spec

Status: DRAFT for review, September 25, 2026. Branch: `docs/lois-interactive-article`. This is a documentation-only proposal; it does not publish or implement the article. The existing `docs/specs/decision-lab-lois-classify-jev.md` and `src/app/blog/from-documents-to-decisions/` file bodies were not available in the GitHub connector response, so reconcile this document with them before implementation. Do not replace their work blindly.

## Purpose and reader

Make Lois the first finished interactive portfolio story. The visitor should understand the messy loan-document problem, what Ashwin specifically built at Loan Labs, how one document is processed, and why application authority and human review matter. Primary readers are hiring/founding teams and engineers; mortgage operators should be able to follow the workflow without learning LangGraph first. Primary action: finish the story; secondary action: explore technical work or contact Ashwin.

Working headline: From documents to decisions: building Lois for mortgage workflows. Working dek: A loan file arrives as scattered documents. Lois helped identify them, organize them to lender conventions, and surface policy questions—while the application retained control of the workflow.

Draft opening (requires Ashwin's factual/publication approval): 'A loan file rarely arrives as a neat, labeled packet. It arrives as attachments whose meaning depends on the borrower, the lender, and what the team still needs. At Loan Labs, I worked on Lois, an agentic system for business-purpose loan workflows. This is how we moved from isolated model calls toward a workflow that could inspect documents, use application tools, and leave important decisions visible to people.'

## Story and interaction contract

1. Establish the problem with an explicitly synthetic document and an explanation of manual triage; no invented customer anecdote or savings figure.
2. Explain the reported original one-off Ruby/LLM-call limitation, without suggesting all prior behavior was broken.
3. Walk through document intake, text extraction, fetching document/catalog context, classification, lender-specific naming, and policy flag or uncertainty. Keep the article's main explanation in readable HTML, not only inside an interaction or image.
4. Let a reader reveal evidence, compare possible types, inspect a proposed outcome, see a 'Needs review' path, and restart. Clearly mark deterministic example outputs as simulation, not a live production agent.
5. Show the boundary between agent proposal, application validation/record update, and human decision. Do not imply automated underwriting approval.
6. Explain one specific architecture decision: the raw story describes Rails-orchestrated discrete document runs versus specialized agent orchestration for complex tasks. Verify the exact implementation before saying it shipped.
7. Close with Ashwin's contribution, collaborators' roles, what reached internal/pilot use, a genuine tradeoff, and an honest lesson. Avoid unsourced metrics and broad commercial adoption claims.

Interaction states: initial, reveal, decision, proposed action, policy/uncertainty, completion. Provide previous/next/restart, visible focus, keyboard support, reduced motion, and a static fallback. Distinguish suggested results, saved state, and unresolved items. Synthetic data only; do not put customer documents or sensitive fields in analytics.

## Editable Excalidraw diagram briefs

Diagram A — reader journey: synthetic borrower document → intake → extracted text → Lois fetches document and type catalog → proposed classification → lender-specific rename → policy flag/needs review → human/operator view. Blue = system step; amber = uncertainty; green = confirmed application state. Label the difference between suggestion and commit.

Diagram B — architecture: email or in-product chat → Rails API/application authority → orchestration/invocation → LangGraph agents on Bedrock AgentCore → tool/API access → loan/document records and permitted connected services. Place authorization checks at external actions; add confirmation nodes only where validated. The raw story mentions an Amazon MCP gateway and Composio, but routing must be checked before drawing these as implemented in this walkthrough. Produce editable `.excalidraw` source, an accessible text equivalent, and an export for the page after code/source verification. This commit contains briefs, not completed Excalidraw files.

## Claims and editorial guardrails

The curated Notion writing register identifies supported core facts F01–F03: Lois classification, renaming, policy validation on LangGraph/Bedrock AgentCore for internal and pilot workflows; agent-facing Rails APIs, borrower email intake and in-product chat; and tenant/owner-scoped connected-tool permissions. The raw story has more detailed claims that need technical and public-use checks. The register says `src/content/resume.json` is the canonical career source; read it before publishing. Branding drafts include an October 2026 role ending, which is future-dated as of September 25; do not publish it as a completed event. Do not invent ROI, user quotes, personal ownership of team outcomes, or customer adoption.

Working sources: https://app.notion.com/p/a582e26208a582c8893681d05c35e8dd ; https://app.notion.com/p/3e12e26208a580938315db506408df5d ; https://app.notion.com/p/3e32e26208a5816f84e8cad9219f0a19 .

## SEO and AEO discovery plan

The live homepage at `https://ashwinrachha.vercel.app/` currently presents 'Ashwin Rachha | Product Engineer · Building with AI' and links to selected Lois work, while the interactive article route exists in the repository. Fetching the expected live `/blog/from-documents-to-decisions` URL did not return page content in the review tool; this is NOT proof of a 404. Inspect deployed status/HTTP response before claiming the page is live, indexed, or broken. The repository's `src/app` and `public` directory listings did not show obvious `sitemap.*` or `robots.*` entries; runtime behavior and other configuration remain unverified.

Audience-intent map (editorial hypotheses, not measured query volume):

| Page | Searcher question | Distinct answer |
| --- | --- | --- |
| Home | Who is Ashwin Rachha and what does he build? | Named identity, product-engineering focus, selected proof, current contact path. |
| Lois article | How do AI agents classify and validate mortgage documents safely? | A real engineering decision, synthetic walkthrough, boundaries and limitations. |
| Work / Loan Labs | What did Ashwin build at Loan Labs? | Concise scope and links into the full Lois article. |

P0 — Check deployment URL and HTTP status; ensure a single canonical article URL; verify the route is linked from blog index, home/work, and any applicable feed. Inspect actual server-rendered HTML, indexability, title/H1, metadata description, canonical, robots rules, sitemap, and whether substantive article text exists without running the interaction. Add/repair only what is missing in code. Use Search Console URL Inspection and submit sitemap after publishing; do not infer indexing from a successful fetch.

P1 — Write a unique title and description grounded in the page's content; add an accurate byline and real publication/update dates; use relevant descriptive headings and internal anchor text. Add `BlogPosting`/`Article` JSON-LD only after the page exists, with author, headline, canonical URL and real dates matching visible text; validate it with Rich Results Test. Create an original social preview image and descriptive image text, but keep the explanation in HTML.

P2 — For answer-engine discoverability, put a short, direct answer to 'What is Lois?' near the opening, followed by primary-source evidence, scope, architecture explanation, concrete examples, and explicit limits. Make the page worth citing; do not generate keyword-stuffed Q&A or claim guaranteed AI citations. Google says its AI Overviews/AI Mode require ordinary indexability and snippet eligibility, not a special schema or `llms.txt` file.

Measure: Search Console queries/impressions/clicks/CTR and indexed status for home, Loan Labs work, and the article; site analytics for article view, walkthrough start/completion and contact click only if consent/privacy arrangements allow. Establish a baseline before judging change; review after indexing and several weeks, not immediately.

Official guidance: https://developers.google.com/search/docs/fundamentals/seo-starter-guide ; https://developers.google.com/search/docs/appearance/ai-features ; https://developers.google.com/search/docs/appearance/structured-data/article ; https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics .

## Definition of done and order

1. Read existing spec, article component, styles, route, `AGENTS.md`, `resume.json`, metadata and deployment setup; note keep/change/remove and contradictions.
2. Reconcile this draft with current work and approve the public claims, synthetic scenario, final copy and diagram routing.
3. Implement article and editable diagrams in a separate reviewed change; confirm keyboard, mobile, reduced-motion and static rendering behavior.
4. Audit/fix discoverability based on actual HTTP/server-rendered evidence; test metadata, canonicals, structured data, internal links, sitemap and Search Console.
5. Run build/lint and manual browser tests; review for confidentiality, factual accuracy and attributable contributions before merging. A spec-only commit is not a shipped article and cannot itself increase reach.

Open decisions: Which audience is primary? May we publicly name Loan Labs, LoanOS and the vendors? Which system paths/screenshots are approved? Which synthetic example best represents Ashwin's actual design decision? Which domain is canonical if a custom domain will replace the Vercel URL?
