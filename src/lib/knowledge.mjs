import catalog from "../content/knowledge/catalog.json" with { type: "json" };
import { rankKnowledge, findRelated } from "./knowledge-search.mjs";

export const knowledge = catalog.records;
export const knowledgeRevision = catalog.revision;
export function searchKnowledge(options = {}) { return rankKnowledge(knowledge, { ...options, limit: Math.min(30, options.limit || 12) }); }
export function getKnowledge(id) { return knowledge.find(record => record.id === id && record.status === "public") || null; }
export function relatedKnowledge(id, limit = 6) { return findRelated(knowledge, id, limit); }
