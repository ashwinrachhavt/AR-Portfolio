import { defineAgent } from "eve";

export default defineAgent({
  model: "openai/gpt-4.1-mini",
  reasoning: "low",
  limits: {
    maxInputTokensPerSession: 80_000,
    maxOutputTokensPerSession: 8_000,
    sessionTimeoutMs: 24 * 60 * 60 * 1_000,
  },
});
