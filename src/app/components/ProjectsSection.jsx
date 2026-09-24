"use client";

import { useId, useRef, useState } from "react";
import Link from "next/link";
import { projects } from "@/data/projects.mjs";
import { projectsData } from "@/data/profile";
import PortfolioIcon from "./PortfolioIcon";
import AchievementsSection from "./AchievementsSection";
import home from "../home.module.css";
import styles from "./projects.module.css";

const views = ["Overview", "Approach", "Evidence"];

function moveTab(event, index, count, select, refs) {
  let next;
  if (event.key === "ArrowRight") next = (index + 1) % count;
  else if (event.key === "ArrowLeft") next = (index - 1 + count) % count;
  else if (event.key === "Home") next = 0;
  else if (event.key === "End") next = count - 1;
  else return;
  event.preventDefault();
  select(next);
  refs.current[next]?.focus();
}

export function ProjectPane({ project, standalone = false }) {
  const [view, setView] = useState(0);
  const [step, setStep] = useState(0);
  const tabs = useRef([]);
  const uid = useId();
  const Heading = standalone ? "h1" : "h3";
  const currentStep = project.steps[step];

  return (
    <article className={styles.pane} aria-label={`${project.title} project`}>
      <div className={styles.systemMap}>
        <div className={styles.mapHeader}><span>Inside the work</span><span aria-hidden="true">↗</span></div>
        <p className={styles.mapTitle}>{project.headline}</p>
        <div className={styles.steps} role="group" aria-label={`${project.title} system details`}>
          {project.steps.map((item, index) => (
            <button key={item.title} type="button" className={styles.step} aria-pressed={step === index} aria-controls={`${uid}-step-detail`} onClick={() => setStep(index)}>
              <span className={styles.stepNumber}>{String(index + 1).padStart(2, "0")}</span>
              <span>{item.title}</span><span className={styles.stepArrow} aria-hidden="true">↗</span>
            </button>
          ))}
        </div>
        <div id={`${uid}-step-detail`} className={styles.stepDetail} aria-live="polite" aria-atomic="true">
          <span className={styles.detailLabel}>{currentStep.title}</span><p>{currentStep.detail}</p>
        </div>
        <p className={styles.mapHint}>Select a layer to look closer.</p>
      </div>
      <div className={styles.content}>
        <div className={styles.meta}><span>{project.company}</span><span className={styles.status}>{project.status}</span></div>
        <p className={styles.category}>{project.category}</p>
        <Heading className={styles.title}>{project.title}</Heading>
        <p className={styles.summary}>{project.summary}</p>
        <div className={styles.viewTabs} role="tablist" aria-label={`${project.title} reading view`}>
          {views.map((label, index) => (
            <button key={label} ref={(node) => { tabs.current[index] = node; }} type="button" role="tab" id={`${uid}-view-${index}`} aria-selected={view === index} aria-controls={`${uid}-view-panel-${index}`} tabIndex={view === index ? 0 : -1} onClick={() => setView(index)} onKeyDown={(event) => moveTab(event, index, views.length, setView, tabs)}>{label}</button>
          ))}
        </div>
        {views.map((label, index) => (
          <div key={label} id={`${uid}-view-panel-${index}`} role="tabpanel" aria-labelledby={`${uid}-view-${index}`} hidden={view !== index} tabIndex={0} className={styles.viewPanel}>
            {index === 0 ? (
              <>
                <p className={styles.detailLabel}>The focus</p><p>{project.focus}</p>
                <div className={styles.signal}><strong>{project.signal}</strong><span>{project.signalLabel}</span></div>
                <p className={styles.scope}>{project.scope}</p>
              </>
            ) : index === 1 ? (
              <>
                <p className={styles.detailLabel}>The engineering</p><p>{project.approach}</p>
                <div className={styles.topics} aria-label="Technologies and themes">{project.topics.map((topic) => <span key={topic}>{topic}</span>)}</div>
                <p className={styles.detailLabel}>The outcome</p><p>{project.result}</p>
              </>
            ) : (
              <>
                <p className={styles.evidenceIntro}>From the approved public career record.</p>
                <ol className={styles.evidence}>
                  {project.bullets.map((bullet) => <li key={bullet.id}><p>{bullet.text}</p><span>{project.company} · {bullet.key}</span></li>)}
                </ol>
                <a className={styles.sourceLink} href="/ashwin_rachha_resume.pdf">View public resume <PortfolioIcon /></a>
              </>
            )}
          </div>
        ))}
        <div className={styles.projectFooter}>
          <span>{project.role}<small>{project.dates}</small></span>
          {standalone ? (
            <div className={styles.resourceLinks}>{project.links.map((link) => <a key={link.href} href={link.href}>{link.label}<PortfolioIcon /></a>)}</div>
          ) : (
            <Link href={project.href} aria-label={`Open ${project.title} project`}>Open project <PortfolioIcon /></Link>
          )}
        </div>
      </div>
    </article>
  );
}

export default function ProjectsSection() {
  const [selected, setSelected] = useState(0);
  const tabs = useRef([]);
  const uid = useId();

  return (
    <section id="work" className={home.section} aria-labelledby="work-title">
      <div className={home.sectionHeader}><h2 id="work-title">Selected work.</h2><p>Seven projects. The systems behind them.</p></div>
      <div className={styles.projectTabs} role="tablist" aria-label="Select a project">
        {projects.map((project, index) => (
          <button key={project.id} ref={(node) => { tabs.current[index] = node; }} type="button" role="tab" id={`${uid}-project-${project.id}`} aria-selected={selected === index} aria-controls={`${uid}-panel-${project.id}`} tabIndex={selected === index ? 0 : -1} onClick={() => setSelected(index)} onKeyDown={(event) => moveTab(event, index, projects.length, setSelected, tabs)}>
            <span className={styles.projectNumber}>{String(index + 1).padStart(2, "0")}</span><span>{project.title}</span>
          </button>
        ))}
      </div>
      {projects.map((project, index) => (
        <div key={project.id} id={`${uid}-panel-${project.id}`} role="tabpanel" aria-labelledby={`${uid}-project-${project.id}`} hidden={selected !== index} tabIndex={0} className={styles.projectPanel}>
          {selected === index ? <ProjectPane project={project} /> : null}
        </div>
      ))}
      <AchievementsSection />
      <p className={styles.outcomeNote}>Selected production outcomes at Finally. Credit supported and close-time improvements reflect team outcomes.</p>
      <details className={home.projectArchive}>
        <summary>More things I’ve built <span>{projectsData.length - 1} projects <PortfolioIcon kind="plus" /></span></summary>
        <div className={home.projectList}>
          {projectsData.filter((project) => project.id !== 1).map((project) => (
            <a key={project.id} href={project.gitUrl} className={home.projectRow}>
              <h3>{project.title}</h3><p>{project.description}</p><PortfolioIcon />
            </a>
          ))}
        </div>
      </details>
    </section>
  );
}
