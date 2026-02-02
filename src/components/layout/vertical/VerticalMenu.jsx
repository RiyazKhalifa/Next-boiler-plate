// MUI Imports
import { useTheme } from '@mui/material/styles'

// Third-party Imports
import PerfectScrollbar from 'react-perfect-scrollbar'

// Component Imports
import { useTranslation } from 'react-i18next'

import { Menu, SubMenu, MenuItem } from '@menu/vertical-menu'

// Hook Imports
import useVerticalNav from '@menu/hooks/useVerticalNav'

// Styled Component Imports
import StyledVerticalNavExpandIcon from '@menu/styles/vertical/StyledVerticalNavExpandIcon'

// Style Imports
import menuItemStyles from '@core/styles/vertical/menuItemStyles'
import menuSectionStyles from '@core/styles/vertical/menuSectionStyles'
import Can from '@/libs/can'

const RenderExpandIcon = ({ open, transitionDuration }) => (
    <StyledVerticalNavExpandIcon open={open} transitionDuration={transitionDuration}>
        <i className='tabler-chevron-right' />
    </StyledVerticalNavExpandIcon>
)

const VerticalMenu = ({ scrollMenu }) => {
    const { t } = useTranslation()

    // Hooks
    const theme = useTheme()
    const verticalNavOptions = useVerticalNav()

    // Vars
    const { isBreakpointReached, transitionDuration } = verticalNavOptions
    const ScrollWrapper = isBreakpointReached ? 'div' : PerfectScrollbar

    return (
        // eslint-disable-next-line lines-around-comment
        /* Custom scrollbar instead of browser scroll, remove if you want browser scroll only */
        <ScrollWrapper
            {...(isBreakpointReached
                ? {
                    className: 'bs-full overflow-y-auto overflow-x-hidden',
                    onScroll: container => scrollMenu(container, false)
                }
                : {
                    options: { wheelPropagation: false, suppressScrollX: true },
                    onScrollY: container => scrollMenu(container, true)
                })}
        >
            {/* Incase you also want to scroll NavHeader to scroll with Vertical Menu, remove NavHeader from above and paste it below this comment */}
            {/* Vertical Menu */}
            <Menu
                popoutMenuOffset={{ mainAxis: 23 }}
                menuItemStyles={menuItemStyles(verticalNavOptions, theme)}
                renderExpandIcon={({ open }) => <RenderExpandIcon open={open} transitionDuration={transitionDuration} />}
                renderExpandedMenuItemIcon={{ icon: <i className='tabler-circle text-xs' /> }}
                menuSectionStyles={menuSectionStyles(verticalNavOptions, theme)}
            >
                <MenuItem href='/dashboard' icon={<i className='tabler-dashboard' />}>
                    {t('dashboard')}
                </MenuItem>
                <SubMenu label={t('team')} icon={<i className='tabler-user' />}>
                    <Can permission='role.list'>
                        <MenuItem href='/roles' icon={<i className='tabler-lock-access' />}>
                            {t('roles')}
                        </MenuItem>
                    </Can>
                    <Can permission='user.list'>
                        <MenuItem href='/users' icon={<i className='tabler-users' />}>
                            {t('users')}
                        </MenuItem>
                    </Can>
                </SubMenu>
                <Can permission='customer.list'>
                    <MenuItem href='/customers' icon={<i className='tabler-users-group' />}>
                        {t('customers')}
                    </MenuItem>
                </Can>
                <SubMenu label={t('settings')} icon={<i className='tabler-settings' />}>
                    <Can permission='cms.list'>
                        <MenuItem href='/cms' icon={<i className='tabler-file-text' />}>
                            {t('cms_pages')}
                        </MenuItem>
                    </Can>
                    <Can permission='faq.list'>
                        <MenuItem href='/faqs' icon={<i className='tabler-question-mark' />}>
                            {t('faqs')}
                        </MenuItem>
                    </Can>
                    <Can permission='site_setting.list'>
                        <MenuItem href='/site-settings' icon={<i className='tabler-world-cog' />}>
                            {t('site_settings')}
                        </MenuItem>
                    </Can>
                </SubMenu>
            </Menu>
            {/* <Menu
          popoutMenuOffset={{ mainAxis: 23 }}
          menuItemStyles={menuItemStyles(verticalNavOptions, theme)}
          renderExpandIcon={({ open }) => <RenderExpandIcon open={open} transitionDuration={transitionDuration} />}
          renderExpandedMenuItemIcon={{ icon: <i className='tabler-circle text-xs' /> }}
          menuSectionStyles={menuSectionStyles(verticalNavOptions, theme)}
        >
          <GenerateVerticalMenu menuData={menuData(dictionary)} />
        </Menu> */}
        </ScrollWrapper>
    )
}

export default VerticalMenu
