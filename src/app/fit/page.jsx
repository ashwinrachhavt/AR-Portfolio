import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import FitNavigator from "./FitNavigator";
import home from "../home.module.css";
import styles from "./fit.module.css";
import { jevConnection } from "../../lib/jev";

export const metadata = { title: "Explore working together | Ashwin Rachha", description: "Map a role to my documented work. Explore relevant projects, evidence, and questions for a useful conversation." };

export default function FitPage() {
  const connection = jevConnection(process.env);
  const live = process.env.CAREER_FIT_LIVE_ENABLED === "true" && Boolean(connection);
  return <><a className={home.skipLink} href="#main">Skip to content</a><Navbar activeSection="fit" />
    <main id="main" className={`${home.main} ${styles.main}`}>
      <header className={styles.hero}><p className={styles.eyebrow}>Career Fit Navigator</p><h1>Imagine us<br /><span>working together.</span></h1><p>Bring a role. Explore the work behind it. Leave with better questions.</p></header>
      <FitNavigator live={live} provider={connection?.provider} />
    </main><Footer topId="main" /></>;
}
