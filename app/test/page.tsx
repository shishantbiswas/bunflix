"use client";
// import {
//   useSpring,
//   animated,
//   useTransition,
//   useChain,
//   useSpringRef,
// } from "@react-spring/web";

// const ScrollingText = () => {
//   const styles = useSpring({
//     from: { transform: "translateX(0%)" },
//     to: { transform: "translateX(-50%)" },
//     config: { duration: 10000 },
//     loop: true,
//   });

//   return (
//     <>
//       <div className=" whitespace-nowrap w-full bg-gray-800 text-white p-4 overflow-hidden">
//         <animated.div
//           style={styles}
//           className="flex space-x-8 w-[200%] items-center justify-around"
//         >
//           {[...Array(2)].map((_, i) => (
//             <div key={i} className="contents">
//               <span className="text-xl font-bold">🔥 Smooth Scrolling</span>
//               <span className="text-xl font-bold">🚀 Infinite Loop</span>
//               <span className="text-xl font-bold">💡 React Spring</span>
//             </div>
//           ))}
//         </animated.div>
//       </div>
//       <MyComponent />
//     </>
//   );
// };

// export default ScrollingText;

// const data = ["hi", "there!", "some", "random"];

// function MyComponent() {
//   const springRef = useSpringRef();
//   const springs = useSpring({
//     ref: springRef,
//     from: {
//       y: 100,
//       scale: 0.85,
//     },
//     to: {
//       y: 0,
//       scale: 1,
//     },
//   });

//   const transRef = useSpringRef();
//   const transitions = useTransition(data, {
//     ref: transRef,
//     from: { y: 100, scale: 0.85 },
//     enter: { y: 0, scale: 1 },
//     leave: { y: 0, scale: 1 },
//   });

//   useChain([springRef, transRef]);

//   return (
//     <animated.div
//       style={{
//         ...springs,
//         background: "blue",
//       }}
//       className={"flex w-full"}
//     >
//       {transitions((style, item) => (
//         <animated.div
//           style={{
//             width: "120px",
//             height: "120px",
//             background: "green",
//             ...style,
//           }}
//         >
//           {item}
//         </animated.div>
//       ))}
//     </animated.div>
//   );
// }

"use client";

import * as React from "react";

const FancyImageLayout: React.FC = () => {
  return (
    <section className="flex justify-center items-center p-5 w-full h-screen">
      <div className="relative w-full max-w-[783px] h-[441px]">
        <img
          src="https://i.ytimg.com/vi/Yn54JENoQ6w/hqdefault.jpg?sqp=-oaymwEnCNACELwBSFryq4qpAxkIARUAAIhCGAHYAQHiAQoIGBACGAY4AUAB&rs=AOn4CLDQkJsuu0fwY1cV0ZhsWk13BrlR4g"
          alt="Decorative landscape"
          className="w-full h-full object-cover"
          style={{
            clipPath:
              "path('M0 20C0 8.95429 8.95431 0 20 0H763C774.046 0 783 8.9543 783 20V255C783 266.046 774.046 275 763 275H493C481.954 275 473 283.954 473 295V421C473 432.046 464.046 441 453 441H20C8.9543 441 0 432.046 0 421V20Z')",
            borderRadius: "20px",
          }}
        />
      </div>
    </section>
  );
};

export default FancyImageLayout;
