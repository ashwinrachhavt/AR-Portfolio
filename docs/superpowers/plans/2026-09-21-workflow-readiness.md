# AI Workflow Readiness Lab Implementation Plan

> **For agentic workers:** Use superpowers:subagent-driven-development for bounded implementation and review tasks. Execute continuously under the user's approval to build Phase 1.

**Goal:** Ship a usable workflow diagnostic and exportable brief within the existing portfolio.

**Architecture:** Server-rendered page with a client form/result component. A dedicated POST handler validates input, calls OpenAI for structured output, validates the result, and returns a typed brief. Existing shared UI provides site consistency.

**Tech Stack:** Next.js 16.3.5, React 19, TypeScript, Zod 4, CSS modules, Node test runner.

**Spec:** `docs/superpowers/specs/2026-09-21-workflow-readiness-design.md`

## Global Constraints

- Reuse the portfolio's monochrome design and shared navigation/footer.
- Route: `/tools/workflow-readiness`.
- Keep credentials on the server.
- No public brief database, integration access, private Notion context, or action execution.
- Do not store raw submissions in logs or analytics.
- High-stakes workflows and requests for universal approval require a human step.
- No deployment or merge is part of this task.

## Shared contract

```ts
type WorkflowInput = {
  task: string; currentProcess: string; inputs: string; desiredOutput: string;
  stakes: 'low' | 'moderate' | 'high'; approval: 'always' | 'exceptions' | 'none';
};
type WorkflowBrief = {
  title: string; jobToBeDone: string;
  recommendation: { pattern: string; rationale: string };
  steps: { name: string; kind: 'software' | 'model' | 'human'; detail: string }[];
  readiness: { area: 'data' | 'retrieval' | 'workflow' | 'evaluation' | 'observability' | 'human-review' | 'risk'; status: 'defined' | 'needs-work' | 'unknown'; evidence: string; action: string }[];
  risks: { risk: string; mitigation: string }[];
  assumptions: string[];
  evaluation: { metric: string; method: string; target: string }[];
  nextExperiment: { action: string; successCriteria: string };
};
// POST /api/workflow-readiness
// Success: { brief: WorkflowBrief }
// Failure: { error: string; fieldErrors?: Record<string, string[]> }
```

### Task 1: Validated generation service

Files: `src/lib/workflow/schema.ts`, `src/lib/workflow/generate.ts`, `src/lib/workflow/handler.ts`, `src/lib/workflow/workflow.test.mjs`, `src/app/api/workflow-readiness/route.ts`.

- [ ] Write tests for malformed and oversized input, seven unique readiness areas, missing human gate, provider failure, cancellation/timeout, request limits, and successful response with injected provider.
- [ ] Implement input schema and output schema, exported WorkflowInput and WorkflowBrief types, and validation of the human-review invariant.
- [ ] Implement bounded direct OpenAI Responses request and explicit parsing/refusal/error handling, using configuration only on the server.
- [ ] Implement handler factory with injected generator and limiter for deterministic tests. Reject cross-origin browser requests, non-JSON requests, oversized request bodies, and exhausted limits. Return no-store responses and meaningful statuses without provider text.
- [ ] Add the thin Next.js POST route with maxDuration 60.
- [ ] Run `node --experimental-strip-types --test src/lib/workflow/*.test.mjs`, self-review, and record validation evidence.

### Task 2: Form, example, brief, and exports

Files: `src/app/tools/workflow-readiness/page.tsx`, `WorkflowLab.tsx`, `WorkflowBrief.tsx`, `workflow.module.css`; `src/lib/workflow/example.ts`, `export.ts`, `export.test.mjs`.

- [ ] Build a complete vendor-document example that conforms to WorkflowBrief and clearly identifies assumptions and proposed metrics.
- [ ] Implement pure Markdown export and tests that verify every section, approval gate, and original input are preserved without HTML execution.
- [ ] Build accessible six-field form, explicit example selection, pending/cancel/error state, and validated response handling. Preserve inputs and discard stale results when a newer action supersedes a request.
- [ ] Render the brief with readable section hierarchy, software/model/human steps, seven readiness findings, and working copy/download/print controls. Label examples and generated proposals distinctly.
- [ ] Style desktop and mobile to the existing 1120px content width, dark palette, simple borders, restrained typography, visible focus, reduced motion, and printer-friendly document layout.

### Task 3: Site integration and verification

Files: `src/app/components/Navbar.jsx`, `src/app/page.js`, `src/app/home.module.css`, `README.md`.

- [ ] Add Tools nav entry with active state and a homepage invitation linked to the lab.
- [ ] Document environment variables, endpoint limits, provider processing, best-effort limiter semantics, and production-wide quota recommendation.
- [ ] Verify the current site plus desktop/mobile lab in `ab clean`, including a real generation and all export actions. Inspect screenshots against the existing site's visual conventions.
- [ ] Run all meaningful tests, `pnpm lint`, `pnpm typecheck`, `pnpm build`, and `git diff --check`.
- [ ] Review the complete feature diff, fix material findings, save handoff evidence, and leave the app available on localhost:3000.
