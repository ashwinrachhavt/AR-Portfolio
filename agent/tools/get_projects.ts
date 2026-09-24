import { defineTool } from "eve/tools";
import { z } from "zod";
import { searchKnowledge } from "../../src/lib/knowledge.mjs";
import { resultLimit } from "../lib/knowledge-schemas.ts";

export default defineTool({
  description: "Return public project records and evidence from the shared knowledge corpus, optionally filtered by a search phrase.",
  inputSchema: z.strictObject({ query: z.string().trim().max(300).default(""), limit: resultLimit.default(10) }),
  execute({ query, limit }) {
    return searchKnowledge({ query, kind: "project", limit }).map(({ record }) => record);
  },
});
