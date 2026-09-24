import { evaluateJev, type JevAnalysis } from "../jev.ts";
import { buildWorkflowBrief, detectWorkflowSignals, workflowSignals } from "./rules.ts";
import { type WorkflowInput, workflowInputSchema } from "./schema.ts";

export type GenerationErrorKind = "configuration" | "provider" | "timeout" | "cancelled" | "refusal" | "malformed-output";
export class WorkflowGenerationError extends Error {
  readonly kind: GenerationErrorKind;
  constructor(kind: GenerationErrorKind) {
    super(kind === "cancelled" ? "The workflow request was cancelled." : "The workflow brief could not be prepared.");
    this.name = "WorkflowGenerationError";
    this.kind = kind;
  }
}

export type WorkflowMethod = { mode: "rules" | "jev"; signalIds: string[]; analysis?: JevAnalysis; fallback?: boolean };
export type GenerationOptions = {
  signal?: AbortSignal;
  interpretation?: "rules" | "jev";
  env?: NodeJS.ProcessEnv;
  fetchFn?: typeof fetch;
  now?: () => number;
  timeoutMs?: number;
  onMethod?: (method: WorkflowMethod) => void;
};

/** No paid-provider path: rules remain useful with no keys or after promotion expiry. */
export async function generateWorkflowBrief(rawInput: WorkflowInput, options: GenerationOptions = {}) {
  if (options.signal?.aborted) throw new WorkflowGenerationError("cancelled");
  const input = workflowInputSchema.parse(rawInput);
  let method: WorkflowMethod = { mode: "rules", signalIds: detectWorkflowSignals(input) };
  if (options.interpretation === "jev") {
    const env = options.env ?? process.env;
    const signal = AbortSignal.any([...(options.signal ? [options.signal] : []), AbortSignal.timeout(options.timeoutMs ?? 12_000)]);
    try {
      const result = await evaluateJev({ workflow: input }, [...workflowSignals], {
        enabled: env.WORKFLOW_LAB_LIVE_ENABLED === "true", env, signal,
        fetcher: options.fetchFn ?? fetch, now: options.now ?? Date.now, onStage: () => {},
      });
      if (result) method = { mode: "jev", signalIds: result.ids, analysis: result.analysis };
      else method.fallback = true;
    } catch {
      // An unavailable optional service preserves the free experience.
      if (options.signal?.aborted) throw new WorkflowGenerationError("cancelled");
      method.fallback = true;
    }
  }
  if (options.signal?.aborted) throw new WorkflowGenerationError("cancelled");
  options.onMethod?.(method);
  return buildWorkflowBrief(input, method.signalIds);
}
