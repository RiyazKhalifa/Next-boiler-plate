import SiteSettingsForm from '@views/apps/site-settings'
import Can from '@/libs/can'
import { translateMetadata } from '@/utils/metadata';

export const generateMetadata = () => translateMetadata('site_settings');

const SiteSettingsPage = async () => {
    return (
        <Can permission='site_setting.update' showUnauthorized={true}>
            <SiteSettingsForm />
        </Can>
    )
}

export default SiteSettingsPage
