'use client'

import { useRoles } from '@/hooks/getRoles'
import Grid from '@mui/material/Grid2'
import RoleListTable from './RoleListTable'
import { useLoader } from '@/contexts/LoaderContext'

const RoleList = ({ permissions, addRole, viewGetRoleData, showEditRecords }) => {
	const { roles, pagination, loading, fetchRoles } = useRoles()
	const { setLoading } = useLoader()

	const refreshRoles = async () => {
		setLoading(true)
		await fetchRoles('', pagination.page, pagination.limit)
		setLoading(false)
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
