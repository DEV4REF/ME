'use client';

import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import Magnet from './Magnet';
import { type ReactNode } from 'react';

interface CTAButtonProps {
  children: ReactNode;
  href?: string;
  onClick?: () => void;
  variant?: 'solid' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  /** Render with magnetic hover wrapper. */
  magnetic?: boolean;
  ariaLabel?: string;
}

const sizes = {
  sm: 'px-5 py-2 text-xs',
  md: 'px-7 py-3 text-sm',
  lg: 'px-9 py-4 text-sm',
};

/**
 * CTAButton — strong pill button with accent styling and magnetic hover.
 * Solid variant: cream background with ink text. Arrow lifts on hover.
 */
export default function CTAButton({
  children,
  href,
  onClick,
  variant = 'solid',
  size = 'md',
  className = '',
  magnetic = true,
  ariaLabel,
}: CTAButtonProps) {
  const base = `group relative inline-flex items-center gap-3 rounded-full font-satoshi uppercase tracking-[0.18em] font-medium transition-colors duration-700 ease-premium ${sizes[size]}`;

  const styles =
    variant === 'solid'
      ? 'bg-[#D7E2EA] text-[#0C0C0C] hover:bg-[#A89A82]'
      : 'border border-[rgba(215,226,234,0.25)] text-[#D7E2EA] hover:border-[#A89A82] hover:text-[#A89A82]';

  const content = (
    <>
      <span>{children}</span>
      <motion.span
        className="inline-flex items-center rtl:-scale-x-100"
        initial={false}
        whileHover={{ x: 2, y: -2 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      >
        <ArrowUpRight className="h-4 w-4" strokeWidth={1.6} />
      </motion.span>
    </>
  );

  const inner = href ? (
    <a
      href={href}
      aria-label={ariaLabel}
      className={`${base} ${styles} ${className}`}
    >
      {content}
    </a>
  ) : (
    <button
      onClick={onClick}
      aria-label={ariaLabel}
      className={`${base} ${styles} ${className}`}
    >
      {content}
    </button>
  );

  if (!magnetic) return inner;

  return (
    <Magnet as="div" strength={18} className="inline-block">
      {inner}
    </Magnet>
  );
}
