import { Metadata } from "next";
import Link from "next/link";
import ClassifyAiSimulator from "./ClassifyAiSimulator";
import ArchitectureDiagram from "@/app/components/ArchitectureDiagram";
import styles from "./classify.module.css";

export const metadata: Metadata = {
  title: "Classify AI: Scaling Financial Categorization to 50K+ Daily | Ashwin Rachha",
  description:
    "How we built a hybrid retrieval transaction classification engine with Pinecone and Elasticsearch, reducing manual bookkeeping categorization by ~80% and shrinking close times from 4+ months to 2 weeks.",
  openGraph: {
    title: "Classify AI: Scaling Financial Categorization to 50K+ Daily Transactions",
    description:
      "A deep dive into building production ML for fintech bookkeeping with hybrid dense/sparse retrieval.",
    type: "article",
    publishedTime: "2026-09-24T00:00:00Z",
  },
};

export default function ClassifyAiDeepDivePage() {
  return (
    <div className={styles.main}>
      <div className={styles.readingColumn}>
          <Link href="/blog" className={styles.backLink}>
            ← All writing & deep dives
          </Link>

          <header className={styles.header}>
            <div className={styles.metaRow}>
              <span className={styles.categoryBadge}>Fintech & Hybrid Retrieval</span>
              <span className={styles.dot}>·</span>
              <time dateTime="2026-09-24">September 24, 2026</time>
              <span className={styles.dot}>·</span>
              <span>13 min read</span>
            </div>

            <h1 className={styles.title}>
              Classify AI: Scaling Financial Categorization to 50,000+ Daily Transactions
            </h1>

            <p className={styles.subtitle}>
              How we combined dense vector embeddings (Pinecone) with sparse lexical search (Elasticsearch) and custom charts of accounts to reduce manual bookkeeping by ~80% and shrink first-month close cycles from 4+ months to 2 weeks.
            </p>

            <div className={styles.authorBar}>
              <div className={styles.authorInfo}>
                <span className={styles.authorName}>Ashwin Rachha</span>
                <span className={styles.authorRole}>AI Product Engineer / Tech Lead · Finally</span>
              </div>
              <div className={styles.statsBadges}>
                <span className={styles.badge}>50K+ Txns / Day</span>
                <span className={styles.badge}>~80% Manual Reduction</span>
                <span className={styles.badge}>4mo → 2wk Close</span>
              </div>
            </div>
          </header>

          {/* Interactive Simulator */}
          <section id="simulator" className={styles.simulatorWrapper}>
            <div className={styles.simulatorIntro}>
              <h2>Interactive Transaction Classification Sandbox</h2>
              <p>
                Test raw, messy bank descriptions against our hybrid classification pipeline. Inspect merchant token extraction, vector similarity scoring, chart of accounts resolution, and the automated confidence gatekeeper.
              </p>
            </div>
            <ClassifyAiSimulator />
          </section>

          {/* Technical Prose */}
          <article className={styles.prose}>
            <h2>1. The Problem: The High-Entropy Reality of Bank Feeds</h2>
            <p>
              In business bookkeeping, raw transaction descriptions provided by banking networks are notoriously cryptic. A payment to Amazon Web Services might arrive as <code>AMZN MKTP US*2X7BK9 WA</code>, a ride on Lyft as <code>LYFT *RIDE 09-14 SAN FRANCISCO</code>, or a local catering expense as <code>SQ *THE DAILY GRIND 94103</code>.
            </p>
            <p>
              For a human bookkeeper managing hundreds of client companies, categorizing thousands of transactions each month into specific General Ledger (GL) accounts is grinding, error-prone toil. Furthermore:
            </p>
            <ul>
              <li><strong>Context is Tenant-Specific:</strong> For a software startup, AWS is categorized under <em>5010 - Cost of Goods Sold (Hosting)</em>. For a law firm, an AWS charge might belong in <em>6040 - Internal Office Software</em>.</li>
              <li><strong>Zero Tolerance for False Precision:</strong> Reclassifying a balance sheet transfer as an operating expense corrupts tax filings and monthly P&amp;L reports.</li>
              <li><strong>Backlog Onboarding Delays:</strong> When a new customer joined Finally with two years of un-reconciled bank records, manual review took over 4 months to complete the first-month close.</li>
            </ul>

            <h2>2. The Solution: Hybrid Dense + Sparse Retrieval Architecture</h2>
            <p>
              Relying purely on LLM prompt generation for 50,000 transactions daily is financially and latently prohibitive ($$$ in API tokens and seconds of latency per line item).
            </p>
            <p>
              As Finally&rsquo;s first AI Product Engineer, I designed a hybrid retrieval architecture combining:
            </p>
            <ol>
              <li><strong>Deterministic Merchant Tokenization:</strong> Regex cleaning, store-number stripping, and merchant normalization.</li>
              <li><strong>Dense Semantic Vector Search (Pinecone):</strong> Embedding merchant descriptions and historical user corrections to capture semantic intent.</li>
              <li><strong>Sparse Keyword Constraints (Elasticsearch BM25):</strong> Strict lexical filtering ensuring specific vendor keywords match historical ledger anchors.</li>
              <li><strong>Tenant Chart of Accounts (COA) Context:</strong> Re-ranking candidates strictly within the client&rsquo;s approved accounting taxonomy.</li>
              <li><strong>Confidence Thresholding:</strong> Predictions above 92% confidence auto-post to QuickBooks; predictions below route to a human bookkeeper review queue.</li>
            </ol>

            <ArchitectureDiagram
              svgSrc="/images/diagrams/classify-ai-architecture-dark.svg"
              pngSrc="/images/diagrams/classify-ai-architecture-dark.png"
              title="Classify AI Hybrid Retrieval & Execution Architecture"
              caption="End-to-end transaction categorization pipeline: Users interact with books.finally.com; Books Backend integrates Plaid Service, Heron Service, and custom Rules Engine. Asynchronous classification tasks dispatch via Redis and Celery into the AI Server. The hybrid engine queries Key-Value caches, Postgres DB, and Pinecone vector search alongside Elasticsearch BM25, outputting normalized JSON categorizations with confidence metrics."
              excalidrawSrc="/classify_ai_cash_underwriting.excalidraw"
              aspectRatio="14160/9434"
            />

            <h2>3. Scaling to 50K+ Transactions Daily</h2>
            <p>
              To process massive asynchronous transaction surges during bank settlement windows, we built a distributed pipeline using <strong>Django, Celery, and Redis</strong>.
            </p>
            <p>
              Transactions were ingested in idempotent batches, verified against existing ledger hash digests to prevent duplicate postings, and processed through vectorized embedding caches. Common recurring vendors (Slack, Google Workspace, GitHub) resolved in under 15 milliseconds via cache hits, leaving compute capacity for ambiguous tail-end vendors.
            </p>

            <h2>4. Business Impact & Close-Time Reduction</h2>
            <p>
              Deploying Classify AI fundamentally shifted Finally&rsquo;s unit economics:
            </p>
            <ul>
              <li><strong>~80% Reduction in Manual Categorization:</strong> Routine recurring transactions were handled with zero human intervention.</li>
              <li><strong>First-Month Close from 4+ Months to ~2 Weeks:</strong> New client onboarding accelerated dramatically.</li>
              <li><strong>Direct QuickBooks Integration:</strong> Synchronized clean reconciliation data, enabling bookkeepers to focus on complex accruals and tax strategy rather than manual tagging.</li>
            </ul>

            <div className={styles.backlinksBox}>
              <h3>Explore Related Architecture & Systems</h3>
              <ul>
                <li>
                  <Link href="/work/finally">
                    Finally Role & Technical Leadership Summary →
                  </Link>
                </li>
                <li>
                  <Link href="/blog/cash-based-underwriting">
                    Cash-Based Underwriting: 90-Day Balance Reconstruction →
                  </Link>
                </li>
                <li>
                  <Link href="/blog/from-documents-to-decisions">
                    Decision Lab: Two Interactive Investigations in Automated Judgment →
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
