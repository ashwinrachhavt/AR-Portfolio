"use client";

import { useEffect, useRef, useState } from "react";
import { track } from "@vercel/analytics";
import { buildRoleBrief, examples, keywordCapabilities } from "../../lib/career-fit.mjs";
import { readCareerFitResponse } from "../../lib/career-fit-stream.mjs";
import EvidenceExplorer from "./EvidenceExplorer";
import styles from "./fit.module.css";

const stages = [
  { id: "checking", label: "Checking free Jev access" },
  { id: "interpreting", label: "Jev is reading the role requirements" },
  { id: "matching", label: "Connecting Jev’s signals to my public work" },
];

export default function FitNavigator({ live = false, provider = "venice" }) {
  const [title, setTitle] = useState(examples[0].title);
  const [description, setDescription] = useState(examples[0].description);
  const [brief, setBrief] = useState(() => buildRoleBrief(keywordCapabilities(examples[0].description), "example"));
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const [stage, setStage] = useState("");
  const [explorerVersion, setExplorerVersion] = useState(0);
  const controller = useRef(null);
  const version = useRef(0);
  useEffect(() => () => controller.current?.abort(), []);
  function reset(index) {
    version.current += 1; controller.current?.abort();
    const example = examples[index]; setTitle(example.title); setDescription(example.description);
    setBrief(buildRoleBrief(keywordCapabilities(example.description), "example")); setError(""); setPending(false); setStage("");
    setExplorerVersion(value => value + 1);
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
      if (current === version.current) { setBrief(data); track("career_fit_succeeded", { mode: data.mode }); }
    } catch (failure) {
      if (current === version.current && !abort.signal.aborted) { setError(failure.name === "TimeoutError" ? "This took too long. Try again or explore an example." : failure.message); track("career_fit_failed"); }
    } finally { if (current === version.current) setPending(false); }
  }
  return <>
    <div className={styles.layout}>
      <section className={styles.input} aria-labelledby="role-heading">
        <h2 id="role-heading">What are you building?</h2><p>{live ? "Give Jev a role to interpret. See which parts connect to my work." : "Start with an example, or bring your own role."}</p>
        <div className={styles.examples}>{examples.map((item, index) => <button key={item.title} onClick={() => reset(index)}>{item.title}</button>)}</div>
        <form onSubmit={submit}>
          <label htmlFor="role-title">Role title <span>(optional)</span></label><input id="role-title" value={title} disabled={pending} maxLength={160} onChange={event => { setTitle(event.target.value); setBrief(null); setError(""); }} />
          <label htmlFor="role-description">Role description</label><textarea id="role-description" value={description} disabled={pending} minLength={100} maxLength={8000} required rows={9} aria-describedby="role-privacy" onChange={event => { setDescription(event.target.value); setBrief(null); setError(""); }} />
          <p className={styles.count}>{description.length.toLocaleString()} / 8,000 characters</p>
          <p id="role-privacy" className={styles.note}>Use public, non-confidential text. The application does not save your description. {live ? <>Live interpretation sends your text to {provider === "venice" ? <a href="https://venice.ai/privacy-policy">Venice’s Jev API</a> : <a href="https://vercel.com/docs/ai-gateway/security-and-privacy">Jev through Vercel AI Gateway</a>}; the provider’s data policies apply. If free access is unavailable, the result is labeled as a keyword preview.</> : "Keyword mapping runs without sending your text to an AI provider."}</p>
          <button className={styles.primary} disabled={pending} type="submit">{pending ? "Working on your role…" : live ? "Explore this role with Jev" : "Map this role to my work"}<span aria-hidden="true">↗</span></button>
          {pending && <button className={styles.cancel} type="button" onClick={() => { version.current += 1; controller.current?.abort(); setPending(false); setError("Cancelled. Your text is still here."); }}>Cancel</button>}
        </form>
        {error && <p className={styles.error} role="alert">{error}</p>}
      </section>
      <section className={styles.results} aria-labelledby="brief-heading">
        <div className={styles.resultHeading}><h2 id="brief-heading">Your conversation starter.</h2><span role="status">{pending ? (stages.find(item => item.id === stage)?.label || "Connecting…") : brief?.mode === "jev" ? "Live Jev result" : brief?.mode === "example" ? "Illustrative example · no AI call" : brief ? "Keyword preview · Jev was not used" : "Ready when you are"}</span></div>
        {pending && <div className={styles.progress}>
          {stage ? <ol>{stages.map((item, index) => <li key={item.id} data-state={index < stages.findIndex(item => item.id === stage) ? "done" : item.id === stage ? "active" : "waiting"}><span aria-hidden="true">{index < stages.findIndex(item => item.id === stage) ? "✓" : `0${index + 1}`}</span>{item.label}</li>)}</ol> : <p>Sending your role for analysis…</p>}
          <p className={styles.note}>Results appear when the analysis finishes. You can cancel at any time.</p>
        </div>}
        <div aria-busy={pending}>{brief && <>
          <p className={styles.note}>{brief.mode === "jev" ? "Jev interpreted your role in this request. Every career claim below comes from my approved public work." : "This preview uses keyword matching. It can miss negation and unstated requirements. No live Jev interpretation was performed."}</p>
          {brief.mode === "jev" && brief.analysis && <div className={styles.receipt}>
            <p><span className={styles.liveDot} aria-hidden="true" />Jev via {brief.analysis.provider === "venice" ? "Venice" : "Vercel"}<span>{(brief.analysis.durationMs / 1000).toFixed(1)}s</span></p>
            <details><summary>See what Jev detected</summary>
              <p className={styles.note}>Each value is Jev’s estimate that the role requires this capability. It is not a score of my ability or suitability. Values of 65% or more select the initial topics. You can adjust those topics below.</p>
              <ul className={styles.signals}>{brief.analysis.signals.map(item => <li key={item.id}><span>{item.label}</span><meter min="0" max="1" value={item.probability} aria-label={`${item.label}: estimated requirement likelihood`} /><span>{Math.round(item.probability * 100)}%</span></li>)}</ul>
            </details>
          </div>}
          <EvidenceExplorer key={explorerVersion} brief={brief} />
          <a className={styles.primary} href="mailto:ashwin.rachha@gmail.com?subject=Let%E2%80%99s%20explore%20working%20together" onClick={() => track("career_fit_contact_cta_clicked")}>Start the conversation <span aria-hidden="true">↗</span></a>
        </>}</div>
      </section>
    </div>
    <footer className={styles.disclosure}><p>An evidence explorer, not a hiring recommendation. Missing public evidence does not mean missing ability.</p><a href="/ashwin_rachha_resume.pdf" download>Prefer a résumé? Download it here ↗</a></footer>
  </>;
}
