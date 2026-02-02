'use client'

import i18next from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

import en from '@/locales/en/common.json'
import ar from '@/locales/ar/common.json'

if (!i18next.isInitialized) {
    i18next
        .use(LanguageDetector)
        .use(initReactI18next)
        .init({
            resources: {
                en: { translation: en },
                ar: { translation: ar },
            },
            fallbackLng: 'en',
            detection: {
                order: ['cookie', 'localStorage', 'navigator'],
                lookupCookie: 'lang',
                caches: ['cookie'],
            },
            interpolation: { escapeValue: false },
            react: { useSuspense: false },
        })
}

export default i18next
