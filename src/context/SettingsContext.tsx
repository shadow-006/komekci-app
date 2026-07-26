import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { useColorScheme } from 'react-native';
import { storage } from '../storage/storage';
import { darkColors, lightColors, ThemeColors } from '../theme';
import { Language, translations, TranslationDict } from '../i18n/translations';

export type ThemeMode = 'light' | 'dark' | 'system';

type SettingsContextValue = {
  ready: boolean;
  language: Language;
  setLanguage: (lang: Language) => void;
  themeMode: ThemeMode;
  setThemeMode: (mode: ThemeMode) => void;
  isDark: boolean;
  colors: ThemeColors;
  t: TranslationDict;
};

const SettingsContext = createContext<SettingsContextValue | null>(null);

const LANGUAGE_KEY = '@assistant/language';
const THEME_MODE_KEY = '@assistant/themeMode';

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const systemScheme = useColorScheme();
  const [ready, setReady] = useState(false);
  const [language, setLanguageState] = useState<Language>('az');
  const [themeMode, setThemeModeState] = useState<ThemeMode>('system');

  useEffect(() => {
    (async () => {
      const [lang, mode] = await Promise.all([
        storage.load<Language>(LANGUAGE_KEY, 'az'),
        storage.load<ThemeMode>(THEME_MODE_KEY, 'system'),
      ]);
      setLanguageState(lang);
      setThemeModeState(mode);
      setReady(true);
    })();
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    storage.save(LANGUAGE_KEY, lang);
  };

  const setThemeMode = (mode: ThemeMode) => {
    setThemeModeState(mode);
    storage.save(THEME_MODE_KEY, mode);
  };

  const isDark = themeMode === 'system' ? systemScheme === 'dark' : themeMode === 'dark';
  const colors = isDark ? darkColors : lightColors;
  const t = translations[language];

  const value = useMemo<SettingsContextValue>(
    () => ({ ready, language, setLanguage, themeMode, setThemeMode, isDark, colors, t }),
    [ready, language, themeMode, isDark, colors, t]
  );

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
}

export function useSettings(): SettingsContextValue {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error('useSettings must be used within SettingsProvider');
  return ctx;
}
