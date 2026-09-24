import styles from "../home.module.css";

export default function Navbar({ activeSection }) {
  return (
    <header className={styles.header}>
      <nav className={styles.nav} aria-label="Main navigation">
        <Link href="/#about" className={styles.wordmark}>Ashwin Rachha<span aria-hidden="true">.</span></Link>
        <div className={styles.navLinks}>
          <Link href="/#work">Work</Link><Link href="/blog" aria-current={activeSection === "writing" ? "page" : undefined}>Writing</Link><Link href="/#experiments" aria-current={activeSection === "tools" ? "page" : undefined}>Lab</Link><Link href="/fit" aria-current={activeSection === "fit" ? "page" : undefined}>Work with me</Link><Link href="/#contact">Contact</Link>
        </div>
      </nav>
    </header>
  );
}
import Link from "next/link";
