import { z } from "zod";

const trimmedText = (minimum: number, maximum: number) =>
  z.string().trim().min(minimum).max(maximum);

const titleText = trimmedText(1, 120);
const proseText = trimmedText(1, 1_500);
const patternName = titleText.refine((value) => {
  const words = value.split(/\s+/).filter(Boolean);
  return words.length >= 3 && words.length <= 8;
}, "Use a concise pattern name of 3 to 8 words.");

export const workflowInputSchema = z.strictObject({
  task: trimmedText(20, 1_500),
  currentProcess: trimmedText(20, 1_500),
  inputs: trimmedText(5, 1_000),
  desiredOutput: trimmedText(5, 1_000),
  stakes: z.enum(["low", "moderate", "high"]),
  approval: z.enum(["always", "exceptions", "none"]),
});

export type WorkflowInput = z.infer<typeof workflowInputSchema>;

export const workflowRequestSchema = workflowInputSchema.extend({ interpretation: z.enum(["rules", "jev"]).default("rules") });
export const workflowMethodSchema = z.object({
  mode: z.enum(["rules", "jev"]),
  signalIds: z.array(z.enum(["retrieval", "documents", "classification", "actions"])),
  fallback: z.boolean().optional(),
  analysis: z.object({
    provider: z.enum(["venice", "vercel"]), model: z.literal("Jev"), durationMs: z.number().nonnegative(), completedAt: z.string(),
    signals: z.array(z.object({ id: z.string(), label: z.string(), probability: z.number().min(0).max(1) })),
  }).optional(),
});
export type WorkflowMethod = z.infer<typeof workflowMethodSchema>;

export function approvalPolicy(input: WorkflowInput): string {
  if (input.approval === "always") {
    return "Every final result and outgoing action requires explicit human approval.";
  }
  if (input.stakes === "high") {
    return "Human approval is required before every consequential action, regardless of the selected approval preference.";
  }
  if (input.approval === "exceptions") {
    return "Uncertain results, failures, and policy exceptions require human review.";
  }
  return "Authority remains bounded; unvalidated results cannot trigger outgoing or consequential actions.";
}

const workflowStepSchema = z.strictObject({
  name: titleText,
  kind: z.enum(["software", "model", "human"]),
  detail: proseText,
});

const readinessAreaSchema = z.enum([
  "data",
  "retrieval",
  "workflow",
  "evaluation",
  "observability",
  "human-review",
  "risk",
]);

const readinessSchema = z.strictObject({
  area: readinessAreaSchema,
  status: z.enum(["defined", "needs-work", "unknown"]),
  evidence: proseText,
  action: proseText,
});

export const workflowBriefSchema = z.strictObject({
  title: titleText,
  jobToBeDone: proseText,
  recommendation: z.strictObject({
    pattern: patternName,
    rationale: proseText,
  }),
  steps: z.array(workflowStepSchema).min(1).max(12),
  readiness: z.array(readinessSchema).length(7),
  risks: z.array(z.strictObject({ risk: proseText, mitigation: proseText })).min(1).max(10),
  assumptions: z.array(proseText).min(1).max(10),
  evaluation: z.array(z.strictObject({
    metric: titleText,
    method: proseText,
    target: proseText,
  })).min(1).max(10),
  nextExperiment: z.strictObject({
    action: proseText,
    successCriteria: proseText,
  }),
}).superRefine((brief, context) => {
  const areas = new Set(brief.readiness.map((item) => item.area));
  if (areas.size !== 7) {
    context.addIssue({
      code: "custom",
      message: "Readiness must contain each area exactly once.",
      path: ["readiness"],
    });
  }
});

export type WorkflowBrief = z.infer<typeof workflowBriefSchema>;

export function requiresHumanStep(input: WorkflowInput): boolean {
  return input.stakes === "high" || input.approval === "always";
}

export function hasRequiredHumanStep(input: WorkflowInput, brief: WorkflowBrief): boolean {
  return !requiresHumanStep(input) || brief.steps.some((step) => step.kind === "human");
}
