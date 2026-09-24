import Link from "next/link";
import { notFound } from "next/navigation";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import home from "../../home.module.css";
import styles from "../knowledge.module.css";
import { knowledge, getKnowledge, relatedKnowledge } from "../../../lib/knowledge.mjs";
import { topics } from "../../../lib/knowledge-search.mjs";

export function generateStaticParams() { return knowledge.map(record => ({ id: record.id })); }
export async function generateMetadata({ params }) { const { id } = await params; const record = getKnowledge(id); return { title: record ? `${record.title} — Source notes` : "Knowledge not found", description: record?.summary }; }

export default async function KnowledgeRecord({ params }) {
  const { id } = await params;
  const record = getKnowledge(id);
  if (!record) notFound();
  return <><a className={home.skipLink} href="#knowledge-record">Skip to knowledge record</a><Navbar activeSection="knowledge" /><main id="knowledge-record" className={home.main}><article className={styles.detail}><Link href="/#assistant-question">← Back to the assistant</Link><p className={styles.eyebrow}>{record.kind} · Public collection</p><h1>{record.title}</h1><p className={styles.detailSummary}>{record.summary}</p><div className={styles.connections}>{record.topics.map(topic => <span key={topic}>{topics.find(t => t.id === topic)?.title}</span>)}</div><div className={styles.detailBody}>{record.body}</div><div className={styles.provenance}><p className={styles.eyebrow}>Follow the evidence</p><a href={record.source.url}>{record.source.title} ↗</a>{record.source.locator && <p>Passage: {record.source.locator}</p>}<p>Record: {record.id}<br />Source revision: {record.source.revision} · Reviewed snapshot: {record.updatedAt}</p></div><h2 className={styles.relatedTitle}>Keep following the thread.</h2><div className={styles.resultGrid}>{relatedKnowledge(id, 4).map(related => <article key={related.id} className={styles.resultCard}><div className={styles.cardMeta}><span>{related.kind}</span><span>{record.relations.find(r => r.target === related.id)?.type || (related.relations.some(r => r.target === id) ? "linked evidence" : "shared theme")}</span></div><Link href={`/knowledge/${related.id}`}><h3>{related.title}</h3><p>{related.summary}</p><span className={styles.cardBottom}>Explore connection ↗</span></Link></article>)}</div></article></main><Footer /></>;
}
