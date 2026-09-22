import test from "node:test";
import assert from "node:assert/strict";
import { createCareerFitHandler } from "./career-fit-handler.ts";
import { readCareerFitResponse } from "./career-fit-stream.mjs";
import { hasFreeJevPrice, jevConnection } from "./jev.ts";
import { capabilities, examples, buildRoleBrief } from "./career-fit.mjs";

const env = { CAREER_FIT_LIVE_ENABLED: "true", VENICE_API_KEY: "test-only-venice" };
const freeCatalog = { data: [{ id: "jev-latest", model_spec: { pricing: { input: { usd: 0 }, output: { usd: 0 } } } }] };
const answer = () => Response.json({ model: "jev-latest", answers: Object.fromEntries(capabilities.map(item => [item.id, { type: "noul", noul: item.id === "agents" ? .9 : .1 }])) });
const request = signal => new Request("https://portfolio.example/api/career-fit", { method: "POST", signal, headers: { "Content-Type": "application/json", Accept: "application/x-ndjson" }, body: JSON.stringify({ jobDescription: examples[0].description }) });
const makeHandler = options => createCareerFitHandler({ env, limiter: { acquire: () => ({ release() {} }) }, ...options });
const tick = () => new Promise(resolve => setImmediate(resolve));

test("Venice is the default; unavailable credentials never fall back to another provider", () => {
  assert.equal(jevConnection(env).provider, "venice");
  assert.equal(jevConnection({ AI_GATEWAY_API_KEY: "test-gateway" }), null);
  assert.equal(jevConnection({ ...env, CAREER_FIT_PROVIDER: "unknown" }), null);
});

test("Venice requires known zero input and output USD prices", () => {
  assert.equal(hasFreeJevPrice(freeCatalog, "venice"), true);
  for (const pricing of [undefined, {}, { input: { usd: null }, output: { usd: 0 } }, { input: { usd: "" }, output: { usd: 0 } }, { input: { usd: .042 }, output: { usd: 0 } }, { input: { usd: 0 }, output: { usd: .1 } }]) {
    assert.equal(hasFreeJevPrice({ data: [{ id: "jev-latest", model_spec: { pricing } }] }, "venice"), false);
  }
});

test("unknown charges or nonzero DIEM pricing never reach inference", async () => {
  for (const pricing of [
    { input: { usd: 0 }, output: { usd: 0 }, per_request: { usd: 1 } },
    { input: { usd: 0, extended: { usd: 1 } }, output: { usd: 0 } },
    { input: { usd: 0, diem: 1 }, output: { usd: 0, diem: 0 } },
  ]) {
    const handler = makeHandler({ fetcher: async url => {
      assert.ok(url.includes("/models?"), "inference must not start for unknown or paid pricing");
      return Response.json({ data: [{ id: "jev-latest", model_spec: { pricing } }] });
    } });
    assert.equal((await readCareerFitResponse(await handler(request()))).mode, "keyword");
  }
});

test("stream delivers real progress before Jev completes, then validated signals and evidence", async () => {
  let finishEvaluation, sent, released = 0;
  const pendingEvaluation = new Promise(resolve => { finishEvaluation = resolve; });
  const handler = makeHandler({ limiter: { acquire: () => ({ release() { released++; } }) }, fetcher: async (url, init) => {
    assert.equal(init.headers.Authorization, "Bearer test-only-venice");
    if (url.includes("/models?type=decision")) { assert.equal(init.body, undefined); return Response.json(freeCatalog); }
    assert.equal(url, "https://api.venice.ai/api/v1/decisions");
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
  assert.equal(sent.model, "jev-latest");
  assert.ok(Object.values(sent.questions).every(item => item.type === "noul"));
  assert.equal(Object.keys(sent.questions).length, capabilities.length);
  finishEvaluation(answer());
  const result = await resultPromise;
  await tick();
  assert.deepEqual(stages, ["checking", "interpreting", "matching"]);
  assert.equal(result.mode, "jev");
  assert.equal(result.analysis.provider, "venice");
  assert.equal(result.analysis.signals.length, capabilities.length);
  assert.ok(result.evidence.every(item => item.overlap.includes("agents")));
  assert.equal(released, 1);
  assert.ok(!JSON.stringify(result).includes(env.VENICE_API_KEY));
});

test("paid catalog produces an explicit keyword preview and never calls inference", async () => {
  let calls = 0;
  const handler = makeHandler({ fetcher: async url => {
    assert.ok(url.includes("/models?type=decision")); calls++;
    return Response.json({ data: [{ id: "jev-latest", model_spec: { pricing: { input: { usd: .042 }, output: { usd: 0 } } } }] });
  } });
  const result = await readCareerFitResponse(await handler(request()));
  assert.equal(result.mode, "keyword"); assert.equal(result.analysis, undefined); assert.equal(calls, 1);
});

test("provider and schema errors terminate the stream without leaking upstream details", async () => {
  for (const failed of [() => new Response("private-provider-detail", { status: 402 }), () => Response.json({ answers: {} }), () => Response.json({ answers: { agents: { noul: 5 } } })]) {
    let released = 0;
    const handler = makeHandler({ limiter: { acquire: () => ({ release() { released++; } }) }, fetcher: async url => url.includes("/models?") ? Response.json(freeCatalog) : failed() });
    await assert.rejects(readCareerFitResponse(await handler(request())), error => /Live Jev is unavailable/.test(error.message) && !error.message.includes("private-provider-detail"));
    await tick(); assert.equal(released, 1);
  }
});

test("cancelling the stream aborts the provider and releases its concurrency lease", async () => {
  let released = 0, providerSignal;
  const handler = makeHandler({ limiter: { acquire: () => ({ release() { released++; } }) }, fetcher: async (url, init) => {
    if (url.includes("/models?")) return Response.json(freeCatalog);
    providerSignal = init.signal;
    return new Promise((resolve, reject) => init.signal.addEventListener("abort", () => reject(init.signal.reason), { once: true }));
  } });
  const response = await handler(request());
  await tick();
  await response.body.cancel();
  await tick();
  assert.equal(providerSignal.aborted, true); assert.equal(released, 1);
});

for (const at of ["catalog", "inference"]) for (const cause of ["timeout", "disconnect"]) test(`${cause} while reading ${at} body terminates safely and releases the lease`, async () => {
  const disconnect = new AbortController();
  let released = 0, providerSignal, inferenceCalls = 0;
  const handler = makeHandler({ timeoutMs: cause === "timeout" ? 15 : 1000, limiter: { acquire: () => ({ release() { released++; } }) }, fetcher: async (url, init) => {
    const catalog = url.includes("/models?");
    if (!catalog) inferenceCalls++;
    if (catalog && at === "inference") return Response.json(freeCatalog);
    providerSignal = init.signal;
    return new Response(new ReadableStream({ start(controller) { init.signal.addEventListener("abort", () => controller.error(init.signal.reason), { once: true }); } }));
  } });
  // AbortSignal.timeout timers are unref'ed; keep the test process alive.
  const keepAlive = setTimeout(() => {}, 2000);
  try {
    const result = readCareerFitResponse(await handler(request(disconnect.signal)));
    if (cause === "disconnect") { await tick(); disconnect.abort(); }
    await assert.rejects(result, /Live Jev is unavailable/);
    await tick();
    assert.equal(providerSignal.aborted, true); assert.equal(released, 1);
    if (at === "catalog") assert.equal(inferenceCalls, 0);
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
  for (const brief of [{ mode: "jev" }, { ...buildRoleBrief([]), evidence: [{}] }, { ...buildRoleBrief([]), mode: "jev", analysis: { provider: "venice", durationMs: 5, signals: [{ id: "agents", label: "AI agents", probability: 2 }] } }]) {
    await assert.rejects(readCareerFitResponse(Response.json(brief)), /incomplete/);
    const response = new Response(JSON.stringify({ type: "result", brief }), { headers: { "Content-Type": "application/x-ndjson" } });
    await assert.rejects(readCareerFitResponse(response), /incomplete/);
  }
});
