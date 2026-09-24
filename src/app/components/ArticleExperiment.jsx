"use client";

import { useState } from "react";
import Link from "next/link";
import styles from "./article-experiment.module.css";

const experiments = {
  "3b92e262-08a5-8186-942c-ff5559fe4f68": {
    title: "Change the request. Follow the state.",
    intro: "A design exercise based on this essay. Choose a failure to see what the application must own.",
    source: "publication-3b92e262-08a5-8186-942c-ff5559fe4f68-a-migration-should-begin-with-an-inventory",
    options: [
      ["Different worker", "The next request reaches worker B.", "The operation must identify its resource and recover the required context without relying on worker A’s memory.", "Test: route successive requests to different workers. Can an authorized operation still complete?", "Identity → resource → durable context → current permission check"],
      ["Permission revoked", "Access changes while an approval is pending.", "A remembered approval cannot grant access forever. Recheck current permissions when the action executes.", "Test: revoke access between proposal and execution. The operation should be denied.", "Proposed action → human approval → access revoked → deny execution"],
      ["Retry after timeout", "The client cannot tell whether the write completed.", "Use an application operation key and a durable outcome so retrying does not repeat a consequential action.", "Test: interrupt the response after the write, then retry. Verify that the intended change happens once.", "Operation key → recorded outcome → retry → same outcome"],
    ],
  },
  "3bb2e262-08a5-80aa-b865-e905d51fa752": {
    title: "A signature is only the beginning.",
    intro: "Follow the hypothetical request from this essay. What should the product show when a boundary fails?",
    source: "publication-3bb2e262-08a5-80aa-b865-e905d51fa752-what-happens-when-something-breaks",
    options: [
      ["Message changed", "The message is modified after signing.", "Verification should fail before the message becomes an ordinary agent task.", "Interface: show that the request was rejected. Do not present it as delegated or completed work.", "Signed event → integrity check fails → request rejected"],
      ["Access denied", "The author is authentic, but lacks permission.", "Identity and authorization are separate checks. A valid signature does not authorize every action.", "Interface: explain the denied action without implying the agent completed it.", "Identity verified → workspace permission denied → no tool execution"],
      ["Worker interrupted", "The request was accepted, then the worker stopped.", "Accepted work is not completed work. Preserve a visible failure or recovery state and define safe retry behavior.", "Interface: show the interruption and the next available action, with enough evidence to inspect what happened.", "Request accepted → worker interrupted → recovery needed"],
    ],
  },
};

export default function ArticleExperiment({ articleId }) {
  const [selection, setSelection] = useState(0);
  const experiment = experiments[articleId];
  if (!experiment) return <aside className={styles.experiment}><p className={styles.eyebrow}>Take the idea further</p><h2>Follow a connection.</h2><p>Explore practical experience, reading notes, and references from the public collection.</p><Link href="/#assistant-question">Ask my assistant ↗</Link></aside>;
  const option = experiment.options[selection];
  return <section className={styles.experiment} aria-labelledby="article-experiment-title"><p className={styles.eyebrow}>Try the idea · Interactive reading</p><h2 id="article-experiment-title">{experiment.title}</h2><p>{experiment.intro}</p><div className={styles.choices} role="group" aria-label="Choose a scenario">{experiment.options.map(([title], i) => <button type="button" key={title} aria-pressed={selection === i} onClick={() => setSelection(i)}>{title}</button>)}</div><div className={styles.outcome} aria-live="polite"><h3>{option[1]}</h3><p>{option[2]}</p><div className={styles.flow}>{option[4].split(" → ").map((step, i) => <span key={step}>{i > 0 && <i aria-hidden="true">→</i>}{step}</span>)}</div><p className={styles.test}>{option[3]}</p></div><Link href={`/knowledge/${experiment.source}`}>Read the source passage ↗</Link><small>Illustrative design exercise. No live system or model is being called.</small></section>;
}
