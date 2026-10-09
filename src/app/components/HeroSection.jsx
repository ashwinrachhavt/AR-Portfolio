import Image from "next/image";
import PortfolioIcon from "./PortfolioIcon";
import styles from "../home.module.css";

const HERO_COPY = {
  eyebrow: "AI Product Engineer",
  headline: "Ideas into products. Curiosity into work.",
  intro:
    "I've built and scaled two AI product teams at Finally and Loan Labs, and I care about the whole journey: the idea, the design, and why someone chooses it.",
  interests: ["AI", "startups", "fintech", "philosophy", "chess"],
};

export default function HeroSection() {
  return (
    <section id="about" className={styles.hero} aria-labelledby="hero-title">
      <div className={styles.heroContent}>
        <p className={styles.heroEyebrow}>{HERO_COPY.eyebrow}</p>
        <h1 id="hero-title">{HERO_COPY.headline}</h1>
        <p className={styles.intro}>{HERO_COPY.intro}</p>
        <p className={styles.interests}>{HERO_COPY.interests.join(" · ")}</p>

        <div className={styles.ctaRow}>
          <a
            className={`${styles.cta} ${styles.ctaPrimary}`}
            href="/ashwin_rachha_resume_ai_pdf (1).pdf"
            download
          >
            Download Résumé
          </a>
          {/* 2 & 3: keep existing hrefs, secondary style */}
          <a className={styles.cta} href="#work">
            See what I&apos;ve built
          </a>
          <a className={styles.cta} href="/fit">
            Explore working together
          </a>
        </div>
      </div>

      <div className={styles.portrait}>
        <Image
          src="/images/Ashwin.png"
          alt="Illustrated portrait of Ashwin Rachha"
          width={439}
          height={550}
          preload
          sizes="(max-width: 700px) 160px, 280px"
        />
      </div>

      <div className={styles.heroFootnote}>
        <span>Currently building at Loan Labs</span>
        <span>Previously Finally · Virginia Tech</span>
      </div>
    </section>
  );
}