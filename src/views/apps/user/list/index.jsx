'use client'

import { useUsers } from '@/hooks/getUsers'
import Grid from '@mui/material/Grid2'
import UserListTable from './UserListTable'
import { useLoader } from '@/contexts/LoaderContext'
import TableSkeleton from '@/components/TableSkeleton'

const UserList = ({ addUser, viewGetUserData, showEditRecords, userRoles }) => {
    const { users, pagination, loading, fetched, fetchUsers } = useUsers()
    const { setLoading } = useLoader()

    const refreshUsers = async () => {
        // We still use global loader for refreshing/actions if desired, 
        // but fetchUsers handles its own local loading for the initial load/pagination.
        fetchUsers('', pagination.page, pagination.limit)
    }

    if (loading && !fetched) {
        return <TableSkeleton columns={5} rows={10} />
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
