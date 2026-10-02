"use client";

import React, { useState } from "react";
import styles from "./gurukul.module.css";

interface ProblemCase {
  id: string;
  title: string;
  description: string;
  studentCodeSnippet: string;
  inquiries: {
    label: string;
    studentPrompt: string;
    guardrailTriggered: boolean;
    guardrailAction: string;
    socraticHintLevel1: string;
    socraticHintLevel2: string;
    socraticHintLevel3: string;
  }[];
}

const PROBLEMS: ProblemCase[] = [
  {
    id: "binary-search",
    title: "Binary Search Pointer Convergence",
    description: "Searching for an integer target in an ascending sorted array in O(log n) time.",
    studentCodeSnippet: `def binary_search(arr, target):
    left = 0
    right = len(arr) - 1
    while left <= right:
        mid = (left + right) // 2
        if arr[mid] == target:
            return mid
        elif arr[mid] < target:
            left = mid    # <--- Potential infinite loop bug
        else:
            right = mid - 1
    return -1`,
    inquiries: [
      {
        label: "Direct Solution Request (Cheat Attempt)",
        studentPrompt: "My while loop never terminates. Can you just write the correct Python code for me?",
        guardrailTriggered: true,
        guardrailAction: "Direct Solution Leakage Blocked by Socratic Guardrail",
        socraticHintLevel1:
          "I won't write the code for you, but let's trace the loop together. What happens to the value of `left` when `right - left == 1` and `arr[mid] < target`? Does `left` actually advance?",
        socraticHintLevel2:
          "Because integer division `(left + right) // 2` rounds down, if `left = 0` and `right = 1`, `mid` evaluates to `0`. If you assign `left = mid`, `left` remains `0`. How can you ensure the search space strictly shrinks?",
        socraticHintLevel3:
          "Since you have already inspected `arr[mid]` and know it is strictly less than target, `mid` itself cannot be the answer. Try: `left = mid + _____`.",
      },
      {
        label: "Conceptual Question",
        studentPrompt: "Why do we use (left + right) // 2 instead of linear search?",
        guardrailTriggered: false,
        guardrailAction: "Pedagogical Dialogue Approved",
        socraticHintLevel1:
          "Think about a dictionary: if you're looking up 'Quantum', do you start on page 1, or do you open to the middle? How does knowing the array is already sorted change your search power?",
        socraticHintLevel2:
          "Each midpoint comparison cuts the remaining candidates in half (N -> N/2 -> N/4 -> ... -> 1). What mathematical function describes how many times you can halve a number until reaching 1?",
        socraticHintLevel3:
          "Halving N times is logarithmic: log₂(N). For an array of 1,000,000 elements, linear search takes up to 1,000,000 checks, while binary search takes at most 20 checks!",
      },
    ],
  },
  {
    id: "linked-list",
    title: "Reverse a Singly Linked List",
    description: "Reversing pointers in-place using O(1) extra auxiliary memory.",
    studentCodeSnippet: `def reverse_list(head):
    curr = head
    prev = None
    while curr:
        curr.next = prev
        prev = curr
        curr = curr.next   # <--- Bug: lost forward pointer!
    return prev`,
    inquiries: [
      {
        label: "Direct Solution Request",
        studentPrompt: "My loop only reverses one node and stops. Give me the working function.",
        guardrailTriggered: true,
        guardrailAction: "Direct Solution Leakage Blocked by Socratic Guardrail",
        socraticHintLevel1:
          "Look closely at the order of your pointer updates. Once you execute `curr.next = prev`, where does `curr.next` point? Did you save the address of the rest of the list first?",
        socraticHintLevel2:
          "Before severing a bridge, you must remember the destination! You need a temporary reference (e.g. `next_node = curr.next`) before redirecting `curr.next = prev`.",
        socraticHintLevel3:
          "Scaffold:\n```python\nnext_node = curr.next   # 1. Save next\ncurr.next = prev        # 2. Reverse link\nprev = curr             # 3. Advance prev\ncurr = _______          # 4. Advance curr using saved next\n```",
      },
    ],
  },
];

export default function GurukulSimulator() {
  const [selectedProblem, setSelectedProblem] = useState<ProblemCase>(PROBLEMS[0]);
  const [selectedInquiryIdx, setSelectedInquiryIdx] = useState<number>(0);
  const [hintLevel, setHintLevel] = useState<1 | 2 | 3>(1);

  const activeInquiry = selectedProblem.inquiries[selectedInquiryIdx];

  const currentHintText =
    hintLevel === 1
      ? activeInquiry.socraticHintLevel1
      : hintLevel === 2
      ? activeInquiry.socraticHintLevel2
      : activeInquiry.socraticHintLevel3;

  return (
    <div className={styles.simCard}>
      <div className={styles.simHeader}>
        <div>
          <span className={styles.simBadge}>GURUKUL PEDAGOGICAL ENGINE · VIRGINIA TECH RESEARCH</span>
          <h3 className={styles.simTitle}>Adaptive Socratic Guardrail in Action</h3>
        </div>
        <div className={styles.guardrailStatus}>
          <span
            className={styles.statusDot}
            style={{ background: activeInquiry.guardrailTriggered ? "#ef4444" : "#22c55e" }}
          />
          <span>{activeInquiry.guardrailTriggered ? "Guardrail Active" : "Direct Dialogue"}</span>
        </div>
      </div>

      <div className={styles.simGrid}>
        {/* Left: Problem & Code */}
        <div className={styles.codeColumn}>
          <div className={styles.selectorGroup}>
            <label className={styles.label}>Select DSA Problem Scenario:</label>
            <div className={styles.tabButtons}>
              {PROBLEMS.map((prob) => (
                <button
                  key={prob.id}
                  type="button"
                  className={`${styles.tabBtn} ${selectedProblem.id === prob.id ? styles.tabBtnActive : ""}`}
                  onClick={() => {
                    setSelectedProblem(prob);
                    setSelectedInquiryIdx(0);
                    setHintLevel(1);
                  }}
                >
                  {prob.title}
                </button>
              ))}
            </div>
          </div>

          <div className={styles.codeSnippetBox}>
            <div className={styles.snippetHeader}>
              <span>Student Submitted Python Code (AST Parsed)</span>
            </div>
            <pre>
              <code>{selectedProblem.studentCodeSnippet}</code>
            </pre>
          </div>

          <div className={styles.inquiryGroup}>
            <label className={styles.label}>Student Interactive Prompt:</label>
            <div className={styles.inquiryList}>
              {selectedProblem.inquiries.map((inq, i) => (
                <button
                  key={i}
                  type="button"
                  className={`${styles.inquiryBtn} ${selectedInquiryIdx === i ? styles.inquiryBtnActive : ""}`}
                  onClick={() => {
                    setSelectedInquiryIdx(i);
                    setHintLevel(1);
                  }}
                >
                  <span className={styles.inquiryLabel}>{inq.label}</span>
                  <span className={styles.inquiryPrompt}>&ldquo;{inq.studentPrompt}&rdquo;</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Guardrail Evaluation & Scaffolding */}
        <div className={styles.tutorColumn}>
          {activeInquiry.guardrailTriggered && (
            <div className={styles.guardrailAlert}>
              <div className={styles.alertTitle}>Socratic Guardrail Triggered</div>
              <p className={styles.alertDesc}>{activeInquiry.guardrailAction}</p>
            </div>
          )}

          <div className={styles.scaffoldingCard}>
            <div className={styles.scaffoldHeader}>
              <span className={styles.scaffoldTitle}>BLOOM&apos;S TAXONOMY HINT LADDER</span>
              <div className={styles.levelButtons}>
                <button
                  type="button"
                  className={`${styles.levelBtn} ${hintLevel === 1 ? styles.levelBtnActive : ""}`}
                  onClick={() => setHintLevel(1)}
                >
                  Level 1 (Concept)
                </button>
                <button
                  type="button"
                  className={`${styles.levelBtn} ${hintLevel === 2 ? styles.levelBtnActive : ""}`}
                  onClick={() => setHintLevel(2)}
                >
                  Level 2 (Logic)
                </button>
                <button
                  type="button"
                  className={`${styles.levelBtn} ${hintLevel === 3 ? styles.levelBtnActive : ""}`}
                  onClick={() => setHintLevel(3)}
                >
                  Level 3 (Scaffold)
                </button>
              </div>
            </div>

            <div className={styles.tutorSpeech}>
              <div className={styles.tutorAvatar}>Gurukul Tutor</div>
              <div className={styles.tutorMessage}>
                <p>{currentHintText}</p>
              </div>
            </div>

            <div className={styles.pedagogicalFootnote}>
              <span>✓ Prevents cognitive offloading</span>
              <span>✓ Encourages mental model formulation</span>
              <span>✓ Aligned with IEEE FIE 2024 findings</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
