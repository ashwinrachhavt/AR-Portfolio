import React from "react";
import { motion } from "framer-motion";
import { enter } from "../../lib/motion.ts";

// Scale rather than width: the bar keeps its full size and grows from the left,
// so the tab switch only ever touches transform. Same visual result, no layout.
const variants = {
  default: { scaleX: 0 },
  active: { scaleX: 1 },
};

const TabButton = ({ active, selectTab, children }) => {
  const buttonClasses = active ? "text-white" : "text-[#ADB7BE]";

  return (
    <button onClick={selectTab}>
      <p className={`mr-3 font-semibold hover:text-white ${buttonClasses}`}>
        {children}
      </p>
      <motion.div
        animate={active ? "active" : "default"}
        variants={variants}
        transition={enter()}
        style={{ transformOrigin: "left" }}
        className="h-1 bg-primary-500 mt-2 mr-3"
      ></motion.div>
    </button>
  );
};

export default TabButton;
