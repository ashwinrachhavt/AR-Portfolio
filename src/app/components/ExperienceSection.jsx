"use client";
import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import ExperienceCard from "./experience/ExperienceCard";
import experienceData from "./experience/experienceData";
import "./experience/TimelineStyles.css";

const ExperienceSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="experience" className="py-16">
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 32 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 32 }}
        transition={{ duration: 0.4 }}
        className="container mx-auto px-4"
      >
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-4xl font-bold text-white">
            Professional Experience
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-[#ADB7BE]">
            Production agentic systems, financial infrastructure, and
            high-trust product workflows from Loan Labs to Finally.
          </p>
        </div>

        <div className="relative mx-auto max-w-6xl">
          <div className="absolute left-1/2 hidden h-full w-1 -translate-x-1/2 bg-gradient-to-b from-primary-500 to-secondary-500 opacity-30 md:block"></div>
          <div className="space-y-12 md:space-y-20">
            {experienceData.map((experience, index) => (
              <div key={experience.id} className="relative">
                <div className="absolute left-4 top-6 md:hidden">
                  <div className="h-4 w-4 rounded-full border-4 border-[#121212] bg-gradient-to-r from-primary-500 to-secondary-500"></div>
                </div>
                <div className="ml-12 md:ml-0">
                  <ExperienceCard experience={experience} index={index} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default ExperienceSection;
