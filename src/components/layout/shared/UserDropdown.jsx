'use client'

import { useRef, useState } from 'react'

import { useSelector } from "react-redux"

import { useRouter } from 'next/navigation'

import { signOut, useSession } from 'next-auth/react'

// MUI Imports
import { styled } from '@mui/material/styles'
import Badge from '@mui/material/Badge'
import Avatar from '@mui/material/Avatar'
import Popper from '@mui/material/Popper'
import Fade from '@mui/material/Fade'
import Paper from '@mui/material/Paper'
import ClickAwayListener from '@mui/material/ClickAwayListener'
import MenuList from '@mui/material/MenuList'
import Typography from '@mui/material/Typography'
import Divider from '@mui/material/Divider'
import MenuItem from '@mui/material/MenuItem'
import Button from '@mui/material/Button'

// Hooks
import { useTranslation } from 'react-i18next'

import { useSettings } from '@core/hooks/useSettings'

// Logout server action
import { logout } from '@/app/server/actions/auth'
import Can from "@/libs/can"
import { defaultLogo, defaultAvatar } from '@/configs/imageConfig'
import NextImage from '@/components/NextImage'

// Styled component for badge content
const BadgeContentSpan = styled('span')({
	width: 8,
	height: 8,
	borderRadius: '50%',
	cursor: 'pointer',
	backgroundColor: 'var(--mui-palette-success-main)',
	boxShadow: '0 0 0 2px var(--mui-palette-background-paper)'
})

const getImageUrl = (image) => {
	if (!image) return defaultAvatar;
	if (typeof image === "string") return image;
	if (typeof image === "object" && image.url) return image.url;
	if (Array.isArray(image) && image.length > 0) {
		return typeof image[0] === "string" ? image[0] : image[0].url || defaultAvatar;
	}
	return defaultAvatar;
};

const UserDropdown = () => {
	const { t } = useTranslation()

	const [open, setOpen] = useState(false)
	const [loader, setLoader] = useState(false)
	const anchorRef = useRef(null)
	const router = useRouter()
	const { settings } = useSettings()

	const handleDropdownOpen = () => setOpen(prev => !prev)

	const handleDropdownClose = (event, url) => {
		if (url) router.push(url)
		if (anchorRef.current && anchorRef.current.contains(event?.target)) return
		setOpen(false)
	}

	const handleUserLogout = async () => {
		try {
			setLoader(true)
			await logout()
			await signOut({ redirect: true, callbackUrl: '/login' })
			setLoader(false)
		} catch (err) {
			console.error('Logout API error:', err)
		} finally {
			setOpen(false)
		}
	}

	const { data: session } = useSession()
	const userFromStore = useSelector((state) => state.user)
	const user = userFromStore || session?.user
	const userImage = getImageUrl(user?.profile_image)

	return (
		<>
			<Badge
				ref={anchorRef}
				overlap='circular'
				badgeContent={<BadgeContentSpan onClick={handleDropdownOpen} />}
				anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
				className='mis-2'
			>
				<NextImage
					src={userImage}
					alt={user?.name || ''}
					width={38}
					height={38}
					className='cursor-pointer rounded-full'
					onClick={handleDropdownOpen}
				/>
			</Badge>
			<Popper
				open={open}
				transition
				disablePortal
				placement='bottom-end'
				anchorEl={anchorRef.current}
				className='min-is-[240px] !mbs-3 z-[1]'
			>
				{({ TransitionProps, placement }) => (
					<Fade
						{...TransitionProps}
						style={{
							transformOrigin: placement === 'bottom-end' ? 'right top' : 'left top'
						}}
					>
						<Paper className={settings.skin === 'bordered' ? 'border shadow-none' : 'shadow-lg'}>
							<ClickAwayListener onClickAway={e => handleDropdownClose(e)}>
								<MenuList>
									<div className='flex items-center plb-2 pli-6 gap-2' tabIndex={-1}>
										<Avatar alt={user?.name || ''} src={userImage} />
										<div className='flex items-start flex-col'>
											<Typography className='font-medium' color='text.primary'>
												{user?.name || ''}
											</Typography>
											<Typography variant='caption'>{user?.email || ''}</Typography>
										</div>
									</div>
									<Divider className='mlb-1' />
									<Can permission="profile.view">
										<MenuItem className='mli-2 gap-3' onClick={e => handleDropdownClose(e, '/user-profile')}>
											<i className='tabler-user' />
											<Typography color='text.primary'>{t('my_profile')}</Typography>
										</MenuItem>
									</Can>
									<div className='flex items-center plb-2 pli-3'>
										<Button
											fullWidth
											variant='contained'
											color='error'
											size='small'
											endIcon={<i className='tabler-logout' />}
											onClick={handleUserLogout}
											disabled={loader}
											sx={{ '& .MuiButton-endIcon': { marginInlineStart: 1.5 } }}
										>
											{loader ? t('logging_out') : t('logout')}
										</Button>
									</div>
								</MenuList>
							</ClickAwayListener>
						</Paper>
					</Fade>
				)}
			</Popper>
		</>
	)
}

export default UserDropdown
