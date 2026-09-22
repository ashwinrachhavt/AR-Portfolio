import { z } from "zod";
import { buildRoleBrief, keywordCapabilities } from "./career-fit.mjs";
import { createInMemoryWorkflowLimiter, readBoundedBody, isSameOriginBrowserRequest, PayloadTooLargeError } from "./workflow/handler.ts";
import { interpretRole, type JevStage } from "./jev.ts";
export { JEV_FREE_ACCESS_END, hasFreeJevPrice } from "./jev.ts";

export const careerFitInput = z.object({
  jobTitle: z.string().trim().max(160).optional().default(""),
  jobDescription: z.string().trim().min(100).max(8_000),
}).strict();

const sharedLimiter = createInMemoryWorkflowLimiter({ maxRequests: 8, windowMs: 60 * 60_000, maxConcurrent: 2 });
const reply = (body: unknown, status = 200) => Response.json(body, { status, headers: { "Cache-Control": "no-store" } });
const unavailable = "Live Jev is unavailable right now. Your text is still here; try again or explore an example.";

// Only capability probabilities cross the provider boundary. Evidence and final
// claims stay in code: role text -> typed signals -> catalog -> public brief.
export function createCareerFitHandler({ fetcher = fetch, env = process.env, limiter = sharedLimiter, now = Date.now, timeoutMs = 12_000 } = {}) {
  return async (request: Request) => {
    if (!isSameOriginBrowserRequest(request)) return reply({ error: "Please submit from this website." }, 403);
    if (request.headers.get("content-type")?.split(";")[0]?.trim() !== "application/json") return reply({ error: "Expected a JSON request." }, 415);
    let input: z.infer<typeof careerFitInput>;
    try {
      input = careerFitInput.parse(JSON.parse(await readBoundedBody(request, 36_000)));
    } catch (error) {
      return reply({ error: error instanceof PayloadTooLargeError ? "This request is too large." : "Add a role description between 100 and 8,000 characters." }, error instanceof PayloadTooLargeError ? 413 : 400);
    }
    if (/-----BEGIN [A-Z ]*PRIVATE KEY-----|\b(?:sk-|ghp_|github_pat_)[a-zA-Z0-9_-]{20,}/.test(`${input.jobTitle} ${input.jobDescription}`)) return reply({ error: "This looks like it contains a secret. Remove credentials before submitting." }, 400);
    const identity = request.headers.get("x-vercel-forwarded-for")?.split(",")[0]?.trim() || "anonymous";
    const lease = limiter.acquire(identity.slice(0, 128));
    if (!lease) return reply({ error: "This explorer is busy. Please try again later; the examples still work." }, 429);
    const execute = async (signal: AbortSignal, onStage: (stage: JevStage) => void = () => {}) => {
      const text = `${input.jobTitle}\n${input.jobDescription}`;
      const result = await interpretRole(text, { env, fetcher, signal, now, onStage });
      return result ? { ...buildRoleBrief(result.ids, "jev"), analysis: result.analysis } : buildRoleBrief(keywordCapabilities(text), "keyword");
    };
    if (request.headers.get("accept")?.includes("application/x-ndjson")) {
      const abort = new AbortController();
      const signal = AbortSignal.any([request.signal, abort.signal, AbortSignal.timeout(timeoutMs)]);
      let closed = false;
      const encoder = new TextEncoder();
      const stream = new ReadableStream({
        start(controller) {
          const send = (event: unknown) => { if (!closed) controller.enqueue(encoder.encode(JSON.stringify(event) + "\n")); };
          // Status events follow actual server work, never a simulated timer.
          void execute(signal, stage => send({ type: "status", stage }))
            .then(brief => send({ type: "result", brief }))
            .catch(() => send({ type: "error", error: unavailable }))
            .finally(() => { lease.release(); if (!closed) { closed = true; controller.close(); } });
        },
        cancel() { closed = true; abort.abort(); },
      });
      return new Response(stream, { headers: { "Content-Type": "application/x-ndjson", "Cache-Control": "no-store, no-transform", "X-Accel-Buffering": "no" } });
    }
    try { return reply(await execute(AbortSignal.any([request.signal, AbortSignal.timeout(timeoutMs)]))); }
    catch { return reply({ error: unavailable }, 503); }
    finally { lease.release(); }
  };
}
