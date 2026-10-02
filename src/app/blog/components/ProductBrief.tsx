import styles from "./ProductBrief.module.css";

interface ProductBriefProps {
  eyebrow: string;
  title: string;
  spec: string;
  stack: string[];
  architecture: string[];
  outcome: string;
}

export default function ProductBrief({
  eyebrow,
  title,
  spec,
  stack,
  architecture,
  outcome,
}: ProductBriefProps) {
  return (
    <section className={styles.brief} aria-labelledby={`${title}-brief`}>
      <div className={styles.header}>
        <span className={styles.eyebrow}>{eyebrow}</span>
        <h2 id={`${title}-brief`}>{title}</h2>
        <p>{spec}</p>
      </div>

      <div className={styles.grid}>
        <div className={styles.column}>
          <span className={styles.label}>Technology stack</span>
          <ul className={styles.tags}>
            {stack.map((item) => <li key={item}>{item}</li>)}
          </ul>
        </div>
        <div className={styles.column}>
          <span className={styles.label}>System design</span>
          <ol className={styles.architecture}>
            {architecture.map((item, index) => (
              <li key={item}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                {item}
              </li>
            ))}
          </ol>
        </div>
      </div>

      <div className={styles.outcome}>
        <span className={styles.label}>What shipped</span>
        <p>{outcome}</p>
      </div>
    </section>
  );
}
