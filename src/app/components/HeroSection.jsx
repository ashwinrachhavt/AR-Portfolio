"use client";
import React from "react";
import Image from "next/image";
import { TypeAnimation } from "react-type-animation";
import { motion } from "framer-motion";
import Link from "next/link";

const HeroSection = () => {
  return (
    <section id="about" className="lg:py-16">
      <div className="grid grid-cols-1 sm:grid-cols-12">
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.35 }}
          className="col-span-8 place-self-center justify-self-start text-center sm:text-left"
        >
          <p className="mb-3 text-sm uppercase tracking-[0.22em] text-primary-400">
            Applied AI Engineer
          </p>
          <h1 className="mb-4 text-2xl font-extrabold leading-tight text-white sm:text-5xl lg:text-5xl lg:leading-normal">
            <span className="text-white">Hello,</span>
            <br />
            <span className="text-white">
              <TypeAnimation
                sequence={[
                  "I am Ashwin",
                  1800,
                  "I build agentic systems",
                  1400,
                  "I ship AI for fintech",
                  1400,
                  "I design fail-closed agents",
                  1400,
                  "Talk to my Eve agent",
                  2200,
                ]}
                wrapper="span"
                speed={50}
                repeat={Infinity}
              />
            </span>
          </h1>
          <p className="mb-6 max-w-2xl text-base text-[#ADB7BE] sm:text-lg lg:text-xl">
            Founding and applied AI engineer who builds production agentic
            systems, financial infrastructure, and product workflows end to end.
            Most recently built Lois at Loan Labs and Classify AI at Finally.
          </p>
          <div>
            <Link
              href="#agents"
              className="mr-4 inline-block w-full rounded-full bg-gradient-to-br from-primary-500 to-secondary-500 px-6 py-3 text-white hover:bg-slate-200 sm:w-fit"
            >
              Chat with Eve
            </Link>
            <Link
              href="/ashwin_rachha_resume.pdf"
              target="_blank"
              className="mt-3 inline-block w-full rounded-full bg-gradient-to-br from-primary-500 to-secondary-500 px-1 py-1 text-white hover:bg-slate-800 sm:w-fit"
            >
              <span className="block rounded-full bg-[#121212] px-5 py-2 hover:bg-slate-800">
                Download CV
              </span>
            </Link>
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.35 }}
          className="col-span-4 mt-4 place-self-center lg:mt-0"
        >
          <div className="relative h-[250px] w-[250px] rounded-full bg-[#181818] lg:h-[420px] lg:w-[420px]">
            <Image
              src="/images/Ashwin.png"
              alt="Ashwin Rachha"
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
              width={280}
              height={280}
              priority
              sizes="(max-width: 1024px) 250px, 420px"
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
