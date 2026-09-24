import { defineTool } from "eve/tools";
import { z } from "zod";
import { projectsData } from "../../src/data/profile";

export default defineTool({
  description: "Return selected projects from Ashwin's portfolio.",
  inputSchema: z.object({}),
  execute() {
    return projectsData.map((project) => ({
      title: project.title,
      description: project.description,
      tags: project.tag,
      url: project.gitUrl,
    }));
  },
});
