import React from "react";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import styles from "./story.module.css";

export const metadata = {
  title: "The Story — Ashwin Rachha",
  description:
    "The journey from computer science in Pune to Virginia Tech (4.0 GPA) and production agentic systems in fintech and mortgage tech.",
  openGraph: {
    title: "The Story — Ashwin Rachha",
    description: "Where curiosity meets craft. The path from algorithms to production AI.",
    url: "https://ashwinrachha.com/story",
  },
};

export default function StoryPage() {
  return (
    <>
      <Navbar activeSection="story" />
      <main className={styles.main}>
        {/* Background ambient gradient glow orbs */}
        <div aria-hidden="true" className={styles.ambientOrb1} />
        <div aria-hidden="true" className={styles.ambientOrb2} />
        <div aria-hidden="true" className={styles.ambientOrb3} />

        {/* Hero Section */}
        <section className={styles.heroSection}>
          <div className={styles.storyEyebrow}>THE STORY · ASHWIN RACHHA</div>

          <div className={styles.heroRow}>
            <div className={styles.heroText}>
              <h1 className={styles.heroTitle}>
                Where curiosity<br />
                <span className={styles.heroAccent}>meets craft.</span>
              </h1>
              <p className={styles.heroBio}>
                I&apos;m Ashwin, a Virginia Tech-trained applied AI engineer and systems builder. This is the path from code in Pune to agentic AI in fintech and mortgage tech, and the ideas and people that shaped it.
              </p>
            </div>

            <div className={styles.portraitWrapper}>
              <div className={styles.portraitOrganic}>
                <Image
                  src="/images/Ashwin.png"
                  alt="Portrait of Ashwin Rachha"
                  fill
                  priority
                  sizes="(max-width: 768px) 280px, 340px"
                  className={styles.portraitImg}
                />
              </div>
            </div>
          </div>
        </section>

        {/* CHAPTER 01: THE JOURNEY BEGINS */}
        <section className={styles.chapterSection}>
          <div className={styles.chapterHeader}>
            <span className={styles.chapterLabel}>CHAPTER 01 · THE JOURNEY BEGINS</span>
            <h2 className={styles.chapterTitle}>
              From engineer to <span className={styles.italic}>systems architect.</span>
            </h2>
            <p className={styles.chapterLead}>
              It began with the joy of turning complex ideas into working software. That curiosity to see the whole system led me to Virginia Tech, where machine learning, distributed platforms, and product intuition came together into one unified way of building.
            </p>
          </div>

          <div className={styles.cardsTrio}>
            {/* Engineering Card */}
            <div className={`${styles.trioCard} ${styles.cardTiltLeft}`}>
              <span className={styles.trioNumber}>01</span>
              <h3 className={styles.trioTitle}>Engineering</h3>
              <p className={styles.trioTagline}>Production apps, resilient APIs & agentic orchestration.</p>
              <div className={styles.trioPills}>
                <span>LangGraph</span>
                <span>Bedrock</span>
                <span>Django</span>
                <span>FastAPI</span>
                <span>Rails</span>
                <span>Next.js</span>
                <span>Docker</span>
              </div>
            </div>

            {/* Product Card */}
            <div className={`${styles.trioCard} ${styles.cardAccent} ${styles.cardTiltRight}`}>
              <span className={styles.trioNumber}>02</span>
              <h3 className={styles.trioTitle}>Product</h3>
              <p className={styles.trioTagline}>Strategy, research, spec-decomposition & outcomes.</p>
              <div className={styles.trioPills}>
                <span>Spec Decomposition</span>
                <span>User Research</span>
                <span>Linear-to-Code</span>
                <span>A/B Testing</span>
                <span>OKRs</span>
                <span>Human-in-Loop</span>
              </div>
            </div>

            {/* AI & Systems Card */}
            <div className={`${styles.trioCard} ${styles.cardTiltCenter}`}>
              <span className={styles.trioNumber}>03</span>
              <h3 className={styles.trioTitle}>AI & Systems</h3>
              <p className={styles.trioTagline}>Applied ML, hybrid retrieval & leading teams.</p>
              <div className={styles.trioPills}>
                <span>Pinecone</span>
                <span>Elasticsearch</span>
                <span>50K+ Txns/Day</span>
                <span>Triton MLOps</span>
                <span>Fail-Closed</span>
                <span>PyTorch</span>
              </div>
            </div>
          </div>
        </section>

        {/* CHAPTER 02: THE FOUNDATION YEARS */}
        <section className={styles.chapterSection}>
          <div className={styles.foundationGrid}>
            <div className={styles.foundationImageCol}>
              <div className={styles.foundationOrganicFrame}>
                <Image
                  src="/images/projectsAR/1AR.jpg"
                  alt="Gurukul CS Education Research"
                  fill
                  sizes="360px"
                  className={styles.foundationImg}
                />
              </div>
            </div>

            <div className={styles.foundationTextCol}>
              <span className={styles.chapterLabel}>CHAPTER 02 · THE FOUNDATION YEARS</span>
              <h2 className={styles.chapterTitle}>
                Where it all <span className={styles.italic}>compiled.</span>
              </h2>
              <p className={styles.foundationLead}>
                From computer science in Pune to graduate research at Virginia Tech. These are the years that taught me how to think deeply, design for failure paths, and fall in love with hard problems.
              </p>

              <div className={styles.degreeList}>
                <div className={styles.degreeRow}>
                  <div>
                    <h4 className={styles.degreeTitle}>M.S. Computer Science (Thesis)</h4>
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

              {/* Master's Thesis Spotlight in Story */}
              <div className={styles.thesisHighlightBox}>
                <div className={styles.thesisHeader}>
                  <span className={styles.thesisBadge}>MASTER&apos;S THESIS RESEARCH</span>
                  <span className={styles.citationsPill}>130+ Citations</span>
                </div>
                <h4 className={styles.thesisTitle}>Gurukul: LLM-Enhanced CS Education</h4>
                <p className={styles.thesisDesc}>
                  Built an adaptive learning environment using RAG and Socratic guardrails to guide programming students without leaking solutions. Published in IEEE FIE 2024 and SoutheastCon 2023.
                </p>
                <Link href="/blog/gurukul-thesis" className={styles.thesisLink}>
                  Explore the research & interactive simulator →
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* CHAPTER 03: THE PROFESSIONAL YEARS */}
        <section className={styles.chapterSection}>
          <div className={styles.chapterHeaderCenter}>
            <span className={styles.chapterLabel}>CHAPTER 03 · THE PROFESSIONAL YEARS</span>
            <h2 className={styles.chapterTitle}>
              Shipping in the <span className={styles.italic}>real world.</span>
            </h2>
          </div>

          <div className={styles.workCardsStack}>
            {/* Loan Labs */}
            <div className={`${styles.workCard} ${styles.workCard1}`}>
              <div className={styles.workCardLeft}>
                <h3 className={styles.workCompany}>Loan Labs</h3>
                <span className={styles.workRole}>Applied AI Engineer · 2026–Present · Stealth Mortgage Tech</span>
                <p className={styles.workDesc}>
                  Re-architected Lois from one-off Ruby LLM calls into a LangGraph agentic system on Amazon Bedrock AgentCore for mortgage document classification, lender policy validation, and fail-closed Composio authorization.
                </p>
              </div>
              <div className={styles.workCardRight}>
                <span className={styles.workMetricVal}>-85%</span>
                <span className={styles.workMetricLabel}>INTAKE DELAYS</span>
              </div>
            </div>

            {/* Finally Classify AI */}
            <div className={`${styles.workCard} ${styles.workCard2}`}>
              <div className={styles.workCardLeft}>
                <h3 className={styles.workCompany}>Finally</h3>
                <span className={styles.workRole}>AI Product Engineer / Tech Lead · 2024–2026 · AI Bookkeeping</span>
                <p className={styles.workDesc}>
                  Joined as Finally&apos;s first AI Product Engineer and led a 3-engineer team from prototype to production on Classify AI; processed 50K+ transactions daily using hybrid retrieval (Pinecone + Elasticsearch).
                </p>
              </div>
              <div className={styles.workCardRight}>
                <span className={styles.workMetricVal}>-80%</span>
                <span className={styles.workMetricLabel}>MANUAL TOIL</span>
              </div>
            </div>

            {/* Finally Cash-Based Underwriting */}
            <div className={`${styles.workCard} ${styles.workCard3}`}>
              <div className={styles.workCardLeft}>
                <h3 className={styles.workCompany}>Cash-Based Underwriting</h3>
                <span className={styles.workRole}>Finally Corporate Card · 2024–2025</span>
                <p className={styles.workDesc}>
                  Built real-time credit risk engine with 90-day bank balance reconstruction, Z-score cash volatility analysis, and weekly recalculations. Deployed $3M+ in corporate credit for 50+ companies with 0% default rate.
                </p>
              </div>
              <div className={styles.workCardRight}>
                <span className={styles.workMetricVal}>$3M+</span>
                <span className={styles.workMetricLabel}>CREDIT DEPLOYED</span>
              </div>
            </div>

            {/* Outreach */}
            <div className={`${styles.workCard} ${styles.workCard4}`}>
              <div className={styles.workCardLeft}>
                <h3 className={styles.workCompany}>Outreach</h3>
                <span className={styles.workRole}>ML Platform Engineer Intern · 2022 · Seattle, WA</span>
                <p className={styles.workDesc}>
                  Built reusable NLP inference and deployment infrastructure using PySpark, MLflow, ONNX runtimes, and NVIDIA Triton Inference Server deployed on Google Kubernetes Engine (GKE).
                </p>
              </div>
              <div className={styles.workCardRight}>
                <span className={styles.workMetricVal}>&lt;20ms</span>
                <span className={styles.workMetricLabel}>LATENCY (P95)</span>
              </div>
            </div>
          </div>

          <div className={styles.centerLinkRow}>
            <Link href="/#work" className={styles.seeWorkBtn}>
              See the selected work & deep dives →
            </Link>
          </div>
        </section>

        {/* CHAPTER 04: PHILOSOPHY & OFF THE CLOCK */}
        <section className={styles.chapterSection}>
          <div className={styles.chapterHeader}>
            <span className={styles.chapterLabel}>CHAPTER 04 · PHILOSOPHY & OFF THE CLOCK</span>
            <h2 className={styles.chapterTitle}>
              There&apos;s a person <span className={styles.italic}>behind the systems.</span>
            </h2>
            <p className={styles.chapterLead}>
              How I build software reflects how I view the world: with rigor, curiosity, and respect for good design. When I&apos;m not orchestrating agents or training models, I&apos;m out exploring trails, chasing espresso, and hacking on open-source experiments.
            </p>
          </div>

          <div className={styles.interestsGrid}>
            <div className={styles.interestCard}>
              <span className={styles.interestBadge}>BUILDING PHILOSOPHY</span>
              <h4 className={styles.interestTitle}>Engineering Rigor Meets Product Instinct</h4>
              <p className={styles.interestText}>
                Specifications before code. Test coverage before deployment. Fail-closed security boundaries by default. AI should eliminate repetitive human toil while expanding human agency.
              </p>
            </div>

            <div className={styles.interestCard}>
              <span className={styles.interestBadge}>COFFEE QUEST</span>
              <h4 className={styles.interestTitle}>Hunting the Perfect Flat White</h4>
              <p className={styles.interestText}>
                Passionate about single-origin Ethiopian and Colombian beans, dialing in grind sizes on espresso machines, and exploring third-wave roasters in every city I visit.
              </p>
            </div>

            <div className={styles.interestCard}>
              <span className={styles.interestBadge}>TRAILS & OUTDOORS</span>
              <h4 className={styles.interestTitle}>Mountain Trails & Coastlines</h4>
              <p className={styles.interestText}>
                From the Blue Ridge Mountains in Virginia to the Pacific Coast trails. Being outdoors is where my best architectural solutions and product ideas get unblocked.
              </p>
            </div>

            <div className={styles.interestCard}>
              <span className={styles.interestBadge}>OPEN SOURCE & RESEARCH</span>
              <h4 className={styles.interestTitle}>Continuous Learning & Reading</h4>
              <p className={styles.interestText}>
                Regularly reading systems papers, benchmarking new LLM evaluation harnesses, and contributing to open-source agent tooling.
              </p>
            </div>
          </div>
        </section>

        {/* CLOSING SECTION */}
        <section className={styles.closingSection}>
          <span className={styles.chapterLabel}>WHAT KEEPS ME CURIOUS</span>
          <h2 className={styles.closingTitle}>
            Curiosity is the <span className={styles.closingAccent}>through-line.</span>
          </h2>
          <p className={styles.closingLead}>
            Give me an ambiguous workflow, a hard distributed systems problem, or a zero-to-one product idea, and I&apos;m happy. I love turning complex chaos into elegant, reliable systems that people rely on every day.
          </p>
          <div className={styles.closingButtons}>
            <Link href="/fit" className={styles.primaryCta}>
              Explore working together ↗
            </Link>
            <Link href="/blog" className={styles.secondaryCta}>
              Read all writing & deep dives
            </Link>
            <a href="mailto:ashwin.rachha@gmail.com" className={styles.secondaryCta}>
              Get in touch
            </a>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
