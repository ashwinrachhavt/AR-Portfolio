import assert from "node:assert/strict";
import { test } from "node:test";
import { createServer } from "node:http";
import { once } from "node:events";
import { createLocalOnlyFetch, getLocalModelConfig } from "./eve-local-config.mjs";
import { getPublicExperience, getPublicMetrics, getPublicProfile } from "../../agent/lib/public-profile.ts";
import resume from "../content/resume.json" with { type: "json" };

test("inference is opt-in and ignores metered provider environment settings", () => {
  const config = getLocalModelConfig({ OPENAI_API_KEY: "never-use-this", OPENAI_BASE_URL: "https://example.com/v1", AI_GATEWAY_API_KEY: "never-use-this" });
  assert.equal(config.enabled, false);
  assert.equal(config.baseURL, "http://127.0.0.1:11434/v1");
  assert.equal(config.model, "portfolio-qwen3.5:4b");
});

test("non-loopback URLs, ambiguous endpoints, and cloud models fail closed", () => {
  for (const EVE_OLLAMA_BASE_URL of [
    "https://api.openai.com/v1", "https://ollama.com/v1", "http://192.168.1.2:11434/v1",
    "http://localhost.example.com/v1", "http://127.0.0.1@evil.example/v1",
    "http://user:password@localhost:11434/v1", "file:///v1", "http://localhost:11434/api",
    "http://localhost:11434/v1?redirect=remote", "http://localhost:11434/v1#remote",
  ]) assert.throws(() => getLocalModelConfig({ EVE_OLLAMA_BASE_URL }));
  for (const EVE_OLLAMA_MODEL of ["qwen3:cloud", "gpt-4.1-mini", "openai/gpt-5", "unreviewed-local"]) {
    assert.throws(() => getLocalModelConfig({ EVE_OLLAMA_MODEL }));
  }
  assert.equal(getLocalModelConfig({ EVE_OLLAMA_BASE_URL: "http://localhost:11434/v1/" }).baseURL, "http://127.0.0.1:11434/v1");
  assert.equal(getLocalModelConfig({ EVE_OLLAMA_BASE_URL: "http://[::1]:11434/v1" }).baseURL, "http://[::1]:11434/v1");
});

test("disabled inference never calls fetch", async () => {
  let requests = 0;
  const localFetch = createLocalOnlyFetch(getLocalModelConfig({}), async () => { requests++; });
  await assert.rejects(localFetch("http://127.0.0.1:11434/v1/chat/completions", { method: "POST", body: "{}" }), /disabled/);
  assert.equal(requests, 0);
});

test("guarded transport strips credentials and rejects alternate routes", async () => {
  const config = getLocalModelConfig({ EVE_LOCAL_ENABLED: "1" });
  let requests = 0;
  const localFetch = createLocalOnlyFetch(config, async (request) => {
    requests++;
    assert.equal(request.url, `${config.baseURL}/chat/completions`);
    assert.equal(request.redirect, "error");
    assert.equal(request.headers.has("authorization"), false);
    assert.equal(request.headers.has("openai-project"), false);
    assert.deepEqual(await request.json(), { messages: [] });
    return Response.json({ ok: true });
  });
  const init = { method: "POST", headers: { authorization: "secret", "openai-project": "secret" }, body: JSON.stringify({ messages: [] }) };
  await localFetch(`${config.baseURL}/chat/completions`, init);
  await assert.rejects(localFetch("https://example.com/v1/chat/completions", init), /Only the configured local/);
  await assert.rejects(localFetch(`${config.baseURL}/responses`, init), /Only the configured local/);
  await assert.rejects(localFetch(`${config.baseURL}/chat/completions`), /Only the configured local/);
  assert.equal(requests, 1);
});

test("real HTTP redirects are rejected before reaching their destination", async (t) => {
  let redirectedRequests = 0;
  const server = createServer((request, response) => {
    if (request.url === "/v1/chat/completions") {
      response.writeHead(307, { location: "/redirected" }).end();
    } else {
      redirectedRequests++;
      response.end("unexpected");
    }
  });
  server.listen(0, "127.0.0.1");
  await once(server, "listening");
  t.after(() => new Promise((resolve) => { server.closeAllConnections(); server.close(resolve); }));
  const config = getLocalModelConfig({ EVE_LOCAL_ENABLED: "1", EVE_OLLAMA_BASE_URL: `http://127.0.0.1:${server.address().port}/v1` });
  await assert.rejects(createLocalOnlyFetch(config)(`${config.baseURL}/chat/completions`, { method: "POST", body: "{}" }));
  assert.equal(redirectedRequests, 0);
});

test("agent profile and experience contain canonical public facts only", () => {
  const profile = getPublicProfile();
  assert.equal(profile.name, resume.name);
  assert.deepEqual(profile.education, resume.education);
  assert.equal(profile.asOf, resume.asOf);
  assert.deepEqual(getPublicExperience("unknown company"), []);
  assert.equal(getPublicExperience("Loan Labs")[0].dates, resume.roles[0].dates);
  assert.doesNotMatch(JSON.stringify([profile, getPublicExperience(), getPublicMetrics()]), /workAuthorization|H-1B|recruiter|wind-down|October 7|\$15M|\$1\.2M|50% reduction/);
});

test("metric evidence preserves complete approved resume wording", () => {
  const role = resume.roles.find(({ id }) => id === "finally");
  const metrics = getPublicMetrics();
  assert.equal(metrics.length, 3);
  for (const { evidence, source, asOf } of metrics) {
    const key = source.split("/").at(-1);
    assert.equal(evidence, role.bullets[key]);
    assert.equal(asOf, resume.asOf);
  }
});
