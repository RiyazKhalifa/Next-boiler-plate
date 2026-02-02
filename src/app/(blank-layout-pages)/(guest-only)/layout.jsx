// HOC Imports
import GuestOnlyRoute from '@/hocs/GuestOnlyRoute'

// Component Imports
import Providers from '@components/Providers'
import BlankLayout from '@layouts/BlankLayout'

// Util Imports
import { getSystemMode } from '@core/utils/serverHelpers'

const Layout = async props => {
    const { children } = props
    const systemMode = await getSystemMode()

    return (
        <Providers>
            <GuestOnlyRoute>
                <BlankLayout systemMode={systemMode}>{children}</BlankLayout>
            </GuestOnlyRoute>
        </Providers>

    )
}

export default Layout
