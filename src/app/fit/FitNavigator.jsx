"use client";

import { useEffect, useRef, useState } from "react";
import { track } from "@vercel/analytics";
import { buildRoleBrief, capabilities, examples, keywordCapabilities } from "../../lib/career-fit.mjs";
import styles from "./fit.module.css";

export default function FitNavigator({ live = false }) {
  const [title, setTitle] = useState(examples[0].title);
  const [description, setDescription] = useState(examples[0].description);
  const [brief, setBrief] = useState(() => buildRoleBrief(keywordCapabilities(examples[0].description), "example"));
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const controller = useRef(null);
  const version = useRef(0);
  useEffect(() => () => controller.current?.abort(), []);
  function reset(index) {
    version.current += 1; controller.current?.abort();
    const example = examples[index]; setTitle(example.title); setDescription(example.description);
    setBrief(buildRoleBrief(keywordCapabilities(example.description), "example")); setError(""); setPending(false);
    track("career_fit_example_loaded", { example: index });
  }
  async function submit(event) {
    event.preventDefault(); if (pending) return;
    const current = ++version.current;
    const abort = new AbortController(); controller.current = abort;
    setPending(true); setError(""); setBrief(null);
    track("career_fit_submitted");
    try {
      const response = await fetch("/api/career-fit", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ jobTitle: title, jobDescription: description }), signal: AbortSignal.any([abort.signal, AbortSignal.timeout(18_000)]) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "The explorer is unavailable. Please try again.");
      if (current === version.current) { setBrief(data); track("career_fit_succeeded", { mode: data.mode }); }
    } catch (failure) {
      if (current === version.current && !abort.signal.aborted) { setError(failure.name === "TimeoutError" ? "This took too long. Try again or explore an example." : failure.message); track("career_fit_failed"); }
    } finally { if (current === version.current) setPending(false); }
  }
  const label = id => capabilities.find(item => item.id === id)?.label || id;
  return <>
    <div className={styles.layout}>
      <section className={styles.input} aria-labelledby="role-heading">
        <h2 id="role-heading">What are you building?</h2><p>Start with an example, or bring your own role.</p>
        <div className={styles.examples}>{examples.map((item, index) => <button key={item.title} onClick={() => reset(index)}>{item.title}</button>)}</div>
        <form onSubmit={submit}>
          <label htmlFor="role-title">Role title <span>(optional)</span></label><input id="role-title" value={title} disabled={pending} maxLength={160} onChange={event => { setTitle(event.target.value); setBrief(null); setError(""); }} />
          <label htmlFor="role-description">Role description</label><textarea id="role-description" value={description} disabled={pending} minLength={100} maxLength={8000} required rows={9} aria-describedby="role-privacy" onChange={event => { setDescription(event.target.value); setBrief(null); setError(""); }} />
          <p className={styles.count}>{description.length.toLocaleString()} / 8,000 characters</p>
          <p id="role-privacy" className={styles.note}>Use public, non-confidential text. The application does not save your description. {live ? "When free Jev access is available, your text goes through Vercel AI Gateway to TypeSafe; their data policies apply. Otherwise, this uses keyword mapping." : "Keyword mapping runs without sending your text to an AI provider."}</p>
          <button className={styles.primary} disabled={pending} type="submit">{pending ? "Mapping the role…" : "Map this role to my work"}<span aria-hidden="true">↗</span></button>
          {pending && <button className={styles.cancel} type="button" onClick={() => { version.current += 1; controller.current?.abort(); setPending(false); setError("Cancelled. Your text is still here."); }}>Cancel</button>}
        </form>
        {error && <p className={styles.error} role="alert">{error}</p>}
      </section>
      <section className={styles.results} aria-labelledby="brief-heading" aria-live="polite" aria-busy={pending}>
        <div className={styles.resultHeading}><h2 id="brief-heading">Your conversation starter.</h2><span>{pending ? "Working…" : brief?.mode === "jev" ? "Jev interpretation" : brief?.mode === "example" ? "Illustrative example" : brief ? "Keyword mapping" : "Ready when you are"}</span></div>
        {pending && <p className={styles.empty}>Finding relevant public work. You can cancel at any time.</p>}
        {brief && <>
          <p className={styles.note}>{brief.mode === "jev" ? "Jev interprets requirements. Application code selects every claim from approved public work." : "This preview matches keywords, not meaning. Check the topics below; negation and unstated requirements may be missed."}</p>
          <div className={styles.tags}>{brief.capabilities.map(item => <span key={item.id}>{item.label}</span>)}</div>
          {brief.evidence.length ? brief.evidence.map((item, index) => <article className={styles.evidence} key={item.id}>
            <p className={styles.eyebrow}>0{index + 1} / {item.company}</p><h3>{item.title}</h3><p>{item.claim}</p>
            <p className={styles.overlap}>Related to {item.overlap.map(label).join(" · ")}</p>
            {item.limitation && <p className={styles.note}>{item.limitation}</p>}
            <a href={item.href} onClick={() => track("career_fit_source_opened", { evidence: item.id })}>Read the public work <span aria-hidden="true">↗</span></a>
          </article>) : <p className={styles.empty}>No clear overlap surfaced. This catalog is limited; it doesn’t establish what I can or cannot do. Browse my work or start a conversation.</p>}
          {brief.gaps.length > 0 && <aside className={styles.gaps}><h3>Worth a conversation</h3><p>{brief.gaps.map(item => item.label).join(", ")}: no direct public evidence in this catalog. Interests and adjacent experience aren’t proof of these requirements.</p></aside>}
          <div className={styles.prompts}><h3>Ask me about</h3><ul>{brief.prompts.map(prompt => <li key={prompt}>{prompt}</li>)}</ul></div>
          <a className={styles.primary} href="mailto:ashwin.rachha@gmail.com?subject=Let%E2%80%99s%20explore%20working%20together" onClick={() => track("career_fit_contact_cta_clicked")}>Start the conversation <span aria-hidden="true">↗</span></a>
        </>}
      </section>
    </div>
    <footer className={styles.disclosure}><p>An evidence explorer, not a hiring recommendation. Missing public evidence does not mean missing ability.</p><a href="/ashwin_rachha_resume.pdf" download>Prefer a résumé? Download it here ↗</a></footer>
  </>;
}
