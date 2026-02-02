'use client'

import { createContext, useContext, useEffect, useState } from 'react'

import { useTranslation } from 'react-i18next'
import Cookies from 'js-cookie'
import '@/libs/i18n'

const LanguageContext = createContext()

export const LanguageProvider = ({ children, initialLang = 'en' }) => {
    const { i18n } = useTranslation()
    const [language, setLanguage] = useState(initialLang)
    const [mounted, setMounted] = useState(false)

    // Only render children after client mount to prevent hydration mismatch
    useEffect(() => {
        if (i18n.language !== language) {
            i18n.changeLanguage(language)
        }

        setMounted(true)
    }, [language, i18n])

    const changeLanguage = (lng) => {
        i18n.changeLanguage(lng)
        Cookies.set('lang', lng, { path: '/' })
        setLanguage(lng)
    }

    if (!mounted) return null // prevents server/client mismatch

    return (
        <LanguageContext.Provider value={{ language, changeLanguage }}>
            {children}
        </LanguageContext.Provider>
    )
}

export const useLanguage = () => useContext(LanguageContext)
