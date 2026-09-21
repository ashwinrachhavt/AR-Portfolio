"use client";
import React from "react";
import dynamic from "next/dynamic";

const AnimatedNumbers = dynamic(() => import("react-animated-numbers"), {
  ssr: false,
});

const achievementsList = [
  {
    metric: "Daily transactions",
    value: "50000",
    postfix: "+",
  },
  {
    metric: "Manual categorization cut",
    value: "80",
    postfix: "%",
  },
  {
    metric: "Credit underwritten",
    prefix: "$",
    value: "3",
    postfix: "M+",
  },
  {
    metric: "Close time, months to weeks",
    value: "2",
  },
];

const AchievementsSection = () => {
  return (
    <div className="px-4 py-8 sm:py-16 xl:gap-16 xl:px-16">
      <div className="flex flex-col items-center justify-between rounded-md py-8 sm:flex-row sm:border sm:border-[#33353F] sm:px-16">
        {achievementsList.map((achievement, index) => {
          return (
            <div
              key={index}
              className="mx-4 my-4 flex flex-col items-center justify-center sm:my-0"
            >
              <h2 className="flex flex-row text-4xl font-bold text-white">
                {achievement.prefix}
                <AnimatedNumbers
                  useThousandsSeparator
                  animateToNumber={parseInt(achievement.value, 10)}
                  locale="en-US"
                  className="text-4xl font-bold text-white"
                  transitions={(itemIndex) => ({
                    type: "spring",
                    duration: 0.8 + itemIndex * 0.05,
                  })}
                />
                {achievement.postfix}
              </h2>
              <p className="text-base text-[#ADB7BE]">{achievement.metric}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AchievementsSection;
