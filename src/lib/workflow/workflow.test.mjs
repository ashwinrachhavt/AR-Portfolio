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

test("generation sends only submitted input as user content and validates the response", async () => {
  let requestBody;
  const brief = validBrief();
  const generated = await generateWorkflowBrief(VALID_INPUT, {
    apiKey: "test-key",
    gatewayApiKey: "unused-gateway-key",
    model: "test-model",
    fetchFn: async (_url, init) => {
      requestBody = JSON.parse(init.body);
      return Response.json({ status: "completed", output_text: JSON.stringify(brief) });
    },
  });

  assert.deepEqual(generated, brief);
  assert.equal(requestBody.model, "test-model");
  assert.equal(requestBody.store, false);
  assert.deepEqual(JSON.parse(requestBody.input[0].content[0].text), {
    submission: VALID_INPUT,
    canonicalApprovalPolicy: "Uncertain results, failures, and policy exceptions require human review.",
  });
  assert.equal(requestBody.max_output_tokens > 0, true);
  assert.equal(requestBody.text.format.type, "json_schema");
});

test("generation uses the explicitly selected gateway without calling the direct provider", async () => {
  let gatewayRequest;
  let directCalls = 0;
  const brief = validBrief();
  const generated = await generateWorkflowBrief(VALID_INPUT, {
    apiKey: "direct-test-key",
    gatewayApiKey: "gateway-test-key",
    provider: "gateway",
    model: "gpt-4.1-mini",
    fetchFn: async () => {
      directCalls += 1;
      return new Response(null, { status: 500 });
    },
    gatewayGenerate: async (request) => {
      gatewayRequest = request;
      return brief;
    },
  });

  assert.deepEqual(generated, brief);
  assert.equal(directCalls, 0);
  assert.equal(gatewayRequest.apiKey, "gateway-test-key");
  assert.equal(gatewayRequest.model, "openai/gpt-4.1-mini");
  assert.deepEqual(gatewayRequest.input, VALID_INPUT);
  assert.equal(
    gatewayRequest.canonicalApprovalPolicy,
    "Uncertain results, failures, and policy exceptions require human review.",
  );
});

test("generation does not fall back to the direct provider after a gateway failure", async () => {
  let directCalls = 0;
  await assert.rejects(
    generateWorkflowBrief(VALID_INPUT, {
      apiKey: "direct-test-key",
      gatewayApiKey: "gateway-test-key",
      provider: "gateway",
      fetchFn: async () => {
        directCalls += 1;
        return Response.json({ status: "completed", output_text: JSON.stringify(validBrief()) });
      },
      gatewayGenerate: async () => { throw new Error("gateway failed"); },
    }),
    (error) => error instanceof WorkflowGenerationError && error.kind === "provider",
  );
  assert.equal(directCalls, 0);
});

test("generation rejects a missing mandatory human step", async () => {
  const highStakes = { ...VALID_INPUT, stakes: "high" };
  const brief = validBrief({ steps: validBrief().steps.filter((step) => step.kind !== "human") });

  await assert.rejects(
    generateWorkflowBrief(highStakes, {
      apiKey: "test-key",
      fetchFn: async () => Response.json({ status: "completed", output_text: JSON.stringify(brief) }),
    }),
    (error) => error instanceof WorkflowGenerationError && error.kind === "malformed-output",
  );
});

test("generation converts provider failures to a safe typed error without retrying", async () => {
  let calls = 0;
  await assert.rejects(
    generateWorkflowBrief(VALID_INPUT, {
      apiKey: "test-key",
      fetchFn: async () => {
        calls += 1;
        return new Response("sensitive upstream detail", { status: 503 });
      },
    }),
    (error) =>
      error instanceof WorkflowGenerationError &&
      error.kind === "provider" &&
      !error.message.includes("sensitive upstream detail"),
  );
  assert.equal(calls, 1);
});

test("generation distinguishes its timeout from caller cancellation", async () => {
  const waitForAbort = async (_url, init) =>
    new Promise((_resolve, reject) => {
      if (init.signal.aborted) {
        reject(init.signal.reason);
        return;
      }
      init.signal.addEventListener("abort", () => reject(init.signal.reason), { once: true });
    });

  await assert.rejects(
    generateWorkflowBrief(VALID_INPUT, { apiKey: "test-key", fetchFn: waitForAbort, timeoutMs: 5 }),
    (error) => error instanceof WorkflowGenerationError && error.kind === "timeout",
  );

  const controller = new AbortController();
  controller.abort(new DOMException("Cancelled", "AbortError"));
  await assert.rejects(
    generateWorkflowBrief(VALID_INPUT, {
      apiKey: "test-key",
      fetchFn: waitForAbort,
      signal: controller.signal,
    }),
    (error) => error instanceof WorkflowGenerationError && error.kind === "cancelled",
  );
});

test("generation keeps the timeout active while reading the provider response", async () => {
  await assert.rejects(
    generateWorkflowBrief(VALID_INPUT, {
      apiKey: "test-key",
      timeoutMs: 5,
      fetchFn: async (_url, init) => ({
        ok: true,
        json: async () => new Promise((_resolve, reject) => {
          init.signal.addEventListener("abort", () => reject(init.signal.reason), { once: true });
        }),
      }),
    }),
    (error) => error instanceof WorkflowGenerationError && error.kind === "timeout",
  );
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
