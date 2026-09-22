import "server-only";
import { cache } from "react";
import { unstable_cache } from "next/cache";
import { getBlogIndex } from "./blog.server";
import { writingSources } from "./writing-sources.mjs";
import { fetchWritingFeed, mergeWriting } from "./writing-model.mjs";

// Cache successful parsed results, not error pages or empty fallback responses.
const getSourcePosts = unstable_cache(fetchWritingFeed, ["external-writing-v1"], { revalidate: 3600, tags: ["external-writing"] });

export const getWritingIndex = cache(async () => {
  const sources = writingSources();
  const [originals, results] = await Promise.all([
    getBlogIndex(),
    Promise.allSettled(sources.map(source => getSourcePosts(source))),
  ]);
  const external = [];
  const unavailableSources = [];
  results.forEach((result, index) => {
    if (result.status === "fulfilled") external.push(...result.value);
    else {
      unavailableSources.push(sources[index].name);
      console.warn(`Writing feed unavailable: ${sources[index].id}`);
    }
  });
  return { posts: mergeWriting(originals, external), unavailableSources };
});
