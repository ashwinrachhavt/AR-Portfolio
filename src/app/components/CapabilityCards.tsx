"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import styles from "./CapabilityCards.module.css";

interface Capability {
  id: string;
  number: string;
  title: string;
  tagline: string;
  skills: string[];
  setupHighlight: string;
  claudeCodexSetup: {
    overview: string;
    workflows: {
      name: string;
      description: string;
      commandExample?: string;
    }[];
    principles: string[];
  };
  backlinks: {
    label: string;
    url: string;
    type: "project" | "github" | "blog" | "research";
    context: string;
  }[];
}

const CAPABILITIES: Capability[] = [
  {
    id: "engineering",
    number: "01",
    title: "Engineering",
    tagline: "Production apps, resilient APIs, agentic orchestration, and CI/CD that ships.",
    skills: ["LangGraph", "Bedrock AgentCore", "Django", "FastAPI", "Rails", "Next.js", "Docker", "Kubernetes"],
    setupHighlight: "Spec-first planning in Claude Code; every change ships behind tests and PR review.",
    claudeCodexSetup: {
      overview:
        "My Claude Code and Codex setup treats LLMs as deterministic compiler passes rather than conversational assistants. I configure custom system rules, tool allowlists, and execution boundaries so agentic codegen strictly obeys typing, test coverage, and security invariants.",
      workflows: [
        {
          name: "Test-Driven Agent Loops",
          description:
            "Before generating implementation code, Claude Code writes isolated unit and regression tests against the formal specification. Changes are executed in subshells and reverted automatically if tests fail.",
          commandExample: "claude-code --tweak 'implement tenant-scoped authorization' --verify 'pnpm test && pnpm typecheck'",
        },
        {
          name: "Fail-Closed Permission Gatekeeping",
          description:
            "Modeled after the authorization layer I architected for Loan Labs (Composio + Bedrock AgentCore), LLM tools are strictly partitioned into read, write, merge, and archive permissions. Ambient deletes are permanently blocked.",
        },
        {
          name: "Clean Worktree Isolation",
          description:
            "Codex runs inside disposable Git worktrees with atomic patch validation, keeping the main development tree clean while verifying full dependency trees.",
        },
      ],
      principles: [
        "No untested lines in production codegen",
        "Deterministic request boundaries over stateful handshakes",
        "Fail-closed authorization: unknown action = explicit rejection",
      ],
    },
    backlinks: [
      {
        label: "Lois Agentic Architecture (Loan Labs)",
        url: "/blog/lois-mortgage-agent",
        type: "blog",
        context: "LangGraph on Amazon Bedrock AgentCore for mortgage document processing",
      },
      {
        label: "Loan Labs Role & Architecture",
        url: "/work/loan-labs",
        type: "project",
        context: "Production agentic mortgage tech with fail-closed Composio authorization",
      },
      {
        label: "Finally Banking Infrastructure",
        url: "/work/finally",
        type: "project",
        context: "Reusable Plaid & Teller ingestion with encrypted token lifecycles",
      },
      {
        label: "GitHub Repositories: Agentic Systems",
        url: "https://github.com/AshwinRachha",
        type: "github",
        context: "Public open-source code-review agents and microservices",
      },
      {
        label: "Blog: MCP, Sessions & Where State Belongs",
        url: "/blog/3b92e262-08a5-8186-942c-ff5559fe4f68",
        type: "blog",
        context: "Deep dive into stateless tool architectures and request boundaries",
      },
    ],
  },
  {
    id: "product",
    number: "02",
    title: "Product",
    tagline: "MVP scoping, spec-driven engineering, and user metrics tied to measurable outcomes.",
    skills: ["Linear-to-Code", "Spec Decomposition", "User Research", "A/B Testing", "OKRs", "Human-in-the-Loop"],
    setupHighlight: "Linear & Notion context linking directly to technical specifications, state machines, and code delivery.",
    claudeCodexSetup: {
      overview:
        "Product engineering begins before the prompt. I use Claude Code to parse product context, user discovery interviews, and Linear tickets into structured PRDs, state diagrams, and measurable acceptance criteria.",
      workflows: [
        {
          name: "Linear Context to State Machine",
          description:
            "Extracting business logic and edge cases from product tickets directly into finite state machine (FSM) contracts before backend schemas are drafted.",
        },
        {
          name: "Rapid 0-to-1 Prototyping to Scale",
          description:
            "Led Classify AI from prototype to 50,000+ daily transactions at Finally, shrinking first-month bookkeeping close from 4+ months to approximately 2 weeks.",
        },
        {
          name: "Human-in-the-Loop Review UX",
          description:
            "Architected LoanOS and Classify AI review queues where AI handles repetitive toil and routes ambiguous anomalies to human experts with transparent rationale.",
        },
      ],
      principles: [
        "Software should eliminate human toil, not human agency",
        "Fast iterations backed by real customer telemetry",
        "Every feature must tie to a quantifiable business metric",
      ],
    },
    backlinks: [
      {
        label: "Classify AI Deep Dive",
        url: "/blog/classify-ai",
        type: "blog",
        context: "How we reduced manual bookkeeping categorization by ~80%",
      },
      {
        label: "Career Fit Navigator",
        url: "/fit",
        type: "project",
        context: "Interactive role discovery tool aligning requirements with verified work",
      },
      {
        label: "Blog: Inside Buzz — Signed Messages to Agent Work",
        url: "/blog/3bb2e262-08a5-80aa-b865-e905d51fa752",
        type: "blog",
        context: "Product design in shared human-agent collaborative workspaces",
      },
    ],
  },
  {
    id: "ai-analytics",
    number: "03",
    title: "AI & Analytics",
    tagline: "RAG, hybrid semantic search, predictive models, and telemetry from data to deploy.",
    skills: ["Pinecone", "Elasticsearch", "LangChain", "LangGraph", "Bedrock", "W&B", "PyTorch", "Triton"],
    setupHighlight: "Hybrid retrieval (dense vectors + sparse BM25) with continuous evaluation suites and zero hallucination tolerance.",
    claudeCodexSetup: {
      overview:
        "Building production AI requires rigorous evaluation, deterministic guardrails, and hybrid retrieval. My AI stack couples semantic embeddings with sparse keyword constraints, backed by automated prompt regression testing.",
      workflows: [
        {
          name: "Hybrid RAG Pipeline Generation",
          description:
            "Synthesizing dense vector search (Pinecone) and sparse lexical filtering (Elasticsearch BM25) to classify high-entropy financial transactions and complex loan docs.",
        },
        {
          name: "LLM Evaluation & Guardrails",
          description:
            "Using Codex to script automated synthetic test sets, verifying confidence scoring, boundary checks, and Socratic guardrails modeled on my Master's thesis (Gurukul).",
        },
        {
          name: "High-Throughput ML Serving",
          description:
            "Optimizing inference latency with NVIDIA Triton, ONNX, and distributed worker pipelines (Celery, Redis, PySpark) deployed on Kubernetes/GKE.",
        },
      ],
      principles: [
        "Dense vectors for recall, sparse tokens for precision",
        "Deterministic guardrails before generation reaches the client",
        "Empirical benchmarks over anecdotal prompt tweaks",
      ],
    },
    backlinks: [
      {
        label: "Gurukul Master's Thesis Deep Dive",
        url: "/blog/gurukul-thesis",
        type: "research",
        context: "Adaptive CS learning environment with RAG and guardrails (Virginia Tech)",
      },
      {
        label: "Google Scholar Profile (130+ Citations)",
        url: "https://scholar.google.com/citations?user=opsMRzEAAAAJ",
        type: "research",
        context: "Published research at IEEE FIE 2024 and SoutheastCon 2023",
      },
      {
        label: "GitHub: Gurukul Adaptive Platform",
        url: "https://github.com/ashwinrachha786/Gurukul_v2",
        type: "github",
        context: "Open source repository for LLM-enhanced education platform",
      },
      {
        label: "Outreach ML Platform Experience",
        url: "/work/outreach",
        type: "project",
        context: "Reusable NLP inference and Triton model serving infrastructure",
      },
    ],
  },
  {
    id: "strategy",
    number: "04",
    title: "Strategy",
    tagline: "Cash-flow risk modeling, underwriting algorithms, ROI, and stakeholder alignment.",
    skills: ["Cash-Based Underwriting", "Risk Modeling", "Z-Score Volatility", "Unit Economics", "Roadmaps"],
    setupHighlight: "Algorithmic underwriting and capital allocation models backed by 90-day daily balance reconstruction.",
    claudeCodexSetup: {
      overview:
        "Strategy is about making high-consequence decisions with data and building defensible moats. In fintech, I built cash-based underwriting infrastructure that deployed over $3M in credit without default during initial rollout.",
      workflows: [
        {
          name: "Daily Balance Reconstruction & Volatility Modeling",
          description:
            "Using Codex to model statistical cash-flow variance, calculating Z-score burn stability and debt-service coverage from 90 days of raw bank data.",
        },
        {
          name: "Weekly Recalculation Engine",
          description:
            "Automated weekly limit adjustments and early-warning trigger alerts for overdrafts, revenue dips, and liquidity crunch.",
        },
        {
          name: "Executive & Stakeholder Communication",
          description:
            "Translating complex algorithmic risk thresholds into clear executive narratives, compliance audit trails, and capital partner agreements.",
        },
      ],
      principles: [
        "Underwrite on real cash velocity, not stale historical scores",
        "Transparent auditability for every algorithmic decision",
        "Alignment between risk mitigation and revenue growth",
      ],
    },
    backlinks: [
      {
        label: "Cash-Based Underwriting Deep Dive",
        url: "/blog/cash-based-underwriting",
        type: "blog",
        context: "90-day balance reconstruction and weekly credit-limit review",
      },
      {
        label: "Finally Fintech Infrastructure Role",
        url: "/work/finally",
        type: "project",
        context: "$3M+ underwritten across 50+ companies in ~3 months",
      },
      {
        label: "Workflow Readiness Lab",
        url: "/tools/workflow-readiness",
        type: "project",
        context: "Interactive strategic assessment for AI workflow implementation",
      },
    ],
  },
];

export default function CapabilityCards() {
  const [selectedCapability, setSelectedCapability] = useState<Capability | null>(null);

  // Close modal on Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelectedCapability(null);
    };
    if (selectedCapability) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedCapability]);

  return (
    <section className={styles.section} id="capabilities" aria-labelledby="capabilities-title">
      <div className={styles.sectionHeader}>
        <div>
          <span className={styles.eyebrow}>How I Think & Build</span>
          <h2 id="capabilities-title" className={styles.title}>
            Engineer’s rigor, <span className={styles.italic}>product instincts.</span>
          </h2>
        </div>
        <p className={styles.subtitle}>
          Click any discipline to inspect what I use with my Claude Code & Codex setup, my engineering workflows, and direct backlinks to my work.
        </p>
      </div>

      <div className={styles.cardsGrid}>
        {CAPABILITIES.map((cap) => (
          <motion.div
            key={cap.id}
            className={styles.card}
            initial={false}
            whileHover={{ y: -6, transition: { duration: 0.2 } }}
            onClick={() => setSelectedCapability(cap)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                setSelectedCapability(cap);
              }
            }}
            aria-haspopup="dialog"
          >
            <div className={styles.cardTop}>
              <span className={styles.cardNumber}>{cap.number}</span>
              <span className={styles.inspectHint}>Inspect setup ↗</span>
            </div>

            <h3 className={styles.cardTitle}>{cap.title}</h3>
            <p className={styles.cardTagline}>{cap.tagline}</p>

            <div className={styles.cardSkills}>
              {cap.skills.map((skill) => (
                <span key={skill} className={styles.skillTag}>
                  {skill}
                </span>
              ))}
            </div>

<div className={styles.cardFooter}>
              <span className={styles.setupPrompt}>
                <span className={styles.dot}></span> {cap.setupHighlight}
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Expanded Modal */}
      <AnimatePresence>
        {selectedCapability && (
          <div className={styles.modalOverlay} onClick={() => setSelectedCapability(null)}>
            <motion.div
              className={styles.modalContent}
              onClick={(e) => e.stopPropagation()}
              role="dialog"
              aria-modal="true"
              aria-labelledby="modal-cap-title"
              initial={{ opacity: 0, scale: 0.94, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
            >
              <div className={styles.modalHeader}>
                <div>
                  <div className={styles.modalEyebrow}>
                    <span>DISCIPLINE {selectedCapability.number}</span> · CLAUDE CODE & CODEX SETUP
                  </div>
                  <h3 id="modal-cap-title" className={styles.modalTitle}>
                    {selectedCapability.title} Architecture
                  </h3>
                </div>
                <button
                  type="button"
                  className={styles.closeBtn}
                  onClick={() => setSelectedCapability(null)}
                  aria-label="Close dialog"
                >
                  ✕
                </button>
              </div>

              <div className={styles.modalBody}>
                {/* Overview Box */}
                <div className={styles.overviewBox}>
                  <h4>System Methodology</h4>
                  <p>{selectedCapability.claudeCodexSetup.overview}</p>
                </div>

                {/* Workflows */}
                <div className={styles.sectionBlock}>
                  <h4>Claude Code & Codex Workflows</h4>
                  <div className={styles.workflowGrid}>
                    {selectedCapability.claudeCodexSetup.workflows.map((wf) => (
                      <div key={wf.name} className={styles.workflowCard}>
                        <div className={styles.wfName}>{wf.name}</div>
                        <p className={styles.wfDesc}>{wf.description}</p>
                        {wf.commandExample && (
                          <div className={styles.cmdSnippet}>
                            <code>{wf.commandExample}</code>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Core Principles */}
                <div className={styles.sectionBlock}>
                  <h4>Core Operational Invariants</h4>
                  <ul className={styles.principlesList}>
                    {selectedCapability.claudeCodexSetup.principles.map((pr, i) => (
                      <li key={i}>{pr}</li>
                    ))}
                  </ul>
                </div>

                {/* Backlinks & Interconnectivity */}
                <div className={styles.sectionBlock}>
                  <h4>Connected Work & Backlinks</h4>
                  <p className={styles.backlinksNote}>
                    Cross-references between codebases, active projects, technical deep dives, and academic research:
                  </p>
                  <div className={styles.backlinksList}>
                    {selectedCapability.backlinks.map((link) => {
                      const isExternal = link.url.startsWith("http");
                      return (
                        <a
                          key={link.url}
                          href={link.url}
                          target={isExternal ? "_blank" : undefined}
                          rel={isExternal ? "noopener noreferrer" : undefined}
                          className={styles.backlinkCard}
                        >
                          <div className={styles.backlinkHeader}>
                            <span className={styles.backlinkLabel}>{link.label}</span>
                            <span className={styles.badge}>{link.type}</span>
                          </div>
                          <span className={styles.backlinkContext}>{link.context}</span>
                          <span className={styles.backlinkArrow}>{isExternal ? "↗" : "→"}</span>
                        </a>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className={styles.modalFooter}>
                <button
                  type="button"
                  className={styles.doneBtn}
                  onClick={() => setSelectedCapability(null)}
                >
                  Close overview
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
