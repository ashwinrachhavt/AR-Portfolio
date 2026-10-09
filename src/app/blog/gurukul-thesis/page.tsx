import { Metadata } from "next";
import Link from "next/link";
import ProductBrief from "../components/ProductBrief";
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
    <div className={styles.main}>
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
              How we built an adaptive learning platform using RAG and Socratic guardrails to guide student programming without leaking direct solutions. Research cited 130+ times and published in IEEE FIE & SoutheastCon.
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

          <ProductBrief
            eyebrow="Product brief · Gurukul"
            title="An educational tutor designed not to give the answer"
            spec="Help a programming student move through a difficult problem while preserving the reasoning they need to learn. The specification was a teaching constraint: diagnose the student’s state, retrieve grounded material, and offer the next useful hint without leaking a complete solution."
            stack={["Web IDE", "AST diagnostics", "Retrieval-augmented guidance", "Socratic guardrails", "Course specifications"]}
            architecture={["Read the student’s code and question", "Use AST diagnostics to identify the failure mode", "Retrieve grounded concepts and course material", "Return one of three progressively stronger hints"]}
            outcome="Gurukul treats an LLM as a dialogue partner inside a pedagogical system. The model can phrase the hint, but the application owns the learning boundary and the decision about how much help to reveal."
          />

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
            <h2>1. The problem with answers</h2>
            <p>
              When ChatGPT arrived, computer science education met a problem it had not planned
              for: the homework stopped being hard. Generative models produce working solutions for
              typical introductory assignments on demand. Binary trees, dynamic programming, the
              usual suspects.
            </p>
            <p>
              The working solution is not the danger. The danger is what gets skipped. Reading
              compiler traces, building a mental model of memory, debugging the same bug four
              times: that struggle is the education. A student who outsources it submits working
              homework and learns nothing. The grade survives. The engineer does not exist yet.
            </p>
            <p>
              Banning AI was the popular response and it was always going to fail. Engineers write
              code alongside AI every day now. The question my thesis asked was narrower: can you
              build an environment where the model helps the student think instead of thinking for
              them?
            </p>

            <h2>2. What we built</h2>
            <p>
              Gurukul is three systems in sequence:
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
            <p>
              The AST parser reads the student&rsquo;s code the way a compiler would: it finds the
              syntax break, the infinite loop, the pattern that does not match the course spec.
              The retrieval layer grounds hints in verified textbook material and, importantly,
              excludes raw code completions from the prompt context entirely. The guardrail engine
              sits between the student and the model, and it decides what the model is allowed to
              say.
            </p>

            <h2>3. The hint ladder</h2>
            <p>
              Instead of an answer, Gurukul returns one of three hints, matched to where the
              student actually is:
            </p>
            <ul>
              <li>
                <strong>Level 1, a conceptual clue.</strong> The principle without the syntax.
                &ldquo;Consider what happens to your left pointer when the midpoint element is
                smaller than the target.&rdquo;
              </li>
              <li>
                <strong>Level 2, algorithmic direction.</strong> The state transition in plain
                language. &ldquo;In a sorted array, elements left of <code>mid</code> cannot
                contain the target when <code>arr[mid] &gt; target</code>.&rdquo;
              </li>
              <li>
                <strong>Level 3, fill-in-the-blank pseudocode.</strong> Structure with the
                conditions blanked out. The student still writes the logic themselves.
              </li>
            </ul>
            <p>
              Ask for the code directly and the guardrail declines and steps back down the ladder.
              The model can phrase whatever it wants; the application owns what gets revealed.
            </p>

            <h2>4. What the studies showed</h2>
            <p>
              In user studies with Virginia Tech students learning data structures: students using
              Gurukul showed higher conceptual retention on delayed post-tests than students with
              open access to unconstrained ChatGPT. They also reported less frustration, because a
              hint aimed at your actual misconception beats a wall of generated boilerplate.
            </p>
            <p>
              The finding I would stand behind is the narrower one. Deterministic guardrails on a
              generative model are feasible, and they change the learning outcome. Not by making
              the model smarter. By deciding, in advance and in code, what the model is for.
            </p>

            <div className={styles.backlinksBox}>
              <h3>Related</h3>
              <ul>
                <li>
                  <a href="https://vtechworks.lib.vt.edu/items/3d08a8cd-effe-4e41-9830-0204637e53da" target="_blank" rel="noopener noreferrer">
                    Full thesis PDF (Virginia Tech) ↗
                  </a>
                </li>
                <li>
                  <a href="https://github.com/ashwinrachha786/Gurukul_v2" target="_blank" rel="noopener noreferrer">
                    Gurukul_v2 on GitHub ↗
                  </a>
                </li>
                <li>
                  <a href="https://scholar.google.com/citations?user=opsMRzEAAAAJ" target="_blank" rel="noopener noreferrer">
                    Google Scholar ↗
                  </a>
                </li>
              </ul>
            </div>
          </article>
        </div>
      </div>
  );
}
