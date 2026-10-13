import styles from "../home.module.css";

export default function AboutSection() {
  return (
    <section id="about-story" className={`${styles.section} ${styles.about}`} aria-labelledby="about-story-title">
      <p className={styles.sectionLabel}>About</p>
      <h2 id="about-story-title" className={styles.aboutTitle}>
        The work, and what it moved.
      </h2>
      <p className={styles.aboutBody}>
        At Finally, I shipped an AI bookkeeper that worked alongside a team of bookkeepers to classify transactions — taking customer churn from 30% down to 5% while MRR grew from $600K to $1.2M. I also built the banking integration system on Plaid and Teller so every transaction at Finally flowed securely through each system — and that infrastructure is what let us ship cash-flow underwriting, deploying $15M+ in credit to clients underwritten purely on their cash.
      </p>
      <p className={styles.aboutBody}>
        Most recently, I&apos;ve been building Lois: an agentic mortgage processor that makes loan origination automatic and accurate for business-purpose lenders — dropping the cost to originate a loan from ~$8K down to roughly the token costs of the LLM of your choice.
      </p>
    </section>
  );
}
