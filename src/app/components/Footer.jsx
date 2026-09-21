import styles from "../home.module.css";

export default function Footer({ topId = "about" }) {
  return <footer className={styles.footer}><span>Ashwin Rachha</span><a href={`#${topId}`}>Back to top ↑</a></footer>;
}
