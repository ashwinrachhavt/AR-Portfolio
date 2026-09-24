# Public knowledge library — implementation contract

The website should turn Ashwin's approved experience, writing, and references into useful, source-backed discoveries. Notion is a capture/editorial source; reviewed Git content is the publication boundary. User authorized implementation on 2026-09-23, including the companion writing repository, seven project panes, both interactive labs, and exploration of Eve. Everything must work without paid inference or a hosted vector database.

## Decisions

- Preserve approved career facts in `src/content/resume.json`. Derive public project evidence from this file.
- Model stable concepts, sources, notes, projects, and publications with typed relationships, evidence links, and explicit public approval. Raw Notion workspace contents are never a public index.
- Provide immediate lexical retrieval and opt-in browser-local semantic embeddings. Keep queries on the device for semantic search. Model download failures preserve lexical search.
- Show useful passages and citations, not invented answers. No runtime generated code or remote MDX.
- Serve the same bounded search/get/related contract to Eve and other agents. Eve is an optional local conversational and authoring assistant; public browsing never depends on an inference account.
- Interpret the two Jev use cases as Career Fit Navigator and Workflow Readiness Lab. Both must remain interactive after the Jev promotion expires. Paid model fallback is prohibited by default.
- Project panes: Lois, Classify AI, Cash Underwriting, Bank Connections, UNAR Labs, Outreach Template Project, Gurukul. Project descriptions must be supported by approved facts, including team-outcome attribution and pilot status.

## Independent implementation areas

1. Project panes and shared project metadata, scoped to project components/data and project detail routes.
2. Free interactive Career Fit and Workflow labs, scoped to their UI/handlers/generation/JeV code and tests.
3. Public knowledge schema, corpus, import/build checks, discovery UI, semantic worker, API, Eve tools, reviewed Notion mirror and documentation.

## Verification

Test schema/publication boundaries, valid references, bounded and meaningful retrieval, paid-provider avoidance, and interactive state changes. Run tests, lint, typecheck, and production build. Exercise desktop and mobile flows in a real browser, including semantic loading/failure, search/citations, panes and both labs.

## Review risks

No cost promise can cover hosting quotas or the user's optional future model configuration. The implementation uses no metered inference by default. Local inference consumes the user's hardware and requires installing model weights. Jev's current free promotion ends September 25, 2026; free functionality must not rely on it. Notion content must be explicitly approved before publication. Small-corpus semantic retrieval may be slower on the first download and is an optional enhancement.

## Final interface direction — 2026-09-23

User supplied a portfolio assistant reference and clarified that the ontology should be consumed by Eve, not externally rendered. Implement the assistant natively in the homepage hero: elegant charcoal and blue visual identity, a light conversation card, original geometric mark, suggested questions, source links, keyboard shortcuts, bounded scrolling, and mobile layout. Remove the public ontology explorer. Keep the data model, agent tools, source-note pages, and free semantic retrieval. Eve uses an explicitly enabled local Ollama model; the production default is honestly labeled source search. No external iframe, hosted renderer, imitation of Claude, fake live status, or invented achievements.
