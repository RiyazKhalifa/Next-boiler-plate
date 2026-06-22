import AppSettingsForm from '@views/apps/app-settings'
import Can from '@/libs/can'
import { translateMetadata } from '@/utils/metadata'

export const generateMetadata = () => translateMetadata('app_settings')

const AppSettingsPage = async () => {
    return (
        <Can permission='app_setting.list' showUnauthorized={true}>
            <AppSettingsForm />
        </Can>
    )
}

export default AppSettingsPage
