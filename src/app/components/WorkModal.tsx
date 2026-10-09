"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { StructuredProject } from "@/data/projectsStructured";
import styles from "./WorkModal.module.css";

interface WorkModalProps {
  project: StructuredProject | null;
  onClose: () => void;
}

export default function WorkModal({ project, onClose }: WorkModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (project) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [project, onClose]);

  if (!project) return null;

  return (
    <AnimatePresence>
      <div className={styles.overlay} onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="work-modal-title">
        <motion.div
          className={styles.modal}
          onClick={(e) => e.stopPropagation()}
          initial={{ opacity: 0, scale: 0.95, y: 24 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 24 }}
          transition={{ type: "spring", damping: 26, stiffness: 320 }}
        >
          {/* Header */}
          <div className={styles.header}>
            <div className={styles.headerText}>
              <div className={styles.metaRow}>
                <span className={styles.companyBadge}>{project.company}</span>
                <span className={styles.dot}>·</span>
                <span className={styles.roleText}>{project.role}</span>
                <span className={styles.dot}>·</span>
                <span className={styles.datesText}>{project.dates}</span>
              </div>
              <h2 id="work-modal-title" className={styles.title}>
                {project.title}
              </h2>
              <p className={styles.summaryText}>{project.summary}</p>
            </div>
            <button
              type="button"
              className={styles.closeBtn}
              onClick={onClose}
              aria-label="Close dialog"
            >
              ✕
            </button>
          </div>

          {/* Modal Content Grid */}
          <div className={styles.body}>
            <div className={styles.grid}>
              {/* Column 1: Impact & Outcomes */}
              <div className={styles.col}>
                <div className={styles.block}>
                  <div className={styles.sectionLabel}>IMPACT</div>
                  <p className={styles.impactText}>{project.impact}</p>
                </div>

                <div className={styles.block}>
                  <div className={styles.sectionLabel}>OUTCOMES</div>
                  <ul className={styles.bulletList}>
                    {project.outcomes.map((item, idx) => (
                      <li key={idx}>
                        <span className={styles.bulletDot}>•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className={styles.block}>
                  <div className={styles.sectionLabel}>BUSINESS VALUE</div>
                  <p className={styles.businessText}>{project.businessValue}</p>
                </div>
              </div>

              {/* Column 2: Metrics & Key Features */}
              <div className={styles.col}>
                <div className={styles.block}>
                  <div className={styles.sectionLabel}>METRICS</div>
                  <div className={styles.metricsGrid}>
                    {project.metrics.map((m, idx) => (
                      <div key={idx} className={styles.metricCard}>
                        <div className={styles.metricHighlight}>{m.highlight}</div>
                        <div className={styles.metricLabel}>{m.label}</div>
                        {m.details && <div className={styles.metricDetails}>{m.details}</div>}
                      </div>
                    ))}
                  </div>
                </div>

                <div className={styles.block}>
                  <div className={styles.sectionLabel}>KEY FEATURES & ARCHITECTURE</div>
                  <ul className={styles.bulletList}>
                    {project.keyFeatures.map((item, idx) => (
                      <li key={idx}>
                        <span className={styles.bulletDot}>•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className={styles.block}>
                  <div className={styles.sectionLabel}>TECHNOLOGY STACK</div>
                  <div className={styles.techPills}>
                    {project.techStack.map((tech) => (
                      <span key={tech} className={styles.techPill}>
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Bar */}
          <div className={styles.footer}>
            <div className={styles.footerLinks}>
              {project.deepDiveUrl && (
                <Link
                  href={project.deepDiveUrl}
                  className={styles.deepDiveBtn}
                  onClick={onClose}
                >
                  Read Full Technical Deep Dive →
                </Link>
              )}
              {project.githubUrl && (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.secondaryBtn}
                >
                  GitHub Repository ↗
                </a>
              )}
            </div>
            <button type="button" className={styles.dismissBtn} onClick={onClose}>
              Close
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
