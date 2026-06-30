'use client';

import { motion, type Variants } from 'framer-motion';
import { type ReactNode } from 'react';

type Direction = 'up' | 'down' | 'left' | 'right' | 'none';

interface FadeInProps {
  children: ReactNode;
  delay?: number;
  duration?: number;
  direction?: Direction;
  distance?: number;
  once?: boolean;
  amount?: number;
  className?: string;
  ease?: number[] | string;
}

const EASE_PREMIUM = [0.22, 1, 0.36, 1] as const;

export default function FadeIn({
  children,
  delay = 0,
  duration = 0.9,
  direction = 'up',
  distance = 40,
  once = true,
  amount = 0.3,
  className,
  ease = EASE_PREMIUM,
}: FadeInProps) {
  const offset = { x: 0, y: 0 };
  if (direction === 'up') offset.y = distance;
  if (direction === 'down') offset.y = -distance;
  if (direction === 'left') offset.x = distance;
  if (direction === 'right') offset.x = -distance;

  const variants: Variants = {
    hidden: { opacity: 0, x: offset.x, y: offset.y },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      transition: {
        duration,
        delay,
        ease,
      },
    },
  };

  return (
    <motion.div
      className={className}
      variants={variants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, amount }}
    >
      {children}
    </motion.div>
  );
}
