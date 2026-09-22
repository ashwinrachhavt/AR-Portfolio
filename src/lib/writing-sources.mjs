function publicationOrigin(value) {
  if (!value?.trim()) return null;
  const url = new URL(value.trim());
  if (url.protocol !== "https:" || url.username || url.password || url.port ||
      url.pathname !== "/" || url.search || url.hash ||
      !url.hostname.includes(".") || /(^|\.)(localhost|local)$/.test(url.hostname) ||
      /^[\d.]+$/.test(url.hostname) || url.hostname.includes(":")) {
    throw new Error("Publication URLs must be public HTTPS origins, for example https://your-publication.substack.com");
  }
  return url.origin;
}

export function writingSources(env = process.env) {
  const sources = [{ id: "medium", name: "Medium", feedUrl: "https://medium.com/feed/@ashwin_rachha" }];
  const substack = publicationOrigin(env.SUBSTACK_PUBLICATION_URL);
  const hashnode = publicationOrigin(env.HASHNODE_PUBLICATION_URL);
  if (substack) sources.push({ id: "substack", name: "Substack", feedUrl: `${substack}/feed` });
  if (hashnode) sources.push({ id: "hashnode", name: "Hashnode", feedUrl: `${hashnode}/rss.xml` });
  return sources;
}

export function newsletterUrl(env = process.env) {
  return publicationOrigin(env.SUBSTACK_PUBLICATION_URL);
}

export function newsletterSubscription(env = process.env) {
  const publication = newsletterUrl(env);
  if (publication) return { url: `${publication}/subscribe`, embedUrl: `${publication}/embed` };
  // Verified public profile supplied by the owner. Its publication feed/embed
  // currently redirect here, so use the supported profile subscription UI.
  const profile = new URL(env.SUBSTACK_PROFILE_URL || "https://substack.com/@ashwinrachha");
  if (profile.origin !== "https://substack.com" || !/^\/@[a-zA-Z0-9_-]+\/?$/.test(profile.pathname) || profile.username || profile.password || profile.search || profile.hash) {
    throw new Error("SUBSTACK_PROFILE_URL must be a Substack profile URL");
  }
  return { url: profile.href.replace(/\/$/, ""), embedUrl: null };
}
