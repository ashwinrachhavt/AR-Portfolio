"use client";

import React, { useState } from "react";
import styles from "./classify.module.css";

interface TxnSample {
  id: string;
  raw: string;
  amount: number;
  cleanedMerchant: string;
  categoryStartup: { account: string; code: string; confidence: number };
  categoryAgency: { account: string; code: string; confidence: number };
  isTransfer?: boolean;
}

const TXN_SAMPLES: TxnSample[] = [
  {
    id: "aws",
    raw: "AMZN MKTP US*2X7BK9 WA 09-18",
    amount: -127.43,
    cleanedMerchant: "Amazon Web Services / AWS Cloud",
    categoryStartup: { account: "Cost of Goods Sold (Hosting & Infrastructure)", code: "5010", confidence: 0.962 },
    categoryAgency: { account: "Office & Software Subscriptions", code: "6040", confidence: 0.941 },
  },
  {
    id: "coffee",
    raw: "SQ *BLUE BOTTLE COFFEE SAN FRANCISCO",
    amount: -8.50,
    cleanedMerchant: "Blue Bottle Coffee",
    categoryStartup: { account: "Meals & Entertainment (Team)", code: "6150", confidence: 0.938 },
    categoryAgency: { account: "Client Hospitality & Meals", code: "6120", confidence: 0.925 },
  },
  {
    id: "gusto",
    raw: "GUSTO PAYROLL PE10884 DIR DEP",
    amount: -14250.00,
    cleanedMerchant: "Gusto Payroll Services",
    categoryStartup: { account: "Payroll Expenses (Salaries & Wages)", code: "6000", confidence: 0.995 },
    categoryAgency: { account: "Staff & Contractor Wages", code: "6010", confidence: 0.991 },
  },
  {
    id: "transfer",
    raw: "ONLINE TRANSFER TO CHK ...4912 REF#9821",
    amount: -5000.00,
    cleanedMerchant: "Internal Account Transfer",
    categoryStartup: { account: "Inter-Account Balance Sheet Transfer (Non-Expense)", code: "1099", confidence: 0.988 },
    categoryAgency: { account: "Inter-Account Balance Sheet Transfer (Non-Expense)", code: "1099", confidence: 0.988 },
    isTransfer: true,
  },
  {
    id: "airline",
    raw: "DELTA AIR 00623819472 ATLANTA GA",
    amount: -482.10,
    cleanedMerchant: "Delta Air Lines",
    categoryStartup: { account: "Travel & Lodging (Executive)", code: "6200", confidence: 0.954 },
    categoryAgency: { account: "Reimbursable Client Travel Expenses", code: "6210", confidence: 0.947 },
  },
  {
    id: "mystery",
    raw: "MISC DEBIT 994829 VENDOR REF IL",
    amount: -315.00,
    cleanedMerchant: "Unrecognized / Ambiguous Debit",
    categoryStartup: { account: "Uncategorized Expense (Needs Review)", code: "9999", confidence: 0.442 },
    categoryAgency: { account: "Uncategorized Expense (Needs Review)", code: "9999", confidence: 0.442 },
  },
];

export default function ClassifyAiSimulator() {
  const [selectedTxn, setSelectedTxn] = useState<TxnSample>(TXN_SAMPLES[0]);
  const [chartProfile, setChartProfile] = useState<"startup" | "agency">("startup");

  const activeCategory = chartProfile === "startup" ? selectedTxn.categoryStartup : selectedTxn.categoryAgency;
  const isAutoPosted = activeCategory.confidence >= 0.92 && !selectedTxn.isTransfer;

  return (
    <div className={styles.simCard}>
      <div className={styles.simControls}>
        <div className={styles.controlBox}>
          <label className={styles.label}>1. Select Raw Bank Transaction Feed</label>
          <div className={styles.txnList}>
            {TXN_SAMPLES.map((txn) => (
              <button
                key={txn.id}
                type="button"
                className={`${styles.txnBtn} ${selectedTxn.id === txn.id ? styles.txnBtnActive : ""}`}
                onClick={() => setSelectedTxn(txn)}
              >
                <div className={styles.txnBtnLeft}>
                  <code className={styles.rawText}>{txn.raw}</code>
                  <span className={styles.cleanName}>{txn.cleanedMerchant}</span>
                </div>
                <div className={styles.txnAmount}>
                  ${Math.abs(txn.amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className={styles.controlBox}>
          <label className={styles.label}>2. Client Chart of Accounts (COA) Context</label>
          <div className={styles.coaPills}>
            <button
              type="button"
              className={`${styles.pillBtn} ${chartProfile === "startup" ? styles.pillBtnActive : ""}`}
              onClick={() => setChartProfile("startup")}
            >
              Technology Startup Chart (SaaS/COGS)
            </button>
            <button
              type="button"
              className={`${styles.pillBtn} ${chartProfile === "agency" ? styles.pillBtnActive : ""}`}
              onClick={() => setChartProfile("agency")}
            >
              Professional Agency Chart (Consulting)
            </button>
          </div>

          <div className={styles.pipelineTrace}>
            <div className={styles.traceHeader}>PIPELINE STAGES RESOLVED</div>
            <ul className={styles.traceSteps}>
              <li>
                <span className={styles.stageDot}>1</span>
                <span><strong>Regex Normalizer:</strong> Stripped store numbers & transaction noise</span>
              </li>
              <li>
                <span className={styles.stageDot}>2</span>
                <span><strong>Pinecone Vector Search:</strong> Dense embedding similarity: <code>{(activeCategory.confidence * 0.98).toFixed(3)}</code></span>
              </li>
              <li>
                <span className={styles.stageDot}>3</span>
                <span><strong>Elasticsearch BM25:</strong> Sparse lexical match confirmed anchor</span>
              </li>
              <li>
                <span className={styles.stageDot}>4</span>
                <span><strong>COA Re-ranker:</strong> Mapped to client GL account <code>{activeCategory.code}</code></span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Decision Output Card */}
      <div className={styles.resultBanner}>
        <div className={styles.resultDetails}>
          <div className={styles.resultEyebrow}>CLASSIFICATION DECISION</div>
          <div className={styles.glTitle}>
            Account [{activeCategory.code}]: {activeCategory.account}
          </div>
          <div className={styles.metaRow}>
            <span>Confidence: <strong>{(activeCategory.confidence * 100).toFixed(1)}%</strong></span>
            <span>·</span>
            <span>Amount: <strong>${Math.abs(selectedTxn.amount).toFixed(2)}</strong></span>
            <span>·</span>
            <span>Ledger: <strong>QuickBooks Online</strong></span>
          </div>
        </div>

        <div className={styles.actionOutcome}>
          {selectedTxn.isTransfer ? (
            <div className={styles.badgeTransfer}>
              Excluded from P&L (Balance Sheet Transfer)
            </div>
          ) : isAutoPosted ? (
            <div className={styles.badgeApproved}>
              ✓ Auto-Categorized & Posted
            </div>
          ) : (
            <div className={styles.badgeReview}>
              ⚠ Routed to Bookkeeper Review Queue
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
