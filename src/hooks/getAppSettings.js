'use client'

import { useState, useCallback } from 'react'
import { getAppSettings } from '@/app/server/actions/appSettings'
import { withAuthCheck } from '@/utils/authWrapper'

export function useAppSettings() {
    const [settings, setSettings] = useState({})
    const [loading, setLoading] = useState(false)

    const fetchSettings = useCallback(async () => {
        setLoading(true)
        try {
            const res = await withAuthCheck(() => getAppSettings())
            if (!res) return
            if (res.status) {
                // Assuming the API returns either an object or an array of key-values similar to site-settings
                // If it's an array of { key, value }, we might need transformation.
                // For now, let's just use res.data directly if it's an object, or transform if it looks like site settings.
                // Since I don't know the exact response, I'll assume it might need transformation if it's an array.

                let data = res.data
                if (Array.isArray(data)) {
                    data = data.reduce((acc, item) => {
                        // Adjust these keys based on actual API response if needed
                        const key = item.key || item.setting_key || item.name
                        const value = item.value || item.setting_value
                        if (key) acc[key] = value
                        return acc
                    }, {})
                }
                setSettings(data || {})
            }
        } finally {
            setLoading(false)
        }
    }, [])

    return { settings, loading, fetchSettings }
}
