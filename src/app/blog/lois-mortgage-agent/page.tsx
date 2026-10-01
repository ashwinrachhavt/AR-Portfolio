import { Metadata } from "next";
import Link from "next/link";
import LoisAgentSimulator from "./LoisAgentSimulator";
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
              <span>11 min read</span>
            </div>

            <h1 className={styles.title}>
              Lois: Building Resilient Mortgage Document Agents on Amazon Bedrock AgentCore
            </h1>

            <p className={styles.subtitle}>
              From fragile prompt scripts to a typed LangGraph state machine with fail-closed Composio security, lender policy validation, and automated LoanOS workflows.
            </p>

            <div className={styles.authorBar}>
              <div className={styles.authorInfo}>
                <span className={styles.authorName}>Ashwin Rachha</span>
                <span className={styles.authorRole}>Applied AI Engineer · Loan Labs</span>
              </div>
              <div className={styles.statsBadges}>
                <span className={styles.badge}>LangGraph on Bedrock</span>
                <span className={styles.badge}>Fail-Closed Composio Auth</span>
                <span className={styles.badge}>-85% Intake Delays</span>
              </div>
            </div>
          </header>

          {/* Interactive Agent Simulator */}
          <section id="simulator" className={styles.simulatorWrapper}>
            <div className={styles.simulatorIntro}>
              <h2>Interactive LangGraph Agent Trace</h2>
              <p>
                Select a sample mortgage document and a lender policy profile to trace the agentic state machine step by step—from OCR classification and lender-specific renaming to permission-checked tool execution.
              </p>
            </div>
            <LoisAgentSimulator />
          </section>

          {/* Technical Prose */}
          <article className={styles.prose}>
            <h2>1. The Problem: The Chaos of the Mortgage File</h2>
            <p>
              In business-purpose and residential mortgage lending, a single loan application packet can exceed 400 pages of unstructured, multi-source PDFs: appraisals, tax returns, W-2s, title commitments, purchase contracts, and bank statements.
            </p>
            <p>
              Borrowers upload scanned images with nonsensical filenames like <code>IMG_4901_final.pdf</code> or <code>scan004.pdf</code>. Loan officers waste hours opening documents, verifying completeness, manually renaming files according to secondary market lender conventions (e.g., Fannie Mae vs. Chase Wholesale), and validating basic underwriting policies (e.g., &ldquo;Is this appraisal less than 120 days old? Are all required pages present?&rdquo;).
            </p>
            <p>
              Early attempts to automate this used one-off Ruby LLM calls. However, as prompt length grew and tool calls proliferated, the system suffered from three compounding failures:
            </p>
            <ul>
              <li><strong>Unbounded Hallucination:</strong> Models misclassified ambiguous pages or &ldquo;guessed&rdquo; missing dates.</li>
              <li><strong>Permission Overreach:</strong> Ambient API tokens gave scripts unrestricted delete and overwrite privileges across shared Google Drive and Box folders.</li>
              <li><strong>Non-Deterministic Failures:</strong> Network timeouts or partial tool responses left files in unrecoverable, half-processed states.</li>
            </ul>

            <h2>2. The Architecture: LangGraph on Bedrock AgentCore</h2>
            <p>
              To solve this, I re-architected Lois into a finite state machine using <strong>LangGraph</strong> deployed onto <strong>Amazon Bedrock AgentCore Runtime</strong>:
            </p>

            <ArchitectureDiagram
              svgSrc="/images/diagrams/lois-architecture-dark.svg"
              pngSrc="/images/diagrams/lois-architecture-dark.png"
              title="Lois Agentic Pipeline & Permission Architecture"
              caption="End-to-end mortgage workflow: Borrower/Loan Officer intake via LoisOS Chat, Email, and Slack feeds into LoanOS Backend APIs with Postgres DB, connecting to cloud storages (Box, Salesforce, Google Drive). The execution flow delegates to MCP Tool Discovery with strict Auth & Traceability, running on AWS AgentCore Runtime with Amazon Bedrock Claude models and fine-tuned underwriting verification nodes."
              excalidrawSrc="/lois.excalidraw"
              aspectRatio="1465/1688"
            />

            <h2>3. Fail-Closed Authorization: Why LLMs Must Never Have Ambient Delete</h2>
            <p>
              One of the core engineering tenets I established at Loan Labs was <strong>fail-closed authorization</strong>. An autonomous agent should never operate with ambient broad API privileges.
            </p>
            <p>
              Using Composio integrations with Google Drive, Box, Salesforce, and SharePoint, we enforced strict isolation:
            </p>
            <ul>
              <li><strong>Tenant Scoping:</strong> Every tool execution payload contains an immutable tenant and borrower ID. The agent cannot traverse outside its assigned folder hierarchy.</li>
              <li><strong>Permission Partitioning:</strong> The agent has explicit <code>read</code>, <code>write_new</code>, and <code>append_metadata</code> permissions. All <code>delete</code> and <code>purge</code> actions are hard-blocked at the gateway layer.</li>
              <li><strong>Execution-Time Checks:</strong> If a loan officer revokes document processing while a 5-step agent graph is executing, step 3 immediately fails closed rather than executing downstream side effects.</li>
            </ul>

            <h2>4. Lender-Specific Renaming & Normalization</h2>
            <p>
              Every wholesale lender enforces different naming conventions. For example:
            </p>
            <ul>
              <li><strong>Lender A:</strong> <code>[Year]_[BorrowerLastName]_[DocType]_[LoanNumber].pdf</code></li>
              <li><strong>Lender B:</strong> <code>[LoanNumber] - [DocCategory] - [FormID] - Final.pdf</code></li>
            </ul>
            <p>
              Lois maintains a deterministic rule engine that maps classified documents into target secondary market templates, ensuring zero compliance rejections during loan origination.
            </p>

            <div className={styles.backlinksBox}>
              <h3>Explore Related Architecture & Code</h3>
              <ul>
                <li>
                  <Link href="/work/loan-labs">
                    Loan Labs Role & Experience Profile →
                  </Link>
                </li>
                <li>
                  <Link href="/blog/3b92e262-08a5-8186-942c-ff5559fe4f68">
                    Essay: MCP, Sessions, and Where State Belongs →
                  </Link>
                </li>
                <li>
                  <Link href="/blog/from-documents-to-decisions">
                    Decision Lab: Documents to Decisions Interactive Lab →
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
