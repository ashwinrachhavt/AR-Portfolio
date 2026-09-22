import { getWritingIndex } from "../../lib/writing.server";
import { newsletterSubscription } from "../../lib/writing-sources.mjs";
import BlogIndex from "./BlogIndex";
import NewsletterInvite from "../components/NewsletterInvite";
import styles from "./blog.module.css";

export const revalidate = 300;
export const metadata = {
  title: "Writing — Ashwin Rachha",
  description: "Notes on AI, engineering, and the ideas that shape how I build and live.",
};

export default async function BlogPage() {
  const { posts, unavailableSources } = await getWritingIndex();
  const newsletter = newsletterSubscription();
  return (
    <>
      <header className={styles.hero}>
        <div>
          <p className={styles.eyebrow}>Writing & notes</p>
          <h1>Building things.<br /><span>Thinking out loud.</span></h1>
        </div>
        <div className={styles.introduction}>
          <p>On AI, product design, growth, and the things I’m still figuring out. Arguments, experiments, and notes from the work.</p>
          <span>{posts.length} {posts.length === 1 ? "piece" : "pieces"} of writing <span aria-hidden="true">↙</span></span>
        </div>
      </header>
      <BlogIndex posts={posts} />
      {unavailableSources.length > 0 && <p className={styles.sourceNotice}>Recent posts from {unavailableSources.join(", ")} are temporarily unavailable.</p>}
      <NewsletterInvite newsletter={newsletter} />
      <aside className={styles.closing}>
        <p>Ideas are better in conversation.</p>
        <a href="/feed.xml">All writing RSS <span aria-hidden="true">↗</span></a>
        <a href="/rss.xml">Portfolio RSS <span aria-hidden="true">↗</span></a>
        <a href="mailto:ashwin.rachha@gmail.com">Get in touch <span aria-hidden="true">↗</span></a>
      </aside>
    </>
  );
}
