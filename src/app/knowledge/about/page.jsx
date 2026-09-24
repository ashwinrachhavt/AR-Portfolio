import Link from "next/link";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import home from "../../home.module.css";
import styles from "../knowledge.module.css";

export const metadata = { title: "About the assistant’s sources — Ashwin Rachha" };
export default function AboutKnowledge() {
  return <><Navbar /><main className={home.main}><article className={`${styles.detail} ${styles.about}`}>
    <Link href="/#assistant-question">← Back to the assistant</Link>
    <h1>A reading trail, not a black box.</h1>
    <p>The assistant draws from my approved work experience, projects, published essays, and selected reading notes. It’s a curated collection, not a copy of my private workspace.</p>
    <h2>Follow the source.</h2>
    <p>Every passage links to a source note with its original reference and review date. Reading notes credit their authors. Career facts keep their context: pilot work is labeled, approximate measurements stay approximate, and team outcomes aren’t presented as individual accomplishments.</p>
    <h2>Two ways to explore.</h2>
    <p>Source search finds existing passages. It does not generate an answer, and each question is searched independently. Optional meaning search looks beyond exact words using a free model that downloads from Hugging Face and runs in your browser. Your questions stay on your device.</p>
    <p>When running locally with Eve enabled, the assistant can read those same sources and write a conversational answer. This mode uses a model on the host computer and labels itself “Local AI.” It can make mistakes, so follow the citations. The public website uses source search without a paid inference service.</p>
    <h2>Know what’s missing.</h2>
    <p>This collection has boundaries. A related passage is a starting point, not proof that it answers your question. If the evidence isn’t here, try a more specific question or reach out to me.</p>
    <Link href="/blog">Explore the writing ↗</Link>
  </article></main><Footer /></>;
}
