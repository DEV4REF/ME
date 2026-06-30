'use client';

import {
  motion,
  useScroll,
  useTransform,
  type MotionValue,
} from 'framer-motion';
import { useRef, type ReactNode } from 'react';
import { isRTLText } from '@/lib/i18n';

interface AnimatedTextProps {
  /** Text to animate. Pass string or array of lines. */
  text: string | string[];
  className?: string;
  /** Per-character/word reveal window, in scroll-progress of the section. */
  start?: number;
  end?: number;
  /** Stagger so adjacent units don't all reveal at the exact same instant. */
  stagger?: number;
  /** Render as block paragraph (default) or inline. */
  as?: 'p' | 'h2' | 'h3' | 'span';
  /** Optional node to render instead of plain chars. */
  splitter?: (char: string, i: number) => ReactNode;
}

/**
 * AnimatedText — reveals characters (or words, for RTL text) one by one as the
 * user scrolls through the section. Persian/Arabic text is split by word
 * instead of by character, because splitting by character would break the
 * connected letter forms that define those scripts.
 */
export default function AnimatedText({
  text,
  className,
  start = 0.05,
  end = 0.7,
  stagger = 0.012,
  as = 'p',
}: AnimatedTextProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start 0.85', 'end 0.4'],
  });

  const lines = Array.isArray(text) ? text : [text];

  // Detect RTL — if any line contains Persian/Arabic characters, split by word.
  const allText = lines.join(' ');
  const splitByWord = isRTLText(allText);

  // Build a flat array of units (chars or words) per line.
  const unitsPerLine = lines.map((line) =>
    splitByWord ? line.split(/(\s+)/) : line.split('')
  );

  const totalUnits =
    unitsPerLine.reduce((acc, u) => acc + u.length, 0) || 1;
  const windowSize = Math.max(end - start - stagger * totalUnits, 0.001);
  const perUnit = windowSize / totalUnits;

  const Tag = motion[as] as typeof motion.p;

  return (
    <div ref={containerRef} className="relative">
      <Tag className={className} aria-label={lines.join(' ')}>
        {unitsPerLine.map((units, li) => (
          <span key={li} className="block" aria-hidden>
            {units.map((u, ui) => {
              // Global index across all lines.
              const globalIdx =
                unitsPerLine
                  .slice(0, li)
                  .reduce((acc, prev) => acc + prev.length, 0) + ui;
              const unitStart = start + globalIdx * perUnit;
              const unitEnd = Math.min(unitStart + perUnit + stagger, 1);

              // Preserve whitespace as-is (don't animate spaces).
              if (/^\s+$/.test(u)) {
                return <span key={`${li}-${ui}`}>{u}</span>;
              }

              return (
                <UnitSpan
                  key={`${li}-${ui}`}
                  progress={scrollYProgress}
                  from={unitStart}
                  to={unitEnd}
                  text={u}
                />
              );
            })}
          </span>
        ))}
      </Tag>
    </div>
  );
}

function UnitSpan({
  progress,
  from,
  to,
  text,
}: {
  progress: MotionValue<number>;
  from: number;
  to: number;
  text: string;
}) {
  const opacity = useTransform(progress, [from, to], [0.08, 1]);
  const y = useTransform(progress, [from, to], [6, 0]);

  return (
    <motion.span
      style={{ opacity, y }}
      className="inline-block will-change-transform"
    >
      {text === ' ' ? '\u00A0' : text}
    </motion.span>
  );
}
