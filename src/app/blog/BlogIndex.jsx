"use client";

import { useState } from "react";
import { filterBlogPosts, formatBlogDate } from "../../lib/blog-model.mjs";
import BlogLink from "./BlogLink";
import styles from "./blog.module.css";

export default function BlogIndex({ posts }) {
  const [query, setQuery] = useState("");
  const [topic, setTopic] = useState("");
  const topics = [...new Set(posts.flatMap(post => post.tags))].sort();
  const visible = filterBlogPosts(posts, query, topic);
  const filtered = Boolean(query || topic);

  function clearFilters() {
    setQuery("");
    setTopic("");
  }

  return (
    <section aria-label="Writing archive" className={styles.archive}>
      <div className={styles.toolbar}>
        <h2>All writing <span>{String(posts.length).padStart(2, "0")}</span></h2>
        <div className={styles.controls}>
          <div className={styles.search}>
            <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="10.5" cy="10.5" r="6.5" /><path d="m16 16 4 4" /></svg>
            <label className={styles.srOnly} htmlFor="writing-search">Search writing</label>
            <input id="writing-search" type="search" placeholder="Find an idea…" value={query} onChange={event => setQuery(event.target.value)} />
          </div>
          <label className={styles.srOnly} htmlFor="writing-topic">Filter by topic</label>
          <select id="writing-topic" value={topic} onChange={event => setTopic(event.target.value)}>
            <option value="">All topics</option>
            {topics.map(name => <option key={name} value={name}>{name}</option>)}
          </select>
        </div>
      </div>
      <div role="status" aria-live="polite" className={filtered ? styles.filterStatus : styles.srOnly}>
        {visible.length} {visible.length === 1 ? "piece" : "pieces"}{filtered ? " found" : " of writing"}
        {filtered && <button type="button" onClick={clearFilters}>Clear filters</button>}
      </div>
      <div className={styles.postList}>
        {visible.map(post => (
          <article key={post.id}>
            <BlogLink href={`/blog/${post.id}`} className={styles.postLink}>
              <time className={styles.date} dateTime={post.date}>{formatBlogDate(post.date)}</time>
              <div className={styles.postCopy}>
                <h3>{post.title}</h3>
                {post.description && <p className={styles.description}>{post.description}</p>}
                {post.tags.length > 0 && <p className={styles.topics}>{post.tags.slice(0, 3).join(" · ")}</p>}
              </div>
              <svg className={styles.arrow} aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M5 12h14m-6-6 6 6-6 6" /></svg>
            </BlogLink>
          </article>
        ))}
      </div>
      {visible.length === 0 && (
        <div className={styles.empty}>
          <h3>{posts.length ? "No matches. A different thought?" : "A little quiet here, for now."}</h3>
          <p>{posts.length ? "Try another word or choose a different topic." : "New writing will appear here soon."}</p>
          {filtered && <button type="button" onClick={clearFilters}>Show all writing <span aria-hidden="true">↗</span></button>}
        </div>
      )}
    </section>
  );
}
