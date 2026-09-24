import snapshot from "../content/generated/career-evidence.json" with { type: "json" };
import { capabilities } from "./career-capabilities.mjs";
export { capabilities };

// Only the validated, published snapshot is available to the browser or API.
export const evidence = snapshot.items;

export const examples = [
  { title: "Founding AI product engineer", description: "Build a user-facing AI product from prototype to production. Own agent workflows, retrieval and RAG, backend APIs, third-party integrations, and the product experience in a small team." },
  { title: "Fintech backend engineer", description: "Build banking integrations, webhooks, reconciliation and underwriting workflows. Own backend APIs, tenant permissions, secure token storage, and reliable financial data processing." },
  { title: "ML platform engineer", description: "Develop machine learning inference infrastructure and model serving. Work with ONNX, Triton, deployment pipelines, and backend microservices to make ML systems usable in production." },
];

export function keywordCapabilities(text) {
  return capabilities.filter(item => item.pattern.test(text)).map(item => item.id);
}

export function buildRoleBrief(ids, mode = "keyword", { priority = null, limit = 3 } = {}) {
  const selected = capabilities.filter(item => ids.includes(item.id));
  const candidates = evidence.map(item => ({ ...item, overlap: item.capabilities.filter(id => ids.includes(id)) }))
    .filter(item => item.overlap.length > 0);
  const ranked = [];
  const covered = new Set(), projects = new Set(), companies = new Set();
  const preferred = selected.some(item => item.id === priority) ? priority : null;
  while (candidates.length) {
    // A visitor's explicit priority wins. Within one matching topic of the best
    // remaining result, prefer uncovered requirements and different projects.
    const focused = preferred ? candidates.filter(item => item.overlap.includes(preferred)) : [];
    const pool = focused.length ? focused : candidates;
    const bestOverlap = Math.max(...pool.map(item => item.overlap.length));
    const comparable = pool.filter(item => item.overlap.length >= bestOverlap - 1);
    const uncovered = item => item.overlap.filter(id => !covered.has(id)).length;
    comparable.sort((a, b) => uncovered(b) - uncovered(a) ||
      Number(projects.has(a.project)) - Number(projects.has(b.project)) ||
      b.overlap.length - a.overlap.length ||
      Number(companies.has(a.company)) - Number(companies.has(b.company)));
    const next = comparable[0];
    ranked.push(next);
    next.overlap.forEach(id => covered.add(id)); projects.add(next.project); companies.add(next.company);
    candidates.splice(candidates.indexOf(next), 1);
  }
  const gaps = selected.filter(item => !ranked.some(proof => proof.overlap.includes(item.id)));
  return {
    mode,
    capabilities: selected.map(({ id, label }) => ({ id, label })),
    evidence: ranked.slice(0, Math.max(0, limit)),
    totalEvidence: ranked.length,
    gaps: gaps.map(({ id, label }) => ({ id, label })),
    prompts: [
      ...(ids.includes("underwriting") ? ["How did you make underwriting decisions auditable and allow manual overrides?"] : []),
      ...(ids.includes("education") ? ["How would you evaluate learning outcomes and the role of guardrails?"] : []),
      ...(ids.includes("vision") ? ["What limitations would you investigate before using expression recognition?"] : []),
      ...(ids.includes("agents") ? ["How would you decide which actions an agent can take, and which need review?"] : []),
      ...(ids.includes("product") ? ["What would you ship first, and what evidence would change that decision?"] : []),
      ...(ids.includes("retrieval") ? ["How would you evaluate retrieval quality before adding more model complexity?"] : []),
      ...(ids.includes("ml") ? ["How would you measure the tradeoff between model quality and serving cost?"] : []),
      "Which parts of this role need a deeper work sample or conversation?",
    ].slice(0, 3),
  };
}
