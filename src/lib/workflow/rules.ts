import { approvalPolicy, requiresHumanStep, workflowBriefSchema, workflowInputSchema, type WorkflowBrief, type WorkflowInput } from "./schema.ts";

// Signals select authored planning templates, never generated facts.
export const workflowSignals = [
  { id: "retrieval", label: "Source lookup", pattern: /\b(search|retriev\w*|knowledge|polic(?:y|ies)|reference|database|crm)\b/i, instructions: "Does the workflow explicitly need to look up supporting records or reference material?" },
  { id: "documents", label: "Document processing", pattern: /\b(documents?|pdfs?|invoices?|attachments?|extract\w*)\b/i, instructions: "Does the workflow explicitly need to read or extract information from documents?" },
  { id: "classification", label: "Classification or routing", pattern: /\b(classif\w*|categori\w*|routing|route|assign\w*|triage)\b/i, instructions: "Does the workflow explicitly need to classify, categorize, or assign incoming work?" },
  { id: "actions", label: "External actions", pattern: /\b(send|publish|pay|payment|update|delete|write|submit|execute|transfer)\b/i, instructions: "Does the desired workflow explicitly need to change external records, send messages, or execute transactions?" },
] as const;

export function detectWorkflowSignals(input: WorkflowInput): string[] {
  const text = [input.task, input.currentProcess, input.inputs, input.desiredOutput].join("\n");
  return workflowSignals.filter(({ pattern }) => pattern.test(text)).map(({ id }) => id);
}

const excerpt = (value: string, maximum = 480) => value.length > maximum ? `${value.slice(0, maximum - 1)}…` : value;

/** Pure and deterministic: safe to run in the browser with no provider or account. */
export function buildWorkflowBrief(rawInput: WorkflowInput, signalIds?: string[]): WorkflowBrief {
  const input = workflowInputSchema.parse(rawInput);
  const ids = new Set(signalIds ?? detectWorkflowSignals(input));
  const retrieval = ids.has("retrieval");
  const documents = ids.has("documents");
  const classification = ids.has("classification");
  const actions = ids.has("actions");
  const highStakes = input.stakes === "high";
  const human = requiresHumanStep(input) || input.approval === "exceptions";
  const pattern = classification ? "Validate then propose routing" : retrieval ? "Retrieve then draft with evidence" : documents ? "Extract validate and review" : "Validate then draft for review";
  const steps: WorkflowBrief["steps"] = [
    { name: "Validate the intake", kind: "software", detail: `Check required fields, file types, ownership, and access before processing. Declared inputs: ${excerpt(input.inputs)}` },
    ...(documents ? [{ name: "Extract a reviewable record", kind: "software" as const, detail: "Preserve the source document and location for each extracted field. Mark unreadable or missing values instead of guessing." }] : []),
    ...(retrieval ? [{ name: "Retrieve permitted evidence", kind: "software" as const, detail: "Use only approved sources the requester can access. Keep source identifiers, versions, and an explicit no-evidence path." }] : []),
    { name: classification ? "Propose a category or owner" : "Prepare the proposed output", kind: "software", detail: `Start with explicit rules and a reviewable draft. Compare any future AI step against that baseline before adding it. Requested output: ${excerpt(input.desiredOutput)}` },
    { name: "Check the result", kind: "software", detail: "Validate the output format, required evidence, permitted values, and duplicate requests. Hold incomplete or unsupported results for review." },
    ...(human ? [{ name: input.approval === "always" || highStakes ? "Approve before acting" : "Review exceptions", kind: "human" as const, detail: approvalPolicy(input) }] : []),
    { name: actions ? "Stage a bounded action" : "Record the proposed result", kind: "software", detail: actions ? `${approvalPolicy(input)} Keep the first experiment in dry-run mode; test authorization, duplicate prevention, and recovery before enabling writes.` : "Record the result, supporting evidence, validation outcome, and corrections. The pilot produces drafts only." },
  ];
  return workflowBriefSchema.parse({
    title: classification ? "Classification workflow readiness" : documents ? "Document workflow readiness" : retrieval ? "Evidence workflow readiness" : "Workflow readiness brief",
    jobToBeDone: input.task,
    recommendation: { pattern, rationale: `This authored pattern follows the declared inputs and requested output. ${retrieval ? "Keep source lookup separate from the proposed answer. " : ""}${documents ? "Preserve source documents through extraction and review. " : ""}Establish a rules-based baseline and measure its gaps before introducing AI. ${approvalPolicy(input)}` },
    steps,
    readiness: [
      { area: "data", status: "needs-work", evidence: `You described these inputs: ${excerpt(input.inputs)} Their quality and access have not been verified.`, action: "List required fields, ownership, allowed uses, and examples of missing or malformed inputs." },
      { area: "retrieval", status: retrieval ? "needs-work" : "unknown", evidence: retrieval ? "The selected signals suggest source lookup; source coverage and permissions remain untested." : "The selected signals do not establish a need for retrieval. This does not prove that all necessary context is present.", action: retrieval ? "Assemble representative queries with expected evidence, including no-result and unauthorized-source cases." : "Check whether the submitted inputs contain all evidence needed for a correct result before adding a retrieval system." },
      { area: "workflow", status: "defined", evidence: `Current process as described: ${excerpt(input.currentProcess)}`, action: "Confirm the owner, handoffs, retry policy, and exception path with the people doing the work." },
      { area: "evaluation", status: "needs-work", evidence: "This brief does not verify a baseline, labeled examples, or acceptance criteria, even if they were mentioned in the description.", action: "Have reviewers label a small representative sample, including difficult cases, and compare the existing process with the proposed rules." },
      { area: "observability", status: "unknown", evidence: "No trace, alert, or recovery mechanism has been tested by this lab.", action: "Capture a request ID, rule version, sources, validation result, reviewer correction, and elapsed time. Exclude secrets from logs." },
      { area: "human-review", status: input.approval === "none" && !highStakes ? "needs-work" : "defined", evidence: approvalPolicy(input), action: human ? "Name the reviewer and define what they inspect, how exceptions arrive, and when work must stop." : "Name an owner for failures and review pilot results before removing routine oversight." },
      { area: "risk", status: "needs-work", evidence: `You selected ${input.stakes} consequences of error. This is a stated preference, not an independent risk assessment.`, action: highStakes ? "Keep every consequential action behind human approval; review failure modes and recovery with the responsible domain owner." : "List likely mistakes, their impact, and how each can be detected and reversed." },
    ],
    risks: [
      { risk: "A plausible output may still be wrong", mitigation: "Require checkable evidence and explicit validation. Hold unknown or conflicting cases instead of presenting them as verified." },
      { risk: "The description may omit a critical constraint", mitigation: "Review this proposed pattern with the workflow owner. Keyword signals can miss negation and intent." },
      ...(actions ? [{ risk: "An external action could be duplicated or unauthorized", mitigation: "Use dry runs, bounded credentials, approval checks, idempotency, and a tested recovery path." }] : []),
      ...(highStakes ? [{ risk: "A mistake could have serious consequences", mitigation: "A human must approve each consequential action. Do not treat this planning brief as professional validation." }] : []),
    ],
    assumptions: [
      "This brief is an authored planning template selected by signals; it does not assess the real systems or verify the submitted description.",
      "A workflow owner can supply authorized examples and judge the quality of the proposed output.",
      "The first experiment can run on a small offline sample without taking external actions.",
    ],
    evaluation: [
      { metric: classification ? "Reviewer agreement" : "Output correctness", method: "Compare proposed outputs against reviewer-owned expected results. Record disagreements by error type and input condition.", target: "Establish the current-process baseline first; have the owner set an acceptable error threshold before the pilot." },
      { metric: "Review effort", method: "Measure time to inspect and correct each output alongside the same task done through the current process.", target: "Agree on a useful reduction in effort without increasing consequential errors; no improvement is assumed." },
      { metric: "Boundary handling", method: "Include missing evidence, unauthorized sources, duplicate requests, and failed checks in the sample.", target: "Every seeded boundary violation should be held for review, with no external action." },
    ],
    nextExperiment: { action: `Select 10–20 authorized examples, label the expected ${classification ? "category or assignment" : "output"}, and run the proposed rules offline. Include at least one missing-input and one failure case. This sample size is a starting suggestion, not a readiness threshold.`, successCriteria: "Document the baseline, reviewer effort, error categories, and boundary behavior. Decide with the owner whether to revise the rules, collect more examples, or test a narrowly scoped AI step." },
  });
}
