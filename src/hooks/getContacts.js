import { useState } from 'react'
import { withAuthCheck } from '@/utils/authWrapper'
import { getContactData } from '@/app/server/actions/contact'

export function useContacts() {
    const [contacts, setContacts] = useState([])
    const [pagination, setPagination] = useState({})
    const [loading, setLoading] = useState(false)
    const [fetched, setFetched] = useState(false)

    async function fetchContacts(search = '', page = 1, limit = 10, sortBy = '', sortOrder = '') {
        setLoading(true)
        try {
            const params = { search, page, limit, sortBy, sortOrder }
            const res = await withAuthCheck(() => getContactData(params))
            if (!res) return
            const { contacts: rawContacts = [], pagination: pg = {} } = res.data || {}
            // Map the API fields to the fields we expect in the UI
            const mappedContacts = rawContacts.map(u => ({
                id: u.id,
                name: u.name || '',
                email: u.email || '',
                phone: u.phone || '',
                subject: u.subject || '',
                message: u.message || '',
                status: u.status || '',
                created_at: u.created_at || ''
            }))
            setContacts(mappedContacts)
            setPagination(pg)
            setFetched(true)
        } finally {
            setLoading(false)
        }
    }

    return { contacts, pagination, fetchContacts, loading, fetched }
}
