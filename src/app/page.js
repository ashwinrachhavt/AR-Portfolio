import Link from "next/link";
import HeroSection from "./components/HeroSection";
import Navbar from "./components/Navbar";
import CapabilityCards from "./components/CapabilityCards";
import ExperienceSection from "./components/ExperienceSection";
import ProjectsSection from "./components/ProjectsSection";
import EmailSection from "./components/EmailSection";
import Footer from "./components/Footer";
import styles from "./home.module.css";

export default function Home() {
  return (
    <>
      <a className={styles.skipLink} href="#main">
        Skip to content
      </a>
      <Navbar />
      <main id="main" className={styles.main}>
        {/* 1. Profile Intro (Hero) */}
        <HeroSection />

        {/* 2. Professional Experience */}
        <ExperienceSection />

        {/* 3. Featured Projects */}
        <ProjectsSection />

        {/* 4. How I Think & Build */}
        <CapabilityCards />

        {/* 5. Contact ("Let's work together") */}
        <EmailSection />
      </main>
      <Footer />
    </>
  );
}
