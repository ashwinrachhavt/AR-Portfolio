import { defineTool } from "eve/tools";
import { z } from "zod";
import { getPublicExperience } from "../lib/public-profile.ts";

export default defineTool({
  description: "Return approved resume experience, optionally filtered by company. An unknown company returns no results.",
  inputSchema: z.strictObject({ company: z.string().trim().min(1).max(100).optional() }),
  execute: ({ company }) => getPublicExperience(company),
});
