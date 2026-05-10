"use client";

import { motion, useReducedMotion } from "motion/react";

type Direction = "up" | "left" | "right" | "none";

interface RevealOnScrollProps {
  children: React.ReactNode;
  direction?: Direction;
  delay?: number;
  duration?: number;
  amount?: number;
  once?: boolean;
  className?: string;
  id?: string;
}

const offsets: Record<Direction, { x: number; y: number }> = {
  up: { x: 0, y: 32 },
  left: { x: 32, y: 0 },
  right: { x: -32, y: 0 },
  none: { x: 0, y: 0 },
};

/**
 * Fades & translates children into view when scrolled into the viewport.
 * Honours `prefers-reduced-motion` — when reduced, renders immediately
 * with no motion.
 */
export function RevealOnScroll({
  children,
  direction = "up",
  delay = 0,
  duration = 0.8,
  amount = 0.2,
  once = true,
  className,
  id,
}: RevealOnScrollProps) {
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) {
    return (
      <div className={className} id={id}>
        {children}
      </div>
    );
  }

  const { x, y } = offsets[direction];

  return (
    <motion.div
      className={className}
      id={id}
      initial={{ opacity: 0, x, y }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once, amount }}
      transition={{ duration, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
