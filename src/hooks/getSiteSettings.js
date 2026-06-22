'use client'

import { useState, useCallback } from 'react'
import { getSiteSettings } from '@/app/server/actions/siteSettings'
import { withAuthCheck } from '@/utils/authWrapper'

export function useSiteSettings() {
    const [settings, setSettings] = useState({})
    const [loading, setLoading] = useState(false)

    const fetchSettings = useCallback(async () => {
        setLoading(true)
        try {
            const res = await withAuthCheck(() => getSiteSettings())
            if (!res) return
            if (res.status) {
                const transformed = (res.data || []).reduce((acc, item) => {
                    acc[item.site_key] = item.site_value
                    return acc
                }, {})
                setSettings(transformed)
            }
        } finally {
            setLoading(false)
        }
    }, [])

    return { settings, loading, fetchSettings }
}
