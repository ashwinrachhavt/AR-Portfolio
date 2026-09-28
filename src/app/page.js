import Link from "next/link";
import HeroSection from "./components/HeroSection";
import Navbar from "./components/Navbar";
import CapabilityCards from "./components/CapabilityCards";
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
      <a className={styles.skipLink} href="#main">
        Skip to content
      </a>
      <Navbar />
      <main id="main" className={styles.main}>
        {/* Hero Section */}
        <HeroSection />

        {/* 4 Capability Cards: Engineering, Product, AI & Analytics, Strategy with Claude Code/Codex setup & Backlinks */}
        <CapabilityCards />

        {/* Selected Work Grid with Detailed Modal & Ordered Deep Dives */}
        <ProjectsSection />

        {/* Experiments Lab */}
        <section id="experiments" className={styles.experiments} aria-labelledby="tool-title">
          <div className={styles.sectionHeader}>
            <div>
              <p className={styles.sectionLabel}>The lab · Interactive Tools</p>
              <h2 id="tool-title">A portfolio you can use.</h2>
            </div>
            <p>Small experiments in how I think and build.</p>
          </div>
          <div className={styles.experimentGrid}>
            <Link href="/fit">
              <span className={styles.sectionLabel}>01 / People & product</span>
              <h3>Imagine working together.</h3>
              <p>Bring a role. Find relevant work, honest gaps, and better questions.</p>
              <span className={styles.experimentAction}>Explore the Fit Navigator ↗</span>
            </Link>
            <Link href="/tools/workflow-readiness">
              <span className={styles.sectionLabel}>02 / AI systems</span>
              <h3>Make a workflow buildable.</h3>
              <p>Map your idea into a system, its boundaries, and a practical first experiment.</p>
              <span className={styles.experimentAction}>Try the Readiness Lab ↗</span>
            </Link>
          </div>
        </section>

        {/* Professional Experience */}
        <ExperienceSection />

        {/* Research & Technical Writing */}
        <section id="writing" className={styles.writing} aria-labelledby="writing-title">
          <div>
            <p className={styles.sectionLabel}>Research & deep dives</p>
            <h2 id="writing-title">Technical writing & research.</h2>
            <p style={{ color: "#a1a1aa", fontSize: "14px", lineHeight: "1.7", marginTop: "12px", maxWidth: "420px" }}>
              Detailed architectural walkthroughs, interactive simulators, and published academic research.
            </p>
          </div>
          <div className={styles.writingLinks}>
            <Link href="/blog/cash-based-underwriting">
              <span>Cash-Based Underwriting: 90-Day Balance Reconstruction</span>
              <span className={styles.linkMeta}>Fintech risk modeling · $3M+ deployed with 0% default</span>
            </Link>
            <Link href="/blog/lois-mortgage-agent">
              <span>Lois: Agentic Mortgage Workflows on Bedrock AgentCore</span>
              <span className={styles.linkMeta}>LangGraph state machine & fail-closed Composio security</span>
            </Link>
            <Link href="/blog/classify-ai">
              <span>Classify AI: 50,000+ Daily Transaction Classification</span>
              <span className={styles.linkMeta}>Hybrid dense/sparse retrieval with Pinecone & Elasticsearch</span>
            </Link>
            <Link href="/blog/gurukul-thesis">
              <span>Gurukul: LLM-Enhanced CS Education & Master&apos;s Thesis</span>
              <span className={styles.linkMeta}>Virginia Tech M.S. (4.0 GPA) · 130+ Citations · IEEE FIE 2024</span>
            </Link>
            <Link href="/blog/3b92e262-08a5-8186-942c-ff5559fe4f68">
              <span>MCP, sessions, and where state belongs</span>
              <span className={styles.linkMeta}>A closer look at an engineering tradeoff</span>
            </Link>
            <Link href="/blog">
              <span>All writing, research & notes →</span>
              <span className={styles.linkMeta}>Explore the 8 taxonomy categories</span>
            </Link>
          </div>
        </section>

        <NewsletterInvite newsletter={newsletterSubscription()} />
        <EmailSection />
      </main>
      <Footer />
    </>
  );
}
