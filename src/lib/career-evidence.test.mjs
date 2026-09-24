import test from "node:test";
import assert from "node:assert/strict";
import resume from "../content/resume.json" with { type: "json" };
import manifest from "../content/career-evidence.json" with { type: "json" };
import snapshot from "../content/generated/career-evidence.json" with { type: "json" };
import { createEvidenceSnapshot } from "./career-evidence.mjs";
import { buildRoleBrief } from "./career-fit.mjs";

test("the published snapshot is reproducible and current", () => {
  assert.deepEqual(snapshot, createEvidenceSnapshot(resume, manifest));
});

test("publication rejects unapproved prose, private entries, broken sources and unknown topics", () => {
  for (const change of [
    item => { item.claim = "An unapproved metric"; },
    item => { item.visibility = "private"; },
    item => { item.source.bullet = "missing"; },
    item => { item.capabilities.push("invented"); },
    item => { item.details.push("missing"); },
  ]) {
    const invalid = structuredClone(manifest);
    change(invalid.items[0]);
    assert.throws(() => createEvidenceSnapshot(resume, invalid));
  }
  const duplicate = structuredClone(manifest);
  duplicate.items.push(duplicate.items[0]);
  assert.throws(() => createEvidenceSnapshot(resume, duplicate), /Duplicate/);
});

test("approved fact changes invalidate the published snapshot", () => {
  const updated = structuredClone(resume);
  updated.roles[0].bullets.architecture += " Updated approved wording.";
  assert.notDeepEqual(createEvidenceSnapshot(updated, manifest), snapshot);
});

test("research sources must retain their approved HTTPS destinations", () => {
  const invalid = structuredClone(resume);
  invalid.research.thesis = "javascript:alert(1)";
  assert.throws(() => createEvidenceSnapshot(invalid, manifest));
});

test("new experiences are discoverable through specific requirements", () => {
  for (const [topic, id] of [["underwriting", "cash-underwriting"], ["education", "gurukul-research"], ["vision", "computer-vision"]]) {
    const result = buildRoleBrief([topic]);
    assert.equal(result.evidence[0].id, id);
    assert.equal(result.gaps.length, 0);
  }
});

test("equally relevant results cover complementary projects and topics", () => {
  const result = buildRoleBrief(["retrieval", "fintech", "ml"]);
  assert.ok(result.evidence.some(item => item.overlap.includes("ml")));
  assert.equal(new Set(result.evidence.map(item => item.project)).size, result.evidence.length);
  assert.deepEqual(result, buildRoleBrief(["ml", "retrieval", "fintech", "ml"]));
});

test("local priorities rank matching evidence first and do not fabricate unsupported topics", () => {
  const result = buildRoleBrief(["backend", "fintech", "underwriting"], "keyword", { priority: "underwriting" });
  assert.equal(result.evidence[0].id, "cash-underwriting");
  const unsupported = buildRoleBrief(["backend", "management"], "keyword", { priority: "management" });
  assert.deepEqual(unsupported.gaps.map(item => item.id), ["management"]);
  assert.ok(unsupported.evidence.every(item => !item.overlap.includes("management")));
});

test("showing all related work preserves the first three and catalog-wide gaps", () => {
  const ids = ["backend", "fintech", "management"];
  const brief = buildRoleBrief(ids);
  const all = buildRoleBrief(ids, "keyword", { limit: 100 });
  assert.ok(all.evidence.length > 3);
  assert.deepEqual(all.evidence.slice(0, 3), brief.evidence);
  assert.deepEqual(all.gaps, brief.gaps);
  assert.equal(all.evidence.length, brief.totalEvidence);
  assert.deepEqual(buildRoleBrief([], "keyword", { limit: 100 }).evidence, []);
});
