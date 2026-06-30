'use client';

import { motion, useScroll } from 'framer-motion';
import { useRef } from 'react';
import AnimatedText from '@/components/primitives/AnimatedText';
import FadeIn from '@/components/primitives/FadeIn';
import { useLang } from '@/lib/i18n';

export default function AboutSection() {
  const { t, lang } = useLang();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  const persian = lang === 'fa';
  const headingFont = persian ? 'font-persian font-black' : 'font-display';

  const stats = [
    { value: t('about.stat1.value'), label: t('about.stat1.label') },
    { value: t('about.stat2.value'), label: t('about.stat2.label') },
    { value: t('about.stat3.value'), label: t('about.stat3.label') },
  ];

  return (
    <section
      ref={ref}
      id="about"
      className="relative bg-[#0C0C0C] py-24 sm:py-32 md:py-40"
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-8 md:px-12 lg:px-16">
        {/* Section header */}
        <div className="mb-14 flex items-end justify-between gap-6 sm:mb-20">
          <FadeIn direction="up" duration={0.9}>
            <span
              className={`text-[10px] uppercase tracking-[0.32em] text-[#A89A82] ${
                persian ? 'font-persian tracking-[0.1em]' : 'font-satoshi'
              }`}
            >
              {t('about.label')}
            </span>
          </FadeIn>
          <FadeIn direction="up" duration={0.9} delay={0.1}>
            <span
              className={`hidden text-[10px] uppercase tracking-[0.32em] text-[rgba(215,226,234,0.4)] sm:block ${
                persian ? 'font-persian tracking-[0.1em]' : 'font-satoshi'
              }`}
            >
              {t('about.sub')}
            </span>
          </FadeIn>
        </div>

        <div className="grid grid-cols-1 gap-12 md:grid-cols-12 md:gap-8">
          {/* Heading */}
          <div className="md:col-span-4">
            <FadeIn direction="up" duration={1.1}>
              <h2
                className={`${headingFont} text-[20vw] uppercase leading-[0.85] text-[#D7E2EA] sm:text-[14vw] md:text-[10vw] lg:text-[8vw]`}
                style={{ letterSpacing: persian ? '0' : '-0.02em' }}
              >
                {t('about.heading')}
              </h2>
            </FadeIn>

            <FadeIn direction="up" duration={0.9} delay={0.2} className="mt-8 hidden md:block">
              <div className="flex flex-col gap-4 border-t border-[rgba(215,226,234,0.12)] pt-6">
                {stats.map((s) => (
                  <div key={s.label} className="flex items-baseline justify-between">
                    <span
                      className={`text-[10px] uppercase tracking-[0.28em] text-[rgba(215,226,234,0.5)] ${
                        persian ? 'font-persian tracking-[0.05em]' : 'font-satoshi'
                      }`}
                    >
                      {s.label}
                    </span>
                    <span
                      className={`text-3xl text-[#D7E2EA] ${
                        persian ? 'font-persian font-bold' : 'font-display'
                      }`}
                      dir="ltr"
                    >
                      {s.value}
                    </span>
                  </div>
                ))}
              </div>
            </FadeIn>
          </div>

          {/* Body — character/word scroll reveal */}
          <div className="md:col-span-8">
            <AnimatedText
              text={t('about.text')}
              as="p"
              start={0.04}
              end={0.85}
              className={`font-light leading-[1.4] tracking-[-0.01em] text-[#D7E2EA] ${
                persian
                  ? 'font-persian text-[5.5vw] sm:text-[3vw] md:text-[2.2vw] lg:text-[1.9vw]'
                  : 'font-satoshi text-[6.5vw] sm:text-[3.4vw] md:text-[2.4vw] lg:text-[2vw]'
              }`}
            />

            <FadeIn direction="up" duration={1} delay={0.1} className="mt-12 md:hidden">
              <div className="grid grid-cols-3 gap-4 border-t border-[rgba(215,226,234,0.12)] pt-6">
                {stats.map((s) => (
                  <div key={s.label} className="flex flex-col gap-1">
                    <span
                      className={`text-2xl text-[#D7E2EA] ${
                        persian ? 'font-persian font-bold' : 'font-display'
                      }`}
                      dir="ltr"
                    >
                      {s.value}
                    </span>
                    <span
                      className={`text-[9px] uppercase tracking-[0.22em] text-[rgba(215,226,234,0.5)] ${
                        persian ? 'font-persian tracking-[0.05em]' : 'font-satoshi'
                      }`}
                    >
                      {s.label}
                    </span>
                  </div>
                ))}
              </div>
            </FadeIn>

            <FadeIn direction="up" duration={1} delay={0.15} className="mt-12 md:mt-16">
              <div className="flex flex-wrap items-center gap-4 border-t border-[rgba(215,226,234,0.12)] pt-6">
                <span
                  className={`text-[10px] uppercase tracking-[0.28em] text-[rgba(215,226,234,0.4)] ${
                    persian ? 'font-persian tracking-[0.05em]' : 'font-satoshi'
                  }`}
                >
                  {t('about.currently.label')}
                </span>
                <span
                  className={`text-sm text-[#D7E2EA] ${
                    persian ? 'font-persian' : 'font-satoshi'
                  }`}
                >
                  {t('about.currently.value')}
                </span>
              </div>
            </FadeIn>
          </div>
        </div>
      </div>

      <motion.div
        style={{ scaleX: scrollYProgress }}
        className="absolute bottom-0 left-0 right-0 h-px origin-left bg-[#A89A82]/40"
        aria-hidden
      />
    </section>
  );
}
