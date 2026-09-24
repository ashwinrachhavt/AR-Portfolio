import type { WorkflowBrief, WorkflowInput } from "./schema";
import { approvalPolicy } from "./schema.ts";

export const areaLabels = {
  data: "Data", retrieval: "Retrieval", workflow: "Workflow", evaluation: "Evaluation",
  observability: "Observability", "human-review": "Human review", risk: "Risk",
} as const;

export const statusLabels = { defined: "Defined", "needs-work": "Needs work", unknown: "Unknown" } as const;
export const kindLabels = { software: "Software", model: "AI-assisted", human: "Human approval" } as const;
export const approvalLabels = { always: "Approve every result", exceptions: "Review exceptions", none: "No routine approval requested" } as const;

const text = (value: string) => value.replace(/([\\`*_{}\[\]<>#!|])/g, "\\$1");

export function briefToMarkdown(brief: WorkflowBrief, input: WorkflowInput, isExample = false, method = "Free rules-based proposal"): string {
  return [
    `# ${text(brief.title)}`,
    `${isExample ? "Example brief" : text(method)} · AI Workflow Readiness Lab`,
    "Based on the supplied description. Assumptions and suggested targets need human review.",
    "## Approval boundary", text(approvalPolicy(input)),
    "## Job to be done", text(brief.jobToBeDone),
    "## Recommended pattern", `**${text(brief.recommendation.pattern)}**`, text(brief.recommendation.rationale),
    "## Workflow", ...brief.steps.map((step, index) => `${index + 1}. **${text(step.name)} · ${kindLabels[step.kind]}**\n   ${text(step.detail)}`),
    "## Readiness map", ...brief.readiness.map((item) => `### ${areaLabels[item.area]} — ${statusLabels[item.status]}\n\n${text(item.evidence)}\n\n**Next action:** ${text(item.action)}`),
    "## Evaluation plan", ...brief.evaluation.map((item) => `### ${text(item.metric)}\n\n${text(item.method)}\n\n**Proposed target:** ${text(item.target)}`),
    "## Risks and boundaries", ...brief.risks.map((item) => `- **${text(item.risk)}:** ${text(item.mitigation)}`),
    "## Assumptions to confirm", ...brief.assumptions.map((item) => `- ${text(item)}`),
    "## Next experiment", text(brief.nextExperiment.action), `**Success criteria:** ${text(brief.nextExperiment.successCriteria)}`,
    "## Original workflow description",
    `**Task:** ${text(input.task)}`, `**Current process:** ${text(input.currentProcess)}`,
    `**Inputs and systems:** ${text(input.inputs)}`, `**Desired output:** ${text(input.desiredOutput)}`,
    `**Consequences of error:** ${input.stakes}`, `**Approval:** ${approvalLabels[input.approval]}`,
    "---", "Built by Ashwin Rachha · AI Workflow Readiness Lab",
  ].join("\n\n") + "\n";
}

export function briefFilename(title: string): string {
  return `${title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 70) || "workflow"}-brief.md`;
}
