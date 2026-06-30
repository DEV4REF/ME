'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { useLang, toPersianDigits } from '@/lib/i18n';

interface MarqueeItem {
  label: string;
  meta: string;
}

export default function MarqueeSection() {
  const { t, lang } = useLang();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  const persian = lang === 'fa';

  const topRow: MarqueeItem[] = [
    { label: 'React 19', meta: t('marquee.ui') },
    { label: 'TypeScript', meta: t('marquee.lang') },
    { label: 'Next.js', meta: t('marquee.frame') },
    { label: 'Node', meta: t('marquee.run') },
    { label: 'PostgreSQL', meta: t('marquee.data') },
    { label: 'Tailwind', meta: t('marquee.style') },
    { label: 'Framer Motion', meta: t('marquee.motion') },
    { label: 'Vite', meta: t('marquee.buildTool') },
    { label: 'Bun', meta: t('marquee.run') },
    { label: 'Prisma', meta: t('marquee.orm') },
  ];

  const bottomRow: MarqueeItem[] = [
    { label: t('marquee.automation'), meta: '01' },
    { label: t('marquee.systems'), meta: '02' },
    { label: t('marquee.architecture'), meta: '03' },
    { label: t('marquee.ai'), meta: '04' },
    { label: t('marquee.tooling'), meta: '05' },
    { label: t('marquee.dx'), meta: '06' },
    { label: t('marquee.performance'), meta: '07' },
    { label: t('marquee.design'), meta: '08' },
    { label: t('marquee.apis'), meta: '09' },
    { label: t('marquee.oss'), meta: '10' },
  ];

  return (
    <section
      ref={ref}
      aria-label="Technology marquee"
      className="relative bg-[#0C0C0C] py-20 sm:py-28 md:py-32"
    >
      <div className="mb-12 flex items-center justify-between px-5 sm:px-8 md:px-12 lg:px-16">
        <span
          className={`text-[10px] uppercase tracking-[0.32em] text-[rgba(215,226,234,0.4)] ${
            persian ? 'font-persian tracking-[0.1em]' : 'font-satoshi'
          }`}
        >
          {t('marquee.label')}
        </span>
        <span
          className={`text-[10px] uppercase tracking-[0.32em] text-[rgba(215,226,234,0.4)] ${
            persian ? 'font-persian tracking-[0.1em]' : 'font-satoshi'
          }`}
        >
          {t('marquee.sub')}
        </span>
      </div>

      <div className="flex flex-col gap-3 sm:gap-5">
        <MarqueeRow
          items={topRow}
          scrollYProgress={scrollYProgress}
          persian={persian}
        />
        <MarqueeRow
          items={bottomRow}
          scrollYProgress={scrollYProgress}
          reverse
          persian={persian}
          convertMetaDigits
        />
      </div>
    </section>
  );
}

function MarqueeRow({
  items,
  scrollYProgress,
  reverse,
  persian,
  convertMetaDigits,
}: {
  items: MarqueeItem[];
  scrollYProgress: ReturnType<typeof useScroll>['scrollYProgress'];
  reverse?: boolean;
  persian?: boolean;
  convertMetaDigits?: boolean;
}) {
  // Triple the content for seamless looping. The first set fills the viewport,
  // the second set provides the "incoming" items as we scroll, and the third
  // set ensures there's never a gap at the end of the scroll range.
  const tripled = [...items, ...items, ...items];

  // Shift by -33.333% (exactly one set width) across the full scroll range.
  // Because the content is tripled, shifting by one set width creates a
  // seamless loop. The reverse row goes the opposite direction.
  const x = useTransform(
    scrollYProgress,
    [0, 1],
    reverse ? ['-33.333%', '0%'] : ['0%', '-33.333%']
  );

  return (
    <div
      className="relative overflow-hidden mask-x"
      dir="ltr"
    >
      {/*
        Force LTR on BOTH the container and the UL so items always lay out
        left-to-right regardless of the page's dir. In RTL mode, a wider-than-
        container child aligns to the RIGHT edge, which would push all items
        off-screen to the left. The marquee is a visual element, not prose,
        so LTR layout is correct here.
      */}
      <motion.ul
        style={{ x }}
        dir="ltr"
        className="flex w-max items-center gap-3 sm:gap-5 will-change-transform"
      >
        {tripled.map((item, i) => {
          const meta =
            convertMetaDigits && persian
              ? toPersianDigits(item.meta)
              : item.meta;
          return (
            <li
              key={`${item.label}-${i}`}
              className="group flex shrink-0 items-center gap-4 rounded-2xl border border-[rgba(215,226,234,0.12)] px-6 py-4 transition-colors duration-500 hover:border-[#A89A82]/60 sm:px-8 sm:py-5"
            >
              <span
                className={`text-[10px] uppercase tracking-[0.3em] ${
                  reverse
                    ? 'text-[#A89A82]'
                    : 'text-[rgba(215,226,234,0.4)]'
                } ${persian ? 'font-persian tracking-[0.1em]' : 'font-satoshi'}`}
              >
                {meta}
              </span>
              <span className="h-4 w-px bg-[rgba(215,226,234,0.15)]" />
              <span
                className={`text-2xl uppercase leading-none text-[#D7E2EA] transition-colors duration-500 group-hover:text-[#A89A82] sm:text-3xl ${
                  persian ? 'font-persian font-bold' : 'font-display'
                }`}
              >
                {item.label}
              </span>
            </li>
          );
        })}
      </motion.ul>
    </div>
  );
}
