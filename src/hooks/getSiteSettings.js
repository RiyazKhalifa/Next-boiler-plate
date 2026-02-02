'use client'

import { useState } from 'react'
import { getSiteSettings } from '@/app/server/actions/siteSettings'
import { withAuthCheck } from '@/utils/authWrapper'
import { useLoader } from '@/contexts/LoaderContext'

export function useSiteSettings() {
    const [settings, setSettings] = useState({})
    const { setLoading } = useLoader()

    async function fetchSettings() {
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
    }

    return { settings, setLoading, fetchSettings }
}
