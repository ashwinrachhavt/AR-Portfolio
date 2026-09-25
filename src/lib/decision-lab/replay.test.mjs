import { test } from "node:test";
import assert from "node:assert";
import { loisScenario, classifyAiScenario } from "./fixtures.ts";
import { replayScenario } from "./replay.ts";

test("lois replay: base appraisal returns classify_and_rename", () => {
  const result = replayScenario(loisScenario);
  assert.strictEqual(result.trace.outcome.action, "classify_and_rename");
  assert.ok(result.trace.typedAnswers.classification.choice === "appraisal");
  assert.ok(result.evidence.some(e => e.text.includes("RESIDENTIAL APPRAISAL REPORT")));
});

test("lois replay: unreadable page variant returns needs_more_evidence", () => {
  const result = replayScenario(loisScenario, "unreadable-page");
  assert.strictEqual(result.trace.outcome.action, "needs_more_evidence");
});

test("lois replay: contradicting header variant classifies by actual header text", () => {
  const result = replayScenario(loisScenario, "contradicting-header");
  assert.strictEqual(result.trace.outcome.action, "classify_and_rename");
  assert.strictEqual(result.trace.typedAnswers.classification.choice, "inspection");
});

test("lois replay: different lender variant still classifies", () => {
  const result = replayScenario(loisScenario, "different-lender");
  assert.strictEqual(result.trace.outcome.action, "classify_and_rename");
  assert.ok(result.trace.outcome.reason.includes("wells_fargo_custom"));
});

test("classify-ai replay: base returns no_candidate (conflicting history)", () => {
  const result = replayScenario(classifyAiScenario);
  assert.strictEqual(result.trace.outcome.action, "no_candidate");
});

test("classify-ai replay: different chart returns no_candidate", () => {
  const result = replayScenario(classifyAiScenario, "different-chart");
  assert.strictEqual(result.trace.outcome.action, "no_candidate");
});

test("classify-ai replay: conflicting history returns classify_and_rename with marketing", () => {
  const result = replayScenario(classifyAiScenario, "conflicting-history");
  assert.strictEqual(result.trace.outcome.action, "classify_and_rename");
  assert.ok(result.trace.typedAnswers.classification.choice === "marketing");
});

test("classify-ai replay: transfer variant returns exclude_expense_path", () => {
  const result = replayScenario(classifyAiScenario, "transfer-not-expense");
  assert.strictEqual(result.trace.outcome.action, "exclude_expense_path");
});

test("replayScenario throws on unknown variant", () => {
  assert.throws(() => replayScenario(loisScenario, "nonexistent"), /Unknown scenario variant/);
});

test("changedStages reflects variant changes", () => {
  const result = replayScenario(loisScenario, "unreadable-page");
  assert.ok(result.changedStages.includes("readablePages"));
  assert.ok(result.changedStages.includes("missingPages"));
});