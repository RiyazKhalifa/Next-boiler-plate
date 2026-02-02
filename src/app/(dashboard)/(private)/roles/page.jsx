import RoleList from '@views/apps/role/list'
import { createRole, viewRoleData, updateRole, getPermissions } from '@/app/server/actions/role'
import Can from '@/libs/can'
import { translateMetadata } from '@/utils/metadata';

export const generateMetadata = () => translateMetadata('roles');

const RoleListApp = async () => {
	const [permRes] = await Promise.all([getPermissions()])
	const permissions = permRes.data || []

	return (
		<Can permission='role.list' showUnauthorized={true}>
			<RoleList
				permissions={permissions}
				addRole={createRole}
				viewGetRoleData={viewRoleData}
				showEditRecords={updateRole}
			/>
		</Can>
	)
}

export default RoleListApp
