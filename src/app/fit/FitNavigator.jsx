"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { track } from "@vercel/analytics";
import { buildRoleBrief, capabilities, examples, keywordCapabilities } from "../../lib/career-fit.mjs";
import { readCareerFitResponse } from "../../lib/career-fit-stream.mjs";
import { enter, useStage } from "../../lib/motion.ts";
import styles from "./fit.module.css";

const stages = [
  { id: "checking", label: "Connecting the analysis" },
  { id: "interpreting", label: "Reading the role requirements" },
  { id: "matching", label: "Connecting the signals to my public work" },
];

const ROLE_CHIPS = [
  "Founding AI Engineer",
  "AI Product Engineer",
  "Backend Engineer",
  "Software Engineer",
  "Product Owner",
  "Product Builder",
];

function ModelBadge({ providerLabel }) {
  return <>Analysis by <a href="https://openrouter.ai/typesafe/jev-1.13">Jev 1.13</a>, a decision model by TypeSafe, served through {providerLabel}. It returns typed probabilities, not generated text.</>;
}

export default function FitNavigator({ live = false, provider = "" }) {
  const FIT_HOOK = live
    ? "Paste a job description and watch the analysis run in real time."
    : "Paste a job description for an instant fit read.";
  const [title, setTitle] = useState(examples[0].title);
  const [description, setDescription] = useState(examples[0].description);
  const [brief, setBrief] = useState(() => buildRoleBrief(keywordCapabilities(examples[0].description), "example"));
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const [stageId, setStage] = useState("");
  // Bumped only when a genuinely new read arrives (an example, or a finished run) so
  // the results replay as one gesture. Typing re-derives a preview on every keystroke
  // and must not remount the block, which would re-run the whole entrance per letter.
  const [run, setRun] = useState(0);
  const stage = useStage();
  const controller = useRef(null);
  const version = useRef(0);
  useEffect(() => () => controller.current?.abort(), []);
  function reset(index) {
    version.current += 1; controller.current?.abort();
    const example = examples[index]; setTitle(example.title); setDescription(example.description);
    setBrief(buildRoleBrief(keywordCapabilities(example.description), "example")); setError(""); setPending(false); setStage(""); setRun(n => n + 1);
    track("career_fit_example_loaded", { example: index });
  }
  async function submit(event) {
    event.preventDefault(); if (pending) return;
    const current = ++version.current;
    const abort = new AbortController(); controller.current = abort;
    setPending(true); setError(""); setBrief(null); setStage("");
    track("career_fit_submitted");
    try {
      const response = await fetch("/api/career-fit", { method: "POST", headers: { "Content-Type": "application/json", Accept: "application/x-ndjson" }, body: JSON.stringify({ jobTitle: title, jobDescription: description }), signal: AbortSignal.any([abort.signal, AbortSignal.timeout(18_000)]) });
      const data = await readCareerFitResponse(response, next => { if (current === version.current) setStage(next); });
      if (current === version.current) { setBrief(data); setRun(n => n + 1); track("career_fit_succeeded", { mode: data.mode }); }
    } catch (failure) {
      if (current === version.current && !abort.signal.aborted) { setError(failure.name === "TimeoutError" ? "This took too long. Try again or explore an example." : failure.message); track("career_fit_failed"); }
    } finally { if (current === version.current) setPending(false); }
  }
  const label = id => capabilities.find(item => item.id === id)?.label || id;
  return <>
    <div className={styles.layout}>
      <section className={styles.input} aria-labelledby="role-heading">
        <h2 id="role-heading">What are you building?</h2>
        <p className={styles.hook}>{FIT_HOOK}</p>
        <div className={styles.roleChips}>
          {ROLE_CHIPS.map((chip) => (
            <button
              key={chip}
              type="button"
              className={styles.roleChip}
              onClick={() => {
                setTitle(chip);
                setDescription("");
                setBrief(null);
                setError("");
              }}
            >
              {chip}
            </button>
          ))}
        </div>
        <div className={styles.examples}>{examples.map((item, index) => <button key={item.title} onClick={() => reset(index)}>{item.title}</button>)}</div>
        <form onSubmit={submit}>
          <label htmlFor="role-title">Role title <span>(optional)</span></label><input id="role-title" value={title} disabled={pending} maxLength={160} onChange={event => { setTitle(event.target.value); setError(""); }} />
          <label htmlFor="role-description">Role description</label><textarea id="role-description" value={description} disabled={pending} minLength={100} maxLength={8000} required rows={9} aria-describedby="role-privacy" onChange={event => { setDescription(event.target.value); setBrief(keywordCapabilities(event.target.value).length ? buildRoleBrief(keywordCapabilities(event.target.value)) : null); setError(""); }} />
          <p className={styles.count}>{description.length.toLocaleString()} / 8,000 characters</p>
          <p id="role-privacy" className={styles.note}>Use public, non-confidential text. The application does not save your description. {live ? <>Live analysis sends your text to <ModelBadge providerLabel={provider} />; the provider’s data policies apply. If the analysis is unavailable, the result is labeled as a keyword preview.</> : "Keyword mapping runs without sending your text to an AI provider."}</p>
          <button className={styles.primary} disabled={pending} type="submit">{pending ? "Working on your role…" : live ? "Analyze this role" : "Map this role to my work"}<span aria-hidden="true">↗</span></button>
          {pending && <button className={styles.cancel} type="button" onClick={() => { version.current += 1; controller.current?.abort(); setPending(false); setError("Cancelled. Your text is still here."); }}>Cancel</button>}
        </form>
        {error && <p className={styles.error} role="alert">{error}</p>}
      </section>
      <section className={styles.results} aria-labelledby="brief-heading">
        <div className={styles.resultHeading}><h2 id="brief-heading">Results</h2><span role="status">{pending ? (stages.find(item => item.id === stageId)?.label || "Connecting…") : brief?.mode === "jev" ? "Live analysis result" : brief?.mode === "example" ? "Illustrative example · no AI call" : brief ? "Keyword preview · no AI call" : "Ready when you are"}</span></div>
        {pending && <div className={styles.progress}>
          {stageId ? <ol>{stages.map((item, index) => <li key={item.id} data-state={index < stages.findIndex(entry => entry.id === stageId) ? "done" : item.id === stageId ? "active" : "waiting"}><span aria-hidden="true">{index < stages.findIndex(entry => entry.id === stageId) ? "✓" : `0${index + 1}`}</span>{item.label}</li>)}</ol> : <p>Sending your role for analysis…</p>}
          <p className={styles.note}>Results appear when the analysis finishes. You can cancel at any time.</p>
        </div>}
        <div aria-live="polite" aria-busy={pending}><AnimatePresence mode="wait">
          {brief && <motion.div key={run} initial={stage.rise(0)} animate={stage.settle} exit={stage.reduce ? { opacity: 1 } : { opacity: 0, y: -10 }} transition={stage.transition(0)}>
          {brief.mode !== "jev" && <motion.p className={styles.note} initial={stage.rise(0)} animate={stage.settle} transition={stage.transition(0)}>
  {brief.mode === "example"
    ? "Illustrative example. This first read is a local keyword preview, so the page is useful before you paste anything. Analyze your own role for live results."
    : "Preview mode. Instant, local keyword analysis. It can miss negation and unstated requirements."}
</motion.p>}
          {brief.mode === "jev" && brief.analysis && <motion.div className={styles.receipt} initial={stage.rise(0)} animate={stage.settle} transition={stage.transition(0)}>
            <p><span className={styles.liveDot} aria-hidden="true" />{brief.analysis.model} · {brief.analysis.provider === "openrouter" ? "OpenRouter" : brief.analysis.provider}<span>{(brief.analysis.durationMs / 1000).toFixed(1)}s{brief.analysis.costUsd ? ` · $${brief.analysis.costUsd.toFixed(5)}` : ""}</span></p>
            <details open><summary>See the detected signals</summary>
              <p className={styles.note}>These are the analysis’s estimates that the role requires each capability, arriving in sequence. They are not scores of my ability or suitability. Values of 65% or more select which of the {brief.catalog} public work items below are worth your time.</p>
              <ul className={styles.signals}>{brief.analysis.signals.map((signal, index) => <motion.li key={signal.id} initial={stage.rise(index + 1)} animate={stage.settle} transition={stage.transition(index + 1)}>
                <span>{signal.label}</span><span className={styles.track} aria-hidden="true"><motion.span className={styles.fill} initial={stage.reduce ? { scaleX: signal.probability } : { scaleX: 0 }} animate={{ scaleX: signal.probability }} transition={stage.reduce ? { duration: 0 } : { ...enter(index + 1), duration: 0.75 }} /></span>
                <span>{Math.round(signal.probability * 100)}%</span>
                <meter className={styles.srOnly} min="0" max="1" value={signal.probability} aria-label={`${signal.label}: estimated requirement likelihood, ${Math.round(signal.probability * 100)} percent`} />
              </motion.li>)}</ul>
            </details>
          </motion.div>}
          <motion.div className={styles.tags} initial={stage.rise(2)} animate={stage.settle} transition={stage.transition(2)}>{brief.capabilities.map(item => <span key={item.id}>{item.label}</span>)}</motion.div>
          {brief.evidence.length ? brief.evidence.map((item, index) => <motion.article className={styles.evidence} key={item.id} initial={stage.rise(index + 3)} animate={stage.settle} transition={stage.transition(index + 3)}>
            <p className={styles.meta}><span>{item.company}</span>{item.external ? "Published work" : "Selected work"}</p><h3>{item.title}</h3><p>{item.claim}</p>
            <p className={styles.overlap}>Related to {item.overlap.map(label).join(", ")}</p>
            {item.limitation && <p className={styles.note}>{item.limitation}</p>}
            <a href={item.href} {...(item.external ? { target: "_blank", rel: "noreferrer" } : {})} onClick={() => track("career_fit_source_opened", { evidence: item.id })}>{item.external ? "Open the source" : "Read the public work"} <span aria-hidden="true">↗</span></a>
          </motion.article>) : <motion.p className={styles.empty} initial={stage.rise(3)} animate={stage.settle} transition={stage.transition(3)}>No clear overlap surfaced in my {brief.catalog} public work items. This catalog is limited; it doesn’t establish what I can or cannot do. Browse my work or start a conversation.</motion.p>}
          {brief.gaps.length > 0 && <motion.aside className={styles.gaps} initial={stage.rise(4)} animate={stage.settle} transition={stage.transition(4)}><h3>Worth a conversation</h3><p>{brief.gaps.map(item => item.label).join(", ")}: no direct public evidence in this catalog. Interests and adjacent experience aren’t proof of these requirements.</p></motion.aside>}
          <motion.div className={styles.prompts} initial={stage.rise(5)} animate={stage.settle} transition={stage.transition(5)}><h3>Ask me about</h3><ul>{brief.prompts.map(prompt => <li key={prompt}>{prompt}</li>)}</ul></motion.div>
          <motion.a className={styles.primary} href="mailto:ashwin.rachha@gmail.com?subject=Let%E2%80%99s%20explore%20working%20together" onClick={() => track("career_fit_contact_cta_clicked")} initial={stage.rise(6)} animate={stage.settle} transition={stage.transition(6)}>Start the conversation <span aria-hidden="true">↗</span></motion.a>
          </motion.div>}
        </AnimatePresence></div>
      </section>
    </div>
  </>;
}
