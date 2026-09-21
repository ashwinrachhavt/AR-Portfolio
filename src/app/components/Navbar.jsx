import styles from "../home.module.css";

export default function Navbar() {
  return (
    <header className={styles.header}>
      <nav className={styles.nav} aria-label="Main navigation">
        <Link href="/#about" className={styles.wordmark}>Ashwin Rachha<span aria-hidden="true">.</span></Link>
        <div className={styles.navLinks}>
          <Link href="/#work">Work</Link><Link href="/#experience">Experience</Link><Link href="/#writing">Writing</Link><Link href="/#contact">Contact</Link>
        </div>
      </nav>
    </header>
  );
}
import Link from "next/link";
