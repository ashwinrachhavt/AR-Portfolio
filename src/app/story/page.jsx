import React from "react";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import styles from "./story.module.css";

export const metadata = {
  title: "The Story | Ashwin Rachha",
  description:
    "The trajectory of an applied AI engineer: from graduate systems research at Virginia Tech to transaction classification at Finally and agentic mortgage systems at Loan Labs.",
  openGraph: {
    title: "The Story | Ashwin Rachha",
    description: "The trajectory of an applied AI engineer: research, production systems, and engineering principles.",
    url: "https://ashwinrachha.com/story",
  },
};

export default function StoryPage() {
  return (
    <>
      <Navbar activeSection="story" />
      <main className={styles.main}>
        {/* Hero */}
        <section className={styles.heroSection}>
          <div className={styles.heroRow}>
            <div className={styles.heroText}>
              <h1 className={styles.heroTitle}>
                Building AI for where<br />
                <span className={styles.heroAccent}>correctness matters.</span>
              </h1>
              <p className={styles.heroBio}>
                Mortgage documents at Loan Labs. Bookkeeping ledgers at Finally. Learning systems
                research at Virginia Tech. The work is different each time; the standard is not.
              </p>
              <div className={styles.trajectory} aria-label="Career trajectory">
                <span>Research</span>
                <span className={styles.trajectoryArrow}>→</span>
                <span>Product engineering</span>
                <span className={styles.trajectoryArrow}>→</span>
                <span>Agentic infrastructure</span>
              </div>
            </div>

            <div className={styles.portraitWrapper}>
              <div className={styles.portraitFrame}>
                <Image
                  src="/images/Ashwin.png"
                  alt="Portrait of Ashwin Rachha"
                  fill
                  priority
                  sizes="(max-width: 768px) 260px, 320px"
                  className={styles.portraitImg}
                />
              </div>
            </div>
          </div>
        </section>

        <nav className={styles.chapterNav} aria-label="Story chapters">
          <a href="#how-i-build">01 <span>How I Build</span></a>
          <a href="#foundations">02 <span>Foundations</span></a>
          <a href="#track-record">03 <span>Track Record</span></a>
          <a href="#philosophy">04 <span>Philosophy</span></a>
        </nav>

        {/* HOW I BUILD */}
        <section id="how-i-build" className={styles.chapterSection}>
          <div className={styles.chapterHeader}>
            <h2 className={styles.chapterTitle}>Full-stack engineering with domain rigor.</h2>
            <p className={styles.chapterLead}>
              Reliable AI products need strong systems beneath them. Deterministic request
              boundaries, type safety, fail-closed permissions. Interfaces that leave the user in
              charge.
            </p>
          </div>

          <div className={styles.cardsTrio}>
            <div className={styles.trioCard}>
              <h3 className={styles.trioTitle}>Systems Engineering</h3>
              <p className={styles.trioTagline}>Production services, typed APIs, deterministic orchestration.</p>
              <div className={styles.trioPills}>
                <span>LangGraph</span>
                <span>Bedrock AgentCore</span>
                <span>Django</span>
                <span>FastAPI</span>
                <span>Rails</span>
                <span>Next.js</span>
                <span>Docker</span>
                <span>Kubernetes</span>
              </div>
            </div>

            <div className={styles.trioCard}>
              <h3 className={styles.trioTitle}>Product &amp; Delivery</h3>
              <p className={styles.trioTagline}>Specifications, user research, evaluation harnesses.</p>
              <div className={styles.trioPills}>
                <span>Spec Decomposition</span>
                <span>User Research</span>
                <span>Linear to Code</span>
                <span>Eval Suites</span>
                <span>Human-in-the-Loop</span>
                <span>QuickBooks Push</span>
              </div>
            </div>

            <div className={styles.trioCard}>
              <h3 className={styles.trioTitle}>Applied AI &amp; Retrieval</h3>
              <p className={styles.trioTagline}>Dense embeddings, lexical search, high-throughput pipelines.</p>
              <div className={styles.trioPills}>
                <span>Pinecone</span>
                <span>Elasticsearch BM25</span>
                <span>50K+ Txns/Day</span>
                <span>Triton MLOps</span>
                <span>Fail-Closed Auth</span>
                <span>PyTorch</span>
              </div>
            </div>
          </div>
        </section>

        {/* FOUNDATIONS */}
        <section id="foundations" className={styles.chapterSection}>
          <div className={styles.foundationGrid}>
            <div className={styles.foundationImageCol}>
              <div className={styles.foundationFrame}>
                <Image
                  src="/images/projectsAR/1AR.jpg"
                  alt="Gurukul CS Education Research diagram"
                  fill
                  sizes="360px"
                  className={styles.foundationImg}
                />
              </div>
            </div>

            <div className={styles.foundationTextCol}>
              <h2 className={styles.chapterTitle}>Graduate research & systems fundamentals.</h2>
              <p className={styles.foundationLead}>
                Before production ledgers there was research. At Virginia Tech my thesis asked how
                an LLM can walk a student through a hard programming problem without ever handing
                over the answer. Guardrails were the interesting part.
              </p>

              <div className={styles.degreeList}>
                <div className={styles.degreeRow}>
                  <div>
                    <h4 className={styles.degreeTitle}>M.S. Computer Science (Thesis Track)</h4>
                    <p className={styles.degreeSchool}>Virginia Tech · 2021–2023</p>
                  </div>
                  <div className={styles.gpaBox}>
                    <span className={styles.gpaVal}>4.0</span>
                    <span className={styles.gpaLabel}>GPA / 4.0</span>
                  </div>
                </div>

                <div className={styles.degreeRow}>
                  <div>
                    <h4 className={styles.degreeTitle}>B.E. Computer Science</h4>
                    <p className={styles.degreeSchool}>PICT, Pune · 2016–2020</p>
                  </div>
                  <div className={styles.gpaBox}>
                    <span className={styles.gpaVal}>8.70</span>
                    <span className={styles.gpaLabel}>GPA / 10.0</span>
                  </div>
                </div>
              </div>

              <div className={styles.thesisHighlightBox}>
                <div className={styles.thesisHeader}>
                  <span className={styles.thesisBadge}>Master&apos;s Thesis Research</span>
                  <span className={styles.citationsPill}>130+ Citations</span>
                </div>
                <h4 className={styles.thesisTitle}>Gurukul: LLM-Enhanced Computer Science Education</h4>
                <p className={styles.thesisDesc}>
                  An adaptive learning platform built on retrieval-augmented generation and
                  Socratic guardrails, so a student gets the next hint instead of the final answer.
                  Published at IEEE FIE 2024 and IEEE SoutheastCon 2023.
                </p>
                <Link href="/blog/gurukul-thesis" className={styles.thesisLink}>
                  Read the research write-up →
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* TRACK RECORD */}
        <section id="track-record" className={styles.chapterSection}>
          <div className={styles.chapterHeaderCenter}>
            <h2 className={styles.chapterTitle}>Shipping software that runs on real ledgers.</h2>
          </div>

          <div className={styles.timelineIntro}>
            <span>2016</span><i />
            <span>2021</span><i />
            <span>2024</span><i />
            <span>2026</span>
          </div>

          <div className={styles.workCardsStack}>
            <article className={`${styles.workCard} ${styles.featuredWorkCard}`}>
              <div className={styles.workCardLeft}>
                <span className={styles.workKicker}>Current focus</span>
                <h3 className={styles.workCompany}>Loan Labs</h3>
                <span className={styles.workRole}>Applied AI Engineer · 2026–Present · Mortgage Infrastructure</span>
                <p className={styles.workDesc}>
                  Mortgage packets run past 400 pages, and borrowers name them
                  IMG_4901.pdf. I re-architected Lois from one-off Ruby LLM calls into a
                  LangGraph state machine on Bedrock AgentCore: document classification, lender
                  policy validation, and fail-closed authorization where the agent can never turn
                  a low-confidence guess into an irreversible write.
                </p>
                <div className={styles.workTags}><span>LangGraph</span><span>AgentCore</span><span>Mortgage infrastructure</span></div>
              </div>
              <div className={styles.workVisual}>
                <Image src="/images/diagrams/lois-architecture-dark-preview.png" alt="Lois agent architecture diagram" fill sizes="(max-width: 860px) 100vw, 320px" />
              </div>
              <div className={styles.workCardRight}>
                <span className={styles.workMetricVal}>-85%</span>
                <span className={styles.workMetricLabel}>Document Cycle Time</span>
              </div>
            </article>

            <div className={styles.workCard}>
              <div className={styles.workCardLeft}>
                <h3 className={styles.workCompany}>Finally</h3>
                <span className={styles.workRole}>AI Product Engineer / Tech Lead · 2024–2026 · AI Bookkeeping</span>
                <p className={styles.workDesc}>
                  First AI Product Engineer there. Led a three-engineer team from prototype to
                  production on Classify AI, a hybrid retrieval engine (dense vectors for meaning,
                  BM25 for the literal string) sorting 50,000+ bank transactions a day into
                  per-company charts of accounts.
                </p>
              </div>
              <div className={styles.workCardRight}>
                <span className={styles.workMetricVal}>-80%</span>
                <span className={styles.workMetricLabel}>Manual Categorization</span>
              </div>
            </div>

            <div className={styles.workCard}>
              <div className={styles.workCardLeft}>
                <h3 className={styles.workCompany}>Cash-Based Underwriting</h3>
                <span className={styles.workRole}>Finally Corporate Card · 2024–2025</span>
                <p className={styles.workDesc}>
                  Bureau scores describe who a company was. We underwrote on who it is:
                  reconstructing 90 days of daily balances, measuring cash volatility, and
                  recalculating limits weekly with circuit breakers. $3M+ in credit across 50+
                  companies, zero defaults through the rollout.
                </p>
              </div>
              <div className={styles.workCardRight}>
                <span className={styles.workMetricVal}>$3M+</span>
                <span className={styles.workMetricLabel}>Credit Deployed</span>
              </div>
            </div>

            <div className={styles.workCard}>
              <div className={styles.workCardLeft}>
                <h3 className={styles.workCompany}>Outreach</h3>
                <span className={styles.workRole}>Machine Learning Platform Engineer Intern · 2022 · Seattle, WA</span>
                <p className={styles.workDesc}>
                  Built reusable NLP inference and deployment infrastructure with PySpark, MLflow,
                  ONNX, and NVIDIA Triton on Google Kubernetes Engine.
                </p>
              </div>
              <div className={styles.workCardRight}>
                <span className={styles.workMetricVal}>&lt;20ms</span>
                <span className={styles.workMetricLabel}>Latency (P95)</span>
              </div>
            </div>
          </div>

          <div className={styles.centerLinkRow}>
            <Link href="/#work" className={styles.seeWorkBtn}>
              View selected projects and architecture deep dives →
            </Link>
          </div>
        </section>

        {/* PHILOSOPHY */}
        <section id="philosophy" className={styles.chapterSection}>
          <div className={styles.chapterHeader}>
            <h2 className={styles.chapterTitle}>How I think about building software.</h2>
            <p className={styles.chapterLead}>
              Software that touches financial ledgers or legal documents cannot run on prompt
              optimism. Four tenets I keep coming back to.
            </p>
          </div>

          <div className={styles.interestsGrid}>
            <div className={styles.interestCard}>
              <h4 className={styles.interestTitle}>Deterministic state over prompt hope</h4>
              <p className={styles.interestText}>
                Agents need explicit state machines and typed transitions. A prompt configures
                behavior; a state graph guarantees you can name the step where things failed.
              </p>
            </div>

            <div className={styles.interestCard}>
              <h4 className={styles.interestTitle}>Fail closed, by default</h4>
              <p className={styles.interestText}>
                No agent should hold ambient API access. Reads, writes, and syncs stay scoped to
                verified tenants, and unknown actions get rejected at the gateway rather than
                apologized for in a prompt.
              </p>
            </div>

            <div className={styles.interestCard}>
              <h4 className={styles.interestTitle}>Hybrid dense and sparse retrieval</h4>
              <p className={styles.interestText}>
                Vector search alone cannot match an invoice number. Meaning and literal strings
                need different retrievers, and the companies that get both right ship fewer wrong
                answers.
              </p>
            </div>

            <div className={styles.interestCard}>
              <h4 className={styles.interestTitle}>Own the whole loop</h4>
              <p className={styles.interestText}>
                The best systems come from engineers who have sat in the user interview, written
                the schema, and watched the background worker fail at 3am. The interface is not
                beneath the architecture. It is part of it.
              </p>
            </div>
          </div>
        </section>

        {/* CLOSING */}
        <section className={styles.closingSection}>
          <h2 className={styles.closingTitle}>
            Interested in building together?
          </h2>
          <p className={styles.closingLead}>
            Whether you&apos;re exploring agentic architectures, evaluating financial data
            systems, or looking for an engineer to lead an AI initiative, I&apos;m always glad to
            talk craft and architecture.
          </p>
          <div className={styles.closingButtons}>
            <Link href="/fit" className={styles.primaryCta}>
              Explore Career Fit ↗
            </Link>
            <Link href="/blog" className={styles.secondaryCta}>
              Technical Writing & Deep Dives
            </Link>
            <a href="mailto:ashwin.rachha@gmail.com" className={styles.secondaryCta}>
              ashwin.rachha@gmail.com
            </a>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
