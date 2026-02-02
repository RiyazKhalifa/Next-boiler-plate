// Context Imports
import { NextAuthProvider } from '@/contexts/nextAuthProvider'
import { VerticalNavProvider } from '@menu/contexts/verticalNavContext'
import { SettingsProvider } from '@core/contexts/settingsContext'
import ThemeProvider from '@components/theme'

// Util Imports
import { getMode, getSettingsFromCookie, getSystemMode } from '@core/utils/serverHelpers'

const Providers = async props => {
    // Props
    const { children } = props

    // Vars
    const mode = await getMode()
    const settingsCookie = await getSettingsFromCookie()
    const systemMode = await getSystemMode()

    return (
        <NextAuthProvider basePath={process.env.NEXTAUTH_BASEPATH}>
            <VerticalNavProvider>
                <SettingsProvider settingsCookie={settingsCookie} mode={mode}>
                    <ThemeProvider systemMode={systemMode}>
                        {children}
                    </ThemeProvider>
                </SettingsProvider>
            </VerticalNavProvider>
        </NextAuthProvider>
    )
}

export default Providers
