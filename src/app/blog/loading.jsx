import styles from "./blog.module.css";

export default function Loading() {
  return (
    <div role="status" aria-label="Loading writing" className={styles.skeleton}>
      <div aria-hidden="true">
        <div className={styles.skeletonTitle} />
        {[0, 1, 2].map(row => <div key={row} className={styles.skeletonRow}><div className={styles.skeletonLine} /></div>)}
      </div>
      <span className={styles.srOnly}>Loading writing…</span>
    </div>
  );
}
