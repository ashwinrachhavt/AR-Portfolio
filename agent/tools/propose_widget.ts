import { defineTool } from "eve/tools";
import { proposeWidget, widgetDraftSchema } from "../lib/widget-draft.ts";

export default defineTool({
  description: "Validate and return a data-only widget draft using vetted types and existing public evidence IDs. Does not execute, render, save, or publish anything. Existence of a citation does not validate a claim.",
  inputSchema: widgetDraftSchema,
  execute: proposeWidget,
});
