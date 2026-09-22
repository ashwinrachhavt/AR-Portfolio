import { generateWorkflowBrief, WorkflowGenerationError } from "./generate.ts";
import {
  hasRequiredHumanStep,
  workflowBriefSchema,
  workflowInputSchema,
  type WorkflowBrief,
  type WorkflowInput,
} from "./schema.ts";

export const MAX_REQUEST_BYTES = 24 * 1_024;

type WorkflowGenerator = (
  input: WorkflowInput,
  options?: { signal?: AbortSignal },
) => Promise<WorkflowBrief>;

type LimiterLease = { release: () => void };

export type WorkflowLimiter = {
  acquire: (key: string) => LimiterLease | null;
};

type LimiterOptions = {
  maxRequests?: number;
  windowMs?: number;
  maxConcurrent?: number;
  maxTrackedClients?: number;
  now?: () => number;
};

export function createInMemoryWorkflowLimiter(options: LimiterOptions = {}): WorkflowLimiter {
  const maxRequests = options.maxRequests ?? 5;
  const windowMs = options.windowMs ?? 10 * 60_000;
  const maxConcurrent = options.maxConcurrent ?? 2;
  const maxTrackedClients = options.maxTrackedClients ?? 1_000;
  const now = options.now ?? Date.now;
  const requests = new Map<string, number[]>();
  let active = 0;

  const prune = (timestamp: number) => {
    const cutoff = timestamp - windowMs;
    for (const [key, entries] of requests) {
      const current = entries.filter((entry) => entry > cutoff);
      if (current.length === 0) requests.delete(key);
      else if (current.length !== entries.length) requests.set(key, current);
    }
  };

  return {
    acquire(key) {
      const timestamp = now();
      prune(timestamp);
      if (active >= maxConcurrent) return null;

      const prior = requests.get(key) ?? [];
      if (prior.length >= maxRequests) return null;
      if (!requests.has(key) && requests.size >= maxTrackedClients) {
        const oldestKey = requests.keys().next().value;
        if (typeof oldestKey === "string") requests.delete(oldestKey);
      }
      requests.set(key, [...prior, timestamp]);
      active += 1;

      let released = false;
      return {
        release() {
          if (released) return;
          released = true;
          active = Math.max(0, active - 1);
        },
      };
    },
  };
}

const sharedLimiter = createInMemoryWorkflowLimiter();

class PayloadTooLargeError extends Error {}

function jsonResponse(payload: unknown, status: number, extraHeaders?: HeadersInit): Response {
  return Response.json(payload, {
    status,
    headers: {
      "cache-control": "no-store",
      ...extraHeaders,
    },
  });
}

function isSameOriginBrowserRequest(request: Request): boolean {
  const fetchSite = request.headers.get("sec-fetch-site");
  if (fetchSite === "cross-site") return false;

  const origin = request.headers.get("origin");
  if (!origin) return true;
  try {
    return new URL(origin).origin === new URL(request.url).origin;
  } catch {
    return false;
  }
}

function requestIdentity(request: Request): string {
  const vercelForwarded = request.headers.get("x-vercel-forwarded-for")?.split(",", 1)[0]?.trim();
  const forwarded = request.headers.get("x-forwarded-for")?.split(",", 1)[0]?.trim();
  const identity = vercelForwarded || forwarded || request.headers.get("x-real-ip")?.trim() || "anonymous";
  return identity.slice(0, 128);
}

async function readBoundedBody(request: Request, limit: number): Promise<string> {
  const contentLength = request.headers.get("content-length");
  if (contentLength && /^\d+$/.test(contentLength) && Number(contentLength) > limit) {
    throw new PayloadTooLargeError();
  }
  if (!request.body) return "";

  const reader = request.body.getReader();
  const decoder = new TextDecoder("utf-8", { fatal: true });
  let bytesRead = 0;
  let body = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    bytesRead += value.byteLength;
    if (bytesRead > limit) {
      await reader.cancel().catch(() => undefined);
      throw new PayloadTooLargeError();
    }
    body += decoder.decode(value, { stream: true });
  }
  body += decoder.decode();
  return body;
}

type HandlerOptions = {
  generate?: WorkflowGenerator;
  limiter?: WorkflowLimiter;
  maxRequestBytes?: number;
};

export function createWorkflowHandler(options: HandlerOptions = {}) {
  const generate = options.generate ?? generateWorkflowBrief;
  const limiter = options.limiter ?? sharedLimiter;
  const maxRequestBytes = options.maxRequestBytes ?? MAX_REQUEST_BYTES;

  return async function workflowHandler(request: Request): Promise<Response> {
    if (!isSameOriginBrowserRequest(request)) {
      return jsonResponse({ error: "Cross-origin requests are not allowed." }, 403);
    }

    const mediaType = request.headers.get("content-type")?.split(";", 1)[0]?.trim().toLowerCase();
    if (mediaType !== "application/json") {
      return jsonResponse({ error: "Content-Type must be application/json." }, 415);
    }

    let body: string;
    try {
      body = await readBoundedBody(request, maxRequestBytes);
    } catch (error) {
      if (error instanceof PayloadTooLargeError) {
        return jsonResponse({ error: "Request body is too large." }, 413);
      }
      return jsonResponse({ error: "The request body could not be read." }, 400);
    }

    let decoded: unknown;
    try {
      decoded = JSON.parse(body);
    } catch {
      return jsonResponse({ error: "Request body must be valid JSON." }, 400);
    }

    const input = workflowInputSchema.safeParse(decoded);
    if (!input.success) {
      return jsonResponse({
        error: "Please correct the highlighted fields.",
        fieldErrors: input.error.flatten().fieldErrors,
      }, 400);
    }

    const lease = limiter.acquire(requestIdentity(request));
    if (!lease) {
      return jsonResponse(
        { error: "Too many requests are in progress. Please wait and try again." },
        429,
        { "retry-after": "60" },
      );
    }

    try {
      const generated = await generate(input.data, { signal: request.signal });
      const brief = workflowBriefSchema.safeParse(generated);
      if (!brief.success || !hasRequiredHumanStep(input.data, brief.data)) {
        return jsonResponse({ error: "The workflow brief could not be generated. Please try again." }, 502);
      }
      return jsonResponse({ brief: brief.data }, 200);
    } catch (error) {
      if (error instanceof WorkflowGenerationError) {
        if (error.kind === "configuration") {
          return jsonResponse({ error: "Workflow generation is temporarily unavailable." }, 503);
        }
        if (error.kind === "timeout") {
          return jsonResponse({ error: "Workflow generation timed out. Please try again." }, 504);
        }
        if (error.kind === "cancelled") {
          return jsonResponse({ error: "Workflow generation was cancelled." }, 499);
        }
        return jsonResponse({ error: "The workflow brief could not be generated. Please try again." }, 502);
      }
      if (request.signal.aborted) {
        return jsonResponse({ error: "Workflow generation was cancelled." }, 499);
      }
      return jsonResponse({ error: "Workflow generation failed. Please try again." }, 500);
    } finally {
      lease.release();
    }
  };
}
