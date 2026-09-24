import assert from "node:assert/strict";
import { test } from "node:test";
import searchTool from "../tools/search_knowledge.ts";
import getTool from "../tools/get_knowledge.ts";
import relatedTool from "../tools/related_knowledge.ts";
import projectsTool from "../tools/get_projects.ts";
import widgetTool from "../tools/propose_widget.ts";
import { getKnowledge, searchKnowledge } from "../../src/lib/knowledge.mjs";

const call = (tool, input) => tool.execute(tool.inputSchema.parse(input));

test("knowledge tool search, retrieval, and relations share public evidence", () => {
  const hits = call(searchTool, { query: "permissions", limit: 2 });
  assert.ok(hits.length > 0 && hits.length <= 2);
  for (const hit of hits) {
    assert.equal(hit.body, undefined);
    const record = call(getTool, { id: hit.id });
    assert.equal(record.status, "public");
    assert.deepEqual(hit.source, record.source);
    assert.deepEqual(record, getKnowledge(hit.id));
    const related = call(relatedTool, { id: hit.id, limit: 2 });
    assert.ok(related.length <= 2);
    assert.ok(related.every((item) => item.status === "public" && item.id !== hit.id));
  }
  assert.equal(call(getTool, { id: "missing-record" }), null);
});

test("project lookup returns the shared project corpus without independent facts", () => {
  const records = call(projectsTool, {});
  assert.ok(records.length > 0);
  assert.ok(records.every((record) => record.kind === "project" && record.status === "public"));
  assert.deepEqual(records, searchKnowledge({ query: "", kind: "project", limit: 10 }).map(({ record }) => record));
});

test("tool schemas reject oversized or unknown inputs", () => {
  for (const input of [
    { query: "" }, { query: "x".repeat(301) }, { query: "Lois", limit: 11 },
    { query: "Lois", limit: 0 }, { query: "Lois", kind: "private" },
    { query: "Lois", topic: "recruiter-notes" }, { query: "Lois", execute: "write-file" },
  ]) assert.equal(searchTool.inputSchema.safeParse(input).success, false);
  assert.equal(getTool.inputSchema.safeParse({ id: "../private\nnotes" }).success, false);
  assert.equal(relatedTool.inputSchema.safeParse({ id: "public", limit: 1.5 }).success, false);
});

test("widget drafts contain bounded plain data and require existing public evidence", () => {
  const id = call(searchTool, { query: "permissions", limit: 1 })[0].id;
  const draft = {
    type: "checklist", title: "Permission review", purpose: "Questions for a design review",
    items: [
      { label: "Scope", text: "Check tenant scoping.", evidenceIds: [id] },
      { label: "Revocation", text: "Check execution-time access.", evidenceIds: [id] },
    ],
  };
  const proposal = call(widgetTool, draft);
  assert.equal(proposal.status, "draft");
  assert.equal(proposal.evidence.length, 1);
  assert.deepEqual(proposal.widget, draft);
  assert.throws(() => call(widgetTool, { ...draft, items: draft.items.map((item) => ({ ...item, evidenceIds: ["missing-record"] })) }), /No approved public evidence/);
  assert.equal(widgetTool.inputSchema.safeParse({ ...draft, type: "executable-mdx" }).success, false);
  assert.equal(widgetTool.inputSchema.safeParse({ ...draft, title: "<script>alert(1)</script>" }).success, false);
  assert.equal(widgetTool.inputSchema.safeParse({ ...draft, onClick: "fetch('/private')" }).success, false);
});
