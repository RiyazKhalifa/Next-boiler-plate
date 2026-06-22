'use client'

import { useRoles } from '@/hooks/getRoles'
import Grid from '@mui/material/Grid2'
import RoleListTable from './RoleListTable'
import { useLoader } from '@/contexts/LoaderContext'
import TableSkeleton from '@/components/TableSkeleton'

const RoleList = ({ permissions, addRole, viewGetRoleData, showEditRecords }) => {
	const { roles, pagination, loading, fetched, fetchRoles } = useRoles()
	const { setLoading } = useLoader()

	const refreshRoles = async () => {
		fetchRoles('', pagination.page, pagination.limit)
	}

	if (loading && !fetched) {
		return <TableSkeleton columns={4} rows={10} />
	}

	return (
		<Grid container spacing={6}>
			<Grid size={{ xs: 12 }}>
				<RoleListTable
					tableData={roles}
					pagination={pagination}
					fetchRoles={fetchRoles}
					refreshRoles={refreshRoles}
					permissions={permissions}
					addRole={addRole}
					editRoleData={viewGetRoleData}
					updateRole={showEditRecords}
					setLoading={setLoading}
				/>
			</Grid>
		</Grid>
	)
}

export default RoleList
