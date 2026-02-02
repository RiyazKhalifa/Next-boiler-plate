'use client'

import { useState } from 'react'
import { getCustomerData } from '@/app/server/actions/customer'
import { withAuthCheck } from '@/utils/authWrapper'
import { useLoader } from '@/contexts/LoaderContext'

export function useCustomers() {
    const [customers, setCustomers] = useState([])
    const [pagination, setPagination] = useState({})
    const { setLoading } = useLoader()

    async function fetchCustomers(search = '', page = 1, limit = 10, sortBy = '', sortOrder = '') {
        setLoading(true)
        try {
            const params = { search, page, limit, sortBy, sortOrder }
            const res = await withAuthCheck(() => getCustomerData(params))
            if (!res) return
            const { customers: rawCustomers = [], pagination: pg = {} } = res.data || {}
            const mappedCustomers = rawCustomers.map(u => ({
                id: u.id,
                name: u.name || '',
                email: u.email || '',
                phone: u.phone || '',
                profile_image: u.profile_image || '',
                status: u.status?.toLowerCase() || 'active',
                order_count: u.order_count || 0,
                total_spent: u.total_spent || 0
            }))
            setCustomers(mappedCustomers)
            setPagination(pg)
        } finally {
            setLoading(false)
        }
    }

    return { customers, pagination, setLoading, fetchCustomers }
}
