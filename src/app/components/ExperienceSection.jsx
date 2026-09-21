import { experienceData } from "@/data/profile";
import PortfolioIcon from "./PortfolioIcon";
import styles from "../home.module.css";

const roleIds = { "Loan Labs": "loan-labs", Finally: "finally", "UNAR Labs": "unar-labs", Outreach: "outreach" };

export default function ExperienceSection() {
  return (
    <section id="experience" className={styles.section} aria-labelledby="experience-title">
      <div className={styles.sectionHeader}><h2 id="experience-title">Experience.</h2><p>From research to real-world products.</p></div>
      <div className={styles.experienceList}>
        {experienceData.map((role, index) => (
          <details key={role.id} className={styles.role} open={index === 0}>
            <summary>
              <span className={styles.roleIdentity}><span className={styles.company}>{role.company}</span><span className={styles.position}>{role.position}</span></span>
              <span className={styles.roleDate}>{role.duration}</span><PortfolioIcon kind="plus" className={styles.expandIcon} />
            </summary>
            <div id={`role-${roleIds[role.company]}`} className={styles.roleBody}>
              <ul>{role.description.map(bullet => <li key={bullet}>{bullet}</li>)}</ul>
              <div className={styles.tags} role="group" aria-label={`${role.company} technologies`}>{role.technologies.map(tech => <span key={tech}>{tech}</span>)}</div>
            </div>
          </details>
        ))}
      </div>
    </section>
  );
}
