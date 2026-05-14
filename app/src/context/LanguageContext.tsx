import React, { createContext, useState, useContext } from 'react';
import { I18n } from 'i18n-js';

import en from '../locales/en.json';
import hi from '../locales/hi.json';
import pa from '../locales/pa.json';

const translations = {
    en,
    hi,
    pa
};

const i18n = new I18n(translations);
i18n.defaultLocale = 'en';
i18n.locale = 'en';

/**
 * Global Internationalization (i18n) Context
 * 
 * Manages the current linguistic state of the application across three supported idioms:
 * English ('en'), Hindi ('hi'), and Punjabi ('pa'). 
 * Exposes a translation function `t` to asynchronously inject strings into the UI layer.
 */
interface LanguageContextType {
    lang: string;
    setLang: (lang: string) => void;
    /** Translates a given key based on the injected `locales` dictionary */
    t: (key: string) => string;
}

export const LanguageContext = createContext<LanguageContextType>({
    lang: 'en',
    setLang: () => { },
    t: (key: string) => key,
});

/**
 * Wrapper component to inject the internationalization state into the React Tree.
 * Wrap the root `<AppNavigator>` with this provider to enable translation 
 * hooks from any arbitrarily nested screen.
 */
export function LanguageProvider({ children }: { children: React.ReactNode }) {
    const [lang, setLang] = useState('en');

    const setLanguage = (newLang: string) => {
        i18n.locale = newLang; // Sync the i18n core library with the React State
        setLang(newLang);
    };

    /**
     * Memoized translation accessor.
     * By wrapping `i18n.t` in a useCallback dependent on the `lang` state,
     * React will forcefully re-render all consumer components whenever the language toggles.
     */
    const t = React.useCallback(
        (key: string) => {
            return i18n.t(key, { locale: lang });
        },
        [lang]
    );

    return (
        <LanguageContext.Provider value={{ lang, setLang: setLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    );
}

/**
 * Custom React Hook to consume the LanguageContext.
 * Guaranteed to return the current `lang` string and the `t()` string interpolator mapping.
 */
export function useLang() {
    return useContext(LanguageContext);
}
