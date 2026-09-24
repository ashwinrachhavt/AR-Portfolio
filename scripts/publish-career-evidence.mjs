import { readFile, mkdir, writeFile } from "node:fs/promises";
import { createEvidenceSnapshot } from "../src/lib/career-evidence.mjs";

const root = new URL("../", import.meta.url);
const readJSON = async path => JSON.parse(await readFile(new URL(path, root), "utf8"));
const [resume, manifest] = await Promise.all([
  readJSON("src/content/resume.json"), readJSON("src/content/career-evidence.json"),
]);
const snapshot = createEvidenceSnapshot(resume, manifest);
const output = JSON.stringify(snapshot, null, 2) + "\n";
const destination = new URL("src/content/generated/career-evidence.json", root);

if (process.argv.includes("--check")) {
  const current = await readFile(destination, "utf8").catch(() => null);
  if (current !== output) throw new Error("Career evidence snapshot is stale or missing. Run pnpm evidence:build and review the diff.");
  console.log(`Career evidence snapshot verified (${snapshot.items.length} public entries).`);
} else {
  await mkdir(new URL("./", destination), { recursive: true });
  await writeFile(destination, output);
  console.log(`Published ${snapshot.items.length} approved public evidence entries.`);
}
