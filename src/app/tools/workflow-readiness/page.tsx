import type { Metadata } from "next";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import home from "@/app/home.module.css";
import WorkflowLab from "./WorkflowLab";
import styles from "./workflow.module.css";
import { jevConnection } from "@/lib/jev";

export const metadata: Metadata = {
  title: "AI Workflow Readiness Lab | Ashwin Rachha",
  description: "Turn an ambiguous AI workflow into a practical brief: system boundaries, human review, evaluation, and a first experiment.",
};

export default function WorkflowReadinessPage() {
  const connection = jevConnection(process.env);
  const live = process.env.WORKFLOW_LAB_LIVE_ENABLED === "true" && Boolean(connection);
  return <>
    <a className={home.skipLink} href="#main">Skip to content</a>
    <Navbar activeSection="tools" />
    <main id="main" className={`${home.main} ${styles.main}`}>
      <header className={styles.hero}>
        <h1>AI Workflow<br /><span>Readiness Lab.</span></h1>
        <div><p>Turn an ambiguous AI workflow into a system you can evaluate, build, and operate.</p><p className={styles.heroNote}>A useful first brief. A clearer next step.</p></div>
      </header>
      <WorkflowLab live={live} provider={connection?.provider} />
    </main>
    <Footer topId="main" />
  </>;
}
