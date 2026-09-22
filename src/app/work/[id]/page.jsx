import { notFound } from "next/navigation";
import Link from "next/link";
import resume from "../../../content/resume.json";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import home from "../../home.module.css";
import styles from "../../blog/blog.module.css";

export function generateStaticParams() { return resume.roles.map(role => ({ id: role.id })); }
export async function generateMetadata({ params }) {
  const { id } = await params;
  const role = resume.roles.find(item => item.id === id);
  return { title: role ? `${role.company}: selected work | Ashwin Rachha` : "Work | Ashwin Rachha" };
}
export default async function WorkPage({ params }) {
  const { id } = await params;
  const role = resume.roles.find(item => item.id === id);
  if (!role) notFound();
  return <><a className={home.skipLink} href="#main">Skip to content</a><Navbar />
    <main id="main" className={`${home.main} ${styles.main}`}><div className={styles.readingColumn}>
      <Link className={styles.backLink} href="/#work">← Selected work</Link>
      <article><header className={styles.articleHeader}><p className={styles.eyebrow}>{role.title} · {role.dates}</p><h1>{role.company}</h1><p>{role.context}</p></header>
        <div className={styles.prose}><h2>What I worked on</h2><ul>{Object.entries(role.bullets).map(([key, claim]) => <li key={key} id={key}>{claim}</li>)}</ul>
          <h2>What to discuss</h2><p>These are selected public facts from my résumé. I’m happy to walk through the decisions, tradeoffs, and my specific contribution in a conversation.</p>
          <p><Link href="/fit">Map this work to your role →</Link></p><p><a href="/ashwin_rachha_resume.pdf">Read the full résumé →</a></p>
        </div>
      </article></div></main><Footer topId="main" /></>;
}
