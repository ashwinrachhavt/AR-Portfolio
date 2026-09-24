import { projectsData } from "@/data/profile";
import resume from "@/content/resume.json";
import Link from "next/link";
import PortfolioIcon from "./PortfolioIcon";
import AchievementsSection from "./AchievementsSection";
import styles from "../home.module.css";

export default function ProjectsSection() {
  const finallyRole = resume.roles.find(role => role.id === "finally");
  const unarRole = resume.roles.find(role => role.id === "unar");
  const commandCenter = resume.projects.find(project => project.id === "command-center");
  const alfred = resume.projects.find(project => project.id === "alfred");
  const archivedProjects = projectsData.filter(project => ![1, 2].includes(project.id));
  const cards = [
    { id: "command-center", title: commandCenter.title, tag: "Latest project · Personal workspace", headline: <>Keep the context.<br />Move the work forward.</>, description: commandCenter.description, href: commandCenter.code, action: "Explore Command Center", latest: true },
    { id: "lois", title: "Lois", tag: "Loan Labs · Agentic mortgage workflows", headline: <>Less paperwork.<br />More possibility.</>, description: "Lois brings document classification, policy validation, and permission-aware agent actions into mortgage workflows.", href: "/work/loan-labs#main", action: "Explore the engineering", silver: true },
    { id: "classify", title: "Classify AI", tag: "Finally · From prototype to production", headline: <>From transactions<br />to understanding.</>, description: "Classify AI combines retrieval, transaction history, and bank integrations to make bookkeeping less manual.", href: "/work/finally#classify", action: "Explore the engineering" },
    { id: "underwriting", title: "Cash underwriting", tag: "Finally · Financial infrastructure", headline: <>Credit decisions.<br />Grounded in cash flow.</>, description: finallyRole.bullets.underwriting, href: "/work/finally#underwriting", action: "Explore the underwriting work" },
    { id: "gurukul", title: "Gurukul", tag: "CS education · Published research", headline: <>Space to learn.<br />Support to reason.</>, description: resume.research.description, href: resume.research.thesis, action: "Read the research", silver: true },
    { id: "unar", title: "UNAR Labs", tag: "Accessibility · Applied machine learning", headline: <>Make information<br />more accessible.</>, description: unarRole.bullets.accessibility, href: "/work/unar#accessibility", action: "Explore the accessibility work", silver: true },
    { id: "alfred", title: alfred.title, tag: "Personal knowledge · Agentic retrieval", headline: <>Collect what matters.<br />Connect what you know.</>, description: alfred.description, href: "#contact", action: "Let’s talk about Alfred" },
  ];
  return (
    <section id="work" className={styles.section} aria-labelledby="work-title">
      <div className={styles.sectionHeader}><h2 id="work-title">Selected work.</h2><p>Real workflows. Considered systems.</p></div>
      <div className={styles.featuredWork}>
        {cards.map((card, index) => <article key={card.id} className={`${styles.feature} ${card.silver ? styles.silverFeature : styles.darkFeature} ${card.latest ? styles.latestFeature : ""}`}>
          <header className={styles.featureHeader}>
            <div className={styles.featureTop}><h3>{card.title}</h3><span aria-hidden="true">{String(index + 1).padStart(2, "0")}</span></div>
            <p className={styles.featureTag}>{card.tag}</p>
          </header>
          <p className={styles.featureHeadline}>{card.headline}</p>
          <p className={styles.featureDescription}>{card.description}</p>
          <Link href={card.href} className={styles.featureLink}>{card.action}<PortfolioIcon /></Link>
        </article>)}
      </div>
      <AchievementsSection />
      <details className={styles.projectArchive}>
        <summary>More things I’ve built <span>{archivedProjects.length} projects <PortfolioIcon kind="plus" /></span></summary>
        <div className={styles.projectList}>
          {archivedProjects.map(project => (
            <a key={project.id} href={project.gitUrl} className={styles.projectRow}>
              <h3>{project.title}</h3><p>{project.description}</p><PortfolioIcon />
            </a>
          ))}
        </div>
      </details>
    </section>
  );
}
