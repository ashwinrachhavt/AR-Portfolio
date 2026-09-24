import Link from "next/link";
import styles from "./lab.module.css";

export default function LabSection() {
  return <section id="experiments" className={styles.lab} aria-labelledby="tool-title">
    <div className={styles.heading}>
      <div><p className={styles.eyebrow}><span aria-hidden="true">✦</span> The AI lab</p><h2 id="tool-title">Less scrolling.<br /><span>More “let’s try it.”</span></h2></div>
      <p>Bring a role. Bring an idea.<br />See what we could build together.</p>
    </div>
    <div className={styles.grid}>
      <article className={styles.card}>
        <div className={styles.cardLabel}><span><span aria-hidden="true">✦</span> Jev</span><span>Role explorer</span></div>
        <h3>Could I be your<br />next AI engineer?</h3>
        <p>Drop in a job description. Find the projects that fit, the evidence behind them, and the questions worth asking.</p>
        <div className={styles.preview}>
          <p className={styles.previewLabel}>Example match</p>
          <div className={styles.prompt}>“We’re building agents that can take action.”</div>
          <div className={styles.match}><span className={styles.spark} aria-hidden="true">✦</span><div><strong>Start with Lois.</strong><p>Agent workflows. Tool permissions. Real product interfaces.</p></div></div>
        </div>
        <div className={styles.actionRow}><Link href="/fit#main" className={styles.cta}>Try Jev <span aria-hidden="true">↗</span></Link><span>Start with a sample role</span></div>
      </article>
      <article className={`${styles.card} ${styles.workflow}`}>
        <div className={styles.cardLabel}><span><span aria-hidden="true">↗</span> Readiness Lab</span><span>Idea → first experiment</span></div>
        <h3>That AI idea?<br />Let’s make it concrete.</h3>
        <p>Describe the workflow you want to improve. Explore the system, its boundaries, and a practical first experiment.</p>
        <div className={styles.preview}>
          <p className={styles.previewLabel}>Example workflow</p>
          <div className={styles.prompt}>“Help our team review incoming documents.”</div>
          <div className={styles.flow} role="group" aria-label="Extract, then validate, then review"><span>Extract</span><span aria-hidden="true">→</span><span>Validate</span><span aria-hidden="true">→</span><span>Review</span></div>
          <p className={styles.flowNote}>A starting point you can inspect and discuss.</p>
        </div>
        <div className={styles.actionRow}><Link href="/tools/workflow-readiness#main" className={styles.cta}>Test your idea <span aria-hidden="true">↗</span></Link><span>Example brief included</span></div>
      </article>
    </div>
  </section>;
}
