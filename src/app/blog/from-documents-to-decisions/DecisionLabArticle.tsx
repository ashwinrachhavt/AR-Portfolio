"use client";

import { useState, useMemo } from "react";
import styles from "./decision-lab.module.css";
import {
  loisScenario,
  classifyAiScenario,
  type Scenario,
  type DecisionTrace,
} from "@/lib/decision-lab/fixtures";
import { replayScenario, type ReplayResult } from "@/lib/decision-lab/replay";

type Chapter = "intro" | "lois" | "classify-ai";
type InteractionStep = "predict" | "evidence" | "decision" | "policy" | "review";

export default function DecisionLabArticle() {
  const [chapter, setChapter] = useState<Chapter>("intro");
  const [step, setStep] = useState<InteractionStep>("predict");
  const [userPrediction, setUserPrediction] = useState<string | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<string | null>(null);

  const currentScenario: Scenario | null = useMemo(() =>
    chapter === "lois" ? loisScenario :
    chapter === "classify-ai" ? classifyAiScenario :
    null, [chapter]);

  const replayResult: ReplayResult | null = useMemo(() => {
    if (!currentScenario) return null;
    try {
      return replayScenario(currentScenario, selectedVariant || undefined);
    } catch {
      return null;
    }
  }, [currentScenario, selectedVariant]);

  const currentTrace: DecisionTrace | null = replayResult?.trace ?? null;

  const resetChapter = (newChapter: Chapter) => {
    setChapter(newChapter);
    setStep("predict");
    setUserPrediction(null);
    setSelectedVariant(null);
  };

  if (chapter === "intro") {
    return (
      <article className={styles.article}>
        <header className={styles.hero}>
          <p className={styles.eyebrow}>Decision Lab</p>
          <h1>From Documents<br /><span>to Decisions</span></h1>
          <p className={styles.subtitle}>
            Two interactive investigations into a mortgage file and a bank transaction, 
            with Jev as an experimental decision layer.
          </p>
        </header>

        <section className={styles.introduction}>
          <div className={styles.question}>
            <h2>Would you let software decide what these are?</h2>
          </div>

          <div className={styles.examples}>
            <div className={styles.exampleCard}>
              <div className={styles.exampleHeader}>
                <span className={styles.badge}>Synthetic Example</span>
                <code className={styles.filename}>borrower_apprsl_final.pdf</code>
              </div>
              <div className={styles.preview}>
                <p className={styles.previewText}>
                  RESIDENTIAL APPRAISAL REPORT<br /><br />
                  Property Address: 742 Evergreen Terrace, Springfield, IL 62701<br />
                  Borrower: John Q. Sample<br />
                  Appraised Value: $285,000<br />
                  Date of Inspection: January 15, 2026
                </p>
              </div>
              <p className={styles.exampleQuestion}>
                Is this an appraisal? An inspection? A title report? 
                What if page 3 is unreadable?
              </p>
            </div>

            <div className={styles.exampleCard}>
              <div className={styles.exampleHeader}>
                <span className={styles.badge}>Synthetic Example</span>
                <code className={styles.filename}>Transaction from 2026-09-18</code>
              </div>
              <div className={styles.preview}>
                <table className={styles.transactionTable}>
                  <tbody>
                    <tr>
                      <td>Merchant:</td>
                      <td><code>AMZN MKTP US*2X7BK9</code></td>
                    </tr>
                    <tr>
                      <td>Amount:</td>
                      <td>-$127.43</td>
                    </tr>
                    <tr>
                      <td>Prior:</td>
                      <td>Office Supplies (Aug 12), Software (Jul 5)</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className={styles.exampleQuestion}>
                Office supplies? Software? Marketing? 
                What if the business uses a different chart of accounts?
              </p>
            </div>
          </div>

          <div className={styles.thesis}>
            <p>
              The model can propose a typed judgment. Application code owns authority, 
              evidence, human review, and side effects.
            </p>
            <p>
              This article explores how I approach ambiguous AI decisions in consequential workflows—
              drawing on work at Loan Labs (mortgage documents) and Finally (bookkeeping transactions).
            </p>
            <p className={styles.disclosure}>
              <strong>Important:</strong> Jev is a contemporary experimental decision layer 
              shown alongside simplified public reconstructions. It was <strong>not part</strong> of 
              either original product. All examples use fictional data—no employer data, 
              proprietary prompts, or customer records.
            </p>
          </div>

          <nav className={styles.chapterNav}>
            <h2>Choose a chapter</h2>
            <div className={styles.chapterButtons}>
              <button
                className={styles.chapterButton}
                onClick={() => resetChapter("lois")}
              >
                <span className={styles.chapterLabel}>Chapter A</span>
                <span className={styles.chapterTitle}>Lois</span>
                <span className={styles.chapterSubtitle}>Document Investigation</span>
                <span className={styles.chapterDescription}>
                  Mortgage file classification with lender-specific rules
                </span>
              </button>

              <button
                className={styles.chapterButton}
                onClick={() => resetChapter("classify-ai")}
              >
                <span className={styles.chapterLabel}>Chapter B</span>
                <span className={styles.chapterTitle}>Classify AI</span>
                <span className={styles.chapterSubtitle}>Transaction Investigation</span>
                <span className={styles.chapterDescription}>
                  Bank transaction categorization with bookkeeper review
                </span>
              </button>
            </div>
          </nav>

          <aside className={styles.readingNote}>
            <p>
              <strong>Reading path:</strong> Each chapter takes about 3 minutes. 
              You&apos;ll predict a classification, see the evidence, explore how it changes 
              with different inputs, and observe an experimental typed decision layer.
            </p>
            <p>
              An optional &ldquo;Inspect&rdquo; view exposes the underlying contracts, traces, and test fixtures.
            </p>
          </aside>
        </section>
      </article>
    );
  }

  if (!currentScenario || !currentTrace) {
    return <div>Loading...</div>;
  }

  return (
    <article className={styles.article}>
      <nav className={styles.breadcrumb}>
        <button onClick={() => resetChapter("intro")} className={styles.breadcrumbLink}>
          ← Back to intro
        </button>
      </nav>

      <header className={styles.chapterHeader}>
        <p className={styles.eyebrow}>
          {chapter === "lois" ? "Chapter A: Lois" : "Chapter B: Classify AI"}
        </p>
        <h1>
          {chapter === "lois" ? "Document Investigation" : "Transaction Investigation"}
        </h1>
        <p className={styles.badge}>Synthetic Example • Experimental Decision Layer</p>
      </header>

      {step === "predict" && (
        <section className={styles.step}>
          <h2>Make your prediction</h2>
          <p>Based on what you see, what type of {chapter === "lois" ? "document" : "transaction category"} is this?</p>

          <div className={styles.stateDisplay}>
            {chapter === "lois" && (
              <div className={styles.documentPreview}>
                <div className={styles.documentHeader}>
                  <code>{currentScenario.state.filename as string}</code>
                  <span>{String(currentScenario.state.pageCount)} pages</span>
                </div>
                <pre className={styles.extractedText}>
                  {(currentScenario.state.extractedText as string).slice(0, 300)}...
                </pre>
              </div>
            )}

            {chapter === "classify-ai" && (
              <div className={styles.transactionPreview}>
                <table className={styles.transactionTable}>
                  <tbody>
                    <tr>
                      <td>Merchant:</td>
                      <td><code>{currentScenario.state.merchant as string}</code></td>
                    </tr>
                    <tr>
                      <td>Amount:</td>
                      <td>${currentScenario.state.amount as number}</td>
                    </tr>
                    <tr>
                      <td>Date:</td>
                      <td>{currentScenario.state.date as string}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <div className={styles.candidateButtons}>
            {currentScenario.candidates.map((candidate) => (
              <button
                key={candidate.id}
                className={`${styles.candidateButton} ${
                  userPrediction === candidate.id ? styles.selected : ""
                }`}
                onClick={() => setUserPrediction(candidate.id)}
              >
                <span className={styles.candidateLabel}>{candidate.label}</span>
                {candidate.description && (
                  <span className={styles.candidateDescription}>
                    {candidate.description}
                  </span>
                )}
              </button>
            ))}
          </div>

          {userPrediction && (
            <button
              className={styles.continueButton}
              onClick={() => setStep("evidence")}
            >
              See the evidence →
            </button>
          )}
        </section>
      )}

      {step === "evidence" && (
        <section className={styles.step}>
          <h2>Evidence spans</h2>
          <p>
            Your prediction: <strong>{currentScenario.candidates.find(c => c.id === userPrediction)?.label}</strong>
          </p>
          <p>Here&apos;s what the system extracted:</p>

          <div className={styles.evidenceList}>
            {currentScenario.evidenceSpans?.map((span, idx) => (
              <div key={idx} className={styles.evidenceSpan}>
                <code className={styles.spanText}>{span.text}</code>
                <span className={styles.spanSource}>{span.source}</span>
              </div>
            ))}
          </div>

          <div className={styles.variantControls}>
            <h3>What if things change?</h3>
            <p>Select a variant to see how the decision changes:</p>
            <div className={styles.variantButtons}>
              {currentScenario.variants?.map((variant) => (
                <button
                  key={variant.id}
                  className={`${styles.variantButton} ${
                    selectedVariant === variant.id ? styles.selected : ""
                  }`}
                  onClick={() => setSelectedVariant(variant.id)}
                >
                  {variant.label}
                </button>
              ))}
            </div>
            {selectedVariant && (
              <div className={styles.variantEffect}>
                <p>
                  <strong>Effect:</strong> This would change the downstream decision. 
                  (Deterministic replay shows exact changes.)
                </p>
              </div>
            )}
          </div>

          <button
            className={styles.continueButton}
            onClick={() => setStep("decision")}
          >
            See the typed decision →
          </button>
        </section>
      )}

      {step === "decision" && (
        <section className={styles.step}>
          <h2>Experimental typed decision</h2>
          <div className={styles.modeLabel}>
            <span className={styles.badge}>Mode: Deterministic</span>
            <span className={styles.fixtureVersion}>
              Fixture: {currentTrace.fixtureVersion}
            </span>
          </div>

          <p>
            This is <strong>not</strong> the original implementation. 
            Jev is shown as a contemporary experiment with typed questions and bounded answers.
          </p>

          <div className={styles.decisionDisplay}>
            <div className={styles.questionsPanel}>
              <h3>Questions</h3>
              {Object.entries(currentTrace.questions).map(([id, q]) => (
                <div key={id} className={styles.question}>
                  <code className={styles.questionId}>{id}</code>
                  <p className={styles.questionText}>{q.instructions}</p>
                  <span className={styles.questionType}>Type: {q.type}</span>
                </div>
              ))}
            </div>

            <div className={styles.answersPanel}>
              <h3>Typed answers</h3>
              {Object.entries(currentTrace.typedAnswers).map(([id, answer]) => (
                <div key={id} className={styles.answer}>
                  <code className={styles.answerId}>{id}</code>
                  {answer.choice && (
                    <p className={styles.answerValue}>
                      Choice: <strong>{answer.choice}</strong>
                    </p>
                  )}
                  {answer.noul !== undefined && (
                    <p className={styles.answerValue}>
                      Noul: <strong>{answer.noul.toFixed(2)}</strong>
                      <span className={styles.answerNote}>
                        (Bounded yes/no judgment)
                      </span>
                    </p>
                  )}
                  {answer.score !== undefined && (
                    <p className={styles.answerValue}>
                      Score: <strong>{answer.score.toFixed(2)}</strong>
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className={styles.disagreementView}>
            <h3>Compare judgments</h3>
            <table className={styles.comparisonTable}>
              <thead>
                <tr>
                  <th>Your prediction</th>
                  <th>Typed model answer</th>
                  <th>Match?</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <strong>{currentScenario.candidates.find(c => c.id === userPrediction)?.label}</strong>
                  </td>
                  <td>
                    <strong>
                      {currentScenario.candidates.find(c => 
                        c.id === Object.values(currentTrace.typedAnswers)[0]?.choice
                      )?.label}
                    </strong>
                  </td>
                  <td>
                    {userPrediction === Object.values(currentTrace.typedAnswers)[0]?.choice 
                      ? "✓ Yes" 
                      : "✗ No"}
                  </td>
                </tr>
              </tbody>
            </table>
            <p className={styles.disagreementNote}>
              Disagreement is not failure&mdash;it&apos;s an opportunity to examine evidence and policy.
            </p>
          </div>

          <button
            className={styles.continueButton}
            onClick={() => setStep("policy")}
          >
            See policy checks →
          </button>
        </section>
      )}

      {step === "policy" && (
        <section className={styles.step}>
          <h2>Policy checks</h2>
          <p>
            The model answer does not authorize action. 
            Application code runs separate policy checks:
          </p>

          <div className={styles.policyChecks}>
            {currentTrace.policyChecks.map((check, idx) => (
              <div
                key={idx}
                className={`${styles.policyCheck} ${
                  check.passed ? styles.passed : styles.failed
                }`}
              >
                <div className={styles.checkHeader}>
                  <span className={styles.checkIcon}>
                    {check.passed ? "✓" : "✗"}
                  </span>
                  <span className={styles.checkName}>{check.check}</span>
                </div>
                <p className={styles.checkReason}>{check.reason}</p>
              </div>
            ))}
          </div>

          <div className={styles.outcome}>
            <h3>Outcome</h3>
            <div className={styles.outcomeDisplay}>
              <code className={styles.outcomeAction}>{currentTrace.outcome.action}</code>
              <p className={styles.outcomeReason}>{currentTrace.outcome.reason}</p>
            </div>
          </div>

          <button
            className={styles.continueButton}
            onClick={() => setStep("review")}
          >
            Review desk →
          </button>
        </section>
      )}

      {step === "review" && (
        <section className={styles.step}>
          <h2>Review desk</h2>
          <p>As the decision reviewer, what would you do?</p>

          <div className={styles.reviewOptions}>
            <button className={styles.reviewButton}>
              <span className={styles.reviewLabel}>Approve</span>
              <span className={styles.reviewDescription}>
                Accept the typed decision and proceed with the action
              </span>
            </button>

            <button className={styles.reviewButton}>
              <span className={styles.reviewLabel}>Request more information</span>
              <span className={styles.reviewDescription}>
                Ask for clearer evidence before deciding
              </span>
            </button>

            <button className={styles.reviewButton}>
              <span className={styles.reviewLabel}>Hold for manual review</span>
              <span className={styles.reviewDescription}>
                Route to a human reviewer for final judgment
              </span>
            </button>
          </div>

          <div className={styles.auditNote}>
            <h3>Audit trail</h3>
            <pre className={styles.auditLog}>
              {JSON.stringify({
                scenario: currentScenario.id,
                userPrediction,
                typedAnswer: currentTrace.typedAnswers,
                policyResult: currentTrace.policyChecks.every(c => c.passed) ? "allowed" : "blocked",
                variant: selectedVariant || "base",
                reviewedAt: new Date().toISOString(),
              }, null, 2)}
            </pre>
            <p className={styles.auditDisclaimer}>
              No real mutation occurs in this demonstration.
            </p>
          </div>

          <nav className={styles.chapterNavFooter}>
            <button onClick={() => resetChapter("intro")} className={styles.backButton}>
              ← Back to intro
            </button>
            <button
              onClick={() => resetChapter(chapter === "lois" ? "classify-ai" : "lois")}
              className={styles.nextChapterButton}
            >
              {chapter === "lois" ? "Next: Classify AI →" : "Next: Lois →"}
            </button>
          </nav>
        </section>
      )}
    </article>
  );
}
