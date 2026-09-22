import Image from "next/image";
import PortfolioIcon from "./PortfolioIcon";
import styles from "../home.module.css";

export default function HeroSection() {
  return (
    <section id="about" className={styles.hero} aria-labelledby="hero-title">
      <div className={styles.heroContent}>
        <p className={styles.heroEyebrow}>Product engineer · Building with AI</p>
        <h1 id="hero-title">Ideas into products.<br /><span>Curiosity into work.</span></h1>
        <p>I’m Ashwin. I build AI products, from the systems underneath to the experience people use. I’m interested in the whole journey: the idea, the design, and what makes someone choose it.</p>
        <div className={styles.actions}>
          <a className={styles.primaryButton} href="/fit">Explore working together <PortfolioIcon /></a>
          <a className={styles.textButton} href="#work">See what I’ve built <PortfolioIcon /></a>
        </div>
      </div>
      <div className={styles.portrait}>
        <Image src="/images/Ashwin.png" alt="Illustrated portrait of Ashwin Rachha" width={439} height={550} preload sizes="(max-width: 700px) 160px, 280px" />
        <p>Engineering, design, and a little<br />productive obsession.</p>
      </div>
      <div className={styles.heroFootnote}><span>Currently building at Loan Labs</span><span>Previously Finally · Virginia Tech</span></div>
    </section>
  );
}
