import { defineTool } from "eve/tools";
import { z } from "zod";
import { profile } from "../../src/data/profile";

export default defineTool({
  description:
    "Return Ashwin Rachha's positioning, target roles, education, and contact links.",
  inputSchema: z.object({}),
  execute() {
    return {
      name: profile.name,
      headline: profile.headline,
      targetRoles: profile.targetRoles,
      industries: profile.industries,
      locationFocus: profile.locationFocus,
      workAuthorization: profile.workAuthorization,
      education: profile.education,
      contact: profile.contact,
    };
  },
});
