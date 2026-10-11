"use client";
import React from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { enter, settled } from "../../lib/motion.ts";
import NavLink from "./NavLink";

const MenuOverlay = ({ links, onNavClick }) => {
  const reduceMotion = useReducedMotion();
  const containerVariants = {
    // No y offset here: the exit variant is the same object, so a menu that slides
    // in from above would slide back up on close and read as a second gesture.
    hidden: reduceMotion ? settled : { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.3, staggerChildren: 0.06 } }
  };

  const itemVariants = {
    // Every row animates opacity only. A per-item x offset makes the list arrive
    // left to right while the panel behind it is still arriving top down.
    hidden: reduceMotion ? settled : { opacity: 0 },
    visible: { opacity: 1, transition: enter() }
  };

  return (
    <motion.ul 
      className="flex flex-col py-4 items-center"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="hidden"
    >
      {links.map((link, index) => (
        <motion.li 
          key={index}
          variants={itemVariants}
          className="mb-2"
        >
          {link.type === "route" ? (
            <Link 
              href={link.path}
              className="block py-2 pl-3 pr-4 text-[#ADB7BE] text-xl rounded md:p-0 hover:text-white transition-colors duration-200"
              onClick={() => onNavClick && onNavClick(link.path, link.type)}
            >
              {link.title}
            </Link>
          ) : (
            <NavLink 
              href={link.path} 
              title={link.title}
              onClick={(path) => onNavClick && onNavClick(path, link.type)}
            />
          )}
        </motion.li>
      ))}
    </motion.ul>
  );
};

export default MenuOverlay;
