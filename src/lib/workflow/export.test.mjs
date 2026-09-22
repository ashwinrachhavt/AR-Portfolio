import assert from "node:assert/strict";
import test from "node:test";
import { exampleBrief, exampleInput } from "./example.ts";
import { briefFilename, briefToMarkdown } from "./export.ts";
import { approvalPolicy, workflowBriefSchema } from "./schema.ts";

test("export preserves the full brief, approval boundary, and original description", () => {
  const markdown = briefToMarkdown(exampleBrief, exampleInput);
  for (const heading of ["Job to be done", "Recommended pattern", "Workflow", "Readiness map", "Evaluation plan", "Risks and boundaries", "Assumptions to confirm", "Next experiment", "Original workflow description"]) {
    assert.ok(markdown.includes(`## ${heading}`), heading);
  }
  assert.ok(markdown.includes("Human approval"));
  assert.ok(markdown.includes(exampleInput.task));
  assert.ok(markdown.includes("Approve every result"));
  assert.ok(markdown.includes("Proposed target:"));
  assert.ok(markdown.includes("AI-generated proposal"));
  assert.ok(markdown.includes(approvalPolicy(exampleInput)));
});

test("the example meets the same output contract as generated briefs", () => {
  assert.equal(workflowBriefSchema.safeParse(exampleBrief).success, true);
});

test("export keeps high-stakes approval even when no routine approval was selected", () => {
  const input = { ...exampleInput, stakes: "high", approval: "none" };
  assert.ok(briefToMarkdown(exampleBrief, input).includes(approvalPolicy(input)));
});

test("exports distinguish the example and escape untrusted markup", () => {
  const markdown = briefToMarkdown({ ...exampleBrief, title: "<script>alert(1)</script> [open](https://example.com)" }, exampleInput, true);
  assert.ok(markdown.includes("Example brief"));
  assert.ok(!markdown.includes("<script>"));
  assert.ok(!markdown.includes("[open]"));
});

test("download filenames are bounded and cannot contain paths", () => {
  assert.equal(briefFilename("../../Vendor / Review"), "vendor-review-brief.md");
  assert.equal(briefFilename("💡"), "workflow-brief.md");
  assert.ok(briefFilename("a".repeat(200)).length < 90);
});
