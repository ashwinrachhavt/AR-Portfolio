import assert from "node:assert/strict";
import test from "node:test";

import {
  approvalPolicy,
  workflowBriefSchema,
  workflowInputSchema,
} from "./schema.ts";
import {
  generateWorkflowBrief,
  WorkflowGenerationError,
} from "./generate.ts";
import {
  MAX_REQUEST_BYTES,
  createInMemoryWorkflowLimiter,
  createWorkflowHandler,
} from "./handler.ts";

const VALID_INPUT = Object.freeze({
  task: "Review incoming vendor documents",
  currentProcess: "An operations lead reads each document and assigns it to a reviewer.",
  inputs: "PDF documents from the intake queue and the vendor record in the CRM.",
  desiredOutput: "A proposed reviewer assignment with supporting evidence.",
  stakes: "moderate",
  approval: "exceptions",
});

function validBrief(overrides = {}) {
  return {
    title: "Vendor document review workflow",
    jobToBeDone: "Route vendor documents to an appropriate reviewer.",
    recommendation: {
      pattern: "Evidence-first assisted routing",
      rationale: "A model can propose a route while an exception queue preserves oversight.",
    },
    steps: [
      { name: "Load document", kind: "software", detail: "Read the submitted PDF and vendor record." },
      { name: "Propose route", kind: "model", detail: "Propose a reviewer and cite the submitted evidence." },
      { name: "Review exception", kind: "human", detail: "Approve routes that meet an exception rule." },
    ],
    readiness: [
      { area: "data", status: "defined", evidence: "PDF documents and CRM records were supplied.", action: "Document required fields." },
      { area: "retrieval", status: "needs-work", evidence: "Retrieval access was not supplied.", action: "Confirm access boundaries." },
      { area: "workflow", status: "defined", evidence: "The current owner and handoff were supplied.", action: "Map exception branches." },
      { area: "evaluation", status: "unknown", evidence: "No baseline was supplied.", action: "Label a representative sample." },
      { area: "observability", status: "unknown", evidence: "Monitoring was not supplied.", action: "Define trace fields." },
      { area: "human-review", status: "defined", evidence: "Exception approval was requested.", action: "Define exception thresholds." },
      { area: "risk", status: "needs-work", evidence: "Mistakes have moderate consequences.", action: "List failure modes." },
    ],
    risks: [{ risk: "Incorrect routing", mitigation: "Send uncertain routes to a human reviewer." }],
    assumptions: ["The CRM record can be read during document intake."],
    evaluation: [{ metric: "Routing agreement", method: "Compare proposals with reviewer labels.", target: "Set after a baseline sample." }],
    nextExperiment: {
      action: "Run a labeled offline sample.",
      successCriteria: "Document error types and establish a baseline agreement rate.",
    },
    ...overrides,
  };
}

function post(body, headers = {}) {
  return new Request("https://portfolio.example/api/workflow-readiness", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      origin: "https://portfolio.example",
      ...headers,
    },
    body: typeof body === "string" ? body : JSON.stringify(body),
  });
}

test("input validation rejects malformed and oversized fields", () => {
  const malformed = workflowInputSchema.safeParse({ ...VALID_INPUT, task: "   ", stakes: "critical" });
  assert.equal(malformed.success, false);

  for (const [field, value] of [
    ["task", "x".repeat(1_501)],
    ["currentProcess", "x".repeat(1_501)],
    ["inputs", "x".repeat(1_001)],
    ["desiredOutput", "x".repeat(1_001)],
  ]) {
    assert.equal(workflowInputSchema.safeParse({ ...VALID_INPUT, [field]: value }).success, false);
  }

  assert.equal(workflowInputSchema.safeParse({
    task: "x".repeat(20),
    currentProcess: "x".repeat(20),
    inputs: "x".repeat(5),
    desiredOutput: "x".repeat(5),
    stakes: "low",
    approval: "none",
  }).success, true);
});

test("brief validation requires exactly seven unique readiness areas", () => {
  const duplicate = validBrief({
    readiness: validBrief().readiness.map((item, index) =>
      index === 6 ? { ...item, area: "data" } : item,
    ),
  });
  assert.equal(workflowBriefSchema.safeParse(duplicate).success, false);
  assert.equal(workflowBriefSchema.safeParse(validBrief({ title: "x".repeat(121) })).success, false);
  assert.equal(workflowBriefSchema.safeParse(validBrief({
    recommendation: {
      pattern: "A Long Sentence That Keeps Explaining The Entire Workflow",
      rationale: "The rationale remains separate from the concise pattern name.",
    },
  })).success, false);
  assert.equal(workflowBriefSchema.safeParse(validBrief()).success, true);
});

test("approval policy makes high-stakes and universal review scope explicit", () => {
  assert.equal(
    approvalPolicy({ ...VALID_INPUT, stakes: "high", approval: "none" }),
    "Human approval is required before every consequential action, regardless of the selected approval preference.",
  );
  assert.equal(
    approvalPolicy({ ...VALID_INPUT, stakes: "moderate", approval: "always" }),
    "Every final result and outgoing action requires explicit human approval.",
  );
});

test("default generation is deterministic and cannot call a paid provider even with legacy config", async () => {
  const options = {
    env: { WORKFLOW_LAB_PROVIDER: "openai", OPENAI_API_KEY: "unused", AI_GATEWAY_API_KEY: "unused" },
    fetchFn: () => { throw new Error("No network is permitted"); },
  };
  const first = await generateWorkflowBrief(VALID_INPUT, options);
  assert.deepEqual(await generateWorkflowBrief(VALID_INPUT, options), first);
  assert.equal(workflowBriefSchema.safeParse(first).success, true);
  assert.equal(first.jobToBeDone, VALID_INPUT.task);
  assert.ok(first.steps.some(step => step.name === "Retrieve permitted evidence"));
  assert.ok(first.steps.some(step => step.name === "Extract a reviewable record"));
});

test("all risk and approval choices produce valid briefs with the required human boundary", async () => {
  for (const stakes of ["low", "moderate", "high"]) for (const approval of ["always", "exceptions", "none"]) {
    const input = { ...VALID_INPUT, stakes, approval };
    const brief = await generateWorkflowBrief(input);
    assert.equal(workflowBriefSchema.safeParse(brief).success, true);
    assert.equal(brief.steps.some(step => step.kind === "human"), stakes === "high" || approval !== "none");
    assert.ok(brief.recommendation.rationale.includes(approvalPolicy(input)));
  }
});

test("local output stays valid at every maximum input length", async () => {
  const brief = await generateWorkflowBrief({ ...VALID_INPUT, task: "t".repeat(1500), currentProcess: "p".repeat(1500), inputs: "i".repeat(1000), desiredOutput: "o".repeat(1000) });
  assert.equal(workflowBriefSchema.safeParse(brief).success, true);
});

test("generation respects caller cancellation before doing work", async () => {
  const controller = new AbortController();
  controller.abort();
  await assert.rejects(generateWorkflowBrief(VALID_INPUT, { signal: controller.signal }), error => error instanceof WorkflowGenerationError && error.kind === "cancelled");
});

test("handler returns a validated successful brief with no-store headers", async () => {
  const handler = createWorkflowHandler({ generate: async () => validBrief() });
  const response = await handler(post(VALID_INPUT));

  assert.equal(response.status, 200);
  assert.equal(response.headers.get("cache-control"), "no-store");
  assert.deepEqual(await response.json(), { brief: validBrief() });
});

test("handler reports malformed input with field errors", async () => {
  const handler = createWorkflowHandler({ generate: async () => validBrief() });
  const response = await handler(post({ ...VALID_INPUT, desiredOutput: "" }));
  const payload = await response.json();

  assert.equal(response.status, 400);
  assert.deepEqual(Object.keys(payload.fieldErrors), ["desiredOutput"]);
});

test("handler rejects a body over the byte limit before generation", async () => {
  let generated = false;
  const handler = createWorkflowHandler({
    generate: async () => {
      generated = true;
      return validBrief();
    },
  });
  const response = await handler(post("x".repeat(MAX_REQUEST_BYTES + 1)));

  assert.equal(response.status, 413);
  assert.equal(generated, false);
});

test("handler rejects cross-origin browser posts and non-JSON content", async () => {
  const handler = createWorkflowHandler({ generate: async () => validBrief() });
  const crossOrigin = await handler(post(VALID_INPUT, { origin: "https://attacker.example" }));
  const wrongType = await handler(post(VALID_INPUT, { "content-type": "text/plain" }));

  assert.equal(crossOrigin.status, 403);
  assert.equal(wrongType.status, 415);
});

test("handler rejects an injected brief that omits a mandatory human step", async () => {
  const noHuman = validBrief({ steps: validBrief().steps.filter((step) => step.kind !== "human") });
  const handler = createWorkflowHandler({ generate: async () => noHuman });
  const response = await handler(post({ ...VALID_INPUT, approval: "always" }));

  assert.equal(response.status, 502);
  assert.deepEqual(await response.json(), { error: "The workflow brief could not be generated. Please try again." });
});

test("in-process limiter enforces per-client rate limits", async () => {
  const limiter = createInMemoryWorkflowLimiter({ maxRequests: 1, windowMs: 60_000, maxConcurrent: 2 });
  const handler = createWorkflowHandler({ limiter, generate: async () => validBrief() });

  assert.equal((await handler(post(VALID_INPUT, { "x-forwarded-for": "203.0.113.8" }))).status, 200);
  assert.equal((await handler(post(VALID_INPUT, { "x-forwarded-for": "203.0.113.8" }))).status, 429);
});

test("rate identity prefers Vercel's forwarding header over a client-supplied fallback", async () => {
  const limiter = createInMemoryWorkflowLimiter({ maxRequests: 1, windowMs: 60_000, maxConcurrent: 2 });
  const handler = createWorkflowHandler({ limiter, generate: async () => validBrief() });

  const first = await handler(post(VALID_INPUT, {
    "x-vercel-forwarded-for": "198.51.100.7",
    "x-forwarded-for": "203.0.113.20",
  }));
  const second = await handler(post(VALID_INPUT, {
    "x-vercel-forwarded-for": "198.51.100.7",
    "x-forwarded-for": "203.0.113.21",
  }));

  assert.equal(first.status, 200);
  assert.equal(second.status, 429);
});

test("in-process limiter bounds concurrent generations and releases capacity", async () => {
  const limiter = createInMemoryWorkflowLimiter({ maxRequests: 10, windowMs: 60_000, maxConcurrent: 1 });
  let finish;
  let startedResolve;
  const started = new Promise((resolve) => { startedResolve = resolve; });
  const handler = createWorkflowHandler({
    limiter,
    generate: async () => {
      startedResolve();
      return new Promise((resolve) => { finish = () => resolve(validBrief()); });
    },
  });

  const first = handler(post(VALID_INPUT, { "x-forwarded-for": "203.0.113.9" }));
  await started;
  const busy = await handler(post(VALID_INPUT, { "x-forwarded-for": "203.0.113.10" }));
  assert.equal(busy.status, 429);

  finish();
  assert.equal((await first).status, 200);
  const afterRelease = createWorkflowHandler({ limiter, generate: async () => validBrief() });
  assert.equal((await afterRelease(post(VALID_INPUT, { "x-forwarded-for": "203.0.113.10" }))).status, 200);
});
