import test from "node:test";
import assert from "node:assert/strict";
import resume from "../content/resume.json" with { type: "json" };
import { capabilities, evidence, examples, buildRoleBrief, keywordCapabilities } from "./career-fit.mjs";
import { createCareerFitHandler, hasFreeJevPrice, JEV_FREE_ACCESS_END } from "./career-fit-handler.ts";
import { createInMemoryWorkflowLimiter } from "./workflow/handler.ts";

const request = (body = { jobDescription: examples[0].description }, headers = {}) => new Request("https://portfolio.example/api/career-fit", { method: "POST", headers: { "Content-Type": "application/json", ...headers }, body: typeof body === "string" ? body : JSON.stringify(body) });
const makeHandler = (options = {}) => createCareerFitHandler({ env: {}, limiter: createInMemoryWorkflowLimiter({ maxRequests: 100 }), ...options });
const freeCatalog = { data: [{ id: "typesafe-ai/jev", pricing: { input: "0", output: "0" } }] };
const liveEnv = { AI_GATEWAY_API_KEY: "test-only", CAREER_FIT_PROVIDER: "vercel", CAREER_FIT_LIVE_ENABLED: "true" };
const duringPromo = () => Date.parse("2026-09-22T00:00:00Z");

test("every evidence claim is a verbatim public resume fact with a source", () => {
  const claims = resume.roles.flatMap(role => Object.values(role.bullets));
  assert.equal(new Set(evidence.map(item => item.id)).size, evidence.length);
  for (const item of evidence) { assert.ok(claims.includes(item.claim)); assert.match(item.href, /^\/work\/[a-z-]+$/); }
});

test("unrelated and unsupported requirements never fabricate evidence", () => {
  assert.deepEqual(buildRoleBrief([]).evidence, []);
  assert.deepEqual(buildRoleBrief(["management", "growth", "design"]).evidence, []);
  assert.equal(buildRoleBrief(["management", "growth", "design"]).gaps.length, 3);
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

test("retrieval excludes zero-overlap evidence and caps results deterministically", () => {
  const result = buildRoleBrief(["agents"]);
  assert.ok(result.evidence.length > 0 && result.evidence.length <= 3);
  assert.ok(result.evidence.every(item => item.overlap.includes("agents")));
  assert.deepEqual(result, buildRoleBrief(["agents", "agents"]));
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

test("Jev receives only fixed questions; no generated claim or URL reaches the brief", async () => {
  let outgoing;
  const handler = makeHandler({ env: liveEnv, now: duringPromo, fetcher: async (url, init) => {
    if (url.endsWith("/models")) { assert.equal(init.body, undefined); return Response.json(freeCatalog); }
    assert.equal(url, "https://ai-gateway.vercel.sh/v1/evaluate"); outgoing = JSON.parse(init.body);
    return Response.json({ answers: Object.fromEntries(capabilities.map(item => [item.id, { probability: item.id === "agents" ? .9 : .1 }])), claim: "Invented accomplishment", href: "https://attacker.example" });
  } });
  const response = await handler(request()); const result = await response.json();
  assert.equal(result.mode, "jev"); assert.equal(outgoing.model, "typesafe-ai/jev");
  assert.equal(Object.keys(outgoing.questions).length, capabilities.length);
  assert.equal(result.capabilities.length, 1); assert.equal(result.capabilities[0].id, "agents");
  assert.ok(!JSON.stringify(result).includes("Invented accomplishment"));
  assert.ok(!JSON.stringify(outgoing).includes(resume.email));
});

test("provider failures, missing answers and invalid probabilities fail closed and release the lease", async () => {
  for (const evaluate of [async () => { throw new Error("secret-provider-detail"); }, async () => new Response("private upstream error", { status: 500 }), async () => Response.json({ answers: {} }), async () => Response.json({ answers: { agents: { probability: 4 } } })]) {
    let released = 0;
    const handler = makeHandler({ env: liveEnv, now: duringPromo, fetcher: async url => url.endsWith("/models") ? Response.json(freeCatalog) : evaluate(), limiter: { acquire: () => ({ release: () => released++ }) } });
    const response = await handler(request());
    assert.equal(response.status, 503); assert.equal(released, 1);
    assert.ok(!(await response.text()).includes("secret-provider-detail"));
  }
});

test("free access never treats missing prices, paid input, account credit or additional pricing as free", () => {
  assert.equal(hasFreeJevPrice(freeCatalog), true);
  for (const pricing of [undefined, {}, { input: null, output: "0" }, { input: "", output: "0" }, { input: "0.000000042", output: "0" }, { input: "0", output: "0", input_tiers: [{ cost: "1" }] }]) {
    assert.equal(hasFreeJevPrice({ data: [{ id: "typesafe-ai/jev", pricing }] }), false);
  }
});

test("paid or unavailable catalog and expired promotion never invoke evaluation", async () => {
  for (const catalog of [async () => Response.json({ data: [] }), async () => Response.json({ data: [{ id: "typesafe-ai/jev", pricing: { input: "0.000000042", output: "0" } }] }), async () => new Response("unavailable", { status: 503 }), async () => { throw new Error("offline"); }]) {
    const handler = makeHandler({ env: liveEnv, now: duringPromo, fetcher: async url => { assert.ok(url.endsWith("/models")); return catalog(); } });
    assert.equal((await (await handler(request())).json()).mode, "keyword");
  }
  const expired = makeHandler({ env: liveEnv, now: () => JEV_FREE_ACCESS_END, fetcher: () => { throw new Error("Network forbidden after promotion"); } });
  assert.equal((await (await expired(request())).json()).mode, "keyword");
});

test("Vercel OIDC can authenticate zero-priced Jev without a separate API key", async () => {
  const handler = makeHandler({ env: { VERCEL_OIDC_TOKEN: "test-oidc", CAREER_FIT_PROVIDER: "vercel", CAREER_FIT_LIVE_ENABLED: "true" }, now: duringPromo, fetcher: async (url, init) => {
    if (url.endsWith("/models")) return Response.json(freeCatalog);
    assert.equal(init.headers.Authorization, "Bearer test-oidc");
    return Response.json({ answers: Object.fromEntries(capabilities.map(item => [item.id, { probability: .1 }])) });
  } });
  assert.equal((await (await handler(request())).json()).mode, "jev");
});
