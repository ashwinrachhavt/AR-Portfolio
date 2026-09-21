import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import home from "../home.module.css";
import styles from "./blog.module.css";

export default function BlogLayout({ children }) {
  return (
    <div id="blog-top">
      <a href="#blog-content" className={home.skipLink}>Skip to content</a>
      <Navbar activeSection="writing" />
      <main id="blog-content" className={`${home.main} ${styles.main}`}>{children}</main>
      <Footer topId="blog-top" />
    </div>
  );
}
