import { defineAgent } from "eve";
import { createOpenAI } from "@ai-sdk/openai";
import { createLocalOnlyFetch, getLocalModelConfig } from "../src/lib/eve-local-config.mjs";

const local = getLocalModelConfig();
const ollama = createOpenAI({
  name: "ollama-local",
  baseURL: local.baseURL,
  apiKey: "unused-local-only",
  fetch: createLocalOnlyFetch(local),
});

export default defineAgent({
  description: "Local research and authoring assistant for approved public portfolio knowledge.",
  model: ollama.chat(local.model),
  reasoning: "none",
  // Eve 0.63 needs an explicit context bound for models outside its catalog.
  modelContextWindowTokens: 8_192,
  defaultTools: false,
  tool: false,
  limits: {
    maxInputTokensPerSession: 32_000,
    maxOutputTokensPerSession: 4_000,
    sessionTimeoutMs: 2 * 60 * 60 * 1_000,
  },
});
