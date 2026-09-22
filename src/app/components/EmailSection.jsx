import PortfolioIcon from "./PortfolioIcon";
import styles from "../home.module.css";

export default function EmailSection() {
  return (
    <section id="contact" className={styles.contact} aria-labelledby="contact-title">
      <p className={styles.sectionLabel}>Let’s work together</p>
      <h2 id="contact-title">Something worth<br /><span>building?</span></h2>
      <p>I’m interested in product engineering, applied AI, and founding engineering roles. Especially with people who care about how a product is built, experienced, and brought to market.</p>
      <a className={styles.primaryButton} href="mailto:ashwin.rachha@gmail.com">Let’s talk <PortfolioIcon /></a>
      <div className={styles.contactLinks}><a href="mailto:ashwin.rachha@gmail.com">ashwin.rachha@gmail.com</a><a href="https://www.linkedin.com/in/ashwinrachha/">LinkedIn</a><a href="https://github.com/ashwinrachhavt">GitHub</a></div>
    </section>
  );
}
