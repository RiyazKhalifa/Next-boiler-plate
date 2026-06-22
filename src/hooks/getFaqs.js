import { useState } from 'react'
import { withAuthCheck } from '@/utils/authWrapper'
import { getFaqData } from '@/app/server/actions/faq'

export function useFaqs() {
    const [faqs, setFaqs] = useState([])
    const [pagination, setPagination] = useState({})
    const [loading, setLoading] = useState(false)
    const [fetched, setFetched] = useState(false)

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
            setFetched(true)
        } finally {
            setLoading(false)
        }
    }

    return { faqs, pagination, fetchFaqs, loading, fetched }
}
