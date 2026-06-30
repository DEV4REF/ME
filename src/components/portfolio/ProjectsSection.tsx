'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Star,
  GitFork,
  Github,
  Globe,
  Loader2,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';
import FadeIn from '@/components/primitives/FadeIn';
import { useLang, formatNumber, toPersianDigits, type Lang } from '@/lib/i18n';
import { SOCIAL_LINKS, GITHUB_USERNAME } from '@/lib/translations';

interface Repo {
  id: number;
  name: string;
  fullName: string;
  description: string | null;
  htmlUrl: string;
  homepage: string | null;
  language: string | null;
  stars: number;
  forks: number;
  topics: string[];
  updatedAt: string;
  createdAt: string;
  visibility: string;
}

interface GitHubUser {
  login: string;
  name: string | null;
  avatarUrl: string;
  bio: string | null;
  publicRepos: number;
  followers: number;
  following: number;
  htmlUrl: string;
}

interface GitHubData {
  user: GitHubUser;
  repos: Repo[];
  totalStars: number;
  fetchedAt: string;
}

// Raw GitHub API response shapes (snake_case from the REST API).
interface RawRepo {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  homepage: string | null;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  topics: string[];
  updated_at: string;
  created_at: string;
  visibility: string;
  fork: boolean;
  archived: boolean;
}

interface RawUser {
  login: string;
  name: string | null;
  avatar_url: string;
  bio: string | null;
  public_repos: number;
  followers: number;
  following: number;
  html_url: string;
}

// Language color dots — matches GitHub's linguist colors.
const LANG_COLORS: Record<string, string> = {
  TypeScript: '#3178c6',
  JavaScript: '#f1e05a',
  Python: '#3572A5',
  Rust: '#dea584',
  Go: '#00ADD8',
  HTML: '#e34c26',
  CSS: '#563d7c',
  Shell: '#89e051',
  Dockerfile: '#384d54',
  Java: '#b07219',
  'C++': '#f34b7d',
  C: '#555555',
  'C#': '#178600',
  Ruby: '#701516',
  PHP: '#4F5D95',
  Swift: '#F05138',
  Kotlin: '#A97BFF',
  Dart: '#00B4AB',
  Vue: '#41b883',
  Svelte: '#ff3e00',
  Astro: '#ff5a03',
  Markdown: '#083fa1',
  Makefile: '#427819',
};

function langColor(lang: string | null): string {
  if (!lang) return '#A89A82';
  return LANG_COLORS[lang] ?? '#A89A82';
}

/** Format an ISO date as a relative time string in the current language. */
function formatRelativeTime(iso: string, lang: Lang): string {
  const diff = Date.now() - new Date(iso).getTime();
  const sec = Math.round(diff / 1000);
  const min = Math.round(sec / 60);
  const hr = Math.round(min / 60);
  const day = Math.round(hr / 24);
  const month = Math.round(day / 30);
  const year = Math.round(month / 12);

  const fa = lang === 'fa';

  let value: number;
  let unit: string;
  if (sec < 60) {
    return fa ? 'همین حالا' : 'just now';
  } else if (min < 60) {
    value = min;
    unit = fa ? 'دقیقه' : 'minute';
  } else if (hr < 24) {
    value = hr;
    unit = fa ? 'ساعت' : 'hour';
  } else if (day < 30) {
    value = day;
    unit = fa ? 'روز' : 'day';
  } else if (month < 12) {
    value = month;
    unit = fa ? 'ماه' : 'month';
  } else {
    value = year;
    unit = fa ? 'سال' : 'year';
  }

  const displayValue = fa ? toPersianDigits(value) : String(value);
  const plural = !fa && value !== 1 ? 's' : '';

  return fa
    ? `${displayValue} ${unit} پیش`
    : `${displayValue} ${unit}${plural} ago`;
}

export default function ProjectsSection() {
  const { t, lang } = useLang();
  const persian = lang === 'fa';
  const headingFont = persian ? 'font-persian font-black' : 'font-display';

  const [data, setData] = useState<GitHubData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;

    // Fetch directly from GitHub REST API (supports CORS, no server needed).
    // This works in fully static deployments (GitHub Pages, Netlify, etc.)
    const headers: Record<string, string> = {
      Accept: 'application/vnd.github+json',
    };
    // Optional: use a token from env for higher rate limits (60→5000/hr).
    // The token must be a public read-only token (fine-grained, public repos only).
    if (process.env.NEXT_PUBLIC_GITHUB_TOKEN) {
      headers.Authorization = `Bearer ${process.env.NEXT_PUBLIC_GITHUB_TOKEN}`;
    }

    Promise.all([
      fetch(`https://api.github.com/users/${GITHUB_USERNAME}`, { headers }).then((r) => {
        if (!r.ok) throw new Error('user fetch failed');
        return r.json() as Promise<RawUser>;
      }),
      fetch(
        `https://api.github.com/users/${GITHUB_USERNAME}/repos?per_page=100&sort=updated&type=owner`,
        { headers }
      ).then((r) => {
        if (!r.ok) throw new Error('repos fetch failed');
        return r.json() as Promise<RawRepo[]>;
      }),
    ])
      .then(([user, repos]) => {
        if (cancelled) return;

        const processedRepos = repos
          .filter((r) => !r.fork && !r.archived)
          .map((r) => ({
            id: r.id,
            name: r.name,
            fullName: r.full_name,
            description: r.description,
            htmlUrl: r.html_url,
            homepage: r.homepage && r.homepage.trim() !== '' ? r.homepage : null,
            language: r.language,
            stars: r.stargazers_count,
            forks: r.forks_count,
            topics: r.topics || [],
            updatedAt: r.updated_at,
            createdAt: r.created_at,
            visibility: r.visibility,
          }))
          .sort((a, b) => {
            if (b.stars !== a.stars) return b.stars - a.stars;
            return (
              new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
            );
          });

        const totalStars = processedRepos.reduce((sum, r) => sum + r.stars, 0);

        setData({
          user: {
            login: user.login,
            name: user.name,
            avatarUrl: user.avatar_url,
            bio: user.bio,
            publicRepos: user.public_repos,
            followers: user.followers,
            following: user.following,
            htmlUrl: user.html_url,
          },
          repos: processedRepos,
          totalStars,
          fetchedAt: new Date().toISOString(),
        });
        setLoading(false);
      })
      .catch(() => {
        if (cancelled) return;
        setError(true);
        setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const stats = data
    ? [
        { label: t('projects.repos'), value: data.user.publicRepos },
        { label: t('projects.totalStars'), value: data.totalStars },
        { label: t('projects.followers'), value: data.user.followers },
      ]
    : [];

  return (
    <section
      id="projects"
      className="relative bg-[#0C0C0C] py-24 sm:py-32 md:py-40"
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-8 md:px-12 lg:px-16">
        {/* Header */}
        <div className="mb-12 flex flex-col gap-6 sm:mb-16 md:flex-row md:items-end md:justify-between">
          <div>
            <FadeIn direction="up" duration={0.9}>
              <span
                className={`text-[10px] uppercase tracking-[0.32em] text-[#A89A82] ${
                  persian ? 'font-persian tracking-[0.1em]' : 'font-satoshi'
                }`}
              >
                {t('projects.label')}
              </span>
            </FadeIn>
            <FadeIn direction="up" duration={1.1} delay={0.1}>
              <h2
                className={`mt-4 ${headingFont} text-[18vw] uppercase leading-[0.85] text-[#D7E2EA] sm:text-[13vw] md:text-[9vw] lg:text-[8vw]`}
                style={{ letterSpacing: persian ? '0' : '-0.02em' }}
              >
                {t('projects.heading')}
              </h2>
            </FadeIn>
          </div>
          <FadeIn direction="up" duration={0.9} delay={0.2}>
            <p
              className={`max-w-xs text-sm font-light leading-relaxed text-[rgba(215,226,234,0.6)] ${
                persian ? 'font-persian' : 'font-satoshi'
              }`}
            >
              {t('projects.sub')}
            </p>
          </FadeIn>
        </div>

        {/* Live indicator + GitHub profile bar */}
        {data?.user && (
          <FadeIn direction="up" duration={0.9}>
            <div className="mb-10 flex flex-wrap items-center gap-5 rounded-2xl border border-[rgba(215,226,234,0.12)] bg-[rgba(215,226,234,0.02)] p-5 sm:p-6">
              {/* Avatar */}
              <img
                src={data.user.avatarUrl}
                alt={data.user.login}
                className="h-14 w-14 rounded-full border border-[rgba(215,226,234,0.2)] object-cover"
              />

              {/* Name + live badge */}
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-3">
                  <span
                    className={`text-xl text-[#D7E2EA] ${
                      persian ? 'font-persian font-bold' : 'font-display'
                    }`}
                    dir="ltr"
                  >
                    @{data.user.login}
                  </span>
                  <span className="inline-flex items-center gap-2 rounded-full border border-[rgba(168,154,130,0.3)] px-2.5 py-1">
                    <span className="relative flex h-1.5 w-1.5">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#A89A82] opacity-75" />
                      <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[#A89A82]" />
                    </span>
                    <span
                      className={`text-[9px] uppercase tracking-[0.25em] text-[#A89A82] ${
                        persian ? 'font-persian tracking-[0.05em]' : 'font-satoshi'
                      }`}
                    >
                      {t('projects.live')}
                    </span>
                  </span>
                </div>
                {data.user.bio && (
                  <span
                    className={`text-xs text-[rgba(215,226,234,0.55)] ${
                      persian ? 'font-persian' : 'font-satoshi'
                    }`}
                  >
                    {data.user.bio}
                  </span>
                )}
              </div>

              {/* Stats */}
              <div className="ms-auto flex gap-6 sm:gap-10">
                {stats.map((s) => (
                  <div key={s.label} className="flex flex-col items-end gap-1">
                    <span
                      className={`text-2xl text-[#D7E2EA] ${
                        persian ? 'font-persian font-bold' : 'font-display'
                      }`}
                      dir="ltr"
                    >
                      {formatNumber(s.value, lang)}
                    </span>
                    <span
                      className={`text-[9px] uppercase tracking-[0.22em] text-[rgba(215,226,234,0.45)] ${
                        persian ? 'font-persian tracking-[0.05em]' : 'font-satoshi'
                      }`}
                    >
                      {s.label}
                    </span>
                  </div>
                ))}
              </div>

              {/* Visit GitHub */}
              <a
                href={SOCIAL_LINKS.github}
                target="_blank"
                rel="noreferrer"
                className={`group inline-flex items-center gap-2 rounded-full border border-[rgba(215,226,234,0.2)] px-4 py-2 text-[10px] uppercase tracking-[0.25em] text-[#D7E2EA] transition-colors duration-500 hover:border-[#A89A82] hover:text-[#A89A82] ${
                  persian ? 'font-persian tracking-[0.05em]' : 'font-satoshi'
                }`}
              >
                <Github className="h-3.5 w-3.5" strokeWidth={1.5} />
                GitHub
                <ExternalLink className="h-3 w-3 opacity-50 transition-opacity duration-500 group-hover:opacity-100 rtl:-scale-x-100" strokeWidth={1.5} />
              </a>
            </div>
          </FadeIn>
        )}

        {/* Loading state */}
        {loading && <LoadingState persian={persian} t={t} />}

        {/* Error state */}
        {error && !loading && <ErrorState persian={persian} t={t} />}

        {/* Repos grid */}
        {!loading && !error && data && data.repos.length > 0 && (
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            {data.repos.slice(0, 8).map((repo, i) => (
              <RepoCard
                key={repo.id}
                repo={repo}
                index={i}
                t={t}
                persian={persian}
                lang={lang}
              />
            ))}
          </div>
        )}

        {/* Empty state */}
        {!loading && !error && data && data.repos.length === 0 && (
          <div
            className={`rounded-2xl border border-[rgba(215,226,234,0.1)] py-20 text-center text-sm text-[rgba(215,226,234,0.5)] ${
              persian ? 'font-persian' : 'font-satoshi'
            }`}
          >
            {t('projects.empty')}
          </div>
        )}
      </div>
    </section>
  );
}

function LoadingState({
  persian,
  t,
}: {
  persian: boolean;
  t: (k: string) => string;
}) {
  return (
    <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
      {[0, 1, 2, 3].map((i) => (
        <div
          key={i}
          className="animate-pulse rounded-2xl border border-[rgba(215,226,234,0.08)] bg-[rgba(215,226,234,0.02)] p-7"
        >
          <div className="mb-4 h-6 w-2/3 rounded bg-[rgba(215,226,234,0.08)]" />
          <div className="mb-2 h-3 w-full rounded bg-[rgba(215,226,234,0.06)]" />
          <div className="mb-7 h-3 w-4/5 rounded bg-[rgba(215,226,234,0.06)]" />
          <div className="flex gap-3">
            <div className="h-5 w-16 rounded-full bg-[rgba(215,226,234,0.06)]" />
            <div className="h-5 w-16 rounded-full bg-[rgba(215,226,234,0.06)]" />
          </div>
        </div>
      ))}
      <div className="col-span-full flex items-center justify-center gap-3 py-6">
        <Loader2 className="h-4 w-4 animate-spin text-[#A89A82]" strokeWidth={1.5} />
        <span
          className={`text-[11px] uppercase tracking-[0.25em] text-[rgba(215,226,234,0.5)] ${
            persian ? 'font-persian tracking-[0.05em]' : 'font-satoshi'
          }`}
        >
          {t('projects.loading')}
        </span>
      </div>
    </div>
  );
}

function ErrorState({
  persian,
  t,
}: {
  persian: boolean;
  t: (k: string) => string;
}) {
  return (
    <div className="rounded-2xl border border-[rgba(215,226,234,0.1)] py-16 text-center">
      <AlertCircle
        className="mx-auto mb-4 h-8 w-8 text-[#A89A82]"
        strokeWidth={1.5}
      />
      <p
        className={`mb-6 text-sm text-[rgba(215,226,234,0.6)] ${
          persian ? 'font-persian' : 'font-satoshi'
        }`}
      >
        {t('projects.error')}
      </p>
      <a
        href={SOCIAL_LINKS.github}
        target="_blank"
        rel="noreferrer"
        className={`inline-flex items-center gap-2 rounded-full bg-[#D7E2EA] px-5 py-2.5 text-[10px] uppercase tracking-[0.22em] text-[#0C0C0C] transition-colors duration-500 hover:bg-[#A89A82] ${
          persian ? 'font-persian tracking-[0.05em]' : 'font-satoshi'
        }`}
      >
        <Github className="h-3.5 w-3.5" strokeWidth={1.5} />
        <span dir="ltr">github.com/{GITHUB_USERNAME}</span>
      </a>
    </div>
  );
}

function RepoCard({
  repo,
  index,
  t,
  persian,
  lang,
}: {
  repo: Repo;
  index: number;
  t: (k: string) => string;
  persian: boolean;
  lang: Lang;
}) {
  const titleFont = persian ? 'font-persian font-bold' : 'font-display';
  const name = repo.name.replace(/[-_]/g, ' ');

  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{
        duration: 0.8,
        delay: index * 0.06,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-[rgba(215,226,234,0.12)] bg-[rgba(215,226,234,0.02)] p-6 transition-colors duration-500 hover:border-[#A89A82]/40 sm:p-7"
    >
      {/* Top: repo number + visibility */}
      <div className="mb-4 flex items-center justify-between">
        <span
          className={`text-[10px] uppercase tracking-[0.3em] text-[rgba(215,226,234,0.35)] ${
            persian ? 'font-persian tracking-[0.1em]' : 'font-satoshi'
          }`}
        >
          {persian ? toPersianDigits(String(index + 1).padStart(2, '0')) : String(index + 1).padStart(2, '0')}
        </span>
        <span
          className={`text-[9px] uppercase tracking-[0.25em] text-[rgba(215,226,234,0.35)] ${
            persian ? 'font-persian tracking-[0.05em]' : 'font-satoshi'
          }`}
        >
          {repo.visibility}
        </span>
      </div>

      {/* Repo name — always LTR since repo names are English */}
      <h3
        className={`${titleFont} text-3xl uppercase leading-none text-[#D7E2EA] transition-colors duration-500 group-hover:text-[#A89A82] sm:text-4xl`}
        style={{ letterSpacing: persian ? '0' : '-0.01em' }}
        dir="ltr"
      >
        {name}
      </h3>

      {/* Description */}
      <p
        className={`mt-4 min-h-[3rem] text-sm font-light leading-relaxed text-[rgba(215,226,234,0.6)] ${
          persian ? 'font-persian' : 'font-satoshi'
        }`}
      >
        {repo.description || (persian ? 'بدون توضیحات' : 'No description')}
      </p>

      {/* Topics */}
      {repo.topics.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-1.5">
          {repo.topics.slice(0, 4).map((topic) => (
            <span
              key={topic}
              className="rounded-full border border-[rgba(215,226,234,0.1)] px-2.5 py-1 font-satoshi text-[9px] uppercase tracking-[0.18em] text-[rgba(215,226,234,0.5)]"
              dir="ltr"
            >
              {topic}
            </span>
          ))}
        </div>
      )}

      {/* Footer: stats + updated time */}
      <div className="mt-auto pt-6">
        <div className="flex items-center gap-5 border-t border-[rgba(215,226,234,0.08)] pt-4">
          {/* Language — English name, always LTR */}
          {repo.language && (
            <div className="flex items-center gap-1.5" dir="ltr">
              <span
                className="h-2.5 w-2.5 rounded-full"
                style={{ backgroundColor: langColor(repo.language) }}
              />
              <span
                className={`text-[10px] uppercase tracking-[0.15em] text-[rgba(215,226,234,0.5)] font-satoshi`}
              >
                {repo.language}
              </span>
            </div>
          )}

          {/* Stars — number is LTR */}
          <div className="flex items-center gap-1.5" dir="ltr">
            <Star className="h-3.5 w-3.5 text-[#A89A82]" strokeWidth={1.5} />
            <span
              className={`text-[10px] tracking-[0.1em] text-[rgba(215,226,234,0.5)] font-satoshi`}
            >
              {formatNumber(repo.stars, lang)}
            </span>
          </div>

          {/* Forks — number is LTR */}
          <div className="flex items-center gap-1.5" dir="ltr">
            <GitFork className="h-3.5 w-3.5 text-[rgba(215,226,234,0.4)]" strokeWidth={1.5} />
            <span
              className={`text-[10px] tracking-[0.1em] text-[rgba(215,226,234,0.5)] font-satoshi`}
            >
              {formatNumber(repo.forks, lang)}
            </span>
          </div>

          {/* Updated time */}
          <span
            className={`ms-auto text-[9px] uppercase tracking-[0.15em] text-[rgba(215,226,234,0.35)] ${
              persian ? 'font-persian tracking-[0.05em]' : 'font-satoshi'
            }`}
          >
            {formatRelativeTime(repo.updatedAt, lang)}
          </span>
        </div>

        {/* CTAs */}
        <div className="mt-4 flex items-center gap-3">
          <a
            href={repo.htmlUrl}
            target="_blank"
            rel="noreferrer"
            className={`group/btn inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.25em] text-[#D7E2EA] transition-colors duration-500 hover:text-[#A89A82] ${
              persian ? 'font-persian tracking-[0.05em]' : 'font-satoshi'
            }`}
          >
            <Github className="h-3.5 w-3.5" strokeWidth={1.5} />
            {t('projects.viewOnGithub')}
            <ExternalLink className="h-3 w-3 opacity-50 transition-opacity duration-500 group-hover/btn:opacity-100 rtl:-scale-x-100" strokeWidth={1.5} />
          </a>
          {repo.homepage && (
            <a
              href={repo.homepage}
              target="_blank"
              rel="noreferrer"
              className={`inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.25em] text-[#A89A82] transition-opacity duration-500 hover:opacity-70 ${
                persian ? 'font-persian tracking-[0.05em]' : 'font-satoshi'
              }`}
            >
              <Globe className="h-3.5 w-3.5" strokeWidth={1.5} />
              {t('projects.viewLive')}
            </a>
          )}
        </div>
      </div>
    </motion.article>
  );
}
