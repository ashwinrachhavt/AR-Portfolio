// Synthetic fixtures for Decision Lab article
// IMPORTANT: All data is fictional. No employer data, proprietary prompts, 
// customer records, or production screenshots.

export type DecisionMode = "deterministic" | "recorded" | "live";

export interface Scenario {
  id: string;
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
  questions: Record<string, { type: string; instructions: string }>;
  typedAnswers: Record<string, { choice?: string; noul?: number; score?: number }>;
  policyChecks: Array<{ check: string; passed: boolean; reason: string }>;
  outcome: { action: string; reason: string };
}

// Chapter A: Lois - Document Classification
export const loisScenario: Scenario = {
  id: "lois-appraisal-001",
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
    hasSignature: true,
    lenderRule: "fannie_mae_standard",
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
      changes: { pageCount: 8, readablePages: 7, missingPages: [3] },
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

// Deterministic Jev response for Lois scenario
export const loisDeterministicTrace: DecisionTrace = {
  mode: "deterministic",
  fixtureVersion: "2026-09-25",
  questions: {
    document_type: {
      type: "choice",
      instructions: "What type of document is this based on the extracted text and metadata?",
    },
    evidence_sufficient: {
      type: "noul",
      instructions: "Is there sufficient evidence to confidently classify this document?",
    },
  },
  typedAnswers: {
    document_type: { choice: "appraisal" },
    evidence_sufficient: { noul: 0.92 },
  },
  policyChecks: [
    { check: "tenant_scope", passed: true, reason: "Document belongs to active loan file" },
    { check: "permitted_tool", passed: true, reason: "Document classification tool is authorized" },
    { check: "valid_evidence", passed: true, reason: "Extracted text contains appraisal markers" },
    { check: "current_authorization", passed: true, reason: "User session is valid" },
  ],
  outcome: {
    action: "classify_and_rename",
    reason: "High confidence classification with policy approval",
  },
};

// Chapter B: Classify AI - Transaction Categorization
export const classifyAiScenario: Scenario = {
  id: "classify-transaction-001",
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

// Deterministic Jev response for Classify AI scenario
export const classifyAiDeterministicTrace: DecisionTrace = {
  mode: "deterministic",
  fixtureVersion: "2026-09-25",
  questions: {
    account_category: {
      type: "choice",
      instructions: "Which account category best matches this transaction based on merchant and history?",
    },
    confidence: {
      type: "score",
      instructions: "Rate confidence in this categorization from 0 (guessing) to 1 (certain)",
    },
    needs_review: {
      type: "noul",
      instructions: "Does this transaction need human bookkeeper review before posting?",
    },
  },
  typedAnswers: {
    account_category: { choice: "office-supplies" },
    confidence: { score: 0.64 },
    needs_review: { noul: 0.73 },
  },
  policyChecks: [
    { check: "reconciliation", passed: false, reason: "Confidence below auto-post threshold (0.85)" },
    { check: "bookkeeper_approval", passed: false, reason: "Flagged for review" },
    { check: "ledger_sync_gate", passed: false, reason: "Blocked pending approval" },
  ],
  outcome: {
    action: "route_for_review",
    reason: "Moderate confidence with conflicting history - requires bookkeeper decision",
  },
};

// Policy check functions (pure, deterministic)
export function checkTenantScope(state: Record<string, unknown>): { passed: boolean; reason: string } {
  // Deterministic check: does the document/transaction belong to an active tenant?
  const hasValidTenant = Boolean(state.lenderRule || state.accountChart);
  return {
    passed: hasValidTenant,
    reason: hasValidTenant ? "Belongs to active tenant" : "No tenant context",
  };
}

export function checkPermittedTool(action: string): { passed: boolean; reason: string } {
  const allowedActions = ["classify_and_rename", "route_for_review", "request_clarification"];
  const permitted = allowedActions.includes(action);
  return {
    passed: permitted,
    reason: permitted ? `Action '${action}' is authorized` : `Action '${action}' not permitted`,
  };
}

export function checkValidEvidence(evidenceSpans?: Array<{ text: string; source: string }>): { passed: boolean; reason: string } {
  const hasEvidence = Boolean(evidenceSpans && evidenceSpans.length > 0);
  return {
    passed: hasEvidence,
    reason: hasEvidence ? "Evidence spans available" : "No evidence provided",
  };
}

export function checkCurrentAuthorization(mock = true): { passed: boolean; reason: string } {
  // In real system: verify JWT token, check permissions, validate session
  // Here: deterministic mock for demonstration
  return {
    passed: mock,
    reason: mock ? "Mock authorization valid" : "Authorization required",
  };
}
