const text = (items = []) => items.map(item => item.plain_text ?? item.text?.content ?? "").join("").trim();

// Only this small, public view of a Notion page crosses the client boundary.
export function summarizeBlogPost(page) {
  const properties = page.properties ?? {};
  const title = Object.values(properties).find(property => property.type === "title");
  return {
    id: page.id,
    title: text(title?.title) || "Untitled",
    // Keep the author's calendar date stable across server/browser time zones.
    date: new Intl.DateTimeFormat("en-CA", {
      year: "numeric", month: "2-digit", day: "2-digit", timeZone: "America/Los_Angeles",
    }).format(new Date(page.created_time)),
    tags: (properties.Tags?.multi_select ?? []).map(tag => tag.name),
    description: text(properties.Description?.rich_text ?? properties.Summary?.rich_text),
  };
}

export function filterBlogPosts(posts, query = "", topic = "") {
  const terms = query.toLocaleLowerCase().trim().split(/\s+/).filter(Boolean);
  return posts.filter(post => {
    const searchable = [post.title, post.description, ...post.tags].join(" ").toLocaleLowerCase();
    return (!topic || post.tags.includes(topic)) && terms.every(term => searchable.includes(term));
  });
}

export function formatBlogDate(date) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short", day: "numeric", year: "numeric", timeZone: "UTC",
  }).format(new Date(date));
}

export function estimateReadingTime(markdown) {
  const prose = markdown
    .replace(/!\[[^\]]*\]\([^)]*\)/g, "")
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/[#*`_>|~]/g, " ")
    .trim();
  return prose ? Math.max(1, Math.ceil(prose.split(/\s+/).length / 220)) : 0;
}
