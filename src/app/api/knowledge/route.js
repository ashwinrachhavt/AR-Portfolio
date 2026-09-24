import { searchKnowledge, getKnowledge, relatedKnowledge, knowledgeRevision } from "../../../lib/knowledge.mjs";
import { kinds, topicIds } from "../../../lib/knowledge-schema.mjs";

export function GET(request) {
  const params = new URL(request.url).searchParams;
  const query = params.get("q") || "";
  const id = params.get("id");
  const related = params.get("related");
  const kind = params.get("kind") || undefined;
  const topic = params.get("topic") || undefined;
  const limit = Number(params.get("limit") || 8);
  if (query.length > 500 || !Number.isInteger(limit) || limit < 1 || limit > 30 || (kind && !kinds.includes(kind)) || (topic && !topicIds.includes(topic)) || [id, related].some(value => value && !/^[a-z0-9][a-z0-9-]{0,150}$/.test(value))) {
    return Response.json({ error: "Invalid query. Use q (max 500 characters), id, or related; limit 1–30; documented topic and kind filters." }, { status: 400 });
  }
  const record = id ? getKnowledge(id) : null;
  if ((id && !record) || (related && !getKnowledge(related))) return Response.json({ error: "Public record not found" }, { status: 404 });
  const data = id ? { record } : related ? { records: relatedKnowledge(related, limit) } : { results: searchKnowledge({ query, kind, topic, limit }) };
  return Response.json({ schemaVersion: 1, revision: knowledgeRevision, mode: "lexical-and-relations", ...data }, { headers: { "Cache-Control": "public, max-age=300", "Access-Control-Allow-Origin": "*", "X-Content-Type-Options": "nosniff" } });
}
