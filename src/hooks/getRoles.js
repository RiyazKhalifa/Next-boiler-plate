'use client'

import { useState } from 'react'
import { getRoleData } from '@/app/server/actions/role'
import { withAuthCheck } from '@/utils/authWrapper'
import { useLoader } from '@/contexts/LoaderContext'

export function useRoles() {
    const [roles, setRoles] = useState([])
    const [pagination, setPagination] = useState({})
    const { setLoading } = useLoader()

    async function fetchRoles(search = '', page = 1, limit = 10, sortBy = '', sortOrder = '') {
        setLoading(true)
        try {
            const params = { search, page, limit, sortBy, sortOrder }
            const res = await withAuthCheck(() => getRoleData(params))
            if (!res) return
            const { roles: rawRoles = [], pagination: pg = {} } = res.data || {}
            const mappedRoles = rawRoles.map(u => ({
                id: u.id,
                name: u.name || '',
                name_ar: u.name_ar || '',
                status: u.status || ''
            }))
            setRoles(mappedRoles)
            setPagination(pg)
        } finally {
            setLoading(false)
        }
    }

    return { roles, pagination, setLoading, fetchRoles }
}
