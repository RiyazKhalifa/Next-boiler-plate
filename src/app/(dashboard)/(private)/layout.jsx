// MUI Imports
import Button from '@mui/material/Button'

// Layout Imports
import LayoutWrapper from '@layouts/LayoutWrapper'
import VerticalLayout from '@layouts/VerticalLayout'

// Component Imports
import Providers from '@components/Providers'
import Navigation from '@components/layout/vertical/Navigation'
import Navbar from '@components/layout/vertical/Navbar'
import VerticalFooter from '@components/layout/vertical/Footer'
import ScrollToTop from '@core/components/scroll-to-top'
import AuthGuard from '@/hocs/AuthGuard'

// Util Imports
import { getMode, getSystemMode } from '@core/utils/serverHelpers'

const Layout = async props => {
    const { children } = props

    // Vars
    const mode = await getMode()
    const systemMode = await getSystemMode()

    return (
        <Providers>
            <AuthGuard>
                <LayoutWrapper
                    systemMode={systemMode}
                    verticalLayout={
                        <VerticalLayout navigation={<Navigation mode={mode} />} navbar={<Navbar />} footer={<VerticalFooter />}>
                            {children}
                        </VerticalLayout>
                    }
                />
                <ScrollToTop className='mui-fixed'>
                    <Button variant='contained' className='is-10 bs-10 rounded-full p-0 min-is-0 flex items-center justify-center'>
                        <i className='tabler-arrow-up' />
                    </Button>
                </ScrollToTop>
            </AuthGuard>
        </Providers>
    )
}

export default Layout
