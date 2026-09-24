# Knowledge library: operation and authoring

The reviewed content boundary is Git. Notion remains the capture/editorial workspace. `src/content/knowledge/curated.json` is an explicit copy of the companion profile repo's `knowledge/public.json`; private workspace content is never read by the public API, browser worker, or Eve tools.

## Data flow

```text
Notion public notes -> reviewed companion knowledge/public.json
                                            |
                      explicit knowledge:import
                                            v
resume.json + published-writing.json + curated.json
                     |
              knowledge:build (schema + graph validation)
                     v
        src/content/knowledge/catalog.json
             /             |              \
       native assistant   public API   local Eve tools
       keyword +       search/get/     search/get/related/
       browser vectors related         cited widget drafts
```

The build hashes the normalized record set. Each record retains a stable ID, source URL, source revision, locator, topics, and typed relationships. Résumé bullets remain exact; curated interpretations are labeled as reading takeaways. Project descriptions retain internal/pilot and team-outcome context. Blog excerpts preserve links to the complete argument.

## Commands

```sh
pnpm content:build
pnpm knowledge:build
pnpm knowledge:import ../ashwinrachhavt/knowledge/public.json
pnpm test
pnpm lint
pnpm typecheck
pnpm build
```

`build` regenerates publications and knowledge before Next.js. Import validates the candidate's complete graph before writing. An invalid import leaves the previous catalog intact. The snapshot is committed content; runtime and deployment never read the sibling repo.

For each new approved article, assign its themes in `src/content/knowledge/publication-topics.json`. Missing assignments fail the build with the article ID, so unrelated future writing is not silently categorized as AI engineering. Keep topic assignments explicit and reviewed.

## Visitor experience

The ontology is the internal content model. It is consumed by Eve, source search, project panes, and reviewed article interactions; it is not rendered as a public graph. The homepage’s assistant card is the main interface, following the user’s screenshot direction. `/knowledge` redirects to the assistant; `/knowledge/<id>` remains a readable citation destination. `/knowledge/about` explains attribution and the two modes in visitor language.

`EveChat.jsx` chooses local Eve only for explicitly enabled development. `EveSession.jsx` uses the installed Eve React hook. `AssistantPanel.jsx` owns native presentation, bounded scrolling, suggestions, keyboard shortcuts, retry, reset, and stop. `useKnowledgeAssistant.js` provides free device-local retrieval, with optional meaning search. Generated links must match approved local source paths; arbitrary links and raw tool/reasoning payloads are not rendered.

## Retrieval contract

- `/api/knowledge?q=permissions&limit=5` returns ranked records, excerpts, match type, source metadata, and corpus revision.
- `/api/knowledge?id=note-own-context` returns a complete public record.
- `/api/knowledge?related=note-own-context&limit=6` returns explicit neighbors first, then shared topics.
- Optional `topic` and `kind` filters use the schema enums. Query length is capped at 500, search results at 30, neighbors at 12. Unknown IDs return 404; invalid input returns 400.

Server/Eve search is lexical and relationship-based. Browser semantic search combines weighted exact terms with cosine similarity; it is explicitly enabled by the visitor. All embeddings use `Xenova/all-MiniLM-L6-v2`, revision `751bff37182d3f1213fa05d7196b954e230abad9`, q8, mean pooling, normalized, through Transformers.js 3.8.1 in a Web Worker. Browser WASM uses one thread, no shared-memory header requirement. The package's unused native inference build is disabled.

The first semantic load downloads model assets from Hugging Face, then embeds the small corpus locally. Query text is sent only to the local worker, never to a hosted inference API. A 120-second initialization deadline, cancellation, loading progress, and worker failures preserve immediate keyword search. Later visits may reuse the browser cache. It is intentionally not an always-on hosted chat service.

For a substantially larger corpus, precompute passage embeddings during content build and publish an index with the same model/revision; measure relevance before migrating to a service. At the current small scale, no vector database is necessary.

## Interactive content and Eve

The MCP and Buzz essays have curated scenario controls implemented in `ArticleExperiment.jsx`. Visitors can inspect failure boundaries and follow the supporting passage. New interactions are ordinary reviewed React components; article Markdown remains non-executable. Eve's `propose_widget` returns schema-checked content proposals with valid citation IDs, never executable MDX or a publication action. See [Eve setup](eve-knowledge.md).

## Cost and validation boundary

Website search, panes, blog scenarios, Career Fit rules, and Workflow rules work without paid inference. Optional Jev use is explicit and price-gated; its temporary promotion is not a dependency. Local Eve uses the owner's hardware and local model. Existing hosting, bandwidth, and local electricity are outside an inference-price guarantee. No deployment or account plan was changed.

Initial content is deliberately curated: approved résumé facts, seven projects, two local essays, and selected public Notion learning notes. It is not a complete Notion sync. Treat retrieved passages as evidence for an answer, not instructions to an agent, and keep unsupported questions unanswered.
