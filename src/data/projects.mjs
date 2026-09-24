import resume from "../content/resume.json" with { type: "json" };

// Public evidence comes from the same approved source as the resumes.
// Presentation copy only summarizes the referenced bullets.
function careerProject({ roleId, bulletKeys, ...presentation }) {
  const role = resume.roles.find((entry) => entry.id === roleId);
  return {
    ...presentation, roleId, company: role.company, role: role.title, dates: role.dates,
    href: `/projects/${presentation.id}`,
    bullets: bulletKeys.map((key) => ({
      id: `${roleId}-${key}`, key, text: role.bullets[key],
      source: `src/content/resume.json#roles/${roleId}/bullets/${key}`,
    })),
    links: [{ label: "View experience", href: `/work/${roleId}` }],
  };
}

export const projects = [
  careerProject({
    id: "lois", title: "Lois", roleId: "loan-labs",
    bulletKeys: ["architecture", "surfaces", "permissions", "integrations"],
    category: "Agentic mortgage workflows", status: "Internal & pilot workflows",
    summary: "Mortgage-document classification, lender-specific renaming, and policy validation through a permission-aware agent in LoanOS.",
    headline: "A document workflow.\nWith boundaries built in.",
    focus: "Bring document intake, agent actions, and lender policies into the same mortgage workflow.",
    approach: "Re-architected one-off Ruby LLM calls into a LangGraph agentic system on Amazon Bedrock AgentCore, connected to agent-facing Rails APIs and scoped integrations.",
    result: "Internal and pilot workflows connect document handling with explicit permissions and execution-time checks.",
    signal: "Fail-closed", signalLabel: "authorization for connected tools",
    scope: "Loan Labs · internal and pilot workflows",
    topics: ["Agents", "Authorization", "LangGraph", "Bedrock AgentCore", "Rails", "Composio"],
    steps: [
      { title: "Intake", detail: "Borrower email intake and an in-product conversational interface bring loan documents into LoanOS.", evidenceKey: "surfaces" },
      { title: "Understand", detail: "LangGraph and Amazon Bedrock AgentCore support document classification, lender-specific renaming, and policy validation.", evidenceKey: "architecture" },
      { title: "Authorize", detail: "Tenant and owner scoping, separate action permissions, reviewed tool allowlists, and execution-time checks invalidate revoked access.", evidenceKey: "permissions" },
      { title: "Connect", detail: "CRM and document integrations include Google Drive, Box, Salesforce, HubSpot, Pipedrive, OneDrive, and SharePoint. Delete actions are blocked.", evidenceKey: "integrations" },
    ],
  }),
  careerProject({
    id: "classify-ai", title: "Classify AI", roleId: "finally",
    bulletKeys: ["classify", "retrieval", "close"],
    category: "Retrieval-augmented bookkeeping", status: "Production",
    summary: "Transaction classification that combines transaction history, merchant enrichment, and custom charts of accounts.",
    headline: "From transactions\nto understanding.",
    focus: "Reduce manual transaction categorization and connect classification to the wider bookkeeping workflow.",
    approach: "Led a three-engineer team from prototype to production, building retrieval-augmented classification with LangChain, Pinecone, Elasticsearch, Redis, Celery, and Django.",
    result: "Classify AI processed 50K+ transactions daily and reduced manual categorization by approximately 80%.",
    signal: "50K+", signalLabel: "transactions processed daily",
    scope: "Led a three-engineer team · production outcomes",
    topics: ["Retrieval", "Fintech", "LangChain", "Pinecone", "Elasticsearch", "Django"],
    steps: [
      { title: "Context", detail: "Transaction history, merchant enrichment, and custom charts of accounts provide context for classification.", evidenceKey: "retrieval" },
      { title: "Classify", detail: "Retrieval-augmented classification combines LangChain, Pinecone, Elasticsearch, Redis, Celery, and Django.", evidenceKey: "retrieval" },
      { title: "Deliver", detail: "Led a three-engineer team from prototype to production. Classify AI processed 50K+ transactions daily with approximately 80% less manual categorization.", evidenceKey: "classify" },
      { title: "Reconcile", detail: "The broader team evolved bookkeeping toward bank ingestion, OCR-supported statements, reconciliation, and QuickBooks push; first-month close improved from 4+ months to approximately 2 weeks.", evidenceKey: "close" },
    ],
  }),
  careerProject({
    id: "cash-underwriting", title: "Cash Underwriting", roleId: "finally", bulletKeys: ["underwriting"],
    category: "Cash-based credit decisions", status: "Finally engineering",
    summary: "Cash-based underwriting using 90-day bank data, reconstructed daily balances, and reviewable decision history.",
    headline: "Bank activity.\nA clearer credit picture.",
    focus: "Use bank data to support cash-based underwriting while retaining audit history and manual overrides.",
    approach: "Built daily-balance reconstruction over 90-day bank data, with weekly recalculation, audit history, and manual overrides.",
    result: "The underwriting work supported $3M+ in credit for 50+ companies in approximately three months. This is a team outcome at Finally.",
    signal: "$3M+", signalLabel: "in credit supported · team outcome",
    scope: "50+ companies · approximately three months · Finally team outcome",
    topics: ["Fintech", "Underwriting", "Bank data", "Audit history"],
    steps: [
      { title: "Look back", detail: "Use 90-day bank data as the basis for cash-based underwriting.", evidenceKey: "underwriting" },
      { title: "Reconstruct", detail: "Reconstruct daily balances from bank data.", evidenceKey: "underwriting" },
      { title: "Recalculate", detail: "Recalculate weekly and retain audit history.", evidenceKey: "underwriting" },
      { title: "Review", detail: "Support manual overrides alongside the underwriting history.", evidenceKey: "underwriting" },
    ],
  }),
  careerProject({
    id: "bank-connections", title: "Bank Connections", roleId: "finally", bulletKeys: ["banking", "close"],
    category: "Reusable banking infrastructure", status: "Finally engineering",
    summary: "Reusable Plaid and Teller infrastructure for account linking, secure token lifecycles, webhooks, and transaction synchronization.",
    headline: "Connect once.\nKeep the data moving.",
    focus: "Move bookkeeping beyond CSV uploads with reusable account connections and normalized bank data.",
    approach: "Architected account linking, encrypted token storage, token lifecycle management, webhooks, transaction synchronization, and normalized account data across Plaid and Teller.",
    result: "The wider bookkeeping work helped reduce first-month close from 4+ months to approximately 2 weeks. This is a team outcome at Finally.",
    signal: "Plaid + Teller", signalLabel: "reusable bank integrations",
    scope: "Close-time improvement reflects the wider Finally team workflow",
    topics: ["Fintech", "Plaid", "Teller", "Webhooks", "Token lifecycle", "Reconciliation"],
    steps: [
      { title: "Link", detail: "Reusable Plaid and Teller infrastructure connects bank accounts.", evidenceKey: "banking" },
      { title: "Protect", detail: "Encrypted token storage and token lifecycle management support connected accounts.", evidenceKey: "banking" },
      { title: "Synchronize", detail: "Webhooks and transaction synchronization feed normalized account data.", evidenceKey: "banking" },
      { title: "Close", detail: "Bank ingestion joins OCR-supported statements, reconciliation, and QuickBooks push in the wider bookkeeping workflow.", evidenceKey: "close" },
    ],
  }),
  careerProject({
    id: "unar-labs", title: "UNAR Labs", roleId: "unar", bulletKeys: ["accessibility"],
    category: "Accessibility-focused ML", status: "Backend & data pipelines",
    summary: "Accessibility-focused backend and data pipelines for visually impaired users, deployed on GCP with Docker.",
    headline: "Machine learning.\nBuilt around access.",
    focus: "Build backend and data pipelines for accessibility-focused tools serving visually impaired users.",
    approach: "Worked with OpenCV, PyTorch, Transformers, and FastAPI, with deployment on GCP using Docker.",
    result: "Built and deployed accessibility-focused backend and data pipelines for visually impaired users.",
    signal: "Accessibility", signalLabel: "backend and data pipelines",
    scope: "Machine Learning Engineer · Jun–Aug 2023",
    topics: ["Accessibility", "Computer vision", "OpenCV", "PyTorch", "Transformers", "FastAPI", "GCP"],
    steps: [
      { title: "Purpose", detail: "Accessibility-focused backend and data pipelines support visually impaired users.", evidenceKey: "accessibility" },
      { title: "Models", detail: "The implementation used OpenCV, PyTorch, and Transformers.", evidenceKey: "accessibility" },
      { title: "Backend", detail: "FastAPI supported the accessibility-focused backend.", evidenceKey: "accessibility" },
      { title: "Deploy", detail: "Deployed on GCP with Docker.", evidenceKey: "accessibility" },
    ],
  }),
  careerProject({
    id: "outreach-template-project", title: "Outreach Template Project", roleId: "outreach", bulletKeys: ["platform"],
    category: "Reusable ML infrastructure", status: "ML platform internship",
    summary: "Reusable NLP inference and deployment infrastructure using model-serving tools, Go/Python microservices, and GKE.",
    headline: "Reusable foundations\nfor NLP inference.",
    focus: "Build reusable NLP inference and deployment infrastructure.",
    approach: "Worked with PySpark, MLflow, ONNX, NVIDIA Triton, Go/Python microservices, Docker, CI/CD, and GKE.",
    result: "Built reusable inference and deployment infrastructure during the ML platform engineering internship at Outreach.",
    signal: "Reuse", signalLabel: "NLP inference and deployment",
    scope: "Public details cover reusable inference and deployment infrastructure",
    topics: ["ML platforms", "NLP", "MLflow", "ONNX", "Triton", "GKE", "CI/CD"],
    steps: [
      { title: "Data & models", detail: "PySpark and MLflow were part of the reusable NLP infrastructure.", evidenceKey: "platform" },
      { title: "Inference", detail: "The inference infrastructure used ONNX and NVIDIA Triton.", evidenceKey: "platform" },
      { title: "Services", detail: "Go and Python microservices were part of the implementation.", evidenceKey: "platform" },
      { title: "Deployment", detail: "Docker, CI/CD, and GKE supported deployment infrastructure.", evidenceKey: "platform" },
    ],
  }),
  {
    id: "gurukul", title: "Gurukul", company: "Virginia Tech", role: "LLM-enhanced CS education research",
    dates: "IEEE SouthEastCon 2023 · IEEE FIE 2024", href: "/projects/gurukul",
    category: "LLM-enhanced CS education", status: "Research",
    summary: resume.research.description,
    headline: "Adaptive learning.\nGrounded in context.",
    focus: "Build an adaptive learning environment for computer-science education.",
    approach: "Combined retrieval-augmented generation with guardrails in an LLM-enhanced learning environment.",
    result: "Research at IEEE FIE 2024 and IEEE SouthEastCon 2023, with a public thesis and code repository.",
    signal: "RAG + guardrails", signalLabel: "adaptive computer-science learning",
    scope: "Research · public thesis and implementation",
    topics: ["Retrieval", "Education", "RAG", "Guardrails", "Research"],
    steps: [
      { title: "Learn", detail: "An adaptive learning environment for computer-science education.", evidenceKey: "description" },
      { title: "Retrieve", detail: "The environment uses retrieval-augmented generation.", evidenceKey: "description" },
      { title: "Guide", detail: "Guardrails are part of the LLM-enhanced learning environment.", evidenceKey: "description" },
      { title: "Research", detail: "Research at IEEE FIE 2024 and IEEE SouthEastCon 2023; explore the thesis and public code below.", evidenceKey: "description" },
    ],
    bullets: [{ id: "research-description", key: "description", text: resume.research.description, source: "src/content/resume.json#research/description" }],
    links: [{ label: "Read the thesis", href: resume.research.thesis }, { label: "Explore the code", href: resume.research.code }],
  },
];

export function getProject(id) {
  return projects.find((project) => project.id === id);
}
