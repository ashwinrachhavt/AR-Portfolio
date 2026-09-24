import { defineTool } from "eve/tools";
import { z } from "zod";
import { relatedKnowledge } from "../../src/lib/knowledge.mjs";
import { knowledgeId, resultLimit } from "../lib/knowledge-schemas.ts";

export default defineTool({
  description: "Find a bounded set of public records connected to an existing knowledge ID. Relationships are discovery leads, not proof of a claim.",
  inputSchema: z.strictObject({ id: knowledgeId, limit: resultLimit }),
  execute: ({ id, limit }) => relatedKnowledge(id, limit),
});
