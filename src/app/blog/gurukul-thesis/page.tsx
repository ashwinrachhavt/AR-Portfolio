import { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import GurukulSimulator from "./GurukulSimulator";
import styles from "./gurukul.module.css";

export const metadata: Metadata = {
  title: "Gurukul: LLM-Enhanced CS Education & Master's Thesis | Ashwin Rachha",
  description:
    "Master's thesis research at Virginia Tech (4.0/4.0 GPA, 130+ citations). Exploring adaptive CS learning environments with Socratic guardrails, RAG, and AST code diagnostics.",
  openGraph: {
    title: "Gurukul: LLM-Enhanced CS Education & Master's Thesis",
    description:
      "A deep dive into pedagogical AI, Socratic guardrails, and CS education research cited 130+ times.",
    type: "article",
    publishedTime: "2026-09-24T00:00:00Z",
  },
};

export default function GurukulThesisPage() {
  return (
    <>
      <Navbar activeSection="writing" />
      <main className={styles.main}>
        <div className={styles.readingColumn}>
          <Link href="/blog" className={styles.backLink}>
            ← All writing & deep dives
          </Link>

          <header className={styles.header}>
            <div className={styles.metaRow}>
              <span className={styles.categoryBadge}>Master&apos;s Thesis & Research</span>
              <span className={styles.dot}>·</span>
              <time dateTime="2026-09-24">Virginia Tech · 2021–2024</time>
              <span className={styles.dot}>·</span>
              <span>15 min read</span>
            </div>

            <h1 className={styles.title}>
              Gurukul: LLM-Enhanced CS Learning Environments & Master&apos;s Thesis
            </h1>

            <p className={styles.subtitle}>
              How we built an adaptive learning platform using RAG and Socratic guardrails to guide student programming without leaking direct solutions—research cited 130+ times and published in IEEE FIE & SoutheastCon.
            </p>

            <div className={styles.authorBar}>
              <div className={styles.authorInfo}>
                <span className={styles.authorName}>Ashwin Rachha</span>
                <span className={styles.authorRole}>M.S. Computer Science (Thesis), 4.0/4.0 GPA · Virginia Tech</span>
              </div>
              <div className={styles.statsBadges}>
                <span className={styles.badge}>130+ Citations</span>
                <span className={styles.badge}>h-index: 3</span>
                <span className={styles.badge}>IEEE FIE & SoutheastCon</span>
              </div>
            </div>
          </header>

          {/* Interactive Socratic Simulator */}
          <section id="simulator" className={styles.simulatorWrapper}>
            <div className={styles.simulatorIntro}>
              <h2>Interactive Socratic Guardrail Simulator</h2>
              <p>
                Experience Gurukul&apos;s pedagogical guardrails in action. Try asking the tutor for direct code answers or debugging advice, and observe how the system blocks solution leakage and scaffolds conceptual hints.
              </p>
            </div>
            <GurukulSimulator />
          </section>

          {/* Academic Publications Overview */}
          <section className={styles.scholarBox}>
            <div className={styles.scholarHeader}>
              <div>
                <span className={styles.scholarEyebrow}>GOOGLE SCHOLAR CITATION PROFILE</span>
                <h3>Academic Publications & Impact</h3>
              </div>
              <a
                href="https://scholar.google.com/citations?user=opsMRzEAAAAJ"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.scholarBtn}
              >
                View on Google Scholar ↗
              </a>
            </div>

            <div className={styles.metricsRow}>
              <div className={styles.metricItem}>
                <span className={styles.metricNumber}>130</span>
                <span className={styles.metricLabel}>Total Citations</span>
              </div>
              <div className={styles.metricItem}>
                <span className={styles.metricNumber}>3</span>
                <span className={styles.metricLabel}>h-index</span>
              </div>
              <div className={styles.metricItem}>
                <span className={styles.metricNumber}>2</span>
                <span className={styles.metricLabel}>i10-index</span>
              </div>
              <div className={styles.metricItem}>
                <span className={styles.metricNumber}>4.0 / 4.0</span>
                <span className={styles.metricLabel}>Thesis GPA</span>
              </div>
            </div>

            <div className={styles.paperList}>
              <div className={styles.paperCard}>
                <div className={styles.paperCitationCount}>106 citations</div>
                <div className={styles.paperContent}>
                  <h4>Explainable AI in education: Current trends, challenges, and opportunities</h4>
                  <p className={styles.paperAuthors}>A Rachha, M Seyam · IEEE SoutheastCon 2023, 232-239</p>
                  <p className={styles.paperExcerpt}>
                    A comprehensive survey analyzing explainability mechanisms in educational AI systems, establishing transparency frameworks for pedagogical trust.
                  </p>
                </div>
              </div>

              <div className={styles.paperCard}>
                <div className={styles.paperCitationCount}>15 citations</div>
                <div className={styles.paperContent}>
                  <h4>LLM-enhanced learning environments for CS: exploring data structures and algorithms with Gurukul</h4>
                  <p className={styles.paperAuthors}>A Rachha, M Seyam · 2024 IEEE Frontiers in Education Conference (FIE), 1-9</p>
                  <p className={styles.paperExcerpt}>
                    Empirical study and architecture of Gurukul, validating that guarded Socratic prompting produces superior conceptual retention over unconstrained LLM assistants.
                  </p>
                </div>
              </div>

              <div className={styles.paperCard}>
                <div className={styles.paperCitationCount}>Master&apos;s Thesis</div>
                <div className={styles.paperContent}>
                  <h4>Incorporating LLM-based interactive learning environments in CS education: learning data structures and algorithms using the gurukul platform</h4>
                  <p className={styles.paperAuthors}>AK Rachha · Virginia Tech Works Institutional Repository (2024)</p>
                  <p className={styles.paperExcerpt}>
                    The foundational thesis document describing the design, AST evaluation engine, user studies, and algorithmic principles of the Gurukul environment.
                  </p>
                  <div className={styles.paperLinks}>
                    <a
                      href="https://vtechworks.lib.vt.edu/items/3d08a8cd-effe-4e41-9830-0204637e53da"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Download Thesis from VTechWorks ↗
                    </a>
                    <a
                      href="https://github.com/ashwinrachha786/Gurukul_v2"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      View Gurukul v2 on GitHub ↗
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Technical Prose */}
          <article className={styles.prose}>
            <h2>1. The Core Pedagogical Challenge</h2>
            <p>
              When ChatGPT and commercial LLMs arrived, computer science education encountered a profound crisis: generative models can easily synthesize fully functional solutions for typical introductory and intermediate programming assignments (LeetCode easy/medium, binary trees, dynamic programming).
            </p>
            <p>
              If a student relies on generative AI to emit complete code whenever they encounter a bug, the crucial cognitive struggle of software engineering—reading compiler traces, formulating mental models of memory execution, and iterative debugging—is completely bypassed. The student produces working homework but internalizes zero algorithmic reasoning.
            </p>
            <p>
              Conversely, banning AI in education is futile and counterproductive. Software engineers in industry write code alongside AI daily. The goal of my thesis research at Virginia Tech was to engineer an environment that transforms AI from an <strong>&ldquo;answers-on-demand crutch&rdquo;</strong> into a <strong>rigorous Socratic dialogue partner</strong>.
            </p>

            <h2>2. The Gurukul Architecture: RAG + AST + Socratic Guardrails</h2>
            <p>
              Gurukul combines three foundational systems:
            </p>
            <div className={styles.architectureBox}>
              <pre>
{`[Student Code & Question in Web IDE]
                  │
                  ▼
[AST Parser & Static Diagnostic Engine]
  ├── Syntax error & infinite loop detection
  └── Algorithmic pattern matching against course spec
                  │
                  ▼
[Socratic Guardrail Engine]
  ├── Detects direct solution requests ("give me the code")
  └── Enforces 3-tier progressive hint ladder
                  │
                  ▼
[Retrieval-Augmented Guidance (RAG)]
  ├── Grounded in verified textbook algorithms & syllabi
  └── Excludes raw code completion from prompt context
                  │
                  ▼
[Pedagogical Socratic Response]
  (Asks leading questions, highlights invariants, avoids code leakage)`}
              </pre>
            </div>

            <h2>3. The 3-Tier Progressive Hint Ladder</h2>
            <p>
              Instead of binary answers, Gurukul introduces a dynamic scaffolding ladder aligned with Bloom&apos;s Taxonomy:
            </p>
            <ul>
              <li>
                <strong>Level 1 — Socratic Conceptual Clue:</strong> Identifies the conceptual principle without discussing syntax (e.g., &ldquo;Consider what happens to your left pointer when the midpoint element is smaller than the target.&rdquo;).
              </li>
              <li>
                <strong>Level 2 — Algorithmic Direction:</strong> Breaks down the state transition logic in natural language (e.g., &ldquo;Notice that in an already sorted array, elements to the left of <code>mid</code> cannot contain the target if <code>arr[mid] &gt; target</code>.&rdquo;).
              </li>
              <li>
                <strong>Level 3 — Fill-in-the-Blank Pseudocode:</strong> Provides structural scaffolding with deliberate ellipses, forcing the student to write the actual condition logic themselves.
              </li>
            </ul>

            <h2>4. Empirical User Studies and Findings</h2>
            <p>
              In our user studies conducted with computer science students learning data structures at Virginia Tech:
            </p>
            <ul>
              <li>Students using Gurukul demonstrated significantly higher conceptual retention on delayed post-tests compared to students with open access to unconstrained ChatGPT.</li>
              <li>Students reported lower frustration because the tutor met them at their specific point of misconception rather than generating overwhelming boilerplate code.</li>
              <li>The work demonstrated that deterministic guardrails in educational AI are both technically feasible and pedagogically vital.</li>
            </ul>

            <div className={styles.backlinksBox}>
              <h3>Explore Related Research & Code</h3>
              <ul>
                <li>
                  <a href="https://vtechworks.lib.vt.edu/items/3d08a8cd-effe-4e41-9830-0204637e53da" target="_blank" rel="noopener noreferrer">
                    Download Full Master&apos;s Thesis PDF (Virginia Tech Works) ↗
                  </a>
                </li>
                <li>
                  <a href="https://github.com/ashwinrachha786/Gurukul_v2" target="_blank" rel="noopener noreferrer">
                    Gurukul_v2 Repository on GitHub ↗
                  </a>
                </li>
                <li>
                  <a href="https://scholar.google.com/citations?user=opsMRzEAAAAJ" target="_blank" rel="noopener noreferrer">
                    Ashwin Rachha Google Scholar Citations ↗
                  </a>
                </li>
                <li>
                  <Link href="/blog/3bb2e262-08a5-80aa-b865-e905d51fa752">
                    Essay: Inside Buzz — How One Signed Message Becomes Work ↗
                  </Link>
                </li>
              </ul>
            </div>
          </article>
        </div>
      </main>
      <Footer />
    </>
  );
}
