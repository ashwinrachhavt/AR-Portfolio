import { defineTool } from "eve/tools";
import { z } from "zod";
import { getPublicProfile } from "../lib/public-profile.ts";

export default defineTool({
  description: "Return only approved public positioning, education, research, and contact facts from the canonical resume.",
  inputSchema: z.strictObject({}),
  execute: getPublicProfile,
});
