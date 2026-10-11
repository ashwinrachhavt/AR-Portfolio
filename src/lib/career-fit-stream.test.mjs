import test from "node:test";
import assert from "node:assert/strict";
import { createCareerFitHandler } from "./career-fit-handler.ts";
import { readCareerFitResponse } from "./career-fit-stream.mjs";
import { jevConnection } from "./jev.ts";
import { capabilities, examples, buildRoleBrief } from "./career-fit.mjs";

const env = { CAREER_FIT_LIVE_ENABLED: "true", OPENROUTER_API_KEY: "test-only-openrouter" };
const answer = () => Response.json({ model: "typesafe/jev-1.13-20260917", usage: { cost: 0.00012 }, answers: Object.fromEntries(capabilities.map(item => [item.id, { type: "noul", noul: item.id === "agents" ? .9 : .1 }])) });
const request = signal => new Request("https://portfolio.example/api/career-fit", { method: "POST", signal, headers: { "Content-Type": "application/json", Accept: "application/x-ndjson" }, body: JSON.stringify({ jobDescription: examples[0].description }) });
const makeHandler = options => createCareerFitHandler({ env, limiter: { acquire: () => ({ release() {} }) }, ...options });
const tick = () => new Promise(resolve => setImmediate(resolve));
const DECISIONS = "https://openrouter.ai/api/alpha/decisions";

test("OpenRouter is the only provider; credentials alone never enable live analysis", () => {
  assert.equal(jevConnection(env).provider, "openrouter");
  assert.equal(jevConnection(env).model, "typesafe/jev-1.13");
  assert.equal(jevConnection({ OPENROUTER_API_KEY: "test-only" }), null);
  assert.equal(jevConnection({ CAREER_FIT_LIVE_ENABLED: "true" }), null);
});

test("stream delivers real progress before the decision model completes, then validated signals and evidence", async () => {
  let finishEvaluation, sent, released = 0;
  const pendingEvaluation = new Promise(resolve => { finishEvaluation = resolve; });
  const handler = makeHandler({ limiter: { acquire: () => ({ release() { released++; } }) }, fetcher: async (url, init) => {
    assert.equal(url, DECISIONS);
    assert.equal(init.headers.Authorization, "Bearer test-only-openrouter");
    sent = JSON.parse(init.body);
    return pendingEvaluation;
  } });
  const response = await handler(request());
  assert.match(response.headers.get("content-type"), /ndjson/);
  const stages = [];
  const resultPromise = readCareerFitResponse(response, stage => stages.push(stage));
  await tick();
  assert.deepEqual(stages, ["checking", "interpreting"]);
  assert.equal(released, 0);
  assert.equal(sent.model, "typesafe/jev-1.13");
  assert.ok(Object.values(sent.questions).every(item => item.type === "noul"));
  assert.equal(Object.keys(sent.questions).length, capabilities.length);
  finishEvaluation(answer());
  const result = await resultPromise;
  await tick();
  assert.deepEqual(stages, ["checking", "interpreting", "matching"]);
  assert.equal(result.mode, "jev");
  assert.equal(result.analysis.provider, "openrouter");
  assert.equal(result.analysis.signals.length, capabilities.length);
  assert.ok(result.evidence.every(item => item.overlap.includes("agents")));
  assert.equal(released, 1);
  assert.ok(!JSON.stringify(result).includes(env.OPENROUTER_API_KEY));
});

test("provider and schema errors terminate the stream without leaking upstream details", async () => {
  for (const failed of [() => new Response("private-provider-detail", { status: 402 }), () => Response.json({ answers: {} }), () => Response.json({ answers: { agents: { noul: 5 } } })]) {
    let released = 0;
    const handler = makeHandler({ limiter: { acquire: () => ({ release() { released++; } }) }, fetcher: async () => failed() });
    await assert.rejects(readCareerFitResponse(await handler(request())), error => /Live analysis is unavailable/.test(error.message) && !error.message.includes("private-provider-detail"));
    await tick(); assert.equal(released, 1);
  }
});

test("cancelling the stream aborts the provider and releases its concurrency lease", async () => {
  let released = 0, providerSignal;
  const handler = makeHandler({ limiter: { acquire: () => ({ release() { released++; } }) }, fetcher: async (url, init) => {
    providerSignal = init.signal;
    return new Promise((resolve, reject) => init.signal.addEventListener("abort", () => reject(init.signal.reason), { once: true }));
  } });
  const response = await handler(request());
  await tick();
  await response.body.cancel();
  await tick();
  assert.equal(providerSignal.aborted, true); assert.equal(released, 1);
});

for (const cause of ["timeout", "disconnect"]) test(`${cause} while reading the decision response terminates safely and releases the lease`, async () => {
  const disconnect = new AbortController();
  let released = 0, providerSignal;
  const handler = makeHandler({ timeoutMs: cause === "timeout" ? 15 : 1000, limiter: { acquire: () => ({ release() { released++; } }) }, fetcher: async (url, init) => {
    providerSignal = init.signal;
    return new Response(new ReadableStream({ start(controller) { init.signal.addEventListener("abort", () => controller.error(init.signal.reason), { once: true }); } }));
  } });
  // AbortSignal.timeout timers are unref'ed; keep the test process alive.
  const keepAlive = setTimeout(() => {}, 2000);
  try {
    const result = readCareerFitResponse(await handler(request(disconnect.signal)));
    if (cause === "disconnect") { await tick(); disconnect.abort(); }
    await assert.rejects(result, /Live analysis is unavailable/);
    await tick();
    assert.equal(providerSignal.aborted, true); assert.equal(released, 1);
  } finally { clearTimeout(keepAlive); }
});

test("stream reader handles fragmented UTF-8 and events without a final newline", async () => {
  const bytes = new TextEncoder().encode(JSON.stringify({ type: "status", stage: "interpreting" }) + "\n" + JSON.stringify({ type: "result", brief: { ...buildRoleBrief([]), text: "Jev → evidence" } }));
  const response = new Response(new ReadableStream({ start(controller) { for (const byte of bytes) controller.enqueue(Uint8Array.of(byte)); controller.close(); } }), { headers: { "Content-Type": "application/x-ndjson" } });
  const stages = [];
  assert.equal((await readCareerFitResponse(response, stage => stages.push(stage))).text, "Jev → evidence");
  assert.deepEqual(stages, ["interpreting"]);
});

test("stream reader rejects missing results, malformed data and oversized responses", async () => {
  for (const body of [JSON.stringify({ type: "status", stage: "matching" }) + "\n", "not-json\n", "x".repeat(128001)]) {
    await assert.rejects(readCareerFitResponse(new Response(body, { headers: { "Content-Type": "application/x-ndjson" } })));
  }
});

test("stream reader also handles pre-stream validation errors and JSON clients", async () => {
  await assert.rejects(readCareerFitResponse(Response.json({ error: "Please try again later." }, { status: 429 })), /Please try again later/);
  assert.equal((await readCareerFitResponse(Response.json(buildRoleBrief([])))).mode, "keyword");
});

test("incomplete results become recoverable errors rather than crashing the UI", async () => {
  for (const brief of [{ mode: "jev" }, { ...buildRoleBrief([]), evidence: [{}] }, { ...buildRoleBrief([]), mode: "jev", analysis: { provider: "openrouter", durationMs: 5, costUsd: null, signals: [{ id: "agents", label: "AI agents", probability: 2 }] } }]) {
    await assert.rejects(readCareerFitResponse(Response.json(brief)), /incomplete/);
    const response = new Response(JSON.stringify({ type: "result", brief }), { headers: { "Content-Type": "application/x-ndjson" } });
    await assert.rejects(readCareerFitResponse(response), /incomplete/);
  }
});
