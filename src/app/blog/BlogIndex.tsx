"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { formatBlogDate } from "../../lib/blog-model.mjs";
import { curatedArticles, CuratedArticle } from "@/data/writingCatalog";
import styles from "./blog.module.css";

const TAXONOMY_SECTIONS = [
  "All",
  "Research",
  "Work / Projects",
  "Philosophy",
  "AI",
  "Startups",
  "Personal projects",
  "Tutorials / Blogs",
  "Ideas / Insights",
] as const;

type TaxonomyCategory = (typeof TAXONOMY_SECTIONS)[number];

export default function BlogIndex({ posts = [] }: { posts?: any[] }) {
  const [activeCategory, setActiveCategory] = useState<TaxonomyCategory>("All");
  const [query, setQuery] = useState("");

  // Merge curated articles with any Notion remote posts not already in curated list
  const allArticles: CuratedArticle[] = useMemo(() => {
    const list = [...curatedArticles];
    const existingIds = new Set(list.map((a) => a.id));

    posts.forEach((p) => {
      if (!existingIds.has(p.id)) {
        list.push({
          id: p.id,
          title: p.title,
          href: p.href || `/blog/${p.id}`,
          date: p.date,
          description: p.description || "",
          categories: ["Ideas / Insights", "AI"],
          tags: p.tags || [],
          sourceName: p.sourceName || "Writing",
          external: p.external,
        });
      }
    });

    return list.sort((a, b) => b.date.localeCompare(a.date));
  }, [posts]);

  // Filter based on active taxonomy category & search query
  const visible = useMemo(() => {
    return allArticles.filter((art) => {
      // Category match
      const categoryMatch =
        activeCategory === "All" || art.categories.includes(activeCategory as any);

      // Query match
      const q = query.trim().toLowerCase();
      const queryMatch =
        !q ||
        art.title.toLowerCase().includes(q) ||
        art.description.toLowerCase().includes(q) ||
        art.tags.some((t) => t.toLowerCase().includes(q));

      return categoryMatch && queryMatch;
    });
  }, [allArticles, activeCategory, query]);

  return (
    <section aria-label="Writing archive" className={styles.archive}>
      {/* Master's Thesis Spotlight Banner */}
      <div className={styles.thesisSpotlight}>
        <div className={styles.thesisLeft}>
          <div className={styles.thesisTopRow}>
            <span className={styles.thesisBadge}>MASTER&apos;S THESIS SPOTLIGHT · VIRGINIA TECH</span>
            <span className={styles.scholarCitations}>130+ Citations · 4.0 GPA</span>
          </div>
          <h2 className={styles.thesisMainTitle}>
            Gurukul: LLM-Enhanced CS Education & Adaptive Socratic Guardrails
          </h2>
          <p className={styles.thesisSummary}>
            My Master&apos;s Thesis at Virginia Tech investigated transforming generative AI from an answers-on-demand cheat engine into a rigorous Socratic tutor. Published in IEEE FIE 2024 and IEEE SoutheastCon 2023.
          </p>
          <div className={styles.thesisActions}>
            <Link href="/blog/gurukul-thesis" className={styles.thesisPrimaryBtn}>
              Read Thesis Deep Dive & Interactive Simulator →
            </Link>
            <a
              href="https://vtechworks.lib.vt.edu/items/3d08a8cd-effe-4e41-9830-0204637e53da"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.thesisSecondaryBtn}
            >
              VTechWorks PDF ↗
            </a>
            <a
              href="https://scholar.google.com/citations?user=opsMRzEAAAAJ"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.thesisSecondaryBtn}
            >
              Google Scholar Profile ↗
            </a>
          </div>
        </div>
      </div>

      {/* Taxonomy Categories Tabs */}
      <div className={styles.categoryNav} role="tablist" aria-label="Writing sections">
        {TAXONOMY_SECTIONS.map((sec) => (
          <button
            key={sec}
            type="button"
            role="tab"
            aria-selected={activeCategory === sec}
            className={`${styles.categoryTab} ${activeCategory === sec ? styles.categoryTabActive : ""}`}
            onClick={() => setActiveCategory(sec)}
          >
            {sec}
          </button>
        ))}
      </div>

      {/* Search & Counter Toolbar */}
      <div className={styles.toolbar}>
        <h2>
          {activeCategory} <span>{String(visible.length).padStart(2, "0")}</span>
        </h2>
        <div className={styles.controls}>
          <div className={styles.search}>
            <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <circle cx="10.5" cy="10.5" r="6.5" />
              <path d="m16 16 4 4" />
            </svg>
            <label className={styles.srOnly} htmlFor="writing-search">Search writing</label>
            <input
              id="writing-search"
              type="search"
              placeholder="Filter by concept, keyword, or tag…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          {query && (
            <button type="button" className={styles.clearBtn} onClick={() => setQuery("")}>
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Post List */}
      <div className={styles.postList}>
        {visible.map((post) => {
          const isExt = post.external;
          return (
            <article key={post.id} className={styles.articleCard}>
              {isExt ? (
                <a href={post.href} target="_blank" rel="noopener noreferrer" className={styles.postLink}>
                  <time className={styles.date} dateTime={post.date}>
                    {formatBlogDate(post.date)}
                  </time>
                  <div className={styles.postCopy}>
                    <div className={styles.badgeRow}>
                      <span className={styles.sourceLabel}>{post.sourceName} ↗</span>
                      {post.interactive && <span className={styles.interactiveBadge}>Interactive</span>}
                    </div>
                    <h3>{post.title}</h3>
                    {post.description && <p className={styles.description}>{post.description}</p>}
                    {post.tags.length > 0 && <p className={styles.topics}>{post.tags.slice(0, 4).join(" · ")}</p>}
                  </div>
                  <svg className={styles.arrow} aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M7 17 17 7m0 0H7m10 0v10" />
                  </svg>
                </a>
              ) : (
                <Link href={post.href} className={styles.postLink}>
                  <time className={styles.date} dateTime={post.date}>
                    {formatBlogDate(post.date)}
                  </time>
                  <div className={styles.postCopy}>
                    <div className={styles.badgeRow}>
                      <span className={styles.sourceLabel}>{post.sourceName}</span>
                      {post.interactive && <span className={styles.interactiveBadge}>Interactive</span>}
                      {post.isThesis && <span className={styles.thesisSmallBadge}>Master&apos;s Thesis</span>}
                    </div>
                    <h3>{post.title}</h3>
                    {post.description && <p className={styles.description}>{post.description}</p>}
                    {post.tags.length > 0 && <p className={styles.topics}>{post.tags.slice(0, 4).join(" · ")}</p>}
                  </div>
                  <svg className={styles.arrow} aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M5 12h14m-6-6 6 6-6 6" />
                  </svg>
                </Link>
              )}
            </article>
          );
        })}
      </div>

      {visible.length === 0 && (
        <div className={styles.empty}>
          <h3>No articles found in &ldquo;{activeCategory}&rdquo;</h3>
          <p>Try searching for a different keyword or reset to &ldquo;All&rdquo;.</p>
          <button
            type="button"
            className={styles.resetBtn}
            onClick={() => {
              setActiveCategory("All");
              setQuery("");
            }}
          >
            Show All Articles ↗
          </button>
        </div>
      )}
    </section>
  );
}
