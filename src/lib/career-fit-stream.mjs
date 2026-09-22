// The model returns typed decisions as one response. This stream reports actual
// request stages, followed by that validated result; it never fabricates tokens.
function validateBrief(brief) {
  const topic = item => item && typeof item.id === "string" && typeof item.label === "string";
  const list = (items, check) => Array.isArray(items) && items.every(check);
  const text = value => typeof value === "string";
  const analysis = brief?.analysis;
  const validAnalysis = brief?.mode !== "jev" || (analysis && ["venice", "vercel"].includes(analysis.provider) && Number.isFinite(analysis.durationMs) && analysis.durationMs >= 0 && list(analysis.signals, item => topic(item) && Number.isFinite(item.probability) && item.probability >= 0 && item.probability <= 1));
  if (!brief || !["jev", "keyword"].includes(brief.mode) || !validAnalysis ||
    !list(brief.capabilities, topic) || !list(brief.gaps, topic) || !list(brief.prompts, text) ||
    !list(brief.evidence, item => item && ["id", "company", "title", "claim", "href"].every(key => text(item[key])) && (item.limitation == null || text(item.limitation)) && list(item.overlap, text))) {
    throw new Error("The live response was interrupted or incomplete. Please try again.");
  }
  return brief;
}

export async function readCareerFitResponse(response, onStage = () => {}) {
  if (!response.ok || !response.headers.get("content-type")?.includes("application/x-ndjson")) {
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "The explorer is unavailable. Please try again.");
    return validateBrief(data);
  }
  if (!response.body) throw new Error("The live response was interrupted. Please try again.");
  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "", bytes = 0, result;
  const consume = line => {
    if (!line.trim()) return;
    const event = JSON.parse(line);
    if (event.type === "error") throw new Error(event.error || "Live Jev is unavailable. Please try again.");
    if (event.type === "status" && ["checking", "interpreting", "matching"].includes(event.stage)) onStage(event.stage);
    if (event.type === "result") result = event.brief;
  };
  try {
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      bytes += value.byteLength;
      if (bytes > 128_000) throw new Error("The live response was too large. Please try again.");
      buffer += decoder.decode(value, { stream: true });
      let newline;
      while ((newline = buffer.indexOf("\n")) !== -1) { consume(buffer.slice(0, newline)); buffer = buffer.slice(newline + 1); }
    }
    consume(buffer + decoder.decode());
    return validateBrief(result);
  } finally { await reader.cancel().catch(() => {}); reader.releaseLock(); }
}
