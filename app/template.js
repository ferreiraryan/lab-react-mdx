"use client";
import { LazyMotion, m } from "motion/react";

const loadFeatures = () => import("motion/react").then((res) => res.domMax);

export default function Template({ children }) {
  return (
    <LazyMotion features={loadFeatures}>
      <m.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 260, damping: 28 }}
      >
        {children}
      </m.div>
    </LazyMotion>
  );
}
