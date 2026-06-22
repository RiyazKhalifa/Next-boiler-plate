import AppTranslations from '@views/apps/app-translations'
import Can from '@/libs/can'

export const metadata = {
    title: 'App Translations'
}

const AppTranslationsPage = async () => {
    return (
        <Can permission='app_translation.list' showUnauthorized={true}>
            <AppTranslations />
        </Can>
    )
}

export default AppTranslationsPage
