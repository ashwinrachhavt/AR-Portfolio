"use client";

import React, { useState } from "react";
import Image from "next/image";
import styles from "./ArchitectureDiagram.module.css";

interface ArchitectureDiagramProps {
  svgSrc: string;
  pngSrc?: string;
  title: string;
  caption: string;
  excalidrawSrc?: string;
  aspectRatio?: string;
}

export default function ArchitectureDiagram({
  svgSrc,
  pngSrc,
  title,
  caption,
  excalidrawSrc,
  aspectRatio = "16/10",
}: ArchitectureDiagramProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);

  const handleOpen = () => {
    setIsOpen(true);
    setZoomLevel(1);
    document.body.style.overflow = "hidden";
  };

  const handleClose = () => {
    setIsOpen(false);
    document.body.style.overflow = "";
  };

  const zoomIn = (e: React.MouseEvent) => {
    e.stopPropagation();
    setZoomLevel((prev) => Math.min(prev + 0.35, 2.5));
  };

  const zoomOut = (e: React.MouseEvent) => {
    e.stopPropagation();
    setZoomLevel((prev) => Math.max(prev - 0.35, 0.7));
  };

  const resetZoom = (e: React.MouseEvent) => {
    e.stopPropagation();
    setZoomLevel(1);
  };

  return (
    <>
      <figure className={styles.figure}>
        <div className={styles.header}>
          <div className={styles.headerInfo}>
            <span className={styles.diagramBadge}>System Architecture</span>
            <span className={styles.title}>{title}</span>
          </div>
          <div className={styles.actions}>
            {excalidrawSrc && (
              <a
                href={excalidrawSrc}
                download
                className={styles.actionBtn}
                title="Download source Excalidraw file"
              >
                <span>.excalidraw</span>
                <span aria-hidden="true">↓</span>
              </a>
            )}
            <a
              href={svgSrc}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.actionBtn}
              title="Open full vector SVG in new tab"
            >
              <span>SVG</span>
              <span aria-hidden="true">↗</span>
            </a>
            <button
              type="button"
              onClick={handleOpen}
              className={`${styles.actionBtn} ${styles.expandBtn}`}
              aria-label="Expand diagram fullscreen"
            >
              <span>Expand</span>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
              </svg>
            </button>
          </div>
        </div>

        <div
          className={styles.imageContainer}
          onClick={handleOpen}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && handleOpen()}
          aria-label={`View full diagram: ${title}`}
          style={{ aspectRatio }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={svgSrc}
            alt={title}
            className={styles.diagramImg}
            loading="lazy"
          />
          <div className={styles.hoverOverlay}>
            <span className={styles.hoverText}>Click to expand & zoom</span>
          </div>
        </div>

        <figcaption className={styles.caption}>
          <strong>Diagram Details:</strong> {caption}
        </figcaption>
      </figure>

      {/* Lightbox Modal */}
      {isOpen && (
        <div className={styles.modalOverlay} onClick={handleClose} role="dialog" aria-modal="true">
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalToolbar}>
              <div className={styles.modalTitle}>{title}</div>
              <div className={styles.modalControls}>
                <button
                  type="button"
                  onClick={zoomOut}
                  className={styles.zoomBtn}
                  disabled={zoomLevel <= 0.7}
                  aria-label="Zoom out"
                >
                  −
                </button>
                <button
                  type="button"
                  onClick={resetZoom}
                  className={styles.zoomReset}
                  aria-label="Reset zoom"
                >
                  {Math.round(zoomLevel * 100)}%
                </button>
                <button
                  type="button"
                  onClick={zoomIn}
                  className={styles.zoomBtn}
                  disabled={zoomLevel >= 2.5}
                  aria-label="Zoom in"
                >
                  +
                </button>
                <a
                  href={svgSrc}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.modalLink}
                >
                  Raw SVG ↗
                </a>
                <button
                  type="button"
                  onClick={handleClose}
                  className={styles.closeBtn}
                  aria-label="Close modal"
                >
                  ✕
                </button>
              </div>
            </div>

            <div className={styles.modalViewport}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={svgSrc}
                alt={title}
                className={styles.modalImg}
                style={{
                  transform: `scale(${zoomLevel})`,
                  transition: "transform 0.18s ease-out",
                }}
              />
            </div>

            <div className={styles.modalCaption}>{caption}</div>
          </div>
        </div>
      )}
    </>
  );
}
