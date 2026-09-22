import type { WorkflowBrief, WorkflowInput } from "./schema";

export const exampleInput: WorkflowInput = {
  task: "Classify incoming vendor documents and route incomplete submissions for review.",
  currentProcess: "An operations reviewer reads each PDF, identifies its document type, checks required fields, and emails the vendor when something is missing.",
  inputs: "Vendor PDFs arrive in a shared inbox. Required fields and document types are listed in an internal checklist.",
  desiredOutput: "A proposed document type, extracted fields, links to supporting text, and a review queue for missing or ambiguous information.",
  stakes: "moderate",
  approval: "always",
};

export const exampleBrief: WorkflowBrief = {
  title: "Vendor document review",
  jobToBeDone: "Turn incoming vendor PDFs into evidence-linked classifications that an operations reviewer can verify before anything is sent or recorded as final.",
  recommendation: {
    pattern: "Extract, validate, then review",
    rationale: "The checklist gives ordinary software a clear job. Use a model to interpret document content, and keep final classification and vendor communication with the reviewer.",
  },
  steps: [
    { name: "Receive & validate", kind: "software", detail: "Check file type and size, assign a document ID, and reject unreadable files before processing." },
    { name: "Propose a classification", kind: "model", detail: "Extract fields and propose a document type. Attach supporting passages and mark missing information explicitly." },
    { name: "Apply the checklist", kind: "software", detail: "Validate extracted values against required fields and route incomplete submissions to the review queue." },
    { name: "Review & approve", kind: "human", detail: "A reviewer checks the source PDF, corrects the proposal, and approves the final classification and any vendor message." },
    { name: "Record the outcome", kind: "software", detail: "Save the approved result, reviewer edits, checklist version, and processing timestamps in an audit trail." },
  ],
  readiness: [
    { area: "data", status: "needs-work", evidence: "PDFs and a checklist are available; no representative sample or extraction-quality evidence was supplied.", action: "Collect a permissioned sample covering common documents, scans, missing pages, and duplicates." },
    { area: "retrieval", status: "unknown", evidence: "The checklist may fit directly into the request. Its size and update frequency are not yet known.", action: "Start with one versioned checklist. Add retrieval only if its size or variation requires it." },
    { area: "workflow", status: "defined", evidence: "An inbox, a reviewer, a classification task, and a review queue are described.", action: "Specify document states and who owns unreadable, duplicate, and incomplete submissions." },
    { area: "evaluation", status: "needs-work", evidence: "No labeled examples or acceptable error threshold were supplied.", action: "Have reviewers label a held-out sample and agree on acceptance criteria before model testing." },
    { area: "observability", status: "unknown", evidence: "The submission does not describe monitoring or incident handling.", action: "Track completion, latency, extraction failures, and reviewer corrections by document ID." },
    { area: "human-review", status: "defined", evidence: "The workflow requires a person to approve every final result.", action: "Make approval a required state transition. A model response alone must never release a vendor message." },
    { area: "risk", status: "needs-work", evidence: "The stated consequences are moderate; document sensitivity and retention rules are unspecified.", action: "Confirm which fields may be processed and define access, retention, deletion, and manual fallback." },
  ],
  risks: [
    { risk: "Plausible but incorrect extracted values", mitigation: "Show the supporting passage beside every proposed value and keep final approval with the reviewer." },
    { risk: "Untrusted instructions inside a PDF", mitigation: "Treat document text as data. The extraction step has no tools or authority to email, delete, or change records." },
    { risk: "Processing fails or a document is unreadable", mitigation: "Preserve the original submission and route it to the existing manual process with a visible failure reason." },
  ],
  assumptions: [
    "The team has permission to process the selected documents with its chosen provider.",
    "A reviewer is available to label examples and approve every result.",
    "A stable checklist can define the first set of document types and required fields.",
  ],
  evaluation: [
    { metric: "Classification quality", method: "Compare proposed types with reviewer labels on held-out documents, including errors by document type.", target: "Agree on a minimum per-type precision with the reviewer before running the experiment." },
    { metric: "Unsupported extracted values", method: "Check whether each populated field is supported by the source PDF.", target: "Proposed release gate: no unsupported critical fields in the pilot set; this does not establish a zero production error rate." },
    { metric: "Review effort and reliability", method: "Record reviewer corrections, review time, failed requests, latency, and cost per document.", target: "Compare with the current manual process and agree on an acceptable operating budget." },
  ],
  nextExperiment: {
    action: "Run an offline pilot with 50 permissioned historical documents, including difficult scans and incomplete submissions. This is a proposed starting sample, not a statistical guarantee. Do not connect outgoing email or final-record updates.",
    successCriteria: "A reviewer can trace every proposed classification to source evidence, approve or correct every result, and inspect the agreed quality and effort metrics before deciding whether to expand the pilot.",
  },
};
