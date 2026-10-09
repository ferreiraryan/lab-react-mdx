"use client";
import { LazyMotion, m, useReducedMotion } from "motion/react";

const loadFeatures = () => import("motion/react").then((res) => res.domMax);

export default function Template({ children }) {
  const shouldReduce = useReducedMotion();

  return (
    <LazyMotion features={loadFeatures}>
      <m.div
        initial={shouldReduce ? false : { opacity: 0, y: 16 }}
        animate={shouldReduce ? false : { opacity: 1, y: 0 }}
        transition={shouldReduce ? { duration: 0 } : { type: "spring", stiffness: 260, damping: 28 }}
      >
        {children}
      </m.div>
    </LazyMotion>
  );
}
