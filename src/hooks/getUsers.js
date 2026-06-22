import { useState } from 'react'
import { withAuthCheck } from '@/utils/authWrapper'
import { getUserData } from '@/app/server/actions/user'

export function useUsers() {
    const [users, setUsers] = useState([])
    const [pagination, setPagination] = useState({})
    const [loading, setLoading] = useState(false)
    const [fetched, setFetched] = useState(false)

    async function fetchUsers(search = '', page = 1, limit = 10, sortBy = '', sortOrder = '') {
        setLoading(true)
        try {
            const params = { search, page, limit, sortBy, sortOrder }
            const res = await withAuthCheck(() => getUserData(params))
            if (!res) return
            const { users: rawUsers = [], pagination: pg = {} } = res.data || {}
            const mappedUsers = rawUsers.map(u => ({
                id: u.id,
                fullName: u.name || '',
                email: u.email || '',
                role: u.role?.name || 'N/A',
                avatar: u.profile_image ? `${u.profile_image}?v=${new Date().getTime()}` : '',
                status: u.status?.toLowerCase() || 'active'
            }))
            setUsers(mappedUsers)
            setPagination(pg)
            setFetched(true)
        } finally {
            setLoading(false)
        }
    }

    return { users, pagination, loading, fetched, fetchUsers }
}
