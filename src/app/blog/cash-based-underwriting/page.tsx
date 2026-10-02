import { Metadata } from "next";
import Link from "next/link";
import UnderwritingSimulator from "./UnderwritingSimulator";
import ArchitectureDiagram from "@/app/components/ArchitectureDiagram";
import ProductBrief from "../components/ProductBrief";
import styles from "./underwriting.module.css";

export const metadata: Metadata = {
  title: "Cash-Based Underwriting: Reconstructing 90-Day Bank Data | Ashwin Rachha",
  description:
    "How we replaced traditional credit scores with 90-day daily balance reconstruction, Z-score cash volatility analysis, and weekly recalculations to underwrite $3M+ in credit at Finally.",
  openGraph: {
    title: "Cash-Based Underwriting: Reconstructing 90-Day Bank Data to Deploy $3M+ in Credit",
    description:
      "A deep dive into fintech credit risk modeling with an interactive credit limit simulator.",
    type: "article",
    publishedTime: "2026-09-24T00:00:00Z",
  },
};

export default function CashBasedUnderwritingPage() {
  return (
    <div className={styles.main}>
      <div className={styles.readingColumn}>
          {/* Back link */}
          <Link href="/blog" className={styles.backLink}>
            ← All writing & deep dives
          </Link>

          {/* Article Header */}
          <header className={styles.header}>
            <div className={styles.metaRow}>
              <span className={styles.categoryBadge}>Fintech & Risk Modeling</span>
              <span className={styles.dot}>·</span>
              <time dateTime="2026-09-24">September 24, 2026</time>
              <span className={styles.dot}>·</span>
              <span>12 min read</span>
            </div>

            <h1 className={styles.title}>
              Cash-Based Underwriting: Reconstructing 90-Day Bank Data to Deploy $3M+ in Credit
            </h1>

            <p className={styles.subtitle}>
              Why traditional credit bureaus fail modern businesses, how we modeled daily cash volatility with Z-scores, and the engineering behind deploying millions in corporate credit with zero defaults during initial rollout.
            </p>

            <div className={styles.authorBar}>
              <div className={styles.authorInfo}>
                <span className={styles.authorName}>Ashwin Rachha</span>
                <span className={styles.authorRole}>AI Product Engineer / Tech Lead · Finally</span>
              </div>
              <div className={styles.statsBadges}>
                <span className={styles.badge}>$3M+ Credit Deployed</span>
                <span className={styles.badge}>50+ Companies</span>
                <span className={styles.badge}>0% Default Rate</span>
              </div>
            </div>
          </header>

          <ProductBrief
            eyebrow="Product brief · Cash-based underwriting"
            title="Credit limits from cash reality, not a stale score"
            spec="Reconstruct a company’s last 90 days of cash movement, separate operating activity from inter-account transfers, and size a credit line that can change as the company changes. The specification included a human review path and circuit breakers, not just a score."
            stack={["Plaid", "Teller", "Redis", "Celery", "Postgres", "Marqeta", "Visa"]}
            architecture={["Ingest and normalize transactions across linked accounts", "Reconstruct daily balances and detect transfer pairs", "Measure burn, volatility, and reserve-floor risk", "Sync a limit, or pause and route the account to review"]}
            outcome="The underwriting engine deployed more than $3M across 50+ companies during the initial rollout, with weekly recalculation and a visible path to stop automated limit increases when liquidity deteriorated."
          />

          {/* Interactive Simulator Section */}
          <section id="simulator" className={styles.simulatorWrapper}>
            <div className={styles.simulatorIntro}>
              <h2>Interactive Credit Risk Simulator</h2>
              <p>
                Adjust liquidity parameters below to test the underwriting algorithm. Watch how average daily balance, burn rate, and cash variance determine credit limits, risk tiering, and manual override flags in real time.
              </p>
            </div>
            <UnderwritingSimulator />
          </section>

          {/* Technical Prose */}
          <article className={styles.prose}>
            <h2>1. The Problem: The Inadequacy of Stale Bureau Scores</h2>
            <p>
              When a business applies for a corporate credit card or working-capital line, traditional lenders request multi-year audited financial statements, tax returns, and FICO/Dun & Bradstreet scores. For a fast-growing tech startup or an asset-light e-commerce operator, this data is obsolete before the ink dries.
            </p>
            <p>
              A startup might hold $400,000 in cash reserves from a recent equity round, generate $60,000 in monthly recurring revenue, and possess strong unit economics—yet be flatly denied a corporate card because their corporate entity is under 18 months old. Conversely, a legacy business might show profitable historical tax returns from the prior calendar year while silently burning down its remaining liquidity in the present quarter.
            </p>
            <p>
              At Finally, we set out to build an underwriting engine that evaluated <strong>real-time cash velocity</strong>. Instead of static credit reports, we integrated directly with company bank accounts via Plaid and Teller to compute risk on raw ledger reality.
            </p>

            <h2>2. The Architecture of 90-Day Daily Balance Reconstruction</h2>
            <p>
              Bank APIs like Plaid and Teller do not simply give you an immutable history of end-of-day balances. Transactions are posted, pending, reversed, or adjusted across time zones and weekend clearinghouse pauses.
            </p>
            <p>
              To establish an accurate solvency baseline, we engineered an asynchronous reconstruction engine:
            </p>
            <ArchitectureDiagram
              svgSrc="/images/diagrams/cash-underwriting-architecture-dark.svg"
              pngSrc="/images/diagrams/cash-underwriting-architecture-dark.png"
              title="Cash-Based Algorithmic Underwriting & Credit Limit Pipeline"
              caption="End-to-end credit risk architecture: Card applicant submits via apply.finally.com (POST /calculate-credit-limit); Apply Backend enqueues calculation tasks via Redis and Celery. The Algorithmic Underwriting engine processes 90-day balances, computes standard deviation and 7-day Z-scores to assign credit lines (10% to 25% of balance), coordinates with Risk/Underwriting review, and syncs approved credit limits to Cards Backend, Marqeta, and Visa."
              excalidrawSrc="/classify_ai_cash_underwriting.excalidraw"
              aspectRatio="16838/7295"
            />

            <h3>Handling Inter-Account Transfers</h3>
            <p>
              One critical failure mode in automated underwriting is the &ldquo;round-trip transfer illusion.&rdquo; A business might move $50,000 back and forth between a checking account and a sweep money-market account four times in a month, inflating nominal monthly deposits to $200,000.
            </p>
            <p>
              Our normalization pipeline identifies paired transactions across linked accounts by matching exact timestamps (within a 48-hour clearing window), identical amounts, and mirrored directional signs. These transfers are strictly tagged and excluded from operating revenue calculations.
            </p>

            <h2>3. Volatility Modeling: Beyond the Average</h2>
            <p>
              An average daily balance (ADB) of $100,000 can mean two completely different things:
            </p>
            <ul>
              <li><strong>Scenario A:</strong> The account stays steadily between $90,000 and $110,000 every single day of the month.</li>
              <li><strong>Scenario B:</strong> The account begins at $250,000 on day 1, burns down to $1,500 on day 28, and receives a sudden capital injection on day 30.</li>
            </ul>
            <p>
              While both accounts have similar mathematical means, Scenario B represents severe liquidity risk. To capture this, we introduced a <strong>Cash Volatility Factor</strong> based on standard deviation and minimum balance floors:
            </p>
            <div className={styles.formulaCard}>
              <code>
                Z_Burn = (Daily_Cash_Balance - Critical_Reserve_Floor) / Daily_Net_Burn_Sigma
              </code>
            </div>
            <p>
              If the volatility exceeds statistical confidence intervals, the sizing multiplier drops dynamically from 30% of ADB down to 10%, or triggers an automated human underwriter review.
            </p>

            <h2>4. Weekly Recalculations and Circuit Breakers</h2>
            <p>
              Traditional credit lines are approved once and reviewed annually. In our system, credit lines were alive. Every Sunday night, an asynchronous Celery task re-queried bank syncs for all active borrowers, reconstructed the trailing 90-day window, and recomputed limits.
            </p>
            <p>
              If a customer&rsquo;s revenue doubled, their limit automatically expanded. If their burn accelerated and cash reserves depleted by more than 40% in a 14-day window, the system enacted an automated circuit breaker: notifying the customer, pausing automated limit increases, and alerting our risk team.
            </p>

            <h2>5. Production Results & Business Impact</h2>
            <p>
              Over the course of approximately three months, the underwriting engine underwrote over <strong>$3,000,000 in credit across 50+ companies</strong>. Throughout this period, the portfolio maintained a <strong>0% default rate</strong>, proving that real-time transactional underwriting dramatically outperforms legacy bureau scoring in agility and risk mitigation.
            </p>

            <div className={styles.backlinksBox}>
              <h3>Explore Related Systems & Code</h3>
              <ul>
                <li>
                  <Link href="/work/finally">
                    Finally Company Case Study & Role Summary →
                  </Link>
                </li>
                <li>
                  <Link href="/blog/classify-ai">
                    Classify AI: Real-Time Transaction Categorization Engine →
                  </Link>
                </li>
                <li>
                  <Link href="/blog/from-documents-to-decisions">
                    Decision Lab: Interactive Experiments in Automated Judgment →
                  </Link>
                </li>
                <li>
                  <a href="https://github.com/AshwinRachha" target="_blank" rel="noopener noreferrer">
                    Ashwin Rachha on GitHub ↗
                  </a>
                </li>
              </ul>
            </div>
          </article>
        </div>
      </div>
  );
}
