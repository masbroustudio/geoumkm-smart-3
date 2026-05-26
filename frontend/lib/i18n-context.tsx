'use client';

import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { TranslationKeys } from './translations/types';
import { id } from './translations/id';
import { en } from './translations/en';

export type Locale = 'id' | 'en';

const translations: Record<Locale, TranslationKeys> = { id, en };

interface LanguageContextType {
  locale: Locale;
  toggle: () => void;
  t: TranslationKeys;
}

const LanguageContext = createContext<LanguageContextType>({
  locale: 'id',
  toggle: () => {},
  t: id,
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocale] = useState<Locale>('id');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('locale') as Locale | null;
    const initial = stored === 'en' ? 'en' : 'id';
    setLocale(initial);
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      document.documentElement.lang = locale;
    }
  }, [locale, mounted]);

  const toggle = useCallback(() => {
    setLocale((prev) => {
      const next = prev === 'id' ? 'en' : 'id';
      localStorage.setItem('locale', next);
      return next;
    });
  }, []);

  if (!mounted) {
    return <>{children}</>;
  }

  return (
    <LanguageContext.Provider value={{ locale, toggle, t: translations[locale] }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
