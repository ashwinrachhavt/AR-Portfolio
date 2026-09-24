import Link from "next/link";
import { notFound } from "next/navigation";
import { getProject, projects } from "@/data/projects.mjs";
import { ProjectPane } from "@/app/components/ProjectsSection";
import styles from "./project.module.css";

export function generateStaticParams() {
  return projects.map((project) => ({ id: project.id }));
}

export async function generateMetadata({ params }) {
  const { id } = await params;
  const project = getProject(id);
  if (!project) notFound();
  return { title: `${project.title} | Ashwin Rachha`, description: project.summary };
}

export default async function ProjectPage({ params }) {
  const { id } = await params;
  const project = getProject(id);
  if (!project) notFound();
  const nextProject = projects[(projects.indexOf(project) + 1) % projects.length];

  return (
    <main className={styles.page}>
      <nav className={styles.navigation} aria-label="Project navigation"><Link href="/#work">← Selected work</Link><Link href="/">Ashwin Rachha<span> / Portfolio</span></Link></nav>
      <p className={styles.eyebrow}>The systems behind the work</p>
      <ProjectPane key={project.id} project={project} standalone />
      <footer className={styles.footer}><p>Explore the work, the approach, and the public evidence.</p><Link href={nextProject.href}>Next: {nextProject.title} →</Link></footer>
    </main>
  );
}
