import { Metadata } from "next";
import Link from "next/link";
import ArchitectureDiagram from "@/app/components/ArchitectureDiagram";
import styles from "./underwriting.module.css";

export const metadata: Metadata = {
  title: "Cash-Based Underwriting: Reconstructing 90-Day Bank Data | Ashwin Rachha",
  description:
    "How we replaced traditional credit scores with 90-day daily balance reconstruction, Z-score cash volatility analysis, and weekly recalculations to underwrite $3M+ in credit at Finally.",
  openGraph: {
    title: "Cash-Based Underwriting: Reconstructing 90-Day Bank Data to Deploy $3M+ in Credit",
    description:
      "A deep dive into fintech credit risk modeling built on daily balance reconstruction.",
    type: "article",
    publishedTime: "2026-09-24T00:00:00Z",
  },
};

export default function CashBasedUnderwritingPage() {
  return (
    <div className={styles.main}>
      <div className={styles.readingColumn}>
          <Link href="/blog" className={styles.backLink}>
            ← All writing & deep dives
          </Link>

          <header className={styles.header}>
            <div className={styles.metaRow}>
              <span className={styles.categoryBadge}>Fintech & Risk Modeling</span>
              <span className={styles.dot}>·</span>
              <time dateTime="2026-09-24">September 24, 2026</time>
              <span className={styles.dot}>·</span>
              <span>9 min read</span>
            </div>

            <h1 className={styles.title}>
              Cash-Based Underwriting: Reconstructing 90-Day Bank Data to Deploy $3M+ in Credit
            </h1>

            <p className={styles.subtitle}>
              Why traditional credit bureaus fail young companies, how we modeled daily cash
              volatility, and the engineering behind underwriting millions in corporate credit.
            </p>

            <div className={styles.authorBar}>
              <div className={styles.authorInfo}>
                <span className={styles.authorName}>Ashwin Rachha</span>
                <span className={styles.authorRole}>AI Product Engineer / Tech Lead · Finally</span>
              </div>
            </div>
          </header>

          <article className={styles.prose}>
            <h2>1. The problem with stale scores</h2>
            <p>
              When a business applies for a corporate card or a working-capital line, most lenders
              ask for tax returns, audited statements, and a FICO or Dun &amp; Bradstreet score. For
              a young company this data is useless. It describes who the company was, not who it is.
            </p>
            <p>
              I saw this at Finally. A startup could hold $400,000 from a recent round, book $60,000
              a month in recurring revenue, and still get denied because the corporate entity was 17
              months old. Meanwhile a legacy business could show a profitable tax return from last
              year while burning down its cash this quarter.
            </p>
            <p>
              So we ignored the bureau score. We underwrote on the ledger itself: bank accounts
              connected through Plaid and Teller, risk computed on raw cash movement. The number
              that mattered was the one that settled yesterday.
            </p>

            <h2>2. Reconstructing 90 days</h2>
            <p>
              Bank APIs do not hand you a clean history. Transactions post, pend, reverse, and
              adjust across time zones. End-of-day balances arrive with holes. Before any risk
              math, we had to rebuild the account&rsquo;s true state, one day at a time.
            </p>
            <p>
              We built an asynchronous reconstruction engine. It ingests every transaction, sorts
              out what actually cleared, and produces a daily balance series you can trust.
            </p>
            <ArchitectureDiagram
              svgSrc="/images/diagrams/cash-underwriting-architecture-dark.svg"
              pngSrc="/images/diagrams/cash-underwriting-architecture-dark.png"
              title="Cash-Based Algorithmic Underwriting & Credit Limit Pipeline"
              caption="End-to-end credit risk architecture: Card applicant submits via apply.finally.com (POST /calculate-credit-limit); Apply Backend enqueues calculation tasks via Redis and Celery. The Algorithmic Underwriting engine processes 90-day balances, computes standard deviation and 7-day Z-scores to assign credit lines (10% to 25% of balance), coordinates with Risk/Underwriting review, and syncs approved credit limits to Cards Backend, Marqeta, and Visa."
              excalidrawSrc="/classify_ai_cash_underwriting.excalidraw"
              aspectRatio="16838/7295"
            />

            <h3>Transfers are not revenue</h3>
            <p>
              The first failure mode we caught was the round-trip. A business moves $50,000 from
              checking to a sweep account and back, four times in a month. Naive accounting calls
              that $200,000 in deposits. It is one pile of money that took four trips.
            </p>
            <p>
              The pipeline matches paired transactions across linked accounts: same amount, mirrored
              direction, timestamps inside the 48-hour clearing window. Matched pairs get tagged as
              transfers and excluded from operating revenue. Getting this wrong corrupts everything
              downstream, so getting it right mattered more than any model tweak.
            </p>

            <h2>3. Volatility is the risk</h2>
            <p>
              An average daily balance of $100,000 can describe two very different companies. One
              sits between $90,000 and $110,000 all month. The other starts at $250,000 on the
              first, burns to $1,500 on day 28, and gets a capital injection on day 30. The average
              does not know the difference. The volatility does.
            </p>
            <p>
              We measured it with standard deviation against a reserve floor:
            </p>
            <div className={styles.formulaCard}>
              <code>
                Z_Burn = (Daily_Cash_Balance - Critical_Reserve_Floor) / Daily_Net_Burn_Sigma
              </code>
            </div>
            <p>
              When volatility ran outside the confidence bounds, the sizing multiplier dropped from
              30% of the average daily balance to 10%, or the account went to a human underwriter.
              The formula was allowed to say no. That was the point of it.
            </p>

            <h2>4. Lines that moved weekly</h2>
            <p>
              A credit line approved once and reviewed annually is a photograph. We wanted a
              video. Every Sunday night a Celery task re-synced every active borrower, rebuilt the
              trailing 90-day window, and recomputed the limit.
            </p>
            <p>
              Revenue doubled? The limit grew with it. Burn accelerated and reserves fell more than
              40% in two weeks? A circuit breaker fired: the customer got notified, automated
              increases paused, and the risk team got an alert. Nobody had to remember to check.
              The system checked.
            </p>

            <h2>5. What it came to</h2>
            <p>
              In roughly three months the engine underwrote over $3,000,000 in credit across more
              than 50 companies, with a 0% default rate through the initial rollout. Small sample,
              short window; I would not confuse it with proof that the model beats every bureau.
              But it showed that a company&rsquo;s cash history, read carefully, says more about
              whether it will repay than its age or its paperwork. The data was there all along.
              Most of the work was refusing to look away from it.
            </p>

            <div className={styles.backlinksBox}>
              <h3>Related</h3>
              <ul>
                <li>
                  <Link href="/work/finally">
                    Finally case study →
                  </Link>
                </li>
                <li>
                  <Link href="/blog/classify-ai">
                    Classify AI: transaction categorization at 50K daily →
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
