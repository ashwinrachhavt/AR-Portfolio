import Link from "next/link";
import HeroSection from "./components/HeroSection";
import Navbar from "./components/Navbar";
import CapabilityCards from "./components/CapabilityCards";
import ExperienceSection from "./components/ExperienceSection";
import ProjectsSection from "./components/ProjectsSection";
import EmailSection from "./components/EmailSection";
import Footer from "./components/Footer";
import styles from "./home.module.css";
import NewsletterInvite from "./components/NewsletterInvite";
import { newsletterSubscription } from "../lib/writing-sources.mjs";

export default function Home() {
  return (
    <>
      <a className={styles.skipLink} href="#main">
        Skip to content
      </a>
      <Navbar />
      <main id="main" className={styles.main}>
        {/* Hero Section (Profile Intro) */}
        <HeroSection />

        {/* Professional Experience */}
        <ExperienceSection />

        {/* Selected Work Grid with Detailed Modal & Ordered Deep Dives */}
        <ProjectsSection />

        {/* How I Think & Build */}
        <CapabilityCards />

        <NewsletterInvite newsletter={newsletterSubscription()} />
        <EmailSection />
      </main>
      <Footer />
    </>
  );
}
