import { rankKnowledge } from "./knowledge-search.mjs";

export const assistantStarters = [
  { label: "Explore the work", question: "What did you build with Classify AI?", icon: "work" },
  { label: "Learn something", question: "How should agents check permissions?", icon: "learn" },
  { label: "Find a useful idea", question: "How can retrieval help learning?", icon: "idea" },
];

/** Source search deliberately retrieves passages, never fabricates a generated answer. */
export function evidenceReply(records, query, semanticScores) {
  const seen = new Set();
  const results = (query.trim() ? rankKnowledge(records, { query, semanticScores, limit: records.length }) : []).filter(({ record, excerpt }) => {
    const passage = excerpt.toLocaleLowerCase().replace(/\s+/g, " ").trim();
    if (record.kind === "concept" || seen.has(passage)) return false;
    seen.add(passage);
    return true;
  }).slice(0, 3);
  return {
    text: results.length ? "These passages may help. Open a source for the full context." : "I couldn’t find a useful passage for that question. Try a project name, permissions, bank connections, or learning.",
    sources: results.map(({ record, excerpt, match }) => ({ id: record.id, title: record.title, excerpt, match, sourceTitle: record.source.title })),
  };
}

export function messageText(message) {
  return (message.parts || []).filter(part => part.type === "text" && part.text).map(part => part.text).join("\n");
}

/** Only verified local citations become clickable in model-written Markdown. */
export function approvedCitation(href, records) {
  if (typeof href !== "string") return undefined;
  return records.some(record => href === `/knowledge/${record.id}` || (record.source.url.startsWith("/") && href === record.source.url)) ? href : undefined;
}
