# Career Fit Navigator — Feature Specification

## Status
Original design proposal, with a combined website release implemented on September 22, 2026. The owner explicitly chose one release and ended the interactive review. [Combined release scope and validation](../releases/2026-09-22-combined-website.md) records the actual implementation and supersedes the phased delivery section below.

The implementation uses 12 capabilities, 10 verbatim public résumé evidence items, three examples, source pages, and deterministic ranking. The live adapter now defaults to Venice’s Jev decisions API, with streamed server progress, a requirement-probability breakdown, and response timing. Activation remains pending an account key with USD spending disabled and a verified free live call. Venice advertises a current free Jev promotion; the earlier Vercel catalog alone did not establish promotional billing, and an actual Vercel account probe returned `customer_verification_required`. See [free-access findings](../jev-free-access.md). Keyword results and examples explicitly disclose that Jev was not used. Role-family/seniority classification, the larger taxonomy, strong/partial labels, a Jev essay embed, and a live-model evaluation corpus from this proposal are not implemented or claimed complete. The sections below retain the original design for reference, not an additional release commitment.

## Summary
Career Fit Navigator lets a hiring manager, founder, recruiter, or collaborator paste a job title and non-confidential job description and receive a structured Role Brief. The Role Brief maps the role to Ashwin Rachha's public, curated, and source-linked evidence: relevant case studies, capabilities, outcomes, and appropriate discussion areas.

This is not a hiring recommendation, résumé chatbot, applicant-tracking system, or personality/culture-fit evaluator. It is a read-only evidence navigator that demonstrates how a bounded AI decision layer can sit inside a deterministic product workflow.

## Product Thesis
The portfolio should prove product and engineering judgment, not merely claim it. Rather than asking a language model to produce an opaque answer to “Is Ashwin a fit?”, the feature decomposes the problem:

```text
Job description
  → typed role signals
  → deterministic capability retrieval
  → constrained evidence selection
  → source-linked Role Brief
```

Jev interprets bounded semantic questions. The application owns the public evidence set, ranking logic, display rules, privacy posture, and final user experience.

## Goals

- Help evaluators quickly understand which documented work is most relevant to a role.
- Make the portfolio itself a working example of reliable, constrained AI product design.
- Surface evidence before claims: every positive assertion should link to public work, a case study, a portfolio artifact, or a résumé source.
- Distinguish demonstrated alignment, partial alignment, insufficient role information, and not-publicly-evidenced requirements.
- Create a practical companion to the Jev blog post and Decision Lab.
- Provide a useful route toward case studies and a thoughtful contact CTA.

## Non-Goals

- Predicting whether Ashwin will be hired or whether a company should hire him.
- Comparing candidates or evaluating protected characteristics, personality, culture fit, salary, or compensation.
- Sending messages, applying to jobs, scraping job boards, or making any external side effect.
- Supporting résumé upload, document upload, saved analyses, accounts, email summaries, or freeform chat in version 1.
- Allowing visitor-defined model instructions, question schemas, model selection, or arbitrary API use.
- Treating absence of public evidence as absence of ability.

## Users

### Hiring manager or founder
Needs a concise, credible view of the systems, outcomes, and work samples relevant to an open role.

### Recruiter
Needs quick orientation, relevant links, and interview prompts without reviewing a dense résumé first.

### Technical collaborator
Needs to see the implementation, reasoning model, and areas of mutual technical interest.

### Reader of the Jev essay
Needs an interactive, real-world example of typed AI decisions composed through ordinary software policy.

## Product Positioning

Suggested route: `/fit` or `/career-fit`

Suggested navigation label: `Fit Navigator`

Suggested title:

> Career Fit Navigator

Suggested supporting copy:

> Paste a job title or description. See how the role maps to documented systems work, capabilities, and case studies.

Suggested disclosure:

> This is an evidence navigator—not an automated hiring recommendation. It highlights documented alignment, uncertainty, and areas worth discussing.

Suggested privacy notice:

> The site does not save text you submit to your portfolio profile or analytics. Please do not paste confidential, candidate, customer, or proprietary information.

This statement must be reviewed against actual hosting, logging, analytics, error-monitoring, and model-provider data-handling behavior before release.

## User Journey

1. Visitor opens `/fit` or arrives from the Jev blog post, homepage, About page, case study CTA, or recruiter-specific link.
2. Visitor sees a prefilled example role and a concise explanation of what the feature does.
3. Visitor optionally enters a job title and pastes a non-confidential role description.
4. The browser sends the description to a server-side endpoint.
5. The server validates and size-limits input, rate-limits the request, loads only approved public evidence, and asks Jev fixed typed questions.
6. Deterministic code turns high-confidence role signals into capability tags and retrieves a small candidate set from the evidence catalog.
7. A second constrained Jev step may choose the most relevant items only from those retrieved candidates.
8. The site renders a source-linked Role Brief with role interpretation, evidence map, relevant work, gaps or discussion areas, limitations, and contact CTA.
9. No external tool, job application, email, booking, persistent profile, or hiring decision is made.

## UX Requirements

### Input panel

- Optional job-title input.
- Required job-description textarea.
- Prefilled sample role so first-time visitors can understand the product without writing input.
- 100–8,000 character validation range for the description.
- Explicit warning not to submit confidential data.
- One primary action: `Map this role to my work`.
- Loading state with clear status text such as `Interpreting role requirements…`.
- Reset-to-example action.
- Keyboard-operable controls and clear focus states.

### Result panel

The Role Brief should include:

1. **Role interpretation**
   - Primary role family.
   - Seniority signal.
   - Operating emphasis, such as applied AI, platform, ML systems, backend, or full-stack product delivery.
   - Capability signals inferred from the description.

2. **Evidence map**
   - A comparison between role capability requirements and linked public evidence.
   - Alignment labels: `Strongly evidenced`, `Partially evidenced`, `Not publicly evidenced`, or `Insufficient role information`.
   - A concise explanation of why an item was selected.

3. **Relevant work**
   - Up to three source-linked work items.
   - Case study card with claim, outcome, capability overlap, and source link.

4. **Discussion prompts**
   - Interview or collaboration questions that follow from actual evidence.
   - For example: evaluation/fallback design, operational reliability, bank integration flows, or ML inference architecture.

5. **Transparency**
   - Show that the model interpreted role signals while application code selected and presented evidence.
   - State that missing public evidence is not evidence of missing skill.
   - Explain that the feature is not a hiring recommendation.

### Design direction

- Editorial product interface, not a generic chatbot or SaaS dashboard.
- Calm, precise, evidence-led design consistent with the portfolio strategy.
- Warm off-white or near-black foundation; one accent color.
- Large editorial typography, restrained monospace labels for technical metadata, accessible contrast, semantic HTML, and reduced-motion support.
- Avoid radial score meters, decorative percentage counters, glowing AI effects, and uninspectable “match score” theater.

## Core Output Example

```text
Role Brief
Applied AI Product Engineering · Senior IC signal · Production reliability emphasis

Strongest documented alignment
• Agentic workflows and AI product systems
• Retrieval, RAG, classification, and operational workflows
• Backend/API integration and production delivery

Relevant work
1. AI Bookkeeper & Classification Platform
   Why it maps: retrieval-backed classification, workflow orchestration, caching, and observability.

2. Financial Infrastructure & Reconciliation
   Why it maps: bank integrations, OAuth/token flows, statement processing, reconciliation automation.

3. NLP Inference Platform
   Why it maps: ML deployment, inference performance, MLOps, service-oriented delivery.

Worth discussing
• The role asks for direct people management; that is not represented by public portfolio evidence.
• The role specifies broad Kubernetes administration; public work supports GKE-based deployment but does not claim full cluster-administration ownership.

How to interpret this
This feature compares a role description against a curated set of public evidence. It does not make a hiring recommendation and does not evaluate other candidates.
```

## Architecture

```text
Browser client component
  → POST /api/career-fit
  → validation, sanitization, body-size cap, and rate limiting
  → load server-owned public evidence catalog
  → Jev role classification using fixed typed questions
  → deterministic capability mapping and candidate retrieval
  → optional Jev selection over only the retrieved candidate evidence IDs
  → deterministic Role Brief assembly
  → source-linked UI rendering
```

### Trust boundaries

- Browser input is untrusted data.
- All Jev question definitions, model selection, candidate choices, prompts, thresholds, ranking rules, and portfolio claims are server-owned.
- The TypeSafe API key remains server-only and must never use a `NEXT_PUBLIC_` prefix.
- The client must never receive non-public evidence, raw provider errors, secret values, or internal prompts.
- The service must not perform side effects beyond creating a transient AI API request required to generate the brief.

## Repository Structure

```text
src/
  app/
    api/
      career-fit/
        route.ts
    fit/
      page.tsx
      FitNavigator.tsx
      fit.module.css
    blog/
      components/
        CareerFitEmbed.tsx
  data/
    career-evidence.ts
    capabilities.ts
    role-taxonomy.ts
    career-fit-evals.json
  lib/
    career-fit/
      validate.ts
      retrieveEvidence.ts
      policy.ts
      types.ts
      rateLimit.ts
      jev.ts

docs/
  specs/
    career-fit-navigator.md
```

The exact placement should follow established repository conventions. Current app routes and API patterns should be inspected before implementation.

## Evidence System

### Principle

The Navigator must use a curated public evidence catalog, not the full résumé, private Notion workspace, raw GitHub history, or an unfiltered blog corpus. Every rendered claim must be approved, public, bounded, and linkable.

### Private-to-public workflow

```text
Private Notion Career Evidence Bank
  → raw notes, work stories, metrics, caveats, sources
  → verification and confidentiality review
  → approved public claims
  → versioned GitHub evidence catalog
  → Career Fit Navigator and portfolio pages
```

Notion is the private evidence workshop. GitHub is the published, versioned source of truth used by the live site.

### Evidence schema

```ts
export type VerificationStatus =
  | "verified"
  | "publicly-supported"
  | "self-reported"
  | "needs-review";

export type EvidenceItem = {
  id: string;
  title: string;
  organization?: string;
  period?: string;
  claim: string;
  context?: string;
  outcome?: string;
  capabilityIds: string[];
  roleFamilies: RoleFamily[];
  visibility: "public" | "private";
  verification: VerificationStatus;
  source: {
    label: string;
    href: string;
    type: "case-study" | "portfolio" | "github" | "article" | "resume";
  };
  limitations?: string[];
  lastReviewedAt: string;
};
```

### Initial public evidence candidates

The following are candidate entries only. Their public wording, source pages, confidentiality status, and final verification must be reviewed before implementation:

| ID | Candidate evidence | Capability coverage |
| --- | --- | --- |
| `ai-bookkeeper` | Few-shot classification, Elasticsearch retrieval, Pinecone RAG, LangChain workflows, Redis caching, observability | Retrieval/RAG, classification, applied AI, product systems |
| `reconciliation-automation` | Automated reconciliation and statement processing with bank integrations | Financial infrastructure, APIs, workflow automation, reliability |
| `bank-connection-platform` | Plaid/Teller, OAuth/token flows, cash-based underwriting | Integrations, OAuth/security, financial infrastructure, backend systems |
| `nlp-inference-platform` | PySpark, MLflow, ONNX, Triton, GKE, service-oriented serving | ML systems, MLOps, inference, platform engineering |
| `agent-workflow-engineering` | LangGraph, FastAPI, MCP, AWS experimentation | Agents, tool workflows, backend, product delivery |
| `full-stack-product-delivery` | Rails, React, Hotwire, APIs, prototyping | Full-stack, product engineering, web systems |
| `technical-writing` | Jev and reliable AI systems essays | System design, technical communication, thought leadership |

### Rules for public evidence

- Entries with `visibility: "private"` are never loaded in the website runtime.
- Entries with `verification: "needs-review"` are never selected or shown automatically.
- An evidence item’s `claim` is the only approved statement the UI may render as direct proof.
- `limitations` must be considered in result copy and gap analysis.
- Every result card must include a source link.
- Absence from the catalog means `not publicly evidenced`; it must never be phrased as a lack of capability.

## Capability Taxonomy

The taxonomy is the contract between job descriptions, evidence, Jev questions, deterministic retrieval, and UI labels. Version 1 should contain approximately 30–50 well-defined capabilities—not an unbounded skills list.

### Initial capability groups

| Group | Example capability IDs |
| --- | --- |
| AI systems | `agentic-workflows`, `llm-integration`, `retrieval-rag`, `evaluation-reliability`, `classification` |
| ML platform | `ml-inference`, `mlops`, `model-serving`, `deployment-optimization` |
| Software systems | `backend-apis`, `integrations`, `oauth-security`, `distributed-systems`, `observability` |
| Domain systems | `financial-infrastructure`, `reconciliation`, `underwriting-workflows` |
| Product | `product-engineering`, `full-stack-delivery`, `workflow-design`, `technical-communication` |

Each capability must have a stable identifier, human label, group, and concise definition.

## Role Taxonomy and Jev Questions

Jev receives fixed candidate choices. It must not invent arbitrary role labels, skills, or portfolio facts.

### Role-family choices

```text
- applied-ai-product-engineering
- ai-platform-agent-infrastructure
- ml-platform-ml-systems
- backend-platform-engineering
- full-stack-product-engineering
- data-analytics-engineering
- other-or-insufficient-evidence
```

### Seniority choices

```text
- early-career
- mid-level-ic
- senior-ic
- staff-plus-technical-leadership
- unclear
```

### Operating-environment choices

```text
- early-stage-startup
- growth-stage-product-company
- enterprise-platform-team
- consultancy-client-delivery
- research-oriented-team
- unclear
```

### Fixed role-classification questions

```ts
const roleQuestions = {
  roleFamily: choice(/* fixed role-family taxonomy */),
  seniority: choice(/* fixed seniority taxonomy */),
  workMode: choice(/* fixed operating environment taxonomy */),
  requiresAgents: noul(
    "Does this role materially require agentic or tool-using AI workflows?"
  ),
  requiresRetrieval: noul(
    "Does this role materially require retrieval, RAG, search, or knowledge systems?"
  ),
  requiresMlPlatform: noul(
    "Does this role materially require production ML infrastructure, serving, or MLOps?"
  ),
  requiresBackend: noul(
    "Does this role materially require backend systems, APIs, or third-party integrations?"
  ),
  requiresProductOwnership: noul(
    "Does this role materially require product judgment and end-to-end delivery?"
  ),
  requiresPeopleManagement: noul(
    "Does this role explicitly require direct people management?"
  ),
};
```

### Constrained evidence-selection questions

After deterministic retrieval produces five to eight candidates, Jev may receive only those candidate IDs and their approved claims.

```ts
const evidenceQuestions = {
  strongestEvidence: choice({
    instructions:
      "Which candidate is the strongest documented evidence for the role's primary requirements?",
    criteria: candidateCriteria,
  }),
  secondStrongestEvidence: choice({
    instructions:
      "Which remaining candidate is the next strongest documented evidence? Do not choose the same item as the first answer.",
    criteria: remainingCandidateCriteria,
  }),
  hasMaterialGap: noul({
    instructions:
      "Does this role explicitly require a core capability for which no supplied candidate provides direct public evidence?",
  }),
};
```

The second selection pass must use only supplied candidate evidence. It must never infer hidden experience or use absence of evidence as evidence of absence.

## Deterministic Retrieval and Policy

### Capability mapping

Only high-enough-probability role requirements become retrieval tags. Thresholds must be configurable and evaluated with representative examples.

```ts
function capabilityNeeds(answers: RoleAnswers) {
  const needs: string[] = [];

  if (answers.requiresAgents.noul >= 0.65) {
    needs.push("agentic-workflows");
  }

  if (answers.requiresRetrieval.noul >= 0.65) {
    needs.push("retrieval-rag");
  }

  if (answers.requiresMlPlatform.noul >= 0.65) {
    needs.push("ml-inference", "mlops");
  }

  if (answers.requiresBackend.noul >= 0.65) {
    needs.push("backend-apis");
  }

  if (answers.requiresProductOwnership.noul >= 0.65) {
    needs.push("product-engineering", "full-stack-delivery");
  }

  return needs;
}
```

### Candidate ranking

```text
retrievalScore(evidence) =
  weighted capability overlap
  + verification weight
  + evidence completeness weight
```

`verificationWeight` should reward `verified` evidence above `publicly-supported`, exclude `needs-review`, and be transparent in code.

```ts
const verificationWeight = {
  verified: 3,
  "publicly-supported": 2,
  "self-reported": 1,
  "needs-review": 0,
};
```

### Presentation labels

Use explainable labels, not a global opaque percentage score:

```text
- Strongly evidenced
- Partially evidenced
- Not publicly evidenced
- Insufficient role information
```

No “92% match,” “hire recommendation,” or equivalent precision theater should appear in version 1.

## API Contract

### Endpoint

```text
POST /api/career-fit
```

### Request

```ts
type CareerFitRequest = {
  jobTitle?: string;
  jobDescription: string;
};
```

### Validation

- `jobTitle` is optional and length-limited.
- `jobDescription` is required and must be 100–8,000 characters after normalization.
- Strip HTML and normalize whitespace.
- Reject or redact likely credentials, secrets, and token patterns where practical.
- Do not accept arbitrary JSON state, question definitions, model names, instructions, files, URLs for fetch, or user-provided evidence.
- Add a request body-size cap.

### Response

```ts
type CareerFitResponse = {
  role: {
    family: string;
    confidence: number;
    seniority: string;
    workMode: string;
  };
  capabilitySignals: Array<{
    id: string;
    label: string;
    probability: number;
  }>;
  evidenceMatches: Array<{
    evidenceId: string;
    title: string;
    claim: string;
    outcome?: string;
    source: { label: string; href: string };
    alignment: "strong" | "partial";
    rationale: string;
    limitations?: string[];
  }>;
  discussionAreas: string[];
  notPubliclyEvidenced: string[];
  disclaimer: string;
};
```

The server must assemble all final response prose from approved templates and public catalog data in version 1. Do not expose raw model output or chain-of-thought.

## Privacy, Security, and Cost Controls

### Privacy

- The application must not persist raw submitted job descriptions to a database, analytics provider, or product telemetry.
- Server logs and error reporting must redact request contents.
- Do not use session replay on the input screen.
- Add explicit client-side guidance against submitting confidential information.
- Publish accurate retention and third-party-processing language after reviewing host, analytics, error-monitoring, and model-provider configuration.

### Security

- `TYPESAFE_API_KEY` must be server-only.
- Never use a `NEXT_PUBLIC_` environment variable for any model credential.
- Treat user input as data only; it must never become a system instruction.
- Use schema validation for input and output boundaries.
- Return generic public errors; reserve detailed provider diagnostics for secure server logs without body contents.
- Never return private Notion content, hidden evidence, internal prompts, keys, raw provider payloads, or stack traces.

### Abuse and cost controls

- Enforce per-IP rate limits, for example 5–10 analyses per IP per hour at launch.
- Enforce a minimum request interval.
- Use only fixed question sets and the approved model alias.
- Add timeout, retry, and circuit-breaker behavior.
- Return a friendly unavailable state if provider capacity or a site budget is exhausted.
- Log only anonymous operational metrics such as scenario type, success/error, latency, response size, and outcome category.

## Accessibility

- Use semantic form controls, labels, field errors, button states, and live regions for results.
- Ensure full keyboard operation and visible focus states.
- Preserve readable contrast in all alignment states.
- Respect `prefers-reduced-motion`.
- Do not encode meaning only through color, position, or decorative graphics.
- Ensure result cards and source links have descriptive accessible names.

## Analytics and Success Metrics

Track only privacy-conscious product events, without raw job-description text:

- `career_fit_viewed`
- `career_fit_example_loaded`
- `career_fit_submitted`
- `career_fit_succeeded`
- `career_fit_failed`
- `career_fit_rate_limited`
- `career_fit_source_opened`
- `career_fit_contact_cta_clicked`

Measure:

- Interaction rate: analyses per `/fit` visitor.
- Completion rate: successful result renders per submission.
- Source engagement: source-link opens per completed result.
- Case-study engagement: case-study reads after an analysis.
- Conversion: contact CTA clicks after an analysis.
- Error rate, rate-limit rate, p95 latency, and estimated cost per successful analysis.
- Evaluation accuracy against the curated test set.

Do not measure or store job-description contents.

## Evaluation Plan

Create `src/data/career-fit-evals.json` with 15–25 representative role descriptions across:

- Applied AI / agentic systems
- AI platform / agent infrastructure
- ML platform / ML systems
- Fintech or financial-infrastructure backend
- Backend / platform engineering
- Full-stack product engineering
- Poor-fit or deliberately unrelated roles
- Roles requiring direct people management

Each example should define expected role signals, expected top evidence IDs, and expected public-evidence gaps.

```json
{
  "id": "applied-ai-engineer",
  "title": "Senior Applied AI Engineer",
  "description": "Build agentic workflows, retrieval systems, evaluation harnesses...",
  "expectedCapabilities": [
    "agentic-workflows",
    "retrieval-rag",
    "evaluation-reliability",
    "backend-apis"
  ],
  "expectedEvidenceIds": [
    "ai-bookkeeper",
    "agent-workflow-engineering"
  ],
  "expectedGapIds": []
}
```

Test at four layers:

| Layer | Question | Pass condition |
| --- | --- | --- |
| Role interpretation | Are role family, seniority, and core requirements reasonable? | Expected labels on representative input |
| Candidate retrieval | Are relevant evidence items in the deterministic top candidates? | Expected evidence IDs appear |
| Output integrity | Are all shown claims public, approved, bounded, and source-linked? | Zero unsupported-claim leakage |
| Gap handling | Are explicitly required but unproven capabilities stated responsibly? | Gaps identified without claiming inability |
| Prompt injection resistance | Can role text alter instructions or force false claims? | Fixed policy and catalog remain intact |

## Implementation Phases

### Phase 0 — Private evidence foundation

- [ ] Create a private Notion Career Evidence Bank.
- [ ] Capture raw work artifacts from Loan Labs, Finally, Virginia Tech, Unar Labs, Outreach, projects, open-source work, and writing.
- [ ] Add the required fields: problem, role, system, decision, outcome, metric, capability tags, source, verification, confidentiality, public claim, limitation, and review date.
- [ ] Mark artifacts public, redacted, or private.
- [ ] Approve 8–12 high-quality public evidence items.

### Phase 1 — Public catalog and case studies

- [ ] Add `src/data/career-evidence.ts`.
- [ ] Add `src/data/capabilities.ts` and `src/data/role-taxonomy.ts`.
- [ ] Export only approved public evidence.
- [ ] Create or complete source-linked case studies for initial evidence entries.
- [ ] Add TypeScript schema checks.
- [ ] Confirm all publicly stated metrics and confidentiality constraints.

### Phase 2 — Career Fit Navigator MVP

- [ ] Implement `/fit` route and responsive input/results UI.
- [ ] Implement `POST /api/career-fit`.
- [ ] Add validation, sanitization, request size cap, and baseline rate limiting.
- [ ] Add fixed Jev role-classification questions.
- [ ] Implement deterministic capability mapping and candidate retrieval.
- [ ] Implement constrained evidence selection over retrieved IDs only.
- [ ] Assemble the Role Brief using catalog data and approved templates.
- [ ] Add source links, limitations, privacy disclosure, and non-hiring disclaimer.
- [ ] Add accessible loading, error, reset, and unavailable states.

### Phase 3 — Evaluation and launch

- [ ] Add 15–25 curated role-description evaluations.
- [ ] Test the system manually for supported roles, adjacent roles, poor-fit roles, and management-heavy roles.
- [ ] Verify no unsupported claims, private evidence, secrets, or raw input logs can leak.
- [ ] Instrument privacy-conscious analytics.
- [ ] Embed a prefilled version in the Jev article.
- [ ] Add navigation and cross-links from relevant portfolio pages.
- [ ] Review copy, provider terms, deployment configuration, privacy wording, and cost limits before launch.

### Phase 4 — Deferred enhancements

- [ ] Saved analyses, only after a privacy and account model exists.
- [ ] Job-link parsing, only after SSRF and content-safety controls are designed.
- [ ] Company-specific research, only with reputable source handling and clear citations.
- [ ] Role-specific interview brief export.
- [ ] Optional shareable permalink containing no confidential job text.
- [ ] A richer evidence explorer that leads from a role requirement to case-study architecture diagrams and source artifacts.

## Acceptance Criteria

- A visitor can paste a non-confidential job description and receive a useful Role Brief in a single interaction.
- Every surfaced positive claim comes from a public, approved, source-linked evidence item.
- No raw private Notion content, unapproved evidence, secret, or job-description text is persisted or exposed by the application.
- The feature never presents a global “match percentage,” hiring recommendation, or unsupported claim.
- The feature clearly separates model role interpretation from deterministic application evidence selection and policy.
- The UI is readable, accessible, responsive, and useful without decorative AI visuals.
- The implementation has representative evaluation fixtures and demonstrates sensible results for agentic AI, ML systems, fintech/backend, full-stack, and poor-fit role descriptions.
- The Jev blog embeds a constrained sample experience, while `/fit` remains a reusable standalone portfolio tool.

## Risks and Mitigations

| Risk | Mitigation |
| --- | --- |
| Hallucinated portfolio claims | Use approved catalog only; final copy from templates; all evidence source-linked |
| False precision | Use discrete evidence labels, probability only where meaningful, no global fit percentage |
| Confidential job-text submission | Prominent warning, no persistence, redacted logs, honest privacy disclosure |
| Cost or abuse | Fixed input sizes, fixed questions, rate limiting, timeout, budget fallback |
| Prompt injection through job text | Treat text as data; fixed server-owned prompts, catalog, choices, and policy |
| Overclaiming adjacent experience | Attach limitations to evidence; show `not publicly evidenced` gaps |
| Weak visitor comprehension | Prefilled example, explainable result cards, concise model-versus-code explanation |
| Stale public claims | `lastReviewedAt`, source links, review cadence, catalog pull requests |

## Open Questions

1. Which organization and project artifacts can be publicly named, described, and measured after confidentiality review?
2. What final public URLs will host the AI Bookkeeper, reconciliation, and NLP inference case studies?
3. Which hosting, analytics, logging, error-monitoring, and rate-limit providers will be used, and what exact data-retention claims can the website make?
4. Should the MVP use a live Jev request, a budgeted live mode plus static fallback, or an initially static demonstration while the evidence catalog is completed?
5. Which target role families should be represented in the first 15–25 evaluation fixtures?
6. Should `/fit` be a first-class nav item at launch or a CTA reached from writing and case studies first?

## References

- Existing portfolio website strategy in Notion: `Website` page in Command Center.
- Existing public résumé source: `src/content/resume.json`.
- Existing App Router blog and API route structure in AR-Portfolio.
- Jev / TypeSafe documentation for System One typed questions and SDK integration.
