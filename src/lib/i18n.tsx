'use client';

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from 'react';
import { translations, type Lang } from './translations';

interface LangContextValue {
  lang: Lang;
  setLang: (l: Lang) => void;
  toggle: () => void;
  t: (key: string, vars?: Record<string, string | number>) => string;
  dir: 'ltr' | 'rtl';
}

const LangContext = createContext<LangContextValue | null>(null);

const PERSIAN_DIGITS = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];

/** Convert Latin digits in a string to Persian digits. */
export function toPersianDigits(str: string | number): string {
  return String(str).replace(/[0-9]/g, (d) => PERSIAN_DIGITS[parseInt(d, 10)]);
}

/** Format a number with thousands separators, optionally in Persian digits. */
export function formatNumber(n: number, lang: Lang): string {
  const str = n.toLocaleString('en-US');
  return lang === 'fa' ? toPersianDigits(str) : str;
}

/** Detect whether a string contains RTL (Persian/Arabic) characters. */
export function isRTLText(text: string): boolean {
  return /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/.test(
    text
  );
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>('en');

  // Restore from localStorage on mount. This is a legitimate "sync with an
  // external system" pattern — reading persisted user preference from the
  // browser's storage. The cascading-render concern doesn't apply here because
  // this only runs once on mount.
  useEffect(() => {
    try {
      const stored = localStorage.getItem('aaref-lang') as Lang | null;
      if (stored === 'en' || stored === 'fa') {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setLangState(stored);
      }
    } catch {
      /* ignore */
    }
  }, []);

  // Persist + apply dir/lang attributes to <html>.
  useEffect(() => {
    try {
      localStorage.setItem('aaref-lang', lang);
    } catch {
      /* ignore */
    }
    if (typeof document !== 'undefined') {
      document.documentElement.dir = lang === 'fa' ? 'rtl' : 'ltr';
      document.documentElement.lang = lang;
    }
  }, [lang]);

  const setLang = useCallback((l: Lang) => setLangState(l), []);
  const toggle = useCallback(
    () => setLangState((prev) => (prev === 'en' ? 'fa' : 'en')),
    []
  );

  const t = useCallback(
    (key: string, vars?: Record<string, string | number>) => {
      const table = translations[lang] as Record<string, string>;
      const fallback = translations.en as Record<string, string>;
      let str = table[key] ?? fallback[key] ?? key;
      if (vars) {
        for (const [k, v] of Object.entries(vars)) {
          str = str.replace(`{${k}}`, String(v));
        }
      }
      return str;
    },
    [lang]
  );

  return (
    <LangContext.Provider
      value={{ lang, setLang, toggle, t, dir: lang === 'fa' ? 'rtl' : 'ltr' }}
    >
      {children}
    </LangContext.Provider>
  );
}

export function useLang(): LangContextValue {
  const ctx = useContext(LangContext);
  if (!ctx) {
    throw new Error('useLang must be used within LanguageProvider');
  }
  return ctx;
}
