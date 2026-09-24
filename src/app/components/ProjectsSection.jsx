import { projectsData } from "@/data/profile";
import PortfolioIcon from "./PortfolioIcon";
import AchievementsSection from "./AchievementsSection";
import styles from "../home.module.css";

export default function ProjectsSection() {
  return (
    <section id="work" className={styles.section} aria-labelledby="work-title">
      <div className={styles.sectionHeader}><h2 id="work-title">Selected work.</h2><p>Real workflows. Considered systems.</p></div>
      <div className={styles.featuredWork}>
        <article className={`${styles.feature} ${styles.silverFeature}`}>
          <div className={styles.featureTop}><span>Loan Labs</span><span>01</span></div>
          <h3>Less paperwork.<br />More possibility.</h3>
          <p>Lois brings document classification, policy validation, and permission-aware agent actions into mortgage workflows.</p>
          <div className={styles.productName}>Lois<span>Agentic mortgage workflows</span></div>
          <a href="#role-loan-labs" className={styles.featureLink}>Explore the engineering <PortfolioIcon /></a>
        </article>
        <article className={`${styles.feature} ${styles.darkFeature}`}>
          <div className={styles.featureTop}><span>Finally</span><span>02</span></div>
          <h3>From transactions<br />to understanding.</h3>
          <p>Classify AI combines retrieval, transaction history, and bank integrations to make bookkeeping less manual.</p>
          <div className={styles.productName}>Classify AI<span>From prototype to production</span></div>
          <a href="#role-finally" className={styles.featureLink}>Explore the engineering <PortfolioIcon /></a>
        </article>
      </div>
      <AchievementsSection />
      <details className={styles.projectArchive}>
        <summary>More things I’ve built <span>{projectsData.length - 1} projects <PortfolioIcon kind="plus" /></span></summary>
        <div className={styles.projectList}>
          {projectsData.filter(project => project.id !== 1).map(project => (
            <a key={project.id} href={project.gitUrl} className={styles.projectRow}>
              <h3>{project.title}</h3><p>{project.description}</p><PortfolioIcon />
            </a>
          ))}
        </div>
      </details>
    </section>
  );
}
