import HeroSection from "./components/HeroSection";
import Navbar from "./components/Navbar";
import ExperienceSection from "./components/ExperienceSection";
import ProjectsSection from "./components/ProjectsSection";
import EmailSection from "./components/EmailSection";
import Footer from "./components/Footer";
import AchievementsSection from "./components/AchievementsSection";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col bg-background text-foreground">
      <Navbar />
      <div className="container mx-auto mt-24 px-12 py-4">
        <HeroSection className="mb-8" />
        <AchievementsSection className="mb-8" />
        <ExperienceSection className="mb-8" />
        <ProjectsSection className="mb-8" />
        <EmailSection className="mb-8" />
      </div>
      <Footer />
    </main>
  );
}
