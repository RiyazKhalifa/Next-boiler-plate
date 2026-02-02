import dynamic from 'next/dynamic'

const AccountTab = dynamic(() => import('@views/apps/user-profile/account'))
const SecurityTab = dynamic(() => import('@views/apps/user-profile/security'))

import AccountSettings from '@views/apps/user-profile'
import Can from "@/libs/can"

const AccountSettingsPage = async () => {

    return (
        <Can permission="profile.update">
            <AccountSettings tabContentList={{
                account: <AccountTab />,
                security: <SecurityTab />
            }} />
        </Can>
    )
}

export default AccountSettingsPage
