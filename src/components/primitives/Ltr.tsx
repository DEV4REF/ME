'use client';

import { type ReactNode, type CSSProperties } from 'react';

/**
 * Ltr — wraps content that should always render left-to-right, regardless of
 * the page's `dir`. Used inside RTL (Persian) layouts for English text like
 * tech names, email addresses, GitHub handles, and numbers, so they display
 * correctly instead of being mirrored or awkwardly repositioned by the
 * bidirectional algorithm.
 *
 * Uses Unicode bidirectional isolation (`dir="ltr"` + `unicode-bidi: isolate`)
 * which is the W3C-recommended approach for inline LTR runs inside RTL text.
 */
export function Ltr({
  children,
  className = '',
  as: Tag = 'span',
  style,
}: {
  children: ReactNode;
  className?: string;
  as?: 'span' | 'div' | 'li' | 'a';
  style?: CSSProperties;
}) {
  const Component = Tag as 'span';
  return (
    <Component
      dir="ltr"
      className={className}
      style={{ unicodeBidi: 'isolate', ...style }}
    >
      {children}
    </Component>
  );
}
