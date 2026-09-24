import test from "node:test";
import assert from "node:assert/strict";
import { knowledge, searchKnowledge, getKnowledge, relatedKnowledge } from "./knowledge.mjs";
import { excerptFor, rankKnowledge } from "./knowledge-search.mjs";
import { validateKnowledge } from "./knowledge-schema.mjs";
import { GET } from "../app/api/knowledge/route.js";

test("the complete corpus is public, uniquely identified, and has resolvable relationships", () => {
  assert.equal(validateKnowledge(knowledge).length, knowledge.length);
  assert.equal(knowledge.filter(record => record.kind === "project").length, 7);
});
test("private records, extra fields, unsafe URLs, secrets and dangling evidence cannot publish", () => {
  const record = { ...knowledge[0], relations: [] };
  for (const invalid of [
    { ...record, status: "draft" }, { ...record, privateNotes: "internal" },
    { ...record, source: { ...record.source, url: "javascript:alert(1)" } },
    { ...record, source: { ...record.source, url: "//example.com" } },
    { ...record, relations: [{ type: "derived-from", target: "missing" }] },
    { ...record, body: "-----BEGIN RSA PRIVATE KEY-----" },
  ]) assert.throws(() => validateKnowledge([invalid]));
  assert.throws(() => validateKnowledge([record, record]));
});
test("real visitor questions retrieve relevant source-backed evidence", () => {
  const banking = searchKnowledge({ query: "bank account linking encrypted tokens", limit: 5 });
  assert.ok(banking.some(result => result.record.id === "project-bank-connections"));
  const permission = searchKnowledge({ query: "revoke permissions authorization", limit: 8 });
  assert.ok(permission.some(result => /permissions|lois|state/.test(result.record.id)));
  assert.ok(permission.every(result => result.record.source.url && result.excerpt));
  assert.deepEqual(searchKnowledge({ query: "zxqvplm" }), []);
  for (const query of ["x", "the", "!!!"]) assert.deepEqual(searchKnowledge({ query }), []);
  assert.ok(searchKnowledge({ query: " " }).length > 0);
});
test("filters, bounded limits, unknown IDs, and actual graph neighbors behave consistently", () => {
  assert.ok(searchKnowledge({ topic: "fintech", kind: "project" }).every(result => result.record.topics.includes("fintech") && result.record.kind === "project"));
  assert.equal(searchKnowledge({ limit: 10000 }).length, 30);
  assert.equal(getKnowledge("private-note"), null);
  assert.deepEqual(relatedKnowledge("missing"), []);
  assert.ok(relatedKnowledge("note-own-context").some(record => record.id === "publication-ai-engineering"));
});
test("semantic matches supplement exact search without exposing nonpublic records", () => {
  const record = knowledge.find(r => r.id === "note-own-context");
  const privateRecord = { ...record, id: "hidden", status: "draft" };
  const hits = rankKnowledge([record, privateRecord], { query: "unseen synonym", semanticScores: { [record.id]: .72, hidden: 1 } });
  assert.equal(hits.length, 1); assert.equal(hits[0].match, "semantic");
  assert.equal(rankKnowledge([record], { query: "unseen synonym", semanticScores: { [record.id]: .1 } }).length, 0);
});
test("conversational filler does not outrank access controls and excerpts retain context", () => {
  const hits = searchKnowledge({ query: "How do I keep a bot from overstepping its access?", limit: 3 });
  assert.ok(hits.some(hit => /lois|permissions/.test(hit.record.id)));
  const record = knowledge.find(item => item.id.endsWith("what-happens-when-something-breaks"));
  const passage = excerptFor(record, "lacks access");
  assert.match(passage, /Identity verification can succeed while authorization fails/);
  assert.match(passage, /should never be treated as a synonym/);
  assert.ok(passage.length <= 440);
});
test("public API returns citations and rejects invalid query bounds", async () => {
  const response = GET(new Request("https://example.test/api/knowledge?q=banking&limit=2"));
  assert.equal(response.status, 200);
  const body = await response.json(); assert.ok(body.revision); assert.equal(body.results.length, 2); assert.ok(body.results[0].record.source.revision);
  for (const query of ["limit=1000", "kind=private", "topic=unknown", `q=${"a".repeat(501)}`, "id=../secret"]) assert.equal(GET(new Request(`https://example.test/api/knowledge?${query}`)).status, 400);
  assert.equal(GET(new Request("https://example.test/api/knowledge?id=unknown")).status, 404);
});
