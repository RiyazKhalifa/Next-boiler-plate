'use client'

import { useState } from 'react'
import { getCmsData } from '@/app/server/actions/cms'
import { withAuthCheck } from '@/utils/authWrapper'
import { useLoader } from '@/contexts/LoaderContext'

export function useCms() {
    const [cms, setCms] = useState([])
    const [pagination, setPagination] = useState({})
    const { setLoading } = useLoader()

    async function fetchCms(search = '', page = 1, limit = 10, sortBy = '', sortOrder = '') {
        setLoading(true)
        try {
            const params = { search, page, limit, sortBy, sortOrder }
            const res = await withAuthCheck(() => getCmsData(params))
            if (!res) return
            const { cms: rawCms = [], pagination: pg = {} } = res.data || {}
            const mappedCms = rawCms.map(u => ({
                id: u.id,
                title: u.title || '',
                title_ar: u.title_ar || '',
                content: u.content || '',
                content_ar: u.content_ar || '',
                created_at: u.created_at || ''
            }))
            setCms(mappedCms)
            setPagination(pg)
        } finally {
            setLoading(false)
        }
    }

    return { cms, pagination, fetchCms, setLoading }
}
