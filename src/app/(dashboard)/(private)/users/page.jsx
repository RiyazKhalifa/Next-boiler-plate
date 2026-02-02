import UserList from '@views/apps/user/list'
import { createUser, viewUserData, updateUser } from '@/app/server/actions/user'
import { getRoleData } from '@/app/server/actions/role'
import Can from '@/libs/can'
import { translateMetadata } from '@/utils/metadata';

export const generateMetadata = () => translateMetadata('users');

const UserListApp = async () => {
    return (
        <Can permission='user.list' showUnauthorized={true}>
            <UserList
                addUser={createUser}
                viewGetUserData={viewUserData}
                showEditRecords={updateUser}
                userRoles={getRoleData}
            />
        </Can>
    )
}

export default UserListApp
