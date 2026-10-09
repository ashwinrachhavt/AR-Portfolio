import Link from "next/link";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import home from "./home.module.css";
import styles from "./not-found.module.css";

export const metadata = { title: "Page not found | Ashwin Rachha" };

export default function NotFound() {
  return (
    <>
      <Navbar />
      <main id="main" className={`${home.main} ${styles.main}`}>
        <h1>That page moved on.</h1>
        <p>This site keeps a short pathname: /, /story, /blog, /fit.</p>
        <div className={styles.links}>
          <Link href="/" className={styles.ctaAction}>Back home</Link>
          <Link href="/blog" className={styles.ctaGhost}>Read the blog</Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
