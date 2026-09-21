import Link from "next/link";
import styles from "../blog.module.css";

export default function PostNotFound() {
  return <section className={styles.error}><p className={styles.eyebrow}>Page not found</p><h1>This piece isn’t here.</h1><p>It may have moved or is no longer available.</p><Link href="/blog">Back to all writing <span aria-hidden="true">↗</span></Link></section>;
}
