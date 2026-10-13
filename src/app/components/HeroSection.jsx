import Image from "next/image";
import PortfolioIcon from "./PortfolioIcon";
import styles from "../home.module.css";

const HERO_COPY = {
  eyebrow: "AI Product Engineer",
  headline: "Ideas into products. Curiosity into work.",
  intro: [
    "Hi, I'm Ashwin — an AI engineer with four years in the software industry, most recently as a founding AI engineer at Finally (series B) and LoanLabs (a16z speedrun).",
    "At Finally, I shipped an AI bookkeeper that worked alongside a team of bookkeepers to classify transactions — taking customer churn from 30% down to 5% while MRR grew from $600K to $1.2M. I also built the banking integration system on Plaid and Teller so every transaction at Finally flowed securely through each system — and that infrastructure is what let us ship cash-flow underwriting, deploying $15M+ in credit to clients underwritten purely on their cash.",
    "Most recently, I've been building Lois: an agentic mortgage processor that makes loan origination automatic and accurate for business-purpose lenders — dropping the cost to originate a loan from ~$8K down to roughly the token costs of the LLM of your choice.",
  ],
  interests: ["AI", "startups", "fintech", "philosophy", "chess"],
};

export default function HeroSection() {
  return (
    <section id="about" className={styles.hero} aria-labelledby="hero-title">
      <div className={styles.heroContent}>
        <p className={styles.heroEyebrow}>{HERO_COPY.eyebrow}</p>
        <h1 id="hero-title">{HERO_COPY.headline}</h1>
        {HERO_COPY.intro.map((paragraph) => (
          <p key={paragraph.slice(0, 24)} className={styles.intro}>
            {paragraph}
          </p>
        ))}
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