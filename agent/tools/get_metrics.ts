import { defineTool } from "eve/tools";
import { z } from "zod";
import { getPublicMetrics } from "../lib/public-profile.ts";

export default defineTool({
  description: "Return approved quantitative evidence directly from resume bullets, preserving team attribution and approximate outcomes.",
  inputSchema: z.strictObject({}),
  execute: getPublicMetrics,
});
