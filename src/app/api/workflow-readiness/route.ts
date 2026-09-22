import { createWorkflowHandler } from "@/lib/workflow/handler";

export const maxDuration = 60;

const handler = createWorkflowHandler();

export async function POST(request: Request): Promise<Response> {
  return handler(request);
}
