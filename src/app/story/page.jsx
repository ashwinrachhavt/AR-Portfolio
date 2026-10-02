import React from "react";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import styles from "./story.module.css";

export const metadata = {
  title: "The Story — Ashwin Rachha",
  description:
    "The trajectory of an applied AI engineer: from graduate systems research at Virginia Tech (4.0 GPA, 130+ citations) to transaction classification at Finally and agentic mortgage systems at Loan Labs.",
  openGraph: {
    title: "The Story — Ashwin Rachha",
    description: "The trajectory of an applied AI engineer: research, production systems, and engineering principles.",
    url: "https://ashwinrachha.com/story",
  },
};

export default function StoryPage() {
  return (
    <>
      <Navbar activeSection="story" />
      <main className={styles.main}>
        {/* Hero Section */}
        <section className={styles.heroSection}>
          <div className={styles.storyEyebrow}>Background & Trajectory</div>

          <div className={styles.heroRow}>
            <div className={styles.heroText}>
              <h1 className={styles.heroTitle}>
                Building systems from<br />
                <span className={styles.heroAccent}>first principles.</span>
              </h1>
              <p className={styles.heroBio}>
                I build AI systems for workflows where correctness matters. My path has moved from learning systems research at Virginia Tech to production bookkeeping at Finally and agentic mortgage infrastructure at Loan Labs.
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

        {/* CHAPTER 01: CORE COMPETENCIES */}
        <section id="how-i-build" className={styles.chapterSection}>
          <div className={styles.chapterHeader}>
            <span className={styles.chapterLabel}>Chapter 01 · How I Build</span>
            <h2 className={styles.chapterTitle}>Full-stack engineering with domain rigor.</h2>
            <p className={styles.chapterLead}>
              Reliable AI products require strong systems engineering beneath them: deterministic request boundaries, type safety, fail-closed permissions, and interfaces that respect user agency.
            </p>
          </div>

          <div className={styles.cardsTrio}>
            {/* Engineering Card */}
            <div className={styles.trioCard}>
              <span className={styles.trioNumber}>01</span>
              <h3 className={styles.trioTitle}>Systems Engineering</h3>
              <p className={styles.trioTagline}>Production services, resilient APIs, and deterministic orchestration.</p>
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

            {/* Product Card */}
            <div className={styles.trioCard}>
              <span className={styles.trioNumber}>02</span>
              <h3 className={styles.trioTitle}>Product & Delivery</h3>
              <p className={styles.trioTagline}>Technical specifications, user research, and evaluation harnesses.</p>
              <div className={styles.trioPills}>
                <span>Spec Decomposition</span>
                <span>User Research</span>
                <span>Linear to Code</span>
                <span>Eval Suites</span>
                <span>Human-in-the-Loop</span>
                <span>QuickBooks Push</span>
              </div>
            </div>

            {/* AI & Systems Card */}
            <div className={styles.trioCard}>
              <span className={styles.trioNumber}>03</span>
              <h3 className={styles.trioTitle}>Applied AI & Retrieval</h3>
              <p className={styles.trioTagline}>Dense vector embeddings, lexical search, and high-throughput pipelines.</p>
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

        {/* CHAPTER 02: ACADEMIC FOUNDATION */}
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
              <span className={styles.chapterLabel}>Chapter 02 · Academic Foundations</span>
              <h2 className={styles.chapterTitle}>Graduate research & systems fundamentals.</h2>
              <p className={styles.foundationLead}>
                My engineering background combines academic research in machine learning with distributed systems foundations. At Virginia Tech, my thesis investigated how LLMs can guide students through complex problem-solving without leaking direct answers.
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

              {/* Master's Thesis Spotlight */}
              <div className={styles.thesisHighlightBox}>
                <div className={styles.thesisHeader}>
                  <span className={styles.thesisBadge}>Master&apos;s Thesis Research</span>
                  <span className={styles.citationsPill}>130+ Citations</span>
                </div>
                <h4 className={styles.thesisTitle}>Gurukul: LLM-Enhanced Computer Science Education</h4>
                <p className={styles.thesisDesc}>
                  Designed an adaptive learning platform using retrieval-augmented generation (RAG) and Socratic guardrails to guide programming students through debugging. Published in IEEE FIE 2024 and IEEE SouthEastCon 2023.
                </p>
                <Link href="/blog/gurukul-thesis" className={styles.thesisLink}>
                  Read the research paper & explore the simulator →
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* CHAPTER 03: PROFESSIONAL EXPERIENCE */}
        <section id="track-record" className={styles.chapterSection}>
          <div className={styles.chapterHeaderCenter}>
            <span className={styles.chapterLabel}>Chapter 03 · Production Track Record</span>
            <h2 className={styles.chapterTitle}>Shipping software that runs on real ledgers.</h2>
          </div>

          <div className={styles.timelineIntro}>
            <span>2016</span><i />
            <span>2021</span><i />
            <span>2024</span><i />
            <span>2026</span>
          </div>

          <div className={styles.workCardsStack}>
            {/* Loan Labs */}
            <article className={`${styles.workCard} ${styles.featuredWorkCard}`}>
              <div className={styles.workCardLeft}>
                <span className={styles.workKicker}>Current focus</span>
                <h3 className={styles.workCompany}>Loan Labs</h3>
                <span className={styles.workRole}>Applied AI Engineer · 2026–Present · Mortgage Infrastructure</span>
                <p className={styles.workDesc}>
                  Re-architected Lois from one-off Ruby LLM calls into a LangGraph agentic state machine on Amazon Bedrock AgentCore for document classification, lender policy validation, and fail-closed Composio authorization.
                </p>
                <div className={styles.workTags}><span>LangGraph</span><span>AgentCore</span><span>Mortgage infrastructure</span></div>
              </div>
              <div className={styles.workVisual}>
                <Image src="/images/diagrams/lois-architecture-dark-preview.png" alt="Lois agent architecture diagram" fill sizes="(max-width: 860px) 100vw, 320px" />
              </div>
              <div className={styles.workCardRight}>
                <span className={styles.workMetricVal}>-85%</span>
                <span className={styles.workMetricLabel}>Intake Delays</span>
              </div>
            </article>

            {/* Finally Classify AI */}
            <div className={styles.workCard}>
              <div className={styles.workCardLeft}>
                <h3 className={styles.workCompany}>Finally</h3>
                <span className={styles.workRole}>AI Product Engineer / Tech Lead · 2024–2026 · AI Bookkeeping</span>
                <p className={styles.workDesc}>
                  First AI Product Engineer at Finally; led a 3-engineer team from prototype to production on Classify AI, processing 50K+ transactions daily using hybrid retrieval (Pinecone + Elasticsearch BM25) and custom charts of accounts.
                </p>
              </div>
              <div className={styles.workCardRight}>
                <span className={styles.workMetricVal}>-80%</span>
                <span className={styles.workMetricLabel}>Manual Toil</span>
              </div>
            </div>

            {/* Finally Cash-Based Underwriting */}
            <div className={styles.workCard}>
              <div className={styles.workCardLeft}>
                <h3 className={styles.workCompany}>Cash-Based Underwriting</h3>
                <span className={styles.workRole}>Finally Corporate Card · 2024–2025</span>
                <p className={styles.workDesc}>
                  Built real-time credit risk engine reconstructing 90-day daily bank balances with Z-score cash volatility analysis and weekly limit recalculations. Deployed $3M+ in credit for 50+ companies with zero defaults during rollout.
                </p>
              </div>
              <div className={styles.workCardRight}>
                <span className={styles.workMetricVal}>$3M+</span>
                <span className={styles.workMetricLabel}>Credit Deployed</span>
              </div>
            </div>

            {/* Outreach */}
            <div className={styles.workCard}>
              <div className={styles.workCardLeft}>
                <h3 className={styles.workCompany}>Outreach</h3>
                <span className={styles.workRole}>Machine Learning Platform Engineer Intern · 2022 · Seattle, WA</span>
                <p className={styles.workDesc}>
                  Engineered reusable NLP inference and deployment infrastructure with PySpark, MLflow, ONNX runtimes, and NVIDIA Triton Inference Server deployed on Google Kubernetes Engine.
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

        {/* CHAPTER 04: ENGINEERING PRINCIPLES */}
        <section id="philosophy" className={styles.chapterSection}>
          <div className={styles.chapterHeader}>
            <span className={styles.chapterLabel}>Chapter 04 · Engineering Philosophy</span>
            <h2 className={styles.chapterTitle}>How I think about building software.</h2>
            <p className={styles.chapterLead}>
              Software that touches financial ledgers, legal documents, or automated decisions cannot rely on prompt optimism. These core tenets define how I approach architecture and production reliability.
            </p>
          </div>

          <div className={styles.principlePrompt}>When I design an AI system, I ask:</div>

          <div className={styles.interestsGrid}>
            <div className={styles.interestCard}>
              <span className={styles.interestBadge}>Principle 01</span>
              <h4 className={styles.interestTitle}>Deterministic State Over Prompt Hope</h4>
              <p className={styles.interestText}>
                Agents need explicit state machines, type-checked transitions, and deterministic fallback paths. Prompts configure behavior; state graphs ensure correctness and prevent infinite loops.
              </p>
            </div>

            <div className={styles.interestCard}>
              <span className={styles.interestBadge}>Principle 02</span>
              <h4 className={styles.interestTitle}>Fail-Closed Authorization by Default</h4>
              <p className={styles.interestText}>
                No LLM or agent tool should possess ambient API access. Every read, write, and sync must be scoped to verified tenant boundaries with execution-time permission checks that reject unknown actions.
              </p>
            </div>

            <div className={styles.interestCard}>
              <span className={styles.interestBadge}>Principle 03</span>
              <h4 className={styles.interestTitle}>Hybrid Dense & Sparse Retrieval</h4>
              <p className={styles.interestText}>
                Pure vector search struggles with exact invoice numbers, SKUs, and accounting codes. Combining dense semantic embeddings with sparse BM25 lexical constraints ensures both semantic coverage and exact accuracy.
              </p>
            </div>

            <div className={styles.interestCard}>
              <span className={styles.interestBadge}>Principle 04</span>
              <h4 className={styles.interestTitle}>End-to-End Product Ownership</h4>
              <p className={styles.interestText}>
                The best systems are designed by engineers who understand the entire loop—from user interviews and technical specifications to database schemas, background workers, and intuitive user interfaces.
              </p>
            </div>
          </div>
        </section>

        {/* CLOSING SECTION */}
        <section className={styles.closingSection}>
          <span className={styles.chapterLabel}>Let&apos;s Connect</span>
          <h2 className={styles.closingTitle}>
            Interested in building together?
          </h2>
          <p className={styles.closingLead}>
            Whether you&apos;re exploring agentic architectures, evaluating financial data systems, or looking for an engineer to lead an AI initiative, I&apos;m always glad to talk craft and architecture.
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
