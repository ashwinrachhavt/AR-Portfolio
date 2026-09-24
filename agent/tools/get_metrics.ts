import { defineTool } from "eve/tools";
import { z } from "zod";
import { profile } from "../../src/data/profile";

export default defineTool({
  description:
    "Return only recruiter-safe, approved metrics. Do not invent additional numbers.",
  inputSchema: z.object({}),
  execute() {
    return {
      approved: profile.metrics,
      doNotUseWithoutConfirmation: [
        "Classify AI contribution to bookkeeping MRR growth from $500K to $1.2M",
        "$15M+ cash-underwriting figure",
        "Final Outreach deployment-time metric",
      ],
    };
  },
});
