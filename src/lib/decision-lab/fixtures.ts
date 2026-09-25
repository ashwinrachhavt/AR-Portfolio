// Synthetic fixtures for Decision Lab article
// IMPORTANT: All data is fictional. No employer data, proprietary prompts,
// customer records, or production screenshots.

export type DecisionMode = "deterministic" | "recorded" | "live";

export interface Scenario {
  id: string;
  version: string;
  chapter: "lois" | "classify-ai";
  synthetic: true;
  state: Record<string, unknown>;
  candidates: Array<{ id: string; label: string; description?: string }>;
  evidenceSpans?: Array<{ text: string; source: string }>;
  variants?: Array<{ id: string; label: string; changes: Record<string, unknown> }>;
  expectedPolicy: {
    allowed: boolean;
    reason: string;
    requiredChecks: string[];
  };
}

export interface DecisionTrace {
  mode: DecisionMode;
  fixtureVersion: string;
  modelVersion?: string;
  observedAt?: string;
  questions: Record<string, { type: "choice" | "noul" | "score"; instructions: string }>;
  typedAnswers: Record<string, { choice?: string; noul?: number; score?: number }>;
  policyChecks: Array<{ check: string; passed: boolean; reason: string }>;
  outcome: { action: "classify_and_rename" | "route_for_review" | "request_clarification" | "exclude_expense_path" | "no_candidate" | "needs_more_evidence"; reason: string };
}

type StageId =
  | "intake"
  | "text_extraction"
  | "catalog_lookup"
  | "candidate_type"
  | "evidence_sufficiency"
  | "review_record_update"
  | "lender_rename"
  | "policy_checks"
  | "transaction_normalization"
  | "tenant_history_retrieval"
  | "merchant_context"
  | "candidate_account"
  | "bookkeeper_lanes"
  | "reconciliation"
  | "ledger_sync";

// Types for replay results
export type Evidence = { text: string; source: string };
export type Check = DecisionTrace["policyChecks"][number];
export type ReplayResult = {
  state: Record<string, unknown>;
  evidence: Evidence[];
  trace: DecisionTrace;
  changedStages: StageId[];
};

// Chapter A: Lois - Document Classification
export const loisScenario: Scenario = {
  id: "lois-appraisal",
  version: "1.0.0",
  chapter: "lois",
  synthetic: true,
  state: {
    filename: "borrower_apprsl_final.pdf",
    extractedText: `RESIDENTIAL APPRAISAL REPORT
    
Property Address: 742 Evergreen Terrace, Springfield, IL 62701
Borrower: John Q. Sample (SYNTHETIC)
Appraised Value: $285,000
Date of Inspection: January 15, 2026
Appraiser: Jane Smith, State Certified

SUMMARY OF SALIENT FEATURES
The subject property is a single-family residence...`,
    pageCount: 8,
    readablePages: 8,
    missingPages: [],
    hasSignature: true,
    lenderRule: "fannie_mae_standard",
    syntheticTenantId: "tenant-loan-labs-demo",
    syntheticWriteAllowed: true,
    syntheticAuthorizationCurrent: true,
  },
  candidates: [
    { id: "appraisal", label: "Appraisal Report", description: "Property valuation by licensed appraiser" },
    { id: "inspection", label: "Home Inspection Report", description: "Structural and systems evaluation" },
    { id: "title", label: "Title Report", description: "Property ownership and lien search" },
    { id: "insurance", label: "Insurance Declaration", description: "Homeowners insurance coverage" },
  ],
  evidenceSpans: [
    { text: "RESIDENTIAL APPRAISAL REPORT", source: "page 1, header" },
    { text: "Appraised Value: $285,000", source: "page 1, summary section" },
    { text: "State Certified", source: "page 1, appraiser credentials" },
  ],
  variants: [
    {
      id: "unreadable-page",
      label: "Unreadable page 3",
      changes: { readablePages: 7, missingPages: [3] },
    },
    {
      id: "contradicting-header",
      label: "Header says 'Inspection Report'",
      changes: { extractedText: "HOME INSPECTION REPORT\n\nProperty Address: 742 Evergreen..." },
    },
    {
      id: "different-lender",
      label: "Different lender naming rule",
      changes: { lenderRule: "wells_fargo_custom" },
    },
  ],
  expectedPolicy: {
    allowed: true,
    reason: "Valid appraisal with required signatures and lender rule match",
    requiredChecks: ["tenant_scope", "permitted_tool", "valid_evidence", "current_authorization"],
  },
};

// Chapter B: Classify AI - Transaction Categorization
export const classifyAiScenario: Scenario = {
  id: "classify-transaction",
  version: "1.0.0",
  chapter: "classify-ai",
  synthetic: true,
  state: {
    amount: -127.43,
    date: "2026-09-18",
    merchant: "AMZN MKTP US*2X7BK9",
    accountChart: [
      "Office Supplies",
      "Marketing & Advertising", 
      "Software & Subscriptions",
      "Office Equipment",
      "Meals & Entertainment",
    ],
    priorTransactions: [
      { merchant: "AMZN MKTP US*", category: "Office Supplies", date: "2026-08-12" },
      { merchant: "AMZN MKTP US*", category: "Software & Subscriptions", date: "2026-07-05" },
    ],
    businessContext: "Marketing agency focused on social media campaigns",
    syntheticBookkeeperApproved: false,
    syntheticReconciled: false,
    transactionType: "expense",
  },
  candidates: [
    { id: "office-supplies", label: "Office Supplies" },
    { id: "marketing", label: "Marketing & Advertising" },
    { id: "software", label: "Software & Subscriptions" },
    { id: "equipment", label: "Office Equipment" },
  ],
  evidenceSpans: [
    { text: "AMZN MKTP US*", source: "merchant string" },
    { text: "Prior: Office Supplies (Aug 12)", source: "transaction history" },
    { text: "Prior: Software & Subscriptions (Jul 5)", source: "transaction history" },
  ],
  variants: [
    {
      id: "different-chart",
      label: "Different business chart of accounts",
      changes: { 
        accountChart: ["Computer Equipment", "Internet Services", "Cloud Storage", "Business Tools"],
      },
    },
    {
      id: "conflicting-history",
      label: "All prior Amazon purchases were 'Marketing'",
      changes: {
        priorTransactions: [
          { merchant: "AMZN MKTP US*", category: "Marketing & Advertising", date: "2026-08-12" },
          { merchant: "AMZN MKTP US*", category: "Marketing & Advertising", date: "2026-07-05" },
        ],
      },
    },
    {
      id: "transfer-not-expense",
      label: "Mark as internal transfer",
      changes: { transactionType: "transfer", linkedAccount: "Business Savings" },
    },
  ],
  expectedPolicy: {
    allowed: false,
    reason: "Ambiguous categorization requires bookkeeper review",
    requiredChecks: ["reconciliation", "bookkeeper_approval", "ledger_sync_gate"],
  },
};