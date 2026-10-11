import resume from "../content/resume.json" with { type: "json" };
import { curatedArticles } from "../data/writingCatalog.ts";

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

// The catalog: one entry per public resume fact. Adding an entry means adding a
// real bullet to resume.json — there is nothing else to draw from, by design.
const selection = [
  ["lois-agents", "Lois: agents for mortgage workflows", "loan-labs", "architecture", ["agents", "backend", "fintech"]],
  ["agent-permissions", "Permission-aware agent actions", "loan-labs", "permissions", ["agents", "permissions", "integrations"]],
  ["product-surfaces", "From agent APIs to a product interface", "loan-labs", "surfaces", ["product", "backend", "integrations"]],
  ["crm-integrations", "Connecting CRM and document workflows", "loan-labs", "integrations", ["integrations", "permissions", "product"]],
  ["ai-delivery", "AI-assisted product development", "loan-labs", "leadership", ["product", "leadership"]],
  ["classify-delivery", "Classify AI: prototype to production", "finally", "classify", ["product", "leadership", "fintech"]],
  ["retrieval-platform", "Retrieval-backed classification", "finally", "retrieval", ["retrieval", "backend", "fintech"]],
  ["banking-platform", "Reusable banking infrastructure", "finally", "banking", ["integrations", "backend", "fintech", "permissions"]],
  ["reconciliation", "A shorter path to the first close", "finally", "close", ["fintech", "product", "integrations"]],
  ["underwriting", "Cash-based underwriting on bank data", "finally", "underwriting", ["fintech", "backend", "product"]],
  ["accessible-systems", "ML for accessible experiences", "unar", "accessibility", ["ml", "backend", "product"]],
  ["nlp-platform", "NLP inference and deployment", "outreach", "platform", ["ml", "backend"]],
  ["vision-recognition", "Facial-expression recognition for CRM", "mindbowser", "vision", ["ml", "backend"]],
];

// Which capabilities each published work speaks to. Stated explicitly rather than
// matched against the catalog's freeform post tags, because those are written for
// readers ("Transformers", "NestJS"), not for this list — matching them silently
// dropped every repository entry. Adding a catalog item does not add it here; tag
// it deliberately, or it stays out of the pool.
const catalogTags = {
  "cash-based-underwriting": ["fintech", "backend"],
  "lois-mortgage-agent": ["agents", "fintech"],
  "classify-ai": ["retrieval", "fintech"],
  "gurukul-thesis": ["retrieval", "ml"],
  "3b92e262-08a5-8186-942c-ff5559fe4f68": ["agents", "permissions"],
  "3bb2e262-08a5-80aa-b865-e905d51fa752": ["agents", "permissions", "design"],
  "ieee-xai-education": ["ml", "design"],
  "ieee-fie-gurukul": ["retrieval", "ml"],
  "vt-search-inverted-index": ["retrieval", "backend"],
  "neuralflow-productivity": ["product", "backend"],
};

// Published work — papers, repositories, essays — drawn from the site's curated
// article catalog. The title, description and link are the catalog's own, copied
// whole; nothing here is inferred, summarized or rewritten.
const published = curatedArticles.filter(item => catalogTags[item.id]).map(item => ({
  // Namespaced: catalog ids are shared with blog routes and can repeat a role's
  // id, which would collide with a résumé source in the same pool.
  id: `published:${item.id}`,
  title: item.title,
  company: item.sourceName,
  claim: item.description,
  capabilities: catalogTags[item.id],
  href: item.href,
  external: Boolean(item.external),
  sourceLabel: "public work",
  limitation: item.isThesis ? "Thesis research; not a shipped commercial product." : null,
}));

export const catalogCoverage = Object.keys(catalogTags);

const work = selection.map(([id, title, roleId, bullet, tags]) => {
  const role = resume.roles.find(item => item.id === roleId);
  if (!role?.bullets[bullet]) throw new Error(`Missing approved evidence: ${id}`);
  return { id, title, company: role.company, claim: role.bullets[bullet], capabilities: tags,
    href: `/work/${roleId}`, sourceLabel: `${role.company} · public work`,
    limitation: roleId === "loan-labs" ? "Internal and pilot workflows; no claim of broad customer rollout." :
      bullet === "classify" ? "Technical leadership of three engineers; this does not establish formal people-management responsibility." :
      bullet === "close" ? "A team outcome, not a claim of sole attribution." : null };
});

// Every source the analysis may choose from: public résumé facts plus the published
// catalog. Selection changes with the role; existence never does.
export const evidence = [...work, ...published];

// A source id must address exactly one source: the client keys its result list on it.
if (new Set(evidence.map(item => item.id)).size !== evidence.length) throw new Error("Duplicate evidence ids in the source pool.");

// How many sources a single result may surface.
export const EVIDENCE_LIMIT = 6;

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
  // Rank by how much of the source is on-topic, not by raw match count. Résumé
  // facts carry three or four tags each and published work carries one or two, so
  // counting matches would let the résumé crowd the published catalog out of every
  // result regardless of fit. Array.sort is stable, so ties keep catalog order.
  const ranked = evidence.map(item => ({ ...item, overlap: item.capabilities.filter(id => ids.includes(id)) }))
    .filter(item => item.overlap.length > 0)
    .sort((a, b) => b.overlap.length / b.capabilities.length - a.overlap.length / a.capabilities.length);
  // There are more résumé facts than published ones and they match most roles
  // perfectly, so ranking alone pushes papers and repositories out of every result.
  // Give each kind a foothold first, then fill the rest strictly by rank. A role
  // that matches no published work simply falls through to the résumé.
  const shortlist = ranked.filter(item => Boolean(item.external) === false).slice(0, 2);
  for (const item of ranked.filter(item => item.external).slice(0, 2)) shortlist.push(item);
  const picked = [...shortlist, ...ranked.filter(item => !shortlist.includes(item))]
    .slice(0, EVIDENCE_LIMIT)
    .sort((a, b) => b.overlap.length / b.capabilities.length - a.overlap.length / a.capabilities.length);
  // At most three of these are shown, so they must lead with the requirements most
  // likely to come up first. Product delivery is deliberately last: almost every
  // role mentions it, which makes it the least discriminating question to ask.
  const prompts = [
    ...(ids.includes("agents") ? ["How would you decide which actions an agent can take, and which need review?"] : []),
    ...(ids.includes("permissions") ? ["Where should an agent fail closed rather than ask for more access?"] : []),
    ...(ids.includes("retrieval") ? ["How would you evaluate retrieval quality before adding more model complexity?"] : []),
    ...(ids.includes("ml") ? ["How would you measure the tradeoff between model quality and serving cost?"] : []),
    ...(ids.includes("fintech") ? ["What breaks first when financial data is wrong, and how would you catch it?"] : []),
    ...(ids.includes("management") ? ["How do you want this role split between building and managing?"] : []),
    ...(ids.includes("growth") ? ["Which customers would you want me talking to in the first month?"] : []),
    ...(ids.includes("design") ? ["How much of the interface work would you expect this role to own?"] : []),
    ...(ids.includes("leadership") ? ["How much technical direction comes with this role?"] : []),
    ...(ids.includes("product") ? ["What would you ship first, and what evidence would change that decision?"] : []),
  ];
  return {
    mode,
    capabilities: selected.map(({ id, label }) => ({ id, label })),
    evidence: picked,
    catalog: evidence.length,
    gaps: selected.filter(item => !ranked.some(proof => proof.overlap.includes(item.id))).map(({ id, label }) => ({ id, label })),
    prompts: [...prompts, "Which parts of this role need a deeper work sample or conversation?"].slice(0, 3),
  };
}
