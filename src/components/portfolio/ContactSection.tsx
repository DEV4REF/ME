'use client';

import { motion } from 'framer-motion';
import { Mail, Github, Linkedin, Twitter, Send, ArrowUpRight } from 'lucide-react';
import FadeIn from '@/components/primitives/FadeIn';
import CTAButton from '@/components/primitives/CTAButton';
import Magnet from '@/components/primitives/Magnet';
import { useLang } from '@/lib/i18n';
import { SOCIAL_LINKS } from '@/lib/translations';

const SOCIALS = [
  {
    labelKey: 'contact.social.telegram',
    href: SOCIAL_LINKS.telegram,
    handle: SOCIAL_LINKS.telegramHandle,
    icon: Send,
    external: true,
  },
  {
    labelKey: 'contact.social.github',
    href: SOCIAL_LINKS.github,
    handle: SOCIAL_LINKS.githubHandle,
    icon: Github,
    external: true,
  },
  {
    labelKey: 'contact.social.linkedin',
    href: SOCIAL_LINKS.linkedin,
    handle: SOCIAL_LINKS.linkedinHandle,
    icon: Linkedin,
    external: true,
  },
  {
    labelKey: 'contact.social.twitter',
    href: SOCIAL_LINKS.twitter,
    handle: SOCIAL_LINKS.twitterHandle,
    icon: Twitter,
    external: true,
  },
  {
    labelKey: 'contact.social.email',
    href: SOCIAL_LINKS.email,
    handle: SOCIAL_LINKS.emailHandle,
    icon: Mail,
    external: false,
  },
];

export default function ContactSection() {
  const { t, lang } = useLang();
  const persian = lang === 'fa';
  const headingFont = persian ? 'font-persian font-black' : 'font-display';

  return (
    <section
      id="contact"
      className="relative bg-[#0C0C0C] py-24 sm:py-32 md:py-40"
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-8 md:px-12 lg:px-16">
        {/* Header */}
        <div className="mb-12 sm:mb-16">
          <FadeIn direction="up" duration={0.9}>
            <span
              className={`text-[10px] uppercase tracking-[0.32em] text-[#A89A82] ${
                persian ? 'font-persian tracking-[0.1em]' : 'font-satoshi'
              }`}
            >
              {t('contact.label')}
            </span>
          </FadeIn>
        </div>

        {/* Massive CTA copy */}
        <FadeIn direction="up" duration={1.2}>
          <h2
            className={`${headingFont} text-[12vw] uppercase leading-[0.9] text-[#D7E2EA] sm:text-[10vw] md:text-[8vw] lg:text-[7.5vw]`}
            style={{
              letterSpacing: persian ? '0' : '-0.03em',
              direction: persian ? 'rtl' : 'ltr',
            }}
          >
            {t('contact.heading1')}
            <br />
            <span className="text-[#A89A82]">{t('contact.heading2')}</span>{' '}
            {t('contact.heading3')}
          </h2>
        </FadeIn>

        {/* Sub copy + main CTA */}
        <div className="mt-12 grid grid-cols-1 gap-10 border-t border-[rgba(215,226,234,0.12)] pt-10 md:grid-cols-2 md:gap-16">
          <FadeIn direction="up" duration={1} delay={0.1}>
            <p
              className={`max-w-md text-sm font-light leading-relaxed text-[rgba(215,226,234,0.65)] sm:text-base ${
                persian ? 'font-persian' : 'font-satoshi'
              }`}
            >
              {t('contact.body')}
            </p>
          </FadeIn>

          <FadeIn direction="up" duration={1} delay={0.2} className="flex items-start md:justify-end">
            <Magnet as="div" strength={22} className="inline-block">
              <CTAButton href={SOCIAL_LINKS.email} size="lg" magnetic={false}>
                <span className={persian ? 'font-persian' : ''}>
                  {t('contact.cta')}
                </span>
              </CTAButton>
            </Magnet>
          </FadeIn>
        </div>

        {/* Socials grid */}
        <FadeIn direction="up" duration={1} delay={0.1} className="mt-20 sm:mt-24">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5">
            {SOCIALS.map((s, i) => {
              const Icon = s.icon;
              return (
                <motion.a
                  key={s.labelKey}
                  href={s.href}
                  target={s.external ? '_blank' : undefined}
                  rel={s.external ? 'noreferrer' : undefined}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.5 }}
                  transition={{
                    duration: 0.7,
                    delay: i * 0.08,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className="group flex items-center justify-between gap-4 border-b border-[rgba(215,226,234,0.1)] py-6 pe-2 transition-colors duration-500 hover:border-[#A89A82]/40"
                >
                  <div className="flex items-center gap-4">
                    <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[rgba(215,226,234,0.15)] text-[#D7E2EA] transition-all duration-500 group-hover:border-[#A89A82] group-hover:text-[#A89A82]">
                      <Icon className="h-4 w-4" strokeWidth={1.5} />
                    </span>
                    <div className="flex flex-col gap-0.5">
                      <span
                        className={`text-[10px] uppercase tracking-[0.28em] text-[rgba(215,226,234,0.4)] ${
                          persian ? 'font-persian tracking-[0.05em]' : 'font-satoshi'
                        }`}
                      >
                        {t(s.labelKey)}
                      </span>
                      <span
                        className={`text-sm text-[#D7E2EA] ${
                          persian ? 'font-persian' : 'font-satoshi'
                        }`}
                        dir="ltr"
                        style={persian ? { textAlign: 'right' } : undefined}
                      >
                        {s.handle}
                      </span>
                    </div>
                  </div>
                  <ArrowUpRight
                    className="h-4 w-4 shrink-0 text-[rgba(215,226,234,0.4)] transition-all duration-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-[#A89A82] rtl:-scale-x-100"
                    strokeWidth={1.5}
                  />
                </motion.a>
              );
            })}
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
