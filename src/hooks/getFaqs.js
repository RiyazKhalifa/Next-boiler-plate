'use client'

import { useState } from 'react'
import { getFaqData } from '@/app/server/actions/faq'
import { withAuthCheck } from '@/utils/authWrapper'
import { useLoader } from '@/contexts/LoaderContext'

export function useFaqs() {
    const [faqs, setFaqs] = useState([])
    const [pagination, setPagination] = useState({})
    const { setLoading } = useLoader()

    async function fetchFaqs(search = '', page = 1, limit = 10) {
        setLoading(true)
        try {
            const params = { search, page, limit }
            const res = await withAuthCheck(() => getFaqData(params))
            if (!res) return
            const { faqs: rawFaqs = [], pagination: pg = {} } = res.data || {}
            const mappedFaqs = rawFaqs.map(u => ({
                id: u.id,
                question: u.question || '',
                question_ar: u.question_ar || '',
                status: u.status || ''
            }))
            setFaqs(mappedFaqs)
            setPagination(pg)
        } finally {
            setLoading(false)
        }
    }

    return { faqs, pagination, fetchFaqs, setLoading }
}
