"use client";
import React from "react";
import { useSpring, animated } from "@react-spring/web";

const ScrollingText = () => {
  const styles = useSpring({
    from: { transform: "translateX(0%)" },
    to: { transform: "translateX(-50%)" },
    config: { duration: 10000, },
    loop: true
  });

  return (
    <div className=" whitespace-nowrap w-full bg-gray-800 text-white p-4 overflow-hidden">
      <animated.div
        style={styles}
        className="flex space-x-8 w-[200%] items-center justify-around"
      >
        {[...Array(2)].map((_, i) => (
          <div key={i} className="contents">
            <span className="text-xl font-bold">🔥 Smooth Scrolling</span>
            <span className="text-xl font-bold">🚀 Infinite Loop</span>
            <span className="text-xl font-bold">💡 React Spring</span>
          </div>
        ))}
      </animated.div>
    </div>
  );
};

export default ScrollingText;
