import resume from "../content/resume.json" with { type: "json" };

// Claims are selected from the public resume, never generated from role text.
export const capabilities = [
  { id: "agents", label: "AI agents", pattern: /\b(agent(?:ic|s)?|langgraph|tool.using)\b/i },
  { id: "retrieval", label: "Retrieval & RAG", pattern: /\b(rag|retrieval|search|classification|pinecone)\b/i },
  { id: "backend", label: "Backend & APIs", pattern: /\b(back.end|apis?|django|rails|fastapi|microservices)\b/i },
  { id: "integrations", label: "Integrations", pattern: /\b(integrations?|oauth|webhooks?|plaid|teller|crm)\b/i },
  { id: "product", label: "Product delivery", pattern: /\b(product|full.stack|end.to.end|user.facing|founding)\b/i },
  { id: "permissions", label: "Permissions & trust", pattern: /\b(permissions?|authorization|access.control|tenant|security)\b/i },
  { id: "fintech", label: "Financial workflows", pattern: /\b(fintech|financial|banking|mortgage|bookkeeping|reconciliation|underwriting)\b/i },
  { id: "ml", label: "ML systems", pattern: /\b(mlops|machine.learning|inference|triton|onnx|model.serving)\b/i },
  { id: "leadership", label: "Technical leadership", pattern: /\b(technical.lead|tech.lead|engineering.lead|mentoring)\b/i },
  { id: "design", label: "Product design", pattern: /\b(product.design|ux|user.research|figma|design.system)\b/i },
  { id: "growth", label: "Sales & growth", pattern: /\b(sales|marketing|conversion|growth|brand|go.to.market)\b/i },
  { id: "management", label: "People management", pattern: /\b(people.management|direct.reports|performance.reviews|hiring.manager|manage.a.team)\b/i },
];

const selection = [
  ["lois-agents", "Lois: agents for mortgage workflows", "loan-labs", "architecture", ["agents", "backend", "fintech"]],
  ["agent-permissions", "Permission-aware agent actions", "loan-labs", "permissions", ["agents", "permissions", "integrations"]],
  ["product-surfaces", "From agent APIs to a product interface", "loan-labs", "surfaces", ["product", "backend", "integrations"]],
  ["ai-delivery", "AI-assisted product development", "loan-labs", "leadership", ["product", "leadership"]],
  ["classify-ai", "Classify AI: prototype to production", "finally", "classify", ["product", "leadership", "fintech"]],
  ["retrieval-platform", "Retrieval-backed classification", "finally", "retrieval", ["retrieval", "backend", "fintech"]],
  ["banking-platform", "Reusable banking infrastructure", "finally", "banking", ["integrations", "backend", "fintech", "permissions"]],
  ["reconciliation", "A shorter path to the first close", "finally", "close", ["fintech", "product", "integrations"]],
  ["nlp-platform", "NLP inference and deployment", "outreach", "platform", ["ml", "backend"]],
  ["accessible-systems", "ML for accessible experiences", "unar", "accessibility", ["ml", "backend", "product"]],
];

export const evidence = selection.map(([id, title, roleId, bullet, tags]) => {
  const role = resume.roles.find(item => item.id === roleId);
  if (!role?.bullets[bullet]) throw new Error(`Missing approved evidence: ${id}`);
  return { id, title, company: role.company, claim: role.bullets[bullet], capabilities: tags,
    href: `/work/${roleId}`, sourceLabel: `${role.company} · public work`,
    limitation: roleId === "loan-labs" ? "Internal and pilot workflows; no claim of broad customer rollout." :
      bullet === "classify" ? "Technical leadership of three engineers; this does not establish formal people-management responsibility." :
      bullet === "close" ? "A team outcome, not a claim of sole attribution." : null };
});

export const examples = [
  { title: "Founding AI product engineer", description: "Build a user-facing AI product from prototype to production. Own agent workflows, retrieval and RAG, backend APIs, third-party integrations, and the product experience in a small team." },
  { title: "Fintech backend engineer", description: "Build banking integrations, webhooks, reconciliation and underwriting workflows. Own backend APIs, tenant permissions, secure token storage, and reliable financial data processing." },
  { title: "ML platform engineer", description: "Develop machine learning inference infrastructure and model serving. Work with ONNX, Triton, deployment pipelines, and backend microservices to make ML systems usable in production." },
];

export function keywordCapabilities(text) {
  return capabilities.filter(item => item.pattern.test(text)).map(item => item.id);
}

export function buildRoleBrief(ids, mode = "keyword") {
  const selected = capabilities.filter(item => ids.includes(item.id));
  const ranked = evidence.map(item => ({ ...item, overlap: item.capabilities.filter(id => ids.includes(id)) }))
    .filter(item => item.overlap.length > 0)
    // Preserve the curated public-work order for equally relevant evidence.
    .sort((a, b) => b.overlap.length - a.overlap.length);
  const gaps = selected.filter(item => !ranked.some(proof => proof.overlap.includes(item.id)));
  return {
    mode,
    capabilities: selected.map(({ id, label }) => ({ id, label })),
    evidence: ranked.slice(0, 3),
    gaps: gaps.map(({ id, label }) => ({ id, label })),
    prompts: [
      ...(ids.includes("agents") ? ["How would you decide which actions an agent can take, and which need review?"] : []),
      ...(ids.includes("product") ? ["What would you ship first, and what evidence would change that decision?"] : []),
      ...(ids.includes("retrieval") ? ["How would you evaluate retrieval quality before adding more model complexity?"] : []),
      ...(ids.includes("ml") ? ["How would you measure the tradeoff between model quality and serving cost?"] : []),
      "Which parts of this role need a deeper work sample or conversation?",
    ].slice(0, 3),
  };
}
