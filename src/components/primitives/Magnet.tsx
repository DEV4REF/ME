'use client';

import { motion, useMotionValue, useSpring } from 'framer-motion';
import {
  useRef,
  type ReactNode,
  type MouseEvent,
} from 'react';

interface MagnetProps {
  children: ReactNode;
  /** How strongly the element follows the cursor, in px. */
  strength?: number;
  /** Spring stiffness for the return-to-center motion. */
  stiffness?: number;
  /** Spring damping. */
  damping?: number;
  className?: string;
  /** Disable on small/touch screens. */
  disabledOnTouch?: boolean;
  as?: 'div' | 'button' | 'a' | 'span';
  href?: string;
  onClick?: () => void;
  ariaLabel?: string;
}

/**
 * Magnet — wraps any element and applies a magnetic cursor-follow effect.
 * Returns to center with a smooth spring when the pointer leaves.
 */
export default function Magnet({
  children,
  strength = 24,
  stiffness = 180,
  damping = 14,
  className,
  disabledOnTouch = true,
  as = 'div',
  href,
  onClick,
  ariaLabel,
}: MagnetProps) {
  const ref = useRef<HTMLElement>(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springX = useSpring(x, { stiffness, damping, mass: 0.4 });
  const springY = useSpring(y, { stiffness, damping, mass: 0.4 });

  const handleMove = (e: MouseEvent<HTMLElement>) => {
    if (!ref.current) return;
    if (disabledOnTouch && window.matchMedia('(pointer: coarse)').matches) return;

    const rect = ref.current.getBoundingClientRect();
    const relX = e.clientX - (rect.left + rect.width / 2);
    const relY = e.clientY - (rect.top + rect.height / 2);

    // Normalize by half-size so strength scales with element size.
    const maxDistX = rect.width / 2 || 1;
    const maxDistY = rect.height / 2 || 1;
    const tx = (relX / maxDistX) * strength;
    const ty = (relY / maxDistY) * strength;

    x.set(tx);
    y.set(ty);
  };

  const handleLeave = () => {
    x.set(0);
    y.set(0);
  };

  const MotionTag = motion[as] as typeof motion.div;

  return (
    <MotionTag
      ref={ref as never}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      style={{ x: springX, y: springY }}
      className={className}
      href={href}
      onClick={onClick}
      aria-label={ariaLabel}
    >
      {children}
    </MotionTag>
  );
}
