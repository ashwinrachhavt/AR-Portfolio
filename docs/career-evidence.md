# Public career evidence

The `/fit` explorer publishes 13 evidence entries from the approved facts in `src/content/resume.json`. The catalog includes cash-based underwriting, Gurukul research, and Mindbowser computer-vision work. Its 15 topics include Underwriting, Learning systems, and Computer vision.

## Content and publication

`src/content/career-evidence.json` is the reviewed supporting catalog: stable IDs, titles, project groups, capability tags, discussion questions, and references to résumé fields. It accepts no independent claim text, URLs, or private entries. Related details resolve to other approved bullets within the same role. Research resolves to the résumé's description, thesis, and code links.

`pnpm evidence:build` validates those references and writes `src/content/generated/career-evidence.json`. Both the browser and the API import that snapshot. They never fetch GitHub or parse the profile README at request time. Publication is local; deploying the app publishes the reviewed snapshot with the rest of the site.

To update public evidence:

1. Verify new or changed career facts and update `resume.json` first. Do not add private correspondence or work-authorization notes.
2. Update the supporting catalog and its review date. Claims and related details must reference approved résumé fields.
3. Run `pnpm evidence:build` and review the snapshot diff, including attribution, scope, source destinations, and topic tags.
4. Run `pnpm test`, `pnpm lint`, `pnpm typecheck`, and `pnpm build`.

`pnpm evidence:check` reproduces the snapshot and fails if it is missing or stale. The production build runs this check before building the app. Validation rejects missing sources, duplicate IDs/topics/details, unknown topics, unexpected fields, and unsafe research links. The digest binds the snapshot to the reviewed résumé and manifest. Human review still establishes the accuracy of source facts and editorial metadata.

## Profile README reconciliation

The [profile README](https://github.com/ashwinrachhavt/ashwinrachhavt/blob/main/README.md) is a supporting reference, not an automatic import. Inspection on September 23, 2026 identified these differences:

| Claim | Approved decision for this release |
| --- | --- |
| Outreach deployment time from 3–4 days to about 30 minutes | Not in the approved résumé; omit the metric. Use the approved infrastructure description only. |
| Approximately 50% faster month-end close in the README | Not interchangeable with the résumé's first-month close from 4+ months to approximately 2 weeks. Preserve the approved first-month scope and team attribution; do not merge or derive percentages. The README metric still needs evidence and scope review. |
| Mindbowser accuracy of approximately 73% | Not in the approved résumé; omit. Use only the approved VGG-19 / GridFS description. |
| Broader Gurukul feature descriptions | Use the approved RAG/guardrails research description and existing thesis/code sources. Do not infer commercial rollout or student outcome metrics. |

This release does not change the external README or certify its additional claims. It excludes the unresolved material from the published catalog.

## Local exploration and ranking

Jev selects initial topics using fixed server-owned questions; keyword previews and examples use the same catalog. Visitors can add/remove topics, prioritize one selected topic, restore the original topics, and reveal all related work without another model call. These choices never change Jev's original probabilities or convert a preview into a live result.

Ranking first respects an explicit visitor priority when matching evidence exists. It then considers candidates within one matching topic of the best remaining overlap count, preferring uncovered requirements, different projects, greater overlap, and different organizations, in that order. Curated catalog order breaks remaining ties. There is no suitability score. Gaps are computed against all matching evidence, independently of the three-card display limit.

Expandable sections show the approved role/date/context, related source-linked facts where available, and an authored discussion question. A prompt opens a prefilled email draft; the application does not send email. Research is labeled separately from professional work. Missing public evidence never implies missing ability.

## Measurement

Existing source-open and contact events remain. The explorer also emits topic-change/reset/clear, priority-change, evidence-expanded, more-evidence, prompt-used, and relevance-feedback events through the existing Vercel Analytics integration. Properties contain only catalog IDs, topic IDs, prompt indexes, mode, and boolean/enum choices. Role titles, descriptions, and email draft text are never analytics properties.

Use evidence expansions and source opens to measure exploration, prompt clicks to measure discussion intent, and `career_fit_relevance_feedback` (`yes` / `not-yet`) to measure self-reported usefulness. A click does not establish that a source was read or an email was sent. Event delivery depends on the site's existing analytics deployment and visitor blocking settings.

The September 22 live Jev evaluation covered the original 12 questions. The three added topics have automated keyword and mocked provider-contract coverage; they have not been evaluated against live Jev. The existing free-access cutoff and keyword fallback remain in force.
