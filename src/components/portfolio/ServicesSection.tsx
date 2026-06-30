'use client';

import { motion } from 'framer-motion';
import { Cpu, Workflow, PenTool, TrendingUp, Compass } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import FadeIn from '@/components/primitives/FadeIn';
import { useLang, toPersianDigits } from '@/lib/i18n';

interface Service {
  num: string;
  titleKey: string;
  descKey: string;
  icon: LucideIcon;
}

const SERVICES: Service[] = [
  { num: '01', titleKey: 'services.01.title', descKey: 'services.01.desc', icon: Cpu },
  { num: '02', titleKey: 'services.02.title', descKey: 'services.02.desc', icon: Workflow },
  { num: '03', titleKey: 'services.03.title', descKey: 'services.03.desc', icon: PenTool },
  { num: '04', titleKey: 'services.04.title', descKey: 'services.04.desc', icon: TrendingUp },
  { num: '05', titleKey: 'services.05.title', descKey: 'services.05.desc', icon: Compass },
];

export default function ServicesSection() {
  const { t, lang } = useLang();
  const persian = lang === 'fa';
  const headingFont = persian ? 'font-persian font-black' : 'font-display';

  return (
    <section
      id="services"
      className="relative bg-[#0C0C0C] py-24 sm:py-32 md:py-40"
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-8 md:px-12 lg:px-16">
        {/* Header */}
        <div className="mb-14 flex flex-col gap-6 sm:mb-20 md:flex-row md:items-end md:justify-between">
          <div>
            <FadeIn direction="up" duration={0.9}>
              <span
                className={`text-[10px] uppercase tracking-[0.32em] text-[#A89A82] ${
                  persian ? 'font-persian tracking-[0.1em]' : 'font-satoshi'
                }`}
              >
                {t('services.label')}
              </span>
            </FadeIn>
            <FadeIn direction="up" duration={1.1} delay={0.1}>
              <h2
                className={`mt-4 ${headingFont} text-[18vw] uppercase leading-[0.85] text-[#D7E2EA] sm:text-[13vw] md:text-[9vw] lg:text-[8vw]`}
                style={{ letterSpacing: persian ? '0' : '-0.02em' }}
              >
                {t('services.heading')}
              </h2>
            </FadeIn>
          </div>
          <FadeIn direction="up" duration={0.9} delay={0.2}>
            <p
              className={`max-w-xs text-sm font-light leading-relaxed text-[rgba(215,226,234,0.6)] ${
                persian ? 'font-persian' : 'font-satoshi'
              }`}
            >
              {t('services.sub')}
            </p>
          </FadeIn>
        </div>

        {/* Service list */}
        <ul className="divide-y divide-[rgba(215,226,234,0.1)] border-t border-[rgba(215,226,234,0.1)]">
          {SERVICES.map((s, i) => (
            <ServiceRow
              key={s.num}
              service={s}
              index={i}
              t={t}
              persian={persian}
              headingFont={headingFont}
            />
          ))}
        </ul>
      </div>
    </section>
  );
}

function ServiceRow({
  service,
  index,
  t,
  persian,
  headingFont,
}: {
  service: Service;
  index: number;
  t: (k: string) => string;
  persian: boolean;
  headingFont: string;
}) {
  const Icon = service.icon;
  const num = persian ? toPersianDigits(service.num) : service.num;

  return (
    <motion.li
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{
        duration: 0.9,
        delay: index * 0.08,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="group relative"
    >
      <a
        href="#contact"
        className="grid grid-cols-12 items-baseline gap-4 py-8 transition-colors duration-500 sm:gap-8 sm:py-12"
      >
        {/* Number */}
        <div className="col-span-2 sm:col-span-1">
          <span
            className={`text-[10px] uppercase tracking-[0.3em] text-[rgba(215,226,234,0.4)] transition-colors duration-500 group-hover:text-[#A89A82] ${
              persian ? 'font-persian tracking-[0.1em]' : 'font-satoshi'
            }`}
            dir="ltr"
          >
            {num}
          </span>
        </div>

        {/* Title + icon */}
        <div className="col-span-10 flex items-center gap-4 sm:col-span-5">
          <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[rgba(215,226,234,0.15)] text-[#D7E2EA] transition-all duration-500 group-hover:border-[#A89A82] group-hover:text-[#A89A82]">
            <Icon className="h-4 w-4" strokeWidth={1.5} />
          </span>
          <h3
            className={`${headingFont} text-4xl uppercase leading-none text-[#D7E2EA] transition-colors duration-500 group-hover:text-[#A89A82] sm:text-5xl md:text-6xl`}
            style={{ letterSpacing: persian ? '0' : '-0.01em' }}
          >
            {t(service.titleKey)}
          </h3>
        </div>

        {/* Description */}
        <div className="col-span-12 sm:col-span-6">
          <p
            className={`text-sm font-light leading-relaxed text-[rgba(215,226,234,0.6)] sm:text-base ${
              persian ? 'font-persian' : 'font-satoshi'
            }`}
          >
            {t(service.descKey)}
          </p>
        </div>

        {/* Hover indicator bar */}
        <motion.span
          aria-hidden
          className="absolute bottom-0 left-0 h-px w-0 bg-[#A89A82]"
          whileHover={{ width: '100%' }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        />
      </a>
    </motion.li>
  );
}
