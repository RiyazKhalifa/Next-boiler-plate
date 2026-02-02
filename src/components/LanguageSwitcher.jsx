'use client'

import { useRef, useState } from 'react'

import IconButton from '@mui/material/IconButton'
import Popper from '@mui/material/Popper'
import Fade from '@mui/material/Fade'
import Paper from '@mui/material/Paper'
import ClickAwayListener from '@mui/material/ClickAwayListener'
import MenuList from '@mui/material/MenuList'
import MenuItem from '@mui/material/MenuItem'

import { useTranslation } from 'react-i18next'
import Cookies from 'js-cookie'

const languages = [
    { code: 'en', labelKey: 'english' },
    { code: 'ar', labelKey: 'arabic' },
]

export default function LanguageDropdown() {
    const { i18n, t } = useTranslation()
    const [open, setOpen] = useState(false)
    const anchorRef = useRef(null)

    const handleToggle = () => setOpen(prev => !prev)
    const handleClose = () => setOpen(false)

    const handleLanguageChange = (lng) => {
        i18n.changeLanguage(lng)
        window.location.reload()
        Cookies.set('lang', lng, { path: '/' })
        handleClose()
    }

    return (
        <>
            <IconButton ref={anchorRef} onClick={handleToggle}>
                <i className="tabler-language" />
            </IconButton>
            <Popper
                open={open}
                transition
                disablePortal
                anchorEl={anchorRef.current}
                placement="bottom-start"
            >
                {({ TransitionProps, placement }) => (
                    <Fade
                        {...TransitionProps}
                        style={{
                            transformOrigin:
                                placement === 'bottom-start' ? 'left top' : 'right top',
                        }}
                    >
                        <Paper>
                            <ClickAwayListener onClickAway={handleClose}>
                                <MenuList>
                                    {languages.map((lang) => (
                                        <MenuItem
                                            key={lang.code}
                                            selected={i18n.language === lang.code}
                                            onClick={() => handleLanguageChange(lang.code)}
                                        >
                                            {t(lang.labelKey)}
                                        </MenuItem>
                                    ))}
                                </MenuList>
                            </ClickAwayListener>
                        </Paper>
                    </Fade>
                )}
            </Popper>
        </>
    )
}
