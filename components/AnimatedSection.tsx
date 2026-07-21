"use client";

import { motion } from "framer-motion";
import type { CSSProperties } from "react";

export function AnimatedSection({
  children,
  className = "",
  id,
  style
}: {
  children: React.ReactNode;
  className?: string;
  id?: string;
  style?: CSSProperties;
}) {
  return (
    <motion.section
      className={className}
      id={id}
      style={style}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.section>
  );
}
