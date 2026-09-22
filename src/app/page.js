import Link from "next/link";
import HeroSection from "./components/HeroSection";
import Navbar from "./components/Navbar";
import ExperienceSection from "./components/ExperienceSection";
import ProjectsSection from "./components/ProjectsSection";
import EmailSection from "./components/EmailSection";
import Footer from "./components/Footer";
import styles from "./home.module.css";

export default function Home() {
  return (
    <>
      <a className={styles.skipLink} href="#main">Skip to content</a>
      <Navbar />
      <main id="main" className={styles.main}>
        <HeroSection />
        <section className={styles.toolInvitation} aria-labelledby="tool-title">
          <div><p className={styles.sectionLabel}>A tool for your next idea</p><h2 id="tool-title">Make your AI workflow buildable.</h2><p>Map the system, find the gaps, and leave with a practical first experiment.</p></div>
          <Link href="/tools/workflow-readiness">Try the Readiness Lab <span aria-hidden="true">↗</span></Link>
        </section>
        <ProjectsSection />
        <ExperienceSection />
        <section id="writing" className={styles.writing} aria-labelledby="writing-title">
          <div><p className={styles.sectionLabel}>Research & writing</p><h2 id="writing-title">A little deeper.</h2></div>
          <div className={styles.writingLinks}>
            <Link href="/blog"><span>Notes on building AI</span><span className={styles.linkMeta}>Engineering, systems & ideas</span></Link>
            <a href="https://vtechworks.lib.vt.edu/items/3d08a8cd-effe-4e41-9830-0204637e53da"><span>Gurukul: AI for learning</span><span className={styles.linkMeta}>M.S. thesis · Virginia Tech</span></a>
          </div>
        </section>
        <EmailSection />
      </main>
      <Footer />
    </>
  );
}
