import { pipeline, env } from "@huggingface/transformers";
import { embeddingText } from "../../lib/knowledge-search.mjs";

env.allowLocalModels = false;
env.backends.onnx.wasm.numThreads = 1;
let extractor;
let vectors = [];
let ids = [];
let latestRequest = 0;

self.addEventListener("message", async ({ data }) => {
  try {
    if (data.type === "init") {
      extractor = await pipeline("feature-extraction", "Xenova/all-MiniLM-L6-v2", {
        revision: "751bff37182d3f1213fa05d7196b954e230abad9",
        dtype: "q8", device: "wasm",
        progress_callback: progress => {
          if (progress.status === "progress") self.postMessage({ type: "progress", message: `Downloading search model · ${Math.round(progress.progress || 0)}%` });
        },
      });
      ids = data.records.map(record => record.id);
      for (let i = 0; i < data.records.length; i += 8) {
        const output = await extractor(data.records.slice(i, i + 8).map(embeddingText), { pooling: "mean", normalize: true });
        vectors.push(...output.tolist());
        self.postMessage({ type: "progress", message: `Connecting the collection · ${Math.min(i + 8, ids.length)} / ${ids.length}` });
      }
      self.postMessage({ type: "ready" });
    }
    if (data.type === "query" && extractor && vectors.length === ids.length) {
      latestRequest = data.requestId;
      const output = await extractor(data.query.slice(0, 500), { pooling: "mean", normalize: true });
      if (data.requestId !== latestRequest) return;
      const query = output.tolist()[0];
      const scores = Object.fromEntries(vectors.map((vector, index) => [ids[index], vector.reduce((sum, value, i) => sum + value * query[i], 0)]));
      self.postMessage({ type: "results", query: data.query, scores, requestId: data.requestId });
    }
  } catch {
    self.postMessage({ type: "error", message: "Semantic search could not load on this device. Keyword search is still available." });
  }
});
