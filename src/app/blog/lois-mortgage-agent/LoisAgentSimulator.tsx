"use client";

import React, { useState } from "react";
import styles from "./lois.module.css";

interface DocSample {
  id: string;
  name: string;
  expectedType: string;
  confidence: number;
  extractedSnippet: string;
  lenderRenaming: {
    fannieMae: string;
    chase: string;
    quicken: string;
  };
  policyCheck: {
    passed: boolean;
    rule: string;
  };
}

const SAMPLES: DocSample[] = [
  {
    id: "appraisal",
    name: "borrower_appraisal_final_v2.pdf",
    expectedType: "Uniform Residential Appraisal Report (URAR 1004)",
    confidence: 0.984,
    extractedSnippet: "SUBJECT PROPERTY: 742 Evergreen Terrace, Springfield, IL. APPRAISED VALUE: $485,000. INSPECTION DATE: 2026-01-18.",
    lenderRenaming: {
      fannieMae: "FNMA_APPRAISAL_1004_Sample_485K.pdf",
      chase: "CHASE_WHOLESALE_LN9821_Appraisal.pdf",
      quicken: "Rocket_PropertyValuation_742Evergreen.pdf",
    },
    policyCheck: {
      passed: true,
      rule: "Appraisal date within 120-day validity window (Inspection: Jan 18, 2026)",
    },
  },
  {
    id: "1003",
    name: "uniform_residential_loan_application_1003.pdf",
    expectedType: "Uniform Residential Loan Application (Fannie Mae Form 1003)",
    confidence: 0.992,
    extractedSnippet: "BORROWER: John Q. Sample. EMPLOYMENT: Lead Architect, Acme Corp. BASE INCOME: $185,000/yr. ASSETS: $142,500 checking.",
    lenderRenaming: {
      fannieMae: "FNMA_1003_Sample_JohnQ_LoanApp.pdf",
      chase: "CHASE_1003_Application_LN9821.pdf",
      quicken: "Rocket_1003_PrimaryBorrower.pdf",
    },
    policyCheck: {
      passed: true,
      rule: "Section 1-8 all completed, borrower signature block verified",
    },
  },
  {
    id: "w2",
    name: "w2_wage_tax_statement_2025.pdf",
    expectedType: "Form W-2 Wage and Tax Statement (2025)",
    confidence: 0.978,
    extractedSnippet: "EMPLOYER: Acme Software Corp, EIN: 12-3456789. BOX 1 WAGES: $185,240. BOX 2 FED TAX: $38,400.",
    lenderRenaming: {
      fannieMae: "FNMA_INCOME_W2_2025_Sample.pdf",
      chase: "CHASE_INCOME_W2_TaxYear2025.pdf",
      quicken: "Rocket_Income_W2_2025.pdf",
    },
    policyCheck: {
      passed: true,
      rule: "Matches stated employer on 1003 application; full 12-month earnings confirmed",
    },
  },
  {
    id: "ambiguous",
    name: "unrecognized_scanned_receipt_blurred.pdf",
    expectedType: "Uncertain / Degraded Quality Scan",
    confidence: 0.412,
    extractedSnippet: "...TOTAL: $14.50 ... THANK YOU ... [IMAGE ARTIFACTS / ILLEGIBLE HEADER] ...",
    lenderRenaming: {
      fannieMae: "UNPROCESSED_AMBIGUOUS_DOC.pdf",
      chase: "UNPROCESSED_AMBIGUOUS_DOC.pdf",
      quicken: "UNPROCESSED_AMBIGUOUS_DOC.pdf",
    },
    policyCheck: {
      passed: false,
      rule: "Confidence below 90% threshold; missing loan context; fail-closed route to loan officer review",
    },
  },
];

export default function LoisAgentSimulator() {
  const [selectedDoc, setSelectedDoc] = useState<DocSample>(SAMPLES[0]);
  const [lenderProfile, setLenderProfile] = useState<"fannieMae" | "chase" | "quicken">("fannieMae");
  const [isExecuting, setIsExecuting] = useState<boolean>(false);
  const [activeStep, setActiveStep] = useState<number>(4);

  function runAgent() {
    setIsExecuting(true);
    setActiveStep(1);

    setTimeout(() => setActiveStep(2), 600);
    setTimeout(() => setActiveStep(3), 1200);
    setTimeout(() => {
      setActiveStep(4);
      setIsExecuting(false);
    }, 1800);
  }

  const currentRenaming = selectedDoc.lenderRenaming[lenderProfile];

  return (
    <div className={styles.simCard}>
      <div className={styles.simControls}>
        <div className={styles.controlBox}>
          <label className={styles.label}>1. Select Sample Loan Document</label>
          <div className={styles.docList}>
            {SAMPLES.map((doc) => (
              <button
                key={doc.id}
                type="button"
                className={`${styles.docBtn} ${selectedDoc.id === doc.id ? styles.docBtnActive : ""}`}
                onClick={() => {
                  setSelectedDoc(doc);
                  setActiveStep(4);
                }}
              >
                <span className={styles.docName}>{doc.name}</span>
                <span className={styles.docBadge}>
                  {doc.id === "ambiguous" ? "Low Quality" : "Valid Doc"}
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className={styles.controlBox}>
          <label className={styles.label}>2. Target Wholesale Lender Profile</label>
          <div className={styles.lenderPills}>
            <button
              type="button"
              className={`${styles.pillBtn} ${lenderProfile === "fannieMae" ? styles.pillBtnActive : ""}`}
              onClick={() => setLenderProfile("fannieMae")}
            >
              Fannie Mae / Freddie
            </button>
            <button
              type="button"
              className={`${styles.pillBtn} ${lenderProfile === "chase" ? styles.pillBtnActive : ""}`}
              onClick={() => setLenderProfile("chase")}
            >
              Chase Wholesale
            </button>
            <button
              type="button"
              className={`${styles.pillBtn} ${lenderProfile === "quicken" ? styles.pillBtnActive : ""}`}
              onClick={() => setLenderProfile("quicken")}
            >
              Rocket Mortgage
            </button>
          </div>

          <button
            type="button"
            className={styles.executeBtn}
            onClick={runAgent}
            disabled={isExecuting}
          >
            {isExecuting ? "Executing LangGraph State Machine..." : "Re-run Agent Trace ⚡"}
          </button>
        </div>
      </div>

      {/* Execution Stepper */}
      <div className={styles.traceDisplay}>
        <div className={styles.traceHeader}>
          <span className={styles.traceTitle}>LANGGRAPH EXECUTION GRAPH TRACE</span>
          <span className={styles.traceRuntime}>Amazon Bedrock AgentCore Runtime</span>
        </div>

        <div className={styles.stepContainer}>
          {/* Step 1 */}
          <div className={`${styles.stepCard} ${activeStep >= 1 ? styles.stepActive : ""}`}>
            <div className={styles.stepNumber}>01</div>
            <div className={styles.stepContent}>
              <div className={styles.stepTitle}>Multi-Page OCR & Vector Embedding</div>
              <p className={styles.stepDesc}>
                Extracted text: <code>{selectedDoc.extractedSnippet}</code>
              </p>
            </div>
            <div className={styles.stepStatus}>✓ Extracted</div>
          </div>

          {/* Step 2 */}
          <div className={`${styles.stepCard} ${activeStep >= 2 ? styles.stepActive : ""}`}>
            <div className={styles.stepNumber}>02</div>
            <div className={styles.stepContent}>
              <div className={styles.stepTitle}>Document Classification & Confidence</div>
              <p className={styles.stepDesc}>
                Target: <strong>{selectedDoc.expectedType}</strong>
              </p>
            </div>
            <div className={styles.stepStatus} style={{ color: selectedDoc.confidence >= 0.9 ? "#22c55e" : "#ef4444" }}>
              {(selectedDoc.confidence * 100).toFixed(1)}% Confidence
            </div>
          </div>

          {/* Step 3 */}
          <div className={`${styles.stepCard} ${activeStep >= 3 ? styles.stepActive : ""}`}>
            <div className={styles.stepNumber}>03</div>
            <div className={styles.stepContent}>
              <div className={styles.stepTitle}>Lender Policy Validation & Renaming</div>
              <p className={styles.stepDesc}>
                Policy Rule: {selectedDoc.policyCheck.rule}
              </p>
              {selectedDoc.policyCheck.passed && (
                <p className={styles.renameSnippet}>
                  Renamed to: <code>{currentRenaming}</code>
                </p>
              )}
            </div>
            <div className={styles.stepStatus} style={{ color: selectedDoc.policyCheck.passed ? "#22c55e" : "#f59e0b" }}>
              {selectedDoc.policyCheck.passed ? "Policy Passed" : "Flagged for Review"}
            </div>
          </div>

          {/* Step 4 */}
          <div className={`${styles.stepCard} ${activeStep >= 4 ? styles.stepActive : ""}`}>
            <div className={styles.stepNumber}>04</div>
            <div className={styles.stepContent}>
              <div className={styles.stepTitle}>Composio Fail-Closed Security & API Push</div>
              <p className={styles.stepDesc}>
                {selectedDoc.policyCheck.passed ? (
                  <>
                    Tenant Scope: <code>tenant_loanlabs_prod_082</code> | Tool: <code>WRITE_DOCUMENT_RECORD</code> | Delete Action: <strong style={{ color: "#ef4444" }}>BLOCKED</strong>
                  </>
                ) : (
                  <>
                    Fail-Closed Guardrail: Execution halted without cloud mutation. Routed to human loan officer review queue in LoanOS.
                  </>
                )}
              </p>
            </div>
            <div className={styles.stepStatus} style={{ color: selectedDoc.policyCheck.passed ? "#22c55e" : "#3b82f6" }}>
              {selectedDoc.policyCheck.passed ? "Committed" : "Halted & Routed"}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
