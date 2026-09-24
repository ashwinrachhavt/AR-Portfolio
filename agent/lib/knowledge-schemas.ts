import { z } from "zod";

export const knowledgeId = z.string().trim().min(1).max(160).regex(/^[a-z0-9][a-z0-9._:/-]*$/);
export const knowledgeKind = z.enum(["concept", "note", "project", "experience", "publication", "reference"]);
export const knowledgeTopic = z.enum(["agents", "retrieval", "fintech", "infrastructure", "learning", "product"]);
export const resultLimit = z.number().int().min(1).max(10).default(5);
