# Native portfolio assistant — local implementation handoff

## Delivered

- 51 public records across six connected themes, with typed relationships, stable IDs, source URLs/locators, and revisions. Includes all approved résumé bullets, seven projects, passages from two reviewed essays, and selected public Notion reading takeaways.
- Native homepage assistant, following the supplied portfolio reference: charcoal/blue hero, a light conversation card, original geometric mark, suggested questions, source links, Cmd/Ctrl+K and slash shortcuts, Enter/Shift+Enter, reset/stop/retry, and mobile layout. The ontology powers the interface behind the scenes. `/knowledge` redirects to the assistant; source-note pages remain readable citations. No external renderer or iframe.
- Free source search retrieves up to three distinct contextual passages. Optional browser-local meaning search runs in a worker, with progress, cancellation, timeout, and word-search fallback. No hosted vector database or paid embedding call.
- `/api/knowledge` search/get/related contract and `/llms.txt` discovery, reused by local Eve tools.
- Seven interactive project panes and detail routes: Lois, Classify AI, Cash Underwriting, Bank Connections, UNAR Labs, Outreach Template Project, and Gurukul.
- Career Fit and Workflow Readiness operate locally by default. Interactive priorities and scenario changes update results. Optional Jev interpretation remains explicit and price-gated; Workflow's paid generation path was removed.
- The MCP and Buzz essays include reviewed scenario exercises with links to their evidence passages.
- Eve uses a loopback-only Ollama model, explicit local opt-in, eight bounded public-data tools, and data-only widget proposals. Default execution tools, anonymous access, and the public home route are disabled.
- Companion profile repository: reviewed knowledge export and operating guide, stale Notion hub/capture links corrected, writing documents reconciled, selected outdated profile facts aligned to the approved résumé, and research memos linked to the implemented workflow.

## Verification

125 tests pass. Lint, TypeScript, production build, and both repositories' diff whitespace checks pass. The build creates 92 static pages; the knowledge snapshot is approximately 72 KB before compression.

Browser checks covered desktop and 390px mobile layouts, all seven project panes, 21 reading-view selections, 28 detail controls, arrow/Home/End keyboard navigation, all project routes, both labs, both article scenarios, source passage navigation, semantic loading and retrieval, and blocked-worker fallback to keyword search. Default lab interactions made zero API requests. Actual browser semantic inference made no paid provider requests.

Nineteen production page/source/API routes returned 200, missing records returned 404, and invalid query bounds returned 400. A deliberately invalid draft import was rejected without changing either the curated snapshot or generated catalog. Independent review found a tokenless-query false-match edge case; it was fixed and regression-tested. A native disclosure/hash hydration warning was avoided by pointing new project experience links at the existing canonical `/work/<roleId>` pages.

WCAG 2 A/AA audits reported zero violations on the tested knowledge, project, lab, and article interaction surfaces. SVG/gradient/decorative-arrow contrast checks requiring human review were visually checked; project gradient endpoints measured at least 4.99:1. These checks are not a full accessibility certification.

Eve completed durable native-UI conversations with real source tools and citations; its Stop control returned the session to a usable state. A simulated connection failure exposed retry and the working source-search fallback. The portfolio-specific Ollama alias reuses installed weights and runs with the required 8,192-token context. Model-generated wording remains subject to source verification. See `docs/eve-knowledge.md`.

## State and next use

Release branch: `codex/free-knowledge-portfolio`. The user authorized build and production deployment after reviewing the native assistant. The companion repository’s existing work was preserved. No account-plan change, Notion write, or paid inference request is required. Production excludes the local Eve runtime and publishes source search plus the reviewed project, lab, and writing experiences.

The final local preview runs at `http://127.0.0.1:3041/`. Start it again with `pnpm start --hostname 127.0.0.1 --port 3041` after `pnpm build`, or use `EVE_LOCAL_ENABLED=1 pnpm dev --hostname 127.0.0.1 --port 3040` for the native local Eve assistant (already running at handoff). Source/import instructions are in `docs/knowledge-library.md`; local agent setup is in `docs/eve-knowledge.md`.

The collection is curated, not an exhaustive Notion sync. Continue adding reviewed records and article topic assignments through the explicit import/build workflow. Semantic relevance varies by query; passages retain citations and are never presented as generated factual answers.

## Scope and remaining limits

The public production experience is source search; generated Eve replies run only in explicitly enabled local development. Hosting an always-on public model is not configured. No hosted inference fallback was added. Notion import is a reviewed curated export, not a complete automatic workspace sync. Citation links open source notes in a separate tab to preserve the conversation. New conversation resets the UI session attachment; reloading starts fresh and does not delete Eve’s local durable records.

Changed-file guide: native UI in `src/app/components/{HeroSection,Navbar,EveChat,EveSession,AssistantPanel}.jsx`, `assistant.module.css`, `useKnowledgeAssistant.js`, and `src/app/home.module.css`; source/search behavior in `src/lib/{assistant,knowledge-search}.mjs`; model setup in `agent/agent.ts`, `agent/instructions.md`, `src/lib/eve-local-config.mjs`, and `config/ollama.Modelfile`; source-note routes in `src/app/knowledge/`. Prior project, lab, content, API, and tool work remains in the files listed by the implementation docs.

Release procedure: run the required checks, merge the implementation PR to `main`, deploy the merged commit to the linked `ashwinrachha` Vercel project, and verify production routes and interactive controls. No implementation or deployment approval is pending.

Final native-interface QA: 390px and 320px had no horizontal overflow; the production page has zero iframes. A fresh browser completed semantic initialization and retrieved relevant permission evidence for “authorisation,” which has zero lexical matches. No hosted inference requests occurred. Final assistant and source-note WCAG A/AA audits reported zero violations and no unresolved checks on the exercised states; the browser reported no runtime errors. Desktop/mobile screenshots are retained locally at `/tmp/portfolio-assistant-final-desktop.png` and `/tmp/portfolio-assistant-final-mobile.png`.
