"use client";

import { useState } from "react";
import type { WorkflowBrief as Brief, WorkflowInput, WorkflowMethod } from "@/lib/workflow/schema";
import { approvalPolicy } from "@/lib/workflow/schema";
import { buildWorkflowBrief, detectWorkflowSignals, workflowSignals } from "@/lib/workflow/rules";
import { approvalLabels, areaLabels, briefFilename, briefToMarkdown, kindLabels, statusLabels } from "@/lib/workflow/export";
import styles from "./workflow.module.css";

type Props = { brief: Brief; input: WorkflowInput; isExample: boolean; method?: WorkflowMethod; onEdit: () => void };

export default function WorkflowBrief({ brief: originalBrief, input: originalInput, isExample, method, onEdit }: Props) {
  const [copyState, setCopyState] = useState("");
  const [input, setInput] = useState(originalInput);
  const [signalIds, setSignalIds] = useState<string[]>(method?.signalIds ?? detectWorkflowSignals(originalInput));
  const [adjusted, setAdjusted] = useState(false);
  const brief = adjusted ? buildWorkflowBrief(input, signalIds) : originalBrief;
  const methodLabel = adjusted ? "Your scenario · free rules" : method?.mode === "jev" ? "Jev signals · authored rules" : "Free rules · no AI call";
  const markdown = briefToMarkdown(brief, input, isExample, methodLabel);

  function changeScenario(field: "stakes" | "approval", value: string) {
    setInput(previous => ({ ...previous, [field]: value }));
    setAdjusted(true);
    setCopyState("");
  }

  async function copy() {
    try { await navigator.clipboard.writeText(markdown); setCopyState("Brief copied."); }
    catch { setCopyState("Copy is unavailable in this browser. Use Download instead."); }
  }

  function download() {
    const url = URL.createObjectURL(new Blob([markdown], { type: "text/markdown;charset=utf-8" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = briefFilename(brief.title);
    document.body.append(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  return <article className={styles.brief} aria-labelledby="brief-title">
    <div className={styles.toolbar}>
      <button type="button" className={styles.textButton} onClick={onEdit}>← {isExample ? "Back to your workflow" : "Edit workflow"}</button>
      <div className={styles.exportActions}>
        <button type="button" onClick={copy}>Copy brief</button>
        <button type="button" onClick={download}>Download .md</button>
        <button type="button" onClick={() => window.print()}>Print / PDF</button>
      </div>
    </div>
    <p className={styles.copyStatus} role="status">{copyState}</p>
    <header className={styles.briefHeader}>
      <p className={styles.sectionLabel}>{isExample ? "Example brief" : "Your workflow brief"} <span>· Proposal for review</span></p>
      {!isExample && <p className={styles.methodStatus}>{methodLabel}</p>}
      <h2 id="brief-title" tabIndex={-1}>{brief.title}</h2>
      <p>{brief.jobToBeDone}</p>
      <div className={styles.context}><span>{input.stakes === "high" ? "High" : input.stakes === "moderate" ? "Moderate" : "Low"} stated stakes</span><span>{approvalLabels[input.approval]}</span></div>
      <p className={styles.approvalBoundary}><strong>Approval boundary</strong>{approvalPolicy(input)}</p>
    </header>
    {!isExample && <section className={styles.scenario} aria-labelledby="scenario-title">
      <h3 id="scenario-title">Explore the tradeoffs</h3>
      <p>Change the boundaries or correct a detected signal. The brief updates on this device without another AI request.</p>
      <div className={styles.scenarioFields}>
        <label>Consequences of error<select value={input.stakes} onChange={event => changeScenario("stakes", event.target.value)}><option value="low">Low</option><option value="moderate">Moderate</option><option value="high">High</option></select></label>
        <label>Approval preference<select value={input.approval} onChange={event => changeScenario("approval", event.target.value)}><option value="always">Every result or action</option><option value="exceptions">Exceptions and uncertainty</option><option value="none">No routine approval</option></select></label>
      </div>
      <fieldset className={styles.signalChoices}><legend>Workflow signals</legend>{workflowSignals.map(item => <label key={item.id}><input type="checkbox" checked={signalIds.includes(item.id)} onChange={() => { setSignalIds(previous => previous.includes(item.id) ? previous.filter(id => id !== item.id) : [...previous, item.id]); setAdjusted(true); setCopyState(""); }} />{item.label}</label>)}</fieldset>
      <p className={styles.methodStatus} role="status">{methodLabel}{method?.fallback && !adjusted ? " · Free Jev was unavailable" : ""}. {brief.steps.length} proposed steps; {brief.steps.filter(step => step.kind === "human").length} human review step.</p>
      {adjusted && <button type="button" className={styles.textButton} onClick={() => { setInput(originalInput); setSignalIds(method?.signalIds ?? detectWorkflowSignals(originalInput)); setAdjusted(false); setCopyState(""); }}>Reset to original brief</button>}
      {method?.mode === "jev" && method.analysis && <details className={styles.methodDetails}><summary>Original Jev interpretation</summary><p>Jev via {method.analysis.provider === "vercel" ? "Vercel" : "Venice"} · {(method.analysis.durationMs / 1000).toFixed(1)}s. Estimates select signals at 65%; they are not readiness scores. {adjusted ? "Your current choices override this original interpretation." : "The brief text comes from authored rules."}</p><ul>{method.analysis.signals.map(item => <li key={item.id}>{item.label}: {Math.round(item.probability * 100)}%</li>)}</ul></details>}
    </section>}
    <section className={styles.briefSection} aria-labelledby="pattern-title">
      <div className={styles.sectionHeading}><span>01</span><h3 id="pattern-title">The system pattern</h3></div>
      <h4 className={styles.patternTitle}>{brief.recommendation.pattern}</h4>
      <p className={styles.bodyCopy}>{brief.recommendation.rationale}</p>
      <ol className={styles.workflow}>{brief.steps.map((step, index) => <li key={`${index}-${step.name}`}>
        <div className={styles.stepMeta}><span>{String(index + 1).padStart(2, "0")}</span><span className={styles.stepKind}>{kindLabels[step.kind]}</span></div>
        <h4>{step.name}</h4><p>{step.detail}</p>
      </li>)}</ol>
    </section>
    <section className={styles.briefSection} aria-labelledby="readiness-title">
      <div className={styles.sectionHeading}><span>02</span><h3 id="readiness-title">What’s defined. What needs work.</h3></div>
      <p className={styles.bodyCopy}>Based on your description. “Defined” means described here; it does not mean tested or production-ready.</p>
      <div className={styles.readiness}>{brief.readiness.map((item) => <div className={styles.readinessRow} key={item.area}>
        <div><h4>{areaLabels[item.area]}</h4><span className={styles.status} data-status={item.status}>{statusLabels[item.status]}</span></div>
        <div><p>{item.evidence}</p><p className={styles.nextAction}><span>Next →</span> {item.action}</p></div>
      </div>)}</div>
    </section>
    <section className={styles.briefSection} aria-labelledby="evaluation-title">
      <div className={styles.sectionHeading}><span>03</span><h3 id="evaluation-title">How to test it</h3></div>
      <div className={styles.evaluation}>{brief.evaluation.map((item, index) => <div key={index}>
        <h4>{item.metric}</h4><p>{item.method}</p><p className={styles.nextAction}><span>Proposed target</span> {item.target}</p>
      </div>)}</div>
    </section>
    <div className={styles.twoColumns}>
      <section className={styles.briefSection} aria-labelledby="risks-title">
        <div className={styles.sectionHeading}><span>04</span><h3 id="risks-title">Risks & boundaries</h3></div>
        {brief.risks.map((item, index) => <div className={styles.risk} key={index}><h4>{item.risk}</h4><p>{item.mitigation}</p></div>)}
      </section>
      <section className={styles.briefSection} aria-labelledby="assumptions-title">
        <div className={styles.sectionHeading}><span>05</span><h3 id="assumptions-title">Assumptions to confirm</h3></div>
        <ul className={styles.assumptions}>{brief.assumptions.map((item, index) => <li key={index}>{item}</li>)}</ul>
      </section>
    </div>
    <section className={styles.experiment} aria-labelledby="experiment-title">
      <p className={styles.sectionLabel}>Your next move</p><h3 id="experiment-title">Start with one experiment.</h3>
      <p>{brief.nextExperiment.action}</p><div><h4>What success looks like</h4><p>{brief.nextExperiment.successCriteria}</p></div>
    </section>
    <details className={styles.source}><summary>Original workflow description</summary><dl>
      <dt>Task</dt><dd>{input.task}</dd><dt>Current process</dt><dd>{input.currentProcess}</dd>
      <dt>Inputs and systems</dt><dd>{input.inputs}</dd><dt>Desired output</dt><dd>{input.desiredOutput}</dd>
    </dl></details>
    <p className={styles.disclaimer}>{isExample ? "This example illustrates the kind of brief you can create." : "An authored planning template based on your description and selected signals. This lab has not verified your systems or measured readiness."} Confirm assumptions, test the proposed system, and review it with the people responsible for the workflow.</p>
    <div className={styles.contact}><div><h3>Ready to turn this into a working system?</h3><p>I build AI products around the details that make them useful.</p></div><a href="mailto:ashwin.rachha@gmail.com?subject=AI%20workflow%20conversation">Start a conversation ↗</a></div>
    <p className={styles.printCredit}>Built by Ashwin Rachha · AI Workflow Readiness Lab</p>
  </article>;
}
