"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { structuredProjects, type StructuredProject } from "@/data/projectsStructured";
import WorkModal from "./WorkModal";
import PortfolioIcon from "./PortfolioIcon";
import AchievementsSection from "./AchievementsSection";
import styles from "./ProjectsSection.module.css";

export default function ProjectsSection() {
  const [selectedProject, setSelectedProject] = useState<StructuredProject | null>(null);
  const [filterCategory, setFilterCategory] = useState<string>("All");

  const categories = ["All", "Fintech", "Agentic AI", "EdTech / Research", "ML Systems"];

  const filteredProjects = filterCategory === "All"
    ? structuredProjects
    : structuredProjects.filter((p) => p.category === filterCategory);

  return (
    <section id="work" className={styles.section} aria-labelledby="work-title">
      <div className={styles.sectionHeader}>
        <div>
          <span className={styles.sectionLabel}>Selected Work · Interactive Portfolio</span>
          <h2 id="work-title" className={styles.title}>Featured Projects & Deep Dives.</h2>
        </div>
        <p className={styles.subtitle}>
          Click any card to inspect the real-world impact, architecture, metrics, and technical write-up.
        </p>
      </div>

      {/* Category Filter Pills */}
      <div className={styles.filtersRow} role="tablist" aria-label="Project categories">
        {categories.map((cat) => (
          <button
            key={cat}
            type="button"
            role="tab"
            aria-selected={filterCategory === cat}
            className={`${styles.filterPill} ${filterCategory === cat ? styles.filterPillActive : ""}`}
            onClick={() => setFilterCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Primary Projects Grid */}
      <div className={styles.projectsGrid}>
        {filteredProjects.map((project, idx) => (
          <motion.article
            key={project.id}
            className={styles.card}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.45, delay: idx * 0.08 }}
            whileHover={{ y: -6, transition: { duration: 0.2 } }}
            onClick={() => setSelectedProject(project)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                setSelectedProject(project);
              }
            }}
            aria-haspopup="dialog"
          >
            {/* Project Image banner */}
            <div className={styles.imageWrapper}>
              <Image
                src={project.image}
                alt={project.title}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className={styles.cardImage}
              />
              <div className={styles.imageOverlay} />
              <div className={styles.cardTopBadge}>
                <span className={styles.orderBadge}>0{project.order}</span>
                <span className={styles.companyBadge}>{project.company}</span>
              </div>
            </div>

            {/* Card Content */}
            <div className={styles.cardBody}>
              <div className={styles.categoryLabel}>{project.category}</div>
              <h3 className={styles.cardTitle}>{project.title}</h3>
              <p className={styles.cardSubtitle}>{project.subtitle}</p>

              {/* Key Metric Spotlight */}
              {project.metrics[0] && (
                <div className={styles.metricSpotlight}>
                  <span className={styles.spotlightNumber}>{project.metrics[0].highlight}</span>
                  <span className={styles.spotlightLabel}>{project.metrics[0].label}</span>
                </div>
              )}

              {/* Tech Stack Pills */}
              <div className={styles.techList}>
                {project.techStack.slice(0, 4).map((tech) => (
                  <span key={tech} className={styles.techTag}>
                    {tech}
                  </span>
                ))}
                {project.techStack.length > 4 && (
                  <span className={styles.techMore}>+{project.techStack.length - 4}</span>
                )}
              </div>
            </div>

            {/* Card Action footer */}
            <div className={styles.cardFooter}>
              <span className={styles.openModalText}>
                Inspect modal & metrics <span className={styles.arrowIcon}>↗</span>
              </span>
              {project.deepDiveUrl && (
                <span className={styles.deepDiveAvailable}>Deep dive available</span>
              )}
            </div>
          </motion.article>
        ))}
      </div>

      {/* Achievements metrics banner */}
      <AchievementsSection />

      {/* Work Modal Dialog */}
      <WorkModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
      />
    </section>
  );
}
