import assert from "node:assert/strict";
import test from "node:test";
import { generateWorkflowBrief, WorkflowGenerationError } from "./generate.ts";
import { buildWorkflowBrief, detectWorkflowSignals, workflowSignals } from "./rules.ts";
import { workflowBriefSchema, workflowMethodSchema } from "./schema.ts";
import { exampleInput } from "./example.ts";
import { createWorkflowHandler, createInMemoryWorkflowLimiter } from "./handler.ts";
import { JEV_FREE_ACCESS_END } from "../jev.ts";

const env = { WORKFLOW_LAB_LIVE_ENABLED: "true", CAREER_FIT_PROVIDER: "vercel", AI_GATEWAY_API_KEY: "test-only" };
const catalog = { data: [{ id: "typesafe-ai/jev", pricing: { input: "0", output: "0" } }] };
const receipt = { gateway: { cost: "0", gatewayCost: "0", surchargeCost: "0" } };
const now = () => Date.parse("2026-09-23T00:00:00Z");
const response = (extra = {}) => Response.json({
  providerMetadata: receipt,
  answers: Object.fromEntries(workflowSignals.map(({ id }) => [id, { probability: id === "retrieval" ? .9 : .1 }])),
  ...extra,
});

test("requesting rules never contacts Jev even with live configuration", async () => {
  let calls = 0;
  let method;
  const brief = await generateWorkflowBrief(exampleInput, { env, now, fetchFn: async () => { calls++; throw new Error("Forbidden network"); }, onMethod: value => { method = value; } });
  assert.equal(calls, 0);
  assert.equal(method.mode, "rules");
  assert.deepEqual(brief, buildWorkflowBrief(exampleInput));
});

test("workflow Jev sends fixed questions and only typed signals influence authored output", async () => {
  let method;
  let sent;
  const brief = await generateWorkflowBrief(exampleInput, { interpretation: "jev", env, now,
    onMethod: value => { method = value; }, fetchFn: async (url, init) => {
      if (url.endsWith("/models")) return Response.json(catalog);
      sent = JSON.parse(init.body);
      return response({ title: "Invented guaranteed readiness", claim: "Unverified success", url: "https://malicious.example" });
    },
  });
  assert.equal(method.mode, "jev");
  assert.equal(workflowMethodSchema.safeParse(method).success, true);
  assert.deepEqual(sent.state, { workflow: exampleInput });
  assert.deepEqual(Object.keys(sent.questions), workflowSignals.map(({ id }) => id));
  assert.deepEqual(method.signalIds, ["retrieval"]);
  assert.deepEqual(brief, buildWorkflowBrief(exampleInput, ["retrieval"]));
  assert.ok(!JSON.stringify(brief).includes("Invented"));
  assert.ok(!JSON.stringify(brief).includes("malicious"));
});

test("expired, disabled, or unconfigured Jev keeps rules available without network", async () => {
  for (const options of [{ env, now: () => JEV_FREE_ACCESS_END }, { env: { ...env, WORKFLOW_LAB_LIVE_ENABLED: "false" }, now }, { env: {}, now }]) {
    let calls = 0;
    let method;
    const brief = await generateWorkflowBrief(exampleInput, { ...options, interpretation: "jev", fetchFn: async () => { calls++; throw new Error("Must not contact provider"); }, onMethod: value => { method = value; } });
    assert.equal(calls, 0);
    assert.equal(method.mode, "rules");
    assert.equal(method.fallback, true);
    assert.deepEqual(brief, buildWorkflowBrief(exampleInput));
  }
});

test("paid or unrecognized pricing blocks workflow inference", async () => {
  for (const pricing of [{ input: "0.001", output: "0" }, { input: "0", output: "0", request: "0.1" }, { input: "0" }]) {
    let calls = 0;
    let method;
    await generateWorkflowBrief(exampleInput, { interpretation: "jev", env, now, onMethod: value => { method = value; }, fetchFn: async url => {
      calls++;
      assert.ok(url.endsWith("/models"));
      return Response.json({ data: [{ id: "typesafe-ai/jev", pricing }] });
    } });
    assert.equal(calls, 1);
    assert.equal(method.mode, "rules");
    assert.equal(method.fallback, true);
  }
});

test("bad receipts, incomplete signals, and provider errors fall back without retrying or leaking details", async () => {
  for (const evaluate of [
    () => response({ providerMetadata: { gateway: { cost: "1", gatewayCost: "0", surchargeCost: "0" } } }),
    () => response({ providerMetadata: undefined }),
    () => response({ answers: {} }),
    () => response({ answers: { retrieval: { probability: 5 } } }),
    () => { throw new Error("private-provider-error"); },
  ]) {
    let calls = 0;
    let method;
    const brief = await generateWorkflowBrief(exampleInput, { interpretation: "jev", env, now, onMethod: value => { method = value; }, fetchFn: async url => {
      calls++;
      return url.endsWith("/models") ? Response.json(catalog) : evaluate();
    } });
    assert.equal(calls, 2);
    assert.equal(method.mode, "rules");
    assert.equal(method.fallback, true);
    assert.ok(!JSON.stringify({ brief, method }).includes("private-provider-error"));
  }
});

test("optional Jev timeout falls back to rules, while caller cancellation stays cancelled", async () => {
  const fetchFn = (_url, { signal }) => new Promise((_resolve, reject) => {
    signal.addEventListener("abort", () => reject(signal.reason), { once: true });
  });
  // Keep the test process alive while AbortSignal.timeout's unref timer runs.
  const keepAlive = setTimeout(() => {}, 1000);
  try {
    let method;
    const brief = await generateWorkflowBrief(exampleInput, { interpretation: "jev", env, now, fetchFn, timeoutMs: 5, onMethod: value => { method = value; } });
    assert.equal(method.fallback, true);
    assert.equal(workflowBriefSchema.safeParse(brief).success, true);
    const controller = new AbortController();
    const pending = generateWorkflowBrief(exampleInput, { interpretation: "jev", env, now, fetchFn, signal: controller.signal });
    controller.abort();
    await assert.rejects(pending, error => error instanceof WorkflowGenerationError && error.kind === "cancelled");
  } finally { clearTimeout(keepAlive); }
});

test("local scenario changes update steps, readiness, evaluation, and mandatory review", () => {
  const input = { ...exampleInput, stakes: "low", approval: "none" };
  const basic = buildWorkflowBrief(input, []);
  const classified = buildWorkflowBrief(input, ["documents", "retrieval", "classification", "actions"]);
  assert.ok(classified.steps.length > basic.steps.length);
  assert.notEqual(classified.recommendation.pattern, basic.recommendation.pattern);
  assert.notEqual(classified.evaluation[0].metric, basic.evaluation[0].metric);
  assert.equal(basic.readiness.find(item => item.area === "retrieval").status, "unknown");
  assert.equal(classified.readiness.find(item => item.area === "retrieval").status, "needs-work");
  assert.ok(!basic.steps.some(step => step.kind === "human"));
  const highStakes = buildWorkflowBrief({ ...input, stakes: "high" }, []);
  assert.ok(highStakes.steps.some(step => step.kind === "human"));
  assert.ok(highStakes.risks.length > basic.risks.length);
  assert.deepEqual(detectWorkflowSignals(exampleInput), detectWorkflowSignals(exampleInput));
});

test("default API exposes rules provenance and still rejects unknown request fields", async () => {
  const handler = createWorkflowHandler({ limiter: createInMemoryWorkflowLimiter({ maxRequests: 10 }) });
  const post = body => new Request("https://portfolio.example/api/workflow-readiness", { method: "POST", headers: { "content-type": "application/json", origin: "https://portfolio.example" }, body: JSON.stringify(body) });
  const result = await handler(post(exampleInput));
  assert.equal(result.status, 200);
  const payload = await result.json();
  assert.equal(payload.method.mode, "rules");
  assert.equal(workflowMethodSchema.safeParse(payload.method).success, true);
  assert.equal((await handler(post({ ...exampleInput, model: "paid-model" }))).status, 400);
});
