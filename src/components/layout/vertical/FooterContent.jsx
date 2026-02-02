'use client'

// Next Imports
import Link from 'next/link'

// Third-party Imports
import classnames from 'classnames'

// Hook Imports
import useVerticalNav from '@menu/hooks/useVerticalNav'

// Util Imports
import { verticalLayoutClasses } from '@layouts/utils/layoutClasses'

import { useTranslation } from "react-i18next";

const FooterContent = () => {
    const { t } = useTranslation()
    // Hooks
    const { isBreakpointReached } = useVerticalNav()

    return (
        <div
            className={classnames(verticalLayoutClasses.footerContent, 'flex items-center justify-between flex-wrap gap-4')}
        >
            <p>
                <span className='text-textSecondary'>
                    © {new Date().getFullYear()}, {t('made_with')}{' '}
                </span>
                {/* <span>❤️</span> */}
                <span className='text-textSecondary'> {t('by')} </span>
                <Link href='https://www.excellentwebworld.com/' target='_blank' className='text-primary uppercase'>
                    {t('excellent_web_world')}
                </Link>
            </p>
        </div>
    )
}

export default FooterContent
