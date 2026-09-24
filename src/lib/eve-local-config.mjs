export const LOCAL_MODELS = Object.freeze(["portfolio-qwen3.5:4b", "qwen3.5:4b", "qwen3:8b", "qwen3:1.7b"]);

/** Resolve only the explicitly supported local Ollama configuration. */
export function getLocalModelConfig(env = process.env) {
  const url = new URL(env.EVE_OLLAMA_BASE_URL || "http://127.0.0.1:11434/v1");
  if (
    !["http:", "https:"].includes(url.protocol) ||
    !["localhost", "127.0.0.1", "[::1]"].includes(url.hostname) ||
    url.username || url.password || url.search || url.hash ||
    !["/v1", "/v1/"].includes(url.pathname)
  ) {
    throw new Error("Eve requires a loopback Ollama URL ending in /v1, without credentials or query parameters.");
  }
  // Use an IP literal rather than a configurable localhost DNS answer.
  if (url.hostname === "localhost") url.hostname = "127.0.0.1";
  const model = env.EVE_OLLAMA_MODEL || LOCAL_MODELS[0];
  if (!LOCAL_MODELS.includes(model)) {
    throw new Error(`EVE_OLLAMA_MODEL must be an approved local model: ${LOCAL_MODELS.join(", ")}.`);
  }
  return Object.freeze({ baseURL: url.href.replace(/\/$/, ""), model, enabled: env.EVE_LOCAL_ENABLED === "1" });
}

/** Every model request passes this boundary, including SDK retries. */
export function createLocalOnlyFetch(config, fetchImpl = globalThis.fetch) {
  const expectedURL = `${config.baseURL}/chat/completions`;
  return async (input, init) => {
    if (!config.enabled) {
      throw new Error("Local inference is disabled. Set EVE_LOCAL_ENABLED=1 to opt in; no paid fallback is configured.");
    }
    const request = new Request(input, init);
    if (request.url !== expectedURL || request.method !== "POST") {
      throw new Error("Only the configured local Ollama chat-completions endpoint is allowed.");
    }
    const headers = new Headers(request.headers);
    headers.delete("authorization");
    headers.delete("openai-organization");
    headers.delete("openai-project");
    return fetchImpl(new Request(request, { headers, redirect: "error" }));
  };
}
