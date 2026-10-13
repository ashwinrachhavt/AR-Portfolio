import Image from "next/image";
import styles from "../home.module.css";

const HERO_COPY = {
  eyebrow: "AI Product Engineer",
  headline: "Ideas into products. Curiosity into work.",
  intro:
    "Hi, I'm Ashwin — an AI engineer with four years in the software industry, most recently as a founding AI engineer at Finally (series B) and LoanLabs (a16z speedrun).",
};

export default function HeroSection() {
  return (
    <section id="top" className={styles.hero} aria-labelledby="hero-title">
      <div className={styles.heroContent}>
        <p className={styles.heroEyebrow}>{HERO_COPY.eyebrow}</p>
        <h1 id="hero-title">{HERO_COPY.headline}</h1>
        <p className={styles.intro}>{HERO_COPY.intro}</p>

        <div className={styles.ctaRow}>
          <a
            className={`${styles.cta} ${styles.ctaPrimary}`}
            href="/ashwin_rachha_resume_ai_pdf (1).pdf"
            download
          >
            Download Résumé
          </a>
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