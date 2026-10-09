import { Metadata } from "next";
import Link from "next/link";
import ArchitectureDiagram from "@/app/components/ArchitectureDiagram";
import styles from "./lois.module.css";

export const metadata: Metadata = {
  title: "Lois: Agentic Mortgage Workflows on Bedrock AgentCore | Ashwin Rachha",
  description:
    "How we re-architected Lois from one-off Ruby LLM calls into a LangGraph agentic system with fail-closed Composio authorization for loan document classification and lender policy validation.",
  openGraph: {
    title: "Lois: Agentic Mortgage Workflows on Bedrock AgentCore",
    description:
      "A deep dive into building production agentic AI with deterministic state machines and strict tool boundaries.",
    type: "article",
    publishedTime: "2026-09-24T00:00:00Z",
  },
};

export default function LoisDeepDivePage() {
  return (
    <div className={styles.main}>
      <div className={styles.readingColumn}>
          <Link href="/blog" className={styles.backLink}>
            ← All writing & deep dives
          </Link>

          <header className={styles.header}>
            <div className={styles.metaRow}>
              <span className={styles.categoryBadge}>Agentic AI & Systems</span>
              <span className={styles.dot}>·</span>
              <time dateTime="2026-09-24">September 24, 2026</time>
              <span className={styles.dot}>·</span>
              <span>8 min read</span>
            </div>

            <h1 className={styles.title}>
              Lois: Building Mortgage Document Agents on Amazon Bedrock AgentCore
            </h1>

            <p className={styles.subtitle}>
              From fragile prompt scripts to a typed LangGraph state machine with fail-closed
              authorization and lender policy validation.
            </p>

            <div className={styles.authorBar}>
              <div className={styles.authorInfo}>
                <span className={styles.authorName}>Ashwin Rachha</span>
                <span className={styles.authorRole}>Applied AI Engineer · Loan Labs</span>
              </div>
            </div>
          </header>

          <article className={styles.prose}>
            <h2>1. The file is the problem</h2>
            <p>
              A single loan packet can run past 400 pages of PDFs: appraisals, tax returns, W-2s,
              title commitments, purchase contracts, bank statements. Borrowers upload scans named
              <code>IMG_4901_final.pdf</code>. Loan officers spend their hours opening documents,
              renaming files to lender conventions, and checking policies by hand. Is this appraisal
              under 120 days old? Are all the required pages here?
            </p>
            <p>
              The first automation attempt was one-off Ruby LLM calls. It worked, in the way a
              prototype works. Then three failures started compounding:
            </p>
            <ul>
              <li><strong>Guessed answers.</strong> Models misclassified ambiguous pages and invented missing dates.</li>
              <li><strong>Permission overreach.</strong> Scripts ran with ambient API tokens, unrestricted delete and overwrite across shared Drive and Box folders.</li>
              <li><strong>Half-done states.</strong> A network timeout mid-tool-call left files unrecoverable.</li>
            </ul>
            <p>
              Each failure alone is an annoyance. Together they tell you something: an agent inside
              a mortgage workflow is not a chat problem. It is a permissions problem.
            </p>

            <h2>2. A state machine, not a prompt</h2>
            <p>
              I re-architected Lois as a finite state machine in LangGraph, deployed on Amazon
              Bedrock AgentCore. Classification, extraction, policy validation, renaming: each a
              node with typed inputs, so a failure fails at a step you can name instead of
              somewhere inside a prompt you cannot.
            </p>
            <ArchitectureDiagram
              svgSrc="/images/diagrams/lois-architecture-dark.svg"
              pngSrc="/images/diagrams/lois-architecture-dark.png"
              title="Lois Agentic Pipeline & Permission Architecture"
              caption="End-to-end mortgage workflow: Borrower/Loan Officer intake via LoisOS Chat, Email, and Slack feeds into LoanOS Backend APIs with Postgres DB, connecting to cloud storages (Box, Salesforce, Google Drive). The execution flow delegates to MCP Tool Discovery with strict Auth & Traceability, running on AWS AgentCore Runtime with Amazon Bedrock Claude models and fine-tuned underwriting verification nodes."
              excalidrawSrc="/lois.excalidraw"
              aspectRatio="1465/1688"
            />

            <h2>3. Fail closed, always</h2>
            <p>
              The tenet I care most about from this project: an autonomous agent should never hold
              ambient broad API privileges. Not because the model is untrustworthy, but because a
              system you cannot bound is a system you cannot operate.
            </p>
            <p>
              We enforced it through Composio integrations with Google Drive, Box, Salesforce, and
              SharePoint:
            </p>
            <ul>
              <li><strong>Tenant scoping.</strong> Every tool payload carries an immutable tenant and borrower ID. The agent cannot traverse outside its own folder hierarchy.</li>
              <li><strong>Partitioned permissions.</strong> Explicit read, write_new, append_metadata. Delete and purge are hard-blocked at the gateway, not politely discouraged in a prompt.</li>
              <li><strong>Execution-time checks.</strong> Revoke access while a five-step graph is running and step three fails closed. No downstream side effects.</li>
            </ul>
            <p>
              The distinction that matters here is between what a model can say and what
              application code will do. The model proposes a classification. Code owns authority.
              A guess can never become an irreversible write, because the boundary between the two
              is enforced in the gateway, not requested in the prompt.
            </p>

            <h2>4. Naming is compliance</h2>
            <p>
              Every wholesale lender enforces different file conventions. One wants
              <code>[Year]_[BorrowerLastName]_[DocType]_[LoanNumber].pdf</code>. Another wants
              <code>[LoanNumber] - [DocCategory] - [FormID] - Final.pdf</code>. Get it wrong and
              the loan package bounces.
            </p>
            <p>
              Lois keeps a deterministic rule engine mapping classified documents onto each
              lender&rsquo;s template. Zero compliance rejections during origination, not because
              the model names files cleverly, but because naming was never left to the model. The
              rules do the renaming. The model does the classifying. Neither does the other&rsquo;s
              job.
            </p>

            <div className={styles.backlinksBox}>
              <h3>Related</h3>
              <ul>
                <li>
                  <Link href="/work/loan-labs">
                    Loan Labs role profile →
                  </Link>
                </li>
                <li>
                  <Link href="/blog/3b92e262-08a5-8186-942c-ff5559fe4f68">
                    Essay: MCP, sessions, and where state belongs →
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
