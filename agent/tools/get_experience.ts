import { defineTool } from "eve/tools";
import { z } from "zod";
import { experienceData } from "../../src/data/profile";

export default defineTool({
  description:
    "Return Ashwin's work experience, optionally filtered by company name.",
  inputSchema: z.object({
    company: z
      .string()
      .optional()
      .describe("Optional company name such as Loan Labs, Finally, UNAR Labs, or Outreach."),
  }),
  execute({ company }) {
    if (!company) {
      return experienceData;
    }

    const needle = company.toLowerCase();
    const matches = experienceData.filter((role) =>
      role.company.toLowerCase().includes(needle)
    );

    return matches.length > 0 ? matches : experienceData;
  },
});
