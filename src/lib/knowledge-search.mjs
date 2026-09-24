export const topics = [
  { id: "agents", title: "Agents & trust", description: "Identity, permissions, and work that survives a retry.", color: "#a5cfff" },
  { id: "retrieval", title: "Retrieval & context", description: "The right evidence, at the right moment.", color: "#a0d9cd" },
  { id: "fintech", title: "Financial systems", description: "From bank connections to decisions you can audit.", color: "#e0c89a" },
  { id: "infrastructure", title: "Reliable infrastructure", description: "The systems beneath a useful product.", color: "#b6c9e0" },
  { id: "learning", title: "Learning & access", description: "Technology that helps more people participate.", color: "#bccac9" },
  { id: "product", title: "Product thinking", description: "Make the system understandable to the person using it.", color: "#bdcfa9" },
];

const stop = new Set("a about an and are as at be by can could do does for from how i in is it its keep me my of on or our please should show that the their this to was we what when where which with would you your".split(" "));
export function tokens(text) { return (String(text).toLowerCase().match(/[\p{L}\p{N}]+/gu) || []).filter(word => word.length > 1 && !stop.has(word)).map(word => word.length > 4 && /s$/.test(word) && !/(ss|us|is)$/.test(word) ? word.slice(0, -1) : word); }
export function embeddingText(record) {
  const themes = topics.filter(topic => record.topics.includes(topic.id)).map(topic => topic.title).join(", ");
  return `${record.title}. ${record.summary}\nThemes: ${themes}\n${record.body === record.summary ? "" : record.body}`.slice(0, 1600);
}
export function excerptFor(record, query) {
  const terms = tokens(query);
  // Preserve the explanation around a matching sentence, including its caveats.
  const passages = record.body.split(/\n\n/).filter(text => text.trim());
  const ranked = passages.map((text, i) => ({ text, i, score: terms.filter(term => text.toLowerCase().includes(term)).length })).sort((a, b) => b.score - a.score || a.i - b.i);
  const text = ranked[0]?.text || record.summary;
  return text.length > 440 ? `${text.slice(0, 437)}…` : text;
}

export function rankKnowledge(records, { query = "", topic, kind, limit = 12, semanticScores } = {}) {
  const terms = [...new Set(tokens(query.slice(0, 500)))];
  if (query.trim() && !terms.length) return [];
  const filtered = records.filter(r => r.status === "public" && (!topic || r.topics.includes(topic)) && (!kind || r.kind === kind));
  const frequencies = new Map(terms.map(term => [term, filtered.filter(r => tokens(`${r.title} ${r.summary} ${r.body}`).includes(term)).length]));
  return filtered.map(record => {
    const title = tokens(record.title), summary = tokens(record.summary), body = tokens(record.body);
    let lexical = 0, matches = 0;
    for (const term of terms) {
      const weight = Math.log(1 + (filtered.length + 1) / (1 + frequencies.get(term)));
      const hit = title.includes(term) ? 3 : summary.includes(term) ? 2 : body.includes(term) ? 1 : 0;
      if (hit) { matches++; lexical += hit * weight; }
    }
    lexical *= (terms.length ? matches / terms.length : 1) * ({ publication: .65, reference: .8, concept: .85, note: 1.1, experience: 1.15 }[record.kind] || 1);
    const semantic = Number.isFinite(semanticScores?.[record.id]) ? semanticScores[record.id] : 0;
    const score = lexical + (semantic >= .32 ? semantic * 4 : 0);
    return { record, score, excerpt: excerptFor(record, query), match: semantic >= .32 ? (lexical ? "hybrid" : "semantic") : (terms.length ? "keyword" : "browse") };
  }).filter(result => !terms.length || result.score > 0)
    .sort((a, b) => b.score - a.score || (a.record.kind === "concept") - (b.record.kind === "concept") || a.record.title.localeCompare(b.record.title))
    .slice(0, Math.min(2000, Math.max(1, Number.isFinite(limit) ? Math.floor(limit) : 12)));
}

export function findRelated(records, id, limit = 6) {
  const current = records.find(record => record.id === id && record.status === "public");
  if (!current) return [];
  return records.filter(record => record.status === "public" && record.id !== id).map(record => ({ record, score: current.relations.some(r => r.target === record.id) || record.relations.some(r => r.target === id) ? 20 : current.topics.filter(topic => record.topics.includes(topic)).length }))
    .filter(item => item.score > 0).sort((a, b) => b.score - a.score || a.record.id.localeCompare(b.record.id)).slice(0, Math.min(12, Math.max(1, limit))).map(item => item.record);
}
