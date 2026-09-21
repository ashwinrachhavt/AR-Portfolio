"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import NavLink from "./NavLink";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/solid";
import MenuOverlay from "./MenuOverlay";

const navLinks = [
  { title: "About", path: "#about", type: "scroll" },
  { title: "Experience", path: "#experience", type: "scroll" },
  { title: "Projects", path: "#projects", type: "scroll" },
  { title: "Blog", path: "/blog", type: "route" },
  { title: "Contact", path: "#contact", type: "scroll" },
];

const Navbar = () => {
  const router = useRouter();
  const [navbarOpen, setNavbarOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("about");
  const [scrollProgress, setScrollProgress] = useState(0);
  const { scrollY } = useScroll();

  const smoothScrollTo = (targetId) => {
    const element = document.getElementById(targetId.replace("#", ""));
    if (!element) return;
    const navbar = document.querySelector("nav");
    const navbarHeight = navbar ? navbar.offsetHeight : 0;
    const targetPosition = element.offsetTop - navbarHeight - 20;
    window.scrollTo({ top: targetPosition, behavior: "smooth" });
  };

  useMotionValueEvent(scrollY, "change", (latest) => {
    const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = totalHeight > 0 ? latest / totalHeight : 0;
    setScrollProgress(Math.min(progress, 1));

    const sections = ["about", "experience", "projects", "contact"];
    const navbar = document.querySelector("nav");
    const navbarHeight = navbar ? navbar.offsetHeight : 0;

    for (const section of sections) {
      const element = document.getElementById(section);
      if (!element) continue;
      const rect = element.getBoundingClientRect();
      const elementTop = rect.top + window.pageYOffset;
      const elementBottom = elementTop + element.offsetHeight;
      if (
        latest >= elementTop - navbarHeight - 100 &&
        latest < elementBottom - navbarHeight - 100
      ) {
        setActiveSection(section);
        break;
      }
    }
  });

  const handleNavClick = (path, type) => {
    if (type === "route") {
      router.push(path);
    } else {
      smoothScrollTo(path);
    }
    setNavbarOpen(false);
  };

  return (
    <>
      <motion.div
        className="fixed left-0 right-0 top-0 z-50 h-1 origin-left bg-gradient-to-r from-primary-500 to-secondary-500"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: scrollProgress }}
        transition={{ duration: 0.1, ease: "easeOut" }}
      />

      <nav
        className="fixed left-0 right-0 top-0 z-40 mx-auto border border-border bg-background/95 backdrop-blur-md"
        style={{ marginTop: "4px" }}
      >
        <div className="container mx-auto flex flex-wrap items-center justify-between px-4 py-2 lg:py-4">
          <Link href="/" className="text-2xl font-semibold text-white md:text-5xl">
            AR
          </Link>
          <div className="mobile-menu block md:hidden">
            <button
              onClick={() => setNavbarOpen(!navbarOpen)}
              className="flex items-center rounded border border-muted-foreground px-3 py-2 text-muted-foreground hover:border-foreground hover:text-foreground"
            >
              {navbarOpen ? <XMarkIcon className="h-5 w-5" /> : <Bars3Icon className="h-5 w-5" />}
            </button>
          </div>
          <div className="menu hidden md:block md:w-auto" id="navbar">
            <ul className="mt-0 flex p-4 md:flex-row md:space-x-8 md:p-0">
              {navLinks.map((link, index) => {
                const sectionName = link.path.replace("#", "");
                const isActive = activeSection === sectionName;
                return (
                  <motion.li
                    key={link.title}
                    initial={{ opacity: 0, y: -12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05, duration: 0.2 }}
                  >
                    <div className="relative">
                      {link.type === "route" ? (
                        <Link
                          href={link.path}
                          className="block rounded py-2 pl-3 pr-4 text-xl text-[#ADB7BE] transition-colors duration-200 hover:text-white md:p-0"
                        >
                          {link.title}
                        </Link>
                      ) : (
                        <NavLink
                          href={link.path}
                          title={link.title}
                          onClick={(path) => handleNavClick(path, link.type)}
                        />
                      )}
                      {isActive && (
                        <motion.div
                          className="absolute -bottom-1 left-1/2 h-2 w-2 -translate-x-1/2 rounded-full bg-gradient-to-r from-primary-500 to-secondary-500"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: "spring", stiffness: 400, damping: 10 }}
                        />
                      )}
                    </div>
                  </motion.li>
                );
              })}
            </ul>
          </div>
        </div>
        {navbarOpen ? <MenuOverlay links={navLinks} onNavClick={handleNavClick} /> : null}
      </nav>
    </>
  );
};

export default Navbar;
