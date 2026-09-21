import Image from "next/image";
import PortfolioIcon from "./PortfolioIcon";
import styles from "../home.module.css";

export default function HeroSection() {
  return (
    <section id="about" className={styles.hero} aria-labelledby="hero-title">
      <div className={styles.heroContent}>
        <h1 id="hero-title">Complex systems.<br /><span>Simple experiences.</span></h1>
        <p>I’m Ashwin, an applied AI engineer. I build agentic products and financial software, from the underlying systems to the details people interact with.</p>
        <div className={styles.actions}>
          <a className={styles.primaryButton} href="#work">View my work <PortfolioIcon /></a>
          <a className={styles.textButton} href="/ashwin_rachha_resume.pdf" download>Download resume <PortfolioIcon kind="download" /></a>
        </div>
      </div>
      <div className={styles.portrait}>
        <Image src="/images/Ashwin.png" alt="Illustrated portrait of Ashwin Rachha" width={439} height={550} preload sizes="(max-width: 700px) 160px, 280px" />
        <p>Applied AI. Product engineering.<br />Built with intention.</p>
      </div>
      <div className={styles.heroFootnote}><span>Currently building at Loan Labs</span><span>Previously Finally · Virginia Tech</span></div>
    </section>
  );
}
