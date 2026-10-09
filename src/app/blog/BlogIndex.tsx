"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { filterBlogPosts, formatBlogDate } from "../../lib/blog-model.mjs";
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

type ViewMode = "list" | "grid";
type SortMode = "newest" | "oldest" | "title";

const SORT_OPTIONS: { value: SortMode; label: string }[] = [
  { value: "newest", label: "Newest first" },
  { value: "oldest", label: "Oldest first" },
  { value: "title", label: "Title A-Z" },
];

export default function BlogIndex({ posts = [] }: { posts?: any[] }) {
  const [activeCategory, setActiveCategory] = useState<TaxonomyCategory>("All");
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [view, setView] = useState<ViewMode>(() => {
    // Lazy initializer: per-viewer convenience, renders fine without it.
    try {
      const saved = window.localStorage.getItem("writing-view");
      if (saved === "list" || saved === "grid") return saved;
    } catch { /* Optional preference only. */ }
    return "list";
  });
  const [sort, setSort] = useState<SortMode>("newest");

  const changeView = (next: ViewMode) => {
    setView(next);
    try { window.localStorage.setItem("writing-view", next); } catch { /* Optional preference only. */ }
  };

  const resetFilters = () => {
    setActiveCategory("All");
    setActiveTag(null);
    setQuery("");
  };

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

    return list;
  }, [posts]);

  // Tag cloud, most-used first
  const tagCounts = useMemo(() => {
    const counts = new Map<string, number>();
    allArticles.forEach((a) => a.tags.forEach((t) => counts.set(t, (counts.get(t) || 0) + 1)));
    return [...counts.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));
  }, [allArticles]);

  // Filter, then sort. filterBlogPosts (blog-model.mjs) handles query+tag matching.
  const visible = useMemo(() => {
    const filtered = filterBlogPosts(allArticles, query, activeTag ?? "").filter((art) => {
      const categoryMatch =
        activeCategory === "All" || art.categories.includes(activeCategory as any);
      return categoryMatch;
    });

    return filtered.sort((a, b) => {
      if (sort === "oldest") return a.date.localeCompare(b.date);
      if (sort === "title") return a.title.localeCompare(b.title);
      return b.date.localeCompare(a.date);
    });
  }, [allArticles, activeCategory, activeTag, query, sort]);

  const filtersActive = activeCategory !== "All" || activeTag !== null || query.trim() !== "";

  return (
    <section aria-label="Writing archive" className={styles.archive}>
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

      {/* Tag filter row */}
      <div className={styles.tagRow} role="group" aria-label="Filter by tag">
        {tagCounts.map(([tag, count]) => (
          <button
            key={tag}
            type="button"
            aria-pressed={activeTag === tag}
            className={`${styles.tagPill} ${activeTag === tag ? styles.tagPillActive : ""}`}
            onClick={() => setActiveTag(activeTag === tag ? null : tag)}
          >
            {tag} <span className={styles.tagCount}>{count}</span>
          </button>
        ))}
      </div>

      {/* Toolbar: counter, search, sort, view toggle */}
      <div className={styles.toolbar}>
        <h2>
          {activeCategory} <span>{visible.length}</span>
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
          <label className={styles.srOnly} htmlFor="writing-sort">Sort writing</label>
          <select
            id="writing-sort"
            value={sort}
            onChange={(e) => setSort(e.target.value as SortMode)}
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
          <div className={styles.viewToggle} role="group" aria-label="Layout">
            <button
              type="button"
              aria-pressed={view === "list"}
              aria-label="List view"
              title="List view"
              className={`${styles.viewBtn} ${view === "list" ? styles.viewBtnActive : ""}`}
              onClick={() => changeView("list")}
            >
              <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <button
              type="button"
              aria-pressed={view === "grid"}
              aria-label="Grid view"
              title="Grid view"
              className={`${styles.viewBtn} ${view === "grid" ? styles.viewBtnActive : ""}`}
              onClick={() => changeView("grid")}
            >
              <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <rect x="4" y="4" width="7" height="7" rx="1.5" />
                <rect x="13" y="4" width="7" height="7" rx="1.5" />
                <rect x="4" y="13" width="7" height="7" rx="1.5" />
                <rect x="13" y="13" width="7" height="7" rx="1.5" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {filtersActive && (
        <div className={styles.filterStatus}>
          <span>
            {visible.length} {visible.length === 1 ? "match" : "matches"}
            {activeTag ? ` tagged "${activeTag}"` : ""}
            {query.trim() ? ` matching "${query.trim()}"` : ""}
          </span>
          <button type="button" onClick={resetFilters}>
            Reset filters
          </button>
        </div>
      )}

      {view === "grid" ? (
        <div className={styles.gridList}>
          {visible.map((post) => {
            const body = (
              <>
                <div className={styles.badgeRow}>
                  <time className={styles.date} dateTime={post.date}>
                    {formatBlogDate(post.date)}
                  </time>
                  {post.isThesis && <span className={styles.thesisSmallBadge}>Master&apos;s Thesis</span>}
                </div>
                <h3>{post.title}</h3>
                {post.description && <p className={styles.description}>{post.description}</p>}
                {post.tags.length > 0 && <p className={styles.topics}>{post.tags.slice(0, 3).join(" · ")}</p>}
                <span className={styles.gridSource}>
                  {post.sourceName}
                  {post.external ? " ↗" : ""}
                </span>
              </>
            );
            return (
              <article key={post.id} className={styles.gridCard}>
                {post.external ? (
                  <a href={post.href} target="_blank" rel="noopener noreferrer" className={styles.gridLink}>
                    {body}
                  </a>
                ) : (
                  <Link href={post.href} className={styles.gridLink}>
                    {body}
                  </Link>
                )}
              </article>
            );
          })}
        </div>
      ) : (
        <div className={styles.postList}>
          {visible.map((post) => {
            const isExt = post.external;
            const body = (
              <>
                <time className={styles.date} dateTime={post.date}>
                  {formatBlogDate(post.date)}
                </time>
                <div className={styles.postCopy}>
                  <div className={styles.badgeRow}>
                    <span className={styles.sourceLabel}>
                      {post.sourceName}
                      {isExt ? " ↗" : ""}
                    </span>
                    {post.isThesis && <span className={styles.thesisSmallBadge}>Master&apos;s Thesis</span>}
                  </div>
                  <h3>{post.title}</h3>
                  {post.description && <p className={styles.description}>{post.description}</p>}
                  {post.tags.length > 0 && <p className={styles.topics}>{post.tags.slice(0, 4).join(" · ")}</p>}
                </div>
                <svg className={styles.arrow} aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  {isExt ? <path d="M7 17 17 7m0 0H7m10 0v10" /> : <path d="M5 12h14m-6-6 6 6-6 6" />}
                </svg>
              </>
            );
            return (
              <article key={post.id} className={styles.articleCard}>
                {isExt ? (
                  <a href={post.href} target="_blank" rel="noopener noreferrer" className={styles.postLink}>
                    {body}
                  </a>
                ) : (
                  <Link href={post.href} className={styles.postLink}>
                    {body}
                  </Link>
                )}
              </article>
            );
          })}
        </div>
      )}

      {visible.length === 0 && (
        <div className={styles.empty}>
          <h3>No articles found in &ldquo;{activeCategory}&rdquo;</h3>
          <p>Try searching for a different keyword or reset the filters.</p>
          <button type="button" className={styles.resetBtn} onClick={resetFilters}>
            Show all articles
          </button>
        </div>
      )}
    </section>
  );
}
