'use client'

import { useUsers } from '@/hooks/getUsers'
import Grid from '@mui/material/Grid2'
import UserListTable from './UserListTable'
import { useLoader } from '@/contexts/LoaderContext'

const UserList = ({ addUser, viewGetUserData, showEditRecords, userRoles }) => {
    const { users, pagination, loading, fetchUsers } = useUsers()
    const { setLoading } = useLoader()

    const refreshUsers = async () => {
        setLoading(true)
        await fetchUsers('', pagination.page, pagination.limit)
        setLoading(false)
    }

    return (
        <Grid container spacing={6}>
            <Grid size={{ xs: 12 }}>
                <UserListTable
                    tableData={users}
                    pagination={pagination}
                    setLoading={setLoading}
                    fetchUsers={fetchUsers}
                    refreshUsers={refreshUsers}
                    addedUser={addUser}
                    editUserData={viewGetUserData}
                    updateRecords={showEditRecords}
                    userRoles={userRoles}
                />
            </Grid>
        </Grid>
    )
}

export default UserList
