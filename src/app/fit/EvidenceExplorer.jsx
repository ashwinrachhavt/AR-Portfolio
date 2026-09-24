"use client";

import { useState } from "react";
import { track } from "@vercel/analytics";
import { buildRoleBrief, capabilities, evidence } from "../../lib/career-fit.mjs";
import styles from "./fit.module.css";

const label = id => capabilities.find(item => item.id === id)?.label || id;
const discussionLink = question => `mailto:ashwin.rachha@gmail.com?subject=${encodeURIComponent("Let’s explore working together")}&body=${encodeURIComponent(question)}`;

export default function EvidenceExplorer({ brief }) {
  const originalIds = brief.capabilities.map(item => item.id);
  const [selectedIds, setSelectedIds] = useState(originalIds);
  const [priority, setPriority] = useState("");
  const [showAll, setShowAll] = useState(false);
  const [feedback, setFeedback] = useState("");
  const customized = priority !== "" || selectedIds.length !== originalIds.length || selectedIds.some(id => !originalIds.includes(id));
  const result = buildRoleBrief(selectedIds, brief.mode, { priority, limit: showAll ? evidence.length : 3 });

  function toggleTopic(id) {
    const enabled = !selectedIds.includes(id);
    setSelectedIds(enabled ? [...selectedIds, id] : selectedIds.filter(topic => topic !== id));
    if (!enabled && priority === id) setPriority("");
    setShowAll(false); setFeedback("");
    track("career_fit_topic_changed", { topic: id, enabled, mode: brief.mode });
  }

  function restore() {
    setSelectedIds(originalIds); setPriority(""); setShowAll(false); setFeedback("");
    track("career_fit_topics_reset", { mode: brief.mode });
  }

  return <div className={styles.explorer}>
    <div className={styles.topicControls}>
      <details>
        <summary>Adjust topics <span>{selectedIds.length} selected</span></summary>
        <p className={styles.note}>Choose the areas you want to explore. Results update here without another AI request.</p>
        <fieldset className={styles.topicChoices}>
          <legend>Topics to explore</legend>
          {capabilities.map(item => <button type="button" key={item.id} aria-pressed={selectedIds.includes(item.id)} onClick={() => toggleTopic(item.id)}>{item.label}</button>)}
        </fieldset>
        <button type="button" className={styles.textButton} onClick={() => { setSelectedIds([]); setPriority(""); setShowAll(false); setFeedback(""); track("career_fit_topics_cleared", { mode: brief.mode }); }}>Clear topics</button>
      </details>
      <div className={styles.priorityRow}>
        <label htmlFor="evidence-priority">Prioritize</label>
        <select id="evidence-priority" value={priority} disabled={!selectedIds.length} onChange={event => { setPriority(event.target.value); setShowAll(false); setFeedback(""); track("career_fit_priority_changed", { topic: event.target.value || "balanced", mode: brief.mode }); }}>
          <option value="">Balanced coverage</option>
          {capabilities.filter(item => selectedIds.includes(item.id)).map(item => <option key={item.id} value={item.id}>{item.label}</option>)}
        </select>
      </div>
      {customized && <div className={styles.customized}><p className={styles.note}>Exploring your chosen topics. The original role analysis is unchanged.</p><button type="button" className={styles.textButton} onClick={restore}>Restore role topics</button></div>}
    </div>
    <p className={styles.resultCount} role="status">{selectedIds.length ? `${result.evidence.length} of ${result.totalEvidence} related work examples${priority ? ` · Prioritizing ${label(priority)}` : " · Balanced coverage"}` : "Choose a topic to explore the public work."}</p>
    <div className={styles.tags} role="group" aria-label="Selected topics">{result.capabilities.map(item => <span key={item.id}>{item.label}</span>)}</div>
    {result.evidence.length ? result.evidence.map((item, index) => <article className={styles.evidence} key={item.id}>
      <p className={styles.eyebrow}>{String(index + 1).padStart(2, "0")} / {item.company} · {item.kind === "research" ? "Research" : "Professional work"}</p>
      <h3>{item.title}</h3><p>{item.claim}</p>
      <p className={styles.overlap}>Relevant to {item.overlap.map(label).join(" · ")}{priority && item.overlap.includes(priority) ? " · Your priority" : ""}</p>
      {item.limitation && <p className={styles.note}>{item.limitation}</p>}
      <details className={styles.workDetails} onToggle={event => { if (event.currentTarget.open) track("career_fit_evidence_expanded", { evidence: item.id, mode: brief.mode }); }}>
        <summary>Explore this work<span className={styles.srOnly}>: {item.title}</span></summary>
        <dl><dt>{item.kind === "research" ? "Research" : "Role"}</dt><dd>{item.role}{item.period && <span>{item.period}</span>}</dd>{item.context && <><dt>Context</dt><dd>{item.context}</dd></>}</dl>
        {item.details.length > 0 && <div className={styles.supportingFacts}><h4>Related work at {item.company}</h4>{item.details.map(detail => <p key={detail.factRef}>{detail.claim} <a href={detail.href} onClick={() => track("career_fit_source_opened", { evidence: item.id, source: detail.factRef })}>Source<span className={styles.srOnly}> for this related work</span> ↗</a></p>)}</div>}
        <p className={styles.note}>A question for our conversation:</p><p className={styles.discussion}>{item.discussion}</p>
        <a href={discussionLink(item.discussion)} onClick={() => track("career_fit_prompt_used", { evidence: item.id, mode: brief.mode })}>Discuss this work ↗</a>
        {item.sources.map(source => <a className={styles.extraSource} key={source.href} href={source.href} onClick={() => track("career_fit_source_opened", { evidence: item.id, source: "research-code" })}>{source.label} ↗</a>)}
      </details>
      <a href={item.href} onClick={() => track("career_fit_source_opened", { evidence: item.id, source: "primary" })}>{item.sourceLabel} <span aria-hidden="true">↗</span></a>
    </article>) : <p className={styles.empty}>{selectedIds.length ? "No direct public evidence for these topics. Try another area or use the discussion prompts below." : "Select a topic above, or restore the role topics to start again."}</p>}
    {result.totalEvidence > 3 && <button type="button" className={styles.showMore} onClick={() => { setShowAll(!showAll); track("career_fit_more_evidence", { expanded: !showAll, mode: brief.mode }); }}>{showAll ? "Show the first three" : `Explore all ${result.totalEvidence} related examples`}</button>}
    {result.gaps.length > 0 && <aside className={styles.gaps}><h3>Worth a conversation</h3><p>{result.gaps.map(item => item.label).join(", ")}: no direct public evidence in this catalog. Interests and adjacent experience aren’t proof of these requirements.</p></aside>}
    <div className={styles.prompts}><h3>Ask me about</h3><p className={styles.note}>Choose a question to open an email draft.</p><ul>{result.prompts.map((prompt, index) => <li key={prompt}><a href={discussionLink(prompt)} onClick={() => track("career_fit_prompt_used", { prompt: index, mode: brief.mode })}>{prompt}</a></li>)}</ul></div>
    {result.evidence.length > 0 && <div className={styles.feedback}><p>Did you find relevant work?</p><div>{["yes", "not-yet"].map(value => <button type="button" key={value} aria-pressed={feedback === value} disabled={Boolean(feedback)} onClick={() => { setFeedback(value); track("career_fit_relevance_feedback", { answer: value, mode: brief.mode, customized }); }}>{value === "yes" ? "Yes" : "Not yet"}</button>)}</div><span role="status">{feedback ? "Thanks for the feedback." : ""}</span></div>}
  </div>;
}
