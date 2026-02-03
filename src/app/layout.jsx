import { cookies } from 'next/headers'

import { ReduxProvider } from "@/store/store"

// MUI Imports
import InitColorSchemeScript from '@mui/material/InitColorSchemeScript'

// Third-party Imports
import 'react-perfect-scrollbar/dist/css/styles.css'

// Util Imports
import { getSystemMode } from '@core/utils/serverHelpers'
import { Toaster } from 'react-hot-toast';

// Style Imports
import '@/app/globals.css'
import '@assets/iconify-icons/generated-icons.css'
import { LanguageProvider } from '@/contexts/LanguageProvider'
import { LoaderProvider } from '@/contexts/LoaderContext'
import GlobalLoader from '@/components/GlobalLoader'
import '@/libs/i18n'

import { translateMetadata } from '@/utils/metadata';

export const generateMetadata = () => translateMetadata('title', 'mainLayout');

const RootLayout = async ({ children }) => {
    const systemMode = getSystemMode() // if async, keep await, but cookies() is sync
    const cookieData = await cookies();
    const lang = cookieData.get('lang')?.value || 'ar';

    return (
        <html id="__next" lang={lang} dir={lang === 'ar' ? 'rtl' : 'ltr'}>
            <body className="flex is-full min-bs-full flex-auto flex-col">
                <ReduxProvider>
                    <InitColorSchemeScript attribute="data" defaultMode={systemMode} />
                    <Toaster position="top-center" reverseOrder />
                    <LanguageProvider initialLang={lang}>
                        <LoaderProvider>
                            <GlobalLoader />
                            {children}
                        </LoaderProvider>
                    </LanguageProvider>
                </ReduxProvider>
            </body>
        </html>
    )
}

export default RootLayout
