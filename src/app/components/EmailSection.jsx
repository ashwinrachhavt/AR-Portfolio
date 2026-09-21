import React from "react";
import GithubIcon from "../../../public/github-icon.svg";
import LinkedinIcon from "../../../public/linkedin-icon.svg";
import MediumIcon from "../../../public/images/mediumblog.png";
import Link from "next/link";
import Image from "next/image";

const EmailSection = () => {
  return (
    <section
      id="contact"
      className="relative my-12 grid gap-4 py-24 md:grid-cols-2"
    >
      <div className="absolute left-0 top-3/4 z-0 h-80 w-80 -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary-900 to-transparent blur-lg"></div>
      <div className="z-10">
        <h5 className="my-2 text-xl font-bold text-white">Let&apos;s Connect</h5>
        <p className="mb-4 max-w-md text-[#ADB7BE]">
          I am looking for founding and applied AI roles across AI-native
          products, fintech, healthtech, and edtech in Los Angeles, San
          Francisco, San Jose, and San Diego. H-1B transfer required; anticipated
          H-1B transition begins October 1, 2026.
        </p>
        <div className="socials flex flex-row gap-2">
          <Link href="https://github.com/AshwinRachha">
            <Image src={GithubIcon} alt="Github Icon" />
          </Link>
          <Link href="https://www.linkedin.com/in/ashwinrachha/">
            <Image src={LinkedinIcon} alt="Linkedin Icon" />
          </Link>
          <Link href="https://medium.com/@ashwin_rachha">
            <Image src={MediumIcon} alt="Medium Icon" width={50} height={50} />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default EmailSection;
