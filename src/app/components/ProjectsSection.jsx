"use client";
import React, { useState, useRef } from "react";
import ProjectCard from "./ProjectCard";
import ProjectTag from "./ProjectTag";
import { motion, useInView } from "framer-motion";
import { projectsData } from "@/data/profile";

const ProjectsSection = () => {
  const [tag, setTag] = useState("All");
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  const filteredProjects = projectsData.filter((project) => project.tag.includes(tag));

  return (
    <section id="projects">
      <h2 className="mb-8 mt-4 text-center text-4xl font-bold text-white md:mb-12">
        Selected Work
      </h2>
      <div className="flex flex-row items-center justify-center gap-2 py-6 text-white">
        {["All", "Web", "Agents"].map((name) => (
          <ProjectTag
            key={name}
            onClick={setTag}
            name={name}
            isSelected={tag === name}
          />
        ))}
      </div>
      <ul ref={ref} className="grid gap-8 md:grid-cols-3 md:gap-12">
        {filteredProjects.map((project, index) => (
          <motion.li
            key={project.id}
            initial={{ y: 24, opacity: 0 }}
            animate={isInView ? { y: 0, opacity: 1 } : { y: 24, opacity: 0 }}
            transition={{ duration: 0.25, delay: Math.min(index * 0.08, 0.4) }}
          >
            <ProjectCard
              title={project.title}
              description={project.description}
              imgUrl={project.image}
              gitUrl={project.gitUrl}
              previewUrl={project.previewUrl}
            />
          </motion.li>
        ))}
      </ul>
    </section>
  );
};

export default ProjectsSection;
