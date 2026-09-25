import type { DecisionTrace, Scenario } from "./fixtures";

type Evidence = { text: string; source: string };
type Check = DecisionTrace["policyChecks"][number];

export type ReplayResult = {
  state: Record<string, unknown>;
  evidence: Evidence[];
  trace: DecisionTrace;
  changedStages: string[];
};

// This is an illustrative local simulation, not an LLM result or a real authorization check.
export function replayScenario(scenario: Scenario, variantId?: string): ReplayResult {
  const variant = variantId ? scenario.variants?.find((item) => item.id === variantId) : undefined;
  if (variantId && !variant) throw new Error(`Unknown scenario variant: ${variantId}`);

  const state = { ...scenario.state, ...(variant?.changes ?? {}) };
  const changedStages = variant ? Object.keys(variant.changes) : [];
  const checks: Check[] = [];
  let evidence: Evidence[] = [];
  let choice: string | undefined;
  let reason: string;
  let action: DecisionTrace["outcome"]["action"] = "route_for_review";

  if (scenario.chapter === "lois") {
    const text = typeof state.extractedText === "string" ? state.extractedText : "";
    const heading = text.split(/\r?\n/, 1)[0]?.trim() ?? "";
    const type = /home inspection report/i.test(heading)
      ? "inspection"
      : /residential appraisal report/i.test(heading)
        ? "appraisal"
        : undefined;
    choice = scenario.candidates.find((candidate) => candidate.id === type)?.id;
    evidence = heading ? [{ text: heading, source: "synthetic extracted text, first line" }] : [];
    const pageCount = typeof state.pageCount === "number" ? state.pageCount : 0;
    const readablePages = typeof state.readablePages === "number" ? state.readablePages : pageCount;
    const complete = pageCount > 0 && readablePages === pageCount &&
      (!Array.isArray(state.missingPages) || state.missingPages.length === 0);
    const tenant = typeof state.syntheticTenantId === "string" && state.syntheticTenantId.length > 0;
    checks.push(
      { check: "supported_heading", passed: Boolean(choice), reason: choice ? "Recognized synthetic heading" : "Heading does not identify a listed document type" },
      { check: "readable_pages", passed: complete, reason: complete ? "All pages marked readable in fixture" : "At least one page is unreadable or missing" },
      { check: "synthetic_tenant_scope", passed: tenant, reason: tenant ? "Fixture declares tenant scope" : "No explicit tenant scope in fixture" },
      { check: "synthetic_write_permission", passed: state.syntheticWriteAllowed === true, reason: "No real write permission can be granted by this demo" },
      { check: "synthetic_current_authorization", passed: state.syntheticAuthorizationCurrent === true, reason: "Only a fixture flag; real authorization must be rechecked at execution" },
    );
    reason = !choice ? "No supported document heading; request review"
      : !complete ? "Document may be incomplete; request clearer evidence"
        : `Candidate ${choice}; renaming requires separate verified scope and permission. Lender rule: ${String(state.lenderRule ?? "unspecified")}.`;
  } else {
    const transfer = state.transactionType === "transfer";
    const chart = Array.isArray(state.accountChart) ? state.accountChart.filter((item): item is string => typeof item === "string") : [];
    const prior = Array.isArray(state.priorTransactions) ? state.priorTransactions : [];
    const categories = prior.map((item) => item && typeof item === "object" && "category" in item ? item.category : undefined);
    const unanimous = categories.length > 0 && categories.every((category) => typeof category === "string" && category === categories[0]);
    const label = unanimous && typeof categories[0] === "string" ? categories[0] : undefined;
    choice = !transfer && label && chart.includes(label) ? scenario.candidates.find((candidate) => candidate.label === label)?.id : undefined;
    const merchant = typeof state.merchant === "string" ? state.merchant : "";
    evidence = merchant ? [{ text: merchant, source: "synthetic merchant string" }] : [];
    if (label) evidence.push({ text: `Prior category: ${label}`, source: "synthetic transaction history" });
    checks.push(
      { check: "expense_path", passed: !transfer, reason: transfer ? "Transfer must not enter expense categorization" : "Expense candidate path" },
      { check: "candidate_in_chart", passed: Boolean(choice), reason: choice ? "Unanimous prior category appears in this chart" : "No unambiguous category in this chart" },
      { check: "bookkeeper_approval", passed: state.syntheticBookkeeperApproved === true, reason: "Demo flag is not actual bookkeeper approval" },
      { check: "reconciliation", passed: state.syntheticReconciled === true, reason: "Demo flag is not actual reconciliation" },
    );
    if (transfer) action = "exclude_expense_path";
    reason = transfer ? "Transfer requires a separate workflow; no ledger update"
      : choice ? `Candidate ${choice}; human review and reconciliation remain separate.`
        : "Ambiguous or incompatible history; route to bookkeeper review";
  }

  const trace: DecisionTrace = {
    mode: "deterministic",
    fixtureVersion: scenario.id,
    questions: { classification: { type: "choice", instructions: "Which displayed candidate is supported by this synthetic fixture?" } },
    typedAnswers: { classification: choice ? { choice } : {} },
    policyChecks: checks,
    outcome: { action, reason },
  };
  return { state, evidence, trace, changedStages };
}
