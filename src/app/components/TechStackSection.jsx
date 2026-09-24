import Image from "next/image";
import stack from "../../content/tech-stack.json";
import styles from "./tech-stack.module.css";

export default function TechStackSection() {
  return <section id="stack" className={styles.section} aria-labelledby="stack-title">
    <header className={styles.header}>
      <div><p className={styles.eyebrow}>From interface to infrastructure</p><h2 id="stack-title">The tools behind the work.</h2></div>
      <p>Across my product, AI,<br />and financial systems work.</p>
    </header>
    <div className={styles.groups}>
      {stack.groups.map((group, index) => <div className={styles.group} key={group.title}>
        <h3><span aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>{group.title}</h3>
        <ul>{group.items.map(item => <li key={item.name}><span className={styles.icon}><Image src={item.icon} alt="" width={22} height={22} unoptimized /></span><span>{item.name}</span></li>)}</ul>
      </div>)}
      <div className={styles.patterns}><h3>Patterns &amp; protocols</h3><ul>{stack.patterns.map(pattern => <li key={pattern}>{pattern}</li>)}</ul></div>
    </div>
    <p className={styles.sources}>Explore the work in my <a href="/ashwin_rachha_resume.pdf">résumé</a> and <a href={stack.profileSource}>public profile</a>.</p>
  </section>;
}
