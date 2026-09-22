import publications from "../content/published-writing.json" with { type: "json" };
import { estimateReadingTime } from "./blog-model.mjs";

export function localWritingIndex() { return publications.map(article => article.post); }
export function localArticle(id) {
  const article = publications.find(entry => entry.post.id === id);
  return article ? { ...article, readingTime: estimateReadingTime(article.markdown) } : null;
}
export function mergeOriginals(remote) {
  const local = localWritingIndex();
  const ids = new Set(local.map(post => post.id));
  return [...local, ...remote.filter(post => !ids.has(post.id))].sort((a, b) => b.date.localeCompare(a.date));
}
