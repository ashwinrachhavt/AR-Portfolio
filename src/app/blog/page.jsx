import { getBlogIndex } from "../../lib/blog.server";
import BlogIndex from "./BlogIndex";
import styles from "./blog.module.css";

export const revalidate = 300;
export const metadata = {
  title: "Writing — Ashwin Rachha",
  description: "Notes on AI, engineering, and the ideas that shape how I build and live.",
};

export default async function BlogPage() {
  const posts = await getBlogIndex();
  return (
    <>
      <header className={styles.hero}>
        <div>
          <p className={styles.eyebrow}>Writing & notes</p>
          <h1>Building things.<br /><span>Thinking out loud.</span></h1>
        </div>
        <div className={styles.introduction}>
          <p>On AI, engineering, and the things I’m still figuring out.</p>
          <span>{posts.length} {posts.length === 1 ? "piece" : "pieces"} of writing <span aria-hidden="true">↙</span></span>
        </div>
      </header>
      <BlogIndex posts={posts} />
      <aside className={styles.closing}>
        <p>Ideas are better in conversation.</p>
        <a href="mailto:ashwin.rachha@gmail.com">Get in touch <span aria-hidden="true">↗</span></a>
      </aside>
    </>
  );
}
