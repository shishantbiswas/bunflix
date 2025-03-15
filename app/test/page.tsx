"use client";
import {
  useSpring,
  animated,
  useTransition,
  useChain,
  useSpringRef,
} from "@react-spring/web";

const ScrollingText = () => {
  const styles = useSpring({
    from: { transform: "translateX(0%)" },
    to: { transform: "translateX(-50%)" },
    config: { duration: 10000 },
    loop: true,
  });

  return (
    <>
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
      <MyComponent />
    </>
  );
};

export default ScrollingText;

const data = ["hi", "there!", "some", "random"];

function MyComponent() {
  const springRef = useSpringRef();
  const springs = useSpring({
    ref: springRef,
    from: {
      y: 100,
      scale: 0.85,
    },
    to: {
      y: 0,
      scale: 1,
    },
  });

  const transRef = useSpringRef();
  const transitions = useTransition(data, {
    ref: transRef,
    from: { y: 100, scale: 0.85 },
    enter: { y: 0, scale: 1 },
    leave: { y: 0, scale: 1 },
  });

  useChain([springRef, transRef]);

  return (
    <animated.div
      style={{
        ...springs,
        background: "blue",
      }}
      className={"flex w-full"}
    >
      {transitions((style, item) => (
        <animated.div
          style={{
            width: "120px",
            height: "120px",
            background: "green",
            ...style,
          }}
        >
          {item}
        </animated.div>
      ))}
    </animated.div>
  );
}
