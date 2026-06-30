'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { ArrowDown } from 'lucide-react';
import Navbar from './Navbar';
import CTAButton from '@/components/primitives/CTAButton';
import Magnet from '@/components/primitives/Magnet';
import { useLang } from '@/lib/i18n';

export default function HeroSection() {
  const { t, lang } = useLang();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  });

  const headingY = useTransform(scrollYProgress, [0, 1], [0, -120]);
  const watermarkY = useTransform(scrollYProgress, [0, 1], [0, 80]);
  const overlayOpacity = useTransform(scrollYProgress, [0, 0.8], [0, 1]);
  const subtitleOpacity = useTransform(scrollYProgress, [0, 0.4], [1, 0]);

  const heading = t('hero.heading');
  const eyebrow = t('hero.eyebrow');
  const subtitle = t('hero.subtitle');
  const ctaLabel = t('hero.cta');
  const scrollLabel = t('hero.scroll');

  const persianHeading = lang === 'fa';

  return (
    <section
      ref={ref}
      id="top"
      className="relative h-screen w-full overflow-x-clip bg-[#0C0C0C] bg-grid"
    >
      <Navbar />

      {/* Watermark */}
      <motion.div
        style={{ y: watermarkY }}
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0 flex items-center justify-center"
      >
        <span
          className="select-none whitespace-nowrap font-display uppercase leading-none text-[#D7E2EA] opacity-[0.03]"
          style={{ fontSize: '22vw', letterSpacing: '-0.04em' }}
          dir="ltr"
        >
          Aaref&nbsp;|&nbsp;عارف
        </span>
      </motion.div>

      {/* Vignette */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          background:
            'radial-gradient(ellipse at center, transparent 40%, rgba(12,12,12,0.85) 100%)',
        }}
      />

      {/* Main content */}
      <div className="relative z-10 flex h-full flex-col items-center justify-center px-5 text-center">
        {/* Eyebrow */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="mb-6 inline-flex items-center gap-3"
        >
          <span className="h-px w-10 bg-[rgba(215,226,234,0.3)]" />
          <span
            className={`text-[10px] uppercase tracking-[0.4em] text-[rgba(215,226,234,0.6)] sm:text-[11px] ${
              persianHeading ? 'font-persian tracking-[0.1em]' : 'font-satoshi'
            }`}
          >
            {eyebrow}
          </span>
          <span className="h-px w-10 bg-[rgba(215,226,234,0.3)]" />
        </motion.div>

        {/* Heading */}
        <motion.h1
          style={{ y: headingY }}
          initial={{ opacity: 0, scale: 1.04 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.4, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className={`font-display font-black uppercase leading-none text-[#D7E2EA] ${
            persianHeading ? 'font-persian' : ''
          }`}
        >
          <span
            className="block"
            style={{
              fontSize: '15vw',
              letterSpacing: persianHeading ? '0' : '-0.04em',
            }}
          >
            <span className="sm:hidden">{heading}</span>
            <span className="hidden sm:block sm:text-[16vw] md:text-[17vw] lg:text-[18vw]">
              {heading}
            </span>
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          style={{ opacity: subtitleOpacity, maxWidth: persianHeading ? '34rem' : undefined }}
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className={`mt-8 max-w-xl text-sm font-light leading-relaxed text-[rgba(215,226,234,0.7)] sm:text-base ${
            persianHeading ? 'font-persian' : 'font-satoshi'
          }`}
        >
          {subtitle}
        </motion.p>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1.15, ease: [0.22, 1, 0.36, 1] }}
          className="mt-10"
        >
          <Magnet as="div" strength={26} className="inline-block">
            <CTAButton href="#projects" size="lg" magnetic={false}>
              <span className={persianHeading ? 'font-persian' : ''}>
                {ctaLabel}
              </span>
            </CTAButton>
          </Magnet>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.5 }}
        className="absolute bottom-7 left-1/2 z-10 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
          className="flex flex-col items-center gap-2"
        >
          <span
            className={`text-[9px] uppercase tracking-[0.32em] text-[rgba(215,226,234,0.45)] ${
              persianHeading ? 'font-persian tracking-[0.1em]' : 'font-satoshi'
            }`}
          >
            {scrollLabel}
          </span>
          <ArrowDown className="h-3.5 w-3.5 text-[#A89A82]" strokeWidth={1.5} />
        </motion.div>
      </motion.div>

      {/* Fade-out overlay */}
      <motion.div
        style={{ opacity: overlayOpacity }}
        aria-hidden
        className="pointer-events-none absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#0C0C0C] to-transparent"
      />
    </section>
  );
}
