import test from "node:test";
import assert from "node:assert/strict";
import { approvedCitation, assistantStarters, evidenceReply, messageText } from "./assistant.mjs";
import { knowledge } from "./knowledge.mjs";

test("every suggested question retrieves public evidence with a real source", () => {
  for (const starter of assistantStarters) {
    const reply = evidenceReply(knowledge, starter.question);
    assert.ok(reply.sources.length > 0 && reply.sources.length <= 3);
    for (const source of reply.sources) {
      const record = knowledge.find(item => item.id === source.id);
      assert.equal(record.status, "public");
      assert.equal(source.sourceTitle, record.source.title);
      assert.ok(source.excerpt);
    }
  }
});

test("missing evidence and empty/tokenless questions never produce invented answers", () => {
  for (const query of ["", "the", "!!!", "zyxnonexistenttopic123"]) {
    const reply = evidenceReply(knowledge, query);
    assert.deepEqual(reply.sources, []);
    assert.match(reply.text, /couldn’t find/);
  }
});

test("semantic relevance never admits private records", () => {
  const privateRecord = { ...knowledge[0], id: "private-correspondence", status: "private" };
  assert.equal(evidenceReply([privateRecord], "career", { [privateRecord.id]: 1 }).sources.length, 0);
});

test("the same passage is not repeated through project and experience records", () => {
  const reply = evidenceReply(knowledge, "How should agents check permissions?");
  assert.equal(new Set(reply.sources.map(source => source.excerpt)).size, reply.sources.length);
  assert.ok(reply.sources.every(source => knowledge.find(record => record.id === source.id).kind !== "concept"));
});

test("model output cannot turn unverified or executable URLs into links", () => {
  const record = knowledge[0];
  assert.equal(approvedCitation(`/knowledge/${record.id}`, knowledge), `/knowledge/${record.id}`);
  for (const href of ["javascript:alert(1)", "//evil.example", "https://evil.example", "/knowledge/invented-source", "/api/private", undefined]) assert.equal(approvedCitation(href, knowledge), undefined);
});

test("only assistant text is rendered, not reasoning or tool payloads", () => {
  assert.equal(messageText({ parts: [{ type: "reasoning", text: "internal" }, { type: "text", text: "Useful answer" }, { type: "dynamic-tool", output: { credential: "never render" } }] }), "Useful answer");
});
