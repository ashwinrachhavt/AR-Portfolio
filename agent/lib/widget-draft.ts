import { z } from "zod";
import { getKnowledge } from "../../src/lib/knowledge.mjs";
import { knowledgeId } from "./knowledge-schemas.ts";

const plainText = z.string().trim().min(1).max(600)
  .refine((value) => !/<\/?[a-z]|```|javascript:/i.test(value), "Use plain text; executable markup is not supported.");

export const widgetDraftSchema = z.strictObject({
  type: z.enum(["evidence-cards", "comparison-table", "process-steps", "checklist"]),
  title: plainText.max(120),
  purpose: plainText,
  items: z.array(z.strictObject({
    label: plainText.max(120),
    text: plainText,
    evidenceIds: z.array(knowledgeId).min(1).max(5),
  })).min(2).max(8),
});

export function proposeWidget(input: z.infer<typeof widgetDraftSchema>) {
  const widget = widgetDraftSchema.parse(input);
  const ids = [...new Set(widget.items.flatMap((item) => item.evidenceIds))];
  const evidence = ids.map((id) => {
    const record = getKnowledge(id);
    if (!record || record.status !== "public") {
      throw new Error(`No approved public evidence exists for ${id}.`);
    }
    return { id: record.id, title: record.title, source: record.source };
  });
  return {
    status: "draft",
    notice: "Evidence links exist; claim accuracy still needs human review. A developer must add reviewed component code and content before rendering or publication.",
    widget,
    evidence,
  };
}
