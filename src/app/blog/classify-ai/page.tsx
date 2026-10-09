import { Metadata } from "next";
import Link from "next/link";
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
              <span>10 min read</span>
            </div>

            <h1 className={styles.title}>
              Classify AI: Scaling Financial Categorization to 50,000+ Daily Transactions
            </h1>

            <p className={styles.subtitle}>
              How we combined dense vector retrieval with sparse lexical search and per-company
              charts of accounts to cut manual bookkeeping by roughly 80%.
            </p>

            <div className={styles.authorBar}>
              <div className={styles.authorInfo}>
                <span className={styles.authorName}>Ashwin Rachha</span>
                <span className={styles.authorRole}>AI Product Engineer / Tech Lead · Finally</span>
              </div>
            </div>
          </header>

          <article className={styles.prose}>
            <h2>1. What bank feeds actually look like</h2>
            <p>
              A payment to Amazon Web Services arrives as <code>AMZN MKTP US*2X7BK9 WA</code>. A
              Lyft ride is <code>LYFT *RIDE 09-14 SAN FRANCISCO</code>. A catering invoice is
              <code>SQ *THE DAILY GRIND 94103</code>. This is what banks send. Nobody cleans it up
              before it lands in a ledger.
            </p>
            <p>
              A bookkeeper managing hundreds of client companies sorts thousands of these a month
              into specific general ledger accounts. It is grinding work, and the hard part is not
              volume. It is that the same string means different things to different companies.
              For a software startup, AWS belongs in cost of goods sold. For a law firm, it is
              internal office software.
            </p>
            <p>
              And the stakes are asymmetric. Classify a balance-sheet transfer as an operating
              expense and the tax filing is wrong. Messy input, tenant-specific truth, no room for
              confident errors.
            </p>

            <h2>2. Retrieval, not generation</h2>
            <p>
              The obvious approach is prompting an LLM per transaction. At 50,000 transactions a
              day that fails twice: it costs real money, and it adds seconds of latency to every
              line item. But more fundamentally, generation is the wrong shape. The answer already
              exists in the company&rsquo;s own history. The job is finding it.
            </p>
            <p>
              So Classify AI was built as retrieval with rules on top:
            </p>
            <ol>
              <li><strong>Merchant tokenization.</strong> Regex cleaning, store-number stripping, normalization. Deterministic, cheap, boring.</li>
              <li><strong>Dense vector search (Pinecone).</strong> Embeddings of merchant descriptions and the company&rsquo;s own past corrections, capturing intent.</li>
              <li><strong>Sparse lexical search (Elasticsearch BM25).</strong> Exact matches on invoice numbers, SKUs, accounting codes. The string is the anchor.</li>
              <li><strong>Chart of accounts re-ranking.</strong> Candidates filtered strictly within each client&rsquo;s approved taxonomy.</li>
              <li><strong>Confidence gating.</strong> Predictions above 92% post to QuickBooks. The rest goes to a bookkeeper.</li>
            </ol>
            <p>
              The two retrievers earn their keep separately. Dense search finds meaning; BM25 finds
              the literal string. A vendor with an invoice number in the description should match
              on that number, not on what the description roughly means. Companies that mix both
              got fewer wrong answers than either alone.
            </p>

            <ArchitectureDiagram
              svgSrc="/images/diagrams/classify-ai-architecture-dark.svg"
              pngSrc="/images/diagrams/classify-ai-architecture-dark.png"
              title="Classify AI Hybrid Retrieval & Execution Architecture"
              caption="End-to-end transaction categorization pipeline: Users interact with books.finally.com; Books Backend integrates Plaid Service, Heron Service, and custom Rules Engine. Asynchronous classification tasks dispatch via Redis and Celery into the AI Server. The hybrid engine queries Key-Value caches, Postgres DB, and Pinecone vector search alongside Elasticsearch BM25, outputting normalized JSON categorizations with confidence metrics."
              excalidrawSrc="/classify_ai_cash_underwriting.excalidraw"
              aspectRatio="14160/9434"
            />

            <h2>3. Living inside the exceptions</h2>
            <p>
              The pipeline was built for the tail. Recurring vendors like Slack and GitHub resolve
              in under 15 milliseconds from cache, and that compute headroom is what buys time for
              the ambiguous ones. Batch ingestion is idempotent, verified against ledger hash
              digests, because a duplicate posting in a ledger is not a bug you patch, it is trust
              you lose.
            </p>
            <p>
              The 92% threshold is where the product thinking lived. Every point of confidence is a
              trade between the bookkeeper&rsquo;s time and the ledger&rsquo;s integrity. We chose
              to leave the uncertain work visible rather than automate a guess. The number of
              transactions routed to review was a feature you could watch, not an error we hid.
            </p>

            <h2>4. What changed</h2>
            <p>
              Manual categorization dropped by roughly 80%. A first-month close that took more than
              four months of manual review took about two weeks. Bookkeepers stopped tagging
              transactions and started working on accruals and tax strategy, which is what they
              were actually for.
            </p>
            <p>
              The lesson I carry from this one: the model was never the product. The chart of
              accounts, the confidence gate, the review queue. That was the product. The embedding
              just made it fast.
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
                  <Link href="/blog/cash-based-underwriting">
                    Cash-based underwriting: 90-day balance reconstruction →
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
