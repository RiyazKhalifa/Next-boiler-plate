// React Imports
import { isValidElement } from 'react'

// Util Imports
import { menuClasses } from './menuClasses'

// Styled Component Imports
import StyledMenuIcon from '../styles/StyledMenuIcon'

export const confirmUrlInChildren = (children, url) => {
    if (!children) {
        return false
    }

    if (Array.isArray(children)) {
        return children.some(child => confirmUrlInChildren(child, url))
    }

    if (isValidElement(children)) {
        const { component, href, exactMatch, activeUrl, children: subChildren } = children.props

        if (component && component.props.href) {
            const hrefVal = component.props.href

            if (exactMatch === true || exactMatch === undefined) {
                if (hrefVal === url) return true
                if (hrefVal !== '/' && url.startsWith(hrefVal + '/')) return true
                return false
            }

            return activeUrl && url.includes(activeUrl)
        }

        if (href) {
            if (exactMatch === true || exactMatch === undefined) {
                if (href === url) return true
                if (href !== '/' && url.startsWith(href + '/')) return true
                return false
            }

            return activeUrl && url.includes(activeUrl)
        }

        if (subChildren) {
            return confirmUrlInChildren(subChildren, url)
        }
    }

    return false
}

/*
 * Render all the icons for Menu Item and SubMenu components for all the levels more than 0
 */
export const renderMenuIcon = params => {
    const { icon, level, active, disabled, styles, renderExpandedMenuItemIcon, isBreakpointReached } = params

    if (icon && (level === 0 || (!isBreakpointReached && level && level > 0))) {
        return (
            <StyledMenuIcon className={menuClasses.icon} rootStyles={styles}>
                {icon}
            </StyledMenuIcon>
        )
    }

    if (
        level &&
        level !== 0 &&
        renderExpandedMenuItemIcon &&
        renderExpandedMenuItemIcon.icon !== null &&
        (!renderExpandedMenuItemIcon.level || renderExpandedMenuItemIcon.level >= level)
    ) {
        const iconToRender =
            typeof renderExpandedMenuItemIcon.icon === 'function'
                ? renderExpandedMenuItemIcon.icon({ level, active, disabled })
                : renderExpandedMenuItemIcon.icon

        if (iconToRender) {
            return (
                <StyledMenuIcon className={menuClasses.icon} rootStyles={styles}>
                    {iconToRender}
                </StyledMenuIcon>
            )
        }
    }

    return null
}
