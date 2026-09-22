import Link from "next/link";
import HeroSection from "./components/HeroSection";
import Navbar from "./components/Navbar";
import ExperienceSection from "./components/ExperienceSection";
import ProjectsSection from "./components/ProjectsSection";
import EmailSection from "./components/EmailSection";
import Footer from "./components/Footer";
import styles from "./home.module.css";
import NewsletterInvite from "./components/NewsletterInvite";
import { newsletterSubscription } from "../lib/writing-sources.mjs";

export default function Home() {
  return (
    <>
      <a className={styles.skipLink} href="#main">Skip to content</a>
      <Navbar />
      <main id="main" className={styles.main}>
        <HeroSection />
        <section id="experiments" className={styles.experiments} aria-labelledby="tool-title">
          <div className={styles.sectionHeader}><div><p className={styles.sectionLabel}>The lab · Try an idea</p><h2 id="tool-title">A portfolio you can use.</h2></div><p>Small experiments in how I think and build.</p></div>
          <div className={styles.experimentGrid}>
            <Link href="/fit"><span className={styles.sectionLabel}>01 / People & product</span><h3>Imagine working together.</h3><p>Bring a role. Find relevant work, honest gaps, and better questions.</p><span className={styles.experimentAction}>Explore the Fit Navigator ↗</span></Link>
            <Link href="/tools/workflow-readiness"><span className={styles.sectionLabel}>02 / AI systems</span><h3>Make a workflow buildable.</h3><p>Map your idea into a system, its boundaries, and a practical first experiment.</p><span className={styles.experimentAction}>Try the Readiness Lab ↗</span></Link>
          </div>
        </section>
        <section className={styles.interests} aria-labelledby="interests-title"><p className={styles.sectionLabel}>Following my curiosity</p><h2 id="interests-title">The whole product interests me.</h2><p>Engineering is where I build. Product design, sales, conversion, marketing, and brand are questions I keep coming back to: why does this matter, how should it feel, and why would someone choose it?</p><p className={styles.interestNote}>Some of this is shipped work. Some is what I’m exploring next. I keep the distinction visible.</p></section>
        <ProjectsSection />
        <ExperienceSection />
        <section id="writing" className={styles.writing} aria-labelledby="writing-title">
          <div><p className={styles.sectionLabel}>Research & writing</p><h2 id="writing-title">A little deeper.</h2></div>
          <div className={styles.writingLinks}>
            <Link href="/blog/3b92e262-08a5-8186-942c-ff5559fe4f68"><span>MCP, sessions, and where state belongs</span><span className={styles.linkMeta}>A closer look at an engineering tradeoff</span></Link>
            <Link href="/blog/3bb2e262-08a5-80aa-b865-e905d51fa752"><span>Inside Buzz: from message to agent work</span><span className={styles.linkMeta}>Identity, permissions, and coordination</span></Link>
            <Link href="/blog"><span>All writing & notes</span><span className={styles.linkMeta}>Engineering, product & ideas</span></Link>
            <a href="https://vtechworks.lib.vt.edu/items/3d08a8cd-effe-4e41-9830-0204637e53da"><span>Gurukul: AI for learning</span><span className={styles.linkMeta}>M.S. thesis · Virginia Tech</span></a>
          </div>
        </section>
        <NewsletterInvite newsletter={newsletterSubscription()} />
        <EmailSection />
      </main>
      <Footer />
    </>
  );
}
