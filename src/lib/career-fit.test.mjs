import test from "node:test";
import assert from "node:assert/strict";
import resume from "../content/resume.json" with { type: "json" };
import { capabilities, catalogCoverage, EVIDENCE_LIMIT, evidence, examples, buildRoleBrief, keywordCapabilities } from "./career-fit.mjs";
import { curatedArticles } from "../data/writingCatalog.ts";
import { createCareerFitHandler } from "./career-fit-handler.ts";
import { createInMemoryWorkflowLimiter } from "./workflow/handler.ts";

const request = (body = { jobDescription: examples[0].description }, headers = {}) => new Request("https://portfolio.example/api/career-fit", { method: "POST", headers: { "Content-Type": "application/json", ...headers }, body: typeof body === "string" ? body : JSON.stringify(body) });
const makeHandler = (options = {}) => createCareerFitHandler({ env: {}, limiter: createInMemoryWorkflowLimiter({ maxRequests: 100 }), ...options });
const liveEnv = { OPENROUTER_API_KEY: "test-only", CAREER_FIT_LIVE_ENABLED: "true" };
const answers = probability => Object.fromEntries(capabilities.map(item => [item.id, { noul: probability(item.id) }]));

test("every source is verbatim public content, never text generated from the role", () => {
  const facts = resume.roles.flatMap(role => Object.values(role.bullets));
  const catalog = curatedArticles.map(item => item.description);
  for (const item of evidence) {
    // A claim is either a résumé bullet or an existing catalog description, copied
    // whole. The analysis may choose among these; it can never author one.
    assert.ok(facts.includes(item.claim) || catalog.includes(item.claim), `not verbatim public content: ${item.id}`);
    assert.ok(/^\/[a-z]/i.test(item.href) || /^https:\/\//.test(item.href), `unresolvable source: ${item.id}`);
    assert.ok(item.capabilities.length > 0 && item.capabilities.every(id => capabilities.some(capability => capability.id === id)));
  }
});

test("the source pool spans repositories and papers, not only résumé roles", () => {
  const hosts = new Set(evidence.map(item => new URL(item.href, "https://ashwinrachha.vercel.app").host));
  for (const host of ["github.com", "ieeexplore.ieee.org"]) assert.ok(hosts.has(host), `missing ${host}`);
});

test("published-work tagging is deliberate and cannot silently drift", () => {
  const ids = new Set(curatedArticles.map(item => item.id));
  const live = new Set(evidence.map(item => item.id));
  // Every tag entry must point at a real catalog item and actually make it into the pool.
  for (const id of catalogCoverage) assert.ok(ids.has(id) && live.has(`published:${id}`), `stale or unused catalog tag: ${id}`);
});

test("unrelated and unsupported requirements never fabricate evidence", () => {
  assert.deepEqual(buildRoleBrief([]).evidence, []);
  assert.deepEqual(buildRoleBrief(["management", "growth"]).evidence, []);
  assert.equal(buildRoleBrief(["management", "growth"]).gaps.length, 2);
  assert.equal(buildRoleBrief(["invented-capability"]).capabilities.length, 0);
});

for (const [text, included, excluded] of [
  ["Agentic workflow engineer with LangGraph", "agents", "ml"],
  ["Own retrieval and RAG systems", "retrieval", "management"],
  ["Backend APIs and integrations", "backend", "growth"],
  ["OAuth webhooks in financial software", "integrations", "design"],
  ["Founding product engineer", "product", "management"],
  ["Tenant authorization and access control", "permissions", "growth"],
  ["Banking reconciliation and underwriting", "fintech", "ml"],
  ["MLops and inference with Triton", "ml", "agents"],
  ["Technical lead and mentoring", "leadership", "management"],
  ["Product design with Figma", "design", "fintech"],
  ["Sales, marketing and conversion", "growth", "backend"],
  ["People management with direct reports", "management", "leadership"],
]) test(`keyword evaluation: ${text}`, () => { const ids = keywordCapabilities(text); assert.ok(ids.includes(included)); assert.ok(!ids.includes(excluded)); });

test("selection narrows a large pool and never pads it", () => {
  for (const ids of [["agents"], ["fintech"], ["retrieval"], ["backend"], ["product"]]) {
    const result = buildRoleBrief(ids);
    assert.ok(result.evidence.length > 0 && result.evidence.length <= EVIDENCE_LIMIT, `${ids} returned ${result.evidence.length}`);
    assert.ok(result.evidence.every(item => item.overlap.includes(ids[0])), `${ids} surfaced an unrelated source`);
  }
  // Ranked strongest-overlap-first, so the best match is never crowded out.
  const ranked = buildRoleBrief(["agents", "permissions", "integrations"]).evidence;
  for (let i = 1; i < ranked.length; i += 1) assert.ok(ranked[i - 1].overlap.length >= ranked[i].overlap.length);
  assert.deepEqual(buildRoleBrief(["agents", "agents"]), buildRoleBrief(["agents"]));
});

test("a broad role draws on the whole catalog, not just résumé roles", () => {
  const mixed = buildRoleBrief(["agents", "permissions", "retrieval", "backend", "fintech", "product", "ml"]);
  assert.equal(mixed.catalog, evidence.length);
  assert.ok(mixed.evidence.filter(item => item.external).length >= 2, "a broad role should surface published work");
});

test("unconfigured provider uses explicitly labeled keyword mode without a network call", async () => {
  const response = await makeHandler({ fetcher: () => { throw new Error("Must not call provider"); } })(request());
  assert.equal(response.status, 200); assert.equal(response.headers.get("cache-control"), "no-store");
  assert.equal((await response.json()).mode, "keyword");
});

test("invalid, oversized, cross-origin and secret-bearing requests are rejected", async () => {
  const handler = makeHandler();
  for (const body of ["{", { jobDescription: "short" }, { jobDescription: "x".repeat(8001) }, { jobDescription: examples[0].description, model: "attacker" }]) assert.equal((await handler(request(body))).status, 400);
  assert.equal((await handler(request("x".repeat(36001)))).status, 413);
  assert.equal((await handler(request(undefined, { Origin: "https://elsewhere.example" }))).status, 403);
  assert.equal((await handler(request(undefined, { "Content-Type": "text/plain" }))).status, 415);
  assert.equal((await handler(request({ jobDescription: examples[0].description, jobTitle: "sk-" + "x".repeat(30) }))).status, 400);
});

test("rate limits return a recoverable public error", async () => {
  const handler = makeHandler({ limiter: createInMemoryWorkflowLimiter({ maxRequests: 1 }) });
  assert.equal((await handler(request())).status, 200);
  assert.equal((await handler(request())).status, 429);
});

test("live mode requires both the OpenRouter key and the explicit live flag", async () => {
  const forbidden = () => { throw new Error("Must not call provider"); };
  for (const env of [{ OPENROUTER_API_KEY: "test-only" }, { CAREER_FIT_LIVE_ENABLED: "true" }, { CAREER_FIT_LIVE_ENABLED: "true", OPENROUTER_API_KEY: "" }]) {
    assert.equal((await (await makeHandler({ env, fetcher: forbidden })(request())).json()).mode, "keyword");
  }
});

test("Jev receives only fixed questions; no generated claim or URL reaches the brief", async () => {
  let outgoing;
  const handler = makeHandler({ env: liveEnv, fetcher: async (url, init) => {
    assert.equal(url, "https://openrouter.ai/api/alpha/decisions");
    assert.equal(init.headers.Authorization, "Bearer test-only");
    outgoing = JSON.parse(init.body);
    return Response.json({ model: "typesafe/jev-1.13-20260917", usage: { cost: 0.00012 }, answers: answers(id => id === "agents" ? .9 : .1), claim: "Invented accomplishment", href: "https://attacker.example" });
  } });
  const result = await (await handler(request())).json();
  assert.equal(result.mode, "jev"); assert.equal(outgoing.model, "typesafe/jev-1.13");
  assert.ok(Object.values(outgoing.questions).every(item => item.type === "noul"));
  assert.equal(Object.keys(outgoing.questions).length, capabilities.length);
  assert.equal(result.capabilities.length, 1); assert.equal(result.capabilities[0].id, "agents");
  assert.equal(result.analysis.provider, "openrouter"); assert.equal(result.analysis.model, "Jev 1.13");
  assert.equal(result.analysis.signals.length, capabilities.length);
  assert.ok(!JSON.stringify(result).includes("Invented accomplishment"));
  assert.ok(!JSON.stringify(outgoing).includes(resume.email));
});

test("live analysis reports the provider's own metered cost, never a hardcoded constant", async () => {
  for (const [usage, expected] of [[{ cost: "0.000198" }, 0.000198], [{ cost: 0.00012 }, 0.00012], [undefined, null]]) {
    const handler = makeHandler({ env: liveEnv, fetcher: async () => Response.json({ usage, answers: answers(() => .9) }) });
    assert.equal((await (await handler(request())).json()).analysis.costUsd, expected);
  }
});

test("provider failures, missing answers and invalid probabilities fail closed and release the lease", async () => {
  for (const evaluate of [async () => { throw new Error("secret-provider-detail"); }, async () => new Response("private upstream error", { status: 500 }), async () => Response.json({ answers: {} }), async () => Response.json({ answers: { agents: { noul: 4 } } })]) {
    let released = 0;
    const handler = makeHandler({ env: liveEnv, fetcher: evaluate, limiter: { acquire: () => ({ release: () => released++ }) } });
    const response = await handler(request());
    assert.equal(response.status, 503); assert.equal(released, 1);
    assert.ok(!(await response.text()).includes("secret-provider-detail"));
  }
});
