import EveChat from "./EveChat";
import PortfolioIcon from "./PortfolioIcon";
import styles from "../home.module.css";

export default function HeroSection() {
  return (
    <section id="about" className={styles.hero} aria-labelledby="hero-title">
      <div className={styles.heroContent}>
        <p className={styles.heroEyebrow}>Engineering <span aria-hidden="true">×</span> Product <span aria-hidden="true">×</span> Curiosity</p>
        <h1 id="hero-title">Ideas into<br />products.<br /><span>Learning into<br /> possibility.</span></h1>
        <p>I’m Ashwin. I build AI products and the systems behind them. This is my work—and a little of what I’ve learned along the way. Make something of it.</p>
        <div className={styles.actions}>
          <a className={`${styles.primaryButton} ${styles.assistantCta}`} href="#assistant-question">Ask my assistant <PortfolioIcon /></a>
          <a className={styles.textButton} href="#work">See what I’ve built <PortfolioIcon /></a>
        </div>
      </div>
      <EveChat enabled={process.env.NODE_ENV === "development" && process.env.EVE_LOCAL_ENABLED === "1"} />
      <div className={styles.heroFootnote}><span>Currently building at Loan Labs</span><span>Previously Finally · Virginia Tech</span></div>
    </section>
  );
}
