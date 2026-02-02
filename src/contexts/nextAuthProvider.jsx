'use client'

import { useEffect, useState } from 'react'

import { SessionProvider, useSession, signOut } from 'next-auth/react'
import { useDispatch } from 'react-redux'
import { setUser } from '@/store/userSlice'
import { getUserProfile } from '@/app/server/actions/myProfile'

// MUI Imports
import Snackbar from '@mui/material/Snackbar'
import Alert from '@mui/material/Alert'

function AuthWatcher({ children }) {
    const { data: session } = useSession()
    const [open, setOpen] = useState(false)
    const dispatch = useDispatch()

    useEffect(() => {
        const fetchProfile = async () => {
            if (session?.user) {
                try {
                    const res = await getUserProfile()
                    if (res?.status && res.data) {
                        dispatch(setUser(res.data))
                    }
                } catch (error) {
                    console.error('Failed to sync profile:', error)
                }
            }
        }
        fetchProfile()
    }, [session, dispatch])

    useEffect(() => {
        if (session?.error === 'RefreshAccessTokenError') {
            setOpen(true)

            // After a short delay, sign the user out
            setTimeout(() => {
                signOut({ redirect: true, callbackUrl: '/login' })
            }, 1500)
        }
    }, [session])

    return (
        <>
            {children}
            <Snackbar open={open} autoHideDuration={1500} onClose={() => setOpen(false)}>
                <Alert severity="warning" sx={{ width: '100%' }}>
                    Your session expired. Please login again.
                </Alert>
            </Snackbar>
        </>
    )
}

export const NextAuthProvider = ({ children, ...rest }) => {
    return (
        <SessionProvider {...rest}>
            <AuthWatcher>{children}</AuthWatcher>
        </SessionProvider>
    )
}
