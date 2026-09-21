import styles from "../home.module.css";

export default function AchievementsSection() {
  return (
    <div className={styles.outcomes} role="group" aria-label="Selected outcomes at Finally">
      <p className={styles.outcomesLabel}>Selected outcomes<br />at Finally</p>
      <div><strong>50K+</strong><span>transactions processed daily</span></div>
      <div><strong>~80%</strong><span>less manual categorization</span></div>
      <div><strong>$3M+</strong><span>in credit underwritten</span></div>
    </div>
  );
}
